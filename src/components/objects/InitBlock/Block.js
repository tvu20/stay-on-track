import { Group } from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import MODEL from "./scene.glb";
import * as THREE from "three";

class Block extends Group {
  constructor(parent) {
    // Call parent Group() constructor
    super();

    this.state = {
      pos: parent.state.blockPos,
    };

    this.bb;
    this.bbHelper;

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

    this.position.x = 0;
    this.position.y = this.state.pos.y;
    this.position.z = 2;
    this.scale.set(5, 1, 5);

    // bounding box exercise
    let geometry = new THREE.BoxGeometry(2, 2, 2);
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

  updatePosition() {
    let temp = this.position.z + this.parent.movementSpeed;
    this.position.z = temp;
  }
}

export default Block;
