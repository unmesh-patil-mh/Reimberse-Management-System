'use client';

import React, { useEffect, useRef } from 'react';
import AppImage from '@/components/ui/AppImage';

interface Testimonial {
  quote: string;
  name: string;
  title: string;
  company: string;
  metric: string;
  metricLabel: string;
  avatar: string;
}

const testimonials: Testimonial[] = [
{
  quote:
  "Before ReimburseFlow, our finance team spent 3 days per month chasing approvals on spreadsheets. Now the entire cycle is under 8 hours — automatically routed, automatically escalated.",
  name: 'Margaret Holloway',
  title: 'CFO',
  company: 'Thornfield Manufacturing',
  metric: '-89%',
  metricLabel: 'Processing time',
  avatar: "https://img.rocket.new/generatedImages/rocket_gen_img_10900faf4-1771069022553.png"
},
{
  quote:
  "The multi-tenancy was a dealbreaker requirement for us — we manage 14 subsidiaries. ReimburseFlow handles each entity's approval policies independently while giving us a consolidated view.",
  name: 'David Okonkwo',
  title: 'VP Finance',
  company: 'Meridian Capital Group',
  metric: '14',
  metricLabel: 'Entities unified',
  avatar: "https://img.rocket.new/generatedImages/rocket_gen_img_1148315fd-1768239578434.png"
},
{
  quote:
  "Our auditors specifically called out ReimburseFlow's audit trail as best-in-class. Every approval, every rejection, every policy exception — timestamped and immutable.",
  name: 'Rachel Steinberg',
  title: 'Controller',
  company: 'Vertex Biosciences',
  metric: '100%',
  metricLabel: 'Audit pass rate',
  avatar: "https://img.rocket.new/generatedImages/rocket_gen_img_1027b40ec-1772195278643.png"
}];


const TestimonialsSection: React.FC = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const groupRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.querySelectorAll('.reveal').forEach((el, i) => {
              setTimeout(() => el.classList.add('active'), i * 100);
            });
          }
        });
      },
      { threshold: 0.1 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);

    const group = groupRef.current;
    if (group) {
      const handleMouse = (e: MouseEvent) => {
        group.querySelectorAll<HTMLElement>('.spotlight-card').forEach((card) => {
          const rect = card.getBoundingClientRect();
          card.style.setProperty('--mouse-x', `${e.clientX - rect.left}px`);
          card.style.setProperty('--mouse-y', `${e.clientY - rect.top}px`);
        });
      };
      group.addEventListener('mousemove', handleMouse);
      return () => {
        observer.disconnect();
        group.removeEventListener('mousemove', handleMouse);
      };
    }
    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="py-28 md:py-40 border-b border-white/5 relative">
      
      <div className="max-w-[1440px] mx-auto px-6 md:px-12">
        {/* Header */}
        <div className="grid grid-cols-1 md:grid-cols-12 mb-16 gap-8">
          <div className="md:col-span-3">
            <span className="label-mono text-white/25 block mb-4">05 / RESULTS</span>
          </div>
          <div className="md:col-span-6">
            <h2
              className="font-display font-light text-white leading-[0.9] tracking-tight reveal active"
              style={{ fontSize: 'clamp(2.4rem, 6vw, 5rem)' }}>
              
              Finance teams<br />
              <span className="italic text-white/40">that trust the process.</span>
            </h2>
          </div>
        </div>

        {/* Testimonial cards */}
        <div
          ref={groupRef}
          className="spotlight-group grid grid-cols-1 md:grid-cols-3 gap-3">
          
          {testimonials.map((t, i) =>
          <div
            key={t.name}
            className={`spotlight-card border border-white/8 bg-white/[0.015] p-8 md:p-10 flex flex-col justify-between min-h-[340px] reveal reveal-delay-${i + 1} active`}
            style={{ '--mouse-x': '50%', '--mouse-y': '50%' } as React.CSSProperties}>
            
              <div className="relative z-10">
                {/* Quote mark */}
                <div className="font-display text-5xl text-white/10 leading-none mb-4">"</div>
                <p className="text-white/60 text-base leading-relaxed font-display font-light italic mb-8">
                  {t.quote}
                </p>
              </div>

              <div className="relative z-10 flex items-end justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full overflow-hidden border border-white/10 shrink-0">
                    <AppImage
                    src={t.avatar}
                    alt={`${t.name}, ${t.title} at ${t.company}`}
                    width={40}
                    height={40}
                    className="w-full h-full object-cover grayscale" />
                  
                  </div>
                  <div>
                    <div className="text-sm font-medium text-white">{t.name}</div>
                    <div className="label-mono text-white/35">{t.title}, {t.company}</div>
                  </div>
                </div>
                <div className="text-right shrink-0">
                  <div className="font-display font-light text-white text-2xl tracking-tight">{t.metric}</div>
                  <div className="label-mono text-white/30">{t.metricLabel}</div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>);

};

export default TestimonialsSection;