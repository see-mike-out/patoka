import { scaleLinear, format } from "d3";
import { circuit_h_gap, circuit_v_gap, default_fill, defualt_color, ord_colors, padding } from "../CircuitViewer/svg_utils/constants";

const y_axis_width = 50, bar_height = 300, x_axis_height = 30, bar_band = 20, bar_band_rate = 0.75, legend_height = 30;

function reverse_string(str) {
  return str.split("").reverse().join("");
}
function wrapup_bistrings(bitstrings, reverse_state_vector) {
  let wrapped = bitstrings.map((d) => reverse_state_vector ? reverse_string(d) : d);
  let wrapped_inter = wrapped.map((d, i) => [d, i]);
  wrapped_inter = wrapped_inter.toSorted((a, b) => a[0].localeCompare(b[0]));
  let bitstring_arg_map = {};
  wrapped_inter.forEach((d) => {
    bitstring_arg_map[d[0]] = d[1];
  });
  wrapped = wrapped_inter.map((d) => d[0]);
  return { wrapped_state_bistrings: wrapped, bitstring_arg_map };
}


export function plan_count_histogram(counts, uncertainty_data, config = {}) {
  if (!counts) return null;

  // configurations
  let reverse_state_vector = config?.reverse_state_vector !== undefined ? config?.reverse_state_vector : true;
  let has_uncertainty = config.see_uncertainty !== false
    && uncertainty_data !== undefined
    && uncertainty_data?.data !== undefined
    && uncertainty_data?.counts !== undefined
    && uncertainty_data?.probs !== undefined
    && uncertainty_data?.metadata !== undefined;

  let is_bootstrap = has_uncertainty ? uncertainty_data.metadata?.bootstrap : false;
  let number_format = is_bootstrap ? format('.6f') : format(",d");
  let number_format_precision = is_bootstrap ? format('.10f') : format(",d");

  // data prep
  let count_data = [];
  let original_state_bistrings = Object.keys(counts);
  let { wrapped_state_bistrings, bitstring_arg_map }
    = wrapup_bistrings(original_state_bistrings, reverse_state_vector);
  wrapped_state_bistrings = wrapped_state_bistrings.toSorted();

  for (let i = 0; i < wrapped_state_bistrings?.length; i++) {
    let bit = wrapped_state_bistrings[i],
      original_state = original_state_bistrings[bitstring_arg_map[bit]];
    let c = counts[original_state] || 0;
    count_data.push({
      state: bit,
      original_state: original_state,
      count: c,
      unceratinty: has_uncertainty ? uncertainty_data.data[original_state] : undefined,
      unceratinty_counts: has_uncertainty ? uncertainty_data.counts[original_state] : undefined,
      unceratinty_probs: has_uncertainty ? uncertainty_data.probs[original_state] : undefined
    });
  }

  // draw
  let width = 0, height = bar_height + x_axis_height, bar_group, y_axis_group, y_grid_group, x_axis_group, legend_group;

  let bar_area_width = count_data?.length * bar_band;
  width = bar_area_width + y_axis_width;

  let max_count;
  if (has_uncertainty && is_bootstrap) {
    max_count = Math.max(...count_data.map((d) => Math.max(...d.unceratinty_probs)));
  } else if (has_uncertainty && !is_bootstrap) {
    max_count = Math.max(...count_data.map((d) => Math.max(...d.unceratinty_counts, d.count)));
  } else {
    max_count = Math.max(...count_data.map((d) => d.count));
  }

  let height_scale =
    scaleLinear().domain([0, max_count]).range([0, bar_height]).nice();
  let nice_max_count = height_scale.invert(bar_height);
  let nice_unit = get_nice_unit(nice_max_count);

  // axis
  y_axis_group = {
    type: "g",
    id: "count-histogram-y-axis",
    role: "count-histogram-y-axis",
    width: y_axis_width,
    height: bar_height,
    x: padding,
    y: padding,
    elem: [{
      type: "rect",
      x: 0 - padding,
      y: -5,
      width: y_axis_width + padding,
      height: bar_height + 10,
      fill: default_fill,
      "stroke-width": 0
    }, {
      type: "line",
      id: "count-histogram-y-axis-domain",
      x1: y_axis_width - 1,
      x2: y_axis_width - 1,
      y1: 0,
      y2: bar_height,
      stroke: defualt_color,
      "stroke-width": 1
    }, {
      type: "text",
      id: "count-histogram-y-axis-title",
      x: y_axis_width + 10,
      y: 7.5,
      text: is_bootstrap ? "Prob." : "Count",
      "font-size": 12,
      fill: defualt_color,
      "text-anchor": "start",
      "alignment-baseline": "top",
      "font-style": "italic"
    }]
  };
  // axis
  y_grid_group = {
    type: "g",
    id: "count-histogram-y-axis",
    role: "count-histogram-y-axis",
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
      id: "count-histogram-y-axis-tick",
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
    id: "count-histogram-bar-group",
    role: "count-histogram-bar-group",
    width: bar_area_width,
    height: bar_height,
    x: padding + y_axis_width,
    y: padding,
    elem: []
  }
  x_axis_group = {
    type: "g",
    id: "count-histogram-x-axis",
    role: "count-histogram-x-axis",
    width: bar_area_width,
    height: x_axis_height,
    x: padding + y_axis_width,
    y: padding + bar_height,
    elem: [{
      type: "line",
      id: "count-histogram-y-axis-domain",
      x1: 0,
      x2: bar_area_width,
      y1: -0.5,
      y2: -0.5,
      stroke: defualt_color,
      "stroke-width": 1
    }]
  }

  let ci = 0;
  for (let co of count_data) {
    let x = bar_band * ci;
    let bar_value = is_bootstrap ? co.unceratinty.prob_measure : co.count;
    let bar_item_height = height_scale(bar_value);
    let bar_item_group = {
      type: "g",
      id: "count-histogram-bar-item-" + ci,
      role: "count-histogram-bar--group",
      width: bar_band,
      height: bar_height,
      x,
      y: 0,
      elem: [{
        type: "rect",
        id: "count-histogram-bar-" + ci,
        width: bar_band * bar_band_rate,
        x: bar_band * (1 - bar_band_rate) / 2,
        height: 4,
        y: bar_height - bar_item_height - 2,
        fill: ord_colors[1],
        "stroke-width": 0
      },],
      data: {
        tooltip_content: {
          "State": co.state,
          "Count": co.count,
          "Probability": has_uncertainty ? number_format_precision(co.unceratinty.prob_measure) : undefined,
          "HEA-prob. mean": has_uncertainty ? number_format_precision(co.unceratinty.prob_mean) : undefined,
          "HEA-prob. interval": has_uncertainty ? "[" + co.unceratinty.prob_interval.map(number_format_precision).join(", ") + "]" : undefined,
          "HEA-count mean": has_uncertainty ? number_format_precision(co.unceratinty.mean) : undefined,
          "HEA-count interval": has_uncertainty ? "[" + co.unceratinty.interval.map(number_format_precision).join(", ") + "]" : undefined,
        }
      }
    };

    if (has_uncertainty) {
      let unceratinty_value = is_bootstrap ? co.unceratinty.prob_mean : co.unceratinty.mean;
      let unceratinty_height = height_scale(unceratinty_value);
      let unceratinty_interval_height = (is_bootstrap ? co.unceratinty.prob_interval : co.unceratinty.interval).map(height_scale);
      bar_item_group.elem.push({
        type: "rect",
        id: "count-histogram-hea-bar-" + ci,
        width: bar_band * bar_band_rate,
        x: bar_band * (1 - bar_band_rate) / 2,
        height: 4,
        y: bar_height - unceratinty_height - 2,
        fill: ord_colors[0],
        "fill-opacity": 0.7,
        "stroke-width": 0
      }, {
        type: "line",
        id: "count-histogram-hea-interval-" + ci,
        width: bar_band * bar_band_rate,
        x1: bar_band / 2 - 0.5,
        x2: bar_band / 2 - 0.5,
        y1: bar_height - unceratinty_interval_height[0],
        y2: bar_height - unceratinty_interval_height[1],
        stroke: defualt_color,
        "stroke-width": 1
      })
    } else {
      bar_item_group.elem.push({
        type: "text",
        id: "count-histogram-bar-count-" + ci,
        x: bar_band / 2,
        y: bar_height - bar_item_height + 9,
        "text-anchor": "middle",
        "alignment-baseline": "middle",
        "font-size": 9,
        "fill": "gray",
        "text": number_format(bar_value) || 0,
      })
    }
    bar_item_group.elem.push({
      type: "click-wrap",
      id: "count-histogram-bar-click-wrap-" + ci,
      role: "count-histogram-bar-click-wrap",
      width: bar_band,
      x: 0,
      height: bar_height,
      y: 0,
      data: {
        state: co.state,
        count: co.count,
        probability: has_uncertainty ? co.unceratinty.prob_measure : undefined,
        hea_probability_mean: has_uncertainty ? co.unceratinty.prob_mean : undefined,
        hea_probability_interval: has_uncertainty ? co.unceratinty.prob_interval : undefined,
        hea_count_mean: has_uncertainty ? co.unceratinty.mean : undefined,
        hea_count_interval: has_uncertainty ? co.unceratinty.interval : undefined,
      }
    });

    bar_group.elem.push(bar_item_group);

    let tick_item_group = {
      type: "g",
      id: "count-histogram-x-axis-group-" + ci,
      width: bar_band,
      height: bar_height,
      x,
      y: 0,
      elem: [{
        type: "line",
        id: "count-histogram-x-axis-" + ci,
        x1: bar_band / 2 - 0.5,
        x2: bar_band / 2 - 0.5,
        y1: 0,
        y2: 5,
        "stroke-width": 1
      }, {
        type: "text",
        id: "count-histogram-x-axis-marker-" + ci,
        role: "count-histogram-x-axis-marker",
        x: bar_band / 2 - 5,
        y: 15,
        "text-anchor": "end",
        "alignment-baseline": "middle",
        "font-size": 10,
        text: co.state,
        transform: 'rotate(-40 0 0)'
      }]
    };
    x_axis_group.elem.push(tick_item_group);
    ci++;
  }

  if (has_uncertainty) {
    legend_group = {
      type: "g",
      id: "count-histogram-legend-group",
      role: "count-histogram-legend-group",
      width: bar_area_width,
      height: legend_height,
      x: padding + y_axis_width,
      y: padding + bar_height + x_axis_height + circuit_v_gap,
      elem: []
    }
    legend_group.elem.push({
      type: "g",
      id: "count-histogram-legend-original-group",
      role: "count-histogram-legend-item-group",
      width: 100,
      height: legend_height,
      x: 0,
      y: 0,
      elem: [{
        type: "rect",
        width: bar_band * bar_band_rate,
        x: 0,
        height: 4,
        y: legend_height / 2 - 2,
        fill: ord_colors[1],
        "stroke-width": 0
      }, {
        type: "text",
        x: bar_band * bar_band_rate + circuit_h_gap,
        y: legend_height / 2 + 2,
        fill: defualt_color,
        text: "Original " + (is_bootstrap ? "probability" : "count"),
        "font-size": 12,
        "text-anchor": "start",
        "alignment-baseline": "middle",
      }]
    });

    legend_group.elem.push({
      type: "g",
      id: "count-histogram-legend-hea-group",
      role: "count-histogram-legend-item-group",
      width: 100,
      height: legend_height,
      x: 170,
      y: 0,
      elem: [{
        type: "rect",
        width: bar_band * bar_band_rate,
        x: 0,
        height: 4,
        y: legend_height / 2 - 2,
        fill: ord_colors[0],
        "stroke-width": 0
      }, {
        type: "text",
        x: bar_band * bar_band_rate + circuit_h_gap,
        y: legend_height / 2 + 2,
        fill: defualt_color,
        text: "Hypothetical error-adjusted (HEA) " + (is_bootstrap ? "probability" : "count"),
        "font-size": 12,
        "text-anchor": "start",
        "alignment-baseline": "middle",
      }]
    });

    legend_group.elem.push({
      type: "g",
      id: "count-histogram-legend-hea-group",
      role: "count-histogram-legend-item-group",
      width: 100,
      height: legend_height,
      x: 500,
      y: 0,
      elem: [{
        type: "line",
        x1: 0,
        x2: 0,
        y1: 7,
        y2: legend_height - 7,
        "stroke-width": 1,
        stroke: defualt_color
      }, {
        type: "text",
        x: 1 + circuit_h_gap,
        y: legend_height / 2 + 2,
        fill: defualt_color,
        text: "HEA " + (is_bootstrap ? "probability" : "count") + " interval",
        "font-size": 12,
        "text-anchor": "start",
        "alignment-baseline": "middle",
      }]
    })

    height += legend_height + circuit_v_gap
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
      x_axis_group,
      legend_group
    }
  }
}

let nice_units = [100, 50, 25, 10, 5, 1, 0.5, 0.25, 0.1, 0.05, 0.025, 0.01, 0.005, 0.0025, 0.001];
function get_nice_unit(nice_max) {
  for (let unit of nice_units) {
    if (nice_max > 1 && nice_max % unit == 0 && nice_max / unit > 1) return unit;
    else if (nice_max < 1 && nice_max % unit < 0.001 && nice_max / unit > 1) return unit;
  }
}