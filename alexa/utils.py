# Copyright Robert Geil 2019
import logging
import os
import boto3
from botocore.exceptions import ClientError


def create_presigned_url(object_name):
    """Generate a presigned URL to share an S3 object with a capped expiration of 60 seconds

    :param object_name: string
    :return: Presigned URL as string. If error, returns None.
    """
    s3_client = boto3.client('s3', config=boto3.session.Config(signature_version='s3v4',s3={'addressing_style': 'path'}))
    try:
        bucket_name = os.environ.get('S3_PERSISTENCE_BUCKET')
        response = s3_client.generate_presigned_url('get_object',
                                                    Params={'Bucket': bucket_name,
                                                            'Key': object_name},
                                                    ExpiresIn=60*1)
    except ClientError as e:
        logging.error(e)
        return None

    # The response contains the presigned URL
    return response
def select_option(attr, option):
    story = attr['STORY']
    index = attr['INDEX']
    if option >= len(story['content'][index]['options']):
        return 'Please choose an option between 1 and %d' % len(story['content'][index]['options'])
    attr['INDEX'] = story['content'][index]['options'][option][1]
    return get_main(attr) + ' ' + get_question(attr)

def get_initial(attr):
    return 'Ok, lets start %s. %s %s' % (attr['STORY']['title'], get_main(attr), get_question(attr))
def get_main(attr):
    return attr['STORY']['content'][attr['INDEX']]['main']
def get_question(attr):
    options = [n[0] for n in attr['STORY']['content'][attr['INDEX']]['options']]
    result ='%s %s %s' % (attr['STORY']['content'][attr['INDEX']]['question'],
                    '\n'.join('%s: %s,' % (i+1, options[i]) for i in range(len(options)-1)),
                    ' or \n%s: %s' % (len(options), options[-1]))
    return result

stories = {"":[{
    "main":'''Once upon a time, there were 3 little pigs, who lived in 3 huts. The first pig lived in a hut of straw, the second
lived in a house of sticks, while the third lived in a fortified bunker of depleted uranium. Our protagonist, a wolfish inspector named
Fred has been tasked to investigate potential building code violations.''',
    "question": "Which building should he investigate first?",
    "options": [["The straw hut",2], ["the stick house",1], ["the uranium bunker", 1]]
},
{"main": "Alas the fortress had Air Missiles defending itself, so Fred died a tragic death"},
{"main": "Upon careful inspection, the straw hut seems to be failing fire code standards!",
    "question": "Should Fred arrest the violating pig?",
    "options": [["yes", 3], ["no", 4]]
},
{"main": "Another successful arrest to maintain building standards!"},
{"main": "Unfortunately the higher ups in the department of civil engineering aren't happy with the lax enforcement, and our hero gets the axe "}]}

def start_story(story_id, handler_input, title=None):
    full_story = fetch_story_by_id(story_id)
    story = full_story[0]
    if title is not None:
        starting = 'Ok, lets start %s. %s %s' % (title, story['main'], format_options(story))
    else:
        starting = '%s %s' % (story['main'], format_options(story))
    attr = handler_input.attributes_manager.session_attributes
    attr['STATE'] = 'STORY'
    attr['STEP'] = 0
    attr['CONTENT'] = full_story
    attr['STORY_ID'] = story_id
    return handler_input.response_builder.speak(starting).ask("Which should he choose?").response

def format_options(segment):
    options = [n[0] for n in segment['options']]
    result ='%s %s %s' % (segment['question'],
                        '\n'.join('%s: %s,' % (i+1, options[i]) for i in range(len(options)-1)),
                        ' or \n%s: %s' % (len(options), options[-1]))
    return result

def fetch_story_by_id(story_id):
    return stories[""]

def user_has_reviewed_product(userid, storyid):
    # TODO: Connect to the database and run a query
    return False
