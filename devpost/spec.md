---
doc: spec
status: approved
---

# Oshirase — Technical Spec

## How This Works, In Plain Language
Oshirase is one web page plus a few JavaScript files. When you tap **Read it**, the page hands the letter text to a *reader* (`parse.js`). The reader cleans up the text (full-width numbers become normal numbers), looks for dates, yen amounts, phone numbers, bring lists and known words, then decides which date is the deadline and what the to-do is. The page then draws the result. There is no server doing the work and no AI model: all of it is ordinary rules running in your browser, which is why the letter never leaves your device. A tiny Node script serves the files locally, but any static host works.

## The Core Journey Through the System
PRD ref: `prd.md > The Core Journey`.
1. User pastes text and taps **Read it** → `app.js` calls `analyze(text, today)` in `parse.js`.
2. `parse.js` → `dates.js normalize()` cleans the text → `findDates()` returns every date with its position.
3. `parse.js` keeps the dates sitting next to a deadline word and picks the earliest future one; picks the yen amount next to a payment word; scores letter types; reads bring lists, office and phones; asks `glossary.js findTerms()` for known words.
4. `analyze()` returns one plain object. `app.js render()` fills the summary card, banner, side cards, annotated letter and word list, using strings from `i18n.js`.
5. Tap **Add deadline to calendar** → `ics.js makeIcs()` builds the event → the browser downloads it.
6. Tap the language button → `app.js` re-renders the same object in the other language.

## Stack
- Plain HTML, CSS and JavaScript modules, no framework and no build step. Reason: the whole app is one screen, and anyone can open the files and read them.
- Node.js 18+ only for `node --test` and the small static server (`serve.js`). Docs: https://nodejs.org/api/test.html
- No runtime dependencies.

## Where It Runs and How Someone Tries It
- Runs in any modern browser, on phones too.
- Local: `npm start`, then open http://localhost:5173. Add `?sample=nhi&today=2026-10-20` to open a sample with a pinned date (used for the demo video).
- Tests: `npm test`.
- Deployed copy on GitHub Pages (optional): https://yema7582-code.github.io/oshirase/

## Look and Feel
From `prd.md > Look and Feel`: CSS variables for paper (#f6f1e7), card (#fffdf8), ink (#1f2a44), muted grey, beige lines, hanko red (#c8371d) with a soft red for banners. 14px card radius. System fonts with Hiragino / Noto Sans JP / Noto Sans SC first. Spacious single column, cards side by side above 560px. Ruby with dotted red underline for words you can tap.

## Components

### Text cleanup and dates (`src/dates.js`)
`normalize()` converts full-width digits and letters, punctuation and 元年. `findDates()` finds Reiwa/Heisei/Showa dates, R8.10.31 style, Western dates and year-less dates, drops impossible dates (2月30日) and overlaps. `daysBetween()` counts days in UTC to avoid time-zone surprises.
PRD ref: `prd.md > Reading the letter`.

### Reader (`src/parse.js`)
`detectType()`, `findAmounts()`, `findPhones()`, `findBringList()`, `findOffice()` and `analyze()`. Pure functions, no DOM, so they are easy to test.
PRD ref: `prd.md > Reading the letter`, `prd.md > Warnings`, `prd.md > Bring list and contact`.

### Glossary (`src/glossary.js`)
An array of `[term, reading, English, Chinese]`. `findTerms()` sorts by length so longer words win and marks used characters to avoid overlaps.
PRD ref: `prd.md > Words`.

### Calendar (`src/ics.js`)
Builds a VCALENDAR text with one all-day VEVENT and a VALARM 15 hours before the day starts (9:00 the day before).
PRD ref: `prd.md > Calendar`.

### Page (`index.html`, `styles.css`, `src/app.js`, `src/i18n.js`)
`app.js` wires the buttons, renders results and the word popup. `i18n.js` holds all interface text in English and Chinese and formats dates with weekdays.
PRD ref: `prd.md > Screens and Layout`, `prd.md > States and Boundaries`.

### Samples (`samples/samples.js`)
Three made-up letters (health insurance bill, My Number card pick-up, overdue resident tax).

## Data Model
No storage. `analyze()` returns `{ text, type, urgent, overdue, action, deadline{iso,daysLeft,index,length}, amount{yen,index}, phones[], bring[], office, terms[], dates[] }`.

## File Structure
```
index.html, styles.css, favicon.svg   the page
src/app.js        page logic and rendering
src/parse.js      the reader (rules)
src/dates.js      date cleanup and conversion
src/glossary.js   word list and matcher
src/i18n.js       interface text, date and yen formatting
src/ics.js        calendar file
samples/          made-up letters
test/             node:test unit tests
serve.js          local static server
devpost/          scope, PRD, spec, checklist
```

## Testing
`node --test` covers each date format, full-width digits, impossible dates, all three samples end to end, a passed deadline, residence-card renewal, longest-match glossary, bring lists without a colon, the calendar file and weekday formatting. The page is checked by opening each sample in English and Chinese.

## Risks
- Letters vary a lot between cities. Mitigation: the deadline rule only needs a date next to a deadline word, and the page says when it finds nothing.
- Copy-paste from a phone camera can break lines oddly. The rules work line by line only for bring lists.
