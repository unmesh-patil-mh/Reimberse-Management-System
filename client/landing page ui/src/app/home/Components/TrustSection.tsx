'use client';

import React, { useEffect, useRef, useState } from 'react';

interface StatBar {
  year: string;
  value: number;
  label: string;
  height: string;
}

const bars: StatBar[] = [
  { year: '2022', value: 0.3, label: '$0.3B', height: '20%' },
  { year: '2023', value: 0.8, label: '$0.8B', height: '40%' },
  { year: '2024', value: 1.6, label: '$1.6B', height: '70%' },
  { year: '2025', value: 2.4, label: '$2.4B', height: '95%' },
];

const trustStats = [
  { label: 'Companies Onboarded', value: '4,800+' },
  { label: 'Expenses Processed', value: '$2.4B+' },
  { label: 'Avg. Approval Time', value: '6.2 hrs' },
  { label: 'SLA Uptime', value: '99.98%' },
];

const certs = [
  { name: 'SOC 2 Type II', icon: '⬡' },
  { name: 'GDPR Compliant', icon: '⬡' },
  { name: 'ISO 27001', icon: '⬡' },
  { name: 'HIPAA Ready', icon: '⬡' },
];

const TrustSection: React.FC = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const [animated, setAnimated] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !animated) {
            setAnimated(true);
            entry.target.querySelectorAll('.reveal').forEach((el, i) => {
              setTimeout(() => el.classList.add('active'), i * 80);
            });
          }
        });
      },
      { threshold: 0.15 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, [animated]);

  return (
    <section
      ref={sectionRef}
      className="py-28 md:py-40 border-b border-white/5 relative overflow-hidden"
    >
      <div className="absolute inset-0 dot-grid opacity-15 pointer-events-none" aria-hidden="true" />

      <div className="max-w-[1440px] mx-auto px-6 md:px-12 relative z-10">
        {/* Header */}
        <div className="grid grid-cols-1 md:grid-cols-12 mb-20 gap-8">
          <div className="md:col-span-3">
            <span className="label-mono text-white/25 block mb-4">04 / TRUST</span>
          </div>
          <div className="md:col-span-9">
            <h2
              className="font-display font-light text-white leading-[0.9] tracking-tight reveal active"
              style={{ fontSize: 'clamp(2.4rem, 6vw, 5rem)' }}
            >
              Global scale,<br />
              <span className="italic text-white/40">uncompromising compliance.</span>
            </h2>
          </div>
        </div>

        {/* Two-column layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
          {/* Bar chart — processed volume */}
          <div className="border border-white/8 bg-white/[0.02] p-8 md:p-12 reveal active">
            <div className="label-mono text-white/25 mb-2">Active Protected Volume</div>
            <div className="font-display font-light text-white text-5xl md:text-6xl tracking-tight mb-12">
              $2.4B+
            </div>
            <div className="grid grid-cols-4 border-t border-white/8">
              {bars.map((bar, i) => (
                <div
                  key={bar.year}
                  className="border-r border-white/8 last:border-r-0 p-4 flex flex-col justify-between group hover:bg-white/[0.03] transition-colors cursor-default"
                >
                  <span className="label-mono text-white/20">{bar.year}</span>
                  <div className="relative h-24 mt-4">
                    <div
                      className={`absolute bottom-0 left-0 right-0 bg-white/10 group-hover:bg-white/20 transition-all duration-700 ${
                        animated ? 'bar-animated' : ''
                      }`}
                      style={{
                        height: animated ? bar.height : '0',
                        '--bar-height': bar.height,
                        transitionDelay: `${i * 150}ms`,
                        transition: animated ? `height 1.2s cubic-bezier(0.16, 1, 0.3, 1) ${i * 150}ms` : 'none',
                      } as React.CSSProperties}
                    />
                  </div>
                  <span className="label-mono text-white/50 mt-2">{bar.label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Stats grid */}
          <div className="grid grid-cols-2 gap-3">
            {trustStats.map((stat, i) => (
              <div
                key={stat.label}
                className={`border border-white/8 bg-white/[0.02] p-8 flex flex-col justify-between reveal reveal-delay-${i + 1} active`}
              >
                <span className="label-mono text-white/25">{stat.label}</span>
                <span
                  className="font-display font-light text-white tracking-tight"
                  style={{ fontSize: 'clamp(1.8rem, 3.5vw, 3rem)' }}
                >
                  {stat.value}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Certifications row */}
        <div className="border border-white/8 bg-white/[0.02] p-6 md:p-8 reveal active">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div>
              <div className="label-mono text-white/25 mb-2">Proudly Certified</div>
              <p className="text-sm text-white/40 max-w-sm">
                Enterprise-grade security infrastructure audited annually by independent third parties.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              {certs.map((cert) => (
                <div
                  key={cert.name}
                  className="flex items-center gap-2.5 border border-white/10 px-4 py-2.5 hover:border-white/25 hover:bg-white/[0.03] transition-all cursor-default"
                >
                  <span className="text-white/30 text-sm">{cert.icon}</span>
                  <span className="label-mono text-white/50">{cert.name}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TrustSection;