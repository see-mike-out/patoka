import { circuit_h_gap, defualt_color, esp_area_height, esp_bar_width } from "./constants";

export function plan_esp_chart(pos, data, circuit_body) {
  let esp_group = {
    id: "esp--group",
    type: "g",
    x: pos.x,
    y: pos.y,
    width: pos.width,
    height: pos.height,
    elem: [],
    role: "esp-group"
  };
  let esp_axis_group = {
    id: "esp-axis--group",
    type: "g",
    x: 0,
    y: pos.y,
    width: pos.x,
    height: pos.height,
    elem: [],
    role: "esp-axis-group"
  }

  // title
  esp_axis_group.elem.push({
    type: "text",
    id: "esp--title",
    role: "esp--title",
    text: "Estimated",
    x: 0,
    y: 6,
    "font-weight": 700,
    "text-anchor": "start",
    "alignment-baseline": "top"
  }, {
    type: "text",
    id: "esp--title",
    role: "esp--title",
    text: "Success",
    x: 0,
    y: 6 + 14,
    "font-weight": 700,
    "text-anchor": "start",
    "alignment-baseline": "top"
  }, {
    type: "text",
    id: "esp--title",
    role: "esp--title",
    text: "Prob.",
    x: 0,
    y: 6 + 14 + 14,
    "font-weight": 700,
    "text-anchor": "start",
    "alignment-baseline": "top"
  })
  // y axis
  let esp_y_axis_width = circuit_h_gap * 2;
  let esp_y_axis = {
    id: "esp-y-axis--wrap",
    type: "g",
    role: "esp-y-axis",
    x: 0,
    y: 0,
    width: pos.x,
    height: pos.height,
    elem: [],
  }
  for (let i = 0; i < 5; i++) {
    esp_y_axis.elem.push({
      type: "text",
      id: "esp-y-axis--label",
      role: "esp-y-axis--label",
      text: (i / 4),
      x: pos.x - circuit_h_gap * 2,
      y: pos.height - pos.height * (i / 4),
      "font-size": 12,
      "text-anchor": "end",
      "alignment-baseline": "middle"
    });
  }
  esp_y_axis.elem.push({
    type: "line",
    id: "esp-y-axis--domain",
    role: "esp-y-axis--domain",
    x1: pos.x - circuit_h_gap - 1,
    x2: pos.x - circuit_h_gap - 1,
    y1: -0.5,
    y2: pos.height + 0.5,
    stroke: defualt_color,
    "stroke-width": 1
  });

  esp_axis_group.elem.push(esp_y_axis);

  // h grids
  let esp_h_grid_width = pos.width;
  let esp_h_grid = {
    id: "esp-h-grid--wrap",
    type: "g",
    role: "esp-h-grid",
    x: 0,
    y: 0,
    width: esp_h_grid_width,
    height: pos.height,
    elem: [],
  }
  for (let i = 0; i < 5; i++) {
    esp_h_grid.elem.push({
      type: "line",
      id: "esp-h-grid--line",
      role: "esp-h-grid--line",
      x1: -circuit_h_gap - 1,
      x2: pos.width,
      y1: pos.height * (i / 4),
      y2: pos.height * (i / 4),
      stroke: defualt_color,
      "stroke-width": 1,
      "stroke-opacity": 0.2
    });
  }

  esp_group.elem.push(esp_h_grid);

  // bars
  let esp_bars = {
    id: "esp-bars--group",
    type: "g",
    role: "esp-bars--group",
    x: 0,
    y: 0,
    width: pos.width,
    height: pos.height,
    elem: [],
  }
  for (let i = 0; i < data.layers.length; i++) {
    let layer = data.layers[i];
    let bar_group_width = circuit_body[i].width;
    let esp_bar_group = {
      id: `esp-bar-${i}--group`,
      type: "g",
      role: "esp-bar--group",
      x: circuit_body[i].x,
      y: 0,
      width: bar_group_width,
      height: pos.height,
      elem: [],
      data: {
        layer_index: i,
        operations: layer.operations,
        detail: layer.esp_detail,
        esp_this: layer.esp_this,
        esp_total: layer.esp_total,
        tooltip_content: {
          "ESP (this layer)": layer.esp_this,
          "ESP (cummulative)": layer.esp_total,
        }
      }
    }
    let bar_this_height = layer.esp_this * pos.height;
    esp_bar_group.elem.push({
      type: "rect",
      id: `esp-bar-${i}--bar-this`,
      role: "esp-bar--bar-this",
      x: bar_group_width / 2 - esp_bar_width,
      y: pos.height - bar_this_height,
      width: esp_bar_width,
      height: bar_this_height,
      "stroke-width": 0,
      fill: "orange"
    });
    let bar_total_height = layer.esp_total * pos.height
    esp_bar_group.elem.push({
      type: "rect",
      id: `esp-bar-${i}--bar-total`,
      role: "esp-bar--bar-total",
      x: bar_group_width / 2,
      y: pos.height - bar_total_height,
      width: esp_bar_width,
      height: bar_total_height,
      "stroke-width": 0,
      fill: "red"
    });
    esp_bar_group.elem.push({
      type: "click-wrap",
      id: `esp-bar-${i}--click-wrap`,
      role: "esp-bar-click-wrap",
      x: bar_group_width / 2 - esp_bar_width,
      y: 0,
      width: esp_bar_width * 2,
      height: pos.height,
      data: {
        layer_index: i,
        operations: layer.operations,
        detail: layer.esp_detail,
        esp_this: layer.esp_this,
        esp_total: layer.esp_total,
      }
    });
    esp_bars.elem.push(esp_bar_group);
  }
  esp_group.elem.push(esp_bars);

  return [esp_axis_group, esp_group]
}