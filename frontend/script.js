const board = document.getElementById("board");
const statusText = document.getElementById("status");
const timerText = document.getElementById("timer");

let grid = Array(6).fill().map(() => Array(7).fill(0));
let gameOver = false;
let isProcessing = false;

// TIMER
let timeLeft = 30;
let timerInterval = null;

function startTimer() {
  clearInterval(timerInterval);

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
      statusText.innerText = "AI WIN";
    }
  }, 1000);
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

// RUCH
async function makeMove(col) {
  if (gameOver || isProcessing) return;

  isProcessing = true;

  const res = await fetch("/move", {
    method: "POST",
    headers: {"Content-Type": "application/json"},
    body: JSON.stringify({col})
  });

  const data = await res.json();

  if (data.player && data.player.row !== null) {
    grid[data.player.row][data.player.col] = 1;
  }

  if (data.ai && data.ai.row !== null) {
    grid[data.ai.row][data.ai.col] = 2;
  }

  draw();

  // RESET TIMERA PO KAŻDYM RUCHU
  if (!data.winner) {
    startTimer();
  }

  if (data.winner) {
    gameOver = true;
    clearInterval(timerInterval);
    statusText.innerText =
      data.winner === "PLAYER" ? "YOU WIN" : "AI WIN";
  }

  isProcessing = false;
}

// CLICK
board.addEventListener("click", (e) => {
  if (!e.target.classList.contains("cell")) return;
  const col = parseInt(e.target.dataset.col);
  makeMove(col);
});

// RESET
async function resetGame() {
  await fetch("/reset", { method: "POST" });

  grid = Array(6).fill().map(() => Array(7).fill(0));
  gameOver = false;
  isProcessing = false;

  draw();
  statusText.innerText = "YOUR TURN";

  startTimer();
}

// START SCREEN
function startGame() {
  const input = document.getElementById("nicknameInput").value;
  let nickname = input || "You";

  document.getElementById("playerName").innerText = nickname;

  document.getElementById("startScreen").style.display = "none";
  document.getElementById("gameUI").style.display = "flex";

  statusText.innerText = "YOUR TURN";

  startTimer();
}

// LOGIKA SPADANIA
function getDropRow(col) {
  for (let r = 0; r < 6; r++) {
    if (grid[r][col] === 0) return r;
  }
  return null;
}

// HOVER
board.addEventListener("mousemove", (e) => {
  if (!e.target.classList.contains("cell")) return;

  const col = parseInt(e.target.dataset.col);
  const row = getDropRow(col);

  document.querySelectorAll(".hover").forEach(c => c.classList.remove("hover"));

  if (row !== null) {
    const cells = document.querySelectorAll(".cell");
    const index = (5 - row) * 7 + col;
    cells[index].classList.add("hover");
  }
});

// START
draw();