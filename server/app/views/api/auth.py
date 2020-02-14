from app import app, db
from app.views.api.common import json_response, authenticated
from json import dumps
from flask import request
from app.models.cached import Token
from app.models.models import Author
from datetime import datetime, timedelta
import requests
import secrets


@app.route('/api/login/amazon', methods=['POST'])
@json_response
def login():
    code = request.json.get('code')
    if code is None:
        return {'error': 'No code provided to log in'}, 400
    payload = {
        'grant_type': 'authorization_code',
        'code': code,
        'client_id': app.config['LWA_CLIENT_ID'],
        'client_secret': app.config['LWA_CLIENT_SECRET']
    }
    r = requests.post('https://api.amazon.com/auth/o2/token', data=payload)
    if r.status_code != 200:
        return {'error': 'Failed to connect to Login With Amazon server'}, 500
    user_info = requests.get(
        'https://api.amazon.com/user/profile?access_token=%s' % r.json()['access_token'])
    if user_info.status_code != 200:
        return {'error': 'Failed to get user profile information from Login With Amazon server'}, 500
    user_data = user_info.json()
    author = Author.query.filter_by(amazonID=user_data['user_id']).first()
    if author is None:
        author = Author(
            amazonID=user_data['user_id'], name=user_data['name'], email=user_data['email'])
        db.session.add(author)
    token = Token(token=secrets.token_urlsafe(32), author=author,
                  expiration=datetime.now() + timedelta(days=1))
    db.session.add(token)
    db.session.commit()
    r = app.response_class(dumps({'error': None}), 200)
    r.set_cookie('token', token.token, expires=24 * 60 * 60, httponly=True)
    return r


@app.route('/api/logout')
@json_response
@authenticated
def logout(user):
    Token.query.filter_by(author=user).delete()
    db.session.commit()
