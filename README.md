Module Description
### `app.py` 

Entry point of the application.

Responsible for initializing and running the Flask server.

Handles API endpoints (/move, /reset) and different game modes (Human vs AI, AI vs AI, AI vs Random).

Processes dynamic AI difficulty (depth) levels.
### `board.py'

Core module responsible for board representation and operations:

    maintaining the game state (7×6 grid)

    handling piece placement (simulating gravity)

    validating moves

    detecting terminal states (win conditions and draws)

### `ai.py'

Implements artificial intelligence algorithms:

    Minimax algorithm with immediate terminal node checking

    Alpha-beta pruning for performance optimization

    advanced heuristic evaluation function (scoring horizontal, vertical, and diagonal windows)

    selecting the optimal move based on the provided depth

### `constants.py'

Contains project-wide constants such as:

    board dimensions

    player and piece identifiers

    default algorithm parameters

### `frontend (HTML, CSS, JavaScript)'

Responsible for user interaction and UI:

    displaying the start screen with game mode and difficulty selection

    rendering the interactive game board

    handling user input (mouse clicks, hover effects)

    running automatic simulation loops for bot matches (AI vs AI / AI vs Random)

    communicating with backend via HTTP (API /move and /reset)

    displaying live game state, timers, scores, and final results

## Program Flow

    The application starts in app.py

    The frontend is loaded in the browser

    The user selects a game mode, AI difficulty, and clicks "Start"

    Depending on the mode: the user makes a move (clicks on a column) OR the frontend automatically triggers a simulation step

    The frontend sends a request to /move containing the move, mode, and depth

    The backend updates the board (board.py)

    The AI computes the best move (ai.py) using the Minimax algorithm

    The updated game state (including bot moves and winner status) is returned to the frontend

    The frontend updates the UI and the game loop continues

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
