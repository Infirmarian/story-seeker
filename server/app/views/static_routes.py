from .. import app


@app.route('/hello')
def hello():
    return '<h1>HELLO FLASK ORGANIZATION</h1>'
