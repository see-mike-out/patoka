export const GetCircuitWriter = {
  type: "Function",
  key: "widgets_getCircuitWriter",
  title: "patoka.getCircuitWriter",
  def: {
    function: "patoka.getCircuitWriter",
    arguments: [{
      name: "backend",
      type: "BackendV2Type or AerSimulator",
      optional: true,
      default: "None",
      description: "A Qiskit Backend or Qiskit.Aer Simulator object."
    }],
    _return: [
      {
        name: "writer",
        type: "CircuitWriter",
        description: "a circuit writer instance."
      }
    ]
  },
  description: "Calls a <code>CircuitWriter</code> instance.",
  example: [
    "from patoka import getCircuitWriter",
    "from qiskit_aer import AerSimulator",
    "writer = getCircuitWriter(backend=AerSimulator())",
    "writer"
  ]
};

export const CircuitWriter = {
  type: "Class",
  key: "widget_classes_CircuitWriter",
  title: "patoka.CircuitWriter",
  def: {
    _class: "patoka.CircuitWriter",
  },
  anywidget_attributes: [{
    key: "machine",
    description: `Machine meta data (JSON string), obtained via <a href="https://github.com/see-mike-out/patoka/blob/main/src/patoka/machine_data_prep.py" target="_blank"><code>getMachineMetaInfo</code></a>.`
  }],
  attributes: [{
    key: "circ_code",
    description: "Circuit code (JSON string)"
  }],
  description: "A circuit writer interface object. Calling this object shows the interface on a Jupyter Notebook."
};