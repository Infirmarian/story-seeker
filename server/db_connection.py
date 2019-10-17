import os
import psycopg2
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
print("Successfully connected to database!")
def register_author(firstname, lastname):
    request = 'INSERT INTO ss.authors (firstname, lastname) VALUES (%s, %s);'
    with conn.cursor() as cur:
        try:
            cur.execute(request, (firstname, lastname))
            return 200
        except Exception as e:
            print("Failed to enter to the database... %s" % e)
            return 500
