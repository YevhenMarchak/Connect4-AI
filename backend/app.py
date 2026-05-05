from flask import Flask, request, jsonify, send_from_directory
from board import Board
from ai import minimax
import math
import os
import random

FRONTEND_FOLDER = os.path.join(os.path.dirname(__file__), "..", "frontend")

app = Flask(__name__, static_folder=FRONTEND_FOLDER)

board = Board()


@app.route("/")
def home():
    return send_from_directory(app.static_folder, "index.html")


@app.route("/<path:path>")
def static_files(path):
    return send_from_directory(app.static_folder, path)


@app.route("/move", methods=["POST"])
def move():
    data = request.get_json()
    col = data.get("col")

    player_row = None
    ai_row = None
    ai_col = None

    # ---- RUCH GRACZA ----
    if col is not None and board.is_valid_location(col):
        player_row = board.get_next_open_row(col)
        board.drop_piece(player_row, col, 1)

    # ---- WYGRANA GRACZA ----
    if board.winning_move(1):
        return jsonify({
            "player": {"row": player_row, "col": col},
            "ai": None,
            "winner": "PLAYER"
        })

    # ---- RUCH AI ----
    ai_col, _ = minimax(board, 4, -math.inf, math.inf, True)

    if ai_col is None:
        valid_moves = [c for c in range(7) if board.is_valid_location(c)]
        if valid_moves:
            ai_col = random.choice(valid_moves)

    if ai_col is not None and board.is_valid_location(ai_col):
        ai_row = board.get_next_open_row(ai_col)
        board.drop_piece(ai_row, ai_col, 2)

    # ---- WYGRANA AI ----
    if board.winning_move(2):
        return jsonify({
            "player": {"row": player_row, "col": col},
            "ai": {"row": ai_row, "col": ai_col},
            "winner": "AI"
        })

    return jsonify({
        "player": {"row": player_row, "col": col},
        "ai": {"row": ai_row, "col": ai_col},
        "winner": None
    })


@app.route("/reset", methods=["POST"])
def reset():
    global board
    board = Board()
    return jsonify({"status": "ok"})


if __name__ == "__main__":
    app.run(debug=True)