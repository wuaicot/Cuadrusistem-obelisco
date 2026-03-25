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
 * Identificación Híbrida de Producto con Cobertura de Tokens y Validación de Categoría
 */
export function matchProductHybrid(
  rawLine: string,
  catalog: any[], // Usamos any para evitar problemas de tipos con las diferentes interfaces
  seccionActual?: string // BAR, COCINA, EMPANADAS
): string | null {
  const line = canonicalPOS(rawLine);
  if (/HORA|FECHA|PAGINA|TOTAL|CPRODUCCION/.test(line)) return null;

  const fuzzyLine = normalizeFuzzy(line);
  
  // Pre-traducción de prefijos comunes en códigos OCR
  const preProcessedLine = line.replace(/\bJ(\d{3})\b/g, '3$1')
                               .replace(/\bI(\d{3})\b/g, '1$1')
                               .replace(/\bS(\d{3})\b/g, '5$1')
                               .replace(/\b9(\d{3})\b/g, '0$1'); // Caso 9110 -> 0110

  // 1. Prioridad Máxima: Match por código exacto de 4-5 dígitos
  const codeMatches = preProcessedLine.match(/\d{4,5}/g) || [];
  let exactCodeFound: string | null = null;
  for (const rawCode of codeMatches) {
    const code = rawCode.length === 5 ? rawCode.substring(1) : rawCode;
    const found = catalog.find(p => p.codigo === code);
    if (found) {
       // Validación de categoría real (usando el campo 'categoria' del catálogo)
       if (found.categoria === 'EMPANADAS' && seccionActual !== 'EMPANADAS') continue;
       if (found.categoria === 'BAR' && seccionActual === 'COCINA') continue;
       exactCodeFound = code;
       break; 
    }
  }

  // 2. Búsqueda por tokens (esta búsqueda es la más infalible para nombres)
  let bestNameMatch = { codigo: "", score: 0 };
  
  for (const product of catalog) {
    // Filtro por sección/categoría
    if (product.categoria === 'EMPANADAS' && seccionActual !== 'EMPANADAS' && !line.includes('EMP')) continue;
    if (product.categoria === 'BAR' && seccionActual === 'COCINA' && !line.includes('BOTELLIN') && !line.includes('LATA')) continue;
    if (product.categoria === 'COCINA' && seccionActual === 'BAR') continue;

    const fuzzyName = normalizeFuzzy(product.nombre);
    if (fuzzyName.length < 3) continue;

    const catalogTokens = fuzzyName.split(/[^A-Z0-9]+/).filter(t => t.length >= 3);
    if (catalogTokens.length === 0) continue;

    let tokenMatches = 0;
    for (const token of catalogTokens) {
      if (fuzzyLine.includes(token)) tokenMatches++;
    }

    const coverage = tokenMatches / catalogTokens.length;
    if (coverage < 0.4) continue; 

    const dist = levenshtein.get(fuzzyLine, fuzzyName);
    const maxLen = Math.max(fuzzyLine.length, fuzzyName.length);
    const levScore = maxLen > 0 ? (1 - dist / maxLen) : 0;

    let finalScore = (coverage * 0.7) + (levScore * 0.3);
    finalScore *= (1 + product.nombre.length / 200);
    
    // Bono si el código exacto coincide con este producto
    if (product.codigo === exactCodeFound) finalScore *= 1.5;
    
    // CASO ESPECIAL: Si el código en la línea es casi igual al de este producto (ej: 4591 vs 4501)
    // le damos un bono si el nombre ya coincide bastante bien.
    for (const rawCode of codeMatches) {
      const code = rawCode.length === 5 ? rawCode.substring(1) : rawCode;
      if (levenshtein.get(code, product.codigo) <= 1 && coverage > 0.6) {
        finalScore *= 1.3;
      }
    }

    const threshold = product.nombre.length < 8 ? 0.85 : 0.60;
    
    if (finalScore > bestNameMatch.score && finalScore > threshold) {
      bestNameMatch = { codigo: product.codigo, score: finalScore };
    }
  }

  // Si encontramos un match por nombre muy fuerte, lo preferimos (resuelve 3508 vs 3608)
  if (bestNameMatch.score > 0.8) return bestNameMatch.codigo;
  
  // Si no, devolvemos el código exacto si lo hubo
  return exactCodeFound || (bestNameMatch.score > 0 ? bestNameMatch.codigo : null);
}

/**
 * Extrae cantidad del final de la línea con lógica de "Zona de Cantidad".
 * Resuelve la confusión entre 2/7 y letras O/T.
 */
export function extractCantidadRobust(line: string, codigoDetectado?: string | null): number | null {
  let text = line.trim().toUpperCase();

  if (codigoDetectado) {
    text = text.replace(codigoDetectado, "____");
  }

  const parts = text.split(/\s+/).filter(p => p.length > 0);
  if (parts.length === 0) return null;

  let lastPart = parts[parts.length - 1];

  // Si la última parte es basura de control pura, tomamos la anterior
  if (/^(PT|TT|EA|A|E|K|L)$/.test(lastPart) && parts.length > 1) {
    lastPart = parts[parts.length - 2];
  }

  const corrections: Record<string, string> = {
    'O': '2', 'Q': '0', 'T': '7', 'I': '1', 'L': '1', 'J': '1', 'Z': '2', 'S': '5', 'B': '8'
  };

  let candidate = lastPart;
  if (!/^\d+$/.test(candidate)) {
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

  const finalMatch = candidate.match(/(\d+)$/);
  if (finalMatch) {
    const qty = parseInt(finalMatch[1], 10);
    if (qty >= 0 && qty < 200) return qty;
  }

  // Si no se encontró número pero el match de producto fue exitoso y hay algo "basura" al final,
  // probablemente sea cantidad 1 que el OCR leyó mal.
  if (/^(L|E|A|J|I)$/.test(lastPart)) return 1;

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
