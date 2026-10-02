# Prox Synthetic Portfolio Demo

## Scope

Independent, synthetic presentation prototype. Do not import, copy, package or
publish company application code, schemas, business rules, DBs, spreadsheets,
operating scripts, authentication implementations, secrets or settings.
Reuse only the already-public portfolio mark and third-party Lucide icons.
No external requests, cookies, browser persistence, login credentials or APIs.
Only the separately authored synthetic demo is approved for publication. Company content remains excluded.

## Atmosphere

Field Ledger: dense operational tables, neutral ruled sections, teal commands,
graphite navigation and distinct semantic colors. Design variance 3, motion 1,
visual density 8. No landing page, gradients, floating section cards or decoration.
Show the product mark/name and synthetic demo status in the first viewport.

## Color

| Token | Value |
| --- | --- |
| --bg | #F2F5F4 |
| --surface | #FFFFFF |
| --soft | #F7F9F8 |
| --ink | #1C292B |
| --muted | #526367 |
| --line | #D5DEDC |
| --brand | #14776F |
| --selected | #E1F1ED |
| --info | #286C90 |
| --success | #216B4E |
| --warning | #A15D19 |
| --danger | #B53B3D |

## Typography

Malgun Gothic, Segoe UI, sans-serif; letter spacing 0. Tokens: --xs 12px,
--sm 13px, --base 14px, --title 20px, --metric 24px. Line height 1.5.
Numbers use tabular numerals. No viewport-based font scaling.

## Spacing And Components

Base unit: 4px.

Tokens --s1 4px, --s2 8px, --s3 12px, --s4 16px, --s5 20px, --s6 24px,
--s8 32px. --touch 44px, --nav 208px, --dialog 880px, --cost 520px,
--table 500px, --radius 6px, --hairline 1px, --focus 2px.
--header is a stable 64px track. Sections are full-width, ruled, without shadows.
Use Lucide icons for navigation and commands, with accessible names/tooltips.
Desktop tables use bounded scrolling and a pinned header/project column.
Below 620px use labelled two-column ledger rows; page overflow is prohibited.
At 900px navigation becomes a dismissible drawer. Numeric fields stay editable.
Modal height is bounded by 100dvh minus --s6 on both edges; header and X stay
reachable. Escape closes the top modal, focus is trapped/restored and background
scrolling is locked. All mobile commands meet --touch.

## Motion And Depth

No decorative motion. Focus uses --focus and --brand. Borders and tonal layering
are the depth system. Modal backdrop is ink at 50% opacity, no floating shadow.

## States And Evidence

All names and totals are synthetic and labelled as such. Search, date presets,
pagination, detail dismissal, cost arithmetic, local message composition and
reset must work. Empty results offer a reset action. Errors use --danger.
Capture actual browser evidence at 390, 768 and 1280 pixels and test
zero HTTP requests, page overflow, keyboard focus, dialog close, reset and math.
