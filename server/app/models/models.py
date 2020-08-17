from .. import db
from sqlalchemy import Column, Integer, String, TIMESTAMP, Enum
from sqlalchemy.sql import func
from app.models.enums import AccessLevel
from sqlalchemy.orm import relationship


class User(db.Model):
    id = db.Column(Integer, primary_key=True, autoincrement=True)
    amazonID = db.Column(String(256))
    tokens = db.Column(Integer, nullable=False, default=0)
    joined = db.Column(TIMESTAMP(timezone=True),
                       default=func.now(), nullable=False)


class Author(db.Model):
    id = Column(Integer, primary_key=True, autoincrement=True)
    name = Column(String(length=256), nullable=False)
    googleID = Column(String(length=256), unique=True, index=True)
    amazonID = Column(String(length=256), unique=True, index=True)
    email = Column(String(320))
    paypal = Column(String(256))
    joined = Column(TIMESTAMP(timezone=True),
                    default=func.now(), nullable=False)
    stories = relationship('Story', backref='author', lazy=True)
    tokens = relationship('Token', back_populates='author')


class Moderator(db.Model):
    id = Column(String(256), primary_key=True)
    name = Column(String(128), nullable=False)
    email = Column(String(320), nullable=False)
    access_level = Column(Enum(AccessLevel), nullable=False,
                          default=AccessLevel.user)