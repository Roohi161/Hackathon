import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuthStore } from '../stores/authStore';
import { UserRole } from '../types/auth';
import { ShieldAlert, ArrowRight, UserCheck } from 'lucide-react';

export interface RoleRouteProps {
  allowedRoles: UserRole[];
}

export const RoleRoute: React.FC<RoleRouteProps> = ({ allowedRoles }) => {
  const { role, isAuthenticated, updateUser } = useAuthStore();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Normalize role string comparison
  const normalizedRole = (role || 'PARTICIPANT').toUpperCase();
  const normalizedAllowed = allowedRoles.map((r) => r.toUpperCase());

  if (!normalizedAllowed.includes(normalizedRole)) {
    const targetRole = (allowedRoles[0] || 'ADMIN') as UserRole;
    
    const handleSwitchRole = () => {
      updateUser({ role: targetRole });
    };

    return (
      <div className="flex flex-col items-center justify-center min-h-[70vh] p-6 text-center bg-[#070913] text-slate-100 font-sans relative overflow-hidden">
        <div className="w-16 h-16 rounded-2xl bg-indigo-500/20 text-indigo-400 border border-indigo-500/30 flex items-center justify-center mb-5 shadow-lg shadow-indigo-500/10">
          <ShieldAlert className="w-8 h-8" />
        </div>

        <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight mb-2">
          Role Switch Required
        </h2>

        <p className="text-slate-400 text-sm max-w-md mb-6 leading-relaxed">
          You are currently signed in as <span className="font-extrabold text-indigo-400 uppercase">{normalizedRole}</span>. Accessing this workspace requires <span className="font-extrabold text-white uppercase">{targetRole}</span> privileges.
        </p>

        <div className="flex flex-col sm:flex-row items-center gap-3">
          <button
            onClick={handleSwitchRole}
            className="px-6 py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 text-white font-bold text-sm shadow-lg shadow-indigo-600/30 hover:shadow-indigo-600/50 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center gap-2"
          >
            <UserCheck className="w-4 h-4" />
            Switch to {targetRole} Role & Open Portal
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    );
  }

  return <Outlet />;
};
