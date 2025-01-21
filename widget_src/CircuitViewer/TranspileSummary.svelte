<script>
  import { onMount } from "svelte";
    import { round } from "./svg_utils/util";

  export let transpile_data = [];
  let specified_parameters = [];
  function update_parameter_list(data) {
    let res = [];
    for (let key of Object.keys(data?.[0]?.transpile_param || {})) {
      if (
        data.some((d) => {
          return (
            d.transpile_param[key] != undefined &&
            d.transpile_param[key] !== false &&
            d.transpile_param[key] !== "default"
          );
        })
      )
        res.push(key);
    }
    return res;
  }
  function shorten_backend_name(name) {
    let n2 = name;
    n2 = n2.replace("ibmq_", "")
    n2 = n2.replace("ibm_", "")
    n2 = n2.replace("fake_", "")
    n2 = n2.replace("aer_simulator_from(", "")
    n2 = n2.replace(/\)$/gi, "")
    return n2;
  }
  onMount(() => {
    specified_parameters = update_parameter_list(transpile_data);
  });
  $: {
    specified_parameters = update_parameter_list(transpile_data);
  }
</script>

<div>
  {#if transpile_data}
    <table>
      <thead>
        <tr>
          <th></th>
          {#each transpile_data as trans, ti}
            <td>
              #{ti}
            </td>
          {/each}
        </tr>
      </thead>
      <tbody>
        <tr>
          <th class="gap"> Backend </th>
          <td colspan={transpile_data.length || 0} class="gap"> </td>
        </tr>
        <tr>
          <th> Name </th>
          {#each transpile_data as trans, ti}
            <td>
              {shorten_backend_name(trans?.backend?.machine_data?.backend_name)}
            </td>
          {/each}
        </tr>
        <tr>
          <th> #Qubits </th>
          {#each transpile_data as trans, ti}
            <td>
              {trans?.backend?.design?.nodes.length}
            </td>
          {/each}
        </tr>
        <tr>
          <th class="gap"> Params </th>
          <td colspan={transpile_data.length || 0} class="gap"> </td>
        </tr>
        {#each specified_parameters as key}
          <tr>
            <th> {key} </th>
            {#each transpile_data as trans, ti}
              <td>
                {trans?.transpile_param?.[key]}
              </td>
            {/each}
          </tr>
        {/each}
        <tr>
          <th class="gap"> Post </th>
          <td colspan={transpile_data.length || 0} class="gap"> </td>
        </tr>
        <tr>
          <th> #Layers </th>
          {#each transpile_data as trans, ti}
            <td>
              {trans?.layers?.length}
            </td>
          {/each}
        </tr>
        <tr>
          <th> #Operations </th>
          {#each transpile_data as trans, ti}
            <td>
              {trans?.layers
                ?.map((d) => d.operations.length)
                .reduce((a, c) => a + c, 0)}
            </td>
          {/each}
        </tr>
        <tr>
          <th> ESP </th>
          {#each transpile_data as trans, ti}
            <td>
              {round(trans?.esp, 8)}
            </td>
          {/each}
        </tr>
      </tbody>
    </table>
  {/if}
</div>

<style>
  div {
    font-size: 0.8rem;
    position: relative;
    overflow-x: scroll;
  }
  table {
    font-family: iosevka;
    border-collapse: collapse;
  }
  table th {
    font-weight: 600;
    text-align: right;
    padding-left: 0.5rem;
    padding-right: 0.5rem;
    position: sticky;
    left: 0;
    z-index: 300;
    background-color: white;
  }
  table th,
  table td {
    border-top: 1px solid #ddd;
    border-right: 1px solid #ddd;
    padding-top: 0.35rem;
    padding-bottom: 0.35rem;
    line-height: 100%;
  }
  table td {
    padding-left: 0.5rem;
    padding-right: 0.5rem;
    border-left: 1px solid #ddd;
    z-index: 200;
  }

  table thead td,
  table thead th {
    border-top: 0;
  }
  td.gap,
  th.gap {
    background-color: #f0f0f0;
    font-style: italic;
    font-size: 0.7rem;
    padding-top: 0.15rem;
    padding-bottom: 0.15rem;
  }
</style>
