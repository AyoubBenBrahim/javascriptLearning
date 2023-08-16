
let theCanvas = document.getElementById("the-canvas");

// getContext is a method of the canvas object that returns a context object that has methods and properties that allow us to draw on the canvas
ctx = theCanvas.getContext("2d");

// fillStyle is a property of the context object that sets the color of the fill
// rgb for grey is 128, 128, 128
ctx.fillStyle = "rgb(128, 128, 128)";
ctx.fillRect(20, 10, theCanvas.width - 30, theCanvas.height - 20); // x, y, width, height

ctx.strokeStyle = "rgb(255, 255, 255)"; // white
ctx.lineWidth = 5; 
ctx.beginPath();
ctx.moveTo(50, 50);
ctx.lineTo(200, 50);
ctx.lineTo(200, 200);
ctx.lineTo(50, 190);
ctx.closePath();

ctx.stroke(); // draws the line

ctx.fillStyle = "rgb(0, 255, 0)"; // green
ctx.fill(); // fills the shape

//************* */

w = theCanvas.width;
h = theCanvas.height;
theCircle = 2 * Math.PI; 

ctx.beginPath();
// ctx.strokeStyle = "rgb(255, 0, 0)"; // red
ctx.arc(w/2, h/2, 50, 0, theCircle, false); // x, y, radius, startAngle, endAngle, anticlockwise 
// ctx.moveTo(w/2 + 80, h/2); 
ctx.closePath();
ctx.stroke();
ctx.beginPath();
ctx.arc(w/2, h/2, 80, 0, 0.5 * theCircle, true); // 80% of the circle
ctx.stroke();


//************* */

ctx.beginPath();
ctx.strokeStyle = "rgb(255, 255, 0)";//  yellow
ctx.arc(w/1.5 + 80 , h/2, 70, 0, Math.PI * 2, true); // Outer circle
ctx.fill();
ctx.moveTo(w/1.5 + 119, h/2);
ctx.arc(w/1.5 + 80, h/2, 35, 0, Math.PI, false); // Mouth (clockwise)
ctx.moveTo(w/1.5 + 58, h/2 - 20);

ctx.fillStyle = "rgb(0, 0, 0)"; // black
ctx.arc(w/1.5 + 50, h/2 - 20, 10, 0, Math.PI * 2, true); // Left eye
ctx.moveTo(w/1.4 + 88, h/2 - 20);
ctx.arc(w/1.4 + 80, h/2 - 20, 10, 0, Math.PI * 2, true);  // Right eye
ctx.fill();//
ctx.stroke();

ctx.closePath();

//************* */

ctx.beginPath();
ctx.strokeStyle = "rgb(255, 255, 255)";
ctx.moveTo(w/1.5 + 80, h/2 + 75);
ctx.lineTo(w/1.5 + 80, h/2 + 150);
// draw arms
ctx.moveTo(w/1.5 + 80, h/2 + 100);
ctx.lineTo(w/1.5 + 30, h/2 + 130);
ctx.moveTo(w/1.5 + 80, h/2 + 100);
ctx.lineTo(w/1.5 + 130, h/2 + 130);
// draw legs
ctx.moveTo(w/1.5 + 80, h/2 + 150);
ctx.lineTo(w/1.5 + 30, h/2 + 200);
ctx.moveTo(w/1.5 + 80, h/2 + 150);
ctx.lineTo(w/1.5 + 130, h/2 + 200);
ctx.stroke();
ctx.closePath();
