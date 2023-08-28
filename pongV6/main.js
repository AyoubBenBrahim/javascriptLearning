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
  let maxAngle = (canvasWidth > 1300 || canvasHeight > 1000) ? Math.PI / 6 : Math.PI / 4;
  if (landscapeModeView && ball.ballX < canvasWidth / 2) {
    // Ball collided with the left paddle
    const paddleCenterY = pdlLeft.paddleY + pdlLeft.paddleHeight / 2;
    const relativeY = ball.ballY - paddleCenterY;
    const normalizedY = relativeY / (pdlLeft.paddleHeight / 2);
    angle = normalizedY * maxAngle;
  } else if (landscapeModeView && ball.ballX > canvasWidth / 2) {
    // Ball collided with the right paddle
    const paddleCenterY = pdlRight.paddleY + pdlRight.paddleHeight / 2;
    const relativeY = ball.ballY - paddleCenterY;
    const normalizedY = relativeY / (pdlRight.paddleHeight / 2);
    angle = normalizedY * maxAngle;
  }

  if (portraitModeView && ball.ballY < canvasHeight / 2) {
    // Ball collided with the Top paddle
    const paddleCenterY = pdlLeft.paddleY + pdlLeft.paddleHeight / 2;
    const relativeY = ball.ballX - paddleCenterY;
    const normalizedY = relativeY / (pdlLeft.paddleHeight / 2);
    angle = normalizedY * maxAngle;
  } else if (portraitModeView && ball.ballY > canvasHeight / 2) {
    // Ball collided with the Bottom paddle
    const paddleCenterY = pdlRight.paddleY + pdlRight.paddleHeight / 2;
    const relativeY = ball.ballX - paddleCenterY;
    const normalizedY = relativeY / (pdlRight.paddleHeight / 2);
    angle = normalizedY * maxAngle;
  }

  // console.log("landscapeModeView", landscapeModeView);  
  ballVelocity = (landscapeModeView) ? canvasWidth * 0.013 : canvasHeight * 0.015; 


  if (landscapeModeView) {
    ball.xVelocity =
      ball.ballX < canvasWidth / 2
        ? ballVelocity * Math.cos(angle)
        : -ballVelocity * Math.cos(angle);
    ball.yVelocity = ballVelocity * Math.sin(angle);
  } else {
    ball.xVelocity = ballVelocity * Math.sin(angle);
    ball.yVelocity =
      ball.ballY < canvasHeight / 2
        ? ballVelocity * Math.cos(angle)
        : -ballVelocity * Math.cos(angle);
  }

  ball.color = randomColor();
}

ballPaddleFaceCollision = (ball) =>
  isBallWithinPaddleRangeX(ball, ball.paddles) &&
  isBallWithinPaddleRangeY(ball, ball.paddles);

isBallWithinPaddleRangeX = (ball, paddles) => {
  if (landscapeModeView) {
    const left = ball.ballX - ball.radius <= paddles[0].paddleX + paddles[0].paddleWidth;
    const right = ball.ballX + ball.radius >= paddles[1].paddleX;
    return left || right;
  }

  const top = ball.ballY - ball.radius <= paddles[0].paddleX + paddles[0].paddleWidth;
  const bottom = ball.ballY + ball.radius >= paddles[1].paddleX;
  return top || bottom;
};

// check if ball is within paddle interval, not off the edges of the paddle
isBallWithinPaddleRangeY = (ball, paddles) => {
  if (landscapeModeView) {
    const left =
      ball.ballY + ball.radius > paddles[0].paddleY &&
      ball.ballY - ball.radius < paddles[0].paddleY + paddles[0].paddleHeight;

    const right =
      ball.ballY + ball.radius > paddles[1].paddleY &&
      ball.ballY - ball.radius < paddles[1].paddleY + paddles[1].paddleHeight;

    if (ball.ballX < canvasWidth / 2) return left;
    return right;
  } else {
    const top =
      ball.ballX + ball.radius > ball.paddles[0].paddleY &&
      ball.ballX - ball.radius < ball.paddles[0].paddleY + ball.paddles[0].paddleHeight;

    const bottom =
      ball.ballX + ball.radius > ball.paddles[1].paddleY &&
      ball.ballX - ball.radius < ball.paddles[1].paddleY + ball.paddles[1].paddleHeight;

    if (ball.ballY < canvasHeight / 2) return top;
    return bottom;
  }
};

function getRandomVelocity() {
  const angle = [0, 1, 2];
  const ang = angle[Math.floor(Math.random() * angle.length)];

  const velocities = {
    0: [-2, 3],
    1: [-3, 3],
    2: [-3, 2],
  };

  const direction = Math.random() < 0.5 ? 1 : -1;
  const [ball_vel_y, ball_vel_x] = velocities[ang].map(
    (vel) => vel * direction
  );

  if (landscapeModeView) return { xV: ball_vel_x * canvasWidth * 0.002 , yV: ball_vel_y };
  else return { xV: ball_vel_y , yV:  ball_vel_x * canvasHeight * 0.002 };
}

function ballTopBottomCollision(ball) {
  if (ball.ballY + ball.radius > canvasHeight || ball.ballY - ball.radius < 0) 
  {
    if (ball.ballX - ball.radius >= canvasWidth / 2 - 3 && ball.ballX <= canvasWidth / 2 + 3)
      ball.ballX += ball.ballX > canvasWidth / 2 ? -5 : 7;
      ball.yVelocity = -ball.yVelocity;
  }
}

function ballRightLeftCollision(ball) {
  if (ball.ballX + ball.radius > canvasWidth || ball.ballX - ball.radius < 0)
    ball.xVelocity = -ball.xVelocity;
}


resetGame = (ball) => {
  if (landscapeModeView) {
    const minY = ball.radius;
    const maxY = canvasHeight - ball.radius;
    const randomY = Math.random() * (maxY - minY) + minY;

    ball.ballX = canvasWidth / 2;
    ball.ballY = randomY;
    const { xV, yV } = getRandomVelocity();
    ball.xVelocity = xV;
    ball.yVelocity = yV;
    ball.color = randomColor();
  } else {
    const minX = ball.radius;
    const maxX = canvasWidth - ball.radius;
    const randomX = Math.random() * (maxX - minX) + minX;

    ball.ballX = randomX;
    ball.ballY = canvasHeight / 2;
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
    ctx.beginPath();
    this.radius = 0.019 * ((canvasWidth + canvasHeight) / 2);
    ctx.arc(this.ballX, this.ballY, this.radius, 0, 2 * Math.PI, false);
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
    // Paddle-Ball collision
    if (ballPaddleFaceCollision(this, this.paddles)) paddleBallCollision(this.paddles, this);
    else if (isBallWithinPaddleRangeX(this, this.paddles)) 
    {
      if (landscapeModeView) 
      {
        this.ballX + this.radius > canvasWidth / 2 ? leftPaddle.updateScore() : rightPaddle.updateScore();
        shiftPaddlesHorizontal(this);
      } else 
      {
        this.ballY + this.radius > canvasHeight / 2 ? leftPaddle.updateScore() : rightPaddle.updateScore();
        shiftPaddlesVertical(this);
      }

      // ctx.fillText("RESET", canvasWidth - 100 , canvasHeight - 500);
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

function shiftPaddlesHorizontal(ball) {
  let leftPaddle = ball.paddles[0];
  let rightPaddle = ball.paddles[1];

  let shiftRatio = canvasWidth * 0.02;
  if (
    leftPaddle.paddleX + leftPaddle.paddleWidth >= canvasWidth / 3 ||
    rightPaddle.paddleX  <= (2 * canvasWidth) / 3
  ) {
    let winner = leftPaddle.score > rightPaddle.score ? "Left" : "Right";
    alert("Game Over! " + winner + " player wins!");
  }
  let ballPos = ball.ballX < canvasWidth / 2;
  if (ballPos) leftPaddle.paddleX = leftPaddle.paddleX + shiftRatio;
  else rightPaddle.paddleX = rightPaddle.paddleX - shiftRatio;
}

function shiftPaddlesVertical(ball) {
  let topPaddle = ball.paddles[0];
  let bottomPaddle = ball.paddles[1];

  let shiftRatio = canvasHeight * 0.02;
  if (
    topPaddle.paddleX + topPaddle.paddleWidth >= canvasHeight / 3
    || bottomPaddle.paddleX <= (2 * canvasHeight) / 3
  ) {
    let winner = topPaddle.score > bottomPaddle.score ? "Top" : "Bottom";
    alert("Game Over! " + winner + " player wins!");
  }
  let ballPos = ball.ballY < canvasHeight / 2;
  if (ballPos) topPaddle.paddleX = topPaddle.paddleX + shiftRatio;
  else bottomPaddle.paddleX = bottomPaddle.paddleX - shiftRatio;
}

function drawPaddle(paddle) { 
  ctx.fillStyle = paddle.paddleColor;
  ctx.beginPath();

  if (portraitModeView) 
  {
    
    
    if (paddle.side === "left") {
      const roundedCornerRadius = paddle.paddleRadius;
      ctx.moveTo(paddle.paddleY, paddle.paddleX + roundedCornerRadius);
      ctx.arcTo(
        paddle.paddleY,
        paddle.paddleX,
        paddle.paddleY + paddle.paddleHeight,
        paddle.paddleX,
        roundedCornerRadius 
      );
      ctx.arcTo(
        paddle.paddleY + paddle.paddleHeight,
        paddle.paddleX,
        paddle.paddleY + paddle.paddleHeight,
        paddle.paddleX + paddle.paddleWidth,
        roundedCornerRadius 
      );
      ctx.lineTo(
        paddle.paddleY,
        paddle.paddleX + paddle.paddleWidth
      );
      ctx.lineTo(paddle.paddleY, paddle.paddleX);
      ctx.arcTo(
        paddle.paddleY,
        paddle.paddleX ,
        paddle.paddleY,
        paddle.paddleX + roundedCornerRadius,
        roundedCornerRadius
      );
    }

    if (paddle.side === "right") {
      const roundedCornerRadius = paddle.paddleRadius;
      const flatSideWidth = paddle.paddleWidth - roundedCornerRadius;
      ctx.moveTo(paddle.paddleY, paddle.paddleX + flatSideWidth);
      ctx.arcTo(
        paddle.paddleY,
        paddle.paddleX + paddle.paddleWidth,
        paddle.paddleY + paddle.paddleHeight,
        paddle.paddleX + paddle.paddleWidth,
        roundedCornerRadius 
      );
      ctx.arcTo(
        paddle.paddleY + paddle.paddleHeight,
        paddle.paddleX + paddle.paddleWidth,
        paddle.paddleY + paddle.paddleHeight,
        paddle.paddleX,
        roundedCornerRadius 
      );
      ctx.lineTo(paddle.paddleY + paddle.paddleHeight, paddle.paddleX);
      ctx.lineTo(paddle.paddleY, paddle.paddleX);
      ctx.arcTo(
        paddle.paddleY,
        paddle.paddleX,
        paddle.paddleY,
        paddle.paddleX + flatSideWidth,
        roundedCornerRadius
      );
    }

    ctx.closePath();
    ctx.fill();
    return;
  }

  /*
   ***** Left Right Paddle *****
   */

  if (paddle.side === "left") {
    // console.log(paddle);
    const roundedCornerRadius = paddle.paddleRadius;
    ctx.moveTo(paddle.paddleX + roundedCornerRadius, paddle.paddleY);
    ctx.arcTo(
      paddle.paddleX,
      paddle.paddleY,
      paddle.paddleX,
      paddle.paddleY + paddle.paddleHeight,
      roundedCornerRadius
    );
    ctx.arcTo(
      paddle.paddleX,
      paddle.paddleY + paddle.paddleHeight,
      paddle.paddleX + paddle.paddleWidth,
      paddle.paddleY + paddle.paddleHeight,
      roundedCornerRadius
    );
    ctx.lineTo(
      paddle.paddleX + paddle.paddleWidth,
      paddle.paddleY + paddle.paddleHeight
    );
    ctx.lineTo(paddle.paddleX + paddle.paddleWidth, paddle.paddleY);
    ctx.arcTo(
      paddle.paddleX + paddle.paddleWidth,
      paddle.paddleY,
      paddle.paddleX + roundedCornerRadius,
      paddle.paddleY,
      roundedCornerRadius
    );
  }
  if (paddle.side === "right") {

    const roundedCornerRadius = paddle.paddleRadius;
    const flatSideWidth = paddle.paddleWidth - roundedCornerRadius;
    ctx.moveTo(paddle.paddleX + flatSideWidth, paddle.paddleY);
    ctx.arcTo(
      paddle.paddleX + paddle.paddleWidth,
      paddle.paddleY,
      paddle.paddleX + paddle.paddleWidth,
      paddle.paddleY + paddle.paddleHeight,
      roundedCornerRadius
    );
    ctx.arcTo(
      paddle.paddleX + paddle.paddleWidth,
      paddle.paddleY + paddle.paddleHeight,
      paddle.paddleX,
      paddle.paddleY + paddle.paddleHeight,
      roundedCornerRadius
    );
    ctx.lineTo(paddle.paddleX, paddle.paddleY + paddle.paddleHeight);
    ctx.lineTo(paddle.paddleX, paddle.paddleY);
    ctx.arcTo(
      paddle.paddleX,
      paddle.paddleY,
      paddle.paddleX + flatSideWidth,
      paddle.paddleY,
      roundedCornerRadius
    );
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
    const paddleVelocity = landscapeModeView
      ? canvasHeight * 0.15
      : canvasHeight * 0.15;
    this.paddleY =
      this.paddleY - paddleVelocity < 0 ? 0 : this.paddleY - paddleVelocity;
  }

  movePaddleDown() {
    const paddleVelocity = landscapeModeView
      ? canvasHeight * 0.15
      : canvasHeight * 0.15;
    if (landscapeModeView) {
      this.paddleY =
        this.paddleY + this.paddleHeight + paddleVelocity > canvasHeight
          ? canvasHeight - this.paddleHeight
          : this.paddleY + paddleVelocity;
    } else {
      this.paddleY =
        this.paddleY + this.paddleHeight + paddleVelocity > canvasWidth
          ? canvasWidth - this.paddleHeight
          : this.paddleY + paddleVelocity;
    }
  }

  // setPaddleVelocity = (speed) => (this.paddleVelocity = speed);

  initialize() {
    // ctx.fillText("TEST", canvasWidth/2 , canvasHeight/2 );
    console.log("w,h", canvasWidth, canvasHeight);
 
    if (canvasWidth >= canvasHeight) {
      this.paddleWidth = 0.012 * canvasWidth; // 2% of canvas width
      this.paddleHeight = 0.22 * canvasHeight; // 20% of canvas height
      this.margin = 0.024; // 5% of canvas width for the margin
      this.paddleRadius = canvasWidth * 0.01;

      this.paddleX = this.side === "left" ? this.margin * canvasWidth 
                    : canvasWidth - (this.margin * canvasWidth) - this.paddleWidth;
        
      this.paddleY = (canvasHeight - this.paddleHeight) / 2;
    } else {
      // console.log("portrait");
      this.paddleWidth = 0.012 * canvasWidth; // 2% of canvas width
      this.paddleHeight = 0.12 * canvasHeight; // 20% of canvas height
      this.margin = 0.024; // 5% of canvas width for the margin
      this.paddleRadius = canvasWidth * 0.01;

      this.paddleX = this.side === "left" ? this.margin * canvasHeight
      : canvasHeight - (this.margin * canvasHeight) - this.paddleWidth;
        
      this.paddleY = canvasWidth / 2 - (this.paddleHeight) / 2;

    }

    // drawPaddle(this);
  }
}

const paddleLeft = new Paddle(0, 0, "left");
const paddleRight = new Paddle(0, 0, "right");
// console.log("first: ", paddleLeft);

paddleLeft.initialize();
paddleRight.initialize();

const ballOptions = {
  radius: 0.019 * ((canvasWidth + canvasHeight) / 2),
  x: canvasWidth / 2,
  y: canvasHeight / 2,
  dx: Math.random() < 0.5 ? -5 : 5,
  dy: 2,
  color: "red",
  paddles: [paddleLeft, paddleRight],
};

const ball = new Ball(ballOptions);
handleResize() 

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
  // if (event.key === "p") toggleAnimation();
}

function updateCanvas() {
  draw();
  requestAnimationFrame(updateCanvas);
}
updateCanvas();

document.addEventListener("keydown", keyDownHandler, false);

window.addEventListener("resize", handleResize);

function handleResize() {
  // ctx.clearRect(0, 0, theCanvas.width, theCanvas.height);
  theCanvas.width = window.innerWidth - 50;
  theCanvas.height = window.innerHeight - 50;
  
   canvasWidth = theCanvas.width;
   canvasHeight = theCanvas.height;

 landscapeModeView = canvasWidth >= canvasHeight;
 portraitModeView  = canvasWidth < canvasHeight;

//  updateCanvas();
ctx.clearRect(0, 0, theCanvas.width, theCanvas.height);
paddleLeft.initialize();
paddleRight.initialize();
 

//  draw();

  // paddleLeft.drawPaddle();
  // paddleRight.drawPaddle();
  // ball.updatePositionOnResize(canvasWidth, canvasHeight);
}

