import React, { useState } from 'react';
import { MessageSquare, Send } from 'lucide-react';

export const MessagesView: React.FC = () => {
  const [activeChannel, setActiveChannel] = useState<'mentors' | 'organizers' | 'team'>('mentors');
  const [messageText, setMessageText] = useState('');
  const [messages, setMessages] = useState([
    { id: 1, sender: 'Dr. John Doe (Mentor)', text: 'Hey Roohi! I reviewed your vector indexing schema. Looks rock solid!', time: '11:20 AM' },
    { id: 2, sender: 'You', text: 'Thank you Dr. John! We are submitting the final demo video now.', time: '11:22 AM' }
  ]);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!messageText.trim()) return;
    setMessages([
      ...messages,
      {
        id: Date.now(),
        sender: 'You',
        text: messageText,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
    ]);
    setMessageText('');
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      <div className="flex items-center justify-between p-6 rounded-3xl bg-white border border-slate-200 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-2xl bg-indigo-50 text-indigo-600 border border-indigo-100 shadow-2xs">
            <MessageSquare className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-extrabold text-slate-900 tracking-tight">Direct Inbox & Messages</h2>
            <p className="text-xs font-semibold text-slate-500">Communicate with mentors, organizers, and team members</p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden flex flex-col h-[500px]">
        <div className="p-4 border-b border-slate-100 bg-slate-50 flex gap-2 flex-wrap">
          <button
            onClick={() => setActiveChannel('mentors')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-medium transition-all ${
              activeChannel === 'mentors' ? 'bg-indigo-600 text-white shadow-2xs' : 'bg-white text-slate-600 border border-slate-200'
            }`}
          >
            Mentors Channel
          </button>
          <button
            onClick={() => setActiveChannel('organizers')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-medium transition-all ${
              activeChannel === 'organizers' ? 'bg-indigo-600 text-white shadow-2xs' : 'bg-white text-slate-600 border border-slate-200'
            }`}
          >
            Organizers Channel
          </button>
          <button
            onClick={() => setActiveChannel('team')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-medium transition-all ${
              activeChannel === 'team' ? 'bg-indigo-600 text-white shadow-2xs' : 'bg-white text-slate-600 border border-slate-200'
            }`}
          >
            Private 1-on-1 DM 🔒
          </button>
        </div>

        <div className="flex-1 p-4 overflow-y-auto space-y-3">
          {messages.map((m) => (
            <div key={m.id} className="p-3.5 rounded-2xl bg-slate-50/80 border border-slate-200/80 space-y-1">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-slate-800">{m.sender}</span>
                <span className="text-[10px] font-normal text-slate-400 font-mono">{m.time}</span>
              </div>
              <p className="text-xs text-slate-600 font-normal leading-relaxed">{m.text}</p>
            </div>
          ))}
        </div>

        <form onSubmit={handleSend} className="p-3 border-t border-slate-200 bg-slate-50 flex items-center gap-2">
          <input
            type="text"
            placeholder="Type your message..."
            value={messageText}
            onChange={(e) => setMessageText(e.target.value)}
            className="flex-1 px-4 py-2.5 text-xs rounded-xl bg-white border border-slate-200 text-slate-900 font-medium outline-none focus:border-indigo-500"
          />
          <button type="submit" className="px-4 py-2.5 rounded-xl bg-indigo-600 text-white text-xs font-bold flex items-center gap-1">
            <Send className="w-3.5 h-3.5" /> Send
          </button>
        </form>
      </div>
    </div>
  );
};
