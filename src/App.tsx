import React, { useEffect, useMemo, useState } from 'react';
import {
  AlertTriangle,
  Bell,
  Bookmark,
  Bot,
  Building2,
  Calendar,
  Car,
  ChevronUp,
  Hospital,
  LayoutGrid,
  Newspaper,
  PhoneCall,
  Radio,
  RefreshCw,
  Search,
  ShieldAlert,
  Sparkles,
  TrendingUp,
} from 'lucide-react';
import { AIAssistantDrawer } from './components/AIAssistantDrawer';
import { ArticleModal } from './components/ArticleModal';
import { BreakingTicker } from './components/BreakingTicker';
import { CategoryFilterBar } from './components/CategoryFilterBar';
import { EmergencyModal } from './components/EmergencyModal';
import { FeedCard } from './components/FeedCard';
import { Header } from './components/Header';
import { NotificationModal } from './components/NotificationModal';
import { RadioPlayerBar } from './components/RadioPlayerBar';
import { SavedArticlesDrawer } from './components/SavedArticlesDrawer';
import { WeatherEmergencyBar } from './components/WeatherEmergencyBar';
import { CATEGORIES, INITIAL_NEWS_ITEMS, MOCK_WEATHER } from './data/mockCDOFeeds';
import { CategoryType, NewsItem, NotificationItem, PushNotificationSettings } from './types';

export default function App() {
  // Feed state
  const [newsItems, setNewsItems] = useState<NewsItem[]>(INITIAL_NEWS_ITEMS);
  const [activeCategory, setActiveCategory] = useState<CategoryType>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [sourceFilter, setSourceFilter] = useState<string | undefined>(undefined);
  const [viewMode, setViewMode] = useState<'grid' | 'list' | 'compact'>('grid');

  // Drawers & Modals
  const [selectedArticle, setSelectedArticle] = useState<NewsItem | null>(null);
  const [showNotificationModal, setShowNotificationModal] = useState<boolean>(false);
  const [showAIDrawer, setShowAIDrawer] = useState<boolean>(false);
  const [showSavedDrawer, setShowSavedDrawer] = useState<boolean>(false);
  const [showEmergencyModal, setShowEmergencyModal] = useState<boolean>(false);

  // Radio Player State
  const [isRadioPlaying, setIsRadioPlaying] = useState<boolean>(false);
  const [showRadioBar, setShowRadioBar] = useState<boolean>(false);

  // Fetching state
  const [isFetchingLive, setIsFetchingLive] = useState<boolean>(false);
  const [liveToast, setLiveToast] = useState<string | null>(null);
  const [fetchError, setFetchError] = useState<string | null>(null);

  // Saved Articles Persistence
  const [savedArticles, setSavedArticles] = useState<NewsItem[]>(() => {
    if (typeof window !== 'undefined') {
      try {
        const local = localStorage.getItem('cdo_saved_articles');
        return local ? JSON.parse(local) : [];
      } catch (e) {
        return [];
      }
    }
    return [];
  });

  useEffect(() => {
    try {
      localStorage.setItem('cdo_saved_articles', JSON.stringify(savedArticles));
    } catch (e) {
      console.warn('LocalStorage save error', e);
    }
  }, [savedArticles]);

  // Notifications State
  const [notificationSettings, setNotificationSettings] = useState<PushNotificationSettings>({
    enabled: true,
    soundEnabled: true,
    topics: {
      breaking: true,
      mayor: true,
      crime: true,
      traffic: true,
      hospitals: true,
      weather: true,
      events: true,
    },
  });

  const [notifications, setNotifications] = useState<NotificationItem[]>(() => {
    return [
      {
        id: 'init-1',
        title: '🏛️ Mayor Klarex Uy "Klarex sa Barangay" Caravan',
        body: 'Barangay Carmen Outreach program providing free medical and legal services.',
        category: 'mayor',
        timestamp: '35 mins ago',
        read: false,
      },
      {
        id: 'init-2',
        title: '🚨 RTA Traffic Advisory: Lapasan Highway Narrowing',
        body: 'DPWH culvert construction in front of Market City.',
        category: 'traffic',
        timestamp: '4 hrs ago',
        read: false,
      },
    ];
  });

  // Toggle Save Article
  const handleToggleSave = (item: NewsItem) => {
    setSavedArticles((prev) => {
      const exists = prev.some((a) => a.id === item.id);
      if (exists) {
        return prev.filter((a) => a.id !== item.id);
      } else {
        return [item, ...prev];
      }
    });
  };

  // Auto-fetch fresh live CDO news on mount
  useEffect(() => {
    handleFetchLiveNews();
  }, []);

  // Fetch Grounded Live CDO News
  const handleFetchLiveNews = async () => {
    setIsFetchingLive(true);
    setFetchError(null);
    setLiveToast('Synchronizing live RSS feeds (Mindanao Daily, Gold Star Daily, SunStar, PNA)...');
    try {
      const res = await fetch('/api/cdo-news', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ category: activeCategory, query: searchQuery }),
      });

      if (!res.ok) {
        const errText = await res.text();
        let parsedErr = errText;
        try {
          const json = JSON.parse(errText);
          parsedErr = json.error || json.message || errText;
        } catch (e) {}
        throw new Error(`HTTP ${res.status}: ${parsedErr}`);
      }

      const data = await res.json();
      if (!data.success) {
        throw new Error(data.error || data.message || 'Server returned failure status');
      }

      if (Array.isArray(data.news) && data.news.length > 0) {
        const newFetched: NewsItem[] = data.news.map((item: any, idx: number) => ({
          id: item.id || `live-${Date.now()}-${idx}`,
          title: item.title || 'CDO Live News Update',
          summary: item.summary || 'Real-time update from Cagayan de Oro City.',
          fullContent: item.fullContent || item.summary || '',
          sourceName: item.sourceName || 'CDO Live Feed',
          sourceHandle: item.sourceHandle || '@CDOPulseLive',
          sourceAvatar:
            item.sourceAvatar ||
            'https://images.unsplash.com/photo-1577495508048-b635879837f1?w=120&auto=format&fit=crop&q=80',
          category: (item.category as CategoryType) || 'news',
          timestamp: item.timestamp || new Date().toISOString(),
          timeAgo: item.timeAgo || 'Just now',
          url: item.url || 'https://cagayandeoro.gov.ph',
          verified: item.verified ?? true,
          image: item.image,
          engagement: item.engagement || { likes: 120, shares: 45, comments: 12 },
          tags: item.tags || ['#CDOPulse', '#CagayanDeOro'],
          isBreaking: item.isBreaking ?? false,
          location: item.location || 'Cagayan de Oro City',
          bulletPoints: item.bulletPoints || [],
        }));

        const seenIds = new Set<string>();
        const uniqueItems: NewsItem[] = [];

        newFetched.forEach((item, idx) => {
          let itemKey = item.id;
          if (seenIds.has(itemKey)) {
            itemKey = `${item.id}-${idx}`;
          }
          seenIds.add(itemKey);
          uniqueItems.push({ ...item, id: itemKey });
        });

        setNewsItems(uniqueItems);
        setFetchError(null);
        setLiveToast(`Successfully synchronized ${data.news.length} fresh CDO updates!`);

        // Send a push notification if browser permits
        if (typeof window !== 'undefined' && 'Notification' in window && Notification.permission === 'granted') {
          new Notification('CDO Pulse Live Sync', {
            body: `Received ${data.news.length} live updates for Cagayan de Oro City.`,
            icon: '/favicon.ico',
          });
        }
      } else {
        setLiveToast('No new articles found at this moment.');
      }
    } catch (err: any) {
      console.error('Error fetching live news:', err);
      const errorMsg = err?.stack || err?.message || String(err);
      setFetchError(errorMsg);
      setLiveToast('Error fetching CDO live news stream.');
    } finally {
      setIsFetchingLive(false);
      setTimeout(() => setLiveToast(null), 4000);
    }
  };

  // Trigger Push Notification Test
  const handleTestNotification = async (topic: string) => {
    try {
      const res = await fetch('/api/send-test-notification', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ topic }),
      });
      const data = await res.json();
      if (data.success && data.notification) {
        const notif: NotificationItem = {
          id: data.notification.id,
          title: data.notification.title,
          body: data.notification.body,
          category: topic as CategoryType,
          timestamp: 'Just now',
          read: false,
        };
        setNotifications((prev) => [notif, ...prev]);

        // Browser push
        if (typeof window !== 'undefined' && 'Notification' in window && Notification.permission === 'granted') {
          new Notification(data.notification.title, {
            body: data.notification.body,
          });
        }
      }
    } catch (e) {
      console.error('Push test error', e);
    }
  };

  // Filtered Feed items computation
  const filteredItems = useMemo(() => {
    return newsItems.filter((item) => {
      // Category filter
      if (activeCategory !== 'all' && item.category !== activeCategory) {
        return false;
      }
      // Source name filter
      if (sourceFilter && item.sourceName.toLowerCase() !== sourceFilter.toLowerCase()) {
        return false;
      }
      // Search query filter
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesTitle = item.title.toLowerCase().includes(q);
        const matchesSummary = item.summary.toLowerCase().includes(q);
        const matchesContent = item.fullContent.toLowerCase().includes(q);
        const matchesSource = item.sourceName.toLowerCase().includes(q);
        const matchesLocation = item.location ? item.location.toLowerCase().includes(q) : false;
        const matchesTags = item.tags.some((t) => t.toLowerCase().includes(q));
        if (
          !matchesTitle &&
          !matchesSummary &&
          !matchesContent &&
          !matchesSource &&
          !matchesLocation &&
          !matchesTags
        ) {
          return false;
        }
      }
      return true;
    });
  }, [newsItems, activeCategory, sourceFilter, searchQuery]);

  // Breaking items for ticker
  const breakingItems = useMemo(() => {
    return newsItems.filter((n) => n.isBreaking);
  }, [newsItems]);

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <div className="min-h-screen bg-[#050608] text-slate-200 font-sans selection:bg-cyan-500 selection:text-black flex flex-col pb-20">
      {/* Toast Notification */}
      {liveToast && (
        <div className="fixed top-16 left-1/2 -translate-x-1/2 z-50 bg-cyan-500 text-black font-extrabold px-4 py-2 rounded-xl shadow-[0_0_20px_rgba(6,182,212,0.4)] border border-cyan-300 text-xs flex items-center gap-2 animate-bounce font-mono">
          <Sparkles className="w-4 h-4 text-black" />
          <span>{liveToast}</span>
        </div>
      )}

      {/* Navigation Header */}
      <Header
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        onOpenNotifications={() => {
          setShowNotificationModal(true);
          setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
        }}
        onOpenSaved={() => setShowSavedDrawer(true)}
        onOpenAI={() => setShowAIDrawer(true)}
        onOpenEmergency={() => setShowEmergencyModal(true)}
        onToggleRadio={() => {
          setShowRadioBar(!showRadioBar);
          setIsRadioPlaying(!isRadioPlaying);
        }}
        onFetchLiveUpdates={handleFetchLiveNews}
        savedCount={savedArticles.length}
        unreadNotificationCount={unreadCount}
        isRadioPlaying={isRadioPlaying}
        isFetchingLive={isFetchingLive}
      />

      {/* Breaking Flash Ticker */}
      <BreakingTicker
        breakingItems={breakingItems}
        onSelectArticle={(item) => setSelectedArticle(item)}
      />

      {/* Weather & Emergency Banner */}
      <WeatherEmergencyBar
        weather={MOCK_WEATHER}
        onOpenEmergencyModal={() => setShowEmergencyModal(true)}
      />

      {/* Sticky Category Filter Bar */}
      <CategoryFilterBar
        categories={CATEGORIES}
        activeCategory={activeCategory}
        onSelectCategory={(cat) => {
          setActiveCategory(cat);
          setSourceFilter(undefined);
        }}
        feedCount={filteredItems.length}
        viewMode={viewMode}
        setViewMode={setViewMode}
        onFetchLiveUpdates={handleFetchLiveNews}
        isFetchingLive={isFetchingLive}
        activeSourceFilter={sourceFilter}
        onClearSourceFilter={() => setSourceFilter(undefined)}
      />

      {/* Main Content Dashboard */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6 flex-1 w-full">
        {fetchError ? (
          <div className="bg-rose-950/70 border-2 border-rose-500/80 rounded-2xl p-6 sm:p-8 space-y-4 shadow-2xl backdrop-blur-md max-w-4xl mx-auto my-6 text-left">
            <div className="flex items-center gap-3 text-rose-400">
              <AlertTriangle className="w-8 h-8 shrink-0 text-rose-500 animate-pulse" />
              <div>
                <h2 className="text-lg font-black text-rose-200 uppercase tracking-wide font-mono">
                  News Feed Sync Error
                </h2>
                <p className="text-xs text-rose-300">
                  News cards are hidden because an error was encountered while fetching the live stream.
                </p>
              </div>
            </div>

            <div className="bg-black/80 border border-rose-900/80 rounded-xl p-4 overflow-x-auto text-xs text-rose-300 font-mono whitespace-pre-wrap leading-relaxed select-all">
              <div className="text-[10px] text-rose-500 uppercase font-bold mb-1">Console Error Details:</div>
              <code>{fetchError}</code>
            </div>

            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                onClick={handleFetchLiveNews}
                disabled={isFetchingLive}
                className="flex items-center gap-2 bg-rose-600 hover:bg-rose-500 text-white font-bold px-5 py-2.5 rounded-xl text-xs transition-all cursor-pointer shadow-lg shadow-rose-950"
              >
                <RefreshCw className={`w-4 h-4 ${isFetchingLive ? 'animate-spin' : ''}`} />
                <span>Retry Live Sync</span>
              </button>
              <button
                onClick={() => setFetchError(null)}
                className="bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold px-4 py-2.5 rounded-xl text-xs transition-colors cursor-pointer border border-slate-700"
              >
                Dismiss Error
              </button>
            </div>
          </div>
        ) : (
          <>
            {/* Active Search / Filter Banner if applicable */}
            {searchQuery && (
              <div className="mb-4 p-3 bg-cyan-500/10 border border-cyan-500/30 rounded-xl flex items-center justify-between text-xs text-cyan-300 font-mono">
                <span>
                  Search query: <strong className="text-white">"{searchQuery}"</strong> ({filteredItems.length} matches)
                </span>
                <button
                  onClick={() => setSearchQuery('')}
                  className="text-cyan-400 hover:text-white font-bold"
                >
                  Clear Search
                </button>
              </div>
            )}

            {/* Feed Cards Grid / List */}
            {filteredItems.length === 0 ? (
              <div className="text-center py-20 bg-[#0d1117] rounded-2xl border border-white/5 p-8 space-y-4">
                <Search className="w-12 h-12 text-slate-600 mx-auto" />
                <h3 className="text-base font-bold text-slate-300 font-mono">No stream data matching query</h3>
                <p className="text-xs text-slate-400 max-w-md mx-auto">
                  Try searching with different terms or click "Live CDO Scan" to fetch fresh real-time news from Cagayan de Oro web sources.
                </p>
                <button
                  onClick={handleFetchLiveNews}
                  disabled={isFetchingLive}
                  className="inline-flex items-center gap-2 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold px-4 py-2 rounded-xl text-xs transition-all cursor-pointer shadow-lg shadow-cyan-950"
                >
                  <RefreshCw className={`w-4 h-4 ${isFetchingLive ? 'animate-spin' : ''}`} />
                  <span>Fetch Live CDO News Stream</span>
                </button>
              </div>
            ) : (
              <div
                className={
                  viewMode === 'grid'
                    ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'
                    : 'space-y-4 max-w-4xl mx-auto'
                }
              >
                {filteredItems.map((item) => (
                  <FeedCard
                    key={item.id}
                    item={item}
                    isSaved={savedArticles.some((a) => a.id === item.id)}
                    onToggleSave={handleToggleSave}
                    onSelectArticle={(article) => setSelectedArticle(article)}
                    onFilterBySource={(sourceName) => setSourceFilter(sourceName)}
                    viewMode={viewMode}
                  />
                ))}
              </div>
            )}
          </>
        )}
      </main>

      {/* Floating Action Buttons (Mobile / Quick Access) */}
      <div className="fixed bottom-6 right-6 z-30 flex flex-col items-end gap-3">
        {/* Floating AI Button */}
        <button
          onClick={() => setShowAIDrawer(true)}
          id="floating-ai-btn"
          className="flex items-center gap-2 bg-gradient-to-r from-cyan-500 via-teal-600 to-indigo-600 text-white font-black px-4 py-3 rounded-full shadow-[0_0_25px_rgba(6,182,212,0.35)] hover:scale-105 transition-all duration-200 cursor-pointer border border-cyan-400/40"
        >
          <Bot className="w-5 h-5 text-cyan-200" />
          <span className="text-xs hidden sm:inline font-mono">Ask CDO AI</span>
        </button>

        {/* Scroll To Top */}
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="p-3 bg-[#0d1117] border border-white/10 text-slate-300 hover:text-white rounded-full shadow-lg hover:bg-white/10 transition-colors"
          title="Scroll to Top"
        >
          <ChevronUp className="w-4 h-4 text-cyan-400" />
        </button>
      </div>

      {/* Radio Player Bar */}
      {showRadioBar && (
        <RadioPlayerBar
          isPlaying={isRadioPlaying}
          onTogglePlay={() => setIsRadioPlaying(!isRadioPlaying)}
          onClose={() => {
            setShowRadioBar(false);
            setIsRadioPlaying(false);
          }}
        />
      )}

      {/* Modals & Drawers */}
      <ArticleModal
        article={selectedArticle}
        onClose={() => setSelectedArticle(null)}
        isSaved={selectedArticle ? savedArticles.some((a) => a.id === selectedArticle.id) : false}
        onToggleSave={handleToggleSave}
      />

      <NotificationModal
        isOpen={showNotificationModal}
        onClose={() => setShowNotificationModal(false)}
        settings={notificationSettings}
        setSettings={setNotificationSettings}
        notifications={notifications}
        onClearNotifications={() => setNotifications([])}
        onTestNotification={handleTestNotification}
      />

      <AIAssistantDrawer
        isOpen={showAIDrawer}
        onClose={() => setShowAIDrawer(false)}
      />

      <SavedArticlesDrawer
        isOpen={showSavedDrawer}
        onClose={() => setShowSavedDrawer(false)}
        savedArticles={savedArticles}
        onSelectArticle={(item) => setSelectedArticle(item)}
        onRemoveSaved={handleToggleSave}
        onClearAllSaved={() => setSavedArticles([])}
      />

      <EmergencyModal
        isOpen={showEmergencyModal}
        onClose={() => setShowEmergencyModal(false)}
      />

      {/* Footer */}
      <footer className="bg-[#050608] border-t border-cyan-500/20 py-8 px-4 text-center text-xs text-slate-500 space-y-2 mt-auto font-mono">
        <div className="flex items-center justify-center gap-2 text-cyan-400 font-bold">
          <span>CITY PULSE DASHBOARD</span>
          <span>//</span>
          <span>CAGAYAN DE ORO STREAM AGGREGATOR</span>
        </div>
        <p className="max-w-xl mx-auto text-slate-400 text-[11px]">
          Aggregating updates from City Mayor Klarex Uy, City Hall, Bombo Radyo CDO, SunStar CDO, Mindanao Daily, COCPO Police, NMMC, City Health Office, RTA, and local Kagay-anon community feeds.
        </p>
        <p className="text-[10px] text-slate-600">
          POWERED BY GEMINI AI SEARCH GROUNDING & REAL-TIME PUSH ENGINE
        </p>
      </footer>
    </div>
  );
}
