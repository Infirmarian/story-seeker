import os
import pytest
from flask_sqlalchemy import SQLAlchemy
from flask import Flask

app = Flask(__name__)
app.config.from_pyfile('../config.py')
app.config.from_pyfile('../testing_config.py')
db = SQLAlchemy(app)
#from app.models.models import *
# db.create_all()
