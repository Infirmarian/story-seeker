# Copyright Robert Geil 2019
from dotenv import load_dotenv
load_dotenv()
import os
import psycopg2

DB_USER=os.environ['DB_USER']
DB_PASSWORD=os.environ['DB_PASSWORD']
DB_NAME=os.environ['DB_NAME']
DB_HOST=os.environ['DB_HOST']
conn = psycopg2.connect(user = DB_USER,
                        password = DB_PASSWORD,
                        host = DB_HOST,
                        port = '5432',
                        database = DB_NAME)
            
def compile_titles():
    with open('catalog/titles.json', 'w') as f:
        f.write('{"values": [')
        with conn.cursor() as cursor:
            cursor.execute("SELECT title, id FROM ss.stories WHERE published = 'published';")
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

def compile_authors():
    with open('catalog/authors.json', 'w') as f:
        f.write('{"values": [')
        with conn.cursor() as cursor:
            cursor.execute('SELECT name, userid FROM ss.authors;')
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