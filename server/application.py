# Copyright Robert Geil 2019
from flask import Flask, request, send_file, send_from_directory

import db_connection as db
import utils
import json
import os
application = Flask(__name__, static_folder='build')

@application.route('/')
def hello_world():
    return 'Hello, World!'

# Send static files for the privacy and terms of service agreements
@application.route('/privacy')
def privacy():
    return send_file('static/privacy.pdf', mimetype='application/pdf')
@application.route('/tos')
def terms_of_service():
    return send_file('static/tos.pdf', mimetype='application/pdf')

@application.route('/register/author', methods=['POST'])
def register():
    data = request.json
    first = data['first_name']
    last = data['last_name']
    status = db.register_author(first, last)
    return '', status

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

@application.route('/builder')
def hello():
    return send_file(application.static_folder + '/index.html')

if __name__ == '__main__':
    application.run()