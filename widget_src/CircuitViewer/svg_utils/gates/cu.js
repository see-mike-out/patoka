import { bitWidthUnit, circuit_line_height, default_fill, defualt_color } from "../constants";
import { getIpos, getYH } from "../sizing";
import { format_parameter } from "../util";

let gate_width = bitWidthUnit * 5;
let gate_name = "cu";
export let CU = {
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
    let control = op.qubits[0];
    let target = op.qubits[1];
    // 0. get x, y, h 
    let pos = getYH(op, qr);
    plan.y = pos.y;
    plan.height = pos.height;
    let control_y = getIpos(op, control, qr);
    let target_y = getIpos(op, target, qr);

    // 1. line between control and target
    let line = {
      id: `layer-${li}--${gate_name}--connect`,
      type: "line",
      x1: gate_width / 2 - 0.5,
      x2: gate_width / 2 - 0.5,
      y1: control_y + circuit_line_height / 2,
      y2: target_y + (target_y > control_y ? 0 : circuit_line_height),
      "stroke-width": 1
    };
    plan.elem.push(line);

    // 2. dot for control
    let control_rect = {
      id: `layer-${li}--${gate_name}--control`,
      type: "rect",
      "stroke-width": 0,
      fill: defualt_color,
      width: 6,
      height: 6,
      x: (gate_width / 2) - 3,
      y: control_y + (circuit_line_height / 2) - 3
    };
    plan.elem.push(control_rect);

    // 3. rectangle for target
    let rect = {
      id: `layer-${li}--${gate_name}--target-box`,
      type: "rect",
      "stroke-width": 1,
      stroke: defualt_color,
      fill: default_fill,
      width: gate_width,
      x: 0,
      y: target_y,
      height: circuit_line_height
    };
    plan.elem.push(rect);

    // 4. target X marker
    let marker = {
      id: `layer-${li}--${gate_name}--target-marker`,
      type: "text",
      x: gate_width / 2,
      y: target_y + circuit_line_height / 2,
      "text-anchor": "middle",
      "alignment-baseline": "middle",
      text: `U(${format_parameter(op.params[0])},${format_parameter(op.params[1])},${format_parameter(op.params[2])},${format_parameter(op.params[3])})`
    };
    plan.elem.push(marker);

    return plan;
  }
};