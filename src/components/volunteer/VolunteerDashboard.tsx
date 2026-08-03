import React, { useState, useEffect } from 'react';
import { useAuthStore } from '../../stores/authStore';
import { CheckCircle2, Clock, Calendar, AlertCircle, HeartHandshake, MapPin, ListTodo, Flag, MessageSquare } from 'lucide-react';

export const VolunteerDashboard: React.FC = () => {
  const user = useAuthStore((s) => s.user);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return (
       <div className="p-6 space-y-6 animate-pulse">
        <div className="h-32 bg-slate-800 rounded-3xl w-full"></div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map(i => <div key={i} className="h-32 bg-slate-800 rounded-2xl"></div>)}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fadeIn p-6">
      {/* Welcome Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-teal-900/50 via-emerald-900/40 to-slate-900 border border-teal-500/20 p-8 shadow-lg">
        <div className="absolute -right-10 -bottom-10 w-80 h-80 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-500/20 border border-teal-500/30 text-teal-300 text-sm font-medium mb-4">
              <HeartHandshake className="w-4 h-4" />
              Volunteer Hub
            </div>
            <h1 className="text-3xl font-bold text-white mb-2">Welcome back, {user?.name || 'Volunteer'}!</h1>
            <p className="text-teal-100/70 text-lg">You have 3 active tasks for the upcoming event.</p>
          </div>
          <button className="px-6 py-3 bg-teal-500 hover:bg-teal-600 text-white rounded-xl font-medium transition-colors flex items-center gap-2">
            <MapPin className="w-5 h-5" />
            Check In Today
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: 'Tasks Assigned', value: '8', icon: ListTodo, color: 'text-teal-400', bg: 'bg-teal-500/10', border: 'border-teal-500/20' },
          { label: 'Tasks Completed', value: '15', icon: CheckCircle2, color: 'text-emerald-400', bg: 'bg-emerald-500/10', border: 'border-emerald-500/20' },
          { label: 'Events Supported', value: '3', icon: Calendar, color: 'text-sky-400', bg: 'bg-sky-500/10', border: 'border-sky-500/20' },
          { label: 'Hours Volunteered', value: '24', icon: Clock, color: 'text-blue-400', bg: 'bg-blue-500/10', border: 'border-blue-500/20' },
        ].map((stat, i) => (
          <div key={i} className={`p-6 rounded-2xl glass-panel border ${stat.border} flex flex-col gap-4`}>
            <div className={`p-3 rounded-xl w-fit ${stat.bg} ${stat.color}`}>
              <stat.icon className="w-6 h-6" />
            </div>
            <div>
              <p className="text-slate-400 text-sm font-medium">{stat.label}</p>
              <h3 className="text-3xl font-bold text-white mt-1">{stat.value}</h3>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          {/* Active Tasks */}
          <div className="glass-panel rounded-2xl border border-slate-700/50 p-6">
            <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
              <Flag className="w-5 h-5 text-teal-400" />
              Active Tasks
            </h2>
            <div className="space-y-4">
              {[
                { title: 'Setup Registration Desk', deadline: 'Today, 8:00 AM', priority: 'High', status: 'In Progress' },
                { title: 'Guide Participants to Hall B', deadline: 'Today, 9:00 AM', priority: 'Medium', status: 'Pending' },
                { title: 'Distribute Swag Bags', deadline: 'Tomorrow, 12:00 PM', priority: 'Low', status: 'Pending' },
              ].map((task, i) => (
                <div key={i} className="flex items-center justify-between p-4 rounded-xl bg-slate-800/50 border border-slate-700/50 hover:border-teal-500/30 transition-colors">
                  <div className="flex items-start gap-4">
                     <div className={`p-2 rounded-lg ${task.priority === 'High' ? 'bg-red-500/20 text-red-400' : task.priority === 'Medium' ? 'bg-yellow-500/20 text-yellow-400' : 'bg-teal-500/20 text-teal-400'}`}>
                        <AlertCircle className="w-5 h-5" />
                     </div>
                    <div>
                      <h3 className="text-white font-medium">{task.title}</h3>
                      <p className="text-sm text-slate-400">Due: {task.deadline}</p>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <span className="text-xs px-2 py-1 rounded-md bg-slate-700 text-slate-300">{task.status}</span>
                    <button className="text-sm text-teal-400 hover:text-teal-300 font-medium">Mark Done</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-8">
          <div className="glass-panel rounded-2xl border border-slate-700/50 p-6">
            <h2 className="text-lg font-bold text-white mb-4">Quick Actions</h2>
            <div className="space-y-3">
              {[
                { label: 'View All Tasks', icon: ListTodo },
                { label: 'Report Issue', icon: AlertCircle },
                { label: 'Contact Organizers', icon: MessageSquare },
              ].map((action, i) => (
                <button key={i} className="w-full flex items-center justify-between p-3 rounded-xl bg-slate-800/50 hover:bg-teal-500/10 hover:text-teal-400 text-slate-300 border border-transparent hover:border-teal-500/30 transition-all text-sm font-medium">
                  <span className="flex items-center gap-3"><action.icon className="w-4 h-4" /> {action.label}</span>
                </button>
              ))}
            </div>
          </div>
          
           {/* Announcements */}
          <div className="glass-panel rounded-2xl border border-slate-700/50 p-6">
             <h2 className="text-lg font-bold text-white mb-4">Announcements</h2>
             <div className="space-y-4">
                <div className="p-4 rounded-xl bg-teal-500/10 border border-teal-500/20">
                  <h4 className="text-teal-400 font-medium text-sm mb-1">Briefing at 7:30 AM</h4>
                  <p className="text-slate-300 text-sm">All volunteers please assemble at the main hall for the morning briefing.</p>
                </div>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};
