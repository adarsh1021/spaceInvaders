// Copyright (c) 2019 ml5
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT

/* ===
ml5 Example
Handpose example using p5.js
=== */

let video;
let hp;
let poses = [];
let model = false;
const width = 640;
const height = 480;
async function setup() {
  model = await handpose.load();
  createCanvas(width, height);
  frameRate(25);
  let constraints = {
    video: {
      mandatory: {
        minWidth: width,
        minHeight: height,
      },
      optional: [{ maxFrameRate: 24 }],
    },
  };
  capture = createCapture(constraints, function (stream) {
    console.log("Video Ready");
    capture.hide();
    document.getElementById("status").innerHTML = "";
  });
}

async function draw() {
  translate(capture.width, 0);
  scale(-1, 1);
  image(capture, 10, 10, width, height);
  // console.log(video);

  // Pass in a video stream to the model to obtain
  // a prediction from the MediaPipe graph.
  // const hands = model.estimateHands(video);

  // Each hand object contains a `landmarks` property,
  // which is an array of 21 3-D landmarks.
  if (model) poses = await model.estimateHands(capture.elt);
  // hands.forEach((hand) => console.log(hand.landmarks));

  // We can call both functions to draw all keypoints and the skeletons
  drawKeypoints();
  drawSkeleton();
}

// A function to draw ellipses over the detected keypoints
function drawKeypoints() {
  // Loop through all the poses detected
  for (let i = 0; i < poses.length; i++) {
    // For each pose detected, loop through all the keypoints
    // let pose = poses[i].pose;
    // for (let j = 0; j < pose.keypoints.length; j++) {
    //   // A keypoint is an object describing a body part (like rightArm or leftShoulder)
    //   let keypoint = pose.keypoints[j];
    //   // Only draw an ellipse is the pose probability is bigger than 0.2
    //   if (keypoint.score > 0.2) {
    //     fill(255, 0, 0);
    //     noStroke();
    //     ellipse(keypoint.position.x, keypoint.position.y, 10, 10);
    //   }
    // }
    let pose = poses[i];
    // console.log(pose)
    for (let j = 0; j < pose.landmarks.length; j++) {
      // A keypoint is an object describing a body part (like rightArm or leftShoulder)
      let keypoint = pose.landmarks[j];
      // Only draw an ellipse is the pose probability is bigger than 0.2
      // if (keypoint.score > 0.2) {
      fill(255, 0, 0);
      noStroke();
      ellipse(keypoint[0], keypoint[1], 10, 10);
      // }
    }
  }
}

// A function to draw the skeletons
function drawSkeleton() {
  // Loop through all the skeletons detected
  for (let i = 0; i < poses.length; i++) {
    let annotations = poses[i].annotations;
    // For every skeleton, loop through all body connections
    stroke(255, 0, 0);
    for (let j = 0; j < annotations.thumb.length - 1; j++) {
      // let partA = annotations.thumb[j][0];
      // let partB = annotations.thumb[j][1];
      line(
        annotations.thumb[j][0],
        annotations.thumb[j][1],
        annotations.thumb[j + 1][0],
        annotations.thumb[j + 1][1]
      );
    }
    for (let j = 0; j < annotations.indexFinger.length - 1; j++) {
      line(
        annotations.indexFinger[j][0],
        annotations.indexFinger[j][1],
        annotations.indexFinger[j + 1][0],
        annotations.indexFinger[j + 1][1]
      );
    }
    for (let j = 0; j < annotations.middleFinger.length - 1; j++) {
      line(
        annotations.middleFinger[j][0],
        annotations.middleFinger[j][1],
        annotations.middleFinger[j + 1][0],
        annotations.middleFinger[j + 1][1]
      );
    }
    for (let j = 0; j < annotations.ringFinger.length - 1; j++) {
      line(
        annotations.ringFinger[j][0],
        annotations.ringFinger[j][1],
        annotations.ringFinger[j + 1][0],
        annotations.ringFinger[j + 1][1]
      );
    }
    for (let j = 0; j < annotations.pinky.length - 1; j++) {
      line(
        annotations.pinky[j][0],
        annotations.pinky[j][1],
        annotations.pinky[j + 1][0],
        annotations.pinky[j + 1][1]
      );
    }

    line(
      annotations.palmBase[0][0],
      annotations.palmBase[0][1],
      annotations.thumb[0][0],
      annotations.thumb[0][1]
    );
    line(
      annotations.palmBase[0][0],
      annotations.palmBase[0][1],
      annotations.indexFinger[0][0],
      annotations.indexFinger[0][1]
    );
    line(
      annotations.palmBase[0][0],
      annotations.palmBase[0][1],
      annotations.middleFinger[0][0],
      annotations.middleFinger[0][1]
    );
    line(
      annotations.palmBase[0][0],
      annotations.palmBase[0][1],
      annotations.ringFinger[0][0],
      annotations.ringFinger[0][1]
    );
    line(
      annotations.palmBase[0][0],
      annotations.palmBase[0][1],
      annotations.pinky[0][0],
      annotations.pinky[0][1]
    );
  }
}
