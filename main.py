
import psycopg2
from psycopg2 import sql
import time
import gzip
import csv

db_params = {
    "dbname": "major",
    "user": "test",
    "password": "test",
    "host": "13.233.124.62",
    "port": "5432",
}


def create_connection(db_params):
    return psycopg2.connect(**db_params)


def profile(func):
    def wrapper(*args, **kwargs):
        start_time = time.time()
        result = func(*args, **kwargs)
        end_time = time.time()
        execution_time = end_time - start_time
        print(f"{func.__name__} took {execution_time:.5f} seconds to run")
        return result

    return wrapper


def table_exists(connection, table_name):
    cursor = connection.cursor()
    cursor.execute(
        "SELECT EXISTS (SELECT FROM information_schema.tables WHERE table_name = %s)",
        (table_name,),
    )
    exists = cursor.fetchone()[0]
    cursor.close()
    return exists


def csv_reader_generator(file_path, encoding="utf-8"):
    with gzip.open(file_path, "rt", encoding=encoding) as gz_file:
        csv_reader = csv.reader(gz_file)
        next(csv_reader)  # Skip header row

        i = 0
        for row in csv_reader:
            if i < 94336:
                i += 1
                pass
            elif i >= 294467 and i < 374467:
                print(row)
                yield row


@profile
def read_csv_gz_and_insert(file_path, encoding="utf-8", db_params=None):
    try:
        table_name = "Books"
        connection = create_connection(db_params)

        if not table_exists(connection, table_name):
            create_table_query = sql.SQL(
                """
                CREATE TABLE {} (
                    book_id INTEGER,
                    title_without_series TEXT,
                    book_description TEXT,
                    publication_year FLOAT,
                    publisher TEXT,
                    ratings_count INTEGER,
                    book_average_rating FLOAT,
                    cover_page TEXT,
                    book_url TEXT,
                    is_ebook TEXT,
                    num_pages FLOAT
                )
                """
            ).format(sql.Identifier(table_name))

            cursor = connection.cursor()
            cursor.execute(create_table_query)
            connection.commit()
            cursor.close()

        cursor = connection.cursor()

        for i, row in enumerate(csv_reader_generator(file_path, encoding=encoding)):
            (
                book_id,
                title_without_series,
                book_description,
                publication_year,
                publisher,
                ratings_count,
                book_average_rating,
                cover_page,
                book_url,
                is_ebook,
                num_pages
            ) = row

            insert_query = sql.SQL(
                """
                INSERT INTO {} (
                    book_id,
                    title_without_series,
                    book_description,
                    publication_year,
                    publisher,
                    ratings_count,
                    book_average_rating,
                    cover_page,
                    book_url,
                    is_ebook,
                    num_pages
                ) VALUES (
                    %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s
                )
                """
            ).format(sql.Identifier(table_name))

            cursor.execute(
                insert_query,
                (
                    book_id,
                    title_without_series,
                    book_description,
                    publication_year,
                    publisher,
                    ratings_count,
                    book_average_rating,
                    cover_page,
                    book_url,
                    is_ebook,
                    num_pages
                ),
            )

            connection.commit()

    except Exception as e:
        print(e)
        connection.rollback()

    finally:
        cursor.close()
        connection.close()


# Example usage
file_path = "backend_data.csv.gz"
read_csv_gz_and_insert(file_path, encoding="utf-8", db_params=db_params)

