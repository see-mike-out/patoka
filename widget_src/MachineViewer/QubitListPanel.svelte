<script>
  import { writable } from "svelte/store";
  import Cart from "./Cart.svelte";
  import { titles, descriptions, markers } from "./meta_info";
  import { onMount } from "svelte";
  import Clock from "./Clock.svelte";
  export let key = "",
    value,
    addToBasket,
    basket,
    level = 1,
    code_header = "",
    code_type = "",
    code_footer = "",
    parentKey = "",
    topLevelKey = "",
    openTimeMachine,
    property_time = writable();
  let sort_reg = {};
  let value_react = writable([]);
  function sort(key, dir) {
    if (dir == "a") {
      value_react.update((v) => {
        v.sort((a, b) => {
          return a[key]?.value - b[key]?.value;
        });
        return v;
      });
      sort_reg[key] = "a";
    } else {
      value_react.update((v) => {
        v.sort((a, b) => {
          return b[key]?.value - a[key]?.value;
        });
        return v;
      });
      sort_reg[key] = "d";
    }
  }
  function dsort(key, dir) {
    if (dir == "a") {
      value_react.update((v) => {
        v.sort((a, b) => {
          return new Date(a[key]?.asof) - new Date(b[key]?.asof);
        });
        return v;
      });
      sort_reg[key + "d"] = "a";
    } else {
      value_react.update((v) => {
        v.sort((a, b) => {
          return new Date(b[key]?.asof) - new Date(a[key]?.asof);
        });
        return v;
      });
      sort_reg[key + "d"] = "d";
    }
  }
  onMount(() => {
    property_time.subscribe((_) => {
      value_react.set(
        value.map((d, i) => {
          d.index = { value: i };
          return d;
        }),
      );
    });
  });
</script>

<article>
  {#if addToBasket}
    <button
      class="basket"
      on:click={() => {
        addToBasket(key);
      }}
    >
      <Cart on={$basket.includes(key)}></Cart>
    </button>
  {/if}
  {#if level == 1}
    <h2>{titles[key]}</h2>
  {:else if level == 2}
    <h3>{titles[key]}</h3>
  {/if}
  <div class="value">
    <table>
      <thead>
        <tr>
          <th
            >I {#if sort_reg.index !== "a"}<button
                on:click={() => {
                  sort("index", "a");
                }}>↑</button
              >{:else}<button
                on:click={() => {
                  sort("index", "d");
                }}>↓</button
              >{/if}</th
          >
          <th
            >T1 {#if sort_reg.T1 !== "a"}<button
                on:click={() => {
                  sort("T1", "a");
                }}>↑V</button
              >{:else}<button
                on:click={() => {
                  sort("T1", "d");
                }}>↓V</button
              >{/if}{#if sort_reg.T1d !== "a"}<button
                on:click={() => {
                  dsort("T1", "a");
                }}>↑D</button
              >{:else}<button
                on:click={() => {
                  dsort("T1", "d");
                }}>↓D</button
              >{/if}</th
          >
          <th
            >T2 {#if sort_reg.T2 !== "a"}<button
                on:click={() => {
                  sort("T2", "a");
                }}>↑V</button
              >{:else}<button
                on:click={() => {
                  sort("T2", "d");
                }}>↓V</button
              >{/if}{#if sort_reg.T2d !== "a"}<button
                on:click={() => {
                  dsort("T2", "a");
                }}>↑D</button
              >{:else}<button
                on:click={() => {
                  dsort("T2", "d");
                }}>↓D</button
              >{/if}</th
          >
          <th
            >Anharmonic. {#if sort_reg.anharmonicity !== "a"}<button
                on:click={() => {
                  sort("anharmonicity", "a");
                }}>↑V</button
              >{:else}<button
                on:click={() => {
                  sort("anharmonicity", "d");
                }}>↓V</button
              >{/if}{#if sort_reg.anharmonicityd !== "a"}<button
                on:click={() => {
                  dsort("anharmonicity", "a");
                }}>↑D</button
              >{:else}<button
                on:click={() => {
                  dsort("anharmonicity", "d");
                }}>↓D</button
              >{/if}</th
          >
          <th
            >Frequency {#if sort_reg.frequency !== "a"}<button
                on:click={() => {
                  sort("frequency", "a");
                }}>↑V</button
              >{:else}<button
                on:click={() => {
                  sort("frequency", "d");
                }}>↓V</button
              >{/if}{#if sort_reg.frequencyd !== "a"}<button
                on:click={() => {
                  dsort("frequency", "a");
                }}>↑D</button
              >{:else}<button
                on:click={() => {
                  dsort("frequency", "d");
                }}>↓D</button
              >{/if}</th
          >
          <th
            >Meas0Prob1 {#if sort_reg.prob_meas0_prep1 !== "a"}<button
                on:click={() => {
                  sort("prob_meas0_prep1", "a");
                }}>↑V</button
              >{:else}<button
                on:click={() => {
                  sort("prob_meas0_prep1", "d");
                }}>↓V</button
              >{/if}{#if sort_reg.prob_meas0_prep1d !== "a"}<button
                on:click={() => {
                  dsort("prob_meas0_prep1", "a");
                }}>↑D</button
              >{:else}<button
                on:click={() => {
                  dsort("prob_meas0_prep1", "d");
                }}>↓D</button
              >{/if}</th
          >
          <th
            >Meas1Prob0 {#if sort_reg.prob_meas1_prep0 !== "a"}<button
                on:click={() => {
                  sort("prob_meas1_prep0", "a");
                }}>↑V</button
              >{:else}<button
                on:click={() => {
                  sort("prob_meas1_prep0", "d");
                }}>↓V</button
              >{/if}{#if sort_reg.prob_meas1_prep0d !== "a"}<button
                on:click={() => {
                  dsort("prob_meas1_prep0", "a");
                }}>↑D</button
              >{:else}<button
                on:click={() => {
                  dsort("prob_meas1_prep0", "d");
                }}>↓D</button
              >{/if}</th
          >
          <th
            >Readout Error {#if sort_reg.readout_error !== "a"}<button
                on:click={() => {
                  sort("readout_error", "a");
                }}>↑V</button
              >{:else}<button
                on:click={() => {
                  sort("readout_error", "d");
                }}>↓V</button
              >{/if}{#if sort_reg.readout_errord !== "a"}<button
                on:click={() => {
                  dsort("readout_error", "a");
                }}>↑D</button
              >{:else}<button
                on:click={() => {
                  dsort("readout_error", "d");
                }}>↓D</button
              >{/if}</th
          >
          <th
            >Readout Length {#if sort_reg.readout_length !== "a"}<button
                on:click={() => {
                  sort("readout_length", "a");
                }}>↑V</button
              >{:else}<button
                on:click={() => {
                  sort("readout_length", "d");
                }}>↓V</button
              >{/if}{#if sort_reg.readout_lengthd !== "a"}<button
                on:click={() => {
                  dsort("readout_length", "a");
                }}>↑D</button
              >{:else}<button
                on:click={() => {
                  dsort("readout_length", "d");
                }}>↓D</button
              >{/if}</th
          >
          <th>-</th>
        </tr>
      </thead>
      <tbody>
        {#each $value_react as qubit, qi}
          <tr>
            <th>{qubit.index.value}</th>
            <td
              >{qubit.T1.value}<br /><span class="asof">({qubit.T1.asof})</span>
              {#if addToBasket}
                <button
                  class="basket"
                  on:click={() => {
                    addToBasket(
                      `qubit_${key}_${qi}_T1 = ${code_header}${qi}, name="T1"${code_footer}`,
                    );
                  }}
                >
                  <Cart
                    on={$basket.includes(
                      `qubit_${key}_${qi}_T1 = ${code_header}${qi}, name="T1"${code_footer}`,
                    )}
                  ></Cart>
                </button>
              {/if}

              {#if topLevelKey === "properties" && openTimeMachine}
                <button
                  class="basket"
                  on:click={() => {
                    openTimeMachine({
                      datatype: "nudv-map",
                      subtype: "qubit-property",
                      key: `qubit_${qi}_T1`,
                      title_key: `qubit[${qi}].T1`,
                      qubit_index: qi,
                      property: `T1`,
                      parentKey,
                      topLevelKey,
                      data: qubit.T1,
                      code_header: `${code_header}${qi}, name="T1"`,
                      code_footer,
                      code_key: "",
                    });
                  }}
                >
                  <Clock></Clock>
                </button>
              {/if}
            </td>
            <td
              >{qubit.T2.value}<br /><span class="asof">({qubit.T2.asof})</span>
              {#if addToBasket}
                <button
                  class="basket"
                  on:click={() => {
                    addToBasket(
                      `qubit_${key}_${qi}_T2 = ${code_header}${qi}, name="T2"${code_footer}`,
                    );
                  }}
                >
                  <Cart
                    on={$basket.includes(
                      `qubit_${key}_${qi}_T2 = ${code_header}${qi}, name="T2"${code_footer}`,
                    )}
                  ></Cart>
                </button>
              {/if}

              {#if topLevelKey === "properties" && openTimeMachine}
                <button
                  class="basket"
                  on:click={() => {
                    openTimeMachine({
                      datatype: "nudv-map",
                      subtype: "qubit-property",
                      key: `qubit_${qi}_T2`,
                      title_key: `qubit[${qi}].T2`,
                      qubit_index: qi,
                      property: `T2`,
                      parentKey,
                      topLevelKey,
                      data: qubit.T2,
                      code_header: `${code_header}${qi}, name="T2"`,
                      code_footer,
                      code_key: "",
                    });
                  }}
                >
                  <Clock></Clock>
                </button>
              {/if}
            </td>
            <td
              >{qubit.anharmonicity.value}<br /><span class="asof"
                >({qubit.anharmonicity.asof})</span
              >
              {#if addToBasket}
                <button
                  class="basket"
                  on:click={() => {
                    addToBasket(
                      `qubit_${key}_${qi}_anharmonicity = ${code_header}${qi}, name="anharmonicity"${code_footer}`,
                    );
                  }}
                >
                  <Cart
                    on={$basket.includes(
                      `qubit_${key}_${qi}_anharmonicity = ${code_header}${qi}, name="anharmonicity"${code_footer}`,
                    )}
                  ></Cart>
                </button>
              {/if}

              {#if topLevelKey === "properties" && openTimeMachine}
                <button
                  class="basket"
                  on:click={() => {
                    openTimeMachine({
                      datatype: "nudv-map",
                      subtype: "qubit-property",
                      key: `qubit_${qi}_anharmonicity`,
                      title_key: `qubit[${qi}].anharmonicity`,
                      qubit_index: qi,
                      property: `anharmonicity`,
                      parentKey,
                      topLevelKey,
                      data: qubit.anharmonicity,
                      code_header: `${code_header}${qi}, name="anharmonicity"`,
                      code_footer,
                      code_key: "",
                    });
                  }}
                >
                  <Clock></Clock>
                </button>
              {/if}
            </td>
            <td
              >{qubit.frequency.value}<br /><span class="asof"
                >({qubit.frequency.asof})</span
              >
              {#if addToBasket}
                <button
                  class="basket"
                  on:click={() => {
                    addToBasket(
                      `qubit_${key}_${qi}_frequency = ${code_header}${qi}, name="frequency"${code_footer}`,
                    );
                  }}
                >
                  <Cart
                    on={$basket.includes(
                      `qubit_${key}_${qi}_frequency = ${code_header}${qi}, name="frequency"${code_footer}`,
                    )}
                  ></Cart>
                </button>
              {/if}
              {#if topLevelKey === "properties" && openTimeMachine}
                <button
                  class="basket"
                  on:click={() => {
                    openTimeMachine({
                      datatype: "nudv-map",
                      subtype: "qubit-property",
                      key: `qubit_${qi}_frequency`,
                      title_key: `qubit[${qi}].frequency`,
                      qubit_index: qi,
                      property: `frequency`,
                      parentKey,
                      topLevelKey,
                      data: qubit.frequency,
                      code_header: `${code_header}${qi}, name="frequency"`,
                      code_footer,
                      code_key: "",
                    });
                  }}
                >
                  <Clock></Clock>
                </button>
              {/if}
            </td>
            <td>
              {#if qubit.prob_meas0_prep1?.value !== undefined}
                {qubit.prob_meas0_prep1?.value}<br />
                <span class="asof">({qubit.prob_meas0_prep1?.asof})</span>

                {#if addToBasket}
                  <button
                    class="basket"
                    on:click={() => {
                      addToBasket(
                        `qubit_${key}_${qi}_prob_meas0_prep1 = ${code_header}${qi}, name="prob_meas0_prep1"${code_footer}`,
                      );
                    }}
                  >
                    <Cart
                      on={$basket.includes(
                        `qubit_${key}_${qi}_prob_meas0_prep1 = ${code_header}${qi}, name="prob_meas0_prep1"${code_footer}`,
                      )}
                    ></Cart>
                  </button>
                {/if}
                {#if topLevelKey === "properties" && openTimeMachine}
                  <button
                    class="basket"
                    on:click={() => {
                      openTimeMachine({
                        datatype: "nudv-map",
                        subtype: "qubit-property",
                        key: `qubit_${qi}_prob_meas0_prep1`,
                        title_key: `qubit[${qi}].prob_meas0_prep1`,
                        qubit_index: qi,
                        property: `prob_meas0_prep1`,
                        parentKey,
                        topLevelKey,
                        data: qubit.prob_meas0_prep1,
                        code_header: `${code_header}${qi}, name="prob_meas0_prep1"`,
                        code_footer,
                        code_key: "",
                      });
                    }}
                  >
                    <Clock></Clock>
                  </button>
                {/if}
              {:else}
                -<br />
                <span class="asof">(-)</span>
              {/if}
            </td>
            <td>
              {#if qubit.prob_meas1_prep0?.value !== undefined}
                {qubit.prob_meas1_prep0?.value}<br /><span class="asof"
                  >({qubit.prob_meas1_prep0?.asof})</span
                >
                {#if addToBasket}
                  <button
                    class="basket"
                    on:click={() => {
                      addToBasket(
                        `qubit_${key}_${qi}_prob_meas1_prep0 = ${code_header}${qi}, name="prob_meas1_prep0"${code_footer}`,
                      );
                    }}
                  >
                    <Cart
                      on={$basket.includes(
                        `qubit_${key}_${qi}_prob_meas1_prep0 = ${code_header}${qi}, name="prob_meas1_prep0"${code_footer}`,
                      )}
                    ></Cart>
                  </button>
                {/if}
                {#if topLevelKey === "properties" && openTimeMachine}
                  <button
                    class="basket"
                    on:click={() => {
                      openTimeMachine({
                        datatype: "nudv-map",
                        subtype: "qubit-property",
                        key: `qubit_${qi}_prob_meas1_prep0`,
                        title_key: `qubit[${qi}].prob_meas1_prep0`,
                        qubit_index: qi,
                        property: `prob_meas1_prep0`,
                        parentKey,
                        topLevelKey,
                        data: qubit.prob_meas1_prep0,
                        code_header: `${code_header}${qi}, name="prob_meas1_prep0"`,
                        code_footer,
                        code_key: "",
                      });
                    }}
                  >
                    <Clock></Clock>
                  </button>
                {/if}
              {:else}
                -<br />
                <span class="asof">(-)</span>
              {/if}
            </td>
            <td
              >{qubit.readout_error.value}<br /><span class="asof"
                >({qubit.readout_error.asof})</span
              >

              {#if addToBasket}
                <button
                  class="basket"
                  on:click={() => {
                    addToBasket(
                      `qubit_${key}_${qi}_readout_error = ${code_header}${qi}, name="readout_error"${code_footer}`,
                    );
                  }}
                >
                  <Cart
                    on={$basket.includes(
                      `qubit_${key}_${qi}_readout_error = ${code_header}${qi}, name="readout_error"${code_footer}`,
                    )}
                  ></Cart>
                </button>
              {/if}
              {#if topLevelKey === "properties" && openTimeMachine}
                <button
                  class="basket"
                  on:click={() => {
                    openTimeMachine({
                      datatype: "nudv-map",
                      subtype: "qubit-property",
                      key: `qubit_${qi}_readout_error`,
                      title_key: `qubit[${qi}].readout_error`,
                      qubit_index: qi,
                      property: `readout_error`,
                      parentKey,
                      topLevelKey,
                      data: qubit.readout_error,
                      code_header: `${code_header}${qi}, name="readout_error"`,
                      code_footer,
                      code_key: "",
                    });
                  }}
                >
                  <Clock></Clock>
                </button>
              {/if}
            </td>
            <td
              >{qubit.readout_length.value}<br /><span class="asof"
                >({qubit.readout_length.asof})</span
              >

              {#if addToBasket}
                <button
                  class="basket"
                  on:click={() => {
                    addToBasket(
                      `qubit_${key}_${qi}_readout_length = ${code_header}${qi}, name="readout_length"${code_footer}`,
                    );
                  }}
                >
                  <Cart
                    on={$basket.includes(
                      `qubit_${key}_${qi}_readout_length = ${code_header}${qi}, name="readout_length"${code_footer}`,
                    )}
                  ></Cart>
                </button>
              {/if}
              {#if topLevelKey === "properties" && openTimeMachine}
                <button
                  class="basket"
                  on:click={() => {
                    openTimeMachine({
                      datatype: "nudv-map",
                      subtype: "qubit-property",
                      key: `qubit_${qi}_readout_length`,
                      title_key: `qubit[${qi}].readout_length`,
                      qubit_index: qi,
                      property: `readout_length`,
                      parentKey,
                      topLevelKey,
                      data: qubit.readout_length,
                      code_header: `${code_header}${qi}, name="readout_length"`,
                      code_footer,
                      code_key: "",
                    });
                  }}
                >
                  <Clock></Clock>
                </button>
              {/if}
            </td>
            <td>
              {#if addToBasket}
                <button
                  class="basket"
                  on:click={() => {
                    addToBasket(
                      `qubit_${key}_${qi} = ${code_header}${qi}${code_footer}`,
                    );
                  }}
                >
                  <Cart
                    on={$basket.includes(
                      `qubit_${key}_${qi} = ${code_header}${qi}${code_footer}`,
                    )}
                  ></Cart>
                </button>
              {/if}
            </td>
          </tr>
        {/each}
      </tbody>
    </table>
  </div>
  {#if descriptions[key]}
    <div class="desc">{descriptions[key]}</div>
  {/if}
</article>

<style>
  article {
    position: relative;
    padding: 0.5rem;
    border: 1px solid #aaa;
    background-color: #fafafa;
    box-shadow: 2px 2px 0 0 rgba(0, 0, 0, 0.15);
    grid-column: span 6;
  }
  .basket {
    position: absolute;
    top: 0.25rem;
    right: 0.25rem;
    padding: 0.25rem 0.5rem;
    appearance: none;
    border: 0;
    background-color: transparent;
    cursor: pointer;
    border-radius: 0.25rem;
    line-height: 100%;
  }
  .basket:hover {
    background-color: rgba(0, 0, 0, 0.15);
  }
  table .basket {
    position: relative;
    top: 0;
    right: 0;
    padding: 0;
  }
  h2 {
    font-size: 0.9rem;
    font-weight: 600;
    margin: 0 0 0.5rem 0;
  }
  h3 {
    font-size: 0.9rem;
    font-weight: 600;
    margin: 0 0 0.5rem 0;
  }
  .value {
    font-family: var(--font-mono);
    font-size: 1.1rem;
    max-height: 400px;
    overflow-y: scroll;
  }
  .desc {
    font-size: 0.85rem;
    color: #787878;
    margin-top: 0.5rem;
  }
  table {
    font-size: 0.9rem;
    border-collapse: collapse;
  }
  table th,
  table td {
    border: 1px solid #ddd;
    padding: 0.25rem 0.1rem;
  }
  table td {
    min-width: 130px;
  }
  table td:last-of-type {
    min-width: 30px;
    text-align: center;
  }
  thead th {
    background-color: white;
    position: sticky;
    top: -1px;
  }
  tbody th {
    min-width: 30px;
    background-color: white;
    position: sticky;
    left: 0;
  }
  .asof {
    color: #999;
    font-size: 0.8rem;
  }
  th button {
    padding: 0.15rem 0.25rem;
    appearance: none;
    border: 0;
    background-color: transparent;
    cursor: pointer;
    border-radius: 0.25rem;
    line-height: 100%;
  }
  th button:hover {
    background-color: rgba(0, 0, 0, 0.15);
  }
  td span {
    display: block;
  }

  table button,
  table tbody th {
    z-index: 99;
  }

  table th,
  table thead th {
    z-index: 999;
  }
</style>
