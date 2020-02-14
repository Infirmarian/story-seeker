from app import app, db
from app.views.api.common import json_response, authenticated
from json import dumps
from flask import request


@app.route('/api/login')
@authenticated
@json_response
def login(user):
    r = app.response_class(
        dumps({'success': True}), 200)
    r.set_cookie('token', value='hiboy')
    return r


@app.route('/api/logout')
@json_response
def logout():
    return {'error': None}
