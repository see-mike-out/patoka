export const QiskitMachines = {
  Aer: {
    name: "Aer",
    sim: "AerSimulator",
    n_qubits: Infinity
  },
  Qiskit: {
    name: "Qiskit",
    n_qubits: 133,
    description: "This option chooses what Qiskit recommends using. While you may choose upto 133 qubits, typically Qiskit cloud machines offer upto 127 qubits."
  },
  Vigo: {
    name: "Vigo",
    sim: "FakeVigo",
    "n_qubits": 5
  },
  Casablanca: {
    name: "Casablanca",
    sim: "FakeCasablanca",
    "n_qubits": 7
  },
  Melbourne: {
    name: "Melbourne",
    sim: "FakeMelbourneV2",
    "n_qubits": 16
  },
  Guadalupe: {
    name: "Guadalupe",
    sim: "FakeGuadalupe",
    "n_qubits": 16
  },
  Hanoi: {
    name: "Hanoi",
    sim: "FakeHanoi",
    "n_qubits": 27
  },
  Brisbane: {
    name: "Brisbane",
    machine: "ibm_brisbane",
    sim: "FakeBrisbane",
    n_qubits: 127
  },
  Sherbrooke: {
    name: "Sherbrooke",
    machine: "ibm_sherbrooke",
    sim: "FakeSherbrooke",
    n_qubits: 127
  },
  Kyiv: {
    name: "Kyiv",
    machine: "imb_kyiv",
    sim: "FakeKyiv",
    n_qubits: 127
  },
  Quebec: {
    name: "Quebec",
    machine: "ibm_quebec",
    sim: "FakeQuebec",
    n_qubits: 127
  },
  Rensselaer: {
    name: "Rensselaer",
    machine: "ibm_rensselaer",
    n_qubits: 127
  },
  Brussels: {
    name: "Brussels",
    machine: "ibm_brussels",
    n_qubits: 127
  },
  Osaka: {
    name: "Osaka",
    machine: "ibm_osaka",
    sim: "FakeOsaka",
    n_qubits: 127
  },
  Nazca: {
    name: "Nazca",
    machine: "ibm_nazca",
    n_qubits: 127
  },
  Strasbourg: {
    name: "Strasbourg",
    machine: "ibm_strasbourg",
    n_qubits: 127
  },
  Kawasaki: {
    name: "Kawasaki",
    machine: "ibm_kawasaki",
    sim: "FakeKawasaki",
    n_qubits: 127
  },
  Kyoto: {
    name: "Kyoto",
    machine: "ibm_kyoto",
    sim: "FakeKyoto",
    n_qubits: 127
  },
  Cusco: {
    name: "Cusco",
    machine: "ibm_cusco",
    sim: "FakeCusco",
    n_qubits: 127
  },
  Cleveland: {
    name: "Cleveland",
    machine: "ibm_cleveland",
    n_qubits: 127
  },
  Torino: {
    name: "Torino",
    machine: "ibm_torino",
    sim: "FakeTorino",
    n_qubits: 133
  },
  Fez: {
    name: "Fez",
    machine: "ibm_fez",
    n_qubits: 156
  }
};

export const QiskitMachinesTypes = Object.keys(QiskitMachines).map((k) => QiskitMachines[k]);
