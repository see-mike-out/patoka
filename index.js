import CircuitViewer from "./widget_src/CircuitViewer/CircuitViewer.svelte";
import CircuitWriter from "./widget_src/CircuitWriter/CircuitWriter.svelte";
import MachineViewer from "./widget_src/MachineViewer/MachineViewer.svelte";
import UncertaintyVis from "./widget_src/Uncertainty/UncertaintyVis.svelte";
import ResultViewer from "./widget_src/ResultViewer/ResultViewer.svelte";

export function render({ model, el }) {
    if (model.get("mode") === "view") {
    	let view = new CircuitViewer({ target: el, props: { model } });
    	return () => view.$destroy();
    } else if (model.get("mode") === "write") {
    	let view = new CircuitWriter({ target: el, props: { model } });
    	return () => view.$destroy();
    } else if (model.get("mode") === "machine") {
    	let view = new MachineViewer({ target: el, props: { model } });
    	return () => view.$destroy();
    } else if (model.get("mode") === "result") {
    	let view = new ResultViewer({ target: el, props: { model } });
    	return () => view.$destroy();
    }else if (model.get("mode") === "uncertainty") {
    	let view = new UncertaintyVis({ target: el, props: { model } });
    	return () => view.$destroy();
    }
}