'use client';

import React, { useEffect, useRef } from 'react';

const SmartLogic: React.FC = () => {
  const ref = useRef<HTMLElement>(null);

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
      ref={ref}
      className="py-24 px-6 md:px-12 bg-black"
      aria-label="Smart Logic"
    >
      <div className="max-w-[1200px] mx-auto">
        {/* Header */}
        <div className="neo-reveal mb-14 text-center">
          <div
            className="inline-block border-2 border-[#0066FF] bg-transparent px-3 py-1 mb-4 font-mono text-xs font-bold tracking-widest uppercase text-[#0066FF]"
          >
            Smart Logic
          </div>
          <h2
            className="font-display font-black text-white leading-tight"
            style={{ fontSize: 'clamp(2rem, 5vw, 3.5rem)' }}
          >
            Built for Real-World<br />Decision Making
          </h2>
          <p className="font-body text-white/50 mt-4 max-w-xl mx-auto text-base">
            Every expense triggers a decision tree. Rules fire automatically. Humans only touch what needs human judgment.
          </p>
        </div>

        {/* Diagram */}
        <div className="neo-reveal overflow-x-auto" style={{ transitionDelay: '120ms' }}>
          <div className="min-w-[640px]">
            {/* Row 1: Start node */}
            <div className="flex items-center justify-center mb-6">
              <div
                className="border-2 border-[#0066FF] bg-[#0066FF]/10 px-6 py-3 text-center"
                style={{ boxShadow: '4px 4px 0 #0066FF' }}
              >
                <div className="font-mono text-xs text-[#0066FF] uppercase tracking-widest mb-1">Step 1</div>
                <div className="font-display font-black text-white text-lg">Expense Submitted</div>
                <div className="font-mono text-xs text-white/40 mt-1">Employee → System</div>
              </div>
            </div>

            {/* Arrow down */}
            <div className="flex justify-center mb-6">
              <div className="flex flex-col items-center gap-1">
                <div className="w-px h-8 bg-white/20" />
                <svg width="12" height="8" viewBox="0 0 12 8" fill="white" opacity="0.4">
                  <path d="M6 8L0 0h12z" />
                </svg>
              </div>
            </div>

            {/* Row 2: Rule engine */}
            <div className="flex items-center justify-center mb-6">
              <div
                className="border-2 border-white/30 bg-white/5 px-6 py-3 text-center"
                style={{ boxShadow: '4px 4px 0 rgba(255,255,255,0.1)' }}
              >
                <div className="font-mono text-xs text-white/40 uppercase tracking-widest mb-1">Rule Engine</div>
                <div className="font-display font-black text-white text-lg">Evaluate Conditions</div>
                <div className="font-mono text-xs text-white/40 mt-1">Amount · Category · Department</div>
              </div>
            </div>

            {/* Branch arrows */}
            <div className="flex justify-center mb-6">
              <div className="relative w-full max-w-[600px] flex justify-between items-start px-8">
                <div className="flex flex-col items-center gap-1">
                  <div className="w-px h-6 bg-white/20" />
                  <svg width="12" height="8" viewBox="0 0 12 8" fill="white" opacity="0.4">
                    <path d="M6 8L0 0h12z" />
                  </svg>
                </div>
                <div className="flex-1 border-t-2 border-dashed border-white/15 mt-3 mx-4" />
                <div className="flex flex-col items-center gap-1">
                  <div className="w-px h-6 bg-white/20" />
                  <svg width="12" height="8" viewBox="0 0 12 8" fill="white" opacity="0.4">
                    <path d="M6 8L0 0h12z" />
                  </svg>
                </div>
              </div>
            </div>

            {/* Row 3: Two branches */}
            <div className="grid grid-cols-2 gap-6 mb-6 max-w-[600px] mx-auto">
              {/* Branch A: Percentage rule */}
              <div
                className="border-2 border-white/20 bg-white/5 p-4 text-center"
              >
                <div className="font-mono text-xs text-[#0066FF] uppercase tracking-widest mb-2">Percentage Rule</div>
                <div className="font-display font-black text-white text-base mb-1">&gt; $500</div>
                <div className="font-mono text-xs text-white/40">Routes to Manager</div>
                <div className="mt-3 inline-block border border-white/20 px-2 py-0.5 font-mono text-xs text-white/50">
                  threshold: 500
                </div>
              </div>

              {/* Branch B: Specific approver */}
              <div
                className="border-2 border-white/20 bg-white/5 p-4 text-center"
              >
                <div className="font-mono text-xs text-[#0066FF] uppercase tracking-widest mb-2">Specific Approver</div>
                <div className="font-display font-black text-white text-base mb-1">≤ $500</div>
                <div className="font-mono text-xs text-white/40">Auto-Approved</div>
                <div className="mt-3 inline-block border border-white/20 px-2 py-0.5 font-mono text-xs text-white/50">
                  auto: true
                </div>
              </div>
            </div>

            {/* Merge arrow */}
            <div className="flex justify-center mb-6">
              <div className="flex flex-col items-center gap-1">
                <div className="w-px h-8 bg-white/20" />
                <svg width="12" height="8" viewBox="0 0 12 8" fill="white" opacity="0.4">
                  <path d="M6 8L0 0h12z" />
                </svg>
              </div>
            </div>

            {/* Row 4: Hybrid logic */}
            <div className="flex items-center justify-center mb-6">
              <div
                className="border-2 border-white/30 bg-white/5 px-6 py-3 text-center"
              >
                <div className="font-mono text-xs text-white/40 uppercase tracking-widest mb-1">Hybrid Logic</div>
                <div className="font-display font-black text-white text-lg">Conditional Approval</div>
                <div className="font-mono text-xs text-white/40 mt-1">Multi-level if required</div>
              </div>
            </div>

            {/* Final arrow */}
            <div className="flex justify-center mb-6">
              <div className="flex flex-col items-center gap-1">
                <div className="w-px h-8 bg-white/20" />
                <svg width="12" height="8" viewBox="0 0 12 8" fill="white" opacity="0.4">
                  <path d="M6 8L0 0h12z" />
                </svg>
              </div>
            </div>

            {/* Final status row */}
            <div className="flex items-center justify-center gap-4">
              <div
                className="border-2 border-green-500 bg-green-500/10 px-6 py-3 text-center"
                style={{ boxShadow: '3px 3px 0 #22c55e' }}
              >
                <div className="font-mono text-xs text-green-400 uppercase tracking-widest mb-1">Final Status</div>
                <div className="font-display font-black text-white text-lg">Approved</div>
              </div>
              <span className="font-mono text-white/20 text-lg">or</span>
              <div
                className="border-2 border-red-500 bg-red-500/10 px-6 py-3 text-center"
                style={{ boxShadow: '3px 3px 0 #ef4444' }}
              >
                <div className="font-mono text-xs text-red-400 uppercase tracking-widest mb-1">Final Status</div>
                <div className="font-display font-black text-white text-lg">Rejected</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SmartLogic;
