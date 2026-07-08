# JungleAudit

Privacy-focused, open-source Amazon spend analyzer. Drop your Amazon.in "Request My Data" export into the browser and get real financial analysis — entirely client-side.

## Privacy model

- **100% client-side.** No backend, no database server, no data uploads.
- Analysis runs in your browser using DuckDB-Wasm.
- Your export files never leave your device.

## Supported files

Core spend analysis uses:

- `Order History.csv`
- `Digital Content Orders.csv`

Additional Amazon export files are ingested and schema-mapped for future analysis (cart history, returns, refunds, etc.).

## Development

```bash
pnpm install
pnpm dev
```

Build static output:

```bash
pnpm build
pnpm preview
```

## Tech stack

- Vite + React + TypeScript
- DuckDB-Wasm (SQL analytics in-browser)
- Tailwind CSS + shadcn-style components
- Observable Plot

## License

MIT