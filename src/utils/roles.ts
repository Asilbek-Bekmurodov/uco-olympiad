export const normalizeRole = (role?: string | null): string | null => {
  if (!role) return null;
  const upper = role.toUpperCase();
  if (upper === "ADMIN" || upper === "ROLE_ADMIN") return "ROLE_ADMIN";
  if (upper === "USER" || upper === "ROLE_USER") return "ROLE_USER";
  return upper;
};

export const defaultRouteForRole = (role?: string | null): string => {
  const normalized = normalizeRole(role);
  if (normalized === "ROLE_ADMIN") return "/dashboard";
  if (normalized === "ROLE_USER") return "/home";
  return "/";
};
