from patoka.widget_classes import getCircuitViewerClass, getCircuitWriterClass, getMachineViewerClass, getResultViewerClass

# host setting for dev mode
# will result in an error if not supported
_SS_ = "http://localhost:5175/index.js?anywidget"
Source_obj = {
    "esm": _SS_,
    "css": None,
    "dev": True
}


# wrapper functions
def getCircuitViewer(circuit, backends, transpile_params=[]):
    return getCircuitViewerClass(Source_obj, circuit, backends, transpile_params=transpile_params)


def getCircuitWriter(backend=None):
    return getCircuitWriterClass(Source_obj, backend=backend)


def getResultViewer():
    return getResultViewerClass(Source_obj)


def getMachineViewer(backend, times=[]):
    return getMachineViewerClass(Source_obj, backend=backend, times=times)
