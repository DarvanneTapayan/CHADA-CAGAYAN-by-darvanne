import React from 'react';
import { Bookmark, ExternalLink, Trash2, X } from 'lucide-react';
import { NewsItem } from '../types';

interface SavedArticlesDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  savedArticles: NewsItem[];
  onSelectArticle: (item: NewsItem) => void;
  onRemoveSaved: (item: NewsItem) => void;
  onClearAllSaved: () => void;
}

export const SavedArticlesDrawer: React.FC<SavedArticlesDrawerProps> = ({
  isOpen,
  onClose,
  savedArticles,
  onSelectArticle,
  onRemoveSaved,
  onClearAllSaved,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-end bg-slate-950/80 backdrop-blur-sm">
      <div
        className="relative w-full max-w-md h-full bg-slate-900 border-l border-slate-800 text-slate-100 flex flex-col shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-4 border-b border-slate-800 bg-slate-950 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Bookmark className="w-5 h-5 text-amber-400" />
            <div>
              <h2 className="font-extrabold text-base">Saved Articles ({savedArticles.length})</h2>
              <p className="text-xs text-slate-400">Bookmarked for offline reading</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-full text-slate-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* List */}
        <div className="p-4 flex-1 overflow-y-auto space-y-3">
          {savedArticles.length === 0 ? (
            <div className="text-center py-16 space-y-3">
              <Bookmark className="w-12 h-12 text-slate-700 mx-auto" />
              <p className="text-xs text-slate-400">No articles bookmarked yet.</p>
              <p className="text-[11px] text-slate-500">
                Click the bookmark icon on any CDO feed item to save it for later.
              </p>
            </div>
          ) : (
            savedArticles.map((item) => (
              <div
                key={item.id}
                className="p-3 bg-slate-950 rounded-xl border border-slate-800 hover:border-amber-500/40 transition-all flex flex-col justify-between gap-2"
              >
                <div className="flex items-center justify-between text-[10px] text-amber-400 font-bold uppercase">
                  <span>{item.sourceName}</span>
                  <span>{item.timeAgo}</span>
                </div>
                <h3
                  onClick={() => onSelectArticle(item)}
                  className="font-bold text-xs text-slate-100 hover:text-amber-300 cursor-pointer line-clamp-2"
                >
                  {item.title}
                </h3>
                <div className="flex items-center justify-between pt-1 border-t border-slate-800/80">
                  <button
                    onClick={() => onSelectArticle(item)}
                    className="text-[11px] text-indigo-400 hover:underline flex items-center gap-1 font-semibold"
                  >
                    <span>Read Article</span>
                    <ExternalLink className="w-3 h-3" />
                  </button>
                  <button
                    onClick={() => onRemoveSaved(item)}
                    className="text-[11px] text-rose-400 hover:text-rose-300 flex items-center gap-1 font-medium"
                  >
                    <Trash2 className="w-3 h-3" />
                    <span>Remove</span>
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        {savedArticles.length > 0 && (
          <div className="p-3 border-t border-slate-800 bg-slate-950 flex justify-end">
            <button
              onClick={onClearAllSaved}
              className="text-xs text-rose-400 hover:underline font-bold"
            >
              Clear All Saved Articles
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
