import { scaleLinear, format } from "d3";
import { circuit_h_gap, pulse_y_axis_width, ord_colors, padding, defualt_color, pulse_x_axis_height } from "./constants";
import { get_pulse_path } from "./draw_pulse_data"

let number_format = format(",d");
const _unit_dt = 5, _pulse_row_height = 50;

export function draw_mini_pulse_data(schedule, options = {}) {
  if (!schedule) return;
  let channels = {};
  for (const sched of schedule) {
    if (!channels[sched.name]) {
      channels[sched.name] = {
        channel_type: sched.channel_type,
        channel_index: sched.channel_index,
        name: sched.name
      }
    }
  }

  let unit_dt = options?.unit_dt || _unit_dt;
  let pulse_row_height = options?.pulse_row_height || _pulse_row_height;
  if (!schedule || schedule.length == 0 || !channels || Object.keys(channels).length == 0) return;
  let width = 0, height = 0;
  let area_group;

  let channel_legend_info = {}, n_channels = 0, sorted_channel_keys = [];
  for (const channel in channels) {
    if (!channel_legend_info[channels[channel].channel_type]) {
      channel_legend_info[channels[channel].channel_type] = { color: ord_colors[n_channels] };
      n_channels += 1;
    }
    sorted_channel_keys.push(channel);
  }
  sorted_channel_keys = sorted_channel_keys
    .map((d) => [d.match(/[a-z]+/)?.[0], parseInt(d.match(/[0-9]+/)?.[0])])
    .toSorted((a, b) => a[1] - b[1])
    .map((d) => d.join(""));
  let sorted_channel_map = {};
  let sorted_channels = sorted_channel_keys.map((d, i) => {
    let p = channels[d];
    sorted_channel_map[d] = i;
    return p;
  });




  // draw pulse
  let amp_scale = scaleLinear().domain([0, 0.5]).range([0, pulse_row_height]);
  let dt_scale = (dt) => dt / unit_dt;
  if (schedule.length > 0 && Object.keys(channels).length > 0) {

    area_group = {
      type: "g",
      role: "mini-pulse-data-group",
      id: "mini-pulse-data-group",
      _class: "mini-pulse-data-group",
      x: padding,
      y: padding,
      width: 0,
      height: 0,
      elem: []
    };
    // layout - height
    let area_vis_height = pulse_row_height * sorted_channels.length
    area_group.height = area_vis_height;
    height = area_group.height > height ? area_group.height : height;

    // layout - width
    let pulse_area_elem_end_times = schedule.map((d) => d.time_at + d.duration);
    let max_end_time = Math.max(...pulse_area_elem_end_times);
    let area_vis_width = dt_scale(max_end_time);
    area_group.width = area_vis_width + pulse_y_axis_width + circuit_h_gap
    width += area_group.width;

    let ci = 0;
    for (const channel of sorted_channels) {
      // layout
      let area_elem_group = {
        type: "g",
        role: "mini-pulse-area-row-group",
        id: "mini-pulse-area-row-group-" + channel.name,
        _class: "mini-pulse-area-row-group",
        x: 0,
        y: pulse_row_height * ci,
        width: 0,
        height: pulse_row_height,
        elem: []
      };

      // name
      let area_elem_name_group = {
        type: "g",
        role: "mini-pulse-area-row-name-group",
        id: "mini-pulse-area-row-name-group-" + channel.name,
        _class: "mini-pulse-area-row-name-group",
        x: 0,
        y: 0,
        width: 0,
        height: 0,
        elem: []
      };

      area_elem_name_group.elem.push({
        type: "text",
        x: pulse_y_axis_width,
        y: pulse_row_height / 2 - 6 + 4.5,
        "font-size": 12,
        "text-anchor": "end",
        "alignment-baseline": "center",
        text: channel.channel_type.replace(/Channel$/, ""),
        "font-weight": 700,
        "line-height": 1
      })

      area_elem_name_group.elem.push({
        type: "text",
        x: pulse_y_axis_width,
        y: pulse_row_height / 2 + 6 + 4.5,
        "font-size": 12,
        "text-anchor": "end",
        "alignment-baseline": "center",
        text: "(" + channel.name + ")",
        "font-weight": 400,
        "line-height": 1
      })

      area_elem_group.elem.push(area_elem_name_group);

      // background / line
      area_elem_group.elem.push({
        type: "rect",
        x: pulse_y_axis_width + circuit_h_gap,
        y: 0,
        width: area_vis_width,
        height: pulse_row_height,
        fill: defualt_color,
        "fill-opacity": 0.05,
        "stroke-width": 0,
      })
      area_elem_group.elem.push({
        type: "line",
        x1: pulse_y_axis_width + circuit_h_gap,
        y1: pulse_row_height,
        x2: pulse_y_axis_width + circuit_h_gap + area_vis_width,
        y2: pulse_row_height,
        "stroke-width": 1,
      })

      // vis group
      let area_vis_group = {
        type: "g",
        role: "mini-pulse-area-vis-group",
        id: "mini-pulse-area-vis-group-" + channel.name,
        _class: "mini-pulse-area-vis-group",
        x: pulse_y_axis_width + circuit_h_gap,
        y: 0,
        width: area_vis_width,
        height: pulse_row_height,
        elem: []
      };
      area_elem_group.elem.push(area_vis_group);

      area_group.elem.push(area_elem_group)
      ci++;
    }

    for (const sched of schedule) {
      let dt_x0 = dt_scale(sched.time_at), dt_x1 = dt_scale(sched.time_at + sched.duration);
      // Play
      if (sched.component_type === "Play") {
        let amp_height = amp_scale(sched.amplitude);
        let gi = area_group.elem[sorted_channel_map[sched.name]].elem.length - 1;
        let path = get_pulse_path(dt_x0, dt_x1, amp_height, pulse_row_height);
        area_group.elem[sorted_channel_map[sched.name]].elem[gi].elem.push({
          _class: `mini-pulse-path--layer-${sched.layer_index}--op-${sched.op_index}`,
          type: "path",
          path,
          fill: channel_legend_info[sched.channel_type].color,
          "fill-opacity": 0.5,
          "stroke-width": 0,
        });
      }
      // ShiftPhase
      else if (sched.component_type === "ShiftPhase") {
        let gi = area_group.elem[sorted_channel_map[sched.name]].elem.length - 1
        area_group.elem[sorted_channel_map[sched.name]].elem[gi].elem.push({
          _class: `mini-pulse-path--layer-${sched.layer_index}--op-${sched.op_index}`,
          type: "rect",
          x: dt_x0 - 1,
          y: pulse_row_height * 0.2,
          width: 2,
          height: pulse_row_height * 0.8,
          fill: channel_legend_info[sched.channel_type].color,
          "fill-opacity": 0.7,
          "stroke-width": 0,
        })
      }
    }

    // x-axis
    let x_axis_group = {
      type: "g",
      role: "mini-pulse-data-x-axis-group",
      id: "mini-pulse-data-x-axis-group",
      _class: "mini-pulse-data-x-axis-group",
      x: pulse_y_axis_width + circuit_h_gap,
      y: area_vis_height,
      width: area_vis_width,
      height: pulse_x_axis_height,
      elem: []
    }
    let dt_axis_marker_step = 0;
    while (dt_axis_marker_step < max_end_time) {
      let axis_tick_group = {
        type: "g",
        role: "mini-pulse-data-x-axis-group",
        id: "mini-pulse-data-x-axis-group-" + dt_axis_marker_step,
        _class: "mini-pulse-data-x-axis-group",
        x: dt_scale(dt_axis_marker_step),
        y: 0,
        elem: [{
          type: "line",
          x1: -0.5,
          y1: 0,
          x2: -0.5,
          y2: 6,
          "stroke-width": 1,
          "stroke": defualt_color
        }, {
          type: "text",
          x: -1,
          y: pulse_x_axis_height,
          "font-size": 10,
          "text-anchor": "middle",
          "alignment-baseline": "bottom",
          text: number_format(dt_axis_marker_step),
          "font-weight": 400
        }]
      }
      x_axis_group.elem.push(axis_tick_group);
      dt_axis_marker_step += 500;
    }
    area_group.elem.push(x_axis_group);
    area_group.height += pulse_x_axis_height;
    height += pulse_x_axis_height;
  }

  return {
    type: "svg",
    width: width + padding * 2,
    height: height + padding * 2,
    viewBox: [0, 0, width + padding * 2, height + padding * 2],
    groups: {
      area_group
    },
    scales: {
      dt_scale,
      amp_scale
    }
  };
}