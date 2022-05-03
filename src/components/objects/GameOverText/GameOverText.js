import * as Dat from "dat.gui";
import * as THREE from "three";
import { Vector3 } from "three";
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

class GameOverText extends Group {
  constructor(parent, position1) {
    super();
    // Init state
    this.state = {
      gui: parent.state.gui,
    };

    var loader = new FontLoader();
    loader.load(
      "https://threejs.org/examples/fonts/helvetiker_regular.typeface.json",
      function (font, scene) {
        var material = new MeshBasicMaterial({
          color: 0xd3d3d3,
        });

        // game start page signs
        var gameOverGeo = new TextGeometry("Game Over", {
          font: font,
          size: 1,
          height: 0.032,
          curveSegments: 0.048,
          //bevelEnabled: true,
          //bevelThickness: .04,
          //bevelSize: 0.036,
          //bevelSegments: 0.02,
        });

        var positionInput = position1;

        var gameOverMesh = new Mesh(gameOverGeo, material);
        gameOverMesh.position.x = positionInput.x;
        gameOverMesh.position.y = positionInput.y;
        gameOverMesh.position.z = positionInput.z;
        gameOverMesh.scale.multiplyScalar(2);
        gameOverMesh.rotation.set(0, 0, 0);
        gameOverMesh.name = "Game Over";

        parent.add(gameOverMesh);
      }
    );
    // Add self to parent's update list
    parent.addToUpdateList(this);
  }
}

export default GameOverText;
