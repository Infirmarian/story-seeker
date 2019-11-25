# Copyright Robert Geil 2019
from flask_cors import CORS
from flask import Flask, request, send_file, send_from_directory
from flask_api import status
import requests
import secrets

import db_connection as db
import utils
import json
import os
application = Flask(__name__, static_folder='build')
CLIENT_SECRET = os.environ['LWA_SECRET']
# TODO: Delete this before deployment
CORS(application)

# Send static files for the privacy and terms of service agreements
@application.route('/privacy')
def privacy():
    return send_file('static/privacy.pdf', mimetype='application/pdf')


@application.route('/tos')
def terms_of_service():
    return send_file('static/tos.pdf', mimetype='application/pdf')


@application.route('/robots.txt')
def robots():
    return send_file(application.static_folder+'/robots.txt')


@application.route('/savejson', methods=['POST'])
def save_json():
    data = utils.validate_json(request.json)
    if data is None:
        response = application.response_class(
            status=status.HTTP_401_UNAUTHORIZED,
            response=json.dumps(
                {'success': False, 'error_message': 'Story was poorly formatted'}),
            mimetype='application/json'
        )
    else:
        response = application.response_class(
            status=status.HTTP_200_OK,
            response=json.dumps({'success': True}),
            mimetype='application/json'
        )
    return response


@application.route('/api/login', methods=['POST'])
def login_token():
    code = request.json.get('code')
    if code:
        payload = {
            'grant_type': 'authorization_code',
            'code': code,
            'client_id': 'amzn1.application-oa2-client.8497a1c842f24fd6b54cd7afef9ea32a',
            'client_secret': CLIENT_SECRET
        }
        r = requests.post('https://api.amazon.com/auth/o2/token', data=payload)
        if r.status_code == 200:
            response = r.json()
            user_info = requests.get(
                'https://api.amazon.com/user/profile?access_token=%s' % response['access_token'])
            if user_info.status_code == 200:
                user_data = user_info.json()
                token = secrets.token_hex(32)
                db.cache_login(
                    user_data['user_id'], user_data['name'], user_data['email'], token, 86400)
                resp = application.response_class(status=200)
                resp.set_cookie('token', value=token, max_age=86400,
                                httponly=True)  # , domain='www.storyseeker.fun')
                resp.set_cookie('name', value=user_data['name'], max_age=86400,
                                httponly=True)  # , domain='www.storyseeker.fun')
                return resp
            else:
                return application.response_class(status=status.HTTP_503_SERVICE_UNAVAILABLE,
                                                  response=json.dumps(
                                                      {'error': ' Unable to get user information from Amazon'}),
                                                  mimetype='application/json')
    return application.response_class(status=400, response=json.dumps({'error': 'No code was provided for authentication'}), mimetype='application/json')


@application.route('/api/logout', methods=['GET'])
def logout():
    token = request.cookies.get('token')
    if token is None:
        return application.response_class(status=status.HTTP_304_NOT_MODIFIED, response=json.dumps({'error': 'No user logged in'}), mimetype='application/json')
    db.logout_user(token)
    resp = application.response_class()
    resp.set_cookie('token', '', expires=0)
    return resp

# Get the logged in user, based on their token
@application.route('/api/get_loggedin_user', methods=['GET'])
def get_loggedin_user():
    token = request.cookies.get('token')
    if token is None:
        return application.response_class(response=json.dumps({'user': None}), mimetype='application/json')
    user = db.get_name_from_token(token)
    return application.response_class(response=json.dumps({'user': user}), mimetype='application/json')


@application.route('/api/get_all_stories', methods=['GET'])
def get_all_stories():
    # '3ee288b14e96dbb82aa37c0c2e8dbddb8537adae9a824eb70b259410b30a4d0f'
    token = request.cookies.get('token')
    if token is None:
        return application.response_class(status=status.HTTP_403_FORBIDDEN, response=json.dumps({'error': 'No authhorization code was provided'}), mimetype='application/json')
    all_stories = db.get_all_stories(token)
    if all_stories is None:
        return application.response_class(status=status.HTTP_403_FORBIDDEN, response=json.dumps({'error': 'Token was either invalid or expired'}), mimetype='application/json')
    return application.response_class(status=status.HTTP_200_OK, response=json.dumps(all_stories), mimetype='application/json')


@application.route('/api/get_story_overview/<storyid>', methods=['GET'])
def get_individual_story(storyid):
    token = request.cookies.get('token')
    if token is None:
        return application.response_class(status=status.HTTP_403_FORBIDDEN, response=json.dumps({'error': 'No authhorization code was provided'}), mimetype='application/json')
    if storyid is None:
        return application.response_class(status=status.HTTP_403_FORBIDDEN, response=json.dumps({'error': 'No story id was given to find'}), mimetype='application/json')
    story_overview = db.get_story_overview(token, storyid)
    if story_overview is None:
        return application.response_class(status=status.HTTP_403_FORBIDDEN, response=json.dumps({'error': 'Token was either invalid or expired'}), mimetype='application/json')
    return application.response_class(response=json.dumps(story_overview), mimetype='application/json')


@application.route('/api/get_story_content/<storyid>', methods=['GET'])
def get_story_content(storyid):
    token = request.cookies.get('token')
    if token is None:
        return application.response_class(status=status.HTTP_403_FORBIDDEN, response=json.dumps({'error': 'No authhorization code was provided'}), mimetype='application/json')
    if storyid is None:
        return application.response_class(status=status.HTTP_404_NOT_FOUND, response=json.dumps({'error': 'No story id was given to find'}), mimetype='application/json')
    story_content = db.get_story_content(token, storyid)
    if story_content is None:
        return application.response_class(status=status.HTTP_403_FORBIDDEN, response=json.dumps({'error': 'Token was either invalid or expired'}), mimetype='application/json')
    return application.response_class(response=json.dumps(story_content), mimetype='application/json')


@application.route('/api/save_story_content/<storyid>', methods=['POST'])
def save_story_content(storyid):
    token = request.cookies.get('token')
    if token is None:
        return application.response_class(status=status.HTTP_403_FORBIDDEN, response=json.dumps({'error': 'No authhorization code was provided'}), mimetype='application/json')
    if storyid is None:
        return application.response_class(status=status.HTTP_404_NOT_FOUND, response=json.dumps({'error': 'No story id was given to find'}), mimetype='application/json')
    content = request.json
    if db.save_story_content(token, storyid, content):
        return application.response_class()
    else:
        return application.response_class(status=status.HTTP_403_FORBIDDEN)


@application.route('/api/save_story', methods=['POST'])
def save_story_state():
    token: str = request.cookies.get('token')
    if token is None:
        return application.response_class(status=403, response=json.dumps({'error': 'No authorization code was provided'}), mimetype='application/json')
    data = request.json
    if data is None:
        return application.response_class(status=status.HTTP_406_NOT_ACCEPTABLE, response=json.dumps({'error': 'No JSON provided to save'}), mimetype='application/json')
    story = data.get('story')
    title = data.get('title')
    if story is None or title is None:
        return application.response_class(status=status.HTTP_406_NOT_ACCEPTABLE, response=json.dumps({'error': 'Improper JSON fields provided. Missing title or story content'}), mimetype='application/json')

    return application.response_class()


@application.route('/', defaults={'path': ''})
@application.route('/<path:path>')
def catch_all(path):
    return send_file(application.static_folder + '/index.html')


if __name__ == '__main__':
    application.run()
