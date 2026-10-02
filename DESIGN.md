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
- ML validation evidence is described in prose without company source excerpts
  or test-source downloads. Completed readiness checks are kept distinct from
  future model training and performance evaluation.
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

## Synthetic Demo Navigation

The Prox case and personal portfolio hero link to the independently authored
synthetic demo and its scoped open-source folder. Korean and English entry pages
must resolve to the same demo. The user has explicitly authorized a separate
https://proxsystem.net/ production-site link. This is navigation only: never
publish company source, operational data, credentials, or security configuration.
Reuse the existing hero-actions, text-link, color and spacing tokens.
New token: --demo-link-min-height 44px. New demo links use that minimum touch
height, --space-2/--space-4 padding, --line-width borders, --radius-small corners,
and --color-blue-soft for the primary link. Wrap naturally on narrow screens;
keep existing project/report links and all other portfolio content unchanged.

## Prox ML Portfolio Description

Use the existing skill-row ruled layout for a personal-portfolio section covering
data analysis, source validation, and ML data preparation. Make ML work explicit
in the Prox project summary and the case-study heading. Describe normalization,
reviewer feedback labels, feature snapshots, and training-readiness checks only
where supported by the implementation. Model training, accuracy evaluation, and
production ML inference are not claimed as completed. Explain the completed
data-preparation work separately from those future model-evaluation steps.
Reuse existing colors, typography, spacing, and responsive layouts; no new theme.

## Course Completion Credentials and Entry Links

The personal portfolio lists three supplied Coursera course-completion
certificates with exact course titles, provider, and completion date. They are
not described as exam-based Microsoft or IBM professional certifications.
Use the existing report-row ruled layout, not certificate cards. Link to the
verification URLs printed on the supplied certificates. Do not publish original
PDFs, signatures, local paths, or additional personal identifiers.
Credential links reuse --demo-link-min-height for touch targets.

On the Prox case, make the production homepage the first hero action with the
existing primary-link treatment, and repeat it in the navigation. Preserve the
demo and scoped source links. Version internal links between the four entry pages
so navigation does not reuse the previous cached HTML. Use the same release
identifier for stylesheet requests and entry-page links; no auth changes.
Credential rows start after --space-8 separation from their section heading.
On narrow Prox case viewports, hero-content uses --space-3 gaps and --space-8
vertical padding so the added homepage link does not push controls off-screen.

## Evidence-First Portfolio Update

Show the already published reconciliation result in both Prox and personal
heroes: margin discrepancy 26.01~39.51 percentage points before correction and
0~0.19 after, across four project subtotals. These are business reconciliation
results, not ML model accuracy. Show the scope directly beside the numbers.
Use --font-title for the before value, --font-display for the after value, and
--font-body-small for context. On mobile, use --font-body and --font-number.
Use flex-wrap, --space-3 gaps, and existing muted/green/line colors. No statistic
cards or invented outcomes. Prox project summaries name the performed work.

Personal hero navigation retains homepage/demo/source links; project and report
navigation remains in the header. Replace the generic hero-summary with the
reconciliation evidence. Contact CTA links to a separate unframed section with
the user's explicitly authorized public email and phone. Do not invent a job
target. Use mailto/tel anchors with 44px targets and existing tokens.
Both heroes use compact --space-3 gaps and --space-8 vertical padding on mobile
so evidence, touch targets, and image controls remain reachable.
Personal mobile hero minimum height subtracts --space-12 from the existing
--hero-mobile-min-height to keep a glimpse of the next section beneath navigation.
The Prox mobile hero subtracts --space-8 for the same purpose. English supporting
copy uses a concise literal description to keep mobile navigation and evidence visible.

Reports default to three featured public summaries: procurement-market,
systems-architecture, and manufacturing-data. Preserve all eight reports and
category filtering. The all-reports control reveals the full set without removing
the default curated view. No-JS retains all eight reports with filters hidden.
Featured labels are plain inline text, not pills. Focus and hover remain visible.
ML skills describe personal learning separately from Prox's data-preparation
implementation, with no claimed completed training run or model accuracy.
