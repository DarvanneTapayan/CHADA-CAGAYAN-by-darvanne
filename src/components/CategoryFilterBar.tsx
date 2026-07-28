import React from 'react';
import {
  Building2,
  Calendar,
  Car,
  Grid,
  Hospital,
  LayoutGrid,
  List,
  Newspaper,
  Radio,
  RefreshCw,
  ShieldAlert,
  Sparkles,
} from 'lucide-react';
import { CategoryFilter, CategoryType } from '../types';

interface CategoryFilterBarProps {
  categories: CategoryFilter[];
  activeCategory: CategoryType;
  onSelectCategory: (cat: CategoryType) => void;
  feedCount: number;
  viewMode: 'grid' | 'list' | 'compact';
  setViewMode: (mode: 'grid' | 'list' | 'compact') => void;
  onFetchLiveUpdates: () => void;
  isFetchingLive: boolean;
  activeSourceFilter?: string;
  onClearSourceFilter?: () => void;
}

const getCategoryIcon = (iconName: string) => {
  switch (iconName) {
    case 'Building2':
      return <Building2 className="w-4 h-4" />;
    case 'Newspaper':
      return <Newspaper className="w-4 h-4" />;
    case 'Radio':
      return <Radio className="w-4 h-4" />;
    case 'ShieldAlert':
      return <ShieldAlert className="w-4 h-4" />;
    case 'Hospital':
      return <Hospital className="w-4 h-4" />;
    case 'Car':
      return <Car className="w-4 h-4" />;
    case 'Calendar':
      return <Calendar className="w-4 h-4" />;
    default:
      return <LayoutGrid className="w-4 h-4" />;
  }
};

export const CategoryFilterBar: React.FC<CategoryFilterBarProps> = ({
  categories,
  activeCategory,
  onSelectCategory,
  feedCount,
  viewMode,
  setViewMode,
  onFetchLiveUpdates,
  isFetchingLive,
  activeSourceFilter,
  onClearSourceFilter,
}) => {
  return (
    <div className="bg-[#0a0c10]/90 backdrop-blur border-b border-white/10 py-3 px-4 sticky top-[108px] sm:top-[98px] z-20 shadow-xl font-mono">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-3">
        {/* Category Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-1 pr-2">
          {categories.map((cat) => {
            const isActive = activeCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => onSelectCategory(cat.id)}
                id={`filter-cat-${cat.id}`}
                className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider whitespace-nowrap transition-all cursor-pointer ${
                  isActive
                    ? 'bg-cyan-500 text-slate-950 shadow-[0_0_12px_rgba(6,182,212,0.4)] border border-cyan-300 font-extrabold'
                    : 'bg-[#0d1117] text-slate-400 hover:text-slate-200 border border-white/10 hover:border-cyan-500/40'
                }`}
              >
                {getCategoryIcon(cat.iconName)}
                <span>{cat.label}</span>
              </button>
            );
          })}
        </div>

        {/* View Controls & Grounded Sync */}
        <div className="flex items-center justify-between md:justify-end gap-3 flex-shrink-0 pt-2 md:pt-0 border-t md:border-t-0 border-white/10">
          <div className="text-xs text-slate-400 font-medium flex items-center gap-2">
            <span>
              Stream Count: <strong className="text-cyan-400 font-bold">{feedCount}</strong>
            </span>
            {activeSourceFilter && (
              <span className="inline-flex items-center gap-1 bg-cyan-500/10 text-cyan-300 px-2 py-0.5 rounded text-[11px] border border-cyan-500/30">
                Source: {activeSourceFilter}
                {onClearSourceFilter && (
                  <button onClick={onClearSourceFilter} className="hover:text-white font-bold ml-1">
                    ✕
                  </button>
                )}
              </span>
            )}
          </div>

          <div className="flex items-center gap-2">
            {/* View Mode Switcher */}
            <div className="flex items-center bg-[#050608] p-1 rounded-lg border border-white/10">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-1.5 rounded text-xs transition-colors ${
                  viewMode === 'grid' ? 'bg-cyan-500 text-black font-bold shadow' : 'text-slate-400 hover:text-white'
                }`}
                title="Grid Cards"
              >
                <Grid className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-1.5 rounded text-xs transition-colors ${
                  viewMode === 'list' ? 'bg-cyan-500 text-black font-bold shadow' : 'text-slate-400 hover:text-white'
                }`}
                title="Detailed Stream"
              >
                <List className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Fetch Grounded Scan */}
            <button
              onClick={onFetchLiveUpdates}
              disabled={isFetchingLive}
              id="category-live-fetch"
              className="flex items-center gap-1.5 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-black px-3 py-1.5 rounded-lg text-xs shadow-md shadow-cyan-950 transition-all cursor-pointer disabled:opacity-50 border border-cyan-300 uppercase tracking-tighter"
            >
              <Sparkles className={`w-3.5 h-3.5 text-black ${isFetchingLive ? 'animate-spin' : ''}`} />
              <span className="hidden sm:inline">Live Grounding</span>
              <span className="sm:hidden">Sync</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
