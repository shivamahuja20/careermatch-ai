// Helpers for grounded research: turning Google Search grounding results into real,
// dated sources, and marking which sentences each source supports.

export interface ResolvedSource {
  id: number;
  title: string;
  publisher: string;
  url: string;
  domain: string;
  publicationDate: string; // e.g. "14 Oct 2026", or NOT_SHOWN
  publicationDateIso: string; // e.g. "2026-10-14", or ''
  retrievedDate: string;
}

export const NOT_SHOWN = 'Not shown on the page';

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

export function formatDate(d: Date): string {
  return `${d.getUTCDate()} ${MONTHS[d.getUTCMonth()]} ${d.getUTCFullYear()}`;
}

function decodeEntities(s: string): string {
  return s
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&#39;|&#x27;|&apos;/g, "'")
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&nbsp;/g, ' ')
    .replace(/&#(\d+);/g, (_, n) => String.fromCharCode(Number(n)))
    .replace(/\s+/g, ' ')
    .trim();
}

function metaContent(html: string, keys: string[]): string {
  for (const key of keys) {
    const k = key.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const a = new RegExp(`<meta[^>]+(?:property|name|itemprop)=["']${k}["'][^>]*content=["']([^"']+)["']`, 'i').exec(html);
    if (a) return decodeEntities(a[1]);
    const b = new RegExp(`<meta[^>]+content=["']([^"']+)["'][^>]*(?:property|name|itemprop)=["']${k}["']`, 'i').exec(html);
    if (b) return decodeEntities(b[1]);
  }
  return '';
}

/** Parses a date string and rejects anything implausible (before 1995 or in the future). */
export function parseDate(raw: string, now = new Date()): Date | null {
  if (!raw) return null;
  const s = raw.trim();
  let d: Date | null = null;
  if (/^\d{8}$/.test(s)) d = new Date(`${s.slice(0, 4)}-${s.slice(4, 6)}-${s.slice(6, 8)}T00:00:00Z`);
  else if (/^\d{4}-\d{2}-\d{2}/.test(s)) d = new Date(s.length === 10 ? `${s}T00:00:00Z` : s);
  else {
    const t = Date.parse(s);
    if (!Number.isNaN(t)) d = new Date(t);
  }
  if (!d || Number.isNaN(d.getTime())) return null;
  const tomorrow = now.getTime() + 36 * 3600 * 1000;
  if (d.getUTCFullYear() < 1995 || d.getTime() > tomorrow) return null;
  return d;
}

/** Finds the publication date an article states about itself, from standard page metadata. */
export function extractPublishedDate(html: string, now = new Date()): Date | null {
  const candidates: string[] = [];
  const fromMeta = metaContent(html, [
    'article:published_time',
    'og:article:published_time',
    'datePublished',
    'publish-date',
    'publish_date',
    'publishdate',
    'pubdate',
    'parsely-pub-date',
    'sailthru.date',
    'dc.date',
    'DC.date.issued',
    'dcterms.created',
    'date',
    'article.published',
  ]);
  if (fromMeta) candidates.push(fromMeta);

  // JSON-LD: "datePublished": "..."
  const ld = /"datePublished"\s*:\s*"([^"]+)"/i.exec(html);
  if (ld) candidates.push(ld[1]);

  // <time datetime="..." ...> near an article header
  const time = /<time[^>]+datetime=["']([^"']+)["']/i.exec(html);
  if (time) candidates.push(time[1]);

  for (const c of candidates) {
    const d = parseDate(c, now);
    if (d) return d;
  }
  return null;
}

export function extractTitle(html: string): string {
  const og = metaContent(html, ['og:title', 'twitter:title']);
  if (og) return og;
  const t = /<title[^>]*>([\s\S]*?)<\/title>/i.exec(html);
  return t ? decodeEntities(t[1]) : '';
}

export function extractSiteName(html: string): string {
  return metaContent(html, ['og:site_name', 'application-name', 'publisher']);
}

function isSafePublicUrl(raw: string): boolean {
  try {
    const u = new URL(raw);
    if (u.protocol !== 'https:') return false;
    const h = u.hostname;
    if (h === 'localhost' || h.endsWith('.local') || h.endsWith('.internal')) return false;
    if (/^\d+\.\d+\.\d+\.\d+$/.test(h) || h.includes(':')) return false; // IP literals
    return true;
  } catch {
    return false;
  }
}

/**
 * Follows a grounding redirect link to the real article, then reads the article's own
 * title, publisher and publication date. Never invents a date: if the page does not
 * state one, the date is NOT_SHOWN.
 */
export async function resolveSource(
  id: number,
  groundingUri: string,
  groundingTitle: string,
  now = new Date(),
  timeoutMs = 8000
): Promise<ResolvedSource> {
  const fallbackDomain = (groundingTitle || '').replace(/^www\./, '');
  const base: ResolvedSource = {
    id,
    title: groundingTitle || fallbackDomain || 'Source',
    publisher: fallbackDomain,
    url: groundingUri,
    domain: fallbackDomain,
    publicationDate: NOT_SHOWN,
    publicationDateIso: '',
    retrievedDate: formatDate(now),
  };
  if (!isSafePublicUrl(groundingUri)) return base;

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const res = await fetch(groundingUri, {
      redirect: 'follow',
      signal: controller.signal,
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; CareerMatchAI/1.0; research citation check)',
        Accept: 'text/html,application/xhtml+xml',
      },
    });
    const finalUrl = res.url && isSafePublicUrl(res.url) ? res.url : groundingUri;
    const domain = new URL(finalUrl).hostname.replace(/^www\./, '');
    const out: ResolvedSource = { ...base, url: finalUrl, domain, publisher: domain };
    const type = res.headers.get('content-type') || '';
    if (!res.ok || !type.includes('html') || !res.body) return out;

    // Read at most ~600 KB; metadata lives in the <head>.
    const reader = res.body.getReader();
    const chunks: Uint8Array[] = [];
    let total = 0;
    while (total < 600_000) {
      const { done, value } = await reader.read();
      if (done || !value) break;
      chunks.push(value);
      total += value.length;
    }
    reader.cancel().catch(() => {});
    const html = Buffer.concat(chunks.map((c) => Buffer.from(c))).toString('utf8');

    const title = extractTitle(html);
    const site = extractSiteName(html);
    const date = extractPublishedDate(html, now);
    return {
      ...out,
      title: title || out.title,
      publisher: site || domain,
      publicationDate: date ? formatDate(date) : NOT_SHOWN,
      publicationDateIso: date ? date.toISOString().slice(0, 10) : '',
    };
  } catch {
    return base;
  } finally {
    clearTimeout(timer);
  }
}

export interface GroundingSupportLike {
  segment?: { text?: string };
  groundingChunkIndices?: number[];
}

/**
 * Adds [n] markers after each sentence that Google's grounding says is supported by
 * source n. chunkToSourceId maps grounding chunk index to our source number.
 */
export function addCitationMarkers(
  text: string,
  supports: GroundingSupportLike[],
  chunkToSourceId: Map<number, number>
): string {
  let out = text;
  for (const s of supports) {
    const seg = s.segment?.text;
    if (!seg) continue;
    const ids = Array.from(
      new Set((s.groundingChunkIndices || []).map((i) => chunkToSourceId.get(i)).filter((x): x is number => !!x))
    ).sort((a, b) => a - b);
    if (!ids.length) continue;
    const pos = out.indexOf(seg);
    if (pos === -1) continue;
    const marker = ids.map((i) => `[${i}]`).join('');
    const end = pos + seg.length;
    if (out.slice(end, end + marker.length) === marker) continue;
    out = out.slice(0, end) + ' ' + marker + out.slice(end);
  }
  return out;
}

/** Keeps only source numbers that really exist. */
export function validIds(ids: unknown, valid: Set<number>): number[] {
  if (!Array.isArray(ids)) return [];
  return Array.from(new Set(ids.map((x) => Number(x)).filter((x) => valid.has(x))));
}

export const FREE_TIER_RESEARCH_MESSAGE =
  'Live company and industry research needs a paid Gemini API key. Google Search grounding is not available on the free tier. ' +
  'Every other section works on a free key. To turn research on, enable billing for this key in Google AI Studio, then click "Retry this step".';

export const SEARCH_QUOTA_MESSAGE =
  'Live company and industry research could not run because Google refused the search request with a quota error. ' +
  'This almost always means the Gemini API key is on the free tier, where Google Search grounding is not included. ' +
  'Every other section works on a free key. To turn research on, enable billing for this key in Google AI Studio, then click "Retry this step". ' +
  'If billing is already on, wait a minute and retry.';

/**
 * True when the search call failed with a quota error (429 / RESOURCE_EXHAUSTED). On a free-tier key
 * Google reports the missing search allowance this way, using the same wording as an ordinary rate limit,
 * so the message shown to the user covers both cases.
 */
export function isSearchQuotaError(error: any): boolean {
  const msg = `${error?.message || ''} ${error?.status || ''} ${JSON.stringify(error?.error || '')}`;
  return Number(error?.status) === 429 || /RESOURCE_EXHAUSTED|exceeded your current quota|"code":\s*429/i.test(msg);
}

/**
 * True when Gemini refused the Google Search tool, which is what happens on a free-tier key
 * (or a key whose project has no billing). Gemini reports this as a 400, 403 or 429 error that
 * mentions search grounding, the tool, billing or a failed precondition.
 */
export function isGroundingUnavailable(error: any): boolean {
  const msg = `${error?.message || ''} ${error?.status || ''} ${JSON.stringify(error?.error || '')}`;
  const mentionsSearch = /google.?search|grounding|search tool|tools?\b.*(not supported|not available|not enabled)/i.test(msg);
  const mentionsBilling = /billing|paid tier|free tier|FAILED_PRECONDITION|not available on the free/i.test(msg);
  return mentionsSearch || (mentionsBilling && /tool|search|ground/i.test(msg)) || /FAILED_PRECONDITION.*(tool|search)/i.test(msg);
}
