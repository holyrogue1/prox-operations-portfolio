# Prox, Dugong and Jahun Lee Portfolio Design Contract

## September 2026 visual extension

User explicitly requests non-white gradient backgrounds and 5-second image changes.
This supersedes the earlier no-gradient and media-only Dugong hero rules below.
Direction: editorial engineering in midnight navy and steel blue. Design variance 4,
motion intensity 3, density 6. Preserve evidence content and redacted product images.
Use the supplied Prox screenshot as the composition reference: left-aligned stable
copy, wide domain photograph, facts below. New imagery is decorative, never product evidence.

New theme tokens (override legacy values for all pages):
canvas #0B1726, paper #122538, ink #EEF5FA, muted #B5C6D7,
line #30485E, strong line #527089, blue #8CC9FF, blue-deep #B5DAFA,
blue-soft #1A3852, green #81DBB1, amber #F2C17D.
New tokens: --color-depth #102E40, --color-footer #081320,
--color-scrim rgba(8,19,32,.94), --color-scrim-mid rgba(8,19,32,.78),
--color-scrim-edge rgba(8,19,32,.22), --hero-image-opacity .72.
Background: 135deg canvas-to-depth gradient; sections: 115deg paper-to-canvas.
Hero overlay: 90deg .94 at 0%, .78 at 45%, .22 at 100%.
Use existing typography and 4px spacing scale. New tokens:
--font-nav 16px, --font-person-min 44px, --font-person-max 80px,
--font-hero-copy 24px, --font-control 14px, --hero-body-max 640px,
--report-cover-width 96px, --report-cover-height 128px,
--motion-gallery 900ms ease-in-out, --hero-interval 5000ms.
Hero: minimum height 720px; image layers absolute and opacity-only crossfade.
Content remains stationary, contrast stays stable through every image change.
Previous/next and pause/play controls use 44px minimum targets, visible focus.
Stop rotation for reduced motion, hidden document and keyboard focus. Users may
explicitly play or pause; failed images are skipped. No-JS shows first image.
Header: three links in document order PROX, DUGONG, 이자헌 포트폴리오.
Wrap as two navigation rows at <=1100px and wrap brands naturally on narrow screens.
Personal page: hero, editorial intro, horizontal capability rows, linked projects,
report library, closing statement. No unsupported metrics or production ML claims.
Reports explicitly distinguish business reports, case studies and learning notes.
Legacy technical evidence content/structure is preserved rather than reformatted
for the new page's composition rules.

## 1. Atmosphere

The page feels like an engineering project dossier: a concrete-gray field
surface, precise blue markings, and restrained editorial typography. The hero
uses a real construction-operations image as evidence of the domain. Copy is
direct and specific, with no product-marketing superlatives.

## 2. Color

| Token | Value | Role |
| --- | --- | --- |
| `--color-canvas` | `#EEF2F5` | page background |
| `--color-paper` | `#FFFFFF` | reading surface |
| `--color-ink` | `#142033` | primary text |
| `--color-muted` | `#5E6B7B` | secondary text |
| `--color-line` | `#C8D2DD` | rules and table lines |
| `--color-line-strong` | `#93A3B4` | prominent rules |
| `--color-blue` | `#0B5FC6` | primary accent and links |
| `--color-blue-deep` | `#083B78` | dark blue text and panels |
| `--color-blue-soft` | `#E3F0FF` | selected facts and labels |
| `--color-green` | `#147A56` | verified state |
| `--color-amber` | `#A34D00` | caution and boundary state |
| `--color-hero-scrim` | `rgba(238, 242, 245, 0.95)` | hero copy contrast |
| `--color-hero-scrim-end` | `rgba(238, 242, 245, 0.20)` | hero image reveal |

All body and background pairs meet WCAG AA contrast. Accent blue is used only
for navigational emphasis and factual highlights.

## 3. Typography

- Font stack: `"Noto Sans KR", "Pretendard Variable", "Segoe UI", sans-serif`.
- Code stack: `ui-monospace, "Cascadia Code", "D2Coding", monospace`.
- `--font-hero-min`: `56px / 0.98 / 760 / 0`.
- `--font-hero-max`: `112px / 0.98 / 760 / 0`.
- `--font-display`: `42px / 1.08 / 740 / 0`.
- `--font-title`: `27px / 1.18 / 720 / 0`.
- `--font-body`: `17px / 1.7 / 480 / 0`.
- `--font-body-small`: `15px / 1.6 / 520 / 0`.
- `--font-label`: `12px / 1.35 / 760 / 0.08em`.
- `--font-number`: `32px / 1 / 760 / 0`.
- `--font-code`: `14px / 1.65 / 480 / 0`.

## 4. Spacing

Base unit is `4px`.

| Token | Value |
| --- | --- |
| `--space-1` | `4px` |
| `--space-2` | `8px` |
| `--space-3` | `12px` |
| `--space-4` | `16px` |
| `--space-5` | `20px` |
| `--space-6` | `24px` |
| `--space-8` | `32px` |
| `--space-10` | `40px` |
| `--space-12` | `48px` |
| `--space-16` | `64px` |
| `--space-20` | `80px` |
| `--space-24` | `96px` |
| `--space-30` | `120px` |
| `--content-max` | `1240px` |
| `--content-pad` | `28px` |
| `--content-pad-mobile` | `20px` |
| `--hero-min-height` | `720px` |
| `--hero-tablet-min-height` | `680px` |
| `--hero-mobile-min-height` | `640px` |
| `--dugong-product-hero-max-height` | `680px` |
| `--ml-step-min-height` | `216px` |
| `--table-min-width` | `760px` |
| `--code-min-width` | `640px` |

## 5. Components

- Rules use `--line-width` with `--color-line` or `--color-line-strong`.
- Navigation links use transparent backgrounds, an underline on hover, and a
  `--color-blue` focus ring.
- The header begins with a paired `PROX | DUGONG` project switcher. Language
  links retain their country code as `EN / US` or `한국어 / KR` without using
  decorative flag imagery.
- The project switcher uses the actual Prox building icon and Dugong product
  mascot as compact square marks, each with a paper border and the shared
  small radius token.
- Facts use a left blue rule and a paper surface. They never carry a floating
  shadow.
- Hero facts communicate the case problem, verified result, and operating
  principle before implementation details.
- The Dugong case presents its actual start screen as a media-only hero. The
  image is not covered by a second display title; the case title and facts live
  in the following reading band.
- Product evidence uses four actual Prox operating-screen captures: home,
  orders, construction and other costs, and analytics. Captions name the
  workflow each screen supports. It is never represented by a drawn mock
  interface.
- Public screen captures preserve the real menu, panel, and table structure,
  while opaque capture-time masks remove customer names, staff names, and
  contract or operational amounts.
- Each capture opens the same redacted asset at its natural size for inspection.
- The ML pipeline uses a numbered process rail, not a fake product screen.
- ML code evidence uses a real, read-only source excerpt on a paper code panel.
  The public panel links to the exact safe source and its test file, and it
  states the non-training boundary beside the source rather than inventing a
  model interface.
- The report-integration band presents source figures as an audit baseline,
  never as a Prox product-performance claim.
- The efficiency roadmap uses a four-part ruled sequence. It reads as a gated
  operating decision, not a product feature grid.
- The process ledger uses a left state label, a work decision, and retained
  evidence. It reads as a case record, not a numbered marketing timeline.
- All links have visible hover and keyboard focus states.

## 6. Motion

- `--motion-fast`: `140ms ease-out`.
- `--motion-base`: `220ms ease-out`.
- `--hero-tablet-image-opacity`: `0.40`.
- Only opacity, transform, and background-color change.
- `prefers-reduced-motion: reduce` disables transition and smooth scrolling.

## 7. Depth

- Depth comes from tonal paper surfaces and one-pixel rules.
- `--shadow-hero`: `0 18px 45px rgba(20, 32, 51, 0.12)` applies only to the
  hero image boundary.
- `--radius-none`: `0`.
- `--radius-small`: `4px`.

## Guardrails

- No raw customer, employee, contract, or credential data is shown.
- ML claims describe data preparation and reviewer-gated learning evidence,
  never autonomous model training or production scoring.
- Report figures retain their scenario or diagnostic context. Internal company
  names and non-public financial details are excluded from the public page.
- Work-process claims distinguish observed outcomes from proposed next steps.
- The closing table describes accountable work and retained deliverables, not
  a generic feature inventory.
- No gradients, purple accents, decorative bokeh, fake product screenshots,
  em dashes, or generic marketing claims.

Existing Prox/Dugong diagnostic grids and code labels remain as factual evidence layouts.
The no-three-card/eyebrow limits apply to newly authored promotional composition, not retained technical tables.
Report detail pages deliberately use text-first document layouts instead of decorative cover images.
