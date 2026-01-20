import { trajectory } from "./physics.js";
import { drawSimulation, drawGraph } from "./renderer.js";

const simCanvas = document.getElementById("simCanvas");
const graphCanvas = document.getElementById("graphCanvas");

const simCtx = simCanvas.getContext("2d");
const graphCtx = graphCanvas.getContext("2d");

const velocityInput = document.getElementById("velocityInput");
const angleInput = document.getElementById("angleInput");
const applyBtn = document.getElementById("applyBtn");
const replayBtn = document.getElementById("replayBtn");

const g = 9.81;

let currentV0 = 25;
let currentAngle = Math.PI / 4;
let points = [];
let lastTime = null;

let state = {};

function resetState() {
  state = {
    x: 0,
    y: 0,
    vx: currentV0 * Math.cos(currentAngle),
    vy: currentV0 * Math.sin(currentAngle),
  };
}

function recomputeGraph() {
  points = trajectory(currentV0, currentAngle);
  drawGraph(graphCtx, points);
}

applyBtn.addEventListener("click", () => {
  currentV0 = Number(velocityInput.value);
  currentAngle = (Number(angleInput.value) * Math.PI) / 180;

  recomputeGraph();
  resetState();
});

replayBtn.addEventListener("click", () => {
  resetState();
});

function animate(timestamp) {
  if (!lastTime) lastTime = timestamp;
  const dt = (timestamp - lastTime) / 1000;
  lastTime = timestamp;

  state.vy -= g * dt;
  state.x += state.vx * dt;
  state.y += state.vy * dt;

  if (state.y < 0) {
    state.y = 0;
    state.vy = 0;
  }

  drawSimulation(simCtx, state);
  requestAnimationFrame(animate);
}

recomputeGraph();
resetState();
requestAnimationFrame(animate);
