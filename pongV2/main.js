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

class Ball {
  constructor(x, y, radius, xV, yV, color, paddleLeft, paddleRight) {
    this.x = x;
    this.y = y;
    this.radius = radius;
    this.xVelocity = xV;
    this.yVelocity = yV;
    this.color = color;
    this.paddleLeft = paddleLeft;
    this.paddleRight = paddleRight;
  }

  draw() {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, theCircle, false);
    ctx.fillStyle = this.color;
    ctx.fill();
    ctx.closePath();
  }

  reset() {
    this.x = w / 2;
    this.y = Math.random() * (h - 2 * this.radius) + this.radius;
    this.xVelocity = Math.random() < 0.5 ? -5 : 5; 
    this.yVelocity = 5;
    this.color = randomColor();
  }

  update() {
    if (
      (this.x + this.radius >= this.paddleRight.detectHorizontalCollision() &&
        this.paddleRight.isBallInRangeY(this.y, this.radius)) ||
      (this.x - this.radius <= this.paddleLeft.detectHorizontalCollision() &&
        this.paddleLeft.isBallInRangeY(this.y, this.radius))
    ) {
      let angle = 0;
      if (this.x < w / 2) {
  
        // const relativeY = this.y - this.paddleLeft.paddleHeight / 2;
        // angle = ((relativeY / this.paddleLeft.paddleHeight) * Math.PI) / 3 - Math.PI / 6;

        const paddleCenterY = this.paddleLeft.paddleY + this.paddleLeft.paddleHeight / 2;
        const relativeY = this.y - paddleCenterY;
        const normalizedY = relativeY / (this.paddleLeft.paddleHeight / 2);
        let maxAngle = Math.PI / 4; // 45 degrees
        angle = normalizedY * maxAngle;//  -  Math.PI / 6;
        // we do - PI/6 because the angle is calculated from the left side of the canvas.

        // this.xVelocity = 5 * Math.cos(angle); // Convert the angle to x and y velocities
        // this.yVelocity = 5 * Math.sin(angle);
        
      } else {
        // Ball collided with the right paddle
        const paddleCenterY = this.paddleRight.paddleY + this.paddleRight.paddleHeight / 2;
        const relativeY = this.y - paddleCenterY; 
        const normalizedY = relativeY / (this.paddleRight.paddleHeight / 2);
        let maxAngle = Math.PI / 4;
        angle = normalizedY * maxAngle// + 5 * Math.PI / 6;
         // because the paddle is on the right side of the canvas we need to add 5/6 of PI to the angle because the angle is calculated from the left side of the canvas
        //  this.xVelocity = 5 * Math.cos(angle) * -1; // Convert the angle to x and y velocities
        //  this.yVelocity = 5 * Math.sin(angle);
        }


      let speed = Math.sqrt(this.xVelocity ** 2 + this.yVelocity ** 2);
      this.xVelocity = (this.x < w/2) ? speed * Math.cos(angle) : -speed * Math.cos(angle);
      this.yVelocity = speed * Math.sin(angle);

      

      this.color = randomColor();
    }
    if (this.y + this.radius >= h || this.y - this.radius <= 0) {
      // Top and bottom walls
      this.yVelocity = -this.yVelocity;
      // this.color = randomColor();
    }
    if (this.x + this.radius > w || this.x - this.radius < 0) {
      this.reset();
    }
    if (
      this.paddleLeft.detectVerticalCollision(this) ||
      this.paddleRight.detectVerticalCollision(this)
    ) {
      // console.log("vertical collision");
      this.reset();
    }

    this.x += this.xVelocity;
    this.y += this.yVelocity;


    this.draw();
  }
}

class Paddle {
  constructor(x, y, width, height, radius, speed ,color, side) {
    this.paddleX = x;
    this.paddleY = y;
    this.paddleWidth = width;
    this.paddleHeight = height;
    this.paddleRadius = radius;
    this.paddleVelocity = speed;
    this.paddleColor = color;
    this.side = side;
  }

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

  detectHorizontalCollision = () =>
    this.side === "left" ? this.paddleX + this.paddleWidth : this.paddleX;

  // detectVerticalCollision(ball) {
  //   if (this.side === "left") {
  //     return (
  //       ball.x < this.paddleX + this.paddleWidth &&
  //       ball.x > this.paddleX &&
  //       ball.y > this.paddleY &&
  //       ball.y < this.paddleY + this.paddleHeight
  //     );
  //   } else if (this.side == "right") {
  //     return (
  //       ball.x + ball.radius > this.paddleX &&
  //       ball.x < this.paddleX + this.paddleWidth &&
  //       ball.y > this.paddleY &&
  //       ball.y < this.paddleY + this.paddleHeight
  //     );
  //   }
  //   return false;
  // }

  detectVerticalCollision(ball) {
    if (this.side === "left") {
      return (
         ball.x  < this.paddleX + this.paddleWidth
         
      );
    } else if (this.side === "right") {
      return (
        ball.x  > this.paddleX
        
      );
    }
  }

  isBallInRangeY(ballY, ballRadius) {
    return (
      ballY + ballRadius > this.paddleY &&
      ballY - ballRadius < this.paddleY + this.paddleHeight
    );
  }

  isInRangeX(ballX, ballRadius) {
    if (this.side === "left") {
      return ballX - ballRadius < this.paddleX + this.paddleWidth;
    } else if (this.side === "right") {
      return ballX + ballRadius > this.paddleX;
    }
  }

  movePaddleUp() {
    this.paddleY = this.paddleY - this.paddleVelocity < 0 ? 0 : this.paddleY - this.paddleVelocity;
  }

  movePaddleDown() {
    this.paddleY =
      this.paddleY + this.paddleHeight + this.paddleVelocity > h
        ? h - this.paddleHeight
        : this.paddleY + this.paddleVelocity;
  }

setPaddleVelocity = (speed) => this.paddleVelocity = speed;
}

var pdlInitHeight = 150;
var pdlInitWidth = 20;
var pdlinitX = 10;
var pdlInitY = (theCanvas.height - pdlInitHeight) / 2;

var pdlRinitX = theCanvas.width - pdlinitX - pdlInitWidth;

var paddleLeft = new Paddle(
  pdlinitX,
  pdlInitY,
  pdlInitWidth,
  pdlInitHeight,
  15,
  40,
  "tomato",
  "left"
); // x, y ,width, height, radius, color, position
var paddleRight = new Paddle(
  pdlRinitX,
  pdlInitY,
  pdlInitWidth,
  pdlInitHeight,
  15,
  40,
  "tomato",
  "right"
);

let ball = new Ball(w / 2, h / 2, 10, 5, 8, "red", paddleLeft, paddleRight);

function draw() {
  ctx.clearRect(0, 0, w, h);
  drawDashedCenterLine();
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
