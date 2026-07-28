import React from 'react';
import { LandingNavbar } from './LandingNavbar';
import { LandingFooter } from './LandingFooter';
import { ContactSection } from './ContactSection';

interface ContactPageProps {
  onNavigateLogin?: () => void;
  onNavigateSignup?: () => void;
  onNavigateHome?: () => void;
  onNavigateAbout?: () => void;
}

export const ContactPage: React.FC<ContactPageProps> = ({ onNavigateLogin, onNavigateSignup, onNavigateHome, onNavigateAbout }) => {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 font-sans">
      <LandingNavbar 
        onNavigateLogin={onNavigateLogin} 
        onNavigateSignup={onNavigateSignup} 
        onNavigateHome={onNavigateHome}
        onNavigateAbout={onNavigateAbout}
      />
      <main className="flex-1 pt-12 pb-12 bg-slate-900">
        <ContactSection />
      </main>
      <LandingFooter />
    </div>
  );
};
