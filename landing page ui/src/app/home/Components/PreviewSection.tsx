'use client';

import React, { useEffect, useRef, useState } from 'react';

interface Expense {
  id: string;
  description: string;
  amount: string;
  date: string;
  category: string;
  status: 'Approved' | 'Pending' | 'Rejected';
}

const initialExpenses: Expense[] = [
  { id: 'EXP-0891', description: 'Team Offsite — Hotel', amount: '$1,240.00', date: 'Mar 28', category: 'Travel', status: 'Approved' },
  { id: 'EXP-0892', description: 'AWS Infrastructure', amount: '$340.50', date: 'Mar 27', category: 'Software', status: 'Pending' },
  { id: 'EXP-0893', description: 'Client Lunch', amount: '$89.99', date: 'Mar 26', category: 'Meals', status: 'Pending' },
  { id: 'EXP-0894', description: 'Legal Consultation', amount: '$2,100.00', date: 'Mar 25', category: 'Legal', status: 'Rejected' },
  { id: 'EXP-0895', description: 'Office Supplies', amount: '$54.20', date: 'Mar 24', category: 'Office', status: 'Approved' },
];

const statusConfig = {
  Approved: { bg: 'bg-green-500/15', text: 'text-green-400', border: 'border-green-500/30', dot: 'bg-green-400' },
  Pending: { bg: 'bg-[#0066FF]/15', text: 'text-[#0066FF]', border: 'border-[#0066FF]/30', dot: 'bg-[#0066FF]' },
  Rejected: { bg: 'bg-red-500/15', text: 'text-red-400', border: 'border-red-500/30', dot: 'bg-red-400' },
};

const PreviewSection: React.FC = () => {
  const ref = useRef<HTMLElement>(null);
  const [expenses, setExpenses] = useState<Expense[]>(initialExpenses);
  const [animatingId, setAnimatingId] = useState<string | null>(null);

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

  // Animate Pending → Approved transition
  useEffect(() => {
    const interval = setInterval(() => {
      setExpenses((prev) => {
        const pendingIdx = prev.findIndex((e) => e.status === 'Pending');
        if (pendingIdx === -1) {
          // Reset
          return initialExpenses.map((e) => ({ ...e }));
        }
        const updated = [...prev];
        setAnimatingId(updated[pendingIdx].id);
        setTimeout(() => setAnimatingId(null), 800);
        updated[pendingIdx] = { ...updated[pendingIdx], status: 'Approved' };
        return updated;
      });
    }, 2800);
    return () => clearInterval(interval);
  }, []);

  return (
    <section
      id="preview"
      ref={ref}
      className="py-24 px-6 md:px-12 bg-black"
      aria-label="Live System Preview"
    >
      <div className="max-w-[1200px] mx-auto">
        {/* Header */}
        <div className="neo-reveal mb-14">
          <div
            className="inline-block border-2 border-[#0066FF] bg-transparent px-3 py-1 mb-4 font-mono text-xs font-bold tracking-widest uppercase text-[#0066FF]"
          >
            Live Preview
          </div>
          <h2
            className="font-display font-black text-white leading-tight"
            style={{ fontSize: 'clamp(2rem, 5vw, 3.5rem)' }}
          >
            Watch it work<br />in real-time
          </h2>
        </div>

        {/* Dashboard mock */}
        <div
          className="neo-reveal border-2 border-white/15 bg-[#0a0a0a] overflow-hidden"
          style={{ transitionDelay: '120ms', boxShadow: '8px 8px 0 #0066FF' }}
        >
          {/* Dashboard header bar */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 bg-white/3">
            <div className="flex items-center gap-3">
              <div className="w-2.5 h-2.5 rounded-full bg-[#0066FF] animate-pulse" />
              <span className="font-mono text-xs text-white/50">Expense Dashboard — Live</span>
            </div>
            <div className="flex items-center gap-4">
              <div className="font-mono text-xs text-white/30">Mar 2024</div>
              <div className="border border-white/15 px-3 py-1 font-mono text-xs text-white/50">
                5 expenses
              </div>
            </div>
          </div>

          {/* Stats row */}
          <div className="grid grid-cols-3 border-b border-white/10">
            {[
              { label: 'Total Submitted', value: '$3,824.69', color: 'text-white' },
              { label: 'Approved', value: '$1,294.20', color: 'text-green-400' },
              { label: 'Pending Review', value: '$430.49', color: 'text-[#0066FF]' },
            ].map((stat) => (
              <div key={stat.label} className="px-6 py-4 border-r border-white/10 last:border-r-0">
                <div className="font-mono text-xs text-white/30 mb-1">{stat.label}</div>
                <div className={`font-mono font-black text-lg ${stat.color}`}>{stat.value}</div>
              </div>
            ))}
          </div>

          {/* Table header */}
          <div className="grid grid-cols-5 px-6 py-3 border-b border-white/10 bg-white/2">
            {['ID', 'Description', 'Amount', 'Date', 'Status'].map((h) => (
              <div key={h} className="font-mono text-xs text-white/25 uppercase tracking-widest">{h}</div>
            ))}
          </div>

          {/* Table rows */}
          <div>
            {expenses.map((exp) => {
              const cfg = statusConfig[exp.status];
              const isAnimating = animatingId === exp.id;
              return (
                <div
                  key={exp.id}
                  className={`grid grid-cols-5 px-6 py-4 border-b border-white/8 items-center transition-all duration-700 ${isAnimating ? 'bg-green-500/5' : 'hover:bg-white/3'}`}
                >
                  <div className="font-mono text-xs text-white/40">{exp.id}</div>
                  <div className="font-body text-sm text-white/80 truncate pr-4">{exp.description}</div>
                  <div className="font-mono text-sm font-bold text-white">{exp.amount}</div>
                  <div className="font-mono text-xs text-white/35">{exp.date}</div>
                  <div>
                    <span
                      className={`inline-flex items-center gap-1.5 border px-2.5 py-1 font-mono text-xs font-bold transition-all duration-700 ${cfg.bg} ${cfg.text} ${cfg.border}`}
                    >
                      <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot} ${exp.status === 'Pending' ? 'animate-pulse' : ''}`} />
                      {exp.status}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};

export default PreviewSection;
