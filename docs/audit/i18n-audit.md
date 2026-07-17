# i18n Audit

## Current Implementation

- `src/app/lib/i18n.ts` exists.
- `AppProvider` stores a `lang` value.
- Profile language selector supports English, Hindi, Tamil, and Telugu values.
- Some shell labels call `t(...)`.

## Classification

Partially implemented.

## Gaps

- The required language preparation includes Hindi, Marathi, Telugu, and other languages; Marathi is not represented in the current `Lang` type.
- Most page text is hard-coded English.
- No message catalog extraction, interpolation rules, pluralization, date/number formatting, or locale fallback policy.
- No RTL or font fallback strategy documented.
- No tests for translated routes/screens.

