import levenshtein from 'fast-levenshtein';

/**
 * Normaliza texto descriptivo extraído por OCR
 */
export function canonicalPOS(texto: string): string {
  if (!texto) return "";

  let t = texto;

  // Normalización caracteres raros OCR
  t = t
    .replace(/¾/g, "Ó")
    .replace(/[´`¨]/g, "")
    .replace(/\s+/g, " ")
    .trim()
    .toUpperCase();

  return t;
}

/**
 * Limpia un código OCR dejándolo solo en dígitos
 */
function cleanDigits(raw: string): string {
  return raw.replace(/\D/g, "");
}

/**
 * Normaliza confusiones típicas OCR térmico en tickets POS
 */
function normalizeCommonConfusions(code: string): string {
  return code
    .replace(/O/g, "0")
    .replace(/Q/g, "0")
    .replace(/D/g, "0")
    .replace(/I/g, "1")
    .replace(/L/g, "1")
    .replace(/\|/g, "1")
    .replace(/S/g, "5")
    .replace(/B/g, "8")
    .replace(/G/g, "6")
    .replace(/Z/g, "2");
}

/**
 * Corrige un código OCR comparándolo contra catálogo válido.
 * Solo acepta códigos finales de 4 dígitos.
 */
export function correctCodeOcr(rawCode: string, validCodes: string[]): string {
  if (!rawCode) return rawCode;

  // 1️⃣ Normalizar texto → números
  let code = normalizeCommonConfusions(rawCode);

  // 2️⃣ Limpiar caracteres no numéricos
  code = cleanDigits(code);

  // 3️⃣ Si no tiene 4 dígitos exactos, no es código válido
  if (code.length !== 4) return rawCode;

  // 4️⃣ Match exacto
  if (validCodes.includes(code)) return code;

  // 5️⃣ Corrección por distancia mínima (tolerancia 1)
  let bestMatch = code;
  let minDistance = 99;

  for (const vCode of validCodes) {
    const distance = levenshtein.get(code, vCode);

    if (distance < minDistance) {
      minDistance = distance;
      bestMatch = vCode;
    }
  }

  // Solo aceptar corrección si diferencia <= 1
  if (minDistance <= 1) {
    return bestMatch;
  }

  // Si no es confiable, devolver original limpio
  return code;
}