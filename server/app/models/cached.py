from .. import db
from sqlalchemy import Column, DateTime, String, Integer, ForeignKey, Enum, ARRAY
from sqlalchemy.sql import func
from app.models.enums import AccessLevel


class Pause(db.Model):
    userid = Column(Integer, ForeignKey('user.id'), primary_key=True)
    storyid = Column(Integer, ForeignKey('story.id'))
    #path = Column(ARRAY(Integer), nullable=False)


class Tokens(db.Model):
    token = Column(String(32), primary_key=True)
    id = Column(Integer, ForeignKey('author.id'), nullable=False)
    expiration = Column(DateTime(timezone=True), nullable=False)


class ModeratorTokens(db.Model):
    token = Column(String(32), primary_key=True)
    id = Column(Integer, ForeignKey('moderator.id'), nullable=False)
    access_level = Column(Enum(AccessLevel), nullable=False)
