import os

from patoka.widget_classes import getCircuitViewerClass, getCircuitWriterClass, getMachineViewerClass, getResultViewerClass

# path to bundled files
_SS_ = os.path.join(os.path.abspath(__file__), "../../widget_dist/")


# wrapper functions
def getCircuitViewer(circuit, backends, transpile_params=[]):
    return getCircuitViewerClass(_SS_, circuit=circuit, backends=backends, transpile_params=transpile_params)


def getCircuitWriter(backend=None):
    return getCircuitWriterClass(_SS_, backend=backend)


def getResultViewer():
    return getResultViewerClass(_SS_)


def getMachineViewerClass(backend, times=[]):
    return getMachineViewerClass(_SS_, backend=backend, times=times)
