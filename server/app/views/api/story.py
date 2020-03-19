from flask import request
from app import app, db
from app.views.api.common import json_response, authenticated
from app.models.stories import Story
from app.models.enums import PublicationStatus
from sqlalchemy.sql import func
import json
from app.utils.validation import compile, check_story


@app.route('/api/list')
@json_response
@authenticated
def list_stories(user):
    stories = user.stories
    print(stories)
    return {'stories': [{'title': s.title,
                         'id': s.id,
                         'price': s.price,
                         'genre': s.genre.name,
                         'published': s.published.name} for s in stories]}


@app.route('/api/overview', methods=['POST'])
@json_response
@authenticated
def create_story(user):
    title = request.json['title']
    new_story = Story(title=title, author=user, summary='')
    db.session.add(new_story)
    db.session.commit()
    return {'id': new_story.id}, 201


@app.route('/api/overview/<storyid>', methods=['GET'])
@json_response
@authenticated
def get_story(user, storyid):
    story = Story.query.get(storyid)
    if story is None or story.author != user:
        return {'error': 'Specified story is not found'}, 404
    return {
        'title': story.title,
        'price': story.price,
        'genre': story.genre.name,
        'published': story.published.name,
        'summary': story.summary,
        'created': story.created.strftime("%m/%d/%Y, %H:%M:%S"),
        'last_modified': story.last_modified.strftime("%m/%d/%Y, %H:%M:%S")
    }


@app.route('/api/overview/<storyid>', methods=['PUT'])
@json_response
@authenticated
def update_story(user, storyid):
    story = Story.query.get(storyid)
    update = request.json
    if story is None or story.author != user:
        return {'error': 'Specified story is not found'}, 404
    story.title = update['title']
    story.summary = update['summary']
    story.genre = update['genre']
    story.price = update['price']
    story.last_modified = func.now()
    db.session.commit()


# Story Builder Content
@app.route('/api/builder/<storyid>', methods=['GET'])
@json_response
@authenticated
def get_builder(user, storyid):
    story = Story.query.get(storyid)
    if story is None or story.author != user:
        return {'error': 'Specified story is not found'}, 404
    return story.builder


@app.route('/api/builder/<storyid>', methods=['PUT'])
@json_response
@authenticated
def save_builder(user, storyid):
    story = Story.query.get(storyid)
    if story is None or story.author != user:
        return {'error': 'Specified story is not found'}, 404
    story.builder = json.loads(request.json)
    db.session.commit()
    return

# Compile and build story
# TODO:
@app.route('/api/submit/<storyid>', methods=['GET'])
@json_response
@authenticated
def submit_story(user, storyid):
    story = Story.query.get(storyid)
    if story is None or story.author != user:
        return {'error': 'Specified story is not found'}, 404
    if story.published == PublicationStatus.published or story.published == PublicationStatus.pending:
        return {'error': 'Specified story is already published or pending'}, 400
    try:
        compiled = compile(story.builder)
        checked = check_story(compiled)
        story.compiled = checked
        story.published = PublicationStatus.pending
        db.session.commit()
        return
    except ValueError as e:
        return {'error': str(e)}, 400

@app.route('/api/preview/<storyid>', methods=['GET'])
@json_response
@authenticated
def preview_story(user, storyid):
    story = Story.query.get(storyid)
    if story is None or story.author != user:
        return {'error': 'Specified story is not found'}, 404
    result = story.content
    if story.last_modified > story.last_compiled:
        result = compile(story)
    return result
