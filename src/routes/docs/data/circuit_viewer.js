export const GetCircuitViewer = {
  type: "Function",
  key: "widgets_getCircuitViewer",
  title: "widgets.getCircuitViewer",
  def: {
    function: "widgets.getCircuitViewer",
    arguments: [
      {
        name: "circuit",
        type: "QuantumCircuit",
        optional: false,
        description: "A Qiskit circuit."
      }, {
        name: "backends",
        type: "[BackendV2Type or AerSimulator]",
        optional: false,
        description: "A list of Qiskit backend objects."
      }, {
        name: "transpile_params",
        type: "[TranspileParam]",
        optional: true,
        default: "[]",
        description: "Transpilation parameters."
      }
    ],
    _return: [
      {
        name: "viewer",
        type: "CircuitViewer",
        description: "a circuit viewer instance."
      }
    ]
  },
  description: "Calls a <code>CircuitViewer</code> instance.",
  example: [
    "from patoka.widgets import getCircuitViewer",
    "from patoka.transpile_params import TranspileParam",
    "from qiskit_ibm_runtime.fake_provider import FakeVigoV2",
    "from qiskit import QuantumCircuit",
    "qc = QuantumCircuit(3,3)",
    "# ... some circuit code",
    "backend = qiskit_aer.AerSimulator.from_backend(FakeVigoV2())",
    "transpile_params = TranspileParam(optimization_level=1)",
    "viewer = getCircuitViewer(qc, [backend], transpile_params=[transpile_params])",
    "viewer"
  ]
};

export const CircuitViewer = {
  type: "Class",
  key: "widget_classes_CircuitViewer",
  title: "widgets_classes.CircuitViewer",
  def: {
    _class: "widgets_classes.CircuitViewer",
  },
  anywidget_attributes: [{
    key: "circ",
    description: "Circuit code (JSON string)"
  }],
  description: "Circuit viewer instance."
};

export const TransplieParam = {
  key: "transpile_params_TranspileParam",
  title: "transpile_params.TranspileParam",
  def: {
    _class: "transpile_params.TranspileParam"
  },
  description: `A wrapper class for transpilation parameters (mainly to prevent errors). For more details, refer to <a href="https://docs.quantum.ibm.com/api/qiskit/qiskit.transpiler.PassManagerConfig" target="_blank">the Qiskit documentation.</a>`,
  example: [
    "transpile_params = TranspileParam(optimization_level=1)"
  ]
}