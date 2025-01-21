<script>
  import { writable } from "svelte/store";
  import { onDestroy, onMount } from "svelte";
  import { get_subtotals, pivotCountTable } from "../problem_parse/pivot_table";

  export let drawPlan = writable(),
    id = "pivot-table-view",
    problem_type = writable();

  let data_to_show = writable(),
    pivot = writable({}),
    pivot_set = writable([]),
    clbits = writable([]),
    sub_totals = writable([]);

  onMount(() => {
    drawPlan.subscribe((d) => {
      if ($problem_type === "pivot_table") {
        data_to_show.set(d);
        sub_totals.set(get_subtotals(d));
        let q = {};
        Object.keys(d[0])
          .filter((k) => !isNaN(parseInt(k)))
          .forEach((k) => {
            q[k] = false;
          });
        pivot.set(q);
        clbits.set(Object.keys(q));
      }
    });
    pivot_set.subscribe((p) => {
      if ($problem_type === "pivot_table") {
        let { data, sub_total } = pivotCountTable($drawPlan, p);
        data_to_show.set(data);
        sub_totals.set(sub_total);
      }
    });
  });
</script>

{#if $data_to_show}
  <div>
    <h5>Pivot by states</h5>
    <div class="pivot-wrap">
      {#each $clbits as bit, bi}
        <div class="input-wrap">
          <input
            id={"pivot-by-" + bit}
            type="checkbox"
            checked={$pivot[bit]}
            on:change={(e) => {
              pivot.update((p) => {
                p[bit] = e.target.checked;
                return p;
              });
              pivot_set.update((p) => {
                if (e.target.checked) {
                  if (!p.includes(bit)) p.push(bit);
                } else {
                  if (p.includes(bit)) {
                    p.splice(p.indexOf(bit), 1);
                  }
                }
                return p;
              });
            }}
          />
          <label for={"pivot-by-" + bit}>
            {bit}
          </label>
        </div>
      {/each}
      <div>
        <button
          on:click={(e) => {
            pivot_set.set([]);
            pivot.update((p) => {
              Object.keys(p).forEach((k) => {
                p[k] = false;
              });
              return p;
            });
          }}>Clear all</button
        >
      </div>
    </div>
  </div>
  <div class="tables">
    <div id={id + "-wrapper"} class="pivot-table-wrapper">
      <h5>Counts</h5>
      <table>
        <thead>
          <tr>
            <th> State </th>
            {#each $clbits as bit, bi}
              <th>{bit}</th>
            {/each}
            <th> Count </th>
          </tr>
        </thead>
        <tbody>
          {#each $data_to_show as row, ri}
            <tr>
              <th>
                {#if $pivot_set?.length > 0}
                  -
                {:else}
                  {row.state}
                {/if}
              </th>

              {#each $clbits as bit, bi}
                <td>
                  {#if $pivot_set?.length > 0 && $pivot_set.includes(bit)}
                    {row[bit]}
                  {:else if $pivot_set?.length == 0}
                    {row[bit]}
                  {:else}
                    -
                  {/if}
                </td>
              {/each}
              <td>{row.count}</td>
            </tr>
          {/each}
        </tbody>
      </table>
    </div>
    <div id={id + "-sub-total"} class="pivot-table-wrapper">
      <h5>Subtotals</h5>
      <table>
        <thead>
          <tr>
            <th> Bit </th>
            <th> 0 </th>
            <th> 1 </th>
            <th> Total </th>
          </tr>
        </thead>
        <tbody>
          {#each $sub_totals as row, ri}
            <tr>
              <th>
                {row.bit}
              </th>
              <td>{row["0"]}</td>
              <td>{row["1"]}</td>
              <td>{row["0"] + row["1"]}</td>
            </tr>
          {/each}
        </tbody>
      </table>
    </div>
  </div>
{/if}

<style>
  .pivot-table-wrapper {
    /* display: flex; */
    position: relative;
    max-height: 300px;
    overflow-y: scroll;
  }
  .tables {
    display: flex;
    column-gap: 1rem;
  }
  table {
    border-collapse: collapse;
  }
  table thead {
    position: sticky;
    top: 0;
  }
  table thead th {
    background-color: #f0f0f0;
  }
  table th {
    font-weight: 600;
  }
  table td,
  table th {
    border: 1px solid #999;
    padding: 0.5rem;
    font-size: 0.8rem;
  }
  h5 {
    margin: 0 0 0.25rem 0;
    padding: 0;
    font-family: iosevka;
  }

  .pivot-wrap {
    display: flex;
    margin-bottom: 1rem;
    font-size: 0.85rem;
    column-gap: 1.25rem;
  }
  .input-wrap {
    margin: 0;
    padding: 0;
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

  .pivot-wrap button {
    appearance: none;
    cursor: pointer;
    background-color: transparent;
    border: 0;
    padding: 0.15rem 0.5rem;
    font-size: 0.8rem;
    border: 1px solid #ddd;
    border-radius: 0.25rem;
  }
</style>
