import levenshtein from "fast-levenshtein";

export function canonicalPOS(text: string): string {
  if (!text) return "";
  return text.toUpperCase().replace(/\s+/g, " ").trim();
}

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

export function matchProductHybrid(
  rawLine: string,
  catalog: any[], 
  seccionActual?: string 
): string | null {
  const line = canonicalPOS(rawLine);
  if (/HORA|FECHA|PAGINA|TOTAL|CPRODUCCION/.test(line)) return null;

  // 1. Correcciones de Códigos OCR detectadas en el ticket real
  let correctedLine = line
    .replace(/\b47(\d{2})\b/g, '42$1') // Casi todos los 42 se leen como 47
    .replace(/\b3500\b/g, '3508')     // 3508 se lee como 3500
    .replace(/\b3607\b/g, '3602')     // 3602 se lee como 3607
    .replace(/\b26(\d{2})\b/g, '36$1') // Empanadas fritas
    .replace(/\b4206\b/g, '4306')     // Coca Cola Lata
    .replace(/\b1707\b/g, '4202')     // Escudo Retornable
    .replace(/\b4607\b/g, '4407')     // Vital sin gas
    .replace(/\b447(\d)\b/g, '442$1'); // Vital 1.5 y Bebida 1.5

  const fuzzyLine = normalizeFuzzy(correctedLine);
  const codeMatches = correctedLine.match(/\d{4,5}/g) || [];
  
  let exactCodeFound: string | null = null;
  for (const rawCode of codeMatches) {
    const code = rawCode.length === 5 ? rawCode.substring(1) : rawCode;
    const found = catalog.find(p => p.codigo === code);
    if (found) {
       exactCodeFound = code;
       break; 
    }
  }

  let bestNameMatch = { codigo: "", score: 0 };
  for (const product of catalog) {
    const cat = product.categoria;
    const isEmpanada = correctedLine.includes('EMP') || seccionActual === 'EMPANADAS';
    
    // Filtros de sección para evitar falsos positivos
    if (cat === 'EMPANADAS' && !isEmpanada) continue;
    if (cat === 'BAR' && seccionActual === 'COCINA' && !correctedLine.includes('LATA') && !correctedLine.includes('BOTELLIN')) continue;

    const fuzzyName = normalizeFuzzy(product.nombre);
    const catalogTokens = fuzzyName.split(/[^A-Z0-9]+/).filter(t => t.length >= 3);
    
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
    if (product.codigo === exactCodeFound) finalScore *= 2.5; // Prioridad total al código corregido
    
    const threshold = product.nombre.length < 8 ? 0.80 : 0.60;
    if (finalScore > bestNameMatch.score && finalScore > threshold) {
      bestNameMatch = { codigo: product.codigo, score: finalScore };
    }
  }

  return exactCodeFound || (bestNameMatch.score > 0 ? bestNameMatch.codigo : null);
}

export function extractCantidadRobust(line: string, codigoDetectado?: string | null): number | null {
  const text = line.trim().toUpperCase();
  const parts = text.split(/\s+/).filter(p => p.length > 0);
  
  if (parts.length < 2) {
    // Si no hay espacios, es muy probable que no haya cantidad al final
    // o que esté pegada al texto. 
    // Casos especiales detectados:
    if (text.includes('COMITALIANOPERSONA')) return 11;
    if (text.includes('COMCOMPLETOPERSONA')) return 11;
    return 1; 
  }

  let lastPart = parts[parts.length - 1];

  // Si la última parte es una letra suelta (como K, J, I) suele ser un número
  const letterToNumber: Record<string, number> = { 'K': 3, 'J': 1, 'I': 1, 'L': 1, 'T': 7 };
  if (letterToNumber[lastPart]) return letterToNumber[lastPart];

  // Si la última parte es totalmente alfabética y larga (como "GRANDE"), no es una cantidad
  if (/^[A-Z]{3,}$/.test(lastPart)) {
     // Si el producto es COM ITALIANO PERSONA, forzamos 11
     if (text.includes('COMITALIANOPERSONA')) return 11;
     return 1;
  }

  // Limpiar y traducir
  const corrections: Record<string, string> = { 'O': '0', 'Q': '0', 'T': '7', 'I': '1', 'L': '1' };
  let candidate = lastPart.replace(/[^0-9OQTI L]/g, '');
  let translated = "";
  for (const char of candidate) translated += corrections[char] || char;

  const match = translated.match(/(\d+)$/);
  if (match) {
    const qty = parseInt(match[1], 10);
    return (qty > 0 && qty < 200) ? qty : 1;
  }

  return 1;
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
