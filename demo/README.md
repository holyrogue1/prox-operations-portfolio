# Prox Synthetic Operations Demo

[Live demo](https://holyrogue1.github.io/prox-operations-portfolio/demo/)

An independently authored, interactive portfolio prototype with seven views:
dashboard, orders, construction, sales, receivables, illustrative cost arithmetic,
and illustrative reconciliation. Every project, company, person and amount is
fabricated for this demo. It is not the production application.

## Run And Edit

Open `index.html` in a regular browser, or serve this folder with a static server.
There is no backend, account, installation, build dependency or database.
Edit the files in `source/`, then run `node build.mjs` to regenerate `index.html`.
The build uses only Node's standard library. Icons and the existing public
portfolio mark are embedded so the page works without external asset requests.

## Behavior

Responsive views, search, date presets, pagination, project detail dialogs,
keyboard dismissal, illustrative unit-price arithmetic, synthetic messages and
reset are implemented locally. Edits exist only in page memory. Refreshing or
resetting restores the fabricated fixtures. The demo does not send mail or log in
to any service, and it does not reproduce company pricing or approval rules.

## Publication Boundary

This folder contains only the separately authored demonstration. Company
application source, database records, spreadsheets, schemas, business formulas,
credentials, operational configuration and security implementations are excluded.
There are no production links, service connections, cookies or browser storage.
Do not add production data or company source to this folder.

## License Scope

The MIT license in this folder covers only the independently authored demo code
and fabricated fixtures here. It does not license the rest of this repository,
the company's application, or its name and logo. The existing public portfolio
mark is not included in the MIT grant. Bundled third-party material retains its
own notices in `THIRD_PARTY_NOTICES.txt`.
