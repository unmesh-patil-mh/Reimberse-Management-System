'use client';

import React from 'react';
import { AnimatePresence } from 'framer-motion';
import Header from '@/components/Header';
import HeroSection from './components/HeroSection';
import ProblemStrip from './components/ProblemStrip';
import FeaturesSection from './components/FeaturesSection';
import SmartLogic from './components/SmartLogic';
import HowItWorksSection from './components/HowItWorksSection';
import RolesSection from './components/RolesSection';
import PreviewSection from './components/PreviewSection';
import CTASection from './components/CTASection';
import NeoFooter from './components/NeoFooter';
import PageTransition from '@/components/PageTransition';

export default function HomePage() {
  return (
    <main className="bg-[#F5F5F0] min-h-screen overflow-x-hidden">
      <Header />
      <AnimatePresence mode="wait">
        <PageTransition key="home-content">
          <HeroSection />
          <ProblemStrip />
          <FeaturesSection />
          <SmartLogic />
          <HowItWorksSection />
          <RolesSection />
          <PreviewSection />
          <CTASection />
        </PageTransition>
      </AnimatePresence>
      <NeoFooter />
    </main>
  );
}