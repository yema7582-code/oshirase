// Turns the text of a Japanese official letter into: what kind of letter it is,
// the deadline, the amount, what to bring, who to call, and a plain to-do.
// Everything here is plain rules, so it runs offline and nothing leaves the device.
import { normalize, findDates, guessYear, daysBetween } from './dates.js';
import { findTerms } from './glossary.js';

// Order matters: the first rule whose keywords match wins.
export const LETTER_TYPES = [
  { id: 'overdue', keys: ['督促状', '催告書', '差押', '滞納'], urgent: true,
    en: 'Reminder: a payment is overdue', zh: '催缴：有一笔款项已逾期' },
  { id: 'residence', keys: ['在留期間', '在留カード', '出入国在留管理'],
    en: 'Residence card / period of stay', zh: '在留卡／在留期间' },
  { id: 'mynumber', keys: ['マイナンバーカード', '個人番号カード', '交付通知書'],
    en: 'My Number card', zh: '个人编号卡（My Number卡）' },
  { id: 'pension', keys: ['国民年金', '年金機構', '年金事務所'],
    en: 'National Pension', zh: '国民年金' },
  { id: 'nhi', keys: ['国民健康保険'],
    en: 'National Health Insurance', zh: '国民健康保险' },
  { id: 'residenttax', keys: ['住民税', '市県民税', '市民税', '府民税', '都民税', '道民税'],
    en: 'Resident tax', zh: '居民税' },
  { id: 'propertytax', keys: ['固定資産税'], en: 'Property tax', zh: '固定资产税' },
  { id: 'cartax', keys: ['軽自動車税'], en: 'Light-vehicle tax', zh: '轻型汽车税' },
  { id: 'childallowance', keys: ['児童手当', '現況届'], en: 'Child allowance', zh: '儿童补贴' },
  { id: 'checkup', keys: ['特定健診', '健康診断', 'がん検診', '受診券'], en: 'Health check-up', zh: '健康检查' },
  { id: 'vaccine', keys: ['予防接種', 'ワクチン'], en: 'Vaccination', zh: '预防接种' },
];

const DEADLINE_WORDS = ['納期限', '納付期限', '提出期限', '申請期限', '有効期限', '期限', 'まで', '締切', '迄'];
const PAY_WORDS = ['納付', '納税', '納め', '支払', '振込', '保険料', '税額', '金額', '請求'];
const SUBMIT_WORDS = ['提出', '返送', '申請', '届出', 'ご返信', '送付してください'];
const VISIT_WORDS = ['来庁', 'お越し', '窓口', '受け取り', '受取', '受診', '予約'];

// Score each type: keywords in the title area (first two lines) count most,
// because a bring list can mention 在留カード in a letter about something else.
// An overdue notice always wins, since that is the thing you must not miss.
export function detectType(text) {
  const head = text.trim().split(/\n/).slice(0, 2).join('\n');
  let best = null;
  let bestScore = 0;
  for (const t of LETTER_TYPES) {
    let score = 0;
    for (const k of t.keys) {
      const n = text.split(k).length - 1;
      if (n) score += n + (head.includes(k) ? 10 : 0);
    }
    if (t.urgent && score) return t;
    if (score > bestScore) { best = t; bestScore = score; }
  }
  return best || { id: 'other', en: 'Official letter', zh: '官方信件' };
}

// Amounts like 12,300円 / ¥12,300 / 金額 12300円. Biggest one near a pay word wins.
export function findAmounts(text) {
  const out = [];
  for (const m of text.matchAll(/¥\s*([\d,]{1,12})|([\d,]{1,12})\s*円/g)) {
    const n = Number((m[1] || m[2]).replace(/,/g, ''));
    if (!Number.isFinite(n) || n <= 0) continue;
    out.push({ yen: n, index: m.index, length: m[0].length, raw: m[0] });
  }
  return out;
}

export function findPhones(text) {
  const out = [];
  for (const m of text.matchAll(/(?:0\d{1,4}-\d{1,4}-\d{3,4}|0120-\d{2,3}-\d{3,4}|0570-\d{3}-\d{3})/g)) {
    out.push({ phone: m[0], index: m.index });
  }
  return out;
}

// Lines that say what to bring: after 持ち物 / 持参 / お持ちください.
export function findBringList(text) {
  const items = [];
  const lines = text.split(/\n/);
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    if (/持ち物|持参|お持ちください|必要なもの|必要書類/.test(line)) {
      const after = line.split(/[:：]/).slice(1).join(':');
      const chunk = [after];
      // Following bullet lines (・ / - / ① etc.) belong to the same list.
      for (let j = i + 1; j < lines.length && /^\s*(・|-|\*|[①-⑩]|\(\d\)|\d\.)/.test(lines[j]); j++) {
        chunk.push(lines[j]);
      }
      for (const part of splitOutsideParens(chunk.join('、'))) {
        const s = part
          .replace(/^\s*(-|\*|\d\.)\s*/, '')
          .replace(/(を)?(必ず)?(ご)?(持参|お持ち)(して)?(ください|下さい)。?$/, '')
          .trim();
        if (s && s.length <= 40 && !items.includes(s)) items.push(s);
      }
    }
  }
  return items;
}

// Split a list on 、 ・ , and line breaks, but not inside （…）.
function splitOutsideParens(str) {
  const parts = [];
  let cur = '';
  let depth = 0;
  for (const ch of str) {
    if (ch === '(') depth++;
    if (ch === ')') depth = Math.max(0, depth - 1);
    if (depth === 0 && /[、,・\n①②③④⑤⑥⑦⑧⑨⑩]/.test(ch)) { parts.push(cur); cur = ''; continue; }
    cur += ch;
  }
  parts.push(cur);
  return parts;
}

function nearby(text, index, words, before = 25, after = 25) {
  const s = text.slice(Math.max(0, index - before), index + after);
  return words.some((w) => s.includes(w));
}

// Which counter / section to contact: lines with 課 or 係 near 問い合わせ.
export function findOffice(text) {
  const m = text.match(/(?:問い合わせ|問合せ|お問合せ|連絡先)[^\n]*\n?([^\n]*)/);
  const scope = m ? m[0] : text;
  const office = scope.match(/[\p{Script=Han}ァ-ヶー]{2,20}(?:課|係|事務所|管理局|センター)/u);
  return office ? office[0] : null;
}

export function analyze(rawText, todayIso) {
  const text = normalize(rawText);
  const type = detectType(text);
  const year = guessYear(text) || Number(todayIso.slice(0, 4));
  const dates = findDates(text, year);
  const amounts = findAmounts(text);
  const phones = findPhones(text);
  const bring = findBringList(text);
  const terms = findTerms(text);
  const office = findOffice(text);

  // The deadline is the date that sits next to a deadline word; if several, the earliest
  // one that has not passed yet, otherwise the latest one.
  const candidates = dates.filter((d) => nearby(text, d.index, DEADLINE_WORDS, 12, d.length + 12));
  let deadline = null;
  if (candidates.length) {
    const future = candidates.filter((d) => d.iso >= todayIso).sort((a, b) => a.iso.localeCompare(b.iso));
    deadline = future[0] || [...candidates].sort((a, b) => b.iso.localeCompare(a.iso))[0];
  }

  // Amount to pay: prefer one close to a pay word, else the biggest.
  let amount = null;
  const payAmounts = amounts.filter((a) => nearby(text, a.index, PAY_WORDS, 30, 5));
  const pool = payAmounts.length ? payAmounts : amounts;
  if (pool.length) amount = pool.reduce((a, b) => (b.yen > a.yen ? b : a));

  let action = 'read';
  if (amount && PAY_WORDS.some((w) => text.includes(w))) action = 'pay';
  else if (SUBMIT_WORDS.some((w) => text.includes(w))) action = 'submit';
  else if (VISIT_WORDS.some((w) => text.includes(w))) action = 'visit';
  if (type.id === 'residence') action = 'renew';

  const daysLeft = deadline ? daysBetween(todayIso, deadline.iso) : null;
  return {
    text,
    type,
    urgent: Boolean(type.urgent) || (daysLeft !== null && daysLeft >= 0 && daysLeft <= 7),
    overdue: daysLeft !== null && daysLeft < 0,
    action,
    deadline: deadline ? { ...deadline, daysLeft } : null,
    amount,
    phones,
    bring,
    office,
    terms,
    dates,
  };
}
