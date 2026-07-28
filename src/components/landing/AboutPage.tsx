import React from 'react';
import { LandingNavbar } from './LandingNavbar';
import { LandingFooter } from './LandingFooter';
import { AboutSection } from './AboutSection';

interface AboutPageProps {
  onNavigateLogin?: () => void;
  onNavigateSignup?: () => void;
  onNavigateHome?: () => void;
  onNavigateContact?: () => void;
}

export const AboutPage: React.FC<AboutPageProps> = ({ onNavigateLogin, onNavigateSignup, onNavigateHome, onNavigateContact }) => {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 font-sans">
      <LandingNavbar 
        onNavigateLogin={onNavigateLogin} 
        onNavigateSignup={onNavigateSignup} 
        onNavigateHome={onNavigateHome}
        onNavigateContact={onNavigateContact}
      />
      <main className="flex-1 pt-24 pb-12">
        <AboutSection />
      </main>
      <LandingFooter />
    </div>
  );
};
