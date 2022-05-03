import { Group } from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import MODEL from "./scene.glb";

import * as THREE from "three";

class Coin extends Group {
  constructor(parent) {
    super();

    this.state = {
      pos: parent.state.blockPos,
      collected: false,
    };

    this.bb;

    this.init();
  }

  init() {
    const loader = new GLTFLoader();

    this.name = "block";

    loader.load(MODEL, (gltf) => {
      let mesh = gltf.scene;
      this.add(mesh);
    });

    this.rotation.y = Math.PI / 4;

    this.position.x = this.state.pos.x;
    this.position.y = this.state.pos.y + 2;
    this.position.z = this.state.pos.z;

    this.scale.x = 0.25;
    this.scale.y = 0.25;
    this.scale.z = 0.25;

    // bounding box exercise
    let geometry = new THREE.BoxGeometry(3, 3, 3);
    // const material = new THREE.MeshBasicMaterial({ color: 0xffff00 });
    const material = new THREE.MeshBasicMaterial({
      opacity: 0,
      transparent: true,
    });
    const mesh = new THREE.Mesh(geometry, material);
    mesh.position.y += 1;

    this.bb = mesh;
    this.add(this.bb);
  }

  remove() {
    this.remove.apply(this, this.children);
  }

  collect() {
    this.state.collected = true;
  }

  updatePosition() {
    let temp = this.position.z + this.parent.movementSpeed;
    this.position.z = temp;

    // rotating the thing
    this.rotation.y += 0.1;
  }
}

export default Coin;
