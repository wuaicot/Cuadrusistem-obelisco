import levenshtein from 'fast-levenshtein';

/**
 * Normaliza el texto extraído por OCR para que coincida con el formato del POS.
 */
export function canonicalPOS(texto: string): string {
  if (!texto) return "";

  let t = texto;

  // normalizar encoding raro OCR
  t = t
    .replace(/¾/g, "ó")
    .replace(/´/g, "")
    .replace(/`/g, "")
    .replace(/¨/g, "");

  // espacios OCR
  t = t.replace(/\s+/g, " ");

  // trim
  t = t.trim();

  // MAYUSCULA estable POS
  t = t.toUpperCase();

  return t;
}

/**
 * Corrige un código mis-leído por el OCR comparándolo contra un catálogo de códigos válidos.
 * Incluye pre-normalización de confusiones comunes (O/0, I/1, etc).
 */
export function correctCodeOcr(rawCode: string, validCodes: string[]): string {
  // 1. Pre-normalización de caracteres de texto que deberían ser números
  let code = rawCode
    .replace(/O/g, "0")
    .replace(/Q/g, "0")
    .replace(/I/g, "1")
    .replace(/L/g, "1")
    .replace(/\|/g, "1")
    .replace(/S/g, "5")
    .replace(/B/g, "8")
    .replace(/A/g, "4");

  // 2. Coincidencia exacta
  if (validCodes.includes(code)) return code;

  // 3. Levenshtein si no hay coincidencia exacta
  let bestMatch = code;
  let minDistance = 2; // toleramos máx 1-2 cambios para códigos de 4 dígitos

  for (const vCode of validCodes) {
    const distance = levenshtein.get(code, vCode);
    if (distance < minDistance) {
      minDistance = distance;
      bestMatch = vCode;
    }
  }

  return bestMatch;
}
