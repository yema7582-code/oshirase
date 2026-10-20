---
doc: scope
status: approved
---

# Oshirase (お知らせ)

A web page where a foreign resident of Japan pastes the text of a letter from city hall and immediately sees what it is, the deadline, the amount and what to do, in English or Simplified Chinese.

## The Unique Kernel
It reads the letter the way a helpful Japanese neighbour would: it finds the one date that is the *deadline* (not the issue date or the fiscal year), converts Reiwa dates like 令和8年10月31日 into a normal date with a countdown, and turns the letter into a single sentence to-do ("Pay ¥18,400 by Sat 31 Oct 2026"). It does this with plain rules in the browser, so a letter full of personal details never leaves the phone.

## Who It's For
Lin (an example persona), a Chinese engineer who moved to a small city in Hyogo two years ago. Her spoken Japanese is fine for work, but the envelopes from 市役所 are written in dense bureaucratic Japanese. Today she photographs them and asks a friend in a WeChat group, or puts them through a general translator that turns 納期限 into "delivery period" and still doesn't tell her what she has to do or by when. She once paid a health insurance instalment late because the deadline was written in Reiwa years.

## The Core Loop
A letter arrives. She copies the text (from the phone camera's text selection, or types the key lines), pastes it, taps **Read it**. She sees the type of letter, the deadline with days left, the amount, what to bring and who to call. She adds the deadline to her calendar and puts the letter away. Next month another letter comes, and she does it again.

## Inspiration & Identity
Calm and trustworthy, like a well-kept paper notebook rather than a flashy AI app. Warm off-white paper, dark navy ink, and one red accent taken from a Japanese hanko seal for anything with a deadline. Furigana over hard words, because seeing the reading helps people learn the words over time.

## Why This Matters to the Learner
I live in Kakogawa and have been putting together bilingual Japanese/Chinese guides to Japanese paperwork. The same questions come up again and again: "what is this letter?", "do I have to pay this?", "when is the deadline?". I wanted to see whether a tiny, private tool could answer those three questions instantly.

## What "Working" Looks Like
Paste the sample National Health Insurance bill and the page says: *National Health Insurance · Deadline Sat 31 Oct 2026 · 11 days left · ¥18,400 · Pay ¥18,400 by Sat 31 Oct 2026 using the payment slip at a bank, post office or convenience store*, with the phone number of 納税課 as a tap-to-call link. The "oh, that's cool" beat: the Reiwa date turns into a countdown, and an overdue notice (督促状) turns the page red with a plain warning about late charges.

## The POC Boundary
- Paste text in, get a summary out. One page, no accounts.
- Letter types: health insurance, resident tax, pension, My Number card, residence card, property and vehicle tax, child allowance, check-ups, vaccinations, and overdue reminders.
- Deadline, amount, bring list, office and phone extraction.
- English and Simplified Chinese.
- Glossary with readings, tap a word to see its meaning.
- Download the deadline as a calendar file.
- Three made-up sample letters for trying it out.

## Later
- Photo input with on-device OCR.
- Traditional Chinese, Vietnamese, Nepali, Portuguese and Indonesian.
- Per-city knowledge (which counter, opening hours, where to pay online).

## Explicitly Cut
- **An LLM.** It would cover more letters, but letters contain names, addresses and My Numbers. The point is that nothing leaves the device, and the kernel (deadline, amount, to-do) is predictable enough for rules.
- **Accounts and saved history.** Not needed to prove the kernel, and storing letters is a privacy risk.
- **Legal advice.** The page explains what the letter says; it does not tell people whether a tax is correct.
