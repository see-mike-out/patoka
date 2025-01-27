import { QiskitMachines } from "./machines";
import { ProblemMap } from "./problems";
import { checkQCNNResultImage, generateQCNNImageCode } from "./qcnn_image_code";
import { shors_alg, shors_period_operators, shors_var_setup, shors_period_import } from "./shors_period";

export function convertToQiskitCode(data, config) {
  let code_lines = [], includes = [], run_codes = [], analysis_codes = [], variables = [];
  let qnn_weight_count = 0, qnn_weights = [];
  if (!config?.no_includes) {
    includes.push("from qiskit import QuantumCircuit");
    if (data.reporting === "measure") includes.push("from qiskit.visualization import plot_histogram");
  }

  let auto_qubit = data.num_qubits === "auto";
  let auto_clbit = data.num_clbits === "auto";

  let qubits_accrued = [];

  let machine = QiskitMachines[data.machine], is_simulator = data.is_simulator;

  if (machine) {
    includes.push("from qiskit.transpiler.preset_passmanagers import generate_preset_pass_manager")
    if (machine.name === "Aer") {
      includes.push("from qiskit_aer import AerSimulator");
      includes.push("from qiskit import transpile")
    } else if (is_simulator) {
      includes.push("import qiskit_aer");
      includes.push(`from qiskit_ibm_runtime.fake_provider import ${machine.sim}`);
    } else {
      includes.push("import os");
      includes.push("from qiskit_ibm_runtime import QiskitRuntimeService")
    }
  }

  let wipe_circuit_def = false, measure_included = false, separate_result_check_code, use_max_shots = false,
    qubits_to_measure = [];

  if (data?.operations) {
    let oi = 0;
    for (const op_def of data.operations) {
      if (!op_def.deactive) {
        let op = ProblemMap[op_def.operation_def];
        if (op?.key === "QFT") {
          if (!includes.includes("from qiskit.circuit.library import QFT")) {
            includes.push("from qiskit.circuit.library import QFT")
          }
          code_lines.push("")
          code_lines.push("# Quantum Fourier Transform")

          let qubits_to_apply = op_def.apply_to;
          if (auto_qubit) {
            let qubit_size = op_def.qubit_size || 5;
            let last_qubit = qubits_accrued.length - 1;
            qubits_to_apply = [];
            for (let s = 0; s < qubit_size; s++) {
              qubits_accrued.push(last_qubit + s + 1);
              qubits_to_apply.push(last_qubit + s + 1);
            }
          }

          code_lines.push(`qft_${oi} = QFT(${qubits_to_apply.length}).to_gate()`);
          code_lines.push(`circuit.append(qft_${oi}, [${qubits_to_apply.join(", ")}])`);

          if (auto_clbit) {
            qubits_to_measure.push(...qubits_to_apply)
          }
        } else if (op?.key === "superposition") {
          code_lines.push("")
          code_lines.push("# Superposition")
          let qubits_to_apply = op_def.apply_to;
          if (auto_qubit) {
            let last_qubit = qubits_accrued.length - 1;
            qubits_accrued.push(last_qubit + 1);
            qubits_to_apply = [last_qubit + 1];
          }
          qubits_to_apply.forEach((q) => {
            code_lines.push(`circuit.h(${q})`);
          });

          if (auto_clbit) {
            qubits_to_measure.push(...qubits_to_apply)
          }
        } else if (op?.key === "superposition_probbed") {
          code_lines.push("")
          code_lines.push("# Superposition with probabilities")
          if (!includes.includes("import numpy as np")) includes.push("import numpy as np");
          let qubits_to_apply = op_def.apply_to;
          if (auto_qubit) {
            let last_qubit = qubits_accrued.length - 1;
            qubits_accrued.push(last_qubit + 1);
            qubits_to_apply = [last_qubit + 1];
          }
          qubits_to_apply.forEach((q) => {
            code_lines.push(`circuit.rx(2 * np.arccos(np.sqrt(${op_def.globals?.prob})), ${q})`);
            // circuit.rx(2*np.arccos(np.sqrt(a)), 0)
          });

          if (auto_clbit) {
            qubits_to_measure.push(...qubits_to_apply)
          }
        } else if (op?.key === "entanglement") {
          code_lines.push("")
          code_lines.push("# Entanglement");
          let qubits_to_apply = op_def.apply_to;
          if (auto_qubit && !op_def.qubits_manual && !op_def.qubits_manual?.length) {
            let qubit_size = 2;
            if (qubits_accrued.length < qubit_size) {
              let last_qubit = qubits_accrued.length - 1;
              qubits_to_apply = qubits_accrued.map(d => d);
              for (let s = last_qubit + 1; s < qubit_size; s++) {
                qubits_accrued.push(s);
                qubits_to_apply.push(s);
              }
            } else {
              qubits_to_apply = [qubits_accrued[0], qubits_accrued[1]]
            }
          }
          code_lines.push(`circuit.h(${qubits_to_apply[0]})`);
          code_lines.push(`circuit.cx(${qubits_to_apply.join(", ")})`);

          if (auto_clbit) {
            qubits_to_measure.push(...qubits_to_apply)
          }
        } else if (op?.key === "group_entanglement") {
          code_lines.push("")
          code_lines.push("# Grouped Entanglement");
          let qubits_to_apply = op_def.apply_to;
          if (auto_qubit && !op_def.qubits_manual && !op_def.qubits_manual?.length) {
            let qubit_size = op_def.qubit_size || 2;
            if (qubits_accrued.length < qubit_size) {
              let last_qubit = qubits_accrued.length - 1;
              qubits_to_apply = qubits_accrued.map(d => d);
              for (let s = last_qubit + 1; s < qubit_size; s++) {
                qubits_accrued.push(1);
                qubits_to_apply.push(s);
              }
            } else {
              qubits_to_apply = qubits_accrued
            }
          }
          if (op_def?.globals?.type === "linear") {
            qubits_to_apply.forEach((d, i) => {
              if (i < qubits_to_apply.length - 1) {
                code_lines.push(`circuit.cx(${d}, ${qubits_to_apply[i + 1]})`);
              }
            });
          } else if (op_def?.globals?.type === "full") {
            for (let i = 0; i < qubits_to_apply.length - 1; i++) {
              let d = qubits_to_apply[i];
              for (let j = i + 1; j < qubits_to_apply.length; j++) {
                let e = qubits_to_apply[j]
                code_lines.push(`circuit.cx(${d}, ${e})`);
              }
            }
          } else if (op_def?.globals?.type === "circular" || !op_def?.globals?.type) {
            qubits_to_apply.forEach((d, i) => {
              if (i < qubits_to_apply.length - 1) {
                code_lines.push(`circuit.cx(${d}, ${qubits_to_apply[i + 1]})`);
              } else {
                code_lines.push(`circuit.cx(${d}, ${qubits_to_apply[0]})`);
              }
            });
          }

          if (auto_clbit) {
            qubits_to_measure.push(...qubits_to_apply)
          }
        } else if (op?.key === "interference") {
          code_lines.push("")
          code_lines.push("# Interference")
          let qubits_to_apply = op_def.apply_to;
          if (auto_qubit) {
            let qubit_size = op_def.qubit_size || 1;
            let last_qubit = qubits_accrued.length - 1;
            qubits_to_apply = [];
            for (let s = 0; s < qubit_size; s++) {
              qubits_accrued.push(last_qubit + s + 1);
              qubits_to_apply.push(last_qubit + s + 1);
            }
          }
          qubits_to_apply.forEach((q, i) => {
            code_lines.push(`circuit.rz(${q},${op_def.params?.theta || 0})`);
          })

          if (auto_clbit) {
            qubits_to_measure.push(...qubits_to_apply)
          }
        } else if (op?.key === "BTT") {
          code_lines.push("")
          // includes
          includes.push("from revkit import netlist, oracle_synth, truth_table");
          includes.push("import revkit.export.qiskit");

          let qubits_to_apply = op_def.apply_to;
          if (auto_qubit && !op_def.qubits_manual && !op_def.qubits_manual?.length) {
            let n_symbols = op.variables.n_symbols(op_def);
            let qubit_size = n_symbols + 1;
            if (qubits_accrued.length < qubit_size) {
              let last_qubit = qubits_accrued.length - 1;
              qubits_to_apply = [];
              for (let s = last_qubit + 1; s < qubit_size; s++) {
                qubits_accrued.push(s);
                qubits_to_apply.push(s);
              }
            } else {
              qubits_to_apply = qubits_accrued.slice(0, qubit_size).map(d => d);
            }
          }

          if (op_def?.globals?.random_all) {
            code_lines.push("# Superpose every qubit");
            op_def.apply_to.forEach((q, i) => {
              if (i < op_def.apply_to.length - 1) {
                code_lines.push(`circuit.h(${q})`);
              }
            });
          }

          if (op_def?.globals?.boolean_expression) {
            // codes
            code_lines.push("# Boolean Truth Table Function Oracle");
            // todo: parse if possible
            code_lines.push(`tt_bool_${oi} = revkit.truth_table.from_expression("${op_def.globals.boolean_expression}")`);
            code_lines.push(`oracle_${oi} = revkit.oracle_synth(tt_bool_${oi})`);

            code_lines.push(`oracle_gate_${oi} = oracle_${oi}.to_qiskit().to_gate()`);
            code_lines.push(`circuit.append(oracle_gate_${oi}, [${op_def.apply_to.join(", ")}])`);
          }

          if (auto_clbit) {
            qubits_to_measure.push(...qubits_to_apply)
          }
        } else if (op?.key === "SHOR_period") {
          if (!includes.includes("import numpy as np")) {
            includes.push("import numpy as np");
          }
          if (!includes.includes(shors_period_import)) {
            includes.push(shors_period_import);
          }

          let oracle_qubits = op_def.qubit_registers?.oracle?.apply_to,
            register_qubits = op_def.qubit_registers?.counter?.apply_to;

          if (auto_qubit) {
            let oracle_size = op.variables.oracle_size(op_def);
            let counter_size = 6;
            if (!op_def.qubit_registers?.oracle?.qubits_manual && !op_def.qubit_registers?.oracle?.qubits_manual?.length) {
              if (qubits_accrued.length < oracle_size) {
                let last_qubit = qubits_accrued.length - 1;
                oracle_qubits = [];
                for (let s = last_qubit + 1; s < oracle_size; s++) {
                  qubits_accrued.push(s);
                  oracle_qubits.push(s);
                }
              } else {
                oracle_qubits = qubits_accrued.slice(0, oracle_size).map(d => d);
              }
            }
            if (!op_def.qubit_registers?.counter?.qubits_manual && !op_def.qubit_registers?.counter?.qubits_manual?.length) {
              if (qubits_accrued.length < oracle_size + counter_size) {
                let last_qubit = qubits_accrued.length - 1;
                register_qubits = [];
                for (let s = last_qubit + 1; s < oracle_size + counter_size; s++) {
                  qubits_accrued.push(s);
                  register_qubits.push(s);
                }
              } else {
                oracle_qubits = qubits_accrued.slice(oracle_size, oracle_size + counter_size).map(d => d);
              }
            }
          }

          code_lines.push("# Shor's algorithm for finding a modular period")
          // code_lines.push(shors_period_operators)
          if (op_def.params?.divider !== undefined && op_def.params?.factor !== undefined) {
            let vars = shors_var_setup(register_qubits || [],
              oracle_qubits || [],
              op_def.params?.divider, op_def.params?.factor)
            code_lines.push(vars)
            code_lines.push(shors_alg)
          }

          if (auto_clbit) {
            qubits_to_measure.push(...register_qubits)
          }
        } else if (op?.key === "BV") {
          let string_qubits = (op_def.qubit_registers?.string?.apply_to || []).toSorted((a, b) => a - b),
            store_qubits = (op_def.qubit_registers?.store?.apply_to || []),
            string_to_search = op_def.params?.string;

          if (auto_qubit) {
            let string_size = op.variables.string_size(op_def);
            let store_size = 1;
            if (!op_def.qubit_registers?.string?.qubits_manual && !op_def.qubit_registers?.string?.qubits_manual?.length) {
              if (qubits_accrued.length < string_size) {
                let last_qubit = qubits_accrued.length - 1;
                string_qubits = [];
                for (let s = last_qubit + 1; s < string_size; s++) {
                  qubits_accrued.push(s);
                  string_qubits.push(s);
                }
              } else {
                string_qubits = qubits_accrued.slice(0, string_size).map(d => d);
              }
            }
            if (!op_def.qubit_registers?.store?.qubits_manual && !op_def.qubit_registers?.store?.qubits_manual?.length) {
              if (qubits_accrued.length < string_size + store_size) {
                let last_qubit = qubits_accrued.length - 1;
                store_qubits = [];
                for (let s = last_qubit + 1; s < string_size + store_size; s++) {
                  qubits_accrued.push(s);
                  store_qubits.push(s);
                }
              } else {
                oracle_qubits = qubits_accrued.slice(string_size, string_size + store_size).map(d => d);
              }
            }
          }

          code_lines.push(`# Bernstein-Vazirani algorithm for finding hidden bits (bitstring: ${string_to_search})`)
          code_lines.push(`for i in [${string_qubits.join(", ")}]:`);
          code_lines.push(`    circuit.h(i)`);
          code_lines.push(`circuit.x(${store_qubits[0]})`);
          code_lines.push(`circuit.h(${store_qubits[0]})`);
          let k = 0;
          if (string_to_search) {
            for (const q in string_qubits) {
              if (string_to_search[k] == "1") {
                code_lines.push(`circuit.cx(${q}, ${store_qubits[0]})`);
              }
              k++;
            }
          }
          code_lines.push(`circuit.barrier()`);
          code_lines.push(`for i in [${string_qubits.join(", ")}]:`);
          code_lines.push(`    circuit.h(i)`);
          code_lines.push(`circuit.h(${store_qubits[0]})`);

          if (auto_clbit) {
            qubits_to_measure.push(...string_qubits);
          }
        } else if (op?.key === "qnn_input_angle") {
          code_lines.push("")
          code_lines.push("# QNN Input Entry")
          if (!includes.includes("import numpy as np")) {
            includes.push("import numpy as np");
          }

          let qubits_to_apply = op_def.apply_to;
          if (auto_qubit && !op_def.qubits_manual && !op_def.qubits_manual?.length) {
            let qubit_size = op_def.qubit_size || 1;
            if (qubits_accrued.length < qubit_size) {
              let last_qubit = qubits_accrued.length - 1;
              qubits_to_apply = qubits_accrued.map(d => d);
              for (let s = last_qubit + 1; s < qubit_size; s++) {
                qubits_accrued.push(1);
                qubits_to_apply.push(s);
              }
            } else {
              qubits_to_apply = qubits_accrued
            }
          }

          let qnn_inputs = [];
          qubits_to_apply.forEach((q, i) => {
            code_lines.push(`circuit.h(${q})`);
            if (op_def.params?.['angle/' + q] && op_def.params?.['angle_dir/' + q]) {
              qnn_inputs.push(op_def.params?.['angle/' + q]);
              code_lines.push(`circuit.${op_def.params?.['angle_dir/' + q]}(qnn_inputs[${i}], ${q})`);
            }
          });
          variables.push(`qnn_inputs = np.array([${qnn_inputs.join(", ")}])`);

          if (auto_clbit) {
            qubits_to_measure.push(...qubits_to_apply)
          }
        } else if (op?.key === "qnn_weight_angle") {
          code_lines.push("")
          code_lines.push("# QNN Weight Entry")
          if (!variables.includes(`# QNN Weight Entry`)) {
            variables.push(`# QNN Weight Entry`);
            variables.push(`qnn_weights = np.array([]);`);
          }
          if (!includes.includes("import numpy as np")) {
            includes.push("import numpy as np");
          }
          let loc_qnn_weights = [];
          op_def.apply_to.forEach((q, i) => {
            if (op_def.params?.['angle/' + q] && op_def.params?.['angle_dir/' + q]) {
              loc_qnn_weights.push(op_def.params?.['angle/' + q])

            }
          });
          code_lines.push(`qnn_weights = np.concatenate((qnn_weights, np.array([${loc_qnn_weights.join(", ")}])))`);
          op_def.apply_to.forEach((q, i) => {
            if (op_def.params?.['angle/' + q] && op_def.params?.['angle_dir/' + q]) {
              code_lines.push(`circuit.${op_def.params?.['angle_dir/' + q]}(qnn_weights[${qnn_weight_count}], ${q})`);
              loc_qnn_weights.push(op_def.params?.['angle/' + q])
              qnn_weight_count += 1
            }
          });

          let qubits_to_apply = op_def.apply_to;
          if (auto_clbit) {
            qubits_to_measure.push(...qubits_to_apply)
          }
        } else if (op?.key === "image_convolution_filters") {
          let filter_functions = {
            "avg": "avg_filter",
            "sobel": "sobel_filter",
            "blur": "laplacian_of_gaussian",
          };

          let needed_inlucdes = [`from pathlib import Path`,
            `from PIL import Image`,
            `import numpy as np`,
            `from patoka.image_convolution_utils import pad_array, flatten_image, construct_image, rotate_right, rotate_left, convolution, shift, display_function`,
            (op_def?.globals?.filter ? `from patoka.image_convolution_utils import ${filter_functions[op_def?.globals?.filter]} ` : ''),
            `from qiskit.circuit.library import StatePreparation`];
          for (const incl of needed_inlucdes) {
            if (!includes.includes(incl)) includes.push(incl);
          }
          let code = generateQCNNImageCode(
            op_def?.globals?.image_file,
            op_def?.globals?.filter,
            op_def?.globals?.color_mode,
            op_def?.globals?.sigma
          );
          code_lines.push(code);
          wipe_circuit_def = true;
          measure_included = true;
          separate_result_check_code = checkQCNNResultImage();
          use_max_shots = true;
        }
        oi++;
      }
    }
  }

  let final_num_qubits = 0, final_qubits = [];
  if (auto_qubit) {
    final_qubits = qubits_accrued;
    final_num_qubits = Math.max(...qubits_accrued) + 1;
  } else {
    final_qubits = data?.qubits;
    final_num_qubits = data?.num_qubits
  }

  qubits_to_measure = Array.from(new Set(qubits_to_measure));
  qubits_to_measure.sort();

  let final_num_clbits = 0, final_clbits = [];
  if (auto_clbit) {
    final_clbits = qubits_to_measure.map((d, i) => i);
    final_num_clbits = Math.max(...final_clbits) + 1;
  } else {
    final_clbits = data?.clbits;
    final_num_clbits = data?.num_qubits
  }
  if (!wipe_circuit_def) {
    code_lines.splice(0, 0, `circuit = QuantumCircuit(${final_num_qubits || 1}, ${final_num_clbits || 0})`);
  }

  if (machine) {
    if (machine.name === "Aer") {
      run_codes.push(`aer_sim = AerSimulator()`);
    } else if (machine.name === "Qiskit") {
      if (!includes.includes("from qiskit_ibm_runtime import QiskitRuntimeService")) {
        includes.push("from qiskit_ibm_runtime import QiskitRuntimeService");
      }
      run_codes.push(`QiskitRuntimeService.save_account(channel="ibm_quantum", token=token, overwrite=True)`);
      run_codes.push(`service = QiskitRuntimeService(channel="ibm_quantum")`);
      run_codes.push(`avail_backends = service.backends()`);
      run_codes.push(`backend = avail_backends[0]`);
      run_codes.push(`pass_manager = generate_preset_pass_manager(backend=backend, optimization_level=optimization_level)`);
    } else {
      run_codes.push("# backend and optimizer")
      run_codes.push(`optimization_level = ${data.optimization_level || 1}`);
      if (is_simulator) {
        run_codes.push(`backend = qiskit_aer.AerSimulator.from_backend(${machine.sim}())`);
      } else {
        if (!includes.includes("from qiskit_ibm_runtime import QiskitRuntimeService")) {
          includes.push("from qiskit_ibm_runtime import QiskitRuntimeService");
        }
        run_codes.push("# the below code retrieves your IBM token that is stored as an environment variable.")
        run_codes.push("# Visit https://docs.quantum.ibm.com/api/runtime/ for details and search 'store an environment variable' for how-to.")
        run_codes.push(`token = os.environ["ibm_token"]`);
        run_codes.push("# Alternatively, you can directly provide your token as a string, which is less recommended.")
        run_codes.push(`# token = YOUR_TOKEN`);
        run_codes.push(`QiskitRuntimeService.save_account(channel="ibm_quantum", token=token, overwrite=True)`);
        run_codes.push(`service = QiskitRuntimeService(channel="ibm_quantum")`);
        run_codes.push(`backend = service.backend(name="${machine.machine}")`);
      }
      run_codes.push(`pass_manager = generate_preset_pass_manager(backend=backend, optimization_level=optimization_level)`);
    }
    run_codes.push("")
  }

  if (data.reporting === "observe") {
    if (data?.pauli_obs?.length > 0) {
      if (!config?.no_includes) {
        includes.push("from qiskit.quantum_info import SparsePauliOp");
        includes.push("from qiskit_ibm_runtime import EstimatorV2 as Estimator")
      }
      code_lines.push("")
      code_lines.push("# Pauli Observables")
      code_lines.push(`observables_labels = [${data.pauli_obs.map((o) => '"' + o.observable + '"').join(", ")}]`)
      code_lines.push(`observables = [SparsePauliOp(label) for label in observables_labels]`);
      code_lines.push(`mapped_observables = [observable.apply_layout(circuit.layout) for observable in observables]`);
    }

    if (!machine) {
      run_codes.push(`# # Uncomment & run this code with a pass manager`);
      run_codes.push(`# estimator = Estimator(backend)`)
      run_codes.push(`# transpiled = pass_manager.run(circuit)`);
      run_codes.push(`# # Uncomment & Run this code with a backend`)
      run_codes.push(`# job = estimator.run([(transpiled, mapped_observables)])`)
    } else {
      run_codes.push(`# pass manager and run`);
      run_codes.push(`estimator = Estimator(backend)`)
      run_codes.push(`transpiled = pass_manager.run(transpiled)`);
      run_codes.push(`job = estimator.run([(transpiled, mapped_observables)])`)
    }
  } else if (data.reporting === "measure") {
    if (!measure_included && data?.measure_all) {
      code_lines.push("")
      code_lines.push("# Measure")
      code_lines.push(`circuit.measure([${data.qubits.join(", ")}], [${data.clbits.join(", ")}])`);
    } else if (!measure_included && data?.measure && data?.measure[0] === "auto") {
      code_lines.push("")
      code_lines.push("# Measure")
      code_lines.push(`circuit.measure([${qubits_to_measure.join(", ")}], [${qubits_to_measure.map((d, i) => i).join(", ")}])`)
    } else if (!measure_included && data?.measure && data?.measure.length > 0) {
      code_lines.push("")
      code_lines.push("# Measure")
      let clbits_to_use = data.clbits.slice(0, data.measure.length);
      code_lines.push(`circuit.measure([${data.measure.join(", ")}], [${clbits_to_use.join(", ")}])`)
    } else if (!measure_included && final_clbits.length > 0) {
      code_lines.push(`circuit.measure([${qubits_to_measure.join(", ")}], [${final_clbits.join(", ")}])`)
    }
    if (!machine) {
      run_codes.push(`# # Uncomment & run this code with a pass manager`);
      run_codes.push(`# transpiled = pass_manager.run(circuit)`);
      run_codes.push(`# # Run this code with a backend`);
      run_codes.push(`# job = backend.run(transpiled)`);
    } else if (machine.name === "Aer") {
      run_codes.push(`transpiled = transpile(circuit, aer_sim)`);
      if (use_max_shots) {
        run_codes.push(`shots = aer_sim.configuration().max_shots`);
        run_codes.push(`job = aer_sim.run(transpiled, shots=shots)`);
      } else {
        run_codes.push(`job = aer_sim.run(transpiled)`);
      }

    } else {
      run_codes.push(`# pass manager and run`);
      run_codes.push(`transpiled = pass_manager.run(circuit)`);
      if (use_max_shots) {
        run_codes.push(`shots = backend.configuration().max_shots`);
        run_codes.push(`job = backend.run(transpiled, shots=shots)`);
      } else {
        run_codes.push(`job = backend.run(transpiled)`);
      }
    }
    run_codes.push("")
    if (!separate_result_check_code) {
      run_codes.push("counts = job.result().get_counts()")
      run_codes.push("plot_histogram(counts)")
    }
    else {
      run_codes.push(separate_result_check_code)
    }
  }

  if (data.sharing?.qasm2) {
    includes.push("from qiskit import qasm2");
    code_lines.push("")
    code_lines.push("# save the circuit as a QASM2 file")
    code_lines.push("circuit_qasm2 = qasm2.dumps(circuit)")
    let file_name = `circuit_qasm2_${(new Date()).getTime()}.qasm`
    code_lines.push(`with open("${file_name}", "w") as f:`)
    code_lines.push(`    f.write(circuit_qasm2)`)
    code_lines.push(`# to load: run qasm3.load([path]/${file_name}) after setting the appropriate path`)
  }

  if (data.sharing?.qasm3) {
    includes.push("from qiskit import qasm3");
    code_lines.push("")
    code_lines.push("# save the circuit as a QASM3 file")
    code_lines.push("circuit_qasm3 = qasm3.dumps(circuit)")
    let file_name = `circuit_qasm3_${(new Date()).getTime()}.qasm`
    code_lines.push(`with open("${file_name}", "w") as f:`)
    code_lines.push(`    f.write(circuit_qasm3)`)
    code_lines.push(`# to load: run qasm3.load([path]/${file_name}) after setting the appropriate path`)
  }

  return includes.join("\n") + "\n\n" + variables.join("\n") + "\n\n" + code_lines.join("\n") + "\n\n" + run_codes.join("\n") + "\n\n" + analysis_codes.join("\n")
}