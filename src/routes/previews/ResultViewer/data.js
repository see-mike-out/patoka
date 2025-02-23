import { Model } from "$lib/model";

import job_data from "$lib/qaoa_job_data_hea.json"
let data = job_data;

let count = "";

export let _model = new Model({
  data, count
});