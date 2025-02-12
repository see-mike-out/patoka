import { scaleLinear, format } from "d3";
import { defualt_color, ord_colors, padding } from "../../CircuitViewer/svg_utils/constants";

const y_axis_width = 40, bar_height = 300, x_axis_height = 30, bar_band = 20, bar_band_rate = 0.75;
const number_format = format(",d");

export function parseNaturalNumberProblem(counts) {
  if (!counts) return null;
  // step 1. data prep
  // reverse
  let new_counts = [], bit_max = 0;
  let size = Object.keys(counts)[0]?.length
  bit_max = parseInt(Array.from(Array(size).keys()).map((d) => "1").join(""), 2)

  let pad = 0;
  let states = Object.keys(counts);
  if (states.length > 0) {
    for (let k = 0; k < states[0].length; k++) {
      if (states.every(s => s[k] === "0")) pad++;
    }
  }
  
  for (const p of Object.keys(counts)) {
    new_counts.push({
      original_state_vector: p,
      number: parseInt(p, 2),
      count: counts[p]
    });
  }
  // sort
  new_counts.sort((a, b) => a.number - b.number);

  // step 2. plan visualization
  let width = 0, height = bar_height + x_axis_height, bar_group, y_axis_group, y_grid_group, x_axis_group;

  let bar_area_width = new_counts?.length * bar_band;
  width = bar_area_width + y_axis_width;

  let max_count = Math.max(...new_counts.map((d) => d.count));
  let height_scale = scaleLinear().domain([0, max_count]).range([0, bar_height]).nice();
  let nice_max_count = height_scale.invert(bar_height);
  let nice_unit = get_nice_unit(nice_max_count);

  // axis
  y_axis_group = {
    type: "g",
    id: "natural-number-view-y-axis",
    role: "natural-number-view-y-axis",
    width: y_axis_width,
    height: bar_height,
    x: padding,
    y: padding,
    elem: [{
      type: "line",
      id: "natural-number-view-y-axis-domain",
      x1: y_axis_width - 1,
      x2: y_axis_width - 1,
      y1: 0,
      y2: bar_height,
      stroke: defualt_color,
      "stroke-width": 1
    }]
  };
  // axis
  y_grid_group = {
    type: "g",
    id: "natural-number-view-y-axis",
    role: "natural-number-view-y-axis",
    width: bar_area_width,
    height: bar_height,
    x: padding + y_axis_width,
    y: padding,
    elem: []
  };
  width += y_axis_width

  for (let i = 0; i <= nice_max_count; i += nice_unit) {
    let tick_group = {
      type: "g",
      id: "natural-number-view-y-axis-tick",
      width: y_axis_width,
      x: 0,
      y: bar_height - height_scale(i),
      elem: []
    };
    let tick = {
      type: "line",
      x1: y_axis_width - 1,
      x2: y_axis_width - 6,
      y1: -0.5,
      y2: -0.5,
      stroke: defualt_color,
      "stroke-width": 1
    };
    let label = {
      type: "text",
      x: y_axis_width - 10,
      y: 0,
      "text-anchor": "end",
      "alignment-baseline": "middle",
      text: number_format(i),
      "font-size": 12
    };
    tick_group.elem.push(tick, label);
    y_axis_group.elem.push(tick_group);
    y_grid_group.elem.push({
      type: "line",
      x1: 0,
      x2: bar_area_width,
      y1: bar_height - height_scale(i) - 0.5,
      y2: bar_height - height_scale(i) - 0.5,
      stroke: "#dddddd",
      "stroke-width": 1
    })
  }

  bar_group = {
    type: "g",
    id: "natural-number-view-bar-group",
    role: "natural-number-view-bar-group",
    width: bar_area_width,
    height: bar_height,
    x: padding + y_axis_width,
    y: padding,
    elem: []
  }
  x_axis_group = {
    type: "g",
    id: "natural-number-view-x-axis",
    role: "natural-number-view-x-axis",
    width: bar_area_width,
    height: x_axis_height,
    x: padding + y_axis_width,
    y: padding + bar_height,
    elem: [{
      type: "line",
      id: "natural-number-view-y-axis-domain",
      x1: 0,
      x2: bar_area_width,
      y1: -0.5,
      y2: -0.5,
      stroke: defualt_color,
      "stroke-width": 1
    }]
  }

  let ci = 0;
  for (let co of new_counts) {
    let x = bar_band * ci;
    let bar_item_height = height_scale(co.count);
    let bar_item_group = {
      type: "g",
      id: "natural-number-view-bar-item-" + ci,
      role: "natural-number-view-bar--group",
      width: bar_band,
      height: bar_height,
      x,
      y: 0,
      elem: [{
        type: "rect",
        id: "natural-number-view-bar-" + ci,
        width: bar_band * bar_band_rate,
        x: bar_band * (1 - bar_band_rate) / 2,
        height: 4,
        y: bar_height - bar_item_height - 2,
        fill: ord_colors[0],
        "stroke-width": 0
      }, {
        type: "text",
        id: "natural-number-view-bar-count-" + ci,
        x: bar_band / 2,
        y: bar_height - bar_item_height + 9,
        "text-anchor": "middle",
        "alignment-baseline": "middle",
        "font-size": 9,
        "fill": "gray",
        "text": co.count || 0,
      }, {
        type: "click-wrap",
        id: "natural-number-view-bar-click-wrap-" + ci,
        role: "natural-number-view-bar-click-wrap",
        width: bar_band,
        x: 0,
        height: bar_height,
        y: 0,
        data: {
          number: co.number,
          count: co.count
        }
      }],
      data: {
        tooltip_content: {
          "Number": co.number,
          "Count": co.count,
          "State vector": co.original_state_vector
        }
      }
    };

    bar_group.elem.push(bar_item_group);

    let tick_item_group = {
      type: "g",
      id: "natural-number-view-x-axis-group-" + ci,
      width: bar_band,
      height: bar_height,
      x,
      y: 0,
      elem: [{
        type: "line",
        id: "natural-number-view-x-axis-" + ci,
        x1: bar_band / 2 - 0.5,
        x2: bar_band / 2 - 0.5,
        y1: 0,
        y2: 5,
        "stroke-width": 1
      }, {
        type: "text",
        id: "natural-number-view-x-axis-marker-" + ci,
        role: "natural-number-view-x-axis-marker",
        x: bar_band / 2,
        y: 15,
        "text-anchor": "middle",
        "alignment-baseline": "middle",
        "font-size": 10,
        text: co.number
      }]
    };
    x_axis_group.elem.push(tick_item_group);
    ci++;
  }

  return {
    type: "svg",
    width: width + padding * 2,
    height: height + padding * 2,
    viewBox: [0, 0, width + padding * 2, height + padding * 2],
    groups: {
      bar_group,
      y_axis_group,
      y_grid_group,
      x_axis_group
    }
  }
}

function reverse_string(str) {
  return str.split("").reverse().join("");
}

let nice_units = [100, 50, 25, 10, 5, 1];
function get_nice_unit(nice_max) {
  for (let unit of nice_units) {
    if (nice_max % unit == 0 && nice_max / unit > 1) return unit;
  }
}