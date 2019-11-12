# Copyright Robert Geil 2019
from flask import Flask, request, send_file, send_from_directory
import requests

import db_connection as db
import utils
import json
import os
application = Flask(__name__, static_folder='build')

@application.route('/')
def hello_world():
    return '''<!DOCTYPE html>
    <html>
        <head></head>
        <body>
            <h1>Website in progress</h1>
            <p>This website is being actively constructed. To see the main feature before its
            integration:</p>
            <a href = '/builder'>Check out the story builder module</a><br>
            <a href = '/tos'>Terms of Service</a> <br>
            <a href = '/privacy'>Privacy Policy</a>
        </body>
    </html>'''

# Send static files for the privacy and terms of service agreements
@application.route('/privacy')
def privacy():
    return send_file('static/privacy.pdf', mimetype='application/pdf')
@application.route('/tos')
def terms_of_service():
    return send_file('static/tos.pdf', mimetype='application/pdf')

# TODO:
@application.route('/api/save_temp', methods=['POST'])
def save_temp():
    values = request.json
    response = application.response_class(
        status = 201
    )
    return response
# TODO:
@application.route('/api/delete_temp', methods=['POST'])
def delete_temp():
    return 'Goodbye temp'

@application.route('/savejson', methods=['POST'])
def save_json():
    data = utils.validate_json(request.json)
    if data is None:
        response = application.response_class(
            status = 400,
            response = json.dumps({'success': False, 'error_message': 'Story was poorly formatted'}),
            mimetype='application/json'
        )
    else:
        response = application.response_class(
            status = 200,
            response = json.dumps({'success': True}),
            mimetype = 'application/json'
        )
    return response
@application.route('/login')
def login():
    return send_file('static/login.html')

@application.route('/auth')
def authorize():
    code = request.args.get('code')
    if code is None:
        response = application.response_class(status=404)
    else:
        response = application.response_class(status = 200)
    return response
@application.route('/builder')
def hello():
    return send_file(application.static_folder + '/index.html')

if __name__ == '__main__':
    application.run()