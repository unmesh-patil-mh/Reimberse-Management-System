import React, { useState, useRef, useEffect, useCallback } from 'react';

const faqs = [
  {
    category: 'Pricing',
    question: 'What pricing plans are available?',
    answer:
      'We offer three tiers: Starter ($49/mo for up to 25 employees), Business ($149/mo for up to 250 employees), and Enterprise (custom pricing for unlimited employees and multi-entity setups). All plans include a 14-day free trial with no credit card required.',
  },
  {
    category: 'Pricing',
    question: 'Are there any per-transaction or hidden fees?',
    answer:
      'No. Our pricing is flat-rate per plan with no per-transaction fees, no per-user overage charges within your tier, and no hidden costs. Enterprise contracts include a fixed SLA with predictable billing.',
  },
  {
    category: 'Pricing',
    question: 'Can I upgrade or downgrade my plan at any time?',
    answer:
      'Yes. You can upgrade instantly and your new features activate immediately. Downgrades take effect at the end of your current billing cycle. All your data, workflows, and configurations are preserved across plan changes.',
  },
  {
    category: 'Implementation',
    question: 'How long does onboarding and setup take?',
    answer:
      'Most teams are fully operational within 1–2 business days. Starter and Business plans include a guided self-serve setup wizard. Enterprise customers receive a dedicated implementation manager and can expect a structured 1–2 week rollout.',
  },
  {
    category: 'Implementation',
    question: 'Do you provide data migration support?',
    answer:
      'Yes. We support CSV import for historical expense data and employee records. Enterprise plans include assisted migration from existing ERP or expense systems with data validation and reconciliation support.',
  },
  {
    category: 'Integrations',
    question: 'Which accounting and ERP systems do you integrate with?',
    answer:
      'Business tier includes native sync with NetSuite and Xero. Enterprise tier adds SAP, Oracle, and Microsoft Dynamics integrations. All plans support webhook-based custom integrations for connecting any internal system.',
  },
  {
    category: 'Integrations',
    question: 'Does the platform support SSO and identity providers?',
    answer:
      'Enterprise plans include SSO via SAML 2.0 and OIDC, compatible with Okta, Azure AD, Google Workspace, and other major identity providers. Business plans support Google and Microsoft OAuth login.',
  },
  {
    category: 'Approval Workflows',
    question: 'Can approval chains be customized per department or expense type?',
    answer:
      'Yes. You can configure unique multi-step approval workflows per department, cost center, project, or expense category. Conditional routing rules can escalate or bypass steps based on amount thresholds, employee level, or expense type.',
  },
  {
    category: 'Approval Workflows',
    question: 'What happens if an approver is unavailable?',
    answer:
      'You can configure automatic escalation rules — if an approver does not act within a defined time window, the request is automatically routed to a designated backup approver or the next level in the chain. Out-of-office delegation is also supported.',
  },
  {
    category: 'Approval Workflows',
    question: 'Is there an audit trail for all approval decisions?',
    answer:
      'Every approval action — submission, approval, rejection, escalation, and comment — is logged with a timestamp and user identity. Full audit trail exports are available on Business and Enterprise plans for compliance and finance reviews.',
  },
];

const categories = ['Pricing', 'Implementation', 'Integrations', 'Approval Workflows'];

const categoryIcons = {
  Pricing: (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <rect x="1" y="1" width="14" height="14" rx="1" stroke="currentColor" strokeWidth="1.5" />
      <path d="M8 4v8M5.5 6.5C5.5 5.4 6.6 4.5 8 4.5s2.5.9 2.5 2c0 2.5-5 2.5-5 5 0 1.1 1.1 2 2.5 2s2.5-.9 2.5-2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  ),
  Implementation: (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <path d="M2 4h12M2 8h8M2 12h5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <circle cx="13" cy="11" r="2.5" stroke="currentColor" strokeWidth="1.5" />
      <path d="M15 13l1.5 1.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  ),
  Integrations: (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <circle cx="3.5" cy="8" r="2" stroke="currentColor" strokeWidth="1.5" />
      <circle cx="12.5" cy="3.5" r="2" stroke="currentColor" strokeWidth="1.5" />
      <circle cx="12.5" cy="12.5" r="2" stroke="currentColor" strokeWidth="1.5" />
      <path d="M5.5 8h3l2-4.5M8.5 8l2 4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  ),
  'Approval Workflows': (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <path d="M2 8h3l2-4 2 8 2-4h3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
};

const FAQSection = () => {
  const [openIndex, setOpenIndex] = useState(null);
  const [activeCategory, setActiveCategory] = useState('All');
  const sectionRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.querySelectorAll('.faq-reveal').forEach((el, i) => {
              setTimeout(() => el.classList.add('faq-active'), i * 60);
            });
          }
        });
      },
      { threshold: 0.05 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  const allCategories = ['All', ...categories];
  const filtered =
    activeCategory === 'All' ? faqs : faqs.filter((f) => f.category === activeCategory);
  const toggle = (i) => setOpenIndex((prev) => (prev === i ? null : i));

  return (
    <section
      id="faq"
      ref={sectionRef}
      className="py-28 md:py-40 bg-white border-t-2 border-black relative overflow-hidden"
    >
      {/* Background grid accent */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.03]"
        style={{
          backgroundImage:
            'linear-gradient(#000 1px, transparent 1px), linear-gradient(90deg, #000 1px, transparent 1px)',
          backgroundSize: '40px 40px',
        }}
        aria-hidden="true"
      />

      <div className="max-w-[1440px] mx-auto px-6 md:px-12 relative z-10">
        {/* Section header */}
        <div className="grid grid-cols-1 md:grid-cols-12 mb-16 gap-8 faq-reveal">
          <div className="md:col-span-3">
            <span className="font-mono text-xs tracking-[0.2em] uppercase text-black/30 block mb-4">
              FAQ
            </span>
          </div>
          <div className="md:col-span-9">
            <h2
              className="font-black text-black leading-[0.95] tracking-tight"
              style={{ fontSize: 'clamp(2.4rem, 6vw, 5rem)' }}
            >
              Frequently asked
              <br />
              <span className="text-black/30 font-light italic">questions.</span>
            </h2>
            <p className="mt-6 text-black/50 text-base max-w-xl leading-relaxed">
              Everything you need to know about pricing, getting started, connecting your tools, and
              configuring approval workflows.
            </p>
          </div>
        </div>

        {/* Category filter tabs */}
        <div className="flex flex-wrap gap-2 mb-12 faq-reveal">
          {allCategories.map((cat) => (
            <button
              key={cat}
              onClick={() => {
                setActiveCategory(cat);
                setOpenIndex(null);
              }}
              className={`px-5 py-2.5 text-xs font-mono font-medium tracking-widest uppercase border-2 transition-all duration-200 ${
                activeCategory === cat
                  ? 'bg-black text-white border-black shadow-[3px_3px_0px_#000]'
                  : 'bg-white text-black border-black hover:bg-black hover:text-white hover:shadow-[3px_3px_0px_rgba(0,0,0,0.3)]'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* FAQ cards */}
        <div className="space-y-0 border-t-2 border-black">
          {filtered.map((faq, i) => {
            const globalIndex = faqs.indexOf(faq);
            const isOpen = openIndex === globalIndex;

            return (
              <div
                key={globalIndex}
                className={`faq-reveal border-b-2 border-black group ${
                  isOpen ? 'bg-black' : 'bg-white hover:bg-black/[0.02]'
                }`}
              >
                <button
                  onClick={() => toggle(globalIndex)}
                  className="w-full px-0 py-6 md:py-7 flex items-start justify-between text-left focus:outline-none gap-6"
                  aria-expanded={isOpen}
                >
                  <div className="flex items-start gap-4 flex-1 min-w-0">
                    {/* Category badge */}
                    <span
                      className={`hidden md:flex items-center gap-1.5 px-3 py-1 text-[10px] font-mono font-medium tracking-widest uppercase border flex-shrink-0 mt-0.5 transition-colors ${
                        isOpen
                          ? 'border-white/20 text-white/50' : 'border-black/20 text-black/40'
                      }`}
                    >
                      <span className={isOpen ? 'text-white/40' : 'text-black/40'}>
                        {categoryIcons[faq.category]}
                      </span>
                      {faq.category}
                    </span>

                    {/* Question */}
                    <span
                      className={`text-lg md:text-xl font-bold tracking-tight transition-colors leading-snug ${
                        isOpen ? 'text-white' : 'text-black group-hover:text-black'
                      }`}
                    >
                      {faq.question}
                    </span>
                  </div>

                  {/* Toggle icon */}
                  <span
                    className={`flex-shrink-0 w-8 h-8 border-2 flex items-center justify-center font-mono text-lg transition-all duration-300 ${
                      isOpen
                        ? 'border-white text-white rotate-45' : 'border-black text-black group-hover:bg-black group-hover:text-white group-hover:border-black'
                    }`}
                    aria-hidden="true"
                  >
                    +
                  </span>
                </button>

                {/* Answer panel */}
                <div
                  className={`overflow-hidden transition-all duration-300 ease-in-out ${
                    isOpen ? 'max-h-96 pb-7' : 'max-h-0'
                  }`}
                >
                  <div className="pl-4 md:pl-32 pr-14">
                    <p className="text-white/70 text-base leading-relaxed">{faq.answer}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom CTA */}
        <div className="mt-16 faq-reveal flex flex-col sm:flex-row items-start sm:items-center gap-6 pt-12 border-t-2 border-black">
          <p className="text-black/50 text-sm font-mono">
            Still have questions?
          </p>
          <a
            href="mailto:support@reimburse.io"
            className="inline-flex items-center gap-2 px-6 py-3 bg-black text-white text-xs font-mono font-medium tracking-widest uppercase border-2 border-black shadow-[4px_4px_0px_#000] hover:shadow-[2px_2px_0px_#000] hover:translate-x-[2px] hover:translate-y-[2px] transition-all duration-150"
          >
            Contact Support
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
              <path d="M2 6h8M7 3l3 3-3 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </a>
        </div>
      </div>
    </section>
  );
};

export default FAQSection;
