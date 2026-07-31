import React, { useState } from 'react';
import { Search, Filter, ChevronDown, MapPin, Trophy, ShieldCheck, ArrowRight, Clock, Sparkles } from 'lucide-react';
import type { Hackathon, HackathonStatus } from '../../types';

interface HackathonListProps {
  hackathons: Hackathon[];
  onSelectHackathon: (hackathon: Hackathon) => void;
}

export const HackathonList: React.FC<HackathonListProps> = ({ hackathons, onSelectHackathon }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [selectedMode, setSelectedMode] = useState<string>('all');
  const [selectedTrack, setSelectedTrack] = useState<string>('all');

  // Extract all tracks safely
  const allTracks = Array.from(new Set(hackathons.flatMap((h) => h.tracks || [])));

  // Filter logic safely
  const filteredHackathons = hackathons.filter((item) => {
    const titleStr = item.title || '';
    const taglineStr = item.tagline || '';
    const orgStr = item.organizerName || '';
    const tracksArr = item.tracks || [];

    const matchesSearch =
      titleStr.toLowerCase().includes(searchTerm.toLowerCase()) ||
      taglineStr.toLowerCase().includes(searchTerm.toLowerCase()) ||
      orgStr.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = selectedStatus === 'all' || item.status === selectedStatus;
    const matchesMode = selectedMode === 'all' || item.mode === selectedMode;
    const matchesTrack = selectedTrack === 'all' || tracksArr.includes(selectedTrack);

    return matchesSearch && matchesStatus && matchesMode && matchesTrack;
  });

  const getStatusBadge = (status: HackathonStatus) => {
    switch (status) {
      case 'live':
        return (
          <span className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-extrabold bg-emerald-500 text-white shadow-sm border border-emerald-400">
            <span className="w-2 h-2 rounded-full bg-white animate-ping" />
            LIVE NOW
          </span>
        );
      case 'upcoming':
        return (
          <span className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-indigo-600 text-white shadow-sm border border-indigo-500">
            <Clock className="w-3.5 h-3.5" /> UPCOMING
          </span>
        );
      case 'ended':
        return (
          <span className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-slate-900/80 text-slate-200 backdrop-blur-md border border-slate-700">
            ENDED
          </span>
        );
    }
  };

  return (
    <div className="space-y-8">
      {/* Hero Banner Header */}
      <div className="relative overflow-hidden rounded-3xl p-8 sm:p-12 shadow-xl shadow-slate-200/50 border border-slate-200 bg-white mb-8">
        <div className="absolute top-0 right-0 -mt-12 -mr-12 w-96 h-96 bg-indigo-100/40 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 -mb-12 -ml-12 w-96 h-96 bg-purple-100/40 rounded-full blur-3xl pointer-events-none" />
        
        {/* Decorative Grid */}
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.03] mix-blend-overlay pointer-events-none" />

        <div className="relative z-10 max-w-3xl space-y-5">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-700 text-xs font-semibold backdrop-blur-sm shadow-sm">
            <Sparkles className="w-3.5 h-3.5 text-indigo-500" />
            <span>Discover & Compete in Global Hackathons</span>
          </div>
          <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-slate-900 leading-[1.15]">
            Build Projects. Win Prizes. <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-violet-600">
              Shape the Future.
            </span>
          </h1>
          <p className="text-slate-500 text-sm sm:text-lg leading-relaxed max-w-2xl font-medium">
            Hackathon Central connects developers, designers, and innovators with high-impact competitions, live rubric judging, and real-time leaderboards.
          </p>
        </div>
      </div>

      {/* Search & Filter Toolbar */}
      <div className="p-3 sm:p-4 rounded-2xl bg-white/70 backdrop-blur-xl shadow-lg shadow-indigo-100/50 border border-white/60 space-y-4 mb-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
          
          {/* Search Box */}
          <div className="md:col-span-1 relative">
            <Search className="w-4 h-4 text-indigo-400 absolute left-3.5 top-3.5" />
            <input
              type="text"
              placeholder="Search hackathons or tags..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 text-sm font-medium rounded-xl bg-white border border-slate-200/80 text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 shadow-sm transition-all hover:border-indigo-300"
            />
          </div>

          {/* Status Filter */}
          <div className="relative">
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="w-full px-4 pr-10 py-2.5 text-sm font-medium rounded-xl bg-white border border-slate-200/80 text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 appearance-none cursor-pointer shadow-sm hover:border-indigo-300 transition-colors"
            >
              <option value="all">All Statuses</option>
              <option value="live">🟢 Live Now</option>
              <option value="upcoming">🔵 Upcoming</option>
              <option value="ended">⚪ Ended</option>
            </select>
            <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3.5 top-3.5 pointer-events-none" />
          </div>

          {/* Mode Filter */}
          <div className="relative">
            <select
              value={selectedMode}
              onChange={(e) => setSelectedMode(e.target.value)}
              className="w-full px-4 pr-10 py-2.5 text-sm font-medium rounded-xl bg-white border border-slate-200/80 text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 appearance-none cursor-pointer shadow-sm hover:border-indigo-300 transition-colors"
            >
              <option value="all">All Modes</option>
              <option value="online">🌐 Online / Virtual</option>
              <option value="hybrid">🎪 Hybrid Event</option>
              <option value="in-person">🏢 In-Person</option>
            </select>
            <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3.5 top-3.5 pointer-events-none" />
          </div>

          {/* Track Filter */}
          <div className="relative">
            <select
              value={selectedTrack}
              onChange={(e) => setSelectedTrack(e.target.value)}
              className="w-full px-4 pr-10 py-2.5 text-sm font-medium rounded-xl bg-white border border-slate-200/80 text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 appearance-none cursor-pointer shadow-sm hover:border-indigo-300 transition-colors"
            >
              <option value="all">All Tech Tracks</option>
              {allTracks.map((track) => (
                <option key={track} value={track}>
                  {track}
                </option>
              ))}
            </select>
            <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3.5 top-3.5 pointer-events-none" />
          </div>

        </div>
      </div>

      {/* Hackathons Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredHackathons.length === 0 ? (
          <div className="col-span-full text-center py-16 bg-white rounded-2xl border border-slate-200 shadow-sm">
            <Filter className="w-10 h-10 text-slate-400 mx-auto mb-3" />
            <h3 className="text-lg font-bold text-slate-900">No Hackathons Match Filters</h3>
            <p className="text-xs text-slate-500 mt-1 font-medium">Try resetting your search term or filter dropdowns.</p>
          </div>
        ) : (
          filteredHackathons.map((hackathon) => (
            <div
              key={hackathon.id}
              onClick={() => onSelectHackathon(hackathon)}
              className="group relative flex flex-col overflow-hidden rounded-2xl bg-white border border-slate-200/90 shadow-sm hover:shadow-xl hover:shadow-indigo-100/60 hover:border-indigo-300 transition-all duration-300 hover:-translate-y-1 cursor-pointer"
            >
              {/* Banner Image */}
              <div className="relative h-44 w-full overflow-hidden bg-slate-900">
                <img
                  src={hackathon.banner}
                  alt={hackathon.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent" />
                
                <div className="absolute top-3 left-3">
                  {getStatusBadge(hackathon.status)}
                </div>

                <div className="absolute top-3 right-3 px-3 py-1 rounded-full bg-slate-950/80 backdrop-blur-md text-amber-400 text-xs font-black border border-amber-500/40 shadow-sm flex items-center gap-1">
                  <Trophy className="w-3.5 h-3.5" />
                  {hackathon.prizePool}
                </div>
              </div>

              {/* Body Content */}
              <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                <div>
                  <div className="flex items-center gap-1.5 text-xs font-bold text-indigo-600 mb-1">
                    <span>{hackathon.organizerName}</span>
                    {hackathon.organizerVerified && (
                      <span title="Verified Organizer">
                        <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                      </span>
                    )}
                  </div>
                  <h3 className="text-lg font-extrabold text-slate-900 group-hover:text-indigo-600 transition-colors line-clamp-1">
                    {hackathon.title}
                  </h3>
                  <p className="text-xs text-slate-500 mt-1 line-clamp-2 leading-relaxed font-medium">
                    {hackathon.tagline}
                  </p>
                </div>

                {/* Tracks Badges */}
                <div className="flex flex-wrap gap-1.5">
                  {(hackathon.tracks || []).slice(0, 3).map((track, i) => (
                    <span
                      key={i}
                      className="px-2.5 py-1 rounded-lg bg-slate-100 text-[11px] font-bold text-slate-600 border border-slate-200/80"
                    >
                      {track}
                    </span>
                  ))}
                  {(hackathon.tracks || []).length > 3 && (
                    <span className="px-2.5 py-1 rounded-lg bg-slate-100 text-[11px] font-bold text-slate-400">
                      +{(hackathon.tracks || []).length - 3} more
                    </span>
                  )}
                </div>

                {/* Footer Info */}
                <div className="pt-3.5 border-t border-slate-100 flex items-center justify-between text-xs font-medium text-slate-500">
                  <div className="flex items-center gap-1 text-slate-500 font-medium">
                    <MapPin className="w-3.5 h-3.5 text-slate-400" />
                    <span className="truncate max-w-[120px]">{hackathon.location}</span>
                  </div>
                  <div className="flex items-center gap-1 text-indigo-600 font-bold group-hover:translate-x-1 transition-transform">
                    <span>View Event</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </div>
                </div>

              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
