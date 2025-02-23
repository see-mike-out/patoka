<script>
  import { writable } from "svelte/store";
  import SvgWrap from "../../CircuitViewer/svgs/SVGWrap.svelte";

  export let drawPlan = writable(),
    id = "max-cut-view";
</script>

{#if $drawPlan}
  <div class="max-cut-wrap">
    {#each $drawPlan as plan, pi}
      <div class="max-cut-item">
        <div class="max-cut-meta">
          <h4>Likely cut #{pi + 1}</h4>
          <ul>
            <li>
              Bitstring: {plan.meta.bit_key}
            </li>
            <li>
              Count: {plan.meta.count}
            </li>
            <li>
              Cost: {plan.meta.cost}
            </li>
            <li>
              Cuts: {plan.meta.cut.map((c) => `(${c.join(", ")})`).join(" / ")}
            </li>
          </ul>
        </div>
        <div class="max-cut-vis">
          <svg
            id={id + "-" + pi}
            width={plan.layout.width}
            height={plan.layout.height}
            viewBox={plan.layout.viewBox.join(" ")}
          >
            <style>
              g {
                font-family: Iosevka;
                font-size: 14px;
              }
            </style>
            <SvgWrap data={plan.layout.groups.edge_group}></SvgWrap>
            <SvgWrap data={plan.layout.groups.node_group}></SvgWrap>
          </svg>
        </div>
      </div>
    {/each}
  </div>
{/if}

<style>
  .max-cut-wrap {
    display: flex;
    column-gap: 1rem;
    row-gap: 1rem;
    padding: 1rem;
  }
  .max-cut-item {
    border-radius: 0.5rem;
    border: 1px solid #ddd;
    background-color: white;
    box-shadow:
      0 0 3px rgba(0, 0, 0, 0.1),
      0 0 5px rgba(0, 0, 0, 0.05);
  }
  .max-cut-meta {
    border-bottom: 1px solid #ddd;
  }
  .max-cut-item h4 {
    font-size: 0.9rem;
    border-radius: 0.5rem 0.5rem 0 0;
  }
  .max-cut-meta ul {
    padding: 0.5rem;
    margin: 0 0 0 1rem;
    font-size: 0.8rem;
    color: #333;
  }
</style>
