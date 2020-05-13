// To create the canvas. Once it is created can use width and height.
let HEIGHT;
let WIDTH;

async function preload() {
  model = await handpose.load();
}

let player;
let green;

function setup() {
  const canvasDiv = document.getElementById("sketch");
  WIDTH = canvasDiv.offsetWidth;
  HEIGHT = canvasDiv.offsetHeight;
  let canvas = createCanvas(WIDTH, HEIGHT);
  canvas.parent("sketch");

  frameRate(16);
  noSmooth(); // to turn off antialiasing
  imageMode(CENTER);

  green = color(51, 255, 0);

  let constraints = {
    video: {
      mandatory: {
        minWidth: width,
      },
      optional: [{ maxFrameRate: 16 }],
    },
  };
  capture = createCapture(constraints, function (stream) {
    console.log("Video Ready");
    capture.hide();
  });

  player = new MyShip();
}

function draw() {
  player.drawPlayer();

  drawVideo();
}

function drawVideo() {
  let scaleFactor = width / capture.width;
  translate(width, 0);
  scale(-1, 1);
  image(
    capture,
    0.5 * width,
    0.75 * height,
    width,
    scaleFactor * capture.height
  ); // to fit width
  translate(width, 0);
}
