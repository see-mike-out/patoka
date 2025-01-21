<script>
  import { writable } from "svelte/store";

  export let code_config = writable({});
</script>

<div class="code-config-wrap">
  <h4>Configure output code</h4>
  <div class="input-row">
    <div class="input-wrap">
      <label for="code_config-var_name"> Backend variable name </label>
      <input
        type="text"
        id="code_config-var_name"
        value={$code_config.backend_var_name}
        on:change={(e) => {
          code_config.update((c) => {
            c.backend_var_name = e.target.value;
            return c;
          });
        }}
      />
    </div>
    <div class="input-wrap">
      <label for="code_config-as_function"> Output code as a function </label>
      <input
        type="checkbox"
        id="code_config-as_function"
        checked={$code_config.as_function}
        on:change={(e) => {
          code_config.update((c) => {
            c.as_function = e.target.checked;
            return c;
          });
        }}
      />
    </div>
  </div>
</div>

<style>
  .code-config-wrap {
    padding: 0.5rem 1rem;
    margin: 0;
    border-bottom: 1px solid #ddd;
  }
  h4 {
    font-size: 1rem;
    font-weight: 600;
    margin: 0 0 0.5rem 0;
    line-height: 100%;
  }
  .input-row {
    display: flex;
    margin-top: 0.5rem;
    column-gap: 1.5rem;
  }
  .input-wrap {
    display: flex;
    column-gap: 0.5rem;
  }
  label {
    display: block;
    font-size: 0.9rem;
    padding: 0.5rem 0;
    border: 1px solid transparent;
  }
  input[type="text"] {
    display: block;
    font-family: var(--font-mono);
    border: 1px solid #ddd;
    border-radius: 0.25rem;
    padding: 0.25rem 0.5rem;
    font-size: 0.9rem;
    line-height: 100%;
  }
</style>
