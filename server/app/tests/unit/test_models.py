import tempfile
import pytest
import flask
from app.models.models import User, Author, Moderator
from flask_sqlalchemy import SQLAlchemy
import app.tests
from app.tests import db


def test_new_user():
    user = User(amazonID='abc.fjs.00sjf')
    db.session.add(user)
    db.session.commit()
    assert user.amazonID == 'abc.fjs.00sjf'
    assert user.tokens == 0
    assert user.id is not None
    db.session.delete(user)
    db.session.commit()
    assert User.query.get(user.id) is None


def test_new_author():
    author = Author(name='John Doe', email='me@example.com')
    db.session.add(author)
    db.session.commit()
    assert author.amazonID is None
    assert author.email == 'me@example.com'
    assert author.name == 'John Doe'
    assert len(author.stories) == 0
    assert len(author.tokens) == 0
    db.session.delete(author)
    db.session.commit()
    assert Author.query.get(author.id) is None
