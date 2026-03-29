import React from 'react';

const NeoFooter = () => {
  return (
    <footer className="border-t-2 border-black bg-[#F5F5F0] px-6 md:px-12 py-10" aria-label="Footer">
      <div className="max-w-[1200px] mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
        {/* Brand */}
        <div className="flex items-center gap-3">
          <div
            className="w-8 h-8 bg-black border-2 border-black flex items-center justify-center"
            style={{ boxShadow: '2px 2px 0 #0066FF' }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5">
              <polyline points="20 6 9 17 4 12" />
            </svg>
          </div>
          <div>
            <div className="font-display font-black text-black text-base leading-none">ReimburseFlow</div>
            <div className="font-mono text-xs text-black/40 mt-0.5">Automated. Accurate. Instant.</div>
          </div>
        </div>

        {/* Nav links */}
        <div className="flex items-center gap-6">
          {['Features', 'How It Works', 'Preview', 'FAQ'].map((link) => (
            <a
              key={link}
              href={`#${link.toLowerCase().replace(/\s+/g, '-')}`}
              className="font-mono text-xs text-black/40 hover:text-black transition-colors duration-150 uppercase tracking-wider"
            >
              {link}
            </a>
          ))}
        </div>

        {/* Copyright */}
        <div className="font-mono text-xs text-black/30">
          © {new Date().getFullYear()} ReimburseFlow
        </div>
      </div>
    </footer>
  );
};

export default NeoFooter;
