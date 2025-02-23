from .qiskit_draw_utils import getCircuitLayout
from .match_circuit import matchCircuitLayouts
from .backend_prep import getBackendData
from .process_pulse_data import extract_pulse_data
from .esp import getESP
from .transpile_params import TranspileParam
from qiskit.circuit import CircuitInstruction
from qiskit import transpile, qasm2, qasm3
from qiskit.transpiler.preset_passmanagers import generate_preset_pass_manager
import json
from tqdm import tqdm


def json_type_parser(comp):
    if isinstance(comp, complex):
        return str(comp.real) + ("+" if comp.imag >= 0 else "-") + str(comp.imag) + "j"
    else:
        return comp


def prepareData(circuit, backends, transpile_params):
    """
    (1) get the backend & pulse data
    (2) transpile the original circuit
    (3) match the original and transpiled circuit
    """

    # (0) data prep
    if type(backends) is not list:
        backends = [backends]
    if type(transpile_params) is not list:
        transpile_params = [transpile_params]

    n_backends = len(backends)
    n_params = len(transpile_params)

    # get the original circuit's layout data
    layer_original = getCircuitLayout(circuit)

    original_qasm2 = None
    try:
        original_qasm2 = qasm2.dumps(circuit)
    except:
        original_qasm2 = None

    original_qasm3 = None
    try:
        original_qasm3 = qasm3.dumps(circuit)
    except:
        original_qasm3 = None

    return_data = {
        "original_circuit": circuit,
        "original_qasm2": original_qasm2,
        "original_qasm3": original_qasm3,
        "original_circuit_layered": layer_original,
        "transpiled_results": []
    }

    for i in tqdm(range(n_backends)):
        # (1) get the backend data
        backend = backends[i]
        backend_data = getBackendData(backend)

        transpile_param = transpile_params[i % n_params]
        if transpile_param is None:
            transpile_param = TranspileParam()

        min_match_score = float("inf")

        pass_manager = generate_preset_pass_manager(backend=backend, **transpile_param.to_dict_for_transpile())

        transpile_data = {}
        # (2) transpiling & (3) matching

        trans = pass_manager.run(circuit, **transpile_param.to_dict_for_transpile_run())
        layer_trans = getCircuitLayout(trans)
        (layer_trans, total_esp) = getESP(layer_trans, backend_data)
        circuit_matches = matchCircuitLayouts(layer_original, layer_trans, pass_manager)

        if hasattr(backend, "defaults"):
            pulse_data = extract_pulse_data(backend, backend_data["machine_data"]["basis_gates"], trans.data)
        else:
            pulse_data = None

        transpiled_qasm2 = None
        try:
            transpiled_qasm2 = qasm2.dumps(trans)
        except:
            transpiled_qasm2 = None

        transpiled_qasm3 = None
        try:
            transpiled_qasm3 = qasm3.dumps(trans)
        except:
            transpiled_qasm3 = None

        transpile_data = {
            "transpiled_circuit": trans,
            "transpiled_qasm2": transpiled_qasm2,
            "transpiled_qasm3": transpiled_qasm3,
            "transpiled_circuit_layered": layer_trans,
            "traspiling_match": circuit_matches,
            "backend_data": backend_data,
            "transpile_param": transpile_param.to_dict(),
            "esp": total_esp,
            "pulse_data": pulse_data
        }

        return_data["transpiled_results"].append(transpile_data)
    return PassData(return_data)


def bitsToList(bits):
    return [
        {
            "index": bit._index,
            "register": {"name": bit._register._name, "size": bit._register._size},
        }
        for bit in bits
    ]


class TranspilePassData:
    def __init__(self, data):
        self.transpiled_circuit = data["transpiled_circuit"]
        self.transpiled_qasm2 = data["transpiled_qasm2"]
        self.transpiled_qasm3 = data["transpiled_qasm3"]
        self.transpiled_circuit_layered = data["transpiled_circuit_layered"]
        self.traspiling_match = data["traspiling_match"]
        self.backend_data = data["backend_data"]
        self.transpile_param = data["transpile_param"]
        self.transpiled_global_phase = (
            get_global_pahse(data["transpiled_circuit"][2])
            if len(data["transpiled_circuit"]) >= 3
            else 0
        )
        self.pulse_data = data["pulse_data"]
        self.esp = data["esp"]

    def toJSON(self):
        json.dumps(self.transpiled_circuit_layered[0])
        return {
            "layers": self.transpiled_circuit_layered[0],
            "qubits": bitsToList(self.transpiled_circuit.qubits),
            "clbits": bitsToList(self.transpiled_circuit.clbits),
            "num_qubits": self.transpiled_circuit.num_qubits,
            "num_clbits": self.transpiled_circuit.num_clbits,
            "global_phase": self.transpiled_global_phase,
            "esp": self.esp,
            "match": self.traspiling_match,
            "backend": self.backend_data,
            "transpile_param": self.transpile_param,
            "qasm2": self.transpiled_qasm2,
            "qasm3": self.transpiled_qasm3,
            "pulse_data": self.pulse_data
        }


class PassData:
    def __init__(self, data):
        self.original_circuit = data["original_circuit"]
        self.original_circuit_layered = data["original_circuit_layered"]
        self.original_qasm2 = data["original_qasm2"]
        self.original_qasm3 = data["original_qasm3"]
        self.original_global_phase = (
            get_global_pahse(data["original_circuit"][2])
            if len(data["original_circuit"]) >= 3
            else 0
        )
        self.transpiled_results = []
        for res in data["transpiled_results"]:
            self.transpiled_results.append(TranspilePassData(res))

    def toJSON(self):
        return json.dumps(
            {
                "original": {
                    "layers": self.original_circuit_layered[0],
                    "qubits": bitsToList(self.original_circuit.qubits),
                    "clbits": bitsToList(self.original_circuit.clbits),
                    "num_qubits": self.original_circuit.num_qubits,
                    "num_clbits": self.original_circuit.num_clbits,
                    "global_phase": self.original_global_phase,
                    "qasm2": self.original_qasm2,
                    "qasm3": self.original_qasm3
                },
                "transpiled": [
                    res.toJSON() for res in self.transpiled_results
                ]
            },
            default=json_type_parser)


def get_global_pahse(phase):
    if isinstance(phase, int) or isinstance(phase, float):
        return phase
    elif isinstance(phase, CircuitInstruction):
        if phase.operation.name == "measure":
            return 0
        elif phase.operation.name == "rz":
            return phase.operation.params[0]
    else:
        return 0
