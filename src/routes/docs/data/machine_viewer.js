export const GetMachineViewer = {
  key: "widgets_getMachineViewer",
  title: "widgets.getMachineViewer",
  def: {
    function: "widgets.getMachineViewer",
    arguments: [{
      name: "backend",
      type: "[BackendV2Type]",
      optional: false,
      description: "A Qiskit Backend (V2). A Simulator may not work."
    }, {
      name: "times",
      type: "[datetime.datetime]",
      optional: true,
      default: "[]",
      description: "A list of <code>datetime</code> objects for retrieving historical parameter values."
    }],
    _return: [
      {
        name: "viewer",
        type: "MachineViewer",
        description: "a machine explorer/viewer instance."
      }
    ]
  },
  description: "Calls a <code>MachineViewer</code> instance. To use this, a Qiskit access token must be provided.",
  example: [
    "from patoka.widgets import getMachineViewer",
    "from qiskit_ibm_runtime import QiskitRuntimeService",
    "import os",
    "from datetime import datetime as dt",
    `token = os.environ["ibm_token"]`,
    `QiskitRuntimeService.save_account(channel="ibm_quantum", token=token, overwrite=True)`,
    `service = QiskitRuntimeService(channel="ibm_quantum")`,
    "",
    "avail_backends = service.backends()",
    "back1 = avail_backends[0]",
    "times_to_check=[dt(2024, 7, 1), dt(2024, 6, 1)]",
    "viewer = getMachineViewer(back1, times=times_to_check)",
    "viewer"
  ]
};

export const MachineViewer = {
  key: "widget_classes_MachineViewer",
  title: "widgets_classes.MachineViewer",
  def: {
    _class: "widgets_classes.MachineViewer",
  },
  anywidget_attributes: [{
    key: "machine_data",
    description: `Machine data (JSON string) obtained via <a href="https://github.com/see-mike-out/patoka/blob/main/src/patoka/machine_data_prep.py" target="_blank"><code>getMachineInformation</code></a>`
  }],
  attributes: [{
    key: "code",
    description: "Python code generated from the machine viewer."
  }],
  description: "Machine explorer/viewer instance."
}