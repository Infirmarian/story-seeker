from .. import db
from sqlalchemy import Column, Integer, String, ForeignKey, Text, DateTime, JSON, Enum
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from app.models.enums import Genre, Rating, PublicationStatus


class Story(db.Model):
    id = Column(Integer, primary_key=True, autoincrement=True)
    title = Column(String(128), nullable=False)
    content = Column(JSON)
    serialized_story = Column(JSON)
    price = Column(Integer, nullable=False, default=0)
    summary = Column(Text, nullable=False)
    genre = Column(Enum(Genre))
    rating = Column(Enum(Rating), nullable=False, default=Rating.NR)
    published = Column(Enum(PublicationStatus), nullable=False,
                       default=PublicationStatus.not_published)
    created = Column(DateTime(timezone=True), default=func.now())
    last_modified = Column(DateTime(timezone=True), default=func.now())
    last_compiled = Column(DateTime(timezone=True), default=0)
    author_id = Column(Integer, ForeignKey('author.id'), nullable=False)
# TODO    author = relationship
