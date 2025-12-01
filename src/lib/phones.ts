export function normalizeToE164(input: string, country = "BR") {
  if (!input || typeof input !== "string") return null;
  // remove tudo que não for dígito
  let digits = input.replace(/\D/g, "");

  // remove leading international 00
  if (digits.startsWith("00")) digits = digits.slice(2);

  // se já tiver country code (ex: 55...), retorna com +
  if (digits.startsWith("55") && digits.length >= 11) {
    return "+" + digits;
  }

  if (country === "BR") {
    // casos comuns:
    // 11 dígitos (9XXXXXXXX + DDD) -> e.g. 11991234567
    // 10 dígitos (8-digit landline + DDD) -> e.g. 1131234567
    if (digits.length === 11 || digits.length === 10) {
      return "+55" + digits;
    }
    // às vezes usuário enviou sem DDD (9 dígitos) — NÃO podemos adivinhar o DDD
    // devolvemos null para forçar correção
  }

  // se tiver 12/13 dígitos e começar com 0/?? tente retornar com +
  if (digits.length >= 11 && digits.length <= 15) return "+" + digits;

  return null; // inválido / ambíguo
}
