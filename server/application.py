# Copyright Robert Geil 2019
from flask import Flask, request, send_file, send_from_directory
import requests
import secrets

import db_connection as db
import utils
import json
import os
application = Flask(__name__, static_folder='build')
CLIENT_SECRET = os.environ['LWA_SECRET']
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

'''
Accept {
    code: string
}
Return {

}
'''
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
            rand_int = secrets.token_hex(32)
            return application.response_class(status=200, response=json.dumps({'token': rand_int, 'success':True}), mimetype='application/json')
    return application.response_class(status=400, response=json.dumps({'success': False, 'error': 'No code was provided for authentication'}, mimetype='application/json'))

@application.route('/builder')
def hello():
    return send_file(application.static_folder + '/index.html')

if __name__ == '__main__':
    application.run()