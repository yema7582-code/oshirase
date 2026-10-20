// A one-event calendar file so the deadline lands in the phone's calendar.
export function makeIcs({ dateIso, title, description, uid }) {
  const d = dateIso.replace(/-/g, '');
  const esc = (s) => String(s).replace(/\\/g, '\\\\').replace(/\n/g, '\\n').replace(/[,;]/g, (c) => '\\' + c);
  // Remind two days before, at 9:00 local time.
  return [
    'BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//Oshirase//EN', 'CALSCALE:GREGORIAN',
    'BEGIN:VEVENT',
    `UID:${uid || d + '@oshirase'}`,
    `DTSTAMP:${d}T000000Z`,
    `DTSTART;VALUE=DATE:${d}`,
    `SUMMARY:${esc(title)}`,
    `DESCRIPTION:${esc(description || '')}`,
    'BEGIN:VALARM', 'ACTION:DISPLAY', `DESCRIPTION:${esc(title)}`, 'TRIGGER:-P1DT15H', 'END:VALARM',
    'END:VEVENT', 'END:VCALENDAR', '',
  ].join('\r\n');
}
