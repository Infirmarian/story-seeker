from .. import db
from sqlalchemy import Column, DateTime, String, Integer, ForeignKey, Enum, ARRAY
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.models.enums import AccessLevel


class Pause(db.Model):
    userid = Column(Integer, ForeignKey('user.id'), primary_key=True)
    storyid = Column(Integer, ForeignKey('story.id'))
    #path = Column(ARRAY(Integer), nullable=False)


class Token(db.Model):
    token = Column(String(48), primary_key=True)
    author_id = Column(Integer, ForeignKey(
        'author.id'), nullable=False, index=True)
    author = relationship('Author', back_populates='tokens')
    expiration = Column(DateTime(timezone=True), nullable=False)


class ModeratorTokens(db.Model):
    token = Column(String(48), primary_key=True)
    id = Column(String(256), ForeignKey('moderator.id'), nullable=False)
    access_level = Column(Enum(AccessLevel), nullable=False)
