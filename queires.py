import connection
import data_manager


def get_card_status(status_id):
    status = data_manager.execute_select(
        """
        SELECT * FROM statuses s
        WHERE s.id = %(status_id)s
        ;
        """
        , {"status_id": status_id})
    return status


def get_statuses_for_board():
    statuses = data_manager.execute_select(
        """
        SELECT id, title 
        FROM statuses
        order by statuses.id ASC;
        """)
    return statuses


@connection.connection_handler
def add_new_board(cursor, board_title):
    status = """
        INSERT INTO boards(title)
        VALUES (%(title)s);
        """
    arguments = {"title": board_title}
    cursor.execute(status, arguments)


def find_last_card_in_board_by_order(board_id):
    status = data_manager.execute_select(
        """
        SELECT MAX(cards.card_order)+1 as order
        FROM cards 
        WHERE cards.board_id = (%(board_id)s);
        """
        , {"board_id": board_id})
    return status


@connection.connection_handler
def add_new_card(cursor, title, board_id, card_order):
    status = """
        INSERT INTO cards(board_id,title,card_order)
        VALUES (%(board_id)s, %(title)s, %(card_order)s);
    """
    arguments = {"board_id": board_id, "title": title, "card_order": card_order}
    cursor.execute(status, arguments)


def get_boards():
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
    matching_cards = data_manager.execute_select(
        """
        SELECT * FROM cards
        WHERE cards.board_id = %(board_id)s
        ORDER BY cards.card_order
        ;
        """
        , {"board_id": board_id})
    return matching_cards


@connection.connection_handler
def check_if_user_in_database(cursor, email):
    query = """ SELECT * 
                FROM users 
                WHERE username = %(email)s
            """
    arguments = {"email": email}
    cursor.execute(query, arguments)
    result = cursor.fetchone()
    return result


@connection.connection_handler
def change_card_status(cursor, card_id, status_id, card_order):
    query = """ 
        UPDATE cards 
        SET status_id = %(status_id)s, card_order = %(card_order)s
        WHERE id = %(card_id)s
        """
    arguments = {"card_id": card_id, "status_id": status_id, "card_order": card_order}
    cursor.execute(query, arguments)


@connection.connection_handler
def change_card_name(cursor, card_id, title):
    query = """ 
        UPDATE cards 
        SET title = %(title)s
        WHERE id = %(card_id)s
        """
    arguments = {"card_id": card_id, "title": title}
    cursor.execute(query, arguments)


@connection.connection_handler
def change_card_order(cursor, card_order, board_id):
    query = """
    UPDATE cards
    SET card_order = card_order + 1
    where status_id = 1 and card_order >= %(card_order)s and board_id = %(board_id)s
    """
    arguments = {"card_order": card_order, "board_id": board_id}
    cursor.execute(query, arguments)


@connection.connection_handler
def find_user_id_by_email(cursor, email):
    query = """SELECT id
                FROM users
                WHERE username = %(email)s
            """
    arguments = {"email": email}
    cursor.execute(query, arguments)
    return cursor.fetchone()


@connection.connection_handler
def save_user(cursor, email, password):
    query = """INSERT INTO users(username,password)
                VALUES  (%(email)s, %(password)s)  
            """
    arguments = {"email": email, "password": password}
    return cursor.execute(query, arguments)


@connection.connection_handler
def get_password_by_email(cursor, email):
    query = """SELECT password
                FROM users
                WHERE username = %(email)s
            """
    arguments = {"email": email}
    cursor.execute(query, arguments)
    result = cursor.fetchone()
    return result
