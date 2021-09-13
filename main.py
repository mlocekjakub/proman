from flask import Flask, render_template, url_for, session, redirect, request
from dotenv import load_dotenv
from util import json_response
import mimetypes
import queires
import util

mimetypes.add_type('application/javascript', '.js')
app = Flask(__name__)
load_dotenv()
app.secret_key = "GoodAfternoonVietnam"


@app.route("/")
def index():
    """
    This is a one-pager which shows all the boards and cards
    """
    return render_template('index.html')


@app.route("/api/boards")
@json_response
def get_boards():
    """
    All the boards
    """
    return queires.get_boards()


@app.route("/api/boards/<int:board_id>/cards/")
@json_response
def get_cards_for_board(board_id: int):
    """
    All cards that belongs to a board
    :param board_id: id of the parent board
    """
    return queires.get_cards_for_board(board_id)


def main():
    app.run(debug=True)

    # Serving the favicon
    with app.app_context():
        app.add_url_rule('/favicon.ico', redirect_to=url_for('static', filename='favicon/favicon.ico'))


@app.route('/register', methods=['POST', 'GET'])
def register():
    if request.method == 'POST':
        if not queires.check_if_user_in_database(request.form['email']):
            email = request.form['email']
            password = util.hash_password(request.form['password'])
            queires.save_user(email, password)
            return render_template('register.html', after_register=True)
        else:
            return render_template('register.html', username_taken=True)
    return render_template('register.html')


@app.route('/login', methods=['POST', 'GET'])
def login():
    if request.method == 'POST':
        if queires.check_if_user_in_database(request.form['email']):
            password = request.form['password']
            saved_password = queires.get_password_by_email(request.form['email'])['password']
            if util.verify_password(password, saved_password):
                user = request.form['email']
                username = user.split('@')
                user_id = queires.find_user_id_by_email(user)
                session['id'] = user_id['id']
                session['user'] = user
                session['username'] = username[0]
                return redirect('/')
            else:
                return render_template('login.html', wrong_data=True)
        else:
            return render_template('login.html', wrong_data=True)
    return render_template('login.html')


@app.route("/logout")
def logout():
    session.pop("id", None)
    session.pop("user", None)
    return redirect('/')


if __name__ == '__main__':
    main()
