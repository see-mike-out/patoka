export function copyToClipboardHelper(text) {
  try {
    navigator.clipboard.writeText(text);
    alert("Copied!")
  } catch (e) {
    alert("Copy failed.. :(")
  }
}