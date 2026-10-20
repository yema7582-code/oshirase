import { test } from 'node:test';
import assert from 'node:assert/strict';
import { findDates, normalize } from '../src/dates.js';
import { analyze, detectType, findBringList } from '../src/parse.js';
import { findTerms } from '../src/glossary.js';
import { makeIcs } from '../src/ics.js';
import { formatDate } from '../src/i18n.js';
import { SAMPLES } from '../samples/samples.js';

const TODAY = '2026-10-20';
const sample = (id) => SAMPLES.find((s) => s.id === id).text;

test('reads Reiwa, abbreviated era, Western and year-less dates', () => {
  assert.deepEqual(findDates('納期限 令和8年10月31日', null).map((d) => d.iso), ['2026-10-31']);
  assert.deepEqual(findDates('指定期限 R8.11.6', null).map((d) => d.iso), ['2026-11-06']);
  assert.deepEqual(findDates('2026年12月18日まで', null).map((d) => d.iso), ['2026-12-18']);
  assert.deepEqual(findDates('11月2日(月)まで', 2026).map((d) => d.iso), ['2026-11-02']);
  assert.deepEqual(findDates('令和元年5月1日', null).map((d) => d.iso), ['2019-05-01']);
  assert.deepEqual(findDates('平成31年4月30日', null).map((d) => d.iso), ['2019-04-30']);
});

test('full-width digits are understood', () => {
  assert.equal(normalize('令和８年１０月３１日'), '令和8年10月31日');
  assert.deepEqual(findDates('令和８年１０月３１日', null).map((d) => d.iso), ['2026-10-31']);
});

test('impossible dates are ignored', () => {
  assert.deepEqual(findDates('令和8年2月30日', null), []);
});

test('health insurance bill: pay 18,400 yen by 31 Oct', () => {
  const r = analyze(sample('nhi'), TODAY);
  assert.equal(r.type.id, 'nhi');
  assert.equal(r.action, 'pay');
  assert.equal(r.amount.yen, 18400);
  assert.equal(r.deadline.iso, '2026-10-31');
  assert.equal(r.deadline.daysLeft, 11);
  assert.equal(r.urgent, false);
  assert.ok(r.phones.some((p) => p.phone === '0794-55-1234'));
  assert.equal(r.office, '納税課');
});

test('My Number card: visit by 18 Dec, with a bring list', () => {
  const r = analyze(sample('mynumber'), TODAY);
  assert.equal(r.type.id, 'mynumber');
  assert.equal(r.action, 'visit');
  assert.equal(r.deadline.iso, '2026-12-18');
  assert.ok(r.bring.includes('この交付通知書'));
  assert.ok(r.bring.some((b) => b.startsWith('本人確認書類')));
  assert.equal(r.bring.length, 4);
});

test('overdue reminder is flagged urgent', () => {
  const r = analyze(sample('overdue'), TODAY);
  assert.equal(r.type.id, 'overdue');
  assert.equal(r.urgent, true);
  assert.equal(r.amount.yen, 23600);
  assert.equal(r.deadline.iso, '2026-11-06');
});

test('a deadline that already passed is reported as overdue', () => {
  const r = analyze('提出期限 令和8年9月30日 までに提出してください', TODAY);
  assert.equal(r.overdue, true);
  assert.equal(r.deadline.daysLeft, -20);
  assert.equal(r.action, 'submit');
});

test('residence card letters become a renewal task', () => {
  const r = analyze('在留期間の満了日 令和9年1月15日 までに在留期間更新許可申請を行ってください。', TODAY);
  assert.equal(r.type.id, 'residence');
  assert.equal(r.action, 'renew');
  assert.equal(r.deadline.iso, '2027-01-15');
});

test('glossary prefers the longest word', () => {
  const hits = findTerms('国民健康保険税の納付書');
  assert.deepEqual(hits.map((h) => h.term), ['国民健康保険税', '納付書']);
});

test('unknown letters still work without crashing', () => {
  const r = analyze('こんにちは。', TODAY);
  assert.equal(r.type.id, 'other');
  assert.equal(r.deadline, null);
  assert.equal(r.amount, null);
  assert.equal(r.action, 'read');
});

test('bring list without a colon on following bullets', () => {
  assert.deepEqual(findBringList('次のものをお持ちください\n・印鑑\n・通帳'), ['印鑑', '通帳']);
});

test('calendar file has the date and a reminder', () => {
  const ics = makeIcs({ dateIso: '2026-10-31', title: 'Pay health insurance, 18,400 yen' });
  assert.match(ics, /DTSTART;VALUE=DATE:20261031/);
  assert.match(ics, /SUMMARY:Pay health insurance\\, 18\\,400 yen/);
  assert.match(ics, /TRIGGER:-P1DT15H/);
});

test('dates are shown with the weekday', () => {
  assert.equal(formatDate('2026-10-31', 'en'), 'Sat 31 Oct 2026');
  assert.equal(formatDate('2026-10-31', 'zh'), '2026年10月31日（周六）');
});
