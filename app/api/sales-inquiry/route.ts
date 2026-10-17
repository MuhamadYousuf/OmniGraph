import { NextResponse } from "next/server";

export const runtime = "nodejs";

const MAX_BODY_BYTES = 12_000;
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const TOPICS = new Set([
  "Entity resolution",
  "Data reconciliation",
  "Knowledge graphs",
  "Something else",
]);

type SalesInquiry = {
  name: string;
  email: string;
  company: string;
  role: string;
  topic: string;
  message: string;
  website: string;
};

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function readField(
  body: Record<string, unknown>,
  field: keyof SalesInquiry,
  maxLength: number,
): string | null {
  const value = body[field];
  if (typeof value !== "string" || value.length > maxLength) return null;
  return value.trim();
}

function escapeHtml(value: string): string {
  return value.replace(/[&<>"']/g, (character) => {
    switch (character) {
      case "&":
        return "&amp;";
      case "<":
        return "&lt;";
      case ">":
        return "&gt;";
      case '"':
        return "&quot;";
      default:
        return "&#39;";
    }
  });
}

function json(
  body: { message?: string; error?: string },
  status: number,
) {
  return NextResponse.json(body, {
    status,
    headers: { "Cache-Control": "no-store" },
  });
}

export async function POST(request: Request) {
  if (!request.headers.get("content-type")?.includes("application/json")) {
    return json({ error: "Submit the inquiry using the website form." }, 415);
  }

  const contentLength = Number(request.headers.get("content-length") ?? 0);
  if (contentLength > MAX_BODY_BYTES) {
    return json({ error: "The submitted inquiry is too large." }, 413);
  }

  let rawBody: unknown;
  try {
    rawBody = await request.json();
  } catch {
    return json({ error: "The submitted inquiry is not valid JSON." }, 400);
  }
  if (!isRecord(rawBody)) {
    return json({ error: "The submitted inquiry is invalid." }, 400);
  }

  const name = readField(rawBody, "name", 100);
  const email = readField(rawBody, "email", 254);
  const company = readField(rawBody, "company", 120);
  const role = readField(rawBody, "role", 120);
  const topic = readField(rawBody, "topic", 100);
  const message = readField(rawBody, "message", 3000);
  const website = readField(rawBody, "website", 500);

  if (
    name === null ||
    email === null ||
    company === null ||
    role === null ||
    topic === null ||
    message === null ||
    website === null ||
    !name ||
    !email ||
    !company ||
    !topic ||
    !message ||
    !EMAIL_PATTERN.test(email) ||
    !TOPICS.has(topic)
  ) {
    return json(
      { error: "Check the required fields and email address, then try again." },
      400,
    );
  }
  if (website) {
    return json({ error: "The inquiry could not be submitted." }, 400);
  }

  const apiKey = process.env.RESEND_API_KEY;
  const recipient = process.env.SALES_INBOX_EMAIL;
  const sender = process.env.SALES_FROM_EMAIL;
  if (!apiKey || !recipient || !sender) {
    console.error(
      "Sales inquiry email is not configured. Set RESEND_API_KEY, SALES_INBOX_EMAIL, and SALES_FROM_EMAIL.",
    );
    return json(
      { error: "The inquiry form is temporarily unavailable. Please try again later." },
      503,
    );
  }

  const details = [
    ["Name", name],
    ["Email", email],
    ["Company", company],
    ["Role", role || "Not provided"],
    ["Topic", topic],
    ["Message", message],
  ] as const;
  const html = `<h1>New OmniGraph sales inquiry</h1><dl>${details
    .map(
      ([label, value]) =>
        `<dt><strong>${escapeHtml(label)}</strong></dt><dd>${escapeHtml(value).replace(/\n/g, "<br>")}</dd>`,
    )
    .join("")}</dl>`;
  const text = details.map(([label, value]) => `${label}:\n${value}`).join("\n\n");

  let response: Response;
  try {
    response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: sender,
        to: [recipient],
        reply_to: email,
        subject: "New OmniGraph sales inquiry",
        html,
        text,
      }),
      signal: AbortSignal.timeout(15_000),
      cache: "no-store",
    });
  } catch (error) {
    console.error("Sales inquiry email request failed.", error);
    return json(
      { error: "We couldn’t send your inquiry. Please try again later." },
      502,
    );
  }

  if (!response.ok) {
    console.error(
      `Sales inquiry email provider returned HTTP ${response.status}.`,
    );
    return json(
      { error: "We couldn’t send your inquiry. Please try again later." },
      502,
    );
  }

  return json(
    { message: "Thanks for reaching out. We’ll be in touch soon." },
    200,
  );
}
