export function to_gate_code(gate) {
  return gate.gate + "--" + gate.qubits.map((q) => q.index).join("-");
}