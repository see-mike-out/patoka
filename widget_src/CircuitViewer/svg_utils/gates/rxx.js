import { bitWidthUnit, circuit_h_gap, circuit_line_height, default_fill, defualt_color } from "../constants";
import { getYH } from "../sizing";
import { format_parameter } from "../util";

let gate_width = bitWidthUnit * 2.6;
let gate_name = "rxx"
export let RXX = {
  name: gate_name,
  width: gate_width,
  plan: function (op, li, qr) {
    let plan = {
      id: `layer-${li}--${gate_name}--group`,
      type: "g",
      x: 0,
      y: 0,
      width: gate_width,
      height: 0,
      elem: []
    };
    // 0. get x, y, h 
    let pos = getYH(op, qr);
    plan.y = pos.y;
    plan.height = pos.height;

    // 1. rectangle 
    let rect = {
      id: `layer-${li}--${gate_name}--wrap`,
      type: "rect",
      strokeWidth: 1,
      strokeColor: defualt_color,
      fill: default_fill,
      width: gate_width,
      x: 0,
      y: 0,
      height: pos.height,
    }
    plan.elem.push(rect);
    // 2. start qubit
    let start_qubit = {
      id: `layer-${li}--${gate_name}--qubit-1`,
      type: "text",
      x: circuit_h_gap / 2,
      y: circuit_line_height / 2,
      "text-anchor": "start",
      "alignment-baseline": "middle",
      text: op.qubits[0]?.index
    }
    plan.elem.push(start_qubit);
    // 3. end qubit
    let end_qubit = {
      id: `layer-${li}--${gate_name}--qubit-2`,
      type: "text",
      x: circuit_h_gap / 2,
      y: pos.height - circuit_line_height / 2,
      "text-anchor": "start",
      "alignment-baseline": "middle",
      text: op.qubits[1]?.index
    }
    plan.elem.push(end_qubit);
    // 4. marker
    let marker = {
      id: `layer-${li}--${gate_name}--marker`,
      type: "text",
      x: gate_width - circuit_h_gap / 2,
      y: pos.height / 2,
      "text-anchor": "end",
      "alignment-baseline": "middle",
      text: `Rxx(${format_parameter(op.params[0])})`
    }
    plan.elem.push(marker);

    return plan;
  }
};