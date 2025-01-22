# global
import json
import anywidget
import traitlets

# widget-related
from patoka.machine_data_prep import getMachineMetaInfo
from patoka.machine_data_prep import getMachineInformation

# importing
from patoka.circuit_data_prep import prepareData


class CircuitViewer(anywidget.AnyWidget):
    circ = traitlets.Unicode().tag(sync=True)
    mode = traitlets.Unicode("view").tag(sync=True)

    def __init__(self, *args: object, **kwargs: object):
        source = kwargs["source"]
        dev = True
        if "dev" in source:
            dev = source["dev"]
        if "esm" in source:
            self._esm = source["esm"] if dev else source["esm"].read_text()
        if "css" in source:
            self._css = source["css"] if dev else source["css"].read_text()
        super().__init__(*args, **kwargs)


def getCircuitViewerClass(source_dir, circuit, backends, transpile_params=[]):
    prep = prepareData(circuit, backends=backends, transpile_params=transpile_params)
    circuit_str = prep.toJSON()
    return CircuitViewer(circ=circuit_str, source=source_dir)


class CircuitWriter(anywidget.AnyWidget):
    machine = traitlets.Unicode().tag(sync=True)
    circ_code = traitlets.Unicode().tag(sync=True)
    mode = traitlets.Unicode("write").tag(sync=True)

    def __init__(self, *args: object, **kwargs: object):
        source = kwargs["source"]
        dev = True
        if "dev" in source:
            dev = source["dev"]
        if "esm" in source:
            self._esm = source["esm"] if dev else source["esm"].read_text()
        if "css" in source:
            self._css = source["css"] if dev else source["css"].read_text()
        super().__init__(*args, **kwargs)


def getCircuitWriterClass(source_dir, backend=None):
    machine_json = ""
    if backend is not None:
        machine = getMachineMetaInfo(backend)
        machine_json = json.dumps(machine)
    circ_code = ""
    return CircuitWriter(circ_code=circ_code, machine=machine_json, source=source_dir)


class ResultViewer(anywidget.AnyWidget):
    data = traitlets.Unicode().tag(sync=True)
    mode = traitlets.Unicode("result").tag(sync=True)
    data_update = traitlets.Unicode().tag(sync=True)

    def __init__(self, *args: object, **kwargs: object):
        source = kwargs["source"]
        dev = True
        if "dev" in source:
            dev = source["dev"]
        if "esm" in source:
            self._esm = source["esm"] if dev else source["esm"].read_text()
        if "css" in source:
            self._css = source["css"] if dev else source["css"].read_text()
        super().__init__(*args, **kwargs)


def getResultViewerClass(source_dir):
    data_json = "{}"
    viewer = ResultViewer(data=data_json, source=source_dir)
    return viewer


class MachineViewer(anywidget.AnyWidget):
    machine_data = traitlets.Unicode().tag(sync=True)
    code = traitlets.Unicode().tag(sync=True)
    mode = traitlets.Unicode("machine").tag(sync=True)

    def __init__(self, *args: object, **kwargs: object):
        source = kwargs["source"]
        dev = True
        if "dev" in source:
            dev = source["dev"]
        if "esm" in source:
            self._esm = source["esm"] if dev else source["esm"].read_text()
        if "css" in source:
            self._css = source["css"] if dev else source["css"].read_text()
        super().__init__(*args, **kwargs)


def getMachineViewerClass(source_dir, backend, times=[]):
    machine_info = getMachineInformation(backend, times)
    machine_data = machine_info.toJSON()
    code = ""
    return MachineViewer(machine_data=machine_data, code=code, source=source_dir)
