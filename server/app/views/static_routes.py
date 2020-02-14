from .. import app
from flask import send_file


@app.route('/robots.txt')
def robots():
    return send_file('static/robots.txt')


# Send static files for the privacy and terms of service agreements
@app.route('/privacy')
def privacy():
    return send_file('static/privacy.pdf', mimetype='application/pdf')


@app.route('/tos')
def terms_of_service():
    return send_file('static/tos.pdf', mimetype='application/pdf')
