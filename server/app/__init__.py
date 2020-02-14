from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from os import environ

app = Flask(__name__, static_folder='build')
app.config.from_pyfile('config.py')
db = SQLAlchemy(app)

from .models.models import *
from .models.stories import *
from .views import static_routes
