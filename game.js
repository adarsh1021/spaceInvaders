let gamep5 = new p5((sketch) => {
  const canvasDiv = document.getElementById("game");
  const WIDTH = canvasDiv.offsetWidth;
  const HEIGHT = canvasDiv.offsetHeight;

  sketch.setup = () => {
    sketch.createCanvas(WIDTH, HEIGHT);
    sketch.noSmooth(); // to turn off antialiasing
    sketch.frameRate(10);
    green = sketch.color(51, 255, 0);

    player = new MyShip(sketch.width, sketch.height);
  };

  sketch.draw = () => {
    player.drawShip();
  };
}, "game");
