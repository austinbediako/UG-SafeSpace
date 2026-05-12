import SectionHeader from "@/components/ui/SectionHeader";
import Link from "next/link";

const rights = [
  {
    number: "01",
    title: "Right to Pursue Redress",
    body: "Any member of the University Community who believes that he or she has been a victim of sexual harassment and/or misconduct is entitled to pursue the matter and utilize the procedures described under this Policy for redress. (Section 5.3)",
  },
  {
    number: "02",
    title: "Right to Non-Retaliation",
    body: "The complainant shall not be reprimanded, retaliated against, or discriminated against in any way for initiating an inquiry or complaint in good faith. (Section 5.3)",
  },
  {
    number: "03",
    title: "Presumption of Innocence",
    body: "A person against whom a complaint is lodged shall be presumed innocent of that charge unless and until there is a final finding of culpability by the Committee or a stipulated admission to the charge. (Section 5.4)",
  },
  {
    number: "04",
    title: "Right to Representation by Counsel",
    body: "A complainant and a respondent in a sexual harassment or sexual misconduct matter have the right to representation by counsel. (Section 5.5)",
  },
  {
    number: "05",
    title: "Right to Appeal",
    body: "If dissatisfied with the outcome of investigations and/or the decision of the Committee, both the complainant and the respondent have a right of appeal to the University of Ghana Appeals Board. (Annex III(i))",
  },
];

export default function RightsSection() {
  return (
    <section
      className="py-20 sm:py-28 bg-ug-blue-deep relative overflow-hidden"
      aria-labelledby="rights-heading"
    >
      {/* Background geometric */}
      <div aria-hidden="true" className="absolute inset-0 pointer-events-none select-none">
        <div
          className="absolute right-0 top-0 w-1/3 h-full opacity-10"
          style={{
            backgroundImage: "linear-gradient(135deg, var(--ug-gold) 1px, transparent 1px), linear-gradient(45deg, var(--ug-gold) 1px, transparent 1px)",
            backgroundSize: "40px 40px",
          }}
        />
        <div className="absolute left-0 bottom-0 w-64 h-64 border border-white/5" style={{ transform: "rotate(-20deg) translate(-30%, 30%)" }} />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
          {/* Left */}
          <div>
            <SectionHeader
              eyebrow="Your Rights"
              title="You Have Rights. Know Them."
              subtitle="The University of Ghana policy guarantees specific rights to everyone involved in a misconduct process. These rights cannot be waived or ignored."
              light
            />
            <div className="mt-8">
              <Link
                href="/your-rights"
                className="inline-flex items-center gap-2 px-6 py-3 bg-ug-gold text-ug-blue-dark text-sm font-bold tracking-wide hover:bg-ug-gold-light transition-colors duration-200"
              >
                Read Your Full Rights
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5} aria-hidden="true">
                  <path strokeLinecap="square" strokeLinejoin="miter" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Link>
            </div>
          </div>

          {/* Right: rights list */}
          <div className="space-y-px" role="list">
            {rights.map((right) => (
              <div
                key={right.number}
                role="listitem"
                className="group flex gap-5 p-5 bg-white/5 border-l-2 border-transparent hover:border-ug-gold hover:bg-white/8 transition-all duration-200"
              >
                <div className="flex-shrink-0 text-ug-gold font-black text-lg leading-none mt-0.5 w-8">
                  {right.number}
                </div>
                <div>
                  <h3 className="text-white font-bold text-base mb-1.5">
                    {right.title}
                  </h3>
                  <p className="text-white/60 text-sm leading-relaxed">
                    {right.body}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
