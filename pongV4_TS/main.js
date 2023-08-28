var canvasElement = document.getElementById("the-canvas");
if (canvasElement) {
    var context = canvasElement.getContext("2d");
    if (context) {
        var canvaWidth = canvasElement.width;
        var canvaHeight = canvasElement.height;
        // Use the 'context' variable to work with the canvas context
        // For example, you can draw shapes or manipulate the canvas
        // Example: Draw a rectangle
        context.fillStyle = "red";
        context.fillRect(10, 10, 100, 100);
    }
}
