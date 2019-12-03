# Copyright Robert Geil 2019
# utils.py
import re
pattern = re.compile(r'\s+')


def validate_json(story):
    result = {}
    # dict -> Union[dict, None]
    if 'content' not in story or not isinstance(story['content'], list):
        return None
    if 'title' not in story or not isinstance(story['title'], str):
        return None
    if 'author' not in story or not isinstance(story['author'], str):
        return None
    result['content'] = []
    result['title'] = story['title']
    result['author'] = story['author']
    story = story['content']
    if len(story) == 0:
        return None  # Empty story
    unvisited = set()
    for i in range(len(story)):
        unvisited.add(i)
    for element in story:
        if not isinstance(element, dict):
            return None
        if 'main' not in element or not isinstance(element['main'], str):
            return None
        if ('question' in element and 'options' not in element) or ('options' in element and 'question' not in element):
            return None
        if 'options' not in element:
            continue
        if not isinstance(element['options'], list):
            return None
        if not isinstance(element['question'], str):
            return None
        if len(element['options']) not in (2, 3):
            return None
        for option in element['options']:
            if len(option) != 2:
                return None
            if not (isinstance(option[0], str) and isinstance(option[1], int)):
                return None
            if option[1] < 0 or option[1] >= len(story):
                return None
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
        return None
    return result


def validate_title(title: str) -> bool:
    title = clean_title(title)
    if len(title) < 3:
        return "Title must be at least 3 characters long"
    for char in title:
        if not char.isalpha() and not char in {"'", " ", ":"}:
            return "%s is not allowed in a title" % char
    return None


def clean_title(title: str) -> str:
    title = pattern.sub(' ', title).strip()
    return title
