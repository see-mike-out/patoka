// adpated from: https://github.com/Qiskit/textbook/blob/main/notebooks/ch-algorithms/shor.ipynb

export const bv_circuit_generation = `
def generate_bv_circuit(circuit_width, secret_string):
    if secret_string == None:
        secret_string = '1'*(circuit_width)
    bv_qc = qiskit.QuantumCircuit(circuit_width, circuit_width - 1)

    for i in range(circuit_width - 1):
        qc.h(i)
    qc.x(circuit_width - 1)
    qc.h(circuit_width - 1)
`;

export const bv_import = `from patoka.bv_utils import generate_bv_circuit`;