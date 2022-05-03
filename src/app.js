/**
 * app.js
 *
 * This is the first file loaded. It sets up the Renderer,
 * Scene and Camera. It also starts the render loop and
 * handles window resizes.
 *
 */
import { WebGLRenderer, PerspectiveCamera, Vector3, Fog, Color } from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { PathTest, GameOver } from "scenes";
import { AudioData } from "./components/audio";
import soundFile from "./sevenrings.mp3";
// import "./app.css";
// import soundFile from "./sevenrings.mp3";

// --------------------
// THREE.JS INITIALIZATION
// --------------------

// Initialize core ThreeJS components
const camera = new PerspectiveCamera();
var scene = new PathTest(camera);
const renderer = new WebGLRenderer({ antialias: true });

// Set up camera
camera.position.set(0, 20, 20);
camera.lookAt(new Vector3(0, 0, 0));

// // fog
// // scene.fog = new Fog();
// scene.fog = new Fog(new Color(0x7ec0ee), 1, 200);

// Set up renderer, canvas, and minor CSS adjustments
renderer.setPixelRatio(window.devicePixelRatio);
const canvas = renderer.domElement;
canvas.style.display = "block"; // Removes padding below canvas
document.body.style.margin = 0; // Removes margin around page
document.body.style.overflow = "hidden"; // Fix scrolling
document.body.appendChild(canvas);

// Set up controls
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;
controls.enablePan = false;
controls.minDistance = 4;
controls.maxDistance = 16;
controls.update();

// Resize Handler
const windowResizeHandler = () => {
  const { innerHeight, innerWidth } = window;
  renderer.setSize(innerWidth, innerHeight);
  camera.aspect = innerWidth / innerHeight;
  camera.updateProjectionMatrix();
};
windowResizeHandler();
window.addEventListener("resize", windowResizeHandler, false);

// keydown handler
window.addEventListener("keydown", (event) => {
  const key = event.key;
  scene.move(event.key);
});

// --------------------
// GAME CONTROL
// --------------------

// control variables
let gameOver = false;
let initialized = false;
let gameStarted = false;

// score
let score = 0;
let scoreDiv = document.getElementById("score");
let finalScore = document.getElementById("final-score");
scoreDiv.innerHTML = "Score: " + score;

let introContainer = document.getElementById("intro-container");
let endScreen = document.getElementById("ending-screen");
let resetButton = document.getElementById("reset-btn");

function beginGame() {
  introContainer.style.display = "none";

  audioElement.play();
  scene.state.gameStarted = true;
  scene.state.paused = false;
  gameStarted = true;

  if (!initialized) {
    scene.init();
    initialized = true;
  }
}

function pauseGame() {
  scene.state.paused = true;
}

function lose() {
  scoreDiv.style.display = "none";
  gameOver = true;
  audioElement.pause();
  audioElement.currentTime = 0;
  currentlyPlaying = false;
  finalScore.innerHTML = "Score: " + score;
}

function restart() {
  window.location.reload();
}

resetButton.addEventListener("click", restart);

// --------------------
// AUDIO
// --------------------

var audiodata = new AudioData();
let time = 0;
let lastBeat = 0;
let currentlyPlaying = false;

const AudioContext = window.AudioContext || window.webkitAudioContext;
const audioContext = new AudioContext();
const analyser = audioContext.createAnalyser();

// // delay node
// const delayNode = new DelayNode(audioContext, {
//   delayTime: 0.5,
//   maxDelayTime: 0.5,
// });

// uploading audio
var file = document.getElementById("fileInput");
var audioElement = document.getElementById("audio");
audioElement.src = soundFile; // setting as default
const track = audioContext.createMediaElementSource(audioElement);
track.connect(analyser);
analyser.connect(audioContext.destination);

let prevInAudio;
let src;
// let context;
// let analyser;

file.onchange = (event) => {
  uploadAudio(file, true);
};

function uploadAudio(f, isFile) {
  // updating the audio file
  if (f && isFile) {
    var files = f.files;
    audioElement.src = URL.createObjectURL(files[0]);
  }
}

// select our play button
const playButton = document.getElementById("start-btn");

playButton.addEventListener(
  "click",
  function () {
    // check if context is in suspended state (autoplay policy)
    if (audioContext.state === "suspended") {
      audioContext.resume();
    }

    // play or pause track depending on state
    if (!currentlyPlaying) {
      beginGame();
      audioElement.play();
      currentlyPlaying = true;
    } else if (currentlyPlaying) {
      pauseGame();
      audioElement.pause();
      currentlyPlaying = false;
    }
  },
  false
);

audioElement.addEventListener(
  "ended",
  () => {
    currentlyPlaying = false;
    // playButton.dataset.playing = "false";
  },
  false
);

// --------------------
// RENDER HANDLER
// --------------------

const onAnimationFrameHandler = (timeStamp) => {
  controls.update();
  renderer.render(scene, camera);
  scene.update && scene.update(timeStamp);
  window.requestAnimationFrame(onAnimationFrameHandler);

  // move to game over screen
  if (scene.state.gameEnded == true) {
    var gOScene = new GameOver();
    scene = gOScene;
    camera.position.set(0, 0, 40);
    endScreen.style.display = "flex";
    // scoreDiv.innerHTML = "Score: " + score;
  }

  if (scene.state.offTrack && !scene.state.gameEnded) {
    lose();
  }

  // scoring
  if (scene.state.score != score) {
    score = scene.state.score;
    scoreDiv.innerHTML = "Score: " + score;
  }

  // analyser stuff
  analyser.fftSize = 128;
  var bufferLength = analyser.frequencyBinCount;
  var dataArray = new Uint8Array(bufferLength);
  analyser.getByteFrequencyData(dataArray);
  scene.freqData = dataArray;

  let instantEnergy = 0;
  for (let i = 0; i < bufferLength; i++) {
    instantEnergy += (dataArray[i] / 256) * (dataArray[i] / 256);
  }
  audiodata.add(instantEnergy);

  let bump = audiodata.averageLocalEnergy() * 1.15 < instantEnergy;
  let beat = false;

  if (bump) {
    if (time - lastBeat > 20) {
      lastBeat = time;
      beat = true;
    }
  }

  if (beat) {
    scene.addBeat();
  }

  time++;
};
window.requestAnimationFrame(onAnimationFrameHandler);
