from flask import Flask, send_file, request, abort
from flask_cors import CORS
from flask_api import status
import os
from utils import get_authorization
import json
import requests
import secrets
def dev():
    return True

from db_connector import query, DBError
import db_connector as db
import update_models
import time
CLIENT_SECRET = os.environ['CLIENT_SECRET']
CLIENT_ID = os.environ['CLIENT_ID']
VENDOR_ID = os.environ['VENDOR_ID']

app = Flask(__name__, static_folder='build')
CORS(app)

@app.route('/api/login', methods=['POST'])
def login():
    code = request.json.get('code')
    if code:
        payload = {
            'grant_type': 'authorization_code',
            'code': code,
            'client_id': CLIENT_ID,
            'client_secret': CLIENT_SECRET
        }
        r = requests.post('https://api.amazon.com/auth/o2/token', data=payload)
        if r.status_code == 200:
            response = r.json()
            user_info = requests.get(
                'https://api.amazon.com/user/profile?access_token=%s' % response['access_token'])
            if user_info.status_code == 200:
                user_data = user_info.json()
                token = secrets.token_urlsafe(32)
                try:
                    query(db.login, user_data['user_id'], user_data['name'], user_data['email'], token)
                    return app.response_class(json.dumps({'token': token}), 200, mimetype='application/json')
                except DBError as e:
                    return app.response_class(e.response, e.status, mimetype='application/json')
            else:
                return app.response_class(status=status.HTTP_503_SERVICE_UNAVAILABLE,
                                          response=json.dumps(
                                              {'error': ' Unable to get user information from Amazon'}),
                                          mimetype='application/json')
    return app.response_class(status=400, response=json.dumps({'error': 'No code was provided for authentication'}), mimetype='application/json')


@app.route('/api/pending', methods=['GET'])
def pending():
    auth = get_authorization(request)
    try:
        pending = query(db.get_pending, auth)
        return app.response_class(json.dumps(pending), mimetype='application/json')
    except DBError as e:
        return app.response_class(e.response, e.status, mimetype='application/json')

@app.route('/api/preview/<storyid>', methods=['GET'])
def get_story(storyid):
    auth = get_authorization(request)
    try:
        result = query(db.get_story, auth, storyid)
        return app.response_class(json.dumps(result), mimetype='application/json')
    except DBError as e:
        return app.response_class(e.response, e.status, mimetype='application/json')

@app.route('/api/approve/<storyid>')
def approve(storyid):
    auth = get_authorization(request)
    try:
        query(db.approve_story, auth, storyid)
        return app.response_class(status=200)
    except DBError as e:
        return app.response_class(e.response, e.status, mimetype='application/json')


# @app.route('/update', methods=['POST'])
# def update():
#     authorization = request.headers.get('Authorization')
#     if authorization and authorization == os.environ['AUTH_TOKEN']:
#         utils.compile_authors()
#         utils.compile_titles()
#         return app.response_class(status=201)
#     return app.response_class(status=403)

# Catch all /api requests and 404
@app.route('/api/<path:path>')
def error_api(path):
    return app.response_class(status=status.HTTP_404_NOT_FOUND)


@app.route('/', defaults={'path': ''})
@app.route('/<path:path>')
def catch_all(path):
    return send_file(app.static_folder + '/index.html')

if __name__ == '__main__':
    app.run(host='127.0.0.1', port='5050')
