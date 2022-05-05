import { Group, Vector3 } from "three";
import Block from "../Block/Block";
import Coin from "../Coin/Coin";
import { InitBlock } from "../InitBlock";
import Land from "../Land/Land";

class Road extends Group {
  constructor(parent) {
    // Call parent Group() constructor
    super();

    this.initialized = false;

    // pathing variables
    this.movementSpeed = 0.075;
    this.timeDiff = 18.5;
    this.dirChangeFactor = 1.4;

    this.state = {
      cameraPosition: parent.camera.position,
      time: 0,
      lastBlock: 0,
      lastLand: 0,
      landRemoved: false,
      blockPos: new Vector3(0, 0, -5),
      direction: 1,
      justJumped: false,
    };

    this.blocks = [];
    this.blockCollisions = [];
    this.coins = [];
    this.coinCollisions = [];
    this.lands = [];
    this.addlands = [];

    // Add self to parent's update list
    parent.addToUpdateList(this);

    // create the initial block
    const initBlock = new InitBlock(this);
    this.initBlock = initBlock;
    this.add(initBlock);

    //add land to the starting scene
    const land = new Land(this, -30);
    this.addlands.push(land);
    this.lands.push(land);
    this.add(land);

    const land2 = new Land(this, -200);
    this.addlands.push(land2);
    this.lands.push(land2);
    this.add(land2);

    // adding to the collision array
    this.blockCollisions = [...this.blockCollisions, this.initBlock.bb];
  }

  addBlock() {
    let beat = this.parent.beat;
    let type = this.random();

    // direction: -1 = left, 1 = right
    this.state.blockPos.x += this.dirChangeFactor * this.state.direction;

    // changing direction
    if (beat && type >= 6 && !this.state.justJumped) {
      this.state.direction *= -1;
      this.parent.removeBeat();
    }

    // jumping
    if (beat && type < 6 && !this.state.justJumped) {
      this.state.justJumped = true;
      this.parent.removeBeat();
      return;
    }

    this.state.justJumped = false;

    // stopping it from going out of bounds
    if (this.state.blockPos.x > 5) {
      this.state.direction = -1;
    } else if (this.state.blockPos.x < -5) {
      this.state.direction = 1;
    }

    // creating the block
    const block = new Block(this);
    this.blocks.push(block);
    this.blockCollisions.push(block.bb);
    this.add(block);

    // creating the coin
    let makeCoin = this.random() < 4;

    if (makeCoin) {
      const coin = new Coin(this);
      this.coins.push(coin);
      this.coinCollisions.push(coin.bb);
      this.add(coin);
    }
  }

  addLand(){
    // // //adding new land
    // const land = new Land(this);
    // // this.addlands.push(land);
    // this.lands.push(land);
    // this.add(land);
  }

  // temporary function
  random() {
    return Math.floor(Math.random() * 10) + 1;
  }

  updateBlocks() {
    for (let i = 0; i < this.blocks.length; i++) {
      const block = this.blocks[i];

      if (block.position.z > this.state.cameraPosition.z) {
        // removing offscreen block
        this.blocks.shift();
        this.blockCollisions.shift();
        this.remove(block.bb);
        this.remove(block);
      } else {
        block.updatePosition();
      }
    }

    for (let i = 0; i < this.lands.length; i++) {
      console.log(this.lands.length);
      const curland = this.lands[i];
    //   if (curland.position.z > this.state.cameraPosition.z){
    //     this.state.landRemoved = true;
    //   }

      if (curland.position.z > this.state.cameraPosition.z + 70) {
        // removing offscreen block
        // this.lands.shift();
        // this.remove(curland);
        // this.state.landRemoved = true;
        curland.position.z = this.state.cameraPosition.z-270;
      } else {
        curland.updatePosition();
      }
    }

    // //naive move land
    // if(this.land.position.z > this.state.cameraPosition.z+10){
    //   this.remove(this.land);
    // } else {
    //   this.land.updatePosition();
    // }

    for (let i = 0; i < this.coins.length; i++) {
      const coin = this.coins[i];

      // collecting the coin
      if (coin.state.collected) {
        this.coins = this.coins.filter((c) => c !== coin);
        this.coinCollisions = this.coinCollisions.filter((c) => c !== coin.bb);
        this.remove(coin.bb);
        this.remove(coin);
      } else {
        if (coin.position.z > this.state.cameraPosition.z) {
          // removing offscreen coin
          this.coins.shift();
          this.coinCollisions.shift();
          this.remove(coin.bb);
          this.remove(coin);
        } else {
          coin.updatePosition();
        }
      }
    }
  }

  update(timeStamp) {
    this.state.time++;

    if (!this.initialized) {
      this.addBlock();
      this.initialized = true;
    }

    if (this.state.time - this.state.lastBlock > this.timeDiff) {
      this.addBlock();
      
      this.state.lastBlock = this.state.time;
    }

    if (this.state.time - this.state.lastLand > this.timeDiff * 100){
      // this.state.landRemoved = false;
      this.addLand();
      this.state.lastLand = this.state.time;
    }

    // handle the initial block
    if (this.initBlock != null) {
      if (this.initBlock.position.z > this.state.cameraPosition.z + 3.5) {
        this.remove(this.initBlock);
        this.blockCollisions.shift();
        this.initBlock = null;
      } else {
        this.initBlock.updatePosition();
      }
    }
    this.updateBlocks();
    // this.state.time++;
  }
}

export default Road;
