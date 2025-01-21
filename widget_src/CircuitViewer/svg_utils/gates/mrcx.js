import { bitWidthUnit, circuit_line_height, default_fill, defualt_color } from "../constants";
import { getIpos, getYH } from "../sizing";

let gate_width = bitWidthUnit;
let gate_name = "mrcx";
export let MRCX = {
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
    let controls = op.qubits.slice(0, -1);
    let target = op.qubits.slice(-1)[0];
    // 0. get x, y, h 
    let pos = getYH(op, qr);
    plan.y = pos.y;
    plan.height = pos.height;

    let controls_y = controls.map((d) => (getIpos(op, d, qr)));
    let target_y = getIpos(op, target, qr);
    let line_y_0 = Math.min(...controls_y, target_y);
    let line_y_1 = Math.max(...controls_y, target_y)

    // 1. line between control and target
    let line = {
      id: `layer-${li}--${gate_name}--connect`,
      type: "line",
      x1: gate_width / 2 - 0.5,
      x2: gate_width / 2 - 0.5,
      y1: line_y_0 + circuit_line_height / 2,
      y2: line_y_1 + circuit_line_height / 2,
      "stroke-width": 1
    };
    plan.elem.push(line);

    // 2. dot for control
    let ci = 0;
    for (let control in controls) {
      let control_rect = {
        id: `layer-${li}--${gate_name}--control` + ci,
        type: "rect",
        "stroke-width": 0,
        fill: defualt_color,
        width: 6,
        height: 6,
        x: (gate_width / 2) - 3,
        y: controls_y[ci] + (circuit_line_height / 2) - 3
      };
      plan.elem.push(control_rect);
      ci++;
    }
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
      text: `X`
    };
    plan.elem.push(marker);

    return plan;
  }
};