from .. import db
from sqlalchemy import Column, Integer, String, ForeignKey, Text, DateTime, JSON, Enum
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from app.models.enums import Genre, Rating, PublicationStatus


class Story(db.Model):
    id = Column(Integer, primary_key=True, autoincrement=True)
    title = Column(String(128), nullable=False)
    content = Column(JSON)
    builder = Column(JSON,
                     nullable=False,
                     default={"zoom": 100,
                              "offsetX": -68, "offsetY": -29,
                              "nodes": [
                                  {"x": 129,
                                   "y": 174,
                                   "id": "da8ef409-7569-4d57-8cfd-30915fa7cfe8",
                                   "text": "This is a sample story",
                                   "question": "Sample Question 1",
                                   "beginning": True,
                                   "end": False,
                                   "outputPortAnswers": [
                                       {"text": "choice 1",
                                        "id": "2df80222-beaf-4d68-82cf-4a2dd61d8806"},
                                       {"text": "choice 2",
                                        "id": "18c53ed1-6c8c-4ea6-a92a-e9782f83667b"}]
                                   },
                                  {"x": 427,
                                   "y": 106,
                                   "id": "9c61bfaf-6911-4d22-9452-30132c623a88",
                                   "text": "Choice 1 path",
                                   "beginning": False,
                                   "end": True,
                                   "outputPortAnswers": []},
                                  {"x": 364,
                                   "y": 258,
                                   "id": "1c754dae-b3e7-4b92-b4a7-8a5dc406d06a",
                                   "text": "Choice 2 path",
                                   "beginning": False,
                                   "end": True,
                                   "outputPortAnswers": []}],
                              "links": [
                                  {"sourceID": "da8ef409-7569-4d57-8cfd-30915fa7cfe8",
                                   "sourceIndex": 0,
                                   "sink": "9c61bfaf-6911-4d22-9452-30132c623a88"},
                                  {"sourceID": "da8ef409-7569-4d57-8cfd-30915fa7cfe8",
                                   "sourceIndex": 1,
                                   "sink": "1c754dae-b3e7-4b92-b4a7-8a5dc406d06a"}]})
    price = Column(Integer, nullable=False, default=0)
    summary = Column(Text, nullable=False)
    genre = Column(Enum(Genre), nullable=False, default=Genre.NA)
    rating = Column(Enum(Rating), nullable=False, default=Rating.NR)
    published = Column(Enum(PublicationStatus), nullable=False,
                       default=PublicationStatus.not_published)
    created = Column(DateTime(timezone=True), default=func.now())
    last_modified = Column(DateTime(timezone=True), default=func.now())
    last_compiled = Column(DateTime(timezone=True), default=func.now())
    author_id = Column(Integer, ForeignKey('author.id'), nullable=False)


class Library(db.Model):
    storyid = Column(Integer, ForeignKey('story.id'), nullable=False)
    userid = Column(Integer, ForeignKey('user.id'), nullable=False)
    acquired = Column(DateTime(timezone=True), default=func.now())
    story = relationship('Story', back_populates='library')
