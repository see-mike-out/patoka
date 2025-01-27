
export function generateQCNNImageCode(image_file, filter, color_mode, sigma) {
  let code_lines = [];

  if (filter) {
    code_lines.push(`# Get the filter`);
    let has_filter = false;
    if (filter === "sobel") {
      has_filter = true;
      code_lines.push(`convolution_filter = sobel_filter(3, axis=0)`);
    } else if (filter === "avg") {
      has_filter = true;
      code_lines.push(`convolution_filter = avg_filter(3, axis=0)`);
    } else if (filter === "blur") {
      has_filter = true;
      code_lines.push(`convolution_filter = laplacian_of_gaussian(3, sigma=${sigma || 0.6})`);
    }
    if (has_filter) {
      code_lines.push(`psi_filter = pad_array(convolution_filter).flatten(order="F")`)
    }
  }

  code_lines.push(`
# Get the image data
QCNN_image_file = Path("${image_file}")
image_data, dims = flatten_image(QCNN_image_file)
n_dims = len(dims)
dims_data = np.asarray(dims).astype(int)
image_mode = "${color_mode || "RGB"}"
if (n_dims == 2):
    image_mode = "L"`);

  code_lines.push(`
# Compute the input dimensions
n_qubits = 0
dims_qubits = dims_data
for i_dim in range(0, n_dims):
    n_qubits_i = int(np.ceil(np.log2(dims_data[i_dim]))) # Calculate the number of qubits required for each dimension
    dims_qubits[i_dim] = n_qubits_i
    n_qubits += n_qubits_i`);

  code_lines.push(`
# Compute the output dimensions
output = dims_qubits.cumsum()
dim_qubit_end = output - 1
dim_qubit_start = np.asarray(dims).astype(int)
dim_qubit_start[0] = 0
for i_dim in range(1, n_dims):
    dim_qubit_start[i_dim] = output[i_dim-1]`);

  code_lines.push(`num_qubits = n_qubits`)
  code_lines.push(`num_states = 2**num_qubits`)

  code_lines.push(`psi = image_data`)
  code_lines.push(`fltr_shape_q = [int(np.ceil(np.log2(filter_size))) for filter_size in convolution_filter.shape]`)

  code_lines.push(`num_ancilla = sum(fltr_shape_q)
QCNN_total_qubits = num_qubits + num_ancilla
QCNN_total_states = 2**QCNN_total_qubits`)

  code_lines.push(`
# Get the magnitude
magnitude = np.linalg.norm(psi)
psi /= magnitude

magnitude_filter = np.linalg.norm(psi_filter)
psi_filter /= magnitude_filter
magnitude *= magnitude_filter

magnitude *= np.sqrt(2**num_ancilla)

# Re-writing the circuit
circuit = QuantumCircuit(QCNN_total_qubits, QCNN_total_qubits)
circuit.initialize(psi, circuit.qubits[:num_qubits])

# Shift operation
for i, (dim, fq) in enumerate(zip(dims_qubits[:convolution_filter.ndim], fltr_shape_q)):
    filter_qubits = num_qubits + sum(fltr_shape_q[:i]) + np.arange(fq)
    circuit.h(filter_qubits)

    qubits = list(sum(dims_data[:i]) + np.arange(dim))
    for i, control_qubit in enumerate(filter_qubits):
        shift(circuit, -1, qubits=qubits[i:], control=control_qubit)

# data rearrangement
roots = np.concatenate([np.zeros(1, dtype=int), np.cumsum(dims_qubits[:convolution_filter.ndim-1])]) # base
filter_qubits = np.array([root + np.arange(fq) for root, fq in zip(roots, fltr_shape_q)]).flatten()

swap_targets = np.array([num_qubits + sum(fltr_shape_q[:i]) + np.arange(fq) for i, fq in enumerate(fltr_shape_q)]).flatten()
for a,b in zip(filter_qubits, swap_targets):
    circuit.swap(a, b)

# Multiply and accummulate

mac = StatePreparation(np.conj(psi_filter), inverse=True)
circuit.compose(mac, qubits=list(swap_targets), inplace=True)

circuit.measure(list(range(QCNN_total_qubits)), list(range(QCNN_total_qubits)))
`);

  return code_lines.join("\n");
}

export function checkQCNNResultImage() {
  // shots = local_simulator_backend.configuration().max_shots
  return `
counts = job.result().get_counts(circuit)
display_function(QCNN_total_states, counts, shots, num_states, magnitude, dims, image_mode)
  `
}