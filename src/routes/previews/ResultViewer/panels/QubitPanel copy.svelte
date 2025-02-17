<script>
  import { writable } from "svelte/store";

  export let data = writable();
  let sort_reg = {};
  let config = writable({
    filter_used: true,
  });
  let hide1 = writable(true);
  function sort(table, key, dir) {
    if (dir == "a") {
      table = table.toSorted((a, b) => {
        return a[key]?.value - b[key]?.value;
      });
      sort_reg[key] = "a";
    } else {
      table = table.toSorted((a, b) => {
        return b[key]?.value - a[key]?.value;
      });
      sort_reg[key] = "d";
    }
    return table;
  }
  function dsort(table, key, dir) {
    if (dir == "a") {
      table = table.toSorted((a, b) => {
        return new Date(a[key]?.asof) - new Date(b[key]?.asof);
      });
      sort_reg[key + "d"] = "a";
    } else {
      table = table.toSorted((a, b) => {
        return new Date(b[key]?.asof) - new Date(a[key]?.asof);
      });
      sort_reg[key + "d"] = "d";
    }
    return table;
  }
</script>

{#if $data}
  <article class="panel qubits">
    <h4>
      Physical qubit properties
      <button on:click={(e) => hide1.set(!$hide1)}
        >{$hide1 ? "Show" : "Hide"}</button
      >
    </h4>
    <!-- filter -->

    {#if !$hide1}
      <div class="input-wrap">
        <input
          id="config-truth"
          type="checkbox"
          checked={$config?.filter_used}
          on:change={(e) => {
            config.update((c) => {
              c.filter_used = e.target.checked;
              return c;
            });
          }}
        />
        <label for="config">
          {#if $config?.filter_used}
            Show only the qubits used in the circuit.
          {:else}
            Show all qubits.
          {/if}
        </label>
      </div>
    {/if}
    <div class="content-wrap">
      {#if !$hide1}
        {#if $data.backend_properties?.qubits}
          <table>
            <thead>
              <tr>
                <th
                  >I {#if sort_reg.index !== "a"}<button
                      on:click={() => {
                        data.update((d) => {
                          d.backend_properties.qubits = sort(
                            d.backend_properties.qubits,
                            "index",
                            "a",
                          );
                          return d;
                        });
                      }}>↑</button
                    >{:else}<button
                      on:click={() => {
                        data.update((d) => {
                          d.backend_properties.qubits = sort(
                            d.backend_properties.qubits,
                            "index",
                            "d",
                          );
                          return d;
                        });
                      }}>↓</button
                    >{/if}</th
                >
                <th
                  >T1 {#if sort_reg.T1 !== "a"}<button
                      on:click={() => {
                        data.update((d) => {
                          d.backend_properties.qubits = sort(
                            d.backend_properties.qubits,
                            "T1",
                            "a",
                          );
                          return d;
                        });
                      }}>↑V</button
                    >{:else}<button
                      on:click={() => {
                        data.update((d) => {
                          d.backend_properties.qubits = sort(
                            d.backend_properties.qubits,
                            "T1",
                            "d",
                          );
                          return d;
                        });
                      }}>↓V</button
                    >{/if}{#if sort_reg.T1d !== "a"}<button
                      on:click={() => {
                        data.update((d) => {
                          d.backend_properties.qubits = dsort(
                            d.backend_properties.qubits,
                            "T1",
                            "a",
                          );
                          return d;
                        });
                      }}>↑D</button
                    >{:else}<button
                      on:click={() => {
                        data.update((d) => {
                          d.backend_properties.qubits = dsort(
                            d.backend_properties.qubits,
                            "T1",
                            "d",
                          );
                          return d;
                        });
                      }}>↓D</button
                    >{/if}</th
                >
                <th
                  >T2 {#if sort_reg.T2 !== "a"}<button
                      on:click={() => {
                        data.update((d) => {
                          d.backend_properties.qubits = sort(
                            d.backend_properties.qubits,
                            "T2",
                            "a",
                          );
                          return d;
                        });
                      }}>↑V</button
                    >{:else}<button
                      on:click={() => {
                        data.update((d) => {
                          d.backend_properties.qubits = sort(
                            d.backend_properties.qubits,
                            "T2",
                            "d",
                          );
                          return d;
                        });
                      }}>↓V</button
                    >{/if}{#if sort_reg.T2d !== "a"}<button
                      on:click={() => {
                        data.update((d) => {
                          d.backend_properties.qubits = dsort(
                            d.backend_properties.qubits,
                            "T2",
                            "a",
                          );
                          return d;
                        });
                      }}>↑D</button
                    >{:else}<button
                      on:click={() => {
                        data.update((d) => {
                          d.backend_properties.qubits = dsort(
                            d.backend_properties.qubits,
                            "T2",
                            "d",
                          );
                          return d;
                        });
                      }}>↓D</button
                    >{/if}</th
                >
                <th
                  >Anharmonic. {#if sort_reg.anharmonicity !== "a"}<button
                      on:click={() => {
                        data.update((d) => {
                          d.backend_properties.qubits = sort(
                            d.backend_properties.qubits,
                            "anharmonicity",
                            "a",
                          );
                          return d;
                        });
                      }}>↑V</button
                    >{:else}<button
                      on:click={() => {
                        data.update((d) => {
                          d.backend_properties.qubits = sort(
                            d.backend_properties.qubits,
                            "anharmonicity",
                            "d",
                          );
                          return d;
                        });
                      }}>↓V</button
                    >{/if}{#if sort_reg.anharmonicityd !== "a"}<button
                      on:click={() => {
                        data.update((d) => {
                          d.backend_properties.qubits = dsort(
                            d.backend_properties.qubits,
                            "anharmonicity",
                            "a",
                          );
                          return d;
                        });
                      }}>↑D</button
                    >{:else}<button
                      on:click={() => {
                        data.update((d) => {
                          d.backend_properties.qubits = dsort(
                            d.backend_properties.qubits,
                            "anharmonicity",
                            "d",
                          );
                          return d;
                        });
                      }}>↓D</button
                    >{/if}</th
                >
                <th
                  >Frequency {#if sort_reg.frequency !== "a"}<button
                      on:click={() => {
                        data.update((d) => {
                          d.backend_properties.qubits = sort(
                            d.backend_properties.qubits,
                            "frequency",
                            "a",
                          );
                          return d;
                        });
                      }}>↑V</button
                    >{:else}<button
                      on:click={() => {
                        data.update((d) => {
                          d.backend_properties.qubits = sort(
                            d.backend_properties.qubits,
                            "frequency",
                            "d",
                          );
                          return d;
                        });
                      }}>↓V</button
                    >{/if}{#if sort_reg.frequencyd !== "a"}<button
                      on:click={() => {
                        data.update((d) => {
                          d.backend_properties.qubits = dsort(
                            d.backend_properties.qubits,
                            "frequency",
                            "a",
                          );
                          return d;
                        });
                      }}>↑D</button
                    >{:else}<button
                      on:click={() => {
                        data.update((d) => {
                          d.backend_properties.qubits = dsort(
                            d.backend_properties.qubits,
                            "frequency",
                            "d",
                          );
                          return d;
                        });
                      }}>↓D</button
                    >{/if}</th
                >
                <th
                  >Meas0Prob1 {#if sort_reg.prob_meas0_prep1 !== "a"}<button
                      on:click={() => {
                        data.update((d) => {
                          d.backend_properties.qubits = sort(
                            d.backend_properties.qubits,
                            "prob_meas0_prep1",
                            "a",
                          );
                          return d;
                        });
                      }}>↑V</button
                    >{:else}<button
                      on:click={() => {
                        data.update((d) => {
                          d.backend_properties.qubits = sort(
                            d.backend_properties.qubits,
                            "prob_meas0_prep1",
                            "d",
                          );
                          return d;
                        });
                      }}>↓V</button
                    >{/if}{#if sort_reg.prob_meas0_prep1d !== "a"}<button
                      on:click={() => {
                        data.update((d) => {
                          d.backend_properties.qubits = dsort(
                            d.backend_properties.qubits,
                            "prob_meas0_prep1",
                            "a",
                          );
                          return d;
                        });
                      }}>↑D</button
                    >{:else}<button
                      on:click={() => {
                        data.update((d) => {
                          d.backend_properties.qubits = dsort(
                            d.backend_properties.qubits,
                            "prob_meas0_prep1",
                            "d",
                          );
                          return d;
                        });
                      }}>↓D</button
                    >{/if}</th
                >
                <th
                  >Meas1Prob0 {#if sort_reg.prob_meas1_prep0 !== "a"}<button
                      on:click={() => {
                        data.update((d) => {
                          d.backend_properties.qubits = sort(
                            d.backend_properties.qubits,
                            "prob_meas1_prep0",
                            "a",
                          );
                          return d;
                        });
                      }}>↑V</button
                    >{:else}<button
                      on:click={() => {
                        data.update((d) => {
                          d.backend_properties.qubits = sort(
                            d.backend_properties.qubits,
                            "prob_meas1_prep0",
                            "d",
                          );
                          return d;
                        });
                      }}>↓V</button
                    >{/if}{#if sort_reg.prob_meas1_prep0d !== "a"}<button
                      on:click={() => {
                        data.update((d) => {
                          d.backend_properties.qubits = dsort(
                            d.backend_properties.qubits,
                            "prob_meas1_prep0",
                            "a",
                          );
                          return d;
                        });
                      }}>↑D</button
                    >{:else}<button
                      on:click={() => {
                        data.update((d) => {
                          d.backend_properties.qubits = dsort(
                            d.backend_properties.qubits,
                            "prob_meas1_prep0",
                            "d",
                          );
                          return d;
                        });
                      }}>↓D</button
                    >{/if}</th
                >
                <th
                  >Readout Error {#if sort_reg.readout_error !== "a"}<button
                      on:click={() => {
                        data.update((d) => {
                          d.backend_properties.qubits = sort(
                            d.backend_properties.qubits,
                            "readout_error",
                            "a",
                          );
                          return d;
                        });
                      }}>↑V</button
                    >{:else}<button
                      on:click={() => {
                        data.update((d) => {
                          d.backend_properties.qubits = sort(
                            d.backend_properties.qubits,
                            "readout_error",
                            "d",
                          );
                          return d;
                        });
                      }}>↓V</button
                    >{/if}{#if sort_reg.readout_errord !== "a"}<button
                      on:click={() => {
                        data.update((d) => {
                          d.backend_properties.qubits = dsort(
                            d.backend_properties.qubits,
                            "readout_error",
                            "a",
                          );
                          return d;
                        });
                      }}>↑D</button
                    >{:else}<button
                      on:click={() => {
                        data.update((d) => {
                          d.backend_properties.qubits = dsort(
                            d.backend_properties.qubits,
                            "readout_error",
                            "d",
                          );
                          return d;
                        });
                      }}>↓D</button
                    >{/if}</th
                >
                <th
                  >Readout Length {#if sort_reg.readout_length !== "a"}<button
                      on:click={() => {
                        data.update((d) => {
                          d.backend_properties.qubits = sort(
                            d.backend_properties.qubits,
                            "readout_length",
                            "a",
                          );
                          return d;
                        });
                      }}>↑V</button
                    >{:else}<button
                      on:click={() => {
                        data.update((d) => {
                          d.backend_properties.qubits = sort(
                            d.backend_properties.qubits,
                            "readout_length",
                            "d",
                          );
                          return d;
                        });
                      }}>↓V</button
                    >{/if}{#if sort_reg.readout_lengthd !== "a"}<button
                      on:click={() => {
                        data.update((d) => {
                          d.backend_properties.qubits = dsort(
                            d.backend_properties.qubits,
                            "readout_length",
                            "a",
                          );
                          return d;
                        });
                      }}>↑D</button
                    >{:else}<button
                      on:click={() => {
                        data.update((d) => {
                          d.backend_properties.qubits = dsort(
                            d.backend_properties.qubits,
                            "readout_length",
                            "d",
                          );
                          return d;
                        });
                      }}>↓D</button
                    >{/if}</th
                >
              </tr>
            </thead>
            <tbody>
              {#each $data.backend_properties.qubits as qubit, qi}
                {#if !$config.filter_used || ($config.filter_used && $data.physical_qubits.includes(qubit.index.value))}
                  <tr>
                    <th>{qubit.index.value}</th>
                    <td
                      >{qubit.T1.value}<br /><span class="asof"
                        >({qubit.T1.asof})</span
                      >
                    </td>
                    <td
                      >{qubit.T2.value}<br /><span class="asof"
                        >({qubit.T2.asof})</span
                      >
                    </td>
                    <td
                      >{qubit.anharmonicity.value}<br /><span class="asof"
                        >({qubit.anharmonicity.asof})</span
                      >
                    </td>
                    <td
                      >{qubit.frequency.value}<br /><span class="asof"
                        >({qubit.frequency.asof})</span
                      >
                    </td>
                    <td
                      >{qubit.prob_meas0_prep1.value}<br /><span class="asof"
                        >({qubit.prob_meas0_prep1.asof})</span
                      >
                    </td>
                    <td
                      >{qubit.prob_meas1_prep0.value}<br /><span class="asof"
                        >({qubit.prob_meas1_prep0.asof})</span
                      >
                    </td>
                    <td
                      >{qubit.readout_error.value}<br /><span class="asof"
                        >({qubit.readout_error.asof})</span
                      >
                    </td>
                    <td
                      >{qubit.readout_length.value}<br /><span class="asof"
                        >({qubit.readout_length.asof})</span
                      >
                    </td>
                  </tr>
                {/if}
              {/each}
            </tbody>
          </table>
        {/if}
      {/if}
      <!-- backend_properties.faulty_gates -->
      <!-- backend_properties.faulty_qubits -->
    </div>
  </article>
{/if}

<style>
  .panel {
    grid-column: span 6;
  }
  .panel .content-wrap {
    max-height: 300px;
    overflow-y: scroll;
    font-size: 0.9rem;
    margin: 0.5rem;
    padding: 0;
  }
  .panel table {
    border-collapse: collapse;
  }
  .panel table th {
    text-align: left;
    padding-right: 0.5rem;
    padding-left: 0;
  }
  .panel table th,
  .panel table td {
    border: 0;
    padding-top: 0.15rem;
    padding-bottom: 0.15rem;
  }
  .panel table thead {
    position: sticky;
    top: 0;
    z-index: 9;
  }
  .panel table thead th {
    text-align: center;
    background-color: #fafafa;
  }
  .panel table th,
  .panel table td {
    border: 1px solid #999;
    padding-left: 0.5rem;
    padding-right: 0.5rem;
  }

  .panel th button {
    padding: 0.15rem 0.25rem;
    appearance: none;
    border: 0;
    background-color: transparent;
    cursor: pointer;
    border-radius: 0.25rem;
    line-height: 100%;
  }
  .panel th button:hover {
    background-color: rgba(0, 0, 0, 0.15);
  }
  .panel td span {
    display: block;
  }
  .asof {
    color: #999;
    font-size: 0.8rem;
  }
  .input-wrap {
    margin: 0;
    padding: 0.5rem 0.5rem 0.25rem 0.5rem;
  }
  .input-wrap select {
    font-family: iosevka;
    padding: 0.25rem 0.5rem;
    font-size: 0.9rem;
    appearance: none;
    line-height: 100%;
    border: 1px solid #aaa;
    background-color: white;
    border-radius: 0.25rem;
  }
  .input-wrap label {
    font-family: iosevka;
    font-size: 0.9rem;
  }
</style>
