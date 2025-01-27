export class Model {
  constructor(o) {
    this.data = o;
  }
  get(n) {
    return this.data[n];
  }
  set(n, v) {
    return this.data[n] = v;
  }
  save_changes() {

  }
  on() {

  }
  off() {

  }
}