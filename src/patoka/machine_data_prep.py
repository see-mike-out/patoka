import pprint
import datetime
from .machine_viewer_meta import meas_return_desc
from .machine_data_processing import (
    timeToStr,
    process_qubit_data,
    process_gate_data,
    process_nudv_data,
    process_operations_data,
    process_instructions_data,
)
from .backend_design import get_backend_circuit_nodes
import json


def getMachineMetaInfo(backend):
    if backend.name == "aer_simulator":
        return {"name": "Aer", "is_simulator": True}
    else:
        name = backend.properties().backend_name
        is_simulator = backend.configuration().simulator
        return {"name": backend.name, "is_simulator": is_simulator}


def getMachineInformation(backend, times=[]):
    calltime = timeToStr(datetime.datetime.now())
    # attributes
    # name
    name = backend.name
    name = name.replace("ibmq_", "")
    name = name.replace("ibm_", "")
    name = name.replace("fake_", "")
    name = name.replace("aer_simulator_from(", "")
    name = name.replace(")", "")
    machine_nodes = get_backend_circuit_nodes(name)
    is_simulator = backend.configuration().simulator
    # description
    description = backend.description
    # online since...
    online_date = backend.online_date
    # backend version
    backend_version = backend.backend_version
    # Return the CouplingMap object (todo)
    coupling_map = backend.coupling_map
    # the system time resolution of input signals; required to be implemented if the backend supports Pulse scheduling
    input_time_resolution = backend.dt
    # the system time resolution of output signals
    try: 
        output_time_resolution = backend.dtm
    except:
        output_time_resolution = None
    # Return the InstructionDurations object (todo)
    instruction_durations = backend.instruction_durations
    # Return the InstructionScheduleMap for the instructions defined in this backend’s target (todo)
    instruction_schedule_map = backend.instruction_schedule_map
    # A list of Instruction tuples on the backend of the form (instruction, (qubits) (todo)
    instructions = backend.instructions
    # The maximum number of circuits (or Pulse schedules) that can be run in a single job. If there is no limit this will return None.
    max_circuits = backend.max_circuits
    # Return the grouping of measurements which are multiplexed; This is required to be implemented if the backend supports Pulse scheduling.
    try: 
        meas_map = backend.meas_map
    except:
        meas_map = None
    # Return the number of qubits the backend has.
    num_qubits = backend.num_qubits
    # A list of instruction names that the backend supports.
    operation_names = backend.operation_names
    # A list of Instruction instances that the backend supports. (todo)
    operations = backend.operations
    # Return the options for the backend
    options = backend.options
    option_dict = dict(options)
    if "noise_model" in option_dict:
        del option_dict["noise_model"]
    if "meas_level" in option_dict:
        option_dict["meas_level"] = int(option_dict["meas_level"])
    if "meas_return" in option_dict:
        option_dict["meas_return"] = str(option_dict["meas_return"])
        option_dict["meas_return_desc"] = meas_return_desc[option_dict["meas_return"]]

    # Return the Provider responsible for the backend
    provider = backend.provider
    # A qiskit.transpiler.Target object for the backend
    target = backend.target

    # methods
    # Return the pulse defaults for the backend; None if the backend does not support pulse
    pulse_defaults = backend.defaults() if hasattr(backend, "defaults") else None
    # Return the default translation stage plugin name for IBM backends
    if hasattr(backend, "get_translation_stage_plugin"):
        translation_stage_plugin = backend.get_translation_stage_plugin()
    else:
        translation_stage_plugin = None
    # Return the backend properties, subject to optional filtering. (todo)
    # This data describes qubits properties (such as T1 and T2), gates properties (such as gate length and error), and other general properties of the backend.
    properties = backend.properties()
    property_dict_0 = properties.to_dict()
    property_dict = {
        "last_update_date": timeToStr(property_dict_0["last_update_date"]),
        "qubits": process_qubit_data(property_dict_0["qubits"]),  # done
        "gates": process_gate_data(property_dict_0["gates"]),  # done
        "general": process_nudv_data(property_dict_0["general"]),  # done
        "general_qlists": property_dict_0["general_qlists"] if "general_qlists" in property_dict_0 else [],
        "faulty_qubits": properties.faulty_qubits(),  # terminal
        "faulty_gates": process_gate_data(
            properties.faulty_gates()
        ),  # need processing (same as gates)
    }

    # properties time machine
    property_times = False
    timed_properties = {}
    if len(times) > 0:
        property_times = True
        for time in times:
            temp_prop = backend.properties(datetime=time)
            temp_prop_dict_0 = temp_prop.to_dict()
            temp_prop_dict = {
                "last_update_date": timeToStr(temp_prop_dict_0["last_update_date"]),
                "qubits": process_qubit_data(temp_prop_dict_0["qubits"]),  # done
                "gates": process_gate_data(temp_prop_dict_0["gates"]),  # done
                "general": process_nudv_data(temp_prop_dict_0["general"]),  # done
                "general_qlists": temp_prop_dict_0["general_qlists"],
                "faulty_qubits": temp_prop.faulty_qubits(),  # terminal
                "faulty_gates": process_gate_data(
                    temp_prop.faulty_gates()
                ),  # need processing (same as gates)
            }
            timed_properties[timeToStr(time)] = temp_prop_dict

    status = backend.status()
    
    return MachineData(
        {
            "asof": calltime,  # terminal #dumped
            "name": name,  # terminal #dumped
            "description": description,  # terminal #dumped
            "backend_version": backend_version,  # terminal #dumped
            "provider": provider,  # terminal #dumped
            "is_simulator": is_simulator,
            "status": status.to_dict(),  # done #dumped
            "online_date": timeToStr(online_date),  # terminal #dumped
            "max_circuits": max_circuits,  # terminal #dumped
            "options": option_dict,  # done #dumped
            "properties": property_dict,  # done
            "property_times": property_times,
            "timed_properties": timed_properties,
            "num_qubits": num_qubits,  # terminal #dumped
            "circuit_nodes": machine_nodes,
            "coupling_map": {
                "size": coupling_map.size(),
                "distance_matrix": coupling_map.distance_matrix.tolist(),
                "nodes": list(coupling_map.physical_qubits),
                "edges": list(coupling_map.get_edges()),
                "is_symmetric": coupling_map.is_symmetric,
            },  # done
            "operation_names": operation_names,  # terminal #dumped
            "operations": process_operations_data(operations),  # done #dumped
            "instructions": process_instructions_data(
                instructions, instruction_durations
            ),  # done #dumped
            # "instruction_durations": instruction_durations, # with instructions
            # "instruction_schedule_map": instruction_schedule_map, # skip
            "pulse_defaults": {
                "qubit_freq_est": pulse_defaults.qubit_freq_est if pulse_defaults is not None else None,
                "meas_freq_est": pulse_defaults.meas_freq_est if pulse_defaults is not None else None,
            },  # done #dumped
            "meas_map": meas_map,  # terminal #dumped
            "input_time_resolution": input_time_resolution,  # terminal #dumped
            "output_time_resolution": output_time_resolution,  # terminal #dumped
            # "target": target, #skip
            "translation_stage_plugin": translation_stage_plugin,  # terminal #dumped
        }
    )


class MachineData:
    def __init__(self, data):
        self.data = data

    def toJSON(self):
        return json.dumps(self.data)
