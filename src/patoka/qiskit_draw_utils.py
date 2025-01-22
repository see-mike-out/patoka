from qiskit.visualization.circuit._utils import _get_layered_instructions


def getCircuitLayout(circuit):
    layered_instructions = _get_layered_instructions(circuit)
    dl = []
    _layout = circuit.layout
    dx = layered_instructions[2]
    for layer in dx:
        ol = {
            "operations": [],
            "num_op": 0
        }
        for inst in layer:
            op = {
                "gate": inst.op.name,
                "num_qubits": inst.op.num_qubits,
                "num_clbits": inst.op.num_clbits,
                "params": inst.op.params,
                "qubits": [],
                "clbits": []
            }
            for qubit in inst.qargs:
                op["qubits"].append({
                    "register": {"name": qubit._register._name, "size": qubit._register._size},
                    "index": qubit._index
                })
            op["qubits"] = tuple(op["qubits"])
            for clbit in inst.cargs:
                op["clbits"].append({
                    "register": {"name": qubit._register._name, "size": qubit._register._size},
                    "index": qubit._index
                })
            op["clbits"] = tuple(op["clbits"])
            ol["operations"].append(op)
            ol["num_op"] = ol["num_op"] + 1
        dl.append(ol)

    layout = []
    if _layout is not None:
        for new_ind in _layout.initial_layout._p2v:
            bit = _layout.initial_layout._p2v[new_ind]
            bitmap = {
                "from": None if bit._register.name == 'ancilla' else bit._index,
                "to":  new_ind,
                "is_ancilla": True if bit._register.name == 'ancilla' else False
            }
            if _layout.final_layout is not None and bitmap["is_ancilla"] is False:
                for new_ind2 in _layout.final_layout._p2v:
                    bit2 = _layout.final_layout._p2v[new_ind2]
                    if bit2._index == bitmap["to"]:
                        bitmap["to"] = new_ind2
                        break
            layout.append(bitmap)
    global_phase = circuit.global_phase
    return (dl, layout, global_phase)
