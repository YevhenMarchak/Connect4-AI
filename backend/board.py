import numpy as np
from constants import *

class Board:
    def __init__(self):
        self.grid = np.zeros((ROWS, COLUMNS))

    def drop_piece(self, row, col, piece):
        self.grid[row][col] = piece

    def is_valid_location(self, col):
        return self.grid[ROWS-1][col] == 0

    def get_next_open_row(self, col):
        for r in range(ROWS):
            if self.grid[r][col] == 0:
                return r

    def winning_move(self, piece):
        # poziomo
        for c in range(COLUMNS-3):
            for r in range(ROWS):
                if all(self.grid[r][c+i] == piece for i in range(4)):
                    return True

        # pionowo
        for c in range(COLUMNS):
            for r in range(ROWS-3):
                if all(self.grid[r+i][c] == piece for i in range(4)):
                    return True

        return False