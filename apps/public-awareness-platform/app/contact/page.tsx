"use client";

import { useState } from "react";
import SectionHeader from "@/components/ui/SectionHeader";
import Link from "next/link";

type RequestCategory =
  | ""
  | "guidance-before-reporting"
  | "rights-information"
  | "case-status"
  | "support-referral"
  | "policy-question"
  | "other";

const categories: { value: RequestCategory; label: string }[] = [
  { value: "guidance-before-reporting", label: "Guidance before reporting" },
  { value: "rights-information", label: "Understanding my rights" },
  { value: "case-status", label: "Case status enquiry" },
  { value: "support-referral", label: "Support and referral request" },
  { value: "policy-question", label: "Policy question" },
  { value: "other", label: "Other" },
];

const officeContacts = [
  {
    name: "Committee Secretariat",
    role: "General enquiries, guidance before reporting, rights questions",
    phone: "+233 302 213 870",
    email: "safespace@ug.edu.gh",
    location: "Student Services Building, Room 204, Main Campus",
    hours: "Monday – Friday, 8:00 AM – 4:00 PM",
  },
  {
    name: "University Counselling Centre",
    role: "Confidential emotional and psychological support",
    phone: "+233 302 213 850",
    email: "counselling@ug.edu.gh",
    location: "Commonwealth Hall Road, Main Campus",
    hours: "Monday – Friday, 8:00 AM – 5:00 PM",
  },
  {
    name: "Campus Security",
    role: "Immediate safety emergencies — available 24 hours",
    phone: "+233 302 213 820",
    email: "security@ug.edu.gh",
    location: "Main Gate Security Post",
    hours: "24 hours, 7 days a week",
    urgent: true,
  },
];

export default function ContactPage() {
  const [category, setCategory] = useState<RequestCategory>("");
  const [message, setMessage] = useState("");
  const [anonymous, setAnonymous] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="pt-16">
      {/* Hero */}
      <div className="bg-ug-blue-deep py-20 sm:py-28 relative overflow-hidden">
        <div aria-hidden="true" className="absolute inset-0 pointer-events-none select-none">
          <div className="absolute right-0 top-0 w-1/2 h-full bg-ug-blue opacity-30" style={{ clipPath: "polygon(20% 0%, 100% 0%, 100% 100%, 0% 100%)" }} />
          <div className="absolute left-0 bottom-0 w-full h-px bg-ug-gold opacity-40" />
        </div>
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="h-px w-8 bg-ug-gold" />
            <span className="text-ug-gold-light text-xs font-bold tracking-widest uppercase">Contact & Help</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-black text-white leading-[1.05] tracking-tight max-w-3xl">
            Get Guidance. Ask a Question. Request Support.
          </h1>
          <p className="mt-6 text-lg text-white/70 leading-relaxed max-w-2xl">
            You can contact the committee confidentially at any stage — before reporting, during an investigation, or if you simply have a question about the policy.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">

          {/* Contact form */}
          <div className="lg:col-span-7">
            {submitted ? (
              <div className="border border-ug-blue/30 bg-ug-blue-pale p-10 text-center">
                <div className="w-12 h-12 flex items-center justify-center bg-ug-blue text-white mx-auto mb-5">
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5} aria-hidden="true">
                    <path strokeLinecap="square" strokeLinejoin="miter" d="M4.5 12.75l6 6 9-13.5" />
                  </svg>
                </div>
                <h2 className="text-2xl font-black text-text-primary mb-3">Message Received</h2>
                <p className="text-text-secondary text-sm leading-relaxed max-w-md mx-auto mb-6">
                  The committee secretariat will respond within 1 working day. All communications are treated as confidential.
                </p>
                <button
                  onClick={() => { setSubmitted(false); setMessage(""); setCategory(""); setName(""); setEmail(""); setAnonymous(false); }}
                  className="inline-flex items-center gap-2 px-5 py-2.5 border border-ug-blue text-ug-blue text-sm font-bold hover:bg-ug-blue hover:text-white transition-colors"
                >
                  Send Another Message
                </button>
              </div>
            ) : (
              <>
                <SectionHeader
                  eyebrow="Contact Form"
                  title="Send a Message to the Committee"
                  subtitle="This form is for guidance requests, questions, and support referrals. If you are ready to file a formal complaint, use the secure reporting portal."
                />

                <div className="mt-4 p-4 bg-ug-gold-pale border border-ug-gold/30 text-sm text-text-primary">
                  <strong>For formal reports:</strong>{" "}
                  <a
                    href="https://report.safespace.ug.edu.gh"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-ug-blue font-bold underline underline-offset-2 hover:text-ug-blue-mid"
                  >
                    Use the secure reporting portal
                  </a>{" "}
                  instead of this form.
                </div>

                <form onSubmit={handleSubmit} className="mt-8 space-y-6" noValidate>
                  {/* Anonymous toggle */}
                  <div className="flex items-center justify-between p-4 bg-surface border border-border">
                    <div>
                      <p className="text-sm font-bold text-text-primary">Send anonymously</p>
                      <p className="text-xs text-text-muted mt-0.5">
                        Your message will be received without identifying you
                      </p>
                    </div>
                    <button
                      type="button"
                      role="switch"
                      aria-checked={anonymous}
                      onClick={() => setAnonymous(!anonymous)}
                      className={`relative w-12 h-6 transition-colors duration-200 focus-visible:outline-2 focus-visible:outline-ug-gold focus-visible:outline-offset-2 ${
                        anonymous ? "bg-ug-blue" : "bg-border"
                      }`}
                    >
                      <span
                        className={`absolute top-1 w-4 h-4 bg-white transition-all duration-200 ${
                          anonymous ? "left-7" : "left-1"
                        }`}
                      />
                    </button>
                  </div>

                  {/* Identity fields (conditional) */}
                  {!anonymous && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label htmlFor="contact-name" className="block text-xs font-bold uppercase tracking-wide text-text-primary mb-2">
                          Your Name
                        </label>
                        <input
                          id="contact-name"
                          type="text"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          className="w-full border border-border px-4 py-3 text-sm text-text-primary bg-white focus:outline-none focus:border-ug-blue placeholder:text-text-muted"
                          placeholder="Full name"
                          autoComplete="name"
                        />
                      </div>
                      <div>
                        <label htmlFor="contact-email" className="block text-xs font-bold uppercase tracking-wide text-text-primary mb-2">
                          Email Address
                        </label>
                        <input
                          id="contact-email"
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          className="w-full border border-border px-4 py-3 text-sm text-text-primary bg-white focus:outline-none focus:border-ug-blue placeholder:text-text-muted"
                          placeholder="your@email.com"
                          autoComplete="email"
                        />
                      </div>
                    </div>
                  )}

                  {/* Category */}
                  <div>
                    <label htmlFor="request-category" className="block text-xs font-bold uppercase tracking-wide text-text-primary mb-2">
                      Nature of Request <span className="text-ug-blue normal-case font-normal lowercase tracking-normal">(required)</span>
                    </label>
                    <select
                      id="request-category"
                      value={category}
                      onChange={(e) => setCategory(e.target.value as RequestCategory)}
                      required
                      className="w-full border border-border px-4 py-3 text-sm text-text-primary bg-white focus:outline-none focus:border-ug-blue appearance-none"
                    >
                      <option value="" disabled>Select the type of request…</option>
                      {categories.map((c) => (
                        <option key={c.value} value={c.value}>{c.label}</option>
                      ))}
                    </select>
                  </div>

                  {/* Message */}
                  <div>
                    <label htmlFor="contact-message" className="block text-xs font-bold uppercase tracking-wide text-text-primary mb-2">
                      Your Message <span className="text-ug-blue normal-case font-normal lowercase tracking-normal">(required)</span>
                    </label>
                    <textarea
                      id="contact-message"
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      required
                      rows={6}
                      className="w-full border border-border px-4 py-3 text-sm text-text-primary bg-white focus:outline-none focus:border-ug-blue placeholder:text-text-muted resize-none"
                      placeholder="Describe your question or what guidance you are looking for. You do not need to include personal details about an incident at this stage."
                    />
                    <p className="mt-2 text-xs text-text-muted">
                      All messages are treated as confidential. Do not include full case details in this form — use the secure reporting portal for formal submissions.
                    </p>
                  </div>

                  <button
                    type="submit"
                    disabled={!category || !message}
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 bg-ug-blue text-white font-bold text-sm tracking-wide hover:bg-ug-blue-mid transition-colors disabled:opacity-40 disabled:cursor-not-allowed focus-visible:outline-2 focus-visible:outline-ug-gold focus-visible:outline-offset-2"
                  >
                    Send Message
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5} aria-hidden="true">
                      <path strokeLinecap="square" strokeLinejoin="miter" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" />
                    </svg>
                  </button>
                </form>
              </>
            )}
          </div>

          {/* Office information */}
          <aside className="lg:col-span-5 space-y-5">
            <SectionHeader
              eyebrow="Office Contacts"
              title="Direct Contact Information"
            />

            <div className="space-y-4 mt-6">
              {officeContacts.map((office) => (
                <div
                  key={office.name}
                  className={`border p-5 ${
                    office.urgent
                      ? "border-ug-gold bg-ug-gold-pale"
                      : "border-border bg-surface"
                  }`}
                >
                  {office.urgent && (
                    <span className="inline-block mb-2 text-[10px] font-black uppercase tracking-widest bg-ug-gold text-ug-blue-dark px-2 py-0.5">
                      Emergency — 24/7
                    </span>
                  )}
                  <h3 className="font-bold text-text-primary text-sm mb-1">{office.name}</h3>
                  <p className="text-xs text-text-muted mb-4 leading-relaxed">{office.role}</p>

                  <div className="space-y-2">
                    <a href={`tel:${office.phone.replace(/\s/g, "")}`} className="flex items-center gap-2 text-sm font-bold text-ug-blue hover:text-ug-blue-mid transition-colors">
                      <svg className="w-3.5 h-3.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" />
                      </svg>
                      {office.phone}
                    </a>
                    <a href={`mailto:${office.email}`} className="flex items-center gap-2 text-xs text-text-secondary hover:text-ug-blue transition-colors">
                      <svg className="w-3.5 h-3.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
                        <path strokeLinecap="square" strokeLinejoin="miter" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
                      </svg>
                      {office.email}
                    </a>
                    <p className="flex items-start gap-2 text-xs text-text-muted">
                      <svg className="w-3.5 h-3.5 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
                        <path strokeLinecap="square" strokeLinejoin="miter" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="square" strokeLinejoin="miter" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
                      </svg>
                      {office.location}
                    </p>
                    <p className="text-xs text-text-muted italic pl-5">{office.hours}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Quick links */}
            <div className="bg-white border border-border p-5 mt-4">
              <p className="text-xs font-bold uppercase tracking-widest text-text-muted mb-4">Quick Actions</p>
              <div className="space-y-2.5">
                <a
                  href="https://report.safespace.ug.edu.gh"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between w-full px-4 py-3 bg-ug-gold text-ug-blue-dark font-bold text-sm hover:bg-ug-gold-light transition-colors"
                >
                  <span>File a Formal Report</span>
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5} aria-hidden="true">
                    <path strokeLinecap="square" strokeLinejoin="miter" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
                  </svg>
                </a>
                <Link
                  href="/your-rights"
                  className="flex items-center justify-between w-full px-4 py-3 bg-surface border border-border text-text-primary font-medium text-sm hover:border-ug-blue/30 transition-colors"
                >
                  <span>Read Your Rights</span>
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5} aria-hidden="true">
                    <path strokeLinecap="square" strokeLinejoin="miter" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </Link>
                <Link
                  href="/support-resources"
                  className="flex items-center justify-between w-full px-4 py-3 bg-surface border border-border text-text-primary font-medium text-sm hover:border-ug-blue/30 transition-colors"
                >
                  <span>Find Support Services</span>
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5} aria-hidden="true">
                    <path strokeLinecap="square" strokeLinejoin="miter" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </Link>
              </div>
            </div>
          </aside>

        </div>
      </div>
    </div>
  );
}
