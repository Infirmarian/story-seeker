from flask import Flask
from os import environ

app = Flask(__name__, static_folder='build')
app.config.from_pyfile('config.py')

from .views import static_routes
