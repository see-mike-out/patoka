import { gate_data } from "./plan_gate";
import { bitHeight, circuit_line_height, circuit_v_gap } from "./constants";

export function getSVGSize(curr, qubits, clbits, total) {
  let width = curr.layers.map((d) => getGateWidth(d.operations)).reduce((a, c) => a + c, 0);
  let height = qubits.length * bitHeight + (clbits.length > 0 ? bitHeight : 0);
  // return "AA"
  return {
    width,
    height
  }
}

function getGateWidth(operations) {
  let values = operations.map((g) => gate_data[g.gate].width || 16)
  return Math.max(...values);
}

// get gate's y position and height
export function getYH(op, qr) {
  let qubit_indices = op.qubits.map(d => d.index);
  if (qr) qubit_indices = qubit_indices.map((d) => qr[d]);
  let start_qubit_index = Math.min(...qubit_indices);
  let end_qubit_index = Math.max(...qubit_indices);
  let has_clbits = op.num_clbits > 0;

  let y = 0, height = 0;

  if (op.num_qubits == 1 && !has_clbits) {
    // single-qubit gate
    y = (circuit_v_gap + circuit_line_height) * start_qubit_index;
    height = circuit_line_height;
  } else if (!has_clbits) {
    // includes clbits (lie measures)
    y = (circuit_v_gap + circuit_line_height) * start_qubit_index;
    let qubit_gap = end_qubit_index - start_qubit_index
    height = circuit_v_gap * qubit_gap + circuit_line_height * (qubit_gap + 1);
  } else {
    // multi-qubit gates w/o clbits
    y = (circuit_v_gap + circuit_line_height) * start_qubit_index;
    let total_qubits = qr ? Object.keys(qr).length : op.qubits[0].register.size;
    let qubit_gap = total_qubits - start_qubit_index + 1;
    height = circuit_v_gap * qubit_gap + circuit_line_height * (qubit_gap + 1);
  }
  return {
    y,
    height
  }
}

export function getIpos(op, qubit, qr) {
  let y = 0;

  let qubit_indices = op.qubits.map(d => d.index);
  if (qr) qubit_indices = qubit_indices.map((d) => qr[d]);

  let start_qubit_index = Math.min(...qubit_indices);

  let qubit_gap = qr[qubit.index] - start_qubit_index;

  y = (circuit_v_gap + circuit_line_height) * qubit_gap;

  return y
}