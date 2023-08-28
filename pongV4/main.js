let theCanvas = document.getElementById("the-canvas");
let ctx = theCanvas.getContext("2d");
let canvasWidth = theCanvas.width;
let canvasHeight = theCanvas.height;
const theCircle = 2 * Math.PI;

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
  // ballVelocity = 10;
  ballVelocity = canvasWidth * 0.015; // 2.5% of canvas width

  ball.xVelocity =
    ball.ballX < canvasWidth / 2
      ? ballVelocity * Math.cos(angle)
      : -ballVelocity * Math.cos(angle);
  ball.yVelocity = ballVelocity * Math.sin(angle);

  const adjustedPaddleVelocity = ballVelocity * 8;
  pdlLeft.setPaddleVelocity(adjustedPaddleVelocity);
  pdlRight.setPaddleVelocity(adjustedPaddleVelocity);

  ball.color = randomColor();
}

detectHorizontalCollision = (ball, paddles) =>
  isBallWithinPaddleRangeX(ball, paddles) &&
  isBallWithinPaddleRangeY(ball, paddles);

// detectVerticalCollision 
ballOffPaddleEdges = (ball, paddles) => {
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

  if (ball.ballX < canvasWidth / 2) return left;

  return right;
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

  return { xV: ball_vel_x, yV: ball_vel_y };
}

resetGame = (ball) => {
  const minY = ball.radius + 10;
  const maxY = canvasHeight - 10;
  const randomY = Math.random() * (maxY - minY) + minY;

  ball.ballX = canvasWidth / 2;
  ball.ballY = randomY;
  const { xV, yV } = getRandomVelocity();
  ball.xVelocity = xV;
  ball.yVelocity = yV;
  ball.color = randomColor();
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
    if (
      this.ballY + this.radius > canvasHeight ||
      this.ballY - this.radius < 0
    ) {
      if (
        this.ballX - this.radius >= canvasWidth / 2 - 3 &&
        this.ballX <= canvasWidth / 2 + 3
      )
        this.ballX += this.ballX > canvasWidth / 2 ? -5 : 7;

      this.yVelocity = -this.yVelocity;
    }
    // Left and right boundaries
    // if (detectHorizontalCollision(this, this.paddles)) {
    //   paddleBallCollision(this.paddles, this);
    // } else if (isBallWithinPaddleRangeX(this, this.paddles)) {
    if (ballOffPaddleEdges(this, this.paddles)) {
      this.ballX + this.radius > canvasWidth / 2
        ? leftPaddle.updateScore()
        : rightPaddle.updateScore();

      shiftPaddles(this);
      resetGame(this);
    }

    this.ballX += this.xVelocity;
    this.ballY += this.yVelocity;

    this.draw();
  }

  updatePositionOnResize = (canvasWidth, canvasHeight) => {
    this.radius = canvasWidth * 0.03;
  }

}

function shiftPaddles(ball) {
  let leftPaddle = ball.paddles[0];
  let rightPaddle = ball.paddles[1];

  let ballPos = ball.ballX < canvasWidth / 2;
  let shiftRatio = 10;
  if (
    leftPaddle.paddleX + leftPaddle.paddleWidth + shiftRatio >=
      canvasWidth / 3 ||
    rightPaddle.paddleX - shiftRatio <= (2 * canvasWidth) / 3
  ) {
    let winner = leftPaddle.score > rightPaddle.score ? "Left" : "Right";
    alert("Game Over! " + winner + " player wins!");
    // document.location.reload();
  }
  if (ballPos) leftPaddle.paddleX = leftPaddle.paddleX + shiftRatio;
  else rightPaddle.paddleX = rightPaddle.paddleX - shiftRatio;
}

function drawPaddle(paddle) {
  ctx.fillStyle = paddle.paddleColor;
  ctx.beginPath();



  // if (canvasWidth > canvasHeight)
  // {
  //   paddle.side === "left" && ctx.rect(paddle.paddleX ,paddle.paddleY, paddle.paddleWidth, paddle.paddleHeight);
  //   paddle.side === "right" && ctx.rect(paddle.paddleX , paddle.paddleY, paddle.paddleWidth, paddle.paddleHeight);
  // }
  // else 
  // {
  //     paddle.side === "left" && ctx.rect(paddle.paddleY ,paddle.paddleX, paddle.paddleHeight,paddle.paddleWidth);
  //     paddle.side === "right" && ctx.rect(paddle.paddleY, paddle.paddleX, paddle.paddleHeight, paddle.paddleWidth);
  //     // paddle.side === "right" && ctx.rect(paddle.paddleY - paddle.paddleWidth  , paddle.paddleX, paddle.paddleHeight, paddle.paddleWidth);
  // }

  if (canvasWidth < canvasHeight)
  {
    if (paddle.side === "left") {
      const roundedCornerRadius = paddle.paddleRadius;
      ctx.moveTo(paddle.paddleY, paddle.paddleX + roundedCornerRadius);
      ctx.arcTo(
        paddle.paddleY,
        paddle.paddleX,
        paddle.paddleY + paddle.paddleHeight,
        paddle.paddleX,
        roundedCornerRadius //- 12
      );
      ctx.arcTo(
        paddle.paddleY + paddle.paddleHeight,
        paddle.paddleX,
        paddle.paddleY + paddle.paddleHeight,
        paddle.paddleX + paddle.paddleWidth,
        roundedCornerRadius //-12
      );
      ctx.lineTo(paddle.paddleY + paddle.paddleHeight, paddle.paddleX + paddle.paddleWidth);
      ctx.lineTo(paddle.paddleY, paddle.paddleX + paddle.paddleWidth);
      ctx.arcTo(
        paddle.paddleY,
        paddle.paddleX + paddle.paddleWidth,
        paddle.paddleY,
        paddle.paddleX + roundedCornerRadius,
        roundedCornerRadius
      );
    }
          
      // if (paddle.side === "right") {
      //   ctx.moveTo(paddle.paddleY, paddle.paddleX);
      //   ctx.arcTo(
      //     paddle.paddleY + paddle.paddleHeight,
      //     paddle.paddleX,
      //     paddle.paddleY + paddle.paddleHeight,
      //     paddle.paddleX + paddle.paddleWidth,
      //     0
      //   );
      //   ctx.arcTo(
      //     paddle.paddleY + paddle.paddleHeight,
      //     paddle.paddleX + paddle.paddleWidth,
      //     paddle.paddleY,
      //     paddle.paddleX + paddle.paddleWidth,
      //     paddle.paddleRadius
      //   );
      //   ctx.arcTo(
      //     paddle.paddleY,
      //     paddle.paddleX + paddle.paddleWidth,
      //     paddle.paddleY,
      //     paddle.paddleX,
      //     paddle.paddleRadius
      //   );
      // }
    
        if (paddle.side === "right") {
        const roundedCornerRadius = paddle.paddleRadius;
        const flatSideWidth = paddle.paddleWidth - roundedCornerRadius;
        ctx.moveTo(paddle.paddleY, paddle.paddleX + flatSideWidth);
        ctx.arcTo(
          paddle.paddleY,
          paddle.paddleX + paddle.paddleWidth,
          paddle.paddleY + paddle.paddleHeight,
          paddle.paddleX + paddle.paddleWidth,
          roundedCornerRadius //- 12
        );
        ctx.arcTo(
          paddle.paddleY + paddle.paddleHeight,
          paddle.paddleX + paddle.paddleWidth,
          paddle.paddleY + paddle.paddleHeight,
          paddle.paddleX,
          roundedCornerRadius //-12
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
   console.log("canvasWidth > canvasHeight")
  /*
  ***** Left Right Paddle *****
  */

  if (paddle.side === "left") {
    const roundedCornerRadius = paddle.paddleRadius;  
    ctx.moveTo(paddle.paddleX + roundedCornerRadius, paddle.paddleY);
    ctx.arcTo(
      paddle.paddleX,
      paddle.paddleY,
      paddle.paddleX,
      paddle.paddleY + paddle.paddleHeight,
      roundedCornerRadius //- 12
    );
    ctx.arcTo(
      paddle.paddleX,
      paddle.paddleY + paddle.paddleHeight,
      paddle.paddleX + paddle.paddleWidth,
      paddle.paddleY + paddle.paddleHeight,
      roundedCornerRadius //-12
    );
    ctx.lineTo(paddle.paddleX + paddle.paddleWidth, paddle.paddleY + paddle.paddleHeight);
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
      roundedCornerRadius //- 12
    );
    ctx.arcTo(
      paddle.paddleX + paddle.paddleWidth,
      paddle.paddleY + paddle.paddleHeight,
      paddle.paddleX,
      paddle.paddleY + paddle.paddleHeight,
      roundedCornerRadius //-12
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
  constructor(x, y, side, { width, height, radius, velocity, color }) {
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

  updatePositionOnResize = (canvasWidth, canvasHeight) => {
    this.paddleHeight = canvasHeight * 0.1; // Example: paddle height is 10% of canvas height
    this.paddleWidth = canvasWidth * 0.02; // Example: paddle width is 2% of canvas width
  }
}

// const paddleHeight = 70;
// const paddleWidth = 10;
// const margin = 20;
// const initLeftX = margin - paddleWidth / 2;
// const initRightX = canvasWidth - initLeftX - paddleWidth;
// const initY = (canvasHeight - paddleHeight) / 2;

// const paddleOptions = {
//   width: paddleWidth,
//   height: paddleHeight,
//   radius: 15,
//   velocity: 50,
//   color: "tomato",
// };

// const paddleHeight = 0.0005 * canvasHeight;//0.2;////0.0003 * canvasHeight; // 20% of canvas height
// const paddleWidth = 0.00005 * canvasWidth;//0.012; // 2% of canvas width
// const margin = 0.02; // 5% of canvas width for the margin

// const initLeftX = margin * canvasWidth - paddleWidth * canvasWidth / 2;
// const initRightX = canvasWidth - initLeftX - (paddleWidth * canvasWidth);
// const initY = (canvasHeight - (paddleHeight * canvasHeight)) / 2;

const paddleHeight = 0.22;//0.2;////0.0003 * canvasHeight; // 20% of canvas height
const paddleWidth = 0.012;//0.012; // 2% of canvas width
const margin = 0.024; // 5% of canvas width for the margin

// if (canvasWidth > canvasHeight) {
//   let initLeftX = margin * canvasWidth;
//   let initRightX = canvasWidth - initLeftX - paddleWidth * canvasWidth;
//   let initY = (canvasHeight - paddleHeight * canvasHeight) / 2;
// } else if (canvasWidth < canvasHeight) {
  
// }

let initLeftX;
let initRightX;
let initY;

if (canvasWidth > canvasHeight)
{
  initLeftX = margin * canvasWidth;
  initRightX = canvasWidth - initLeftX - paddleWidth * canvasWidth;
  initY = (canvasHeight - paddleHeight * canvasHeight) / 2;
}
else{
  initLeftX = margin * canvasHeight;
  initRightX = canvasHeight - initLeftX - paddleWidth * canvasHeight;
  initY = canvasWidth / 2 - ((paddleHeight * canvasHeight) / 2);
}



const paddleOptions = {
  width: paddleWidth * canvasWidth,
  height: paddleHeight * canvasHeight,
  radius: canvasWidth * 0.012, //0.0375 3.75% of canvas width for the radius
  velocity: 50,
  color: "tomato",
};

const paddleLeft = new Paddle(initLeftX, initY, "left", paddleOptions);
const paddleRight = new Paddle(initRightX, initY, "right", paddleOptions);

const ballOptions = {
  radius:0.019 * ((canvasWidth + canvasHeight) / 2), // 1% of canvas width for the radius
  x: canvasWidth / 2 ,
  y: canvasHeight / 2,
  dx: Math.random() < 0.5 ? -5 : 5,
  dy: 5,
  color: "red",
  paddles: [paddleLeft, paddleRight],
};

const ball = new Ball(ballOptions);

const paddles = [paddleLeft, paddleRight];
scoreBoard = (paddles) => {
  const paddleL = paddles[0];
  const paddleR = paddles[1];
  ctx.font = "30px Arial";
  ctx.fillStyle = "black";
  ctx.fillText(paddleL.score, canvasWidth / 2 - 100, canvasHeight / 2);
  ctx.fillText(paddleR.score, canvasWidth / 2 + 80, canvasHeight / 2);
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
  ctx.lineWidth = 0.004 * canvasWidth;//4;
  ctx.beginPath();
  if (canvasWidth > canvasHeight) {
    ctx.moveTo((canvasWidth / 2) , 0);
    ctx.lineTo((canvasWidth / 2) , canvasHeight);
    ctx.stroke();
    ctx.beginPath();
    ctx.lineWidth = 1;
    ctx.strokeStyle = "red";
    ctx.moveTo(canvasWidth / 3, 0);
    ctx.lineTo(canvasWidth / 3, canvasHeight);
    ctx.moveTo((2 * canvasWidth) / 3, 0);
    ctx.lineTo((2 * canvasWidth) / 3, canvasHeight);
    ctx.stroke();
  }
  else {
    ctx.moveTo(0, (canvasHeight / 2));
    ctx.lineTo(canvasWidth, (canvasHeight / 2));
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

// window.addEventListener("mousemove", (event) => {
//   // console.log(event);
//   let relativeY = event.clientY - theCanvas.offsetTop;
//   let relativeX = event.clientX - theCanvas.offsetLeft;
//   if (relativeY > 0 && relativeY < canvasHeight) {
//     if (relativeX > canvasWidth / 2)
//       paddleRight.paddleY = relativeY - paddleRight.paddleHeight / 2;
//     else
//     paddleLeft.paddleY = relativeY - paddleLeft.paddleHeight / 2;
//   }
// });

window.addEventListener('resize', handleResize);


function handleResize() {
console.log(window.innerWidth + " " + window.innerHeight)
  ctx.clearRect(0, 0, window.width, window.height);
  // canvasWidth = 400;
  // canvasHeight = 400;

  // paddleLeft.updatePositionOnResize(canvasWidth, canvasHeight);
  // paddleRight.updatePositionOnResize(canvasWidth, canvasHeight);
  // ball.updatePositionOnResize(canvasWidth, canvasHeight);
}
