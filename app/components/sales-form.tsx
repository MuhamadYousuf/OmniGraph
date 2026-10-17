"use client";

import { useState, type FormEvent } from "react";
import { ArrowUpRight } from "lucide-react";

export function SalesForm() {
  const [submitting, setSubmitting] = useState(false);
  const [status, setStatus] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitting(true);
    setStatus("");

    const form = event.currentTarget;
    try {
      const response = await fetch("/api/sales-inquiry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(Object.fromEntries(new FormData(form))),
      });
      const result: unknown = await response.json();
      if (
        !response.ok ||
        typeof result !== "object" ||
        result === null ||
        !("message" in result) ||
        typeof result.message !== "string"
      ) {
        setStatus(
          typeof result === "object" &&
            result !== null &&
            "error" in result &&
            typeof result.error === "string"
            ? result.error
            : "We couldn’t send your inquiry. Please try again.",
        );
        return;
      }
      setStatus(result.message);
      form.reset();
    } catch {
      setStatus(
        "We couldn’t reach the server. Check your connection and try again.",
      );
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form className="sales-form" onSubmit={handleSubmit}>
      <div className="sales-form-row">
        <label>
          <span>Name <span aria-hidden="true">*</span></span>
          <input
            autoComplete="name"
            maxLength={100}
            name="name"
            placeholder="Your name"
            required
          />
        </label>
        <label>
          <span>Work email <span aria-hidden="true">*</span></span>
          <input
            autoComplete="email"
            maxLength={254}
            name="email"
            placeholder="you@company.com"
            required
            type="email"
          />
        </label>
      </div>
      <div className="sales-form-row">
        <label>
          <span>Company <span aria-hidden="true">*</span></span>
          <input
            autoComplete="organization"
            maxLength={120}
            name="company"
            placeholder="Your organization"
            required
          />
        </label>
        <label>
          <span>Role</span>
          <input
            autoComplete="organization-title"
            maxLength={120}
            name="role"
            placeholder="e.g. Data engineering lead"
          />
        </label>
      </div>
      <label>
        <span>What would you like to explore? <span aria-hidden="true">*</span></span>
        <select name="topic" defaultValue="" required>
          <option disabled value="">
            Select a topic
          </option>
          <option>Entity resolution</option>
          <option>Data reconciliation</option>
          <option>Knowledge graphs</option>
          <option>Something else</option>
        </select>
      </label>
      <label>
        <span>What are you working on? <span aria-hidden="true">*</span></span>
        <textarea
          maxLength={3000}
          name="message"
          placeholder="Share a little about your data, systems, or goals."
          required
          rows={5}
        />
      </label>
      <div className="sales-form-honeypot" aria-hidden="true">
        <label>
          Website
          <input
            autoComplete="off"
            name="website"
            tabIndex={-1}
          />
        </label>
      </div>
      <div className="sales-form-submit">
        <p>
          Your details are used to respond to this inquiry. Fields marked{" "}
          <span aria-hidden="true">*</span> are required.
        </p>
        <button className="sales-submit-button" disabled={submitting} type="submit">
          {submitting ? "Sending…" : "Send inquiry"}
          <ArrowUpRight size={17} />
        </button>
      </div>
      <p className="sales-form-status" aria-live="polite" role="status">
        {status}
      </p>
    </form>
  );
}
