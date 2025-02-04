export const GetResultViewer = {
  type: "Function",
  key: "widgets_getResultViewer",
  title: "patoka.getResultViewer",
  def: {
    function: "patoka.getResultViewer",
    arguments: [],
    _return: [
      {
        name: "viewer",
        type: "ResultViewer",
        description: "a result viewer instance."
      }
    ]
  },
  description: "Calls a <code>ResultViewer</code> instance.",
  example: [
    "import json",
    "from patoka import retrieveJobData",
    "from patoka import getResultViewer",
    "",
    `with open("job_data_sample.json", "r") as f:`,
    "    job_data = json.load(f)",
    `job_data = retrieveJobData(job_data)`,
    "viewer = getResultViewer()",
    "viewer",
    `job_data.streamJSON(viewer) # this pattern is adopted because of a large volume.`
  ]
};

export const ResultViewer = {
  type: "Class",
  key: "widget_classes_ResultViewer",
  title: "patoka.ResultViewer",
  def: {
    _class: "patoka.ResultViewer",
  },
  anywidget_attributes: [{
    key: "data",
    description: `Job data (JSON string).`
  }],
  description: "Result viewer instance."
}