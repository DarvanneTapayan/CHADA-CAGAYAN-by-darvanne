import { CategoryFilter, EmergencyContact, NewsItem, WeatherData } from '../types';

export const CATEGORIES: CategoryFilter[] = [
  {
    id: 'all',
    label: 'All Feeds',
    iconName: 'LayoutGrid',
    color: 'bg-emerald-600 text-white',
    badgeBg: 'bg-slate-100 text-slate-800 border-slate-300',
    description: 'Unified real-time feed across Cagayan de Oro City',
  },
  {
    id: 'mayor',
    label: 'Mayor & LGU',
    iconName: 'Building2',
    color: 'bg-blue-600 text-white',
    badgeBg: 'bg-blue-50 text-blue-700 border-blue-200',
    description: 'Mayor Rolando "Klarex" Uy, City Council & City Hall Executive Orders',
  },
  {
    id: 'news',
    label: 'News & Press',
    iconName: 'Newspaper',
    color: 'bg-amber-600 text-white',
    badgeBg: 'bg-amber-50 text-amber-800 border-amber-200',
    description: 'SunStar CDO, Mindanao Daily News, Gold Star Daily & PNA Region 10',
  },
  {
    id: 'radio',
    label: 'Radio Broadcasts',
    iconName: 'Radio',
    color: 'bg-purple-600 text-white',
    badgeBg: 'bg-purple-50 text-purple-700 border-purple-200',
    description: 'Bombo Radyo CDO, iFM 99.1, Magnum 99.9, Brigada News & RMN DXCC',
  },
  {
    id: 'crime',
    label: 'Crime & Safety',
    iconName: 'ShieldAlert',
    color: 'bg-rose-600 text-white',
    badgeBg: 'bg-rose-50 text-rose-700 border-rose-200',
    description: 'Cagayan de Oro City Police Office (COCPO) and Barangay Peacekeeping',
  },
  {
    id: 'hospitals',
    label: 'Health & Hospitals',
    iconName: 'Hospital',
    color: 'bg-teal-600 text-white',
    badgeBg: 'bg-teal-50 text-teal-700 border-teal-200',
    description: 'NMMC, City Health Office, Maria Reyna Hospital & Medical Advisories',
  },
  {
    id: 'traffic',
    label: 'Traffic & RTA',
    iconName: 'Car',
    color: 'bg-orange-600 text-white',
    badgeBg: 'bg-orange-50 text-orange-700 border-orange-200',
    description: 'Roads and Traffic Administration (RTA) CDO road closures and advisories',
  },
  {
    id: 'events',
    label: 'Events & Culture',
    iconName: 'Calendar',
    color: 'bg-indigo-600 text-white',
    badgeBg: 'bg-indigo-50 text-indigo-700 border-indigo-200',
    description: 'Higalaay Festival, Xavier University, Boulevard Night Market & Malls',
  },
];

export const MOCK_WEATHER: WeatherData = {
  tempCelsius: 31,
  condition: 'Partly Cloudy with Scattered Thunderstorms',
  humidityPercent: 78,
  cdoRiverStatus: 'Normal Level',
  heatIndex: '37°C (Caution)',
  lastUpdated: '10 mins ago',
};

export const EMERGENCY_CONTACTS: EmergencyContact[] = [
  {
    id: '1',
    name: 'Oro Rescue 911 / CDRRMD CDO',
    phone: '911 / (088) 857-4143 / 0917-704-5000',
    agency: 'City Disaster Risk Reduction & Management Dept',
    category: 'rescue',
    address: 'City Hall Complex, Cagayan de Oro City',
  },
  {
    id: '2',
    name: 'COCPO Police Hotline (Cagayan de Oro City Police)',
    phone: '166 / 0917-771-0063',
    agency: 'PNP Cagayan de Oro City Police Office',
    category: 'police',
    address: 'Camp Captain Vicente P. Roa, CDO',
  },
  {
    id: '3',
    name: 'Northern Mindanao Medical Center (NMMC)',
    phone: '(088) 856-4147 / (088) 856-5400',
    agency: 'Apex Public Hospital (NMMC)',
    category: 'hospital',
    address: 'Capitol Compound, Luna St, Cagayan de Oro City',
  },
  {
    id: '4',
    name: 'City Health Office (CHO) CDO',
    phone: '(088) 857-3183',
    agency: 'CDO City Health Office',
    category: 'health',
    address: 'Hayes Street, Cagayan de Oro City',
  },
  {
    id: '5',
    name: 'Roads and Traffic Administration (RTA)',
    phone: '0917-843-1628',
    agency: 'RTA Traffic Control Center',
    category: 'traffic',
    address: 'JR Borja Street, Cagayan de Oro City',
  },
];

export const INITIAL_NEWS_ITEMS: NewsItem[] = [
  {
    id: 'cdo-mayor-001',
    title: 'Mayor Klarex Uy Launches "Klarex sa Barangay" Free Medical and Legal Caravan in Barangay Carmen',
    summary: 'City Mayor Rolando "Klarex" Uy leads the weekly People’s Day Outreach Program at Carmen Gymnasium, providing free medical checkups, medicines, legal aid, and civil registry services to over 2,500 CDO residents.',
    fullContent: `CAGAYAN DE ORO CITY — City Mayor Rolando "Klarex" Uy personally supervised the expanded "Klarex sa Barangay" flagship program held earlier today at the Carmen Sports Complex.

The initiative brought together doctors from the City Health Office (CHO), volunteers from Northern Mindanao Medical Center (NMMC), and legal aides from the City Legal Office to serve over 2,500 residents from Upper and Lower Carmen.

Key services provided during the caravan included:
• Free medical consultations and essential medicine distribution
• Free rabies vaccination for household pets
• PhilHealth registration and social welfare assistance desk
• Mobile civil registrar consultations for birth certificate late registration
• Free haircut and livelihood starter kits for single parents

"Ato kining gi-paduol sa inyong barangay para dili na mo kinahanglan mag-pasahe padulong sa City Hall. Ang gobyerno ang moadto sa katawhan," Mayor Klarex Uy stated during his message.

The Mayor also inspected the ongoing drainage clearance operations along Zayas and Max Suniel St. to prevent localized flooding ahead of the rainy season.`,
    sourceName: 'City Mayor’s Office - CDO',
    sourceHandle: '@MayorKlarexUyOfficial',
    sourceAvatar: 'https://images.unsplash.com/photo-1577495508048-b635879837f1?w=120&auto=format&fit=crop&q=80',
    category: 'mayor',
    timestamp: new Date(Date.now() - 35 * 60 * 1000).toISOString(),
    timeAgo: '35 mins ago',
    url: 'https://cagayandeoro.gov.ph/news/klarex-sa-barangay-carmen',
    verified: true,
    image: 'https://images.unsplash.com/photo-1541872703-74c5e44368f9?w=800&auto=format&fit=crop&q=80',
    engagement: { likes: 1240, shares: 382, comments: 145 },
    tags: ['#MayorKlarexUy', '#CDOCityHall', '#BarangayCarmen', '#CDOPulse'],
    isBreaking: true,
    location: 'Barangay Carmen, CDO',
    bulletPoints: [
      'Over 2,500 residents received free healthcare and legal aid in Barangay Carmen.',
      'City Mayor Klarex Uy spearheaded the flagship service caravan.',
      'Inspected drainage projects along Max Suniel to mitigate urban flash flooding.',
    ],
  },
  {
    id: 'cdo-radio-001',
    title: 'Bombo Radyo CDO Report: PAGASA Issues Thunderstorm Advisory for Bukidnon & CDO River Watershed',
    summary: 'Bombo Radyo CDO 1188 kHz updates: Light to heavy rain expected in the headwaters of Bubunawan and Tagoloan rivers, prompting Oro Rescue 911 to monitor CDO River water levels closely.',
    fullContent: `CAGAYAN DE ORO CITY — In a live broadcast on Bombo Radyo CDO (DXIF 1188 kHz), the station reported an advisory from PAGASA-SABO Weather Station regarding localized thunderstorm activity across Bukidnon mountain ranges.

Because rainfall in the headwaters of Talakag and Baungon empties directly into the Cagayan de Oro River basin, CDRRMD - Oro Rescue 911 has elevated monitoring status at the Isla de Oro and Carmen Bridge telemetry sensors.

Current Status:
• CDO River Water Level: NORMAL (Green Level)
• Rain Intensity in Upper Watershed: Light to Moderate
• Advisory for Riverside Barangays: No evacuation needed, but residents in Barangay 1, Macasandig, Carmen, and Consolacion are advised to maintain standard vigilance.

Bombo Radyo CDO continues 24/7 coverage with live reports from field reporters stationed at JR Borja Bridge and Kauswagan Diversion Road.`,
    sourceName: 'Bombo Radyo CDO 1188',
    sourceHandle: '@BomboRadyoCDO',
    sourceAvatar: 'https://images.unsplash.com/photo-1590602847861-f357a9332bbc?w=120&auto=format&fit=crop&q=80',
    category: 'radio',
    timestamp: new Date(Date.now() - 1 * 3600 * 1000).toISOString(),
    timeAgo: '1 hr ago',
    url: 'https://bomboradyo.com/cagayandeoro/weather-alert-cdo-river',
    verified: true,
    image: 'https://images.unsplash.com/photo-1516214104703-d870798883c5?w=800&auto=format&fit=crop&q=80',
    engagement: { likes: 890, shares: 512, comments: 88 },
    tags: ['#BomboRadyoCDO', '#WeatherCDO', '#OroRescue911', '#CDORiver'],
    isBreaking: false,
    location: 'Cagayan de Oro River Basin',
    bulletPoints: [
      'PAGASA monitors rain activity over Bukidnon headwaters draining into CDO River.',
      'CDO River remains at Normal Level as reported by Oro Rescue 911.',
      'Riverside communities advised to stay tuned to local radio stations.',
    ],
  },
  {
    id: 'cdo-crime-001',
    title: 'COCPO Police Station 1 (Divisoria) Heightens Night Patrols Around Plaza Divisoria and Gaston Park',
    summary: 'Cagayan de Oro City Police Office (COCPO) deploys tourist police and bike units across Gaston Park, Divisoria Night Market, and Corrales Ave to ensure safety for evening diners and strollers.',
    fullContent: `CAGAYAN DE ORO CITY — Under the direction of City Police Director PBGEN, Police Station 1 (Divisoria) has intensified foot, mobile, and bicycle patrols around major public parks and nightlife hubs in Downtown CDO.

The initiative aims to curb petty theft, illegal parking extortion, and ensure public peace around:
• Plaza Divisoria (Magsaysay Park to Rizal Park)
• Gaston Park and St. Augustine Metropolitan Cathedral perimeter
• Corrales Avenue restaurant and coffee shop corridor
• JR Borja - Velez intersections

"We want Kagay-anons and visiting tourists to feel completely safe when taking night walks in Divisoria or enjoying local cafes along Corrales," Police Chief Captain stated in a press briefing.

Two mobile police outposts have been set up near the Andres Bonifacio monument to provide immediate assistance.`,
    sourceName: 'COCPO Police Station 1 - Divisoria',
    sourceHandle: '@COCPO_DivisoriaStation',
    sourceAvatar: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=120&auto=format&fit=crop&q=80',
    category: 'crime',
    timestamp: new Date(Date.now() - 2 * 3600 * 1000).toISOString(),
    timeAgo: '2 hrs ago',
    url: 'https://cocpo.pnp.gov.ph/divisoria-night-patrols',
    verified: true,
    image: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=800&auto=format&fit=crop&q=80',
    engagement: { likes: 620, shares: 140, comments: 42 },
    tags: ['#COCPO', '#DivisoriaCDO', '#SafeCDO', '#KagayanonSafety'],
    isBreaking: false,
    location: 'Plaza Divisoria & Corrales Ave, CDO',
    bulletPoints: [
      'COCPO Police Station 1 deploys bike patrols and mobile outposts in Divisoria.',
      'Enhanced presence around Gaston Park, St. Augustine Cathedral, and Corrales Ave.',
      'Aims to guarantee 24/7 security for nightlife diners and tourists.',
    ],
  },
  {
    id: 'cdo-hospitals-001',
    title: 'Northern Mindanao Medical Center (NMMC) Opens New Heart Center Wing & Specialized Pediatric ICU',
    summary: 'NMMC inaugurates state-of-the-art cardiovascular and pediatric intensive care units, reducing the need for Mindanao cardiac patients to travel to Manila for complex heart operations.',
    fullContent: `CAGAYAN DE ORO CITY — Northern Mindanao Medical Center (NMMC), the premier regional tertiary hospital in Region 10, officially blessed and opened its newly expanded Cardiovascular Center and 20-bed Pediatric Intensive Care Unit (PICU).

Hospital Director Dr. Jose Chan highlighted that the new facility features modern catheterization labs (Cath Lab) and specialized cardiac surgery suites capable of performing open-heart surgeries and pediatric cardiology interventions right here in Cagayan de Oro.

"This is a major milestone for healthcare in Northern Mindanao. Patients from Misamis Oriental, Bukidnon, Lanao del Norte, and Camiguin no longer need to fly to Manila for emergency cardiac catheterization," Dr. Chan announced.

The facility accepts PhilHealth Z-Benefit packages to ensure low-income patients receive full subspecialty care.`,
    sourceName: 'NMMC Official Advisory',
    sourceHandle: '@NMMCOfficialRegion10',
    sourceAvatar: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=120&auto=format&fit=crop&q=80',
    category: 'hospitals',
    timestamp: new Date(Date.now() - 3 * 3600 * 1000).toISOString(),
    timeAgo: '3 hrs ago',
    url: 'https://nmmc.doh.gov.ph/news/cardiovascular-center-launch',
    verified: true,
    image: 'https://images.unsplash.com/photo-1586773860418-d37222d8fce3?w=800&auto=format&fit=crop&q=80',
    engagement: { likes: 2150, shares: 980, comments: 210 },
    tags: ['#NMMCCDO', '#HealthcareCDO', '#Region10Health', '#NorthernMindanao'],
    isBreaking: false,
    location: 'NMMC Compound, Luna St., CDO',
    bulletPoints: [
      'NMMC unveils new Cardiovascular Center with Cath Lab and pediatric ICU.',
      'Saves Mindanao patients from needing costly medical travel to Manila.',
      'PhilHealth Z-Benefit coverage available for eligible cardiac surgeries.',
    ],
  },
  {
    id: 'cdo-traffic-001',
    title: 'RTA CDO Traffic Alert: Partial Lane Re-routing Along Lapasan Highway Near Agora Junction',
    summary: 'Roads and Traffic Administration (RTA) announces temporary counter-flow setup along National Highway Lapasan due to DPWH culvert installation and road widening near Puregold & Agora.',
    fullContent: `CAGAYAN DE ORO CITY — Traffic advisories issued by the Roads and Traffic Administration (RTA) advise motorists heading East towards Gusa/Cugman to expect slow-moving traffic along Lapasan Highway near the Agora Junction.

Details of the RTA Traffic Scheme:
• Affected Area: Lapasan National Highway (Eastbound lane in front of Market City)
• Cause: Department of Public Works and Highways (DPWH) drainage culvert construction
• Traffic Re-routing: Light vehicles heading to Lapasan or Cogon are advised to use Coastal Bypass Road via Puntod-Kauswagan Bridge or JR Borja Extension.
• Heavy Trucks: Restricted during peak hours (7:00 AM - 9:00 AM and 5:00 PM - 7:30 PM).

RTA traffic enforcers are deployed in 3 shifts to manage bottleneck junctions. Driver patience is highly encouraged.`,
    sourceName: 'Roads & Traffic Administration (RTA)',
    sourceHandle: '@RTACDOOfficial',
    sourceAvatar: 'https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?w=120&auto=format&fit=crop&q=80',
    category: 'traffic',
    timestamp: new Date(Date.now() - 4 * 3600 * 1000).toISOString(),
    timeAgo: '4 hrs ago',
    url: 'https://cagayandeoro.gov.ph/rta/lapasan-traffic-advisory',
    verified: true,
    image: 'https://images.unsplash.com/photo-1506521781263-d8422e82f27a?w=800&auto=format&fit=crop&q=80',
    engagement: { likes: 430, shares: 620, comments: 115 },
    tags: ['#RTACDO', '#TrafficCDO', '#LapasanHighway', '#CDORoads'],
    isBreaking: true,
    location: 'Lapasan Highway & Agora Junction, CDO',
    bulletPoints: [
      'DPWH drainage works cause temporary lane narrowing in Lapasan Highway.',
      'Motorists advised to utilize Coastal Bypass Road via Puntod Bridge.',
      'Heavy truck ban in effect during morning and evening rush hours.',
    ],
  },
  {
    id: 'cdo-news-001',
    title: 'Mindanao Daily News: CDO Port Cargo Volume Surges by 14% with Expansion of Container Terminal 2',
    summary: 'Port of Cagayan de Oro solidifies its rank as Northern Mindanao’s economic gateway as international container shipments and agricultural exports reach historic highs.',
    fullContent: `CAGAYAN DE ORO CITY — As reported in today's print and digital edition of Mindanao Daily News, the Philippine Ports Authority (PPA) Port Management Office of Misamis Oriental/Cagayan de Oro recorded a 14% growth in cargo throughput in the first half of the year.

Key Highlights:
• Increased export shipments of pineapple, banana, processed coconut, and local industrial goods to Japan, China, and North America.
• Completion of the 300-meter quay expansion at Macabalan Port Terminal.
• Modernized passenger terminal building welcoming cruise and inter-island ferry passengers from Cebu, Bohol, and Manila.

"Cagayan de Oro’s strategic geographic position makes it the logistics hub connecting Visayas and Mindanao," remarked PPA Regional Manager. Local business groups expect this growth to generate over 3,000 new maritime and warehousing jobs.`,
    sourceName: 'Mindanao Daily News CDO',
    sourceHandle: '@MindanaoDailyNews',
    sourceAvatar: 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=120&auto=format&fit=crop&q=80',
    category: 'news',
    timestamp: new Date(Date.now() - 5 * 3600 * 1000).toISOString(),
    timeAgo: '5 hrs ago',
    url: 'https://mindanaodailynews.com/cdo-port-cargo-growth-2026',
    verified: true,
    image: 'https://images.unsplash.com/photo-1578575437130-527eed3abbec?w=800&auto=format&fit=crop&q=80',
    engagement: { likes: 1120, shares: 310, comments: 64 },
    tags: ['#MindanaoDaily', '#CDOPort', '#Macabalan', '#CDOEconomy'],
    isBreaking: false,
    location: 'Macabalan Port, CDO',
    bulletPoints: [
      'PPA records 14% surge in Macabalan Container Terminal cargo volume.',
      'Boosted by agricultural exports from Misamis Oriental and Bukidnon.',
      'New job opportunities expected in logistics, warehousing, and port services.',
    ],
  },
  {
    id: 'cdo-events-001',
    title: 'Xavier University & Centrio Mall Announce "Kagay-an Youth Innovation & Cultural Expo 2026"',
    summary: 'Xavier University - Ateneo de Cagayan partners with Ayala Malls Centrio for a 3-day youth tech hackathon, Mindanao art fair, and local music festival celebrating Kagay-anon talent.',
    fullContent: `CAGAYAN DE ORO CITY — Xavier University - Ateneo de Cagayan, in partnership with Centrio Ayala Mall and the CDO ICT Council, officially launched the "Kagay-an Youth Innovation & Cultural Expo."

Event Calendar & Highlights:
• Day 1 (Friday): Mindanao Startup Hackathon & AI Showcase at Centrio Activity Center
• Day 2 (Saturday): Northern Mindanao Indigenous Art Fair & Local Craft Market
• Day 3 (Sunday): "Sound of CDO" Live Concert featuring local indie bands, XU Glee Club, and Kagay-anon spoken word artists

"We want to empower CDO’s vibrant youth, engineers, and creators to display world-class talent right here in our city," said the XU Student Affairs Director.

Admission is free to the public, with food stalls offering classic CDO delicacies like Pastel, Ham, and Oro coffee blends.`,
    sourceName: 'Xavier University - Ateneo de CDO',
    sourceHandle: '@XavierAteneoOfficial',
    sourceAvatar: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=120&auto=format&fit=crop&q=80',
    category: 'events',
    timestamp: new Date(Date.now() - 6 * 3600 * 1000).toISOString(),
    timeAgo: '6 hrs ago',
    url: 'https://xu.edu.ph/events/kagay-an-youth-expo-2026',
    verified: true,
    image: 'https://images.unsplash.com/photo-1511578314322-379afb476865?w=800&auto=format&fit=crop&q=80',
    engagement: { likes: 1840, shares: 740, comments: 180 },
    tags: ['#XavierAteneo', '#CentrioCDO', '#CDOEvents', '#HigalaayPrep'],
    isBreaking: false,
    location: 'Centrio Mall Activity Center, CDO',
    bulletPoints: [
      '3-day tech, art, and music festival organized by Xavier University & Centrio.',
      'Free admission showcasing local AI startups, indigenous art, and live bands.',
      'Features CDO culinary favorites and artisan coffee popup booths.',
    ],
  },
  {
    id: 'cdo-radio-002',
    title: 'Magnum Radio 99.9 Live Update: Uptown Lumbia - Pueblo de Oro Residential Water Pressure Advisory',
    summary: 'Magnum Radio CDO reports scheduled COWD (Cagayan de Oro Water District) pipe flushing along Masterson Avenue and Pueblo de Oro townships tonight.',
    fullContent: `CAGAYAN DE ORO CITY — In an early afternoon advisory monitored on Magnum Radio 99.9 FM, the Cagayan de Oro Water District (COWD) announced a maintenance window for Uptown CDO residents.

Details of Water Interruption:
• Affected Barangays: Lumbia, Canitoan, Upper Carmen, and Pueblo de Oro subdivisions.
• Time: 10:00 PM tonight to 4:00 AM tomorrow.
• Purpose: Valve replacement and main line pressure optimization to serve high-density housing developments in Uptown CDO.

Magnum Radio advised households in Uptown to store adequate water prior to 9:30 PM. Water tankers from Oro Rescue will be standby for emergency hospital requirements in Lumbia.`,
    sourceName: 'Magnum Radio 99.9 CDO',
    sourceHandle: '@MagnumRadio999CDO',
    sourceAvatar: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=120&auto=format&fit=crop&q=80',
    category: 'radio',
    timestamp: new Date(Date.now() - 7 * 3600 * 1000).toISOString(),
    timeAgo: '7 hrs ago',
    url: 'https://magnumradiocdo.ph/cowd-uptown-water-advisory',
    verified: true,
    image: 'https://images.unsplash.com/photo-1527689368864-3a821dbccc34?w=800&auto=format&fit=crop&q=80',
    engagement: { likes: 530, shares: 410, comments: 92 },
    tags: ['#MagnumRadio', '#COWD', '#UptownCDO', '#LumbiaCDO'],
    isBreaking: true,
    location: 'Masterson Ave & Uptown Lumbia, CDO',
    bulletPoints: [
      'COWD schedules maintenance flushing along Masterson Avenue tonight.',
      'Lumbia and Pueblo de Oro residents advised to store drinking water.',
      'Water pressure expected to fully normalize by 4:00 AM.',
    ],
  },
  {
    id: 'cdo-hospitals-002',
    title: 'City Health Office (CHO) CDO Launches Free Anti-Dengue Misting and Clean-Up Drive in 80 Barangays',
    summary: 'Dr. Rachel Dilla of City Health Office orders synchronized larviciding and misting in high-density barangays following recent intermittent monsoon rains.',
    fullContent: `CAGAYAN DE ORO CITY — In response to fluctuating weather patterns, the City Health Office (CHO) of Cagayan de Oro has mobilized sanitary inspectors across all 80 barangays for the "4S Anti-Dengue Campaign."

The 4S Strategy includes:
1. Search and destroy mosquito breeding sites
2. Self-protection measures
3. Seek early consultation at CHO Barangay Health Centers
4. Say YES to targeted fogging in outbreak hotspots

Barangays scheduled for misting this week include Lapasan, Bulua, Kauswagan, Carmen, and Gusa. Free Dengue NS1 rapid testing kits are stocked in all municipal health units.`,
    sourceName: 'City Health Office CDO',
    sourceHandle: '@CityHealthOfficeCDO',
    sourceAvatar: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=120&auto=format&fit=crop&q=80',
    category: 'hospitals',
    timestamp: new Date(Date.now() - 8 * 3600 * 1000).toISOString(),
    timeAgo: '8 hrs ago',
    url: 'https://cagayandeoro.gov.ph/cho/anti-dengue-drive-2026',
    verified: true,
    image: 'https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?w=800&auto=format&fit=crop&q=80',
    engagement: { likes: 980, shares: 640, comments: 55 },
    tags: ['#CHOCDO', '#DengueAlert', '#HealthyCDO', '#BarangayHealth'],
    isBreaking: false,
    location: 'All 80 Barangays, CDO',
    bulletPoints: [
      'City Health Office executes synchronized anti-dengue misting across 80 barangays.',
      'Free NS1 rapid diagnostic kits distributed to all local health centers.',
      'Urges Kagay-anons to eliminate stagnant water containers around homes.',
    ],
  },
];
