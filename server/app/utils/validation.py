from app import app
import re
__pattern = re.compile(r'\s+')

# TODO:


def compile(story):
    pass

# TODO:


def check_story(compiled):
    pass


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
