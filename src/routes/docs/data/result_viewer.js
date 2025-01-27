export const GetResultViewer = {
  key: "widgets_getResultViewer",
  title: "widgets.getResultViewer",
  def: {
    function: "widgets.getResultViewer",
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
    "from patoka.retrieve_job_data import retrieveJobData",
    "from patoka.widgets import getResultViewer",
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
  key: "widget_classes_ResultViewer",
  title: "widgets_classes.ResultViewer",
  def: {
    _class: "widgets_classes.ResultViewer",
  },
  anywidget_attributes: [{
    key: "data",
    description: `Job data (JSON string).`
  }],
  description: "Result viewer instance."
}