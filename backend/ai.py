import math
import random
import numpy as np
from constants import *

# ---- OCENA OKNA 4 POL ----
def evaluate_window(window, piece):
    score = 0
    opp = PLAYER if piece == AI else AI

    if window.count(piece) == 4:
        score += 100
    elif window.count(piece) == 3 and window.count(EMPTY) == 1:
        score += 10
    elif window.count(piece) == 2 and window.count(EMPTY) == 2:
        score += 5

    if window.count(opp) == 3 and window.count(EMPTY) == 1:
        score -= 80

    return score


# ---- OCENA CAŁEJ PLANSZY ----
def score_position(board, piece):
    score = 0
    grid = board.grid

    # preferuj środek
    center_array = [int(i) for i in list(grid[:, COLUMNS//2])]
    score += center_array.count(piece) * 6

    # poziomo
    for r in range(ROWS):
        row_array = [int(i) for i in list(grid[r, :])]
        for c in range(COLUMNS-3):
            window = row_array[c:c+4]
            score += evaluate_window(window, piece)

    # pionowo
    for c in range(COLUMNS):
        col_array = [int(i) for i in list(grid[:, c])]
        for r in range(ROWS-3):
            window = col_array[r:r+4]
            score += evaluate_window(window, piece)

    return score


# ---- MINIMAX ----
def minimax(board, depth, alpha, beta, maximizing):
    valid_moves = [c for c in range(COLUMNS) if board.is_valid_location(c)]

    if depth == 0 or len(valid_moves) == 0:
        return (None, score_position(board, AI))

    if maximizing:
        value = -math.inf
        column = random.choice(valid_moves)

        for col in valid_moves:
            row = board.get_next_open_row(col)
            b_copy = board.grid.copy()
            board.drop_piece(row, col, AI)

            new_score = minimax(board, depth-1, alpha, beta, False)[1]

            board.grid = b_copy

            if new_score > value:
                value = new_score
                column = col

            alpha = max(alpha, value)
            if alpha >= beta:
                break

        return column, value

    else:
        value = math.inf
        column = random.choice(valid_moves)

        for col in valid_moves:
            row = board.get_next_open_row(col)
            b_copy = board.grid.copy()
            board.drop_piece(row, col, PLAYER)

            new_score = minimax(board, depth-1, alpha, beta, True)[1]

            board.grid = b_copy

            if new_score < value:
                value = new_score
                column = col

            beta = min(beta, value)
            if alpha >= beta:
                break

        return column, value