import { analyze } from './parse.js';
import { findTerms } from './glossary.js';
import { makeIcs } from './ics.js';
import { UI, formatDate, formatYen } from './i18n.js';
import { SAMPLES } from '../samples/samples.js';

const $ = (id) => document.getElementById(id);
const params = new URLSearchParams(location.search);
let lang = params.get('lang') === 'zh' || (!params.get('lang') && navigator.language.startsWith('zh')) ? 'zh' : 'en';
let last = null;

function todayIso() {
  // ?today=YYYY-MM-DD pins the date (used for the demo video and screenshots).
  const pinned = params.get('today');
  if (pinned && /^\d{4}-\d{2}-\d{2}$/.test(pinned)) return pinned;
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

const esc = (s) => s.replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]);

function applyStatic() {
  const t = UI[lang];
  document.documentElement.lang = lang === 'zh' ? 'zh-Hans' : 'en';
  document.querySelectorAll('[data-i18n]').forEach((el) => { el.textContent = t[el.dataset.i18n]; });
  $('letter').placeholder = t.placeholder;
  $('lang').textContent = t.lang;
  $('samples').innerHTML = '';
  for (const s of SAMPLES) {
    const b = document.createElement('button');
    b.className = 'chip';
    b.type = 'button';
    b.textContent = s.label[lang];
    b.onclick = () => { $('letter').value = s.text; run(); };
    $('samples').append(b);
  }
}

function annotate(r) {
  const spans = [];
  for (const h of r.terms) spans.push({ ...h, kind: 'term' });
  if (r.deadline) spans.push({ index: r.deadline.index, length: r.deadline.length, kind: 'deadline' });
  if (r.amount) spans.push({ index: r.amount.index, length: r.amount.length, kind: 'amount' });
  spans.sort((a, b) => a.index - b.index || b.length - a.length);
  let html = '';
  let pos = 0;
  for (const s of spans) {
    if (s.index < pos) continue;
    html += esc(r.text.slice(pos, s.index));
    const word = esc(r.text.slice(s.index, s.index + s.length));
    if (s.kind === 'term') {
      const ruby = s.reading !== s.term ? `<rt>${esc(s.reading)}</rt>` : '';
      html += `<ruby data-term="${esc(s.term)}" tabindex="0">${word}${ruby}</ruby>`;
    } else {
      html += `<mark class="${s.kind}">${word}</mark>`;
    }
    pos = s.index + s.length;
  }
  html += esc(r.text.slice(pos));
  return html;
}

function render(r) {
  const t = UI[lang];
  $('result').hidden = false;
  $('kind').textContent = r.type[lang];

  const dl = r.deadline;
  $('f-deadline').hidden = false;
  if (dl) {
    $('deadline').textContent = formatDate(dl.iso, lang);
    const cd = $('countdown');
    cd.className = 'sub' + (dl.daysLeft < 0 ? ' past' : dl.daysLeft <= 7 ? ' soon' : '');
    cd.textContent = dl.daysLeft < 0 ? t.daysAgo(-dl.daysLeft) : t.daysLeft(dl.daysLeft);
  } else {
    $('deadline').textContent = '—';
    $('countdown').className = 'sub past';
    $('countdown').textContent = t.noDeadline;
  }
  $('f-amount').hidden = !r.amount;
  if (r.amount) $('amount').textContent = formatYen(r.amount.yen);

  const amountText = r.amount ? formatYen(r.amount.yen) : '';
  const dateText = dl && dl.daysLeft >= 0 ? formatDate(dl.iso, lang) : '';
  $('todo').textContent = t.actions[r.action](amountText, dateText);
  $('cal').hidden = !(dl && dl.daysLeft >= 0);

  const banner = $('banner');
  const note = r.type.id === 'overdue' ? t.overdueNote : r.overdue ? t.pastNote : r.urgent ? t.soonNote : '';
  banner.hidden = !note;
  banner.textContent = note ? '⚠ ' + note : '';

  $('c-bring').hidden = !r.bring.length;
  $('bring').innerHTML = r.bring.map((item) => {
    const glosses = findTerms(item).map((h) => (lang === 'zh' ? h.zh : h.en));
    return `<li lang="ja">${esc(item)}${glosses.length ? `<span class="gloss" lang="${lang}">${esc(glosses.join(' · '))}</span>` : ''}</li>`;
  }).join('');

  $('c-contact').hidden = !(r.office || r.phones.length);
  const officeGloss = r.office ? findTerms(r.office).map((h) => (lang === 'zh' ? h.zh : h.en))[0] : null;
  $('contact').innerHTML =
    (r.office ? `<p lang="ja"><b>${esc(r.office)}</b>${officeGloss ? `<br><span class="muted">${esc(officeGloss)}</span>` : ''}</p>` : '') +
    r.phones.map((p) => `<p><a class="phone" href="tel:${p.phone}">${p.phone}</a></p>`).join('');

  $('annotated').innerHTML = annotate(r);

  const seen = new Set();
  $('words').innerHTML = r.terms.filter((h) => !seen.has(h.term) && seen.add(h.term)).map((h) =>
    `<dt lang="ja">${esc(h.term)}<small>${esc(h.reading)}</small></dt><dd>${esc(lang === 'zh' ? h.zh : h.en)}</dd>`).join('');
}

function run() {
  const text = $('letter').value.trim();
  if (!text) { $('result').hidden = true; return; }
  last = analyze(text, todayIso());
  render(last);
  $('result').scrollIntoView({ behavior: params.get('demo') ? 'auto' : 'smooth', block: 'start' });
}

function showPop(el) {
  const h = last && last.terms.find((x) => x.term === el.dataset.term);
  if (!h) return;
  const pop = $('pop');
  pop.innerHTML = `<b lang="ja">${esc(h.term)}</b><small lang="ja">${esc(h.reading)}</small><div>${esc(lang === 'zh' ? h.zh : h.en)}</div>`;
  pop.hidden = false;
  const r = el.getBoundingClientRect();
  pop.style.left = Math.max(8, Math.min(window.scrollX + r.left, window.scrollX + innerWidth - 316)) + 'px';
  pop.style.top = window.scrollY + r.bottom + 8 + 'px';
}

document.addEventListener('click', (e) => {
  const rb = e.target.closest('ruby[data-term]');
  if (rb) showPop(rb); else $('pop').hidden = true;
});
document.addEventListener('keydown', (e) => {
  if (e.key === 'Enter' && e.target.matches('ruby[data-term]')) showPop(e.target);
  if (e.key === 'Escape') $('pop').hidden = true;
});

$('go').onclick = run;
$('clear').onclick = () => { $('letter').value = ''; $('result').hidden = true; $('letter').focus(); };
$('lang').onclick = () => { lang = lang === 'en' ? 'zh' : 'en'; applyStatic(); if (last) render(last); };
$('cal').onclick = () => {
  if (!last || !last.deadline) return;
  const t = UI[lang];
  const title = `${last.type[lang]}: ${t.actions[last.action](last.amount ? formatYen(last.amount.yen) : '', '')}`.slice(0, 120);
  const ics = makeIcs({ dateIso: last.deadline.iso, title, description: last.text.slice(0, 400) });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(new Blob([ics], { type: 'text/calendar' }));
  a.download = `oshirase-${last.deadline.iso}.ics`;
  a.click();
};

applyStatic();
const pre = params.get('sample');
if (pre) { const s = SAMPLES.find((x) => x.id === pre); if (s) { $('letter').value = s.text; run(); } }
