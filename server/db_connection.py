import os
import psycopg2
from datetime import datetime

DB_USER = os.environ['DB_USER']
DB_PASSWORD = os.environ['DB_PASSWORD']
DATABASE = os.environ['DB_NAME']
HOST = os.environ['DB_HOST']
conn = None
def connect_to_db():
    global conn
    if conn is None:
        conn = psycopg2.connect(
            database=DATABASE,
            user=DB_USER,
            password=DB_PASSWORD,
            host=HOST,
            port='5432'
        )

def register_author(firstname, lastname):
    request = 'INSERT INTO ss.authors (firstname, lastname) VALUES (%s, %s);'
    with conn.cursor() as cur:
        try:
            cur.execute(request, (firstname, lastname))
            return 200
        except Exception as e:
            print("Failed to enter to the database... %s" % e)
            return 500
def save_temporary_story(authorid, temp_id, content):
    pass


def cache_login(userid, name, email, token, ttl):
    connect_to_db()
    with conn.cursor() as cursor:
        # Add the user to the database if they don't already exist
        cursor.execute('''INSERT INTO ss.authors (name, email, userid) 
                        VALUES (%s, %s, %s) ON CONFLICT DO NOTHING''', (name, email, userid))
        cursor.execute('''INSERT INTO a.tokens (userid, token, expiration) VALUES (%s, %s, NOW() + INTERVAL '%s SECOND')
                            ON CONFLICT (userid) DO UPDATE 
                            SET token = %s, expiration = NOW() + INTERVAL '%s SECOND';''', (userid, token, ttl, token, ttl))
        conn.commit()

def get_name_from_token(token):
    connect_to_db()
    with conn.cursor() as cursor:
        cursor.execute('''SELECT name FROM ss.authors a
            JOIN a.tokens t ON t.userid = a.userid WHERE token = %s AND expiration > NOW()''', (token,))
        value = cursor.fetchone()
        if value is None:
            return None
        return value[0]

def save_story(token, title, story):
    # str, str, str -> int
    connect_to_db()
    with conn.cursor() as cursor:
        cursor.execute('''SELECT userid FROM a.tokens WHERE token = %s AND expiration > NOW()''', (token,))
        value = cursor.fetchone()
        if value is None:
            return 403
        userid = value[0]
        cursor.execute('''UPDATE ss.stories SET serialized_story = %s WHERE title = %s AND authorid = %s;''', (title, story, userid))
        conn.commit()
        return 200
def get_all_stories(token):
    # str -> Union[dict, None]
    connect_to_db()
    with conn.cursor() as cursor:
        cursor.execute('''SELECT userid FROM a.tokens WHERE token = %s AND expiration > NOW()''', (token,))
        userid = cursor.fetchone()
        if userid is None:
            return None
        userid = userid[0]
        cursor.execute('''SELECT id, title, price, genre, published 
                        FROM ss.stories WHERE authorid = %s
                        ORDER BY last_modified DESC;''', (userid,)) # TODO: get this information
        response = {'stories': [{
            'id':n[0], 
            'title': n[1], 
            'price': n[2],
            'genre': n[3],
            'published': n[4],
            } for n in cursor.fetchall()]}
        return response

def get_story_overview(token, storyid):
    # str, str -> Union[dict, None]
    connect_to_db()
    with conn.cursor() as cursor:
        cursor.execute('SELECT userid FROM a.tokens WHERE token = %s AND expiration > NOW();', (token,))
        userid = cursor.fetchone()
        if userid is None:
            return None
        userid = userid[0]
        cursor.execute(
            '''SELECT title, price, genre, published, summary, created, last_modified 
            FROM ss.stories WHERE id = %s AND authorid = %s;''', (storyid,userid,))
        result = cursor.fetchone()
        # No such story exists
        if result is None:
            return None
        return {
            'title': result[0],
            'price': result[1],
            'genre': result[2],
            'published': result[3],
            'summary': result[4],
            'created':  result[5].strftime("%m/%d/%Y, %H:%M:%S"),
            'last_modified': result[6].strftime("%m/%d/%Y, %H:%M:%S")
        }

def get_story_content(token, storyid):
    connect_to_db()
    with conn.cursor() as cursor:
        cursor.execute('SELECT userid FROM a.tokens WHERE token = %s AND expiration > NOW();', (token,))
        userid = cursor.fetchone()
        if userid is None:
            return None
        userid = userid[0]
        cursor.execute('SELECT serialized_story FROM ss.stories WHERE id = %s AND authorid = %s;', (storyid, userid))
        result = cursor.fetchone()
        if result:
            result = result[0]
        return result

def save_story_content(token, storyid, content):
    connect_to_db()
    with conn.cursor() as cursor:
        userid = get_userid_from_token(token, cursor)
        if userid is None:
            return False
        cursor.execute('UPDATE ss.stories SET serialized_story = %s WHERE id = %s AND authorid = %s;', (content, storyid, userid))
        conn.commit()
        return True

def get_userid_from_token(token, cursor):
    cursor.execute('SELECT userid FROM a.tokens WHERE token = %s AND expiration > NOW();', (token))
    userid = cursor.fetchone()
    if userid:
        userid = userid[0]
    return userid