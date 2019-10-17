# Copyright Robert Geil 2019
from flask import Flask, request

import db_connection as db

app = Flask(__name__)

@app.route('/')
def hello_world():
    return 'Hello, World!'

@app.route('/register/author', methods=['POST'])
def register():
    data = request.json
    first = data['first_name']
    last = data['last_name']
    status = db.register_author(first, last)
    return '', status

if __name__ == '__main__':
    app.run()