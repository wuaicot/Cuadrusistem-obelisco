import levenshtein from "fast-levenshtein";

/**
 * Normaliza texto proveniente del OCR para hacerlo comparable
 * con el formato utilizado en el POS.
 */
export function canonicalPOS(text: string): string {

  if (!text) return "";

  let t = text;

  // limpiar artefactos de OCR
  t = t
    .replace(/¾/g, "O")
    .replace(/´/g, "")
    .replace(/`/g, "")
    .replace(/¨/g, "");

  // normalizar espacios
  t = t.replace(/\s+/g, " ");

  // trim
  t = t.trim();

  // POS usa mayúsculas
  return t.toUpperCase();
}


/**
 * Normaliza códigos detectados por OCR
 * corrigiendo confusiones típicas entre letras y números.
 */
export function normalizeCodeOCR(raw: string): string {

  if (!raw) return "";

  return raw
    .toUpperCase()
    .replace(/O/g, "0")
    .replace(/Q/g, "0")
    .replace(/I/g, "1")
    .replace(/L/g, "1")
    .replace(/\|/g, "1")
    .replace(/S/g, "5")
    .replace(/B/g, "8")
    .replace(/A/g, "4")
    .replace(/J/g, "3")
    .replace(/[^0-9]/g, "");
}


/**
 * Corrige un código OCR comparándolo con el catálogo real
 * de códigos válidos usando distancia de Levenshtein.
 */
export function correctCodeOcr(
  rawCode: string,
  validCodes: string[]
): string {

  const code = normalizeCodeOCR(rawCode);

  // coincidencia exacta
  if (validCodes.includes(code)) {
    return code;
  }

  let bestMatch = code;
  let minDistance = 3;

  for (const valid of validCodes) {

    const distance = levenshtein.get(code, valid);

    if (distance < minDistance) {
      minDistance = distance;
      bestMatch = valid;
    }
  }

  return bestMatch;
}