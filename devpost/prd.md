---
doc: prd
status: approved
---

# Oshirase — Product Requirements

A one-page web tool for foreign residents of Japan that explains a city-hall letter in English or Simplified Chinese. Source: `scope.md > Who It's For`, `scope.md > The Unique Kernel`.

## The Core Journey
1. Open the page. The header says what it does, and a green line says it runs on your device.
2. Paste the Japanese text of the letter into the box (or tap a sample).
3. Tap **Read it**.
4. See a summary card: what kind of letter it is, the deadline with a countdown, the amount, and one sentence saying what to do.
5. If there is something to bring or someone to call, see it in two side cards. The phone number is a tap-to-call link.
6. Scroll down to the letter itself, with readings over hard words. Tap a word to see its meaning.
7. Tap **Add deadline to calendar** to download a calendar event with a reminder.
8. Switch language at any time with the button in the top right; the result re-renders without pasting again.

Success: within a few seconds she knows what the letter is, whether she must pay or go somewhere, and by when.

## Screens and Layout
A single page. Top: brand, tagline, language switch. Then the input card. After reading, the result appears below in this order: warning banner (only when needed), summary card, bring/contact cards side by side (stacked on phones), annotated letter, word list.

## Look and Feel
Paper off-white background (#f6f1e7), navy ink text (#1f2a44), hanko red (#c8371d) only for deadlines, warnings and the logo seal. Rounded cards with thin beige borders. System Japanese/Chinese sans-serif fonts. Copy is short and plain: "What you need to do", not "Action items". Mobile first.

## Features and Behavior

### Reading the letter
- Recognise the letter type from keywords, giving more weight to the first two lines (the title). An overdue notice (督促状, 催告書, 差押) always wins.
  - [x] A My Number card letter that lists 在留カード as ID to bring is still recognised as a My Number letter.
- Find dates written as 令和8年10月31日, R8.10.31, 2026年10月31日, 2026/10/31, or 10月31日 (year taken from the letter), including full-width digits and 元年.
- The deadline is a date next to a deadline word (期限, まで, 納期限, 提出期限…). If there are several, the earliest one still in the future.
  - [x] The sample health insurance bill shows Sat 31 Oct 2026 and the number of days left.
- The amount is the yen figure next to a payment word (納付, 税額, 保険料…).
- The to-do is one of: pay, send back a form, go to the counter, renew your stay, or "nothing to do, keep it".

### Warnings
- Overdue notice: red banner explaining late charges and that a payment plan can be requested.
- Deadline within 7 days: red countdown and a short "deadline is close" banner.
- Deadline already passed: banner telling the user to call the office.

### Bring list and contact
- Lines after 持ち物 / 持参 / お持ちください / 必要なもの, including bullet lines, become a list. Each item shows a gloss for the hard words in it. Commas inside brackets do not split items.
- The office (…課, …係, …事務所) near 問い合わせ, and every phone number, shown as tap-to-call.

### Words
- About 100 common bureaucratic words with reading, English and Chinese. Longest match wins (国民健康保険税 beats 国民健康保険).
- Shown as ruby (furigana) in the letter; tap or press Enter for a popup; full list at the bottom.

### Calendar
- Download an .ics all-day event on the deadline, with a reminder at 9:00 the day before.

## States and Boundaries
- **Empty** — only the input card is shown.
- **No deadline found** — the deadline box shows a dash and a hint to look near 期限 or まで; no calendar button.
- **Deadline passed** — "passed N days ago" in red and the call-the-office banner; no calendar button.
- **Unknown letter** — type "Official letter"; words and phone numbers still work.
- **Persistence** — nothing is stored. Refreshing clears the letter.

## Product Decisions
- Rules instead of an AI model — privacy and predictability matter more than covering every letter.
- English and Simplified Chinese first — the two languages the learner can check personally.
- Samples are made up — no real letters or personal data in the repo.

## What We're Building
Everything in Features and Behavior, the three samples, tests for the parsing rules, and a static page that works from any web server.

## Deferred From the POC
- Photo/OCR input — needs a large OCR model download; copy-paste from the phone camera works for now.
- More languages — need native checkers.

## Possible Later Enhancements
City-specific tips, a "paid" checkbox with a list of past letters stored only on the device, and a browser extension for reading PDFs from city websites.

## Non-Goals
- Not a translator for the whole letter. It explains what matters and the hard words.
- Not tax or legal advice.

## Open Questions
- None blocking the build.
