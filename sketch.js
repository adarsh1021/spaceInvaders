function draw() {
  background(bgColor);

  player.move();
  player.drawPlayer();
  player.drawExtraLives();
  drawScore();
  if (!pauseMode) {
    // if the game is not currently in pause mode....
    // run the functions that incrimentally move everything
    moveAllShots();
    moveAllLasers();
    // moveRedLaser();
    // events that only occur based on the current speed, not every frame
    if (frameCount % speed == 0) {
      alienHandler.move();
      fireLaser();
    }
  }
  if (pauseMode) {
    animateNewLife();
  }
  drawAllShots();
  drawAllLasers();
  alienHandler.draw();

  hitAlien();
  hitPlayer();
  if (allAliensKilled()) {
    print("all aliens killed!");
    resetAliens();
  }

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
      if (j == 12) fill(0, 0, 255);
      else fill(255, 0, 0);
      noStroke();
      ellipse(keypoint[0] * scaleX, keypoint[1] * scaleY + height / 2, 10, 10);
      // move player according to postion
      if (j == 10) player.moveTo(width - keypoint[0] * scaleX);
      // }
    }
    if (pose.landmarks[12][1] > pose.landmarks[10][1]) {
      player.fire();
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

function drawAllShots() {
  for (let shot of shots) {
    shot.draw();
  }
}

function moveAllShots() {
  for (let shot of shots) {
    shot.move();
  }
}

function hitAlien() {
  for (let shot of shots) {
    for (let alien of aliens) {
      // if(dist(alien.x, alien.y, shot.x, shot.y) < 10){
      if (
        shot.x > alien.x - alien.alienWidth / 2 &&
        shot.x < alien.x + alien.alienWidth / 2 &&
        shot.y - shot.length > alien.y - alien.alienHeight / 2 &&
        shot.y - shot.length < alien.y + alien.alienHeight / 2 &&
        !shot.hit &&
        alien.alive
      ) {
        alien.alive = false;
        shot.hit = true;
        score += alien.points; // increases score when an alien is shot
      }
    }
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
  //   redAlienUFOThing.x = 0 - redAlienUFOThing.shipWidth; // hides any current red alien off screen if game is reset
  if (speed > 2) {
    speed -= 2;
  }
  chanceOfFiringLaser += 10;
}

function fireLaser() {
  // only fires laser if random number from 0 to 100 is less than the current 'chance of firing laser) global varialbe
  if (random(100) < chanceOfFiringLaser) {
    let i = floor(random(aliens.length));
    if (aliens[i].alive) {
      let l = new Laser(
        aliens[i].x,
        aliens[i].y + aliens[i].alienHeight / 2,
        laserSpeed,
        white
      );
      lasers.push(l);
    }
  }
}

// draws all lasers
function drawAllLasers() {
  for (let laser of lasers) {
    laser.draw();
  }
}

// moves all active lasers
function moveAllLasers() {
  for (let laser of lasers) {
    laser.move();
  }
}

// draws score to screen
function drawScore() {
  noStroke();
  fill(255);
  textSize(14);
  textAlign(LEFT);
  text("LIVES: ", width - 175, 28);
  text("SCORE:", 25, 28);
  // makes score red if it has surpased the previous high score
  if (highScore > 0 && score > highScore) {
    fill(red);
  }
  text(score, 85, 28);
}

// checks if player was hit
function hitPlayer() {
  for (let laser of lasers) {
    let leftEdgeOfLaser = laser.x - 2;
    let rightEdgeOfLaser = laser.x + 2;
    let frontOfLaser = laser.y + 8;
    let backOfLaser = laser.y;
    let leftEdgeOfShip = player.x - player.shipWidth / 2;
    let rightEdgeOfShip = player.x + player.shipWidth / 2;
    let frontOfShip = player.y - player.shipHeight / 2;
    let backOfShip = player.y + player.shipHeight / 2;

    // below shapes used for figuring out and debigging of laser/ship overlap detection
    //     noFill();
    //     stroke(255, 0, 0);
    //     strokeWeight(1);
    //     beginShape();
    //     vertex(leftEdgeOfLaser, backOfLaser);
    //     vertex(leftEdgeOfLaser, frontOfLaser);
    //     vertex(rightEdgeOfLaser, frontOfLaser);
    //     vertex(rightEdgeOfLaser, backOfLaser);
    //     endShape(CLOSE);

    //     beginShape();
    //     vertex(leftEdgeOfShip, backOfShip);
    //     vertex(leftEdgeOfShip, frontOfShip);
    //     vertex(rightEdgeOfShip, frontOfShip);
    //     vertex(rightEdgeOfShip, backOfShip);
    //     endShape(CLOSE);

    // if the player has been shot...
    if (
      rightEdgeOfLaser > leftEdgeOfShip &&
      leftEdgeOfLaser < rightEdgeOfShip &&
      frontOfLaser > frontOfShip &&
      backOfLaser < backOfShip &&
      !laser.used
    ) {
      print("player hit!!!");
      laser.used = true; // that laser is now used and can't hit player again, or be drawn
      if (player.lives > 0) {
        lifeLost();
      }
      if (player.lives == 0) {
        gameOver();
      }
    }
  }
}

// function life lost
function lifeLost() {
  pauseTime = frameCount;
  print("life lost!");
  player.color = red;
  pauseMode = true;
}

// animates a new life
function animateNewLife() {
  print("animating new life");
  //  makes the player blink for 30 frames
  if (
    (frameCount - pauseTime > 5 && frameCount - pauseTime < 10) ||
    (frameCount - pauseTime > 15 && frameCount - pauseTime < 20) ||
    (frameCount - pauseTime > 25 && frameCount - pauseTime < 30)
  ) {
    noStroke();
    fill(bgColor);
    rectMode(CENTER);
    // draws background colored rectangle over player to make it appear as if it's blinking
    rect(player.x, player.y - 4, player.shipWidth + 2, player.shipHeight + 8);
  }
  // after 30 frames, resets player with new life
  if (frameCount - pauseTime > 30) {
    player.color = green;
    player.x = width / 2;
    pauseMode = false;
    player.lives -= 1;
    // clears all current lasers
    // or else player could get hit with laser as soon as they respawn with their new life in the center, which is unfair
    for (let laser of lasers) {
      laser.used = true;
    }
    // clears all current shots too
    for (let shot of shots) {
      shot.hit = true;
    }
  }
}

// clears all current lasers
function clearAllLasers() {}

// function game over
function gameOver() {
  gameOverBool = true;
  background(0, 125);
  print("game over!");
  textSize(60);
  stroke(0);
  fill(255);
  textAlign(CENTER);
  text("GAME OVER", width / 2, height / 2 - 200);
  textSize(20);
  text("Score: " + score, width / 2, height / 2 - 150);
  //   if (score > highScore) {
  //     fill(red);
  //     text("NEW HIGH SCORE!!!", width / 2, height / 2 + 75);
  //     fill(255);
  //   }
  text("Press 'ENTER' to play again!", width / 2, height / 2 - 75);
  noLoop();
}

// resets game
function reset() {
  highScore = score;
  score = 0;
  player = new MyShip();
  createAllAliens();
  for (let laser of lasers) {
    laser.used = true;
  }
  // clears all current shots too
  for (let shot of shots) {
    shot.hit = true;
  }
  loop();
}
