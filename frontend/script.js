const board = document.getElementById("board");
const statusText = document.getElementById("status");
const timerText = document.getElementById("timer");

let grid = Array(6).fill().map(() => Array(7).fill(0));
let gameOver = false;
let isProcessing = false;

// TRYB GRY, GŁĘBOKOŚĆ I INTERWAŁ SYMULACJI
let gameMode = "HUMAN_VS_AI";
let aiDepth = 4; // Domyślna głębokość
let simInterval = null;

// SCORE
let playerScore = 0;
let aiScore = 0;

// TIMER
let timeLeft = 30;
let timerInterval = null;

function updateScore() {
  document.getElementById("playerScore").innerText = playerScore;
  document.getElementById("aiScore").innerText = aiScore;
}

function startTimer() {
  clearInterval(timerInterval);
  if (gameMode !== "HUMAN_VS_AI") {
    timerText.style.display = "none";
    return;
  }
  timerText.style.display = "block";
  timeLeft = 30;
  timerText.innerText = timeLeft + "s";

  timerInterval = setInterval(() => {
    if (gameOver) {
      clearInterval(timerInterval);
      return;
    }

    timeLeft--;
    timerText.innerText = timeLeft + "s";

    if (timeLeft <= 0) {
      clearInterval(timerInterval);
      gameOver = true;
      aiScore++;
      updateScore();
      statusText.innerText = "KONIEC CZASU! AI WYGRYWA";
    }
  }, 1000);
}

function startSimulation() {
  clearInterval(simInterval);
  simInterval = setInterval(async () => {
    if (gameOver || isProcessing) return;
    isProcessing = true;

    statusText.innerText = "SYMULACJA W TOKU...";

    try {
        const res = await fetch("/move", {
          method: "POST",
          headers: {"Content-Type": "application/json"},
          // ZMIANA: Wysyłamy głębokość przeszukiwania do serwera
          body: JSON.stringify({ mode: gameMode, depth: aiDepth })
        });
        const data = await res.json();

        if (data.sim_move) {
          grid[data.sim_move.row][data.sim_move.col] = data.sim_move.piece;
          draw();
        }

        if (data.winner) {
          gameOver = true;
          clearInterval(simInterval);

          if (data.winner === "AI_1") {
            playerScore++;
            statusText.innerText = gameMode === "AI_VS_AI" ? "AI 1 (Minimax) WYGRYWA!" : "AI (Minimax) WYGRYWA!";
          } else if (data.winner === "AI_2") {
            aiScore++;
            statusText.innerText = gameMode === "AI_VS_AI" ? "AI 2 (Minimax) WYGRYWA!" : "AGENT LOSOWY WYGRYWA!";
          } else {
            statusText.innerText = "REMIS!";
          }
          updateScore();
        }
    } catch (error) {
        console.error("Błąd podczas symulacji:", error);
        clearInterval(simInterval);
    }
    isProcessing = false;
  }, 600);
}

// RYSOWANIE
function draw() {
  board.innerHTML = "";
  for (let r = 5; r >= 0; r--) {
    for (let c = 0; c < 7; c++) {
      let cell = document.createElement("div");
      cell.classList.add("cell");

      if (grid[r][c] === 1) cell.classList.add("player");
      if (grid[r][c] === 2) cell.classList.add("ai");

      cell.dataset.col = c;
      board.appendChild(cell);
    }
  }
}

// RUCH CZŁOWIEKA
async function makeMove(col) {
  if (gameOver || isProcessing || gameMode !== "HUMAN_VS_AI") return;
  isProcessing = true;
  statusText.innerText = "AI MYŚLI...";

  const res = await fetch("/move", {
    method: "POST",
    headers: {"Content-Type": "application/json"},
    // ZMIANA: Wysyłamy głębokość przeszukiwania do serwera
    body: JSON.stringify({ col: col, mode: gameMode, depth: aiDepth })
  });
  const data = await res.json();

  if (data.player && data.player.row !== null) {
    grid[data.player.row][data.player.col] = 1;
  }
  if (data.ai && data.ai.row !== null) {
    grid[data.ai.row][data.ai.col] = 2;
  }

  draw();

  if (!data.winner) {
    statusText.innerText = "TWOJA TURA";
    startTimer();
  }

  if (data.winner) {
    gameOver = true;
    clearInterval(timerInterval);

    if (data.winner === "PLAYER") {
      playerScore++;
      statusText.innerText = "WYGRAŁEŚ!";
    } else if (data.winner === "AI") {
      aiScore++;
      statusText.innerText = "AI (Minimax) WYGRYWA!";
    } else {
      statusText.innerText = "REMIS!";
    }
    updateScore();
  }
  isProcessing = false;
}

// CLICK
board.addEventListener("click", (e) => {
  if (gameMode !== "HUMAN_VS_AI" || !e.target.classList.contains("cell")) return;
  const col = parseInt(e.target.dataset.col);
  makeMove(col);
});

// RESET
async function resetGame() {
  clearInterval(simInterval);
  clearInterval(timerInterval);

  await fetch("/reset", { method: "POST" });
  grid = Array(6).fill().map(() => Array(7).fill(0));
  gameOver = false;
  isProcessing = false;
  draw();

  if (gameMode === "HUMAN_VS_AI") {
    statusText.innerText = "TWOJA TURA";
    startTimer();
  } else {
    startSimulation();
  }
}

// START GRY Z WYBRANYM TRYBEM
async function startGame(mode) {
  gameMode = mode;
  // ZMIANA: Pobranie poziomu trudności (głębokości) z selecta
  aiDepth = parseInt(document.getElementById("difficultySelect").value);

  clearInterval(simInterval);
  clearInterval(timerInterval);

  await fetch("/reset", { method: "POST" });
  grid = Array(6).fill().map(() => Array(7).fill(0));
  gameOver = false;
  isProcessing = false;

  playerScore = 0;
  aiScore = 0;
  updateScore();

  draw();

  const input = document.getElementById("nicknameInput").value;
  let nickname = input || "Ty";

  if (gameMode === "HUMAN_VS_AI") {
    document.getElementById("playerName").innerText = nickname;
    document.getElementById("aiName").innerText = "AI (Minimax)";
    statusText.innerText = "TWOJA TURA";
    startTimer();
  } else if (gameMode === "AI_VS_AI") {
    document.getElementById("playerName").innerText = "AI 1 (Minimax)";
    document.getElementById("aiName").innerText = "AI 2 (Minimax)";
    startSimulation();
  } else if (gameMode === "AI_VS_RANDOM") {
    document.getElementById("playerName").innerText = "AI (Minimax)";
    document.getElementById("aiName").innerText = "Agent Losowy";
    startSimulation();
  }

  document.getElementById("startScreen").style.display = "none";
  document.getElementById("gameUI").style.display = "flex";
}

// POWRÓT DO MENU GŁÓWNEGO
function backToMenu() {
  clearInterval(simInterval);
  clearInterval(timerInterval);
  isProcessing = false;
  gameOver = true;

  document.getElementById("gameUI").style.display = "none";
  document.getElementById("startScreen").style.display = "flex";
}

// LOGIKA SPADANIA HINTÓW
function getDropRow(col) {
  for (let r = 0; r < 6; r++) {
    if (grid[r][col] === 0) return r;
  }
  return null;
}

// HOVER
board.addEventListener("mousemove", (e) => {
  if (gameMode !== "HUMAN_VS_AI" || !e.target.classList.contains("cell")) return;

  const col = parseInt(e.target.dataset.col);
  const row = getDropRow(col);

  document.querySelectorAll(".hover").forEach(c => c.classList.remove("hover"));
  if (row !== null) {
    const cells = document.querySelectorAll(".cell");
    const index = (5 - row) * 7 + col;
    cells[index].classList.add("hover");
  }
});

draw();