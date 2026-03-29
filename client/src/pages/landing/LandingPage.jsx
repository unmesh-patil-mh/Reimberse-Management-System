import React, { useEffect, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';

import HeroSection from './HeroSection';
import ProblemStrip from './ProblemStrip';
import FeaturesSection from './FeaturesSection';
import HowItWorksSection from './HowItWorksSection';
import PreviewSection from './PreviewSection';
import FAQSection from './FAQSection';
import CTASection from './CTASection';
import NeoFooter from './NeoFooter';

const LandingPage = () => {
  const navigate = useNavigate();
  const audioPlayed = useRef(false);


  useEffect(() => {
    const playOnce = () => {
      if (audioPlayed.current) return;
      audioPlayed.current = true;

      const audio = new Audio('/faaah.mp3');
      audio.volume = 0.5;
      audio.play().catch(() => {});


      window.removeEventListener('click', playOnce);
      window.removeEventListener('scroll', playOnce);
      window.removeEventListener('keydown', playOnce);
      window.removeEventListener('touchstart', playOnce);
    };

    window.addEventListener('click', playOnce, { once: true });
    window.addEventListener('scroll', playOnce, { once: true });
    window.addEventListener('keydown', playOnce, { once: true });
    window.addEventListener('touchstart', playOnce, { once: true });

    return () => {
      window.removeEventListener('click', playOnce);
      window.removeEventListener('scroll', playOnce);
      window.removeEventListener('keydown', playOnce);
      window.removeEventListener('touchstart', playOnce);
    };
  }, []);

  return (
    <div className="landing-page">

      <nav className="fixed top-0 left-0 right-0 z-50 bg-[#F5F5F0]/90 backdrop-blur-md border-b-2 border-black">
        <div className="max-w-[1200px] mx-auto px-6 md:px-12 py-3 flex items-center justify-between">

          <div className="flex items-center gap-3">
            <div
              className="w-8 h-8 bg-black border-2 border-black flex items-center justify-center"
              style={{ boxShadow: '2px 2px 0 #0066FF' }}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5">
                <polyline points="20 6 9 17 4 12" />
              </svg>
            </div>
            <span className="font-display font-black text-black text-lg leading-none">ReimburseFlow</span>
          </div>


          <div className="hidden md:flex items-center gap-6">
            {[
              { label: 'Features', href: '#features' },
              { label: 'How It Works', href: '#how-it-works' },
              { label: 'Preview', href: '#preview' },
              { label: 'FAQ', href: '#faq' },
            ].map((item) => (
              <a
                key={item.label}
                href={item.href}
                className="font-mono text-xs text-black/50 hover:text-black transition-colors duration-150 tracking-widest uppercase"
              >
                {item.label}
              </a>
            ))}
          </div>


          <div className="flex items-center gap-3">
            <Link
              to="/login"
              className="font-mono text-xs text-black/60 hover:text-black transition-colors duration-150 tracking-widest uppercase"
            >
              Sign In
            </Link>
            <button
              onClick={() => navigate('/signup')}
              className="inline-flex items-center gap-2 bg-black text-white border-2 border-black px-4 py-2 font-mono font-bold text-xs tracking-widest uppercase transition-all duration-200 hover:-translate-y-0.5"
              style={{ boxShadow: '3px 3px 0 #0066FF' }}
            >
              Get Started
            </button>
          </div>
        </div>
      </nav>


      <HeroSection />
      <ProblemStrip />
      <FeaturesSection />
      <HowItWorksSection />
      <PreviewSection />
      <FAQSection />
      <CTASection />
      <NeoFooter />
    </div>
  );
};

export default LandingPage;
