// Date helpers: find dates written the ways Japanese city-hall letters write them,
// and turn them into plain calendar dates.

const ERAS = { '令和': 2018, '平成': 1988, '昭和': 1925 };
const ERA_ABBR = { R: '令和', H: '平成', S: '昭和' };

// Full-width digits and a few look-alike characters -> ASCII.
export function normalize(text) {
  return text
    .replace(/[０-９]/g, (c) => String.fromCharCode(c.charCodeAt(0) - 0xfee0))
    .replace(/[Ａ-Ｚａ-ｚ]/g, (c) => String.fromCharCode(c.charCodeAt(0) - 0xfee0))
    .replace(/[，]/g, ',')
    .replace(/[．]/g, '.')
    .replace(/[－−‐―]/g, '-')
    .replace(/[（]/g, '(')
    .replace(/[）]/g, ')')
    .replace(/[：]/g, ':')
    .replace(/[￥]/g, '¥')
    .replace(/\u3000/g, ' ')
    .replace(/元年/g, '1年');
}

function valid(y, m, d) {
  const dt = new Date(Date.UTC(y, m - 1, d));
  return dt.getUTCFullYear() === y && dt.getUTCMonth() === m - 1 && dt.getUTCDate() === d;
}

function iso(y, m, d) {
  return `${y}-${String(m).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
}

// Returns [{ iso, index, length, raw }] in text order. `refYear` fills in dates
// written without a year (e.g. "10月31日(金)").
export function findDates(text, refYear) {
  const t = normalize(text);
  const out = [];
  const taken = [];
  const push = (m, y, mo, d) => {
    if (!valid(y, mo, d)) return;
    const start = m.index;
    const end = m.index + m[0].length;
    if (taken.some(([a, b]) => start < b && end > a)) return;
    taken.push([start, end]);
    out.push({ iso: iso(y, mo, d), index: start, length: m[0].length, raw: m[0] });
  };

  // 令和8年10月31日 / 平成31年4月1日
  for (const m of t.matchAll(/(令和|平成|昭和)\s*(\d{1,2})\s*年\s*(\d{1,2})\s*月\s*(\d{1,2})\s*日/g)) {
    push(m, ERAS[m[1]] + Number(m[2]), Number(m[3]), Number(m[4]));
  }
  // R8.10.31 / R8/10/31
  for (const m of t.matchAll(/\b([RHS])\s*(\d{1,2})[./](\d{1,2})[./](\d{1,2})\b/g)) {
    push(m, ERAS[ERA_ABBR[m[1]]] + Number(m[2]), Number(m[3]), Number(m[4]));
  }
  // 2026年10月31日
  for (const m of t.matchAll(/(20\d{2}|19\d{2})\s*年\s*(\d{1,2})\s*月\s*(\d{1,2})\s*日/g)) {
    push(m, Number(m[1]), Number(m[2]), Number(m[3]));
  }
  // 2026/10/31 or 2026-10-31 or 2026.10.31
  for (const m of t.matchAll(/\b(20\d{2})[./-](\d{1,2})[./-](\d{1,2})\b/g)) {
    push(m, Number(m[1]), Number(m[2]), Number(m[3]));
  }
  // 10月31日 (no year): use refYear
  if (refYear) {
    for (const m of t.matchAll(/(\d{1,2})\s*月\s*(\d{1,2})\s*日/g)) {
      push(m, refYear, Number(m[1]), Number(m[2]));
    }
  }
  return out.sort((a, b) => a.index - b.index);
}

// Year of the first fully written date, used as the year for "10月31日" style dates.
export function guessYear(text) {
  const first = findDates(text, null)[0];
  return first ? Number(first.iso.slice(0, 4)) : null;
}

export function daysBetween(fromIso, toIso) {
  const a = Date.UTC(...fromIso.split('-').map((n, i) => (i === 1 ? Number(n) - 1 : Number(n))));
  const b = Date.UTC(...toIso.split('-').map((n, i) => (i === 1 ? Number(n) - 1 : Number(n))));
  return Math.round((b - a) / 86400000);
}
