import { circuit_h_gap, circuit_v_gap, control_gates_type_0, control_gates_type_1, control_gates_type_2, defualt_color, gate_error_bar_thickness, ord_colors, padding, qubit_node_gap, qubit_node_wh, swap_gates } from "./constants"
import { get_qiskit_charge } from "./cost_conversion";
import { get_original_layer } from "./plan_draw";
import { get_radian_names } from "./util";

let meta_data_area_width = 160, meta_bar_width = 100, title_area_height = 30;

export function planMachineView(data, operation_data, config) {
  // adjust color scale
  if (config?.nodeColorScale && config?.nodeColorScale.domain) {
    config?.nodeColorScale.domain([operation_data.esp, (1 + operation_data.esp) / 2, 1]);
  }

  let filter_unused_qubits = config?.filter_unused_qubits === undefined ? false : config.filter_unused_qubits;

  // qubit filtering
  let qubits_to_draw = operation_data.qubits.map((d) => d.index),
    n_qubits_to_draw = qubits_to_draw.length;
  if (filter_unused_qubits && config?.match?.bit_match) {
    qubits_to_draw = config.match.bit_match.filter((d) => !d.is_ancilla).map((d) => d.to);
    n_qubits_to_draw = qubits_to_draw.length;
  } else if (filter_unused_qubits) {
    filter_unused_qubits = false;
  }

  let node_position = data?.design?.nodes.map((d) => ({ index: d.index, x: d.x, y: d.y })), qubit_pos_map = {}, qubit_rel_map = {};
  if (n_qubits_to_draw < data?.design?.nodes.length) {
    node_position = node_position.filter(d => qubits_to_draw.includes(d.index))
  }
  node_position.forEach((d, i) => {
    qubit_pos_map[i] = d.index;
    qubit_rel_map[d.index] = i;
  });

  let min_x, min_y;
  let x_pos_list = node_position.map(d => d.x), y_pos_list = node_position.map(d => d.y);
  min_x = Math.min(...x_pos_list);
  min_y = Math.min(...y_pos_list);
  node_position = node_position.map((d) => {
    d.x = d.x - min_x;
    d.y = d.y - min_y;
    return d;
  });

  // sizing
  let width = 0, height = 0;
  // machine layout
  let machine = {
    type: "g",
    role: "machine-circuit",
    id: "machine-circuit",
    _class: "machine-circuit",
    x: 0,
    y: 0,
    width: 0,
    height: 0,
    elem: []
  };

  machine.elem.push({
    type: "text",
    id: "title",
    role: "title",
    _class: "title",
    text: "Machine: " + data.name + (data.machine_data.simulator ? " (simulator)" : ""),
    "font-size": 14,
    x: 0,
    y: 16,
    "font-weight": 700,
    "text-anchor": "start",
    "alignment-baseline": "bottom",
  })

  // Qubits
  let qubit_nodes = {
    type: "g",
    role: "qubit-nodes",
    id: "qubit-nodes",
    _class: "qubit-nodes",
    x: padding,
    y: padding + title_area_height + circuit_v_gap,
    width: 0,
    height: 0,
    elem: []
  };

  let node_bbox = {};
  for (const node of node_position) {
    let readout_error = data.readout_errors[node.index];
    let gate_info = data.gate_info.filter((d) => d?.qubits?.includes(node.index));
    let qubit_match;
    if (config?.match?.bit_match) {
      qubit_match = config?.match?.bit_match.filter(d => d.to === node.index)[0]
    }
    let data_object = {
      readout_error,
      gate_info,
      qubit_id: node.index,
      original_qubit_id: qubit_match.from,
      match_color: ord_colors[qubit_match.from || node_position.length],
      id: config?.id,
      original_circuit_id: config?.original_circuit_id,
      transpiled_circuit_id: config?.transpiled_circuit_id,
      unit_id: config?.unit_id,
      pulse_view_id: config?.pulse_view_id
    };
    let g = {
      type: "g",
      role: "qubit-node--group",
      id: `qubit-node-${node.index}--group`,
      _class: "qubit-node--group",
      x: 0,
      y: 0,
      width: qubit_node_wh,
      height: qubit_node_wh,
      elem: [],
      data: data_object
    };
    let x = node.x * (qubit_node_gap + qubit_node_wh);
    let y = node.y * (qubit_node_gap + qubit_node_wh);
    let r = qubit_node_wh / 2;
    g.x = x;
    g.y = y;

    // qubit marker
    g.elem.push({
      type: "circle",
      role: "qubit-node--node",
      id: `qubit-node-${node.index}--node`,
      _class: "qubit-node--node",
      cx: r,
      cy: r,
      r,
      stroke: defualt_color,
      "stroke-width": 2,
      fill: config?.nodeColorScale(1),
      // "fill-opacity": (1 - readout_error.value)
    });

    // qubit marker text
    g.elem.push({
      type: "text",
      role: "qubit-node--marker",
      id: `qubit-node-${node.index}--marker`,
      _class: "qubit-node--marker",
      text: node.index,
      x: r,
      y: r + 2,
      "text-anchor": "middle",
      "alignment-baseline": "middle",
      stroke: defualt_color,
      "stroke-width": 0,
      fill: defualt_color
    });

    // click wrap
    g.elem.push({
      type: "click-wrap",
      role: "qubit-node-click-wrap",
      id: `qubit-node-${node.index}--click-wrap`,
      _class: "qubit-node-click-wrap",
      x: 0,
      y: 0,
      width: qubit_node_wh,
      height: qubit_node_wh,
      data: data_object
    });

    node_bbox[node.index] = [
      [x + r, y],
      [x, y + r], [x + 2 * r, y + r],
      [x + r, y + 2 * r]
    ];
    node_bbox[node.index].x = x;
    node_bbox[node.index].y = y;
    node_bbox[node.index].cx = x + r;
    node_bbox[node.index].cy = y + r;

    // size update
    width = Math.max(width, g.x + g.width);
    height = Math.max(height, g.y + g.height);
    qubit_nodes.elem.push(g);
  }
  qubit_nodes.width = width;
  qubit_nodes.height = height;


  // Edges
  let qubit_edges = {
    type: "g",
    role: "qubit-edges",
    id: "qubit-edges",
    _class: "qubit-edges",
    x: padding,
    y: padding,
    width: 0,
    height: 0,
    elem: []
  };

  let edge_draw_prep = {}
  for (const edge of data?.design?.edges) {
    if (qubits_to_draw.includes(edge[0]) && qubits_to_draw.includes(edge[1])) {
      let ei = edge.toSorted().join(">"), eio = edge.join(">");
      if (!edge_draw_prep[ei]) {
        edge_draw_prep[ei] = {
          nodes: edge,
          from_to: get_edge_xy(node_bbox[edge[0]], node_bbox[edge[1]]),
          bi_dir: false
        };
      } else {
        if (ei !== eio) {
          edge_draw_prep[ei].bi_dir = true;
        }
      }
    }
  }
  let ecnt = 0, edge_dict = {};
  for (const ei in edge_draw_prep) {
    let edge = edge_draw_prep[ei]
    let x1 = edge.from_to?.[0]?.[0],
      x2 = edge.from_to?.[1]?.[0],
      y1 = edge.from_to?.[0]?.[1],
      y2 = edge.from_to?.[1]?.[1];
    let x = Math.min(x1, x2), y = Math.min(y1, y2);
    let w = Math.max(x1, x2) - Math.min(x1, x2), h = Math.max(y1, y2) - Math.min(y1, y2);
    let edge_angle = angle_btw([w, -h], [w, 0]), edge_angle_inv = edge_angle + 180;

    let g = {
      type: "g",
      role: "qubit-edge--group",
      id: `qubit-edge-${ecnt}--group`,
      _class: "qubit-edge--group",
      x,
      y: y + title_area_height + circuit_v_gap,
      width: w,
      height: h,
      elem: []
    };

    g.elem.push({
      type: "line",
      role: "qubit-edge--edge",
      id: `qubit-edge-${ecnt}--edge`,
      _class: "qubit-edge--edge",
      x1: 0, x2: w, y1: 0, y2: h,
      stroke: defualt_color,
      "stroke-width": 1
    });

    if (edge.bi_dir || (!edge.bi_dir && edge_dir(edge.from_to[0], edge.from_to[1])) > 0) {
      g.elem.push({
        type: "arrow-end",
        role: "qubit-edge--edge-arrow-1",
        id: `qubit-edge-${ecnt}--edge-arrow-1`,
        _class: "qubit-edge--edge-arrow",
        x: w,
        y: h,
        fill: defualt_color,
        "stroke-width": 0,
        rotate: edge_angle
      });
    }

    if (edge.bi_dir || (!edge.bi_dir && edge_dir(edge.from_to[0], edge.from_to[1])) < 1) {
      g.elem.push({
        type: "arrow-end",
        role: "qubit-edge--edge-arrow-2",
        id: `qubit-edge-${ecnt}--edge-arrow-2`,
        _class: "qubit-edge--edge-arrow",
        x: 0,
        y: 0,
        fill: defualt_color,
        "stroke-width": 0,
        rotate: edge_angle_inv
      });
    }

    let w2 = w + padding / 2, h2 = h + padding * 2
    g.elem.push({
      type: "rect",
      role: "qubit-edge--highlight-wrap",
      id: `qubit-edge-${ecnt}--highlight-wrap`,
      _class: "qubit-edge--highlight-wrap highlight-wrap",
      x: w / 2 - w2 / 2,
      y: h / 2 - h2 / 2,
      width: w2,
      height: h2,
      "stroke-width": 0,
      "fill-opacity": 0
    });

    edge_dict[ei] = `qubit-edge-${ecnt}`;
    ecnt++;
    // size update
    qubit_edges.elem.push(g);
  }

  // layout update
  machine.width = width;
  machine.height = height;

  machine.elem.push(qubit_nodes);
  machine.elem.push(qubit_edges);

  let error_cap = operation_data.esp;
  let qubit_wise_esp_data = [], cumul_esp_data = [];

  // operation animation data;
  let operations = [], lcnt = 0, cummul_duration = 0;
  for (const layer_data of operation_data.layers) {
    let ops = {
      type: "g",
      role: "op-layer-group",
      id: `layer-${lcnt}--op-layer-group`,
      _class: "op-layer-group",
      x: padding,
      y: padding + title_area_height + circuit_v_gap,
      width,
      height,
      elem: [],
      data: {}
    }
    let ocnt = 0, total_duration = 0;

    // metadata
    let layer_meta_g = {
      type: "g",
      x: width + circuit_h_gap * 2,
      y: padding + 8,
      elem: []
    };
    layer_meta_g.elem.push({
      type: "text",
      x: 0,
      y: 0,
      "text-anchor": "start",
      "alignment-baseline": "bottom",
      "font-weight": 700,
      text: "Layer info"
    });

    layer_meta_g.elem.push({
      type: "text",
      x: 0,
      y: 14,
      "font-size": 12,
      "text-anchor": "start",
      "alignment-baseline": "bottom",
      text: `Layer: ${lcnt}` + (lcnt === operation_data.layers.length - 1 ? " (last)" : "")
    });

    cumul_esp_data[lcnt] = cumul_esp_data[lcnt - 1] || 1;

    // per operation
    let kx = layer_data.operations.length;
    for (const op_data of layer_data.operations) {
      let gate_info = data.gate_info.filter((d) =>
        bit_order_match(op_data.qubits.map(e => e.index), d?.qubits) &&
        d.gate == op_data.gate
      )?.[0];
      let duration = gate_info?.gate_length?.value || 0;
      total_duration = Math.max(duration, total_duration);
      let gate_name = op_data.gate;
      let gate_error = gate_info?.gate_error?.value || 0;
      let gate_qubits = gate_info?.qubits || op_data.qubits.map(e => e.index);
      if (op_data.gate === "measure") {
        gate_error = data.readout_errors[op_data.qubits[0].index]?.value;
      }
      cumul_esp_data[lcnt] = cumul_esp_data[lcnt] * (1 - gate_error);

      if (!qubit_wise_esp_data[lcnt]) qubit_wise_esp_data[lcnt] = node_position.map(() => 0);

      for (let _espi in qubit_wise_esp_data[lcnt]) {
        let espi = parseInt(_espi), qespi = qubit_pos_map[espi];
        if (qubit_nodes.elem[espi]) {
          qubit_wise_esp_data[lcnt][espi] = qubit_wise_esp_data[lcnt - 1]?.[espi] || 1;
          if (!qubit_nodes.elem[espi].data.esp_value) qubit_nodes.elem[espi].data.esp_value = []
          if (gate_info?.qubits?.includes(qespi)) {
            qubit_wise_esp_data[lcnt][espi] = qubit_wise_esp_data[lcnt][espi] * (1 - gate_error);
          } else if (op_data.gate === "measure" && op_data.qubits[0].index === qespi) {
            qubit_wise_esp_data[lcnt][espi] = qubit_wise_esp_data[lcnt][espi] * (1 - gate_error);
          }
          qubit_nodes.elem[espi].data.esp_value[lcnt] = qubit_wise_esp_data[lcnt][espi];
        }
      }

      let { edges, edge_ids } = get_edges(gate_info, edge_dict);
      let match_color;
      let layer_match = get_original_layer(config?.match?.layer_match, "t-o", lcnt, ocnt);
      if (layer_match) {
        match_color =
          ord_colors[(layer_match.layer + layer_match.operation * kx) % ord_colors.length];
      } else {
        match_color = "#454545"
      }


      let pulse_key = gate_name + "__" + gate_qubits.join("_");

      let controls = [], targets = [], params = [], swaps = [];
      if (control_gates_type_0.includes(op_data.gate)) {
        controls = gate_qubits;
      } else if (control_gates_type_1.includes(op_data.gate)) {
        controls = gate_qubits.slice(0, -1);
        targets = gate_qubits.slice(-1);
      } else if (control_gates_type_2.includes(op_data.gate)) {
        controls = gate_qubits.slice(0, -2);
        targets = gate_qubits.slice(-2);
      } else if (swap_gates.includes(op_data.gate)) {
        swaps = gate_qubits;
      } else {
        targets = gate_qubits;
      }
      params = op_data.params.map(d => get_radian_names(d));

      let pulse_data = operation_data?.pulse_data?.[pulse_key];

      let op_meta_data = {
        original_circuit_id: config?.original_circuit_id,
        transpiled_circuit_id: config?.transpiled_circuit_id,
        unit_id: config?.unit_id,
        pulse_view_id: config?.pulse_view_id,
        layer_index: lcnt,
        operation_index: ocnt,
        operation: {
          gate: gate_name,
          qubits: op_data.qubits,
          qubit_index: gate_qubits,
          num_qubits: gate_qubits.length,
          num_clbits: op_data.clbits.length,
          clbits: op_data.clbits
        },
        original_layer_index: layer_match?.layer,
        original_operation_index: layer_match?.operation,
        duration,
        unit: gate_info?.gate_length?.unit,
        edges,
        edge_ids,
        match_color,
        gate_error,
        esp_qubit_wise: qubit_wise_esp_data[lcnt],
        esp_cumulative: cumul_esp_data[lcnt],
        pulse_data
      };
      let op = {
        type: "g",
        role: "op-layer-operation-group",
        id: `layer-${lcnt}--operation-${ocnt}--op-group`,
        _class: "op-layer-group on-machine",
        x: 0,
        y: 0,
        is_timed: true,
        duration,
        elem: [],
        data: op_meta_data
      };

      ops.data.unit = gate_info?.gate_length?.unit;


      // markings
      for (const qubit of op_data.qubits) {
        let node_pos = [node_bbox[qubit.index]?.cx, node_bbox[qubit.index]?.cy];
        if (controls.includes(qubit.index)) {
          op.elem.push({
            type: "rect",
            id: `layer-${lcnt}--operation-${ocnt}--gate-${op_data.gate}--qubit-${qubit.index}`,
            role: 'layer-op-gate-control',
            _class: 'layer-op-gate-control',
            width: 8,
            height: 8,
            x: node_pos[0] - 4,
            y: node_pos[1] + qubit_node_gap / 2 - 2,
            fill: match_color,
            "stroke-width": 1
          });
          op.elem.push({
            type: "click-wrap",
            id: `layer-${lcnt}--operation-${ocnt}--gate-${op_data.gate}--qubit-${qubit.index}--click-wrap`,
            role: 'machine-gate-click-wrap',
            width: 8,
            height: 8,
            x: node_pos[0] - 4,
            y: node_pos[1] + qubit_node_gap / 2 - 2,
            data: op_meta_data
          });

        } else if (targets.includes(qubit.index)) {
          let text = op_data.gate
          if (params.length > 0) {
            text += `(${params.join(",")})`
          }
          let op_mark_width = (text.length + 2) * 6;
          op.elem.push({
            type: "rect",
            id: `layer-${lcnt}--operation-${ocnt}--gate-${op_data.gate}--qubit-${qubit.index}`,
            role: 'layer-op-gate-target',
            _class: 'layer-op-gate-target',
            width: op_mark_width,
            height: qubit_node_gap * 0.8,
            x: node_pos[0] - (op_mark_width) / 2,
            y: node_pos[1] + qubit_node_gap / 2 - 3,
            "stroke-width": 1,
            fill: match_color
          });
          op.elem.push({
            type: "text",
            id: `layer-${lcnt}--operation-${ocnt}--gate-${op_data.gate}--qubit-${qubit.index}--marker`,
            role: 'layer-op-gate-target-marker',
            _class: 'layer-op-gate-target-marker',
            x: node_pos[0],
            y: node_pos[1] + qubit_node_gap - 4,
            "font-size": 12,
            "text-anchor": "middle",
            "alignment-baseline": "middle",
            fill: "white",
            text
          });
          op.elem.push({
            type: "click-wrap",
            id: `layer-${lcnt}--operation-${ocnt}--gate-${op_data.gate}--qubit-${qubit.index}--click-wrap`,
            role: 'machine-gate-click-wrap',
            width: op_mark_width,
            height: qubit_node_gap * 0.8,
            x: node_pos[0] - (op_mark_width) / 2,
            y: node_pos[1] + qubit_node_gap / 2 - 3,
            data: op_meta_data
          });
        } else if (swaps.includes(qubit.index)) {
          op.elem.push({
            type: "rect",
            id: `layer-${lcnt}--operation-${ocnt}--gate-${op_data.gate}--qubit-${qubit.index}`,
            role: 'layer-op-gate-swap',
            _class: 'layer-op-gate-swap',
            width: 12,
            height: 12,
            x: node_pos[0] - 6,
            y: node_pos[1] + qubit_node_wh / 3 - 6,
            fill: match_color,
            "stroke-width": 0
          });
          op.elem.push({
            type: "text",
            id: `layer-${lcnt}--operation-${ocnt}--gate-${op_data.gate}--qubit-${qubit.index}`,
            role: 'layer-op-gate-swap-marker',
            _class: 'layer-op-gate-swap-marker',
            "font-size": 12,
            x: node_pos[0] - 5,
            y: node_pos[1] + qubit_node_wh / 3 - 5,
            "text-anchor": "middle",
            "alignment-baseline": "middle",
            fill: "white",
            text: "×"
          });
          op.elem.push({
            type: "click-wrap",
            id: `layer-${lcnt}--operation-${ocnt}--gate-${op_data.gate}--qubit-${qubit.index}--click-wrap`,
            role: 'machine-gate-click-wrap',
            width: 12,
            height: 12,
            x: node_pos[0] - 6,
            y: node_pos[1] + qubit_node_wh / 3 - 6,
            data: op_meta_data
          });
        }
      }

      // edge information
      if (op_data.qubits.length > 0) {
        for (let i = 0; i < op_data.length; i++) {
          let qubit_a = op_data.qubits[i];
          for (let j = i + 1; j < op_data.length; j++) {
            let qubit_b = op_data.qubits[j];
            let ei = [qubit_a.index, qubit_b.index].toSorted().join(">");
            if (edge_dict[ei]) {
              op.data.edges.push(edge_dict[ei]);
            }
          }
        }
      }

      cummul_duration += total_duration;

      // gate error information 
      let gate_error_x = width + circuit_h_gap * 2;
      let gate_error_y = ocnt * 20 + padding + 16 + 64;
      if (gate_error !== undefined) {
        let esp_value = qubit_wise_esp_data[lcnt][qubit_rel_map[gate_qubits[0]]];
        let gate_error_g = {
          type: "g",
          role: "op-gate-error-group",
          id: `layer-${lcnt}--operation-${ocnt}--gate-error`,
          _class: "op-gate-error",
          x: gate_error_x,
          y: gate_error_y,
          elem: []
        };
        if (ocnt == 0) {
          ops.elem.push({
            x: gate_error_x,
            y: gate_error_y - 4,
            "text-anchor": "start",
            "alignment-baseline": "bottom",
            "font-weight": 700,
            type: "text",
            text: "ESP info"
          });
        }
        gate_error_g.elem.push({
          type: "rect",
          role: "op-gate-error-group-bar-wrap",
          id: `layer-${lcnt}--operation-${ocnt}--gate-error--bar-wrap`,
          _class: "op-gate-error-bar-wrap",
          x: 0,
          y: 0,
          width: meta_data_area_width - padding,
          height: gate_error_bar_thickness,
        })
        gate_error_g.elem.push({
          type: "rect",
          role: "op-gate-error-group-bar",
          id: `layer-${lcnt}--operation-${ocnt}--gate-error--bar`,
          _class: "op-gate-error-bar",
          x: 0,
          y: 0,
          width: (meta_data_area_width - padding) * (esp_value - error_cap) / (1 - error_cap),
          height: gate_error_bar_thickness,
          fill: config?.nodeColorScale((esp_value - error_cap) / (1 - error_cap))
        })
        gate_error_g.elem.push({
          type: "text",
          role: "op-gate-error-group-label",
          id: `layer-${lcnt}--operation-${ocnt}--gate-error--label`,
          _class: "op-gate-error-label",
          x: 2,
          y: 11,
          "font-size": 10,
          "text-anchor": "start",
          "alignment-baseline": "bottom",
          "fill": "white",
          text: op_data.gate + `(${gate_qubits.join(",")})` + ": " + esp_value.toString().slice(0, 7)
        });
        gate_error_g.elem.push({
          type: "click-wrap",
          role: "op-gate-error-group-click-wrap",
          id: `layer-${lcnt}--operation-${ocnt}--gate-error--click-wrap`,
          _class: "op-gate-error-click-wrap",
          x: meta_data_area_width - meta_bar_width,
          y: 2,
          width: (meta_bar_width - padding),
          height: gate_error_bar_thickness,
          data: {
            gate_error_info: {
              gate_error,
              layer: lcnt,
              operation: ocnt,
              qubits: gate_qubits,
              gate: op_data.gate,
              gate_duration: duration,
              duration_unit: gate_info?.gate_length?.unit,
              esp: esp_value
            }
          }
        })
        op.elem.push(gate_error_g);

        // height adjustment
        if (gate_error_y + gate_error_bar_thickness > height) {
          height = gate_error_y + gate_error_bar_thickness
        }
      }
      ops.elem.push(op);
      ocnt++;
    }

    layer_meta_g.elem.push({
      type: "text",
      x: 0,
      y: 28,
      "font-size": 12,
      "text-anchor": "start",
      "alignment-baseline": "bottom",
      text: `Duration: ${total_duration.toString().slice(0, 7)} (${ops.data.unit || 'ns'})`
    });


    layer_meta_g.elem.push({
      type: "text",
      x: 0,
      y: 42,
      "font-size": 12,
      "text-anchor": "start",
      "alignment-baseline": "bottom",
      text: `Cummulative: ${cummul_duration.toString().slice(0, 7)} (${ops.data.unit || 'ns'})`
    });

    ops.data.cummul_duration = cummul_duration;

    ops.elem.push(layer_meta_g);

    lcnt++;
    ops.is_timed = true;
    ops.duration = total_duration;
    operations.push(ops);
  }

  return {
    type: "svg",
    width: width + padding * 2 + meta_data_area_width + circuit_h_gap * 2,
    height: height + padding * 2 + title_area_height + circuit_v_gap,
    viewBox: [0, 0, width + padding * 4 + meta_data_area_width, height + padding * 2 + title_area_height + circuit_v_gap],
    groups: {
      machine
    },
    operations,
    bit_map: {
      qubit_rel_map,
      qubit_pos_map
    },
    meta_info: {
      cummul_duration
    }
  };
}

function get_edges(gate_info, edge_dict) {
  let edges = [], edge_ids = [];
  if (gate_info) {
    let qubits = gate_info.qubits;
    if (qubits.length > 0) {
      qubits = qubits.toSorted();
      for (let i = 0; i < qubits.length; i++) {
        for (let j = 0; j < qubits.length; j++) {
          let ei = qubits[i] + ">" + qubits[j]
          if (edge_dict[ei]) {
            edges.push([qubits[i], qubits[j]]);
            edge_ids.push(edge_dict[ei]);
          }
        }
      }
    }
  }
  return { edges, edge_ids };
}

function get_edge_xy(b1, b2) {
  let len = 9000000000, rec;

  if (b1 && b1.length > 0) {
    for (const ba1 of b1) {
      if (b2 && b2.length > 0) {
        for (const ba2 of b2) {
          let d = dist(ba1, ba2);
          if (d < len) {
            len = d;
            rec = [ba1, ba2];
          }
        }
      }
    }
  }
  return rec;
}

function dist(a, b) {
  return Math.sqrt(
    Math.pow(a[0] - b[0], 2) + Math.pow(a[1] - b[1], 2)
  );
}

function angle_btw(a, b) {
  let ang = Math.acos(
    dot(a, b) / (inner(a) * inner(b))
  );
  if (isNaN(ang)) {
    ang = Math.PI / 2
  }
  return (ang / Math.PI) * 180
}
function dot(a, b) {
  return (a[0] * b[0] + a[1] * b[1])
}
function inner(a) {
  return Math.sqrt(
    Math.pow(a[0], 2) + Math.pow(a[1], 2)
  )
}
function edge_dir(a, b) {
  if (a[0] <= b[0] && a[1] <= b[1]) return 1;
  else return -1
}

function bit_order_match(a, b) {
  return a.join(",") === b.join(",");
}