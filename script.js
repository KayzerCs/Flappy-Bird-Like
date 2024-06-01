//board
let board;
let boardWidth = 360;
let boardHeight = 640;
let context;

//bird
let birdWidth = 34; // width/height ratio = 408/228 = 17/12
let birdHeight = 24;
let birdX = boardWidth / 8;
let birdY = boardHeight / 2;

let bird = {
    x : birdX,
    y : birdY,
    width : birdWidth,
    height : birdHeight
}

window.onload = function () {
  board = document.getElementById("board");
  board.height = boardHeight;
  board.Width = boardWidth;
  context = board.getContext("2d"); // utilisé pour dessiner au tableau
};
