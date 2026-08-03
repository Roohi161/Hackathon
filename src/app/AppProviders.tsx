import React, { useEffect } from 'react';
import { BrowserRouter } from 'react-router-dom';
import { useHackathonStore } from '../stores/hackathonStore';

export interface AppProvidersProps {
  children: React.ReactNode;
}

export const AppProviders: React.FC<AppProvidersProps> = ({ children }) => {
  useEffect(() => {
    useHackathonStore.getState().fetchHackathons().catch(() => { /* silently handle */ });
  }, []);

  return <BrowserRouter>{children}</BrowserRouter>;
};
