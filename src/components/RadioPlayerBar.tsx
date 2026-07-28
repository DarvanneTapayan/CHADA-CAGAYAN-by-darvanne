import React, { useState } from 'react';
import { Play, Pause, Radio, Volume2, VolumeX, X, Disc } from 'lucide-react';

interface RadioStation {
  id: string;
  name: string;
  frequency: string;
  tagline: string;
  badgeColor: string;
  audioUrl?: string;
}

const STATIONS: RadioStation[] = [
  {
    id: 'bombo',
    name: 'Bombo Radyo CDO',
    frequency: 'DXIF 1188 kHz AM',
    tagline: 'Basta Radyo... Bombo!',
    badgeColor: 'bg-rose-600 text-white',
  },
  {
    id: 'ifm',
    name: 'iFM 99.1 CDO',
    frequency: 'DXRK 99.1 MHz FM',
    tagline: 'Bestfriend Mo!',
    badgeColor: 'bg-yellow-500 text-slate-950 font-black',
  },
  {
    id: 'magnum',
    name: 'Magnum Radio 99.9',
    frequency: 'DXMR 99.9 MHz FM',
    tagline: 'Ang Radyo sa Kagay-anon',
    badgeColor: 'bg-emerald-600 text-white',
  },
  {
    id: 'brigada',
    name: 'Brigada News FM CDO',
    frequency: '102.5 MHz FM',
    tagline: 'Informing and Serving Mindanao',
    badgeColor: 'bg-purple-600 text-white',
  },
  {
    id: 'rmn',
    name: 'RMN DXCC 828 CDO',
    frequency: 'DXCC 828 kHz AM',
    tagline: 'Nag-unang Radyo sa Rehiyon 10',
    badgeColor: 'bg-blue-600 text-white',
  },
];

interface RadioPlayerBarProps {
  isPlaying: boolean;
  onTogglePlay: () => void;
  onClose: () => void;
}

export const RadioPlayerBar: React.FC<RadioPlayerBarProps> = ({
  isPlaying,
  onTogglePlay,
  onClose,
}) => {
  const [activeStation, setActiveStation] = useState<RadioStation>(STATIONS[0]);
  const [isMuted, setIsMuted] = useState<boolean>(false);

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 bg-slate-950/95 border-t border-amber-500/40 text-slate-100 p-3 shadow-2xl backdrop-blur-lg">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
        {/* Station Info */}
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <div className="relative">
            <div className={`w-10 h-10 rounded-full bg-slate-800 border-2 border-amber-400 flex items-center justify-center ${isPlaying ? 'animate-spin' : ''}`}>
              <Disc className="w-5 h-5 text-amber-400" />
            </div>
            {isPlaying && (
              <span className="absolute -top-1 -right-1 w-3 h-3 bg-emerald-500 rounded-full animate-ping"></span>
            )}
          </div>

          <div>
            <div className="flex items-center gap-2">
              <span className={`px-1.5 py-0.5 rounded text-[10px] font-extrabold uppercase ${activeStation.badgeColor}`}>
                {activeStation.frequency}
              </span>
              <h4 className="font-extrabold text-sm text-slate-100">{activeStation.name}</h4>
            </div>
            <p className="text-[11px] text-slate-400">{activeStation.tagline}</p>
          </div>
        </div>

        {/* Station Selector Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-1">
          {STATIONS.map((st) => (
            <button
              key={st.id}
              onClick={() => setActiveStation(st)}
              className={`px-2.5 py-1 rounded-lg text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                activeStation.id === st.id
                  ? 'bg-amber-500 text-slate-950 shadow'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              {st.name.split(' ')[0]}
            </button>
          ))}
        </div>

        {/* Playback Controls */}
        <div className="flex items-center gap-3">
          {/* Animated Frequency Equalizer */}
          {isPlaying && (
            <div className="hidden md:flex items-center gap-0.5 h-4">
              <span className="w-1 bg-amber-400 animate-[bounce_0.8s_infinite] h-3"></span>
              <span className="w-1 bg-amber-400 animate-[bounce_0.5s_infinite] h-4"></span>
              <span className="w-1 bg-amber-400 animate-[bounce_0.9s_infinite] h-2"></span>
              <span className="w-1 bg-amber-400 animate-[bounce_0.6s_infinite] h-4"></span>
            </div>
          )}

          <button
            onClick={onTogglePlay}
            id="radio-play-btn"
            className="flex items-center gap-1.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black px-4 py-1.5 rounded-xl text-xs transition-all cursor-pointer shadow-md"
          >
            {isPlaying ? (
              <>
                <Pause className="w-4 h-4 fill-slate-950" />
                <span>Pause Live Stream</span>
              </>
            ) : (
              <>
                <Play className="w-4 h-4 fill-slate-950" />
                <span>Listen Live</span>
              </>
            )}
          </button>

          <button
            onClick={() => setIsMuted(!isMuted)}
            className="p-1.5 rounded-lg bg-slate-800 text-slate-300 hover:text-white"
            title={isMuted ? 'Unmute' : 'Mute'}
          >
            {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
          </button>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
            title="Close player"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
