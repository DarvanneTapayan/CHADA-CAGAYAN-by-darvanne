import React from 'react';
import { CloudRain, Droplets, Info, PhoneCall, ShieldCheck, Thermometer, Waves } from 'lucide-react';
import { WeatherData } from '../types';

interface WeatherEmergencyBarProps {
  weather: WeatherData;
  onOpenEmergencyModal: () => void;
}

export const WeatherEmergencyBar: React.FC<WeatherEmergencyBarProps> = ({
  weather,
  onOpenEmergencyModal,
}) => {
  return (
    <section className="bg-[#0a0c10] border-b border-white/10 text-slate-200 py-2.5 px-4 font-mono">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-3 text-xs">
        {/* Weather Info */}
        <div className="flex flex-wrap items-center gap-4 text-slate-300">
          <div className="flex items-center gap-1.5 font-bold text-white">
            <Thermometer className="w-4 h-4 text-cyan-400" />
            <span>CDO Weather: <strong className="text-cyan-400">{weather.tempCelsius}°C</strong></span>
          </div>
          <div className="flex items-center gap-1">
            <CloudRain className="w-3.5 h-3.5 text-cyan-400" />
            <span className="text-slate-300">{weather.condition}</span>
          </div>
          <div className="hidden sm:flex items-center gap-1 text-slate-400">
            <Droplets className="w-3.5 h-3.5 text-cyan-400/80" />
            <span>Humidity: {weather.humidityPercent}%</span>
          </div>
          <div className="flex items-center gap-1.5 bg-[#050608] px-2.5 py-0.5 rounded-md border border-cyan-500/30">
            <Waves className="w-3.5 h-3.5 text-emerald-400" />
            <span className="text-slate-400 text-[11px]">CDO RIVER:</span>
            <span className="font-extrabold text-emerald-400">{weather.cdoRiverStatus}</span>
          </div>
        </div>

        {/* Hotlines Banner */}
        <div className="flex items-center gap-3">
          <span className="text-slate-400 text-[11px] hidden lg:inline font-mono">
            Hotlines: <strong className="text-cyan-400">911</strong> (Rescue) | <strong className="text-cyan-400">166</strong> (Police) | <strong className="text-cyan-400">(088) 856-4147</strong> (NMMC)
          </span>
          <button
            onClick={onOpenEmergencyModal}
            id="emergency-directory-btn"
            className="flex items-center gap-1.5 bg-rose-950/80 hover:bg-rose-900 text-rose-200 border border-rose-800 px-3 py-1 rounded-lg font-bold text-xs transition-colors cursor-pointer shadow-sm"
          >
            <PhoneCall className="w-3.5 h-3.5 text-rose-400 animate-pulse" />
            <span>CDO Hotline Directory</span>
          </button>
        </div>
      </div>
    </section>
  );
};
