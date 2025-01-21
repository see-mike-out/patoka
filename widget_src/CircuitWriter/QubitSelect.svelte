<script>
  export let id = "",
    label = "",
    checked = false,
    deactive = false,
    oncheck = () => {};
</script>

<div class="checkbox-item">
  <button
    class={checked ? "checked" : "unchecked"}
    disabled={deactive}
    {id}
    on:click={(e) => oncheck(!checked)}>{label}</button
  >
</div>

<style>
  .checkbox-item {
    padding: 0;
  }
  .checkbox-item button {
    appearance: none;
    padding: 0.5rem 0.5rem;
    border: 0;
    background-color: transparent;
    font-family: var(--font-mono);
    line-height: 100%;
    font-size: 0.9rem;
    cursor: pointer;
  }
  .checkbox-item button.checked {
    background-color: rgba(5, 118, 255, 0.2);
    font-weight: 700;
  }
</style>
