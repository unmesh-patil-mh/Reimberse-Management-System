import React, { useEffect, useRef } from 'react';

const problems = [
  {
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
        <circle cx="12" cy="12" r="10" />
        <polyline points="12 6 12 12 16 14" />
      </svg>
    ),
    text: 'Delayed approvals',
  },
  {
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
        <line x1="1" y1="1" x2="23" y2="23" />
      </svg>
    ),
    text: 'No visibility',
  },
  {
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
        <polyline points="14 2 14 8 20 8" />
        <line x1="12" y1="18" x2="12" y2="12" />
        <line x1="9" y1="15" x2="15" y2="15" />
      </svg>
    ),
    text: 'Manual tracking errors',
  },
];

const ProblemStrip = () => {
  const ref = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) entry.target.classList.add('neo-reveal-active');
        });
      },
      { threshold: 0.2 }
    );
    ref.current?.querySelectorAll('.neo-reveal').forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={ref} className="border-y-2 border-black bg-black overflow-x-auto">
      <div className="max-w-[1200px] mx-auto px-6 md:px-12 py-5 flex flex-col md:flex-row items-center gap-4 md:gap-0">
        {/* Pain points */}
        <div className="flex flex-wrap md:flex-nowrap items-center gap-0 flex-1">
          {problems.map((p, i) => (
            <React.Fragment key={p.text}>
              <div
                className="neo-reveal flex items-center gap-2 px-5 py-2 border border-white/10"
                style={{ transitionDelay: `${i * 80}ms` }}
              >
                <span className="text-red-400">{p.icon}</span>
                <span className="font-mono text-sm text-white/70 whitespace-nowrap">{p.text}</span>
              </div>
              {i < problems.length - 1 && (
                <span className="font-mono text-white/20 px-2 hidden md:block">·</span>
              )}
            </React.Fragment>
          ))}
        </div>

        {/* Divider */}
        <div className="hidden md:block w-px h-8 bg-white/15 mx-6" />

        {/* Solution */}
        <div
          className="neo-reveal flex items-center gap-3 bg-[#0066FF] border-2 border-[#0066FF] px-5 py-2 shrink-0"
          style={{ transitionDelay: '280ms', boxShadow: '3px 3px 0 rgba(255,255,255,0.2)' }}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5">
            <polyline points="20 6 9 17 4 12" />
          </svg>
          <span className="font-mono text-sm font-bold text-white whitespace-nowrap">
            Automated, rule-driven reimbursement system
          </span>
        </div>
      </div>
    </div>
  );
};

export default ProblemStrip;
