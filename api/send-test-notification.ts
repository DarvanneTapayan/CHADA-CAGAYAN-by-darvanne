export default function handler(req: any, res: any) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const body = typeof req.body === 'string' ? JSON.parse(req.body) : (req.body || {});
  const topic = body.topic || req.query?.topic || 'breaking';

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
  return res.status(200).json({
    success: true,
    notification: {
      id: `push-${Date.now()}`,
      title: alert.title,
      body: alert.body,
      timestamp: new Date().toISOString(),
    },
  });
}
