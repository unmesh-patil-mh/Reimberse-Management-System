'use client';

import React, { useEffect, useRef } from 'react';

const roles = [
  {
    role: 'Employee',
    action: 'Submit & Track',
    desc: 'Submit expense claims, attach receipts, and track approval status in real-time — no follow-up emails needed.',
    capabilities: ['Submit expenses', 'Upload receipts', 'Track status live', 'View history'],
    bg: '#F5F5F0',
    accent: '#000',
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
        <circle cx="12" cy="7" r="4" />
      </svg>
    ),
  },
  {
    role: 'Manager',
    action: 'Approve Workflows',
    desc: 'Review assigned expenses, approve or reject with one click, and add comments for audit trails.',
    capabilities: ['Review queue', 'Approve / Reject', 'Add comments', 'Delegate approvals'],
    bg: '#000',
    accent: '#0066FF',
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
        <path d="M16 3.13a4 4 0 0 1 0 7.75" />
      </svg>
    ),
  },
  {
    role: 'Admin',
    action: 'Configure Rules',
    desc: 'Define approval hierarchies, set spending thresholds, manage company policies, and audit everything.',
    capabilities: ['Set thresholds', 'Configure rules', 'Manage users', 'Full audit log'],
    bg: '#0066FF',
    accent: '#000',
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <circle cx="12" cy="12" r="3" />
        <path d="M19.07 4.93a10 10 0 0 1 0 14.14M4.93 4.93a10 10 0 0 0 0 14.14" />
      </svg>
    ),
  },
];

const RolesSection: React.FC = () => {
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
      className="py-24 px-6 md:px-12 bg-[#F5F5F0]"
      aria-label="Role-Based System"
    >
      <div className="max-w-[1200px] mx-auto">
        {/* Header */}
        <div className="neo-reveal mb-14">
          <div
            className="inline-block border-2 border-black bg-[#F5F5F0] px-3 py-1 mb-4 font-mono text-xs font-bold tracking-widest uppercase"
            style={{ boxShadow: '2px 2px 0 #000' }}
          >
            Role-Based System
          </div>
          <h2
            className="font-display font-black text-black leading-tight"
            style={{ fontSize: 'clamp(2rem, 5vw, 3.5rem)' }}
          >
            Designed for<br />Every Role
          </h2>
        </div>

        {/* Role cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {roles.map((r, i) => (
            <div
              key={r.role}
              className="neo-reveal group border-2 border-black p-8 hover:-translate-y-2 transition-all duration-200"
              style={{
                background: r.bg,
                boxShadow: '5px 5px 0 #000',
                transitionDelay: `${i * 100}ms`,
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLElement).style.boxShadow = `6px 6px 0 ${r.accent === '#000' ? '#0066FF' : '#000'}`;
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.boxShadow = '5px 5px 0 #000';
              }}
            >
              {/* Icon */}
              <div
                className="inline-flex items-center justify-center w-12 h-12 border-2 mb-6"
                style={{
                  borderColor: r.bg === '#000' ? 'rgba(255,255,255,0.2)' : '#000',
                  background: r.bg === '#000' ? 'rgba(255,255,255,0.08)' : r.bg === '#0066FF' ? 'rgba(0,0,0,0.15)' : '#000',
                  color: r.bg === '#000' || r.bg === '#0066FF' ? '#fff' : '#fff',
                }}
              >
                {r.icon}
              </div>

              {/* Role label */}
              <div
                className="inline-block border px-2 py-0.5 font-mono text-xs font-bold tracking-widest uppercase mb-3"
                style={{
                  borderColor: r.bg === '#000' ? 'rgba(255,255,255,0.2)' : r.bg === '#0066FF' ? 'rgba(0,0,0,0.2)' : '#000',
                  color: r.bg === '#000' ? 'rgba(255,255,255,0.5)' : r.bg === '#0066FF' ? 'rgba(0,0,0,0.5)' : 'rgba(0,0,0,0.4)',
                }}
              >
                {r.role}
              </div>

              <h3
                className="font-display font-black text-xl mb-3"
                style={{ color: r.bg === '#000' || r.bg === '#0066FF' ? '#fff' : '#000' }}
              >
                {r.action}
              </h3>
              <p
                className="font-body text-sm leading-relaxed mb-6"
                style={{ color: r.bg === '#000' ? 'rgba(255,255,255,0.5)' : r.bg === '#0066FF' ? 'rgba(255,255,255,0.7)' : 'rgba(0,0,0,0.55)' }}
              >
                {r.desc}
              </p>

              {/* Capabilities */}
              <ul className="space-y-2">
                {r.capabilities.map((cap) => (
                  <li key={cap} className="flex items-center gap-2">
                    <svg
                      width="14"
                      height="14"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke={r.bg === '#000' ? '#0066FF' : r.bg === '#0066FF' ? '#fff' : '#0066FF'}
                      strokeWidth="3"
                    >
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                    <span
                      className="font-mono text-xs"
                      style={{ color: r.bg === '#000' ? 'rgba(255,255,255,0.6)' : r.bg === '#0066FF' ? 'rgba(255,255,255,0.8)' : 'rgba(0,0,0,0.6)' }}
                    >
                      {cap}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default RolesSection;