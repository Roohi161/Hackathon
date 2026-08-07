import React from 'react';
import { LoginPage } from '../LoginPage';

interface ModuleLoginProps {
  onLogin?: (role: string, user: any) => void;
  onSwitchToSignup?: () => void;
}

export const OrganizerLoginPage: React.FC<ModuleLoginProps> = (props) => {
  return <LoginPage targetRole="ORGANIZER" title="Organizer Portal Sign In" subtitle="Sign in to manage your hackathons, teams, and broadcasts" badgeText="ORGANIZER WORKSPACE" accentColor="indigo" {...props} />;
};
