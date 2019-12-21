# Copyright Robert Geil 2019
import psycopg2
from psycopg2 import OperationalError
import os
from dotenv import load_dotenv
load_dotenv()

DB_USER = os.environ['DB_USER']
DB_PASSWORD = os.environ['DB_PASSWORD']
DB_NAME = os.environ['DB_NAME']
DB_HOST = os.environ['DB_HOST']
conn = None


def connect_to_db():
    global conn
    conn = psycopg2.connect(user=DB_USER,
                            password=DB_PASSWORD,
                            host=DB_HOST,
                            port='5432',
                            database=DB_NAME)


def compile_titles() -> None:
    with open('catalog/titles.json', 'w') as f:
        f.write('{"values": [')
        with conn.cursor() as cursor:
            cursor.execute(
                "SELECT title, id FROM ss.stories WHERE published = 'published';")
            row = cursor.fetchone()
            comma = ''
            while row:
                f.write('''%s{
                    "id": "%s",
                    "name": {
                    "value": "%s"
                    } 
                }''' % (comma, row[1], row[0]))
                comma = ','
                row = cursor.fetchone()
        f.write(']}\n')


def compile_authors() -> None:
    with open('catalog/authors.json', 'w') as f:
        f.write('{"values": [')
        with conn.cursor() as cursor:
            cursor.execute(
                "SELECT name FROM ss.authors JOIN ss.stories s ON s.authorid = userid WHERE s.published = 'published' GROUP BY name;")
            row = cursor.fetchone()
            comma = ''
            while row:
                f.write('''%s{
"id": "%s",
"name": {
    "value": "%s"
    }
}''' % (comma, row[0], row[0]))
                comma = ','
                row = cursor.fetchone()
        f.write(']}\n')


def generate_monthly_author_payments(month, year, repeat=False):
    try:
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
    except OperationalError as e:
        if repeat:
            raise e
        connect_to_db()
        return generate_monthly_author_payments(month, year, True)
