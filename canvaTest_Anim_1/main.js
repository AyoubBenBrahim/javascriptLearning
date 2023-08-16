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

class Circle {
  constructor(x, y, radius, xV, yV, color) {
      this.x = x;
      this.y = y;
    this.xVelocity = xV;
    this.yVelocity = yV;
    this.radius = radius;
    this.color = color;
  }

  draw() {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, theCircle, false);
    ctx.fillStyle = this.color;
    ctx.fill();
    ctx.closePath();
  }

  update() {
    if (this.x + this.radius > w || this.x - this.radius < 0) {
      this.xVelocity = -this.xVelocity;
      this.color = colorArray[Math.floor(Math.random() * colorArray.length)];
    }
    if (this.y + this.radius > h || this.y - this.radius < 0) {
      this.yVelocity = -this.yVelocity;
      this.color = colorArray[Math.floor(Math.random() * colorArray.length)];
    }

    this.x += this.xVelocity;
    this.y += this.yVelocity;

    this.draw();
  }
}

var c1 = new Circle(30, 30, 20, 5, 3, "red");
var c2 = new Circle(Math.random()*w, Math.random()*h, 20, 5, 3, "blue");
var c3 = new Circle(Math.random()*w, Math.random()*h, 20, 5, 3, "green");

function animate() {
  requestAnimationFrame(animate);
  ctx.clearRect(0, 0, w, h);

  c1.update();
  c2.update();
  c3.update();
}

animate();
