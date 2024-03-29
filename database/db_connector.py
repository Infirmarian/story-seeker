import psycopg2
from psycopg2 import OperationalError
import os
import json
from update_models import update_titles

conn = None
DB_USER = os.environ['DB_USER']
DB_PASSWORD = os.environ['DB_PASSWORD']
DB_NAME = os.environ['DB_NAME']
CLOUD_SQL_CONN_NAME = os.environ['PSQL_CLOUD_INSTANCE']

dev = os.environ['SERVER_STATE'] == 'DEVELOPMENT'

conn = psycopg2.connect(
    database=DB_NAME,
    user=DB_USER,
    password=DB_PASSWORD,
    host='localhost' if dev else f'/cloudsql/{CLOUD_SQL_CONN_NAME}',
    port='3306' if dev else '5432'
)


class DBError(Exception):
    def __init__(self, status, response):
        self.status = status
        self.response = json.dumps({'error': response})


def __connect_to_db():
    global conn
    conn = psycopg2.connect(database=DB_NAME,
                            user=DB_USER,
                            password=DB_PASSWORD,
                            host='localhost' if dev else f'/cloudsql/{CLOUD_SQL_CONN_NAME}',
                            port='3306' if dev else '5432')


def query(func, *args, **kwargs):
    if conn is None:
        __connect_to_db()
    try:
        return func(*args, **kwargs)
    except OperationalError:
        __connect_to_db()
        return func(*args, **kwargs)


def login(userid: str, name: str, email: str, token: str):
    with conn.cursor() as cursor:
        cursor.execute('''INSERT INTO a.moderators (userid, access_level, name, email) VALUES (%s, 'user', %s, %s)
                            ON CONFLICT DO NOTHING''', (userid, name, email))
        conn.commit()
        cursor.execute(
            'SELECT userid, access_level FROM a.moderators WHERE userid = %s', (userid,))
        result = cursor.fetchone()
        if result[1] == 'user':
            raise DBError(403, 'Not authorized as an admin')
        cursor.execute('INSERT INTO a.moderator_tokens (token, userid, access_level) VALUES (%s, %s, %s)',
                       (token, userid, result[1]))
        conn.commit()
        return result[1]


def revoke_story(token, storyid):
    if token is None:
        raise DBError(403, 'No authorization provided')
    with conn.cursor() as cursor:
        require_admin(token, cursor)
        cursor.execute(
            "UPDATE ss.stories SET published = 'not published' WHERE id = %s;", (storyid,))
        conn.commit()
    update_titles()


def get_all(token: str):
    if token is None:
        raise DBError(403, 'No authorization provided')
    with conn.cursor() as cursor:
        require_admin(token, cursor)
        cursor.execute('''SELECT id, title, published, last_modified, a.name FROM ss.stories
                        JOIN ss.authors a ON a.userid = authorid''')
        # TODO: Paginate this stuff later
        return {'stories': [
            {'id': n[0],
             'title': n[1],
             'published': n[2],
             'last_modified': n[3].strftime('%m-%d-%Y'),
             'author': n[4]
             } for n in cursor.fetchall()]}


def get_pending(token: str):
    if token is None:
        raise DBError(403, 'No token provided')
    with conn.cursor() as cursor:
        require_moderator(token, cursor)
        cursor.execute(
            '''SELECT title, id, last_modified FROM ss.stories WHERE published = 'pending' ORDER BY last_modified DESC''')
        res = cursor.fetchall()
        return {"stories": [{"title": n[0], "id": n[1], "last_modified": n[2].strftime("%m/%d/%Y")} for n in res]}


def get_story(token: str, storyid: str):
    if token is None:
        raise DBError(403, 'No token provided')
    with conn.cursor() as cursor:
        require_moderator(token, cursor)
        cursor.execute(
            'SELECT content, title FROM ss.stories WHERE id = %s;', (storyid,))
        result = cursor.fetchone()
        return {"title": result[1], "content": result[0]["content"]}


def approve_story(token: str, storyid: str):
    if token is None:
        raise DBError(403, 'No token provided')
    with conn.cursor() as cursor:
        require_moderator(token, cursor)
        cursor.execute(
            'SELECT published FROM ss.stories WHERE id = %s;', (storyid,))
        status = cursor.fetchone()[0]
        if status == 'published':
            print("Already published")
            return
        cursor.execute(
            '''UPDATE ss.stories SET published = 'published' WHERE id = %s''', (
                storyid,)
        )
        conn.commit()
    update_titles()


def reject_story(token, storyid):
    if token is None:
        raise DBError(403, 'No token provided')
    with conn.cursor() as cursor:
        require_moderator(token, cursor)
        cursor.execute(
            'SELECT published FROM ss.stories WHERE id = %s;', (storyid,))
        status = cursor.fetchone()[0]
        if status != 'pending':
            raise DBError(500, 'The selected story is not pending')
        cursor.execute(
            '''UPDATE ss.stories SET published = 'not published' WHERE id = %s''', (
                storyid,)
        )
        conn.commit()


def generate_monthly_author_payments(month, year):
    with conn.cursor() as cursor:
        cursor.execute(
            '''INSERT INTO a.payments SELECT userid AS authorid FROM ss.authors;'''
        )
        # Updates the payments to reflect purchased books
        cursor.execute(
            '''UPDATE a.payments
                SET payment = payment + purchases.prices
                FROM (
                    SELECT a.userid as authorid, SUM(0.33*s.price) as prices
                    FROM ss.libraries l
                    JOIN ss.stories s ON s.id = l.storyid
                    JOIN ss.authors a ON a.userid = s.authorid
                    WHERE extract (month from acquire_date) = %s AND
                    extract (year from acquire_date) = %s
                    GROUP BY a.userid
                ) purchases
                WHERE a.payments.authorid = purchases.authorid AND
                extract(month from month) = %s AND
                    extract (year from month) = %s;''', (month, year, month, year)
        )
        # Add subscription income
        cursor.execute(
            '''
                UPDATE a.payments
                SET payment = payment + p.value
                FROM (
                    SELECT a.userid AS authorid, SUM(v.value) AS value
                    FROM ss.stories s
                    JOIN ss.authors a ON a.userid = s.authorid
                    JOIN(
                        SELECT c.userid, storyid, count(*) * 0.99/c.listens AS value
                        FROM ss.readings
                        JOIN (
                            SELECT count(*) AS listens, userid
                            FROM ss.readings
                            WHERE type = 'subscribed' AND
                            extract(month from time) = %s
                            AND extract(year from time) = %s
                            GROUP BY userid) c ON c.userid = ss.readings.userid
                        WHERE type = 'subscribed'
                        AND extract(month from time) = %s
                        AND extract(year from time) = %s
                        GROUP BY storyid, c.userid, c.listens
                        ) v ON v.storyid = s.id
                    GROUP BY a.userid) AS p
                WHERE p.authorid = a.payments.authorid;''', (month, year, month, year))
        conn.commit()


def generate_authors_json():
    with conn.cursor() as cursor:
        cursor.execute(
            "SELECT name, iid FROM ss.authors JOIN ss.stories s ON s.authorid = userid WHERE s.published = 'published' GROUP BY name, iid;")
        return json.dumps({"values": [{"id": row[1], "name":{"value": row[0]}} for row in cursor.fetchall()]})


def generate_titles_json():
    with conn.cursor() as cursor:
        cursor.execute(
            "SELECT title, id FROM ss.stories WHERE published = 'published';")
        return json.dumps({"values": [{"id": row[1], "name":{"value": row[0]}} for row in cursor.fetchall()]})


def require_admin(token, cursor):
    values = get_user_and_auth(token, cursor)
    if values['access'] != 'admin':
        raise DBError(403, 'Insufficient Privileges')
    return values


def require_moderator(token, cursor):
    values = get_user_and_auth(token, cursor)
    if values['access'] != 'admin' and values['access'] != 'moderator':
        raise DBError(403, 'Insufficient Privileges')
    return values


def get_user_and_auth(token, cursor):
    cursor.execute(
        'SELECT userid, access_level FROM a.moderator_tokens WHERE token = %s AND expiration > NOW()', (token,))
    result = cursor.fetchone()
    if result:
        return dict(userid=result[0], access=result[1])
    raise DBError(403, "Unauthorized user")
