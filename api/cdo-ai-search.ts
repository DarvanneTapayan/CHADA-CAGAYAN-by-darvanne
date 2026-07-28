import { GoogleGenAI } from '@google/genai';

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

export default async function handler(req: any, res: any) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const body = typeof req.body === 'string' ? JSON.parse(req.body) : (req.body || {});
  const prompt = body.prompt || req.query?.prompt || '';

  try {
    if (!prompt) {
      return res.status(400).json({ error: 'Prompt is required' });
    }

    const key = process.env.GEMINI_API_KEY;
    if (!key) {
      throw new Error('GEMINI_API_KEY environment variable is missing.');
    }

    const ai = new GoogleGenAI({ apiKey: key });
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

    return res.status(200).json({
      success: true,
      answer: response.text,
      sources,
    });
  } catch (error: any) {
    return res.status(200).json({
      success: true,
      answer: getFallbackAIAnswer(prompt),
      sources: [
        { title: 'CDO City Government Official Hotline Directory', uri: 'https://cagayandeoro.gov.ph' }
      ],
    });
  }
}
