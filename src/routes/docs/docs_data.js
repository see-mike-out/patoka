import { CircuitViewer, GetCircuitViewer, TransplieParam } from "./data/circuit_viewer";
import { CircuitWriter, GetCircuitWriter } from "./data/circuit_writer";
import { DevNote } from "./data/devnote";
import { JobOutputData, ProcessJobData, RetrieveJobData } from "./data/job_data";
import { GetMachineViewer, MachineViewer } from "./data/machine_viewer";
import { GetResultViewer, ResultViewer } from "./data/result_viewer";

export const docs_data = [
  GetCircuitWriter,
  CircuitWriter,
  GetCircuitViewer,
  CircuitViewer,
  GetMachineViewer,
  MachineViewer,
  GetResultViewer,
  ResultViewer,
  TransplieParam,
  JobOutputData,
  ProcessJobData,
  RetrieveJobData,
  DevNote
]