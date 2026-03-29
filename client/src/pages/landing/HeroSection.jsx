import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const HeroSection = () => {
  const sectionRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('neo-reveal-active');
          }
        });
      },
      { threshold: 0.1 }
    );
    const elements = sectionRef.current?.querySelectorAll('.neo-reveal');
    elements?.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  const handleGetStarted = () => {
    navigate('/login');
  };

  const handleViewDemo = () => {
    const previewSection = document.getElementById('preview');
    if (previewSection) {
      previewSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Workflow visualization data
  const workflowSteps = [
    { label: 'Submit', status: 'complete', icon: '📤' },
    { label: 'Manager Review', status: 'complete', icon: '👤' },
    { label: 'Finance Check', status: 'active', icon: '💰' },
    { label: 'CFO Approval', status: 'pending', icon: '✅' },
  ];

  return (
    <section
      ref={sectionRef}
      className="relative min-h-screen flex flex-col justify-center pt-24 pb-16 px-6 md:px-12 overflow-hidden bg-[#F5F5F0]"
      aria-label="Hero"
    >
      {/* Grid background */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage:
            'linear-gradient(rgba(0,0,0,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(0,0,0,0.05) 1px, transparent 1px)',
          backgroundSize: '48px 48px',
        }}
        aria-hidden="true"
      />

      <div className="relative z-10 max-w-[1200px] mx-auto w-full">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

          {/* LEFT */}
          <div>
            <div
              className="neo-reveal inline-flex items-center gap-2 border-2 border-black bg-[#0066FF] px-3 py-1.5 mb-8"
              style={{ boxShadow: '3px 3px 0 #000' }}
            >
              <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
              <span className="font-mono text-xs font-bold tracking-widest uppercase text-white">
                Reimbursement Platform
              </span>
            </div>

            <h1
              className="neo-reveal font-display font-black text-black leading-[0.9] tracking-tight mb-6"
              style={{ fontSize: 'clamp(3rem, 7vw, 5.5rem)', transitionDelay: '80ms' }}
            >
              Smarter<br />
              Reimbursement.<br />
              <span className="relative inline-block">
                <span className="relative z-10">Faster</span>
                <span
                  className="absolute bottom-1 left-0 w-full h-4 -z-0"
                  style={{ background: '#0066FF', opacity: 0.25 }}
                  aria-hidden="true"
                />
              </span>{' '}
              Approvals.
            </h1>

            <p
              className="neo-reveal text-base md:text-lg text-black/60 max-w-md leading-relaxed mb-10 font-body"
              style={{ transitionDelay: '160ms' }}
            >
              Dynamic workflows. Real-time approvals. Zero manual chaos.
            </p>

            {/* CTA area */}
            <div
              className="neo-reveal"
              style={{ transitionDelay: '240ms' }}
            >
              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  onClick={handleGetStarted}
                  className="neo-btn-primary inline-flex items-center justify-center gap-2 bg-black text-white border-2 border-black px-8 py-4 font-mono font-bold text-sm tracking-widest uppercase transition-all duration-200 hover:-translate-y-1"
                  style={{ boxShadow: '4px 4px 0 #0066FF' }}
                >
                  Get Started
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <path d="M5 12h14M12 5l7 7-7 7" />
                  </svg>
                </button>
                <button
                  onClick={handleViewDemo}
                  className="neo-btn-secondary inline-flex items-center justify-center gap-2 bg-[#F5F5F0] text-black border-2 border-black px-8 py-4 font-mono font-bold text-sm tracking-widest uppercase transition-all duration-200 hover:-translate-y-1"
                  style={{ boxShadow: '4px 4px 0 #000' }}
                >
                  View Demo
                </button>
              </div>
            </div>
          </div>

          {/* RIGHT: Workflow visualization */}
          <div className="neo-reveal relative" style={{ transitionDelay: '200ms' }}>
            <div
              className="relative border-2 border-black bg-black p-6"
              style={{ boxShadow: '8px 8px 0 #0066FF' }}
            >
              {/* Terminal header */}
              <div className="flex items-center gap-2 mb-5 pb-4 border-b border-white/10">
                <div className="w-3 h-3 rounded-full bg-red-500" />
                <div className="w-3 h-3 rounded-full bg-yellow-400" />
                <div className="w-3 h-3 rounded-full bg-green-500" />
                <span className="ml-3 font-mono text-xs text-white/30">approval-workflow.live</span>
              </div>

              {/* Workflow rows */}
              <div className="space-y-4">
                {workflowSteps.map((step, i) => (
                  <div
                    key={step.label}
                    className="flex items-center gap-4 group"
                  >
                    <div
                      className={`flex items-center justify-center w-10 h-10 border-2 text-lg ${
                        step.status === 'complete'
                          ? 'border-green-400 bg-green-400/10'
                          : step.status === 'active'
                          ? 'border-[#0066FF] bg-[#0066FF]/10 animate-pulse'
                          : 'border-white/15 bg-white/5'
                      }`}
                    >
                      {step.status === 'complete' ? (
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#4ade80" strokeWidth="2.5">
                          <polyline points="20 6 9 17 4 12" />
                        </svg>
                      ) : step.status === 'active' ? (
                        <div className="w-3 h-3 rounded-full bg-[#0066FF]" />
                      ) : (
                        <div className="w-3 h-3 rounded-full bg-white/20" />
                      )}
                    </div>
                    <div className="flex-1">
                      <div className={`font-mono text-sm font-bold ${
                        step.status === 'complete' ? 'text-green-400' :
                        step.status === 'active' ? 'text-[#0066FF]' :
                        'text-white/30'
                      }`}>
                        {step.label}
                      </div>
                      <div className="font-mono text-xs text-white/20">
                        {step.status === 'complete' ? 'Approved ✓' :
                         step.status === 'active' ? 'In Review...' :
                         'Waiting'}
                      </div>
                    </div>
                    {i < workflowSteps.length - 1 && (
                      <div className={`w-px h-8 absolute left-[26px] mt-14 ${
                        step.status === 'complete' ? 'bg-green-400/30' : 'bg-white/10'
                      }`} />
                    )}
                  </div>
                ))}
              </div>

              {/* Bottom stats */}
              <div className="mt-6 pt-4 border-t border-white/10 grid grid-cols-3 gap-4">
                <div>
                  <div className="font-mono text-xs text-white/25 mb-1">Avg Time</div>
                  <div className="font-mono text-sm font-bold text-white">2.4h</div>
                </div>
                <div>
                  <div className="font-mono text-xs text-white/25 mb-1">Auto-Routed</div>
                  <div className="font-mono text-sm font-bold text-[#0066FF]">94%</div>
                </div>
                <div>
                  <div className="font-mono text-xs text-white/25 mb-1">This Quarter</div>
                  <div className="font-mono text-sm font-bold text-green-400">$127K</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
