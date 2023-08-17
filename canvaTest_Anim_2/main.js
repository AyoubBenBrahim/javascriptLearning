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

class Ball {
  constructor(x, y, radius, xV, yV, color, paddleLeftOffset, paddleRightOffset) {
    this.x = x;
    this.y = y;
    this.xVelocity = xV;
    this.yVelocity = yV;
    this.radius = radius;
    this.color = color;
    this.paddleLeftOffset = paddleLeftOffset;
    this.paddleRightOffset = paddleRightOffset;
  }

  draw() {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, theCircle, false);
    ctx.fillStyle = this.color;
    ctx.fill();
    ctx.closePath();
  }

  update() {

    if (this.x + this.radius > this.paddleRightOffset || this.x - this.radius  < this.paddleLeftOffset) {
      // if (this.x  < this.paddleLeftOffset)
      // {
      //   console.log("x  " + this.x );
      //   console.log("radius: " + (this.radius));
      //   console.log("x - radius: " + (this.x - this.radius));
      //   console.log("paddleLeftOffset: " + this.paddleLeftOffset); 

      //   28 - 20 = 8
      //   x  28
      //   radius: 20
      //   x - radius: 8
      //   paddleLeftOffset: 30

      // }
      this.xVelocity = -this.xVelocity;
      this.color = colorArray[Math.floor(Math.random() * colorArray.length)];
    }
    if (this.y + this.radius > h || this.y - this.radius < 0) {
      this.yVelocity = -this.yVelocity;
      this.color = colorArray[Math.floor(Math.random() * colorArray.length)];
    }

    this.x += this.xVelocity;
    // this.y += this.yVelocity;

    this.draw();
  }
}

// class Paddle {
//   constructor(width, height, radius, margin, color, position) {
//     this.paddleWidth = width;
//     this.paddleHeight = height;
//     this.paddleRadius = radius;
//     this.paddleMargin = margin;
//     this.paddleColor = color;
//     this.position = position;
//     this.setPaddleX();
//     this.paddleY = (theCanvas.height - height) / 2;
//   }

//   setPaddleX() {
//     if (this.position === "left") 
//       this.paddleX = this.paddleMargin;
//     else if (this.position === "right")
//       this.paddleX = theCanvas.width - this.paddleWidth - this.paddleMargin;
//     this.drawArcs = [
//       this.paddleX,
//       this.paddleY,
//       this.paddleX + this.paddleWidth,
//       this.paddleY + this.paddleHeight,
//     ];
//   }

//   drawLeftPaddle() {
//     ctx.moveTo(this.drawArcs[0], this.drawArcs[1]);
//     ctx.arcTo(
//       this.drawArcs[0],
//       this.drawArcs[3],
//       this.drawArcs[2],
//       this.drawArcs[3],
//       0
//     );
//     ctx.arcTo(
//       this.drawArcs[2],
//       this.drawArcs[3],
//       this.drawArcs[2],
//       this.drawArcs[1],
//       this.paddleRadius
//     );
//     ctx.arcTo(
//       this.drawArcs[2],
//       this.drawArcs[1],
//       this.drawArcs[0],
//       this.drawArcs[1],
//       this.paddleRadius
//     );
//   }

//   drawRightPaddle() {
//     ctx.moveTo(this.drawArcs[2], this.drawArcs[1]);
//     ctx.arcTo(
//       this.drawArcs[2],
//       this.drawArcs[3],
//       this.drawArcs[0],
//       this.drawArcs[3],
//      0
//     );
//     ctx.arcTo(
//       this.drawArcs[0],
//       this.drawArcs[3],
//       this.drawArcs[0],
//       this.drawArcs[1],
//       this.paddleRadius
//     );
//     ctx.arcTo(
//       this.drawArcs[0],
//       this.drawArcs[1],
//       this.drawArcs[2],
//       this.drawArcs[1],
//       this.paddleRadius
//     );
//   }

//   drawPaddle() {
//     ctx.fillStyle = this.paddleColor;
//     ctx.beginPath();
//     (this.position === "left") ? this.drawLeftPaddle() : this.drawRightPaddle();
//     ctx.closePath();
//     ctx.fill();
//   }

//   getOffset() {
//     return this.position === "left" ? this.paddleX + this.paddleWidth : this.paddleX;
//   }
// }

class Paddle {
  constructor(width, height, radius, margin, color, position) {
    this.paddleWidth = width;
    this.paddleHeight = height;
    this.paddleRadius = radius;
    this.paddleMargin = margin;
    this.paddleColor = color;
    this.position = position;
    this.setPaddleX();
    this.paddleY = (theCanvas.height - height) / 2;
  }

  setPaddleX() {
    if (this.position === "left")
      this.paddleX = this.paddleMargin;
     else if (this.position === "right")
      this.paddleX = theCanvas.width - this.paddleWidth - this.paddleMargin;
  }

  drawPaddle() {
    ctx.fillStyle = this.paddleColor;
    ctx.beginPath();
    if (this.position === "left") {
      ctx.moveTo(
        this.paddleX + this.paddleWidth,
        this.paddleY
      );
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
      ctx.moveTo(
        this.paddleX,
        this.paddleY
      );
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

  getOffset = () => this.position === "left" ? this.paddleX + this.paddleWidth : this.paddleX;
  
}

// class Paddle {
//   constructor(width, height, radius, margin, color, position) {
//     this.paddleWidth = width;
//     this.paddleHeight = height;
//     this.paddleRadius = radius;
//     this.paddleMargin = margin;
//     this.paddleColor = color;
//     this.paddleX = position === "left" ? margin : w - width - margin;
//     this.paddleY = (h - height) / 2;
//     this.position = position;
//   }

//   drawPaddle() {
//     ctx.fillStyle = this.paddleColor;
//     ctx.beginPath();
//     ctx.moveTo(this.paddleX + this.paddleWidth, this.paddleY);
//     ctx.arcTo(
//       this.paddleX + this.paddleWidth,
//       this.paddleY + this.paddleHeight,
//       this.paddleX,
//       this.paddleY + this.paddleHeight,
//       0 // pdl left bottom 
//     );
//     ctx.arcTo(
//       this.paddleX,
//       this.paddleY + this.paddleHeight,
//       this.paddleX,
//       this.paddleY,
//       this.paddleRadius
//     );
//     ctx.arcTo(
//       this.paddleX,
//       this.paddleY,
//       this.paddleX + this.paddleWidth,
//       this.paddleY,
//       this.paddleRadius
//     );
//     ctx.closePath();
//     ctx.fill();
//   }

//   getOffset() {
//     return ( (this.position === "left") ? this.paddleX + this.paddleWidth : this.paddleX );
//   }
// }

var paddle_Left = new Paddle(20, 150, 15, 10, "tomato", "left"); 
var paddleRight = new Paddle(20, 150, 15, 10, "tomato", "right");
var ball = new Ball(w/2, h/2, 20, 5, 3, "red", paddle_Left.getOffset(), paddleRight.getOffset());

function animate() {
  requestAnimationFrame(animate);
  ctx.clearRect(0, 0, w, h);
  paddle_Left.drawPaddle();
  paddleRight.drawPaddle();
  ball.update();
}

animate();
