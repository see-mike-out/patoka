from .job_output_data import JobOutputData
from qiskit import qasm2, qasm3, QuantumCircuit

def retrieveJobData(job_dict):
    ret = JobOutputData(job_dict)
    
    if ret.transpiled_circuit_qasm2 is not None and ret.transpiled_circuit_qasm3 is None:
        try:
            ret.transpiled_circuit = QuantumCircuit.from_qasm_str(ret.transpiled_circuit_qasm2)
        except:
            print("QASM2 parsing failed")
    elif ret.transpiled_circuit_qasm2 is None and ret.transpiled_circuit_qasm3 is not None:
        try: 
            ret.transpiled_circuit = QuantumCircuit.from_qasm_str(ret.transpiled_circuit_qasm3)
        except:
            print("QASM3 parsing failed")
    elif ret.transpiled_circuit_qasm2 is not None and ret.transpiled_circuit_qasm3 is not None:
        try: 
            ret.transpiled_circuit = QuantumCircuit.from_qasm_str(ret.transpiled_circuit_qasm2)
        except:
            print("QASM2 parsing failed")
            try:
                ret.transpiled_circuit = QuantumCircuit.from_qasm_str(ret.transpiled_circuit_qasm3)
            except:
                print("QASM3 parsing failed")
            
        
    if ret.original_circuit_qasm2 is not None and ret.original_circuit_qasm3 is None:
        try:
            ret.original_circuit = QuantumCircuit.from_qasm_str(ret.original_circuit_qasm2)
        except:
            print("QASM2 parsing failed")
    elif ret.original_circuit_qasm2 is None and ret.original_circuit_qasm3 is not None:
        try: 
            ret.original_circuit = QuantumCircuit.from_qasm_str(ret.original_circuit_qasm3)
        except:
            print("QASM3 parsing failed")
    elif ret.original_circuit_qasm2 is not None and ret.original_circuit_qasm3 is not None:
        try: 
            ret.original_circuit = QuantumCircuit.from_qasm_str(ret.original_circuit_qasm2)
        except:
            print("QASM2 parsing failed")
            try:
                ret.original_circuit = QuantumCircuit.from_qasm_str(ret.original_circuit_qasm3)
            except:
                print("QASM3 parsing failed")

    ret.setUsedQG()
    return ret