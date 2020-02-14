from flask import Flask, request, redirect
from flask_api import status
from flask_sqlalchemy import SQLAlchemy
from os import environ
from urllib.parse import urlparse, urlunparse

app = Flask(__name__, static_folder='build')
app.config.from_pyfile('config.py')
db = SQLAlchemy(app)


@app.before_request
def redirect_www():
    urlparts = urlparse(request.url)
    if urlparts.netloc == 'storyseeker.fun':
        urlparts_list = list(urlparts)
        urlparts_list[1] = 'www.' + urlparts_list[1]
        return redirect(urlunparse(urlparts_list), code=status.HTTP_301_MOVED_PERMANENTLY)


from .models.models import *
from .models.stories import *
from .models.cached import *
from .views.api import auth, story
from .views import static_routes
from .views import react_routes


import datetime
@app.before_first_request
def init():
    db.create_all()
