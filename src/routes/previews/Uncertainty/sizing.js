import { axis_area_size, band_gap, band_width, default_height, dir_H, dir_V, directions, dot_radius, hypo_color, interval_color, legend_height, legend_rect_size, padding, rule_width, true_color } from "./constant";

export function get_size(data, design) {
  let sizing = {};
  let states = Object.keys(data.data);
  let n_states = states.length;
  let dir = directions[design.direction];

  sizing.dir = dir;

  let bw = design.band_width || band_width,
    bg = design.band_gap || band_gap,
    aax = design.x_axis_area_size || axis_area_size,
    aay = design.y_axis_area_size || (dir === dir_H ? axis_area_size * 3 : axis_area_size * 2),
    pd = design.padding || padding,
    h = design.chart_height || default_height,
    la = design.legend === undefined || design.legend ? legend_height : 0,
    lat = design.legend === undefined || design.legend ? legend_height + padding : 0,
    lrs = design.legend_rect_size || legend_rect_size,
    dr = design.dot_radius || dot_radius,
    rw = design.rule_width || rule_width,
    tc = design.true_color || true_color,
    hc = design.hypo_color || hypo_color,
    ic = design.interval_color || interval_color;

  sizing.padding = pd;
  if (dir === dir_V) {
    let rotate = 0;
    if (states.some(d => d.length > 5)) {
      rotate = -25;
      let max_length = Math.max(...states.map((d) => d.length));
      aax = Math.ceil(aax + axis_area_size * (max_length / 10));
    }
    let chart_width = (bw + bg * 2) * n_states;
    sizing.width = chart_width + aay + pd * 2;
    sizing.height = h + aax + pd * 2 + lat;
    sizing.y_axis = {
      width: aay,
      height: h,
      x: padding,
      y: padding + lat
    };
    sizing.x_axis = {
      width: chart_width,
      height: aax,
      x: padding + aay,
      y: padding + h + lat,
      rotate
    };
    sizing.chart = {
      width: chart_width,
      height: h,
      x: padding + aay,
      y: padding + lat,
      band_total_width: bw + bg * 2,
      band_width: bw,
      band_gap: bg,
      dot_radius: dr,
      rule_width: rw,
      true_color: tc,
      hypo_color: hc,
      interval_color: ic
    }
  } else if (dir === dir_H) {
    let chart_height = (bw + bg * 2) * n_states;
    sizing.height = chart_height + aax + pd * 2 + lat;
    sizing.width = h + aay + pd * 2;
    sizing.y_axis = {
      width: aay,
      height: chart_height,
      x: padding,
      y: padding + lat
    };
    sizing.x_axis = {
      width: h,
      height: aax,
      x: padding + aay,
      y: padding + chart_height + lat
    };
    sizing.chart = {
      width: h,
      height: chart_height,
      x: padding + aay,
      y: padding + lat,
      band_total_width: bw + bg * 2,
      band_width: bw,
      band_gap: bg,
      dot_radius: dr,
      rule_width: rw,
      true_color: tc,
      hypo_color: hc,
      interval_color: ic
    }
  }

  if (design.legend === undefined || design.legend) {
    sizing.legend = {
      height: la,
      x: padding,
      y: padding,
      true_color: tc,
      hypo_color: hc,
      legend_rect_size: lrs
    };
  }

  sizing.viewBox = [0, 0, sizing.width, sizing.height]

  return sizing;
}