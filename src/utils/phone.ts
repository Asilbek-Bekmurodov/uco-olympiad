// Utility helpers for Uzbek phone numbers
// Keeps digits after the country code and formats for display.

// Strip non-digits, drop leading country code if provided, and cap at 9 digits
export const normalizeUzPhone = (input: string): string => {
  const digits = input.replace(/\D/g, "");
  // Remove leading 998 if user pasted full number
  const withoutCode = digits.startsWith("998") ? digits.slice(3) : digits;
  return withoutCode.slice(0, 9);
};

// Format digits into human-friendly string.
// Example: "914572614" => "+998 (91) 457-26-14"
export const formatUzPhone = (
  input: string,
  opts: { withCountry?: boolean } = {},
): string => {
  const digits = normalizeUzPhone(input);
  if (!digits) return opts.withCountry === false ? "" : "+998";

  const part1 = digits.slice(0, 2); // operator code
  const part2 = digits.slice(2, 5);
  const part3 = digits.slice(5, 7);
  const part4 = digits.slice(7, 9);

  let out = opts.withCountry === false ? "" : "+998";
  out += part1 ? ` (${part1}${part1.length === 2 ? ")" : ""}` : "";
  out += part2 ? ` ${part2}` : "";
  out += part3 ? `-${part3}` : "";
  out += part4 ? `-${part4}` : "";
  return out.trim();
};

// Convenience: local-part only, e.g. "(91) 457-26-14"
export const formatUzPhoneLocal = (input: string): string =>
  formatUzPhone(input, { withCountry: false });
