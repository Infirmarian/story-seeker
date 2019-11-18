# Copyright Robert Geil 2019
# utils.py

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
        return None # Empty story
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

{"content": [
    {"main": "Once upon a time, there were 3 little pigs, who lived in 3 huts. The first pig lived in a hut of straw, the second\\nlived in a house of sticks, while the third lived in a fortified bunker of depleted uranium. Our protagonist, a wolfish inspector named\\nFred has been tasked to investigate potential building code violations.", 
    "question": "Which building should he investigate first?", 
    "options": [["The straw hut", 2], ["the stick house", 1], ["the uranium bunker", 1]]}, 
    {"main": "Alas the fortress had Air Missiles defending itself, so Fred died a tragic death"}, 
    {"main": "Upon careful inspection, the straw hut seems to be failing fire code standards!", 
    "question": "Should Fred arrest the violating pig?", 
    "options": [["yes", 3], ["no", 4]]}, 
    {"main": "Another successful arrest to maintain building standards!"}, 
    {"main": "Unfortunately the higher ups in the department of civil engineering arent happy with the lax enforcement, and our hero gets the axe "}]}