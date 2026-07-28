import { fetchAllCDORSSFeeds, getFallbackCDONewsItems } from '../server/rssFetcher.js';

export default async function handler(req: any, res: any) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    const body = typeof req.body === 'string' ? JSON.parse(req.body) : (req.body || {});
    const category = (body.category || req.query?.category || 'all') as string;
    const query = (body.query || req.query?.query || '') as string;

    let articles = await fetchAllCDORSSFeeds();
    if (!articles || articles.length === 0) {
      articles = getFallbackCDONewsItems();
    }

    if (category && category !== 'all') {
      articles = articles.filter((item) => item.category === category);
    }

    if (query && typeof query === 'string' && query.trim().length > 0) {
      const q = query.toLowerCase().trim();
      articles = articles.filter((item) =>
        item.title.toLowerCase().includes(q) ||
        item.summary.toLowerCase().includes(q) ||
        item.sourceName.toLowerCase().includes(q) ||
        (item.location && item.location.toLowerCase().includes(q))
      );
    }

    const sources = [
      { title: 'Mindanao Daily News Feed', uri: 'https://mindanaodailynews.com/feed/' },
      { title: 'Mindanao Gold Star Daily Feed', uri: 'https://goldstardailynews.com/feed/' },
      { title: 'SunStar Cagayan de Oro', uri: 'https://www.sunstar.com.ph' },
      { title: 'Philippine News Agency (PNA)', uri: 'https://www.pna.gov.ph/rss' },
      { title: 'Cagayan de Oro City Government Portal', uri: 'https://cagayandeoro.gov.ph' },
    ];

    return res.status(200).json({
      success: true,
      count: articles.length,
      news: articles,
      groundingSources: sources,
      fetchedAt: new Date().toISOString(),
    });
  } catch (error: any) {
    console.error('[CDO Pulse Vercel Error]:', error);
    return res.status(500).json({
      success: false,
      error: `[CDO Pulse Vercel Error] ${error?.message || String(error)}`,
    });
  }
}
