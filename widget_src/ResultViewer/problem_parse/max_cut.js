import { forceSimulation, forceLink, forceManyBody } from 'd3';
const padding = 10;
const colors = ['#00796B', '#512DA8']
// from: https://learning.quantum.ibm.com/tutorial/quantum-approximate-optimization-algorithm#step-3-execute-using-qiskit-primitives

export function parseMaxCutProblem(counts, config, additionals) {
  const graph = JSON.parse(additionals?.graph_design ?? 'null');
  const hamiltonian = additionals?.hamiltonian ?? null;
  const final_params = additionals?.final_params ?? null;

  if (graph == null || hamiltonian == null) {
    console.warn()
    return {
      warning: (graph == null ? 'Graph is not provided. ' + `To provide, use JobData.setAdditionals('graph_design', rx.node_link_json(#YOUR_GRAPH#))` : '')
        + (hamiltonian == null ? 'Hamiltonian not provided. ' : '') + `To provide, use JobData.setAdditionals('hamiltonian', #YOUR_HAMILTONIAN#.to_list()).`
    };
  }

  const links = graph.links.map(d => ({ ...d }));
  const nodes = graph.nodes.map(d => ({ ...d }));
  const scale_factor = Math.sqrt(nodes.length);
  const width = Math.round(scale_factor * 100), height = width;

  forceSimulation(nodes)
    .force("charge", forceManyBody().strength(-30))
    .force("link", forceLink(links).id(d => d.id).strength(1).distance(20).iterations(10));

  const edge_group = {
    type: "g",
    width,
    height,
    x: padding,
    y: padding,
    elem: links.map((link) => {
      return {
        type: "line",
        x1: width / 2 + link.source.x * scale_factor,
        x2: width / 2 + link.target.x * scale_factor,
        y1: height / 2 + link.source.y * scale_factor,
        y2: height / 2 + link.target.y * scale_factor,
        stroke: "#454545",
        'stroke-width': 2,
        data: {
          source: link.source.id,
          target: link.target.id
        }
      }
    })
  };
  const node_group = {
    type: "g",
    id: "max-cut-edge-group",
    width,
    height,
    x: padding,
    y: padding,
    elem: nodes.map((node, i) => {
      return {
        type: "g",
        id: `max-cut-edge-group-${i}`,
        x: width / 2 + node.x * scale_factor,
        y: height / 2 + node.y * scale_factor,
        elem: [{
          type: "circle",
          cx: 10 / 2,
          cy: 10 / 2,
          r: 10,
          stroke: "#454545",
          'stroke-width': 2,
          fill: '#ffffff'
        }, {
          type: "text",
          x: 10 / 2,
          y: 10 / 2 + 1,
          "text-anchor": "middle",
          "alignment-baseline": "middle",
          'font-size': 12,
          fill: '#ffffff',
          text: i
        }],
        data: {
          node: i
        }
      }
    })
  };

  let count_tuple = Object.keys(counts).map((k) => [k, counts[k]]).toSorted((a, b) => b[1] - a[1])
  let graph_layout = {
    type: "svg",
    width: width + padding * 2,
    height: height + padding * 2,
    viewBox: [0, 0, width + padding * 2, height + padding * 2],
    groups: {
      edge_group,
      node_group
    }
  };

  let packedPauliZs = getPauliZs(hamiltonian).map(h => packBitsLittle(h));
  let hamiltonian_coefs = hamiltonian.map(d => ImagineFromString(d[1]))
  let min_cost = 1000, min_solution = [];
  for (const tup of count_tuple) {
    let bit_key = tup[0], count = tup[1];
    let integer_key = parseInt(bit_key, 2);
    let eval_value = evaluateHamiltonian(integer_key, packedPauliZs, hamiltonian_coefs);
    if (eval_value.real < min_cost) {
      min_cost = eval_value.real
      let value = evaluateSolution(bit_key, graph.links);
      let cut = get_cut(bit_key)
      min_solution = [{ bit_key, integer_key, count, value, cost: eval_value.real, cut }]
    } else if (eval_value.real == min_cost) {
      let value = evaluateSolution(bit_key, graph.links);
      let cut = get_cut(bit_key)
      min_solution.push({ bit_key, integer_key, count, value, cost: eval_value.real, cut });
    }
  }
  let plan = min_solution.map((meta, si) => {
    let layout = JSON.parse(JSON.stringify(graph_layout));
    let n_cuts = 0;
    layout.groups.edge_group.id = `max-cut-edge-group-${si}`;
    layout.groups.edge_group.elem.forEach((edge_item) => {
      if (in_same_cut(edge_item.data.source, edge_item.data.target, meta.cut) !== null) {
        edge_item.data.cut_edge = false
      } else {
        edge_item['stroke-dasharray'] = '5,5';
        edge_item.stroke = '#FF9800';
        edge_item.data.cut_edge = true
        n_cuts += 1;
      }
    });

    layout.groups.node_group.id = `max-cut-node-group-${si}`;
    layout.groups.node_group.elem.forEach((node_item, ni) => {
      node_item.id = `max-cut-node-group-${si}-${ni}`;
      let group = in_which_cut(node_item.data.node, meta.cut);
      node_item.data.group = group;
      node_item.elem[0].fill = colors[group];
    })
    meta.n_cuts = n_cuts;
    return { meta, layout };
  })
  return plan;
}

// eval
function evaluateHamiltonian(integer_key, packedPauliZs, coefs) {
  let size = Math.max(...packedPauliZs.map(d => d.length));
  let stateBytes = to_bytes_little(integer_key, size)
  let and_oped = packedPauliZs.map(d => bitwiseAndArray(d, stateBytes))
  let reduced = bitwiseXorReduce(and_oped)
  let parity = reduced.map(d => getParityValue(d));
  let mul = coefs.map((c, i) => c.multiply(parity[i]))
  let summed = mul.reduce((acc, cur) => acc.add(cur), new Imagine(0, 0));
  return summed
}

function evaluateSolution(bitstring, edges) {
  let x = bitstring.split('').map(d => parseInt(d));
  let value = 0
  for (const edge of edges) {
    let u = edge.source, v = edge.target;
    value += x[u] * (1 - x[v]) + x[v] * (1 - x[u]);
  }
  return value;
}

function get_cut(bitstring) {
  let x = bitstring.split('');
  let cuts = [[], []];
  for (let i = 0; i < x.length; i++) {
    if (x[i] === '0') cuts[0].push(i)
    else cuts[1].push(i)
  }
  return cuts;
}

function in_same_cut(node0, node1, cuts) {
  for (let i = 0; i < cuts.length; i++) {
    let cut = cuts[i]
    if (cut.includes(node0) && cut.includes(node1)) return i
  }
  return null;
}

function in_which_cut(node, cuts) {
  for (let i = 0; i < cuts.length; i++) {
    let cut = cuts[i]
    if (cut.includes(node)) return i
  }
  return null;
}

// math utils
function getParityValue(i) {
  if (i.toString(2).split('').filter(d => d == '1').length % 2 == 1) return new Imagine(-1, 0);
  else return new Imagine(1, 0);
}
function bitwiseAndArray(arr1, arr2) {
  const result = [];
  for (let i = 0; i < arr1.length; i++) {
    result.push(arr1[i] & arr2[i]);
  }
  return result;
}

function bitwiseXorReduce(arr) {
  return arr.map(d => d.reduce((acc, cur) => acc ^ cur, 0));
}


function to_bytes_little(value, byteLength, byteOrder = 'big', signed = false) {
  // adapted from Gemini's output for the prompt: "javascript equivalent for python's to_byte function?"
  if (!Number.isInteger(value)) {
    throw new TypeError('Value must be an integer.');
  }

  if (!Number.isInteger(byteLength) || byteLength <= 0) {
    throw new TypeError('Byte length must be a positive integer.');
  }

  if (byteOrder !== 'big' && byteOrder !== 'little') {
    throw new TypeError('Byte order must be "big" or "little".');
  }

  const result = new Uint8Array(byteLength);

  if (signed) {
    const maxValue = 2 ** (byteLength * 8 - 1) - 1;
    const minValue = -(2 ** (byteLength * 8 - 1));

    if (value > maxValue || value < minValue) {
      throw new RangeError(`Value out of range for signed ${byteLength}-byte integer.`);
    }

    if (value < 0) {
      value = 2 ** (byteLength * 8) + value; // Two's complement for negative numbers
    }
  } else {
    const maxValue = 2 ** (byteLength * 8) - 1;
    if (value > maxValue || value < 0) {
      throw new RangeError(`Value out of range for unsigned ${byteLength}-byte integer.`);
    }
  }

  for (let i = 0; i < byteLength; i++) {
    const byteIndex = byteOrder === 'big' ? byteLength - 1 - i : i;
    result[byteIndex] = value & 0xff;
    value >>= 8;
  }

  return result;
}

function packBitsLittle(list) {
  // adapted from Gemini's output for the prompt: "can you make a javascript equivalent for np.packbits with little bit order?"
  let output = [];
  let curByte = 0;
  let bitIndex = 0;

  for (let i = 0; i < list.length; i++) {
    const bit = list[i] ? 1 : 0;

    // Set bit at bitIndex
    if (bit === 1) {
      curByte |= (1 << bitIndex);
    }

    bitIndex++;

    if (bitIndex === 8) {
      output.push(curByte);
      curByte = 0;
      bitIndex = 0;
    }
  }

  // Handle remaining bits
  if (bitIndex > 0) {
    output.push(curByte);
  }

  return output;
}

function getPauliZs(hamiltonian) {
  return hamiltonian.map(row => row[0].split('').map(d => d == 'Z').reverse());
}

class Imagine {
  constructor(i, j) {
    this.real = i;
    this.imag = j;
  }
  multiply(n) {
    return new Imagine(
      this.real * n.real - this.imag * n.imag,
      this.real * n.imag + this.imag * n.real
    )
  }
  add(n) {
    return new Imagine(
      this.real + n.real,
      this.imag + n.imag
    )
  }
}

const rexImg = /\s*([\+\-])?([\d]+\.[\d]+)\s*([\+\-])\s*([\d]+\.[\d]+)j\s*/
function ImagineFromString(s) {
  let m = s.match(rexImg);
  if (m) {
    let sr = m[1], nr = m[2], si = m[3], ni = m[4];
    return new Imagine(parseFloat((sr ? sr : '') + nr), parseFloat(si + ni))
  }
  return null;
}