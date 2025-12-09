const boxes = document.querySelectorAll(".box");

const btnPlayer = document.getElementById("player");
const btnAI = document.getElementById("ai");

const btnNewGame = document.getElementById("idnewgame");
const btnPlayAgain = document.getElementById("playAgain");

const scoreX = document.getElementById("scoreX");
const scoreO = document.getElementById("scoreO");

const winCircle = document.getElementById("wincircle");
const winScreen = document.getElementById("winscreen");
const winText = document.getElementById("wintext");

let versusAI = false;
let turn = "X";
let running = true;

let board = ["", "", "", "", "", "", "", "", ""];

let scoreCountX = 0;
let scoreCountO = 0;

// winning conditions
const winPatterns = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8], // row
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8], // col
  [0, 4, 8],
  [2, 4, 6], // diagonal
];

//selection of mode

btnPlayer.onclick = () => {
  versusAI = false;
  btnPlayer.classList.add("active");
  btnAI.classList.remove("active");
  resetBoard();
};

btnAI.onclick = () => {
  versusAI = true;
  btnAI.classList.add("active");
  btnPlayer.classList.remove("active");
  resetBoard();
};

boxes.forEach((box) => {
  box.addEventListener("click", () => handleClick(box));
});

function handleClick(box) {
  let id = parseInt(box.id) - 1;

  if (!running || board[id] !== "") return;

  board[id] = turn;
  box.textContent = turn;

  if (checkWinner()) return;

  turn = turn === "X" ? "O" : "X";

  if (versusAI && turn === "O") {
    setTimeout(aiMove, 400);
  }
}

//ai

function aiMove() {
  let emptySpots = board
    .map((value, index) => (value === "" ? index : null))
    .filter((v) => v !== null);

  if (emptySpots.length === 0) return;

  let pick = emptySpots[Math.floor(Math.random() * emptySpots.length)];

  board[pick] = "O";
  boxes[pick].textContent = "O";

  checkWinner();
  turn = "X";
}

//checking of winner

function checkWinner() {
  for (let pattern of winPatterns) {
    const [a, b, c] = pattern;

    if (board[a] && board[a] === board[b] && board[a] === board[c]) {
      showWinner(board[a]);
      return true;
    }
  }

  if (!board.includes("")) {
    showWinner("Draw");
    return true;
  }

  return false;
}

//display winner

function showWinner(winner) {
  running = false;

  // update score
  if (winner === "X") scoreCountX++;
  if (winner === "O") scoreCountO++;

  scoreX.textContent = scoreCountX;
  scoreO.textContent = scoreCountO;

  winCircle.textContent = winner === "Draw" ? "" : winner;

  winText.textContent = winner === "Draw" ? "Draw!" : `${winner} Wins!`;

  //  popup
  winScreen.classList.add("show");

  // animation
  if (winner === "X" || winner === "O") {
    launchConfetti();
  }
}

//animation
function launchConfetti() {
  let end = Date.now() + 1500;

  (function frame() {
    confetti({
      particleCount: 6,
      spread: 300,
      startVelocity: 40,
      origin: { x: Math.random(), y: Math.random() - 0.2 },
    });

    if (Date.now() < end) requestAnimationFrame(frame);
  })();
}

//game reset

btnNewGame.onclick = () => resetBoard();

btnPlayAgain.onclick = () => {
  winScreen.classList.remove("show");
  resetBoard();
};

//reset box

function resetBoard() {
  board = ["", "", "", "", "", "", "", "", ""];
  turn = "X";
  running = true;

  boxes.forEach((b) => (b.textContent = ""));
  winCircle.textContent = "";
}
