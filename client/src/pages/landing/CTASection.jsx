import React, { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

const CTASection = () => {
  const ref = useRef(null);
  const navigate = useNavigate();

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
    <section
      ref={ref}
      className="py-28 px-6 md:px-12 bg-[#F5F5F0] border-t-2 border-black"
      aria-label="Call to Action"
    >
      <div className="max-w-[1200px] mx-auto">
        <div
          className="neo-reveal border-2 border-black bg-black p-12 md:p-20 relative overflow-hidden"
          style={{ boxShadow: '8px 8px 0 #0066FF' }}
        >
          {/* Background grid */}
          <div
            className="absolute inset-0 pointer-events-none opacity-10"
            style={{
              backgroundImage:
                'linear-gradient(rgba(255,255,255,0.08) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.08) 1px, transparent 1px)',
              backgroundSize: '48px 48px',
            }}
            aria-hidden="true"
          />

          {/* Blue accent corner */}
          <div
            className="absolute top-0 right-0 w-48 h-48 pointer-events-none"
            style={{ background: 'radial-gradient(circle at top right, rgba(0,102,255,0.25), transparent 70%)' }}
            aria-hidden="true"
          />

          <div className="relative z-10 text-center max-w-3xl mx-auto">
            <div
              className="neo-reveal inline-block border-2 border-[#0066FF] px-3 py-1 mb-8 font-mono text-xs font-bold tracking-widest uppercase text-[#0066FF]"
            >
              Get Started Today
            </div>

            <h2
              className="neo-reveal font-display font-black text-white leading-tight mb-6"
              style={{ fontSize: 'clamp(2rem, 5vw, 4rem)', transitionDelay: '80ms' }}
            >
              Stop chasing approvals.<br />
              <span className="text-[#0066FF]">Let the system handle it.</span>
            </h2>

            <p
              className="neo-reveal font-body text-white/50 text-lg mb-12 max-w-xl mx-auto"
              style={{ transitionDelay: '160ms' }}
            >
              Configure your first approval workflow in minutes. No setup fees. No long contracts.
            </p>

            <div
              className="neo-reveal flex flex-col sm:flex-row gap-4 justify-center"
              style={{ transitionDelay: '240ms' }}
            >
              <button
                onClick={() => navigate('/signup')}
                className="inline-flex items-center justify-center gap-2 bg-[#0066FF] text-white border-2 border-[#0066FF] px-10 py-5 font-mono font-bold text-sm tracking-widest uppercase transition-all duration-200 hover:-translate-y-1"
                style={{ boxShadow: '4px 4px 0 rgba(255,255,255,0.3)' }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.boxShadow = '6px 6px 0 rgba(255,255,255,0.4)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.boxShadow = '4px 4px 0 rgba(255,255,255,0.3)';
                }}
              >
                Start Managing Smarter
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </button>
              <a
                href="#preview"
                className="inline-flex items-center justify-center gap-2 bg-transparent text-white border-2 border-white/25 px-10 py-5 font-mono font-bold text-sm tracking-widest uppercase transition-all duration-200 hover:-translate-y-1 hover:border-white/50"
                style={{ boxShadow: '4px 4px 0 rgba(255,255,255,0.08)' }}
              >
                View Demo
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTASection;
