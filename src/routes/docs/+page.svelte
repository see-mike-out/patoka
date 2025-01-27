<script>
  import { browser } from "$app/environment";
  import { onMount } from "svelte";
  import { writable } from "svelte/store";
  import { docs_data } from "./docs_data";
  import Function from "./Function.svelte";
  import ClassElem from "./ClassElem.svelte";
  import CodeExample from "./CodeExample.svelte";

  let curr_item = writable("");
  onMount(() => {
    if (browser) {
      document.body.classList.remove("main");
    }
  });
</script>

<main class="container docs">
  <nav class="docs-items">
    <h3>Items</h3>
    <ul>
      {#each docs_data as d}
        <li>
          <a
            href={"#" + d.key}
            class={(d.key === $curr_item ? "active" : "") +
              (d.note ? "note" : "")}
            on:click={() => {
              curr_item.set(d.key);
            }}
          >
            {d.title}</a
          >
        </li>
      {/each}
    </ul>
  </nav>
  <section class="docs-contents">
    <h2>Documentation for APIs</h2>
    {#each docs_data as d}
      <article class={d.key === $curr_item ? "active" : ""} id={d.key}>
        <h3>
          {#if d.def?.function}
            <Function function_def={d.def}></Function>
          {:else if d.def?._class}
            <ClassElem class_def={d.def}></ClassElem>
          {:else if d.note}
            {d.note}
          {/if}
        </h3>
        <p>
          {@html d.description}
        </p>
        {#if d.def?.arguments && d.def?.arguments.length > 0}
          <h4>Function arguments</h4>
          <ul class="attr">
            {#each d.def?.arguments as arg}
              <li>
                <code>{arg.name}</code> ({arg.optional ? "optional, " : ""}<code
                  class="type">{arg.type}</code
                >{#if arg.default}, default=<code class="type"
                    >{arg.default}</code
                  >{/if}): {@html arg.description}
              </li>
            {/each}
          </ul>
        {/if}
        {#if d.def?._return}
          <h4>Returns</h4>
          <ul class="attr">
            {#if d.def?._return.length > 0}
              {#each d.def?._return as arg}
                <li>
                  <code>{arg.name}</code> ({arg.optional
                    ? "optional, "
                    : ""}<code class="type">{arg.type}</code>{#if arg.default},
                    default=<code class="type">{arg.default}</code>{/if}): {@html arg.description}
                </li>
              {/each}
            {:else}
              <li>None</li>
            {/if}
          </ul>
        {/if}
        {#if d.attributes}
          <h4>Instance Attributes</h4>
          <p>These attributes store information generated via the interface.</p>
          <ul class="attr">
            {#each d.attributes as attr}
              <li><code>{attr.key}</code>: {@html attr.description}</li>
            {/each}
          </ul>
        {/if}
        {#if d.anywidget_attributes}
          <h4>Widget Private Attributes</h4>
          <p>
            These attributes are delivered to HTML widgets. They are not
            intended to be called on Python.
          </p>
          <ul class="attr">
            {#each d.anywidget_attributes as attr}
              <li><code>{attr.key}</code>: {@html attr.description}</li>
            {/each}
          </ul>
        {/if}
        {#if d.methods}
          <h4>Methods</h4>
          <ul class="attr">
            {#each d.methods as method}
              <li>
                <Function function_def={method}></Function>: {@html method.description}
              </li>
            {/each}
          </ul>
        {/if}
        {#if d.example}
          <h4>Example</h4>
          <CodeExample id={"example-" + d.key} codes={d.example}></CodeExample>
        {/if}
      </article>
    {/each}
  </section>
</main>

<style>
  .docs {
    margin-top: 1rem;
    display: flex;
    column-gap: 1rem;
  }
  .docs-items {
    width: 200px;
    background-color: #fafafa;
    padding: 0.5rem;
    border-radius: 0.5rem;
    height: calc(100% - 3rem);
    overflow: scroll;
  }
  .docs-items h3 {
    margin: 0 0 0.5rem 0;
    font-size: 1rem;
    font-weight: 500;
  }
  .docs-items ul {
    list-style: none;
    margin: 0;
    padding: 0;
  }
  .docs-items ul li {
    width: 100%;
    font-size: 0.9rem;
    margin-top: 0.5rem;
  }
  .docs-items ul li a {
    color: #222;
    font-family: var(--monospace);
  }
  .docs-items ul li a:hover,
  .docs-items ul li a.active {
    color: orangered;
  }
  .docs-items ul li a.note {
    font-family: var(--sanserif);
  }
  .docs-contents {
    width: calc(100% - 200px - 1rem);
    height: calc(100vh - 8rem);
    overflow-y: scroll;
  }
  h2 {
    margin: 0 0 1rem 0;
    font-size: 1.5rem;
    font-weight: 500;
  }
  .docs-contents article {
    padding-bottom: 0.5rem;
    margin-bottom: 1rem;
    border-bottom: 1px solid #ddd;
  }
  .docs-contents article.active {
    background-color: rgba(255, 255, 0, 0.1);
  }
  h3 {
    margin: 0 0 0.5rem 0;
    font-size: 1.1rem;
    font-weight: 500;
    color: #222;
  }
  .docs-contents article p {
    color: #777;
    font-size: 0.9rem;
    padding: 0 0.5rem;
    margin: 0.25rem 0 0.25rem 0;
  }
  .docs-contents article h3 {
    background-color: #f3f3f3;
    padding: 0.25rem 0.5rem;
    border-radius: 0.25rem;
  }
  .docs-contents article h4 {
    padding: 0 0.5rem;
    margin: 1rem 0 0.25rem 0;
    font-weight: 600;
    font-size: 0.9rem;
  }
  .docs-contents article ul {
    margin-top: 0.25rem;
    margin-bottom: 0.25rem;
  }
  .docs-contents article ul li {
    color: #777;
  }
  :global(code) {
    font-family: var(--monospace);
    color: orangered;
  }
  ul.attr {
    font-size: 0.9rem;
  }
  code.type {
    color: teal;
  }
  :global(.docs-contents article a) {
    text-decoration: underline;
  }
  @media screen and (max-width: 600px) {
    .docs {
      display: block;
    }
    .docs-items {
      width: 100%;
      max-height: 300px;
      overflow-y: scroll;
      margin-bottom: 1rem;
    }
    .docs-contents {
      width: 100%;
      height: auto;
    }
  }
</style>
