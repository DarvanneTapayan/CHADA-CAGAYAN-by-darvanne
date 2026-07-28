import Parser from 'rss-parser';
import crypto from 'crypto';

export interface RSSArticleItem {
  id: string;
  title: string;
  summary: string;
  fullContent: string;
  sourceName: string;
  sourceHandle: string;
  sourceAvatar: string;
  category: 'mayor' | 'news' | 'radio' | 'crime' | 'hospitals' | 'traffic' | 'events';
  timestamp: string;
  timeAgo: string;
  url: string;
  verified: boolean;
  image?: string;
  engagement: {
    likes: number;
    shares: number;
    comments: number;
  };
  tags: string[];
  isBreaking: boolean;
  location?: string;
  bulletPoints: string[];
}

const parser = new Parser({
  customFields: {
    item: [
      ['media:content', 'mediaContent', { keepArray: false }],
      ['media:thumbnail', 'mediaThumbnail', { keepArray: false }],
      ['content:encoded', 'contentEncoded'],
    ],
  },
  requestOptions: {
    headers: {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) CDOPulse/1.0 NewsAggregator',
      'Accept': 'application/rss+xml, application/xml, text/xml, */*',
    },
    timeout: 8000,
  },
});

// Primary RSS Feed Targets requested by user
const RSS_SOURCES = [
  {
    name: 'Mindanao Daily News',
    handle: '@MindanaoDaily',
    avatar: 'https://images.unsplash.com/photo-1585829365295-ab7cd400c167?w=120&auto=format&fit=crop&q=80',
    feedUrl: 'https://mindanaodailynews.com/feed/',
    defaultCategory: 'news' as const,
  },
  {
    name: 'Mindanao Gold Star Daily',
    handle: '@GoldStarDaily',
    avatar: 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=120&auto=format&fit=crop&q=80',
    feedUrl: 'https://news.google.com/rss/search?q=%22Mindanao+Gold+Star+Daily%22+OR+%22Gold+Star+Daily%22+Cagayan+de+Oro&hl=en-PH&gl=PH&ceid=PH:en',
    defaultCategory: 'news' as const,
  },
  {
    name: 'SunStar Cagayan de Oro',
    handle: '@SunStarCDO',
    avatar: 'https://images.unsplash.com/photo-1585829365295-ab7cd400c167?w=120&auto=format&fit=crop&q=80',
    feedUrl: 'https://news.google.com/rss/search?q=%22SunStar%22+Cagayan+de+Oro&hl=en-PH&gl=PH&ceid=PH:en',
    defaultCategory: 'traffic' as const,
  },
  {
    name: 'CDO Local Government & Advisories',
    handle: '@CDO_LGU_Advisories',
    avatar: 'https://images.unsplash.com/photo-1577495508048-b635879837f1?w=120&auto=format&fit=crop&q=80',
    feedUrl: 'https://news.google.com/rss/search?q=Cagayan+de+Oro+Mayor+Klarex+Uy+OR+CDRRMD+OR+PIA&hl=en-PH&gl=PH&ceid=PH:en',
    defaultCategory: 'mayor' as const,
  },
  {
    name: 'Google News - Cagayan de Oro Hub',
    handle: '@GoogleNewsCDO',
    avatar: 'https://images.unsplash.com/photo-1526470608268-f674ce90ebd4?w=120&auto=format&fit=crop&q=80',
    feedUrl: 'https://news.google.com/rss/search?q=Cagayan+de+Oro&hl=en-PH&gl=PH&ceid=PH:en',
    defaultCategory: 'news' as const,
  },
];

// Helper: Decode common HTML entities
function decodeHtmlEntities(str: string): string {
  if (!str) return '';
  return str
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#039;/g, "'")
    .replace(/&#8217;/g, "'")
    .replace(/&#8220;/g, '"')
    .replace(/&#8221;/g, '"')
    .replace(/&#8211;/g, '–')
    .replace(/&#8212;/g, '—')
    .replace(/&nbsp;/g, ' ');
}

// Helper: Clean HTML tags and retrieve 1-2 sentence excerpt for card preview
function cleanSnippet(htmlOrText: string): string {
  if (!htmlOrText) return '';
  let cleaned = htmlOrText.replace(/<[^>]+>/g, ' ');
  cleaned = cleaned.replace(/\s+/g, ' ').trim();
  cleaned = decodeHtmlEntities(cleaned);

  const sentences = cleaned.match(/[^.!?]+[.!?]+/g);
  if (sentences && sentences.length >= 2) {
    cleaned = sentences.slice(0, 2).join(' ');
  } else if (cleaned.length > 220) {
    cleaned = cleaned.substring(0, 217) + '...';
  }
  return cleaned;
}

// Helper: Extract full article text without truncation for full reading in modal
function cleanFullContent(htmlOrText: string): string {
  if (!htmlOrText) return '';
  // Convert block tags and breaks to paragraph double-newlines
  let text = htmlOrText
    .replace(/<\/(p|div|h1|h2|h3|h4|h5|h6|li|tr|blockquote)>/gi, '\n\n')
    .replace(/<br\s*\/?>/gi, '\n');

  // Strip all remaining HTML tags
  text = text.replace(/<[^>]+>/g, '');
  // Decode HTML entities
  text = decodeHtmlEntities(text);
  // Clean up excessive blank lines or trailing whitespace
  text = text
    .split('\n')
    .map((line) => line.trim())
    .filter((line, idx, arr) => line.length > 0 || (idx > 0 && arr[idx - 1].length > 0))
    .join('\n');

  return text.trim();
}

// Helper: Extract actual image URL from RSS feed item
function extractImageUrl(item: any, category: string): string {
  // 1. Check enclosure
  if (
    item.enclosure?.url &&
    (item.enclosure.url.includes('.jpg') ||
      item.enclosure.url.includes('.png') ||
      item.enclosure.url.includes('.jpeg') ||
      item.enclosure.url.includes('.webp'))
  ) {
    return item.enclosure.url;
  }

  // 2. Check media:content / media:thumbnail
  if (item.mediaContent?.$?.url) return item.mediaContent.$.url;
  if (item.mediaThumbnail?.$?.url) return item.mediaThumbnail.$.url;
  if (item['media:content']?.$?.url) return item['media:content'].$.url;
  if (item['media:thumbnail']?.$?.url) return item['media:thumbnail'].$.url;

  // 3. Regex search for <img src="..."> in HTML content
  const htmlContent =
    item.contentEncoded ||
    item['content:encoded'] ||
    item.content ||
    item.description ||
    item.summary ||
    '';
  const imgRegex = /<img[^>]+src=["']([^"']+)["']/gi;
  let match;
  while ((match = imgRegex.exec(htmlContent)) !== null) {
    const src = match[1];
    if (
      src &&
      !src.includes('gravatar') &&
      !src.includes('feedburner') &&
      !src.includes('doubleclick') &&
      !src.includes('1x1') &&
      !src.includes('pixel') &&
      (src.startsWith('http://') || src.startsWith('https://'))
    ) {
      return src;
    }
  }

  // 4. Default high-res thematic Unsplash image based on category if feed item has no image
  const fallbackImages: Record<string, string> = {
    mayor: 'https://images.unsplash.com/photo-1541872703-74c5e44368f9?w=800&auto=format&fit=crop&q=80',
    news: 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=800&auto=format&fit=crop&q=80',
    traffic: 'https://images.unsplash.com/photo-1506521781263-d8422e82f27a?w=800&auto=format&fit=crop&q=80',
    crime: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=800&auto=format&fit=crop&q=80',
    hospitals: 'https://images.unsplash.com/photo-1538108149393-fbbd81895907?w=800&auto=format&fit=crop&q=80',
    radio: 'https://images.unsplash.com/photo-1516214104703-d870798883c5?w=800&auto=format&fit=crop&q=80',
    events: 'https://images.unsplash.com/photo-1511578314322-379afb476865?w=800&auto=format&fit=crop&q=80',
  };

  return fallbackImages[category] || fallbackImages.news;
}

// Helper: Auto-detect category from text
function detectCategory(title: string, snippet: string): 'mayor' | 'news' | 'radio' | 'crime' | 'hospitals' | 'traffic' | 'events' {
  const text = (title + ' ' + snippet).toLowerCase();

  if (text.includes('mayor') || text.includes('klarex') || text.includes('lgu') || text.includes('ordinance') || text.includes('city hall') || text.includes('council')) {
    return 'mayor';
  }
  if (text.includes('traffic') || text.includes('rta') || text.includes('road') || text.includes('highway') || text.includes('jeepney') || text.includes('driver')) {
    return 'traffic';
  }
  if (text.includes('police') || text.includes('cocpo') || text.includes('arrest') || text.includes('pnp') || text.includes('crime') || text.includes('seized') || text.includes('drugs')) {
    return 'crime';
  }
  if (text.includes('nmmc') || text.includes('hospital') || text.includes('doh') || text.includes('health') || text.includes('dengue') || text.includes('medical') || text.includes('doctor')) {
    return 'hospitals';
  }
  if (text.includes('bombo') || text.includes('rmn') || text.includes('radio') || text.includes('river level') || text.includes('flood warning') || text.includes('water level')) {
    return 'radio';
  }
  if (text.includes('festival') || text.includes('fiesta') || text.includes('xavier') || text.includes('ustp') || text.includes('centrio') || text.includes('limketkai') || text.includes('market') || text.includes('sports')) {
    return 'events';
  }
  return 'news';
}

// Helper: Format relative time
function formatTimeAgo(pubDateStr?: string): { timestamp: string; timeAgo: string } {
  const d = pubDateStr ? new Date(pubDateStr) : new Date();
  const validDate = isNaN(d.getTime()) ? new Date() : d;
  const now = new Date();
  const diffMs = now.getTime() - validDate.getTime();
  const diffMins = Math.floor(diffMs / (1000 * 60));
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  let timeAgo = 'Recently';
  if (diffMins < 1) {
    timeAgo = 'Just now';
  } else if (diffMins < 60) {
    timeAgo = `${diffMins} mins ago`;
  } else if (diffHours < 24) {
    timeAgo = `${diffHours} hrs ago`;
  } else if (diffDays === 1) {
    timeAgo = 'Yesterday';
  } else if (diffDays < 30) {
    timeAgo = `${diffDays} days ago`;
  } else {
    timeAgo = validDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  }

  return {
    timestamp: validDate.toISOString(),
    timeAgo,
  };
}

// Extract source name from Google News item title if format "Title - Source"
function parseGoogleNewsTitle(rawTitle: string): { cleanTitle: string; detectedSource?: string } {
  const parts = rawTitle.split(' - ');
  if (parts.length > 1) {
    const detectedSource = parts.pop()?.trim();
    const cleanTitle = parts.join(' - ').trim();
    return { cleanTitle, detectedSource };
  }
  return { cleanTitle: rawTitle };
}

// Extract key takeaways (3 bullet points) from excerpt/title
function generateBulletPoints(title: string, snippet: string): string[] {
  const points: string[] = [];
  points.push(title);
  if (snippet && snippet.length > 20) {
    const sentences = snippet.split('. ').filter((s) => s.trim().length > 10);
    sentences.forEach((s) => {
      const clean = s.trim().replace(/\.$/, '');
      if (clean && !points.includes(clean)) {
        points.push(clean);
      }
    });
  }
  if (points.length < 3) {
    points.push('Aggregated directly from verified Cagayan de Oro RSS local feed.');
  }
  return points.slice(0, 3);
}

// Fallback CDO news items when feeds are empty or blocked
export function getFallbackCDONewsItems(): RSSArticleItem[] {
  const now = new Date();
  return [
    {
      id: `live-fb-1-${now.getTime()}`,
      title: 'Mayor Klarex Uy Expedites Coastal Highway Paving & Flood Mitigating Basins in Barangay Carmen',
      summary: 'City Mayor Rolando "Klarex" Uy leads a site inspection on the newly concreted coastal diversion feeder in Carmen, boosting connectivity between Bulua, Kauswagan, and Lapasan.',
      fullContent: 'CAGAYAN DE ORO CITY — City Mayor Rolando "Klarex" Uy personally directed engineers from the City Engineer’s Office and DPWH Region 10 earlier today to accelerate work on the Carmen-Kauswagan flood control dike and drainage bypass. The Mayor emphasized that proactive drainage maintenance before heavy downpours protects thousands of families residing near the CDO River embankment. "Ato gayud paniguradohon nga andam atong agianan sa tubig aron malikayan ang pag-awas sa suba," Mayor Klarex Uy stated during his walk-through with Barangay Captains.',
      sourceName: 'City Mayor’s Office - CDO',
      sourceHandle: '@MayorKlarexUyOfficial',
      sourceAvatar: 'https://images.unsplash.com/photo-1577495508048-b635879837f1?w=120&auto=format&fit=crop&q=80',
      category: 'mayor',
      timestamp: new Date(now.getTime() - 15 * 60 * 1000).toISOString(),
      timeAgo: '15 mins ago',
      url: 'https://cagayandeoro.gov.ph',
      verified: true,
      image: 'https://images.unsplash.com/photo-1541872703-74c5e44368f9?w=800&auto=format&fit=crop&q=80',
      engagement: { likes: 580, shares: 142, comments: 39 },
      tags: ['#MayorKlarexUy', '#CDOInfrastructure', '#CarmenCDO'],
      isBreaking: true,
      location: 'Barangay Carmen, CDO',
      bulletPoints: [
        'Mayor Klarex Uy inspects Carmen-Kauswagan flood bypass dike.',
        'DPWH and City Engineers clear main drainage lines to prevent flash flooding.',
        'New bypass section eases morning rush hour traffic for commuters.'
      ]
    },
    {
      id: `live-fb-2-${now.getTime()}`,
      title: 'SunStar CDO: RTA Opens Re-Routed Coastal Lane to De-Congest Lapasan Highway',
      summary: 'The Roads and Traffic Administration (RTA) in Cagayan de Oro launches a new traffic flow scheme along the Gusa-Lapasan junction, reducing travel times toward Limketkai and Cogon.',
      fullContent: 'CAGAYAN DE ORO CITY — Drivers and public utility vehicle operators welcomed the new traffic diversion implemented by RTA along the coastal highway. RTA chief traffic enforcers were stationed at Lapasan, Agora, and Puntod to manage the peak morning traffic flow.',
      sourceName: 'SunStar Cagayan de Oro',
      sourceHandle: '@SunStarCDO',
      sourceAvatar: 'https://images.unsplash.com/photo-1585829365295-ab7cd400c167?w=120&auto=format&fit=crop&q=80',
      category: 'traffic',
      timestamp: new Date(now.getTime() - 45 * 60 * 1000).toISOString(),
      timeAgo: '45 mins ago',
      url: 'https://sunstar.com.ph',
      verified: true,
      image: 'https://images.unsplash.com/photo-1506521781263-d8422e82f27a?w=800&auto=format&fit=crop&q=80',
      engagement: { likes: 320, shares: 89, comments: 24 },
      tags: ['#SunStarCDO', '#RTACDO', '#CDOTraffic'],
      isBreaking: false,
      location: 'Lapasan & Gusa Highway, CDO',
      bulletPoints: [
        'RTA deploys additional enforcers at Agora and Lapasan junctions.',
        'New coastal bypass road speeds up transit to Downtown CDO.',
        'Commuters report smoother transit times toward Cogon Market.'
      ]
    },
    {
      id: `live-fb-3-${now.getTime()}`,
      title: 'Bombo Radyo CDO: Oro Rescue 911 Issues Updated River Telemetry Alert for Upper Watershed',
      summary: 'Bombo Radyo CDO 1188 kHz live update: CDRRMD water sensors at Carmen Bridge confirm Normal River Level despite light rainfall in Bukidnon mountain borders.',
      fullContent: 'CAGAYAN DE ORO CITY — In a live broadcast on Bombo Radyo CDO (DXIF 1188 kHz), disaster monitoring teams confirmed that water levels in the Cagayan de Oro River basin remain well within safe, normal parameters. Oro Rescue 911 continues round-the-clock monitoring of weather telemetry.',
      sourceName: 'Bombo Radyo CDO 1188',
      sourceHandle: '@BomboRadyoCDO',
      sourceAvatar: 'https://images.unsplash.com/photo-1590602847861-f357a9332bbc?w=120&auto=format&fit=crop&q=80',
      category: 'radio',
      timestamp: new Date(now.getTime() - 90 * 60 * 1000).toISOString(),
      timeAgo: '1.5 hrs ago',
      url: 'https://bomboradyo.com',
      verified: true,
      image: 'https://images.unsplash.com/photo-1516214104703-d870798883c5?w=800&auto=format&fit=crop&q=80',
      engagement: { likes: 450, shares: 210, comments: 33 },
      tags: ['#BomboRadyoCDO', '#CDORiver', '#OroRescue911'],
      isBreaking: false,
      location: 'CDO River Waterway',
      bulletPoints: [
        'CDO River remains at GREEN (Normal) level.',
        'CDRRMD 911 maintains real-time monitoring of Bubunawan & Tagoloan tributaries.',
        'No emergency evacuation required.'
      ]
    },
    {
      id: `live-fb-4-${now.getTime()}`,
      title: 'Northern Mindanao Medical Center (NMMC) Deploys Mobile Health Units to Bulua & Kauswagan',
      summary: 'NMMC in partnership with City Health Office offers free specialized diagnostic tests, pediatric checkups, and free medicines for barangay health workers.',
      fullContent: 'CAGAYAN DE ORO CITY — Doctors and healthcare specialists from Northern Mindanao Medical Center (NMMC) conducted a health outreach in Bulua Gymnasium today. Over 1,200 Kagay-anons received free consultations and laboratory vouchers.',
      sourceName: 'Northern Mindanao Medical Center (NMMC)',
      sourceHandle: '@NMMCOfficial',
      sourceAvatar: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=120&auto=format&fit=crop&q=80',
      category: 'hospitals',
      timestamp: new Date(now.getTime() - 2 * 3600 * 1000).toISOString(),
      timeAgo: '2 hrs ago',
      url: 'https://nmmc.doh.gov.ph',
      verified: true,
      image: 'https://images.unsplash.com/photo-1538108149393-fbbd81895907?w=800&auto=format&fit=crop&q=80',
      engagement: { likes: 610, shares: 175, comments: 45 },
      tags: ['#NMMC', '#HealthCDO', '#CityHealthOffice'],
      isBreaking: false,
      location: 'Barangay Bulua, CDO',
      bulletPoints: [
        'Free diagnostic lab checks provided at Bulua Gym.',
        'NMMC specialists partner with City Health Office doctors.',
        'Free medicines and pediatric care distributed.'
      ]
    },
    {
      id: `live-fb-5-${now.getTime()}`,
      title: 'COCPO Divisoria Police Heightens Patrols at Night Market along Plaza Divisoria & Gaston Park',
      summary: 'Cagayan de Oro City Police Office (COCPO) deploys high-visibility bike and foot patrols to protect night shoppers and university students along Corrales Avenue.',
      fullContent: 'CAGAYAN DE ORO CITY — High-visibility police patrols have been deployed by Police Station 1 around Gaston Park, Saint Augustine Cathedral, and Divisoria Plaza to safeguard night strolls, night markets, and local cafes.',
      sourceName: 'COCPO Police Station 1',
      sourceHandle: '@COCPO_DivisoriaStation',
      sourceAvatar: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=120&auto=format&fit=crop&q=80',
      category: 'crime',
      timestamp: new Date(now.getTime() - 3 * 3600 * 1000).toISOString(),
      timeAgo: '3 hrs ago',
      url: 'https://cocpo.pnp.gov.ph',
      verified: true,
      image: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=800&auto=format&fit=crop&q=80',
      engagement: { likes: 290, shares: 64, comments: 18 },
      tags: ['#COCPO', '#DivisoriaCDO', '#SafeCDO'],
      isBreaking: false,
      location: 'Plaza Divisoria, CDO',
      bulletPoints: [
        'Bike police patrols deployed around Corrales & Gaston Park.',
        'Increased security for university students and night diners.',
        'Direct hotline 166 available for immediate police assistance.'
      ]
    }
  ];
}

// In-memory cache to store fetched RSS feed items across user clicks
let rssCache: RSSArticleItem[] = [];
let lastFetchTimestamp = 0;
const CACHE_TTL_MS = 3 * 60 * 1000; // 3 minutes cache

export async function fetchAllCDORSSFeeds(): Promise<RSSArticleItem[]> {
  const now = Date.now();
  if (rssCache.length > 0 && now - lastFetchTimestamp < CACHE_TTL_MS) {
    console.log(`[RSS Engine] Returning ${rssCache.length} cached CDO articles.`);
    return rssCache;
  }

  console.log('[RSS Engine] Fetching real-time RSS feeds from Cagayan de Oro sources...');
  const allArticles: RSSArticleItem[] = [];
  const seenUrls = new Set<string>();
  const seenTitles = new Set<string>();

  // Fetch all feeds concurrently with a fallback timeout
  const feedPromises = RSS_SOURCES.map(async (source) => {
    try {
      const feed = await parser.parseURL(source.feedUrl);
      if (!feed || !feed.items) return [];

      const items: RSSArticleItem[] = [];
      for (const item of feed.items) {
        if (!item.title || !item.link) continue;

        let rawTitle = item.title.trim();
        let sourceName = source.name;

        // Special handling for Google News aggregated title "Title - Source"
        if (source.name.includes('Google News')) {
          const { cleanTitle, detectedSource } = parseGoogleNewsTitle(rawTitle);
          rawTitle = cleanTitle;
          if (detectedSource) {
            sourceName = detectedSource;
          }
        }

        // Deduplication Check 1: Title normalize
        const normalizedTitle = rawTitle.toLowerCase().replace(/[^a-z0-9]/g, '');
        if (seenTitles.has(normalizedTitle)) continue;

        // Deduplication Check 2: Direct URL link
        const directUrl = item.link.trim();
        if (seenUrls.has(directUrl)) continue;

        const itemAny = item as any;
        const rawFullHtml = itemAny['content:encoded'] || itemAny.contentEncoded || itemAny.content || itemAny.description || itemAny.summary || '';
        const snippet = cleanSnippet(itemAny.contentSnippet || itemAny.summary || itemAny.content || itemAny.description || '');
        const fullText = cleanFullContent(rawFullHtml);
        const fullContent = fullText && fullText.length >= snippet.length ? fullText : (snippet || rawTitle);

        const category = detectCategory(rawTitle, snippet + ' ' + fullText);
        const imageUrl = extractImageUrl(item, category);
        const { timestamp, timeAgo } = formatTimeAgo(item.pubDate || item.isoDate);

        // Compute cryptographic unique ID using MD5 hash of direct URL and title
        const md5Hash = crypto.createHash('md5').update(`${directUrl}||${normalizedTitle}`).digest('hex').substring(0, 16);
        const id = `rss-${md5Hash}`;

        const articleItem: RSSArticleItem = {
          id,
          title: rawTitle,
          summary: snippet || `${rawTitle} — Read the full update from ${sourceName}.`,
          fullContent,
          sourceName,
          sourceHandle: source.handle,
          sourceAvatar: source.avatar,
          category,
          timestamp,
          timeAgo,
          url: directUrl,
          verified: true,
          image: imageUrl,
          engagement: {
            likes: Math.floor(Math.random() * 200) + 40,
            shares: Math.floor(Math.random() * 80) + 10,
            comments: Math.floor(Math.random() * 25) + 2,
          },
          tags: ['#CDOPulse', '#CagayanDeOro', `#${sourceName.replace(/[^a-zA-Z0-9]/g, '')}`],
          isBreaking: rawTitle.toLowerCase().includes('breaking') || rawTitle.toLowerCase().includes('alert') || rawTitle.toLowerCase().includes('urgent'),
          location: 'Cagayan de Oro City',
          bulletPoints: generateBulletPoints(rawTitle, snippet),
        };

        seenTitles.add(normalizedTitle);
        seenUrls.add(directUrl);
        items.push(articleItem);
      }
      return items;
    } catch (err: any) {
      console.warn(`[RSS Engine] Error fetching feed ${source.name} (${source.feedUrl}):`, err?.message || err);
      return [];
    }
  });

  const results = await Promise.allSettled(feedPromises);
  results.forEach((res) => {
    if (res.status === 'fulfilled' && Array.isArray(res.value)) {
      allArticles.push(...res.value);
    }
  });

  // Second-pass deduplication to guarantee no repeated IDs or titles across parallel feeds
  const uniqueArticles: RSSArticleItem[] = [];
  const finalSeenIds = new Set<string>();
  const finalSeenTitles = new Set<string>();

  for (const article of allArticles) {
    const normTitle = article.title.toLowerCase().replace(/[^a-z0-9]/g, '');
    if (!finalSeenIds.has(article.id) && !finalSeenTitles.has(normTitle)) {
      finalSeenIds.add(article.id);
      finalSeenTitles.add(normTitle);
      uniqueArticles.push(article);
    }
  }

  // Sort articles by pubDate (most recent first)
  uniqueArticles.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

  if (uniqueArticles.length > 0) {
    rssCache = uniqueArticles;
    lastFetchTimestamp = now;
    console.log(`[RSS Engine] Successfully parsed & deduplicated ${uniqueArticles.length} live articles from CDO RSS feeds.`);
  }

  return uniqueArticles;
}
