from patoka.widget_classes import getCircuitViewerClass, getCircuitWriterClass, getMachineViewerClass, getResultViewerClass

# host setting for dev mode
# will result in an error if not supported
_SS_ = "http://localhost:5175/"


# wrapper functions
def getCircuitViewer(circuit, backends, transpile_params=[]):
    return getCircuitViewerClass(_SS_, circuit=circuit, backends=backends, transpile_params=transpile_params)


def getCircuitWriter(backend=None):
    return getCircuitWriterClass(_SS_, backend=backend)


def getResultViewer():
    return getResultViewerClass(_SS_)


def getMachineViewerClass(backend, times=[]):
    return getMachineViewerClass(_SS_, backend=backend, times=times)
