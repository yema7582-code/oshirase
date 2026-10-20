// Words that show up again and again in letters from city halls, the pension
// office and the immigration bureau. Longest terms are matched first.
// reading = hiragana, en = English, zh = Simplified Chinese.
export const GLOSSARY = [
  ['納税通知書', 'のうぜいつうちしょ', 'Tax notice (how much tax you owe and when)', '纳税通知书（告知应缴税额和期限）'],
  ['納付書', 'のうふしょ', 'Payment slip (take it to a bank or convenience store to pay)', '缴款单（拿到银行或便利店付款）'],
  ['個人番号カード', 'こじんばんごうカード', 'My Number card (official name)', '个人编号卡（正式名称）'],
  ['個人番号通知書', 'こじんばんごうつうちしょ', 'Paper notice of your My Number', '个人编号通知书'],
  ['住民基本台帳カード', 'じゅうみんきほんだいちょうカード', 'Old resident register card (replaced by My Number card)', '住民基本台账卡（旧卡，已由个人编号卡取代）'],
  ['減免', 'げんめん', 'Reduction or exemption', '减免'],
  ['引き落とし', 'ひきおとし', 'Automatic withdrawal from your bank account', '从银行账户扣款'],
  ['予約制', 'よやくせい', 'By appointment only', '需预约'],
  ['予約', 'よやく', 'Appointment / booking', '预约'],
  ['受取', 'うけとり', 'Pick-up / receipt', '领取'],
  ['滞納処分', 'たいのうしょぶん', 'Enforced collection of unpaid tax', '滞纳处分（强制征收）'],
  ['指定期限', 'していきげん', 'Deadline set in this notice', '指定期限'],
  ['税額', 'ぜいがく', 'Tax amount', '税额'],
  ['納付額', 'のうふがく', 'Amount to pay', '应缴金额'],
  ['納期限', 'のうきげん', 'Payment deadline', '缴纳期限'],
  ['納付期限', 'のうふきげん', 'Payment deadline', '缴纳期限'],
  ['提出期限', 'ていしゅつきげん', 'Deadline to hand it in', '提交期限'],
  ['申請期限', 'しんせいきげん', 'Application deadline', '申请期限'],
  ['有効期限', 'ゆうこうきげん', 'Expiry date', '有效期限'],
  ['期限', 'きげん', 'Deadline', '期限'],
  ['督促状', 'とくそくじょう', 'Final reminder for an unpaid bill', '催缴通知（逾期未缴）'],
  ['催告書', 'さいこくしょ', 'Strong demand to pay (step before seizure)', '催告书（强制执行前的催缴）'],
  ['延滞金', 'えんたいきん', 'Late-payment charge', '滞纳金'],
  ['差押', 'さしおさえ', 'Seizure of property or wages', '扣押（财产或工资）'],
  ['住民税', 'じゅうみんぜい', 'Resident tax (city + prefecture tax on last year\'s income)', '居民税（按上一年收入征收的地方税）'],
  ['市県民税', 'しけんみんぜい', 'Resident tax (city + prefecture)', '市县民税（即居民税）'],
  ['市民税', 'しみんぜい', 'City resident tax', '市民税'],
  ['特別徴収', 'とくべつちょうしゅう', 'Tax taken out of your salary by your employer', '特别征收（由公司从工资中代扣）'],
  ['普通徴収', 'ふつうちょうしゅう', 'Tax you pay yourself with payment slips', '普通征收（自己拿缴款单缴纳）'],
  ['国民健康保険税', 'こくみんけんこうほけんぜい', 'National Health Insurance tax', '国民健康保险税'],
  ['国民健康保険料', 'こくみんけんこうほけんりょう', 'National Health Insurance premium', '国民健康保险费'],
  ['国民健康保険', 'こくみんけんこうほけん', 'National Health Insurance (for people not on a company plan)', '国民健康保险（没有公司保险的人加入）'],
  ['国民年金', 'こくみんねんきん', 'National Pension', '国民年金'],
  ['保険料', 'ほけんりょう', 'Insurance premium', '保险费'],
  ['免除', 'めんじょ', 'Exemption (you may not have to pay)', '免除'],
  ['猶予', 'ゆうよ', 'Postponement of payment', '缓缴'],
  ['口座振替', 'こうざふりかえ', 'Automatic bank debit', '银行账户自动扣款'],
  ['固定資産税', 'こていしさんぜい', 'Property tax (land, house)', '固定资产税（土地、房屋）'],
  ['軽自動車税', 'けいじどうしゃぜい', 'Light-vehicle tax (kei cars, scooters)', '轻型汽车税'],
  ['在留カード', 'ざいりゅうカード', 'Residence card', '在留卡'],
  ['在留期間更新', 'ざいりゅうきかんこうしん', 'Extension of period of stay', '在留期间更新（续签）'],
  ['在留期間', 'ざいりゅうきかん', 'Period of stay', '在留期间'],
  ['在留資格', 'ざいりゅうしかく', 'Status of residence (visa type)', '在留资格（签证类型）'],
  ['出入国在留管理局', 'しゅつにゅうこくざいりゅうかんりきょく', 'Immigration Services Agency office', '出入国在留管理局（入管）'],
  ['入管', 'にゅうかん', 'Immigration office', '入管'],
  ['旅券', 'りょけん', 'Passport', '护照'],
  ['マイナンバーカード', 'マイナンバーカード', 'My Number card (ID card with your personal number)', '个人编号卡（My Number卡）'],
  ['マイナンバー', 'マイナンバー', 'My Number (12-digit personal number)', '个人编号（12位）'],
  ['個人番号', 'こじんばんごう', 'Personal number (My Number)', '个人编号'],
  ['交付通知書', 'こうふつうちしょ', 'Notice that your card is ready to collect', '领取通知书（卡已可领取）'],
  ['交付', 'こうふ', 'Issuing / handing over (a card or document)', '发放、交付'],
  ['住民票', 'じゅうみんひょう', 'Certificate of residence', '住民票（居住证明）'],
  ['転入届', 'てんにゅうとどけ', 'Moving-in notice', '迁入申报'],
  ['転出届', 'てんしゅつとどけ', 'Moving-out notice', '迁出申报'],
  ['世帯主', 'せたいぬし', 'Head of household', '户主'],
  ['世帯', 'せたい', 'Household', '家庭户'],
  ['児童手当', 'じどうてあて', 'Child allowance', '儿童补贴'],
  ['現況届', 'げんきょうとどけ', 'Status report you must send to keep a benefit', '现况申报（继续领取补贴需提交）'],
  ['特定健診', 'とくていけんしん', 'Specific health check-up (ages 40-74)', '特定健康检查（40至74岁）'],
  ['健康診断', 'けんこうしんだん', 'Health check-up', '健康检查'],
  ['受診券', 'じゅしんけん', 'Check-up voucher (bring it to the clinic)', '就诊券（就诊时携带）'],
  ['予防接種', 'よぼうせっしゅ', 'Vaccination', '预防接种'],
  ['問診票', 'もんしんひょう', 'Medical questionnaire', '问诊表'],
  ['自己負担', 'じこふたん', 'The part you pay yourself', '自付部分'],
  ['無料', 'むりょう', 'Free of charge', '免费'],
  ['申請書', 'しんせいしょ', 'Application form', '申请书'],
  ['申請', 'しんせい', 'Application', '申请'],
  ['届出', 'とどけで', 'Official notification (you report something)', '申报'],
  ['提出', 'ていしゅつ', 'Hand in / submit', '提交'],
  ['返信用封筒', 'へんしんようふうとう', 'Return envelope', '回邮信封'],
  ['同封', 'どうふう', 'Enclosed', '随信附上'],
  ['添付', 'てんぷ', 'Attach', '附上'],
  ['押印', 'おういん', 'Stamp your seal (hanko)', '盖章'],
  ['署名', 'しょめい', 'Signature', '签名'],
  ['本人確認書類', 'ほんにんかくにんしょるい', 'Photo ID (residence card, passport, etc.)', '本人身份证明文件'],
  ['委任状', 'いにんじょう', 'Letter of authorization (if someone goes for you)', '委托书（他人代办时需要）'],
  ['代理人', 'だいりにん', 'Proxy (person acting for you)', '代理人'],
  ['持参', 'じさん', 'Bring with you', '携带'],
  ['窓口', 'まどぐち', 'Service counter', '窗口'],
  ['市役所', 'しやくしょ', 'City hall', '市政府'],
  ['区役所', 'くやくしょ', 'Ward office', '区政府'],
  ['支所', 'ししょ', 'Branch office', '分所'],
  ['課税課', 'かぜいか', 'Tax assessment section', '课税科'],
  ['納税課', 'のうぜいか', 'Tax collection section', '纳税科'],
  ['保険年金課', 'ほけんねんきんか', 'Insurance and pension section', '保险年金科'],
  ['市民課', 'しみんか', 'Residents section', '市民科'],
  ['年金事務所', 'ねんきんじむしょ', 'Pension office', '年金事务所'],
  ['日本年金機構', 'にほんねんきんきこう', 'Japan Pension Service', '日本年金机构'],
  ['問い合わせ', 'といあわせ', 'Contact / questions', '咨询'],
  ['問合せ', 'といあわせ', 'Contact / questions', '咨询'],
  ['開庁時間', 'かいちょうじかん', 'Office opening hours', '办公时间'],
  ['土日祝日', 'どにちしゅくじつ', 'Weekends and public holidays', '周六日及节假日'],
  ['全期前納', 'ぜんきぜんのう', 'Paying the whole year at once', '全年一次性缴纳'],
  ['第1期', 'だいいっき', '1st instalment', '第1期'],
  ['第2期', 'だいにき', '2nd instalment', '第2期'],
  ['第3期', 'だいさんき', '3rd instalment', '第3期'],
  ['第4期', 'だいよんき', '4th instalment', '第4期'],
  ['金融機関', 'きんゆうきかん', 'Bank or post office', '金融机构（银行、邮局）'],
  ['コンビニ', 'コンビニ', 'Convenience store', '便利店'],
  ['ゆうちょ銀行', 'ゆうちょぎんこう', 'Japan Post Bank', '邮储银行'],
];

const SORTED = [...GLOSSARY].sort((a, b) => b[0].length - a[0].length);

// Find glossary terms in text without overlaps (longest match wins).
export function findTerms(text) {
  const hits = [];
  const taken = new Uint8Array(text.length);
  for (const [term, reading, en, zh] of SORTED) {
    let from = 0;
    while (true) {
      const i = text.indexOf(term, from);
      if (i < 0) break;
      from = i + term.length;
      let free = true;
      for (let k = i; k < i + term.length; k++) if (taken[k]) { free = false; break; }
      if (!free) continue;
      for (let k = i; k < i + term.length; k++) taken[k] = 1;
      hits.push({ term, reading, en, zh, index: i, length: term.length });
    }
  }
  return hits.sort((a, b) => a.index - b.index);
}
