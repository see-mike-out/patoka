import { Model } from "$lib/model";

import job_data from "$lib/job_data_sample.json"
let data = job_data;

let count = "";

export let _model = new Model({
  data, count
});