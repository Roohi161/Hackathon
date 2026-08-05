import React from 'react';
import { LoginPage } from '../LoginPage';

export const AdminLoginPage: React.FC = () => {
  return <LoginPage targetRole="ADMIN" title="Admin Portal Sign In" subtitle="Sign in to access system administration dashboard" badgeText="ADMIN PORTAL" accentColor="rose" />;
};
