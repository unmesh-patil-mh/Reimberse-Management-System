'use client';

import React, { useEffect, useRef, useState } from 'react';

interface WorkflowStep {
  id: number;
  role: string;
  action: string;
  detail: string;
  time: string;
  status: 'pending' | 'active' | 'done';
}

const steps: WorkflowStep[] = [
  {
    id: 1,
    role: 'Employee',
    action: 'Submit Expense',
    detail: 'Attaches receipt, selects category, adds business justification',
    time: '0 min',
    status: 'done',
  },
  {
    id: 2,
    role: 'Line Manager',
    action: 'First Approval',
    detail: 'Reviews context, approves or requests clarification',
    time: '< 2 hrs',
    status: 'done',
  },
  {
    id: 3,
    role: 'Finance Team',
    action: 'Policy Check',
    detail: 'Validates against company spend policy and budget codes',
    time: '< 4 hrs',
    status: 'active',
  },
  {
    id: 4,
    role: 'CFO',
    action: 'Final Sign-off',
    detail: 'Required only for expenses above $5,000 threshold',
    time: '< 6 hrs',
    status: 'pending',
  },
  {
    id: 5,
    role: 'Payroll',
    action: 'Reimbursement',
    detail: 'Auto-scheduled to next payroll cycle or instant bank transfer',
    time: '< 24 hrs',
    status: 'pending',
  },
];

const WorkflowSection: React.FC = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const [activeStep, setActiveStep] = useState(2);
  const [animated, setAnimated] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !animated) {
            setAnimated(true);
            entry.target.querySelectorAll('.reveal').forEach((el, i) => {
              setTimeout(() => el.classList.add('active'), i * 100);
            });
          }
        });
      },
      { threshold: 0.15 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, [animated]);

  // Auto-advance active step
  useEffect(() => {
    if (!animated) return;
    const interval = setInterval(() => {
      setActiveStep((prev) => (prev + 1) % steps.length);
    }, 2200);
    return () => clearInterval(interval);
  }, [animated]);

  return (
    <section
      id="workflow"
      ref={sectionRef}
      className="py-28 md:py-40 border-b border-white/5 relative overflow-hidden"
    >
      <div className="absolute inset-0 dot-grid opacity-20 pointer-events-none" aria-hidden="true" />

      <div className="max-w-[1440px] mx-auto px-6 md:px-12 relative z-10">
        {/* Header row */}
        <div className="grid grid-cols-1 md:grid-cols-12 mb-20 gap-8">
          <div className="md:col-span-3 flex flex-col justify-end">
            <span className="label-mono text-white/25 mb-4">02 / WORKFLOW</span>
          </div>
          <div className="md:col-span-9">
            <h2 className="font-display font-light text-white leading-[0.9] tracking-tight reveal active"
              style={{ fontSize: 'clamp(2.4rem, 6vw, 5rem)' }}>
              Every expense takes<br />
              <span className="italic text-white/40">the exact right path.</span>
            </h2>
          </div>
        </div>

        {/* Desktop: horizontal flow */}
        <div className="hidden md:flex items-start gap-0 mb-16 reveal active">
          {steps.map((step, i) => (
            <React.Fragment key={step.id}>
              <button
                onClick={() => setActiveStep(i)}
                className={`flex flex-col items-center gap-3 flex-1 group transition-all duration-500 text-left ${
                  activeStep === i ? 'opacity-100' : 'opacity-35 hover:opacity-60'
                }`}
              >
                {/* Node */}
                <div className="relative">
                  <div
                    className={`w-10 h-10 rounded-full border flex items-center justify-center transition-all duration-500 ${
                      activeStep === i
                        ? 'border-white bg-white text-black'
                        : i < activeStep
                        ? 'border-white/40 bg-white/10 text-white/60' :'border-white/15 bg-transparent text-white/25'
                    }`}
                  >
                    {i < activeStep ? (
                      <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                        <path d="M2 6l3 3 5-5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    ) : (
                      <span className="font-mono text-xs">{step.id}</span>
                    )}
                  </div>
                  {activeStep === i && (
                    <div className="pulse-ring absolute inset-0 rounded-full border border-white/30" aria-hidden="true" />
                  )}
                </div>

                {/* Label */}
                <div className="text-center px-2">
                  <div className="label-mono text-white/40 mb-1">{step.role}</div>
                  <div className="text-sm font-medium text-white">{step.action}</div>
                </div>
              </button>

              {/* Connector */}
              {i < steps.length - 1 && (
                <div
                  className={`workflow-connector mt-5 transition-all duration-700 ${
                    i < activeStep ? 'opacity-60' : 'opacity-15'
                  }`}
                  aria-hidden="true"
                />
              )}
            </React.Fragment>
          ))}
        </div>

        {/* Active step detail card */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          <div className="md:col-span-8 border border-white/8 bg-white/[0.02] p-8 md:p-12 relative overflow-hidden reveal active">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/[0.02] rounded-bl-full" aria-hidden="true" />
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-6">
                <span className="label-mono text-white/30">
                  Step {steps[activeStep].id} of {steps.length}
                </span>
                <span className={`label-mono px-2 py-1 border ${
                  steps[activeStep].status === 'active' ?'border-white/30 text-white bg-white/5'
                    : steps[activeStep].status === 'done' ?'border-white/15 text-white/40' :'border-white/8 text-white/20'
                }`}>
                  {steps[activeStep].status === 'active' ? '● In Progress' : steps[activeStep].status === 'done' ? '✓ Complete' : '○ Awaiting'}
                </span>
              </div>
              <div className="label-mono text-white/40 mb-2">{steps[activeStep].role}</div>
              <h3 className="font-display font-light text-white text-3xl md:text-4xl mb-4 tracking-tight">
                {steps[activeStep].action}
              </h3>
              <p className="text-white/50 text-sm leading-relaxed max-w-lg">
                {steps[activeStep].detail}
              </p>
              <div className="mt-8 flex items-center gap-3">
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none" className="text-white/30">
                  <circle cx="7" cy="7" r="6" stroke="currentColor" strokeWidth="1"/>
                  <path d="M7 4v3l2 2" stroke="currentColor" strokeWidth="1" strokeLinecap="round"/>
                </svg>
                <span className="label-mono text-white/40">SLA target: {steps[activeStep].time}</span>
              </div>
            </div>
          </div>

          {/* Mobile: step list */}
          <div className="md:col-span-4 flex flex-col gap-2">
            {steps.map((step, i) => (
              <button
                key={step.id}
                onClick={() => setActiveStep(i)}
                className={`flex items-center gap-4 p-4 border transition-all duration-300 text-left ${
                  activeStep === i
                    ? 'border-white/20 bg-white/5' :'border-white/5 hover:border-white/10 hover:bg-white/[0.02]'
                }`}
              >
                <div className={`w-6 h-6 rounded-full border flex items-center justify-center shrink-0 text-xs font-mono transition-colors ${
                  activeStep === i ? 'border-white bg-white text-black' : 'border-white/20 text-white/30'
                }`}>
                  {i < activeStep ? '✓' : step.id}
                </div>
                <div>
                  <div className="label-mono text-white/30 mb-0.5">{step.role}</div>
                  <div className={`text-sm font-medium transition-colors ${activeStep === i ? 'text-white' : 'text-white/40'}`}>
                    {step.action}
                  </div>
                </div>
                <div className="ml-auto label-mono text-white/20 shrink-0">{step.time}</div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default WorkflowSection;