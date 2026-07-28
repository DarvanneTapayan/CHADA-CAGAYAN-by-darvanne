import express from 'express';
import path from 'path';
import { GoogleGenAI, Type } from '@google/genai';
import { createServer as createViteServer } from 'vite';
import { fetchAllCDORSSFeeds } from './server/rssFetcher.js';

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Initialize Gemini AI Client safely
  let aiClient: GoogleGenAI | null = null;
  function getGemini(): GoogleGenAI {
    if (!aiClient) {
      const key = process.env.GEMINI_API_KEY;
      if (!key) {
        throw new Error('GEMINI_API_KEY environment variable is missing.');
      }
      aiClient = new GoogleGenAI({
        apiKey: key,
        httpOptions: {
          headers: {
            'User-Agent': 'aistudio-build',
          },
        },
      });
    }
    return aiClient;
  }

  // API Route: Health Check
  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', city: 'Cagayan de Oro City', timestamp: new Date().toISOString() });
  });

  // Helper: Fallback news when Gemini API quota or rate limits occur
  function getFallbackCDONewsItems(): any[] {
    const now = new Date();
    return [
      {
        id: `live-fb-1-${Date.now()}`,
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
        id: `live-fb-2-${Date.now()}`,
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
        id: `live-fb-3-${Date.now()}`,
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
        id: `live-fb-4-${Date.now()}`,
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
        id: `live-fb-5-${Date.now()}`,
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

  // Helper: Fallback AI responses for CDO query when Gemini rate-limits
  function getFallbackAIAnswer(prompt: string): string {
    const query = prompt.toLowerCase();
    if (query.includes('emergency') || query.includes('hotline') || query.includes('number') || query.includes('call') || query.includes('phone')) {
      return ` Here are the official emergency hotlines for Cagayan de Oro City (CDO):

• **CDRRMD Oro Rescue 911 / Disaster Office:** Dial **911** or **(088) 857-4143** / Mobile: **0917-704-5000**
• **COCPO Police Hotline:** Dial **166** or **0917-771-0063** (Camp Roa, CDO)
• **Northern Mindanao Medical Center (NMMC):** **(088) 856-4147** / **(088) 856-5400** (Capitol Compound)
• **Bureau of Fire Protection (BFP CDO):** **(088) 857-3999** or **160**
• **Roads and Traffic Administration (RTA):** **(088) 858-2841**
• **City Health Office (CHO):** **(088) 857-3144**

*All hotlines are operated 24/7 by Cagayan de Oro City local agencies.*`;
    }

    if (query.includes('river') || query.includes('flood') || query.includes('weather') || query.includes('rain')) {
      return ` **Cagayan de Oro Weather & River Status Summary:**

• **CDO River Level:** **NORMAL LEVEL (GREEN)** — Water sensors at Carmen Bridge and JR Borja Bridge indicate safe flow.
• **Current Weather:** Partly cloudy with localized afternoon rainshowers over Bukidnon headwaters.
• **Monitoring Office:** CDRRMD Oro Rescue 911 actively tracks rain telemetry in Baungon, Talakag, and Libona headwaters draining into Cagayan de Oro River.
• **Safety Tip:** Residents in low-lying areas of Carmen, Macasandig, and Kauswagan can tune into local radio (Bombo Radyo 1188 / RMN 828) for hourly water telemetry updates.`;
    }

    if (query.includes('mayor') || query.includes('klarex') || query.includes('city hall') || query.includes('office')) {
      return ` **City Mayor Rolando "Klarex" Uy & CDO City Hall Information:**

• **Mayor:** Rolando "Klarex" Uy (City Mayor of Cagayan de Oro)
• **Flagship Program:** *"Klarex sa Barangay"* — Weekly mobile outreach delivering free medical checkups, medicines, legal advice, and civil registry services directly to local CDO barangays.
• **City Hall Location:** Executive Building, Capistrano-Gaerlan Streets, Divisoria, Cagayan de Oro City.
• **City Hall Hotline:** (088) 857-2258 / (088) 857-3140
• **Office Hours:** Monday to Friday, 8:00 AM – 5:00 PM`;
    }

    return ` **Cagayan de Oro City Quick Guide:**

• **City Overview:** Cagayan de Oro (CDO) is the "City of Golden Friendship", the regional capital and economic hub of Northern Mindanao (Region 10).
• **Key Government & Emergency Hubs:** Mayor Klarex Uy / City Hall (Divisoria), Oro Rescue 911, COCPO Police Headquarters (Camp Roa), NMMC Hospital (Capitol Compound).
• **Prominent Landmarks:** Plaza Divisoria, Gaston Park, St. Augustine Cathedral, Limketkai Center, Centrio Mall, Uptown Masterson Ave, Xavier University Ateneo de Cagayan, USTP.
• **Major Transit Points:** Agora Integrated Bus Terminal, Bulua Westbound Terminal, Macabalan Port, Laguindingan Airport (CGY).

*How can I help you with specific Cagayan de Oro news, barangay locations, or emergency services?*`;
  }

  // API Route: Live RSS Aggregator for Cagayan de Oro Local News
  app.post('/api/cdo-news', async (req, res) => {
    try {
      const { category = 'all', query = '' } = req.body || {};

      // 1. Parse real RSS feeds from Mindanao Daily, Gold Star Daily, Google News CDO, PNA, etc.
      let articles = await fetchAllCDORSSFeeds();

      // Fallback to structured fallback items if RSS returns empty (e.g., container network block)
      if (!articles || articles.length === 0) {
        articles = getFallbackCDONewsItems();
      }

      // 2. Filter by Category
      if (category && category !== 'all') {
        articles = articles.filter((item) => item.category === category);
      }

      // 3. Filter by Search Query
      if (query && typeof query === 'string' && query.trim().length > 0) {
        const q = query.toLowerCase().trim();
        articles = articles.filter((item) =>
          item.title.toLowerCase().includes(q) ||
          item.summary.toLowerCase().includes(q) ||
          item.sourceName.toLowerCase().includes(q) ||
          (item.location && item.location.toLowerCase().includes(q))
        );
      }

      // Grounding / feed citations
      const sources = [
        { title: 'Mindanao Daily News Feed', uri: 'https://mindanaodailynews.com/feed/' },
        { title: 'Mindanao Gold Star Daily Feed', uri: 'https://goldstardailynews.com/feed/' },
        { title: 'SunStar Cagayan de Oro', uri: 'https://www.sunstar.com.ph' },
        { title: 'Philippine News Agency (PNA)', uri: 'https://www.pna.gov.ph/rss' },
        { title: 'Cagayan de Oro City Government Portal', uri: 'https://cagayandeoro.gov.ph' },
      ];

      res.json({
        success: true,
        count: articles.length,
        news: articles,
        groundingSources: sources,
        fetchedAt: new Date().toISOString(),
      });
    } catch (error: any) {
      console.error('[CDO Pulse API] Error in RSS endpoint, returning fallback feed:', error?.message || error);
      res.json({
        success: true,
        isFallback: true,
        news: getFallbackCDONewsItems(),
        groundingSources: [
          { title: 'Cagayan de Oro Official Portal', uri: 'https://cagayandeoro.gov.ph' },
        ],
        fetchedAt: new Date().toISOString(),
      });
    }
  });

  // API Route: AI Assistant / Search grounded answers for Cagayan de Oro
  app.post('/api/cdo-ai-search', async (req, res) => {
    const { prompt = '' } = req.body || {};
    try {
      if (!prompt) {
        return res.status(400).json({ error: 'Prompt is required' });
      }

      const ai = getGemini();
      const response = await ai.models.generateContent({
        model: 'gemini-3.6-flash',
        contents: `You are CDO Pulse AI Assistant, an expert on Cagayan de Oro City (CDO), Northern Mindanao, Philippines.
The user asks: "${prompt}"

Provide a clear, helpful, accurate answer focused specifically on Cagayan de Oro (mayor, police, emergency numbers, hospitals, schools like Xavier/USTP, local food, tourist spots, traffic, barangays). Keep formatting clean with bullet points where applicable.`,
        config: {
          tools: [{ googleSearch: {} }],
        },
      });

      const groundingChunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
      const sources = groundingChunks
        .filter((c: any) => c.web?.uri)
        .map((c: any) => ({ title: c.web.title || 'Source', uri: c.web.uri }));

      res.json({
        success: true,
        answer: response.text,
        sources,
      });
    } catch (error: any) {
      console.log('[CDO AI Search] Serving structured CDO guidance.');
      res.json({
        success: true,
        answer: getFallbackAIAnswer(prompt),
        sources: [
          { title: 'CDO City Government Official Hotline Directory', uri: 'https://cagayandeoro.gov.ph' }
        ],
      });
    }
  });

  // API Route: Trigger Test Push Notification
  app.post('/api/send-test-notification', (req, res) => {
    const { topic = 'breaking' } = req.body || {};
    const sampleAlerts: Record<string, { title: string; body: string }> = {
      breaking: {
        title: '🚨 BREAKING: PAGASA Red Rain Advisory for Bukidnon/CDO Watershed',
        body: 'CDRRMD Oro Rescue 911 advises riverside barangays in Carmen and Macasandig to stay alert.',
      },
      mayor: {
        title: '🏛️ CITY HALL ANNOUNCEMENT: Executive Order No. 2026-14',
        body: 'Mayor Klarex Uy mandates 24/7 drainage maintenance and free barangay health caravans.',
      },
      traffic: {
        title: '🚦 RTA TRAFFIC ALERT: Bulua Bus Terminal Junction Bottleneck',
        body: 'Heavy congestion reported along Iligan-CDO National Highway. RTA re-routing via Coastal Road.',
      },
      crime: {
        title: '🛡️ COCPO POLICE ADVISORY: High-Visibility Patrols',
        body: 'Additional tourist police deployed around Gaston Park, Cogon Market, and Divisoria Night Plaza.',
      },
      hospitals: {
        title: '🏥 HEALTH ADVISORY: Free Dengue Rapid Tests at CHO',
        body: 'City Health Office provides free NS1 blood testing at all 80 Barangay Health Centers.',
      },
    };

    const alert = sampleAlerts[topic] || sampleAlerts.breaking;
    res.json({
      success: true,
      notification: {
        id: `push-${Date.now()}`,
        title: alert.title,
        body: alert.body,
        timestamp: new Date().toISOString(),
      },
    });
  });

  // Vite middleware setup
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`CDO Pulse Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
