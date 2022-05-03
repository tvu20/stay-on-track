// this code was referenced from the mp3js project

class Node {
  constructor(data) {
    this.data = data;
    this.next = null;
  }
}

class AudioData {
  constructor() {
    this.head = null;
    this.last = null;
    this.size = 0;
    this.sum = 0;
  }

  add(energy) {
    const node = new Node(energy);
    if (this.head == null) {
      this.head = node;
    } else {
      this.last.next = node;
    }
    this.last = node;
    this.size++;
    this.sum += energy;

    if (this.size > 30) {
      this.sum -= this.head.data;
      this.head = this.head.next;
      this.size--;
    }
  }

  averageLocalEnergy() {
    if (this.head == null) {
      return 0;
    }
    return this.sum / this.size;
  }
}

export default AudioData;
