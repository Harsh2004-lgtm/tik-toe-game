const WIN_LINES = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6],
];

const boardEl = document.getElementById("board");
const statusEl = document.getElementById("status");
const scoreXEl = document.getElementById("score-x");
const scoreOEl = document.getElementById("score-o");
const scoreDrawEl = document.getElementById("score-draw");

const state = {
  board: Array(9).fill(""),
  turn: "X",
  over: false,
  scores: { X: 0, O: 0, draw: 0 },
};

function winningLine(board) {
  return WIN_LINES.find(([a, b, c]) => board[a] && board[a] === board[b] && board[a] === board[c]);
}

function render() {
  boardEl.innerHTML = "";
  const line = winningLine(state.board);

  state.board.forEach((mark, index) => {
    const cell = document.createElement("button");
    cell.type = "button";
    cell.className = "cell";
    cell.dataset.index = String(index);
    cell.setAttribute("role", "gridcell");
    cell.setAttribute("aria-label", `Cell ${index + 1}${mark ? `, ${mark}` : ", empty"}`);
    cell.textContent = mark;
    if (mark) cell.classList.add(mark.toLowerCase());
    if (line?.includes(index)) cell.classList.add("win");
    cell.disabled = state.over || Boolean(mark);
    boardEl.appendChild(cell);
  });

  scoreXEl.textContent = String(state.scores.X);
  scoreOEl.textContent = String(state.scores.O);
  scoreDrawEl.textContent = String(state.scores.draw);
}

function setStatus(text) {
  statusEl.textContent = text;
}

function play(index) {
  if (state.over || state.board[index]) return;

  state.board[index] = state.turn;
  const line = winningLine(state.board);

  if (line) {
    state.over = true;
    state.scores[state.turn] += 1;
    setStatus(`${state.turn} wins!`);
  } else if (state.board.every(Boolean)) {
    state.over = true;
    state.scores.draw += 1;
    setStatus("It's a draw.");
  } else {
    state.turn = state.turn === "X" ? "O" : "X";
    setStatus(`${state.turn}'s turn`);
  }

  render();
}

function newRound() {
  state.board = Array(9).fill("");
  state.over = false;
  state.turn = "X";
  setStatus("X's turn");
  render();
}

function resetScores() {
  state.scores = { X: 0, O: 0, draw: 0 };
  newRound();
}

boardEl.addEventListener("click", (event) => {
  const cell = event.target.closest(".cell");
  if (!cell) return;
  play(Number(cell.dataset.index));
});

document.getElementById("new-round").addEventListener("click", newRound);
document.getElementById("reset-scores").addEventListener("click", resetScores);

render();
