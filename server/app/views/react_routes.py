from .. import app
from flask import send_file, abort

# Catch all /api requests and 404
@app.route('/api/<path:path>')
def error_api(path):
    return abort(404)


@app.route('/', defaults={'path': ''})
@app.route('/<path:path>')
def catch_all(path):
    return send_file('build/index.html')
