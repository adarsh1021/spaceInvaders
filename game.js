let gamep5 = new p5((sketch) => {
  let x = 100;
  let y = 100;
  const canvasDiv = document.getElementById("game");
  const WIDTH = canvasDiv.offsetWidth;
  const HEIGHT = canvasDiv.offsetHeight;

  sketch.setup = () => {
    sketch.createCanvas(WIDTH, HEIGHT);
  };

  sketch.draw = () => {};
}, "game");
