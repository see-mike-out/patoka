export function parseCount(counts) {
  let raw_counts_obj = {};
  let max_state = 0;
  for (const count of Object.keys(counts)) {
    let count_int = parseInt(count);
    for (const state of counts[count]) {
      raw_counts_obj[state] = count_int;
      if (state > max_state) max_state = state;
    }
  }
  let bin_max_state = max_state.toString(2)
  let state_length = bin_max_state?.length;
  let counts_obj = {};
  for (let i = 0; i < max_state; i++) {
    counts_obj[reverse_string(i.toString(2).padStart(state_length, '0'))] = raw_counts_obj[i] || 0;
  }
  return counts_obj
}

function reverse_string(str) {
  return str.split("").reverse().join("");
}