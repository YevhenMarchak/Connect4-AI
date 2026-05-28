import numpy as np
from constants import *

class Board:
    def __init__(self):
        self.grid = np.zeros((ROWS, COLUMNS))

    def drop_piece(self, row, col, piece):
        self.grid[row][col] = piece

    def is_valid_location(self, col):
        return self.grid[ROWS - 1][col] == 0

    def get_next_open_row(self, col):
        for r in range(ROWS):
            if self.grid[r][col] == 0:
                return r
        return None

    def winning_move(self, piece):

        # poziomo
        for c in range(COLUMNS - 3):
            for r in range(ROWS):
                if (
                    self.grid[r][c] == piece and
                    self.grid[r][c + 1] == piece and
                    self.grid[r][c + 2] == piece and
                    self.grid[r][c + 3] == piece
                ):
                    return True

        # pionowo
        for c in range(COLUMNS):
            for r in range(ROWS - 3):
                if (
                    self.grid[r][c] == piece and
                    self.grid[r + 1][c] == piece and
                    self.grid[r + 2][c] == piece and
                    self.grid[r + 3][c] == piece
                ):
                    return True

        # dodatnie przekątne
        for c in range(COLUMNS - 3):
            for r in range(ROWS - 3):
                if (
                    self.grid[r][c] == piece and
                    self.grid[r + 1][c + 1] == piece and
                    self.grid[r + 2][c + 2] == piece and
                    self.grid[r + 3][c + 3] == piece
                ):
                    return True

        # ujemne przekątne
        # ujemne przekątne
        for c in range(COLUMNS - 3):
            for r in range(3, ROWS):
                if (
                    self.grid[r][c] == piece and
                    self.grid[r - 1][c + 1] == piece and
                    self.grid[r - 2][c + 2] == piece and
                    self.grid[r - 3][c + 3] == piece
                ):
                    return True

        return False

    def is_draw(self):
        for c in range(COLUMNS):
            if self.grid[ROWS - 1][c] == 0:
                return False
        return True