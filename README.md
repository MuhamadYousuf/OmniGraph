# OmniGraph enterprise showcase

An independent Next.js App Router website. The folder owns its manifest, lockfile, dependency tree, routes, assets, and benchmark fixture. Next.js build and tracing roots are pinned to this directory.

## Local development

Requires Node.js 20.9+ and pnpm 11.

```powershell
cd C:\Users\gutech\Desktop\Omni-Graph-1\omnigraph-showcase-site
pnpm install
pnpm dev --port 3100
```

Open <http://localhost:3100>. After moving the folder, change into its new location before running these commands. Standard npm script equivalents (`npm run dev`, `npm run build`) also work when npm is available.

## Routes

- `/`: editorial overview, interactive pipeline tabs, hover/focus industry matrix, execution canvas, and reconciliation receipt.
- `/platform`: Sample–Profile–Compile architecture, engine responsibilities, and expandable agent contracts.
- `/solutions`: financial services, SaaS revenue operations, supply chain, and healthcare reference models.
- `/security`: deployment perimeter, metadata-only payload demonstration, redaction policy, and audit integrity.
- `/benchmarks`: measured local fixture, transparent comparison scope, cost model, hardware, and reproduction instructions.
- `/contact`: sales inquiry form. Submissions are validated server-side and delivered through Resend; the recipient address is read only from server environment configuration.

## Sales inquiry email

The form sends inquiry details from the Next.js server to Resend. Before enabling it in Vercel, configure these environment variables in the project's settings for each environment that should send mail:

- `RESEND_API_KEY`: a Resend API key with permission to send email.
- `SALES_INBOX_EMAIL`: the private destination inbox. Set its value only in Vercel's server-side environment-variable settings; it is never included in client code.
- `SALES_FROM_EMAIL`: a sender address on a domain verified with Resend.

Redeploy after changing environment variables. Without all three values, the endpoint returns an explicit unavailable response and does not claim that an inquiry was sent. Keep all values out of `NEXT_PUBLIC_*` variables and source control.

## Verification

```powershell
pnpm lint
pnpm build
```

## Reproduce the benchmark

```powershell
pnpm benchmark
```

The script creates 500,000 synthetic Parquet rows inside `.benchmark-work`, runs three DuckDB transforms, checks for 447,000 canonical entities and matching checksums, and writes `public/benchmarks/fixture-receipt.json` plus its SHA-256 sidecar. The website reads this receipt directly.

Timing covers the scan, normalization, grouping, and in-memory table materialization. Fixture generation, auditing, AI compilation, Neo4j persistence, and network activity are excluded. Consecutive runs do not flush the OS cache. The Cypher canvas is a reference query, not a live graph benchmark. The cost calculator is an explicit hypothetical token model, not a vendor price claim.

The frontend uses reference domain schemas and security deployment specifications. It does not connect to the main OmniGraph product, a model service, or a Neo4j database. JSON receipts are mutable files; production immutability requires independently protected digests and append-only retention controls.
