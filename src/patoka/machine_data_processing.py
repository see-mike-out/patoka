def timeToStr(dt):
    return dt.strftime("%m/%d/%Y, %H:%M:%S") if dt is not None else ""
    
def process_qubit_data(data):
    output = []
    for qubit in data:
        q_info = {}
        for prop in qubit:
            q_info[prop["name"]] = {
                "asof": timeToStr(prop["date"]),
                "value": prop["value"],
                "unit": prop["unit"]
            }
        output.append(q_info)
    return output

def process_gate_data(data):
    output = []
    for gate in data:
        g_info = {
            "name": gate["name"],
            "qubits": gate["qubits"],
            "gate": gate["gate"],
            "parameters": {}
        }
        for param in gate["parameters"]:
            g_info["parameters"][param["name"]] = {
                "asof": timeToStr(param["date"]),
                "value": param["value"],
                "unit": param["unit"]
            }
        output.append(g_info)
    return output

def process_nudv_data(data):
    output = {}
    for prop in data:
        output[prop["name"]] = {
            "asof": timeToStr(prop["date"]),
            "value": prop["value"],
            "unit": prop["unit"]
        }
    return output

def process_operations_data(data):
    output = []
    for op in data:
        if op.__class__.__name__ == "ABCMeta":
            output.append({
                "name": op.__name__,
                "type": "control_flow"
            })
        else:
            output.append({
                "type": "gate",
                "name": op.name, 
                "num_qubits": op.num_qubits,
                "num_clbits": op.num_clbits,
                "condition_bits": op.condition_bits,
                "params": [p.name for p in op.params],
                "unit": op.unit,
                "mutable": op.mutable
            })
    return output

#  (Instruction(name='id', num_qubits=1, num_clbits=0, params=[]), (1,)),

def process_instructions_data(data, duration):
    output = []
    for instr in data:
        op = instr[0]
        qubits = instr[1]
        operation = {}
        if op.__class__.__name__ == "ABCMeta":
            operation = {
                "name": op.__name__,
                "type": "control_flow",
                "qubits": qubits
            }
        else:
            try:
                dur = duration.get(op.name, qubits)
            except:
                dur = None
            operation = {
                "type": "gate",
                "name": op.name, 
                "num_qubits": op.num_qubits,
                "num_clbits": op.num_clbits,
                "condition_bits": op.condition_bits,
                "params": [p.name for p in op.params],
                "unit": op.unit,
                "mutable": op.mutable,
                "qubits": qubits,
                "duration": dur
            }
        output.append(operation)
    return output
