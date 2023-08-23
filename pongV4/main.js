let theCanvas = document.getElementById("the-canvas");
let ctx = theCanvas.getContext("2d");
let canvasWidth = theCanvas.width;
let canvasHeight = theCanvas.height;
const theCircle = 2 * Math.PI;

const colorArray = [
  "red",
  "blue",
  "green",
  "yellow",
  "orange",
  "purple",
  "pink",
  "black",
  "grey",
  "brown",
];

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
  if (ball.ballX < canvasWidth / 2) {
    // Ball collided with the left paddle
    const paddleCenterY = pdlLeft.paddleY + pdlLeft.paddleHeight / 2;
    const relativeY = ball.ballY - paddleCenterY;
    const normalizedY = relativeY / (pdlLeft.paddleHeight / 2);
    let maxAngle = Math.PI / 4;
    angle = normalizedY * maxAngle;
  } else {
    // Ball collided with the right paddle
    const paddleCenterY = pdlRight.paddleY + pdlRight.paddleHeight / 2;
    const relativeY = ball.ballY - paddleCenterY;
    const normalizedY = relativeY / (pdlRight.paddleHeight / 2);
    let maxAngle = Math.PI / 4;
    angle = normalizedY * maxAngle;
  }

  // let ballVelocity = Math.sqrt(ball.xVelocity ** 2 + ball.yVelocity ** 2);
  ballVelocity = 10;

  ball.xVelocity =
    ball.ballX < canvasWidth / 2 ? ballVelocity * Math.cos(angle) : -ballVelocity * Math.cos(angle);
  ball.yVelocity = ballVelocity * Math.sin(angle);


  const adjustedPaddleVelocity = ballVelocity * 8;
  pdlLeft.setPaddleVelocity(adjustedPaddleVelocity);
  pdlRight.setPaddleVelocity(adjustedPaddleVelocity);



  ball.color = randomColor();
}

detectHorizontalCollision = (ball, paddles) =>
  isBallWithinPaddleRangeX(ball, paddles) &&
  isBallWithinPaddleRangeY(ball, paddles);

detectVerticalCollision = (ball, paddles) => {
  let left = ball.ballX < paddles[0].paddleX + paddles[0].paddleWidth;
  let right = ball.ballX > paddles[1].paddleX;

  return right || left;
};

isBallWithinPaddleRangeX = (ball, paddles) => {
  left =
    ball.ballX - ball.radius <= paddles[0].paddleX + paddles[0].paddleWidth;
  right = ball.ballX + ball.radius >= paddles[1].paddleX;
  return left || right;
};

isBallWithinPaddleRangeY = (ball, paddles) => {
  left =
    ball.ballY + ball.radius > paddles[0].paddleY &&
    ball.ballY - ball.radius < paddles[0].paddleY + paddles[0].paddleHeight;

  right =
    ball.ballY + ball.radius > paddles[1].paddleY &&
    ball.ballY - ball.radius < paddles[1].paddleY + paddles[1].paddleHeight;

  if (ball.ballX < canvasWidth / 2)
    return left;

  return right;
};

resetGame = (ball) => {

const minY = ball.radius + 10;
const maxY = canvasHeight - 10;
const randomY = Math.random() * (maxY - minY) + minY;

  ball.ballX = canvasWidth / 2;
  ball.ballY = randomY;
  ball.xVelocity = Math.random() < 0.5 ? -3 : 3;
  ball.yVelocity = 3;
  ball.color = randomColor();
}

class Ball {
  constructor({ x, y, radius, dx, dy, color, paddles })
  {
    this.ballX = x;
    this.ballY = y;
    this.radius = radius;
    this.xVelocity = dx;
    this.yVelocity = dy;
    this.color = color;
    this.paddles = paddles;
  }

  draw() {
    ctx.beginPath();
    ctx.arc(this.ballX, this.ballY, this.radius, 0, theCircle, false);
    ctx.fillStyle = this.color;
    ctx.fill();
    ctx.closePath();
  }

  update() {
    let leftPaddle = this.paddles[0];
    let rightPaddle = this.paddles[1];
    if (detectHorizontalCollision(this, this.paddles)) {
      paddleBallCollision(this.paddles, this);
    }
    // Top and bottom walls
    if (this.ballY + this.radius > canvasHeight || this.ballY - this.radius < 0) {
      if (this.ballX - this.radius >= canvasWidth / 2 - 3 && this.ballX <= canvasWidth / 2 + 3) 
        this.ballX += (this.ballX > canvasWidth / 2) ? -5 : 7;
      
      this.yVelocity = -this.yVelocity;   
    }
    // Left and right boundaries
    if (detectVerticalCollision(this, this.paddles)) {
      (this.ballX + this.radius > canvasWidth/2) ? leftPaddle.updateScore() : rightPaddle.updateScore();
      
      shiftPaddles(this);
      resetGame(this);


    }

    this.ballX += this.xVelocity;
    this.ballY += this.yVelocity;

   

    this.draw();
  }
}

function shiftPaddles(ball) {

  let leftPaddle = ball.paddles[0];
  let rightPaddle = ball.paddles[1];

  let ballPos = (ball.ballX < canvasWidth / 2);
  if (leftPaddle.paddleX + leftPaddle.paddleWidth >= canvasWidth/3 || rightPaddle.paddleX <= 2*canvasWidth/3)
  {
    let winner = (leftPaddle.score > rightPaddle.score) ? "Left" : "Right";
    alert("Game Over! " + winner + " player wins!");
    // document.location.reload();
  }
  // if (ballPos)
  // {
  //   let shiftRatio = calculateShiftRatio(leftPaddle.score) * 2;
  // leftPaddle.paddleX = leftPaddle.paddleX + shiftRatio;
  // rightPaddle.paddleX = 
  //   (rightPaddle.paddleX + rightPaddle.paddleWidth + shiftRatio > canvasWidth) ? rightPaddle.paddleX : rightPaddle.paddleX + shiftRatio;
  // }
  // else
  // {
  //   let shiftRatio = calculateShiftRatio(rightPaddle.score) * 2;
  //   leftPaddle.paddleX = (leftPaddle.paddleX - shiftRatio < 0) ? leftPaddle.paddleX : leftPaddle.paddleX - shiftRatio;
  //   rightPaddle.paddleX = rightPaddle.paddleX - shiftRatio;
  // }


  // if (ballPos)
  // {
  //   if (leftPaddle.score >= rightPaddle.score) {
  //     leftPaddle.paddleX = (leftPaddle.paddleX - 30 < 0) ? leftPaddle.paddleX : leftPaddle.paddleX - 30;
  //   }
  //   else {
  //     rightPaddle.paddleX = (rightPaddle.paddleX - rightPaddle.paddleWidth - 30 > canvasWidth * (2 / 3)) ? rightPaddle.paddleX - 30 : rightPaddle.paddleX;
  //   }
  // }
  // else
  // {
  //   if (rightPaddle.score >= leftPaddle.score) {
  //     rightPaddle.paddleX = 
  //   (rightPaddle.paddleX + rightPaddle.paddleWidth + 30 > canvasWidth) ? rightPaddle.paddleX : rightPaddle.paddleX + 30;
  //   }
  //   else {
  //     leftPaddle.paddleX = (leftPaddle.paddleX + 30 + leftPaddle.paddleWidth < canvasWidth  / 3) ? leftPaddle.paddleX + 30 : leftPaddle.paddleX;
  //   }
  // }


  let shiftRatio = 10;
  if (ballPos)
  {
    leftPaddle.paddleX = leftPaddle.paddleX + shiftRatio;
    // rightPaddle.paddleX = 
    // (rightPaddle.paddleX + rightPaddle.paddleWidth + shiftRatio > canvasWidth) ? rightPaddle.paddleX : rightPaddle.paddleX + shiftRatio;
  }
  else
  {
    // leftPaddle.paddleX = (leftPaddle.paddleX - shiftRatio < 0) ? leftPaddle.paddleX : leftPaddle.paddleX - shiftRatio;
    rightPaddle.paddleX = rightPaddle.paddleX - shiftRatio;
  }

}

//************* 
function calculateShiftRatio(score) {
  // Define the range of scores and corresponding shift ratios
  const scoreRange = [
    { scoreThreshold: 0, shiftRatio: 10 },   // Example: score <= 0, shift ratio = 0.2
    { scoreThreshold: 3, shiftRatio: 15},   // Example: score <= 5, shift ratio = 0.5
    { scoreThreshold: 6, shiftRatio: 20 },  // Example: score <= 10, shift ratio = 0.8
    { scoreThreshold: 12, shiftRatio: 25 },  // Example: score <= 15, shift ratio = 1.0
    { scoreThreshold: 18, shiftRatio: 30 },  // Example: score <= 20, shift ratio = 1.2
    { scoreThreshold: 21, shiftRatio: 35 },  // Example: score <= 25, shift ratio = 1.4
    { scoreThreshold: 24, shiftRatio: 40 },  // Example: score <= 30, shift ratio = 1.6
  ];

  // Find the corresponding shift ratio based on the score
  let shiftRatio = 0; // Default shift ratio if no matching score range is found

  for (const range of scoreRange) {
    if (score <= range.scoreThreshold) {
      shiftRatio = range.shiftRatio;
      break;
    }
  }

  return shiftRatio;
}
//**********************

function drawPaddle(paddle) {
  ctx.fillStyle = paddle.paddleColor;
  ctx.beginPath();
  if (paddle.side === "left") {
    ctx.moveTo(paddle.paddleX + paddle.paddleWidth, paddle.paddleY);
    ctx.arcTo(
      paddle.paddleX + paddle.paddleWidth,
      paddle.paddleY + paddle.paddleHeight,
      paddle.paddleX,
      paddle.paddleY + paddle.paddleHeight,
      0
    );
    ctx.arcTo(
      paddle.paddleX,
      paddle.paddleY + paddle.paddleHeight,
      paddle.paddleX,
      paddle.paddleY,
      paddle.paddleRadius
    );
    ctx.arcTo(
      paddle.paddleX,
      paddle.paddleY,
      paddle.paddleX + paddle.paddleWidth,
      paddle.paddleY,
      paddle.paddleRadius
    );
  } else if (paddle.side === "right") {
    ctx.moveTo(paddle.paddleX, paddle.paddleY);
    ctx.arcTo(
      paddle.paddleX,
      paddle.paddleY + paddle.paddleHeight,
      paddle.paddleX + paddle.paddleWidth,
      paddle.paddleY + paddle.paddleHeight,
      0
    );
    ctx.arcTo(
      paddle.paddleX + paddle.paddleWidth,
      paddle.paddleY + paddle.paddleHeight,
      paddle.paddleX + paddle.paddleWidth,
      paddle.paddleY,
      paddle.paddleRadius
    );
    ctx.arcTo(
      paddle.paddleX + paddle.paddleWidth,
      paddle.paddleY,
      paddle.paddleX,
      paddle.paddleY,
      paddle.paddleRadius
    );
  }
  ctx.closePath();
  ctx.fill();
}

class Paddle {
  constructor(x, y, side, { width, height, radius, velocity, color })
  {
    this.paddleX = x;
    this.paddleY = y;
    this.paddleWidth = width;
    this.paddleHeight = height;
    this.paddleRadius = radius;
    this.paddleVelocity = velocity;
    this.paddleColor = color;
    this.side = side;
    this.score = 0; 
    this.margin = 20;
  }

  updateScore = () => (this.score += 1);
 
  movePaddleUp() {
    this.paddleY =
      this.paddleY - this.paddleVelocity < 0
        ? 0
        : this.paddleY - this.paddleVelocity;
  }

  movePaddleDown() {
    this.paddleY =
      this.paddleY + this.paddleHeight + this.paddleVelocity > canvasHeight
        ? canvasHeight - this.paddleHeight
        : this.paddleY + this.paddleVelocity;
  }

  setPaddleVelocity = (speed) => (this.paddleVelocity = speed);
}

const paddleHeight = 70;
const paddleWidth = 10;
const margin = 20;
const initLeftX = margin - paddleWidth / 2;
const initRightX = canvasWidth - initLeftX - paddleWidth;
const initY = (canvasHeight - paddleHeight) / 2;

// const xVelocity = Math.random() < 0.5 ? -5 : 5;
// const yVelocity = 5;
// const ballVelocity = Math.sqrt(xVelocity ** 2 + yVelocity ** 2);

const paddleOptions = {
  width: paddleWidth,
  height: paddleHeight,
  radius: 15,
  velocity: 50,
  color: "tomato",
};

const paddleLeft = new Paddle(initLeftX, initY, "left", paddleOptions);
const paddleRight = new Paddle(initRightX, initY, "right", paddleOptions);

// const xVelocity = Math.random() < 0.5 ? -5 : 5;
// const yVelocity = 5;

const ballOptions = {
  x: canvasWidth / 2,
  y: canvasHeight / 2,
  radius: 10,
  dx: Math.random() < 0.5 ? -5 : 5,
  dy: 5,
  color: "red",
  paddles: [paddleLeft, paddleRight],
};

const ball = new Ball(ballOptions);

const paddles = [paddleLeft, paddleRight];
scoreBoard = (paddles) => {
  paddleL = paddles[0];
  paddleR = paddles[1];
  ctx.font = "30px Arial";
  ctx.fillStyle = "black";
  ctx.fillText(paddleL.score, canvasWidth/2 - 100, canvasHeight/2);
  ctx.fillText(paddleR.score, canvasWidth/2 + 80, canvasHeight/2);
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
  ctx.lineWidth = 4;
  ctx.beginPath();
  // ctx.moveTo(canvasWidth / 2, 0);
  // ctx.lineTo(canvasWidth / 2, canvasHeight);
  ctx.moveTo(canvasWidth / 3, 0);
  ctx.lineTo(canvasWidth / 3, canvasHeight);
  ctx.moveTo((2 * canvasWidth) / 3, 0);
  ctx.lineTo((2 * canvasWidth) / 3, canvasHeight);
  ctx.stroke();
}

function keyDownHandler(event) {
  if (event.key === "w") {
    paddleLeft.movePaddleUp();
  } else if (event.key === "s") {
    paddleLeft.movePaddleDown();
  } else if (event.key === "ArrowUp") {
    paddleRight.movePaddleUp();
  } else if (event.key === "ArrowDown") {
    paddleRight.movePaddleDown();
  }
}

function updateCanvas() {
  draw();
  requestAnimationFrame(updateCanvas);
}

document.addEventListener("keydown", keyDownHandler, false);
updateCanvas();
