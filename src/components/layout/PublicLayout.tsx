import React from 'react';
import { Outlet } from 'react-router-dom';
import { ToastContainer } from '../ui/Toast';

export const PublicLayout: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 font-sans selection:bg-indigo-500 selection:text-white">
      <main className="flex-1">
        <Outlet />
      </main>
      <ToastContainer />
    </div>
  );
};
