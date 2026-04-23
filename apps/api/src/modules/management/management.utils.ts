export function toSlug(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function normalizeCpf(cpf?: string | null) {
  if (!cpf) {
    return null;
  }

  const digits = cpf.replace(/\D/g, "");
  return digits.length > 0 ? digits : null;
}
