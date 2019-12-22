# Copyright Robert Geil 2019
# utils.py
import re

import db_connection as db

pattern = re.compile(r'\s+')


class ValidationError(Exception):
    def __init__(self, errors):
        self.error = ', '.join(errors)

    def __str__(self):
        return self.error


def validate_json(story):
    result = {}
    errors = []
    # dict -> Union[dict, None]
    if 'content' not in story or not isinstance(story['content'], list):
        errors.append('"content" not found in JSON')
    if 'title' not in story or not isinstance(story['title'], str):
        errors.append('"title" not found in JSON')
    if 'author' not in story or not isinstance(story['author'], str):
        errors.append('"author" not found in JSON')
    if errors:
        raise ValidationError(errors)
    result['content'] = []
    result['title'] = story['title']
    result['author'] = story['author']
    story = story['content']
    if len(story) == 0:
        errors.append('Story is empty')  # Empty story
    unvisited = set()
    for i in range(len(story)):
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
        raise ValidationError(errors)
    return result


# Takes the given serialized_story, and converts it to an alexa format
def compile_to_alexa(serialized, title, author):
    content = [{} for _ in serialized['nodes']]
    mapping = {}
    count = 1
    for node in serialized['nodes']:
        if node['beginning']:
            mapping[node['id']] = 0
        else:
            mapping[node['id']] = count
            count += 1
        content[mapping[node['id']]]['main'] = node['text']
        content[mapping[node['id']]]['question'] = node['question']
        content[mapping[node['id']]]['options'] = [[a['text'], a['id']]
                                                   for a in node['outputPortAnswers']]
    for link in serialized['links']:
        content[mapping[link['sourceID']]
                ]['options'][link['sourceIndex']][1] = mapping[link['sink']]
    return {"content": content, "title": title, "author": author}


def validate_title(title: str) -> bool:
    title = clean_title(title)
    if len(title) < 3:
        return "Title must be at least 3 characters long"
    for char in title:
        if not char.isalpha() and not char in {"'", " ", ":"}:
            return "%s is not allowed in a title" % char
    if(db.query(db.title_exists, title)):
        return "A story called %s already exists" % title
    return None


def clean_title(title: str) -> str:
    title = pattern.sub(' ', title).strip()
    return title
