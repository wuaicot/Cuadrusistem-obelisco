import levenshtein from "fast-levenshtein";

/**
 * Normaliza texto proveniente del OCR para hacerlo comparable
 * con el formato utilizado en el POS.
 */
export function canonicalPOS(text: string): string {
  if (!text) return "";
  return text.toUpperCase().replace(/\s+/g, " ").trim();
}

/**
 * Normalización extrema para comparación de nombres (Fuzzy Name Matching)
 */
export function normalizeFuzzy(text: string): string {
  if (!text) return "";
  return text
    .toUpperCase()
    .replace(/[^A-Z0-9]/g, "") 
    .replace(/[0OQ]/g, "0")
    .replace(/[1IL|T]/g, "1")
    .replace(/[5S]/g, "5")
    .replace(/[8B]/g, "8")
    .trim();
}

export function cleanDigits(text: string): string {
  return text.replace(/[^0-9]/g, "");
}

/**
 * Identificación Híbrida de Producto con Cobertura de Tokens
 */
export function matchProductHybrid(
  rawLine: string,
  catalog: { codigo: string; nombre: string }[]
): string | null {
  const line = canonicalPOS(rawLine);
  const fuzzyLine = normalizeFuzzy(line);
  
  // 1. Prioridad Máxima: Match por código exacto de 4 dígitos
  // Lo buscamos preferentemente al inicio de la línea
  const codeMatches = line.match(/\d{4,5}/g) || [];
  for (const rawCode of codeMatches) {
    const code = rawCode.length === 5 ? rawCode.substring(1) : rawCode;
    if (catalog.find(p => p.codigo === code)) return code;
  }

  // 2. Búsqueda por similitud de Nombre con Puntuación de Cobertura
  let bestMatch = { codigo: "", score: 0 };
  
  for (const product of catalog) {
    const fuzzyName = normalizeFuzzy(product.nombre);
    if (fuzzyName.length < 3) continue;

    const catalogTokens = fuzzyName.split(/[^A-Z0-9]+/).filter(t => t.length > 2);
    let tokenMatches = 0;
    for (const token of catalogTokens) {
      if (fuzzyLine.includes(token)) tokenMatches++;
    }

    const coverage = catalogTokens.length > 0 ? (tokenMatches / catalogTokens.length) : 0;
    const lengthRatio = Math.min(fuzzyName.length / fuzzyLine.length, 1);
    
    const dist = levenshtein.get(fuzzyLine, fuzzyName);
    const maxLen = Math.max(fuzzyLine.length, fuzzyName.length);
    const levScore = maxLen > 0 ? (1 - dist / maxLen) : 0;

    const finalScore = (coverage * 0.6) + (levScore * 0.2) + (lengthRatio * 0.2);
    
    if (finalScore > bestMatch.score) {
      bestMatch = { codigo: product.codigo, score: finalScore };
    }
  }

  return bestMatch.score > 0.6 ? bestMatch.codigo : null;
}

/**
 * Extrae cantidad del final de la línea con lógica de "Zona de Cantidad".
 * Resuelve la confusión entre 2/7 y letras O/T.
 */
export function extractCantidadRobust(line: string, codigoDetectado?: string | null): number | null {
  let text = line.trim().toUpperCase();

  // 1. Eliminar el código detectado de la línea para que sus números no confundan
  if (codigoDetectado) {
    text = text.replace(codigoDetectado, "____");
  }

  // 2. Definir la "Zona de Cantidad" (últimos caracteres de la línea)
  // En los Reportes Z, la cantidad está SIEMPRE al final.
  const parts = text.split(/\s+/);
  let lastPart = parts[parts.length - 1];

  // Si la última parte es basura de control (L, PT, TT, etc), tomamos la anterior
  if (/^(L|PT|TT|EA|A|E|J|K|I)$/.test(lastPart) && parts.length > 1) {
    lastPart = parts[parts.length - 2];
  }

  // 3. Diccionario de corrección para el OCR en la zona de cantidad
  const corrections: Record<string, string> = {
    'O': '2', // Caso detectado: el '2' se lee como 'O'
    'Q': '0',
    'T': '7', // El '7' se lee como 'T'
    'I': '1',
    'L': '1',
    'Z': '2',
    'S': '5',
    'B': '8'
  };

  // Intentar convertir la última parte
  let candidate = lastPart;
  
  if (!/^\d+$/.test(candidate)) {
    // Solo aplicar correcciones si la parte es corta (1-2 chars) o ya tiene dígitos.
    // Esto evita que "ASLUCO" se convierta en "ASLUC2" -> 2
    const hasDigits = /\d/.test(candidate);
    const isShort = candidate.length <= 2;

    if (hasDigits || isShort) {
      let translated = "";
      for (const char of candidate) {
        translated += corrections[char] || char;
      }
      candidate = translated;
    }
  }

  // Extraer el número final resultante
  const finalMatch = candidate.match(/(\d+)$/);
  if (finalMatch) {
    // Validación adicional: si el candidato original era puramente alfabético, largo, 
    // y el número extraído no es la palabra completa, probablemente sea una coincidencia falsa
    // (ej: "ASLUCO" -> "ASLUC2" -> 2).
    const isPurelyAlpha = /^[A-Z]+$/.test(lastPart);
    if (isPurelyAlpha && lastPart.length > 2 && candidate !== finalMatch[1]) {
      return null;
    }

    const qty = parseInt(finalMatch[1], 10);
    // Filtro de sanidad: una cantidad en este negocio difícilmente supera 100 por ítem
    if (qty >= 0 && qty < 150) return qty;
  }

  return null;
}

export function normalizeCodeOCR(raw: string): string { return cleanDigits(raw); }
export function correctCodeOcr(rawCode: string, validCodes: string[]): string {
  const code = cleanDigits(rawCode);
  if (validCodes.includes(code)) return code;
  let best = code; let min = 99;
  for (const v of validCodes) {
    const d = levenshtein.get(code, v);
    if (d < min) { min = d; best = v; }
  }
  return min <= 1 ? best : code;
}
