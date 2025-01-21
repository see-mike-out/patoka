export function generate_pauli_permutation(n_bits, valid_bits) {
  let remaining_bits = n_bits - valid_bits;
  if (remaining_bits < 0) return null;
  else {
    let post_I = "I".repeat(remaining_bits);
    return generate_pauli_permutation_recursive(valid_bits).map((d) => d + post_I);
  }
}

const letters = ["X", "Y", "Z"];
function generate_pauli_permutation_recursive(n_bits) {
  if (n_bits == 1) return letters;
  let permutations = [];
  for (const letter of letters) {
    let permute = generate_pauli_permutation_recursive(n_bits - 1).map((d) => letter + d);
    permutations.push(...permute);
  }
  return permutations;
}