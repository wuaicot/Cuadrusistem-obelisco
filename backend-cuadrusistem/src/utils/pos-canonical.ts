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

  // 1. Limpieza básica y mayúsculas
  let code = raw.toUpperCase().trim();

  // 2. Correcciones específicas de caracteres que OCR confunde con números
  // O,Q -> 0
  // I,L,|,T -> 1
  // Z -> 2
  // S -> 5
  // B -> 8
  // A -> 4
  // G -> 6
  const map: Record<string, string> = {
    'O': '0', 'Q': '0',
    'I': '1', 'L': '1', '|': '1', 'T': '1',
    'Z': '2',
    'S': '5',
    'B': '8',
    'A': '4',
    'G': '6'
  };

  let normalized = "";
  for (const char of code) {
    normalized += map[char] || char;
  }

  // 3. Quedarse solo con los dígitos
  return normalized.replace(/[^0-9]/g, "");
}

/**
 * Corrige un código OCR comparándolo con el catálogo real.
 */
export function correctCodeOcr(
  rawCode: string,
  validCodes: string[]
): string {
  const code = normalizeCodeOCR(rawCode);

  // coincidencia exacta (muy probable si el OCR leyó bien o la normalización funcionó)
  if (validCodes.includes(code)) {
    return code;
  }

  // Si no hay coincidencia exacta, buscamos la más cercana con Levenshtein
  // pero solo si la distancia es pequeña (máximo 1 o 2 cambios)
  let bestMatch = code;
  let minDistance = 999;

  for (const valid of validCodes) {
    const distance = levenshtein.get(code, valid);
    if (distance < minDistance) {
      minDistance = distance;
      bestMatch = valid;
    }
  }

  // Si la distancia es razonable, devolvemos el match, si no, el original normalizado
  return minDistance <= 2 ? bestMatch : code;
}