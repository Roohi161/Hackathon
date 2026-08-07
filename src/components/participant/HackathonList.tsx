import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Search, Filter, MapPin, Trophy, ShieldCheck, ArrowRight, Clock, Sparkles } from 'lucide-react';
import type { Hackathon, HackathonStatus } from '../../types';
import { useHackathonStore } from '../../stores/hackathonStore';

import { RegistrationModal } from './RegistrationModal';

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
  const fetchHackathons = useHackathonStore((s) => s.fetchHackathons);

  React.useEffect(() => {
    fetchHackathons();
  }, [fetchHackathons]);

  const getCombinedHackathons = () => {
    const map = new Map<string, Hackathon>();
    if (storeHackathons && storeHackathons.length > 0) {
      storeHackathons.forEach(h => map.set(h.id, h));
    }
    if (propsHackathons && propsHackathons.length > 0) {
      propsHackathons.forEach(h => map.set(h.id, h));
    }
    return Array.from(map.values());
  };

  const hackathons = getCombinedHackathons();

  const [registerModalHackathon, setRegisterModalHackathon] = useState<Hackathon | null>(null);

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

  // Global registration status lookup from localStorage
  const getRegistrationRecord = (hackathonId: string) => {
    try {
      const saved = localStorage.getItem('hc_global_registrations');
      if (saved) {
        const list = JSON.parse(saved);
        return list.find((item: any) => item.hackathonId === hackathonId);
      }
    } catch {
      // ignore
    }
    return null;
  };

  // Filter logic
  const registeredHackathonsList = hackathons.filter((h: Hackathon) => {
    const reg = getRegistrationRecord(h.id);
    return reg || h.id === 'h-1' || h.id === 'h-2'; // Default sample registrations
  });

  const sourceHackathons = isMyHackathons ? registeredHackathonsList : hackathons;

  const filteredHackathons = sourceHackathons.filter((item: Hackathon) => {
    const matchesSearch =
      item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (item.tagline || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (item.organizerName || '').toLowerCase().includes(searchTerm.toLowerCase());

    const itemStatusLower = (item.status || '').toLowerCase();
    const itemModeLower = (item.mode || '').toLowerCase();

    const matchesStatus =
      selectedStatus === 'all' ||
      itemStatusLower === selectedStatus.toLowerCase() ||
      selectedStatus === 'live' ||
      itemStatusLower.includes('live') ||
      itemStatusLower.includes('progress') ||
      itemStatusLower.includes('open') ||
      itemStatusLower.includes('publish') ||
      itemStatusLower.includes('active') ||
      itemStatusLower.includes('draft');

    const matchesMode =
      selectedMode === 'all' ||
      itemModeLower === selectedMode.toLowerCase() ||
      itemModeLower === selectedMode.replace('-', '_').toLowerCase();

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
      
      {/* Header - Light Futuristic Tech Layout */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-white via-indigo-50/70 to-purple-50/50 p-5 sm:p-6 border border-indigo-200/80 shadow-sm backdrop-blur-xl text-center">
        <div className="absolute top-0 right-0 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 space-y-2 max-w-xl mx-auto flex flex-col items-center">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-gradient-to-r from-indigo-500/10 to-violet-500/10 text-indigo-700 text-xs font-bold border border-indigo-200/80 backdrop-blur-md shadow-2xs">
            <Sparkles className="w-3.5 h-3.5 text-indigo-600 animate-pulse" />
            {isMyHackathons ? 'Participant Workspace' : 'Global Discovery Portal'}
          </div>

          <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight text-slate-900 font-heading">
            {isMyHackathons ? (
              <>My Enrolled <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-violet-600 to-cyan-600">Hackathons</span></>
            ) : (
              <>Explore <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-violet-600 to-cyan-600">Hackathons</span></>
            )}
          </h1>

          <p className="text-xs text-slate-600 max-w-md font-medium leading-relaxed">
            {isMyHackathons
              ? 'Track your registered challenges, submission milestones, and live standings.'
              : 'Compete in top global AI, Web3, and Agentic Coding hackathons.'}
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
            {(allTracks as any[]).map((track: any) => {
              const trackName = typeof track === 'string' ? track : (track?.name || 'Track');
              const keyVal = typeof track === 'string' ? track : (track?.id || track?.name || Math.random());
              return (
                <button
                  key={keyVal}
                  onClick={() => setSelectedTrack(trackName)}
                  className={`px-3 py-1 rounded-full text-xs font-bold transition-all cursor-pointer ${
                    selectedTrack === trackName
                      ? 'bg-indigo-600 text-white shadow-sm'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {trackName}
                </button>
              );
            })}
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
                  {isMyHackathons ? (() => {
                    const reg = getRegistrationRecord(hackathon.id);
                    const status = reg?.status || 'APPROVED';
                    if (status === 'APPROVED') {
                      return (
                        <span className="px-3 py-1 rounded-full text-xs font-black bg-emerald-600 text-white shadow-sm border border-emerald-400">
                          ✓ APPROVED
                        </span>
                      );
                    }
                    if (status === 'REJECTED') {
                      return (
                        <span className="px-3 py-1 rounded-full text-xs font-black bg-rose-600 text-white shadow-sm border border-rose-400">
                          ✕ REJECTED
                        </span>
                      );
                    }
                    return (
                      <span className="px-3 py-1 rounded-full text-xs font-black bg-amber-500 text-white shadow-sm border border-amber-300 animate-pulse">
                        ⏳ UNDER REVIEW
                      </span>
                    );
                  })() : (
                    <span className="px-3 py-1 rounded-full text-xs font-bold bg-slate-900/80 text-white backdrop-blur-md border border-slate-700/80 capitalize">
                      {hackathon.mode}
                    </span>
                  )}
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
                <div className="pt-3.5 border-t border-slate-100 flex items-center justify-between gap-2 text-xs font-medium text-slate-500">
                  <div className="flex items-center gap-1 text-slate-500 font-medium">
                    <MapPin className="w-3.5 h-3.5 text-slate-400" />
                    <span className="truncate max-w-[100px]">{hackathon.location}</span>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    {!isMyHackathons && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setRegisterModalHackathon(hackathon);
                        }}
                        className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 text-white font-bold text-[11px] shadow-2xs transition-all cursor-pointer"
                      >
                        Register
                      </button>
                    )}
                    <div className="flex items-center gap-1 text-indigo-600 font-bold group-hover:translate-x-0.5 transition-transform">
                      <span>View</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </div>
                  </div>
                </div>

              </div>
            </div>
          ))
        )}
      </div>

      {/* Registration Modal Step-by-Step Flow */}
      <RegistrationModal
        isOpen={!!registerModalHackathon}
        onClose={() => setRegisterModalHackathon(null)}
        hackathon={registerModalHackathon}
      />
    </div>
  );
};
