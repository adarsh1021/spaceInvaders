// To create the canvas. Once it is created can use width and height.
let HEIGHT;
let WIDTH;
let shots = []; // stores all shots
let aliens = []; // stores all aliens
let pauseMode = false;
let speed = 4;
let alien1_a;
let alien1_b;
let alien2_a;
let alien2_b;
let alien3_a;
let alien3_b;
let alienDirection = "left";

async function preload() {
  alien1_a = loadImage("images/alien1_a.png");
  alien1_b = loadImage("images/alien1_b.png");
  alien2_a = loadImage("images/alien2_a.png");
  alien2_b = loadImage("images/alien2_b.png");
  alien3_a = loadImage("images/alien3_a.png");
  alien3_b = loadImage("images/alien3_b.png");
  model = await handpose.load();
  //   alien4 = loadImage("images/alien4.png");
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
  createAllAliens();
}

function draw() {
  background(0, 0, 0);
  rect(width / 2, 0, width, 10);
  rect(0, height / 2, 10, height);
  rect(width, height / 2, 10, height);

  player.move();
  player.drawPlayer();
  player.drawExtraLives();
  //   drawScore();
  if (!pauseMode) {
    // if the game is not currently in pause mode....
    // run the functions that incrimentally move everything
    // moveAllShots();
    // moveAllLasers();
    // moveRedLaser();
    // events that only occur based on the current speed, not every frame
    if (frameCount % speed == 0) {
      moveAllAliens();
      //   fireLaser();
    }
    // moveRedAlien();
  }
  if (pauseMode) {
    animateNewLife();
  }
  //   drawAllShots();
  //   drawAllLasers();
  drawAllAliens();
  //   drawRedAlien();
  //   hitAlien();
  //   hitPlayer();
  //   hitRedAlien();
  if (allAliensKilled()) {
    print("all aliens killed!");
    resetAliens();
  }

  //   drawVideo();
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

function keyPressed() {
  if (key === " ") {
    if (!pauseMode) {
      print("shot fired!");
      player.fire();
    }
  }
  if (keyCode === LEFT_ARROW) {
    print("directon changes!");
    player.changeDirection("left");
  }
  if (keyCode === RIGHT_ARROW) {
    player.changeDirection("right");
  }
  if ((keyCode === RETURN || keyCode === ENTER) && gameOverBool) {
    reset();
  }
  return false; // prevents default browser behaviors
}

function mousePressed() {}

function keyReleased() {
  if (keyIsPressed === false) {
    player.changeDirection("none");
  }
}

function createAllAliens() {
  let startingX = width / 2;
  let startingY = 150;
  // creates bottom two rows of alien 1!
  for (i = 0; i < 10; i++) {
    aliens[i] = new Alien(startingX, startingY, 20, 20, alien1_a, alien1_b, 10);
    startingX += 40;
    if (i == 9) {
      startingX = width / 2;
      startingY -= 30;
    }
  }
  //   creates middle two rows of alien 2!
  for (i = 10; i < 20; i++) {
    aliens[i] = new Alien(startingX, startingY, 18, 14, alien2_a, alien2_b, 20);
    startingX += 40;
    if (i == 19) {
      startingX = width / 2;
      startingY -= 30;
    }
  }
  // creates top two rows of alien 3!
  for (i = 20; i < 30; i++) {
    aliens[i] = new Alien(startingX, startingY, 14, 14, alien3_a, alien3_b, 40);
    startingX += 40;
    if (startingX > width - 30) {
      startingX = width / 2;
      startingY -= 30;
    }
  }
}

function drawAllAliens() {
  for (let alien of aliens) {
    alien.draw();
  }
}

// moves all aliens
function moveAllAliens() {
  for (let alien of aliens) {
    alien.moveHorizontal(alienDirection);
  }
  if (checkIfAliensReachedEdge()) {
    reverseAlienDirections();
    moveAllAliensDown();
  }
}

function checkIfAliensReachedEdge() {
  let edgeReached = false;
  for (let alien of aliens) {
    if (
      (alien.x < 30 && alien.alive) ||
      (alien.x > width - 30 && alien.alive)
    ) {
      edgeReached = true;
    }
  }
  return edgeReached;
}

// reverse horizontal travel direction of all(most all) aliens & moves them down
function reverseAlienDirections() {
  if (alienDirection === "left") {
    alienDirection = "right";
  } else {
    alienDirection = "left";
  }
}

function moveAllAliensDown() {
  for (let alien of aliens) {
    alien.moveVertical();
  }
}

// returns true if all aliens have been shot
function allAliensKilled() {
  let bool = true;
  for (let alien of aliens) {
    if (alien.alive) {
      bool = false;
    }
  }
  return bool;
}

// resets alaien positions and incriments speed
function resetAliens() {
  createAllAliens();
  redAlienUFOThing.x = 0 - redAlienUFOThing.shipWidth; // hides any current red alien off screen if game is reset
  if (speed > 2) {
    speed -= 2;
  }
  chanceOfFiringLaser += 10;
}
