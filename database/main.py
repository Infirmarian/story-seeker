import secrets
import requests
import json
from flask_api import status
from flask_cors import CORS
from flask import Flask, send_file, request, abort
from db_connector import query, DBError
import time
import update_models
import os

import db_connector as db


CLIENT_SECRET = os.environ['CLIENT_SECRET']
CLIENT_ID = os.environ['CLIENT_ID']
VENDOR_ID = os.environ['VENDOR_ID']
dev = os.environ['SERVER_STATE'] == 'DEVELOPMENT'

app = Flask(__name__, static_folder='build')

if dev:
    CORS(app)


def get_authorization(request):
    return request.headers.get('Authorization')


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
                    access_level = query(
                        db.login, user_data['user_id'], user_data['name'], user_data['email'], token)
                    return app.response_class(json.dumps({'token': token, 'access': access_level}), 200, mimetype='application/json')
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


@app.route('/api/stories', methods=['GET'])
def all_stories():
    auth = get_authorization(request)
    try:
        stories = query(db.get_all, auth)
        return app.response_class(json.dumps(stories), mimetype='application/json')
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


@app.route('/api/reject/<storyid>')
def reject(storyid):
    auth = get_authorization(request)
    try:
        query(db.reject_story, auth, storyid)
        return app.response_class(status=200)
    except DBError as e:
        return app.response_class(e.response, e.status, mimetype='application/json')


@app.route('/api/revoke/<storyid>')
def revoke(storyid):
    auth = get_authorization(request)
    try:
        query(db.revoke_story, auth, storyid)
        return app.response_class(status=200)
    except DBError as e:
        return app.response_class(e.response, e.status, mimetype='application/json')

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
