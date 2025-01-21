import numpy as np

from itertools import zip_longest
from sympy import Matrix
from typing import Optional, Sequence
from pathlib import Path
from PIL import Image

from qiskit import QuantumCircuit
import qiskit_aer
from qiskit.quantum_info.operators import Operator
from qiskit.quantum_info.states import Statevector


# get IBM's local simulator backend
print(' ')
print('#########################################################')
print('########### Loaded Local Simulation Backend #############')
print('#########################################################')
local_simulator_backend = qiskit_aer.AerSimulator()
print(local_simulator_backend)
print('#########################################################')


##############################################
############# Helping Functions ##############
##############################################
def pad_array(arr: np.ndarray) -> np.ndarray:
    # Pads a multidimensional array such that each dimension is a power of 2
    # Args:
    #     arr (np.ndarray): Input multidimensional array
    # Returns:
    #     np.array: Padded multidimensional array
    new_dims = 2**np.ceil(np.log2(arr.shape)).astype(int)
    n_pad = new_dims - arr.shape

    if n_pad.any():  # Don't pad if you don't need to
        n_pad = list(zip([0] * arr.ndim, n_pad))
        arr = np.pad(arr, n_pad, "constant", constant_values=0)

    return arr

def flatten_image(filename: Path) -> tuple[np.array, np.array]:
    # Flattens a multidimensional image into a 1-D vector
    # Args:
    #     filename (Path): Path to the input image (JPEG format)
    # Returns:
    #     Tuple[np.array, np.array]: Tuple of (flattened image, original dimensions of image)
    with Image.open(filename, "r") as im:
        image_data = np.asarray(im).astype(float) # Convert Image to Numpy array
        dimensions = image_data.shape # Store dimensions of image data
    image_data = pad_array(image_data) # Pad each image dimension to powers of 2
    image_data = image_data.flatten(order="F") # Flatten image data column-wise
    return image_data, dimensions

def construct_image(image_data: np.ndarray, dims: np.ndarray, mode: str = "L") -> Image.Image:
    # Constructs a Image from a 1-D vector and the expected dimensions of the Image
    # Args:
    #     image_data (np.array): 1-D image data
    #     dims (np.array): Dimensions of the output image
    #     mode (str): Image mode "RGB" (Color) or "L" (B/W)
    # Returns:
    #     Image.Image: Python Image Library Image
    image_data = np.abs(image_data).astype(np.uint8) # Convert magnitude of data to uint8
    image_data = image_data.reshape(dims, order="F") # Reshape image data to target dimension
    return Image.fromarray(image_data, mode)

def rotate_right(qc: QuantumCircuit, start: int, end: int) -> None:
    # Apply rotate right operation to QuantumCircuit (qc) using SWAP gates
    # Args:
    #     start (int): Starting qubit (lower index)
    #     end (int): Ending qubit (higher index)
    rng = range(min(start,end), max(start,end))
    for y in rng:
        qc.swap(y, y + 1)

def rotate_left(qc: QuantumCircuit, start: int, end: int) -> None:
    # Apply rotate right operation to QuantumCircuit (qc) using SWAP gates
    # Args:
    #     start (int): Starting qubit (higher index)
    #     end (int): Ending qubit (lower index)
    rng = range(max(start,end), min(start,end), -1)
    for y in rng:
        qc.swap(y, y - 1)

def display_quantum_circuit(qc: QuantumCircuit):
    # Display QuantumCircuit (qc) as gates
    # Args:
    #     qc (QuantumCircuit): qiskit QuantumCircuit to display
    display(qc.draw('mpl', reverse_bits=True))

def display_operator(qc: QuantumCircuit):
    # Display the equivalent unitary-matrix-operator of the QuantumCircuit (qc)
    # Args:
    #     qc (QuantumCircuit): qiskit QuantumCircuit to display
    display(Matrix(Operator(qc).data.round(3)))

def display_statevector(qc: QuantumCircuit):
    # Display output quantum-state-vector of the QuantumCircuit (qc)
    # Args:
    #     qc (QuantumCircuit): qiskit QuantumCircuit to display
    display(Matrix(Statevector(qc).data.round(3)))

def calculate_fidelity(psi_1: np.ndarray, psi_2: np.ndarray) -> float:
    # Calculate the fidelity metric as the dot product of two normalized vectors
    # Args:
    #     psi_1 (np.array): Statevector 1
    #     psi_2 (np.array): Statevector 2
    # Returns:
    #     float: fidelity
    psi_1 = psi_1.astype(complex)
    psi_2 = psi_2.astype(complex)
    # Normalize psi_1 and psi_2
    psi_1 /= np.linalg.norm(psi_1)
    psi_2 /= np.linalg.norm(psi_2)
    # Calculate fidelity as the dot product of the two statevectors
    return np.abs(np.dot(psi_1, psi_2))

def convolution(data: np.ndarray, fltr: np.ndarray) -> np.ndarray:
    # Direct implementation of unity-stride classical convolution
    # Args:
    #     img_data (np.array): Input data
    #     fltr (np.array): Convolution filter
    # Returns:
    #     np.array: Output data
    img = np.zeros_like(data)
    for idx, _ in np.ndenumerate(img):
        # Create the window
        window = data
        for i, (id, f) in enumerate(zip_longest(idx, fltr.shape, fillvalue=1)):
            id *= 1
            window = window.take(range(id, id + f), mode="wrap", axis=i)

        # Covers for if fltr and data are different dimensionality
        window = window.reshape(fltr.shape, order="F")

        # Performs convolution operation
        img[tuple(idx)] = np.sum(window * fltr)

    return np.abs(img)


def avg_filter(N: int, dim: int = 1):
    # Average convolution filter
    # Args:
    #     N (int): size of each filter dimension
    #     dim (int): Dimensionality of filter (Default: 2)
    # Returns:
    #     np.array: Averaging filter
    return np.ones([N for _ in range(dim)]) / (N**dim)


def sobel_filter(N: int, dim: int = 2, axis: int = 0):
    # Extended Sobel X/Y convolution filter
    # Args:
    #     N (int): size of each filter dimension
    #     dim (int): Dimensionality of filter (Default: 2)
    #     axis (int): filter axis (X = 0, Y = 1, etc.)
    # Returns:
    #     np.array: Sobel edge-detection filter
    fltr = np.zeros([N for _ in range(dim)])

    middle = N // 2
    middle = [middle - 1, middle] if N % 2 == 0 else [middle, middle]

    vec = np.ones(N)
    vec[middle] += 1

    lim = (N - 1) // 2
    for i in 1 + np.arange(lim):
        for j, m in enumerate(middle):
            c = (-1) ** j * i

            idx = np.index_exp[:] * axis + np.index_exp[m - c]
            fltr[idx] = c * vec

    # normalizing factor is just the sum of all of the (abs() of all) components
    return 2 * fltr / np.sum(np.abs(fltr))


def normal(x: np.ndarray, sigma: int = 1):
    # Normal / Gaussian function
    # Args:
    #     x (np.array): input data
    #     sigma (int): gaussian variance (Default: 1.0)
    # Returns:
    #     np.array: normal function
    return np.exp(-((x / sigma) ** 2) / 2) / np.sqrt(2 * np.pi * sigma**2)


def gaussian_blur(N: int, sigma: float = 1, dim: int = 2):
    # Gaussian blur filter
    # Args:
    #     N (int): size of each filter dimension
    #     sigma (int): gaussian variance (Default: 1.0)
    #     dim (int): Dimensionality of filter (Default: 2)
    # Returns:
    #     np.array: Gaussian blur filter
    centre = (N - 1) / 2
    fltr = np.zeros([N for _ in range(dim)])

    for idx in np.ndindex(fltr.shape):
        fltr[idx] = np.prod(tuple(normal(i - centre, sigma) for i in idx))

    fltr = fltr / np.sum(fltr)  # normalizing the matrix

    return fltr


def laplacian_of_gaussian(N: int, sigma: float = 0.6, dim: int = 2):
    # Outline convolution filter using gaussian function
    # Args:
    #     N (int): size of each filter dimension
    #     sigma (int): gaussian variance (Default: 0.6)
    #     dim (int): Dimensionality of filter (Default: 2)
    # Returns:
    #     np.array: laplacian_of_gaussian filter
    center = (N - 1) / 2
    fltr = gaussian_blur(N, sigma, dim)

    for idx in np.ndindex(fltr.shape):
        coeff = np.sum((i - center) ** 2 for i in idx) / (2 * sigma**2) - 1
        fltr[idx] = coeff * fltr[idx] * (np.sqrt(2 / sigma**2)) ** dim

    avg = np.sum(fltr) / np.prod(fltr.shape)
    for i in range(0, fltr.shape[0]):
        for j in range(0, fltr.shape[1]):
            fltr[i][j] = fltr[i][j] - avg  # we instead normalize the LoG kernel to 0

    return fltr

def laplacian(N: int, dim: int = 2) -> np.ndarray:
    # Integer approximation of laplacian_of_gaussian
    # Args:
    #     N (int): size of each filter dimension
    #     dim (int): Dimensionality of filter (Default: 2)
    # Returns:
    #     np.array: laplacian filter
    centre = (N - 1) // 2
    fltr = np.ones([N for _ in range(dim)])

    idx = tuple(centre for _ in range(dim))
    fltr[idx] = -(N**dim - 1)

    norm = (N**dim) - N
    return fltr / norm

def shift(qc: QuantumCircuit, k: int = 1, qubits: Optional[Sequence] = None, control=None):
    # Quantum shift operation, a.k.a. quantum incrementor/decrementor
    # Args:
    #     qc (QuantumCircuit): Circuit to apply operation on
    #     k (int): increment / decrement factor
    #     qubits (Sequence): Qubits to apply operation on (defaults to all)
    #     control (Sequence): Qubits to that control this operation (defaults to None)
    # Returns:
    #     TODO: TODO
    if k == 0:
        return
    if qubits is None:
        qubits = qc.qubits

    # Increment / Decrement for
    for _ in range(abs(k)):
        for i in range(len(qubits))[::-np.sign(k)]:
            controls = list(qubits[:i])

            if control is not None:
                controls += [control]

            if len(controls) == 0:
                qc.x(qubits[i])
            else:
                qc.mcx(controls, qubits[i])
##############################################

def display_function(total_states, counts, shots, num_states, magnitude, dims, image_mode):
    psi_noisy = np.zeros(total_states)
    for bit, count in counts.items():
        psi_noisy[int(bit, 2)] = int(count) / shots
    psi_noisy = np.sqrt(psi_noisy)[:num_states]
    psi_noisy_denormalized = magnitude * psi_noisy[:np.prod(dims)] # denormalize and unpad data
    im_convolution_noisy = construct_image(psi_noisy_denormalized, dims, image_mode)
    display(im_convolution_noisy)
