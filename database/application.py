from flask import Flask, send_file, request
import os
import utils
application = Flask(__name__, static_folder='catalog')


@application.route('/')
def hello():
    return 'hello world'


@application.route('/titles')
def serve_titles():
    if os.path.exists(application.static_folder + '/titles.json'):
        return send_file(application.static_folder + '/titles.json', mimetype='application/json')
    return application.response_class(status=404, response='<h1>Error 404</h1>')


@application.route('/authors')
def serve_authors():
    if os.path.exists(application.static_folder + '/authors.json'):
        return send_file(application.static_folder + '/authors.json', mimetype='application/json')
    return application.response_class(status=404, response='<h1>Error 404</h1>')


@application.route('/update', methods=['POST'])
def update():
    authorization = request.headers.get('Authorization')
    if authorization and authorization == os.environ['AUTH_TOKEN']:
        utils.compile_authors()
        utils.compile_titles()
        return application.response_class(status=201)
    return application.response_class(status=403)


if __name__ == '__main__':
    application.run(host='127.0.0.1', port='5050')
