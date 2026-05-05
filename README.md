##Module Description
###app.py

Entry point of the application.
Responsible for initializing and running the Flask server.

###board.py

Core module responsible for board representation and operations:

maintaining the game state (7×6 grid)
handling piece placement
validating moves
detecting win conditions
###ai.py

Implements artificial intelligence algorithms:

Minimax algorithm
Alpha-beta pruning optimization
heuristic evaluation function
selecting the best move
###constants.py

Contains project-wide constants such as:

board dimensions
player identifiers
algorithm parameters
frontend (HTML, CSS, JavaScript)

Responsible for user interaction:

rendering the game board
handling player input (mouse clicks)
sending requests to the backend
displaying the current game state
###Program Flow
1.The application starts in app.py
2.The frontend is loaded in the browser
3.The player makes a move by clicking on a column
4.The frontend sends a request to the backend (/move)
5.The backend updates the board using board.py
6.The AI computes the best move using ai.py
7.The updated game state is returned to the frontend
8.The frontend updates the board and the game continues
