// Server-side document readers. Text is extracted locally, so contact details can be
// redacted before anything is sent to Gemini. Only scanned PDFs (no text layer) need Gemini.
import mammoth from 'mammoth';
import WordExtractor from 'word-extractor';
import { extractText, getDocumentProxy } from 'unpdf';

export type DocKind = 'pdf' | 'docx' | 'doc' | 'txt' | 'unsupported';

export function detectKind(fileName: string, mimeType: string): DocKind {
  const name = (fileName || '').toLowerCase();
  const mime = (mimeType || '').toLowerCase();
  if (name.endsWith('.pdf') || mime === 'application/pdf') return 'pdf';
  if (name.endsWith('.docx') || mime.includes('wordprocessingml')) return 'docx';
  if (name.endsWith('.doc') || mime === 'application/msword') return 'doc';
  if (name.endsWith('.txt') || mime.startsWith('text/plain')) return 'txt';
  return 'unsupported';
}

const isOle = (b: Buffer) => b.length > 8 && b.readUInt32BE(0) === 0xd0cf11e0;
const isZip = (b: Buffer) => b.length > 4 && b.readUInt32BE(0) === 0x504b0304;
const isPdf = (b: Buffer) => b.length > 4 && b.subarray(0, 5).toString('latin1') === '%PDF-';
const isRtf = (b: Buffer) => b.length > 5 && b.subarray(0, 5).toString('latin1') === '{\\rtf';

export class DocumentReadError extends Error {}

const RTF_SKIP = new Set([
  'fonttbl', 'colortbl', 'stylesheet', 'info', 'listtable', 'listoverridetable', 'rsidtbl',
  'generator', 'pict', 'themedata', 'colorschememapping', 'latentstyles', 'datastore', 'xmlnstbl',
  'header', 'footer', 'headerl', 'headerr', 'footerl', 'footerr', 'object', 'fldinst',
]);

/** Small RTF to text conversion, for ".doc" files that are really RTF. */
export function rtfToText(rtf: string): string {
  let out = '';
  let i = 0;
  const skipStack: boolean[] = [false];
  let groupStart = false;
  while (i < rtf.length) {
    const ch = rtf[i];
    const skipping = skipStack[skipStack.length - 1];
    if (ch === '{') {
      skipStack.push(skipping);
      groupStart = true;
      i++;
      continue;
    }
    if (ch === '}') {
      if (skipStack.length > 1) skipStack.pop();
      groupStart = false;
      i++;
      continue;
    }
    if (ch === '\\') {
      const next = rtf[i + 1];
      if (next === '*') {
        skipStack[skipStack.length - 1] = true; // ignorable destination
        i += 2;
        continue;
      }
      if (next === "'") {
        if (!skipping) out += String.fromCharCode(parseInt(rtf.substr(i + 2, 2), 16));
        i += 4;
        groupStart = false;
        continue;
      }
      if (next === '\\' || next === '{' || next === '}') {
        if (!skipping) out += next;
        i += 2;
        groupStart = false;
        continue;
      }
      const m = /^\\([a-z]+)(-?\d+)? ?/i.exec(rtf.slice(i, i + 40));
      if (m) {
        const word = m[1];
        if (groupStart && RTF_SKIP.has(word)) skipStack[skipStack.length - 1] = true;
        if (!skipStack[skipStack.length - 1]) {
          if (word === 'par' || word === 'line' || word === 'sect') out += '\n';
          else if (word === 'tab' || word === 'cell') out += '\t';
          else if (word === 'row') out += '\n';
          else if (word === 'u' && m[2]) {
            const code = parseInt(m[2], 10);
            out += String.fromCharCode(code < 0 ? code + 65536 : code);
            if (rtf[i + m[0].length] === '?') i++;
          }
        }
        i += m[0].length;
        groupStart = false;
        continue;
      }
      i += 2;
      continue;
    }
    if (ch !== '\r' && ch !== '\n' && !skipping) out += ch;
    groupStart = false;
    i++;
  }
  return out.replace(/[ \t]+\n/g, '\n').replace(/\n{3,}/g, '\n\n').trim();
}

export async function readDocx(buffer: Buffer): Promise<string> {
  if (!isZip(buffer)) {
    if (isOle(buffer)) return readDoc(buffer); // an old .doc renamed to .docx
    throw new DocumentReadError('This file is not a valid DOCX document. Please re-save it or paste the text.');
  }
  const result = await mammoth.extractRawText({ buffer });
  return result.value || '';
}

export async function readDoc(buffer: Buffer): Promise<string> {
  if (isZip(buffer)) return readDocx(buffer); // a .docx renamed to .doc
  if (isRtf(buffer)) return rtfToText(buffer.toString('latin1'));
  if (!isOle(buffer)) {
    throw new DocumentReadError('This .doc file could not be read. Please save it as DOCX or PDF, or paste the text.');
  }
  const doc = await new WordExtractor().extract(buffer);
  return [doc.getHeaders({ includeFooters: false }), doc.getBody(), doc.getFootnotes()]
    .filter((part) => part && part.trim())
    .join('\n\n');
}

/** Returns the PDF's text layer. An empty string means the PDF is probably a scan. */
export async function readPdfTextLayer(buffer: Buffer): Promise<string> {
  if (!isPdf(buffer)) {
    throw new DocumentReadError('This file is not a valid PDF. Please re-save it or paste the text.');
  }
  try {
    const pdf = await getDocumentProxy(new Uint8Array(buffer));
    const { text } = await extractText(pdf, { mergePages: false });
    const pages = Array.isArray(text) ? text : [text];
    return pages.map((p) => p.replace(/[ \t]+/g, ' ').trim()).join('\n\n').trim();
  } catch (err: any) {
    if (/password/i.test(err?.message || '')) {
      throw new DocumentReadError('This PDF is password protected. Remove the password or paste the text.');
    }
    throw new DocumentReadError('This PDF could not be read. It may be damaged. Please re-save it or paste the text.');
  }
}

export function readTxt(buffer: Buffer): string {
  if (buffer.length >= 2 && buffer[0] === 0xff && buffer[1] === 0xfe) return buffer.subarray(2).toString('utf16le');
  return buffer.toString('utf8').replace(/^﻿/, '');
}

/** Rough check that extracted text is real words, not binary noise. */
export function looksLikeText(text: string): boolean {
  const t = text.trim();
  if (t.length < 40) return false;
  const letters = (t.match(/[A-Za-z]/g) || []).length;
  return letters / t.length > 0.4;
}
