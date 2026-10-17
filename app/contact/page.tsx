import type { Metadata } from "next";
import { ArrowUpRight } from "lucide-react";
import { SalesForm } from "../components/sales-form";

export const metadata: Metadata = {
  title: "Talk to sales",
  description:
    "Tell us about your data challenge and the OmniGraph team will follow up.",
};

const inquiryTopics = [
  ["01", "Entity resolution", "Unify records across disconnected systems."],
  ["02", "Data reconciliation", "Make operational and financial data agree."],
  ["03", "Knowledge graphs", "Explore the relationships behind your data."],
];

export default function ContactPage() {
  return (
    <>
      <section className="contact-intro page-width">
        <div>
          <div className="section-tag mono">OMNIGRAPH // SALES INQUIRY</div>
          <h1>
            Let’s make your
            <br />
            data <span>connect.</span>
          </h1>
          <p>
            Tell us what you’re working through. We’ll learn about your use
            case and help you decide whether OmniGraph is a fit.
          </p>
          <div className="contact-topics" aria-label="Common inquiry topics">
            {inquiryTopics.map(([index, title, description]) => (
              <div className="contact-topic" key={index}>
                <span className="mono">{index}</span>
                <div>
                  <h2>{title}</h2>
                  <p>{description}</p>
                </div>
                <ArrowUpRight size={17} aria-hidden="true" />
              </div>
            ))}
          </div>
        </div>
        <div className="contact-form-panel">
          <div className="contact-form-heading">
            <div>
              <span className="mono">START A CONVERSATION</span>
              <h2>Tell us about your project.</h2>
            </div>
            <span className="mono">01 / 01</span>
          </div>
          <SalesForm />
        </div>
      </section>
    </>
  );
}
