const board = document.getElementById("board");
const statusText = document.getElementById("status");

// ---- STATE ----
let grid = Array(6).fill().map(() => Array(7).fill(0));
let gameOver = false;

// ---- SCORE + USER ----
let playerScore = parseInt(localStorage.getItem("playerScore")) || 0;
let aiScore = parseInt(localStorage.getItem("aiScore")) || 0;
let nickname = localStorage.getItem("nickname") || "You";

// ---- TIMER ----
let timeLeft = 5;
let timerInterval;

// ---- RYSOWANIE ----
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

// ---- TIMER ----
function startTimer() {
  clearInterval(timerInterval);
  timeLeft = 5;

  const timerEl = document.getElementById("timer");

  timerInterval = setInterval(() => {
    timeLeft--;
    timerEl.innerText = timeLeft + "s";

    if (timeLeft <= 0) {
      clearInterval(timerInterval);
    }
  }, 1000);
}

// ---- SCORE ----
function updateScore() {
  document.getElementById("playerScore").innerText = playerScore;
  document.getElementById("aiScore").innerText = aiScore;

  localStorage.setItem("playerScore", playerScore);
  localStorage.setItem("aiScore", aiScore);
}

// ---- START ----
function startGame() {
  const input = document.getElementById("nicknameInput").value;

  if (input) {
    nickname = input;
    localStorage.setItem("nickname", nickname);
  }

  document.getElementById("playerName").innerText = nickname;

  document.getElementById("startScreen").style.display = "none";
  document.getElementById("gameUI").style.display = "block";

  updateScore();
  startTimer();
}

// ---- RUCH ----
async function makeMove(col) {
  if (gameOver) return;

  statusText.innerText = "AI THINKING...";

  const res = await fetch("/move", {
    method: "POST",
    headers: {"Content-Type": "application/json"},
    body: JSON.stringify({col})
  });

  const data = await res.json();

  // aktualizacja stanu BEZ animacji
  if (data.player) {
    grid[data.player.row][data.player.col] = 1;
  }

  if (data.ai) {
    grid[data.ai.row][data.ai.col] = 2;
  }

  draw();

  statusText.innerText = "YOUR TURN";
  startTimer();

  // WYGRANA
  if (data.winner) {
    gameOver = true;
    clearInterval(timerInterval);

    if (data.winner === "PLAYER") {
      playerScore++;
      statusText.innerText = "YOU WIN";
    } else {
      aiScore++;
      statusText.innerText = "AI WIN";
    }

    updateScore();
  }
}

// ---- CLICK ----
board.addEventListener("click", (e) => {
  if (!e.target.classList.contains("cell")) return;
  const col = parseInt(e.target.dataset.col);
  makeMove(col);
});

// ---- RESET ----
async function resetGame() {
  await fetch("/reset", { method: "POST" });

  grid = Array(6).fill().map(() => Array(7).fill(0));
  gameOver = false;

  draw();
  startTimer();

  statusText.innerText = "YOUR TURN";
}

// ---- INIT ----
draw();