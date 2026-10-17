import { IntegrityCheckItem } from '../types/career';

export function runCvIntegrityCheck(
  tailoredCvText: string,
  originalCvText: string
): IntegrityCheckItem[] {
  const unverified: IntegrityCheckItem[] = [];
  const lowerOriginal = originalCvText.toLowerCase();

  // 1. Currency amounts (e.g., $14.5M, $420M, €50K, £10M)
  const currencyMatches = tailoredCvText.match(/[$€£¥]\s*[\d,]+(?:\.\d+)?\s*(?:[KkMmBb]|(?:million|billion|thousand))?/g) || [];
  for (const match of currencyMatches) {
    const clean = match.trim().toLowerCase();
    // Only check if it's not a generic placeholder
    if (!lowerOriginal.includes(clean) && !clean.includes('xx') && !clean.includes('00')) {
      if (!unverified.some((u) => u.term === match.trim())) {
        unverified.push({
          term: match.trim(),
          category: 'Currency',
          contextSnippet: `Currency figure "${match.trim()}" not found in original CV text.`,
        });
      }
    }
  }

  // 2. Percentages (e.g., 2.4%, 77%, 99.995%)
  const percentageMatches = tailoredCvText.match(/[\d.]+\s*%/g) || [];
  for (const match of percentageMatches) {
    const clean = match.trim().toLowerCase();
    if (!lowerOriginal.includes(clean)) {
      if (!unverified.some((u) => u.term === match.trim())) {
        unverified.push({
          term: match.trim(),
          category: 'Percentage',
          contextSnippet: `Percentage "${match.trim()}" not explicitly stated in original CV.`,
        });
      }
    }
  }

  // 3. Significant standalone numbers (e.g., 8,500, 48 minutes, 14-person)
  const metricNumberMatches = tailoredCvText.match(/\b\d{1,3}(?:,\d{3})+\b|\b\d+(?:\.\d+)?\s*(?:hours|minutes|mins|days|weeks|engineers|people|clients|users|merchants|deals|projects)\b/gi) || [];
  for (const match of metricNumberMatches) {
    const clean = match.trim().toLowerCase();
    if (!lowerOriginal.includes(clean)) {
      if (!unverified.some((u) => u.term === match.trim())) {
        unverified.push({
          term: match.trim(),
          category: 'Number / Metric',
          contextSnippet: `Metric "${match.trim()}" does not appear verbatim in original CV.`,
        });
      }
    }
  }

  return unverified.slice(0, 8); // Top items for clarity
}
