from qiskit.visualization.circuit._utils import _get_layered_instructions
from qiskit.circuit.parametervector import ParameterVectorElement
from qiskit.circuit.parameterexpression import ParameterExpression


def serializeParams(params):
    output = []
    for param in params:
        if isinstance(param, ParameterVectorElement):
            output.append({"index": param.index, "vector": param.vector.name})
        elif isinstance(param, ParameterExpression):
            elements = [{"index": p.index, "vector": p.vector.name} for p in param.parameters]
            expr = str(param._symbol_expr)
            standalone = param._standalone_param
            output.append({"elements": elements, "expr": expr, "standalone": standalone})
        else:
            output.append(param)
    return output


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
                "params": serializeParams(inst.op.params),
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
