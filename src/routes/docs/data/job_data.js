export const JobOutputData = {
  type: "Class",
  key: "job_output_data_JobOutputData",
  title: "patoka.JobOutputData",
  def: {
    _class: "patoka.JobOutputData",
  },
  methods: [
    {
      function: "toJSON",
      arguments: [],
      description: `Converts the data to the JSON format for saving. See <a href="#process_job_data_processJobData"><code>processJobData</code></a> for an example use.`,
      _return: [
        {
          name: "data",
          type: "JSON",
          description: "job output data in the JSON format."
        }
      ]
    }, {
      function: "streamJSON",
      arguments: [{
        name: "viewer",
        type: "ResultViewer",
        optional: false,
        description: "A <code>ResultViewer</code> instance."
      }],
      description: `Streams the data to a <code>ResultViewer</code> instance. See <a href="#widgets_getResultViewer"><code>getResultViewer</code></a> for an example use.`,
      _return: []
    }
  ],
}, ProcessJobData = {
  type: "Function",
  key: "process_job_data_processJobData",
  title: "patoka.processJobData",
  def: {
    function: "patoka.processJobData",
    arguments: [{
      name: "service",
      type: "QiskitRuntimeService",
      optional: false,
      description: "A <code>QiskitRuntimeService</code> instance."
    }, {
      name: "job_id",
      type: "string",
      optional: false,
      description: "A Qiskit/IBM Quantum job id."
    }, {
      name: "original_circuit",
      type: "qiskit.QuantumCircuit",
      optional: false,
      description: "A logical circuit for the job"
    }],
    _return: [
      {
        name: "job_data",
        type: "JobOuputData",
        description: "job output data."
      }
    ]
  },
  description: "Converts a job output data to a <code>JobOutputData</code> instance for sharing and viewing.",
  example: [
    "import os",
    "from qiskit_ibm_runtime import QiskitRuntimeService",
    "from patoka import processJobData",
    "",
    `token = os.environ["ibm_token"]`,
    `QiskitRuntimeService.save_account(channel="ibm_quantum", token=token, overwrite=True)`,
    `service = QiskitRuntimeService(channel="ibm_quantum")`,
    `job_id_0 = "..."`,
    "",
    "job_data = processJobData(service, job_id_0, circuit)",
    `with open("job_data_sample.json", "w") as f:`,
    "    f.write(job_data.toJSON())"
  ]
}, RetrieveJobData = {
  type: "Function",
  key: "retrieve_job_data_retrieveJobData",
  title: "patoka.retrieveJobData",
  def: {
    function: "patoka.retrieveJobData",
    arguments: [{
      name: "job_data",
      type: "JSON",
      optional: false,
      description: `A JSON object for job data that was generated using the <a href="#process_job_data_processJobData"><code>processJobData</code></a> function.`
    }],
    _return: [
      {
        name: "job_data",
        type: "JobOuputData",
        description: "job output data."
      }
    ]
  },
  description: "Converts a JSON data to JobOitputData.",
  example: [
    "import json",
    "from patoka import retrieveJobData",
    "",
    `with open("job_data_sample.json", "r") as f:`,
    "    job_data = json.load(f)",
    "job_data = retrieveJobData(job_data)",
    "# use `job_data` for a result viewer."
  ]
}