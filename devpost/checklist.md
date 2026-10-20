---
doc: checklist
status: approved
---

# Oshirase — Build Checklist

## Slices
- [x] 1. Dates: Reiwa/abbreviated/Western/year-less dates, full-width digits, impossible dates rejected (tests).
- [x] 2. Reader: type detection, deadline choice, amount, action, phones, office (tests with three samples).
- [x] 3. Bring list with bullets and brackets (tests).
- [x] 4. Glossary with longest match (tests).
- [x] 5. Page: input, samples, summary card, banners, side cards.
- [x] 6. Annotated letter with ruby and word popup, word list.
- [x] 7. English/Chinese switch that re-renders without re-pasting.
- [x] 8. Calendar download.

## Revisions
- Type detection first matched the first keyword found, so a My Number letter that asked for a 在留カード as ID was labelled a residence-card letter. Changed to a score that weighs the title lines.
- Bring-list items were split on the comma inside 「本人確認書類（在留カード、旅券など）」. Now splits only outside brackets.
- Glossary extended with words found in the samples (減免, 引き落とし, 予約制, 指定期限, 滞納処分…).

## Final Review
All 13 unit tests pass. Each sample checked in English and Chinese at desktop and phone widths: deadline, countdown, amount, to-do, bring list, contact and word popup appear as described in the PRD.

## Code Tour and App Map
Start in `src/parse.js > analyze()`: everything the page shows comes from the object it returns. `dates.js` explains how 令和 becomes a normal year (令和 year + 2018). The page code in `app.js` only draws that object.
