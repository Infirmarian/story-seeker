import os
import psycopg2
from psycopg2 import OperationalError
from datetime import datetime
from typing import Union, Dict

DB_USER = os.environ['DB_USER']
DB_PASSWORD = os.environ['DB_PASSWORD']
DATABASE = os.environ['DB_NAME']
HOST = os.environ['DB_HOST']
conn = psycopg2.connect(
    database=DATABASE,
    user=DB_USER,
    password=DB_PASSWORD,
    host=HOST,
    port='5432'
)


def connect_to_db():
    global conn
    conn = psycopg2.connect(
        database=DATABASE,
        user=DB_USER,
        password=DB_PASSWORD,
        host=HOST,
        port='5432'
    )


def cache_login(userid, name, email, token, ttl, repeat=False):
    try:
        with conn.cursor() as cursor:
            # Add the user to the database if they don't already exist
            cursor.execute('''INSERT INTO ss.authors (name, email, userid) 
                            VALUES (%s, %s, %s) ON CONFLICT DO NOTHING''', (name, email, userid))
            cursor.execute(
                "INSERT INTO a.tokens (userid, token, expiration) VALUES (%s, %s, NOW() + INTERVAL '%s SECOND');", (userid, token, ttl))
            conn.commit()
    except OperationalError as e:
        if repeat:
            raise e
        connect_to_db()
        return cache_login(userid, name, email, token, ttl, repeat=True)


def logout_user(token, repeat=False) -> None:
    try:
        with conn.cursor() as cursor:
            cursor.execute('DELETE FROM a.tokens WHERE token = %s;', (token,))
            conn.commit()
    except OperationalError as e:
        if repeat:
            raise e
        connect_to_db()
        return logout_user(token, repeat=True)


def logout_all(token: str, repeat=False) -> bool:
    try:
        with conn.cursor() as cursor:
            userid = get_userid_from_token(token, cursor)
            if userid is None:
                return False
            cursor.execute(
                'DELETE FROM a.tokens WHERE userid = %s;', (userid,))
            conn.commit()
            return True
    except OperationalError as e:
        if repeat:
            raise e
        connect_to_db()
        return logout_all(token, repeat=True)


def get_name_from_token(token: str, repeat=False) -> Union[None, str]:
    try:
        with conn.cursor() as cursor:
            cursor.execute('''SELECT name FROM ss.authors a
                JOIN a.tokens t ON t.userid = a.userid WHERE token = %s AND expiration > NOW()''', (token,))
            value = cursor.fetchone()
            if value is None:
                return None
            return value[0]
    except OperationalError as e:
        if repeat:
            raise e
        connect_to_db()
        return get_name_from_token(str, True)


def save_story(token: str, title: str, story: str, repeat=False) -> int:
    try:
        with conn.cursor() as cursor:
            cursor.execute(
                '''SELECT userid FROM a.tokens WHERE token = %s AND expiration > NOW()''', (token,))
            value = cursor.fetchone()
            if value is None:
                return 403
            userid = value[0]
            cursor.execute(
                '''UPDATE ss.stories SET serialized_story = %s WHERE title = %s AND authorid = %s;''', (title, story, userid))
            conn.commit()
            return 200
    except OperationalError as e:
        if repeat:
            raise e
        connect_to_db()
        return save_story(token, title, story, True)


def get_all_stories(token: str, repeat=False):
    # str -> Union[dict, None]
    try:
        with conn.cursor() as cursor:
            cursor.execute(
                '''SELECT userid FROM a.tokens WHERE token = %s AND expiration > NOW()''', (token,))
            userid = cursor.fetchone()
            if userid is None:
                return None
            userid = userid[0]
            cursor.execute('''SELECT id, title, price, genre, published 
                            FROM ss.stories WHERE authorid = %s
                            ORDER BY last_modified DESC;''', (userid,))  # TODO: get this information
            response = {'stories': [{
                'id': n[0],
                'title': n[1],
                'price': n[2],
                'genre': n[3],
                'published': n[4],
            } for n in cursor.fetchall()]}
            return response
    except OperationalError as e:
        if repeat:
            raise e
        connect_to_db()
        return get_all_stories(token, True)


def get_story_overview(token, storyid, repeat=False):
    # str, str -> Union[dict, None]
    try:
        with conn.cursor() as cursor:
            cursor.execute(
                'SELECT userid FROM a.tokens WHERE token = %s AND expiration > NOW();', (token,))
            userid = cursor.fetchone()
            if userid is None:
                return None
            userid = userid[0]
            cursor.execute(
                '''SELECT title, price, genre, published, summary, created, last_modified 
                FROM ss.stories WHERE id = %s AND authorid = %s;''', (storyid, userid,))
            result = cursor.fetchone()
            # No such story exists
            if result is None:
                return None
            return {
                'title': result[0],
                'price': str(result[1]),
                'genre': result[2],
                'published': result[3],
                'summary': result[4],
                'created':  result[5].strftime("%m/%d/%Y, %H:%M:%S"),
                'last_modified': result[6].strftime("%m/%d/%Y, %H:%M:%S")
            }
    except OperationalError as e:
        if repeat:
            raise e
        connect_to_db()
        return get_story_overview(token, storyid, True)


def get_story_content(token: str, storyid: str, repeat=False) -> Dict:
    try:
        with conn.cursor() as cursor:
            cursor.execute(
                'SELECT userid FROM a.tokens WHERE token = %s AND expiration > NOW();', (token,))
            userid = cursor.fetchone()
            if userid is None:
                return None
            userid = userid[0]
            cursor.execute(
                'SELECT serialized_story FROM ss.stories WHERE id = %s AND authorid = %s;', (storyid, userid))
            result = cursor.fetchone()
            if result:
                result = result[0]
            return result
    except OperationalError as e:
        if repeat:
            raise e
        connect_to_db()
        return get_story_content(token, storyid, True)


def save_story_overview(token: str, repeat=False) -> bool:
    # TODO
    try:
        with conn.cursor() as cursor:
            userid = get_userid_from_token(token, cursor)
            if userid is None:
                return False
    except OperationalError as e:
        if repeat:
            raise e
        connect_to_db()
        return save_story_overview(token, True)


def create_story(token: str, title: str, repeat=False) -> Union(None, int):
    # TODO
    try:
        with conn.cursor() as cursor:
            userid = get_userid_from_token(token, cursor)
            if userid is None:
                return None
    except OperationalError as e:
        if repeat:
            raise e
        connect_to_db()
        return create_story(token, title, True)


def save_story_content(token: str, storyid: str, content: str, repeat=False) -> bool:
    try:
        with conn.cursor() as cursor:
            userid = get_userid_from_token(token, cursor)
            if userid is None:
                return False
            cursor.execute(
                'UPDATE ss.stories SET serialized_story = %s WHERE id = %s AND authorid = %s;', (content, storyid, userid))
            conn.commit()
            return True
    except OperationalError as e:
        if repeat:
            raise e
        connect_to_db()
        return save_story_content(token, storyid, content, True)


def get_userid_from_token(token, cursor):
    cursor.execute(
        'SELECT userid FROM a.tokens WHERE token = %s AND expiration > NOW();', (token))
    userid = cursor.fetchone()
    if userid:
        userid = userid[0]
    return userid
