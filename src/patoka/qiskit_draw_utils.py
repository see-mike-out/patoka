# This code is adapted from the origianl Qiskit code.
# The adpation is only for the return object from the "_get_layered_instructions" function to get the raw output.
#
# Original copyright statement:
#
# This code is part of Qiskit.
#
# (C) Copyright IBM 2017.
#
# This code is licensed under the Apache License, Version 2.0. You may
# obtain a copy of this license in the LICENSE.txt file in the root directory
# of this source tree or at http://www.apache.org/licenses/LICENSE-2.0.
#
# Any modifications or derivative works of this code must retain this
# copyright notice, and modified files need to carry a notice indicating
# that they have been altered from the originals.
#

from collections import OrderedDict
from qiskit.converters import circuit_to_dag
from qiskit.circuit import ( Gate, Measure, )
from qiskit.circuit.controlflow import condition_resources
from qiskit.circuit import QuantumCircuit, Qubit, ControlFlowOp

# newly added part
def getCircuitLayout(circuit):
    layered_instructions = get_layered_instructions(circuit)
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
                "params": inst.op.params,
                "qubits": [],
                "clbits": []
            }
            for qubit in inst.qargs:
                op["qubits"].append({
                    "register": { "name": qubit._register._name, "size": qubit._register._size },
                    "index": qubit._index
                })
            op["qubits"] = tuple(op["qubits"])
            for clbit in inst.cargs:
                op["clbits"].append({
                    "register": { "name": qubit._register._name, "size": qubit._register._size },
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

# Qiskit code

def get_layered_instructions(
    circuit, reverse_bits=False, justify=None, idle_wires=True, wire_order=None, wire_map=None
):
    """
    Given a circuit, return a tuple (qubits, clbits, nodes) where
    qubits and clbits are the quantum and classical registers
    in order (based on reverse_bits or wire_order) and nodes
    is a list of DAGOpNodes.

    Args:
        circuit (QuantumCircuit): From where the information is extracted.
        reverse_bits (bool): If true the order of the bits in the registers is
            reversed.
        justify (str) : `left`, `right` or `none`. Defaults to `left`. Says how
            the circuit should be justified.
        idle_wires (bool): Include idle wires. Default is True.
        wire_order (list): A list of ints that modifies the order of the bits

    Returns:
        Tuple(list,list,list): To be consumed by the visualizer directly.

    Raises:
        VisualizationError: if both reverse_bits and wire_order are entered.
    """
    if justify:
        justify = justify.lower()

    # default to left
    justify = justify if justify in ("right", "none") else "left"

    if wire_map is not None:
        qubits = [bit for bit in wire_map if isinstance(bit, Qubit)]
    else:
        qubits = circuit.qubits.copy()
    clbits = circuit.clbits.copy()
    nodes = []

    # Create a mapping of each register to the max layer number for all measure ops
    # with that register as the target. Then when an op with condition is seen,
    # it will be placed to the right of the measure op if the register matches.
    measure_map = OrderedDict([(c, -1) for c in clbits])

    if reverse_bits and wire_order is not None:
        raise VisualizationError("Cannot set both reverse_bits and wire_order in the same drawing.")

    if reverse_bits:
        qubits.reverse()
        clbits.reverse()
    elif wire_order is not None:
        new_qubits = []
        new_clbits = []
        for bit in wire_order:
            if bit < len(qubits):
                new_qubits.append(qubits[bit])
            else:
                new_clbits.append(clbits[bit - len(qubits)])
        qubits = new_qubits
        clbits = new_clbits

    dag = circuit_to_dag(circuit)
    dag.qubits = qubits
    dag.clbits = clbits

    if justify == "none":
        for node in dag.topological_op_nodes():
            nodes.append([node])
    else:
        nodes = _LayerSpooler(dag, justify, measure_map)

    # Optionally remove all idle wires and instructions that are on them and
    # on them only.
    if not idle_wires:
        for wire in dag.idle_wires(ignore=["barrier", "delay"]):
            if wire in qubits:
                qubits.remove(wire)
            if wire in clbits:
                clbits.remove(wire)

    nodes = [[node for node in layer if any(q in qubits for q in node.qargs)] for layer in nodes]
    
    # modification
    return qubits, clbits, nodes

def _sorted_nodes(dag_layer):
    """Convert DAG layer into list of nodes sorted by node_id
    qiskit-terra #2802
    """
    nodes = dag_layer["graph"].op_nodes()
    # sort into the order they were input
    nodes.sort(key=lambda nd: nd._node_id)
    return nodes


def _get_gate_span(qubits, node):
    """Get the list of qubits drawing this gate would cover
    qiskit-terra #2802
    """
    min_index = len(qubits)
    max_index = 0
    for qreg in node.qargs:
        index = qubits.index(qreg)

        if index < min_index:
            min_index = index
        if index > max_index:
            max_index = index

    # Because of wrapping boxes for mpl control flow ops, this
    # type of op must be the only op in the layer
    if isinstance(node.op, ControlFlowOp):
        span = qubits
    elif node.cargs or getattr(node.op, "condition", None):
        span = qubits[min_index : len(qubits)]
    else:
        span = qubits[min_index : max_index + 1]

    return span



def _sorted_nodes(dag_layer):
    """Convert DAG layer into list of nodes sorted by node_id
    qiskit-terra #2802
    """
    nodes = dag_layer["graph"].op_nodes()
    # sort into the order they were input
    nodes.sort(key=lambda nd: nd._node_id)
    return nodes



class _LayerSpooler(list):
    """Manipulate list of layer dicts for _get_layered_instructions."""

    def __init__(self, dag, justification, measure_map):
        """Create spool"""
        super().__init__()
        self.dag = dag
        self.qubits = dag.qubits
        self.clbits = dag.clbits
        self.justification = justification
        self.measure_map = measure_map
        self.cregs = [self.dag.cregs[reg] for reg in self.dag.cregs]

        if self.justification == "left":
            for dag_layer in dag.layers():
                current_index = len(self) - 1
                dag_nodes = _sorted_nodes(dag_layer)
                for node in dag_nodes:
                    self.add(node, current_index)
        else:
            dag_layers = []
            for dag_layer in dag.layers():
                dag_layers.append(dag_layer)

            # going right to left!
            dag_layers.reverse()

            for dag_layer in dag_layers:
                current_index = 0
                dag_nodes = _sorted_nodes(dag_layer)
                for node in dag_nodes:
                    self.add(node, current_index)

    def is_found_in(self, node, nodes):
        """Is any qreq in node found in any of nodes?"""
        all_qargs = []
        for a_node in nodes:
            for qarg in a_node.qargs:
                all_qargs.append(qarg)
        return any(i in node.qargs for i in all_qargs)

    def insertable(self, node, nodes):
        """True .IFF. we can add 'node' to layer 'nodes'"""
        return not _any_crossover(self.qubits, node, nodes)

    def slide_from_left(self, node, index):
        """Insert node into first layer where there is no conflict going l > r"""
        measure_layer = None
        if isinstance(node.op, Measure):
            measure_bit = next(bit for bit in self.measure_map if node.cargs[0] == bit)

        if not self:
            inserted = True
            self.append([node])
        else:
            inserted = False
            curr_index = index
            last_insertable_index = -1
            index_stop = -1
            if (condition := getattr(node.op, "condition", None)) is not None:
                index_stop = max(
                    (self.measure_map[bit] for bit in condition_resources(condition).clbits),
                    default=index_stop,
                )
            if node.cargs:
                for carg in node.cargs:
                    try:
                        carg_bit = next(bit for bit in self.measure_map if carg == bit)
                        if self.measure_map[carg_bit] > index_stop:
                            index_stop = self.measure_map[carg_bit]
                    except StopIteration:
                        pass
            while curr_index > index_stop:
                if self.is_found_in(node, self[curr_index]):
                    break
                if self.insertable(node, self[curr_index]):
                    last_insertable_index = curr_index
                curr_index = curr_index - 1

            if last_insertable_index >= 0:
                inserted = True
                self[last_insertable_index].append(node)
                measure_layer = last_insertable_index
            else:
                inserted = False
                curr_index = index
                while curr_index < len(self):
                    if self.insertable(node, self[curr_index]):
                        self[curr_index].append(node)
                        measure_layer = curr_index
                        inserted = True
                        break
                    curr_index = curr_index + 1

        if not inserted:
            self.append([node])

        if isinstance(node.op, Measure):
            if not measure_layer:
                measure_layer = len(self) - 1
            if measure_layer > self.measure_map[measure_bit]:
                self.measure_map[measure_bit] = measure_layer

    def slide_from_right(self, node, index):
        """Insert node into rightmost layer as long there is no conflict."""
        if not self:
            self.insert(0, [node])
            inserted = True
        else:
            inserted = False
            curr_index = index
            last_insertable_index = None

            while curr_index < len(self):
                if self.is_found_in(node, self[curr_index]):
                    break
                if self.insertable(node, self[curr_index]):
                    last_insertable_index = curr_index
                curr_index = curr_index + 1

            if last_insertable_index:
                self[last_insertable_index].append(node)
                inserted = True
            else:
                curr_index = index
                while curr_index > -1:
                    if self.insertable(node, self[curr_index]):
                        self[curr_index].append(node)
                        inserted = True
                        break
                    curr_index = curr_index - 1

        if not inserted:
            self.insert(0, [node])

    def add(self, node, index):
        """Add 'node' where it belongs, starting the try at 'index'."""
        if self.justification == "left":
            self.slide_from_left(node, index)
        else:
            self.slide_from_right(node, index)


def _any_crossover(qubits, node, nodes):
    """Return True .IFF. 'node' crosses over any 'nodes'."""
    gate_span = _get_gate_span(qubits, node)
    all_indices = []
    for check_node in nodes:
        if check_node != node:
            all_indices += _get_gate_span(qubits, check_node)
    return any(i in gate_span for i in all_indices)

