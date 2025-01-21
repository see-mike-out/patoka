import { bitWidthUnit, circuit_line_height, circuit_v_gap, default_fill, defualt_color } from "../constants";
import { getIpos, getYH } from "../sizing";

let gate_width = bitWidthUnit * 2 + circuit_v_gap;
let gate_name = "dcx";
export let DCX = {
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
    let column_width = (gate_width - circuit_v_gap) / 2
    {
      // part 1
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
        id: `layer-${li}--${gate_name}--1--connect`,
        type: "line",
        x1: column_width / 2 - 0.5,
        x2: column_width / 2 - 0.5,
        y1: control_y + circuit_line_height / 2,
        y2: target_y + (target_y > control_y ? 0 : circuit_line_height),
        "stroke-width": 1
      };
      plan.elem.push(line);

      // 2. dot for control
      let control_rect = {
        id: `layer-${li}--${gate_name}--1--control`,
        type: "rect",
        "stroke-width": 0,
        fill: defualt_color,
        width: 6,
        height: 6,
        x: (column_width / 2) - 3,
        y: control_y + (circuit_line_height / 2) - 3
      };
      plan.elem.push(control_rect);

      // 3. rectangle for target
      let rect = {
        id: `layer-${li}--${gate_name}--1--target-box`,
        type: "rect",
        "stroke-width": 1,
        stroke: defualt_color,
        fill: default_fill,
        width: column_width,
        x: 0,
        y: target_y,
        height: circuit_line_height
      };
      plan.elem.push(rect);

      // 4. target X marker
      let marker = {
        id: `layer-${li}--${gate_name}--1--target-marker`,
        type: "text",
        x: column_width / 2,
        y: target_y + circuit_line_height / 2,
        "text-anchor": "middle",
        "alignment-baseline": "middle",
        text: "X"
      };
      plan.elem.push(marker);
    }

    let column_2_x = column_width + circuit_v_gap;

    {
      // part 2
      let control = op.qubits[1];
      let target = op.qubits[0];
      // 0. get x, y, h 
      let pos = getYH(op, qr);
      plan.y = pos.y;
      plan.height = pos.height;
      let control_y = getIpos(op, control, qr);
      let target_y = getIpos(op, target, qr);

      // 1. line between control and target
      let line = {
        id: `layer-${li}--${gate_name}--2--connect`,
        type: "line",
        x1: column_2_x + column_width / 2 - 0.5,
        x2: column_2_x + column_width / 2 - 0.5,
        y1: control_y + circuit_line_height / 2,
        y2: target_y + (target_y > control_y ? 0 : circuit_line_height),
        "stroke-width": 1
      };
      plan.elem.push(line);

      // 2. dot for control
      let control_rect = {
        id: `layer-${li}--${gate_name}--2--control`,
        type: "rect",
        "stroke-width": 0,
        fill: defualt_color,
        width: 6,
        height: 6,
        x: column_2_x + (column_width / 2) - 3,
        y: control_y + (circuit_line_height / 2) - 3
      };
      plan.elem.push(control_rect);

      // 3. rectangle for target
      let rect = {
        id: `layer-${li}--${gate_name}--2--target-box`,
        type: "rect",
        "stroke-width": 1,
        stroke: defualt_color,
        fill: default_fill,
        width: column_width,
        x: column_2_x,
        y: target_y,
        height: circuit_line_height
      };
      plan.elem.push(rect);

      // 4. target X marker
      let marker = {
        id: `layer-${li}--${gate_name}--2--target-marker`,
        type: "text",
        x: column_2_x + column_width / 2,
        y: target_y + circuit_line_height / 2,
        "text-anchor": "middle",
        "alignment-baseline": "middle",
        text: "X"
      };
      plan.elem.push(marker);
    }
    return plan;
  }
};