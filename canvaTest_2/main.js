
let theCanvas = document.getElementById("the-canvas");

// getContext is a method of the canvas object that returns a context object that has methods and properties that allow us to draw on the canvas
theContext = theCanvas.getContext("2d");

// fillStyle is a property of the context object that sets the color of the fill
// rgb for grey is 128, 128, 128
theContext.fillStyle = "rgb(128, 128, 128)";
theContext.fillRect(10, 10, theCanvas.width, theCanvas.height); // x, y, width, height

theContext.strokeStyle = "rgb(255, 255, 255)"; // white
theContext.lineWidth = 5; 
theContext.beginPath();
theContext.moveTo(50, 50);
theContext.lineTo(200, 50);
theContext.lineTo(200, 200);
theContext.lineTo(50, 190);
theContext.closePath();

theContext.stroke(); // draws the line

theContext.fillStyle = "rgb(0, 255, 0)"; // green
theContext.fill(); // fills the shape

