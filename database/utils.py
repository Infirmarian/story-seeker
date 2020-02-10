# Copyright Robert Geil 2019
import psycopg2
from psycopg2 import OperationalError
import os
from dotenv import load_dotenv
import secrets

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


def get_authorization(request):
    return request.headers.get('Authorization')
