import { Draggable } from "../common/draggable.mjs";
import { drawTree } from "./draw-tree.mjs";
import { lerp } from "../common/util.mjs";

// canvas and context
let canvas = document.getElementById("canvas");
let ctx = canvas.getContext("2d");

// init dimensions
canvas.width = 512;
canvas.height = 512;

// settings for tree drawing
let treeSettings = {
    angle1: 0.5,
    angle2: -0.6,
    mag1: 0.6,
    mag2: 0.7,
    startAngle: -Math.PI / 2,
    startLength: 100,
    startX: 256,
    startY: 512,
    depth: 10,
    deleteSmall: true,
    smallThreshold: 1,
    ctx
};

// make three control points draggable
let treeControl1Dragger = new Draggable(
    document.getElementById("tree-control-1"),
    256, 400
);
let treeControl2Dragger = new Draggable(
    document.getElementById("tree-control-2"),
    236, 350
);
let treeControl3Dragger = new Draggable(
    document.getElementById("tree-control-3"),
    286, 350
);

let prevWidth = 512;
let prevHeight = 512;
function resizeHandler() {
    treeSettings.startX = window.innerWidth / 2;
    treeSettings.startY = window.innerHeight;
    treeControl1Dragger.setPos(
        window.innerWidth/2 - (prevWidth/2 - treeControl1Dragger.x),
        window.innerHeight - (prevHeight - treeControl1Dragger.y)
    );
    treeControl2Dragger.setPos(
        window.innerWidth/2 - (prevWidth/2 - treeControl2Dragger.x),
        window.innerHeight - (prevHeight - treeControl2Dragger.y)
    );
    treeControl3Dragger.setPos(
        window.innerWidth/2 - (prevWidth/2 - treeControl3Dragger.x),
        window.innerHeight - (prevHeight - treeControl3Dragger.y)
    );
    prevWidth = window.innerWidth;
    prevHeight = window.innerHeight;
    canvas.width = prevWidth;
    canvas.height = prevHeight;
}

resizeHandler();

window.addEventListener("resize", resizeHandler);

// draws tree
function loop() {
    
    // get starting angle and starting length
    let yOffset = treeControl1Dragger.y - canvas.height;
    let xOffset = treeControl1Dragger.x - canvas.width / 2;
    let startAngle = Math.atan2(yOffset, xOffset);
    let startLength = Math.hypot(yOffset, xOffset);

    // get angle and and magnitude factor of first branch
    let yBranch1Offset = treeControl2Dragger.y - treeControl1Dragger.y;
    let xBranch1Offset = treeControl2Dragger.x - treeControl1Dragger.x;
    let angle1 = Math.atan2(yBranch1Offset, xBranch1Offset) - startAngle;
    let mag1 = Math.hypot(yBranch1Offset, xBranch1Offset) / startLength;

    // get angle and magnitude factor of second branch
    let yBranch2Offset = treeControl3Dragger.y - treeControl1Dragger.y;
    let xBranch2Offset = treeControl3Dragger.x - treeControl1Dragger.x;
    let angle2 = Math.atan2(yBranch2Offset, xBranch2Offset) - startAngle;
    let mag2 = Math.hypot(yBranch2Offset, xBranch2Offset) / startLength;
    
    // linear interpolate all quantities for that smooth effect
    startAngle = lerp(treeSettings.startAngle, startAngle, 0.1);
    startLength = lerp(treeSettings.startLength, startLength, 0.1);
    angle1 = lerp(treeSettings.angle1, angle1, 0.1);
    angle2 = lerp(treeSettings.angle2, angle2, 0.1);
    mag1 = lerp(treeSettings.mag1, mag1, 0.1);
    mag2 = lerp(treeSettings.mag2, mag2, 0.1);

    // update tree settings with new values
    treeSettings = {
        ...treeSettings,
        startAngle,
        startLength,
        angle1,
        mag1,
        angle2,
        mag2
    };

    // reset canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // draw tree
    ctx.beginPath();
    drawTree(treeSettings);
    ctx.stroke();

    // do next frame
    requestAnimationFrame(loop);
}

// start animation loop
loop();
