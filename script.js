// tableau
let board;
let boardWidth = 360;
let boardHeight = 640;
let context;

// bird
let birdWidth = 34; // width/height ratio = 408/228 = 17/12
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

// pipe
let pipeArray = [];
let pipeWidth = 64; // width/height ratio = 384/3072 = 1/8
let pipeHeight = 512;
let pipeX = boardWidth;
let pipeY = 0;

let topPipeImg;
let bottomPipeImg;

// physics
let velocityX = -2; // tuyaux se déplaçant à gauche vitesse
let velocityY = 0; // vitesse de saut oiseau
let gravity = 0.2;

// Game
let gameOver = false;
let score = 0;
let gameStarted = false; // Variable pour vérifier si le jeu a commencé

window.onload = function () {
  board = document.getElementById("board");
  board.height = boardHeight;
  board.width = boardWidth;
  context = board.getContext("2d"); // utilisé pour dessiner au tableau

  // charger l'image de l'oiseau
  birdImg = new Image();
  birdImg.src = "./asset/flappybird.png";
  birdImg.onload = function () {
    context.drawImage(birdImg, bird.x, bird.y, bird.width, bird.height);
  };

  topPipeImg = new Image();
  topPipeImg.src = "./asset/toppipe.png";

  bottomPipeImg = new Image();
  bottomPipeImg.src = "./asset/bottompipe.png";

  requestAnimationFrame(update); // Commence la boucle de mise à jour
  document.addEventListener("keydown", moveBird);
};

function update() {
  requestAnimationFrame(update);
  context.clearRect(0, 0, board.width, board.height);

  if (gameOver) {
    context.fillText("GAME OVER", boardWidth / 2.5 - 100, 90); // Centrer le texte "GAME OVER"
    return;
  }

  // Dessiner l'oiseau
  if (gameStarted) {
    velocityY += gravity;
    bird.y = Math.max(bird.y + velocityY, 0); // appliquer la gravité à bird.y actuel, limiter bird.y au sommet de la toile.
  }
  context.drawImage(birdImg, bird.x, bird.y, bird.width, bird.height);

  if (bird.y > board.height) {
    gameOver = true;
  }

  // Dessiner les tuyaux
  if (gameStarted) {
    for (let i = 0; i < pipeArray.length; i++) {
      let pipe = pipeArray[i];
      pipe.x += velocityX;
      context.drawImage(pipe.img, pipe.x, pipe.y, pipe.width, pipe.height);

      if (!pipe.passed && bird.x > pipe.x + pipe.width) {
        score += 0.5; // 0.5 car si 1 le score est de 2 par 2
        pipe.passed = true;
      }

      if (detectCollision(bird, pipe)) {
        gameOver = true;
      }
    }

    // Supprimer les tuyaux sortis de l'écran
    while (pipeArray.length > 0 && pipeArray[0].x < -pipeWidth) {
      pipeArray.shift(); // Sup les tuyaux passer
    }
  }

  // Afficher le score
  context.fillStyle = "white";
  context.font = "45px sans-serif";
  let scoreText = score.toString();
  let textWidth = context.measureText(scoreText).width;
  context.fillText(scoreText, (boardWidth - textWidth) / 2, 45); // Centrer le score en haut de l'écran
}


function placePipes() {
  if (gameOver) {
    return;
  }

  //(0-1) * pipeHeight/2
  //0 -> -128 (pipeHeight/4)
  // 1 -> -128 - 256 (pipeHeight/4 - pipeHeight/2) = -3/4 pipeHeight

  // Position aléatoire pour le tuyau supérieur
  let randomPipeY = pipeY - pipeHeight / 4 - Math.random() * (pipeHeight / 2);
  let openningSpace = board.height / 4;

  // Tuyau supérieur
  let topPipe = {
    img: topPipeImg,
    x: pipeX,
    y: randomPipeY,
    width: pipeWidth,
    height: pipeHeight,
    passed: false,
  };
  pipeArray.push(topPipe);

  // Tuyau inférieur
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
  if (e.code == "Space" || e.code == "ArrowUp" || e.code == "KeyX") {
    // Démarrer le jeu
    if (!gameStarted) {
      gameStarted = true;
      setInterval(placePipes, 1100); // Commence à placer les tuyaux lorsque le jeu démarre
    }

    // Sauter
    velocityY = -6;

    // Réinitialiser le jeu
    if (gameOver) {
      bird.y = birdY;
      pipeArray = [];
      score = 0;
      gameOver = false;
      gameStarted = false; // Réinitialiser gameStarted
      velocityY = 0; // Réinitialiser la vitesse de l'oiseau
      context.drawImage(birdImg, bird.x, bird.y, bird.width, bird.height);
    }
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
