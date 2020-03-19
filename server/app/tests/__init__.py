import os
import pytest
from flask_sqlalchemy import SQLAlchemy
from flask import Flask

app = Flask(__name__)
app.config.from_pyfile('../config.py')
app.config.from_pyfile('../testing_config.py')
db = SQLAlchemy(app)
from app.views.api import auth, story
#from app.views import static_routes
from app.views.static_routes import *
app.testing = True
client = app.test_client()
