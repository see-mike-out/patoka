<script>
  export let info;
</script>

{#if info}
  <div>
    <h2>
      ESP for Layer {info.layer_index}
    </h2>
    <div class="info-section">
      <table>
        <tbody>
          <tr>
            <th>Layer (moment)</th><td>{info.layer_index}</td>
          </tr>
          <tr>
            <th>Current ESP</th><td>{info.esp_this}</td>
          </tr>
          <tr>
            <th>Cumulative ESP</th><td>{info.esp_total}</td>
          </tr>

          {#each info.operations as op, oi}
            <tr class="first">
              <th>Operation {oi}</th><td>{op.gate}</td>
            </tr>
            <tr>
              <th>Qubits</th><td>{op.qubits.map((d) => d.index).join(", ")}</td>
            </tr>
            <tr>
              <th>Gate_error</th><td>{info.detail[oi]?.gate_error}</td>
            </tr>
          {/each}
        </tbody>
      </table>
    </div>
  </div>
{/if}

<style>
  * {
    box-sizing: border-box;
    line-height: 100%;
  }
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
  tr.first,
  tr.first th,
  tr.first td {
    border-top: 2px solid #000 !important;
  }
</style>
