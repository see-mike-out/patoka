import { dir_H, dir_V } from "./constant";
import { max, scaleLinear, scaleOrdinal, ascending } from "d3";

export function get_scales(data, design, sizing) {
  let scales = {};
  let states = Object.keys(data.data);
  states = states.toSorted(ascending);
  let max_q = 0;
  if (data.metadata.bootstrap) {
    max_q = 1
  } else {
    for (let state of states) {
      let loc_max_q = max(data.counts[state]);
      if (loc_max_q > max_q) {
        max_q = loc_max_q;
      }
    }
  }

  let n_range = states.map((_, i) => sizing.chart.band_total_width * i);
  if (sizing.dir === dir_V) {
    scales.y = scaleLinear([0, max_q], [sizing.chart.height, 0]).nice();
    scales.x = scaleOrdinal(states, n_range);
  } else if (sizing.dir === dir_H) {
    scales.x = scaleLinear([0, max_q], [0, sizing.chart.width]).nice();
    scales.y = scaleOrdinal(states, n_range);
  }

  return scales;
}