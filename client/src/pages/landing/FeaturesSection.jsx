import React, { useEffect, useRef } from 'react';

const features = [
  {
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
      </svg>
    ),
    title: 'Dynamic Approval Workflows',
    desc: 'Configure multi-step approval chains that adapt based on amount, category, and department rules.',
    accent: '#0066FF',
    span: 'col-span-1 md:col-span-2',
  },
  {
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
        <path d="M16 3.13a4 4 0 0 1 0 7.75" />
      </svg>
    ),
    title: 'Multi-Level Authorization',
    desc: 'Employee → Manager → Finance → CFO. Every level, every rule, enforced automatically.',
    accent: '#000',
    span: 'col-span-1',
  },
  {
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <rect x="2" y="3" width="20" height="14" rx="2" ry="2" />
        <line x1="8" y1="21" x2="16" y2="21" />
        <line x1="12" y1="17" x2="12" y2="21" />
      </svg>
    ),
    title: 'Real-Time Expense Tracking',
    desc: 'Live status updates across every submission. No more "where is my reimbursement?" emails.',
    accent: '#000',
    span: 'col-span-1',
  },
  {
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <polyline points="16 18 22 12 16 6" />
        <polyline points="8 6 2 12 8 18" />
      </svg>
    ),
    title: 'Rule-Based Automation',
    desc: 'Set thresholds, assign approvers by percentage, and let the engine handle routing logic.',
    accent: '#0066FF',
    span: 'col-span-1 md:col-span-2',
  },
];

const FeaturesSection = () => {
  const ref = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) entry.target.classList.add('neo-reveal-active');
        });
      },
      { threshold: 0.1 }
    );
    ref.current?.querySelectorAll('.neo-reveal').forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return (
    <section
      id="features"
      ref={ref}
      className="py-24 px-6 md:px-12 bg-[#F5F5F0]"
      aria-label="Core Features"
    >
      <div className="max-w-[1200px] mx-auto">
        {/* Header */}
        <div className="neo-reveal mb-14">
          <div
            className="inline-block border-2 border-black bg-[#F5F5F0] px-3 py-1 mb-4 font-mono text-xs font-bold tracking-widest uppercase"
            style={{ boxShadow: '2px 2px 0 #000' }}
          >
            Core Features
          </div>
          <h2
            className="font-display font-black text-black leading-tight"
            style={{ fontSize: 'clamp(2rem, 5vw, 3.5rem)' }}
          >
            Everything you need.<br />Nothing you don't.
          </h2>
        </div>

        {/* Bento grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-0 border-2 border-black">
          {features.map((f, i) => (
            <div
              key={f.title}
              className={`neo-reveal group relative p-8 border-b-2 border-r-2 border-black bg-white hover:-translate-y-1 hover:z-10 transition-all duration-200 ${f.span}`}
              style={{
                boxShadow: '0 0 0 0 transparent',
                transitionDelay: `${i * 80}ms`,
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.boxShadow = `4px 4px 0 ${f.accent}`;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.boxShadow = '0 0 0 0 transparent';
              }}
            >
              <div
                className="inline-flex items-center justify-center w-12 h-12 border-2 border-black mb-5 transition-colors duration-200"
                style={{ background: i % 2 === 0 ? '#0066FF' : '#000', color: '#fff' }}
              >
                {f.icon}
              </div>
              <h3 className="font-display font-black text-black text-xl mb-2">{f.title}</h3>
              <p className="font-body text-sm text-black/55 leading-relaxed">{f.desc}</p>

              {/* Corner accent */}
              <div
                className="absolute bottom-0 right-0 w-0 h-0 group-hover:w-8 group-hover:h-8 transition-all duration-300"
                style={{ background: f.accent }}
                aria-hidden="true"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
