from app import app, db
import re
from sqlalchemy.sql import func

__pattern = re.compile(r'\s+')

# TODO:


def compile(story):
    title = story.title
    builder = story.builder
    author = story.author
    content = [{} for _ in builder['nodes']]
    mapping = {}
    count = 1
    for node in builder['nodes']:
        if node['beginning']:
            mapping[node['id']] = 0
        else:
            mapping[node['id']] = count
            count += 1
        content[mapping[node['id']]]['main'] = node['text']
        if not node['end']:
            content[mapping[node['id']]]['question'] = node['question']
            content[mapping[node['id']]]['options'] = [[a['text'], a['id']]
                                                    for a in node['outputPortAnswers']]
    for link in builder['links']:
        content[mapping[link['sourceID']]
                ]['options'][link['sourceIndex']][1] = mapping[link['sink']]
    story.content = {"content": content, "title": title, "author": author.name}
    story.last_compiled = func.now()
    db.session.commit()
    return story.content

def check_story(compiled):
    result = {}
    errors = []
    # dict -> Union[dict, None]
    if 'content' not in compiled or not isinstance(compiled['content'], list):
        errors.append('"content" not found in JSON')
    if 'title' not in compiled or not isinstance(compiled['title'], str):
        errors.append('"title" not found in JSON')
    if 'author' not in compiled or not isinstance(compiled['author'], str):
        errors.append('"author" not found in JSON')
    if errors:
        raise ValueError(errors)
    result['content'] = []
    result['title'] = compiled['title']
    result['author'] = compiled['author']
    story = compiled['content']
    if len(story) == 0:
        errors.append('Story is empty')  # Empty story
    unvisited = set()
    for i in range(1, len(story)):
        unvisited.add(i)
    for element in story:
        if not isinstance(element, dict):
            errors.append('Bad format, unrecognized')
        if 'main' not in element or not isinstance(element['main'], str):
            errors.append('No main text in a story node')
        if ('question' in element and 'options' not in element) or ('options' in element and 'question' not in element):
            errors.append('Missing either question or options in a story node')
        if 'options' not in element:
            continue
        if not isinstance(element['options'], list):
            errors.append('Malformatted options')
        if not isinstance(element['question'], str):
            errors.append('Question is not a string')
        if len(element['options']) not in (2, 3):
            errors.append('Must be 0, 2 or 3 options on every node')
        for option in element['options']:
            if len(option) != 2:
                errors.append('Malformatted option')
                continue
            if not (isinstance(option[0], str) and isinstance(option[1], int)):
                errors.append('Missing output for an option')
                continue
            if option[1] < 0 or option[1] >= len(story):
                errors.append('Bad option index provided')
                continue
            if option[1] in unvisited:
                unvisited.remove(option[1])
    for element in story:
        nelement = {
            'main': element['main']
        }
        if 'question' in element:
            nelement['question'] = element['question']
            nelement['options'] = element['options']
        result['content'].append(nelement)
    if len(unvisited) != 0:
        errors.append('Some nodes are unreachable')
    if len(errors):
        raise ValueError(errors)
    return result


def validate_title(title):
    # Strip out multiple whitespaces and replace with single space
    title = __pattern.sub(' ', title).strip()
    if len(title) < app.config['MIN_TITLE_LENGTH']:
        raise ValueError('Title must be at least %s characters long' %
                         app.config['MIN_TITLE_LENGTH'])
    if len(title) > app.config['MAX_TITLE_LENGTH']:
        raise ValueError('Title must be less than %s characters long' %
                         app.config['MAX_TITLE_LENGTH'])
    for char in title:
        if not char.isalpha() and not char in app.config['PERMITTED_TITLE_CHARS']:
            raise ValueError('Character %s not permitted in titles' % char)
    return title
