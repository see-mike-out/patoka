# Patoka

Patoka is a collection of Jupyter Lab widgets for IBM Qiskit

[Website](https://see-mike-out.github.io/patoka/)

## User-side installation

From TestPyPi:
`python -m pip install --index-url https://test.pypi.org/simple/ --extra-index-url https://pypi.org/simple patoka`

From Main branch PyPi:
`pip install patoka`

## Usage

Refer to notebooks in the `demos` directory.

## Developers

### Vertual environment

Run `source bin/activate`

### Install libraries

1. For Python:
 `pip install -e .`

2. For Node:
 `npm i`

### Running the dev version widget server

Run: `npm run dev`

Then, import the loader functions from `patoka.widgets_dev` (e.g., `from patoka.widgets_dev import getCircuitViewer`).

### Bug report

Please use issues. Because the production version cannot attribute to Javascript source files, please run with the dev version.

## Citation

[Preprint](https://arxiv.org/abs/2502.00202)

```latex
@inproceedings{kim:patoka2025,
 title        = {Toward Human-Quantum Computer Interaction: Interface Techniques for Usable Quantum Computing},
 author       = {Kim, Hyeok and Jeng, Mingyoung J. and Smith, Kaitlin N.},
 year         = 2025,
 booktitle    = {ACM Proc. CHI},
 doi          = {10.1145/3706598.3713370}
}
```
