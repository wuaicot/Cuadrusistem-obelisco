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
