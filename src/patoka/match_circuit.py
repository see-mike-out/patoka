from .qiskit_draw_utils import getCircuitLayout
import qiskit.circuit.library as gates
import qiskit.circuit as QCR
from qiskit.circuit import QuantumCircuit
import numpy as np
import copy
import re

def matchCircuitLayouts(origin, trans, pass_manager):
    # mapping by transpiling length
    origin_explicated = []
    mapping = trans[1]
    simplified_mapping = {}
    for m in mapping:
        simplified_mapping[m["from"]] = m["to"]
    memo = []

    # o_: origin
    o_layers = origin[0]
    cummul_explication = []
    o_serialized_ops = []
    o_serialized_records = []
    for o_li in range(len(o_layers)):
        o_layer = o_layers[o_li]
        o_layer_ops = o_layer["operations"]
        for o_opi in range(len(o_layer_ops)):
            _o_op = o_layer_ops[o_opi]
            o_op = copy.deepcopy(_o_op)
            o_serialized_ops.append(o_op)
            o_serialized_records.append((o_li, o_opi))
            op_cummul_explicated = explicate_circuit(o_serialized_ops, pass_manager)
            op_cummul_explicated_simplified = simplify_layout(op_cummul_explicated[0][0])
            
            reverse_mapping = {}
            for m in op_cummul_explicated[0][1]:
                reverse_mapping[m["to"]] = m["from"]
            
            op_cummul_explicated_simplified = [replace_qubit(cm, reverse_mapping) for cm in op_cummul_explicated_simplified]
            
            difference = get_explication_difference(
                cummul_explication[-1]["explication_simplified"] if len(cummul_explication) > 0 else [],
                op_cummul_explicated_simplified)
            
            curr_match = []
            for i in range(len(difference)):
                if difference[i]:
                    curr_match.append(op_cummul_explicated_simplified[i])
            
            cummul_explication.append({
                "operation_indices": copy.deepcopy(o_serialized_records),
                "curr_index": (o_li, o_opi),
                "explication": op_cummul_explicated[0],
                "explication_simplified": op_cummul_explicated_simplified,
                "matches": curr_match,
                "match_index": [],
                "mapping": op_cummul_explicated[0][1]
            })
            
    trans_simplified, trans_simplified_map = simplify_layout(trans[0], with_index=True)
    reverse_mapping = {}
    for m in mapping:
        reverse_mapping[m["to"]] = m["from"]
    trans_simplified = [replace_qubit(cm, reverse_mapping) for cm in trans_simplified]
    for exp in cummul_explication:
        matches = exp["matches"]
        for m in matches:
            i = trans_simplified.index(m) if m in trans_simplified else None
            if i is not None:
                exp["match_index"].append(trans_simplified_map[i])
                trans_simplified.remove(m)
                del trans_simplified_map[i]
        memo.append({
            "from": exp["curr_index"],
            "to": {
                "complete": False,
                "matches": exp["match_index"],
                "un_matches": 0
            }
        })
    len_memo = len(memo)
    for mi in range(len_memo - 1):
        curr = memo[len_memo - mi - 2]
        post = memo[len_memo - mi - 1]
        if len(curr["to"]["matches"]) == 0:
            curr["to"]["matches"] = copy.deepcopy(post["to"]["matches"])
    return {"layer_match": memo, "bit_match": mapping}


def explicate_circuit(o_gates, pass_manager):
    explication = []
    instructions = []
    max_qubits = 0
    max_clbits = -1
    for o_gate in o_gates:
        gate_name = o_gate["gate"]
        params = o_gate["params"]
        
        qubits = get_qubit_indices(o_gate["qubits"])
        max_q_ind =  max(qubits)
        max_qubits = max_q_ind if max_q_ind > max_qubits else max_qubits
        num_qubits = o_gate["num_qubits"]
        
        clbits = get_qubit_indices(o_gate["clbits"])
        max_c_ind =  max(clbits) if len(clbits) > 0 else -1
        max_clbits = max_c_ind if max_c_ind > max_clbits else max_clbits
        
        gate_comps = get_gate(gate_name, num_qubits, params)
        instructions.append((gate_comps, qubits, clbits))

    circ = QuantumCircuit(max_qubits + 1, max_clbits + 1)
    for inst in instructions:
        if inst[0] is None:
            pass
        elif inst[0].name == "measure":
            circ.append(inst[0], inst[1], inst[2])
        elif inst[0].name == "barrier":
            circ.append(inst[0], inst[1])
        else:
            circ.append(inst[0], inst[1])
    circ_trans = pass_manager.run(circ)

    return (getCircuitLayout(circ_trans), circ_trans)

op_format_str1 = "{0}_{1}"

def simplify_layout(circuit_layout, with_index=False, mapping=None):
    res = []
    res_map = []
    li = 0
    for layer in circuit_layout:
        oi = 0
        for operation in layer["operations"]:
            param_str = ",".join(str(p) for p in operation["params"])
            op_str = operation["gate"] if len(param_str) == 0 else op_format_str1.format(operation["gate"], param_str)
            qubits = get_qubit_indices(operation["qubits"])
            if mapping is not None:
                qubits = [mapping[q] for q in qubits]
            if operation["gate"] == "barrier":
                qubits = sorted(qubits)
            qubit_str = ",".join(["$"+str(q) for q in qubits])
            res_str = op_str + "__" + qubit_str 
            res.append(res_str)
            res_map.append((li, oi))
            oi = oi + 1
        li = li + 1
    if with_index:
        return (res, res_map)
    else:
        return res

qubit_re = re.compile("\\$[0-9]+")
def replace_qubit(sim_str, mapping):
    eoq = False
    sp = 0
    while not eoq:
        qm = qubit_re.search(sim_str, sp)
        if qm is not None:
            sp = qm.span()[1]
            dq = qm[0]
            ndq = "!" + str(mapping[int(dq[1:])])
            sim_str = sim_str.replace(dq, ndq)
        else:
            eoq = True
    return sim_str

def get_explication_difference(sim0, sim1):
    checks = copy.deepcopy(sim0)
    result = [True for p in sim1]
    for i in range(len(sim1)):
        if sim1[i] in checks:
            result[i] = False
            checks.remove(sim1[i])
    return result

def get_qubit_indices(qubits):
    return [q["index"] for q in qubits]

# get gate instructions
def get_gate(gate_name, n_qubits, params):
    gate = None
    # C3XGate(*args[, _force_mutable])	The X gate controlled on 3 qubits.
    if (
        gate_name == "cccx"
        or gate_name == "c3x"
        or (gate_name == "mcx" and n_qubits == 4)
    ):
        gate = gates.C3XGate()
    # C4XGate(*args[, _force_mutable])	The 4-qubit controlled X gate.
    elif (
        gate_name == "ccccx"
        or gate_name == "c4x"
        or (gate_name == "mcx" and n_qubits == 5)
    ):
        gate = gates.C4XGate()
    # CCXGate(*args[, _force_mutable])	CCX gate, also known as Toffoli gate.
    elif gate_name == "ccx" or gate_name == "c2x":
        gate = gates.CCXGate()
    # DCXGate(*args[, _force_mutable])	Double-CNOT gate.
    elif gate_name == "dcx":
        gate = gates.DCXGate()
    # CHGate(*args[, _force_mutable])	Controlled-Hadamard gate.
    elif gate_name == "ch":
        gate = gates.CHGate()
    # CPhaseGate(theta[, label, ctrl_state, ...])	Controlled-Phase gate.
    elif gate_name == "cp":
        gate = gates.CPhaseGate(*params)
    # CRXGate(theta[, label, ctrl_state, ...])	Controlled-RX gate.
    elif gate_name == "crx":
        gate = gates.CRXGate(*params)
    # CRYGate(theta[, label, ctrl_state, ...])	Controlled-RY gate.
    elif gate_name == "cry":
        gate = gates.CRXGate(*params)
    # CRZGate(theta[, label, ctrl_state, ...])	Controlled-RZ gate.
    elif gate_name == "crz":
        gate = gates.CRZGate(*params)
    # CSGate(*args[, _force_mutable])	Controlled-S gate.
    elif gate_name == "cs":
        gate = gates.CSGate()
    # CSdgGate(*args[, _force_mutable])	Controlled-S^dagger gate.
    elif gate_name == "csdg":
        gate = gates.CSdgGate()
    # CSwapGate(*args[, _force_mutable])	Controlled-SWAP gate, also known as the Fredkin gate.
    elif gate_name == "cswap":
        gate = gates.CSwapGate()
    # CSXGate(*args[, _force_mutable])	Controlled-√X gate.
    elif gate_name == "csx":
        gate = gates.CSXGate()
    # CUGate(theta, phi, lam, gamma[, label, ...])	Controlled-U gate (4-parameter two-qubit gate).
    elif gate_name == "cu":
        gate = gates.CUGate(*params)
    # CU1Gate(theta[, label, ctrl_state, ...])	Controlled-U1 gate.
    elif gate_name == "cu1":
        gate = gates.CU1Gate(*params)
    # CU3Gate(theta, phi, lam[, label, ...])	Controlled-U3 gate (3-parameter two-qubit gate).
    elif gate_name == "cu3":
        gate = gates.CU1Gate(*params)
    # CXGate(*args[, _force_mutable])	Controlled-X gate.
    elif gate_name == "cx":
        gate = gates.CXGate()
    # CYGate(*args[, _force_mutable])	Controlled-Y gate.
    elif gate_name == "cy":
        gate = gates.CYGate()
    # CZGate(*args[, _force_mutable])	Controlled-Z gate.
    elif gate_name == "cz":
        gate = gates.CZGate()
    # CCZGate(*args[, _force_mutable])	CCZ gate.
    elif gate_name == "ccz":
        gate = gates.CCZGate()
    # ECRGate(*args[, _force_mutable])	An echoed cross-resonance gate.
    elif gate_name == "ecr":
        gate = gates.ECRGate()
    # HGate(*args[, _force_mutable])	Single-qubit Hadamard gate.
    elif gate_name == "h":
        gate = gates.HGate()
    # IGate(*args[, _force_mutable])	Identity gate.
    elif gate_name == "id":
        gate = gates.IGate()
    # PhaseGate(theta[, label, duration, unit])	Single-qubit rotation about the Z axis.
    elif gate_name == "p":
        gate = gates.PhaseGate(*params)
    # RCCXGate(*args[, _force_mutable])	The simplified Toffoli gate, also referred to as Margolus gate.
    elif gate_name == "rccx":
        gate = gates.RCCXGate()
    # RC3XGate(*args[, _force_mutable])	The simplified 3-controlled Toffoli gate.
    elif gate_name == "rcccx":
        gate = gates.RCCXGate()
    # RGate(theta, phi[, label, duration, unit])	Rotation θ around the cos(φ)x + sin(φ)y axis.
    elif gate_name == "r":
        gate = gates.RGate(*params)
    # RXGate(theta[, label, duration, unit])	Single-qubit rotation about the X axis.
    elif gate_name == "rx":
        gate = gates.RXGate(*params)
    # RXXGate(theta[, label, duration, unit])	Single-qubit rotation about the X axis.
    elif gate_name == "rxx":
        gate = gates.RXXGate(*params)
    # RYGate(theta[, label, duration, unit])	Single-qubit rotation about the Y axis.
    elif gate_name == "ry":
        gate = gates.RYGate(*params)
    # RYYGate(theta[, label, duration, unit])	A parametric 2-qubit
    elif gate_name == "ryy":
        gate = gates.RYYGate(*params)
    # RZGate(theta[, label, duration, unit])	A parametric 2-qubit
    elif gate_name == "rz":
        gate = gates.RZGate(*params)
    # RZZGate(theta[, label, duration, unit])	A parametric 2-qubit
    elif gate_name == "rzz":
        gate = gates.RZZGate(*params)
    # RZXGate(theta[, label, duration, unit])	A parametric 2-qubit
    elif gate_name == "rzx":
        gate = gates.RZZGate(*params)
    # XXMinusYYGate(theta[, beta, label, ...])	XX-YY interaction gate.
    elif gate_name == "xx_minus_yy":
        gate = gates.XXMinusYYGate(*params)
    # XXPlusYYGate(theta[, beta, label, duration, ...])	XX+YY interaction gate.
    elif gate_name == "xx_plus_yy":
        gate = gates.XXMinusYYGate(*params)
    # SGate(*args[, _force_mutable])	Single qubit S gate (Z**0.5).
    elif gate_name == "s":
        gate = gates.SGate()
    # SdgGate(*args[, _force_mutable])	Single qubit S-adjoint gate (~Z**0.5).
    elif gate_name == "sdg":
        gate = gates.SdgGate()
    # SwapGate(*args[, _force_mutable])	The SWAP gate.
    elif gate_name == "swap":
        gate = gates.SwapGate()
    # iSwapGate(*args[, _force_mutable])	iSWAP gate.
    elif gate_name == "iswap":
        gate = gates.iSwapGate()
    # SXGate(*args[, _force_mutable])	The single-qubit Sqrt(X) gate
    elif gate_name == "sx":
        gate = gates.SXGate()
    # SXdgGate(*args[, _force_mutable])	The inverse single-qubit Sqrt(X) gate.
    elif gate_name == "sxdg":
        gate = gates.SXdgGate()
    # TGate(*args[, _force_mutable])	Single qubit T gate (Z**0.25).
    elif gate_name == "t":
        gate = gates.TGate()
    # TdgGate(*args[, _force_mutable])	Single qubit T-adjoint gate (~Z**0.25).
    elif gate_name == "tdg":
        gate = gates.TdgGate()
    # UGate(theta, phi, lam[, label, duration, unit])	Generic single-qubit rotation gate with 3 Euler angles.
    elif gate_name == "u":
        gate = gates.UGate(*params)
    # U1Gate(theta[, label, duration, unit])	Single-qubit rotation about the Z axis.
    elif gate_name == "u1":
        gate = gates.U1Gate(*params)
    # U2Gate(phi, lam[, label, duration, unit])	Single-qubit rotation about the X+Z axis.
    elif gate_name == "u2":
        gate = gates.U2Gate(*params)
    # U3Gate(theta, phi, lam[, label, duration, unit])	Generic single-qubit rotation gate with 3 Euler angles.
    elif gate_name == "u3":
        gate = gates.U3Gate(*params)
    # XGate(*args[, _force_mutable])	The single-qubit Pauli-X gate
    elif gate_name == "x":
        gate = gates.XGate()
    # YGate(*args[, _force_mutable])	The single-qubit Pauli-Y gate
    elif gate_name == "y":
        gate = gates.YGate()
    # ZGate(*args[, _force_mutable])	The single-qubit Pauli-Z gate
    elif gate_name == "z":
        gate = gates.ZGate()
    # GlobalPhaseGate(phase[, label, duration, unit])	The global phase gate
    elif gate_name == "global_phase":
        gate = gates.GlobalPhaseGate()
    elif gate_name == "QFT":
        gate = gates.QFT(n_qubits).to_gate()
    elif gate_name == "measure":
        gate = QCR.Measure()
    elif gate_name == "barrier":
        gate = QCR.Barrier(n_qubits)
    return gate