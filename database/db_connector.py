import psycopg2
from psycopg2 import OperationalError
import os
import json

conn = None
DB_USER = os.environ['DB_USER']
DB_PASSWORD = os.environ['DB_PASSWORD']
DB_NAME = os.environ['DB_NAME']
DB_HOST = os.environ['DB_HOST']


class DBError(Exception):
    def __init__(self, status, response):
        self.status = status
        self.response = json.dumps({'error': response})


def __connect_to_db():
    global conn
    conn = psycopg2.connect(user=DB_USER,
                            password=DB_PASSWORD,
                            host=DB_HOST,
                            port='5432',
                            database=DB_NAME)


def query(func, *args, **kwargs):
    if conn is None:
        __connect_to_db()
    try:
        return func(*args, **kwargs)
    except OperationalError:
        __connect_to_db()
        return func(*args, **kwargs)


def get_pending(auth: str):
    print(auth)
    with conn.cursor() as cursor:
        cursor.execute(
            '''SELECT * FROM ss.stories WHERE published = 'pending' ORDER BY last_modified DESC''')
    return None


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


def get_user_and_auth(token, cursor):
    # cursor.execute(
    #    'SELECT userid, authorization FROM a.tokens WHERE token = %s AND expiration > NOW()', (token,))
    result = ['abcd', 'admin']  # cursor.fetchone()
    if result:
        result = dict(userid=result[0], access=result[1])
    return result
