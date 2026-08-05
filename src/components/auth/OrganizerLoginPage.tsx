import React from 'react';
import { LoginPage } from '../LoginPage';

export const OrganizerLoginPage: React.FC = () => {
  return <LoginPage targetRole="ORGANIZER" title="Organizer Portal Sign In" subtitle="Sign in to manage your hackathons, teams, and broadcasts" badgeText="ORGANIZER WORKSPACE" accentColor="indigo" />;
};
