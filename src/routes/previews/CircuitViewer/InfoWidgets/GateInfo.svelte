<script>
  import { get_radian_names } from "../svg_utils/util";

  export let info;
</script>

{#if info}
  <div>
    <h2>
      Operation {info.operation.gate}
      {info.this_circuit_id === "original-circuit" ? "(original)" : ""}
      {info.this_circuit_id === "transpiled-circuit" ? "(transpiled)" : ""}
    </h2>
    <div class="info-section">
      <table>
        <tbody>
          <tr>
            <th>Gate name</th><td>{info.operation.gate}</td>
          </tr>
          <tr>
            <th>Layer (moment)</th><td>{info.layer_index}</td>
          </tr>
          <tr>
            <th>Operation index</th><td>{info.operation_index}</td>
          </tr>
          <tr>
            <th># Qubits</th><td>{info.operation.num_qubits}</td>
          </tr>
          {#if info.operation.num_qubits > 0}
            <tr>
              <th>Qubits</th><td
                >{info.operation.qubits.map((d) => d.index).join(", ")}</td
              >
            </tr>
          {/if}
          <tr>
            <th># bits</th><td>{info.operation.num_clbits}</td>
          </tr>
          {#if info.operation.num_clbits > 0}
            <tr>
              <th>Bits</th><td
                >{info.operation.clbits.map((d) => d.index).join(", ")}</td
              >
            </tr>
          {/if}

          {#if info.operation.params}
            {#each info.operation.params as param, pi}
              <tr>
                <th>Parameter {pi + 1}</th><td
                  >{get_radian_names(param, true)}</td
                >
              </tr>
            {/each}
          {/if}

          {#if info.layer_match?.matches && info.this_circuit_id === "original-circuit"}
            <tr>
              <th>Matches (layer-op)</th><td
                >{info.layer_match.matches
                  .map((d) => `${d[0]}-${d[1]}`)
                  .join(", ")}</td
              >
            </tr>
            <tr>
              <th>Complete match?</th><td>{info.layer_match.complete}</td>
            </tr>
          {/if}
          {#if info.layer_match?.colleagues && info.this_circuit_id === "transpiled-circuit"}
            <tr>
              <th>Transpiled from</th><td
                >{info.layer_match.layer}-{info.layer_match.operation}</td
              >
            </tr>
            <tr>
              <th>Other in-group ops</th><td
                >{info.layer_match.colleagues
                  .map((d) => `${d[0]}-${d[1]}`)
                  .join(", ")}</td
              >
            </tr>
            <tr>
              <th>Complete match?</th><td>{info.layer_match.complete}</td>
            </tr>
          {/if}
        </tbody>
      </table>
    </div>
  </div>
{/if}

<style>
  h2 {
    margin: 0;
    padding: 0.25rem 0.5rem;
    font-size: 0.85rem;
    border-bottom: 1px solid #ddd;
    line-height: 100%;
  }

  .info-section {
    padding: 0;
  }
  table {
    width: 100%;
    font-family: iosevka;
    border-collapse: collapse;
    border-radius: 0.5rem;
  }
  table th,
  table td {
    border-bottom: 1px solid #ddd;
    padding: 0.35rem 0.5rem;
    text-align: left;
  }
  table th {
    border-right: 1px solid #ddd;
  }
  table tr:last-of-type th,
  table tr:last-of-type td {
    border-bottom: 0;
  }
</style>
