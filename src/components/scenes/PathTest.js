import * as Dat from "dat.gui";
import * as THREE from "three";
import {
  Scene,
  Color,
  SphereGeometry,
  MeshPhongMaterial,
  Mesh,
  Vector3,
} from "three";
import { Road } from "../objects/Road";
import Ball from "../objects/Ball/Ball";
import { BasicLights } from "lights";

class PathTest extends Scene {
  constructor(camera) {
    // Call parent Scene() constructor
    super();

    // Init state
    this.state = {
      // gui: new Dat.GUI(), // Create GUI for scene
      //   movementSpeed: 0.1, // Movement speed
      updateList: [],
      sinceLastCollision: 0,
      offTrack: false,
      gameStarted: false,
      gameEnded: false,
      paused: false,
      sinceFalling: 0,
      score: 0,
    };

    // Set background to a nice color
    this.background = new Color(0x7ec0ee);

    // camera
    this.camera = camera;

    // this.init();

    // frequency data
    this.freqData = [];
    this.beat = false;
  }

  init() {
    // Add meshes to scene
    const road = new Road(this);
    const lights = new BasicLights();
    const ball = new Ball(this);
    this.add(road, lights, ball);

    this.road = road;
    this.ball = ball;
  }

  move(direction) {
    let EPS = 1;
    let onGround = this.ball.position.y <= this.ball.yPos + EPS;

    switch (direction) {
      case "ArrowLeft":
        if (onGround) this.ball.left();
        break;
      case "ArrowRight":
        if (onGround) this.ball.right();
        break;

      case "ArrowUp":
      case " ":
        this.ball.jump();
        break;
    }
  }

  addToUpdateList(object) {
    this.state.updateList.push(object);
  }

  addBeat() {
    this.beat = true;
  }

  removeBeat() {
    this.beat = false;
  }

  incrementScore() {
    this.state.score++;
  }

  findCollision() {
    let roadCollisions = this.road.blockCollisions;
    let coinCollisions = this.road.coinCollisions;

    let ballMesh = this.ball.bb;
    let ballBB = new THREE.Box3().setFromObject(ballMesh);

    let collidesWithRoad = false;

    // road collisions
    for (const mesh of roadCollisions) {
      let meshBB = new THREE.Box3();
      mesh.geometry.computeBoundingBox();
      meshBB.copy(mesh.geometry.boundingBox).applyMatrix4(mesh.matrixWorld);

      if (
        ballBB.intersectsBox(meshBB) ||
        this.ball.position.y > this.ball.yPos
      ) {
        collidesWithRoad = true;
      }
    }

    if (!collidesWithRoad) {
      this.state.sinceLastCollision++;
      // console.log("no collision");
    } else {
      // console.log("collision");
      this.state.sinceLastCollision = 0;
    }

    if (this.state.sinceLastCollision > 1) {
      var obj = this.getObjectByName("ball");
      obj.fall();
      this.state.offTrack = true;
    }

    // coin collisions
    for (let i = 0; i < coinCollisions.length; i++) {
      let mesh = coinCollisions[i];
      // for (const mesh of coinCollisions) {
      let meshBB = new THREE.Box3();
      mesh.geometry.computeBoundingBox();
      meshBB.copy(mesh.geometry.boundingBox).applyMatrix4(mesh.matrixWorld);

      if (ballBB.intersectsBox(meshBB)) {
        let currentCoin = this.road.coins[i];

        if (!currentCoin.state.collected) {
          currentCoin.collect();
          this.incrementScore();
        }
      }
    }
  }

  update(timeStamp) {
    const { updateList } = this.state;

    if (this.state.gameStarted && !this.state.paused) {
      // Call update for each object in the updateList
      for (const obj of updateList) {
        obj.update(timeStamp);
      }

      var obj = this.getObjectByName("ball");
      if (obj !== undefined && obj.state.isFallen) {
        this.remove(obj);
        //enter game end state
      }

      if (!this.state.offTrack) {
        this.findCollision();
      }

      // if falling
      if (this.state.offTrack) {
        this.state.sinceFalling++;
        if (this.state.sinceFalling > 80) {
          // testing yasmine's code
          this.state.gameEnded = true;
          // console.log(this.state.gameEnded);

          // this.state.offTrack = false;
          // this.state.paused = true;
          // this.state.gameStarted = false;
        }
      }
    }
  }
}

export default PathTest;
