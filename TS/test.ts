interface Point {
    x: number;
    y: number;
    z: number;
  }
   
  function logPoint(p: Point) {
    console.log(`${p.x}, ${p.y} , ${p.z}`);
  }
   
  // logs "12, 26"
  const point = { x: 12, y: 26 , z: 89};
  logPoint(point);