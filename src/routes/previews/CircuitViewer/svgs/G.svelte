<script>
  import SvgWrap from "./SVGWrap.svelte";
  export let data = {},
    open_tool = () => {},
    openTooltip = () => {},
    closeTooltip = () => {},
    moveTooltip = () => {};

  function getQubitMatchEls(data) {
    let el1, el2, el3;
    if (data._class.includes(" original")) {
      el1 = [
        document.querySelector(
          `#circuit-viewer-${data.data.unit_id} #${data.data.this_circuit_id}-sticky .qubit-background.qubit-${data.data.bit_match?.from}`,
        ),
      ];
      el2 = data.data.matched_circuit_id.map((mcid) =>
        document.querySelector(
          `#circuit-viewer-${data.data.unit_id} #${mcid}-sticky .qubit-background.qubit-${data.data.bit_match?.to}`,
        ),
      );
      el3 = data.data.matched_machine_id.map((mmid) =>
        document.querySelector(
          `#circuit-viewer-${data.data.unit_id} #${mmid} #qubit-node-${data.data.bit_match?.to}--group`,
        ),
      );
    } else if (data._class.includes(" transpiled")) {
      el1 = data.data.matched_circuit_id.map((mcid) =>
        document.querySelector(
          `#circuit-viewer-${data.data.unit_id} #${mcid}-sticky .qubit-background.qubit-${data.data.bit_match?.from}`,
        ),
      );
      el2 = [
        document.querySelector(
          `#circuit-viewer-${data.data.unit_id} #${data.data.this_circuit_id}-sticky .qubit-background.qubit-${data.data.bit_match?.to}`,
        ),
      ];
      el3 = data.data.matched_machine_id.map((mmid) =>
        document.querySelector(
          `#circuit-viewer-${data.data.unit_id} #${mmid} #qubit-node-${data.data.bit_match?.to}--group`,
        ),
      );
    } else if (data._class.includes("qubit-node--group")) {
      el1 = [
        document.querySelector(
          `#circuit-viewer-${data.data.unit_id} #${data.data.original_circuit_id}-sticky .qubit-background.qubit-${data.data?.original_qubit_id}`,
        ),
      ];
      el2 = [
        document.querySelector(
          `#circuit-viewer-${data.data.unit_id} #${data.data.transpiled_circuit_id}-sticky .qubit-background.qubit-${data.data?.qubit_id}`,
        ),
      ];
      el3 = [
        document.querySelector(
          `#circuit-viewer-${data.data.unit_id} #${data.data.id} #qubit-node-${data.data.qubit_id}--group`,
        ),
      ];
    }
    return [...el1, ...el2, ...el3];
  }

  function getOpMatchEls(data) {
    let els = [],
      tel = [];
    if (data._class.includes(" original")) {
      els = data.data.layer_match.matches
        .map((d) => {
          return data.data.matched_circuit_id.map((mcid) =>
            document.querySelector(`#circuit-viewer-${data.data.unit_id} #${mcid} #layer-${d[0]}--interaction-wrap`),
          );
        })
        .flat();
      els.push(
        document.querySelector(
          `#circuit-viewer-${data.data.unit_id} #${data.data.this_circuit_id} #layer-${data.data.layer_match.layer}--interaction-wrap`,
        ),
      );
      tel = data.data.layer_match.matches
        .map((d) => {
          return data.data.matched_circuit_id.map((mcid) =>
            document.querySelector(
              `#circuit-viewer-${data.data.unit_id} #${mcid} .gate-wrap.layer-${d[0]}.gate-${d[1]}`,
            ),
          );
        })
        .flat();
      tel.push(
        document.querySelector(
          `#circuit-viewer-${data.data.unit_id} #${data.data.this_circuit_id} .gate-wrap.layer-${data.data.layer_index}.gate-${data.data.operation_index}`,
        ),
      );
    } else if (data._class.includes(" transpiled")) {
      els =
        data?.data?.layer_match?.colleagues?.map((d) => {
          return document.querySelector(
            `#circuit-viewer-${data.data.unit_id} #${data.data.this_circuit_id} #layer-${d[0]}--interaction-wrap`,
          );
        }) || [];
      if (data?.data?.layer_match?.layer !== undefined) {
        els.push(
          ...data.data.matched_circuit_id.map((mcid) =>
            document.querySelector(
              `#circuit-viewer-${data.data.unit_id} #${mcid} #layer-${data.data.layer_match?.layer}--interaction-wrap`,
            ),
          ),
        );
      }
      tel =
        data?.data?.layer_match?.colleagues?.map((d) => {
          return document.querySelector(
            `#circuit-viewer-${data.data.unit_id} #${data.data.this_circuit_id} .gate-wrap.layer-${d[0]}.gate-${d[1]}`,
          );
        }) || [];
      if (data?.data?.layer_match?.layer !== undefined) {
        tel.push(
          ...data.data.matched_circuit_id.map((mcid) =>
            document.querySelector(
              `#circuit-viewer-${data.data.unit_id} #${mcid} .gate-wrap.layer-${data.data.layer_match?.layer}.gate-${data.data.layer_match?.operation}`,
            ),
          ),
        );
      }
    } else if (data._class.includes(" on-machine")) {
      els = [];
      els.push(
        document.querySelector(
          `#circuit-viewer-${data.data.unit_id} #${data.data.original_circuit_id} .gate-wrap.layer-${data.data.original_layer_index}.gate-${data.data.original_operation_index}`,
        ),
      );
      tel = [];
      tel.push(
        document.querySelector(
          `#circuit-viewer-${data.data.unit_id} #${data.data.transpiled_circuit_id} .gate-wrap.layer-${data.data.layer_index}.gate-${data.data.operation_index}`,
        ),
      );
    }
    return [els, tel];
  }

  function getPulsePathPiece(data) {
    let els = [];
    if (data._class.includes(" on-machine")) {
      els = [];
      els.push(
        document.querySelector(
          `#circuit-viewer-${data.data.unit_id} #${data.data.pulse_view_id} .pulse-path--layer-${data.data.layer_index}--op-${data.data.operation_index}`,
        ),
      );
    }
    return [els];
  }

  function generateTooltipContent(tooltip_content) {
    return (
      "<table>" +
      Object.keys(tooltip_content)
        .map((k) => {
          if (k === "priority") return "";
          return `<tr><th>${k}:</th><td>${tooltip_content[k]}</td></tr>`;
        })
        .join(" ") +
      "</table>"
    );
  }
  let clicked_tooltip = false;
</script>

{#if data}
  <!-- svelte-ignore a11y-no-static-element-interactions -->
  <!-- svelte-ignore a11y-mouse-events-have-key-events -->
  <!-- svelte-ignore a11y-click-events-have-key-events -->
  <g
    id={data.id}
    class={data._class}
    data-role={data.role}
    height={data.height}
    width={data.width}
    transform={`translate(${data.x} ${data.y})`}
    on:mouseover={(e) => {
      if (data.role === "qubit-group" || data.role === "qubit-node--group") {
        let [el1, el2, el3] = getQubitMatchEls(data);
        if (el1) {
          el1.style.fill = data.data.match_color;
        }
        if (el2) {
          el2.style.fill = data.data.match_color;
        }
        if (el3) {
          el3.style.outline = `2px solid  ${data.data.match_color}`;
        }
      } else if (data.role === "gate-group") {
        let [els, tel] = getOpMatchEls(data);
        if (els) {
          els.forEach((el) => {
            if (el) {
              el.style.fill = data.data.match_color;
              el.style.fillOpacity = 0.2;
            }
          });
        }
        if (tel) {
          tel.forEach((el) => {
            if (el) el.style.outline = `2px solid  ${data.data.match_color}`;
          });
        }
      } else if (data.role === "op-layer-operation-group") {
        let [els, tel] = getOpMatchEls(data);
        if (els) {
          els.forEach((el) => {
            if (el) el.style.outline = `2px solid  ${data.data.match_color}`;
          });
        }
        if (tel) {
          tel.forEach((el) => {
            if (el) el.style.outline = `2px solid  ${data.data.match_color}`;
          });
        }
        let [pls] = getPulsePathPiece(data);
        if (pls) {
          pls.forEach((el) => {
            if (el) el.style.outline = `2px solid  ${data.data.match_color}`;
          });
        }
      }
      if (data?.data?.tooltip_content) {
        if (!clicked_tooltip) {
          let content = generateTooltipContent(data.data.tooltip_content);
          openTooltip(e, content, false, data.data.tooltip_content.priority);
        }
      }
    }}
    on:mousemove={(e) => {
      moveTooltip(e);
    }}
    on:mouseout={(e) => {
      if (data.role === "qubit-group" || data.role === "qubit-node--group") {
        let [el1, el2, el3] = getQubitMatchEls(data);
        if (el1) {
          el1.style.fill = "transparent";
        }
        if (el2) {
          el2.style.fill = "transparent";
        }
        if (el3) {
          el3.style.outline = null;
        }
      } else if (data.role === "gate-group") {
        let [els, tel] = getOpMatchEls(data);
        if (els) {
          els.forEach((el) => {
            if (el) el.style.fill = "transparent";
          });
        }
        if (tel) {
          tel.forEach((el) => {
            if (el) el.style.outline = null;
          });
        }
      } else if (data.role === "op-layer-operation-group") {
        let [els, tel] = getOpMatchEls(data);
        if (els) {
          els.forEach((el) => {
            if (el) el.style.outline = null;
          });
        }
        if (tel) {
          tel.forEach((el) => {
            if (el) el.style.outline = null;
          });
        }
        let [pls] = getPulsePathPiece(data);
        if (pls) {
          pls.forEach((el) => {
            if (el) el.style.outline = null;
          });
        }
      }
      if (data?.data?.tooltip_content) {
        closeTooltip();
      }
    }}
    on:click={(e) => {
      e.preventDefault();
      if (data?.data?.tooltip_content) {
        let content = generateTooltipContent(data.data.tooltip_content);
        openTooltip(e, content, true, data.data.tooltip_content.priority);
      }
    }}
    on:blur={(e) => {
      e.preventDefault();
      closeTooltip(true);
    }}
    on:focus={(e) => {
      e.preventDefault();
      if (data?.data?.tooltip_content) {
        let content = generateTooltipContent(data.data.tooltip_content);
        openTooltip(e, content, true, data.data.tooltip_content.priority);
      }
    }}
  >
    {#each data.elem as el}
      <SvgWrap data={el} {open_tool} {openTooltip} {closeTooltip} {moveTooltip}
      ></SvgWrap>
    {/each}
  </g>
{/if}
