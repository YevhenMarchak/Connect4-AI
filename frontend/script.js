const board = document.getElementById("board");
const statusText = document.getElementById("status");

let grid = Array(6).fill().map(() => Array(7).fill(0));
let gameOver = false;
let isProcessing = false;

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

// ---- RUCH ----
async function makeMove(col) {
  if (gameOver || isProcessing) return;

  isProcessing = true;

  const res = await fetch("/move", {
    method: "POST",
    headers: {"Content-Type": "application/json"},
    body: JSON.stringify({col})
  });

  const data = await res.json();

  // 🔴 BEZPIECZNE zapisy
  if (data.player && data.player.row !== null) {
    grid[data.player.row][data.player.col] = 1;
  }

  if (data.ai && data.ai.row !== null) {
    grid[data.ai.row][data.ai.col] = 2;
  }

  draw();

  if (data.winner) {
    gameOver = true;
    statusText.innerText =
      data.winner === "PLAYER" ? "YOU WIN" : "AI WIN";
  }

  isProcessing = false;
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
  isProcessing = false;

  draw();
  statusText.innerText = "YOUR TURN";
}

draw();

function startGame() {
  const input = document.getElementById("nicknameInput").value;

  let nickname = input || "You";

  document.getElementById("playerName").innerText = nickname;

  document.getElementById("startScreen").style.display = "none";
  document.getElementById("gameUI").style.display = "flex";

  document.getElementById("status").innerText = "YOUR TURN";
}