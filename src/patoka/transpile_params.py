class TranspileParam:
    def __init__(self,
                 basis_gates=None,
                 inst_map=None,
                 callback=None,
                 coupling_map=None, 
                 backend_properties=None, 
                 initial_layout=None, 
                 layout_method=None, 
                 routing_method=None, 
                 translation_method=None, 
                 scheduling_method=None, 
                 instruction_durations=None,
                 approximation_degree=1.0, 
                 timing_constraints=None, 
                 seed_transpiler=None, 
                 optimization_level=None, 
                 output_name=None, 
                 unitary_synthesis_method='default', 
                 unitary_synthesis_plugin_config=None, 
                 target=None, 
                 hls_config=None, 
                 init_method=None, 
                 optimization_method=None, 
                 num_processes=None,
                _skip_target=False):
        self.basis_gates = basis_gates
        self.inst_map = inst_map
        self.callback = callback
        self.coupling_map = coupling_map
        self.backend_properties = backend_properties 
        self.initial_layout = initial_layout
        self.layout_method = layout_method 
        self.routing_method = routing_method
        self.translation_method = translation_method
        self.scheduling_method = scheduling_method 
        self.instruction_durations = instruction_durations
        self.approximation_degree = approximation_degree
        self.timing_constraints = timing_constraints 
        self.seed_transpiler = seed_transpiler
        self.optimization_level = optimization_level
        self.output_name = output_name
        self.unitary_synthesis_method = unitary_synthesis_method
        self.unitary_synthesis_plugin_config = unitary_synthesis_plugin_config
        self.target = target
        self.hls_config = hls_config
        self.init_method = init_method
        self.optimization_method = optimization_method
        self.num_processes = num_processes
        self._skip_target = _skip_target

    def to_dict(self):
        # need to work on serialization
        return {
            "basis_gates": self.basis_gates,
            "inst_map": self.inst_map,
            "callback": self.callback, #$
            "coupling_map": self.coupling_map,
            "backend_properties": self.backend_properties,
            "initial_layout": self.initial_layout,
            "layout_method": self.layout_method,
            "routing_method": self.routing_method,
            "translation_method": self.translation_method,
            "scheduling_method": self.scheduling_method,
            "instruction_durations": self.instruction_durations,
            "approximation_degree": self.approximation_degree,
            "timing_constraints": self.timing_constraints,
            "seed_transpiler": self.seed_transpiler,
            "optimization_level": self.optimization_level,
            "output_name": self.output_name, #$
            "unitary_synthesis_method": self.unitary_synthesis_method,
            "unitary_synthesis_plugin_config": self.unitary_synthesis_plugin_config,
            "target": self.target,
            "hls_config": self.hls_config,
            "init_method": self.init_method,
            "optimization_method": self.optimization_method,
            "num_processes": self.num_processes, #$
            "_skip_target": self._skip_target
        }
    
    def to_dict_for_transpile(self):
        return {
            "basis_gates": self.basis_gates,
            "inst_map": self.inst_map,
            "coupling_map": self.coupling_map,
            "backend_properties": self.backend_properties,
            "initial_layout": self.initial_layout,
            "layout_method": self.layout_method,
            "routing_method": self.routing_method,
            "translation_method": self.translation_method,
            "scheduling_method": self.scheduling_method,
            "instruction_durations": self.instruction_durations,
            "approximation_degree": self.approximation_degree,
            "timing_constraints": self.timing_constraints,
            "seed_transpiler": self.seed_transpiler,
            "optimization_level": self.optimization_level,
            "unitary_synthesis_method": self.unitary_synthesis_method,
            "unitary_synthesis_plugin_config": self.unitary_synthesis_plugin_config,
            "target": self.target,
            "hls_config": self.hls_config,
            "init_method": self.init_method,
            "optimization_method": self.optimization_method,
            "_skip_target": self._skip_target
        }
        
    def to_dict_for_transpile_run(self):
        return {
            "callback": self.callback, #$
            "output_name": self.output_name, #$
            "num_processes": self.num_processes #$
        }