import React, { useState } from 'react';
import {
  Users,
  MessageSquare,
  Kanban,
  Send,
  Crown,
  Plus
} from 'lucide-react';

export const TeamsWorkspaceView: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'chat' | 'kanban'>('dashboard');

  // Chat State
  const [messages, setMessages] = useState([
    { id: 1, sender: 'Roohi (Leader)', text: 'Hey team! Let\'s lock down the architecture for our AI pipeline.', time: '10:14 AM', isLeader: true },
    { id: 2, sender: 'Ansar', text: 'I completed the ML model training and embeddings API routes!', time: '10:16 AM', isLeader: false },
    { id: 3, sender: 'Dr. John Doe (Mentor)', text: 'Great progress! Make sure to benchmark the vector retrieval latency.', time: '10:20 AM', isMentor: true },
    { id: 4, sender: 'Bhavya', text: '```typescript\nconst embedQuery = async (text: string) => await aiClient.embed(text);\n```', time: '10:25 AM', isLeader: false }
  ]);
  const [newMessage, setNewMessage] = useState('');

  // Kanban Tasks State
  const [tasks, setTasks] = useState([
    { id: 't1', title: 'Backend REST API Endpoints', category: 'Backend', status: 'To Do', assignee: 'Ansar' },
    { id: 't2', title: 'React Frontend Dashboard UI', category: 'Frontend', status: 'To Do', assignee: 'Bhavya' },
    { id: 't3', title: 'JWT Authentication & OAuth', category: 'Security', status: 'In Progress', assignee: 'Roohi' },
    { id: 't4', title: 'PostgreSQL Database Migrations', category: 'Database', status: 'Completed', assignee: 'Roohi' }
  ]);
  const [newTaskTitle, setNewTaskTitle] = useState('');

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim()) return;
    setMessages([
      ...messages,
      {
        id: Date.now(),
        sender: 'Roohi (You)',
        text: newMessage,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        isLeader: true
      }
    ]);
    setNewMessage('');
  };

  const handleAddTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskTitle.trim()) return;
    setTasks([
      ...tasks,
      {
        id: `t-${Date.now()}`,
        title: newTaskTitle,
        category: 'Feature',
        status: 'To Do',
        assignee: 'Roohi'
      }
    ]);
    setNewTaskTitle('');
  };

  const moveTaskStatus = (taskId: string, newStatus: 'To Do' | 'In Progress' | 'Completed') => {
    setTasks(tasks.map(t => t.id === taskId ? { ...t, status: newStatus } : t));
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      
      {/* Workspace Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-3xl bg-white border border-slate-200 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-2xl bg-indigo-50 text-indigo-600 border border-indigo-100 shadow-2xs">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-extrabold text-slate-900 tracking-tight">Alpha Coders</h2>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-emerald-100 text-emerald-700">
                Active Team
              </span>
            </div>
            <p className="text-xs font-semibold text-slate-500">Participating in AI Hackathon 2026 • 4 Members</p>
          </div>
        </div>

        {/* Tab Buttons */}
        <div className="flex items-center gap-1.5 p-1 rounded-2xl bg-slate-100 border border-slate-200/80">
          <button
            onClick={() => setActiveTab('dashboard')}
            className={`px-3.5 py-2 text-xs font-bold rounded-xl transition-all ${
              activeTab === 'dashboard'
                ? 'bg-white text-indigo-600 shadow-2xs'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            Overview
          </button>
          <button
            onClick={() => setActiveTab('chat')}
            className={`px-3.5 py-2 text-xs font-bold rounded-xl transition-all flex items-center gap-1.5 ${
              activeTab === 'chat'
                ? 'bg-white text-indigo-600 shadow-2xs'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <MessageSquare className="w-3.5 h-3.5" /> Team Chat
          </button>
          <button
            onClick={() => setActiveTab('kanban')}
            className={`px-3.5 py-2 text-xs font-bold rounded-xl transition-all flex items-center gap-1.5 ${
              activeTab === 'kanban'
                ? 'bg-white text-indigo-600 shadow-2xs'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <Kanban className="w-3.5 h-3.5" /> Task Board
          </button>
        </div>
      </div>

      {/* OVERVIEW TAB */}
      {activeTab === 'dashboard' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="p-5 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Team Leader</span>
              <div className="text-base font-extrabold text-slate-900 flex items-center gap-1.5">
                <Crown className="w-4 h-4 text-amber-500" /> Roohi (You)
              </div>
            </div>
            <div className="p-5 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Total Members</span>
              <div className="text-base font-extrabold text-slate-900">4 / 4 Members</div>
            </div>
            <div className="p-5 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Assigned Mentor</span>
              <div className="text-base font-extrabold text-indigo-600">Dr. John Doe</div>
            </div>
            <div className="p-5 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Project Progress</span>
              <div className="text-base font-black text-emerald-600 font-mono">75% Complete</div>
            </div>
          </div>

          {/* Members List */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
            <h3 className="text-base font-extrabold text-slate-900">Team Roster</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {[
                { name: 'Roohi (You)', role: 'Team Leader & DB Architect', isLeader: true, isUser: true },
                { name: 'Ansar', role: 'AI & ML Engineer' },
                { name: 'Bhavya', role: 'Frontend & UI Specialist' },
                { name: 'Rohan', role: 'QA & Integration' }
              ].map((mem, idx) => (
                <div key={idx} className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-xl bg-indigo-100 text-indigo-700 font-extrabold flex items-center justify-center text-xs">
                      {mem.name.charAt(0)}
                    </div>
                    <div>
                      <h4 className="text-xs font-extrabold text-slate-900 flex items-center gap-1">
                        {mem.name} {mem.isLeader && <Crown className="w-3 h-3 text-amber-500" />}
                      </h4>
                      <span className="text-[10px] font-bold text-slate-500">{mem.role}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TEAM CHAT TAB */}
      {activeTab === 'chat' && (
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden flex flex-col h-[520px]">
          <div className="p-4 border-b border-slate-100 bg-slate-50 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <MessageSquare className="w-4 h-4 text-indigo-600" />
              <span className="text-xs font-extrabold text-slate-900">Alpha Coders Live Chat</span>
            </div>
            <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-100">
              5 Online
            </span>
          </div>

          <div className="flex-1 p-4 overflow-y-auto space-y-3">
            {messages.map((m) => (
              <div key={m.id} className="p-3 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-extrabold text-slate-900 flex items-center gap-1">
                    {m.sender} {m.isLeader && <Crown className="w-3 h-3 text-amber-500" />}
                  </span>
                  <span className="text-[10px] font-medium text-slate-400 font-mono">{m.time}</span>
                </div>
                {m.text.startsWith('```') ? (
                  <pre className="p-2.5 rounded-xl bg-slate-900 text-slate-100 font-mono text-[11px] overflow-x-auto">
                    {m.text.replace(/```[a-z]*/g, '')}
                  </pre>
                ) : (
                  <p className="text-xs text-slate-700 font-medium leading-relaxed">{m.text}</p>
                )}
              </div>
            ))}
          </div>

          <form onSubmit={handleSendMessage} className="p-3 border-t border-slate-200 bg-slate-50 flex items-center gap-2">
            <input
              type="text"
              placeholder="Type a message or code snippet..."
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              className="flex-1 px-4 py-2.5 text-xs rounded-xl bg-white border border-slate-200 text-slate-900 font-medium focus:border-indigo-500 outline-none"
            />
            <button
              type="submit"
              className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold transition-all flex items-center gap-1.5"
            >
              <Send className="w-3.5 h-3.5" /> Send
            </button>
          </form>
        </div>
      )}

      {/* KANBAN TASK BOARD TAB */}
      {activeTab === 'kanban' && (
        <div className="space-y-6">
          <form onSubmit={handleAddTask} className="flex gap-2 bg-white p-3 rounded-2xl border border-slate-200 shadow-2xs">
            <input
              type="text"
              placeholder="Add new task..."
              value={newTaskTitle}
              onChange={(e) => setNewTaskTitle(e.target.value)}
              className="flex-1 px-3 py-2 text-xs rounded-xl bg-slate-50 border border-slate-200 text-slate-900 outline-none"
            />
            <button type="submit" className="px-4 py-2 rounded-xl bg-indigo-600 text-white text-xs font-bold flex items-center gap-1">
              <Plus className="w-3.5 h-3.5" /> Add Task
            </button>
          </form>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {(['To Do', 'In Progress', 'Completed'] as const).map((colStatus) => (
              <div key={colStatus} className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm space-y-4">
                <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                  <h3 className="text-xs font-black uppercase tracking-wider text-slate-900">{colStatus}</h3>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-700">
                    {tasks.filter(t => t.status === colStatus).length}
                  </span>
                </div>

                <div className="space-y-3">
                  {tasks.filter(t => t.status === colStatus).map((task) => (
                    <div key={task.id} className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2">
                      <span className="px-2 py-0.5 rounded text-[9px] font-extrabold uppercase bg-indigo-50 text-indigo-600 border border-indigo-100">
                        {task.category}
                      </span>
                      <h4 className="text-xs font-extrabold text-slate-900">{task.title}</h4>
                      <div className="flex items-center justify-between text-[10px] font-bold text-slate-500 pt-1">
                        <span>Assignee: {task.assignee}</span>
                        {colStatus !== 'Completed' && (
                          <button
                            onClick={() => moveTaskStatus(task.id, colStatus === 'To Do' ? 'In Progress' : 'Completed')}
                            className="text-indigo-600 hover:underline"
                          >
                            Move →
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
};
