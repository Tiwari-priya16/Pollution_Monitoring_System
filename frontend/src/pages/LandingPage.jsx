import React from 'react';
import HeroSection from '../components/landing/HeroSection';
import CategoryCards from '../components/landing/CategoryCards';
import HowItWorks from '../components/landing/HowItWorks';
import BenefitsSection from '../components/landing/BenefitsSection';
import SystemStatusBanner from '../components/landing/SystemStatusBanner';

export default function LandingPage() {
  return (
    <main className="flex-1">
      <HeroSection />
      <CategoryCards />
      <HowItWorks />
      <BenefitsSection />
      <SystemStatusBanner />
    </main>
  );
}

