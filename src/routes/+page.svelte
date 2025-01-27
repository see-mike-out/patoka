<script>
  import thumb_job from "$lib/images/thumb-job.png";
  import thumb_machine from "$lib/images/thumb-machine.png";
  import thumb_view from "$lib/images/thumb-view.png";
  import thumb_write from "$lib/images/thumb-write.png";
</script>

<main class="container">
  <section id="main-description">
    <div class="display">
      <h2><span>Patoka</span></h2>
      <p>
        is a collection of interfaces for qunatum computing. <br /> Patoka runs on
        Jupyter Notebook with Qiskit.
      </p>
    </div>
    <div class="install">
      <h3><span style="color: orangered;">🞲</span> Install&nbsp;</h3>
      <div class="code-display">
        <pre>&gt; pip install patoka</pre>
      </div>
      <div class="prereq">
        Tested on: Python (3.9+), Jupyter Lab (4.1+), Qiskit (1.0+)
      </div>
    </div>
  </section>

  <section id="highlights">
    <h3>Feature highlights</h3>
    <div class="hilight-list">
      <div class="highlight-block">
        <h4>Circuit Writer</h4>
        <div class="thumbnail">
          <img
            src={thumb_write}
            alt="A thumbnail for Patoka's circuit writer"
          />
        </div>
        <div class="description">
          <p>Write a quantum circuit conceptually.</p>
          <p><a href="./previews/?widget=writer">→ Try demo</a></p>
        </div>
      </div>

      <div class="highlight-block">
        <h4>Circuit Viewer</h4>
        <div class="thumbnail">
          <img src={thumb_view} alt="A thumbnail for Patoka's circuit viewer" />
        </div>
        <div class="description">
          <p>Inspect your circuit and its optimization.</p>
          <p><a href="./previews/?widget=viewer">→ Try demo</a></p>
        </div>
      </div>

      <div class="highlight-block">
        <h4>Machine Explorer</h4>
        <div class="thumbnail">
          <img
            src={thumb_machine}
            alt="A thumbnail for Patoka's machine explorer"
          />
        </div>
        <div class="description">
          <p>Exploer machines and generate codes for future use.</p>
          <p><a href="./previews/?widget=machine">→ Try demo</a></p>
        </div>
      </div>

      <div class="highlight-block">
        <h4>Result Viewer</h4>
        <div class="thumbnail">
          <img src={thumb_job} alt="A thumbnail for Patoka's result viewer" />
        </div>
        <div class="description">
          <p>See your program's result with visualizations.</p>
          <p><a href="./previews/?widget=job">→ Try demo</a></p>
        </div>
      </div>
    </div>
  </section>
</main>

<style>
  #main-description {
    display: flex;
    margin-top: 5rem;
    margin-bottom: 6rem;
  }
  .display {
    width: 55%;
    background: rgba(255, 255, 255, 0.3);
    box-shadow: 0 0 2rem rgba(255, 255, 255, 0.65);
    border-radius: 2rem;
    padding: 1rem;
  }
  .install {
    width: 45%;
  }

  .display h2 {
    font-size: 8rem;
    margin: 0 0 1rem 0;
    font-weight: 300;
    line-height: 100%;
  }
  .display h2 span {
    background-image: linear-gradient(
      to right,
      #53b28d,
      #0199fa,
      #b439ea,
      #b439ea
    );
    color: transparent;
    background-clip: text;
    filter: drop-shadow(0 1px 5px rgba(255, 255, 255, 0.2))
      drop-shadow(0 0 15px rgba(255, 255, 255, 0.1));
  }
  .display p {
    margin: 1rem 0 0 0;
    padding-bottom: 0.5rem;
    font-size: 1.25rem;
    color: #333;
    font-weight: 300;
  }

  .install {
    padding: 1rem;
    padding-left: 3rem;
  }
  .install h3 {
    display: inline-block;
  }

  .code-display {
    width: 100%;
    background-color: black;
    padding: 0.5rem 1.5rem;
    border-radius: 0.45rem;
    /* border: 2px solid white; */
    box-shadow: 0 3px 5px rgba(0, 0, 0, 0.25);
    /* border: 3px solid rgba(0, 0, 0, 0.5); */
    color: white;
  }
  .prereq {
    margin-top: 1rem;
    color: #333;
    font-size: 0.9rem;
  }
  pre {
    font-family: var(--monospace);
  }

  #highlights {
    margin-top: 5rem;
    margin-bottom: 2rem;
  }

  #highlights h3 {
    display: inline-block;
    margin: 0;
  }

  h3 {
    font-size: 1.25rem;
    font-weight: 500;
    margin-top: 1rem;
    margin-bottom: 1rem;
    border-bottom: 3px solid orangered;
  }
  .hilight-list {
    display: grid;
    grid-template-columns: 1fr 1fr 1fr 1fr;
    column-gap: 1.5rem;
  }
  .highlight-block {
    margin-top: 1rem;
  }
  .highlight-block .thumbnail {
    width: 100%;
    margin-left: -0.5rem;
    margin-right: -0.5rem;
  }
  .highlight-block .thumbnail img {
    display: block;
    width: 100%;
    border-radius: 0.5rem;
    border: 1px solid #ddd;
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  }
  .highlight-block h4 {
    font-weight: 600;
    font-size: 1.1rem;
    margin: 0.2rem 0 0.5rem 0;
  }
  .highlight-block .description p {
    font-size: 0.9rem;
  }
  .highlight-block .description a {
    color: orangered;
  }

  @media screen and (max-width: 700px) {
    #main-description {
      margin-top: 0;
      margin-bottom: 3rem;
      display: block;
    }
    .display,
    .install {
      width: 100%;
    }
    .display {
      width: calc(100% + 2rem);
      margin-left: -1rem;
      padding: 3rem 1rem;
      background: linear-gradient(
        to bottom,
        rgba(255, 255, 255, 0),
        rgba(255, 255, 255, 0.3) 15%,
        rgba(255, 255, 255, 0.3) 85%,
        rgba(255, 255, 255, 0)
      );
      box-shadow: none;
      border-radius: 0;
    }
    .display h2 {
      font-size: 4rem;
    }
    .display p {
      font-size: 1.1rem;
    }
    .install {
      padding: 1rem 0;
    }
    #highlights {
      margin-top: 3rem;
    }
    .hilight-list {
      grid-template-columns: 1fr 1fr;
      column-gap: 1rem;
    }
  }
</style>
