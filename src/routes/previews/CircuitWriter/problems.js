export const ProblemMap = {
  superposition: {
    name: "Superposition",
    key: "superposition",
    max_qubits: Infinity,
    params: undefined,
    n_params: 0,
  },
  superposition_probbed: {
    name: "Superposition with probability",
    key: "superposition_probbed",
    max_qubits: Infinity,
    params: undefined,
    n_params: 0,
    globals: [
      {
        key: "prob", name: "P(state = 0)", type: "number"
      }
    ],
    variables: {
      prob_value: (self) => self.globals?.prob,
      zero: (self) => 0,
      one: (self) => 1
    },
    constraints: [
      {
        key: "eligible_prob", range: ["prob_value", "zero", "one"], warning: "The probability should be between 0 and 1.",
        success: "The probability value is appropriate."
      }
    ]
  },
  entanglement: {
    name: "Entanglement (pair)",
    key: "entanglement",
    max_qubits: 2,
    params: undefined,
    n_params: 0,
  },
  group_entanglement: {
    name: "Entanglement (grouped)",
    key: "group_entanglement",
    max_qubits: Infinity,
    params: undefined,
    n_params: 0,
    needs_size: true,
    globals: [
      {
        key: "type", name: "Entagle type", type: "select", option: [
          { key: "full", name: "Full" },
          { key: "linear", name: "Linear" },
          { key: "circular", name: "Circular" }
        ]
      }
    ]
  },
  interference: {
    name: "Interference",
    key: "interference",
    max_qubits: Infinity,
    needs_size: true,
    n_params: 1,
    params: [{ key: "theta", name: "Theta", type: "radian" }]
  },
  QFT: {
    name: "Quantum Fourier Transform Circuit",
    key: "QFT",
    max_qubits: Infinity,
    needs_size: true,
    n_params: 0,
    params: undefined
  },
  BTT: {
    name: "Boolean Function Oracle",
    key: "BTT",
    max_qubits: Infinity,
    n_params: 0,
    params: undefined,
    needs_size: true,
    globals: [
      { key: "random_all", name: "Randomize all", type: "boolean" },
      { key: "boolean_expression", name: "Boolean expression", type: "bool_exp" }
    ],
    variables: {
      n_symbols: (self) => unique(self.globals?.boolean_expression?.match(/[a-zA-Z]/gi) || []).length,
      n_req_qubits: (self) => unique(self.globals?.boolean_expression?.match(/[a-zA-Z]/gi) || []).length + 1,
      n_qubits: (self) => (self.apply_to?.length || 0)
    },
    constraints: [
      {
        key: "match_symbol_req_qubit", match: ["n_req_qubits", "n_qubits"], warning: "Should have enough number of qubits (i.e., #symbols + 1).",
        success: "The right number of qubits are selected."
      }
    ]
  },
  SHOR_period: {
    name: "Shor's Alogrithm for Finding a Period (a^r mod N)",
    key: "SHOR_period",
    max_qubits: Infinity,
    qubit_registers: [
      "counter", "oracle"
    ],
    n_params: 2,
    params: [
      { key: "factor", name: "Base factor (a)", type: "number" },
      { key: "divider", name: "Divider (N)", type: "number" }
    ],
    variables: {
      factor: (self) => self.params?.factor,
      divider: (self) => self.params?.divider,
      oracle_size: (self) => (self.params?.divider || 0)?.toString(2).length,
      n_oracle_qubits: (self) => self.qubit_registers?.oracle?.apply_to?.length || 0,
      oracle_qubits: (self) => self.qubit_registers?.oracle?.apply_to || [],
      counter_qubits: (self) => self.qubit_registers?.counter?.apply_to || []
    },
    constraints: [
      {
        key: "factor_exist", exist: ["factor"], warning: "A factor must be provided.",
        success: "A factor is provided."
      },
      {
        key: "divider_exist", exist: ["divider"], warning: "A divider must be provided.",
        success: "A divider is provided."
      },
      {
        key: "oracle_size_match", geq: ["n_oracle_qubits", "oracle_size"], warning: "The number of qubits for oracle (divider) is not sufficient for the oracle.",
        success: "The right number of oracle qubits are selected.",
        auto_qubit_exempt: true
      },
      {
        key: "oracle_counter_separation", array_distinct: ["oracle_qubits", "counter_qubits"],
        warning: "The oracle (divider) and counter (base) should have different qubits.",
        success: "The oracle (divider) and counter (base) qubits are well-separated."
      }
    ]
  },
  BV: {
    name: "Bernstein-Vazirani algorithm (secret string search)",
    key: "BV",
    max_qubits: Infinity,
    qubit_registers: [
      "string", "store"
    ],
    n_params: 1,
    params: [
      { key: "string", name: "Bitstring to find", type: "string" }
    ],
    variables: {
      string: (self) => self.params?.string,
      string_size: (self) => self.params?.string?.length || 0,
      string_qubits: (self) => (self.qubit_registers?.string?.apply_to || []),
      string_qubit_size: (self) => (self.qubit_registers?.string?.apply_to || [])?.length,
      store_qubits: (self) => (self.qubit_registers?.store?.apply_to || []),
      store_qubit_size: (self) => (self.qubit_registers?.store?.apply_to || [])?.length
    },
    constraints: [
      {
        key: "string_exist", string_exist: ["string"], warning: "A secret bitstring to find must be provided.",
        success: "A secret bitstring is provided."
      },
      {
        key: "string_pattern", pattern: ["string", "^[01]+$"], warning: "A bitstring must consist of '0' and '1'.",
        success: "A proper bitstring is provided."
      },
      {
        key: "oracle_size_match", eq: ["string_size", "string_qubit_size"], warning: "The number of qubits for bitstring is not sufficient for the bitstring.",
        success: "The right number of bitstring qubits are selected.",
        auto_qubit_exempt: true
      },
      {
        key: "oracle_counter_separation", array_distinct: ["string_qubits", "store_qubits"],
        warning: "The bitstring and store should have different qubits.",
        success: "The bitstring and store qubits are well-separated."
      }
      //  SHORS_ORACLE_SIZE = len(np.binary_repr(SHORS_MOD))
    ]
  },
  qnn_input_angle: {
    name: "QNN Data Entry (angle encoding)",
    key: "qnn_input_angle",
    max_qubits: Infinity,
    n_params: "auto",
    needs_size: true,
    params_per_bit: [
      {
        key: "angle_dir", name: "Direction", type: "select", option: [
          { key: "rx", name: "X (0/1)" },
          { key: "ry", name: "Y (i)" },
          { key: "rz", name: "Z (+/-)" }
        ]
      },
      { key: "angle", name: "Angle", type: "number" }
    ],
  },
  qnn_weight_angle: {
    name: "QNN Weight Entry (angle encoding)",
    key: "qnn_weight_angle",
    max_qubits: Infinity,
    n_params: "auto",
    needs_size: true,
    params_per_bit: [
      {
        key: "angle_dir", name: "Direction", type: "select", option: [
          { key: "rx", name: "X (0/1)" },
          { key: "ry", name: "Y (i)" },
          { key: "rz", name: "Z (+/-)" }
        ]
      },
      { key: "angle", name: "Angle", type: "number" }
    ],
  },
  image_convolution_filters: {
    name: "Image Convolution Filters",
    key: "image_convolution_filters",
    max_qubits: Infinity,
    qubit_registers: [
      "ancilla", "image"
    ],
    n_params: 2,
    globals: [
      { key: "image_file", name: "Image file path", type: "string" },
      {
        key: "color_mode", name: "Color Mode", type: "select", option: [
          { key: "RGB", name: "RGB" },
          { key: "L", name: "Black/White" }
        ]
      },
      {
        key: "filter", name: "Filter", type: "select", option: [
          { key: "avg", name: "Average convolution" },
          { key: "sobel", name: "Sobel" },
          { key: "blur", name: "Gaussian Blur" }
        ]
      },
      {
        key: "sigma", name: "Gaussian Variance", type: "number"
      }
    ],
    variables: {
      image_file: (self) => self.globals?.image_file,
      filter: (self) => self.globals?.filter,
    },
    constraints: [
      {
        key: "image_exist", exist: ["image_file"], warning: "An image file path must be provided.",
        success: "An image file path is provided."
      },
      {
        key: "filter_exist", exist: ["filter"], warning: "A filter must be selected.",
        success: "A filter is selected."
      }
    ],
    notes: "This operation relies on the imeage size, so the qubits are automatically chosen."
  }
};

export const ProblemTypes = Object.keys(ProblemMap).map((k) => ProblemMap[k]);

function unique(arr) {
  return Array(...(new Set(arr)));
}

export function satisfyConstraint(constraint, op, vars, auto_qubit) {
  if (auto_qubit && constraint.auto_qubit_exempt) return true;
  if (constraint.match) {
    let match_values = constraint.match.map((d) => (vars[d].constructor.name === "Function" ? vars[d](op) : vars[d]));
    return match_values.every((a) => a === match_values[0]);
  } else if (constraint.eq) {
    let match_values = constraint.eq.map((d) => (vars[d].constructor.name === "Function" ? vars[d](op) : vars[d]));
    return match_values[0] == match_values[1];
  } else if (constraint.geq) {
    let match_values = constraint.geq.map((d) => (vars[d].constructor.name === "Function" ? vars[d](op) : vars[d]));
    return match_values[0] >= match_values[1];
  } else if (constraint.leq) {
    let match_values = constraint.leq.map((d) => (vars[d].constructor.name === "Function" ? vars[d](op) : vars[d]));
    return match_values[0] <= match_values[1];
  } else if (constraint.gt) {
    let match_values = constraint.qt.map((d) => (vars[d].constructor.name === "Function" ? vars[d](op) : vars[d]));
    return match_values[0] > match_values[1];
  } else if (constraint.lt) {
    let match_values = constraint.lt.map((d) => (vars[d].constructor.name === "Function" ? vars[d](op) : vars[d]));
    return match_values[0] < match_values[1];
  } else if (constraint.range) {
    let match_values = constraint.range.map((d) => (vars[d].constructor.name === "Function" ? vars[d](op) : vars[d]));
    return match_values[0] >= match_values[1] && match_values[0] <= match_values[2];
  } else if (constraint.rangex) {
    let match_values = constraint.rangex.map((d) => (vars[d].constructor.name === "Function" ? vars[d](op) : vars[d]));
    return match_values[0] > match_values[1] && match_values[0] < match_values[2];
  } else if (constraint.array_distinct) {
    let match_values = constraint.array_distinct.map((d) => (vars[d].constructor.name === "Function" ? vars[d](op) : vars[d]));
    return match_values[0].every((a) => !match_values[1].includes(a));
  } else if (constraint.exist) {
    let match_values = constraint.exist.map((d) => (vars[d].constructor.name === "Function" ? vars[d](op) : vars[d]));
    return match_values.every((a) => a != undefined);
  } else if (constraint.string_exist) {
    let match_values = constraint.string_exist.map((d) => (vars[d].constructor.name === "Function" ? vars[d](op) : vars[d]));
    return match_values.every((a) => a != undefined && a.length > 0);
  } else if (constraint.pattern) {
    let match_value = vars[constraint.pattern[0]](op), match_pattern = constraint.pattern[1];
    let pattern_re = new RegExp(match_pattern);
    return match_value?.match(pattern_re) != null
  }
}