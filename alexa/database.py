import logging
import psycopg2
import json
from dotenv import load_dotenv
import os
import utils
load_dotenv()
conn = None
DB_USER = os.environ['DB_USER']
DB_PASSWORD = os.environ['DB_PASSWORD']
DATABASE = os.environ['DB_NAME']
HOST = os.environ['DB_HOST']
PORT = '5432'

def connect_to_db():
    global conn
    try:
        if conn is None:
            conn = psycopg2.connect(user = DB_USER,
                                  password = DB_PASSWORD,
                                  host = HOST,
                                  port = PORT,
                                  database = DATABASE)
        return conn
    except Exception as e:
        print ("Error while connecting to PostgreSQL: %s" % e)

def add_user(userid):
    connect_to_db()
    with conn.cursor() as cursor:
        cursor.execute('INSERT INTO ss.users (id) VALUES (%s) ON CONFLICT DO NOTHING;', (userid,))
        conn.commit()

def load_user(userid):
    connect_to_db()
    with conn.cursor() as cursor:
        cursor.execute('SELECT * FROM ss.users WHERE id = %s;', (userid,))
        res = cursor.fetchall()
        return res

def load_story_if_possible(userid, storyid):
    # str, int -> bool
    connect_to_db()
    with conn.cursor() as cursor:
        cursor.execute('''SELECT s.content, s.title, s.id, r.rating FROM ss.libraries l
        JOIN ss.stories s ON s.id = l.storyid 
        LEFT JOIN ss.ratings r ON r.storyid = l.storyid AND r.userid = l.userid
        WHERE l.userid = %s AND l.storyid = %s;''', (userid, storyid))
        story = cursor.fetchone()
        if story is None:
            return None
        data = story[0]
        data['title'] = story[1]
        data['id'] = story[2]
        data['rating'] = story[3]
        return data

def get_user_library(userid):
    connect_to_db()
    with conn.cursor() as cursor:
        cursor.execute('''SELECT s.title FROM ss.libraries l 
        JOIN ss.stories s ON s.id = l.storyid 
        WHERE l.userid = %s;
        ''', (userid,))
        result = [n[0] for n in cursor.fetchall()]
        return result

def get_user_balance(userid, purchased):
    # str, int -> int
    connect_to_db()
    with conn.cursor() as cursor:
        cursor.execute('''
        SELECT tokens_used FROM ss.users WHERE id = %s;
        ''', (userid,))
        result = cursor.fetchone()
        if result is not None:
            return purchased - result[0]
        return None
'''
def add_user_balance(userid, quantity):
    # str, int -> None
    connect_to_db()
    with conn.cursor() as cursor:
        cursor.execute(
        UPDATE ss.users 
        SET tokens = tokens + %s
        WHERE id = %s;
        , (quantity, userid))
        conn.commit()
'''
def purchase_book(userid, storyid, purchased):
    # str, int, int -> str
    connect_to_db()
    with conn.cursor() as cursor:
        cursor.execute('SELECT tokens_used FROM ss.users WHERE id = %s;', (userid,))
        balance = purchased - cursor.fetchone()[0]
        cursor.execute('SELECT price FROM ss.stories WHERE id = %s;', (storyid))
        cost = cursor.fetchone()
        if balance is None or balance < cost[0]:
            return 'Insufficient Funds'
        cursor.execute('SELECT * FROM ss.libraries WHERE userid = %s AND storyid = %s;', (userid, storyid))
        if cursor.fetchone() is not None:
            return 'Already Owned'
        cursor.execute('INSERT INTO ss.libraries (userid, storyid) VALUES (%s, %s);', (userid, storyid))
        cursor.execute('UPDATE ss.users SET tokens_used = tokens_used + %s WHERE id = %s;', (cost[0], userid))
        conn.commit()
        return 'Success'

def search(userid, authorid, genre, rating, review):
    # TODO: Aggregate based on reviews, but I'm too tired rn
    connect_to_db()
    with conn.cursor() as cursor:
        query_list = ['l.userid IS NULL ']
        query_params = [userid]
        if authorid:
            query_list.append('AND s.authorid = %s ')
            query_params.append(authorid)
        if genre:
            query_list.append('AND s.genre = %s ')
            query_params.append(genre)
        if rating:
            query_list.append('AND s.rating = %s ')
            query_params.append(rating)
        cursor.execute('''SELECT s.title FROM ss.stories s
                            LEFT JOIN (
                                SELECT storyid, userid FROM ss.libraries WHERE userid = %s
                                ) l ON l.storyid = s.id
                            WHERE {}
                            LIMIT 10;'''.format(' '.join(query_list)), query_params)
        result = [r[0] for r in cursor.fetchall()]
        return result

def get_summary(storyid):
    # int -> Union[str, None]
    connect_to_db()
    with conn.cursor() as cursor:
        cursor.execute('SELECT summary FROM ss.stories WHERE id = %s;', (storyid,))
        result = cursor.fetchone()
        if result:
            result = result[0]
        return result

def add_rating(userid, storyid, rating):
    # str, str, int -> None
    connect_to_db()
    with conn.cursor() as cursor:
        cursor.execute('INSERT INTO ss.ratings (userid, storyid, rating) VALUES (%s, %s, %s) ON CONFLICT DO NOTHING;', (userid, storyid, rating))
        conn.commit()
    
def get_state(userid):
    connect_to_db()
    with conn.cursor() as cursor:
        cursor.execute('SELECT current_state FROM ss.saved_state WHERE userid = %s;', (userid,))
        result = cursor.fetchall()
        if len(result) == 0:
            return {}
        else:
            result = json.loads(result[0][0])
            return result

def save_state(userid, state):
    connect_to_db()
    state = json.dumps(state)
    with conn.cursor() as cursor:
        cursor.execute('''INSERT INTO ss.saved_state (userid, current_state) VALUES(%s, %s)
                              ON CONFLICT (userid) DO UPDATE SET current_state = %s;''', (userid, state, state))
        conn.commit()
        return None
