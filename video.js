let video;
let poses = [];
let model = false;

let img;

let videop5 = new p5((sketch) => {
  const canvasDiv = document.getElementById("game");
  const WIDTH = canvasDiv.offsetWidth;
  const HEIGHT = canvasDiv.offsetHeight;

  sketch.preload = async function () {
    model = await handpose.load();
  };

  sketch.setup = function () {
    sketch.createCanvas(WIDTH, HEIGHT);
    sketch.frameRate(25);
    let constraints = {
      video: {
        mandatory: {
          minWidth: WIDTH,
        },
        optional: [{ maxFrameRate: 25 }],
      },
    };
    capture = sketch.createCapture(constraints, function (stream) {
      console.log("Video Ready");
      capture.hide();
    });
  };

  sketch.draw = async function () {
    sketch.translate(capture.width, 0);
    sketch.scale(-1, 1);
    sketch.image(capture, 0, 0, capture.width, capture.height);
    if (model) poses = await model.estimateHands(capture.elt);
    drawKeypoints();
    // drawSkeleton();
    // console.log(poses);
  };

  // A function to draw ellipses over the detected keypoints
  function drawKeypoints() {
    // Loop through all the poses detected
    for (let i = 0; i < poses.length; i++) {
      let pose = poses[i];
      for (let j = 0; j < pose.landmarks.length; j++) {
        // A keypoint is an object describing a body part (like rightArm or leftShoulder)
        let keypoint = pose.landmarks[j];
        sketch.fill(255, 0, 0);
        sketch.noStroke();
        sketch.ellipse(keypoint[0], keypoint[1], 10, 10);
        // }
      }
    }
  }
}, "video");

// A function to draw the skeletons
// function drawSkeleton() {
//   // Loop through all the skeletons detected
//   for (let i = 0; i < poses.length; i++) {
//     let annotations = poses[i].annotations;
//     // For every skeleton, loop through all body connections
//     stroke(255, 0, 0);
//     for (let j = 0; j < annotations.thumb.length - 1; j++) {
//       // let partA = annotations.thumb[j][0];
//       // let partB = annotations.thumb[j][1];
//       line(
//         annotations.thumb[j][0],
//         annotations.thumb[j][1],
//         annotations.thumb[j + 1][0],
//         annotations.thumb[j + 1][1]
//       );
//     }
//     for (let j = 0; j < annotations.indexFinger.length - 1; j++) {
//       line(
//         annotations.indexFinger[j][0],
//         annotations.indexFinger[j][1],
//         annotations.indexFinger[j + 1][0],
//         annotations.indexFinger[j + 1][1]
//       );
//     }
//     for (let j = 0; j < annotations.middleFinger.length - 1; j++) {
//       line(
//         annotations.middleFinger[j][0],
//         annotations.middleFinger[j][1],
//         annotations.middleFinger[j + 1][0],
//         annotations.middleFinger[j + 1][1]
//       );
//     }
//     for (let j = 0; j < annotations.ringFinger.length - 1; j++) {
//       line(
//         annotations.ringFinger[j][0],
//         annotations.ringFinger[j][1],
//         annotations.ringFinger[j + 1][0],
//         annotations.ringFinger[j + 1][1]
//       );
//     }
//     for (let j = 0; j < annotations.pinky.length - 1; j++) {
//       line(
//         annotations.pinky[j][0],
//         annotations.pinky[j][1],
//         annotations.pinky[j + 1][0],
//         annotations.pinky[j + 1][1]
//       );
//     }

//     line(
//       annotations.palmBase[0][0],
//       annotations.palmBase[0][1],
//       annotations.thumb[0][0],
//       annotations.thumb[0][1]
//     );
//     line(
//       annotations.palmBase[0][0],
//       annotations.palmBase[0][1],
//       annotations.indexFinger[0][0],
//       annotations.indexFinger[0][1]
//     );
//     line(
//       annotations.palmBase[0][0],
//       annotations.palmBase[0][1],
//       annotations.middleFinger[0][0],
//       annotations.middleFinger[0][1]
//     );
//     line(
//       annotations.palmBase[0][0],
//       annotations.palmBase[0][1],
//       annotations.ringFinger[0][0],
//       annotations.ringFinger[0][1]
//     );
//     line(
//       annotations.palmBase[0][0],
//       annotations.palmBase[0][1],
//       annotations.pinky[0][0],
//       annotations.pinky[0][1]
//     );
//   }
// }
