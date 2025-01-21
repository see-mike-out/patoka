sections = [
    {
        "title": "Meta data", 
         "subsections": ["asof", "name", "description", "backend_version", "provider"] 
    },
    {
        "title": "Availability", 
        "subsections": [
             {
                 "key": "status",
                  "order": [
                      "operational", 
                      "pending_jobs", 
                      "status_msg"
                  ]
             }, 
             "online_date", 
             "max_circuits"
        ] 
    },
    {
        "title": "Settings", 
        "subsections": [
            {
                "key": "options", 
                "order": [
                    "shots", 
                    "memory", "memory_slots", "memory_slot_size", 
                    "meas_level", "meas_return", 
                    "rep_time", "rep_delay", 
                    "init_qubits", 
                    "use_measure_esp", 
                    "noise_model", 
                    "seed_simulator"
                    ]
            }, 
            {
                "key": "properties", 
                "order": [
                    "last_update_date",
                    "general",
                    "gates",
                    "general_qlist",
                    "faulty_qubits",
                    "faulty_gates"
                ]
            }
        ]
    },
    {
        "title": "Qubits", 
        "subsections": [
            "num_qubits", 
             {
                 "key": "coupling_map",
                  "order": [
                      "size",
                      "distance_matrix",
                      "nodes",
                      "edges",
                      "is_symmetric"
                  ]
             }
         ]
    },
    {
        "title": "Operations", 
        "subsections": ["operation_names", "operations"] 
    },
    {
        "title": "Instructions", 
        "subsections": ["instructions"]
        # , "instruction_durations", "instruction_schedule_map"] 
    },
    {
        "title": "Pulse-related inforamation", 
        "subsections": [
            {
                "key": "pulse_defaults",
                "order": [
                    "qubit_freq_est",
                    "meas_freq_est",
                ]
            }, 
            "meas_map",
            "input_time_resolution", 
            "output_time_resolution"
        ] 
    },
    {
        "title": "Compiler-related inforamation",
        "subsections": ["translation_stage_plugin"]
        # "target",
    },
]

titles = {
    # Meta data
    "asof": "Data collected",
    "name": "Name",
    "description": "Description", 
    "backend_version": "Version",
    "provider": "Provider",

    # Availability
    "status": "Status",
    "operational": "Is operational?",
    "pending_jobs": "Pending jobs",
    "status_msg": "Status",
    "online_date": "Online date",
    "max_circuits": "Maximum circuits",

    # Setups
    "options": "Options",
    "shots": "Default shots per run",
    "memory": "Memory support",
    "memory_slots": "Memory slots",
    "memory_slot_size": "Memory slot size", 
    "meas_level": "Supported measurement levels",
    "meas_return": "Level of measurement data for the backend to return",
    "rep_time": "Supported repetition times (program execution time, unit: μs)",
    "rep_delay": "Delay between primitives (unit: sec)",
    "init_qubits": "Reset the qubits to the ground state for each shot",
    "use_measure_esp": "Use excited state promoted (ESP) readout for measurements",
    "noise_model": "Noise model",
    "seed_simulator": "Random seed to control sampling (Simulators only)",
    
    "properties": "Properties",
    "last_update_date": "Last update date",
    "general": "General system parameters",
    "gates": "Supported gates",
    "general_qlist": "General qubit list",
    "faulty_qubits": "Faulty qubits",
    "faulty_gates": "Faulty gates",

    # Qubits
    "coupling_map": "Coupling map", 
    "size": "Size",
    "distance_matrix": "Distance matrix",
    "nodes": "Nodes",
    "edges": "Edges",
    "is_symmetric": "Is symmetric?",
    "num_qubits": "Number of qubits",

    # Operations
    "operation_names": "Operation names",
    "operations": "Operations",

    # Instructions
    "instructions": "Instructions",
    "instruction_durations": "Instruciton durationas",
    "instruction_schedule_map": "Instruction schedule map",
    
    # Pulse-related inforamation
    "pulse_defaults": "Pulse defaults",
    "qubit_freq_est": "Qubit frequencies in Hertz",
    "meas_freq_est": "Measurement frequencies in Hertz",
    "meas_map": "Measurement groupings",
    "input_time_resolution": "Input time resolution",
    "output_time_resolution": "Output time resolutin",
    
    # Compiler-related information
    "target": "Target",
    "translation_stage_plugin": "Translation stage plugin(s)",
}

descriptions = {
    # Meta data
    "asof": "The time when the attributes were collected.",
    "name": "The name of the backend machine.",
    "description": "The overview information about the backend machine.", 
    "backend_version": "The version of the backend machine.",
    "provider": "The provider of the backend.",

    # Availability
    "status": "The status of the backend machine",
    "online_date": "This machine has been online since ... (after being offline).",
    "max_circuits": "The maximum number of circuits can be run in a single job.",

    # Setups
    "options": "Options for the backend machine",  
    "rep_delay": "This parameter is applicable only if `dynamic=False` is specified or defaulted to.",
    "use_measure_esp": "ESP readout can offer higher fidelity than standard measurement sequences. Backend support for ESP readout is determined by the `flag measure_esp_enabled` in `backend.configuration()`. This parameter is applicable only if `dynamic=False` is specified or defaulted to.",
    "properties": "The properties of the backend machine",

    # Qubits
    "coupling_map": "The qubit couplings.", 
    "num_qubits": "The number of qubits supported",

    # Operations
    "operation_names": "Operation names supported by the machine",
    "operations": "Operations supported by the machine",

    # Instructions
    "instructions": "Instructions supported for each qubit",
    "instruction_durations": "The durations of the supported instructions (= operations)",
    "instruction_schedule_map": "Schedule information for implementing the supported instructions (= operations), often seen as gate calibrations.",
    
    # Pulse-related inforamation
    "pulse_defaults": "the pulse defaults for the backend. If `None`, the machine is not available for Pulse scheduling.",
    "meas_map": "The grouping of measurements which are multiplexed. If `None`, the machine is not available for Pulse scheduling.",
    "input_time_resolution": "The system time resolution of input signals. If `None`, the machine is not available for Pulse scheduling.",
    "output_time_resolution": "The system time resolution of output signals. If `None`, the machine is not available for Pulse scheduling.",
    
    # Compiler-related information
    "target": "A description of instructions on a backend and their properties as well as some timing information.",
    "translation_stage_plugin": "The default translation stage plugin name for IBM backends. If `None`, it is not provided.",
}

meas_return_desc = {
    "MeasReturnType.SINGLE": "Returns information from every shot",
    "MeasReturnType.AVERAGE": "Returns average measurement output (= averaged over number of shots)"
}