import Parser from 'rss-parser';

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

// Helper: Clean HTML tags and retrieve 1-2 sentence excerpt
function cleanSnippet(htmlOrText: string): string {
  if (!htmlOrText) return '';
  // Strip HTML tags
  let cleaned = htmlOrText.replace(/<[^>]+>/g, ' ');
  // Replace multiple spaces/newlines
  cleaned = cleaned.replace(/\s+/g, ' ').trim();
  // Decode HTML entities
  cleaned = cleaned
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#039;/g, "'")
    .replace(/&nbsp;/g, ' ');

  // Take first 2 sentences max or 220 chars
  const sentences = cleaned.match(/[^.!?]+[.!?]+/g);
  if (sentences && sentences.length >= 2) {
    cleaned = sentences.slice(0, 2).join(' ');
  } else if (cleaned.length > 220) {
    cleaned = cleaned.substring(0, 217) + '...';
  }
  return cleaned;
}

// Helper: Extract full article text from HTML content or feed
function extractFullArticleText(item: any): string {
  const rawHtml = item['content:encoded'] || item.contentEncoded || item.content || item.description || item.summary || '';
  if (!rawHtml) return item.title || '';

  // Preserve paragraph breaks and line endings
  let text = rawHtml
    .replace(/<br\s*[\/]?>/gi, '\n')
    .replace(/<\/p>/gi, '\n\n')
    .replace(/<\/div>/gi, '\n')
    .replace(/<\/li>/gi, '\n')
    .replace(/<[^>]+>/g, '') // strip remaining HTML tags
    .replace(/\n\s*\n\s*\n+/g, '\n\n') // normalize multi-newlines
    .trim();

  // Decode common HTML entities
  text = text
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#039;/g, "'")
    .replace(/&nbsp;/g, ' ')
    .replace(/&mdash;/g, '—')
    .replace(/&ndash;/g, '–');

  return text.length > 30 ? text : (item.title || '');
}

// Helper: Scrape full web page for full article body and actual og:image
async function fetchFullPageContentAndImage(url: string): Promise<{ fullText?: string; ogImage?: string }> {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 3500);

    const res = await fetch(url, {
      signal: controller.signal,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
      },
    });
    clearTimeout(timeoutId);

    if (!res.ok) return {};
    const html = await res.text();

    // Extract og:image or twitter:image
    let ogImage: string | undefined;
    const ogMatch = html.match(/<meta[^>]+property=["']og:image["'][^>]+content=["']([^"']+)["']/i) ||
                    html.match(/<meta[^>]+content=["']([^"']+)["'][^>]+property=["']og:image["']/i) ||
                    html.match(/<meta[^>]+name=["']twitter:image["'][^>]+content=["']([^"']+)["']/i);
    if (ogMatch && ogMatch[1] && ogMatch[1].startsWith('http')) {
      ogImage = ogMatch[1];
    }

    // Clean html for body text
    const cleanHtml = html
      .replace(/<script[\s\S]*?<\/script>/gi, '')
      .replace(/<style[\s\S]*?<\/style>/gi, '')
      .replace(/<header[\s\S]*?<\/header>/gi, '')
      .replace(/<footer[\s\S]*?<\/footer>/gi, '')
      .replace(/<nav[\s\S]*?<\/nav>/gi, '');

    const pMatches = cleanHtml.match(/<p[^>]*>([\s\S]*?)<\/p>/gi);
    if (pMatches && pMatches.length > 0) {
      const paragraphs = pMatches
        .map(p => p.replace(/<[^>]+>/g, '').trim())
        .filter(p => p.length > 40 && !p.toLowerCase().includes('cookie') && !p.toLowerCase().includes('copyright') && !p.toLowerCase().includes('all rights reserved') && !p.toLowerCase().includes('privacy policy'));

      if (paragraphs.length > 0) {
        const fullText = paragraphs.join('\n\n');
        return { fullText, ogImage };
      }
    }
    return { ogImage };
  } catch (err) {
    return {};
  }
}

// Helper: Extract image URL from feed item
function extractImageUrl(item: any, category: string, webOgImage?: string): string {
  if (webOgImage && webOgImage.startsWith('http')) {
    return webOgImage;
  }
  // 1. Check enclosure
  if (item.enclosure?.url && (item.enclosure.url.includes('.jpg') || item.enclosure.url.includes('.png') || item.enclosure.url.includes('.jpeg') || item.enclosure.url.includes('.webp'))) {
    return item.enclosure.url;
  }
  // 2. Check media:content / media:thumbnail
  if (item.mediaContent?.$?.url) return item.mediaContent.$.url;
  if (item.mediaThumbnail?.$?.url) return item.mediaThumbnail.$.url;

  // 3. Regex search for <img src="..."> in HTML content
  const htmlContent = item.contentEncoded || item['content:encoded'] || item.content || item.description || '';
  const imgMatches = htmlContent.match(/<img[^>]+src=["']([^"']+)["']/gi);
  if (imgMatches) {
    for (const imgTag of imgMatches) {
      const srcMatch = imgTag.match(/src=["']([^"']+)["']/i);
      if (srcMatch && srcMatch[1]) {
        const url = srcMatch[1];
        if (!url.includes('gravatar') && !url.includes('feedburner') && !url.includes('tracker') && !url.includes('pixel') && !url.endsWith('.gif')) {
          return url;
        }
      }
    }
  }

  // 4. Default high-res thematic Unsplash image based on category
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
        const snippet = cleanSnippet(itemAny.contentSnippet || itemAny.summary || itemAny.content || itemAny.description || '');
        let fullArticleText = extractFullArticleText(itemAny);
        const category = detectCategory(rawTitle, snippet + ' ' + fullArticleText);
        let imageUrl = extractImageUrl(item, category);
        const { timestamp, timeAgo } = formatTimeAgo(item.pubDate || item.isoDate);

        // Compute unique ID using full normalized title hash and URL hash
        const urlHash = Buffer.from(directUrl).toString('hex').slice(-10);
        const titleHash = Buffer.from(normalizedTitle).toString('hex').slice(-8);
        const id = `rss-${titleHash}-${urlHash}`;

        // If RSS feed provided only short text (<250 chars) or no image, attempt web page scrape
        if ((fullArticleText.length < 250 || imageUrl.includes('unsplash.com')) && directUrl.startsWith('http')) {
          const webData = await fetchFullPageContentAndImage(directUrl);
          if (webData.fullText && webData.fullText.length > fullArticleText.length) {
            fullArticleText = webData.fullText;
          }
          if (webData.ogImage) {
            imageUrl = webData.ogImage;
          }
        }

        const articleItem: RSSArticleItem = {
          id,
          title: rawTitle,
          summary: snippet || `${rawTitle} — Read the full update from ${sourceName}.`,
          fullContent: fullArticleText || snippet || rawTitle,
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
          bulletPoints: generateBulletPoints(rawTitle, fullArticleText || snippet),
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

  // Sort articles by pubDate (most recent first)
  allArticles.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

  if (allArticles.length > 0) {
    rssCache = allArticles;
    lastFetchTimestamp = now;
    console.log(`[RSS Engine] Successfully parsed & deduplicated ${allArticles.length} live articles from CDO RSS feeds.`);
  }

  return allArticles;
}
