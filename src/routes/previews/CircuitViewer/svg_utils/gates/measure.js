import { bitWidthUnit, circuit_line_height, circuit_v_gap, default_fill, defualt_color, padding } from "../constants";
import { getYH } from "../sizing";

let gate_width = bitWidthUnit;
let gate_name = "measure"
export let MEASURE = {
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
    plan.height = pos.height - circuit_line_height - padding;
    // 1. rectangle for q bit
    let rect = {
      id: `layer-${li}--${gate_name}--qubit`,
      type: "rect",
      "stroke-width": 1,
      stroke: defualt_color,
      fill: default_fill,
      width: gate_width,
      x: 0,
      y: 0,
      height: circuit_line_height
    };
    plan.elem.push(rect);
    // 2. marker
    let marker = {
      id: `layer-${li}--${gate_name}--marker`,
      type: "text",
      x: gate_width / 2,
      y: circuit_line_height / 2,
      "text-anchor": "middle",
      "alignment-baseline": "middle",
      text: "M"
    };
    plan.elem.push(marker);
    // 3. line to clbits
    let line = {
      id: `layer-${li}--${gate_name}--connect`,
      type: "line",
      x1: gate_width / 2 - 0.5,
      x2: gate_width / 2 - 0.5,
      y1: circuit_line_height,
      y2: pos.height - circuit_line_height * 2 + circuit_v_gap,
      "stroke-width": 1
    };
    plan.elem.push(line);
    // 4. clbit
    let clbit = {
      id: `layer-${li}--${gate_name}--clbit`,
      type: "text",
      x: gate_width / 2,
      y: pos.height + circuit_v_gap - circuit_line_height * 1.5,
      "text-anchor": "middle",
      "alignment-baseline": "middle",
      text: op.clbits[0].index,
      "font-size": 12,
      role: "clbit",
      data: op.clbits[0]
    };
    plan.elem.push(clbit);

    return plan;
  }
};