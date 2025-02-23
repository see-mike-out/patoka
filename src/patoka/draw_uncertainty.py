import numpy as np
import pandas as pd
import altair as alt
from scipy.special import softmax
from ipywidgets import IntProgress
from IPython.display import display
import os
import json
from tqdm.auto import tqdm

def drawStateUncertainty(_count, qubit_properties, gate_properties, gate_propperty_map, 
                         trans_circuit, sampling_counts=None, sample_size=None, ci_alpha=0.95, bootstrap=False, design={}):
    # original counts
    # [todo] need to fix this
    count = count_adjustment(_count)
    
    # get original sample
    states = np.array(list(count.keys()))
    counts = np.array(list(count.values()))
    original_sample = np.repeat(states, counts)
    n_shots = len(original_sample)
    
    # get success rate
    esp = 1 
    error_rates = []
    for inst in trans_circuit:
        gate_error = 0
        if inst["gate"] not in ["barrier", "measure"]:
            gate = inst["gate"]
            qubits = [q["index"] for q in inst["qubits"]]
            k = gate + "__" + "_".join([str(q) for q in qubits])
            gate_error = gate_properties[gate_propperty_map[k]]["parameters"]["gate_error"]["value"]
        elif inst["gate"] == "measure":
            gate_error = qubit_properties[inst["qubits"][0]["index"]]["readout_error"]["value"]
        error_rates.append(gate_error)
        esp = esp * (1 - gate_error)
    
    error_rates = np.array(error_rates)
    
    # predefined uniform distribution
    piecewise_probs = {}
    base_probs = np.array([count[s] for s in states])

    # count[state] / n_shots
    for state in states:
        probs = base_probs / (n_shots-count[state]) 
        this = np.argwhere(states == state)
        probs[this] = 0
        piecewise_probs[state] = softmax(probs)

    # make a function that simulates an error process
    error_case_function = simulate_error_process(error_rates, states, piecewise_probs)
    
    # estimate the sampling counts
    if sampling_counts is None:
        sampling_counts = 10000
    if sample_size is None:
        sample_size = n_shots
    if sample_size < n_shots:
        bootstrap = True

    # resample
    resample_collection = None
    if bootstrap:
        resample_collection = np.array([np.random.choice(original_sample, sample_size) for i in range(sampling_counts)]).flatten()
    else:
        resample_collection = np.repeat([original_sample], sampling_counts, axis=0).flatten()
    
    # apply esp
    ## Get the progress bar
    if "JPY_PARENT_PID" in os.environ:
        tqdm.pandas() # display the progress bar
    
    resample_collection = pd.Series(resample_collection)

    # simulate error cases
    if "JPY_PARENT_PID" in os.environ:
        resample_collection = resample_collection.progress_apply(lambda x: error_case_function(x))
    else:
        resample_collection = resample_collection.apply(lambda x: error_case_function(x))
    
    resample_collection = resample_collection.to_numpy().flatten()
    
    # reshape
    resample_collection = resample_collection.reshape([sampling_counts, sample_size])
        
    # get the counts of resamples
    resample_count = [np.unique(x, return_counts=True) for x in resample_collection]

    resample_count_collection = []
    for count_item in resample_count:
        re_values, re_counts = count_item
        re_count_dict = {}
        for i in range(len(re_values)):
            re_count_dict[re_values[i]] = int(re_counts[i])
        resample_count_collection.append(re_count_dict)

    sim_errors = None
    if sample_size == n_shots:
        sim_errors = []
        for rs in resample_collection:
            sim_err = np.sum(rs == original_sample)
            sim_errors.append(float(sim_err) / n_shots)
            
    # get confidence interval
    resample_stats = {}
    resample_count_values = {}
    resample_prob_values = {}

    if ci_alpha is None:
        ci_alpha = 0.95
    ci_range = get_ci_range(ci_alpha)

    for state in states:
        count_values = [sample[state] if state in sample else 0 for sample in resample_count_collection]
        prob_values = np.array(count_values) / sample_size
        mean = np.mean(count_values)
        prob_mean = np.mean(prob_values)
        std = np.std(count_values)
        prob_std = np.std(prob_values)
        interval = np.percentile(count_values, ci_range)
        prob_interval = np.percentile(prob_values, ci_range)
        resample_count_values[state] = count_values
        resample_prob_values[state] = prob_values.tolist()
        resample_stats[state] = {
            "measure": count[state],
            "prob_measure": count[state] / n_shots,
            "state": state,
            "mean": mean,
            "std": std,
            "interval": interval.tolist(),
            "lb": interval[0],
            "ub": interval[1],
            "prob_mean": prob_mean,
            "prob_std": prob_std,
            "prob_interval": prob_interval.tolist(),
            "prob_lb": prob_interval[0],
            "prob_ub": prob_interval[1]
        }

    metadata = {
        "sampling_counts": sampling_counts, 
        "ci_alpha": ci_alpha,
        "bootstrap": bootstrap,
        "sample_size": sample_size,
        "esp": esp
    }
    return resample_vis(resample_stats, resample_count_values, resample_prob_values, sim_errors, metadata, design)


class resample_vis:
    def __init__(self, stats, counts, probs, sim_errors, metadata, design):
        self.stats = stats
        self.counts = counts
        self.probs = probs
        self.metadata = metadata
        self.design = design
        self.sim_errors = sim_errors
    
    def draw(self, mark=None):
        if mark is None and "mark" in self.design:
            mark = self.design["mark"]
            
        resample_pd = pd.DataFrame(self.stats).T
        error_bars = alt.Chart(resample_pd).mark_rule().encode(
          alt.Y('lb' if not self.metadata["bootstrap"] else 'prob_lb').scale(zero=False),
          alt.Y2('ub' if not self.metadata["bootstrap"] else 'prob_ub'),
          alt.X('state')
        )

        if mark == "bar":
            bars = alt.Chart(resample_pd).mark_bar(color="#ffc400").encode(
              y=alt.Y('measure' if not self.metadata["bootstrap"] else 'prob_measure'),
              x=alt.X('state')
            )
            vis = bars + error_bars
        else:
            points = alt.Chart(resample_pd).mark_point(filled=True, color="black").encode(
               y=alt.Y('measure' if not self.metadata["bootstrap"] else 'prob_measure'),
               x=alt.X('state')
            )
            vis = points + error_bars
        return vis
    
    def toJSON(self):
        return json.dumps({
            "data": self.stats,
            "counts": self.counts,
            "probs": self.probs,
            "sim_error": self.sim_errors,
            "mean_sim_error": float(np.mean(self.sim_errors)) if self.sim_errors is not None else None,
            "metadata": self.metadata
        })
        
    def toDict(self):
        return {
            "data": self.stats,
            "counts": self.counts,
            "probs": self.probs,
            "sim_error": self.sim_errors,
            "mean_sim_error": float(np.mean(self.sim_errors)) if self.sim_errors is not None else None,
            "metadata": self.metadata
        }


class uncertainty_design:
    def __init__(self, design):
        self.design = design

    def toJSON(self):
        return json.dumps(self.design)

def get_ci_range(alp):
    alp_bor = (1 - alp) * 100 / 2
    return [alp_bor, 100-alp_bor]

def gen_alt_output(value, prob, states):
    probs = np.repeat( (1-prob)/(len(states) - 1), len(states))
    this = np.argwhere(states == value)
    probs[this] = prob
    def o(x):
        return np.random.choice(states, 1, p=probs)
    return o

def alt_output(states, probs):
    return np.random.choice(states, 1, p=probs)


def count_adjustment(counts):
    not_done = True
    count_keys = list(counts.keys())
    updated_count_keys = list(counts.keys())
    while not_done:
        if all([d[0] == "0" for d in updated_count_keys]):
            updated_count_keys = [d[1:] for d in updated_count_keys]
        else:
            not_done = False

    for i in range(len(count_keys)):
        old_count_key = count_keys[i]
        new_count_key = updated_count_keys[i]
        counts[new_count_key] = counts[old_count_key]
        if old_count_key not in updated_count_keys:
            del counts[old_count_key]

    size = len(updated_count_keys[0])
    possible_states = [np.binary_repr(x, width=size) for x in np.arange(pow(2, size))]

    for state in possible_states:
        if state not in counts:
            counts[state] = 0
    return counts
    
def simulate_error_process(error_rates, states, piecewise_probs):
    def error_process(state):
        proc = pd.Series(error_rates)
        proc = proc.apply(lambda x: np.random.binomial(1, 1-x, 1)[0]).to_numpy()
        if proc.sum() == proc.size:
            return state
        else:
            return np.random.choice(states, 1, p=piecewise_probs[state])[0]
    return error_process
        
        


