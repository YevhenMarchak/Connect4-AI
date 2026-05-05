## Module Description

### `app.py`
Entry point of the application.  
Responsible for initializing and running the Flask server.  

### `board.py`
Core module responsible for board representation and operations:  
- maintaining the game state (7×6 grid)  
- handling piece placement  
- validating moves  
- detecting win conditions  

### `ai.py`
Implements artificial intelligence algorithms:  
- Minimax algorithm  
- Alpha-beta pruning  
- heuristic evaluation function  
- selecting the best move  

### `constants.py`
Contains project-wide constants such as:  
- board dimensions  
- player identifiers  
- algorithm parameters  

### `frontend (HTML, CSS, JavaScript)`
Responsible for user interaction:  
- rendering the game board  
- handling user input (mouse clicks)  
- communicating with backend via HTTP (API `/move`)  
- displaying game state and results  

---

## Program Flow

1. The application starts in `app.py`  
2. The frontend is loaded in the browser  
3. The user makes a move (click on column)  
4. The frontend sends a request to `/move`  
5. The backend updates the board (`board.py`)  
6. The AI computes the best move (`ai.py`)  
7. The updated game state is returned to the frontend  
8. The frontend updates the UI and the game continues

## How to run the project
```
python -m venv venv
venv\Scripts\activate
pip install numpy (and another non-ins packeges)
cd backend
python app.py
```

Then open your browser and go to:
```
http://127.0.0.1:5000
```
  
