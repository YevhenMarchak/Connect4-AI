import math
import random
import numpy as np
from constants import *
from board import Board


# ---- NOWA FUNKCJA: SPRAWDZANIE STANÓW KOŃCOWYCH ----
def is_terminal_node(board):
    return board.winning_move(PLAYER) or board.winning_move(AI) or len([c for c in range(COLUMNS) if board.is_valid_location(c)]) == 0


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

    # Poprawka: AI potężnie karze sytuacje, w których przeciwnik ma 4 lub 3 klocki
    if window.count(opp) == 4:
        score -= 1000
    elif window.count(opp) == 3 and window.count(EMPTY) == 1:
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

    # DODANO: dodatnie przekątne
    for r in range(ROWS-3):
        for c in range(COLUMNS-3):
            window = [grid[r+i][c+i] for i in range(4)]
            score += evaluate_window(window, piece)

    # DODANO: ujemne przekątne
    for r in range(ROWS-3):
        for c in range(COLUMNS-3):
            window = [grid[r+3-i][c+i] for i in range(4)]
            score += evaluate_window(window, piece)

    return score


# ---- MINIMAX ----
def minimax(board, depth, alpha, beta, maximizing):
    valid_moves = [c for c in range(COLUMNS) if board.is_valid_location(c)]
    is_terminal = is_terminal_node(board)

    # KONIEC - sprawdzamy wygraną natychmiast!
    if depth == 0 or is_terminal:
        if is_terminal:
            if board.winning_move(AI):
                return (None, 10000000) # AI widzi wygraną
            elif board.winning_move(PLAYER):
                return (None, -10000000) # AI widzi przegraną
            else: # remis
                return (None, 0)
        else:
            return (None, score_position(board, AI))

    # ---- MAX (AI) ----
    if maximizing:
        value = -math.inf
        best_col = random.choice(valid_moves)

        for col in valid_moves:
            row = board.get_next_open_row(col)

            temp_board = Board()
            temp_board.grid = board.grid.copy()

            temp_board.drop_piece(row, col, AI)

            new_score = minimax(temp_board, depth-1, alpha, beta, False)[1]

            if new_score > value:
                value = new_score
                best_col = col

            alpha = max(alpha, value)
            if alpha >= beta:
                break

        return best_col, value

    # ---- MIN (GRACZ) ----
    else:
        value = math.inf
        best_col = random.choice(valid_moves)

        for col in valid_moves:
            row = board.get_next_open_row(col)

            temp_board = Board()
            temp_board.grid = board.grid.copy()

            temp_board.drop_piece(row, col, PLAYER)

            new_score = minimax(temp_board, depth-1, alpha, beta, True)[1]

            if new_score < value:
                value = new_score
                best_col = col

            beta = min(beta, value)
            if alpha >= beta:
                break

        return best_col, value