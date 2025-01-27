import { bitWidthUnit, circuit_line_height, default_fill, defualt_color } from "../constants";
import { getYH } from "../sizing";

let gate_width = bitWidthUnit;
let gate_name = "z";
export let Z = {
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

    // 1. marker
    let control_rect = {
      id: `layer-${li}--${gate_name}--marker`,
      type: "rect",
      "stroke-width": 0,
      fill: defualt_color,
      width: 6,
      height: 6,
      x: (gate_width / 2) - 3,
      y: (circuit_line_height / 2) - 3
    };
    plan.elem.push(control_rect);

    return plan;
  }
};