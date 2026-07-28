import React, { useEffect, useState } from 'react';
import {
  Bell,
  Bookmark,
  Bot,
  MapPin,
  PhoneCall,
  Radio,
  RefreshCw,
  Search,
  Sparkles,
} from 'lucide-react';

interface HeaderProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  onOpenNotifications: () => void;
  onOpenSaved: () => void;
  onOpenAI: () => void;
  onOpenEmergency: () => void;
  onToggleRadio: () => void;
  onFetchLiveUpdates: () => void;
  savedCount: number;
  unreadNotificationCount: number;
  isRadioPlaying: boolean;
  isFetchingLive: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  searchQuery,
  setSearchQuery,
  onOpenNotifications,
  onOpenSaved,
  onOpenAI,
  onOpenEmergency,
  onToggleRadio,
  onFetchLiveUpdates,
  savedCount,
  unreadNotificationCount,
  isRadioPlaying,
  isFetchingLive,
}) => {
  const [timeString, setTimeString] = useState<string>('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTimeString(
        now.toLocaleTimeString('en-US', {
          timeZone: 'Asia/Manila',
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
          hour12: true,
        }) + ' PST (PHT)'
      );
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <header className="sticky top-0 z-30 bg-[#0a0c10]/95 backdrop-blur-md text-slate-100 border-b border-white/10 shadow-2xl">
      {/* Top Banner: Location & Time */}
      <div className="bg-[#050608] px-4 py-1.5 text-xs text-slate-300 font-medium flex flex-wrap items-center justify-between gap-2 border-b border-white/5">
        <div className="flex items-center gap-2 font-mono text-[11px]">
          <span className="flex h-2 w-2 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-500 shadow-[0_0_8px_cyan]"></span>
          </span>
          <MapPin className="w-3.5 h-3.5 text-cyan-400" />
          <span className="text-white font-bold">CDO CITY PULSE</span>
          <span className="hidden sm:inline text-slate-500">// MINDANAO, PHILIPPINES (8.4875° N, 124.6497° E)</span>
        </div>
        <div className="flex items-center gap-3">
          <span className="font-mono bg-cyan-500/10 px-2.5 py-0.5 rounded border border-cyan-500/30 text-cyan-400 text-[11px]">
            {timeString || '14:28:42 PST'}
          </span>
          <button
            onClick={onOpenEmergency}
            id="emergency-btn-header"
            className="flex items-center gap-1 bg-rose-600/90 hover:bg-rose-600 text-white px-2.5 py-0.5 rounded text-[11px] font-bold shadow-lg shadow-rose-950/50 transition-all duration-150 cursor-pointer border border-rose-500/40"
          >
            <PhoneCall className="w-3 h-3" />
            <span>Emergency 911</span>
          </button>
        </div>
      </div>

      {/* Main Navbar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Brand & Logo */}
        <div className="flex items-center justify-between w-full md:w-auto">
          <div className="flex items-center gap-3">
            <div className="relative group cursor-pointer">
              <div className="w-11 h-11 rounded-xl bg-cyan-500/20 border border-cyan-500/50 flex items-center justify-center shadow-[0_0_15px_rgba(6,182,212,0.15)] group-hover:border-cyan-400 group-hover:shadow-[0_0_20px_rgba(6,182,212,0.3)] transition-all">
                <span className="font-black text-cyan-400 text-xl tracking-tighter">CDO</span>
              </div>
              <span className="absolute -bottom-1 -right-1 w-3.5 h-3.5 bg-cyan-400 rounded-full border-2 border-[#0a0c10] shadow-[0_0_6px_cyan]"></span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-black tracking-tight text-white flex items-center gap-2">
                  <span>CITY PULSE</span>
                  <span className="text-cyan-400 font-mono text-xs font-normal">DASHBOARD</span>
                </h1>
                <span className="bg-cyan-500/10 text-cyan-400 text-[10px] font-mono font-bold px-1.5 py-0.5 rounded border border-cyan-500/30">
                  LIVE STREAMING
                </span>
              </div>
              <p className="text-xs text-slate-400 font-mono hidden sm:block">
                Mayor • Radio • Traffic • Safety Watch • Local Events
              </p>
            </div>
          </div>

          {/* Mobile Actions */}
          <div className="flex items-center gap-2 md:hidden">
            <button
              onClick={onToggleRadio}
              id="radio-toggle-mobile"
              className={`p-2 rounded-lg text-xs font-semibold flex items-center gap-1 transition-colors border ${
                isRadioPlaying
                  ? 'bg-cyan-500 text-black border-cyan-400 font-bold'
                  : 'bg-white/5 border-white/10 text-slate-300 hover:bg-white/10'
              }`}
            >
              <Radio className="w-4 h-4" />
            </button>
            <button
              onClick={onOpenNotifications}
              id="notifications-toggle-mobile"
              className="p-2 rounded-lg bg-white/5 border border-white/10 text-slate-300 hover:bg-white/10 relative"
            >
              <Bell className="w-4 h-4" />
              {unreadNotificationCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-cyan-500 text-black text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                  {unreadNotificationCount}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Search Bar */}
        <div className="w-full md:max-w-md relative">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-cyan-400/70" />
          <input
            type="text"
            id="cdo-main-search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search CDO updates, Mayor, traffic, police, radio..."
            className="w-full bg-[#0d1117] text-slate-100 text-sm rounded-xl pl-10 pr-9 py-2 border border-white/10 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500/50 placeholder:text-slate-500 transition-all font-mono"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              id="clear-search-btn"
              className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-white"
            >
              ✕
            </button>
          )}
        </div>

        {/* Action Buttons (Desktop) */}
        <div className="hidden md:flex items-center gap-2">
          {/* Live Fetch Button */}
          <button
            onClick={onFetchLiveUpdates}
            disabled={isFetchingLive}
            id="fetch-live-btn"
            className="flex items-center gap-1.5 bg-cyan-500 hover:bg-cyan-400 disabled:opacity-50 text-slate-950 font-bold px-3 py-2 rounded-xl text-xs transition-all shadow-lg shadow-cyan-950/50 cursor-pointer border border-cyan-300"
            title="Fetch real-time grounded CDO news via Gemini"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isFetchingLive ? 'animate-spin' : ''}`} />
            <span>{isFetchingLive ? 'Updating...' : 'Live CDO Scan'}</span>
          </button>

          {/* Radio Station Button */}
          <button
            onClick={onToggleRadio}
            id="radio-toggle-desktop"
            className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
              isRadioPlaying
                ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/60 shadow-[0_0_10px_rgba(6,182,212,0.2)]'
                : 'bg-white/5 text-slate-200 border-white/10 hover:bg-white/10'
            }`}
          >
            <Radio className={`w-3.5 h-3.5 ${isRadioPlaying ? 'text-cyan-400 animate-pulse' : ''}`} />
            <span>{isRadioPlaying ? 'Radio ON' : 'CDO Radio'}</span>
          </button>

          {/* AI Search Assistant */}
          <button
            onClick={onOpenAI}
            id="ai-assistant-btn"
            className="flex items-center gap-1.5 bg-gradient-to-r from-cyan-600 via-teal-600 to-indigo-600 hover:from-cyan-500 hover:to-indigo-500 text-white px-3 py-2 rounded-xl text-xs font-semibold shadow-lg transition-all cursor-pointer border border-cyan-400/30"
          >
            <Sparkles className="w-3.5 h-3.5 text-cyan-200" />
            <span>Ask CDO AI</span>
          </button>

          {/* Bookmarks */}
          <button
            onClick={onOpenSaved}
            id="saved-articles-btn"
            className="flex items-center gap-1.5 bg-white/5 hover:bg-white/10 text-slate-200 px-3 py-2 rounded-xl text-xs font-semibold border border-white/10 relative transition-all cursor-pointer"
          >
            <Bookmark className="w-3.5 h-3.5 text-cyan-400" />
            <span>Saved</span>
            {savedCount > 0 && (
              <span className="bg-cyan-500 text-slate-950 text-[10px] font-extrabold px-1.5 py-0.2 rounded-full">
                {savedCount}
              </span>
            )}
          </button>

          {/* Notifications */}
          <button
            onClick={onOpenNotifications}
            id="notifications-btn-desktop"
            className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-200 border border-white/10 relative transition-all cursor-pointer"
            title="Push Notification Settings"
          >
            <Bell className="w-4 h-4 text-slate-300" />
            {unreadNotificationCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-rose-500 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center animate-bounce">
                {unreadNotificationCount}
              </span>
            )}
          </button>
        </div>
      </div>
    </header>
  );
};
