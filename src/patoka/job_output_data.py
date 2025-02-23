from .draw_uncertainty import drawStateUncertainty
from .backend_design import get_backend_circuit_nodes
from .get_fake_backend import create_fake_backend
import math
import json
import numpy as np
import time


def json_type_parser(comp):
    if isinstance(comp, complex):
        return str(comp.real) + ("+" if comp.imag >= 0 else "-") + str(comp.imag) + "j"
    else:
        return comp


circuit_units = 1000


class JobOutputData:
    def __init__(self, data):
        self.job = data["job"] if "job" in data else None
        self.job_id = data["job_id"] if "job_id" in data else None
        self.running = data["running"] if "running" in data else None
        self.done = data["done"] if "done" in data else None
        self.queue_info = data["queue_info"] if "queue_info" in data else None
        self.queue_position = data["queue_position"] if "queue_position" in data else None
        self.backend = data["backend"] if "backend" in data else None
        self.backend_name = data["backend_name"] if "backend_name" in data else None
        self.metrics = data["metrics"] if "metrics" in data else None
        self.est_start_time = data["est_start_time"] if "est_start_time" in data else None
        self.backend_properties = data["backend_properties"] if "backend_properties" in data else None
        self.machine_data = data["machine_data"] if "machine_data" in data else None
        self.counts = data["counts"] if "counts" in data else None
        self.n_shots = data["n_shots"] if "n_shots" in data else None
        self.meas_level = data["meas_level"] if "meas_level" in data else None
        self.session_id = data["session_id"] if "session_id" in data else None
        self.program_id = data["program_id"] if "program_id" in data else None
        self.creation_date = data["creation_date"] if "creation_date" in data else None
        self.init_qubits = data["init_qubits"] if "init_qubits" in data else None
        self.memory_use = data["memory_use"] if "memory_use" in data else None
        self.meas_return = data["meas_return"] if "meas_return" in data else None
        self.transpiled_circuit = data["transpiled_circuit"] if "transpiled_circuit" in data else None
        self.transpiled_circuit_layout = data["transpiled_circuit_layout"] if "transpiled_circuit_layout" in data else None
        self.transpiled_circuit_global_phase = data["transpiled_circuit_global_phase"] if "transpiled_circuit_global_phase" in data else None
        self.transpiled_circuit_qasm2 = data["transpiled_circuit_qasm2"] if "transpiled_circuit_qasm2" in data else None
        self.transpiled_circuit_qasm3 = data["transpiled_circuit_qasm3"] if "transpiled_circuit_qasm3" in data else None
        self.original_circuit = data["original_circuit"] if "original_circuit" in data else None
        self.original_circuit_layout = data["original_circuit_layout"] if "original_circuit_layout" in data else None
        self.original_circuit_global_phase = data["original_circuit_global_phase"] if "original_circuit_global_phase" in data else None
        self.original_circuit_qasm2 = data["original_circuit_qasm2"] if "original_circuit_qasm2" in data else None
        self.original_circuit_qasm3 = data["original_circuit_qasm3"] if "original_circuit_qasm3" in data else None
        self.bit_match = data["bit_match"] if "bit_match" in data else None
        self.uncertainty_data = data["uncertainty_data"] if "uncertainty_data" in data else None
        self.physical_qubits = data["physical_qubits"] if "physical_qubits" in data else None
        self.physical_gates = data["physical_gates"] if "physical_gates" in data else None
        self.machine_design = data["machine_design"] if "machine_design" in data else None
        self.additionals = data["additionals"] if "additionals" in data else {}

        self.setUsedQG()
        self.getFakeBackend()
        self.getMachineDesign()

        self.pagination_unit = 50

    def setUsedQG(self):
        if self.transpiled_circuit is not None:
            temp_qubits = None
            if self.physical_qubits is None:
                self.physical_qubits = []
                temp_qubits = []
            temp_gates = None
            if self.physical_gates is None:
                self.physical_gates = []
                temp_gates = []
            for op in self.transpiled_circuit.data:
                q_index = [q._index for q in op.qubits]
                if temp_qubits is not None:
                    for q in q_index:
                        if q not in temp_qubits:
                            temp_qubits.append(q)
                if temp_gates is not None:
                    g_expr = op.operation.name + "__" + "_".join([str(q) for q in q_index])
                    if g_expr not in temp_gates:
                        temp_gates.append(g_expr)
            if temp_qubits is not None:
                self.physical_qubits = temp_qubits
            if temp_gates is not None:
                self.physical_gates = [
                    {"gate": g.split("__")[0],
                     "qubits": g.split("__")[1].split("_")}
                    for g in temp_gates
                ]

    def getFakeBackend(self, use_aer=True):
        if self.backend is None:
            self.backend = create_fake_backend(self.backend_name, use_aer)

    def getMachineDesign(self):
        if self.machine_design is None and self.backend_name is not None and self.backend_name != "aer_simulator":
            self.machine_design = {"nodes": None, "index": None, "edges": None}
            bname = self.backend_name
            self.machine_design["nodes"] = get_backend_circuit_nodes(bname.replace("ibm_", ""))
            if self.machine_design["nodes"] is not None:
                self.machine_design["index"] = [q["index"] for q in self.machine_design["nodes"]]
            if self.backend is not None:
                self.machine_design["edges"] = list(self.backend.coupling_map.get_edges())
        elif self.backend_name == "aer_simulator":
            self.machine_design = {"nodes": None, "index": None, "edges": None}

    def toJSON(self):
        return json.dumps({
            "job_id": self.job_id,
            "running": self.running,
            "done": self.done,
            "queue_info": self.queue_info,
            "queue_position": self.queue_position,
            "backend_name": self.backend_name,
            "metrics": self.metrics,
            "est_start_time": self.est_start_time,
            "backend_properties": self.backend_properties,
            "machine_data": self.machine_data,
            "counts": self.counts,
            "n_shots": self.n_shots,
            "meas_level": self.meas_level,
            "session_id": self.session_id,
            "program_id": self.program_id,
            "creation_date": self.creation_date,
            "init_qubits": self.init_qubits,
            "memory_use": self.memory_use,
            "meas_return": self.meas_return,
            "transpiled_circuit_layout": self.transpiled_circuit_layout,
            "transpiled_circuit_global_phase": self.transpiled_circuit_global_phase,
            "transpiled_circuit_qasm2": self.transpiled_circuit_qasm2,
            "transpiled_circuit_qasm3": self.transpiled_circuit_qasm3,
            "original_circuit_layout": self.original_circuit_layout,
            "original_circuit_global_phase": self.original_circuit_global_phase,
            "original_circuit_qasm2": self.original_circuit_qasm2,
            "original_circuit_qasm3": self.original_circuit_qasm3,
            "bit_match": self.bit_match,
            "uncertainty_data": self.uncertainty_data,
            "physical_qubits": self.physical_qubits,
            "physical_gates": self.physical_gates,
            "machine_design": self.machine_design,
            "additionals": self.additionals
        }, default=json_type_parser)

    def toCountsJSON(self):
        return json.dumps(compress_count(self.counts))

    def streamNextCircuit(self, view, mode):
        if mode is None:
            return None
        elif mode == "original":
            view.data_update = json.dumps({"set": {"original_circuit_layout": []}})
            last_index = self.last_original_layer_streamed
            if last_index is None:
                last_index = 0
            if last_index >= len(self.original_circuit_layout):
                return None
            n_o_layers = min(len(self.original_circuit_layout),  last_index + 5 * circuit_units)
            o_layer_cnt = last_index
            while o_layer_cnt < n_o_layers:
                next_cnt = min(o_layer_cnt + circuit_units, n_o_layers)
                layers_to_extract = self.original_circuit_layout[o_layer_cnt:next_cnt]
                view.data_update = json.dumps({"append": {"original_circuit_layout": layers_to_extract}})
                print("passing original circuit layout data " + str(o_layer_cnt) + "~")
                time.sleep(0.5)
                o_layer_cnt = next_cnt
            view.data_update = json.dumps({"set": {"original_circuit_layout_index": [self.last_original_layer_streamed, o_layer_cnt]}})
            time.sleep(0.2)
            print("Complete passing original circuit layout upto " + str(o_layer_cnt))
            self.last_original_layer_streamed = o_layer_cnt

        elif mode == "transpiled":
            view.data_update = json.dumps({"set": {"transpiled_circuit_layout": []}})
            last_index = self.last_transpiled_layer_streamed
            if last_index is None:
                last_index = 0
            if last_index >= len(self.transpiled_circuit_layout):
                return None
            n_t_layers = min(len(self.transpiled_circuit_layout),  last_index + 5 * circuit_units)
            t_layer_cnt = last_index
            while t_layer_cnt < n_t_layers:
                next_cnt = min(t_layer_cnt + circuit_units, n_t_layers)
                layers_to_extract = self.transpiled_circuit_layout[t_layer_cnt:next_cnt]
                view.data_update = json.dumps({"append": {"transpiled_circuit_layout": layers_to_extract}})
                print("passing transpiled circuit layout data " + str(t_layer_cnt) + "~")
                time.sleep(0.5)
                t_layer_cnt = next_cnt
            view.data_update = json.dumps({"set": {"transpiled_circuit_layout_index": [self.last_transpiled_layer_streamed, t_layer_cnt]}})
            time.sleep(0.2)
            print("Complete passing transpiled circuit layout upto " + str(t_layer_cnt))
            self.last_transpiled_layer_streamed = t_layer_cnt

    def streamPrevCircuit(self, view, mode):
        if mode is None:
            return None
        elif mode == "original":
            view.data_update = json.dumps({"set": {"original_circuit_layout": []}})
            last_index = self.last_original_layer_streamed
            if last_index is None:
                last_index = 0
            if last_index >= len(self.original_circuit_layout):
                last_index = len(self.original_circuit_layout)
            n_o_layers = min(len(self.original_circuit_layout),  last_index - 5 * circuit_units)
            if n_o_layers < 0:
                n_o_layers = min(len(self.original_circuit_layout),  5)
            o_layer_cnt = max(last_index - 10 * circuit_units, 0)
            start_index = o_layer_cnt
            while o_layer_cnt < n_o_layers:
                next_cnt = min(o_layer_cnt + circuit_units, n_o_layers)
                layers_to_extract = self.original_circuit_layout[o_layer_cnt:next_cnt]
                view.data_update = json.dumps({"append": {"original_circuit_layout": layers_to_extract}})
                print("passing original circuit layout data " + str(o_layer_cnt) + "~")
                time.sleep(0.5)
                o_layer_cnt = next_cnt
            view.data_update = json.dumps({"set": {"original_circuit_layout_index": [start_index, t_layer_cnt]}})
            time.sleep(0.2)
            print("Complete passing original circuit layout upto " + str(o_layer_cnt))
            self.last_original_layer_streamed = o_layer_cnt

        elif mode == "transpiled":
            view.data_update = json.dumps({"set": {"transpiled_circuit_layout": []}})
            last_index = self.last_transpiled_layer_streamed
            if last_index is None:
                last_index = 0
            if last_index >= len(self.transpiled_circuit_layout):
                last_index = len(self.transpiled_circuit_layout)
            n_t_layers = min(len(self.transpiled_circuit_layout),  last_index - 5 * circuit_units)
            if n_t_layers < 0:
                n_t_layers = min(len(self.transpiled_circuit_layout),  5)
            t_layer_cnt = max(last_index - 10 * circuit_units, 0)
            start_index = t_layer_cnt
            while t_layer_cnt < n_t_layers:
                next_cnt = min(t_layer_cnt + circuit_units, n_t_layers)
                layers_to_extract = self.transpiled_circuit_layout[t_layer_cnt:next_cnt]
                view.data_update = json.dumps({"append": {"transpiled_circuit_layout": layers_to_extract}})
                print("passing transpiled circuit layout data " + str(t_layer_cnt) + "~")
                time.sleep(0.5)
                t_layer_cnt = next_cnt
            view.data_update = json.dumps({"set": {"transpiled_circuit_layout_index": [start_index, t_layer_cnt]}})
            time.sleep(0.2)
            print("Complete passing transpiled circuit layout upto " + str(t_layer_cnt))
            self.last_transpiled_layer_streamed = t_layer_cnt

    def streamJSON(self, view):
        basic_data = {
            "job_id": self.job_id,
            "running": self.running,
            "done": self.done,
            "queue_info": self.queue_info,
            "queue_position": self.queue_position,
            "backend_name": self.backend_name,
            "metrics": self.metrics,
            "est_start_time": self.est_start_time,
            "backend_properties": self.backend_properties,
            "machine_data": self.machine_data,
            "n_shots": self.n_shots,
            "meas_level": self.meas_level,
            "session_id": self.session_id,
            "program_id": self.program_id,
            "creation_date": self.creation_date,
            "init_qubits": self.init_qubits,
            "memory_use": self.memory_use,
            "meas_return": self.meas_return,
            "physical_qubits": self.physical_qubits,
            "physical_gates": self.physical_gates,
            "machine_design": self.machine_design,
            "transpiled_circuit_layout": [],
            "transpiled_circuit_global_phase": self.transpiled_circuit_global_phase,
            "transpiled_circuit_qasm2": "",
            "transpiled_circuit_qasm3": "",
            "transpiled_circuit_layout_index": [],
            "original_circuit_layout": [],
            "original_circuit_global_phase": self.original_circuit_global_phase,
            "original_circuit_qasm2": "",
            "original_circuit_qasm3": "",
            "original_circuit_layout_index": [],
            "bit_match": self.bit_match,
            "counts": {}
        }
        view.data_update = json.dumps({"set": basic_data})
        print("passing basic data")
        time.sleep(0.5)
        # pass counts
        count_units = 10000
        count_keys = list(self.counts.keys())
        n_count_keys = len(count_keys)
        count_cnt = 0
        while count_cnt < n_count_keys:
            next_cnt = min(count_cnt + count_units, n_count_keys)
            counts_to_extract = count_keys[count_cnt:next_cnt]
            pass_counts = {key: self.counts[key] for key in counts_to_extract}
            view.data_update = json.dumps({"append": {"counts": pass_counts}})
            print("passing counts data " + str(count_cnt) + "~")
            time.sleep(0.5)
            count_cnt = next_cnt
        print("Complete passing counts data")

        # pass uncertainty
        if self.uncertainty_data is not None:
            uncertainty_keys = list(self.uncertainty_data.keys())
            for key in uncertainty_keys:
                view.data_update = json.dumps({"append": {"uncertainty_data": {key: self.uncertainty_data[key]}}})
                print("passing uncertainty data " + key)
                time.sleep(0.5)
            print("Complete passing uncertainty data")

        # pass original circuits
        n_o_layers = min(len(self.original_circuit_layout), 5 * circuit_units)
        o_layer_cnt = 0
        while o_layer_cnt < n_o_layers:
            next_cnt = min(o_layer_cnt + circuit_units, n_o_layers)
            layers_to_extract = self.original_circuit_layout[o_layer_cnt:next_cnt]
            view.data_update = json.dumps({"append": {"original_circuit_layout": layers_to_extract}})
            print("passing original circuit layout data " + str(o_layer_cnt) + "~")
            time.sleep(0.5)
            o_layer_cnt = next_cnt
        view.data_update = json.dumps({"set": {"original_circuit_layout_index": [0, o_layer_cnt]}})
        time.sleep(0.2)
        print("Complete passing original circuit layout upto " + str(o_layer_cnt))

        self.last_original_layer_streamed = o_layer_cnt

        # pass transplied circuits
        n_t_layers = min(len(self.transpiled_circuit_layout), 5 * circuit_units)
        t_layer_cnt = 0
        while t_layer_cnt < n_t_layers:
            next_cnt = min(t_layer_cnt + circuit_units, n_t_layers)
            layers_to_extract = self.transpiled_circuit_layout[t_layer_cnt:next_cnt]
            view.data_update = json.dumps({"append": {"transpiled_circuit_layout": layers_to_extract}})
            print("passing transpiled circuit layout data " + str(t_layer_cnt) + "~")
            time.sleep(0.5)
            t_layer_cnt = next_cnt
        view.data_update = json.dumps({"set": {"transpiled_circuit_layout_index": [0, t_layer_cnt]}})
        time.sleep(0.2)
        print("Complete passing transpiled circuit layout upto " + str(t_layer_cnt))
        self.last_transpiled_layer_streamed = t_layer_cnt

        # pass additionals
        if len(self.additionals.keys()) > 0:
            view.data_update = json.dumps({"set": {"additionals": self.additionals}})
            time.sleep(0.2)
            print("Complete passing additional data")

    def toJSON4Interface(self, transpiled_circuit_page=0, original_circuit_page=0, include_qasm=False):
        t_depth = len(self.transpiled_circuit_layout)
        o_depth = len(self.original_circuit_layout)

        t_page_range = [self.pagination_unit * transpiled_circuit_page,
                        min(self.pagination_unit * (transpiled_circuit_page + 1), t_depth - 1)]

        t_pages = math.ceil(t_depth / self.pagination_unit)

        o_page_range = [self.pagination_unit * original_circuit_page,
                        min(self.pagination_unit * (original_circuit_page + 1), o_depth - 1)]

        o_pages = math.ceil(o_depth / self.pagination_unit)

        self.transpiled_circuit_page_range = t_page_range
        self.transpiled_circuit_pages = t_pages
        self.transpiled_circuit_page = transpiled_circuit_page
        self.original_circuit_page_range = o_page_range
        self.original_circuit_pages = o_pages
        self.original_circuit_page = original_circuit_page

        return json.dumps({
            "job_id": self.job_id,
            "running": self.running,
            "done": self.done,
            "queue_info": self.queue_info,
            "queue_position": self.queue_position,
            "backend_name": self.backend_name,
            "metrics": self.metrics,
            "est_start_time": self.est_start_time,
            "backend_properties": self.backend_properties,
            "machine_data": self.machine_data,
            "n_shots": self.n_shots,
            "meas_level": self.meas_level,
            "session_id": self.session_id,
            "program_id": self.program_id,
            "creation_date": self.creation_date,
            "init_qubits": self.init_qubits,
            "memory_use": self.memory_use,
            "meas_return": self.meas_return,
            # "transpiled_circuit_layout": self.transpiled_circuit_layout[t_page_range[0]:t_page_range[1]],
            # "transpiled_circuit_global_phase": self.transpiled_circuit_global_phase,
            # "transpiled_circuit_qasm2": self.transpiled_circuit_qasm2 if include_qasm else None,
            # "transpiled_circuit_qasm3": self.transpiled_circuit_qasm3 if include_qasm else None,
            # "original_circuit_layout": self.original_circuit_layout[o_page_range[0]:o_page_range[1]],
            # "original_circuit_global_phase": self.original_circuit_global_phase,
            # "original_circuit_qasm2": self.original_circuit_qasm2 if include_qasm else None,
            # "original_circuit_qasm3": self.original_circuit_qasm3 if include_qasm else None,
            # "bit_match": self.bit_match,
            # "transpiled_circuit_page":  transpiled_circuit_page,
            # "transpiled_circuit_total_page": t_pages,
            # "transpiled_circuit_page_range": t_page_range,
            # "original_circuit_page":  original_circuit_page,
            # "original_circuit_total_page": o_pages,
            # "original_circuit_page_range": o_page_range,
            "uncertainty_data": self.uncertainty_data,
            "physical_qubits": self.physical_qubits,
            "physical_gates": self.physical_gates,
            "machine_design": self.machine_design,
            "additionals": self.additionals
        }, default=json_type_parser)

    def save(self, fn):
        with open(fn, "w") as f:
            f.write(self.toJSON())

    def simulate(self, shots=None, use_aer=True):
        if self.transpiled_circuit is None or self.backend_name is None:
            print("simulation information not available")
            return None
        if self.backend is None:
            # create backend
            self.backend = create_fake_backend(self.backend_name, use_aer)
            # simulate backend with properties
            self.backend = inject_properties(self.backend, self.backend_properties, self.machine_data)
            # get shots
            if shots is None:
                shots = self.n_shots
            if shots is None:
                shots = sum(list(self.counts.values()))
            if shots is None:
                shots = 1000
            # run simulation

        self.sim_job = self.backend.run(self.transpiled_circuit, shots=shots)

        return self.sim_job

    def prepare_gate_props(self):
        self.gate_propperty_map = {}
        for i in range(len(self.backend_properties["gates"])):
            g = self.backend_properties["gates"][i]
            k = g["gate"] + "__" + "_".join([str(q) for q in g["qubits"]])
            self.gate_propperty_map[k] = i

    def generate_hea(self, sampling_counts=None, sample_size=None, ci_alpha=0.95, bootstrap=False, design={}):
        serialized_transpiled_circuit = serialize_circuit_layout(self.transpiled_circuit_layout)
        self.prepare_gate_props()
        self.uncertainty_data = drawStateUncertainty(self.counts,
                                                     self.backend_properties["qubits"],
                                                     self.backend_properties["gates"],
                                                     self.gate_propperty_map,
                                                     serialized_transpiled_circuit,
                                                     sampling_counts,
                                                     sample_size,
                                                     ci_alpha,
                                                     bootstrap,
                                                     design).toDict()

    def setAdditionalData(self, key, value):
        self.additionals[key] = value


def serialize_circuit_layout(layout):
    serial = []
    for layer in layout:
        for op in layer["operations"]:
            serial.append(op)
    return serial


def compress_count(counts):
    output = {}
    for st in counts:
        cnt = counts[st]
        if cnt not in output:
            output[cnt] = []
        output[cnt].append(int(st[::-1], 2))
    return output
