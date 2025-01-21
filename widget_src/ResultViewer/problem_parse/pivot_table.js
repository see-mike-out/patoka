export function parsePivotTableProblem(counts, config) {
  let data = [];
  for (const state of Object.keys(counts)) {
    let bits_measured = state.split(""), state_size = state?.length;
    let count = counts[state];
    let obj = { count, state };
    bits_measured.forEach((b, i) => {
      obj[(state_size - i - 1).toString()] = b;
    });
    data.push(obj);
  }
  return data;
}

export function pivotCountTable(data, _pivot) {
  let new_data_keys = [], new_data = {}, sub_totals = {};
  // when not provided
  if (_pivot?.length == 0) {
    return {
      data,
      sub_total: get_subtotals(data)
    };
  }

  let pivot = _pivot.toSorted();
  for (const k of pivot) {
    if (new_data_keys?.length == 0) {
      new_data_keys.push("0", "1");
    } else {
      let a = new_data_keys.map((d) => d + "0");
      let b = new_data_keys.map((d) => d + "1");
      new_data_keys = a;
      a.push(...b);
    }
  }
  for (const k of new_data_keys) {
    new_data[k] = 0;
  }
  for (const obj of data) {
    let k = pivot.map((d) => obj[d]).join("");
    new_data[k] += obj.count;
  }

  let new_data_table = [];
  for (const k of Object.keys(new_data)) {
    let obj = {
      pivot: k,
      count: new_data[k]
    };

    let bits_measured = k.split(""), state_size = k.length;
    bits_measured.forEach((b, i) => {
      obj[pivot[i]] = b;
    });
    new_data_table.push(obj)
  }
  return {
    data: new_data_table,
    sub_total: get_subtotals(new_data_table)
  };
}

export function get_subtotals(data) {
  if (!data) return [];
  if (data.constructor.name !== "Array") return;
  let clbits = Object.keys(data[0] || {}).filter((d) => !isNaN(parseInt(d)));
  let sub_total_counts = {};
  for (const row of data) {
    for (let bi of clbits) {
      if (sub_total_counts[bi] === undefined) sub_total_counts[bi] = { '0': 0, '1': 0 }
      sub_total_counts[bi][row[bi]] += row.count;
    }
  }

  let sub_total_table = [];
  for (let bi of clbits) {
    sub_total_table.push({
      bit: bi,
      '0': sub_total_counts[bi]['0'],
      '1': sub_total_counts[bi]['1']
    });
  }

  return sub_total_table;
}