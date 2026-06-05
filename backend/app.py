from flask import Flask, request, jsonify, send_from_directory
from board import Board
from ai import minimax
import math
import os
import random
import numpy as np

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
    mode = data.get("mode", "HUMAN_VS_AI")
    col = data.get("col")

    # ZMIANA: Pobieramy głębokość algorytmu wysłaną z frontend-u, domyślnie 4
    depth = int(data.get("depth", 4))

    # ---- TRYB 1: CZŁOWIEK VS AI ----
    if mode == "HUMAN_VS_AI":
        if col is None or not board.is_valid_location(col):
            return jsonify({"player": None, "ai": None, "winner": None})

        player_row = board.get_next_open_row(col)
        board.drop_piece(player_row, col, 1)

        if board.winning_move(1):
            return jsonify({"player": {"row": player_row, "col": col}, "ai": None, "winner": "PLAYER"})
        if board.is_draw():
            return jsonify({"player": {"row": player_row, "col": col}, "ai": None, "winner": "DRAW"})

        # ZMIANA: Zastąpiliśmy liczbę '4' zmienną 'depth'
        ai_col, _ = minimax(board, depth, -math.inf, math.inf, True)
        if ai_col is None:
            valid_moves = [c for c in range(7) if board.is_valid_location(c)]
            if valid_moves: ai_col = random.choice(valid_moves)

        if ai_col is not None and board.is_valid_location(ai_col):
            ai_row = board.get_next_open_row(ai_col)
            board.drop_piece(ai_row, ai_col, 2)
        else:
            ai_row = None
            ai_col = None

        if ai_row is not None and board.winning_move(2):
            return jsonify(
                {"player": {"row": player_row, "col": col}, "ai": {"row": ai_row, "col": ai_col}, "winner": "AI"})
        if board.is_draw():
            return jsonify(
                {"player": {"row": player_row, "col": col}, "ai": {"row": ai_row, "col": ai_col}, "winner": "DRAW"})

        return jsonify(
            {"player": {"row": player_row, "col": col}, "ai": {"row": ai_row, "col": ai_col}, "winner": None})

    # ---- TRYB 2 & 3: SYMULACJE (AI VS AI / AI VS RANDOM) ----
    if mode in ["AI_VS_AI", "AI_VS_RANDOM"]:
        if board.winning_move(1) or board.winning_move(2) or board.is_draw():
            return jsonify({"sim_move": None, "winner": "GAME_OVER"})

        p1_count = np.count_nonzero(board.grid == 1)
        p2_count = np.count_nonzero(board.grid == 2)

        if p1_count == p2_count:
            swapped_board = Board()
            swapped_board.grid = board.grid.copy()
            mask1 = board.grid == 1
            mask2 = board.grid == 2
            swapped_board.grid[mask1] = 2
            swapped_board.grid[mask2] = 1

            # ZMIANA: Zastąpiliśmy liczbę '4' zmienną 'depth'
            ai_col, _ = minimax(swapped_board, depth, -math.inf, math.inf, True)
            if ai_col is None:
                valid_moves = [c for c in range(7) if board.is_valid_location(c)]
                if valid_moves: ai_col = random.choice(valid_moves)

            if ai_col is not None and board.is_valid_location(ai_col):
                row = board.get_next_open_row(ai_col)
                board.drop_piece(row, ai_col, 1)

                winner = None
                if board.winning_move(1):
                    winner = "AI_1"
                elif board.is_draw():
                    winner = "DRAW"

                return jsonify({"sim_move": {"row": row, "col": ai_col, "piece": 1}, "winner": winner})

        else:
            if mode == "AI_VS_AI":
                # ZMIANA: Zastąpiliśmy liczbę '4' zmienną 'depth'
                ai_col, _ = minimax(board, depth, -math.inf, math.inf, True)
            else:
                valid_moves = [c for c in range(7) if board.is_valid_location(c)]
                ai_col = random.choice(valid_moves) if valid_moves else None

            if ai_col is None:
                valid_moves = [c for c in range(7) if board.is_valid_location(c)]
                if valid_moves: ai_col = random.choice(valid_moves)

            if ai_col is not None and board.is_valid_location(ai_col):
                row = board.get_next_open_row(ai_col)
                board.drop_piece(row, ai_col, 2)

                winner = None
                if board.winning_move(2):
                    winner = "AI_2"
                elif board.is_draw():
                    winner = "DRAW"

                return jsonify({"sim_move": {"row": row, "col": ai_col, "piece": 2}, "winner": winner})

        return jsonify({"sim_move": None, "winner": None})


@app.route("/reset", methods=["POST"])
def reset():
    global board
    board = Board()
    return jsonify({"status": "ok"})


if __name__ == "__main__":
    app.run(debug=True)