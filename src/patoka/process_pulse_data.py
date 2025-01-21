def extract_pulse_data(backend, basis_gates, instructions):
    pulse_data = {}
    for inst in instructions:
        op_name = inst.operation.name
        op_qubits = [q._index for q in inst.qubits]
        op_key = op_name + "__" + "_".join([str(q) for q in op_qubits])
        if op_key not in pulse_data and op_name in basis_gates:
            pulse_data[op_key] = get_pulse_data(backend, op_name, op_qubits)
    return pulse_data
    
def get_pulse_data(backend, gate, qubits):
    pulse_data = backend.defaults().instruction_schedule_map.get(gate, qubits)
    schedules = pulse_data.children
    total_duration = pulse_data.duration
    
    schedule_info = []
    for sched in schedules:
        time = sched[0]
        comp = sched[1]
        component_type = type(comp).__name__
        channel_type = type(comp.channel).__name__
        channel_index = comp.channel.index
        name = comp.channel.name
        if component_type == "Play": 
            duration = comp.pulse.duration
            pulse_type = comp.pulse._pulse_type
            amplitude = comp.pulse.amp
            pulse_params = {}
            if hasattr(comp.pulse, 'angle'):
                pulse_params['angle'] = float(comp.pulse.angle)
            if hasattr(comp.pulse, 'sigma'):
                pulse_params['sigma'] = float(comp.pulse.sigma)
            if hasattr(comp.pulse, 'beta'):
                pulse_params['beta'] = float(comp.pulse.beta)
            if hasattr(comp.pulse, 'freq'):
                pulse_params['freq'] = float(comp.pulse.freq)
            if hasattr(comp.pulse, 'phase'):
                pulse_params['phase'] = float(comp.pulse.phase)
            schedule_info.append({
                "time_at": time,
                "name": name,
                "component_type": component_type,
                "channel_type": channel_type,
                "channel_index": channel_index,
                "duration": duration,
                "pulse_type": pulse_type,
                "pulse_params": pulse_params,
                "amplitude": amplitude
            })
        elif component_type == "ShiftPhase":
            phase = str(comp.phase._symbol_expr)
            duration = comp.duration
            schedule_info.append({
                "time_at": time,
                "name": name,
                "component_type": component_type,
                "channel_type": channel_type,
                "channel_index": channel_index,
                "duration": duration,
                "phase": phase
            })
    return {
        "gate": gate,
        "qubits": qubits,
        "pulse_schedule": schedule_info,
        "duration": total_duration
    }
    
