<script>
  import { onDestroy, onMount } from "svelte";
  import { writable } from "svelte/store";
  import { getSVGimageLink } from "../../CircuitViewer/svg_utils/util";
  import { problem_types } from "../problem_parse/problem_types";
  import { parseNaturalNumberProblem } from "../problem_parse/natural_number";
  import { parseTruthTableProblem } from "../problem_parse/truth_table";
  import { parsePivotTableProblem } from "../problem_parse/pivot_table";
  import {
    parse1DImageProblem,
    parse3DImageProblem,
  } from "../problem_parse/image";
  import NaturalNumberView from "./NaturalNumberView.svelte";
  import TruthTableView from "./TruthTableView.svelte";
  import PivotTableView from "./PivotTableView.svelte";
  import ImageView from "./ImageView.svelte";

  export let data = writable(),
    config = writable({
    }),
    id = "problem-view";

  let hide1 = writable(true);
  let drawPlan = writable();
  let problem_type = writable("natural_number");

  function get_draw_plans(counts, ptype, c) {
    delete images[id];
    if (ptype === "natural_number") {
      drawPlan.set(parseNaturalNumberProblem(counts, c));
    } else if (ptype === "truth_table") {
      drawPlan.set(parseTruthTableProblem(counts, c));
    } else if (ptype === "pivot_table") {
      drawPlan.set(parsePivotTableProblem(counts, c));
    } else if (ptype === "image_1d") {
      drawPlan.set(parse1DImageProblem(counts, c));
    } else if (ptype === "image_3d") {
      drawPlan.set(parse3DImageProblem(counts, c));
    }
  }
  onMount(() => {
    if ($data.n_shots) {
      config.update((c) => {
        c.n_shots = $data.n_shots;
        return c;
      });
    }
    problem_type.subscribe((t) => {
      get_draw_plans($data.counts, t, $config);
    });
    config.subscribe((c) => {
      get_draw_plans($data.counts, $problem_type, c);
    });
    data.subscribe((d) => {
      get_draw_plans(d.counts, $problem_type, $config);
    });
  });

  // tooltips
  let showTooltip = false,
    tooltip_x,
    tooltip_y,
    tootlip_content;

  function openTooltip(e, cont) {
    showTooltip = true;
    tooltip_x = e.clientX + 5;
    tooltip_y = e.clientY + 5;
    tootlip_content = cont;
  }
  function moveTooltip(e) {
    if (showTooltip) {
      tooltip_x = e.clientX + 5;
      tooltip_y = e.clientY + 5;
    }
  }
  function closeTooltip() {
    showTooltip = false;
  }

  // images
  let images = {};
  let images_loader = writable();
  images_loader.subscribe((d) => {
    if (d) {
      images[d.id] = d;
    }
  });
</script>

{#if $data}
  <article class="panel">
    <h4>
      Problem-specific results view

      <button on:click={(e) => hide1.set(!$hide1)}
        >{$hide1 ? "Show" : "Hide"}</button
      >
      <button
        class="save-make"
        on:click={(e) => {
          getSVGimageLink("problem-number", images_loader);
        }}>Image</button
      >
      {#if images["problem-number"]}
        <a class="save-download" href={images["problem-number"].png} download
          >PNG</a
        >
        <a class="save-download" href={images["problem-number"].svg} download
          >SVG</a
        >
      {/if}
    </h4>
    <div class="content-wrap">
      {#if !$hide1}
        <div class="input-wrap">
          <label for="problem-type">Choose a problem type: </label>
          <select
            id="problem-type"
            on:change={(e) => {
              console.log(e.target.value);
              if (!e.target.value) {
                problem_type.set(undefined);
              } else {
                problem_type.set(e.target.value);
              }
            }}
          >
            <option value={null}></option>
            {#each problem_types as t}
              <option value={t.key} selected={t.key === $problem_type}
                >{t.name}</option
              >
            {/each}
          </select>
        </div>
        {#if $problem_type === "truth_table"}
          <div class="input-wrap">
            <input
              id="config-truth"
              type="checkbox"
              checked={$config?.filter_true}
              on:change={(e) => {
                config.update((c) => {
                  c.filter_true = e.target.checked;
                  return c;
                });
              }}
            />
            <label for="config-truth">
              {#if $config?.filter_true}
                Show only true outcomes.
              {:else}
                Show all outcomes.
              {/if}
            </label>
          </div>
        {:else if $problem_type === "image_1d" || $problem_type === "image_3d"}
          <div class="input-group">
            <div class="input-wrap">
              <label for="image_width"> Image width (px): </label>
              <input
                id="image_width"
                type="number"
                value={$config?.image_width}
                on:change={(e) => {
                  config.update((c) => {
                    c.image_width = parseInt(e.target.value);
                    return c;
                  });
                }}
              />
            </div>
            <div class="input-wrap">
              <label for="image_height"> Image height (px): </label>
              <input
                id="image_height"
                type="number"
                value={$config?.image_height}
                on:change={(e) => {
                  config.update((c) => {
                    c.image_height = parseInt(e.target.value);
                    return c;
                  });
                }}
              />
            </div>
            {#if $problem_type === "image_3d" || $problem_type === "image_1d"}
              <div class="input-wrap">
                <label for="dir"> Direction: </label>
                <select
                  id="dir"
                  type="number"
                  value={$config?.dir}
                  on:change={(e) => {
                    config.update((c) => {
                      c.dir = e.target.value;
                      return c;
                    });
                  }}
                >
                  <option value="row">Row-first</option>
                  <option value="col">Column-first</option>
                </select>
              </div>
            {/if}
            <div class="input-wrap">
              <label for="magnitude"> Magnitude: </label>
              <input
                id="magnitude"
                type="number"
                value={$config?.magnitude}
                on:change={(e) => {
                  config.update((c) => {
                    c.magnitude = parseFloat(e.target.value);
                    return c;
                  });
                }}
              />
            </div>
            <div class="input-wrap">
              <label for="resolution"> Zoom by: </label>
              <input
                id="resolution"
                type="number"
                value={$config?.resolution}
                on:change={(e) => {
                  config.update((c) => {
                    c.resolution = parseFloat(e.target.value);
                    return c;
                  });
                }}
              />
            </div>
          </div>
        {/if}
        <div class="vis-wrap">
          {#if $drawPlan}
            {#if $problem_type === "natural_number"}
              <NaturalNumberView {drawPlan} {id} {problem_type}
              ></NaturalNumberView>
            {:else if $problem_type === "truth_table"}
              <TruthTableView {drawPlan} {id} {problem_type}></TruthTableView>
            {:else if $problem_type === "pivot_table"}
              <PivotTableView {drawPlan} {id} {problem_type}></PivotTableView>
            {:else if $problem_type === "image_1d" || $problem_type === "image_3d"}
              <ImageView {drawPlan} {id} {problem_type}></ImageView>
            {/if}
          {/if}
        </div>
      {/if}
    </div>
  </article>
{/if}

<style>
  .panel {
    grid-column: span 6;
  }

  .input-group {
    display: flex;
    column-gap: 1rem;
  }
  .input-wrap {
    margin: 0 0 0.5rem 0;
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

  :global(.g-tooltip .item) {
    display: block;
  }

  .note {
    font-size: 0.8rem;
    color: #999;
    margin: 0.5rem;
  }

  .save-make,
  .save-download {
    appearance: none;
    display: inline-block;
    font-size: 0.8rem;
    text-decoration: none;
    margin-left: 0.25rem;
    color: #454545;
    border: 0;
    padding: 0;
    background-color: transparent;
    cursor: pointer;
  }
  .save-make:hover,
  .save-download:hover {
    outline: 2px solid orange;
  }
</style>
