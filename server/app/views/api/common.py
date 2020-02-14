from functools import wraps
from json import dumps
from app import app, db
from app.models.cached import Token
from flask import request, Response
from datetime import datetime


def json_response(func):
    @wraps(func)
    def decorated_function(*args, **kwargs):
        resp = func(*args, **kwargs)
        if resp is None:
            return app.response_class(dumps({'error': None}), status=200, mimetype='application/json')
        elif isinstance(resp, tuple):
            return app.response_class(dumps(resp[0]), status=resp[1], mimetype='application/json')
        elif isinstance(resp, Response):
            resp.mimetype = 'application/json'
            return resp
        else:
            return app.response_class(dumps(resp), status=200, mimetype='application/json')
        return resp
    return decorated_function


def authenticated(func):
    @wraps(func)
    def decorated_function(*args, **kwargs):
        f = request.cookies.get('token')
        if f is None:
            return app.response_class(dumps({'error': 'No authorization provided'}), status=403, mimetype='application/json')
        token = Token.query.get(f)
        if token is None or token.expiration < datetime.now():
            return app.response_class(dumps({'error': 'Expired or invalid login token provided'}), status=403, mimetype='application/json')
        kwargs['user'] = token.author
        return func(*args, **kwargs)
    return decorated_function
