import { scaleLinear } from "d3";
import { circuit_h_gap, default_fill, defualt_color, ord_colors, padding } from "../../CircuitViewer/svg_utils/constants";

const row_height = 25, symbol_column_width = 25, truth_column_width = 50, count_column_width = 200, bar_height = 15;

export function parseTruthTableProblem(counts, config) {
  if (!counts) return null;
  // step 1. data prep
  // reverse
  let new_counts = [];

  let filter_true = config?.filter_true !== undefined ? config?.filter_true : false;
  for (const p of Object.keys(counts)) {
    let truth_state = get_truth_state(p)
    if (filter_true && !truth_state.truth) continue;
    new_counts.push({
      original_state_vector: p,
      reversed_state_vector: reverse_string(p),
      truth_state,
      count: counts[p]
    });
  }

  let symbols = Object.keys(new_counts[0].truth_state.symbols),
    n_symbols = symbols?.length;

  // sort
  new_counts.sort((a, b) => b.count - a.count);

  // step 2. plan visualization
  let state_width = new_counts[0].original_state_vector?.length * 12 * 0.6 + 10;
  let width = state_width
    + n_symbols * symbol_column_width
    + truth_column_width
    + circuit_h_gap + count_column_width + circuit_h_gap,
    height = row_height * (new_counts?.length + 1),
    header_group, item_group;
  let max_count = Math.max(...new_counts.map((d) => d.count));
  let height_scale = scaleLinear().domain([0, max_count]).range([0, count_column_width]).nice();

  // header
  header_group = {
    type: "g",
    id: "truth-table-header-group",
    role: "truth-table-header-group",
    width: width,
    height: row_height,
    x: padding,
    y: padding,
    elem: [{
      type: "rect",
      id: "truth-table-header-background",
      role: "truth-table-header-background",
      width: width,
      height: row_height,
      x: 0,
      y: 0,
      fill: default_fill,
      "stroke-width": 0
    }]
  }
  header_group.elem.push({
    type: "line",
    x1: 0.5,
    x2: 0.5,
    y1: 0.5,
    y2: row_height - 0.5,
    "stroke-width": 1,
    stroke: defualt_color
  })

  header_group.elem.push({
    type: "text",
    id: "truth-table-header-symbol-state",
    x: state_width / 2,
    y: row_height / 2 + 6,
    fill: defualt_color,
    text: "State",
    "font-weight": 700,
    "text-anchor": "middle",
    "alignment-baseline": "bottom",
  });
  header_group.elem.push({
    type: "line",
    x1: state_width,
    x2: state_width,
    y1: 0.5,
    y2: row_height - 0.5,
    "stroke-width": 1,
    stroke: defualt_color
  })
  for (let i = 0; i < n_symbols; i++) {
    header_group.elem.push({
      type: "text",
      id: "truth-table-header-symbol-" + symbols[i],
      x: state_width + symbol_column_width * i + symbol_column_width / 2,
      y: row_height / 2 + 6,
      fill: defualt_color,
      text: symbols[i],
      "font-weight": 700,
      "text-anchor": "middle",
      "alignment-baseline": "bottom",
    });
    header_group.elem.push({
      type: "line",
      x1: state_width + symbol_column_width * (i + 1),
      x2: state_width + symbol_column_width * (i + 1),
      y1: 0.5,
      y2: row_height - 0.5,
      "stroke-width": 1,
      stroke: defualt_color
    })
  }
  header_group.elem.push({
    type: "text",
    id: "truth-table-header-truth",
    x: state_width + symbol_column_width * n_symbols + truth_column_width / 2,
    y: row_height / 2 + 6,
    fill: defualt_color,
    text: "Truth",
    "font-weight": 700,
    "text-anchor": "middle",
    "alignment-baseline": "bottom",
  });
  header_group.elem.push({
    type: "line",
    x1: state_width + symbol_column_width * n_symbols + truth_column_width,
    x2: state_width + symbol_column_width * n_symbols + truth_column_width,
    y1: 0.5,
    y2: row_height - 0.5,
    "stroke-width": 1,
    stroke: defualt_color
  });
  header_group.elem.push({
    type: "text",
    id: "truth-table-header-count",
    x: state_width + (symbol_column_width * n_symbols) + truth_column_width + circuit_h_gap + count_column_width / 2,
    y: row_height / 2 + 6,
    fill: defualt_color,
    text: "Count",
    "font-weight": 700,
    "text-anchor": "middle",
    "alignment-baseline": "bottom",
  });

  header_group.elem.push({
    type: "line",
    x1: width - 0.5,
    x2: width - 0.5,
    y1: 0.5,
    y2: row_height - 0.5,
    "stroke-width": 1,
    stroke: defualt_color
  });
  header_group.elem.push({
    type: "line",
    x1: 0,
    x2: width,
    y1: row_height - 0.5,
    y2: row_height - 0.5,
    "stroke-width": 1,
    stroke: defualt_color
  });
  header_group.elem.push({
    type: "line",
    x1: 0,
    x2: width,
    y1: 0.5,
    y2: 0.5,
    "stroke-width": 1,
    stroke: defualt_color
  });

  item_group = {
    type: "g",
    id: "truth-table-item-group",
    role: "truth-table-item-group",
    width: width,
    height: row_height * new_counts?.length,
    x: padding,
    y: padding + row_height,
    elem: []
  }


  let ci = 0;
  for (const co of new_counts) {
    let row_group = {
      type: "g",
      id: "truth-table-row-group-" + ci,
      x: 0,
      y: row_height * ci,
      width: width,
      height: row_height,
      elem: [{
        type: "rect",
        x: 0,
        y: 0.5,
        width,
        height: row_height - 1,
        fill: default_fill,
        "stroke-width": 0
      }],
      data: {
        tooltip_content: {
          "State": co.original_state_vector,
          "Symbols": Object.keys(co.truth_state.symbols).join(" "),
          "Symbols-truth": Object.values(co.truth_state.symbols).map(d => d ? "T" : "F").join(" "),
          "Truth": co.truth_state.truth,
          "Count": co.count
        }
      }
    };
    row_group.elem.push({
      type: "line",
      x1: 0.5,
      x2: 0.5,
      y1: 0,
      y2: row_height,
      "stroke-width": 1,
      stroke: defualt_color
    })
    row_group.elem.push({
      type: "text",
      id: "truth-table-row-group-" + ci + "-state",
      x: state_width / 2,
      y: row_height / 2 + 6,
      fill: defualt_color,
      text: co.original_state_vector,
      "text-anchor": "middle",
      "alignment-baseline": "bottom",
    });
    row_group.elem.push({
      type: "line",
      x1: state_width,
      x2: state_width,
      y1: 0,
      y2: row_height,
      "stroke-width": 1,
      stroke: defualt_color
    })
    for (let i = 0; i < n_symbols; i++) {
      row_group.elem.push({
        type: "text",
        id: "truth-table-row-group-" + ci + "-" + symbols[i],
        x: state_width + symbol_column_width * i + symbol_column_width / 2,
        y: row_height / 2 + 6,
        fill: co.truth_state.symbols[symbols[i]] ? defualt_color : "#999999",
        text: co.truth_state.symbols[symbols[i]] ? "T" : "F",
        "font-weight": co.truth_state.symbols[symbols[i]] ? "900" : "400",
        "text-anchor": "middle",
        "alignment-baseline": "bottom",
      });
      row_group.elem.push({
        type: "line",
        x1: state_width + symbol_column_width * (i + 1),
        x2: state_width + symbol_column_width * (i + 1),
        y1: 0,
        y2: row_height,
        "stroke-width": 1,
        stroke: defualt_color
      })
    }
    row_group.elem.push({
      type: "text",
      id: "truth-table-row-group-" + ci + "-truth",
      x: state_width + symbol_column_width * n_symbols + truth_column_width / 2,
      y: row_height / 2 + 6,
      fill: co.truth_state.truth ? defualt_color : "#999999",
      text: co.truth_state.truth ? "T" : "F",
      "font-weight": co.truth_state.truth ? "700" : "400",
      "text-anchor": "middle",
      "alignment-baseline": "bottom",
    });
    row_group.elem.push({
      type: "line",
      x1: state_width + symbol_column_width * n_symbols + truth_column_width,
      x2: state_width + symbol_column_width * n_symbols + truth_column_width,
      y1: 0.5,
      y2: row_height - 0.5,
      "stroke-width": 1,
      stroke: defualt_color
    });
    row_group.elem.push({
      type: "rect",
      id: "truth-table-row-group-" + ci + "-count-bar",
      x: state_width + (symbol_column_width * n_symbols) + truth_column_width + circuit_h_gap,
      y: row_height / 2 - bar_height / 2,
      width: height_scale(co.count),
      height: bar_height,
      fill: ord_colors[2],
      text: co.count,
      "text-anchor": "end",
      "alignment-baseline": "bottom",
    });
    row_group.elem.push({
      type: "text",
      id: "truth-table-row-group-" + ci + "-count",
      x: state_width + (symbol_column_width * n_symbols) + truth_column_width + circuit_h_gap + 5,
      y: row_height / 2 + 5,
      fill: defualt_color,
      text: co.count,
      "text-anchor": "start",
      "alignment-baseline": "bottom",
    });
    row_group.elem.push({
      type: "line",
      x1: width - 0.5,
      x2: width - 0.5,
      y1: 0.5,
      y2: row_height - 0.5,
      "stroke-width": 1,
      stroke: defualt_color
    });

    row_group.elem.push({
      type: "line",
      x1: 0.5,
      x2: width - 0.5,
      y1: row_height,
      y2: row_height,
      "stroke-width": 1,
      stroke: defualt_color
    })
    item_group.elem.push(row_group);
    ci++;
  }

  return {
    type: "svg",
    width: width + padding * 2,
    height: height + padding * 2,
    viewBox: [0, 0, width + padding * 2, height + padding * 2],
    groups: {
      header_group, item_group
    }
  }
}

let a2z = 'abcdefghijklmnopqrstiuvxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
function get_truth_state(bit) {
  let pbit = bit.split("");
  let truth = pbit[0] === "1" ? true : false;
  let s = pbit.slice(1).reverse().map((d, i) => [a2z[i], d == "1" ? true : false]);
  let symbols = {};
  for (const sym of s) {
    symbols[sym[0]] = sym[1];
  }
  return {
    truth,
    symbols
  }
}

function reverse_string(str) {
  return str.split("").reverse().join("");
}
