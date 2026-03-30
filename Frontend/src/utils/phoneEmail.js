// src/utils/phoneEmail.js
// Ensures the phone starts with + and has no spaces
export function normalizePhone(input) {
  const trimmed = (input || "").replace(/\s+/g, "");
  if (trimmed.startsWith("+")) return trimmed;
  // Adjust default country if you want. Here we assume India (+91) if no +
  return `+91${trimmed}`;
}

export function phoneToEmail(phone) {
  const p = normalizePhone(phone);
  // Use a domain you control; this does not need to exist—just consistent.
  return `${p.replace(/\+/g, "plus") }@maaslli.app`;
}
