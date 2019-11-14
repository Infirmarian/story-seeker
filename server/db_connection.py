import os
import psycopg2
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


def get_():
    connect_to_db()
    with conn.cursor() as cursor:
        cursor.execute('SELECT * FROM ss.stories')
        r1 = cursor.fetchone()
        return r1

def store_user(userid, token):
    connect_to_db()
    with conn.cursor() as cursor:
        cursor.execute('INSERT INTO a.tokens (userid, token) VALUES (%s, %s)', (userid, token))
        conn.commit()