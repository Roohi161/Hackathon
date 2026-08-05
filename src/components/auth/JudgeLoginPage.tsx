import React from 'react';
import { LoginPage } from '../LoginPage';

export const JudgeLoginPage: React.FC = () => {
  return <LoginPage targetRole="JUDGE" title="Judge Portal Sign In" subtitle="Sign in with your judge credentials to evaluate submissions" badgeText="JUDGE EVALUATION PORTAL" accentColor="purple" />;
};
