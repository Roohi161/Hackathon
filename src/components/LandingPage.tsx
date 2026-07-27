import { useRef } from 'react';
import { LandingNavbar } from './landing/LandingNavbar';
import { HeroSection } from './landing/HeroSection';
import { WorkspaceCards } from './landing/WorkspaceCards';
import { FeaturedHackathons } from './landing/FeaturedHackathons';
import { HowItWorks } from './landing/HowItWorks';
import { PlatformFeatures } from './landing/PlatformFeatures';
import { Testimonials } from './landing/Testimonials';
import { FAQ } from './landing/FAQ';
import { Newsletter } from './landing/Newsletter';
import { LandingFooter } from './landing/LandingFooter';

interface LandingPageProps {
  onLogin: (role: 'participant' | 'organizer' | 'judge', user: { name: string; email: string; avatar: string }) => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onLogin }) => {
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
      {/* Sticky Navbar */}
      <LandingNavbar onGetStarted={scrollToWorkspace} />

      {/* Hero Section */}
      <HeroSection onExplore={scrollToHackathons} onHost={scrollToWorkspace} />

      {/* Featured Hackathons */}
      <div ref={hackathonsRef}>
        <FeaturedHackathons />
      </div>

      {/* How It Works */}
      <HowItWorks />

      {/* Workspace / Login Cards */}
      <div ref={workspaceRef}>
        <WorkspaceCards onLogin={onLogin} />
      </div>

      {/* Platform Features */}
      <PlatformFeatures />

      {/* Testimonials */}
      <Testimonials />

      {/* FAQ */}
      <FAQ />

      {/* Newsletter */}
      <Newsletter />

      {/* Footer */}
      <LandingFooter />
    </div>
  );
};
