import { Group } from "three";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { TWEEN } from "three/examples/jsm/libs/tween.module.min.js";
import {
  Scene,
  Color,
  SphereGeometry,
  MeshStandardMaterial,
  MeshPhongMaterial,
  Mesh,
} from "three";
import MODEL from "./scene.glb";

class Ball extends Group {
  constructor(parent) {
    // Call parent Group() constructor
    super();

    this.movementVel = 0.0725;
    this.rotationVel = 0.05;
    this.fallVel = 0.145;
    this.fallRot = 0.1;
    this.yPos = 2.5;

    // Init state
    this.state = {
      gui: parent.state.gui,
      jump: this.jump.bind(this),
      left: this.left.bind(this),
      right: this.right.bind(this),
      fall: this.fall.bind(this),
      isLeft: false,
      isRight: false,
      isFall: false,
      isFallen: false,
    };

    const loader = new GLTFLoader();

    this.name = "ball";

    this.model;
    loader.load(MODEL, (gltf) => {
      this.model = gltf.scene;
      this.add(gltf.scene);
    });

    this.position.x = 0;
    this.position.y = this.yPos;
    this.position.z = 2;
    this.scale.x = this.scale.y = this.scale.z = 0.14;

    // Add self to parent's update list
    parent.addToUpdateList(this);

    // collision box
    let geometry = new THREE.BoxGeometry(1, 10, 1);
    // const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
    const material = new THREE.MeshBasicMaterial({
      opacity: 0,
      transparent: true,
    });
    const mesh = new THREE.Mesh(geometry, material);
    mesh.material.transparent = true;
    this.add(mesh);

    this.bb = mesh;

    // Populate GUI
    // this.state.gui.add(this.state, "fall");
  }

  fall() {
    this.isFall = true;

    const fallDown = new TWEEN.Tween(this.position)
      .to({ y: -10 }, 700) // updated this number from 500
      .easing(TWEEN.Easing.Quadratic.In);

    // const fallDown = new TWEEN.Tween(this.position)
    //   .to({ y: -10 }, 1800) // updated this number from 500
    //   .easing(TWEEN.Easing.Quadratic.In);
    fallDown.start();
    fallDown.onComplete(() => (this.state.isFallen = true));
  }

  left() {
    this.isRight = false;
    this.isLeft = true;
    this.position.x = this.position.x - this.movementVel;
  }
  right() {
    this.isLeft = false;
    this.isRight = true;
    this.position.x = this.position.x + this.movementVel;
  }

  jump() {
    // // Add a simple twirl
    // this.state.twirl += 6 * Math.PI;

    // Use timing library for more precice "bounce" animation
    // TweenJS guide: http://learningthreejs.com/blog/2011/08/17/tweenjs-for-smooth-animation/
    // Possible easings: http://sole.github.io/tween.js/examples/03_graphs.html
    const jumpUp = new TWEEN.Tween(this.position)
      .to({ y: this.position.y + 3 }, 300)
      .easing(TWEEN.Easing.Quadratic.Out);
    const fallDown = new TWEEN.Tween(this.position)
      .to({ y: this.yPos }, 300)
      .easing(TWEEN.Easing.Quadratic.In);

    // Fall down after jumping up
    jumpUp.onComplete(() => fallDown.start());

    // Start animation
    jumpUp.start();
  }

  update(timeStamp) {
    if (this.isLeft) {
      this.left();

      // rotate the ball a bit
      //   this.rotation.z += this.rotationVel;
      this.model.rotation.z += this.rotationVel;
    }
    if (this.isRight) {
      this.right();

      // rotate the ball a bit
      this.model.rotation.z -= this.rotationVel;
      //   this.rotation.z -= this.rotationVel;
    }

    if (this.isFall) {
      if (this.position.y < -9.9) {
        this.isFall = false;
      }

      // this.fall();
      // let delta = timeStamp/20000;
      // this.position.y = this.position.y - delta;
      // if(this.isLeft) {
      //   this.left();
      //   this.left();
      //   this.rotation.z += this.rotationVel;
      //   // console.log("here");
      // }
      // if(this.isRight){
      //   this.right();
      //   this.right();
      //   this.rotation.z -= this.rotationVel;

      // }
      // this.position.x = this.position.x + this.fallVel;
    }
    // console.log(this.state.isFallen);

    // Advance tween animations, if any exist
    TWEEN.update();
  }
}

export default Ball;
