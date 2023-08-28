let theCanvas = document.getElementById("the-canvas");
let ctx = theCanvas.getContext("2d");
let w = theCanvas.width;
let h = theCanvas.height;
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
  if (ball.ballX < w / 2) {
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

  let speed = Math.sqrt(ball.xVelocity ** 2 + ball.yVelocity ** 2);

  ball.xVelocity =
    ball.ballX < w / 2 ? speed * Math.cos(angle) : -speed * Math.cos(angle);
  ball.yVelocity = speed * Math.sin(angle);

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

  if (ball.ballX < w / 2)
    return left;

  return right;
};

resetGame = (ball) => {
  ball.ballX = w / 2;
  ball.ballY = Math.random() * (h - 2 * ball.radius) + ball.radius;
  ball.xVelocity = Math.random() < 0.5 ? -5 : 5;
  ball.yVelocity = 5;
  ball.color = randomColor();
}

class Ball {
  constructor(x, y, radius, xV, yV, color, paddles) {
    this.ballX = x;
    this.ballY = y;
    this.radius = radius;
    this.xVelocity = xV;
    this.yVelocity = yV;
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
    if (this.ballY + this.radius > h || this.ballY - this.radius < 0) {
      this.yVelocity = -this.yVelocity;
      // if (this.ballX < w / 2 + 30 ) 
      //   {
          
      //     console.log("hit center");
      //   let angle = Math.PI/6 * Math.random()
      //   // this.xVelocity = this.ballY < h / 2 ? Math.cos(angle) : -Math.cos(angle);
      //   this.xVelocity = this.ballX < w / 2 ?  Math.cos(angle) : - Math.cos(angle);
      //   this.yVelocity = Math.sin(angle);

      // }
    }
    // Left and right walls
    if (this.ballX + this.radius > w || this.ballX - this.radius < 0) {
      (this.ballX + this.radius > w) ? leftPaddle.setScore() : rightPaddle.setScore();


    //   if (this.ballX <= w ) 
    //   {
    //     console.log("hit center");
    //   let angle = Math.PI/4
    //   this.xVelocity = -Math.cos(angle) 
    // }

      resetGame(this);
    }
    if (detectVerticalCollision(this, this.paddles)) {
      (this.ballX + this.radius > w/2) ? leftPaddle.setScore() : rightPaddle.setScore();
      resetGame(this);
    }

    this.ballX += this.xVelocity;
    this.ballY += this.yVelocity;

    this.draw();
  }
}

class Paddle {
  constructor(x, y, width, height, radius, speed, color, side) {
    this.paddleX = x;
    this.paddleY = y;
    this.paddleWidth = width;
    this.paddleHeight = height;
    this.paddleRadius = radius;
    this.paddleVelocity = speed;
    this.paddleColor = color;
    this.side = side;
    this.score = 0;
  }

  setScore = () => (this.score += 1);

  drawPaddle() {
    ctx.fillStyle = this.paddleColor;
    ctx.beginPath();
    if (this.side === "left") {
      ctx.moveTo(this.paddleX + this.paddleWidth, this.paddleY);
      ctx.arcTo(
        this.paddleX + this.paddleWidth,
        this.paddleY + this.paddleHeight,
        this.paddleX,
        this.paddleY + this.paddleHeight,
        0
      );
      ctx.arcTo(
        this.paddleX,
        this.paddleY + this.paddleHeight,
        this.paddleX,
        this.paddleY,
        this.paddleRadius
      );
      ctx.arcTo(
        this.paddleX,
        this.paddleY,
        this.paddleX + this.paddleWidth,
        this.paddleY,
        this.paddleRadius
      );
    } else if (this.side === "right") {
      ctx.moveTo(this.paddleX, this.paddleY);
      ctx.arcTo(
        this.paddleX,
        this.paddleY + this.paddleHeight,
        this.paddleX + this.paddleWidth,
        this.paddleY + this.paddleHeight,
        0
      );
      ctx.arcTo(
        this.paddleX + this.paddleWidth,
        this.paddleY + this.paddleHeight,
        this.paddleX + this.paddleWidth,
        this.paddleY,
        this.paddleRadius
      );
      ctx.arcTo(
        this.paddleX + this.paddleWidth,
        this.paddleY,
        this.paddleX,
        this.paddleY,
        this.paddleRadius
      );
    }
    ctx.closePath();
    ctx.fill();
  }

  movePaddleUp() {
    this.paddleY =
      this.paddleY - this.paddleVelocity < 0
        ? 0
        : this.paddleY - this.paddleVelocity;
  }

  movePaddleDown() {
    this.paddleY =
      this.paddleY + this.paddleHeight + this.paddleVelocity > h
        ? h - this.paddleHeight
        : this.paddleY + this.paddleVelocity;
  }

  setPaddleVelocity = (speed) => (this.paddleVelocity = speed);
}

var pdlInitHeight = 70;
var pdlInitWidth = 10;
var pdlinitX = 10;
var pdlInitY = (theCanvas.height - pdlInitHeight) / 2;

var pdlRinitX = theCanvas.width - pdlinitX - pdlInitWidth;

var paddleLeft = new Paddle(
  pdlinitX,
  pdlInitY,
  pdlInitWidth,
  pdlInitHeight,
  15,
  50,
  "tomato",
  "left"
); // x, y ,width, height, radius, color, position
var paddleRight = new Paddle(
  pdlRinitX,
  pdlInitY,
  pdlInitWidth,
  pdlInitHeight,
  15,
  50,
  "tomato",
  "right"
);

var paddles = [paddleLeft, paddleRight];

let ball = new Ball(w / 2, h / 2, 10, 5, 8, "red", paddles);

scoreBoard = (players) => {
  player1 = players[0];
  player2 = players[1];
  ctx.font = "30px Arial";
  ctx.fillStyle = "black";
  ctx.fillText(player1.score, w/2 - 100, h/2);
  ctx.fillText(player2.score, w/2 + 80, h/2);
};

function draw() {
  ctx.clearRect(0, 0, w, h);
  drawDashedCenterLine();
  scoreBoard(paddles);
  paddleLeft.drawPaddle();
  paddleRight.drawPaddle();
  ball.update();
}

function drawDashedCenterLine() {
  ctx.setLineDash([8, 10]); // [line length, space length]
  ctx.strokeStyle = "grey";
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.moveTo(w / 2, 0);
  ctx.lineTo(w / 2, h);
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