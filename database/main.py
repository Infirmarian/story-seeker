from flask import Flask, send_file, request, abort
import os
import utils
import json
from db_connector import query, DBError
import db_connector as db
app = Flask(__name__, static_folder='build')


@app.errorhandler(404)
def page_not_found(error):
    return '''<title>404 Not Found</title>
<h1>Not Found</h1>
<p>
  The requested URL was not found on the server. If you entered the URL manually
  please check your spelling and try again.
</p>''', 404


@app.route('/api/pending', methods=['GET'])
def pending():
    auth = utils.get_authorization(request)
    if auth is None:
        abort(403)
    try:
        query(db.get_pending, auth=auth)
        return app.response_class(
            json.dumps({db.get_pending(auth)}), mimetype='application/json')
    except DBError as e:
        return app.response_class(e.response, e.status, mimetype='application/json')


@app.route('/titles')
def serve_titles():
    t = request.args.get('token')
    if os.path.exists(app.static_folder + '/titles.json') and t == os.environ['ACCESS_KEY']:
        return send_file(app.static_folder + '/titles.json', mimetype='application/json')
    abort(404)


@app.route('/authors')
def serve_authors():
    t = request.args.get('token')
    if os.path.exists(app.static_folder + '/authors.json') and t == os.environ['ACCESS_KEY']:
        return send_file(app.static_folder + '/authors.json', mimetype='application/json')
    abort(404)


@app.route('/update', methods=['POST'])
def update():
    authorization = request.headers.get('Authorization')
    if authorization and authorization == os.environ['AUTH_TOKEN']:
        utils.compile_authors()
        utils.compile_titles()
        return app.response_class(status=201)
    return app.response_class(status=403)

@app.route('/', defaults={'path': ''})
@app.route('/<path:path>')
def catch_all(path):
    return send_file(app.static_folder + '/index.html')

if __name__ == '__main__':
    app.run(host='127.0.0.1', port='5050')
