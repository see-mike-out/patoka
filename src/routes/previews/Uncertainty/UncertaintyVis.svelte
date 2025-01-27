<script>
  import { onDestroy, onMount } from "svelte";
  import { writable } from "svelte/store";
  import VisWrap from "./VisWrap.svelte";
  export let model;
  export let key_data = "vis_data",
    key_design = "design";
  let vis_data = JSON.parse(model.get(key_data));
  let design_spec = JSON.parse(model.get(key_design));

  let event = `change:${key_data}`;
  let callback = () => (circ = model.get(key_data));

  let data = writable();
  let design = writable();

  let images = {};
  let images_loader = writable();
  images_loader.subscribe((d) => {
    if (d) {
      images[d.id] = d;
    }
  });

  let id;
  onMount(() => {
    id = "uv-" + Number(new Date())
    data.set(vis_data);
    design.set(design_spec);
    model.on(event, callback);
  });

  onDestroy(() => {
    model.off(event, callback);
  });
</script>

<div class="wrap">
  <h1>Hypothetical error adjustment for measured outcomes</h1>
  <section class="meta">
    {#if $data}
      <div class="meta_info">
        <h2>Meta information</h2>
        <ul>
          <li>
            <strong>Sampling counts</strong>: {$data.metadata.sampling_counts}
          </li>
          <li><strong>Sample size</strong>: {$data.metadata.sample_size}</li>
          <li><strong>CI %</strong>: {$data.metadata.ci_alpha}</li>
          <li><strong>Bootstrap?</strong>: {$data.metadata.bootstrap}</li>
          <li><strong>Estimated Success Probability (ESP)</strong>: {$data.metadata.esp}</li>
          {#if $data.mean_sim_error}
            <li><strong>Mean simulation error</strong>: {$data.mean_sim_error}</li>
          {/if}
        </ul>
      </div>
    {/if}
    {#if $design}
      <div class="control">
        <h2>Design controls</h2>
        <div class="control-box">
          <div>
            <input
              type="checkbox"
              id={id + "-design-hops"}
              name={id + "-design-hops"}
              checked={$design.HOPS}
              on:change={(e) => {
                design.update((ds) => {
                  ds.HOPS = e.target.checked;
                  return ds;
                });
              }}
            />
            <label for={id + "-design-hops"}>Use HOPS</label>
          </div>
          {#if $design.HOPS}
            <div>
              <input
                type="number"
                id={id + "-design-hops-speed"}
                name={id + "-design-hops-speed"}
                value={$design.HOPS_speed}
                by="1"
                on:change={(e) => {
                  design.update((ds) => {
                    ds.HOPS_speed = parseInt(e.target.value);
                    return ds;
                  });
                }}
              />
              <label for={id + "-design-hops-speed"}>HOPS animation speed</label>
            </div>
          {/if}
          <div>
            <label for={id + "-design-dir"}>Direction</label>
            <select
              type="checkbox"
              id={id + "-design-dir"}
              name={id + "-design-dir"}
              value={$design.direction}
              on:change={(e) => {
                design.update((ds) => {
                  ds.direction = e.target.value;
                  return ds;
                });
              }}
            >
              <option
                value="horizontal"
                selected={$design.direction == "horizontal"}>Horizontal</option
              >
              <option
                value="vertical"
                selected={$design.direction == "vertical"}>Vertical</option
              >
            </select>
          </div>
        </div>
      </div>
    {/if}
  </section>
  <section class="content">
    {#key design}
      <VisWrap {id} {data} {design}></VisWrap>
    {/key}
  </section>
</div>

<style>
  * {
    box-sizing: border-box;
    font-family: sans-serif;
  }
  .wrap {
    border: 1px solid #ddd;
    border-radius: 0.5rem;
    overflow: hidden;
  }
  h1 {
    margin: 0;
    padding: 0.5rem;
    font-size: 1.1rem;
    line-height: 100%;
    border-bottom: 1px solid #ddd;
    border-radius: 0.5rem 0.5re 0 0;
    background-color: #f0f0f0;
  }
  h2 {
    margin: 0 0 0.5rem 0;
    font-size: 1rem;
    line-height: 100%;
    font-weight: 600;
  }
  .meta {
    display: flex;
    padding: 0;
    font-size: 0.85rem;
    border-bottom: 1px solid #ddd;
  }
  .meta > div {
    padding: 1rem;
  }
  .meta strong {
    font-weight: 600;
    font-family: iosevka;
  }
  .meta ul {
    list-style-type: "- ";
    padding: 0 0 0 1rem;
    margin: 0;
  }
  .meta ul li {
    padding-left: 0.5rem;
    font-family: iosevka;
  }
  .control {
    border-left: 1px solid #ddd;
  }
  .control-box {
    display: flex;
    flex-direction: column;
    row-gap: 0.5rem;
  }
  .content {
    padding: 1rem;
  }
</style>
