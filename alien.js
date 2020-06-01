class Alien {
  constructor(x, y, w, h, imgA, imgB, pts) {
    this.x = x;
    this.y = y;
    this.alienWidth = w;
    this.alienHeight = h;
    this.alive = true;
    this.imageA = imgA;
    this.imageB = imgB;
    this.currentImage = "A";
    this.points = pts;
    this.explosionTimer = 3;
  }

  draw() {
    if (this.alive) {
      // only draws alien if it is alive

      if (this.currentImage === "A") {
        image(this.imageA, this.x, this.y, this.alienWidth, this.alienHeight);
      }
      if (this.currentImage === "B") {
        image(this.imageB, this.x, this.y, this.alienWidth, this.alienHeight);
      }
    }
    if (!this.alive) {
      if (this.explosionTimer > 0) {
        this.die();
        this.explosionTimer -= 1;
      }
    }
  }

  moveHorizontal() {
    if (alienDirection === "left") {
      this.x -= 5;
    }
    if (alienDirection === "right") {
      this.x += 5;
    }
    if (this.currentImage === "A") {
      this.currentImage = "B";
    } else if (this.currentImage === "B") {
      this.currentImage = "A";
    }
  }

  moveVertical() {
    this.y += 20;
  }

  // draws exposding alien ship animation
  die() {
    push();
    translate(this.x, this.y);
    noFill();
    stroke(255);
    strokeWeight(2);
    for (let i = 0; i < 10; i++) {
      line(floor(random(2, 8)), 0, floor(random(10, 15)), 0);
      rotate(random(0, (4 * PI) / 10));
    }
    pop();
  }
}

class AlienHandler {
  // aliens = [];
  constructor(startingX, startingY, alienConfig) {
    /*
      startingX: the starting x position for aliens
      startingY: the starting y position for aliens
      alienConfig: list of dicts that contain the type and number of aliens in each row
    */
    // Creates all aliens according to alienConfig
    let rowStartX = startingX;
    alienConfig.forEach(function (alienRow) {
      for (let i = 0; i < alienRow.count; i++) {
        rowStartX = startingX;
        // Create aliens in this row
        for (i = 0; i < 10; i++) {
          aliens.push(
            new Alien(
              rowStartX,
              startingY,
              alienRow.width,
              alienRow.height,
              alienRow.alienType_a,
              alienRow.alienType_b,
              10
            )
          );
          rowStartX += 40;
        }
        startingY -= 30;
      }
    });
  }
}
