from ask_smapi_sdk import StandardSmapiClientBuilder
from google.cloud import storage
from google.api_core.exceptions import NotFound
import time
import os
import json
import db_connector as db
import requests


AUTHOR_CATALOG_ID = os.environ['AUTHOR_CATALOG_ID']
TITLE_CATALOG_ID = os.environ['TITLE_CATALOG_ID']
CLIENT_ID = os.environ['LOGIN_CLIENT_ID']
CLIENT_SECRET = os.environ['LOGIN_CLIENT_SECRET']
REFRESH_TOKEN = os.environ['REFRESH_TOKEN']
SKILL_ID = os.environ['SKILL_ID']
smapi_client_builder = StandardSmapiClientBuilder(client_id=CLIENT_ID,
                                                    client_secret=CLIENT_SECRET, 
                                                    refresh_token=REFRESH_TOKEN)
smapi_client = smapi_client_builder.client()
storage_client = storage.Client()
BUCKET_NAME="story-seeker-catalogues"

def compile_authors():
    db.query(db.generate_authors_json)
    bucket = storage_client.bucket(BUCKET_NAME)
    blob = bucket.blob("authors.json")
    try:
        blob.delete()
    except NotFound:
        pass
    blob = bucket.blob("authors.json")
    blob.upload_from_filename("catalog/authors.json")

def compile_titles():
    db.query(db.generate_titles_json)
    bucket = storage_client.bucket(BUCKET_NAME)
    blob = bucket.blob("titles.json")
    try:
        blob.delete()
    except NotFound:
        pass
    blob = bucket.blob("titles.json")
    blob.upload_from_filename("catalog/titles.json")

def update_authors():
    compile_authors()
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
        update_model(None, res.last_update_request.version)
        return json.dumps({"version": res.last_update_request.version})

def update_titles():
    compile_titles()
    resp = smapi_client.create_interaction_model_catalog_version_v1(TITLE_CATALOG_ID, {
      "source": {
          "type": "URL",
          "url": "https://storage.googleapis.com/story-seeker-catalogues/titles.json"
      },
      "description": "upload"
    }, full_response=True)
    loc = list(filter(lambda x: x[0] == 'Location', resp.headers))
    loc = loc[0][1]
    tracker = loc[loc.rfind('/')+1:]
    res = smapi_client.get_interaction_model_catalog_update_status_v1(TITLE_CATALOG_ID, tracker)
    while res.last_update_request.status.value != 'SUCCEEDED' and res.last_update_request.status.value != 'FAILED':
        time.sleep(1)
        res = smapi_client.get_interaction_model_catalog_update_status_v1(TITLE_CATALOG_ID, tracker)
    if res.last_update_request.status.value == 'FAILED':
        return json.dumps(res.last_update_request)
    else:
        update_model(res.last_update_request.version, None)
        return json.dumps({"version": res.last_update_request.version})

def update_options():
    pass

def update_model(title_version, author_version):
    token = smapi_client._lwa_service_client.get_access_token_from_refresh_token()
    current = requests.get('https://api.amazonalexa.com/v1/skills/%s/stages/development/interactionModel/locales/en-US' % SKILL_ID,
        headers={'Authorization': 'Bearer %s' % token })
    data = current.json()['interactionModel']
    if title_version:
        list(filter(lambda x: x['name'] == 'stories', data['languageModel']['types']))[0]['valueSupplier']['valueCatalog']['version'] = title_version
    if author_version:
        list(filter(lambda x: x['name'] == 'authors', data['languageModel']['types']))[0]['valueSupplier']['valueCatalog']['version'] = author_version
    print(data)
    resp = requests.put('https://api.amazonalexa.com/v1/skills/%s/stages/development/interactionModel/locales/en-US' % SKILL_ID, 
        headers={"Authorization": "Bearer %s" % token}, data=json.dumps({'interactionModel':data}))
    if resp.status_code >= 400:
        raise Exception(resp.json)
