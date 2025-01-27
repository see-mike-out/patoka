<script>
  export let info;
</script>

{#if info}
  <div>
    <h2>
      Qubit {info.qubit.index}
      {info.this_circuit_id === "original-circuit" ? "(original)" : ""}
      {info.this_circuit_id === "transpiled-circuit" ? "(transpiled)" : ""}
    </h2>
    <div class="info-section">
      <table>
        <tbody>
          <tr>
            <th>Qubit index</th><td>{info.qubit.index}</td>
          </tr>
          {#if info.qubit.register}
            <tr>
              <th>Register</th><td
                >{info.qubit.register.name} ({info.qubit.register.size})</td
              >
            </tr>
          {/if}
          {#if info.bit_match !== undefined}
            <tr>
              <th>Transpiled to</th><td>{info.bit_match.to}</td>
            </tr>
          {/if}
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
</style>
