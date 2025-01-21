import collections

def getESP(layered_data, backend_data):
    n_layers = len(layered_data[0])
    total_esp = 1
    for i in range(n_layers):
        layer = layered_data[0][i]
        layer["esp_total"] = 1 if i == 0 else layered_data[0][i - 1]["esp_total"]
        layer["esp_this"] = 1
        layer["esp_detail"] = []
        for op in layer["operations"]:
            if op["gate"] == "measure":
                gate_error = backend_data["readout_errors"][op["qubits"][0]["index"]]["value"]
                layer["esp_detail"].append({"gate": op["gate"], "gate_error": gate_error, "qubits": [op["qubits"][0]["index"]]})
                layer["esp_this"] = layer["esp_this"] * (1 - gate_error)
            else:
                gate_info = get_gate_rror(backend_data, op["gate"], [q["index"] for q in op["qubits"]])
                if gate_info is not None:
                    gate_error = gate_info["gate_error"]["value"]
                    layer["esp_detail"].append({"gate": op["gate"], "gate_error": gate_error, "qubits": gate_info["qubits"]})
                    layer["esp_this"] = layer["esp_this"] * (1 - gate_error)
        layer["esp_total"] = layer["esp_total"] * layer["esp_this"]
        total_esp = layer["esp_total"]
    return (layered_data, total_esp)

def list_eq (a, b): 
    return collections.Counter(a) == collections.Counter(b)
    
def get_gate_rror(backend_data, gate_name, qubits):
    for ginfo in backend_data["gate_info"]:
        if ginfo["gate"] == gate_name and list_eq(ginfo["qubits"], qubits):
            return ginfo
    return None