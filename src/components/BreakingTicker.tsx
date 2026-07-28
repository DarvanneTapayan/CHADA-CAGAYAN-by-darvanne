import React, { useState } from 'react';
import { AlertCircle, ChevronRight, Pause, Play, Zap } from 'lucide-react';
import { NewsItem } from '../types';

interface BreakingTickerProps {
  breakingItems: NewsItem[];
  onSelectArticle: (article: NewsItem) => void;
}

export const BreakingTicker: React.FC<BreakingTickerProps> = ({
  breakingItems,
  onSelectArticle,
}) => {
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [currentIndex, setCurrentIndex] = useState<number>(0);

  if (!breakingItems || breakingItems.length === 0) return null;

  const currentAlert = breakingItems[currentIndex % breakingItems.length];

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % breakingItems.length);
  };

  return (
    <div className="bg-[#071318] border-b border-cyan-400/30 text-slate-100 py-2 px-4 shadow-md font-mono">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-3 text-xs">
        {/* Badge */}
        <div className="flex items-center gap-2 flex-shrink-0">
          <span className="flex items-center gap-1 bg-cyan-500 text-black font-black px-2.5 py-0.5 rounded text-[10px] tracking-tighter uppercase shadow-[0_0_10px_rgba(6,182,212,0.4)]">
            <Zap className="w-3 h-3 fill-black" />
            NEWS TICKER
          </span>
          <span className="text-cyan-500/40 hidden sm:inline">|</span>
        </div>

        {/* Ticker Content */}
        <div
          onClick={() => onSelectArticle(currentAlert)}
          className="flex-1 overflow-hidden cursor-pointer group flex items-center gap-2"
        >
          <span className="font-bold text-cyan-200 group-hover:text-cyan-400 line-clamp-1 text-xs">
            <span className="text-cyan-400 font-extrabold mr-1.5">[ALERT]</span>
            [{currentAlert.sourceName}] {currentAlert.title}
          </span>
          <span className="text-[10px] bg-cyan-900/40 text-cyan-400 border border-cyan-500/30 px-1.5 py-0.5 rounded flex-shrink-0">
            {currentAlert.timeAgo}
          </span>
        </div>

        {/* Ticker Controls */}
        <div className="flex items-center gap-1 flex-shrink-0 text-slate-400">
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className="p-1 hover:text-cyan-400 rounded"
            title={isPlaying ? 'Pause ticker' : 'Play ticker'}
          >
            {isPlaying ? <Pause className="w-3 h-3" /> : <Play className="w-3 h-3" />}
          </button>
          <button
            onClick={handleNext}
            className="p-1 hover:text-cyan-400 rounded flex items-center gap-0.5 text-[11px]"
          >
            <span>Next</span>
            <ChevronRight className="w-3 h-3" />
          </button>
        </div>
      </div>
    </div>
  );
};
