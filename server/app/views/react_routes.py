from .. import app
from flask import send_file


@app.route('/', defaults={'path': ''})
@app.route('/<path:path>')
def catch_all(path):
    return send_file('build/index.html')
