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


def get_boards():
    """
    Gather all boards
    :return:
    """
    # # remove this code once you implement the database
    # return [{"title": "board1", "id": 1}, {"title": "board2", "id": 2}]

    return data_manager.execute_select(
        """
        SELECT * FROM boards
        ;
        """
    )


def get_cards_for_board(board_id):
    # remove this code once you implement the database
    # return [{"title": "title1", "id": 1}, {"title": "board2", "id": 2}]

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

