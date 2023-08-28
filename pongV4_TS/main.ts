
const canvasElement : HTMLCanvasElement | null = <HTMLCanvasElement>document.getElementById("the-canvas");

if (canvasElement) 
{
    const context: CanvasRenderingContext2D | null = canvasElement.getContext("2d");
    
    if (context) {
        let canvaWidth: number = canvasElement.width;
        let canvaHeight: number = canvasElement.height;
      // Use the 'context' variable to work with the canvas context
      // For example, you can draw shapes or manipulate the canvas
  
      // Example: Draw a rectangle
      context.fillStyle = "green";
      context.fillRect(10, 10, 100, 100);
    }
  }