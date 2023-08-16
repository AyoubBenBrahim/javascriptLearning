
let theCanvas = document.getElementById("the-canvas");

// getContext is a method of the canvas object that returns a context object that has methods and properties that allow us to draw on the canvas
theContext = theCanvas.getContext("2d");

// fillStyle is a property of the context object that sets the color of the fill
theContext.fillStyle = "rgb(200, 0, 0)"; 
theContext.fillRect(10, 10, theCanvas.width, theCanvas.height); // x, y, width, height

w = theCanvas.width;
h = theCanvas.height;

theContext.font = "30px Arial";
theContext.fillStyle = "rgb(0, 0, 200)";

let width = 60;

theContext.fillRect(50, 50, width, h - 50); // x, y, width, height
theContext.fillStyle = "rgb(255, 255, 255)"; // white
theContext.fillText("1", 50+width/3, h - 20); // text, x, y

theContext.fillStyle = "rgb(0, 200, 0)";
theContext.fillRect(150, 100, width, h - 100);
theContext.fillStyle = "rgb(255, 255, 255)"; // white
theContext.fillText("2", 150+width/3, h - 20); // text, x, y

theContext.fillStyle = "rgb(0, 200, 200)";
theContext.fillRect(250, 150, width, h - 150);
theContext.fillStyle = "rgb(255, 255, 255)"; // white
theContext.fillText("3", 250+width/3, h - 20); // text, x, y

theContext.fillStyle = "rgb(200, 0, 200)";
theContext.fillRect(350, 200, width, h - 200);
theContext.fillStyle = "rgb(255, 255, 255)"; // white
theContext.fillText("4", 350+width/3, h - 20); // text, x, y

theContext.fillStyle = "rgb(200, 200, 0)";
theContext.fillRect(450, 250, width, h - 250);
theContext.fillStyle = "rgb(255, 255, 255)"; // white
theContext.fillText("5", 450+width/3, h - 20); // text, x, y

theContext.fillStyle = "rgb(200, 200, 200)";
theContext.fillRect(550, 300, width, h - 300);
theContext.fillStyle = "rgb(255, 255, 255)"; // white
theContext.fillText("6", 550+width/3, h - 20); // text, x, y





















