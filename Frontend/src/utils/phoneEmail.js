// Ensures the phone starts with + and has no spaces or invalid chars
export function normalizePhone(input) {
  if (!input) return "";

  let cleaned = input.replace(/\s+/g, "").replace(/[^\d+]/g, "");

  // If already starts with +
  if (cleaned.startsWith("+")) return cleaned;

  // If starts with 0 → remove it
  if (cleaned.startsWith("0")) {
    cleaned = cleaned.slice(1);
  }

  // Default India (+91)
  return `+91${cleaned}`;
}

export function phoneToEmail(phone) {
  const normalized = normalizePhone(phone);

  if (!normalized) return "";

  // Replace + to avoid invalid email char
  const safePhone = normalized.replace(/\+/g, "plus");

  return `${safePhone}@maaslli.app`;
}