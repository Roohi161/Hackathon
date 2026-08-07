import React from 'react';
import { LoginPage } from '../LoginPage';

interface ModuleLoginProps {
  onLogin?: (role: string, user: any) => void;
  onSwitchToSignup?: () => void;
}

export const AdminLoginPage: React.FC<ModuleLoginProps> = (props) => {
  return <LoginPage targetRole="ADMIN" title="Admin Portal Sign In" subtitle="Sign in to access system administration dashboard" badgeText="ADMIN PORTAL" accentColor="rose" {...props} />;
};
