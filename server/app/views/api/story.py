from flask import request
from app import app, db
from app.views.api.common import json_response, authenticated
from app.models.stories import Story


@app.route('/api/list')
@json_response
@authenticated
def list_stories(user):
    stories = user.stories
    print(stories)


@app.route('/api/overview', methods=['POST'])
@json_response
@authenticated
def create_story(user):
    title = request.json['title']
    new_story = Story(title=title, author=user)
    db.session.add(new_story)
    db.session.commit()
    return {'id': new_story.id}, 201
