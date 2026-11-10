# EagleTrack Public Portfolio

This directory is an independently authored public presentation prototype.
It does not contain the C# company application, database, production code,
workbooks, connection settings or business records.

- `index.html`: Korean case study, design and traceability explanation.
- `demo/index.html`: synthetic browser-only direct-entry demo. No Excel uploads.
- `demo/model.js`: isolated sample calculations and validation.
- `assets/demo-*.png`: screenshots captured from this synthetic demo.
- `assets/wpf-demo-*.png`: native C# WPF captures from an isolated run using
  synthetic data and neutral organization labels.
- `assets/hero-*.webp`: generated illustrations of a fictional manufacturing line
  and monitoring room; neither is an application screenshot.
- `assets/eagletrack.svg`: user-provided product mark; not included in a software license.
- `demo/vendor`: Lucide icons with their upstream license.

## Scope

Every demo project represents one finished product. Stages store cumulative
quantities in a single explicit product unit. Null is missing; zero is a value.
Remaining quantity is order minus construction. Negative means overrun.
Stage differences indicate a difference, not necessarily a business error.

Expected material quantity = finished-product production quantity * BOM usage.
Both sides use the same BOM unit price. Each row amount is rounded to integer
KRW before totals. Totals only sum comparable rows and show coverage.
Production instruction quantities are NOT actual material consumption.
No speculative unit conversion, production integration, ML or authentication.

User entries and before/after history stay in localStorage on this browser.
History can be reset; it is demonstrative, not an immutable audit system.
Do not enter sensitive data. The portfolio hosting service may receive ordinary
page requests, but this demo has no form submission or analytics endpoint.

## Verification

Run `node --test eagletrack/demo/tests/model.test.cjs` from the portfolio root.
The static demo can also be opened directly in a browser.
PLM/PDM/PMS/SCM/MES in the case study describe integration domains and future
scope, not a claim that all enterprise modules are complete.

## C# Product Versus Web Prototype

The private application uses C#, .NET 10, WPF and ASP.NET Core with separate
Contracts, Domain, Application and Infrastructure projects. Only high-level
architecture and selected synthetic captures are published. Company source,
executables and operational records remain private. The JavaScript browser
demo and its screenshots are independent.
