import { Group } from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import MODEL from './scene.glb';
// import landv from '../scenes/PathTest.js'

class Cloud extends Group {
    constructor(parent, zPos, xPos) {
        // Call parent Group() constructor
        super();

        this.yPos = 0;
        this.movementSpeed = 0.075;

        const loader = new GLTFLoader();
        // const fbxLoader = new FBXLoader();


        this.name = 'cloud';

        loader.load(MODEL, (gltf) => {
            this.add(gltf.scene);
        });
        // this.add(landv);

        // this.add(gltf.scene);
        // fbxLoader.load(MODEL, (object)=>{
        //     this.add(object)
        // });
        this.position.y = this.yPos;
        this.position.z = zPos; //-50;
        this.position.x = xPos;
        this.scale.x = this.scale.y = this.scale.z = 0.1;
        // this.rotation.y += Math.PI / 2;
        // this.rotation.x -= Math.PI / 10;
        // this.rotation.z += Math.PI / 10;

        // parent.addToUpdateList(this);
    }

    updatePosition() {
        let temp = this.position.z + this.movementSpeed;
        this.position.z = temp;
      }

    // update(timeStamp) {
    //     this.updatePosition();
    // }
}

export default Cloud;
