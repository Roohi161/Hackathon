import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Search, Filter, MapPin, Trophy, ShieldCheck, ArrowRight, Clock, Sparkles } from 'lucide-react';
import type { Hackathon, HackathonStatus } from '../../types';
import { INITIAL_HACKATHONS } from '../../data/mockData';
import { useHackathonStore } from '../../stores/hackathonStore';

interface HackathonListProps {
  hackathons?: Hackathon[];
  onSelectHackathon?: (hackathon: Hackathon) => void;
  onlyMyHackathons?: boolean;
}

export const HackathonList: React.FC<HackathonListProps> = ({ 
  hackathons: propsHackathons, 
  onSelectHackathon,
  onlyMyHackathons
}) => {
  const navigate = useNavigate();
  const location = useLocation();
  const isMyHackathons = onlyMyHackathons || location.pathname.includes('my-hackathons');

  const storeHackathons = useHackathonStore((s) => s.hackathons);
  const hackathons = (propsHackathons && propsHackathons.length > 0) ? propsHackathons : (storeHackathons.length > 0 ? storeHackathons : (INITIAL_HACKATHONS as any));

  const handleCardClick = (hackathon: Hackathon) => {
    if (onSelectHackathon) onSelectHackathon(hackathon);
    navigate(`/hackathons/${hackathon.id}`);
  };

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [selectedMode, setSelectedMode] = useState<string>('all');
  const [selectedTrack, setSelectedTrack] = useState<string>('all');

  // Extract all tracks
  const allTracks = Array.from(new Set(hackathons.flatMap((h: Hackathon) => h.tracks || [])));

  // Filter logic
  const filteredHackathons = hackathons.filter((item: Hackathon) => {
    const matchesSearch =
      item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (item.tagline || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (item.organizerName || '').toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = selectedStatus === 'all' || item.status === selectedStatus;
    const matchesMode = selectedMode === 'all' || item.mode === selectedMode;
    const matchesTrack = selectedTrack === 'all' || (item.tracks && item.tracks.includes(selectedTrack));

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
    <div className="space-y-8 animate-fadeIn">
      
      {/* Header Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-indigo-900 via-indigo-800 to-slate-900 text-white p-8 sm:p-10 border border-indigo-700/50 shadow-xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 w-64 h-64 bg-violet-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 space-y-4 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-500/20 text-indigo-200 text-xs font-extrabold border border-indigo-400/30">
            <Sparkles className="w-4 h-4 text-indigo-400" />
            {isMyHackathons ? 'Participant Workspace' : 'Global Discovery Portal'}
          </div>

          <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-white">
            {isMyHackathons ? (
              <>My Enrolled <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-cyan-300">Hackathons</span></>
            ) : (
              <>Explore <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-cyan-300">Hackathons</span></>
            )}
          </h1>

          <p className="text-slate-300 text-sm font-medium leading-relaxed">
            {isMyHackathons 
              ? 'View all hackathons you have joined, manage team submissions, track project deadlines, and view scores.'
              : 'Browse active competitions, filter by focus track, join high-performing teams, and win prize pools.'}
          </p>
        </div>
      </div>

      {/* Filter Controls Bar */}
      <div className="p-4 sm:p-5 rounded-2xl bg-white border border-slate-200/90 shadow-sm space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          
          {/* Search Bar */}
          <div className="md:col-span-2 relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
            <input
              type="text"
              placeholder="Search hackathons by title, tagline, or organizer..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 text-sm font-medium rounded-xl bg-slate-50 border border-slate-200/80 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 focus:bg-white transition-all"
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
              <option value="ended">⚫ Ended</option>
            </select>
          </div>

          {/* Mode Filter */}
          <div className="relative">
            <select
              value={selectedMode}
              onChange={(e) => setSelectedMode(e.target.value)}
              className="w-full px-4 pr-10 py-2.5 text-sm font-medium rounded-xl bg-white border border-slate-200/80 text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 appearance-none cursor-pointer shadow-sm hover:border-indigo-300 transition-colors"
            >
              <option value="all">All Modes</option>
              <option value="online">🌐 Online (Virtual)</option>
              <option value="hybrid">🔀 Hybrid</option>
              <option value="in-person">📍 In-Person</option>
            </select>
          </div>
        </div>

        {/* Tracks Filter */}
        {allTracks.length > 0 && (
          <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-100">
            <span className="text-xs font-bold text-slate-400 mr-2 flex items-center gap-1">
              <Filter className="w-3.5 h-3.5 text-slate-400" /> Tracks:
            </span>
            <button
              onClick={() => setSelectedTrack('all')}
              className={`px-3 py-1 rounded-full text-xs font-bold transition-all cursor-pointer ${
                selectedTrack === 'all'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              All Tracks
            </button>
            {(allTracks as any[]).map((track: any) => (
              <button
                key={track}
                onClick={() => setSelectedTrack(track)}
                className={`px-3 py-1 rounded-full text-xs font-bold transition-all cursor-pointer ${
                  selectedTrack === track
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {track}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Hackathons Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredHackathons.length === 0 ? (
          <div className="col-span-full text-center py-16 bg-white rounded-3xl border border-slate-200 shadow-xs space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center mx-auto">
              <Trophy className="w-6 h-6" />
            </div>
            <h3 className="font-extrabold text-slate-900 text-base">No Hackathons Match Criteria</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              Try adjusting your search terms or filter dropdowns to see active hackathons.
            </p>
          </div>
        ) : (
          filteredHackathons.map((hackathon: Hackathon) => (
            <div
              key={hackathon.id}
              onClick={() => handleCardClick(hackathon)}
              className="group relative flex flex-col rounded-3xl bg-white border border-slate-200/90 shadow-2xs hover:shadow-xl hover:-translate-y-1 transition-all duration-300 overflow-hidden cursor-pointer"
            >
              {/* Banner Image */}
              <div className="relative h-44 w-full overflow-hidden bg-slate-950">
                <img
                  src={hackathon.banner}
                  alt={hackathon.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-90"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />

                {/* Status & Mode Overlay */}
                <div className="absolute top-3 left-3 right-3 flex items-center justify-between z-10">
                  {getStatusBadge(hackathon.status)}
                  <span className="px-3 py-1 rounded-full text-xs font-bold bg-slate-900/80 text-white backdrop-blur-md border border-slate-700/80 capitalize">
                    {hackathon.mode}
                  </span>
                </div>

                {/* Prize Pool Overlay */}
                <div className="absolute bottom-3 left-3 flex items-center gap-1.5 px-3 py-1 rounded-xl bg-amber-400/90 text-slate-950 text-xs font-black backdrop-blur-md shadow-sm">
                  <Trophy className="w-3.5 h-3.5 text-slate-950" />
                  <span>{hackathon.prizePool} Prize Pool</span>
                </div>
              </div>

              {/* Card Content */}
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
                  {(hackathon.tracks || []).slice(0, 3).map((track: any, i: number) => {
                    const trackName = typeof track === 'string' ? track : track?.name || 'Track';
                    return (
                      <span
                        key={i}
                        className="px-2.5 py-1 rounded-lg bg-slate-100 text-[11px] font-bold text-slate-600 border border-slate-200/80"
                      >
                        {trackName}
                      </span>
                    );
                  })}
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
