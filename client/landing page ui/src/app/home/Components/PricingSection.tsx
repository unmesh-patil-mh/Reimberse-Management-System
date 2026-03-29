'use client';

import React, { useState, useEffect, useRef } from 'react';

interface PricingTier {
  id: string;
  tier: string;
  label: string;
  price: string;
  period: string;
  description: string;
  features: string[];
  cta: string;
  featured: boolean;
}

const tiers: PricingTier[] = [
  {
    id: 'starter',
    tier: 'Tier_01',
    label: 'Starter',
    price: '$49',
    period: '/mo',
    description: 'For growing teams up to 25 employees.',
    features: [
      '2-step approval workflow',
      'Up to 25 employees',
      'Receipt OCR capture',
      'Email notifications',
      'CSV export',
      'Standard support',
    ],
    cta: 'Start Free Trial',
    featured: false,
  },
  {
    id: 'business',
    tier: 'Tier_02 // RECOMMENDED',
    label: 'Business',
    price: '$149',
    period: '/mo',
    description: 'Multi-step workflows for mid-size finance teams.',
    features: [
      'Unlimited approval steps',
      'Up to 250 employees',
      'RBAC with custom roles',
      'Spend policy engine',
      'NetSuite & Xero sync',
      'Audit trail export',
      'Priority support',
    ],
    cta: 'Start Free Trial',
    featured: true,
  },
  {
    id: 'enterprise',
    tier: 'Tier_03',
    label: 'Enterprise',
    price: 'Custom',
    period: '',
    description: 'Multi-entity, custom SLA, dedicated infrastructure.',
    features: [
      'Unlimited employees',
      'Multi-tenant / multi-entity',
      'SAP & custom ERP sync',
      'SSO (SAML, OIDC)',
      'Custom approval logic',
      'SLA guarantee',
      'Dedicated CSM',
    ],
    cta: 'Contact Sales',
    featured: false,
  },
];

const faqs = [
  {
    q: 'How does multi-tenancy work?',
    a: 'Each company (tenant) has a fully isolated data environment, custom approval policies, and independent user management. Admins can manage multiple entities from a single super-admin account.',
  },
  {
    q: 'Can we customize the approval chain per department?',
    a: 'Yes. You can configure unique approval workflows per department, cost center, or expense category — with conditional routing based on amount thresholds.',
  },
  {
    q: 'What ERP systems do you integrate with?',
    a: 'Business tier includes NetSuite and Xero. Enterprise supports SAP, Oracle, Microsoft Dynamics, and custom webhook integrations.',
  },
  {
    q: 'Is there a free trial?',
    a: 'Yes — 14-day free trial on all tiers, no credit card required. Your approval workflows and data are preserved if you upgrade.',
  },
];

const PricingSection: React.FC = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.querySelectorAll('.reveal').forEach((el, i) => {
              setTimeout(() => el.classList.add('active'), i * 80);
            });
          }
        });
      },
      { threshold: 0.1 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  const toggleFaq = (i: number) => {
    setOpenFaq((prev) => (prev === i ? null : i));
  };

  return (
    <section
      id="pricing"
      ref={sectionRef}
      className="py-28 md:py-40 border-b border-white/5 relative overflow-hidden"
    >
      <div className="absolute inset-0 dot-grid opacity-15 pointer-events-none" aria-hidden="true" />

      <div className="max-w-[1440px] mx-auto px-6 md:px-12 relative z-10">
        {/* Header */}
        <div className="grid grid-cols-1 md:grid-cols-12 mb-16 gap-8">
          <div className="md:col-span-3">
            <span className="label-mono text-white/25 block mb-4">06 / PRICING</span>
          </div>
          <div className="md:col-span-9">
            <h2
              className="font-display font-light text-white leading-[0.9] tracking-tight reveal active"
              style={{ fontSize: 'clamp(2.4rem, 6vw, 5rem)' }}
            >
              Transparent pricing.<br />
              <span className="italic text-white/40">No per-transaction fees.</span>
            </h2>
          </div>
        </div>

        {/* Pricing cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-1 mb-24">
          {tiers.map((tier, i) => (
            <div
              key={tier.id}
              className={`relative flex flex-col justify-between p-10 md:p-12 reveal reveal-delay-${i + 1} active transition-all ${
                tier.featured
                  ? 'pricing-featured' :'border border-white/8 bg-white/[0.02] hover:bg-white/[0.04]'
              }`}
            >
              {tier.featured && (
                <div className="absolute inset-0 dot-grid opacity-10 pointer-events-none" aria-hidden="true" />
              )}

              <div className="relative z-10 space-y-8">
                {/* Tier label */}
                <div className="flex items-center justify-between">
                  <span className={`label-mono ${tier.featured ? 'text-black/50' : 'text-white/25'}`}>
                    {tier.tier}
                  </span>
                  {tier.featured && (
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" className="text-black/40">
                      <path d="M10 2l2.4 4.9 5.4.8-3.9 3.8.9 5.4L10 14.4l-4.8 2.5.9-5.4L2.2 7.7l5.4-.8L10 2z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/>
                    </svg>
                  )}
                </div>

                {/* Name + price */}
                <div>
                  <h3
                    className={`font-display font-light tracking-tight mb-1 ${
                      tier.featured ? 'text-black' : 'text-white'
                    }`}
                    style={{ fontSize: 'clamp(1.8rem, 3vw, 2.5rem)' }}
                  >
                    {tier.label}
                  </h3>
                  <p className={`text-xs mb-4 ${tier.featured ? 'text-black/50' : 'text-white/40'}`}>
                    {tier.description}
                  </p>
                  <div className="flex items-end gap-1">
                    <span
                      className={`font-display font-light tracking-tight ${
                        tier.featured ? 'text-black' : 'text-white'
                      }`}
                      style={{ fontSize: 'clamp(2.5rem, 5vw, 4rem)' }}
                    >
                      {tier.price}
                    </span>
                    {tier.period && (
                      <span className={`label-mono mb-2 ${tier.featured ? 'text-black/40' : 'text-white/30'}`}>
                        {tier.period}
                      </span>
                    )}
                  </div>
                </div>

                {/* Features */}
                <ul className="space-y-3">
                  {tier.features.map((f) => (
                    <li key={f} className={`flex items-center gap-3 text-sm ${tier.featured ? 'text-black/70' : 'text-white/50'}`}>
                      <svg width="12" height="12" viewBox="0 0 12 12" fill="none" className={tier.featured ? 'text-black/60' : 'text-white/40'}>
                        <path d="M2 6l3 3 5-5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                      {f}
                    </li>
                  ))}
                </ul>
              </div>

              {/* CTA */}
              <button
                className={`relative z-10 mt-10 w-full py-4 text-xs font-mono font-medium tracking-widest uppercase transition-all ${
                  tier.featured
                    ? 'bg-black text-white hover:bg-zinc-900' :'border border-white/15 text-white/70 hover:bg-white hover:text-black'
                }`}
              >
                {tier.cta}
              </button>
            </div>
          ))}
        </div>

        {/* FAQ */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
          <div className="md:col-span-3">
            <span className="label-mono text-white/25 block mb-4">FAQ</span>
            <h3 className="font-display font-light text-white text-2xl tracking-tight">
              Common questions
            </h3>
          </div>
          <div className="md:col-span-9 space-y-0">
            {faqs.map((faq, i) => (
              <div key={i} className="border-b border-white/8 group">
                <button
                  onClick={() => toggleFaq(i)}
                  className="w-full py-6 flex items-center justify-between text-left focus:outline-none"
                  aria-expanded={openFaq === i}
                >
                  <span className={`text-lg font-display font-light tracking-tight transition-colors ${
                    openFaq === i ? 'text-white' : 'text-white/60 group-hover:text-white'
                  }`}>
                    {faq.q}
                  </span>
                  <span className={`text-white/30 font-mono text-xl ml-4 transition-transform duration-300 ${
                    openFaq === i ? 'rotate-45' : ''
                  }`}>
                    +
                  </span>
                </button>
                <div
                  className="faq-content"
                  style={{ maxHeight: openFaq === i ? '300px' : '0' }}
                >
                  <p className="pb-6 text-sm text-white/40 leading-relaxed">
                    {faq.a}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default PricingSection;