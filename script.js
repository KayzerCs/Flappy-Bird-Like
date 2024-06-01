//board
let board;
let boardWidth = 360;
let boardHeight = 640;
let context;

window.onload = function () {
  board = document.getElementById("board");
  board.height = boardHeight;
  board.Width = boardWidth;
  context = board.getContext("2d"); // utilisé pour dessiner au tableau
};
