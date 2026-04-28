
---

##  Module Description

### `main.py`
Entry point of the application.  
Responsible for initializing and running the main game loop.

---

### `game.py`
Handles the overall game logic:
- managing player turns  
- coordinating interaction between player and AI  
- controlling game flow  

---

### `board.py`
Core module responsible for board representation and operations:
- maintaining the game state (7×6 grid)  
- handling piece placement  
- validating moves  
- detecting win and draw conditions  

---

### `ai.py`
Implements artificial intelligence algorithms:
- Minimax algorithm  
- Alpha-beta pruning optimization  
- heuristic evaluation function  
- selecting the best move  

---

### `constants.py`
Contains project-wide constants such as:
- board dimensions  
- player identifiers  
- algorithm parameters  

---

## Program Flow

1. The application starts in `main.py`  
2. A game instance is created (`game.py`)  
3. The game uses `board.py` to manage the game state  
4. During the AI turn, `ai.py` computes the best move  
5. The move is applied to the board and the game continues  

---
