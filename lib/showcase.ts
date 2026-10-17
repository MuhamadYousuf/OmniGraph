import receipt from "../public/benchmarks/fixture-receipt.json";

export { receipt };
export const number = (value: number) =>
  new Intl.NumberFormat("en-US").format(value);
export const navigation = [
  { href: "/", label: "Software" },
  { href: "/platform", label: "Platform" },
  { href: "/solutions", label: "Solutions" },
  { href: "/security", label: "Security" },
  { href: "/benchmarks", label: "Benchmarks" },
  { href: "/contact", label: "Contact" },
];

export const cypher = `// Run once before loading the batch
CREATE CONSTRAINT customer_key IF NOT EXISTS
FOR (c:Customer) REQUIRE c.customer_id IS UNIQUE;

// Execute with the driver parameter { rows }
UNWIND $rows AS row
MERGE (c:Customer {customer_id: row.customer_id})
SET c.email_key = row.email_key,
    c.display_name = row.display_name;`;

export const industries = [
  {
    id: "aml",
    title: "Financial Crime & AML",
    short: "Financial services",
    code: "FIN / 01",
    question: "When money returns to its origin, can you see the route?",
    description:
      "Resolve accounts across ledgers, then traverse transfers to surface circular payment paths for an investigator to review.",
    entities: ["Account", "Transfer", "Beneficiary", "Entity"],
    relation: "SENT → RECEIVED → CONTROLLED_BY",
    metric: "3-hop",
    metricLabel: "illustrative investigation path",
    slug: "financial-services",
  },
  {
    id: "revenue",
    title: "B2B SaaS Reconciliation",
    short: "Revenue operations",
    code: "REV / 02",
    question: "Which customer actually paid for the revenue you booked?",
    description:
      "Connect Salesforce accounts, ERP invoices, and Stripe payments at a shared customer grain. Reconcile commercial activity before calculating retention.",
    entities: ["Customer", "Invoice", "Payment", "Subscription"],
    relation: "BILLED → SETTLED_BY → BELONGS_TO",
    metric: "4",
    metricLabel: "connected entity types",
    slug: "revenue-operations",
  },
  {
    id: "health",
    title: "Healthcare Revenue Cycle",
    short: "Revenue cycle",
    code: "HCR / 03",
    question: "Where does a claim stop moving toward payment?",
    description:
      "Follow encounters, claims, payers, and remittances through the revenue cycle. Keep patient identifiers inside the governed local boundary.",
    entities: ["Encounter", "Claim", "Payer", "Remittance"],
    relation: "GENERATES → SUBMITTED_TO → SETTLED_BY",
    metric: "4",
    metricLabel: "stages in the reference schema",
    slug: "healthcare",
  },
  {
    id: "supply",
    title: "Supply Chain Topology",
    short: "Supply chain",
    code: "SCM / 04",
    question: "Which orders depend on a supplier you cannot replace?",
    description:
      "Connect suppliers, facilities, shipments, and customer commitments to inspect multi-tier dependencies before a disruption travels downstream.",
    entities: ["Supplier", "Facility", "Shipment", "Customer"],
    relation: "SUPPLIES → DISPATCHES → DELIVERS_TO",
    metric: "3-tier",
    metricLabel: "reference dependency path",
    slug: "supply-chain",
  },
] as const;
export type IndustryId = (typeof industries)[number]["id"];

export const agents = [
  {
    id: "01",
    title: "Schema Deducer",
    role: "Infer structure from a statistical profile.",
    input:
      "Column names, data types, null rates, cardinalities, and candidate key statistics. No source cell values.",
    output:
      "A proposed ontology: entity labels, natural keys, relationship types, and confidence annotations.",
    failure:
      "Ambiguous joins are surfaced for review. A low-confidence match never silently becomes an entity merge.",
    code: '{ "entity": "Customer", "key": "customer_id",\n  "candidate_edge": "Customer—BILLED→Invoice" }',
  },
  {
    id: "02",
    title: "Code Generator",
    role: "Compile a mapping into executable SQL.",
    input:
      "The accepted ontology, explicit normalization rules, and the source schema contract.",
    output:
      "Versioned DuckDB transformations and parameterized Cypher batches, tied to the profile and mapping version.",
    failure:
      "Parsing, type checks, allowlisted operations, and a bounded fixture must pass before the full transformation is released.",
    code: "SELECT customer_id, lower(trim(email)) AS email_key\nFROM source_customers WHERE customer_id IS NOT NULL;",
  },
  {
    id: "03",
    title: "Validator Agent",
    role: "Reconcile the result before projection.",
    input:
      "Source and canonical counts, duplicate groups, null keys, and relationship endpoints.",
    output:
      "A count reconciliation, orphan-key report, rejected-row register, and an explicit pass or fail decision.",
    failure:
      "Missing endpoints go to quarantine. Failed invariants block promotion; source-to-node count equality is never assumed.",
    code: "input_rows = canonical_entities\n           + duplicate_rows_collapsed + rejected_rows",
  },
  {
    id: "04",
    title: "Graph Reasoning Agent",
    role: "Translate questions into bounded traversals.",
    input:
      "The graph schema, approved query patterns, user parameters, and the caller’s access context.",
    output:
      "Read-only Cypher with bounded traversal depth, parameters, and a result limit.",
    failure:
      "When model inference is unavailable, approved parameterized templates remain available offline. Unsupported questions are returned for review.",
    code: "MATCH (c:Customer {customer_id: $customerId})\n      -[:BILLED]->(i:Invoice)\nRETURN i.invoice_id, i.balance LIMIT 100;",
  },
];
