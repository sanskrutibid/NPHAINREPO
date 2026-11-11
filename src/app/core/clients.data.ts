// ---------------------------------------------------------------------------
// CLIENT LOGOS - real logo files (black, transparent background) in src/assets/images/clients/
// Shown on Home (Our clients) and on the Projects & Clients page, GROUPED UNDER HEADINGS and in EXACTLY the order of
// the PDF "Phian_Client_Logos_BW_Complete_NoBG_v3", EXCEPT the first logos below (per Dev Ghosh Sir):
//   Healthcare starts: Max, Columbia Asia, NSH, Arihant (x2), Rhythm, then the rest.  Real Estate starts: Mukunda, Keshavam, Ramsons, then the rest.
//   1 Healthcare and Wellness (19)   2 Real Estate, Infrastructure and Design (13)   3 Education (26)
//   4 Consumer Brands, Food and Lifestyle (17)   5 Corporate and Industry (8)      = 83 logos
// To add a client: copy its PNG into src/assets/images/clients/ and add ONE line L("Name", "file.png") to the right group.
// To change the order: move the line up or down.  One logo per client - no duplicates.
// ---------------------------------------------------------------------------
export interface Client {
  name: string; img?: string; l1: string; l2?: string; f: string; c: string; a?: string;
  icon?: string; layout?: 'row' | 'stack' | 'plain' | 'box' | 'pill' | 'chip';
  w?: number; ls?: number; s?: number; up?: boolean; it?: boolean;
}
export interface ClientGroup { id: string; title: string; clients: Client[]; }

const L = (name: string, img: string): Client => ({ name, img, l1: name, f: 'montserrat', c: '#111111' });

export const CLIENT_GROUPS: ClientGroup[] = [
  {
    id: 'healthcare', title: 'Healthcare and Wellness', clients: [
      L("Max Healthcare", "max-healthcare.png"),
      L("Columbia Asia Hospitals", "columbia-asia-hospitals.png"),
      L("NSH Critical Care Hospital", "nsh-critical-care-hospital.png"),
      L("Arihant Multispeciality Hospital", "arihant-multispeciality-hospital.png"),
      L("Arihant Netralaya", "arihant-netralaya.png"),
      L("Rhythm Heart and Critical Care", "rhythm-heart-and-critical-care.png"),
      L("Abhyudaya Piles Aesthetic Laser Hospital", "abhyudaya-piles-aesthetic-laser-hospital.png"),
      L("ABO Eye Institute", "abo-eye-institute.png"),
      L("Aspire Aesthetics", "aspire-aesthetics.png"),
      L("Fetal Medicine and Cardiology Centre of Excellence", "fetal-medicine-and-cardiology-centre-of-excellence.png"),
      L("Kalptaruu Polyclinic", "kalptaruu-polyclinic.png"),
      L("Orthopaedics Dental Aesthetics", "orthopaedics-dental-aesthetics.png"),
      L("Siddhayu Wellness Abode", "siddhayu-wellness-abode.png"),
      L("IVify Drip Spa", "ivify-drip-spa.png"),
      L("Mediskin", "mediskin.png"),
      L("Sparkle Eye Clinic", "sparkle-eye-clinic.png"),
      L("Small Wonders", "small-wonders.png"),
      L("SHPL Care Network", "shpl-care-network.png"),
      L("BioAllos", "bioallos.png"),
    ],
  },
  {
    id: 'real-estate', title: 'Real Estate, Infrastructure and Design', clients: [
      L("Mukunda", "mukunda.png"),
      L("Keshavam Infra", "keshavam-infra.png"),
      L("Ramsons Group", "ramsons-group.png"),
      L("Design Inside", "design-inside.png"),
      L("Dwarkadhish Infraventures", "dwarkadhish-infraventures.png"),
      L("IIDesign", "iidesign.png"),
      L("Matchbox Design Studio", "matchbox-design-studio.png"),
      L("SS Buildcon", "ss-buildcon.png"),
      L("Unique Realities", "unique-realities.png"),
      L("Krishna Construction Co", "krishna-construction-co.png"),
      L("Vaultstone", "vaultstone.png"),
      L("Vision Developers", "vision-developers.png"),
      L("Karmabhoomi Industrial Estate", "karmabhoomi-industrial-estate.png"),
    ],
  },
  {
    id: 'education', title: 'Education', clients: [
      L("Aspire International School", "aspire-international-school.png"),
      L("Blossom School", "blossom-school.png"),
      L("Central India Public School", "central-india-public-school.png"),
      L("Central Provincial School", "central-provincial-school.png"),
      L("Cruise Lens Academy", "cruise-lens-academy.png"),
      L("Public School Emblem", "public-school-emblem.png"),
      L("Edify School Nagpur", "edify-school-nagpur.png"),
      L("Gaikwad-Patil International School", "gaikwad-patil-international-school.png"),
      L("Genius Academy", "genius-academy.png"),
      L("IFDA International", "ifda-international.png"),
      L("IInsight", "iinsight.png"),
      L("IT Campus Guru", "it-campus-guru.png"),
      L("Jain Heritage", "jain-heritage.png"),
      L("Kalptaru JEE NEET Foundation", "kalptaru-jee-neet-foundation.png"),
      L("Little Millennium", "little-millennium.png"),
      L("Lokmanya Tilak International School", "lokmanya-tilak-international-school.png"),
      L("Mainline Academy", "mainline-academy.png"),
      L("Mount Litera Zee School, Besa Nagpur", "mount-litera-zee-school.png"),
      L("Pradhan Madam's Academy", "pradhan-madam-s-academy.png"),
      L("Royal Gondwana Public School", "royal-gondwana-public-school.png"),
      L("The Achievers School", "the-achievers-school.png"),
      L("The Swaminarayan School", "the-swaminarayan-school.png"),
      L("NEEV Institute Nagpur", "neev-institute-nagpur.png"),
      L("Mount Litera Zee School, Newyoor", "mount-litera-zee-school-newyoor.png"),
      L("The Rankers Academy", "the-rankers-academy.png"),
      L("Somalwar Academy Education Society", "somalwar-academy-education-society.png"),
    ],
  },
  {
    id: 'consumer', title: 'Consumer Brands, Food and Lifestyle', clients: [
      L("Baidyanath", "baidyanath.png"),
      L("Capello Luxury Salon", "capello-luxury-salon.png"),
      L("Indus Suites", "indus-suites.png"),
      L("Kolkata Rice", "kolkata-rice.png"),
      L("Mayur Exclusives", "mayur-exclusives.png"),
      L("Nature's Sprout", "nature-s-sprout.png"),
      L("Oak and Chisel", "oak-and-chisel.png"),
      L("P. C. Chandra Jewellers", "p-c-chandra-jewellers.png"),
      L("Haldiram's Prabhuji", "haldiram-s-prabhuji.png"),
      L("Preeti Poddar", "preeti-poddar.png"),
      L("Traditional Brand", "traditional-brand.png"),
      L("Srivalli Designs", "srivalli-designs.png"),
      L("The City Dhhaba", "the-city-dhhaba.png"),
      L("The Fitness Hive", "the-fitness-hive.png"),
      L("Ayodhya", "ayodhya.png"),
      L("JM Monogram", "jm-monogram.png"),
      L("Ashper", "ashper.png"),
    ],
  },
  {
    id: 'corporate', title: 'Corporate and Industry', clients: [
      L("ABB", "abb.png"),
      L("Growthtree", "growthtree.png"),
      L("Marico", "marico.png"),
      L("Prophecy Research", "prophecy-research.png"),
      L("Ramdevbaba Solvent", "ramdevbaba-solvent.png"),
      L("Swetal Logistics", "swetal-logistics.png"),
      L("Square", "square.png"),
      L("Inficore", "inficore.png"),
    ],
  },
];

/** flat list (all groups in order) - kept for any code that needs every client */
export const CLIENTS: Client[] = CLIENT_GROUPS.flatMap(g => g.clients);
