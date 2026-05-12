import Link from "next/link";
import Image from "next/image";

const policyLinks = [
  { label: "About the Policy", href: "/about-policy" },
  { label: "Definitions", href: "/definitions" },
  { label: "Your Rights", href: "/your-rights" },
  { label: "Reporting Guide", href: "/reporting-guide" },
  { label: "Support & Resources", href: "/support-resources" },
  { label: "FAQ", href: "/faq" },
  { label: "Contact", href: "/contact" },
];

const emergencyContacts = [
  { label: "Campus Security", value: "+233 302 213 820" },
  { label: "Counseling Centre", value: "+233 302 213 850" },
  { label: "University Health", value: "+233 302 213 860" },
  { label: "Committee Secretariat", value: "+233 302 213 870" },
];

export default function Footer() {
  return (
    <footer
      className="text-[#E8EBF0]"
      style={{ backgroundColor: "#153D6C" }}
      role="contentinfo"
      aria-label="Site footer"
    >
      {/* Gold top border */}
      <div className="h-1 bg-ug-gold" aria-hidden="true" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">

          {/* Brand */}
          <div className="lg:col-span-1">
            <div className="mb-4">
              <Image
                src="/UG-white-logo (1).png"
                alt="University of Ghana"
                width={180}
                height={56}
                className="h-14 w-auto"
              />
              <div className="mt-3 text-ug-gold-light text-[10px] font-bold tracking-widest uppercase">
                SafeSpace UG
              </div>
            </div>
            <p className="text-[#E8EBF0]/70 text-sm leading-relaxed max-w-xs">
              Protecting dignity, ensuring safety, and upholding the rights of
              every member of the University of Ghana community.
            </p>
            <div className="mt-5">
              <Link
                href="https://report.safespace.ug.edu.gh"
                className="inline-block px-5 py-2.5 bg-ug-gold text-ug-blue-dark text-sm font-bold tracking-wide hover:bg-ug-gold-light transition-colors"
                aria-label="Go to the secure reporting portal"
              >
                Report Misconduct
              </Link>
            </div>
          </div>

          {/* Navigation */}
          <div>
            <h3 className="text-ug-gold-light text-xs font-bold tracking-widest uppercase mb-4">
              Platform
            </h3>
            <ul className="space-y-2.5" role="list">
              {policyLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-[#E8EBF0]/70 text-sm hover:text-[#E8EBF0] transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Emergency Contacts */}
          <div>
            <h3 className="text-ug-gold-light text-xs font-bold tracking-widest uppercase mb-4">
              Emergency Contacts
            </h3>
            <ul className="space-y-3" role="list">
              {emergencyContacts.map((c) => (
                <li key={c.label}>
                  <div className="text-[#E8EBF0]/50 text-xs uppercase tracking-wide mb-0.5">
                    {c.label}
                  </div>
                  <a
                    href={`tel:${c.value.replace(/\s/g, "")}`}
                    className="text-[#E8EBF0] text-sm font-medium hover:text-ug-gold-light transition-colors"
                  >
                    {c.value}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Institutional */}
          <div>
            <h3 className="text-ug-gold-light text-xs font-bold tracking-widest uppercase mb-4">
              Institutional
            </h3>
            <ul className="space-y-2.5" role="list">
              <li>
                <a
                  href="https://www.ug.edu.gh"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#E8EBF0]/70 text-sm hover:text-[#E8EBF0] transition-colors"
                >
                  University of Ghana
                </a>
              </li>
              <li>
                <a
                  href="/Sexual-Harassment-and-Misconduct-Policy-Web.pdf"
                  download="UG-Sexual-Harassment-and-Misconduct-Policy.pdf"
                  className="text-[#E8EBF0]/70 text-sm hover:text-[#E8EBF0] transition-colors"
                >
                  Download Policy PDF
                </a>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="text-[#E8EBF0]/70 text-sm hover:text-[#E8EBF0] transition-colors"
                >
                  Contact the Committee
                </Link>
              </li>
            </ul>

            <div className="mt-6 pt-5 border-t border-[#E8EBF0]/10">
              <p className="text-[#E8EBF0]/40 text-xs leading-relaxed">
                This platform is operated by the Anti-Sexual Harassment
                Committee of the University of Ghana under the authority of the{" "}
                <em>Sexual Harassment and Misconduct Policy (2017)</em>.
              </p>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-12 pt-6 border-t border-[#E8EBF0]/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <p className="text-[#E8EBF0]/40 text-xs">
            © {new Date().getFullYear()} University of Ghana. All rights reserved.
          </p>
          <div className="flex flex-wrap gap-4">
            <span className="text-[#E8EBF0]/40 text-xs">Accessibility Statement</span>
            <span className="text-[#E8EBF0]/20 text-xs" aria-hidden="true">|</span>
            <span className="text-[#E8EBF0]/40 text-xs">Privacy Policy</span>
            <span className="text-[#E8EBF0]/20 text-xs" aria-hidden="true">|</span>
            <span className="text-[#E8EBF0]/40 text-xs">WCAG 2.1 AA Compliant</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
