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

async function drawVideo() {
  let scaleFactor = width / capture.width;
  let scaleX = width / capture.width;
  let scaleY = height / (2 * capture.height);
  translate(width, 0);
  scale(-1, 1);
  image(
    capture,
    0.5 * width,
    0.75 * height,
    width,
    scaleFactor * capture.height
  ); // to fit width
  if (model) poses = await model.estimateHands(capture.elt);
  drawKeypoints(scaleX, scaleY);
  translate(width, 0);
}

function drawKeypoints(scaleX, scaleY) {
  // Loop through all the poses detected
  for (let i = 0; i < poses.length; i++) {
    let pose = poses[i];
    for (let j = 0; j < pose.landmarks.length; j++) {
      // A keypoint is an object describing a body part (like rightArm or leftShoulder)
      let keypoint = pose.landmarks[j];
      fill(255, 0, 0);
      noStroke();
      ellipse(keypoint[0] * scaleX, keypoint[1] * scaleY + height / 2, 10, 10);
      // }
    }
  }
}
