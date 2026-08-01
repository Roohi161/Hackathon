import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuthStore } from '../stores/authStore';
import { UserRole } from '../types/auth';

export interface RoleRouteProps {
  allowedRoles: UserRole[];
}

export const RoleRoute: React.FC<RoleRouteProps> = ({ allowedRoles }) => {
  const { role, isAuthenticated } = useAuthStore();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Normalize role string comparison
  const normalizedRole = (role || 'PARTICIPANT').toUpperCase();
  const normalizedAllowed = allowedRoles.map((r) => r.toUpperCase());

  if (!normalizedAllowed.includes(normalizedRole)) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] p-6 text-center">
        <h2 className="text-2xl font-bold text-slate-800 dark:text-white mb-2">
          403 — Access Denied
        </h2>
        <p className="text-slate-500 dark:text-slate-400 max-w-md">
          You do not have permission to view this workspace. Switch your active role or request permission.
        </p>
      </div>
    );
  }

  return <Outlet />;
};
