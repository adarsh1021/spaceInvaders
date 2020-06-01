// To create the canvas. Once it is created can use width and height.
let HEIGHT;
let WIDTH;

let shots = [];
let aliens = [];
let lasers = [];

let pauseMode = false;
let speed = 4;
let laserSpeed = 4;

let alien1_a;
let alien1_b;
let alien2_a;
let alien2_b;
let alien3_a;
let alien3_b;
let alienDirection = "left";
let chanceOfFiringLaser = 20;

let score = 0;
let highScore = 0;
let player;

let green;
let white;
let red;
let bgColor;

let model;
let poses = [];
let video;
let capture;

async function preload() {
  loadAllImages();
  model = await handpose.load();
}

function setup() {
  const canvasDiv = document.getElementById("sketch");
  WIDTH = canvasDiv.offsetWidth;
  HEIGHT = canvasDiv.offsetHeight;
  let canvas = createCanvas(WIDTH, HEIGHT);
  canvas.parent("sketch");

  frameRate(16);
  noSmooth(); // to turn off antialiasing
  imageMode(CENTER);

  // Initialize colors
  green = color(51, 255, 0);
  white = color(255, 255, 255);
  red = color(255, 0, 0);
  bgColor = color(0, 0, 0);

  // Crete the video capture
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

  // Initialize player and aliens
  player = new Player();
  const alienConfig = [
    {
      count: 10,
      alienType_a: alien1_a,
      alienType_b: alien1_b,
      width: 20,
      height: 20,
    },
    {
      count: 10,
      alienType_a: alien2_a,
      alienType_b: alien2_b,
      width: 18,
      height: 15,
    },
    {
      count: 10,
      alienType_a: alien3_a,
      alienType_b: alien3_b,
      width: 15,
      height: 15,
    },
  ];
  alienHandler = new AlienHandler(WIDTH / 2, 150, alienConfig);
}

function loadAllImages() {
  alien1_a = loadImage("images/alien1_a.png");
  alien1_b = loadImage("images/alien1_b.png");
  alien2_a = loadImage("images/alien2_a.png");
  alien2_b = loadImage("images/alien2_b.png");
  alien3_a = loadImage("images/alien3_a.png");
  alien3_b = loadImage("images/alien3_b.png");
}
