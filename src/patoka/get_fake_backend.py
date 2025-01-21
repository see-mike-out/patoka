from qiskit_ibm_runtime import fake_provider as fk

import qiskit_aer

ns_rate = 0.000000001

def create_fake_backend(name, servvice=None, use_aer=True):
    if name == 'ibm_fez':
        print("No fake Fez machine is offered.")
        if service is not None:
            print("Service provided, so generating an Aer simulator.")
            _backend = service.backend(name=name)
            return qiskit_aer.AerSimulator.from_backend(_backend)
        return None
    elif name == 'ibm_torino':
        if use_aer:
            return qiskit_aer.AerSimulator.from_backend(fk.FakeTorino())
        else:
            return fk.FakeTorino()
    elif name == 'ibm_kyiv':
        if use_aer:
            return qiskit_aer.AerSimulator.from_backend(fk.FakeKyiv())
        else:
            return fk.FakeKyiv()
    elif name == 'ibm_quebec':
        if use_aer:
            return qiskit_aer.AerSimulator.from_backend(fk.FakeQuebec())
        else:
            return fk.FakeQuebec()
    elif name == 'ibm_sherbrooke':
        if use_aer:
            return qiskit_aer.AerSimulator.from_backend(fk.FakeSherbrooke())
        else:
            return fk.FakeSherbrooke()
    elif name == 'ibm_kyoto':
        if use_aer:
            return qiskit_aer.AerSimulator.from_backend(fk.FakeKyoto())
        else:
            return fk.FakeKyoto()
    elif name == 'ibm_brussels':
        print("No fake Brussels machine is offered.")
        if service is not None:
            print("Service provided, so generating an Aer simulator.")
            _backend = service.backend(name=name)
            return qiskit_aer.AerSimulator.from_backend(_backend)
        return None
    elif name == 'ibm_kawasaki':
        if use_aer:
            return qiskit_aer.AerSimulator.from_backend(fk.FakeKawasaki())
        else:
            return fk.FakeKawasaki()
    elif name == 'ibm_rensselaer':
        print("No fake Rensselaer machine is offered.")
        if service is not None:
            print("Service provided, so generating an Aer simulator.")
            _backend = service.backend(name=name)
            return qiskit_aer.AerSimulator.from_backend(_backend)
        return None
    elif name == 'ibm_strasbourg':
        print("No fake Strasbourg machine is offered.")
        if service is not None:
            print("Service provided, so generating an Aer simulator.")
            _backend = service.backend(name=name)
            return qiskit_aer.AerSimulator.from_backend(_backend)
        return None
    elif name == 'ibm_nazca':
        print("No fake Nazca machine is offered.")
        if service is not None:
            print("Service provided, so generating an Aer simulator.")
            _backend = service.backend(name=name)
            return qiskit_aer.AerSimulator.from_backend(_backend)
        return None
    elif name == 'ibm_brisbane':
        if use_aer:
            return qiskit_aer.AerSimulator.from_backend(fk.FakeBrisbane())
        else:
            return fk.FakeBrisbane()

def inject_properties(backend, properties_dict, config_dict):
    # t1, t2, frequency
    # backend.target.qubit_properties
    if "qubits" in properties_dict:    
        for qi in range(len(properties_dict["qubits"])):
            qubit_info = properties_dict["qubits"][qi]
            backend.target.qubit_properties[qi].t1 = qubit_info["T1"]["value"]
            backend.target.qubit_properties[qi].t2 = qubit_info["T2"]["value"]
            backend.target.qubit_properties[qi].frequency = qubit_info["frequency"]["value"]
            backend.target['measure'][(qi,)].error = qubit_info["readout_error"]["value"]
            backend.target['measure'][(qi,)].duration = qubit_info["readout_length"]["value"] * ns_rate
    
    # gate errors, length
    # backend.target['gate'][tuple(qubits)]
    if "gates" in properties_dict:
        for gate_info in properties_dict["gates"]:
            qubits = gate_info["qubits"]
            if len(qubits) == 1:
                qubits = (qubits[0], )
            elif len(qubits) == 2:
                qubits = (qubits[0], qubits[1])
            else:
                qubits = tuple(qubits)
            gate_name = gate_info["gate"]
            if gate_name in backend.target: 
                if qubits in backend.target[gate_name]:
                    backend.target[gate_name][qubits].duration = gate_info["parameters"]["gate_length"]["value"] * ns_rate
                    backend.target[gate_name][qubits].error = gate_info["parameters"]["gate_error"]["value"] 
    
    return backend