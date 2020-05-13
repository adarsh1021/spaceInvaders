var gameBuf;
var videoBuf;
let video;
let capture;
let poses = [];
let model = false;

const canvasDiv = document.getElementById("sketch");
const WIDTH = canvasDiv.offsetWidth;
const HEIGHT = canvasDiv.offsetHeight;

sketch.preload = async function () {
  model = await handpose.load();
};

function setup() {
  let canvas = createCanvas(WIDTH, HEIGHT);
  canvas.parent("sketch");
  // Create both of your off-screen graphics buffers
  gameBuf = createGraphics(WIDTH, HEIGHT / 2);
  videoBuf = createGraphics(WIDTH, HEIGHT / 2);

  frameRate(24);

  let constraints = {
    video: {
      mandatory: {
        minWidth: WIDTH,
      },
      optional: [{ maxFrameRate: 24 }],
    },
  };
  capture = createCapture(constraints, function (stream) {
    console.log("Video Ready");
    capture.hide();
  });
}

function draw() {
  // Draw on your buffers however you like
  drawGameBuf();
  drawVideoBuf();
  // Paint the off-screen buffers onto the main canvas
  image(gameBuf, 0, 0);
  image(videoBuf, 0, HEIGHT / 2);
}

function drawGameBuf() {
  gameBuf.background(0, 0, 0);
  gameBuf.fill(255, 255, 255);
  gameBuf.textSize(32);
  gameBuf.text("This is the left buffer!", 50, 50);
}

function drawVideoBuf() {
  videoBuf.translate(800, 0);
  videoBuf.scale(-1, 1);
  videoBuf.image(capture, 0, 0, capture.width, capture.height);
}
