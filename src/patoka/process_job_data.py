from datetime import datetime as dt
import json
import math

from .machine_data_processing import (
    timeToStr,
    process_qubit_data,
    process_gate_data,
    process_nudv_data,
    process_operations_data,
    process_instructions_data,
)
from .qiskit_draw_utils import getCircuitLayout
from .get_fake_backend import create_fake_backend, inject_properties
from .job_output_data import JobOutputData

from qiskit import qasm2, qasm3

from tqdm import tqdm

n_tasks = 10

def processJobData(service, job_id, original_circuit):
    # progress bar
    task_progress = tqdm(total=n_tasks)
    
    # 1: get the job
    job = service.job(job_id)
    task_progress.update(1)

    if not job.done():
        print(f"The job `{job_id}` is not done yet. Returning the serched job, and run this function again when job.done() is `True`.")
        return JobOutputData({
            "job": job,
            "job_id": job_id,
            "queue_info": job.queue_info(),
            "queue_position": job.queue_position(),
            "runnig": True,
            "done": False
        })
        
    # when the job is done
    # 2: get the result
    result = job.result()
    task_progress.update(1)

    # 3: get the backend
    backend_name = result.backend_name
    backend = service.backend(backend_name)
    task_progress.update(1)

    # 4: get the metrics
    metrics = job.metrics() #dict
    est_start_time = metrics['estimated_start_time']
    est_start_time_dt = dt.fromisoformat(est_start_time)
    task_progress.update(1)

    # 5: get the properties
    properties = job.properties() # backend properties
    property_dict_0 = properties.to_dict()
    property_dict = {
        "last_update_date": timeToStr(property_dict_0["last_update_date"]),
        "qubits": process_qubit_data(property_dict_0["qubits"]),  # done
        "gates": process_gate_data(property_dict_0["gates"]),  # done
        "general": process_nudv_data(property_dict_0["general"]),  # done
        "general_qlists": property_dict_0["general_qlists"] if "general_qlists" in property_dict_0 else None,
        "faulty_qubits": properties.faulty_qubits(),  # terminal
        "faulty_gates": process_gate_data(
            properties.faulty_gates()
        ),  # need processing (same as gates)
    }
    task_progress.update(1)

    # 5-1: get the configurations
    _machine_data = backend.configuration().to_dict()
    machine_data = {
        "backend_name": _machine_data["backend_name"],
        "backend_version": _machine_data["backend_version"],
        "gates": _machine_data["gates"],
        "simulator": _machine_data["simulator"],
        "online_date": timeToStr(_machine_data["online_date"]) if "online_date" in property_dict_0 else "",
        "basis_gates": _machine_data["basis_gates"] if "basis_gates" in _machine_data else []
    }
    
    # 6: get the counts and other meta info
    counts = result.get_counts()
    n_shots = result.results[0].shots
    meas_level = result.results[0].meas_level # Measurement level
    task_progress.update(1)

    # 7: other meta info
    session_id = job.session_id
    program_id = job.program_id
    creation_date = job.creation_date
    task_progress.update(1)

    # 8: transpiled circuit retrieval
    init_qubits = job.inputs['init_qubits']
    memory_use = job.inputs['memory']
    meas_return = job.inputs['meas_return']
    task_progress.update(1)

    # 9: get circuit
    transpiled_circuit = job.inputs["circuits"][0]
    transpiled_circuit_layout = getCircuitLayout(transpiled_circuit)
    transpiled_circuit_qasm2 = None
    try:
        transpiled_circuit_qasm2 = qasm2.dumps(transpiled_circuit)
    except:
        transpiled_circuit_qasm2 = None
    transpiled_circuit_qasm3 = None
    try:
        transpiled_circuit_qasm3 = qasm3.dumps(transpiled_circuit)
    except:
        transpiled_circuit_qasm3 = None
    task_progress.update(1)

    #10: original circuit layout
    original_circuit_layout = None
    original_circuit_qasm2 = None
    original_circuit_qasm3 = None
    if original_circuit is not None:
        original_circuit_layout = getCircuitLayout(original_circuit)
        try:
            original_circuit_qasm2 = qasm2.dumps(original_circuit)
        except:
            original_circuit_qasm2 = None
        try:
            original_circuit_qasm3 = qasm3.dumps(original_circuit)
        except:
            original_circuit_qasm3 = None
    task_progress.update(1)
    
    return JobOutputData({
        "job": job,
        "job_id": job_id,
        "runnig": False,
        "done": True,
        "backend": backend,
        "backend_name": backend_name,
        "metrics": metrics,
        "est_start_time": timeToStr(est_start_time_dt),
        "backend_properties": property_dict,
        "machine_data": machine_data,
        "counts": counts,
        "n_shots": n_shots,
        "meas_level": meas_level,
        "session_id": session_id,
        "program_id": program_id,
        "creation_date": timeToStr(creation_date),
        "init_qubits": init_qubits,
        "memory_use": memory_use,
        "meas_return": meas_return,
        "transpiled_circuit": transpiled_circuit,
        "transpiled_circuit_layout": transpiled_circuit_layout[0],
        "bit_match": transpiled_circuit_layout[1],
        "transpiled_circuit_global_phase": transpiled_circuit_layout[2],
        "transpiled_circuit_qasm2": transpiled_circuit_qasm2,
        "transpiled_circuit_qasm3": transpiled_circuit_qasm3,
        "original_circuit": original_circuit,
        "original_circuit_layout": original_circuit_layout[0],
        "original_circuit_global_phase": original_circuit_layout[2],
        "original_circuit_qasm2": original_circuit_qasm2,
        "original_circuit_qasm3": original_circuit_qasm3,
    })
    


def processSimJobData(job, backend, original_circuit, transpiled_circuit):
    # progress bar
    task_progress = tqdm(total=n_tasks)
    
    # 1: get the job
    job_id = job.job_id()
    task_progress.update(1)

    if not job.done():
        print(f"The job `{job_id}` is not done yet. Returning the serched job, and run this function again when job.done() is `True`.")
        return JobOutputData({
            "job": job,
            "job_id": job_id,
            "queue_info": job.queue_info(),
            "queue_position": job.queue_position(),
            "runnig": True,
            "done": False
        })
        
    # when the job is done
    # 2: get the result
    result = job.result()
    task_progress.update(1)

    # 3: get the backend
    backend_name = result.backend_name
    task_progress.update(1)

    # 4: get the metrics
    metrics = {}
    est_start_time = result.date
    est_start_time_dt = dt.fromisoformat(est_start_time)
    task_progress.update(1)

    # 5: get the properties
    properties = backend.properties() # backend properties
    if properties is not None:
        property_dict_0 = properties.to_dict()
        property_dict = {
            "last_update_date": timeToStr(property_dict_0["last_update_date"]),
            "qubits": process_qubit_data(property_dict_0["qubits"]),  # done
            "gates": process_gate_data(property_dict_0["gates"]),  # done
            "general": process_nudv_data(property_dict_0["general"]),  # done
            "general_qlists": property_dict_0["general_qlists"] if "general_qlists" in property_dict_0 else None,
            "faulty_qubits": properties.faulty_qubits(),  # terminal
            "faulty_gates": process_gate_data(
                properties.faulty_gates()
            ),  # need processing (same as gates)
        }
    else:
        property_dict_0 = {}
        property_dict = {
            "last_update_date": None,
            "qubits": None,
            "gates": None,
            "general": None,
            "general_qlists": None,
            "faulty_qubits": None,
            "faulty_gates": None
        }
            
    task_progress.update(1)

    # 5-1: get the configurations
    _machine_data = backend.configuration().to_dict()
    machine_data = {
        "backend_name": _machine_data["backend_name"],
        "backend_version": _machine_data["backend_version"],
        "gates": _machine_data["gates"],
        "simulator": _machine_data["simulator"],
        "online_date": timeToStr(_machine_data["online_date"]) if "online_date" in property_dict_0 else "",
        "basis_gates": _machine_data["basis_gates"] if "basis_gates" in _machine_data else []
    }
    
    # 6: get the counts and other meta info
    counts = result.get_counts()
    n_shots = result.results[0].shots
    meas_level = int(result.results[0].meas_level) # Measurement level
    task_progress.update(1)

    # 7: other meta info
    session_id = None
    program_id = None
    creation_date = None
    task_progress.update(1)

    # 8: transpiled circuit retrieval
    init_qubits = None
    memory_use = None
    meas_return = None
    task_progress.update(1)

    # 9: get circuit
    transpiled_circuit_layout = getCircuitLayout(transpiled_circuit)
    transpiled_circuit_qasm2 = None
    # try:
    #     transpiled_circuit_qasm2 = qasm2.dumps(transpiled_circuit)
    # except:
    #     transpiled_circuit_qasm2 = None
    transpiled_circuit_qasm3 = None
    # try:
    #     transpiled_circuit_qasm3 = qasm3.dumps(transpiled_circuit)
    # except:
    #     transpiled_circuit_qasm3 = None
    task_progress.update(1)

    #10: original circuit layout
    original_circuit_layout = None
    original_circuit_qasm2 = None
    original_circuit_qasm3 = None
    if original_circuit is not None:
        original_circuit_layout = getCircuitLayout(original_circuit)
    #     try:
    #         original_circuit_qasm2 = qasm2.dumps(original_circuit)
    #     except:
    #         original_circuit_qasm2 = None
    #     try:
    #         original_circuit_qasm3 = qasm3.dumps(original_circuit)
    #     except:
    #         original_circuit_qasm3 = None
    task_progress.update(1)
    
    return JobOutputData({
        "job": job,
        "job_id": job_id,
        "runnig": False,
        "done": True,
        "backend": backend,
        "backend_name": backend_name,
        "metrics": metrics,
        "est_start_time": timeToStr(est_start_time_dt),
        "backend_properties": property_dict,
        "machine_data": machine_data,
        "counts": counts,
        "n_shots": n_shots,
        "meas_level": meas_level,
        "session_id": session_id,
        "program_id": program_id,
        "creation_date": None,
        "init_qubits": init_qubits,
        "memory_use": memory_use,
        "meas_return": meas_return,
        "transpiled_circuit": transpiled_circuit,
        "transpiled_circuit_layout": transpiled_circuit_layout[0],
        "bit_match": transpiled_circuit_layout[1],
        "transpiled_circuit_global_phase": transpiled_circuit_layout[2],
        "transpiled_circuit_qasm2": transpiled_circuit_qasm2,
        "transpiled_circuit_qasm3": transpiled_circuit_qasm3,
        "original_circuit": original_circuit,
        "original_circuit_layout": original_circuit_layout[0],
        "original_circuit_global_phase": original_circuit_layout[2],
        "original_circuit_qasm2": original_circuit_qasm2,
        "original_circuit_qasm3": original_circuit_qasm3,
    })

example_metrics = {'timestamps': {'created': '2024-08-17T22:12:01.968329Z',
  'finished': '2024-08-17T22:14:25.079Z',
  'running': '2024-08-17T22:12:03.249Z'},
 'bss': {'seconds': 93},
 'usage': {'quantum_seconds': 93, 'seconds': 93},
 'executions': 4000,
 'num_circuits': 1,
 'num_qubits': [127],
 'circuit_depths': [115439],
 'qiskit_version': 'qiskit_ibm_runtime-0.23.0,qiskit-1.1.0*,qiskit_aer-0.14.2*,qiskit_machine_learning-0.7.2',
 'estimated_start_time': '2024-08-17T22:12:02.577Z',
 'estimated_completion_time': '2024-08-17T22:13:35.086Z',
 'caller': 'qiskit'}