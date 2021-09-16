import data_manager
import connection


def get_card_status(status_id):
    """
    Find the first status matching the given id
    :param status_id:
    :return: str
    """
    status = data_manager.execute_select(
        """
        SELECT * FROM statuses s
        WHERE s.id = %(status_id)s
        ;
        """
        , {"status_id": status_id})

    return status


def get_statuses_for_board(board_id):
    status = data_manager.execute_select(
    """
    SELECT statuses.id, statuses.title FROM statuses
    JOIN cards on statuses.id = cards.status_id
    JOIN boards on cards.board_id = %(board_id)s
    group by statuses.id
    order by statuses.id ASC
    ;
    """
        , {"board_id": board_id})
    return status


def get_boards():
    """
    Gather all boards
    :return:
    """
    return data_manager.execute_select(
        """
        SELECT * FROM boards
        ;
        """
    )


@connection.connection_handler
def delete_board(cursor, board_id):
    query = """
                DELETE FROM boards
                WHERE id = %(b_i)s;
            """
    arguments = {"b_i": board_id}
    cursor.execute(query, arguments)


@connection.connection_handler
def delete_cards_by_board(cursor, board_id):
    query = """
                DELETE FROM cards
                WHERE board_id = %(b_i)s;
            """
    arguments = {"b_i": board_id}
    cursor.execute(query, arguments)


@connection.connection_handler
def delete_card(cursor, card_id):
    query = """
                DELETE FROM cards
                WHERE id = %(i)s;
            """
    arguments = {"i": card_id}
    cursor.execute(query, arguments)


def get_cards_for_board(board_id):
    # remove this code once you implement the database

    matching_cards = data_manager.execute_select(
        """
        SELECT * FROM cards
        WHERE cards.board_id = %(board_id)s
        ;
        """
        , {"board_id": board_id})

    return matching_cards


@connection.connection_handler
def check_if_user_in_database(cursor, email):
    query = f""" SELECT * 
                FROM users 
                WHERE username = '{email}'

            """
    cursor.execute(query)
    result = cursor.fetchone()
    return result


@connection.connection_handler
def find_user_id_by_email(cursor, email):
    query = f"""SELECT id
                FROM users
                WHERE username = '{email}'
            """
    cursor.execute(query)
    return cursor.fetchone()


@connection.connection_handler
def save_user(cursor, email, password):
    query = f"""INSERT INTO users(username,password)
                VALUES  ('{email}', '{password}')  

            """
    return cursor.execute(query)


@connection.connection_handler
def get_password_by_email(cursor, email):
    query = f"""SELECT password
                FROM users
                WHERE username = '{email}' 
            """
    cursor.execute(query)
    result = cursor.fetchone()
    return result

