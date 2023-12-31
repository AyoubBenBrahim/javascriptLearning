let theCanvas = document.getElementById("the-canvas");

ctx = theCanvas.getContext("2d");

w = theCanvas.width;
h = theCanvas.height;
theCircle = 2 * Math.PI;

colorArray = [
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
  constructor(
    x,
    y,
    radius,
    xV,
    yV,
    color,
    paddleL,
    paddleR
  ) {
    this.x = x;
    this.y = y;
    this.xVelocity = xV;
    this.yVelocity = yV;
    this.radius = radius;
    this.color = color;
    this.paddleLeft = paddleL;
    this.paddleRight = paddleR;
  }

  draw() {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, theCircle, false);
    ctx.fillStyle = this.color;
    ctx.fill();
    ctx.closePath();
  }

  reset = () => {
    this.x = w / 2;
    this.y = h / 2;
    this.xVelocity = 5;
    this.yVelocity = 3;
    // this.color = "red";
  };

  update() {
    if (
      (this.x + this.radius >= this.paddleRight.getHorizontalCollisionOffset() && this.paddleRight.isInRangeY(this.y, this.radius)) ||
      this.x - this.radius <= this.paddleLeft.getHorizontalCollisionOffset() && this.paddleLeft.isInRangeY(this.y, this.radius)
    ) {
      this.xVelocity = -this.xVelocity;
      this.color = randomColor();//colorArray[Math.floor(Math.random() * colorArray.length)];
    }
    if (this.y + this.radius > h || this.y - this.radius < 0) {
      this.yVelocity = -this.yVelocity;
      this.color = randomColor();//colorArray[Math.floor(Math.random() * colorArray.length)];
    }
    if ((this.paddleRight.isInRangeX(this.x, this.radius) && this.paddleRight.isInRangeY(this.y, this.radius)) 
    || (this.paddleLeft.isInRangeX(this.x, this.radius) && this.paddleLeft.isInRangeY(this.y, this.radius))) {
      this.reset();
    }
    if (this.x + this.radius > w || this.x - this.radius < 0)
      this.reset();
    

    this.x += this.xVelocity;
    // this.paddleLeft.setPaddleY(this.y --);
    // this.paddleRight.setPaddleY(this.y --);
    // this.y += this.yVelocity;

    this.draw();
  }

}

class Paddle {
  constructor(x, y ,width, height, radius, color, position) {
    this.paddleX = x;
    this.paddleY = y;
    this.paddleWidth = width;
    this.paddleHeight = height;
    this.paddleRadius = radius;
    this.paddleColor = color;
    this.position = position;
  }

  drawPaddle() {
    ctx.fillStyle = this.paddleColor;
    ctx.beginPath();
    if (this.position === "left") {
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
    } else if (this.position === "right") {
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

  setPaddleX = (x) => this.paddleX = x;

  setPaddleY = (y) => this.paddleY = y;

  isInRangeY = (ballCoordY, ballRadius) => {
     if (ballCoordY + ballRadius > this.paddleY && ballCoordY - ballRadius < this.paddleY + this.paddleHeight) return true;
     else return false;
  }

  isInRangeX = (ballCoordX, ballRadius) => {
    if (ballCoordX + ballRadius > this.paddleX && ballCoordX - ballRadius < this.paddleX + this.paddleWidth) return true;
    else return false;
  }

  getHorizontalCollisionOffset = () => this.position === "left" ? this.paddleX + this.paddleWidth : this.paddleX;
  getVerticalCollisionOffset = () => theCanvas.height - (this.paddleY + this.paddleHeight);
  
}

// var paddle_Left = new Paddle(10, 150, 15, 10, "tomato", "left");
// var paddleRight = new Paddle(20, 150, 15, 10, "tomato", "right");

var pdlInitHeight = 150;
var pdlInitWidth = 20;
var pdlinitX = 20;
var pdlInitY = (theCanvas.height - pdlInitHeight) / 2;

var pdlRinitX = theCanvas.width - pdlinitX - pdlInitWidth;
// var pdlRinitY = (theCanvas.height - pdlInitHeight) / 2;

var paddle_Left = new Paddle(pdlinitX, pdlInitY, 20, pdlInitHeight, 15, "tomato", "left"); // x, y ,width, height, radius, color, position
var paddleRight = new Paddle(pdlRinitX , pdlInitY, 20, pdlInitHeight, 15,"tomato", "right");

var ball = new Ball(
  w / 2,
  h/2, // h/2+95 106
  15,
  5,
  5,
  "red",
  paddle_Left,
  paddleRight
);

function animate() {
  requestAnimationFrame(animate);
  ctx.clearRect(0, 0, w, h);
  paddle_Left.drawPaddle();
  paddleRight.drawPaddle();
  ball.update();
}

animate();

// paddle_Left.drawPaddle();

// ctx.beginPath();
// ctx.moveTo(pdlinitX, pdlInitY + pdlInitHeight);
// ctx.lineTo(0, paddle_Left.paddleY + paddle_Left.paddleHeight);
// ctx.lineTo(paddle_Left.paddleY + paddle_Left.paddleHeight, h);
// ctx.stroke();
// console.log("theCanvas.height - (paddle_Left.paddleY + paddle_Left.paddleHeight): ", theCanvas.height - (paddle_Left.paddleY + paddle_Left.paddleHeight));