import React, { useState } from 'react';
import { Search, Filter, MapPin, Trophy, ShieldCheck, ArrowRight, Clock, Sparkles } from 'lucide-react';
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

  // Extract all tracks
  const allTracks = Array.from(new Set(hackathons.flatMap((h) => h.tracks)));

  // Filter logic
  const filteredHackathons = hackathons.filter((item) => {
    const matchesSearch =
      item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.tagline.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.organizerName.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = selectedStatus === 'all' || item.status === selectedStatus;
    const matchesMode = selectedMode === 'all' || item.mode === selectedMode;
    const matchesTrack = selectedTrack === 'all' || item.tracks.includes(selectedTrack);

    return matchesSearch && matchesStatus && matchesMode && matchesTrack;
  });

  const getStatusBadge = (status: HackathonStatus) => {
    switch (status) {
      case 'live':
        return (
          <span className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            LIVE NOW
          </span>
        );
      case 'upcoming':
        return (
          <span className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-indigo-500/10 text-indigo-400 border border-indigo-500/30">
            <Clock className="w-3.5 h-3.5" /> UPCOMING
          </span>
        );
      case 'ended':
        return (
          <span className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-gray-500/10 text-gray-400 border border-gray-500/30">
            ENDED
          </span>
        );
    }
  };

  return (
    <div className="space-y-8">
      {/* Hero Banner Header */}
      <div className="relative overflow-hidden rounded-3xl p-8 sm:p-12 glass-panel border border-indigo-500/20">
        <div className="absolute top-0 right-0 -mt-12 -mr-12 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 -mb-12 -ml-12 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-xs font-medium">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>Discover & Compete in Global Hackathons</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white leading-tight">
            Build Projects. Win Prizes. <br />
            <span className="gradient-text">Shape the Future.</span>
          </h1>
          <p className="text-gray-300 text-sm sm:text-base leading-relaxed">
            Hackathon Central connects developers, designers, and innovators with high-impact competitions, live rubric judging, and real-time leaderboards.
          </p>
        </div>
      </div>

      {/* Search & Filter Toolbar */}
      <div className="p-4 rounded-2xl glass-panel border border-white/10 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
          
          {/* Search Box */}
          <div className="md:col-span-1 relative">
            <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-3" />
            <input
              type="text"
              placeholder="Search hackathons or tags..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 text-xs rounded-xl bg-gray-900/80 border border-gray-700/60 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          {/* Status Filter */}
          <div className="relative">
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="w-full px-3 py-2 text-xs rounded-xl bg-gray-900/80 border border-gray-700/60 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="all">All Statuses (Live, Upcoming, Ended)</option>
              <option value="live">🟢 Live Now</option>
              <option value="upcoming">🔵 Upcoming</option>
              <option value="ended">⚪ Ended</option>
            </select>
          </div>

          {/* Mode Filter */}
          <div className="relative">
            <select
              value={selectedMode}
              onChange={(e) => setSelectedMode(e.target.value)}
              className="w-full px-3 py-2 text-xs rounded-xl bg-gray-900/80 border border-gray-700/60 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="all">All Modes (Online, Hybrid, In-Person)</option>
              <option value="online">Online / Virtual</option>
              <option value="hybrid">Hybrid Event</option>
              <option value="in-person">In-Person</option>
            </select>
          </div>

          {/* Track Filter */}
          <div className="relative">
            <select
              value={selectedTrack}
              onChange={(e) => setSelectedTrack(e.target.value)}
              className="w-full px-3 py-2 text-xs rounded-xl bg-gray-900/80 border border-gray-700/60 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="all">All Tech Tracks</option>
              {allTracks.map((track) => (
                <option key={track} value={track}>
                  {track}
                </option>
              ))}
            </select>
          </div>

        </div>
      </div>

      {/* Hackathons Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredHackathons.length === 0 ? (
          <div className="col-span-full text-center py-16 glass-panel rounded-2xl">
            <Filter className="w-10 h-10 text-gray-500 mx-auto mb-3" />
            <h3 className="text-lg font-semibold text-white">No Hackathons Match Filters</h3>
            <p className="text-xs text-gray-400 mt-1">Try resetting your search term or filter dropdowns.</p>
          </div>
        ) : (
          filteredHackathons.map((hackathon) => (
            <div
              key={hackathon.id}
              onClick={() => onSelectHackathon(hackathon)}
              className="group relative flex flex-col overflow-hidden rounded-2xl glass-panel glass-panel-hover border border-white/10 cursor-pointer"
            >
              {/* Banner Image */}
              <div className="relative h-44 w-full overflow-hidden bg-gray-900">
                <img
                  src={hackathon.banner}
                  alt={hackathon.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-gray-950 via-gray-950/40 to-transparent" />
                
                <div className="absolute top-3 left-3">
                  {getStatusBadge(hackathon.status)}
                </div>

                <div className="absolute top-3 right-3 px-2.5 py-1 rounded-full bg-gray-900/80 backdrop-blur-md text-amber-400 text-xs font-bold border border-amber-500/30 flex items-center gap-1">
                  <Trophy className="w-3.5 h-3.5" />
                  {hackathon.prizePool}
                </div>
              </div>

              {/* Body Content */}
              <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                <div>
                  <div className="flex items-center gap-1.5 text-xs text-indigo-400 mb-1">
                    <span>{hackathon.organizerName}</span>
                    {hackathon.organizerVerified && (
                      <span title="Verified Organizer">
                        <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                      </span>
                    )}
                  </div>
                  <h3 className="text-lg font-bold text-white group-hover:text-indigo-300 transition-colors line-clamp-1">
                    {hackathon.title}
                  </h3>
                  <p className="text-xs text-gray-300 mt-1 line-clamp-2 leading-relaxed">
                    {hackathon.tagline}
                  </p>
                </div>

                {/* Tracks Badges */}
                <div className="flex flex-wrap gap-1.5">
                  {hackathon.tracks.slice(0, 3).map((track, i) => (
                    <span
                      key={i}
                      className="px-2 py-0.5 rounded-md bg-gray-800/80 text-[11px] font-medium text-gray-300 border border-white/5"
                    >
                      {track}
                    </span>
                  ))}
                  {hackathon.tracks.length > 3 && (
                    <span className="px-2 py-0.5 rounded-md bg-gray-800/80 text-[11px] text-gray-400">
                      +{hackathon.tracks.length - 3} more
                    </span>
                  )}
                </div>

                {/* Footer Info */}
                <div className="pt-3 border-t border-gray-800/80 flex items-center justify-between text-xs text-gray-400">
                  <div className="flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-gray-500" />
                    <span className="truncate max-w-[120px]">{hackathon.location}</span>
                  </div>
                  <div className="flex items-center gap-1 text-indigo-400 font-semibold group-hover:translate-x-1 transition-transform">
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
