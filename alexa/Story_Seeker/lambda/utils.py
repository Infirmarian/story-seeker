# Copyright Robert Geil 2019
import logging
import os
import boto3
from botocore.exceptions import ClientError
import lambda_function

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
    index = attr['STORY_STACK'][-1]
    if option > len(story['content'][index]['options']):
        return 'Please choose an option between 1 and %d' % len(story['content'][index]['options'])
    attr['STORY_STACK'].append(story['content'][index]['options'][option-1][1])
    return '%s\n%s' % (get_main(attr), get_question(attr))

def get_initial(attr):
    return 'Ok, lets start %s. %s %s' % (attr['STORY']['title'], get_main(attr), get_question(attr))
def get_main(attr):
    return attr['STORY']['content'][attr['STORY_STACK'][-1]]['main']
def get_question(attr):
    if 'options' not in attr['STORY']['content'][attr['STORY_STACK'][-1]]:
        attr['STATE'] = lambda_function.STORY_ENDED
        return 'The End. Do you want to go back, or restart, or exit?'
    options = [n[0] for n in attr['STORY']['content'][attr['STORY_STACK'][-1]]['options']]
    result ='%s %s %s' % (attr['STORY']['content'][attr['STORY_STACK'][-1]]['question'],
                    '\n'.join('%s: %s,' % (i+1, options[i]) for i in range(len(options)-1)),
                    ' or \n%s: %s' % (len(options), options[-1]))
    return result
def in_skill_product_response(handler_input):
    """Get the In-skill product response from monetization service."""
    # type: (HandlerInput) -> Union[InSkillProductsResponse, Error]
    locale = handler_input.request_envelope.request.locale
    ms = handler_input.service_client_factory.get_monetization_service()
    return ms.get_in_skill_products(locale)

def get_resolved_value(handler_input, slot_name):
    """Resolve the slot name from the request using resolutions."""
    # type: (IntentRequest, str) -> Union[str, None]
    try:
        return (handler_input.request_envelope.request.intent.slots[slot_name].resolutions.resolutions_per_authority[0].values[0].value.name)
    except (AttributeError, ValueError, KeyError, IndexError):
        return None

def get_resolved_id(handler_input, slot_name):
    """Resolve the slot name from the request using resolutions."""
    # type: (IntentRequest, str) -> Union[str, None]
    try:
        return (handler_input.request_envelope.request.intent.slots[slot_name].resolutions.resolutions_per_authority[0].values[0].value.id)
    except (AttributeError, ValueError, KeyError, IndexError):
        return None

def format_list(items):
    if len(items) == 0:
        return ''
    if len(items) == 1:
        return items[0]
    if len(items) == 2:
        return '%s, and %s' %(items[0],items[1])
    return '%s, and %s' % (', '.join(items[:-1]), items[-1])

def product_format(products):
    product_names = [item.name for item in products]
    if len(product_names) == 1:
        return product_names[0]
    else:
        return '%s %s' % (', '.join(product_names[:-1]), product_names[-1])

def get_credit_count(handler_input):
    # HandlerInput -> int
    products = in_skill_product_response(handler_input).in_skill_products
    total = 0
    for item in products:
        number = item.active_entitlement_count
        if item.reference_name == 'story_token_5':
            number *= 5
        total += number
    return total

