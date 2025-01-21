<script>
  import { writable } from "svelte/store";
  import { ProblemMap, ProblemTypes, satisfyConstraint } from "./problems";
  import QubitSelect from "./QubitSelect.svelte";
  import ParamEntry from "./ParamEntry.svelte";
  import GlobalEntry from "./GlobalEntry.svelte";

  export let data = writable({});
</script>

<article class={$data.num_qubits ? "" : "deactive"}>
  <h4>
    2. Define operations
    <span class="note"
      >{$data?.num_operations} active opeartion{$data?.num_operations == 1
        ? ""
        : "s"}.</span
    >
  </h4>
  <div class="content-wrap">
    {#each $data.operations || [] as op, oi}
      <div class="op-wrap">
        <h5>
          {op.deactive ? "[Deactive]" : ""} Operation {oi + 1}
          <span class="header-button-group">
            {#if !op.deactive}
              <button
                on:click={(e) => {
                  data.update((d) => {
                    d.operations[oi].deactive = true;
                    return d;
                  });
                }}>⊗ Deactivate</button
              >
            {/if}
            {#if op.deactive}
              <button
                on:click={(e) => {
                  data.update((d) => {
                    d.operations[oi].deactive = false;
                    return d;
                  });
                }}>⊚ Activate</button
              >
            {/if}
            <button
              on:click={(e) => {
                data.update((d) => {
                  d.operations.splice(oi, 1);
                  return d;
                });
              }}>× Remove</button
            >
            {#if oi > 0}
              <button
                on:click={(e) => {
                  data.update((d) => {
                    [d.operations[oi], d.operations[oi - 1]] = [
                      d.operations[oi - 1],
                      d.operations[oi],
                    ];
                    return d;
                  });
                }}>↑ Move up</button
              >
            {/if}
            {#if oi < $data.operations.length - 1}
              <button
                on:click={(e) => {
                  data.update((d) => {
                    [d.operations[oi], d.operations[oi + 1]] = [
                      d.operations[oi + 1],
                      d.operations[oi],
                    ];
                    return d;
                  });
                }}>↓ Move down</button
              >
            {/if}
          </span>
        </h5>
        <div class="input-row">
          <div class="input-form">
            <label for={"op_type-" + oi}>Operation type</label>
            <select
              id={"op_type-" + oi}
              name={"op_type-" + oi}
              value={op.operation_def}
              on:change={(e) => {
                data.update((d) => {
                  d.operations[oi].operation_def = e.target.value;
                  return d;
                });
              }}
              disabled={!$data.num_qubits}
            >
              <option>-</option>
              {#each ProblemTypes as item}
                <option
                  value={item.key}
                  selected={item.key === op.operation_def}>{item.name}</option
                >
              {/each}
            </select>
          </div>
          {#if ProblemMap[op?.operation_def]?.qubit_registers}
            {#each ProblemMap[op?.operation_def]?.qubit_registers as reg, reg_i}
              {#if $data.num_qubits === "auto" && ProblemMap[op?.operation_def]?.needs_size}
                <div class="input-form">
                  <label for={`op-${oi}-qubit-${reg}-num_qubits`}
                    ># Qubits {reg}</label
                  >
                  <input
                    type="number"
                    name="num_qubits"
                    id={`op-${oi}-qubit-${reg}-num_qubits`}
                    value={op.qubit_registers?.[reg]?.size}
                    on:change={(e) => {
                      data.update((d) => {
                        if (!d.operations[oi].qubit_registers) {
                          d.operations[oi].qubit_registers = {};
                        }
                        if (!d.operations[oi].qubit_registers[reg]) {
                          d.operations[oi].qubit_registers[reg] = {
                            apply_all: false,
                            apply_to: [],
                          };
                        }
                        d.operations[oi].qubit_registers[reg].size = parseInt(
                          e.target.value,
                        );
                        if (d.operations[oi].qubit_registers[reg].size > 0) {
                          d.operations[oi].qubit_registers[reg].apply_to =
                            Array.from(
                              Array(
                                d.operations[oi].qubit_registers[reg].size,
                              ).keys(),
                            ).map((d) => reg_i * 1000 + d);
                        }
                        return d;
                      });
                    }}
                  />
                </div>
                <div class="input-form">
                  <label for={`op-${oi}-qubit-${reg}-qubits_manual`}
                    >Qubits {reg}</label
                  >
                  <input
                    type="text"
                    name="qubits_manual"
                    id={`op-${oi}-qubit-${reg}-qubits_manual`}
                    value={op.qubit_registers?.[reg]?.qubits_manual || ""}
                    on:change={(e) => {
                      data.update((d) => {
                        if (!d.operations[oi].qubit_registers) {
                          d.operations[oi].qubit_registers = {};
                        }
                        if (!d.operations[oi].qubit_registers[reg]) {
                          d.operations[oi].qubit_registers[reg] = {
                            apply_all: false,
                            apply_to: [],
                          };
                        }
                        if (e.target.value.length > 0) {
                          d.operations[oi].qubit_registers[reg].qubits_manual =
                            e.target.value;
                          d.operations[oi].qubit_registers[reg].apply_to =
                            e.target.value
                              .split(",")
                              .map((d) => parseInt(d.trim()));
                        } else {
                          delete d.operations[oi].qubit_registers[reg]
                            .qubits_manual;
                          d.operations[oi].qubit_registers[reg].apply_to = [];
                        }
                        return d;
                      });
                    }}
                  />
                </div>
              {:else if $data.num_qubits !== "auto"}
                <div class="input-form">
                  <label>Qubits to apply for {reg}</label>
                  <div class="checkbox-group">
                    <QubitSelect
                      id={`op-${oi}-qubit-${reg}-reset`}
                      checked={false}
                      oncheck={(new_state) => {
                        data.update((d) => {
                          if (d.operations?.[oi]?.qubit_registers?.[reg]) {
                            d.operations[oi].qubit_registers[reg] = {
                              apply_all: false,
                              apply_to: [],
                            };
                          }
                          return d;
                        });
                      }}
                      label="Reset"
                    ></QubitSelect>
                    {#if $data.num_qubits && $data.num_qubits !== "auto"}
                      <QubitSelect
                        id={`op-${oi}-qubit-${reg}-all`}
                        checked={op.qubit_registers?.[reg]?.apply_all}
                        oncheck={(new_state) => {
                          data.update((d) => {
                            if (!d.operations[oi].qubit_registers) {
                              d.operations[oi].qubit_registers = {};
                            }
                            if (!d.operations[oi].qubit_registers[reg]) {
                              d.operations[oi].qubit_registers[reg] = {
                                apply_all: false,
                                apply_to: [],
                              };
                            }
                            d.operations[oi].qubit_registers[reg].apply_all =
                              new_state;
                            if (new_state)
                              d.operations[oi].qubit_registers[reg].apply_to =
                                d.qubits.map((d) => d);
                            else
                              d.operations[oi].qubit_registers[reg].apply_to =
                                [];
                            return d;
                          });
                        }}
                        label="All"
                      ></QubitSelect>
                    {/if}
                    {#each $data.qubits || [] as item}
                      <QubitSelect
                        id={`op-${oi}-qubit-${reg}-${item}`}
                        checked={op.qubit_registers?.[reg]?.apply_to.includes(
                          item,
                        )}
                        oncheck={(new_state) => {
                          data.update((d) => {
                            if (!d.operations[oi].qubit_registers) {
                              d.operations[oi].qubit_registers = {};
                            }
                            if (!d.operations[oi].qubit_registers[reg]) {
                              d.operations[oi].qubit_registers[reg] = {
                                apply_all: false,
                                apply_to: [],
                              };
                            }
                            if (
                              new_state &&
                              !d.operations[oi].qubit_registers[
                                reg
                              ]?.apply_to.includes(item)
                            ) {
                              d.operations[oi].qubit_registers[
                                reg
                              ].apply_to.push(item);
                            } else if (
                              !new_state &&
                              d.operations[oi].qubit_registers[
                                reg
                              ]?.apply_to.includes(item)
                            ) {
                              d.operations[oi].qubit_registers[
                                reg
                              ].apply_to.splice(
                                d.operations[oi].qubit_registers[
                                  reg
                                ].apply_to.indexOf(item),
                                1,
                              );
                            }
                            return d;
                          });
                        }}
                        label={item}
                      ></QubitSelect>
                    {/each}
                  </div>
                </div>
              {/if}
            {/each}
          {:else if $data.num_qubits === "auto" && ProblemMap[op?.operation_def]?.needs_size}
            <div class="input-form">
              <label for={`op-${oi}-qubit-num_qubits`}>Qubits to apply</label>
              <input
                type="number"
                name="num_qubits"
                id={`op-${oi}-qubit-num_qubits`}
                value={op.qubit_size}
                on:change={(e) => {
                  data.update((d) => {
                    d.operations[oi].qubit_size = parseInt(e.target.value);
                    if (d.operations[oi].qubit_size > 0) {
                      d.operations[oi].apply_to = Array.from(
                        Array(d.operations[oi].qubit_size).keys(),
                      );
                    }
                    return d;
                  });
                }}
              />
            </div>
            <div class="input-form">
              <label for={`op-${oi}-qubit-qubits_manual`}>Qubits</label>
              <input
                type="text"
                name="qubits_manual"
                id={`op-${oi}-qubit-qubits_manual`}
                value={$data.operations[oi].qubits_manual || ""}
                on:change={(e) => {
                  data.update((d) => {
                    if (e.target.value.length > 0) {
                      d.operations[oi].qubits_manual = e.target.value;
                      d.operations[oi].apply_to = e.target.value
                        .split(",")
                        .map((d) => parseInt(d.trim()));
                    } else {
                      delete d.operations[oi].qubits_manual;
                      d.operations[oi].apply_to = [];
                    }
                    return d;
                  });
                }}
              />
            </div>
          {:else}
            <div class="input-form">
              <label>Qubits to apply</label>
              <div class="checkbox-group">
                <QubitSelect
                  id={`op-${oi}-qubit-reset`}
                  checked={false}
                  oncheck={(new_state) => {
                    data.update((d) => {
                      if (d.operations?.[oi]) {
                        d.operations[oi].apply_to = [];
                        d.operations[oi].apply_all = false;
                      }
                      return d;
                    });
                  }}
                  label="Reset"
                ></QubitSelect>
                {#if $data.num_qubits}
                  <QubitSelect
                    id={`op-${oi}-qubit-all`}
                    checked={op.apply_all}
                    oncheck={(new_state) => {
                      data.update((d) => {
                        d.operations[oi].apply_all = new_state;
                        if (new_state)
                          d.operations[oi].apply_to = d.qubits.map((d) => d);
                        else d.operations[oi].apply_to = [];
                        return d;
                      });
                    }}
                    label="All"
                  ></QubitSelect>
                {/if}
                {#each $data.qubits || [] as item}
                  <QubitSelect
                    id={`op-${oi}-qubit-${item}`}
                    checked={op.apply_to.includes(item)}
                    oncheck={(new_state) => {
                      data.update((d) => {
                        if (
                          new_state &&
                          !d.operations[oi].apply_to.includes(item)
                        ) {
                          d.operations[oi].apply_to.push(item);
                        } else if (
                          !new_state &&
                          d.operations[oi].apply_to.includes(item)
                        ) {
                          d.operations[oi].apply_to.splice(
                            d.operations[oi].apply_to.indexOf(item),
                            1,
                          );
                        }
                        return d;
                      });
                    }}
                    label={item}
                  ></QubitSelect>
                {/each}
              </div>
            </div>
          {/if}
        </div>

        {#if ProblemMap[op?.operation_def]?.params}
          <div class="input-row">
            {#each ProblemMap[op?.operation_def]?.params as param, pi}
              <ParamEntry {data} {param} {oi} {pi}></ParamEntry>
            {/each}
          </div>
        {/if}
        {#if ProblemMap[op?.operation_def]?.params_per_bit}
          {#if $data.operations[oi]?.apply_to?.length > 0}
            {#each $data.operations[oi]?.apply_to as q, qi}
              <div class="input-row">
                {#each ProblemMap[op?.operation_def]?.params_per_bit as param, pi}
                  <ParamEntry
                    {data}
                    param={{
                      type: param.type,
                      key: param.key + "/" + q,
                      name: param.name + " for " + q,
                      option: param.option,
                    }}
                    {oi}
                    pi={pi + "-" + q}
                  ></ParamEntry>
                {/each}
              </div>
            {/each}
          {/if}
        {/if}
        {#if ProblemMap[op?.operation_def]?.globals}
          <div class="input-row">
            {#each ProblemMap[op?.operation_def]?.globals as glb, gi}
              <GlobalEntry {glb} {gi} {data} {oi}></GlobalEntry>
            {/each}
          </div>
        {/if}
        {#if ProblemMap[op?.operation_def]?.constraints}
          <div class="input-row">
            {#each ProblemMap[op?.operation_def]?.constraints as co, ci}
              {#if !satisfyConstraint(co, op, ProblemMap[op?.operation_def]?.variables, $data.num_qubits === "auto")}
                <div class="warning">
                  <strong>Constraint unsatisfied:</strong>
                  {co.warning}
                </div>
              {:else}
                <div class="success">
                  Constraint satisfied: {co.success}
                </div>
              {/if}
            {/each}
          </div>
        {/if}
      </div>

      {#if ProblemMap[op?.operation_def]?.notes}
        <div>
          <span class="note">
            {ProblemMap[op?.operation_def]?.notes}
          </span>
        </div>
      {/if}
    {/each}
  </div>
  {#if $data.operations?.length > 0}
    <hr />
  {/if}
  <div class="input-row">
    <button
      on:click={(e) => {
        data.update((d) => {
          if (!d.operations) d.operations = [];
          if (!d.num_operations) d.num_operations = 0;
          d.operations.push({
            operation_def: undefined,
            apply_to: [],
            apply_all: false,
          });
          return d;
        });
      }}>Add an operation</button
    >
  </div>
  <span class="note">
    Deactive operations are excluded from the final circuit code.
  </span>
</article>

<style>
  .circuit-write-wrap,
  .circuit-write-view {
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
  h2 {
    font-size: 2.5rem;
    font-weight: 100;
    margin-top: 2rem;
    margin-bottom: 2rem;
  }
  h3 {
    font-size: 1rem;
    padding: 0.5rem 1rem;
    margin: 0 0 0.5rem 0;
    background-color: #f0f0f0;
    border-bottom: 1px solid #ddd;
    border-radius: 0.5rem 0.5rem 0 0;
  }
  h4 {
    margin: 0 0 0.25rem 0;
    padding: 0 0 0.5rem 0;
    font-size: 1rem;
    line-height: 100%;
    font-weight: 600;
  }

  h5 {
    margin: 0 0 0.25rem 0;
    padding: 0.15rem 0 0.15rem 0;
    font-size: 0.9rem;
    line-height: 100%;
    font-weight: 600;
    font-style: italic;
    color: #454545;
  }

  .content-wrap {
    /* max-height: 35vh; */
    overflow-y: scroll;
  }

  .input-row {
    display: flex;
    column-gap: 1rem;
    row-gap: 0.5rem;
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
  .input-form > input,
  .input-form > select {
    display: block;
    /* appearance: none; */
    padding: 0.25rem 0.5rem;
    border: 1px solid #ddd;
    border-left-width: 0;
    border-radius: 0 0.25rem 0.25rem 0;
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
  .checkbox-group.solo {
    padding-left: 0.5rem;
    padding-right: 0.5rem;
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

  .pauli-input-row {
    /* display: flex;
    flex-wrap: nowrap; */
    margin-bottom: 0.5rem;
    border: 1px solid #ddd;
    border-radius: 0.25rem;
    width: fit-content;
    /* min-width: 30vw; */
    max-width: 80vw;
    overflow-x: scroll;
    /* column-gap: 0.25rem; */
  }
  .pauli-input {
    padding: 0.25rem;
  }
  .pauli-input label,
  .pauli-input input {
    display: block;
    font-family: var(--font-mono);
    font-size: 0.9rem;
    text-align: center;
    /* width: 1.5rem; */
    padding: 0;
    letter-spacing: 0.15rem;
  }
  .pauli-input label {
    padding-bottom: 0.25rem;
    font-weight: 700;
  }
  .pauli-input input {
    border: 0;
    border-bottom: 1px solid #ddd;
  }

  .pauli-input > input:invalid {
    border-color: #ff0000;
  }
  .pauli-input > input:invalid + span::after {
    display: block;
    content: "✖";
    padding-top: 0.25rem;
    text-align: center;
  }
  .pauli-input > input:valid + span::after {
    display: block;
    content: "✓";
    padding-top: 0.25rem;
    text-align: center;
  }

  button {
    padding: 0.5rem;
    border: 1px solid #ddd;
    border-radius: 0.25rem;
    background-color: #f0f0f0;
    font-family: var(--font-mono);
  }
  .input-row button {
    display: block;
  }
  .header-button-group {
    padding-left: 0.5rem;
    line-height: 100%;
  }
  .header-button-group button {
    line-height: 100%;
    padding: 0.25rem 0.5rem;
  }

  .op-wrap {
    margin-top: 1.25rem;
  }
  .op-wrap:first-of-type {
    margin-top: 0;
  }

  hr {
    border: 0;
    border-top: 1px solid #ddd;
    margin: 1rem 0;
  }

  .deactive * {
    opacity: 0.5;
  }

  .warning,
  .success {
    display: inline-block;
    margin-top: 0.5rem;
    padding: 0.5rem;
    border-radius: 0.25rem;
    font-size: 0.9rem;
    line-height: 100%;
  }

  .warning {
    border: 1px solid rgb(216, 157, 6);
    background-color: rgb(255, 250, 239);
    color: rgb(143, 97, 13);
  }

  .success {
    border: 1px solid rgb(11, 153, 66);
    background-color: rgb(243, 255, 239);
    color: rgb(16, 103, 68);
  }

  span.note {
    display: block;
    font-size: 0.8rem;
    color: #787878;
  }

  h4 span.note {
    margin-top: 0.25rem;
    font-weight: 400;
  }
</style>
