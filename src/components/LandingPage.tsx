import { useRef } from 'react';
import { LandingNavbar } from './landing/LandingNavbar';
import { HeroSection } from './landing/HeroSection';
import { FeaturedHackathons } from './landing/FeaturedHackathons';
import { HowItWorks } from './landing/HowItWorks';
import { PlatformFeatures } from './landing/PlatformFeatures';
import { Testimonials } from './landing/Testimonials';
import { FAQ } from './landing/FAQ';
import { Newsletter } from './landing/Newsletter';
import { LandingFooter } from './landing/LandingFooter';
import { LeaderboardSection } from './landing/LeaderboardSection';
import { AboutSection } from './landing/AboutSection';
import { ContactSection } from './landing/ContactSection';

interface LandingPageProps {
  onLogin: (role: 'participant' | 'organizer' | 'judge' | 'admin', user: { name: string; email: string; avatar: string }) => void;
  onNavigateLogin?: () => void;
  onNavigateSignup?: () => void;
  onNavigateHome?: () => void;
  onNavigateAbout?: () => void;
  onNavigateContact?: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onLogin, onNavigateLogin, onNavigateSignup, onNavigateHome, onNavigateAbout, onNavigateContact }) => {
  const workspaceRef = useRef<HTMLDivElement>(null);
  const hackathonsRef = useRef<HTMLDivElement>(null);

  const scrollToWorkspace = () => {
    workspaceRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const scrollToHackathons = () => {
    hackathonsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <div className="min-h-screen bg-transparent text-slate-900 font-sans overflow-x-hidden">
      <LandingNavbar 
        onNavigateSignup={onNavigateSignup} 
        onNavigateLogin={onNavigateLogin} 
        onGetStarted={scrollToWorkspace} 
        onNavigateHome={onNavigateHome}
        onNavigateAbout={onNavigateAbout}
        onNavigateContact={onNavigateContact}
      />

      <div id="home">
        <HeroSection onExplore={scrollToHackathons} onHost={scrollToWorkspace} />
      </div>

      <div id="hackathons" ref={hackathonsRef}>
        <FeaturedHackathons />
      </div>

      <HowItWorks />

      <PlatformFeatures />
      
      <LeaderboardSection />
      
      <AboutSection />

      <Testimonials />

      <FAQ />

      <Newsletter />
      
      <ContactSection />

      <LandingFooter />
    </div>
  );
};
