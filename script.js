// Polyfills pour requestAnimationFrame et cancelAnimationFrame
window.requestAnimationFrame =
  window.requestAnimationFrame ||
  window.webkitRequestAnimationFrame ||
  window.mozRequestAnimationFrame ||
  window.msRequestAnimationFrame ||
  function (callback) {
    return setTimeout(callback, 1000 / 60);
  };

window.cancelAnimationFrame =
  window.cancelAnimationFrame ||
  window.webkitCancelAnimationFrame ||
  window.mozCancelAnimationFrame ||
  window.msCancelAnimationFrame ||
  clearTimeout;

// Variables
let board;
let boardWidth = 360;
let boardHeight = 640;
let context;

// Bird
let birdWidth = 34;
let birdHeight = 24;
let birdX = boardWidth / 8;
let birdY = boardHeight / 2;
let birdImg;

let bird = {
  x: birdX,
  y: birdY,
  width: birdWidth,
  height: birdHeight,
};

// Pipe
let pipeArray = [];
let pipeWidth = 64;
let pipeHeight = 512;
let pipeX = boardWidth;
let pipeY = 0;

let topPipeImg;
let bottomPipeImg;
let pipeInterval;

// Physics
let velocityX = -1;
let velocityY = -4;
let gravity = 0.1;

// Game
let gameOver = false;
let score = 0;
let gameStarted = false;
let startText = true;

window.onload = function () {
  board = document.getElementById("board");
  context = board.getContext("2d");

  loadImages();

  document.addEventListener("keydown", moveBird);
  document.addEventListener("touchstart", moveBird);

  resizeCanvas();
  window.addEventListener("resize", resizeCanvas);

  requestAnimationFrame(update);
};

function loadImages() {
  birdImg = new Image();
  birdImg.src = "./asset/flappybird.png";
  birdImg.onload = function () {
    context.drawImage(birdImg, bird.x, bird.y, bird.width, bird.height);
  };
  birdImg.onerror = function () {
    console.error("Failed to load bird image.");
  };

  topPipeImg = new Image();
  topPipeImg.src = "./asset/toppipe.png";
  topPipeImg.onerror = function () {
    console.error("Failed to load top pipe image.");
  };

  bottomPipeImg = new Image();
  bottomPipeImg.src = "./asset/bottompipe.png";
  bottomPipeImg.onerror = function () {
    console.error("Failed to load bottom pipe image.");
  };
}

function update() {
  requestAnimationFrame(update);
  context.clearRect(0, 0, board.width, board.height);

  if (gameOver) {
    context.font = "55px sans-serif";
    let gameOverText = "GAME OVER";
    let gameOverWidth = context.measureText(gameOverText).width;
    context.fillText(
      gameOverText,
      (boardWidth - gameOverWidth) / 2,
      boardHeight / 2
    );

    context.font = "45px sans-serif";
    let finalScoreText = "Score: " + score.toString();
    let finalScoreWidth = context.measureText(finalScoreText).width;
    context.fillText(
      finalScoreText,
      (boardWidth - finalScoreWidth) / 2,
      boardHeight / 2 + 60
    );

    return;
  }

  if (startText) {
    context.fillStyle = "white";
    context.font = "30px sans-serif";
    let message = 'press "space"';
    let messageWidth = context.measureText(message).width;
    context.fillText(
      message,
      (boardWidth - messageWidth) / 2,
      boardHeight / 2 + 100
    );
  }

  if (gameStarted) {
    velocityY += gravity;
    bird.y = Math.max(bird.y + velocityY, 0);
  }
  context.drawImage(birdImg, bird.x, bird.y, bird.width, bird.height);

  if (bird.y > board.height) {
    gameOver = true;
  }

  if (gameStarted) {
    for (let i = 0; i < pipeArray.length; i++) {
      let pipe = pipeArray[i];
      pipe.x += velocityX;
      context.drawImage(pipe.img, pipe.x, pipe.y, pipe.width, pipe.height);

      if (!pipe.passed && bird.x > pipe.x + pipe.width) {
        score += 0.5;
        pipe.passed = true;
      }

      if (detectCollision(bird, pipe)) {
        gameOver = true;
      }
    }

    while (pipeArray.length > 0 && pipeArray[0].x < -pipeWidth) {
      pipeArray.shift();
    }
  }

  context.fillStyle = "white";
  context.font = "65px sans-serif";
  let scoreText = score.toString();
  let textWidth = context.measureText(scoreText).width;
  context.fillText(scoreText, (boardWidth - textWidth) / 2, 95);
}

function placePipes() {
  if (gameOver) {
    return;
  }

  let randomPipeY = pipeY - pipeHeight / 4 - Math.random() * (pipeHeight / 2);
  let openningSpace = board.height / 4;

  let topPipe = {
    img: topPipeImg,
    x: pipeX,
    y: randomPipeY,
    width: pipeWidth,
    height: pipeHeight,
    passed: false,
  };
  pipeArray.push(topPipe);

  let bottomPipe = {
    img: bottomPipeImg,
    x: pipeX,
    y: randomPipeY + pipeHeight + openningSpace,
    width: pipeWidth,
    height: pipeHeight,
    passed: false,
  };
  pipeArray.push(bottomPipe);
}

function moveBird(e) {
  if (
    e.type === "keydown" &&
    (e.code == "Space" || e.code == "ArrowUp" || e.code == "KeyX")
  ) {
    handleMove();
  } else if (e.type === "touchstart") {
    handleMove();
  }
}

function handleMove() {
  if (!gameStarted) {
    gameStarted = true;
    startText = false;
    pipeInterval = setInterval(placePipes, 1800);
  }

  velocityY = -4;

  if (gameOver) {
    clearInterval(pipeInterval);
    bird.y = birdY;
    pipeArray = [];
    score = 0;
    gameOver = false;
    gameStarted = false;
    startText = true;
    velocityY = 0;
    context.drawImage(birdImg, bird.x, bird.y, bird.width, bird.height);
  }
}

function detectCollision(a, b) {
  return (
    a.x < b.x + b.width &&
    a.x + a.width > b.x &&
    a.y < b.y + b.height &&
    a.y + a.height > b.y
  );
}

function resizeCanvas() {
  boardWidth = window.innerWidth < 360 ? window.innerWidth : 360;
  boardHeight = window.innerHeight < 640 ? window.innerHeight : 640;
  board.width = boardWidth;
  board.height = boardHeight;
  bird.x = boardWidth / 8;
  bird.y = boardHeight / 2;
}
