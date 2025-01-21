IBM_127Qs = [
    "sherbrooke",
    "brisbane",
    "kyiv",
    "quebec",
    "rensselaer",
    "brussels",
    "osaka",
    "nazca",
    "strasbourg",
    "kawasaki",
    "kyoto",
    "cusco",
    "cleveland",
    "aer_simulator"
]

IBM_1Qs = [
    "armonk",
]

IBM_5Qs = [
    "belem",
    "burlington",
    "essex",
    "lima",
    "fractional",
    "london",
    "ourense",
    "quito",
    "valencia",
    "vigo"
]

IBM_5Qs2 = [
    "athens",
    "bogota",
    "manila",
    "rome",
    "yorktown",
    "santiago"
]


IBM_7Qs = [
    "casablanca",
    "jakarta",
    "lagos",
    "nairobi",
    "oslo",
    "perth"
]

IBM_14Qs = [
    "melbourne"
]

IBM_16Qs = [
    "guadalupe",
    "rueschlikon"
]

IBM_20Qs = [
    "almaden",
    "boeblingen",
    "johannesburg",
    "tokyo",
    "poughkeepsie",
    "singapore"
]

IBM_27Qs = [
    "auckland",
    "algiers",
    "cairo",
    "geneva",
    "hanoi",
    "kolkata",
    "montreal",
    "mumbai",
    "peekskill",
    "sydney",
    "toronto",
    "paris"
]

IBM_28Qs = [
    "cambridge"
]

IBM_33Qs = [
    "prague"
]

IBM_53Qs = [
    "rochester"
]

IBM_65Qs = [
    "brooklyn",
    "manhattan"
]

def get_backend_circuit_nodes(name):
    if name in IBM_1Qs:
        return NODES_IMBQ_1Q
    elif name in IBM_5Qs:
        return NODES_IMBQ_5Q
    elif name in IBM_5Qs2:
        return NODES_IMBQ_5Q2
    elif name in IBM_7Qs:
        return NODES_IMBQ_7Q
    elif name in IBM_14Qs:
        return NODES_IMBQ_14Q
    elif name in IBM_16Qs:
        return NODES_IMBQ_16Q
    elif name in IBM_20Qs:
        return NODES_IMBQ_20Q
    elif name in IBM_27Qs:
        return NODES_IMBQ_27Q
    elif name in IBM_28Qs:
        return NODES_IMBQ_28Q
    elif name in IBM_33Qs:
        return NODES_IMBQ_33Q
    elif name in IBM_53Qs:
        return NODES_IMBQ_53Q
    elif name in IBM_65Qs:
        return NODES_IMBQ_65Q
    elif name in IBM_127Qs:
        return NODES_IMBQ_BRISBANE
    elif name == "torino":
        return NODES_IMBQ_TORINO
    elif name == "fez":
        return NODES_IMBQ_FEZ
    else:
        return None

NODES_IMBQ_1Q = [
    {"index": 0, "x": 0, "y": 0}
]

NODES_IMBQ_5Q = [
    {"index": 0, "x": 0, "y": 0},
    {"index": 1, "x": 1, "y": 0},
    {"index": 2, "x": 2, "y": 0},
    {"index": 3, "x": 1, "y": 1},
    {"index": 4, "x": 1, "y": 2}
]

NODES_IMBQ_5Q2 = [
    {"index": 0, "x": 0, "y": 1},
    {"index": 1, "x": 1, "y": 0},
    {"index": 2, "x": 1, "y": 1},
    {"index": 3, "x": 1, "y": 2},
    {"index": 4, "x": 2, "y": 1}
]

NODES_IMBQ_7Q = [
    {"index": 0, "x": 0, "y": 0},
    {"index": 1, "x": 1, "y": 0},
    {"index": 2, "x": 2, "y": 0},
    {"index": 3, "x": 1, "y": 1},
    {"index": 4, "x": 0, "y": 2},
    {"index": 5, "x": 1, "y": 2},
    {"index": 6, "x": 2, "y": 2}
]

NODES_IMBQ_14Q = [
    {"index": 0, "x": 0, "y": 0},
    {"index": 1, "x": 1, "y": 0},
    {"index": 2, "x": 2, "y": 0},
    {"index": 3, "x": 3, "y": 0},
    {"index": 4, "x": 4, "y": 0},
    {"index": 5, "x": 5, "y": 0},
    {"index": 6, "x": 6, "y": 0},
    {"index": 7, "x": 7, "y": 1},
    {"index": 8, "x": 6, "y": 1},
    {"index": 9, "x": 5, "y": 1},
    {"index": 10, "x": 4, "y": 1},
    {"index": 11, "x": 3, "y": 1},
    {"index": 12, "x": 2, "y": 1},
    {"index": 13, "x": 1, "y": 1}
]

NODES_IMBQ_16Q = [
    {"index": 0, "x": 0, "y": 1},
    {"index": 1, "x": 1, "y": 1},
    {"index": 2, "x": 1, "y": 2},
    {"index": 3, "x": 1, "y": 3},
    {"index": 4, "x": 2, "y": 1},
    {"index": 5, "x": 2, "y": 3},
    {"index": 6, "x": 4, "y": 0},
    {"index": 7, "x": 4, "y": 1},
    {"index": 8, "x": 4, "y": 3},
    {"index": 9, "x": 4, "y": 4},
    {"index": 10, "x": 5, "y": 1},
    {"index": 11, "x": 5, "y": 3},
    {"index": 12, "x": 6, "y": 1},
    {"index": 13, "x": 6, "y": 2},
    {"index": 14, "x": 6, "y": 3},
    {"index": 15, "x": 7, "y": 1}
]

NODES_IMBQ_20Q = [
    {"index": 0, "x": 0, "y": 0},
    {"index": 1, "x": 1, "y": 0},
    {"index": 2, "x": 2, "y": 0},
    {"index": 3, "x": 3, "y": 0},
    {"index": 4, "x": 4, "y": 0},
    {"index": 5, "x": 0, "y": 1},
    {"index": 6, "x": 1, "y": 1},
    {"index": 7, "x": 2, "y": 1},
    {"index": 8, "x": 3, "y": 1},
    {"index": 9, "x": 4, "y": 1},
    {"index": 10, "x": 0, "y": 2},
    {"index": 11, "x": 1, "y": 2},
    {"index": 12, "x": 2, "y": 2},
    {"index": 13, "x": 3, "y": 2},
    {"index": 14, "x": 4, "y": 2},
    {"index": 15, "x": 0, "y": 3},
    {"index": 16, "x": 1, "y": 3},
    {"index": 17, "x": 2, "y": 3},
    {"index": 18, "x": 3, "y": 3},
    {"index": 19, "x": 4, "y": 3}
]

NODES_IMBQ_27Q = [
    {"index": 0, "x": 0, "y": 1},
    {"index": 1, "x": 1, "y": 1},
    {"index": 2, "x": 1, "y": 2},
    {"index": 3, "x": 1, "y": 3},
    {"index": 4, "x": 2, "y": 1},
    {"index": 5, "x": 2, "y": 3},
    {"index": 6, "x": 3, "y": 0},
    {"index": 7, "x": 3, "y": 1},
    {"index": 8, "x": 3, "y": 3},
    {"index": 9, "x": 3, "y": 4},
    {"index": 10, "x": 4, "y": 1},
    {"index": 11, "x": 4, "y": 3},
    {"index": 12, "x": 5, "y": 1},
    {"index": 13, "x": 5, "y": 2},
    {"index": 14, "x": 5, "y": 3},
    {"index": 15, "x": 6, "y": 1},
    {"index": 16, "x": 6, "y": 3},
    {"index": 17, "x": 7, "y": 0},
    {"index": 18, "x": 7, "y": 1},
    {"index": 19, "x": 7, "y": 3},
    {"index": 20, "x": 7, "y": 4},
    {"index": 21, "x": 8, "y": 1},
    {"index": 22, "x": 8, "y": 3},
    {"index": 23, "x": 9, "y": 1},
    {"index": 24, "x": 9, "y": 2},
    {"index": 25, "x": 9, "y": 3},
    {"index": 26, "x": 10, "y": 3}
]

NODES_IMBQ_28Q = [
    {"index": 0, "x": 2, "y": 0},
    {"index": 1, "x": 3, "y": 0},
    {"index": 2, "x": 4, "y": 0},
    {"index": 3, "x": 5, "y": 0},
    {"index": 4, "x": 6, "y": 0},
    {"index": 5, "x": 2, "y": 1},
    {"index": 6, "x": 6, "y": 1},
    {"index": 7, "x": 0, "y": 2},
    {"index": 8, "x": 1, "y": 2},
    {"index": 9, "x": 2, "y": 2},
    {"index": 10, "x": 3, "y": 2},
    {"index": 11, "x": 4, "y": 2},
    {"index": 12, "x": 5, "y": 2},
    {"index": 13, "x": 6, "y": 2},
    {"index": 14, "x": 7, "y": 2},
    {"index": 15, "x": 8, "y": 2},
    {"index": 16, "x": 0, "y": 3},
    {"index": 17, "x": 4, "y": 3},
    {"index": 18, "x": 8, "y": 3},
    {"index": 19, "x": 0, "y": 4},
    {"index": 20, "x": 1, "y": 4},
    {"index": 21, "x": 2, "y": 4},
    {"index": 22, "x": 3, "y": 4},
    {"index": 23, "x": 4, "y": 4},
    {"index": 24, "x": 5, "y": 4},
    {"index": 25, "x": 6, "y": 4},
    {"index": 26, "x": 7, "y": 4},
    {"index": 27, "x": 8, "y": 4}
]

NODES_IMBQ_33Q = [
    {"index": 0, "x": 0, "y": 1},
    {"index": 1, "x": 1, "y": 1},
    {"index": 2, "x": 1, "y": 2},
    {"index": 3, "x": 1, "y": 3},
    {"index": 4, "x": 2, "y": 1},
    {"index": 5, "x": 2, "y": 3},
    {"index": 6, "x": 3, "y": 0},
    {"index": 7, "x": 3, "y": 1},
    {"index": 8, "x": 3, "y": 3},
    {"index": 9, "x": 3, "y": 4},
    {"index": 10, "x": 4, "y": 1},
    {"index": 11, "x": 4, "y": 3},
    {"index": 12, "x": 5, "y": 1},
    {"index": 13, "x": 5, "y": 2},
    {"index": 14, "x": 5, "y": 3},
    {"index": 15, "x": 6, "y": 1},
    {"index": 16, "x": 6, "y": 3},
    {"index": 17, "x": 7, "y": 0},
    {"index": 18, "x": 7, "y": 1},
    {"index": 19, "x": 7, "y": 3},
    {"index": 20, "x": 7, "y": 4},
    {"index": 21, "x": 8, "y": 1},
    {"index": 22, "x": 8, "y": 3},
    {"index": 23, "x": 9, "y": 1},
    {"index": 24, "x": 9, "y": 2},
    {"index": 25, "x": 9, "y": 3},
    {"index": 26, "x": 9, "y": 4},
    {"index": 27, "x": 10, "y": 1},
    {"index": 28, "x": 10, "y": 2},
    {"index": 29, "x": 10, "y": 3},
    {"index": 30, "x": 1, "y": 4},
    {"index": 31, "x": 1, "y": 5},
    {"index": 32, "x": 0, "y": 5}
]

NODES_IMBQ_53Q = [
    {"index": 0, "x": 2, "y": 0},
    {"index": 1, "x": 3, "y": 0},
    {"index": 2, "x": 4, "y": 0},
    {"index": 3, "x": 5, "y": 0},
    {"index": 4, "x": 6, "y": 0},
    
    {"index": 5, "x": 2, "y": 1},
    {"index": 6, "x": 6, "y": 1},
    
    {"index": 7, "x": 0, "y": 2},
    {"index": 8, "x": 1, "y": 2},
    {"index": 9, "x": 2, "y": 2},
    {"index": 10, "x": 3, "y": 2},
    {"index": 11, "x": 4, "y": 2},
    {"index": 12, "x": 5, "y": 2},
    {"index": 13, "x": 6, "y": 2},
    {"index": 14, "x": 7, "y": 2},
    {"index": 15, "x": 8, "y": 2},
    
    {"index": 16, "x": 0, "y": 3},
    {"index": 17, "x": 4, "y": 3},
    {"index": 18, "x": 8, "y": 3},
    
    {"index": 19, "x": 0, "y": 4},
    {"index": 20, "x": 1, "y": 4},
    {"index": 21, "x": 2, "y": 4},
    {"index": 22, "x": 3, "y": 4},
    {"index": 23, "x": 4, "y": 4},
    {"index": 24, "x": 5, "y": 4},
    {"index": 25, "x": 6, "y": 4},
    {"index": 26, "x": 7, "y": 4},
    {"index": 27, "x": 8, "y": 4},
    
    {"index": 28, "x": 2, "y": 5},
    {"index": 29, "x": 6, "y": 5},
    
    {"index": 30, "x": 0, "y": 6},
    {"index": 31, "x": 1, "y": 6},
    {"index": 32, "x": 2, "y": 6},
    {"index": 33, "x": 3, "y": 6},
    {"index": 34, "x": 4, "y": 6},
    {"index": 35, "x": 5, "y": 6},
    {"index": 36, "x": 6, "y": 6},
    {"index": 37, "x": 7, "y": 6},
    {"index": 38, "x": 8, "y": 6},
    
    {"index": 39, "x": 0, "y": 7},
    {"index": 40, "x": 4, "y": 7},
    {"index": 41, "x": 8, "y": 7},
    
    {"index": 42, "x": 0, "y": 8},
    {"index": 43, "x": 1, "y": 8},
    {"index": 44, "x": 2, "y": 8},
    {"index": 45, "x": 3, "y": 8},
    {"index": 46, "x": 4, "y": 8},
    {"index": 47, "x": 5, "y": 8},
    {"index": 48, "x": 6, "y": 8},
    {"index": 49, "x": 7, "y": 8},
    {"index": 50, "x": 8, "y": 8},
    
    {"index": 51, "x": 2, "y": 9},
    {"index": 52, "x": 6, "y": 9}
]

NODES_IMBQ_65Q = [
    # row 1
    {"index": 0, "x": 0, "y": 0},
    {"index": 1, "x": 1, "y": 0},
    {"index": 2, "x": 2, "y": 0},
    {"index": 3, "x": 3, "y": 0},
    {"index": 4, "x": 4, "y": 0},
    {"index": 5, "x": 5, "y": 0},
    {"index": 6, "x": 6, "y": 0},
    {"index": 7, "x": 7, "y": 0},
    {"index": 8, "x": 8, "y": 0},
    {"index": 9, "x": 9, "y": 0},
    # row 2
    {"index": 10, "x": 0, "y": 1},
    {"index": 11, "x": 4, "y": 1},
    {"index": 12, "x": 8, "y": 1},
    # row 3
    {"index": 13, "x": 0, "y": 2},
    {"index": 14, "x": 1, "y": 2},
    {"index": 15, "x": 2, "y": 2},
    {"index": 16, "x": 3, "y": 2},
    {"index": 17, "x": 4, "y": 2},
    {"index": 18, "x": 5, "y": 2},
    {"index": 19, "x": 6, "y": 2},
    {"index": 20, "x": 7, "y": 2},
    {"index": 21, "x": 8, "y": 2},
    {"index": 22, "x": 9, "y": 2},
    {"index": 23, "x": 10, "y": 2},
    # row 4
    {"index": 24, "x": 2, "y": 3},
    {"index": 25, "x": 6, "y": 3},
    {"index": 26, "x": 10, "y": 3},
    # row 5
    {"index": 27, "x": 0, "y": 4},
    {"index": 28, "x": 1, "y": 4},
    {"index": 29, "x": 2, "y": 4},
    {"index": 30, "x": 3, "y": 4},
    {"index": 31, "x": 4, "y": 4},
    {"index": 32, "x": 5, "y": 4},
    {"index": 33, "x": 6, "y": 4},
    {"index": 34, "x": 7, "y": 4},
    {"index": 35, "x": 8, "y": 4},
    {"index": 36, "x": 9, "y": 4},
    {"index": 37, "x": 10, "y": 4},
    # row 6
    {"index": 38, "x": 0, "y": 5},
    {"index": 39, "x": 4, "y": 5},
    {"index": 40, "x": 8, "y": 5},
    # row 7
    {"index": 41, "x": 0, "y": 6},
    {"index": 42, "x": 1, "y": 6},
    {"index": 43, "x": 2, "y": 6},
    {"index": 44, "x": 3, "y": 6},
    {"index": 45, "x": 4, "y": 6},
    {"index": 46, "x": 5, "y": 6},
    {"index": 47, "x": 6, "y": 6},
    {"index": 48, "x": 7, "y": 6},
    {"index": 49, "x": 8, "y": 6},
    {"index": 50, "x": 9, "y": 6},
    {"index": 51, "x": 10, "y": 6},
    # row 8
    {"index": 52, "x": 2, "y": 7},
    {"index": 53, "x": 6, "y": 7},
    {"index": 54, "x": 10, "y": 7},
    # row 9
    {"index": 55, "x": 1, "y": 8},
    {"index": 56, "x": 2, "y": 8},
    {"index": 57, "x": 3, "y": 8},
    {"index": 58, "x": 4, "y": 8},
    {"index": 59, "x": 5, "y": 8},
    {"index": 60, "x": 6, "y": 8},
    {"index": 61, "x": 7, "y": 8},
    {"index": 62, "x": 8, "y": 8},
    {"index": 63, "x": 9, "y": 8},
    {"index": 64, "x": 10, "y": 8}
]


NODES_IMBQ_BRISBANE = [
    # row 1
    {"index": 0, "x": 0, "y": 0},
    {"index": 1, "x": 1, "y": 0},
    {"index": 2, "x": 2, "y": 0},
    {"index": 3, "x": 3, "y": 0},
    {"index": 4, "x": 4, "y": 0},
    {"index": 5, "x": 5, "y": 0},
    {"index": 6, "x": 6, "y": 0},
    {"index": 7, "x": 7, "y": 0},
    {"index": 8, "x": 8, "y": 0},
    {"index": 9, "x": 9, "y": 0},
    {"index": 10, "x": 10, "y": 0},
    {"index": 11, "x": 11, "y": 0},
    {"index": 12, "x": 12, "y": 0},
    {"index": 13, "x": 13, "y": 0},
    # row 2
    {"index": 14, "x": 0, "y": 1},
    {"index": 15, "x": 4, "y": 1},
    {"index": 16, "x": 8, "y": 1},
    {"index": 17, "x": 12, "y": 1},
    # row 3
    {"index": 18, "x": 0, "y": 2},
    {"index": 19, "x": 1, "y": 2},
    {"index": 20, "x": 2, "y": 2},
    {"index": 21, "x": 3, "y": 2},
    {"index": 22, "x": 4, "y": 2},
    {"index": 23, "x": 5, "y": 2},
    {"index": 24, "x": 6, "y": 2},
    {"index": 25, "x": 7, "y": 2},
    {"index": 26, "x": 8, "y": 2},
    {"index": 27, "x": 9, "y": 2},
    {"index": 28, "x": 10, "y": 2},
    {"index": 29, "x": 11, "y": 2},
    {"index": 30, "x": 12, "y": 2},
    {"index": 31, "x": 13, "y": 2},
    {"index": 32, "x": 14, "y": 2},
    # row 4
    {"index": 33, "x": 2, "y": 3},
    {"index": 34, "x": 6, "y": 3},
    {"index": 35, "x": 10, "y": 3},
    {"index": 36, "x": 14, "y": 3},
    # row 5
    {"index": 37, "x": 0, "y": 4},
    {"index": 38, "x": 1, "y": 4},
    {"index": 39, "x": 2, "y": 4},
    {"index": 40, "x": 3, "y": 4},
    {"index": 41, "x": 4, "y": 4},
    {"index": 42, "x": 5, "y": 4},
    {"index": 43, "x": 6, "y": 4},
    {"index": 44, "x": 7, "y": 4},
    {"index": 45, "x": 8, "y": 4},
    {"index": 46, "x": 9, "y": 4},
    {"index": 47, "x": 10, "y": 4},
    {"index": 48, "x": 11, "y": 4},
    {"index": 49, "x": 12, "y": 4},
    {"index": 50, "x": 13, "y": 4},
    {"index": 51, "x": 14, "y": 4},
    # row 6
    {"index": 52, "x": 0, "y": 5},
    {"index": 53, "x": 4, "y": 5},
    {"index": 54, "x": 8, "y": 5},
    {"index": 55, "x": 12, "y": 5},
    # row 7
    {"index": 56, "x": 0, "y": 6},
    {"index": 57, "x": 1, "y": 6},
    {"index": 58, "x": 2, "y": 6},
    {"index": 59, "x": 3, "y": 6},
    {"index": 60, "x": 4, "y": 6},
    {"index": 61, "x": 5, "y": 6},
    {"index": 62, "x": 6, "y": 6},
    {"index": 63, "x": 7, "y": 6},
    {"index": 64, "x": 8, "y": 6},
    {"index": 65, "x": 9, "y": 6},
    {"index": 66, "x": 10, "y": 6},
    {"index": 67, "x": 11, "y": 6},
    {"index": 68, "x": 12, "y": 6},
    {"index": 69, "x": 13, "y": 6},
    {"index": 70, "x": 14, "y": 6},
    # row 8
    {"index": 71, "x": 2, "y": 7},
    {"index": 72, "x": 6, "y": 7},
    {"index": 73, "x": 10, "y": 7},
    {"index": 74, "x": 14, "y": 7},
    # row 9
    {"index": 75, "x": 0, "y": 8},
    {"index": 76, "x": 1, "y": 8},
    {"index": 77, "x": 2, "y": 8},
    {"index": 78, "x": 3, "y": 8},
    {"index": 79, "x": 4, "y": 8},
    {"index": 80, "x": 5, "y": 8},
    {"index": 81, "x": 6, "y": 8},
    {"index": 82, "x": 7, "y": 8},
    {"index": 83, "x": 8, "y": 8},
    {"index": 84, "x": 9, "y": 8},
    {"index": 85, "x": 10, "y": 8},
    {"index": 86, "x": 11, "y": 8},
    {"index": 87, "x": 12, "y": 8},
    {"index": 88, "x": 13, "y": 8},
    {"index": 89, "x": 14, "y": 8},
    # row 10
    {"index": 90, "x": 0, "y": 9},
    {"index": 91, "x": 4, "y": 9},
    {"index": 92, "x": 8, "y": 9},
    {"index": 93, "x": 12, "y": 9},
    # row 11
    {"index": 94, "x": 0, "y": 10},
    {"index": 95, "x": 1, "y": 10},
    {"index": 96, "x": 2, "y": 10},
    {"index": 97, "x": 3, "y": 10},
    {"index": 98, "x": 4, "y": 10},
    {"index": 99, "x": 5, "y": 10},
    {"index": 100, "x": 6, "y": 10},
    {"index": 101, "x": 7, "y": 10},
    {"index": 102, "x": 8, "y": 10},
    {"index": 103, "x": 9, "y": 10},
    {"index": 104, "x": 10, "y": 10},
    {"index": 105, "x": 11, "y": 10},
    {"index": 106, "x": 12, "y": 10},
    {"index": 107, "x": 13, "y": 10},
    {"index": 108, "x": 14, "y": 10},
    # row 12
    {"index": 109, "x": 2, "y": 11},
    {"index": 110, "x": 6, "y": 11},
    {"index": 111, "x": 10, "y": 11},
    {"index": 112, "x": 14, "y": 11},
    # row 13
    {"index": 113, "x": 1, "y": 12},
    {"index": 114, "x": 2, "y": 12},
    {"index": 115, "x": 3, "y": 12},
    {"index": 116, "x": 4, "y": 12},
    {"index": 117, "x": 5, "y": 12},
    {"index": 118, "x": 6, "y": 12},
    {"index": 119, "x": 7, "y": 12},
    {"index": 120, "x": 8, "y": 12},
    {"index": 121, "x": 9, "y": 12},
    {"index": 122, "x": 10, "y": 12},
    {"index": 123, "x": 11, "y": 12},
    {"index": 124, "x": 12, "y": 12},
    {"index": 125, "x": 13, "y": 12},
    {"index": 126, "x": 14, "y": 12}
]


NODES_IMBQ_TORINO = [
    # row 1
    {"index": 0, "x": 0, "y": 0},
    {"index": 1, "x": 1, "y": 0},
    {"index": 2, "x": 2, "y": 0},
    {"index": 3, "x": 3, "y": 0},
    {"index": 4, "x": 4, "y": 0},
    {"index": 5, "x": 5, "y": 0},
    {"index": 6, "x": 6, "y": 0},
    {"index": 7, "x": 7, "y": 0},
    {"index": 8, "x": 8, "y": 0},
    {"index": 9, "x": 9, "y": 0},
    {"index": 10, "x": 10, "y": 0},
    {"index": 11, "x": 11, "y": 0},
    {"index": 12, "x": 12, "y": 0},
    {"index": 13, "x": 13, "y": 0},
    {"index": 14, "x": 14, "y": 0},
    # row 2
    {"index": 15, "x": 0, "y": 1},
    {"index": 16, "x": 4, "y": 1},
    {"index": 17, "x": 8, "y": 1},
    {"index": 18, "x": 12, "y": 1},
    # row 3
    {"index": 19, "x": 0, "y": 2},
    {"index": 20, "x": 1, "y": 2},
    {"index": 21, "x": 2, "y": 2},
    {"index": 22, "x": 3, "y": 2},
    {"index": 23, "x": 4, "y": 2},
    {"index": 24, "x": 5, "y": 2},
    {"index": 25, "x": 6, "y": 2},
    {"index": 26, "x": 7, "y": 2},
    {"index": 27, "x": 8, "y": 2},
    {"index": 28, "x": 9, "y": 2},
    {"index": 29, "x": 10, "y": 2},
    {"index": 30, "x": 11, "y": 2},
    {"index": 31, "x": 12, "y": 2},
    {"index": 32, "x": 13, "y": 2},
    {"index": 33, "x": 14, "y": 2},
    # row 4
    {"index": 34, "x": 2, "y": 3},
    {"index": 35, "x": 6, "y": 3},
    {"index": 36, "x": 10, "y": 3},
    {"index": 37, "x": 14, "y": 3},
    # row 5
    {"index": 38, "x": 0, "y": 4},
    {"index": 39, "x": 1, "y": 4},
    {"index": 40, "x": 2, "y": 4},
    {"index": 41, "x": 3, "y": 4},
    {"index": 42, "x": 4, "y": 4},
    {"index": 43, "x": 5, "y": 4},
    {"index": 44, "x": 6, "y": 4},
    {"index": 45, "x": 7, "y": 4},
    {"index": 46, "x": 8, "y": 4},
    {"index": 47, "x": 9, "y": 4},
    {"index": 48, "x": 10, "y": 4},
    {"index": 49, "x": 11, "y": 4},
    {"index": 50, "x": 12, "y": 4},
    {"index": 51, "x": 13, "y": 4},
    {"index": 52, "x": 14, "y": 4},
    # row 6
    {"index": 53, "x": 0, "y": 5},
    {"index": 54, "x": 4, "y": 5},
    {"index": 55, "x": 8, "y": 5},
    {"index": 56, "x": 12, "y": 5},
    # row 7
    {"index": 57, "x": 0, "y": 6},
    {"index": 58, "x": 1, "y": 6},
    {"index": 59, "x": 2, "y": 6},
    {"index": 60, "x": 3, "y": 6},
    {"index": 61, "x": 4, "y": 6},
    {"index": 62, "x": 5, "y": 6},
    {"index": 63, "x": 6, "y": 6},
    {"index": 64, "x": 7, "y": 6},
    {"index": 65, "x": 8, "y": 6},
    {"index": 66, "x": 9, "y": 6},
    {"index": 67, "x": 10, "y": 6},
    {"index": 68, "x": 11, "y": 6},
    {"index": 69, "x": 12, "y": 6},
    {"index": 70, "x": 13, "y": 6},
    {"index": 71, "x": 14, "y": 6},
    # row 8
    {"index": 72, "x": 2, "y": 7},
    {"index": 73, "x": 6, "y": 7},
    {"index": 74, "x": 10, "y": 7},
    {"index": 75, "x": 14, "y": 7},
    # row 9
    {"index": 76, "x": 0, "y": 8},
    {"index": 77, "x": 1, "y": 8},
    {"index": 78, "x": 2, "y": 8},
    {"index": 79, "x": 3, "y": 8},
    {"index": 80, "x": 4, "y": 8},
    {"index": 81, "x": 5, "y": 8},
    {"index": 82, "x": 6, "y": 8},
    {"index": 83, "x": 7, "y": 8},
    {"index": 84, "x": 8, "y": 8},
    {"index": 85, "x": 9, "y": 8},
    {"index": 86, "x": 10, "y": 8},
    {"index": 87, "x": 11, "y": 8},
    {"index": 88, "x": 12, "y": 8},
    {"index": 89, "x": 13, "y": 8},
    {"index": 90, "x": 14, "y": 8},
    # row 10
    {"index": 91, "x": 0, "y": 9},
    {"index": 92, "x": 4, "y": 9},
    {"index": 93, "x": 8, "y": 9},
    {"index": 94, "x": 12, "y": 9},
    # row 11
    {"index": 95, "x": 0, "y": 10},
    {"index": 96, "x": 1, "y": 10},
    {"index": 97, "x": 2, "y": 10},
    {"index": 98, "x": 3, "y": 10},
    {"index": 99, "x": 4, "y": 10},
    {"index": 100, "x": 5, "y": 10},
    {"index": 101, "x": 6, "y": 10},
    {"index": 102, "x": 7, "y": 10},
    {"index": 103, "x": 8, "y": 10},
    {"index": 104, "x": 9, "y": 10},
    {"index": 105, "x": 10, "y": 10},
    {"index": 106, "x": 11, "y": 10},
    {"index": 107, "x": 12, "y": 10},
    {"index": 108, "x": 13, "y": 10},
    {"index": 109, "x": 14, "y": 10},
    # row 12
    {"index": 110, "x": 2, "y": 11},
    {"index": 111, "x": 6, "y": 11},
    {"index": 112, "x": 10, "y": 11},
    {"index": 113, "x": 14, "y": 11},
    # row 13
    {"index": 114, "x": 0, "y": 12},
    {"index": 115, "x": 1, "y": 12},
    {"index": 116, "x": 2, "y": 12},
    {"index": 117, "x": 3, "y": 12},
    {"index": 118, "x": 4, "y": 12},
    {"index": 119, "x": 5, "y": 12},
    {"index": 120, "x": 6, "y": 12},
    {"index": 121, "x": 7, "y": 12},
    {"index": 122, "x": 8, "y": 12},
    {"index": 123, "x": 9, "y": 12},
    {"index": 124, "x": 10, "y": 12},
    {"index": 125, "x": 11, "y": 12},
    {"index": 126, "x": 12, "y": 12},
    {"index": 127, "x": 13, "y": 12},
    {"index": 128, "x": 14, "y": 12},
    # row 14
    {"index": 129, "x": 0, "y": 13},
    {"index": 130, "x": 4, "y": 13},
    {"index": 131, "x": 8, "y": 13},
    {"index": 132, "x": 12, "y": 13}
]


NODES_IMBQ_FEZ = [
    # row 1
    {"index": 0, "x": 0, "y": 0},
    {"index": 1, "x": 1, "y": 0},
    {"index": 2, "x": 2, "y": 0},
    {"index": 3, "x": 3, "y": 0},
    {"index": 4, "x": 4, "y": 0},
    {"index": 5, "x": 5, "y": 0},
    {"index": 6, "x": 6, "y": 0},
    {"index": 7, "x": 7, "y": 0},
    {"index": 8, "x": 8, "y": 0},
    {"index": 9, "x": 9, "y": 0},
    {"index": 10, "x": 10, "y": 0},
    {"index": 11, "x": 11, "y": 0},
    {"index": 12, "x": 12, "y": 0},
    {"index": 13, "x": 13, "y": 0},
    {"index": 14, "x": 14, "y": 0},
    {"index": 15, "x": 15, "y": 0},
    # row 2
    {"index": 16, "x": 3, "y": 1},
    {"index": 17, "x": 7, "y": 1},
    {"index": 18, "x": 11, "y": 1},
    {"index": 19, "x": 15, "y": 1},
    # row 3
    {"index": 20, "x": 0, "y": 2},
    {"index": 21, "x": 1, "y": 2},
    {"index": 22, "x": 2, "y": 2},
    {"index": 23, "x": 3, "y": 2},
    {"index": 24, "x": 4, "y": 2},
    {"index": 25, "x": 5, "y": 2},
    {"index": 26, "x": 6, "y": 2},
    {"index": 27, "x": 7, "y": 2},
    {"index": 28, "x": 8, "y": 2},
    {"index": 29, "x": 9, "y": 2},
    {"index": 30, "x": 10, "y": 2},
    {"index": 31, "x": 11, "y": 2},
    {"index": 32, "x": 12, "y": 2},
    {"index": 33, "x": 13, "y": 2},
    {"index": 34, "x": 14, "y": 2},
    {"index": 35, "x": 15, "y": 2},
    # row 4
    {"index": 36, "x": 1, "y": 3},
    {"index": 37, "x": 5, "y": 3},
    {"index": 38, "x": 9, "y": 3},
    {"index": 39, "x": 13, "y": 3},
    # row 5
    {"index": 40, "x": 0, "y": 4},
    {"index": 41, "x": 1, "y": 4},
    {"index": 42, "x": 2, "y": 4},
    {"index": 43, "x": 3, "y": 4},
    {"index": 44, "x": 4, "y": 4},
    {"index": 45, "x": 5, "y": 4},
    {"index": 46, "x": 6, "y": 4},
    {"index": 47, "x": 7, "y": 4},
    {"index": 48, "x": 8, "y": 4},
    {"index": 49, "x": 9, "y": 4},
    {"index": 50, "x": 10, "y": 4},
    {"index": 51, "x": 11, "y": 4},
    {"index": 52, "x": 12, "y": 4},
    {"index": 53, "x": 13, "y": 4},
    {"index": 54, "x": 14, "y": 4},
    {"index": 55, "x": 15, "y": 4},
    # row 6
    {"index": 56, "x": 3, "y": 5},
    {"index": 57, "x": 7, "y": 5},
    {"index": 58, "x": 11, "y": 5},
    {"index": 59, "x": 15, "y": 5},
    # row 7
    {"index": 60, "x": 0, "y": 6},
    {"index": 61, "x": 1, "y": 6},
    {"index": 62, "x": 2, "y": 6},
    {"index": 63, "x": 3, "y": 6},
    {"index": 64, "x": 4, "y": 6},
    {"index": 65, "x": 5, "y": 6},
    {"index": 66, "x": 6, "y": 6},
    {"index": 67, "x": 7, "y": 6},
    {"index": 68, "x": 8, "y": 6},
    {"index": 69, "x": 9, "y": 6},
    {"index": 70, "x": 10, "y": 6},
    {"index": 71, "x": 11, "y": 6},
    {"index": 72, "x": 12, "y": 6},
    {"index": 73, "x": 13, "y": 6},
    {"index": 74, "x": 14, "y": 6},
    {"index": 75, "x": 15, "y": 6},
    # row 8
    {"index": 76, "x": 1, "y": 7},
    {"index": 77, "x": 5, "y": 7},
    {"index": 78, "x": 9, "y": 7},
    {"index": 79, "x": 13, "y": 7},
    # row 9
    {"index": 80, "x": 0, "y": 8},
    {"index": 81, "x": 1, "y": 8},
    {"index": 82, "x": 2, "y": 8},
    {"index": 83, "x": 3, "y": 8},
    {"index": 84, "x": 4, "y": 8},
    {"index": 85, "x": 5, "y": 8},
    {"index": 86, "x": 6, "y": 8},
    {"index": 87, "x": 7, "y": 8},
    {"index": 88, "x": 8, "y": 8},
    {"index": 89, "x": 9, "y": 8},
    {"index": 90, "x": 10, "y": 8},
    {"index": 91, "x": 11, "y": 8},
    {"index": 92, "x": 12, "y": 8},
    {"index": 93, "x": 13, "y": 8},
    {"index": 94, "x": 14, "y": 8},
    {"index": 95, "x": 15, "y": 8},
    # row 10
    {"index": 96, "x": 3, "y": 9},
    {"index": 97, "x": 7, "y": 9},
    {"index": 98, "x": 11, "y": 9},
    {"index": 99, "x": 15, "y": 9},
    # row 11
    {"index": 100, "x": 0, "y": 10},
    {"index": 101, "x": 1, "y": 10},
    {"index": 102, "x": 2, "y": 10},
    {"index": 103, "x": 3, "y": 10},
    {"index": 104, "x": 4, "y": 10},
    {"index": 105, "x": 5, "y": 10},
    {"index": 106, "x": 6, "y": 10},
    {"index": 107, "x": 7, "y": 10},
    {"index": 108, "x": 8, "y": 10},
    {"index": 109, "x": 9, "y": 10},
    {"index": 110, "x": 10, "y": 10},
    {"index": 111, "x": 11, "y": 10},
    {"index": 112, "x": 12, "y": 10},
    {"index": 113, "x": 13, "y": 10},
    {"index": 114, "x": 14, "y": 10},
    {"index": 115, "x": 15, "y": 10},
    # row 12
    {"index": 116, "x": 1, "y": 11},
    {"index": 117, "x": 5, "y": 11},
    {"index": 118, "x": 9, "y": 11},
    {"index": 119, "x": 13, "y": 11},
    # row 13
    {"index": 120, "x": 0, "y": 12},
    {"index": 121, "x": 1, "y": 12},
    {"index": 122, "x": 2, "y": 12},
    {"index": 123, "x": 3, "y": 12},
    {"index": 124, "x": 4, "y": 12},
    {"index": 125, "x": 5, "y": 12},
    {"index": 126, "x": 6, "y": 12},
    {"index": 127, "x": 7, "y": 12},
    {"index": 128, "x": 8, "y": 12},
    {"index": 129, "x": 9, "y": 12},
    {"index": 130, "x": 10, "y": 12},
    {"index": 131, "x": 11, "y": 12},
    {"index": 132, "x": 12, "y": 12},
    {"index": 133, "x": 13, "y": 12},
    {"index": 134, "x": 14, "y": 12},
    {"index": 135, "x": 15, "y": 12},
    # row 14
    {"index": 136, "x": 3, "y": 13},
    {"index": 137, "x": 7, "y": 13},
    {"index": 138, "x": 11, "y": 13},
    {"index": 139, "x": 15, "y": 13},
    # row 15
    {"index": 140, "x": 0, "y": 14},
    {"index": 141, "x": 1, "y": 14},
    {"index": 142, "x": 2, "y": 14},
    {"index": 143, "x": 3, "y": 14},
    {"index": 144, "x": 4, "y": 14},
    {"index": 145, "x": 5, "y": 14},
    {"index": 146, "x": 6, "y": 14},
    {"index": 147, "x": 7, "y": 14},
    {"index": 148, "x": 8, "y": 14},
    {"index": 149, "x": 9, "y": 14},
    {"index": 150, "x": 10, "y": 14},
    {"index": 151, "x": 11, "y": 14},
    {"index": 152, "x": 12, "y": 14},
    {"index": 153, "x": 13, "y": 14},
    {"index": 154, "x": 14, "y": 14},
    {"index": 155, "x": 15, "y": 14}
]