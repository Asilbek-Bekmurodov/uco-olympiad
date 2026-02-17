// Keeps digits after the country code and formats for display.

export const normalizeUzPhone = (input: string): string => {
  let digits = input.replace(/\D/g, "");

  // Country code only if explicitly present (+998) or length exceeds local (9 digits).
  // This avoids stripping local numbers that start with "998" (e.g. 99 8xx xx xx).
  const hasExplicitPlus = input.includes("+");
  if (digits.startsWith("998") && (hasExplicitPlus || digits.length > 9)) {
    digits = digits.slice(3);
  }

  // Har doim oxirgi 9 ta raqamni olamiz
  if (digits.length > 9) {
    digits = digits.slice(-9);
  }

  return digits;
};

// Format digits into human-friendly string.
// Example: "914572614" => "+998 (91) 457-26-14"
export const formatUzPhone = (
  input: string,
  opts: { withCountry?: boolean } = {},
): string => {
  const digits = normalizeUzPhone(input);
  if (!digits) return opts.withCountry === false ? "" : "+998";

  const part1 = digits.slice(0, 2);
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
