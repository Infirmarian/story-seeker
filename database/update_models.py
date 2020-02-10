from ask_smapi_sdk import StandardSmapiClientBuilder
import time
import os
import json

AUTHOR_CATALOG_ID = os.environ['AUTHOR_CATALOG_ID']
TITLE_CATALOG_ID = os.environ['TITLE_CATALOG_ID']
CLIENT_ID = os.environ['CLIENT_ID']
CLIENT_SECRET = os.environ['CLIENT_SECRET']
REFRESH_TOKEN = os.environ['REFRESH_TOKEN']

smapi_client_builder = StandardSmapiClientBuilder(client_id='amzn1.application-oa2-client.a9bb21233492458f97119c45e36639b4', client_secret=LOGIN_CLIENT_SECRET, refresh_token=os.environ['REFRESH_TOKEN'])
smapi_client = smapi_client_builder.client()

def update_authors():
    resp = smapi_client.create_interaction_model_catalog_version_v1(AUTHOR_CATALOG_ID, {
      "source": {
          "type": "URL",
          "url": "https://storage.googleapis.com/story-seeker-catalogues/authors.json"
      },
      "description": "upload"
    }, full_response=True)
    loc = list(filter(lambda x: x[0] == 'Location', resp.headers))
    loc = loc[0][1]
    tracker = loc[loc.rfind('/')+1:]
    res = smapi_client.get_interaction_model_catalog_update_status_v1(AUTHOR_CATALOG_ID, tracker)
    while res.last_update_request.status.value != 'SUCCEEDED' and res.last_update_request.status.value != 'FAILED':
        time.sleep(1)
        res = smapi_client.get_interaction_model_catalog_update_status_v1(AUTHOR_CATALOG_ID, tracker)
    if res.last_update_request.status.value == 'FAILED':
        return json.dumps(res.last_update_request)
    else:
        return son.dumps({"version": res.last_update_request.version})

def update_titles():
    pass

def update_options():
    pass

