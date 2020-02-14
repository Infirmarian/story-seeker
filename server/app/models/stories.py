from .. import db
from sqlalchemy import Column, Integer, String, ForeignKey, Text, TIMESTAMP, JSON
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship


class Story(db.Model):
    id = Column(Integer, primary_key=True, autoincrement=True)
    title = Column(String(128), nullable=False)
    content = Column(JSON)
    author_id = Column(Integer, ForeignKey('author.id'), nullable=False)
    price = Column(Integer, nullable=False, default=0)
    summary = Column(Text, nullable=False)
    created = Column(TIMESTAMP(timezone=True), default=func.now())
