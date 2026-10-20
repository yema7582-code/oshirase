export const UI = {
  en: {
    tagline: 'Paste a letter from city hall. See what it wants from you, in plain English.',
    privacy: 'Runs on your device. Nothing you paste is sent anywhere.',
    pasteLabel: 'Letter text (Japanese)',
    placeholder: 'Paste or type the Japanese text of the letter here…',
    tryOne: 'Or try a sample:',
    read: 'Read it',
    clear: 'Clear',
    whatIsIt: 'What this letter is',
    todo: 'What you need to do',
    deadline: 'Deadline',
    daysLeft: (n) => (n === 0 ? 'today' : n === 1 ? '1 day left' : `${n} days left`),
    daysAgo: (n) => (n === 1 ? 'passed yesterday' : `passed ${n} days ago`),
    amount: 'Amount',
    bring: 'Bring with you',
    contact: 'Who to ask',
    words: 'Words in this letter',
    original: 'The letter, with hard words explained',
    tapHint: 'Tap an underlined word to see what it means.',
    addCal: 'Add deadline to calendar',
    noDeadline: 'No deadline found. Check the letter for a date near 期限 or まで.',
    actions: {
      pay: (a, d) => `Pay ${a}${d ? ' by ' + d : ''}. Use the payment slip (納付書) at a bank, post office or convenience store.`,
      submit: (a, d) => `Fill in and send back the form${d ? ' by ' + d : ''}.`,
      visit: (a, d) => `Go to the counter to pick it up or attend${d ? ' by ' + d : ''}. Book first if the letter says 予約.`,
      renew: (a, d) => `Apply to extend your stay at the immigration office${d ? ' before ' + d : ''}.`,
      read: () => 'Nothing to pay or send was found. Keep the letter in case you need it later.',
    },
    overdueNote: 'This is a reminder for an unpaid bill. Late charges grow every day, so pay soon or call the office to ask about a payment plan.',
    soonNote: 'The deadline is close.',
    pastNote: 'The deadline in this letter has already passed. Call the office and ask what to do now.',
    lang: '中文',
  },
  zh: {
    tagline: '粘贴市政府寄来的信，用简单的中文告诉你要做什么。',
    privacy: '只在你的设备上运行，粘贴的内容不会发送到任何地方。',
    pasteLabel: '信件文字（日语）',
    placeholder: '在这里粘贴或输入信件的日语原文……',
    tryOne: '或者试试示例：',
    read: '解读',
    clear: '清空',
    whatIsIt: '这是什么信',
    todo: '你需要做什么',
    deadline: '期限',
    daysLeft: (n) => (n === 0 ? '就是今天' : `还剩 ${n} 天`),
    daysAgo: (n) => `已过期 ${n} 天`,
    amount: '金额',
    bring: '需要携带',
    contact: '咨询窗口',
    words: '信中的词语',
    original: '原文（难词附解释）',
    tapHint: '点击带下划线的词查看意思。',
    addCal: '把期限加入日历',
    noDeadline: '没有找到期限。请查看信中「期限」或「まで」附近的日期。',
    actions: {
      pay: (a, d) => `${d ? '请在 ' + d + ' 之前' : '请'}缴纳 ${a}。可拿缴款单（納付書）到银行、邮局或便利店付款。`,
      submit: (a, d) => `${d ? '请在 ' + d + ' 之前' : '请'}填写表格并寄回。`,
      visit: (a, d) => `${d ? '请在 ' + d + ' 之前' : '请'}到窗口办理或领取。信中写有「予約」的话需要先预约。`,
      renew: (a, d) => `${d ? '请在 ' + d + ' 之前' : '请'}到入管办理在留期间更新。`,
      read: () => '没有发现需要缴费或提交的内容。请保留这封信以备后用。',
    },
    overdueNote: '这是逾期未缴的催缴通知。滞纳金会每天增加，请尽快缴纳，或打电话咨询分期缴纳。',
    soonNote: '期限快到了。',
    pastNote: '信中的期限已经过了。请打电话问窗口现在该怎么办。',
    lang: 'English',
  },
};

const WD = { en: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'], zh: ['周日', '周一', '周二', '周三', '周四', '周五', '周六'] };
const MON = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

export function formatDate(isoDate, lang) {
  const [y, m, d] = isoDate.split('-').map(Number);
  const wd = new Date(Date.UTC(y, m - 1, d)).getUTCDay();
  return lang === 'zh' ? `${y}年${m}月${d}日（${WD.zh[wd]}）` : `${WD.en[wd]} ${d} ${MON[m - 1]} ${y}`;
}

export function formatYen(n) {
  return '¥' + n.toLocaleString('en-US');
}
