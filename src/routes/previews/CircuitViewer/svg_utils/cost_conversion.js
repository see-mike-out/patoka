const qiskit_charge = 1.6;

export function get_qiskit_charge(ns, shots) {
  return ns / 1000000000 * qiskit_charge * shots;
}