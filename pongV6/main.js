let theCanvas = document.getElementById("the-canvas");
let ctx = theCanvas.getContext("2d");
let canvasWidth = theCanvas.width;
let canvasHeight = theCanvas.height;

let landscapeModeView = canvasWidth >= canvasHeight;
let portraitModeView  = canvasWidth < canvasHeight;

const randomColor = () => {
  const min = 0;
  const max = 255;
  const r = Math.floor(Math.random() * (max - min + 1)) + min;
  const g = Math.floor(Math.random() * (max - min + 1)) + min;
  const b = Math.floor(Math.random() * (max - min + 1)) + min;
  return `rgb(${r}, ${g}, ${b})`;
};

function paddleBallCollision(paddles, ball) {
  let pdlLeft = paddles[0];
  let pdlRight = paddles[1];
  let angle = 0;

  let bX = ball.ballX * canvasWidth;
  let bY = ball.ballY * canvasHeight;

  let plY = pdlLeft.paddleY * canvasHeight;
  let prY = pdlRight.paddleY * canvasHeight;

  let maxAngle =
    canvasWidth > 1300 || canvasHeight > 1000 ? Math.PI / 4 : Math.PI / 4;

  if (landscapeModeView) {
    if (bX < canvasWidth / 2) {
      // Ball collided with the left paddle
      const paddleCenterY = plY + pdlLeft.paddleHeight / 2;
      const relativeY = bY - paddleCenterY;
      const normalizedY = relativeY / (pdlLeft.paddleHeight / 2);
      angle = normalizedY * maxAngle;
    } else if (bX > canvasWidth / 2) {
      // Ball collided with the right paddle
      const paddleCenterY = prY + pdlRight.paddleHeight / 2;
      const relativeY = bY - paddleCenterY;
      const normalizedY = relativeY / (pdlRight.paddleHeight / 2);
      angle = normalizedY * maxAngle;

        }
  }
  // return;
  bX = ball.ballX * canvasWidth;
  bY = ball.ballY * canvasHeight;

  // plX = pdlLeft.paddleX * canvasHeight
  plY = pdlLeft.paddleY * canvasWidth;
  prY = pdlRight.paddleY * canvasWidth;

  if (portraitModeView) {
    if (bY < canvasHeight / 2) {
      // Ball collided with the Top paddle
      const paddleCenterY = plY + pdlLeft.paddleHeight / 2;
      const relativeY = bX - paddleCenterY;
      const normalizedY = relativeY / (pdlLeft.paddleHeight / 2);
      angle = normalizedY * maxAngle;
    } else if (bY > canvasHeight / 2) {
      // Ball collided with the Bottom paddle
      const paddleCenterY = prY + pdlRight.paddleHeight / 2;
      const relativeY = bX - paddleCenterY;
      const normalizedY = relativeY / (pdlRight.paddleHeight / 2);
      angle = normalizedY * maxAngle;
    }
  }

  ballVelocity = (landscapeModeView) ? 0.015 : 0.016;

  if (landscapeModeView) {
    ball.xVelocity =
      ball.ballX * canvasWidth < canvasWidth / 2
        ? ballVelocity * Math.cos(angle)
        : -ballVelocity * Math.cos(angle);
    ball.yVelocity = ballVelocity * Math.sin(angle);
  } else {
    ball.xVelocity = ballVelocity * Math.sin(angle);
    ball.yVelocity =
      ball.ballY * canvasHeight < canvasHeight / 2
        ? ballVelocity * Math.cos(angle)
        : -ballVelocity * Math.cos(angle);
  }

  ball.color = randomColor();
}

ballPaddleFaceCollision = (ball) =>
  isBallWithinPaddleRangeX(ball, ball.paddles) 
  && isBallWithinPaddleRangeY(ball, ball.paddles);

isBallWithinPaddleRangeX = (ball, paddles) => {
  if (landscapeModeView) {
    const left = (ball.ballX * canvasWidth) - ball.radius <= (paddles[0].paddleX * canvasWidth) + paddles[0].paddleWidth;
    const right = (ball.ballX * canvasWidth) + ball.radius + (ball.xVelocity * canvasWidth) >= paddles[1].paddleX * canvasWidth;

    return left || right;
  }
  const top =(ball.ballY * canvasHeight) - ball.radius <= (paddles[0].paddleX * canvasHeight) + paddles[0].paddleWidth;
  const bottom = (ball.ballY * canvasHeight) + ball.radius >= paddles[1].paddleX * canvasHeight;
  return top || bottom;
};

// check if ball is within paddle interval, not off the edges of the paddle
isBallWithinPaddleRangeY = (ball, paddles) => {
  if (landscapeModeView) {
    const left =
      (ball.ballY * canvasHeight) + ball.radius > (paddles[0].paddleY * canvasHeight) &&
      (ball.ballY * canvasHeight) - ball.radius < (paddles[0].paddleY * canvasHeight) + paddles[0].paddleHeight;

    const right =
      (ball.ballY * canvasHeight) + ball.radius > (paddles[1].paddleY * canvasHeight) &&
      (ball.ballY * canvasHeight) - ball.radius < (paddles[1].paddleY * canvasHeight) + paddles[1].paddleHeight;

    if ((ball.ballX * canvasWidth) < canvasWidth / 2) return left;
    return right;
  } else {
    const top =
      (ball.ballX * canvasWidth) + ball.radius > (ball.paddles[0].paddleY * canvasWidth) &&
      (ball.ballX * canvasWidth) - ball.radius < (ball.paddles[0].paddleY * canvasWidth) + ball.paddles[0].paddleHeight;

    const bottom =
      (ball.ballX * canvasWidth) + ball.radius > (ball.paddles[1].paddleY * canvasWidth) &&
      (ball.ballX * canvasWidth) - ball.radius < (ball.paddles[1].paddleY * canvasWidth)  + ball.paddles[1].paddleHeight;

    if ((ball.ballY * canvasHeight) < canvasHeight / 2) return top;
    return bottom;
  }
};

function getRandomVelocity() {
  const angle = [0, 1, 2];
  const ang = angle[Math.floor(Math.random() * angle.length)];

  const velocities = {
    0: [-0.005, 0.004],
    1: [-0.004, 0.004],
    2: [-0.005, 0.004],
  };

  const direction = Math.random() < 0.5 ? 1 : -1;
  const [ball_vel_y, ball_vel_x] = velocities[ang].map(
    (vel) => vel * direction
  );

  if (landscapeModeView) return { xV: ball_vel_x  , yV: ball_vel_y };
  else return { xV: ball_vel_y , yV:  ball_vel_x  };
}

function ballTopBottomCollision(ball) {
  if ((ball.ballY * canvasHeight) + ball.radius + (ball.yVelocity * canvasHeight) > canvasHeight || (ball.ballY * canvasHeight) - ball.radius < 0) 
  {
      ball.yVelocity = -ball.yVelocity;
  }
}

function ballRightLeftCollision(ball) {
  if ((ball.ballX * canvasWidth) + ball.radius > canvasWidth || (ball.ballX * canvasWidth) - ball.radius < 0)
    ball.xVelocity = -ball.xVelocity;
}


resetGame = (ball) => {
  if (landscapeModeView) 
  {
    const minY = 0.2;
    const maxY = 0.8;
    const randomY = Math.random() * (maxY - minY) + minY;

    ball.ballX = 0.5;
    ball.ballY = randomY;
    const { xV, yV } = getRandomVelocity();
    ball.xVelocity = xV;
    ball.yVelocity = yV;
    ball.color = randomColor();
  } 
  else 
  {
    const minX = 0.2;
    const maxX = 0.8;
    const randomX = Math.random() * (maxX - minX) + minX;

    ball.ballX = randomX;
    ball.ballY = 0.5;
    const { xV, yV } = getRandomVelocity();
    ball.xVelocity = xV;
    ball.yVelocity = yV;
    ball.color = randomColor();
  }
};

class Ball {
  constructor({ x, y, radius, dx, dy, color, paddles }) {
    this.ballX = x;
    this.ballY = y;
    this.radius = radius;
    this.xVelocity = dx;
    this.yVelocity = dy;
    this.color = color;
    this.paddles = paddles;
  }

  draw() {
    const newX = this.ballX * canvasWidth;
    const newY = this.ballY * canvasHeight;
    ctx.beginPath();
    this.radius = 0.019 * ((canvasWidth + canvasHeight) / 2);
    ctx.arc(newX, newY, this.radius, 0, 2 * Math.PI, false);
    ctx.fillStyle = this.color;
    ctx.fill();
    ctx.closePath();
  }

  update() {
    let leftPaddle = this.paddles[0];
    let rightPaddle = this.paddles[1];

    // Top-bottom/Left-right collision
    if (landscapeModeView) ballTopBottomCollision(this);
    else ballRightLeftCollision(this);
    // // Paddle-Ball collision
    if (ballPaddleFaceCollision(this, this.paddles)) 
    {
      paddleBallCollision(this.paddles, this);
    }
    else if (isBallWithinPaddleRangeX(this, this.paddles)) 
    {
      if (landscapeModeView) 
      {
        this.ballX * canvasWidth + this.radius > canvasWidth / 2 ? leftPaddle.updateScore() : rightPaddle.updateScore();
        shiftPaddlesHorizontal(this);
      } else 
      {
        this.ballY * canvasHeight + this.radius > canvasHeight / 2 ? leftPaddle.updateScore() : rightPaddle.updateScore();
        shiftPaddlesVertical(this);
      }
      resetGame(this);
    }

    this.ballX += this.xVelocity;
    this.ballY += this.yVelocity;

    this.draw();
  }

  updatePositionOnResize = (canvasWidth, canvasHeight) => {
    this.radius = canvasWidth * 0.03;
  };
}

function gameOver(ball, winnerr){

  alert("Game Over! " + winnerr + " player wins!");

  ball.paddles[0].initializeGameState();
  ball.paddles[1].initializeGameState();
}


function shiftPaddlesHorizontal(ball) {
  let leftPaddle = ball.paddles[0];
  let rightPaddle = ball.paddles[1];

  let shiftRatio = 0.009;
  if (
    (leftPaddle.paddleX * canvasWidth )+ leftPaddle.paddleWidth >= canvasWidth / 3 ||
    rightPaddle.paddleX * canvasWidth  <= (2 * canvasWidth) / 3
  ) {
    let winner = leftPaddle.score > rightPaddle.score ? "Left" : "Right";
    // alert("Game Over! " + winner + " player wins!");
    gameOver(ball, winner);
  }
  let ballPos = ball.ballX * canvasWidth < canvasWidth / 2;
  if (ballPos) leftPaddle.paddleX +=  shiftRatio;
  else rightPaddle.paddleX -=  shiftRatio;
}

function shiftPaddlesVertical(ball) {
  let topPaddle = ball.paddles[0];
  let bottomPaddle = ball.paddles[1];

  let shiftRatio = 0.009;
  if (
    (topPaddle.paddleX * canvasHeight) + topPaddle.paddleWidth >= canvasHeight / 3
    || bottomPaddle.paddleX * canvasHeight <= (2 * canvasHeight) / 3
  ) {
    let winner = topPaddle.score > bottomPaddle.score ? "Top" : "Bottom";
    // alert("Game Over! " + winner + " player wins!");
    gameOver(ball, winner);
  }
  let ballPos = ball.ballY * canvasHeight < canvasHeight / 2;
  if (ballPos) topPaddle.paddleX = topPaddle.paddleX + shiftRatio;
  else bottomPaddle.paddleX = bottomPaddle.paddleX - shiftRatio;
}

function drawPaddle(paddle) { 
  ctx.fillStyle = paddle.paddleColor;
  ctx.beginPath();

   if (canvasWidth >= canvasHeight)
  {
    const newX = paddle.paddleX * canvasWidth;
    const newY = paddle.paddleY * canvasHeight;
    paddle.side === "left" && ctx.rect(newX ,newY, paddle.paddleWidth, paddle.paddleHeight);
    paddle.side === "right" && ctx.rect(newX , newY, paddle.paddleWidth, paddle.paddleHeight);
  }
  else 
  {
    const newX = paddle.paddleX * canvasHeight;
    const newY = paddle.paddleY * canvasWidth;
      paddle.side === "left" && ctx.rect(newY ,newX, paddle.paddleHeight,paddle.paddleWidth);
      paddle.side === "right" && ctx.rect(newY, newX, paddle.paddleHeight, paddle.paddleWidth);

  }

  ctx.closePath();
  ctx.fill();
}

class Paddle {
  constructor(x, y, side) {
    this.paddleX = x;
    this.paddleY = y;
    this.paddleWidth = 0;
    this.paddleHeight = 0;
    this.paddleRadius = 0;
    this.paddleColor = "tomato";
    this.side = side;
    this.score = 0;
    this.margin = 20;
  }

  updateScore = () => (this.score += 1);

  movePaddleUp() {
    // const paddleVelocity = landscapeModeView
    //   ? canvasHeight * 0.15
    //   : canvasHeight * 0.15;
    this.paddleY = this.paddleY - 0.05 < 0 ? 0 : this.paddleY - 0.05;
  }

  movePaddleDown() {
    // const paddleVelocity = landscapeModeView
    //   ? canvasHeight * 0.15
    //   : canvasHeight * 0.15;

      this.paddleY =
        this.paddleY  + 0.05 > 0.85 ? 0.85 : this.paddleY + 0.05; 

  }

  initializeGameState() { 
    theCanvas.width = window.innerWidth - 50;
  theCanvas.height = window.innerHeight - 50;
  
   canvasWidth = theCanvas.width;
   canvasHeight = theCanvas.height;

  landscapeModeView = canvasWidth >= canvasHeight;
 portraitModeView  = canvasWidth < canvasHeight;
    if (canvasWidth >= canvasHeight) {
      this.paddleWidth = 0.012 * canvasWidth;
      this.paddleHeight = 0.15 * canvasHeight;
      this.margin = 0.024;
      this.paddleRadius = canvasWidth * 0.01;
      this.score = 0;

      this.paddleX = this.side === "left" ? 0.015 : 0.975;
      this.paddleY = 0.425;

    } else {
      this.paddleWidth = 0.012 * canvasHeight;
      this.paddleHeight = 0.15 * canvasWidth;
      this.margin = 0.024;
      this.paddleRadius = canvasWidth * 0.01;
      this.score = 0;

      this.paddleX = this.side === "left" ? 0.015 : 0.97;
      this.paddleY = 0.425; // 0.835
    }

  }
  
  updateGameStateUponResize() { 
    if (canvasWidth >= canvasHeight) {
      this.paddleWidth = 0.01 * canvasWidth;//0.012
      this.paddleHeight = 0.18 * canvasHeight;//0.15
      this.margin = 0.024;
      this.paddleRadius = canvasWidth * 0.01;

    } else {
      this.paddleWidth = 0.01 * canvasHeight;//0.012
      this.paddleHeight = 0.18 * canvasWidth;
      this.margin = 0.024;
      this.paddleRadius = canvasWidth * 0.01;
    }
  }
}

const paddleLeft = new Paddle(0, 0, "left");
const paddleRight = new Paddle(0, 0, "right");

const ballOptions = {
  radius: 0.019 * ((canvasWidth + canvasHeight) / 2),
  x: 0.5,
  y: 0.5,
  dx: Math.random() < 0.5 ? -0.005 : 0.005,
  dy: 0.005,
  color: "red",
  paddles: [paddleLeft, paddleRight],
};

const ball = new Ball(ballOptions);
// ball.draw();

paddleLeft.initializeGameState();
paddleRight.initializeGameState();
const paddles = [paddleLeft, paddleRight];
scoreBoard = (paddles) => {
if (landscapeModeView) {
  const paddleL = paddles[0];
  const paddleR = paddles[1];
  ctx.font = "30px Arial";
  ctx.fillStyle = "black";
  ctx.fillText(paddleL.score, canvasWidth / 2 - 100, canvasHeight / 2);
  ctx.fillText(paddleR.score, canvasWidth / 2 + 80, canvasHeight / 2);
} else 
{
  const paddleTop = paddles[0];
  const paddleBottom = paddles[1];
  ctx.font = "30px Arial";
  ctx.fillStyle = "black";
  ctx.fillText(paddleTop.score, canvasWidth / 2, canvasHeight / 2 - 50);
  ctx.fillText(paddleBottom.score, canvasWidth / 2, canvasHeight / 2 + 70);
}
};

function draw() {
  ctx.clearRect(0, 0, canvasWidth, canvasHeight);
  drawDashedCenterLine();
  scoreBoard(paddles);
  drawPaddle(paddleLeft);
  drawPaddle(paddleRight);
  ball.update();
}



function drawDashedCenterLine() {
  ctx.setLineDash([8, 10]); // [lineLength, spaceLength]
  ctx.strokeStyle = "grey";
  ctx.lineWidth = 0.004 * canvasWidth; //4;
  ctx.beginPath();
  if (landscapeModeView) {
    ctx.moveTo(canvasWidth / 2, 0);
    ctx.lineTo(canvasWidth / 2, canvasHeight);
    ctx.stroke();
    ctx.beginPath();
    ctx.lineWidth = 1;
    ctx.strokeStyle = "red";
    ctx.moveTo(canvasWidth / 3, 0);
    ctx.lineTo(canvasWidth / 3, canvasHeight);
    ctx.moveTo((2 * canvasWidth) / 3, 0);
    ctx.lineTo((2 * canvasWidth) / 3, canvasHeight);
    ctx.stroke();
  } else {
    ctx.moveTo(0, canvasHeight / 2);
    ctx.lineTo(canvasWidth, canvasHeight / 2);
    ctx.stroke();
    ctx.beginPath();
    ctx.lineWidth = 1;
    ctx.strokeStyle = "red";
    ctx.moveTo(0, canvasHeight / 3);
    ctx.lineTo(canvasWidth, canvasHeight / 3);
    ctx.moveTo(0, (2 * canvasHeight) / 3);
    ctx.lineTo(canvasWidth, (2 * canvasHeight) / 3);
    ctx.stroke();
  }
}

function keyDownHandler(event) {
  if (landscapeModeView) {
    if (event.key === "q") {
      paddleLeft.movePaddleUp();
    } else if (event.key === "a") {
      paddleLeft.movePaddleDown();
    } else if (event.key === "ArrowUp") {
      paddleRight.movePaddleUp();
    } else if (event.key === "ArrowDown") {
      paddleRight.movePaddleDown();
    }
  } else {
    if (event.key === "z") {
      paddleLeft.movePaddleUp();
    } else if (event.key === "x") {
      paddleLeft.movePaddleDown();
    } else if (event.key === "ArrowLeft") {
      paddleRight.movePaddleUp();
    } else if (event.key === "ArrowRight") {
      paddleRight.movePaddleDown();
    }
  }
  if (event.key === "p") toggleAnimation();
}

let animationFrameId;
function updateCanvas() {
  draw();
  animationFrameId = requestAnimationFrame(updateCanvas);
}
updateCanvas();

document.addEventListener("keydown", keyDownHandler, false);

window.addEventListener("resize", handleResize);

function handleResize() {
  theCanvas.width = window.innerWidth - 50;
  theCanvas.height = window.innerHeight - 50;
  
   canvasWidth = theCanvas.width;
   canvasHeight = theCanvas.height;

 landscapeModeView = canvasWidth >= canvasHeight;
 portraitModeView  = canvasWidth < canvasHeight;

//  updateCanvas();
ctx.clearRect(0, 0, theCanvas.width, theCanvas.height);
paddleLeft.updateGameStateUponResize();
paddleRight.updateGameStateUponResize();
}



// function pauseGame() {
//   cancelAnimationFrame(animationFrameId);
// }

// function resumeGame() {
//   animationFrameId = requestAnimationFrame(updateCanvas);
// }

// // Pause the game
// pauseGame();

// // Resume the game
// resumeGame();