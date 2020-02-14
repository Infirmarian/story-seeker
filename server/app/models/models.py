from .. import db
from sqlalchemy import Column, Integer, String, TIMESTAMP, Enum
from sqlalchemy.sql import func
from app.models.enums import AccessLevel
from sqlalchemy.orm import relationship


class User(db.Model):
    id = Column(String(256), primary_key=True)
    tokens = Column(Integer, nullable=False, default=0)
    joined = Column(TIMESTAMP(timezone=True),
                    default=func.now(), nullable=False)


class Author(db.Model):
    id = Column(Integer, primary_key=True, autoincrement=True)
    name = Column(String(length=256), nullable=False)
    googleID = Column(String(length=256), unique=True)
    amazonID = Column(String(length=256), unique=True)
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
