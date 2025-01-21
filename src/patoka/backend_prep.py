from qiskit_ibm_runtime.fake_provider import fake_backend
from qiskit_aer import AerSimulator

from .backend_design import get_backend_circuit_nodes
import json
import re

aer_sim_name_re = re.compile("aer_simulator_from\\(fake_([a-zA-Z]+)\\)")


def getBackendData(backend):
    data = {}

    if isinstance(backend, fake_backend.FakeBackendV2):
        # V2 backends
        backend_name = backend.backend_name
        backend_name = backend_name.replace("fake_", "")
        data["name"] = backend_name
        data["version"] = backend.backend_version
    else:
        props = backend.properties()
        if isinstance(backend, AerSimulator):
            backend_name = backend.name
            name_parsed = aer_sim_name_re.match(backend_name)
            if name_parsed is not None:
                backend_name = backend_name.replace("aer_simulator_from(fake_", "")
                backend_name = backend_name[0:-1]
        else: 
            backend_name = props.backend_name.replace("ibmq_", "")
            backend_name = props.backend_name.replace("ibm_", "")
            
        data["name"] = backend_name
        
        if props is not None:
            props = backend.properties().to_dict()
        
            data["version"] = props["backend_version"] if "backend_version" in props else ""
            
            data["last_update_date"] = (
                timeToStr(props["last_update_date"]) if "last_update_date" in props else ""
            )
            
            _machine_data = backend.configuration().to_dict()
            machine_data = {
                "backend_name": _machine_data["backend_name"],
                "backend_version": _machine_data["backend_version"],
                "gates": _machine_data["gates"],
                "simulator": _machine_data["simulator"],
                "online_date": timeToStr(_machine_data["online_date"]) if "online_date" in props else "",
                "basis_gates": _machine_data["basis_gates"] if "basis_gates" in _machine_data else []
            }
            data["machine_data"] = machine_data

            # design
            edges = backend.configuration().to_dict()["coupling_map"]
            if edges is None:
                edges = []
            nodes = get_backend_circuit_nodes(backend_name)
            data["design"] = {"nodes": nodes, "edges": edges}
        
            # qubit errors
            readout_errors = {}
            for qi in range(len(props["qubits"])):
                qubit = props["qubits"][qi]
                for item in qubit:
                    if item["name"] == "readout_error":
                        readout_errors[qi] = {
                            "value": item["value"],
                            "asof": timeToStr(item["date"]),
                        }
            data["readout_errors"] = readout_errors
            
            gate_info = []
            for qubit_gate in props["gates"]:
                qubits = qubit_gate["qubits"]
                gate = qubit_gate["gate"]
                gate_error = {}
                gate_length = {}
                for param in qubit_gate["parameters"]:
                    if param["name"] == "gate_error":
                        gate_error["value"] = param["value"]
                        gate_error["asof"] = timeToStr(param["date"])
                    elif param["name"] == "gate_length":
                        gate_length["value"] = param["value"]
                        gate_length["unit"] = param["unit"]
                        gate_length["asof"] = timeToStr(param["date"])
                gate_info.append(
                    {
                        "qubits": qubits,
                        "gate": gate,
                        "gate_error": gate_error,
                        "gate_length": gate_length,
                    }
                )
            data["gate_info"] = gate_info
    return data

def timeToStr(dt):
    return dt.strftime("%m/%d/%Y, %H:%M:%S") if dt is not None else ""
