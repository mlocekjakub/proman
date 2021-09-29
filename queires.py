import data_manager


def get_card_status(status_id):
    return data_manager.execute_select(
        """
        SELECT * FROM statuses
        WHERE statuses.id = %(status_id)s
        ;
        """, {"status_id": status_id})


def get_status_id(board_id):
    return data_manager.execute_select("""
    SELECT MIN(id) as id
    FROM statuses
    WHERE board_id = %(board_id)s
    """, {"board_id": board_id})


def get_statuses_for_board(board_id):
    return data_manager.execute_select(
        """
        SELECT id, title 
        FROM statuses
        WHERE board_id = %(board_id)s 
        order by statuses.id ASC;
        """, {"board_id": board_id})


def add_new_board(board_title):
    return data_manager.execute_dml_statement(
        """
        INSERT INTO boards(title)
        VALUES (%(title)s)
        RETURNING id;
        """, {"title": board_title})


def add_new_column(column_title, board_id):
    return data_manager.execute_dml_statement("""
        INSERT INTO statuses(title, board_id)
        VALUES (%(column_title)s, %(board_id)s)
    """, {"column_title": column_title, "board_id": board_id})


def change_column_name(column_title, column_id):
    return data_manager.execute_dml_statement("""
        UPDATE statuses 
        SET title = %(column_title)s
        WHERE id = %(column_id)s
    """, {"column_title": column_title, "column_id": column_id})


def find_last_card_in_board_by_order(board_id):
    return data_manager.execute_select(
        """
        SELECT MAX(cards.card_order)+1 as order
        FROM cards 
        WHERE cards.board_id = (%(board_id)s);
    """, {"board_id": board_id})


def add_new_card(title, board_id, card_order, status_id):
    data_manager.execute_dml_statement(
        """
        INSERT INTO cards(board_id,title,card_order, status_id)
        VALUES (%(board_id)s, %(title)s, %(card_order)s, %(status_id)s);
        """, {"board_id": board_id, "title": title, "card_order": card_order, "status_id": status_id})


def get_boards():
    return data_manager.execute_select(
        """
        SELECT * FROM boards
        ORDER BY id;
        """)


def delete_board(board_id):
    data_manager.execute_dml_statement(
        """
        DELETE FROM boards
        WHERE id = %(board_id)s;
        """, {"board_id": board_id})


def delete_cards_by_board(board_id):
    data_manager.execute_dml_statement(
        """
        DELETE FROM cards
        WHERE board_id = %(board_id)s;
        """, {"board_id": board_id})


def delete_status_by_board(board_id):
    data_manager.execute_dml_statement(
        """
        DELETE FROM statuses
        WHERE board_id = %(board_id)s;
        """, {"board_id": board_id})


def delete_card(card_id):
    data_manager.execute_dml_statement(
        """
        DELETE FROM cards
        WHERE id = %(card_id)s;
        """, {"card_id": card_id})


def archive_card(card_id, archived_status):
    data_manager.execute_dml_statement(
        """
        UPDATE cards
        SET archived = %(archived_status)s
        WHERE id = %(card_id)s 
        """, {"card_id": card_id, "archived_status": archived_status})


def get_cards_for_board(board_id):
    return data_manager.execute_select(
        """
        SELECT * FROM cards
        WHERE cards.board_id = %(board_id)s
        ORDER BY cards.card_order;
        """, {"board_id": board_id})


def check_if_user_in_database(email):
    return data_manager.execute_select(
        """ 
        SELECT * 
        FROM users 
        WHERE username = %(email)s
        """, {"email": email})


def change_card_status(card_id, status_id, card_order):
    data_manager.execute_dml_statement(
        """ 
        UPDATE cards 
        SET status_id = %(status_id)s, card_order = %(card_order)s
        WHERE id = %(card_id)s
        """, {"card_id": card_id, "status_id": status_id, "card_order": card_order})


def change_card_name(card_id, title):
    data_manager.execute_dml_statement(
        """ 
        UPDATE cards 
        SET title = %(title)s
        WHERE id = %(card_id)s
        """, {"card_id": card_id, "title": title})


def change_board_name(board_id, title):
    return data_manager.execute_dml_statement(""" 
        UPDATE boards 
        SET title = %(title)s
        WHERE id = %(board_id)s
        """, {"board_id": board_id, "title": title})


def change_card_order(card_order, board_id):
    data_manager.execute_dml_statement(
        """
        UPDATE cards
        SET card_order = card_order + 1
        where status_id = 1 and card_order >= %(card_order)s and board_id = %(board_id)s
        """, {"card_order": card_order, "board_id": board_id})


def find_user_id_by_email(email):
    return data_manager.execute_select(
        """
        SELECT id
        FROM users
        WHERE username = %(email)s
        """, {"email": email})


def save_user(email, password):
    data_manager.execute_dml_statement(
        """
        INSERT INTO users(username,password)
        VALUES  (%(email)s, %(password)s)  
        """, {"email": email, "password": password})


def get_password_by_email(email):
    return data_manager.execute_select(
        """
        SELECT password
        FROM users
        WHERE username = %(email)s
        """, {"email": email})
