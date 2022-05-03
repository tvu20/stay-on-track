import { Vector3 } from "three";
import { GameOverText } from "objects";
import * as THREE from "three";
import * as Dat from "dat.gui";
import { Flower, Land } from "objects";
import { BasicLights } from "lights";
import { Scene, Color, SphereGeometry, MeshPhongMaterial, Mesh } from "three";
import {
  MeshBasicMaterial,
  Texture,
  DoubleSide,
  PlaneGeometry,
  FontLoader,
  TextGeometry,
  MeshLambertMaterial,
  Group,
} from "three";

class GameOver extends Scene {
  constructor() {
    // Call parent Scene() constructor
    super();

    // Init state
    this.state = {
      gui: new Dat.GUI(), // Create GUI for scene
      rotationSpeed: 0,
      updateList: [],
    };

    // Set background to a nice color
    this.background = new Color(0x7ec0ee);

    // Add meshes to scene
    const land = new Land();
    const flower = new Flower(this);
    const lights = new BasicLights();
    this.add(land, flower, lights);
    this.flower = flower;

    const position = new Vector3(
      flower.position.x - 7,
      flower.position.y,
      flower.position.z
    );

    const gO = new GameOverText(this, position);
    this.add(gO);

    // Populate GUI
    this.state.gui.hide();
  }

  addToUpdateList(object) {
    this.state.updateList.push(object);
  }

  update(timeStamp) {
    const { rotationSpeed, updateList } = this.state;
    //this.rotation.y = (rotationSpeed * timeStamp) / 10000;

    // Call update for each object in the updateList
    for (const obj of updateList) {
      //console.log(obj);
      this.flower.update(timeStamp);
    }
  }
}
export default GameOver;
