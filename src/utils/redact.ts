// Removes contact details from CV text before it is sent to Gemini.
// Works for Indian, US, UK and most international phone formats.

const EMAIL = /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}\b/g;

// A run of digits with optional +country code, brackets, spaces, dots or hyphens.
// The replacer only redacts runs containing 10 to 13 digits, so years ("2018 - 2022"),
// ranges ("20-25") and counts ("850+") are left alone.
const PHONE_CANDIDATE = /(?:\+\s?\d{1,3}[\s.-]?)?(?:\(\d{1,5}\)[\s.-]?)?\d(?:[\s.-]?\d){6,14}/g;

const PROFILE_LINKS =
  /(?:https?:\/\/)?(?:www\.)?(?:linkedin\.com\/in\/|github\.com\/|gitlab\.com\/|behance\.net\/|medium\.com\/@|twitter\.com\/|x\.com\/)[^\s,|)]+/gi;

const STREET_ADDRESS =
  /\b\d+[A-Za-z]?[,\s]+[A-Za-z0-9\s,.'-]{2,40}?\b(?:Street|St|Avenue|Ave|Road|Rd|Marg|Nagar|Boulevard|Blvd|Lane|Ln|Drive|Dr|Court|Ct|Way|Suite|Apt|Flat|Sector|Colony|Society)\b\.?/gi;

// Indian PIN code (6 digits, optionally "400 058") or US ZIP+4, used to spot an address line in the CV header.
const POSTCODE = /\b(?:\d{3}\s?\d{3}|\d{5}-\d{4})\b/;

function redactPhones(text: string): string {
  return text.replace(PHONE_CANDIDATE, (match) => {
    const digits = match.replace(/\D/g, '');
    if (digits.length < 10 || digits.length > 13) return match;
    // Two four-digit years separated by a dash or space look like a date range, not a phone.
    if (/^\s*(19|20)\d{2}\s*[-–]?\s*(19|20)\d{2}\s*$/.test(match)) return match;
    return '[PHONE]';
  });
}

/**
 * Guesses the candidate's name from the top of the CV: the first short line made only of
 * letters, spaces, dots, hyphens or apostrophes (2 to 4 words). Returns '' if unsure.
 */
export function detectCandidateName(cvText: string): string {
  const lines = cvText
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter(Boolean)
    .slice(0, 5);
  const skip = /^(curriculum vitae|resume|résumé|cv|profile|summary|contact)$/i;
  for (const line of lines) {
    if (skip.test(line)) continue;
    const words = line.split(/\s+/);
    if (words.length >= 2 && words.length <= 4 && /^[A-Za-z][A-Za-z.' -]+$/.test(line) && line.length <= 40) {
      return line.replace(/\s+/g, ' ');
    }
  }
  return '';
}

function escapeRegExp(s: string): string {
  return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

export function redactCandidatePii(cvText: string): string {
  let redacted = cvText.replace(EMAIL, '[EMAIL]');
  redacted = redacted.replace(PROFILE_LINKS, '[LINK]');
  redacted = redactPhones(redacted);
  redacted = redacted.replace(STREET_ADDRESS, '[ADDRESS]');

  // Address lines in the CV header (first 8 lines) that contain a postcode.
  const lines = redacted.split(/\r?\n/);
  for (let i = 0; i < Math.min(8, lines.length); i++) {
    if (POSTCODE.test(lines[i]) && /,/.test(lines[i]) && !/\b(19|20)\d{2}\b/.test(lines[i])) {
      lines[i] = '[ADDRESS]';
    }
  }
  redacted = lines.join('\n');

  // Replace the candidate's own name, so it is not sent to the AI.
  const name = detectCandidateName(cvText);
  if (name) {
    const parts = name.split(' ').filter((p) => p.length > 1);
    redacted = redacted.replace(new RegExp(escapeRegExp(name), 'gi'), '[Candidate name]');
    // Also catch the name written as "Lastname, Firstname" or in a different case.
    if (parts.length >= 2) {
      const reversed = `${parts[parts.length - 1]},?\\s+${parts[0]}`;
      redacted = redacted.replace(new RegExp(reversed, 'gi'), '[Candidate name]');
    }
  }

  return redacted;
}
