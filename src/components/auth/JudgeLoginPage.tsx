import React from 'react';
import { LoginPage } from '../LoginPage';

interface ModuleLoginProps {
  onLogin?: (role: string, user: any) => void;
  onSwitchToSignup?: () => void;
}

export const JudgeLoginPage: React.FC<ModuleLoginProps> = (props) => {
  return <LoginPage targetRole="JUDGE" title="Judge Portal Sign In" subtitle="Sign in with your judge credentials to evaluate submissions" badgeText="JUDGE EVALUATION PORTAL" accentColor="purple" {...props} />;
};
