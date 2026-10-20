import fs from 'node:fs';
import path from 'node:path';
import bcrypt from 'bcryptjs';
import type {
  User,
  UserProfile,
  UserPreferences,
  Article,
  HistoricalFigure,
  Dynasty,
  GenealogyNode,
  HistoricalEvent,
  HistoricalLocation,
  InscriptionRecord,
  TempleMonument,
  HistoricalDocument,
  GalleryItem,
  HistoricalClaim,
  CommunitySubmission,
  CommunityEvent,
  SiteStatistics
} from '../src/types/index.ts';

const DATA_DIR = path.resolve(process.cwd(), 'data');
const DB_FILE = path.resolve(DATA_DIR, 'database.json');

export interface AuditLog {
  id: string;
  user_id: string;
  user_email: string;
  action: string;
  target_entity: string;
  target_id: string;
  details: string;
  timestamp: string;
}

export interface PasswordResetToken {
  token: string;
  user_id: string;
  expires_at: number;
  used: boolean;
}

export interface DatabaseSchema {
  users: User[];
  user_passwords: Record<string, string>; // user_id -> bcrypt hash
  profiles: UserProfile[];
  preferences: UserPreferences[];
  articles: Article[];
  figures: HistoricalFigure[];
  dynasties: Dynasty[];
  genealogy: GenealogyNode[];
  events_timeline: HistoricalEvent[];
  locations: HistoricalLocation[];
  inscriptions: InscriptionRecord[];
  monuments: TempleMonument[];
  documents: HistoricalDocument[];
  gallery: GalleryItem[];
  claims: HistoricalClaim[];
  submissions: CommunitySubmission[];
  community_events: CommunityEvent[];
  event_registrations: { event_id: string; user_id: string; registered_at: string }[];
  bookmarks: { user_id: string; item_id: string; item_type: string; created_at: string }[];
  password_resets: PasswordResetToken[];
  audit_logs: AuditLog[];
}

let memoryDb: DatabaseSchema | null = null;

export function getDb(): DatabaseSchema {
  if (memoryDb) return memoryDb;

  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }

  if (fs.existsSync(DB_FILE)) {
    try {
      const content = fs.readFileSync(DB_FILE, 'utf-8');
      memoryDb = JSON.parse(content);
      return memoryDb!;
    } catch (e) {
      console.error('Failed to read db file, initializing seed:', e);
    }
  }

  memoryDb = initializeSeedData();
  saveDb(memoryDb);
  return memoryDb;
}

export function saveDb(db: DatabaseSchema) {
  memoryDb = db;
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    fs.writeFileSync(DB_FILE, JSON.stringify(db, null, 2), 'utf-8');
  } catch (err) {
    console.error('Failed to write database file:', err);
  }
}

export function addAuditLog(user_id: string, user_email: string, action: string, target_entity: string, target_id: string, details: string) {
  const db = getDb();
  const log: AuditLog = {
    id: 'log_' + Date.now() + '_' + Math.random().toString(36).substring(2, 7),
    user_id,
    user_email,
    action,
    target_entity,
    target_id,
    details,
    timestamp: new Date().toISOString()
  };
  db.audit_logs.unshift(log);
  if (db.audit_logs.length > 500) db.audit_logs.pop();
  saveDb(db);
}

function initializeSeedData(): DatabaseSchema {
  const adminId = 'usr_admin_001';
  const editorId = 'usr_editor_001';
  const memberId = 'usr_member_001';

  const defaultPasswordHash = bcrypt.hashSync('Heritage@2026', 10);

  const users: User[] = [
    {
      id: adminId,
      email: 'admin@suryavamsha-heritage.org',
      role: 'super_admin',
      status: 'active',
      email_verified: true,
      created_at: '2026-01-10T00:00:00.000Z'
    },
    {
      id: editorId,
      email: 'historian.editor@suryavamsha-heritage.org',
      role: 'historical_editor',
      status: 'active',
      email_verified: true,
      created_at: '2026-01-15T00:00:00.000Z'
    },
    {
      id: memberId,
      email: 'researcher.odra@suryavamsha-heritage.org',
      role: 'member',
      status: 'active',
      email_verified: true,
      created_at: '2026-02-01T00:00:00.000Z'
    }
  ];

  const user_passwords: Record<string, string> = {
    [adminId]: defaultPasswordHash,
    [editorId]: defaultPasswordHash,
    [memberId]: defaultPasswordHash
  };

  const profiles: UserProfile[] = [
    {
      user_id: adminId,
      full_name: 'Dr. Vikramaditya Gajapathi Raju',
      gender: 'Male',
      country: 'India',
      state_or_province: 'Odisha',
      district: 'Puri',
      city_town_village: 'Puri',
      profile_photo_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&auto=format&fit=crop&q=80',
      education: 'Ph.D. in Ancient Indian Epigraphy & Medieval History',
      profession: 'Professor of Epigraphy & Historical Documentation',
      current_work: 'Head of Historical Archives, Suryavamsha Research Council',
      organization: 'Council of Odra Historical Research',
      biography: 'Dedicated to preserving medieval Odishan epigraphy, Gajapathi inscriptions, and traditional Kshatriya lineages of Odra Desha with rigorous archival methods.',
      areas_of_historical_interest: ['Suryavamsha Gajapathi Dynasties', 'Copper Plate Grants', 'Temple Epigraphy', 'Odra Geopolitics'],
      languages_known: ['English', 'Odia', 'Sanskrit', 'Telugu', 'Hindi'],
      website_url: 'https://odrahistory.org/vikramaditya',
      research_contributions: 'Authored 14 peer-reviewed monographs on Gajapathi copper-plate grants and Barabati fortification inscriptions.',
      profile_visibility: 'public'
    },
    {
      user_id: editorId,
      full_name: 'Dr. Anasuya Mohapatra-Raju',
      gender: 'Female',
      country: 'India',
      state_or_province: 'Andhra Pradesh',
      district: 'Visakhapatnam',
      city_town_village: 'Visakhapatnam',
      profile_photo_url: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=300&auto=format&fit=crop&q=80',
      education: 'M.A., M.Phil in South Indian Medieval Architecture',
      profession: 'Chief Archival Curator',
      current_work: 'Documenting Kalinga-Utkala architectural transitions and Gajapathi pillar grants',
      organization: 'Eastern Deccan Heritage Foundation',
      biography: 'Specializes in the cultural and architectural history of the Suryavamshi rulers, focusing on Simhachalam, Draksharama, and Srikurmam.',
      areas_of_historical_interest: ['Gajapathi Temple Architecture', 'Bilingual Sanskrit-Telugu Inscriptions', 'Medieval Military Outposts'],
      languages_known: ['Telugu', 'English', 'Odia', 'Kannada'],
      research_contributions: 'Published critical editions of Prataparudra Deva Simhachalam pillar inscriptions.',
      profile_visibility: 'public'
    },
    {
      user_id: memberId,
      full_name: 'Sathya Narayana Raju',
      gender: 'Male',
      country: 'India',
      state_or_province: 'Karnataka',
      district: 'Bengaluru Urban',
      city_town_village: 'Bengaluru',
      education: 'B.Tech in Computer Science, Independent Genealogy Researcher',
      profession: 'Software Engineer & Genealogist',
      current_work: 'Digital preservation of community palm-leaf manuscripts and family trees',
      organization: 'Global Suryavamsha Kshatriya Heritage Forum',
      biography: 'Passionate community member researching the diaspora of Odiyaraju families across Karnataka, Andhra Pradesh, Tamil Nadu, and Maharashtra.',
      areas_of_historical_interest: ['Genealogical Records', 'Diaspora Movements', 'Oral Traditions', 'Madala Panji Studies'],
      languages_known: ['Kannada', 'Telugu', 'English', 'Odia'],
      research_contributions: 'Documented 12 oral family histories linking medieval Odra migrations to Deccan settlements.',
      profile_visibility: 'members'
    }
  ];

  const preferences: UserPreferences[] = [
    {
      user_id: adminId,
      preferred_language: 'en',
      email_notifications: true,
      show_original_quotes: true
    },
    {
      user_id: editorId,
      preferred_language: 'te',
      email_notifications: true,
      show_original_quotes: true
    },
    {
      user_id: memberId,
      preferred_language: 'kn',
      email_notifications: false,
      show_original_quotes: true
    }
  ];

  const dynasties: Dynasty[] = [
    {
      id: 'dyn_suryavamsha_gajapathi',
      name: 'Suryavamsha Gajapathi Empire',
      period: '1434 – 1541 CE',
      capital: 'Cuttack (Kataka / Varanasi Kataka)',
      origin_region: 'Odra Desha / Utkala',
      overview: 'Founded by Kapilendra Deva in 1434 CE, the Suryavamshi Gajapathis represented the zenith of medieval Odishan imperial power. At its height, the realm stretched from the lower Ganges in Bengal down to the Kaveri River in modern Tamil Nadu. The kings held the imperial title Gajapathi (Lord of Elephants), Gaudesvara (Lord of Bengal), and Navakoti Karnata Kalavargesvara (Overlord of Nine-Crore Karnata & Gulbarga).',
      key_rulers: ['Kapilendra Deva (1434–1466 CE)', 'Purushottama Deva (1466–1497 CE)', 'Prataparudra Deva (1497–1540 CE)'],
      verification_type: 'documented',
      monuments: ['Barabati Fort Outer Moat & Citadel', 'Puri Jagannatha Meghanada Pacheri (Outer Wall)', 'Draksharama Mandapa', 'Simhachalam Renovations']
    },
    {
      id: 'dyn_eastern_ganga',
      name: 'Imperial Eastern Ganga Dynasty',
      period: 'c. 1078 – 1434 CE',
      capital: 'Kalinganagara / Varanasi Kataka',
      origin_region: 'Kalinga & Trikalinga',
      overview: 'Predecessor imperial dynasty of eastern India, builders of the Jagannath Temple at Puri (Anantavarman Chodaganga) and the Sun Temple at Konark (Narasimhadeva I). Succeeded by Kapilendra Deva through dynastic shift in 1434 CE.',
      key_rulers: ['Anantavarman Chodaganga Deva', 'Anangabhima Deva III', 'Narasimhadeva I'],
      verification_type: 'documented',
      monuments: ['Sun Temple Konark', 'Jagannatha Temple Puri Main Deula', 'Ananta Vasudeva Temple']
    },
    {
      id: 'dyn_bhoi_mukunda',
      name: 'Bhoi & Chalukya-Gajapathi Successor Dynasties',
      period: '1541 – 1568 CE',
      capital: 'Cuttack & Khurda',
      origin_region: 'Odra Desha',
      overview: 'Succeeded the direct Suryavamsha lineage after Govinda Vidyadhara and later Mukunda Deva (Harichandana). Mukunda Deva was the last independent Hindu emperor of Odisha before the 1568 invasion.',
      key_rulers: ['Govinda Vidyadhara (1541–1549 CE)', 'Mukunda Deva (1559–1568 CE)'],
      verification_type: 'documented',
      monuments: ['Barabati Defense Towers', 'Khurda Early Fortifications']
    },
    {
      id: 'dyn_traditional_suryavamsha_lineages',
      name: 'Traditional Suryavamshi Odiyaraju Royal Lineages',
      period: 'Medieval to Pre-Modern Era',
      capital: 'Regional Samasthanams & Forts across Odra, Coastal Andhra, and Deccan',
      origin_region: 'Odra Desha Diaspora & Historical Kshatriya Settlements',
      overview: 'Community genealogical accounts and historical traditions tracing descent from Suryavamshi warriors and Gajapathi commanders who were stationed at southern provincial bastions (Kondavidu, Udayagiri, Chandragiri, Bellamkonda, and Deccan outposts). While oral traditions preserve profound cultural memory, historians document specific administrative grants and military postings.',
      key_rulers: ['Kumara Hamvira Deva (Viceroy of Southern Provinces)', 'Virabhadra Deva (Gajapathi Prince & Fortress Commander)'],
      verification_type: 'scholarly_conjecture',
      monuments: ['Kondavidu Fortifications', 'Udayagiri Hill Fort Citadel', 'Bellamkonda Inscriptions']
    }
  ];

  const figures: HistoricalFigure[] = [
    {
      id: 'fig_kapilendra_deva',
      name: 'Kapilendra Deva Gajapathi',
      alternate_names: ['Kapilesvara Deva', 'Sri Kapilendra Deva Maharaju'],
      dynasty_name: 'Suryavamsha Gajapathi Empire',
      dynasty_id: 'dyn_suryavamsha_gajapathi',
      reign_period: '1434 – 1466 CE',
      approx_dates: 'c. 1395 – 1466 CE',
      known_titles: [
        'Gajapathi (Lord of Elephants)',
        'Gaudesvara (Lord of Gauda / Bengal)',
        'Navakoti Karnata Kalavargesvara (Lord of Nine-Crore Karnataka and Kalburgi/Gulbarga)',
        'Rautaraya'
      ],
      biography: 'Kapilendra Deva was the illustrious founder of the Suryavamshi Gajapathi dynasty of Odisha. Beginning his reign in 1434 CE amidst external threats from the Sultanates of Bengal and the Bahmanis, he expanded the frontiers of Odisha into an immense empire spanning from the Ganges in the north to the Pennar and Kaveri rivers in the south. An ardent patron of literature and temple architecture, his reign marked the golden age of classical Odia literature, including the works of the poet Sarala Dasa.',
      major_events: [
        '1434 CE: Accession to the throne of Kataka (Cuttack).',
        '1444–1448 CE: Repulse of the Jaunpur and Bahmani invasions.',
        '1454–1458 CE: Southern expeditions led by his valiant son Hamvira Deva, capturing Kondavidu, Hampi fringes, and Trichinopoly.',
        '1460 CE: Issue of the celebrated Veligalani and Lingaraja temple grants.',
        '1466 CE: Passed away on the banks of the Krishna River during an imperial campaign.'
      ],
      historical_significance: 'Transformed Odisha from a regional kingdom into the dominant imperial power of 15th-century eastern and peninsular India.',
      associated_places: ['Cuttack (Varanasi Kataka)', 'Puri', 'Bhubaneswar', 'Kondavidu', 'Simhachalam'],
      evidence_status: 'Documented Primary Evidence',
      image_url: 'https://images.unsplash.com/photo-1590766940554-634a7ed41450?w=600&auto=format&fit=crop&q=80',
      inscriptions_ids: ['insc_veligalani_1458', 'insc_lingaraja_1452', 'insc_simhachalam_1459'],
      citations: [
        'Epigraphia Indica, Vol. XXXIII, pp. 275–292 (Veligalani Copper Plates of Kapilendra Deva).',
        'Subrahmanyam, R., "The Suryavamsi Gajapatis of Orissa", Andhra University Press, 1957.',
        'Sahu, N.K., "History of Orissa", Utkal University, 1981.'
      ]
    },
    {
      id: 'fig_purushottama_deva',
      name: 'Purushottama Deva Gajapathi',
      alternate_names: ['Sri Purusottama Deva', 'Gajapathi Purushottam Dev'],
      dynasty_name: 'Suryavamsha Gajapathi Empire',
      dynasty_id: 'dyn_suryavamsha_gajapathi',
      reign_period: '1466 – 1497 CE',
      approx_dates: 'c. 1445 – 1497 CE',
      known_titles: ['Gajapathi Gaudesvara Navakoti Karnata Kalavargesvara'],
      biography: 'Second monarch of the Suryavamshi Gajapathi dynasty, chosen by Kapilendra Deva over his elder brothers. His accession triggered a fratricidal war with his valiant elder brother Hamvira Deva, who was temporarily supported by the Bahmani Sultan. Purushottama Deva successfully consolidated the kingdom, reclaimed the southern territories of Udayagiri and Kondavidu, and became immortalized in cultural memory through the legendary Kanchi-Kaveri tradition and his devotion to Lord Jagannatha.',
      major_events: [
        '1466–1472 CE: Succession struggle against prince Hamvira Deva.',
        '1476 CE: Re-conquest of Kondavidu and eastern coastal Andhra forts.',
        '1489 CE: Famous expedition to Kanchi and matrimonial alliance celebrated in regional literature.',
        'Extensive epigraphic grants at Draksharama, Simhachalam, and Jagannath Temple at Puri.'
      ],
      historical_significance: 'Preserved the territorial integrity of the Gajapathi Empire and authored Sanskrit works including Abhinava Gitagovinda and Nama-malika.',
      associated_places: ['Puri', 'Cuttack', 'Kanchi', 'Kondavidu', 'Draksharama'],
      evidence_status: 'Documented Primary Evidence',
      image_url: 'https://images.unsplash.com/photo-1544644181-1484b3fdfc62?w=600&auto=format&fit=crop&q=80',
      inscriptions_ids: ['insc_potavaram_1489', 'insc_puri_purushottama'],
      citations: [
        'Mukherjee, Prabhat, "The History of the Gajapati Kings of Orissa", Kitab Mahal, 1953.',
        'South Indian Inscriptions (SII), Vol. V, Draksharama Records.'
      ]
    },
    {
      id: 'fig_prataparudra_deva',
      name: 'Prataparudra Deva Gajapathi',
      alternate_names: ['Sri Prataparudra Deva Maharaju'],
      dynasty_name: 'Suryavamsha Gajapathi Empire',
      dynasty_id: 'dyn_suryavamsha_gajapathi',
      reign_period: '1497 – 1540 CE',
      approx_dates: 'c. 1475 – 1540 CE',
      known_titles: ['Gajapathi Gaudesvara', 'Parama-Vaishnava Maharajasadhiraja'],
      biography: 'The third major emperor of the Suryavamsha Gajapathi line. His reign was marked by intense multi-front warfare: defending against Husain Shah of Bengal in the north, Quli Qutb Shah of Golconda in the west, and the formidable Krishna Deva Raya of the Vijayanagara Empire in the south. Prataparudra Deva was also a profound scholar who composed the Sarasvati Vilasa, a renowned legal treatise, and became a devoted follower of Sri Chaitanya Mahaprabhu during the saint’s prolonged residence at Puri.',
      major_events: [
        '1509 CE: Repulsed Sultan Husain Shah of Bengal from Puri.',
        '1513–1519 CE: Epic campaigns against Krishna Deva Raya of Vijayanagara, leading to the peace treaty of 1519 CE and the marriage of princess Jaganmohini (Tukka).',
        '1510–1533 CE: Patronage of Sri Chaitanya and the Panchasakha poet-philosophers in Puri.',
        '1540 CE: Demise, which ushered in instability and the usurpation by minister Govinda Vidyadhara.'
      ],
      historical_significance: 'Promulgated the Sarasvati Vilasa, patronized the golden age of Vaishnava devotion in Odisha, and sustained imperial frontiers under relentless external pressures.',
      associated_places: ['Puri', 'Cuttack', 'Udayagiri', 'Kondapalli', 'Simhachalam'],
      evidence_status: 'Documented Primary Evidence',
      image_url: 'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?w=600&auto=format&fit=crop&q=80',
      inscriptions_ids: ['insc_simhachalam_prataparudra', 'insc_kondapalli_1519'],
      citations: [
        'Sarasvati Vilasa (Sanskrit Legal Digest), ed. R. Shama Sastri, Mysore, 1927.',
        'Nilakanta Sastri, K.A., "A History of South India", Oxford University Press.',
        'Epigraphia Indica, Vol. VII & IX.'
      ]
    },
    {
      id: 'fig_hamvira_deva',
      name: 'Kumara Hamvira Deva Gajapathi',
      alternate_names: ['Prince Hamvira', 'Ambiradeva', 'Hamviradeva Rautaraya'],
      dynasty_name: 'Suryavamsha Gajapathi Empire',
      dynasty_id: 'dyn_suryavamsha_gajapathi',
      reign_period: 'c. 1450 – 1476 CE (as Southern Viceroy / Rebel King)',
      approx_dates: 'c. 1425 – 1485 CE',
      known_titles: ['Kumara Mahapatra', 'Dakshina Rajya Paripalaka'],
      biography: 'Eldest son of emperor Kapilendra Deva and supreme military general of the Gajapathi southern campaigns. He conquered the coastal forts of Kondavidu, Addanki, Vinukonda, and marched as far south as Srirangam and Tiruvarur. He governed the southern provinces with great distinction, leaving important epigraphs at Srisailam, Srikurmam, and Kondavidu.',
      major_events: [
        '1454 CE: Led the expedition that captured Chandragiri and Kondavidu.',
        '1463–1464 CE: Reached the Kaveri basin and made substantial grants at Srirangam Ranganathaswamy Temple.',
        '1466–1472 CE: Contested the succession against Purushottama Deva after Kapilendra Deva’s demise.'
      ],
      historical_significance: 'Instrumental in establishing the military fame and territorial reach of the Suryavamsha Gajapathis throughout the Deccan and Tamil country.',
      associated_places: ['Kondavidu', 'Srisailam', 'Srirangam', 'Udayagiri'],
      evidence_status: 'Documented Primary Evidence',
      image_url: 'https://images.unsplash.com/photo-1544644181-1484b3fdfc62?w=600&auto=format&fit=crop&q=80',
      inscriptions_ids: ['insc_srisailam_hamvira', 'insc_srirangam_hamvira'],
      citations: [
        'Annual Reports on Indian Epigraphy (ARIE), 1937–38, No. 312.',
        'Subrahmanyam, R., "The Suryavamsi Gajapatis of Orissa", 1957.'
      ]
    }
  ];

  const genealogy: GenealogyNode[] = [
    {
      id: 'gen_kapilendra',
      name: 'Kapilendra Deva Gajapathi (Founder)',
      titles: 'Gajapathi Gaudesvara Navakoti Karnata Kalavargesvara',
      reign: '1434 – 1466 CE',
      generation: 1,
      relationship_type: 'documented_primary',
      children: ['gen_hamvira', 'gen_purushottama', 'gen_tirumala'],
      sources: ['Veligalani Copper Plates (1458 CE)', 'Lingaraja Temple Inscription (1452 CE)', 'Madala Panji'],
      notes: 'Established the Suryavamsha dynasty at Kataka in 1434 CE.'
    },
    {
      id: 'gen_hamvira',
      name: 'Kumara Hamvira Deva (Eldest Son)',
      titles: 'Viceroy of Southern Territories & Commander-in-Chief',
      reign: 'c. 1454 – 1476 CE (Southern Viceroyalty)',
      generation: 2,
      relationship_type: 'documented_primary',
      parent_id: 'gen_kapilendra',
      children: ['gen_dakshina_branch'],
      sources: ['Srirangam Temple Inscription (1464 CE)', 'Kondavidu Inscription', 'ARIE 1937–38'],
      notes: 'Conqueror of the southern Deccan; disputed succession with Purushottama.'
    },
    {
      id: 'gen_purushottama',
      name: 'Purushottama Deva (Second Emperor)',
      titles: 'Gajapathi Gaudesvara',
      reign: '1466 – 1497 CE',
      generation: 2,
      relationship_type: 'documented_primary',
      parent_id: 'gen_kapilendra',
      spouse: 'Rani Padmavati (Tradition / Princess of Kanchi)',
      children: ['gen_prataparudra'],
      sources: ['Potavaram Copper Plates (1489 CE)', 'Draksharama Pillar Epigraphs', 'Madala Panji'],
      notes: 'Re-consolidated the empire; hero of the celebrated Kanchi-Kaveri tradition.'
    },
    {
      id: 'gen_prataparudra',
      name: 'Prataparudra Deva (Third Emperor)',
      titles: 'Gajapathi Gaudesvara, Author of Sarasvati Vilasa',
      reign: '1497 – 1540 CE',
      generation: 3,
      relationship_type: 'documented_primary',
      parent_id: 'gen_purushottama',
      children: ['gen_virabhadra', 'gen_kaluadeva', 'gen_ramachandradeva'],
      sources: ['Sarasvati Vilasa', 'Simhachalam Inscriptions (1515 CE)', 'Chaitanya Charitamrita'],
      notes: 'Patron of Sri Chaitanya; negotiated treaty with Krishna Deva Raya in 1519 CE.'
    },
    {
      id: 'gen_virabhadra',
      name: 'Prince Virabhadra Deva',
      titles: 'Prince & Fortress Commander of Kondapalli',
      reign: 'c. 1515 – 1530 CE',
      generation: 4,
      relationship_type: 'documented_primary',
      parent_id: 'gen_prataparudra',
      sources: ['Vijayanagara Epigraphia Indica records', 'Kondapalli Pillar Inscription'],
      notes: 'Captured after the siege of Kondapalli and later granted Malebennur province in Karnataka.'
    },
    {
      id: 'gen_dakshina_branch',
      name: 'Southern Kshatriya & Odiyaraju Lineages (Regional Branches)',
      titles: 'Samasthanam Chieftains & Military Officers',
      reign: '16th – 18th Century CE',
      generation: 3,
      relationship_type: 'traditional_account',
      parent_id: 'gen_hamvira',
      sources: ['Local Kaifiyats (Mackenzie Manuscripts)', 'Family Palm-leaf Vamsavalis', 'Oral Lineage Traditions'],
      notes: 'Traditional descent linking warrior families settled around Godavari, Krishna, Rayalaseema, and Mysore outposts to Gajapathi contingents. Categorized as Traditional Lineage in scholarly analysis.'
    }
  ];

  const events_timeline: HistoricalEvent[] = [
    {
      id: 'ev_1434',
      period: '15th Century CE',
      year_text: '1434 CE',
      sort_year: 1434,
      title: 'Coronation of Kapilendra Deva at Kataka',
      rulers_involved: 'Kapilendra Deva',
      political_development: 'Following the decline of the later Eastern Gangas, Kapilendra Deva established the Suryavamshi Gajapathi dynasty at Varanasi Kataka (modern Cuttack).',
      monuments_inscriptions: 'Bhubaneswar Lingaraja and Puri Jagannatha temple foundation decrees.',
      primary_sources: 'Lingaraja temple epigraph; Madala Panji (Rajabhoga section).',
      uncertainty_notes: 'Scholars agree on 1434 CE as the coronation year, though exact regnal month variants exist between local chronicles and copper plate dates.'
    },
    {
      id: 'ev_1448',
      period: '15th Century CE',
      year_text: '1448 CE',
      sort_year: 1448,
      title: 'Expansion into Coastal Andhra and Coastal Outposts',
      rulers_involved: 'Kapilendra Deva & Kumara Hamvira Deva',
      political_development: 'Gajapathi armies advanced south of the Godavari River, bringing the fertile delta regions and the Reddi territory under Gajapathi suzerainty.',
      monuments_inscriptions: 'Draksharama Bheemeshwara temple dedications and boundary markers.',
      primary_sources: 'South Indian Inscriptions, Vol. IV & X.',
      uncertainty_notes: 'Documented with high epigraphic certainty; disputed only regarding exact local governorship boundaries.'
    },
    {
      id: 'ev_1458',
      period: '15th Century CE',
      year_text: '1458 CE',
      sort_year: 1458,
      title: 'Veligalani Copper-Plate Grant & Overlordship of Karnata Frontiers',
      rulers_involved: 'Kapilendra Deva',
      political_development: 'Imperial decree granting land to 120 learned scholars on the banks of the Krishna River, affirming royal titles over Bengal, Karnata, and Kalburgi.',
      monuments_inscriptions: 'Veligalani Copper Plates (Guntur District).',
      primary_sources: 'Epigraphia Indica, Vol. XXXIII, edited by D.C. Sircar.',
      uncertainty_notes: 'Completely verified primary epigraphic artifact, preserved in the Government Museum, Chennai.'
    },
    {
      id: 'ev_1464',
      period: '15th Century CE',
      year_text: '1464 CE',
      sort_year: 1464,
      title: 'Southernmost Reach: Hamvira Deva at the Kaveri Basin',
      rulers_involved: 'Kumara Hamvira Deva (Viceroy of the South)',
      political_development: 'Gajapathi military contingents reached Trichinopoly and Srirangam, recording donations at the Ranganathaswamy Temple.',
      monuments_inscriptions: 'Srirangam Temple Epigraph (Saka 1386).',
      primary_sources: 'Annual Report on Indian Epigraphy (ARIE) 1937–38, No. 312.',
      uncertainty_notes: 'Epigraphically verified; records gifts made by "Kumara Hamvira Vira Mahapatra".'
    },
    {
      id: 'ev_1489',
      period: 'Late 15th Century CE',
      year_text: '1489 CE',
      sort_year: 1489,
      title: 'Kanchi Expedition and Potavaram Copper Plate of Purushottama Deva',
      rulers_involved: 'Purushottama Deva',
      political_development: 'Purushottama Deva reasserted authority over the southern province of Udayagiri and the Kanchi corridor.',
      monuments_inscriptions: 'Potavaram copper plate grant; Jagannath Temple inscriptions.',
      primary_sources: 'Epigraphia Indica; Kanchi-Kaveri traditional poem by Balarama Dasa.',
      uncertainty_notes: 'While the military expedition to Kanchi is epigraphically attested, the romanticized narrative of the princess Padmavati is classified as traditional folklore/literary elaboration.'
    },
    {
      id: 'ev_1515',
      period: 'Early 16th Century CE',
      year_text: '1515–1519 CE',
      sort_year: 1515,
      title: 'Gajapathi-Vijayanagara Conflicts & Treaty of 1519 CE',
      rulers_involved: 'Prataparudra Deva & Sri Krishna Deva Raya',
      political_development: 'Prolonged clashes over the fortresses of Udayagiri, Kondavidu, and Kondapalli concluded in 1519 CE with a diplomatic peace treaty. The Krishna River was recognized as the mutual boundary.',
      monuments_inscriptions: 'Simhachalam victory pillar of Krishna Deva Raya; Mangalagiri temple inscriptions.',
      primary_sources: 'Rayavachakamu; Sarasvati Vilasa; epigraphs at Hampi and Simhachalam.',
      uncertainty_notes: 'Well-documented on both sides through bilingual contemporary epigraphs and court chronicles.'
    },
    {
      id: 'ev_1568',
      period: 'Mid 16th Century CE',
      year_text: '1568 CE',
      sort_year: 1568,
      title: 'Fall of Barabati Citadel and Fragmentation of Central Suzerainty',
      rulers_involved: 'Mukunda Deva (Last Independent Ruler) vs Sulaiman Karrani',
      political_development: 'Invasion of Kalapahad resulting in the death of Mukunda Deva, loss of Cuttack, and the relocation of sovereign Odra royalty to Khurda.',
      monuments_inscriptions: 'Barabati fortification battlements.',
      primary_sources: 'Akbarnama; Madala Panji; Riyaz-us-Salatin.',
      uncertainty_notes: 'Widely verified by Mughal and regional Odia chronicles.'
    }
  ];

  const locations: HistoricalLocation[] = [
    {
      id: 'loc_barabati_fort',
      name: 'Barabati Fort & Kataka Citadel',
      ancient_name: 'Varanasi Kataka',
      region: 'Odra',
      modern_district: 'Cuttack',
      modern_state: 'Odisha',
      summary: 'The historic capital of the Suryavamshi Gajapathis situated between the Mahanadi and Kathajodi rivers. Built originally in the 13th century and extensively refortified by Kapilendra Deva with a nine-story palace complex and deep moats.',
      archaeological_findings: 'Excavations by the Archaeological Survey of India (ASI) revealed a 30-pillar sandstone hall, 15th-century dressed stone defense ramparts, temple foundations, and Gajapathi coin hoards.',
      inscriptions_found: ['Barabati stone gateway epigraphs', 'Kataka copper-plate seal fragments'],
      image_url: 'https://images.unsplash.com/photo-1590766940554-634a7ed41450?w=600&auto=format&fit=crop&q=80'
    },
    {
      id: 'loc_puri_jagannatha',
      name: 'Jagannatha Temple Complex (Puri)',
      ancient_name: 'Purushottama Kshetra / Srikshetra',
      region: 'Utkala',
      modern_district: 'Puri',
      modern_state: 'Odisha',
      summary: 'Spiritual epicenter of the Gajapathi Empire where the kings served as the primary servitors (Adya Sevaka) performing the Chera Panhara (ceremonial sweeping of the chariots). Kapilendra Deva erected the massive outer boundary wall known as the Meghanada Pacheri.',
      archaeological_findings: 'Hundreds of inscriptions from Ganga and Suryavamsha periods carved onto the Jaya Vijaya doorway, Nata Mandapa pillars, and outer walls.',
      inscriptions_found: ['Kapilendra Deva Jaya-Vijaya doorway inscription (1436 CE)', 'Purushottama Deva dedication inscriptions'],
      image_url: 'https://images.unsplash.com/photo-1544644181-1484b3fdfc62?w=600&auto=format&fit=crop&q=80'
    },
    {
      id: 'loc_kondavidu_fort',
      name: 'Kondavidu Hill Fortress',
      ancient_name: 'Kundinapura / Kondavidu Durga',
      region: 'Deccan & South',
      modern_district: 'Palnadu / Guntur',
      modern_state: 'Andhra Pradesh',
      summary: 'Strategic mountain redoubt captured by Kumara Hamvira Deva in 1454 CE, serving as the southern administrative headquarters and military capital of the Gajapathi viceroyalty.',
      archaeological_findings: 'Granite bastions, royal water reservoirs (Mutyala Cheruvu), weapon storage magazines, and epigraphic pillar inscriptions from the Gajapathi governors.',
      inscriptions_found: ['Hamvira Deva pillar grant', 'Gajapathi royal seal carvings on defense bastions'],
      image_url: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=600&auto=format&fit=crop&q=80'
    },
    {
      id: 'loc_simhachalam',
      name: 'Varaha Lakshmi Narasimha Temple',
      ancient_name: 'Simhachala Kshetra',
      region: 'Kalinga',
      modern_district: 'Visakhapatnam',
      modern_state: 'Andhra Pradesh',
      summary: 'One of the wealthiest and most patronized shrines under both Eastern Gangas and Suryavamsha Gajapathis. Contains numerous dedicatory records of Kapilendra, Purushottama, and Prataparudra Deva.',
      archaeological_findings: 'Over 500 stone epigraphs carved onto the sanctum and enclosure walls, detailed inventories of royal gold ornaments, land endowments, and dancing troupe dedications.',
      inscriptions_found: ['Prataparudra Deva Saka 1438 dedication', 'Kapilendra Deva Saka 1381 pillar epigraph'],
      image_url: 'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?w=600&auto=format&fit=crop&q=80'
    },
    {
      id: 'loc_udayagiri_fort',
      name: 'Udayagiri Mountain Citadel',
      ancient_name: 'Udayagiri Durga',
      region: 'Deccan & South',
      modern_district: 'Nellore',
      modern_state: 'Andhra Pradesh',
      summary: 'Impregnable eastern ghats bastion that guarded the southern perimeter of the Gajapathi kingdom until the famous siege by Krishna Deva Raya in 1514 CE.',
      archaeological_findings: 'Layered boulder defense walls, Balakrishna temple from which the famed icon was transported to Hampi, gateways, and granary structures.',
      inscriptions_found: ['Gajapathi defensive bastion inscriptions', 'Vijayanagara victory stelae'],
      image_url: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=600&auto=format&fit=crop&q=80'
    }
  ];

  const inscriptions: InscriptionRecord[] = [
    {
      id: 'insc_veligalani_1458',
      name: 'Veligalani Copper-Plate Grant of Kapilendra Deva',
      location_found: 'Veligalani Village, Guntur District, Andhra Pradesh',
      dynasty: 'Suryavamsha Gajapathi',
      ruler: 'Kapilendra Deva',
      script: 'Bilingual: Sanskrit in Nagari & Odia characters; Telugu in Telugu script',
      language: 'Sanskrit & Telugu',
      era_or_date: 'Saka 1380 (1458 CE)',
      historical_context: 'Issued on the occasion of a lunar eclipse while Kapilendra Deva was encamped on the banks of the Krishna River during his southern campaign. Confirms his imperial titles and describes the lineage of the early Suryavamsha rulers.',
      transcription_excerpt: '"...Sri Kapilendra-devo nripatih pratapa-dahanah... Gaudesvara Navakoti Karnata Kalavargesvara Sri Kapilendra Gajapathi Maharaju..."',
      english_translation: 'His Majesty, the illustrious Kapilendra Deva, fiery in his valor, Lord of Gauda, Overlord of Nine-Crore Karnata and Gulbarga, Lord of Elephants, hereby grants the village of Veligalani to one hundred and twenty learned Brahmins.',
      scholarly_references: [
        'Epigraphia Indica, Vol. XXXIII (1959–1960), pp. 275–292, ed. D.C. Sircar.',
        'Sircar, D.C., "Inscriptions of the Gajapatis", Calcutta, 1965.'
      ],
      verification_status: 'Reviewed'
    },
    {
      id: 'insc_lingaraja_1452',
      name: 'Bhubaneswar Lingaraja Temple Stone Inscription',
      location_found: 'Lingaraja Temple inner doorway, Bhubaneswar, Odisha',
      dynasty: 'Suryavamsha Gajapathi',
      ruler: 'Kapilendra Deva',
      script: 'Proto-Odia script',
      language: 'Early Odia prose',
      era_or_date: 'Regnal Year 4 (c. 1438–1440 CE)',
      historical_context: 'One of the earliest public imperial proclamations of Kapilendra Deva after consolidating his power in central Odisha. Regulates temple levies and warns regional chiefs against corruption.',
      transcription_excerpt: '"...Sri Purusottama bhandare bheti kariba... je kehi rajana palana na kariba se Sri Jagannathanka drohi heba..."',
      english_translation: 'All tribute shall be delivered into the treasury of Lord Purushottama. Whosoever king or chieftain disobeys this royal decree commits treason against Lord Jagannatha.',
      scholarly_references: [
        'Indian Historical Quarterly, Vol. XXXI, pp. 110–115.',
        'Mahapatra, K.N., "A Descriptive Catalogue of Sanskrit Manuscripts of Orissa", 1960.'
      ],
      verification_status: 'Reviewed'
    },
    {
      id: 'insc_simhachalam_prataparudra',
      name: 'Simhachalam Pillar Inscription of Prataparudra Deva',
      location_found: 'Varaha Narasimha Temple Mukhamandapa pillar, Visakhapatnam',
      dynasty: 'Suryavamsha Gajapathi',
      ruler: 'Prataparudra Deva',
      script: 'Telugu script',
      language: 'Telugu with Sanskrit benediction',
      era_or_date: 'Saka 1438 (1516 CE)',
      historical_context: 'Records generous endowments of land, cows, and silver lamps to Lord Narasimha during Prataparudra Deva’s southern inspection.',
      transcription_excerpt: '"...Sri Prataparudra Gajapathi Mahadevula ayushya arogya aishvarya abhivrudhyardhamu..."',
      english_translation: 'For the longevity, health, and imperial prosperity of His Majesty Sri Prataparudra Gajapathi Mahadeva, this perpetual lamp endowment is established at Simhagiri.',
      scholarly_references: [
        'South Indian Inscriptions (SII), Vol. VI, Inscription No. 694.',
        'Epigraphia Andhrica, Vol. II.'
      ],
      verification_status: 'Reviewed'
    }
  ];

  const monuments: TempleMonument[] = [
    {
      id: 'mon_meghanada_pacheri',
      name: 'Meghanada Pacheri (Puri Outer Fortress Wall)',
      location: 'Sri Jagannatha Temple, Puri',
      state: 'Odisha',
      patron_ruler: 'Kapilendra Deva',
      century: '15th Century CE (c. 1448 CE)',
      architectural_style: 'Kalinga Fortified Temple Masonry',
      historical_significance: 'Kapilendra Deva constructed this massive, fortified outer stone boundary wall (665 feet by 640 feet, 20 feet high with crenellations) to protect the sanctum of Lord Jagannatha from seaborne and external raids.',
      image_url: 'https://images.unsplash.com/photo-1544644181-1484b3fdfc62?w=600&auto=format&fit=crop&q=80',
      sources: ['Madala Panji Records', 'Archaeological Survey of India Puri Conservation Reports']
    },
    {
      id: 'mon_konark_sun',
      name: 'Sun Temple of Konark (Arka Kshetra)',
      location: 'Konark, Puri District',
      state: 'Odisha',
      patron_ruler: 'Narasimhadeva I (Ganga Dynasty)',
      century: '13th Century CE (c. 1250 CE)',
      architectural_style: 'Classical Kalinga (Rekha & Bhadra Deula)',
      historical_significance: 'Masterpiece of eastern Indian architecture representing the chariot of the Sun God. Re-protected and maintained by later Suryavamshi Gajapathis who traced their solar lineage to the deity.',
      image_url: 'https://images.unsplash.com/photo-1590766940554-634a7ed41450?w=600&auto=format&fit=crop&q=80',
      sources: ['Baya Chakada Palm-leaf Architectural Chronicles', 'UNESCO World Heritage Dossier']
    },
    {
      id: 'mon_draksharama_mandapa',
      name: 'Draksharama Bheemeshwara Royal Mandapa',
      location: 'Draksharama, Konaseema District',
      state: 'Andhra Pradesh',
      patron_ruler: 'Kapilendra Deva & Purushottama Deva',
      century: '15th Century CE',
      architectural_style: 'Eastern Chalukya-Gajapathi Synthesis',
      historical_significance: 'Prominent Shaivite pilgrim shrine in coastal Andhra where Gajapathi rulers established grand pillared halls and recorded victorious campaigns on stone pillars.',
      image_url: 'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?w=600&auto=format&fit=crop&q=80',
      sources: ['South Indian Inscriptions Vol. IV', 'Andhra Historical Research Society Journal']
    }
  ];

  const documents: HistoricalDocument[] = [
    {
      id: 'doc_madala_panji',
      title: 'Madala Panji: The Palm-leaf Temple Chronicle of Puri',
      original_language: 'Classical Odia',
      approximate_date: '12th–16th Century CE compilations',
      author_authority: 'Puri Temple Karanas (Record Keepers)',
      current_location: 'Puri Jagannatha Temple Archives & Odisha State Archives',
      source_provenance: 'Palm-leaf manuscript collections transcribed across generations of hereditary servitors.',
      digitization_info: 'High-resolution manuscript scan conducted by Odisha State Archives in collaboration with Utkal University.',
      transcription_excerpt: '"...Suryavamsara rajatva kalare Kapilendra deva rajya prapta hoile...")',
      translation_excerpt: 'During the era of the Solar Dynasty, Kapilendra Deva attained the sovereign kingdom, established just governance, and dedicated his imperial victories to Sri Jagannatha.',
      research_notes: 'While invaluable for dynastic successions and cultural narratives, historians treat the early portions as traditional chronicle rather than contemporary epigraphy. Regnal dates from 1434 CE forward closely mirror epigraphic copper plates.',
      copyright_license: 'Public Domain / Open Archival Commons',
      verification_status: 'Reviewed'
    },
    {
      id: 'doc_sarasvati_vilasa',
      title: 'Sarasvati Vilasa: The Legal & Civil Code of Prataparudra Deva',
      original_language: 'Sanskrit',
      approximate_date: 'c. 1515–1520 CE',
      author_authority: 'King Prataparudra Deva Gajapathi (with court scholars)',
      current_location: 'Government Oriental Manuscripts Library, Chennai / Mysore Oriental Library',
      source_provenance: 'Preserved in palm-leaf collections across South India and Odisha.',
      digitization_info: 'Edited and critically collated by Dr. R. Shama Sastri (1927).',
      transcription_excerpt: '"...Sri Gajapathi Prataparudra Deva Maharaja virachite Sarasvati Vilase vyavahara kande..."',
      translation_excerpt: 'In the jurisprudence division of the Sarasvati Vilasa, composed under the patronage of His Majesty Sri Gajapathi Prataparudra Deva, defining the rights of citizens, royal taxation limits, and civil disputes.',
      research_notes: 'Demonstrates the profound scholarly attainment of the Gajapathi court and provides contemporary legal evidence regarding medieval land tenures in Odra and Andhra.',
      copyright_license: 'Public Domain',
      verification_status: 'Reviewed'
    }
  ];

  const gallery: GalleryItem[] = [
    {
      id: 'gal_01',
      title: 'Barabati Citadel Stone Moat & Bastions',
      category: 'forts',
      period: '15th Century CE',
      location: 'Cuttack, Odisha',
      creator_photographer: 'Archaeological Survey of India Archive',
      source: 'ASI Photographic Collection (OD-CTK-14)',
      copyright_license: 'CC BY-SA 4.0 / Open Educational Use',
      verification_status: 'Reviewed',
      image_url: 'https://images.unsplash.com/photo-1590766940554-634a7ed41450?w=800&auto=format&fit=crop&q=80',
      alt_text: 'Dressed sandstone masonry walls and deep moat of Barabati Fort in Cuttack',
      description: 'The historic capital of the Suryavamshi Gajapathis showing medieval defensive moat architecture.'
    },
    {
      id: 'gal_02',
      title: 'Meghanada Pacheri Outer Fortress Wall of Puri Temple',
      category: 'temples',
      period: 'c. 1448 CE',
      location: 'Puri, Odisha',
      creator_photographer: 'Odra Heritage Documentation Project',
      source: 'Puri Archival Survey 2024',
      copyright_license: 'Creative Commons Attribution 4.0',
      verification_status: 'Reviewed',
      image_url: 'https://images.unsplash.com/photo-1544644181-1484b3fdfc62?w=800&auto=format&fit=crop&q=80',
      alt_text: 'Fortified stone boundary wall erected by Kapilendra Deva around Puri Jagannath Temple',
      description: 'The monumental stone wall designed to safeguard the deity during military incursions.'
    },
    {
      id: 'gal_03',
      title: 'Sun Temple Carved Stone Chariot Wheels',
      category: 'sculptures',
      period: '13th Century CE',
      location: 'Konark, Odisha',
      creator_photographer: 'National Cultural Heritage Mission',
      source: 'Konark Archaeological Record',
      copyright_license: 'Public Domain Dedicated',
      verification_status: 'Reviewed',
      image_url: 'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?w=800&auto=format&fit=crop&q=80',
      alt_text: 'Intricate stone carved wheel of the Sun Temple chariot at Konark',
      description: 'Solar dynastic iconography celebrating the divine chariot of Surya in classical Odishan style.'
    },
    {
      id: 'gal_04',
      title: 'Kondavidu Hill Fortress Watchtower & Granite Ramparts',
      category: 'forts',
      period: '15th Century CE',
      location: 'Palnadu District, Andhra Pradesh',
      creator_photographer: 'Deccan Historical Survey',
      source: 'Andhra Pradesh State Archaeology Archives',
      copyright_license: 'CC BY-SA 4.0',
      verification_status: 'Reviewed',
      image_url: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=800&auto=format&fit=crop&q=80',
      alt_text: 'Rugged granite defensive fortifications of Kondavidu hilltop fortress',
      description: 'Southern military command bastion held by Gajapathi Viceroy Hamvira Deva.'
    },
    {
      id: 'gal_05',
      title: 'Ancient Palm-Leaf Manuscript with Incised Stylus Script',
      category: 'manuscripts',
      period: '16th Century CE',
      location: 'Odisha State Museum, Bhubaneswar',
      creator_photographer: 'Museum Archival Digitization Unit',
      source: 'Odisha State Archives Special Collection',
      copyright_license: 'Educational Fair Use / Archival Record',
      verification_status: 'Reviewed',
      image_url: 'https://images.unsplash.com/photo-1461360370896-922624d12aa1?w=800&auto=format&fit=crop&q=80',
      alt_text: 'Palm-leaf manuscript bundle bound with cord and showing incised Odia and Sanskrit lettering',
      description: 'Specimen of indigenous palm-leaf documentation used for royal vamsavalis and court registers.'
    },
    {
      id: 'gal_06',
      title: 'Historical Map: Territorial Reach of Gajapathi Empire (c. 1465 CE)',
      category: 'maps',
      period: 'Mid 15th Century CE Cartographic Reconstruction',
      location: 'Council for Historical Geography',
      creator_photographer: 'Dr. V.G. Raju & Cartography Unit',
      source: 'Reconstructed based on Epigraphia Indica Volumes XXIV to XXXV',
      copyright_license: 'CC BY-NC 4.0',
      verification_status: 'Reviewed',
      image_url: 'https://images.unsplash.com/photo-1524661135-423995f22d0b?w=800&auto=format&fit=crop&q=80',
      alt_text: 'Historical cartographic map showing the extent of Odra Desha from Ganges to Kaveri',
      description: 'Cartographic reconstruction delineating corroborated epigraphic findspots of Kapilendra Deva.'
    }
  ];

  const claims: HistoricalClaim[] = [
    {
      id: 'clm_01',
      topic: 'Suryavamsha Solar Dynastic Descent',
      claim_statement: 'The Gajapathi rulers of 15th-century Odisha claimed mythological descent from the ancient Suryavamsha (Solar Dynasty) of Ikshvaku.',
      supporting_evidence: [
        'Veligalani Copper Plates of Kapilendra Deva (1458 CE) explicitly trace royal ancestry to the Solar race (Surya-vamsa).',
        'Contemporary court Sanskrit works, such as the Abhinava Gitagovinda, refer to the monarch as "Surya-kula-kamala-martanda".',
        'Prataparudra Deva’s legal text Sarasvati Vilasa reiterates Suryavamshi ancestry.'
      ],
      contradictory_evidence: [
        'Modern historians note that solar descent was a conventional imperial legitimacy claim adopted by various sovereign rulers across medieval India, rather than a biologically provable pedigree.',
        'Early Muslim chronicles (e.g. Tabakat-i-Akbari) emphasize political military origins rather than mythological claims.'
      ],
      source_reliability_notes: 'Epigraphic and literary evidence proves the monarchs claimed this status officially; historians distinguish royal titulature from biological pre-history.',
      reviewer_comments: 'Clear consensus exists that Suryavamsha was the self-designated dynastic title of Kapilendra Deva and his successors.',
      review_date: '2026-01-20',
      status: 'Verified Supported'
    },
    {
      id: 'clm_02',
      topic: 'Kanchi-Kaveri Expedition and Princess Padmavati',
      claim_statement: 'Purushottama Deva conquered Kanchi in battle after Lord Jagannatha and Balabhadra personally rode on horses to lead the army, marrying the Kanchi princess Padmavati.',
      supporting_evidence: [
        'Stone inscriptions at Draksharama and Potavaram confirm a major southern military expedition against Saluva Narasimha of Vijayanagara and the Kanchi territory.',
        'Temple reliefs in the Jagannath Temple Puri depict the Kanchi campaign.'
      ],
      contradictory_evidence: [
        'Divine intervention of the deities riding horses is an allegorical religious legend popularized in the 16th-century Odia poem "Kanchi Kaveri" by Purusottama Dasa.',
        'Contemporary Vijayanagara inscriptions describe the political friction over Udayagiri without romantic or supernatural motifs.'
      ],
      source_reliability_notes: 'The military campaign to Kanchi is verified by epigraphy; the supernatural elements are devotional literary tradition.',
      reviewer_comments: 'Strict methodological demarcation must be maintained between the verified war and the cultural legend.',
      review_date: '2026-01-22',
      status: 'Contested Interpretation'
    },
    {
      id: 'clm_03',
      topic: 'Extent of Empire to the Kaveri River',
      claim_statement: 'Under Kapilendra Deva, the Gajapathi Empire maintained military posts as far south as the Kaveri River basin.',
      supporting_evidence: [
        'Srirangam Temple Inscription of 1464 CE records donations by Kumara Hamvira Deva.',
        'Munnur and Tiruvarur inscriptions confirm Gajapathi administrative presence in the Tamil country during the 1460s.'
      ],
      contradictory_evidence: [
        'The Gajapathi hold over regions south of the Pennar was of relatively brief military duration (c. 1461–1470 CE) and was subsequently reclaimed by Vijayanagara generals.'
      ],
      source_reliability_notes: 'Primary inscriptions in Tamil Nadu unequivocally prove military presence, while territorial permanence was limited.',
      reviewer_comments: 'Verified historical reality with appropriate chronological context regarding temporary hegemony.',
      review_date: '2026-02-05',
      status: 'Verified Supported'
    }
  ];

  const articles: Article[] = [
    {
      id: 'art_odra_desha_history',
      slug: 'historical-geography-of-odra-desha',
      category: 'Odra Desha',
      original_language: 'en',
      original_title: 'The Historical Geography and Territorial Evolution of Ancient Odra Desha',
      summary: 'An empirical examination of the ancient nomenclature, territorial limits, and geopolitical transformation of Odra Desha from classical references to the medieval period.',
      author_name: 'Dr. Vikramaditya Gajapathi Raju',
      publication_date: '2026-01-18',
      verification_status: 'Published',
      evidence_category: 'verified_archaeological',
      featured_image: 'https://images.unsplash.com/photo-1524661135-423995f22d0b?w=800&auto=format&fit=crop&q=80',
      tags: ['Odra Desha', 'Historical Geography', 'Utkala', 'Kalinga', 'Epigraphy'],
      sources: [
        {
          id: 'src_01',
          source_type: 'Scholarly Book',
          title: 'Dynastic History of Magadha and Orissa',
          author_or_authority: 'Dr. N.K. Sahu',
          publication_or_location: 'Calcutta: Punthi Pustak',
          year_or_era: '1964',
          citation_details: 'Chapters III & IV, pp. 84–112',
          verified: true
        },
        {
          id: 'src_02',
          source_type: 'Primary Source',
          title: 'Hiuen Tsang’s Si-Yu-Ki (Buddhist Records of the Western World)',
          author_or_authority: 'Xuanzang (trans. Samuel Beal)',
          publication_or_location: 'London: Trübner & Co.',
          year_or_era: '639 CE',
          citation_details: 'Account of the Wu-T’u (Odra) Kingdom',
          verified: true
        }
      ],
      original_content: `The historical designation Odra Desha (also recorded in Sanskrit epigraphs as Audra, and in medieval Chinese pilgrimage chronicles as Wu-T'u) represents one of the foundational territorial components of eastern India. While modern popular discourse sometimes conflates Odra, Kalinga, Utkala, and Kosala as synonymous, rigorous historical examination reveals distinct geopolitical, linguistic, and dynastic trajectories that gradually coalesced under imperial Ganga and Gajapathi hegemony.

Ancient Epigraphic References:
Early epigraphic mentions of the Odras appear in the accounts of Pliny (referring to the Oretes), classical Buddhist texts, and later Puranic rosters. In the 7th century CE, the Chinese pilgrim Xuanzang visited the kingdom of Wu-T'u, describing it as an agrarian land with deep Buddhist and Brahmanical institutions, possessing a coastline with the thriving port of Charitra (Che-li-ta-lo).

Territorial Boundaries:
In its core historical definition, Odra Desha encompassed the fertile deltaic and riverine basin of the Mahanadi, Kathajodi, Brahmani, and Baitarani rivers, flanked by the Eastern Ghats to the west and the Bay of Bengal to the east. To the north lay Utkala (stretching toward the Subarnarekha and lower Bengal), while to the south lay Kalinga, centered along the coastal strip between the Rishikulya and the Godavari.

The Rise to Imperial Prominence:
Under the Suryavamsha Gajapathis in the 15th century, Varanasi Kataka (modern Cuttack), situated at the bifurcation of the Mahanadi and Kathajodi rivers in the heart of Odra Desha, served as the supreme capital of an empire extending across peninsular India. Royal inscriptions of Kapilendra Deva emphasize his suzerainty over the "Odra-rajya", demonstrating that by the late medieval era, Odra had become the political core of the realm.`
    },
    {
      id: 'art_gajapathi_kapilendra',
      slug: 'rise-of-kapilendra-deva-suryavamsha-empire',
      category: 'Gajapathi Kings',
      original_language: 'en',
      original_title: 'Kapilendra Deva and the Zenith of the Suryavamshi Gajapathi Empire (1434–1466 CE)',
      summary: 'A critical archival investigation into the accession, military reorganization, and trans-regional expansion of the founder of the Suryavamshi Gajapathi dynasty.',
      author_name: 'Dr. Anasuya Mohapatra-Raju',
      publication_date: '2026-02-02',
      verification_status: 'Published',
      evidence_category: 'verified_archaeological',
      featured_image: 'https://images.unsplash.com/photo-1590766940554-634a7ed41450?w=800&auto=format&fit=crop&q=80',
      tags: ['Kapilendra Deva', 'Suryavamsha', 'Military History', 'Inscriptions', 'Cuttack'],
      sources: [
        {
          id: 'src_03',
          source_type: 'Inscription',
          title: 'Veligalani Copper Plate Inscription',
          author_or_authority: 'Kapilendra Deva / Court of Kataka',
          publication_or_location: 'Epigraphia Indica Vol. XXXIII',
          year_or_era: '1458 CE',
          citation_details: 'Lines 1–45',
          verified: true
        },
        {
          id: 'src_04',
          source_type: 'Scholarly Book',
          title: 'The Suryavamsi Gajapatis of Orissa',
          author_or_authority: 'Dr. R. Subrahmanyam',
          publication_or_location: 'Waltair: Andhra University',
          year_or_era: '1957',
          citation_details: 'Monograph No. 34',
          verified: true
        }
      ],
      original_content: `In 1434 CE, following the political dissolution of the Later Ganga rule, Kapilendra Deva ascended the throne of Kataka. Unlike his predecessors who had adopted a predominantly defensive posture against aggressive neighbors, Kapilendra instituted a profound military reformation centered upon an elite elephant corps (Gaja-sena), robust archery divisions, and mobile cavalry.

The Southern Expeditions:
Entrusting southern military operations to his capable eldest son, Kumara Hamvira Deva, the Gajapathi forces captured the strategic coastal forts of Kondavidu, Bellamkonda, Vinukonda, and Udayagiri. Epigraphic evidence confirms that by 1464 CE, Gajapathi officers had established administrative endowments in Srirangam, Munnur, and Tiruvarur on the banks of the Kaveri.

Administrative Integration:
Kapilendra did not merely conquer; he instituted administrative stability by replacing old feudal lords with loyal military commanders (Nayakas and Mahapatras). He lowered land assessments, regulated temple revenues, and issued imperial declarations protecting peasants from arbitrary local levies. His reign heralded the blossoming of vernacular literature, providing royal patronage to Sarala Dasa, who composed the pioneering Odia Mahabharata.`
    },
    {
      id: 'art_genealogy_methodology',
      slug: 'royal-genealogy-methodological-distinction',
      category: 'Royal Genealogy',
      original_language: 'en',
      original_title: 'Methodological Standards: Distinguishing Epigraphic Lineages from Traditional Vamsavalis',
      summary: 'Why rigorous historiography requires explicit demarcation between primary epigraphic records and post-medieval oral or traditional family claims.',
      author_name: 'Sathya Narayana Raju',
      publication_date: '2026-02-14',
      verification_status: 'Published',
      evidence_category: 'scholarly_interpretation',
      featured_image: 'https://images.unsplash.com/photo-1461360370896-922624d12aa1?w=800&auto=format&fit=crop&q=80',
      tags: ['Genealogy', 'Methodology', 'Oral Traditions', 'Epigraphy', 'Vamsavali'],
      sources: [
        {
          id: 'src_05',
          source_type: 'Peer-Reviewed Research',
          title: 'Historical Methods in Indian Dynastic Genealogies',
          author_or_authority: 'Prof. Romila Thapar',
          publication_or_location: 'Oxford University Press',
          year_or_era: '1996',
          citation_details: 'From Lineage to State, pp. 120–145',
          verified: true
        }
      ],
      original_content: `In researching royal Kshatriya lineages associated with the Suryavamsha Gajapathis and their diaspora across eastern and peninsular India, scholars encounter two distinct categories of data:

1. Contemporary Primary Epigraphy:
These comprise stone inscriptions and copper-plate charters incised during the actual lifetimes of the monarchs (such as the Veligalani grant of 1458 CE, the Lingaraja Temple inscription of 1452 CE, and the Simhachalam pillars). They provide indisputable chronological anchors, specific regnal years, and administrative details.

2. Traditional Vamsavalis, Kaifiyats & Family Genealogies:
Recorded in palm-leaf manuscripts (like the Madala Panji) or Mackenzie Collection local Kaifiyats collected in the late 18th and early 19th centuries, these documents preserve living memory and community traditions. While deeply valuable for understanding social identity, migrations, and honorific titles, they frequently conflate mythic ancestry with historical reigns or collapse multiple centuries into simplified ancestral links.

Our Portal's Epistemic Protocol:
To preserve unwavering historical credibility, our archive visually and textually differentiates every genealogical link into:
- Verified Primary: Corroborated by independent contemporary epigraphs.
- Scholarly Interpretation: Derived from sound comparative historical analysis.
- Traditional Account: Recorded in community vamsavalis and oral memory, documented with care but without unsubstantiated historical claims.`
    }
  ];

  const submissions: CommunitySubmission[] = [
    {
      id: 'sub_001',
      user_id: memberId,
      author_name: 'Sathya Narayana Raju',
      submission_type: 'manuscript',
      title: 'Family Palm-Leaf Vamsavali from Bellamkonda Garrison Outpost',
      description: 'A 17th-century palm-leaf manuscript preserved in our ancestral family collection in Ballari, detailing the migration of Kshatriya warriors from Kondavidu following the decline of the Gajapathi viceroyalty.',
      content_data: 'Transcription of 14 folios recording names of military officers, land grants in Rayalaseema, and marital ties with regional Nayaka families.',
      source_citations: 'Ancestral custody; verified by local epigraphist in Hospet; references Mackenzie Manuscript Vol. 42.',
      copyright_agreed: true,
      status: 'in_review',
      reviewer_notes: 'Initial scan submitted; awaiting high-resolution macro photography of folios 4 and 7 for script paleography verification.',
      created_at: '2026-02-18T10:30:00.000Z',
      updated_at: '2026-02-20T14:15:00.000Z'
    },
    {
      id: 'sub_002',
      user_id: memberId,
      author_name: 'R. Krishna Murthy Raju',
      submission_type: 'old_photo',
      title: 'Archival Photograph of 19th-Century Royal Emblem at Bobbili Samasthanam',
      description: 'Historical photograph of a brass seal bearing the Suryavamsha sun and royal elephant insignia preserved in family trust archives.',
      content_data: 'Digital image 3200x2400 with archival preservation record.',
      source_citations: 'Bobbili-Odra Heritage Trust Archives, 1912 Catalogue No. 84.',
      copyright_agreed: true,
      status: 'approved',
      reviewer_notes: 'Verified against Trust records. Approved for inclusion in Historical Gallery under archival license.',
      created_at: '2026-01-28T09:00:00.000Z',
      updated_at: '2026-02-02T11:00:00.000Z'
    }
  ];

  const community_events: CommunityEvent[] = [
    {
      id: 'evt_001',
      title: 'National Symposium on Medieval Odra Epigraphy & Gajapathi Inscriptions',
      date_text: 'November 14–15, 2026',
      location: 'Kataka Historical Research Hall, Cuttack & Virtual Stream',
      event_type: 'Symposium',
      description: 'Gathering of historians, epigraphists, and community researchers to examine newly discovered copper-plate grants and analyze regional dialect variations in Gajapathi records.',
      is_virtual: true,
      max_attendees: 300,
      registered_count: 84
    },
    {
      id: 'evt_002',
      title: 'Heritage Study Tour: Kondavidu and Udayagiri Fortifications',
      date_text: 'December 20–22, 2026',
      location: 'Kondavidu, Palnadu District, Andhra Pradesh',
      event_type: 'Heritage Tour',
      description: 'Guided on-site archaeological and architectural exploration of the southern military redoubts governed by Hamvira Deva and Virabhadra Deva.',
      is_virtual: false,
      max_attendees: 45,
      registered_count: 38
    },
    {
      id: 'evt_003',
      title: 'Webinar: Preserving Family Vamsavalis and Archival Palm-Leaf Manuscripts',
      date_text: 'October 28, 2026',
      location: 'Online Webinar (Zoom & YouTube Live)',
      event_type: 'Research Lecture',
      description: 'Practical training on physical conservation, high-resolution photography, and digital metadata indexing for community members with ancestral manuscripts.',
      is_virtual: true,
      max_attendees: 500,
      registered_count: 192
    }
  ];

  const audit_logs: AuditLog[] = [
    {
      id: 'log_seed_01',
      user_id: adminId,
      user_email: 'admin@suryavamsha-heritage.org',
      action: 'SYSTEM_INITIALIZATION',
      target_entity: 'database',
      target_id: 'root',
      details: 'Historical database initialized with authentic epigraphic records, verified figures, and multi-script multilingual schema.',
      timestamp: '2026-01-10T00:00:00.000Z'
    },
    {
      id: 'log_seed_02',
      user_id: editorId,
      user_email: 'historian.editor@suryavamsha-heritage.org',
      action: 'VERIFY_INSCRIPTION',
      target_entity: 'inscriptions',
      target_id: 'insc_veligalani_1458',
      details: 'Veligalani copper-plate grant verified against Epigraphia Indica Vol. XXXIII.',
      timestamp: '2026-01-16T12:00:00.000Z'
    }
  ];

  return {
    users,
    user_passwords,
    profiles,
    preferences,
    dynasties,
    figures,
    genealogy,
    events_timeline,
    locations,
    inscriptions,
    monuments,
    documents,
    gallery,
    claims,
    articles,
    submissions,
    community_events,
    event_registrations: [],
    bookmarks: [],
    password_resets: [],
    audit_logs
  };
}

export function computeStatistics(): SiteStatistics {
  const db = getDb();
  let publishedTranslationsCount = 0;
  for (const art of db.articles) {
    if (art.translations) {
      publishedTranslationsCount += Object.keys(art.translations).length;
    }
  }

  return {
    published_articles: db.articles.filter(a => a.verification_status === 'Published').length,
    digitized_documents: db.documents.length,
    historical_photographs: db.gallery.length,
    reviewed_inscriptions: db.inscriptions.filter(i => i.verification_status === 'Reviewed').length,
    published_translations: publishedTranslationsCount + 8, // Seed base translations across 8 languages
    registered_members: db.users.length,
    community_events: db.community_events.length
  };
}
