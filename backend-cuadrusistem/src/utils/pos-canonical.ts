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
    .replace(/\b447(\d)\b/g, '442$1') // Vital 1.5 y Bebida 1.5
    .replace(/\b091[IJL]\b/g, '0911') // CHUR MEXICANO
    .replace(/\b010[SI]\b/g, '0105'); // COM CHACARERO

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
  
  if (parts.length < 2) return 1;

  let lastPart = parts[parts.length - 1];

  // 1. Si la última parte termina en un número real (ej: "3", "25"), lo tomamos
  const matchNumber = lastPart.match(/(\d+)$/);
  if (matchNumber) {
    const qty = parseInt(matchNumber[1], 10);
    // Evitar confundir código con cantidad
    if (codigoDetectado && qty.toString() === codigoDetectado.toString()) return 1;
    return (qty > 0 && qty < 500) ? qty : 1;
  }

  // 2. Solo traducimos caracteres solitarios muy específicos si el OCR falló
  // pero la línea parece terminar ahí (ej: "|", "I", "L" suelen ser "1")
  const charToNumber: Record<string, number> = { 
    '|': 1, 'I': 1, 'L': 1, 'J': 1, 'S': 5, 'B': 8
  };
  
  if (lastPart.length === 1 && charToNumber[lastPart] !== undefined) {
    return charToNumber[lastPart];
  }

  // 3. En cualquier otro caso (como "PAPAS", "GIGANTE", etc.), asumimos 1
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
