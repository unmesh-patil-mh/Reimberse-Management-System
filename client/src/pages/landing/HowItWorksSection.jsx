import React, { useEffect, useRef } from 'react';

const steps = [
  {
    num: '01',
    title: 'Submit Expense',
    desc: 'Employee fills out a structured form — amount, category, receipt. Submitted in under 60 seconds.',
    icon: (
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
        <polyline points="14 2 14 8 20 8" />
        <line x1="12" y1="18" x2="12" y2="12" />
        <line x1="9" y1="15" x2="15" y2="15" />
      </svg>
    ),
  },
  {
    num: '02',
    title: 'Auto Route via Rules',
    desc: 'The rule engine evaluates amount, category, and department. Routes to the right approver instantly.',
    icon: (
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <polyline points="16 18 22 12 16 6" />
        <polyline points="8 6 2 12 8 18" />
      </svg>
    ),
  },
  {
    num: '03',
    title: 'Approve / Reject',
    desc: 'Approver gets notified, reviews in one click. Status updates propagate in real-time across the system.',
    icon: (
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <polyline points="20 6 9 17 4 12" />
      </svg>
    ),
  },
];

const HowItWorksSection = () => {
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
      id="how-it-works"
      ref={ref}
      className="py-24 px-6 md:px-12 bg-[#F5F5F0]"
      aria-label="How It Works"
    >
      <div className="max-w-[1200px] mx-auto">
        {/* Header */}
        <div className="neo-reveal mb-14">
          <div
            className="inline-block border-2 border-black bg-[#F5F5F0] px-3 py-1 mb-4 font-mono text-xs font-bold tracking-widest uppercase"
            style={{ boxShadow: '2px 2px 0 #000' }}
          >
            How It Works
          </div>
          <h2
            className="font-display font-black text-black leading-tight"
            style={{ fontSize: 'clamp(2rem, 5vw, 3.5rem)' }}
          >
            Three steps.<br />Zero confusion.
          </h2>
        </div>

        {/* Steps */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-0 border-2 border-black">
          {steps.map((step, i) => (
            <div key={step.num} className="relative flex">
              <div
                className="neo-reveal group flex-1 p-8 bg-white border-r-2 border-black last:border-r-0 hover:-translate-y-1 hover:z-10 transition-all duration-200"
                style={{
                  transitionDelay: `${i * 100}ms`,
                  boxShadow: '0 0 0 transparent',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.boxShadow = '4px 4px 0 #0066FF';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.boxShadow = '0 0 0 transparent';
                }}
              >
                {/* Step number */}
                <div className="font-mono text-6xl font-black text-black/8 leading-none mb-4 select-none">
                  {step.num}
                </div>

                {/* Icon */}
                <div
                  className="inline-flex items-center justify-center w-14 h-14 border-2 border-black mb-5 text-white"
                  style={{ background: i === 1 ? '#0066FF' : '#000' }}
                >
                  {step.icon}
                </div>

                <h3 className="font-display font-black text-black text-xl mb-3">{step.title}</h3>
                <p className="font-body text-sm text-black/55 leading-relaxed">{step.desc}</p>
              </div>

              {/* Arrow connector */}
              {i < steps.length - 1 && (
                <div className="hidden md:flex absolute -right-5 top-1/2 -translate-y-1/2 z-20 items-center justify-center w-10 h-10 bg-[#0066FF] border-2 border-black">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3">
                    <path d="M5 12h14M12 5l7 7-7 7" />
                  </svg>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorksSection;
