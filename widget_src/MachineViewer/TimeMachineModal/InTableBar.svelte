<script>
  export let value = 0,
    min = 0,
    max = 1,
    color = "dodgerblue";
</script>

<div
  class="in-table-bar"
  style={`width: ${((value - min) / (max - min)) * 100}%; ${color ? "background-color:" + color + ";" : ""}`}
></div>

<style>
  .in-table-bar {
    height: 0.9rem;
  }
</style>
