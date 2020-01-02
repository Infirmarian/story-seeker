# Copyright Robert Geil 2019
from flask_cors import CORS
from flask import Flask, request, send_file, send_from_directory
from flask_api import status
import requests
import secrets

import db_connection as db
from db_connection import DBError, query
import utils
import json
import os
application = Flask(__name__, static_folder='build')
CLIENT_SECRET = os.environ['LWA_SECRET']
# TODO: Delete this before deployment
CORS(application)


def get_token(request) -> str:
   return 'FpUpHvjpNNS34Fk1th8AIdPsh4uM79xrIjYCM_FoYJE'
    # return request.cookies.get('token')


def json_response(response, status=200):
    if isinstance(response, str):
        return application.response_class(response, status, mimetype='application/json')
    else:
        return application.response_class(json.dumps(response), status, mimetype='application/json')

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
                token = secrets.token_urlsafe(32)
                query(db.cache_login, user_data['user_id'],
                      user_data['name'], user_data['email'], token, 86400)
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
    token = get_token(request)
    if token is None:
        return application.response_class(status=status.HTTP_304_NOT_MODIFIED, response=json.dumps({'error': 'No user logged in'}), mimetype='application/json')
    query(db.logout_user, token)
    resp = application.response_class()
    resp.set_cookie('token', '', expires=0)
    return resp

# Get the logged in user, based on their token
@application.route('/api/current_user', methods=['GET'])
def get_loggedin_user():
    token = get_token(request)
    if token is None:
        return application.response_class(response=json.dumps({'user': None}), mimetype='application/json')
    try:
        user = query(db.get_name_from_token, token)
        return application.response_class(response=json.dumps({'user': user}), mimetype='application/json')
    except DBError as e:
        return application.response_class(status=e.status, response=e.response, mimetype='application/json')


@application.route('/api/current_user/details', methods=['GET'])
def author_details():
    token = get_token(request)
    if token is None:
        return json_response({'error': 'No authentication provided'}, status.HTTP_403_FORBIDDEN)
    try:
        user = query(db.get_user_details, token)
        return json_response(user)
    except DBError as e:
        return json_response(e.response, e.status)


@application.route('/api/report/<storyid>', methods=['GET'])
def get_statistics(storyid):
    token = get_token(request)
    if token is None:
        return json_response({'error': 'No authorization provided'}, status.HTTP_403_FORBIDDEN)
    try:
        response = db.story_statistics(token, storyid)
        return json_response(response)
    except DBError as e:
        return json_response(e.response, e.status)


@application.route('/api/list', methods=['GET'])
def get_all_stories():
    token = get_token(request)
    if token is None:
        return application.response_class(status=status.HTTP_403_FORBIDDEN, response=json.dumps({'error': 'No authhorization code was provided'}), mimetype='application/json')
    all_stories = query(db.get_all_stories, token)
    if all_stories is None:
        return application.response_class(status=status.HTTP_403_FORBIDDEN, response=json.dumps({'error': 'Token was either invalid or expired'}), mimetype='application/json')
    return application.response_class(status=status.HTTP_200_OK, response=json.dumps(all_stories), mimetype='application/json')


@application.route('/api/overview/<storyid>', methods=['GET'])
def get_individual_story(storyid):
    token = get_token(request)
    if token is None:
        return application.response_class(status=status.HTTP_403_FORBIDDEN, response=json.dumps({'error': 'No authhorization code was provided'}), mimetype='application/json')
    if storyid is None:
        return application.response_class(status=status.HTTP_403_FORBIDDEN, response=json.dumps({'error': 'No story id was given to find'}), mimetype='application/json')
    try:
        story_overview = query(db.get_story_overview, token, storyid)
        return application.response_class(response=json.dumps(story_overview), mimetype='application/json')
    except DBError as e:
        return application.response_class(status=e.status, response=e.response, mimetype='application/json')


@application.route('/api/overview/<storyid>', methods=['PUT'])
def save_individual_story(storyid):
    token = get_token(request)
    if token is None:
        return application.response_class(status=status.HTTP_403_FORBIDDEN)
    try:
        query(db.update_story, token, storyid, request.json)
        return application.response_class()
    except DBError as e:
        return application.response_class(status=e.status, response=e.response, mimetype='application/json')


@application.route('/api/overview/<storyid>', methods=['DELETE'])
def delete_story(storyid):
    token = get_token(request)
    if token is None:
        return application.response_class(status=status.HTTP_403_FORBIDDEN, response=json.dumps({'error': 'No authorization token was provided'}), mimetype='application/json')
    try:
        query(db.delete_story, token, storyid)
        return application.response_class()  # 200 OK
    except DBError as e:
        return application.response_class(status=e.status, response=e.response, mimetype='application/json')


@application.route('/api/overview', methods=['POST'])
def create_story():
    token = get_token(request)
    if token is None:
        return application.response_class(status=status.HTTP_403_FORBIDDEN)
    values = request.json
    a = utils.validate_title(values['title'])
    if a:
        return application.response_class(status=status.HTTP_400_BAD_REQUEST, response=json.dumps({'error': a}), mimetype='application/json')
    title = utils.clean_title(values['title'])
    try:
        index = query(db.create_story, token, title)
        return application.response_class(status=status.HTTP_201_CREATED, response=json.dumps({'id': index}), mimetype='application/json')
    except DBError as e:
        return application.response_class(status=e.status, response=e.response, mimetype='application/json')


@application.route('/api/overview/<storyid>/title', methods=['GET'])
def check_title_value(storyid):
    title = request.args.get('title')
    if title is None:
        return application.response_class(status=status.HTTP_204_NO_CONTENT)
    if utils.validate_title(title):
        return application.response_class(status=status.HTTP_200_OK)
    else:
        return application.response_class(status=status.HTTP_406_NOT_ACCEPTABLE)


@application.route('/api/builder/<storyid>', methods=['GET'])
def get_story_content(storyid):
    token = get_token(request)
    if token is None:
        return application.response_class(status=status.HTTP_403_FORBIDDEN, response=json.dumps({'error': 'No authhorization code was provided'}), mimetype='application/json')
    if storyid is None:
        return application.response_class(status=status.HTTP_404_NOT_FOUND, response=json.dumps({'error': 'No story id was given to find'}), mimetype='application/json')
    try:
        story_content = query(db.get_story_content, token, storyid)
        # 200 OK
        return application.response_class(response=json.dumps(story_content), mimetype='application/json')
    except DBError as e:
        return application.response_class(status=e.status, response=e.response, mimetype='application/json')


@application.route('/api/builder/<storyid>', methods=['PUT'])
def save_story_content(storyid):
    token = get_token(request)
    if token is None:
        return application.response_class(status=status.HTTP_403_FORBIDDEN, response=json.dumps({'error': 'No authhorization code was provided'}), mimetype='application/json')
    if storyid is None:
        return application.response_class(status=status.HTTP_404_NOT_FOUND, response=json.dumps({'error': 'No story id was given to find'}), mimetype='application/json')
    content = request.json
    try:
        query(db.save_story_content, token, storyid, content)
        return application.response_class()  # 200 OK
    except DBError as e:
        return application.response_class(status=e.status, response=e.response, mimetype='application/json')


@application.route('/api/submit/<storyid>', methods=['POST'])
def submit_story_for_review(storyid):
    token = get_token(request)
    if token is None:
        return application.response_class(status=status.HTTP_403_FORBIDDEN)
    if storyid is None:
        return application.response_class(status=status.HTTP_400_BAD_REQUEST)
    try:
        query(db.compile_and_submit_story, token, storyid)
        return application.response_class()
    except DBError as e:
        return application.response_class(status=e.status, response=e.response, mimetype='application/json')


@application.route('/api/preview/<storyid>', methods=['GET'])
def get_preview(storyid):
    token = get_token(request)
    if token is None:
        return application.response_class(status=status.HTTP_403_FORBIDDEN)
    if storyid is None:
        return application.response_class(status=status.HTTP_400_BAD_REQUEST)
    try:
        story = query(db.get_story_preview, token, storyid)
        return application.response_class(response=json.dumps(story), mimetype='application/json')
    except DBError as e:
        return application.response_class(status=e.status, response=e.response, mimetype='application/json')


# Catch all /api requests and 404
@application.route('/api/<path:path>')
def error_api(path):
    return application.response_class(status=status.HTTP_404_NOT_FOUND)


@application.route('/', defaults={'path': ''})
@application.route('/<path:path>')
def catch_all(path):
    return send_file(application.static_folder + '/index.html')


if __name__ == '__main__':
    application.run()
