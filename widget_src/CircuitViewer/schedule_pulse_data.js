export function schedule_pulse_data(layout, pulse_data) {
  let cummul_duration = 0;
  let schedule = [];
  let operation_schedule = [];
  let channels = {};
  let li = 0;
  for (const layer of layout) {
    let duration_max = 0;
    let oi = 0;
    for (const op of layer.operations) {
      let gate_name = op.gate;
      let gate_qubits = op.qubits.map((d) => d.index);
      let pulse_key = gate_name + "__" + gate_qubits.join("_");
      let pulse_info = pulse_data?.[pulse_key]
      if (pulse_info) {
        duration_max = pulse_info.duration > duration_max ? pulse_info.duration : duration_max;
        for (const pulse of pulse_info.pulse_schedule) {
          let schedule_item = JSON.parse(JSON.stringify(pulse));
          schedule_item.time_at = schedule_item.time_at + cummul_duration;
          schedule_item.layer_index = li;
          schedule_item.op_index = oi;
          schedule.push(schedule_item)
          if (!channels[schedule_item.name]) {
            channels[schedule_item.name] = {
              name: schedule_item.name,
              channel_type: schedule_item.channel_type,
              channel_index: schedule_item.channel_index,
              component_type: schedule_item.component_type,
              pulse_type: schedule_item.pulse_type
            }
          }
        }
      }
      oi++;
    }
    cummul_duration += duration_max
    operation_schedule.push(cummul_duration);
    li++;
  }
  // adjust the starting point
  operation_schedule.unshift(0);
  return { schedule, channels, operation_schedule };
}
