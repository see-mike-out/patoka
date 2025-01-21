import { CX } from "./gates/cx";
import { ISWAP } from "./gates/iswap";
import { MEASURE } from "./gates/measure";
import { RZ } from "./gates/rz";
import { SX } from "./gates/sx";
import { CUSTOM } from "./gates/custom";
import { BARRIER } from "./gates/barrier";
import { H } from "./gates/h";
import { X } from "./gates/x";
import { Y } from "./gates/y";
import { Z } from "./gates/z";
import { I } from "./gates/i";
import { S } from "./gates/s";
import { SDG } from "./gates/sdg";
import { SXDG } from "./gates/sxdg";
import { T } from "./gates/t";
import { TDG } from "./gates/tdg";
import { R } from "./gates/r";
import { RX } from "./gates/rx";
import { RY } from "./gates/ry";
import { P } from "./gates/p";
import { U } from "./gates/u";
import { U1 } from "./gates/u1";
import { U2 } from "./gates/u2";
import { U3 } from "./gates/u3";
import { ECR } from "./gates/ecr";
import { MCX } from "./gates/mcx";
import { CH } from "./gates/ch";
import { CS } from "./gates/cs";
import { CSDG } from "./gates/csdg";
import { CSX } from "./gates/csx";
import { CY } from "./gates/cy";
import { CZ } from "./gates/cz";
import { CCZ } from "./gates/ccz";
import { SWAP } from "./gates/swap";
import { DCX } from "./gates/dcx";
import { MRCX } from "./gates/mrcx";
import { CSWAP } from "./gates/cswap";
import { CRX } from "./gates/crx";
import { CRY } from "./gates/cry";
import { CRZ } from "./gates/crz";
import { CU } from "./gates/cu";
import { CU1 } from "./gates/cu1";
import { CU3 } from "./gates/cu3";
import { CP } from "./gates/cp";
import { RZZ } from "./gates/rzz";
import { RXX } from "./gates/rxx";
import { RYY } from "./gates/ryy";
import { RZX } from "./gates/rzx";
import { XXMYY } from "./gates/xx_minus_yy";
import { XXPYY } from "./gates/xx_plus_yy";

export const gate_data = {
  ISWAP,
  MEASURE,
  RZ,
  SX,
  CX,
  CUSTOM,
  BARRIER,
  H,
  X,
  Y,
  Z,
  I,
  S,
  SDG,
  SXDG,
  T,
  TDG,
  R,
  RX,
  RY,
  P,
  U,
  U1,
  U2,
  U3,
  MCX,
  CH,
  CS,
  CSDG,
  CSX,
  CY,
  CZ,
  CCZ,
  SWAP,
  DCX,
  MRCX,
  CSWAP,
  CRX,
  CRY,
  CRZ,
  CU,
  CU3,
  CU1,
  CP,
  RXX,
  RYY,
  RZX,
  XXMYY,
  XXPYY
};


export function planGateDrawing(op, layer_index, qubit_row_map) {
  let output;
  // ++++++ with 2+ control + target
  // CCXGate(*args[, _force_mutable])	CCX gate, also known as Toffoli gate.
  // ccx/c2x + 3 qubits (2 controls + 1 target) 
  // C3XGate(*args[, _force_mutable]) The X gate controlled on 3 qubits.
  // mcx/cccx/c3x + 4 qubits (3 controls + 1 target)
  // C4XGate(*args[, _force_mutable])	The 4-qubit controlled X gate.
  // [checked] mcx/ccccx/c4x/ + 5 qubits (4 contorls + 1 target)
  if (['mcx', 'cccx', 'c3x', 'ccccx', 'c4x', 'ccx'].includes(op.gate)) {
    output = MCX.plan(op, layer_index, qubit_row_map);
  }

  // ++++++ with 1 control + 1 target (CX-like) 
  // CHGate(*args[, _force_mutable])	Controlled-Hadamard gate.
  // [checked] ch + 2 qubits (1 control + 1 target) 
  else if (op.gate === CH.name) {
    output = CH.plan(op, layer_index, qubit_row_map);
  }
  // CSGate(*args[, _force_mutable])	Controlled-S gate.
  // [checked] cs + 2 qubits (1 control + 1 target)
  else if (op.gate === CS.name) {
    output = CS.plan(op, layer_index, qubit_row_map);
  }
  // CSdgGate(*args[, _force_mutable])	Controlled-S^dagger gate.
  // [checked] csdg + 2 qubits (1 control + 1 target)
  else if (op.gate === CSDG.name) {
    output = CSDG.plan(op, layer_index, qubit_row_map);
  }
  // CSXGate(*args[, _force_mutable])	Controlled-√X gate.
  // [checked] csx + 2 qubits (1 control + 1 target)
  else if (op.gate === CSX.name) {
    output = CSX.plan(op, layer_index, qubit_row_map);
  }
  // CXGate(*args[, _force_mutable])	Controlled-X gate.
  // [checked] cx + 2 qubits (1 control + 1 target)
  else if (op.gate === CX.name) {
    output = CX.plan(op, layer_index, qubit_row_map);
  }
  // CYGate(*args[, _force_mutable])	Controlled-Y gate.
  // [checked] cy + 2 qubits (1 control + 1 target)
  else if (op.gate === CY.name) {
    output = CY.plan(op, layer_index, qubit_row_map);
  }

  // +++++++ single-qubit with parameters (RZ-like)
  // PhaseGate(theta[, label, duration, unit])	Single-qubit rotation about the Z axis.
  // [checked] p + 1 qubit + 1 param
  else if (op.gate === P.name) {
    output = P.plan(op, layer_index, qubit_row_map);
  }
  // RGate(theta, phi[, label, duration, unit])	Rotation θ around the cos(φ)x + sin(φ)y axis.
  // [checked] r + 1 qubit + 2 param
  else if (op.gate === R.name) {
    output = R.plan(op, layer_index, qubit_row_map);
  }
  // RXGate(theta[, label, duration, unit])	Single-qubit rotation about the X axis.
  // [checked] rx + 1 qubit + 1 param
  else if (op.gate === RX.name) {
    output = RX.plan(op, layer_index, qubit_row_map);
  }
  // RYGate(theta[, label, duration, unit])	Single-qubit rotation about the Y axis.
  // [checked] ry + 1 qubit + 1 param
  else if (op.gate === RY.name) {
    output = RY.plan(op, layer_index, qubit_row_map);
  }
  // RZGate(theta[, label, duration, unit])	A parametric 2-qubit 
  // [checked] rz + 1 qubit + 1 param
  else if (op.gate === RZ.name) {
    output = RZ.plan(op, layer_index, qubit_row_map);
  }
  // UGate(theta, phi, lam[, label, duration, unit])	Generic single-qubit rotation gate with 3 Euler angles.
  // [checked] u + 1 qubit + 3 params
  else if (op.gate === U.name) {
    output = U.plan(op, layer_index, qubit_row_map);
  }
  // U1Gate(theta[, label, duration, unit])	Single-qubit rotation about the Z axis.
  // [unused] u1 + 1 qubit + 1 param
  else if (op.gate === U1.name) {
    output = U1.plan(op, layer_index, qubit_row_map);
  }
  // U2Gate(phi, lam[, label, duration, unit])	Single-qubit rotation about the X+Z axis.
  // [unused] u2 + 1 qubit + 2 params
  else if (op.gate === U2.name) {
    output = U2.plan(op, layer_index, qubit_row_map);
  }
  // U3Gate(theta, phi, lam[, label, duration, unit])	Generic single-qubit rotation gate with 3 Euler angles.
  // [unused] u3 + 1 qubit + 3 params
  else if (op.gate === U3.name) {
    output = U3.plan(op, layer_index, qubit_row_map);
  }

  // ++++++ single-qubit (boxed)
  // HGate(*args[, _force_mutable])	Single-qubit Hadamard gate.
  // [checked] h + 1 qubit (H)
  else if (op.gate === H.name) {
    output = H.plan(op, layer_index, qubit_row_map);
  }
  // XGate(*args[, _force_mutable])	The single-qubit Pauli-X gate
  // [checked] x + 1 qubit
  else if (op.gate === X.name) {
    output = X.plan(op, layer_index, qubit_row_map);
  }
  // YGate(*args[, _force_mutable])	The single-qubit Pauli-Y gate
  // [checked] y + 1 qubit
  else if (op.gate === Y.name) {
    output = Y.plan(op, layer_index, qubit_row_map);
  }
  // ZGate(*args[, _force_mutable])	The single-qubit Pauli-Z gate
  // [checked] z + 1 qubit
  else if (op.gate === Z.name) {
    output = Z.plan(op, layer_index, qubit_row_map);
  }
  // SGate(*args[, _force_mutable])	Single qubit S gate (Z**0.5).
  // [checked] s + 1 qubit (S)
  else if (op.gate === S.name) {
    output = S.plan(op, layer_index, qubit_row_map);
  }
  // SdgGate(*args[, _force_mutable])	Single qubit S-adjoint gate (~Z**0.5).
  // [checked] sdg + 1 qubit (Sdg)
  else if (op.gate === SDG.name) {
    output = SDG.plan(op, layer_index, qubit_row_map);
  }
  // IGate(*args[, _force_mutable])	Identity gate.
  // [checked] id + 1 qubit (I)
  else if (op.gate === I.name) {
    output = I.plan(op, layer_index, qubit_row_map);
  }
  // SXGate(*args[, _force_mutable])	The single-qubit Sqrt(X) gate
  // [checked] sx + 1 qubit
  else if (op.gate === SX.name) {
    output = SX.plan(op, layer_index, qubit_row_map);
  }
  // SXdgGate(*args[, _force_mutable])	The inverse single-qubit Sqrt(X) gate.
  // [checked] sxdg + 1 qubit
  else if (op.gate === SXDG.name) {
    output = SXDG.plan(op, layer_index, qubit_row_map);
  }
  // TGate(*args[, _force_mutable])	Single qubit T gate (Z**0.25).
  // [checked] t + 1 qubit
  else if (op.gate === T.name) {
    output = T.plan(op, layer_index, qubit_row_map);
  }
  // TdgGate(*args[, _force_mutable])	Single qubit T-adjoint gate (~Z**0.25).
  // [checked] tdg + 1qubit
  else if (op.gate === TDG.name) {
    output = TDG.plan(op, layer_index, qubit_row_map);
  }

  // +++++++ only controls 
  // CCZGate(*args[, _force_mutable])	CCZ gate.
  // [checked] ccz + 3 qubits (3 controls)
  else if (op.gate === CCZ.name) {
    output = CCZ.plan(op, layer_index, qubit_row_map);
  }
  // SwapGate(*args[, _force_mutable])	The SWAP gate.
  // [checked] swap + 2 qubits (2 swap markers)
  else if (op.gate === SWAP.name) {
    output = SWAP.plan(op, layer_index, qubit_row_map);
  }
  // CZGate(*args[, _force_mutable])	Controlled-Z gate.
  // [checked] cz + 2 qubits (1 control + 1 target)
  else if (op.gate === CZ.name) {
    output = CZ.plan(op, layer_index, qubit_row_map);
  }

  // ++++++ with 1 control + 2+ target
  // CSwapGate(*args[, _force_mutable])	Controlled-SWAP gate, also known as the Fredkin gate.
  // [checked] cswap + 3 qubits (1 control + 2 targets)---targets: 'X' with no boxes (swap marker)
  else if (op.gate === CSWAP.name) {
    output = CSWAP.plan(op, layer_index, qubit_row_map);
  }

  // +++++++ multi-qubit (ISWAP-like)
  // iSwapGate(*args[, _force_mutable])	iSWAP gate.
  // [checked] iswap + 2 qubits
  else if (op.gate === ISWAP.name) {
    output = ISWAP.plan(op, layer_index, qubit_row_map);
  }
  // ECRGate(*args[, _force_mutable])	An echoed cross-resonance gate.
  // [checked] ecr + 2 qbuits
  else if (op.gate === ECR.name) {
    output = ECR.plan(op, layer_index, qubit_row_map);
  }
  // DCXGate(*args[, _force_mutable])	Double-CNOT gate.
  // [checked] dcx (2 CXs when explicated) + 2 qubits
  else if (op.gate === DCX.name) {
    output = DCX.plan(op, layer_index, qubit_row_map);
  }

  // +++++++ with 1 control + 1 target + parameters
  // [checked] CRXGate(theta[, label, ctrl_state, ...])	Controlled-RX gate.
  // crx + 2 qbuits (1 control + 1 target) + 1 param
  else if (op.gate === CRX.name) {
    output = CRX.plan(op, layer_index, qubit_row_map);
  }
  // CRYGate(theta[, label, ctrl_state, ...])	Controlled-RY gate.
  // [checked] cry + 2 qbuits (1 control + 1 target) + 1 param
  else if (op.gate === CRY.name) {
    output = CRY.plan(op, layer_index, qubit_row_map);
  }
  // CRZGate(theta[, label, ctrl_state, ...])	Controlled-RZ gate.
  // [checked] crz + 2 qbuits (1 control + 1 target) + 1 param
  else if (op.gate === CRZ.name) {
    output = CRZ.plan(op, layer_index, qubit_row_map);
  }
  // CUGate(theta, phi, lam, gamma[, label, ...])	Controlled-U gate (4-parameter two-qubit gate).
  // [checked] cu + 2 qubits (1 control + 1 target) + 4 params
  else if (op.gate === CU.name) {
    output = CU.plan(op, layer_index, qubit_row_map);
  }
  // CU1Gate(theta[, label, ctrl_state, ...])	Controlled-U1 gate.
  // [unused] cu1 + 2 qubits (1 control + 1 target) + 1 param
  else if (op.gate === CU1.name) {
    output = CU1.plan(op, layer_index, qubit_row_map);
  }
  // CU3Gate(theta, phi, lam[, label, ...])	Controlled-U3 gate (3-parameter two-qubit gate).
  // [unused] cu3 + 2 qubits (1 control + 1 target) + 3 params
  else if (op.gate === CU3.name) {
    output = CU3.plan(op, layer_index, qubit_row_map);
  }


  // +++++++ only controls + parameters
  // CPhaseGate(theta[, label, ctrl_state, ...])	Controlled-Phase gate.
  // [checked] cp + 2 qubits (2 controls) + 1 param (shwon in the middle)
  else if (op.gate === CP.name) {
    output = CP.plan(op, layer_index, qubit_row_map);
  }
  // RZZGate(theta[, label, duration, unit])	A parametric 2-qubit 
  // [checked] rzz + 2 qubits (2 controls) + 1 param (shwon in the middle)
  else if (op.gate === RZZ.name) {
    output = RZZ.plan(op, layer_index, qubit_row_map);
  }

  // +++++++ multi-qubit + params
  // RXXGate(theta[, label, duration, unit])	Single-qubit rotation about the X axis.
  // [checked] rxx + 2 qubits + 1 param
  else if (op.gate === RXX.name) {
    output = RXX.plan(op, layer_index, qubit_row_map);
  }
  // RYYGate(theta[, label, duration, unit])	A parametric 2-qubit 
  // [checked] ryy + 2 qubits + 1 param
  else if (op.gate === RYY.name) {
    output = RYY.plan(op, layer_index, qubit_row_map);
  }
  // RZXGate(theta[, label, duration, unit])	A parametric 2-qubit 
  // [checked] rzx + 2 qubits + 1 param
  else if (op.gate === RZX.name) {
    output = RZX.plan(op, layer_index, qubit_row_map);
  }
  // XXMinusYYGate(theta[, beta, label, ...])	XX-YY interaction gate.
  // [unused] xx_minus_yy + 2 qubits + 1 param (XX-YY)
  else if (op.gate === XXMYY.name) {
    output = XXMYY.plan(op, layer_index, qubit_row_map);
  }
  // XXPlusYYGate(theta[, beta, label, duration, ...])	XX+YY interaction gate.
  // [unused] xx_plus_yy + 2 qubits + 1 param (XX+YY)
  else if (op.gate === XXPYY.name) {
    output = XXPYY.plan(op, layer_index, qubit_row_map);
  }

  // +++++++ with 2+ control + 1 target + parameters
  // RCCXGate(*args[, _force_mutable])	The simplified Toffoli gate, also referred to as Margolus gate.
  // rccx + 3 qubits
  // RC3XGate(*args[, _force_mutable])	The simplified 3-controlled Toffoli gate.
  // [checked] rcccx + 4 qubits
  else if (['rccx', 'rcccx'].includes(op.gate)) {
    output = MRCX.plan(op, layer_index, qubit_row_map);
  }

  // non-gates
  // [checked] barrier + n qubits
  else if (op.gate === BARRIER.name) {
    output = BARRIER.plan(op, layer_index, qubit_row_map);
  }
  // [checked] measure + 1 qubit + 1 clbit
  else if (op.gate === MEASURE.name) {
    output = MEASURE.plan(op, layer_index, qubit_row_map);
  }

  // customs
  else {
    output = CUSTOM.plan(op, op.gate, layer_index, qubit_row_map);
  }
  if (output) {
    output.role = "gate-group";
    output.data = {
      operation: op, 
      layer_index,
      tooltip_content: {
        "Layer": layer_index,
        "Gate": op.gate,
        "Qubit(s)": op.qubits.map((d) => d.index).join(", ")
      }
    };
  }
  return output;
}




