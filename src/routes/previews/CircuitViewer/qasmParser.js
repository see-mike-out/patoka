export function parseQASM(qasm_string) {
  let parsed = {
      circuit: [],
      extensions: {},
      named_qubits: {},
      custom_gates: {}
  };
  let lines = qasm_string.split("\n");
  let ci, si;
  let gate_expr_re;
  let moment_count = 0, moment_count_ext = 0, counter = 0;
  let gate_parse_mode = false, curr_custom_gate;
  for (const line of lines) {
      if (line.startsWith("OPENQASM") || line.startsWith("include")) continue;
      else {
          if (line.startsWith("qubit[")) {
              // for qubits
              let strp = line.match(/qubit\[(\d+)\]\s+([^;]+);/);
              parsed.n_qubits = parseInt(strp[1]);
              parsed.circuit_index = strp[2];
              ci = parsed.circuit_index;
          } else if (line.startsWith("bit[")) {
              // for classical bits
              let strp = line.match(/bit\[(\d+)\]\s+([^;]+);/);
              parsed.n_bits = parseInt(strp[1]);
              parsed.classical_index = strp[2];
              si = parsed.classical_index;
          } else if (line.startsWith("map ")) {
              // for named qubits
              // map q[0], Control
              let elems = line.split(" ");
              let bi = (elems[1].trim().match(/\d+/))
              parsed.named_qubits[bi] = elems[2].replace(",", "").trim();
          } else if (line.includes("gate ")) {
              // custom gates treatment
              let cg_strp = line.match(/gate\s([a-zA-Z\d_]+)/);
              if (cg_strp) {
                  curr_custom_gate = cg_strp[1]
                  parsed.custom_gates[curr_custom_gate] = {};
                  gate_parse_mode = true;

                  let io_strp = line.match(/\([^\)]+\)/);
                  let ios = io_strp ? io_strp[0].replace(/[\(\)]/gi, "") : undefined; 
                  if (ios) parsed.custom_gates[curr_custom_gate].io = ios.split(/,\s+/);
                  let io_count = parsed.custom_gates[curr_custom_gate].io?.length || 0;
                  let gate_def_str = line.match(/gate\s+[a-zA-Z_\d]+(\([a-zA-Z_\d,\s]+\))?/);
                  
                  let subgate_expr = gate_def_str ? line.replace(gate_def_str[0], "") : "";
                  let subgate_strp = subgate_expr.trim().split(/\s+/).slice(0, -1);
                  let subgates = subgate_strp.map(d => d.trim().replace(",", ""));
                  parsed.custom_gates[curr_custom_gate].subgates = [];
              }
          } else if (line === "}" && gate_parse_mode) {
              gate_parse_mode = false;
              curr_custom_gate = undefined;
          } else if (gate_parse_mode) {
              let l = line.trim().split(/\s+/);
              let gate_expr = line.trim().match(/[a-zA-Z_\d]+(\([\-\.\/a-zA-Z_\d,\s]+\))?/);
              let gate = gate_expr?.[0] || "", subgate_names = line.trim().replace(gate, "").replace(";", "").trim().split(/,\s+/);
              let params_strp = gate.match(/\(([^\)]+)\)/);
              let params = params_strp ? params_strp[1].split(/,\s+/).map(pf) : undefined;
              if (params) gate = gate.match(/^[a-zA-Z_\d]+/)[0]
              let control, target;
              if (controlGates.includes(gate)) {
                  control = subgate_names.slice(0, -1);
                  target = subgate_names.slice(-1);
              }
              parsed.custom_gates[curr_custom_gate].subgates.push({ gate, qubits: subgate_names, control, target, params });
          }
          // non-unitary gates
          // barrier()	Barrier --> generic parser
          // delay()	Delay --> generic parser
          // initialize()	Initialize --> should be as same as state_preparation, but Qiskit to QASM3 is not supported.
          // reset()	Reset --> generic parser
          // store()	Store --> can't see an example case of this... (todo)
          else if (line.includes(" = measure")) {
              // measure()	Measure
              let bits_strp = line.match(new RegExp(`${si}\\[(\\d+)\\]`, "g"));
              let classical_bits = [];
              for (const bit of bits_strp) {
                  let bi = bit.match(/\d+/);
                  classical_bits.push(parseInt(bi[0]));
              }
              let qubits_strp = line.match(new RegExp(`${ci}\\[(\\d+)\\]`, "g"));
              let qubits = [];
              for (const qubit of qubits_strp) {
                  let bi = qubit.match(/\d+/);
                  qubits.push(parseInt(bi[0]));
              }
              parsed.circuit.push({ gate: "measure", qubits, classical_bits, order: counter, is_unitary: false, is_custom: false, is_extended: false });
          } 
          // regular gates
          else if (line.length > 0) {
              let gate_strp = line.match(/^([a-zA-Z_\d\[\]]+)/);
              if(!gate_strp) alert(line)
              let gate = gate_strp[0];
              let params_strp = line.match(/\([^\)]+\)/);
              let params = params_strp ? params_strp[0].replace(/[\(\)]/gi, "").split(/,\s+/gi).map(pf) : undefined; 
              let qubits_strp = line.match(new RegExp(`${ci}\\[(\\d+)\\]`, "g"));
              let qubits = [];
              if (qubits_strp?.length > 0) {
                  for (const qubit of qubits_strp) {
                      let bi = qubit.match(/\d+/);
                      qubits.push(parseInt(bi[0]));
                  }
                  if (parsed.custom_gates[gate]) {
                      let gate_class = gate.split("_").slice(0, -1).join("_");
                      if (!gate_class) gate_class = gate;
                      let control, target;
                      if (["mcphase", "ccz"].includes(gate_class)) {
                          control = qubits.slice(0, -1);
                          target = qubits.slice(-1);
                      }
                      parsed.circuit.push({ gate, control, target, qubits, params, gate_class, order: counter, is_unitary: true, is_custom: true, is_extended: false });
                  } else {
                      let { surface, deep } = parseGate(gate, qubits, params);
                      surface.forEach((c, i) => c.order = counter + i);
                      parsed.circuit.push(...surface);
                      if (deep) parsed.extensions[counter] = deep;
                  }
              }
          }
      }
      counter = parsed.circuit.length;
  }
  // qubit_list
  parsed.qubits = [];
  for (let i = 0; i < parsed.n_qubits; i++) {
      parsed.qubits.push(i);
  }
  // calculate moments;
  let moment_counter_surface = {}, moment_counter_ext = {};
  let prev_surface, prev_ext, prev_gate;
  for (const step of parsed.circuit) {
      let qubits = step.qubits;
      let max_count_surface = 0, max_count_ext = 0;
      for (const qubit of qubits) {
          if (moment_counter_surface[qubit] === undefined) {
              moment_counter_surface[qubit] = 0
              moment_counter_ext[qubit] = 0
          }
          max_count_surface = Math.max(max_count_surface, moment_counter_surface[qubit]);
          max_count_ext = Math.max(max_count_ext, moment_counter_ext[qubit]);
      }
      let total_extension_length = getExtensionMoments(parsed.custom_gates, step.gate);
      if (prev_gate === "measure" && step.gate === "measure") {
          prev_surface = max_count_surface;
          prev_ext = max_count_ext;
          prev_surface = Math.max(moment_count, max_count_surface);
          prev_ext = Math.max(moment_count_ext, max_count_ext);
      } else {
          prev_surface = max_count_surface;
          prev_ext = max_count_ext;
      }
      max_count_surface = prev_surface + 1;
      max_count_ext = prev_ext + total_extension_length;
      step.moment = max_count_surface;
      step.moment_previous = prev_surface;
      step.moment_extended = max_count_ext;
      step.moment_extended_previous = prev_ext;
      step.extension_length = total_extension_length;
      for (const qubit of qubits) {
          moment_counter_surface[qubit] = max_count_surface;
          moment_counter_ext[qubit] = max_count_ext;
      }
      moment_count = Math.max(moment_count, max_count_surface);
      moment_count_ext = Math.max(moment_count_ext, max_count_ext);
      prev_gate = step.gate;
  }

  parsed.moments = [];
  for (let i = 0; i < moment_count; i++) {
      parsed.moments.push(parsed.circuit.filter((d) => d.moment == i+1));
  }
  parsed.n_moments = moment_count;
  parsed.n_moments_extended = moment_count_ext;
  return parsed;
}

const singleLengthGates = ["h", "id", "p", "r", "rx", "ry", "rz", "s", "sdg", "swap", "sx", "t", "tdg", "U", "x", "y", "z",
                         "rcccx", "cccx", "rccx", "ccx", "cswap",
                         "ch", "cp", "crx", "cry", "crz", "cu", "cx", "cy", "cz",
                         "reset", "barrier", "delay"];

const controlGates = ["rcccx", "cccx", "rccx", "ccx", "cswap", "ch", "cp", "crx", "cry", "crz", "cu", "cx", "cy", "cz"];

function parseGate(gate, qubits, params) {
  let surface = [], deep;
  if (gate === "dcx") {
      // dcx()	DCXGate
      surface = [
          { gate: "dcx", qubits: [qubits[0], qubits[1]], is_custom: false, is_unitary: true, is_extended: true }
      ];
      deep = [
          { gate: "cx", control: [qubits[0]], target: [qubits[1]], qubits: [qubits[0], qubits[1]], is_custom: false, is_unitary: true },
          { gate: "cx", control: [qubits[1]], target: [qubits[0]], qubits: [qubits[0], qubits[1]], is_custom: false, is_unitary: true }
      ];
  } else if (gate === "ecr") { 
      // ecr()	ECRGate
      surface = [
          { gate: "ecr", qubits: [qubits[0], qubits[1]], is_custom: false, is_unitary: true, is_extended: true }
      ];
      deep = [
          { gate: "rzx", param: ["pi/4"], qubits: [qubits[0], qubits[1]], is_custom: false, is_unitary: true },
          { gate: "rx", param: ["pi"], qubits: [qubits[0]], is_custom: false, is_unitary: true },
          { gate: "rzx", param: ["pi/4"], qubits: [qubits[0], qubits[1]], is_custom: false, is_unitary: true },
      ];
  } else if (gate === "iswap") {
      // iswap()	iSwapGate
      surface = [ 
          { gate, qubits, is_custom: false, is_unitary: true, is_extended: true } 
      ];
      deep = [
          { gate: "s", qubits: [qubits[0]], is_custom: false, is_unitary: true },
          { gate: "s", qubits: [qubits[1]], is_custom: false, is_unitary: true },
          { gate: "h", qubits: [qubits[0]], is_custom: false, is_unitary: true },
          { gate: "cx", control: [qubits[0]], target: [qubits[1]], qubits: [qubits[0], qubits[1]], is_custom: false, is_unitary: true },
          { gate: "cx", control: [qubits[1]], target: [qubits[0]], qubits: [qubits[0], qubits[1]], is_custom: false, is_unitary: true },
          { gate: "h", qubits: [qubits[1]], is_custom: false, is_unitary: true },
      ];
  } else if (["h", "id", "p", "r", "rx", "ry", "rz", "s", "sdg", "swap", "sx", "t", "tdg", "U", "x", "y", "z", "reset"].includes(gate)) {
      // h()	HGate
      // id()	IGate
      // p()	PhaseGate
      // r()	RGate
      // rx()	RXGate
      // ry()	RYGate
      // rz()	RZGate
      // s()	SGate
      // sdg()	SdgGate
      // swap()	SwapGate 
      // sx()	SXGate
      // t()	TGate
      // tdg()	TdgGate
      // u()	UGate
      // x()	XGate
      // y()	YGate
      // z()	ZGate
      // reset()	Reset 
      surface = [ 
          { gate, params, qubits, is_custom: false, is_unitary: gate !== "reset" } 
      ];
  } else if (gate === "rcccx" || gate === "cccx") {
      // rcccx()	RC3XGate
      surface = [ 
          { gate, control: [qubits[0], qubits[1], qubits[2]], target: [qubits[3]], qubits, is_custom: false, is_unitary: true, is_extended: false } 
      ];
  } else if (gate === "rccx" || gate === "ccx") {
      // rccx()	RCCXGate
      // ccx()	CCXGate
      surface = [ 
          { gate, control: [qubits[0], qubits[1]], target: [qubits[2]], qubits, is_custom: false, is_unitary: true, is_extended: false } 
      ];
  } else if (["ch", "cp", "crx", "cry", "crz", "cu", "cx", "cy", "cz"].includes(gate)) {
      // ch()	CHGate
      // cp()	CPhaseGate
      // crx()	CRXGate
      // cry()	CRYGate
      // crz()	CRZGate
      // cu()	CUGate
      // cx()	CXGate
      // cy()	CYGate
      // cz()	CZGate
      surface = [ 
          { gate, control: [qubits[0]], target: [qubits[1]], qubits, params, is_custom: false, is_unitary: true, is_extended: false } 
      ];
  } else if (gate === "cswap") {
      // cswap()	CSwapGate
      surface = [ 
          { gate, control: [qubits[0]], target: [qubits[1], qubits[2]], qubits, is_custom: false, is_unitary: true, is_extended: false } 
      ];
  } else if (gate === "barrier") {
      // barrier()	Barrier
      surface = [ 
          { gate, params, qubits, is_custom: false, is_unitary: false, is_extended: false } 
      ];
  } else if (gate.startsWith("delay[")) {
      // delay()	Delay
      let delay = gate.match(/delay\[([^\]]+)\]/)?.[1];
      surface = [ 
          { gate: "delay", params: [delay], qubits, is_custom: false, is_unitary: false, is_extended: false } 
      ];
  }
  // other gates (explanation)
  // ms()	MSGate -> deprecated
  // pauli()	PauliGate -> custom
  // prepare_state()	StatePreparation -> custom
  // rv()	RVGate -> custom
  // rxx()	RXXGate -> custom
  // ryy()	RYYGate -> custom
  // rzx()	RZXGate -> custom
  // rzz()	RZZGate -> custom
  // sxdg()	SXdgGate -> custom
  // unitary()	UnitaryGate ---->>> not supported by Qiskit QASM3, yet
  // ccz()	CCZGate -> custom
  // cs()	CSGate -> custom
  // csdg()	CSdgGate -> custom
  // csx()	CSXGate -> custom
  // mcp()	PhaseGate -> custom
  // mcrx()	RXGate -> custom
  // mcry()	RYGate -> custom
  // mcrz()	RZGate ---->>> not supported by Qiskit QASM3, yet
  // mcx()	XGate -> custom
  return { surface, deep };
}

function getExtensionMoments(custom, gate) {
  if (custom[gate]) {
      let moment_counter_surface = {}, moment_counter_ext = {}, total_moment = 0;
      let prev_surface, prev_ext;
      for (const substep of custom[gate].subgates) {
          let qubits = substep.qubits;
          let max_count_surface = 0, max_count_ext = 0;
          for (const qubit of qubits) {
              if (moment_counter_surface[qubit] === undefined) {
                  moment_counter_surface[qubit] = 0
                  moment_counter_ext[qubit] = 0
              }
              max_count_surface = Math.max(max_count_surface, moment_counter_surface[qubit]);
              max_count_ext = Math.max(max_count_ext, moment_counter_ext[qubit]);
          }
          prev_surface = max_count_surface;
          prev_ext = max_count_ext;
          max_count_surface += 1;
          let total_extension_length = getExtensionMoments(custom, substep.gate);
          max_count_ext += total_extension_length;
          substep.moment = max_count_surface;
          substep.moment_previous = prev_surface;
          substep.moment_extended = max_count_ext;
          substep.moment_extended_previous = prev_ext;
          substep.extension_length = total_extension_length;
          for (const qubit of qubits) {
              moment_counter_surface[qubit] = max_count_surface;
              moment_counter_ext[qubit] = max_count_ext;
          }
          total_moment = Math.max(total_moment, max_count_ext)
      }
      return total_moment;
  } else return 1;
}

let pf = (d) => isNaN(d) ? d : parseFloat(d)