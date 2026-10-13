export class Qubit {
  aAmplitude = 1;
  bAmplitude = 0;
  constructor() { }

  measure(): 0 | 1 {
    const r = Math.random()

    const aRange = this.aAmplitude ** 2;
    if (r <= aRange) {
      return 1
    } else {
      return 0
    }
  }
  setBalancedSuperPosition() {
    this.aAmplitude = 1 / Math.sqrt(2)
    this.bAmplitude = 1 / Math.sqrt(2)
  }
}
