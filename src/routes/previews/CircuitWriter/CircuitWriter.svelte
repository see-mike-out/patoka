<script>
  import { onDestroy, onMount } from "svelte";
  import { writable } from "svelte/store";
  import { convertToQiskitCode } from "./toQiskit";
  import { QiskitMachines } from "./machines";
  import { copyToClipboardHelper } from "../CircuitViewer/copy_helper";

  import MachineSection from "./MachineSection.svelte";
  import OperationsSection from "./OperationsSection.svelte";
  import ObservableSection from "./ObservableSection.svelte";
  import MeasureSection from "./MeasureSection.svelte";
  import { Model } from "$lib/model";
  import MonacoEditor from "$lib/monaco/monacoEditor.svelte";

  export let model = new Model({
    circ_code: "",
    machine: `{"name": "Vigo", "is_simulator": true}`,
  });
  export let key_circ = "circ_code",
    key_machine = "machine";
  let circ = model.get(key_circ),
    machine_info;
  let event = `change:${key_machine}`;
  let callback = () => (count = model.get(key_machine));
  let data = writable({});
  let output_code = writable({});

  onMount(() => {
    if (model.get(key_machine))
      machine_info = JSON.parse(model.get(key_machine));
    circ = model.get(key_circ);

    data.subscribe((d) => {
      // data check
      if (d.operations) {
        d.num_operations =
          d.operations?.filter((e) => !e.deactive)?.length || 0;
      }
      if (d.pauli_obs) {
        d.num_pauli_obs = d.pauli_obs?.filter((e) => !e.deactive)?.length || 0;
        d.pauli_obs.forEach((obs) => {
          if (obs.observable.length < d.machine_qubits) {
            obs.observable =
              obs.observable +
              "I".repeat(d.machine_qubits - obs.observable.length);
          } else if (obs.observable.length > d.machine_qubits) {
            obs.observable = obs.observable.substring(0, d.machine_qubits);
          }
        });
      }

      if (d.machine) {
        d.machine_qubits = QiskitMachines[d.machine]?.n_qubits;
        if (!QiskitMachines[d.machine].sim) {
          d.no_sim = true;
          d.no_machine = false;
          d.is_simulator = false;
        } else if (!QiskitMachines[d.machine].machine) {
          d.no_machine = true;
          d.no_sim = false;
          d.is_simulator = true;
        } else {
          d.no_sim = false;
          d.no_machine = false;
        }
        if (d.no_sim) {
          d.sim_not_choosable = true;
        } else if (d.no_machine) {
          d.sim_not_choosable = true;
        } else {
          d.sim_not_choosable = false;
        }
      }

      if (d.measure && d.measure.length > 0) {
        d.measure.sort();
      }

      output_code.set(convertToQiskitCode(d));
    });

    output_code.subscribe((code) => {
      // output
      model.set(key_circ, code);
      model.save_changes();
    });

    // toggle for production
    data.set({
      machine: "Aer" || machine_info?.name,
      is_simulator: machine_info?.is_simulator,
      sharing: {
        qasm2: false,
        qasm3: false,
      },
    });

    data.set({
      is_simulator: true,
      machine: "Aer",
      machine_qubits: null,
      num_qubits: 5,
      qubits: [0, 1, 2, 3, 4],
      num_clbits: 5,
      clbits: [0, 1, 2, 3, 4],
      num_operations: 3,
      operations: [
        {
          operation_def: "qnn_input_angle",
          apply_to: [0, 1, 2, 3, 4],
          apply_all: false,
          params: {
            "angle/0": 0.8,
            "angle/1": 0.11,
            "angle/2": -0.51,
            "angle_dir/0": "ry",
            "angle_dir/1": "rz",
            "angle_dir/2": "rx",
            "angle_dir/4": "rx",
            "angle_dir/3": "rx",
            "angle/3": 0.33,
            "angle/4": 1.75,
          },
        },
        {
          operation_def: "group_entanglement",
          apply_to: [0, 1, 2, 3, 4],
          apply_all: true,
          globals: {
            type: "linear",
          },
        },
        {
          operation_def: "qnn_weight_angle",
          apply_to: [0, 1, 2, 3, 4],
          apply_all: true,
          params: {
            "angle_dir/0": "rx",
            "angle_dir/1": "ry",
            "angle_dir/2": "ry",
            "angle_dir/3": "ry",
            "angle_dir/4": "rz",
            "angle/0": 0.25,
            "angle/1": 0.25,
            "angle/2": 0.25,
            "angle/3": 0.25,
            "angle/4": 0.25,
          },
        },
      ],
      measure: [0, 1, 2, 3, 4],
      measure_all: true,
      num_pauli_obs: 0,
      pauli_obs: [],
      use_pauli_obs: false,
      reporting: "measure",
      no_machine: true,
      no_sim: false,
      sim_not_choosable: true,
      sharing: {
        qasm2: false,
        qasm3: false,
      },
    });
    model.on(event, callback);
  });

  onDestroy(() => {
    model.off(event, callback);
  });
</script>

<section class="circuit-write-wrap">
  <h3>
    Writing a quantum circuit
    <button
      on:click={() => {
        data.set({
          machine: machine_info?.name,
          is_simulator: machine_info?.is_simulator,
          sharing: {
            qasm2: false,
            qasm3: false,
          },
        });
      }}>Reset</button
    >
  </h3>
  <div class="content">
    <MachineSection {data}></MachineSection>

    <OperationsSection {data}></OperationsSection>

    <article class={$data.num_qubits ? "" : "deactive"}>
      <h4>3. Measure? or Observe?</h4>
      <div class="input-row">
        <div class="input-form">
          <label>Choose reporting method</label>
          <div class="checkbox-group">
            <div class="checkbox-item">
              <input
                type="radio"
                id="reporting-measure"
                name="reporting"
                checked={$data.reporting === "measure"}
                on:change={(e) => {
                  data.update((d) => {
                    if (e.target.checked) {
                      d.reporting = "measure";
                    }
                    return d;
                  });
                }}
              />
              <label for="reporting-measure">Measure</label>
            </div>
            <div class="checkbox-item">
              <input
                type="radio"
                id="reporting-observe"
                name="reporting"
                checked={$data.reporting === "observe"}
                on:change={(e) => {
                  data.update((d) => {
                    if (e.target.checked) {
                      d.reporting = "observe";
                    }
                    return d;
                  });
                }}
              />
              <label for="reporting-observe">Pauli-Observables</label>
            </div>
          </div>
        </div>
      </div>
    </article>
    {#if $data.reporting === "observe"}
      <ObservableSection {data}></ObservableSection>
    {:else if $data.reporting === "measure"}
      <MeasureSection {data}></MeasureSection>
    {/if}

    {#if $data.sharing}
      <article class={$data.num_qubits ? "" : "deactive"}>
        <h4>4. Sharing options</h4>
        <div class="input-row">
          <div class="input-form">
            <label>Add sharing options</label>
            <div class="checkbox-group">
              <div class="checkbox-item">
                <input
                  type="checkbox"
                  id="reporting-measure"
                  checked={$data.sharing.qasm2}
                  on:change={(e) => {
                    data.update((d) => {
                      $data.sharing.qasm2 = e.target.checked;
                      return d;
                    });
                  }}
                />
                <label for="reporting-measure">QASM 2</label>
              </div>
              <div class="checkbox-item">
                <input
                  type="checkbox"
                  id="reporting-measure"
                  checked={$data.sharing.qasm3}
                  on:change={(e) => {
                    data.update((d) => {
                      $data.sharing.qasm3 = e.target.checked;
                      return d;
                    });
                  }}
                />
                <label for="reporting-measure">QASM 3</label>
              </div>
            </div>
          </div>
        </div>
      </article>
    {/if}
    <article class={$data.num_qubits ? "" : "deactive"}>
      <h4>Get your circuit code (in Qiskit)</h4>
      <div class="input-row">
        <button
          class="copy-qiskit"
          on:click={(e) => {
            copyToClipboardHelper(convertToQiskitCode($data));
          }}>Copy</button
        >
      </div>
    </article>
  </div>
</section>

<section class="circuit-preview">
  <h3>Code preview</h3>
  <MonacoEditor
    code={output_code}
    containerId={"circuit-writer-preview"}
    height="500px"
  ></MonacoEditor>
</section>

<style>
  .circuit-write-wrap {
    margin-top: 1rem;
    border: 1px solid #ddd;
    border-radius: 0.5rem;
    margin-bottom: 0.5rem;
    overflow: hidden;
  }
  .content {
    padding: 0;
    overflow-x: scroll;
  }
  article {
    padding: 1rem;
    margin-bottom: 0;
    border-top: 1px solid #ddd;
  }
  article:first-of-type {
    margin-top: 0;
    border-top: 0;
    padding-top: 0;
  }
  h3 {
    font-size: 1rem;
    padding: 0.5rem 1rem;
    margin: 0 0 0.5rem 0;
    background-color: #f0f0f0;
    border-bottom: 1px solid #ddd;
    border-radius: 0.5rem 0.5rem 0 0;
  }
  h3 button {
    appearance: none;
    padding: 0.25rem 0.5rem;
    margin-left: 0.5rem;
    border: 1px solid #ddd;
    border-radius: 0.25rem;
    background-color: white;
    font-family: var(--font-mono);
    line-height: 100%;
    cursor: pointer;
  }
  h4 {
    margin: 0 0 0.25rem 0;
    padding: 0 0 0.5rem 0;
    font-size: 1rem;
    line-height: 100%;
    font-weight: 600;
  }

  .input-row {
    display: flex;
    column-gap: 1rem;
    row-gap: 1rem;
    font-size: 0.9rem;
    margin-top: 0.25rem;
    margin-bottom: 0.5rem;
    max-width: 80vw;
    flex-wrap: wrap;
  }

  .input-form {
    display: flex;
  }
  .input-form > label {
    display: block;
    padding: 0.5rem 0.5rem;
    border: 1px solid #ddd;
    border-radius: 0.25rem 0 0 0.25rem;
    background-color: #f0f0f0;
    font-family: var(--font-mono);
    line-height: 100%;
  }

  .checkbox-group {
    display: flex;
    /* column-gap: 1rem; */
    padding: 0;
    border: 1px solid #ddd;
    border-left-width: 0;
    border-radius: 0 0.25rem 0.25rem 0;
    font-family: var(--font-mono);
    line-height: 100%;
    flex-wrap: wrap;
    max-width: 80vw;
    /* overflow-x: scroll; */
  }
  .checkbox-item {
    display: flex;
    align-items: center;
    /* border-left: 1px solid #ddd; */
    padding: 0.25rem 0.5rem;
  }
  .checkbox-item:first-of-type {
    border-left: 0;
  }
  .checkbox-group input {
    display: block;
    line-height: 100%;
  }
  .checkbox-group label {
    display: block;
    font-family: var(--font-mono);
    line-height: 100%;
    padding-left: 0.25rem;
    padding-right: 0.25rem;
  }

  .deactive * {
    opacity: 0.5;
  }

  :root {
    --font-mono: iosevka;
  }

  .copy-qiskit {
    appearance: none;
    padding: 0.5rem 0.5rem;
    border: 1px solid #ddd;
    border-radius: 0.25rem;
    background-color: #f0f0f0;
    font-family: var(--font-mono);
    line-height: 100%;
    cursor: pointer;
  }

  .circuit-preview {
    border: 1px solid #ddd;
    border-radius: 0.5rem;
    overflow: hidden;
  }
</style>
