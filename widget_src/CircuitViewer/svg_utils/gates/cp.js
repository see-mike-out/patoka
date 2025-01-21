import { bitWidthUnit, circuit_line_height, default_fill, defualt_color } from "../constants";
import { getIpos, getYH } from "../sizing";
import { get_radian_names } from "../util";

let gate_width = bitWidthUnit * 2.7;
let gate_name = "cp";
export let CP = {
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
    let controls = op.qubits;
    // 0. get x, y, h 
    let pos = getYH(op, qr);
    plan.y = pos.y;
    plan.height = pos.height;

    let controls_y = controls.map((d) => (getIpos(op, d, qr)));
    let line_y_0 = Math.min(...controls_y);
    let line_y_1 = Math.max(...controls_y)
    let mid_point = (line_y_0 + line_y_1) / 2 + circuit_line_height / 2

    // 1. line between control and target
    let line = {
      id: `layer-${li}--${gate_name}--connect`,
      type: "line",
      x1: bitWidthUnit / 2 - 0.5,
      x2: bitWidthUnit / 2 - 0.5,
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
        x: (bitWidthUnit / 2) - 3,
        y: controls_y[ci] + (circuit_line_height / 2) - 3
      };
      plan.elem.push(control_rect);
      ci++;
    }

    // 3. parameters
    let param_text = {
      id: `layer-${li}--${gate_name}--param-text` + ci,
      type: "text",
      "stroke-width": 0,
      fill: defualt_color,
      width: gate_width - bitWidthUnit,
      height: circuit_line_height,
      x: bitWidthUnit - 3,
      y: mid_point,
      "text-anchor": "start",
      "alignment-baseline": "middle",
      text: `${get_radian_names(op.params[0])}`
    }
    plan.elem.push(param_text);

    return plan;
  }
};