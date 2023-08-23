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
  ballVelocity = 7;

  ball.xVelocity =
    ball.ballX < canvasWidth / 2 ? ballVelocity * Math.cos(angle) : -ballVelocity * Math.cos(angle);
  ball.yVelocity = ballVelocity * Math.sin(angle);


  // const adjustedPaddleVelocity = ballVelocity * 10;
  // pdlLeft.setPaddleVelocity(adjustedPaddleVelocity);
  // pdlRight.setPaddleVelocity(adjustedPaddleVelocity);



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
  ball.xVelocity = Math.random() < 0.5 ? -2 : 2;
  ball.yVelocity = 2;
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
      
      let ballPos = (this.ballX < canvasWidth / 2);
      resetGame(this);
      if (ballPos)
      {
      //  leftPaddle.shiftPaddle();
      // leftPaddle.paddleX+=10;
      // rightPaddle.paddleX+=10;
      // const initLeftX = margin - paddleWidth / 2;
// const initRightX = canvasWidth - initLeftX - paddleWidth;
      leftPaddle.paddleX = leftPaddle.paddleX + 10;
      rightPaddle.paddleX = 
        (rightPaddle.paddleX + rightPaddle.paddleWidth + 10 > canvasWidth) ? rightPaddle.paddleX : rightPaddle.paddleX + 10;
      }
      else
      {
        // rightPaddle.shiftPaddle();
        // leftPaddle.paddleX-=10;
        // rightPaddle.paddleX-=10;

        leftPaddle.paddleX = (leftPaddle.paddleX - 10 < 0) ? leftPaddle.paddleX : leftPaddle.paddleX - 10;
        rightPaddle.paddleX = rightPaddle.paddleX - 10;
      }

    }

    this.ballX += this.xVelocity;
    this.ballY += this.yVelocity;

   

    this.draw();
  }
}

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

  // shiftPaddle()
  // {
  //   if (this.side === "left")
  //   {

  //     this.paddleX += 10;

  //   }
  //   else if (this.side === "right")
  //   {
     
  //     this.paddleX -= 10;

  //   }
  // }

  


  
  
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
  velocity: 70,
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
  ctx.setLineDash([8, 10]); // [line length, space length]
  ctx.strokeStyle = "grey";
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.moveTo(canvasWidth / 2, 0);
  ctx.lineTo(canvasWidth / 2, canvasHeight);
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