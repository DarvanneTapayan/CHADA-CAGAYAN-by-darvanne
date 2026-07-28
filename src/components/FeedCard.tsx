import React, { useState } from 'react';
import {
  Bookmark,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Clock,
  ExternalLink,
  Heart,
  MapPin,
  MessageSquare,
  Share2,
  Sparkles,
} from 'lucide-react';
import { CATEGORIES } from '../data/mockCDOFeeds';
import { NewsItem } from '../types';

interface FeedCardProps {
  item: NewsItem;
  isSaved: boolean;
  onToggleSave: (item: NewsItem) => void;
  onSelectArticle: (item: NewsItem) => void;
  onFilterBySource: (sourceName: string) => void;
  viewMode?: 'grid' | 'list' | 'compact';
}

export const FeedCard: React.FC<FeedCardProps> = ({
  item,
  isSaved,
  onToggleSave,
  onSelectArticle,
  onFilterBySource,
  viewMode = 'grid',
}) => {
  const [likes, setLikes] = useState<number>(item.engagement?.likes || 0);
  const [hasLiked, setHasLiked] = useState<boolean>(false);
  const [showBullets, setShowBullets] = useState<boolean>(false);
  const [copiedLink, setCopiedLink] = useState<boolean>(false);

  const categoryMeta = CATEGORIES.find((c) => c.id === item.category) || CATEGORIES[0];

  const handleLike = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (hasLiked) {
      setLikes((prev) => prev - 1);
      setHasLiked(false);
    } else {
      setLikes((prev) => prev + 1);
      setHasLiked(true);
    }
  };

  const handleShare = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(item.url || window.location.href);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  if (viewMode === 'compact') {
    return (
      <div
        onClick={() => onSelectArticle(item)}
        className="bg-[#0d1117] hover:bg-slate-900 border border-white/5 border-l-2 border-l-cyan-500 rounded-r-xl p-3 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 hover:border-cyan-500/40 transition-all cursor-pointer group shadow-xl"
      >
        <div className="flex items-center gap-3 flex-1 min-w-0">
          <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase border bg-cyan-500/10 text-cyan-400 border-cyan-500/30">
            {categoryMeta.label}
          </span>
          <div className="min-w-0">
            <h3 className="text-sm font-bold text-slate-100 group-hover:text-cyan-400 truncate">
              {item.title}
            </h3>
            <p className="text-xs text-slate-400 flex items-center gap-2 mt-0.5 font-mono">
              <span className="text-slate-300 font-semibold">{item.sourceName}</span>
              <span>//</span>
              <span>{item.timeAgo}</span>
              {item.location && (
                <>
                  <span>//</span>
                  <span className="text-cyan-400/90">{item.location}</span>
                </>
              )}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2 self-end sm:self-center">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onToggleSave(item);
            }}
            className={`p-1.5 rounded-lg border text-xs transition-colors ${
              isSaved ? 'bg-cyan-500/20 text-cyan-400 border-cyan-500/40' : 'text-slate-400 border-white/10 hover:text-white'
            }`}
          >
            <Bookmark className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    );
  }

  return (
    <article className="bg-[#0d1117] border border-white/5 hover:border-cyan-500/40 rounded-xl overflow-hidden shadow-2xl hover:shadow-[0_0_20px_rgba(6,182,212,0.15)] transition-all duration-200 flex flex-col justify-between group border-l-2 border-l-cyan-500">
      <div>
        {/* Card Header: Source & Category */}
        <div className="p-3.5 border-b border-white/10 flex items-center justify-between gap-2 bg-white/5">
          <div className="flex items-center gap-2.5 min-w-0">
            <img
              src={item.sourceAvatar}
              alt={item.sourceName}
              className="w-8 h-8 rounded-full object-cover border border-white/20 flex-shrink-0"
              onError={(e) => {
                (e.target as HTMLElement).style.display = 'none';
              }}
            />
            <div className="min-w-0">
              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => onFilterBySource(item.sourceName)}
                  className="font-bold text-xs text-white hover:text-cyan-400 truncate cursor-pointer text-left"
                >
                  {item.sourceName}
                </button>
                {item.verified && <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400 flex-shrink-0" />}
              </div>
              <p className="text-[10px] text-slate-400 font-mono flex items-center gap-1.5">
                <span>{item.sourceHandle}</span>
                <span>//</span>
                <span className="flex items-center gap-0.5">
                  <Clock className="w-3 h-3 text-slate-500" />
                  {item.timeAgo}
                </span>
              </p>
            </div>
          </div>

          <span
            className="px-2.5 py-0.5 rounded text-[10px] font-mono font-bold uppercase border bg-cyan-500/10 text-cyan-400 border-cyan-500/30 flex-shrink-0"
          >
            {categoryMeta.label}
          </span>
        </div>

        {/* Optional Article Image */}
        {item.image && (
          <div className="relative overflow-hidden cursor-pointer bg-[#050608] max-h-56" onClick={() => onSelectArticle(item)}>
            <img
              src={item.image}
              alt={item.title}
              className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
              loading="lazy"
            />
            {item.isBreaking && (
              <span className="absolute top-2 left-2 bg-rose-600 text-white font-mono font-black text-[10px] px-2 py-0.5 rounded shadow tracking-wider uppercase">
                [ALERT]
              </span>
            )}
            {item.location && (
              <span className="absolute bottom-2 left-2 bg-[#050608]/90 backdrop-blur text-slate-200 text-[10px] font-mono px-2 py-0.5 rounded flex items-center gap-1 border border-white/10">
                <MapPin className="w-3 h-3 text-cyan-400" />
                {item.location}
              </span>
            )}
          </div>
        )}

        {/* Content Body */}
        <div className="p-4">
          <h2
            onClick={() => onSelectArticle(item)}
            className="text-base font-bold text-slate-100 group-hover:text-cyan-300 cursor-pointer transition-colors leading-snug line-clamp-2"
          >
            {item.title}
          </h2>

          <p className="text-xs text-slate-300 mt-2 leading-relaxed line-clamp-3">
            {item.summary}
          </p>

          {/* Key Bullet Takeaways Toggle */}
          {item.bulletPoints && item.bulletPoints.length > 0 && (
            <div className="mt-3 pt-3 border-t border-white/5">
              <button
                onClick={() => setShowBullets(!showBullets)}
                className="text-xs text-cyan-400 hover:text-cyan-300 font-mono font-semibold flex items-center gap-1 cursor-pointer"
              >
                <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                <span>{showBullets ? 'Hide Highlights' : 'View AI Highlights'}</span>
                {showBullets ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
              </button>

              {showBullets && (
                <ul className="mt-2 space-y-1 bg-white/5 p-2.5 rounded-lg border border-white/10 text-[11px] text-slate-300 font-mono">
                  {item.bulletPoints.map((point, idx) => (
                    <li key={idx} className="flex items-start gap-1.5">
                      <span className="text-cyan-400 font-bold">•</span>
                      <span>{point}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )}

          {/* Tags */}
          <div className="flex flex-wrap gap-1.5 mt-3 font-mono">
            {item.tags.map((tag, idx) => (
              <span
                key={idx}
                className="text-[10px] text-slate-400 bg-white/5 hover:bg-white/10 px-2 py-0.5 rounded border border-white/5"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Card Footer Actions */}
      <div className="px-4 py-2.5 bg-[#050608]/80 border-t border-white/5 flex items-center justify-between text-xs text-slate-400">
        <div className="flex items-center gap-3">
          {/* Like */}
          <button
            onClick={handleLike}
            className={`flex items-center gap-1 text-xs transition-colors cursor-pointer ${
              hasLiked ? 'text-rose-400 font-bold' : 'hover:text-rose-400'
            }`}
          >
            <Heart className={`w-3.5 h-3.5 ${hasLiked ? 'fill-rose-500 text-rose-500' : ''}`} />
            <span>{likes}</span>
          </button>

          {/* Share */}
          <button
            onClick={handleShare}
            className="flex items-center gap-1 hover:text-cyan-400 transition-colors cursor-pointer"
            title="Copy link to article"
          >
            <Share2 className="w-3.5 h-3.5" />
            <span>{copiedLink ? 'Copied!' : 'Share'}</span>
          </button>
        </div>

        <div className="flex items-center gap-2">
          {/* Bookmark */}
          <button
            onClick={() => onToggleSave(item)}
            className={`p-1.5 rounded-lg border transition-colors cursor-pointer ${
              isSaved ? 'bg-cyan-500/20 text-cyan-400 border-cyan-500/40' : 'border-white/10 text-slate-400 hover:text-white'
            }`}
            title={isSaved ? 'Remove from saved' : 'Save article'}
          >
            <Bookmark className={`w-3.5 h-3.5 ${isSaved ? 'fill-cyan-400' : ''}`} />
          </button>

          {/* Read Modal */}
          <button
            onClick={() => onSelectArticle(item)}
            className="flex items-center gap-1 bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-300 font-mono font-bold px-2.5 py-1 rounded-lg border border-cyan-500/30 transition-all cursor-pointer text-[11px]"
          >
            <span>Read Full</span>
            <ExternalLink className="w-3 h-3" />
          </button>
        </div>
      </div>
    </article>
  );
};
