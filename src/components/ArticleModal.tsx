import React, { useState } from 'react';
import {
  Bookmark,
  CheckCircle2,
  Clock,
  ExternalLink,
  MapPin,
  Share2,
  Sparkles,
  X,
} from 'lucide-react';
import { CATEGORIES } from '../data/mockCDOFeeds';
import { NewsItem } from '../types';

interface ArticleModalProps {
  article: NewsItem | null;
  onClose: () => void;
  isSaved: boolean;
  onToggleSave: (item: NewsItem) => void;
}

export const ArticleModal: React.FC<ArticleModalProps> = ({
  article,
  onClose,
  isSaved,
  onToggleSave,
}) => {
  const [copied, setCopied] = useState<boolean>(false);

  if (!article) return null;

  const categoryMeta = CATEGORIES.find((c) => c.id === article.category) || CATEGORIES[0];

  const handleCopy = () => {
    navigator.clipboard.writeText(article.url || window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md overflow-y-auto">
      <div
        className="relative w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden my-8 text-slate-100 flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Bar */}
        <div className="p-4 border-b border-slate-800 bg-slate-950/80 flex items-center justify-between sticky top-0 z-10">
          <div className="flex items-center gap-2">
            <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase border ${categoryMeta.badgeBg}`}>
              {categoryMeta.label}
            </span>
            {article.isBreaking && (
              <span className="bg-rose-600 text-white font-extrabold text-[10px] px-2 py-0.5 rounded uppercase">
                FLASH
              </span>
            )}
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Modal Content */}
        <div className="p-6 overflow-y-auto space-y-5 flex-1">
          {/* Source Attribution */}
          <div className="flex items-center gap-3">
            <img
              src={article.sourceAvatar}
              alt={article.sourceName}
              className="w-11 h-11 rounded-full object-cover border border-slate-700"
            />
            <div>
              <div className="flex items-center gap-1.5">
                <h3 className="font-extrabold text-sm text-slate-100">{article.sourceName}</h3>
                {article.verified && <CheckCircle2 className="w-4 h-4 text-blue-400" />}
              </div>
              <p className="text-xs text-slate-400 flex items-center gap-2">
                <span>{article.sourceHandle}</span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {article.timeAgo}
                </span>
                {article.location && (
                  <>
                    <span>•</span>
                    <span className="text-amber-400 flex items-center gap-0.5">
                      <MapPin className="w-3 h-3" />
                      {article.location}
                    </span>
                  </>
                )}
              </p>
            </div>
          </div>

          {/* Title */}
          <h1 className="text-xl sm:text-2xl font-black text-slate-100 leading-snug">
            {article.title}
          </h1>

          {/* Featured Image */}
          {article.image && (
            <div className="rounded-xl overflow-hidden bg-slate-950 border border-slate-800">
              <img src={article.image} alt={article.title} className="w-full max-h-72 object-cover" />
            </div>
          )}

          {/* AI Bullet Highlights Box */}
          {article.bulletPoints && article.bulletPoints.length > 0 && (
            <div className="bg-slate-950/90 border border-amber-500/30 rounded-xl p-4 space-y-2 shadow-inner">
              <div className="flex items-center gap-1.5 text-xs font-bold text-amber-400">
                <Sparkles className="w-4 h-4 text-amber-400" />
                <span>CDO Pulse AI Takeaways</span>
              </div>
              <ul className="space-y-1.5 text-xs text-slate-200">
                {article.bulletPoints.map((pt, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="text-amber-400 font-extrabold">•</span>
                    <span>{pt}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Full Article Text */}
          <div className="prose prose-invert max-w-none text-xs sm:text-sm text-slate-200 leading-relaxed space-y-3 whitespace-pre-line border-t border-slate-800 pt-4">
            {article.fullContent || article.summary}
          </div>

          {/* Tags */}
          <div className="flex flex-wrap gap-1.5 pt-2">
            {article.tags.map((tag, i) => (
              <span key={i} className="bg-slate-800 text-slate-300 text-xs px-2.5 py-1 rounded-md font-medium">
                {tag}
              </span>
            ))}
          </div>
        </div>

        {/* Modal Footer Actions */}
        <div className="p-4 border-t border-slate-800 bg-slate-950 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <button
              onClick={() => onToggleSave(article)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-bold transition-colors cursor-pointer ${
                isSaved ? 'bg-amber-500/20 text-amber-400 border-amber-500/40' : 'bg-slate-800 text-slate-300 border-slate-700 hover:text-white'
              }`}
            >
              <Bookmark className={`w-3.5 h-3.5 ${isSaved ? 'fill-amber-400' : ''}`} />
              <span>{isSaved ? 'Saved' : 'Save Article'}</span>
            </button>

            <button
              onClick={handleCopy}
              className="flex items-center gap-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 px-3 py-1.5 rounded-lg border border-slate-700 text-xs font-semibold cursor-pointer"
            >
              <Share2 className="w-3.5 h-3.5" />
              <span>{copied ? 'Link Copied!' : 'Share'}</span>
            </button>
          </div>

          <a
            href={article.url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold px-4 py-1.5 rounded-lg text-xs transition-all cursor-pointer shadow-md"
          >
            <span>Visit Original Source</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>
    </div>
  );
};
