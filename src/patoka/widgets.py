import os
import pathlib

from patoka.widget_classes import getCircuitViewerClass, getCircuitWriterClass, getMachineViewerClass, getResultViewerClass

# path to bundled files
_SS_ = pathlib.Path(__file__).parent.parent.parent / "widget_dist"
ESM = _SS_ / "index.js"
CSS = _SS_ / "style.css"

Source_obj = {
    "esm": ESM,
    "css": CSS,
    "dev": False
}

# wrapper functions


def getCircuitViewer(circuit, backends, transpile_params=[]):
    return getCircuitViewerClass(Source_obj, circuit=circuit, backends=backends, transpile_params=transpile_params)


def getCircuitWriter(backend=None):
    return getCircuitWriterClass(Source_obj, backend=backend)


def getResultViewer():
    return getResultViewerClass(Source_obj)


def getMachineViewer(backend, times=[]):
    return getMachineViewerClass(Source_obj, backend=backend, times=times)
