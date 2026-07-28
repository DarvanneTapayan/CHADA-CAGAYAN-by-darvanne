import express from 'express';
import path from 'path';
import { GoogleGenAI, Type } from '@google/genai';
import { createServer as createViteServer } from 'vite';

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

  // API Route: Fetch Live Real-Time CDO News Grounded in Web Search
  app.post('/api/cdo-news', async (req, res) => {
    try {
      const { category = 'all', query = '' } = req.body || {};
      const ai = getGemini();
      const currentDateStr = new Date().toISOString().split('T')[0];

      const searchPrompt = `Search for the latest, real-time news, mayor advisories, police/crime updates, radio broadcasts, traffic reports, and hospital/health news in Cagayan de Oro City (CDO), Mindanao, Philippines for today (${currentDateStr}) or recent days in 2026.
Category requested: "${category}". User search term: "${query}".

Search real news outlets and local Cagayan de Oro sources such as:
- SunStar Cagayan de Oro (sunstar.com.ph)
- Mindanao Daily News CDO (mindanaodailynews.com)
- Gold Star Daily (goldstardailynews.com)
- Philippine News Agency (PNA) Region 10
- Mayor Klarex Uy / CDO City Hall Official updates (cagayandeoro.gov.ph)
- Bombo Radyo CDO (DXIF 1188 kHz)
- RMN CDO (DXCC 828 kHz)
- iFM 99.1 CDO / Magnum Radio 99.9
- Roads and Traffic Administration (RTA CDO)
- Northern Mindanao Medical Center (NMMC)

Extract 6 to 8 fresh, distinct, authentic Cagayan de Oro local news articles or advisories based on current real-world web search data for 2026.

All items must have realistic recent dates/times (e.g., within hours or today).

Return ONLY a JSON array of news objects with no wrapping text outside the JSON array:
[
  {
    "id": "cdo-live-1",
    "title": "Headline string",
    "summary": "Short 2-sentence summary",
    "fullContent": "Full article paragraph text with specific local CDO details, barangays (e.g. Carmen, Lapasan, Bulua, Kauswagan, Lumbia, Divisoria, Bugo, Tablon), streets, or official names.",
    "sourceName": "Name of official CDO source",
    "sourceHandle": "@handle",
    "sourceAvatar": "https://images.unsplash.com/photo-1577495508048-b635879837f1?w=120&auto=format&fit=crop&q=80",
    "category": "one of: mayor, news, radio, crime, hospitals, traffic, events",
    "timestamp": "${new Date().toISOString()}",
    "timeAgo": "e.g. 20 mins ago",
    "url": "https://cagayandeoro.gov.ph or real source link",
    "verified": true,
    "image": "https://images.unsplash.com/photo-1541872703-74c5e44368f9?w=800&auto=format&fit=crop&q=80",
    "engagement": { "likes": 340, "shares": 112, "comments": 28 },
    "tags": ["#CDOPulse", "#CagayanDeOro"],
    "isBreaking": false,
    "location": "Barangay or landmark in CDO",
    "bulletPoints": ["Key takeaway 1", "Key takeaway 2", "Key takeaway 3"]
  }
]`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.6-flash',
        contents: searchPrompt,
        config: {
          tools: [{ googleSearch: {} }],
          systemInstruction: 'You are an accurate, real-time local news aggregator system for Cagayan de Oro City (CDO), Northern Mindanao, Philippines. Always search for real news from 2026 and format your answer strictly as a JSON array.',
        },
      });

      const text = response.text || '[]';
      let parsedNews = [];
      try {
        parsedNews = JSON.parse(text);
      } catch (parseErr) {
        console.warn('Attempting robust JSON array extraction from Gemini output...');
        const startIdx = text.indexOf('[');
        const endIdx = text.lastIndexOf(']');
        if (startIdx !== -1 && endIdx !== -1 && endIdx > startIdx) {
          const jsonSub = text.substring(startIdx, endIdx + 1);
          parsedNews = JSON.parse(jsonSub);
        } else {
          const cleaned = text.replace(/```json/g, '').replace(/```/g, '').trim();
          parsedNews = JSON.parse(cleaned);
        }
      }

      // Grounding sources
      const groundingChunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
      const sources = groundingChunks
        .filter((c: any) => c.web?.uri)
        .map((c: any) => ({ title: c.web.title || 'Web Source', uri: c.web.uri }));

      res.json({
        success: true,
        news: parsedNews,
        groundingSources: sources,
        fetchedAt: new Date().toISOString(),
      });
    } catch (error: any) {
      console.error('Error fetching CDO live news via Gemini:', error);
      res.status(500).json({
        success: false,
        error: error.message || 'Failed to fetch live CDO news stream',
      });
    }
  });

  // API Route: AI Assistant / Search grounded answers for Cagayan de Oro
  app.post('/api/cdo-ai-search', async (req, res) => {
    try {
      const { prompt } = req.body || {};
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
      console.error('Error in CDO AI Search:', error);
      res.status(500).json({
        success: false,
        error: error.message || 'Failed to answer query',
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
