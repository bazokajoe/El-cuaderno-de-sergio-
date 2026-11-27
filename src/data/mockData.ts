import type { SentRecord, Task, Team, WorkZone } from '../types/task';

export const SCHOOL_ZONE_TAG = 'Mantenimiento semanal colegio';

export const DEFAULT_TASK_TYPES = [
  'Perfilado',
  'Desbroce',
  'Deshierbe',
  'Poda de Setos',
  'Recorte Arbustivas',
] as const;

export const IRRIGATION_TASK_TYPES = [
  'Tubería y tubo de riego',
  'Electroválvulas',
  'Fugas',
] as const;

export const ALL_TASK_TYPES = [
  ...DEFAULT_TASK_TYPES,
  ...IRRIGATION_TASK_TYPES,
] as const;

// Equipo 1 y 2 (comparten las mismas 39 zonas)
const EQ_1_2_ZONES: WorkZone[] = [
  { id: 'z-38915', code: '38915', name: 'Via Asima' },
  { id: 'z-38813', code: '38813', name: 'Rtda. y Parterre 16 de Julio' },
  { id: 'z-38910', code: '38910', name: 'Cala Malgrana ZV' },
  { id: 'z-38539', code: '38539', name: 'Cala Moreia Mob.' },
  { id: 'z-40070', code: '40070', name: 'Son Fuster Vell' },
  { id: 'z-38600', code: '38600', name: 'Cala Marçal EV' },
  { id: 'z-50050', code: '50050', name: 'Son Fuster Makro' },
  { id: 'z-38815', code: '38815', name: 'Butano (Pol. Son Castelló)' },
  { id: 'z-38523', code: '38523', name: 'Cas Capella' },
  { id: 'z-38628', code: '38628', name: 'Galatzó' },
  { id: 'z-20166', code: '20166', name: 'Plaça de Sa Indioteria (Licinio Lafuente, Plaza)' },
  { id: 'z-20136', code: '20136', name: 'Miquel Riera i Perelló, Plaza' },
  { id: 'z-38814', code: '38814', name: 'Príncipe España (Pol. Son Castelló)' },
  { id: 'z-20165', code: '20165', name: 'Rtda. y Part. Cno. Vjo. Bunyola' },
  { id: 'z-20191', code: '20191', name: 'Tortosa' },
  { id: 'z-20194', code: '20194', name: 'Parc de Bartomeu Verd' },
  { id: 'z-38614', code: '38614', name: 'Mediana Aragón' },
  { id: 'z-40040', code: '40040', name: 'Mediana Aragón-Son Rullán' },
  { id: 'z-38593', code: '38593', name: 'Son Fuster Nou (Pedro Poveda)' },
  { id: 'z-20179', code: '20179', name: 'Campo de Fútbol Son Fuster' },
  { id: 'z-38847', code: '38847', name: 'Son Fuster, Cala Mitjana ZV' },
  { id: 'z-38845', code: '38845', name: 'Son Fuster, Sa Nostra ZV' },
  { id: 'z-38846', code: '38846', name: 'Can Foradí ZV' },
  { id: 'z-38525', code: '38525', name: 'Iglesia Son Fuster ZV' },
  { id: 'z-38876', code: '38876', name: 'Son Rullán ZV' },
  { id: 'z-38652', code: '38652', name: 'Félix Rodríguez de la Fuente' },
  { id: 'z-20163', code: '20163', name: 'Virgen de Lluch, Plaza' },
  { id: 'z-20162', code: '20162', name: 'Viviendas Virgen de Lluch' },
  { id: 'z-50022', code: '50022', name: 'Z.V. Calle Son Fuster Nou' },
  { id: 'z-50065', code: '50065', name: 'Parc de les Palmeres' },
  { id: 'z-50027', code: '50027', name: 'Solar Aragón 325' },
  { id: 'z-50032', code: '50032', name: 'Pasaje Cala Millor' },
  { id: 'z-50040', code: '50040', name: 'Can Salou' },
  { id: 'z-38538', code: '38538', name: 'Cala Serena Mob.' },
  { id: 'z-38540', code: '38540', name: 'Cala Montdragó Mob.' },
  { id: 'z-38541', code: '38541', name: 'Cala Pi Mob.' },
  { id: 'z-38543', code: '38543', name: 'Cala Gran Mob.' },
  { id: 'z-38725', code: '38725', name: 'Arquebisbe Miquel Roca Mob.' },
  { id: 'z-38785', code: '38785', name: 'Cales de Mallorca Mob.' },
];

// Equipo 3 (25 zonas, incl. 2 colegios)
const EQ_3_ZONES: WorkZone[] = [
  { id: 'z-38571', code: '38571', name: 'Baltasar Valentí (Cristo Rey) Mob.' },
  { id: 'z-20018', code: '20018', name: "Ca'n Llimona, Parque" },
  { id: 'z-38524', code: '38524', name: 'Músico Arrieta' },
  { id: 'z-38844', code: '38844', name: 'Ses Cases de Son Ametler ZV' },
  { id: 'z-jem-al06', code: 'JEM-AL06', name: 'Casal de Son Ametler ZV' },
  { id: 'z-20013', code: '20013', name: 'Álamo (Alber)' },
  { id: 'z-20145', code: '20145', name: 'Rafal Nou Plaza' },
  { id: 'z-20114', code: '20114', name: 'Centro de Salud Vivero/Rafal' },
  { id: 'z-09158', code: '09158', name: 'Crèdit Balear' },
  { id: 'z-38788', code: '38788', name: 'Son Gibert Parque' },
  { id: 'z-38750', code: '38750', name: 'Baladre Esq. Alber' },
  { id: 'z-38751', code: '38751', name: 'Baladre Esq. Taronger' },
  { id: 'z-20137', code: '20137', name: 'Josep Maria Llompart, Plaza' },
  { id: 'z-20146', code: '20146', name: 'Rafal Vell' },
  { id: 'z-38604', code: '38604', name: 'Blanes Viale EV' },
  { id: 'z-38603', code: '38603', name: 'Romero de Torres EV' },
  { id: 'z-38789', code: '38789', name: 'Son Gibert Rotonda' },
  { id: 'z-38555', code: '38555', name: 'Lanzone Mob.' },
  { id: 'z-38559', code: '38559', name: 'Wagner Mob.' },
  { id: 'z-38561', code: '38561', name: 'Beethoven Mob.' },
  { id: 'z-38570', code: '38570', name: 'Selva Mob.' },
  { id: 'z-38588', code: '38588', name: 'Plaza Segovia, Mob.' },
  { id: 'z-38724', code: '38724', name: 'Mestre Perosi Mob.' },
  { id: 'z-es-60027', code: 'ES-60027', name: 'Es Vivero', tag: SCHOOL_ZONE_TAG },
  { id: 'z-es-60028', code: 'ES-60028', name: 'Rafal Nou (Selva, 11)', tag: SCHOOL_ZONE_TAG },
];

// Equipo 4 (13 zonas)
const EQ_4_ZONES: WorkZone[] = [
  { id: 'z-20209', code: '20209', name: 'Ses Sorts' },
  { id: 'z-20217', code: '20217', name: 'Talud Ses Sorts' },
  { id: 'z-20011', code: '20011', name: 'Virgen de Monserrat (Mare de Déu de Monserrat)' },
  { id: 'z-20149', code: '20149', name: 'Rtda. Virg. Monserrat/Ind. Prieto' },
  { id: 'z-38736', code: '38736', name: 'Parking Virgen de Monserrat (Mare de Déu de Monserrat)' },
  { id: 'z-40060', code: '40060', name: 'Son Guells' },
  { id: 'z-50012', code: '50012', name: 'Son Morro Norte' },
  { id: 'z-50019', code: '50019', name: 'Son Morro Centro' },
  { id: 'z-50016', code: '50016', name: 'Estadi Balear ZV 1' },
  { id: 'z-50017', code: '50017', name: 'Estadi Balear ZV 2' },
  { id: 'z-50018', code: '50018', name: 'Estadi Balear ZV 3' },
  { id: 'z-50024', code: '50024', name: 'Mare de Déu de la Victoria' },
  { id: 'z-mediana-servicios-levante', name: 'Mediana Servicios Levante' },
];

// Equipo 5 (36 zonas, incl. 4 colegios)
const EQ_5_ZONES: WorkZone[] = [
  { id: 'z-20215', code: '20215', name: 'Ctra. Manacor' },
  { id: 'z-20150', code: '20150', name: "S'Hostalets" },
  { id: 'z-20214', code: '20214', name: 'C/ Tomás Rullán' },
  { id: 'z-20197', code: '20197', name: 'Antillón (Isidoro Antillón)' },
  { id: 'z-20218', code: '20218', name: 'Jardineras Calle Aragón' },
  { id: 'z-38606', code: '38606', name: 'Jorge Luis Borges EV' },
  { id: 'z-20199', code: '20199', name: 'Parterre Aragón (Olivo)' },
  { id: 'z-20189', code: '20189', name: 'Rtda. Miquel Dolç (H. Tte. Coronel Franco)' },
  { id: 'z-50063', code: '50063', name: 'Nuredduna' },
  { id: 'z-38615', code: '38615', name: 'Túnel Aragón' },
  { id: 'z-38534', code: '38534', name: 'Josep Darder Metge Mob.' },
  { id: 'z-20128', code: '20128', name: 'Manacor' },
  { id: 'z-20198', code: '20198', name: 'Manacor (Caballito)' },
  { id: 'z-50002', code: '50002', name: 'Sant Francesc Xavier' },
  { id: 'z-20120', code: '20120', name: 'Francesc Garcia Orell, Plaza' },
  { id: 'z-20017', code: '20017', name: 'Centro de Salud Son Gotleu' },
  { id: 'z-20213', code: '20213', name: 'Ses Veles' },
  { id: 'z-38617', code: '38617', name: 'Colegio Son Gotleu' },
  { id: 'z-20164', code: '20164', name: 'Fra Joan Alzina, Plaza' },
  { id: 'z-38904', code: '38904', name: 'Joanot Colom' },
  { id: 'z-20127', code: '20127', name: 'Málaga' },
  { id: 'z-20190', code: '20190', name: 'Orson Welles, Plaza' },
  { id: 'z-50056', code: '50056', name: 'Guillem Moragues' },
  { id: 'z-50025', code: '50025', name: 'Jardineras Costa i Llobera' },
  { id: 'z-50028', code: '50028', name: 'Parterre Pere Garau' },
  { id: 'z-38551', code: '38551', name: 'Pic Puigmal Mob.' },
  { id: 'z-38553', code: '38553', name: 'Celia Viñas Mob.' },
  { id: 'z-38558', code: '38558', name: 'Pic Almanzor Mob.' },
  { id: 'z-38560', code: '38560', name: 'Pic Auñamendi Mob.' },
  { id: 'z-38565', code: '38565', name: 'Pere Garau Mob.' },
  { id: 'z-38586', code: '38586', name: 'Regal Mob.' },
  { id: 'z-38626', code: '38626', name: 'Indalecio Prieto Mob.' },
  { id: 'z-es-60030', code: 'ES-60030', name: 'Es Pont (Indalecio Prieto, 85)', tag: SCHOOL_ZONE_TAG },
  { id: 'z-es-60031', code: 'ES-60031', name: 'Gabriel Vallseca (Mare Déu de la Victòria, 36)', tag: SCHOOL_ZONE_TAG },
  { id: 'z-es-60036', code: 'ES-60036', name: 'Jafudà Cresques (Faust Morell, 27)', tag: SCHOOL_ZONE_TAG },
  { id: 'z-es-60035', code: 'ES-60035', name: 'Son Canals (Bisbe Cabanelles, 25)', tag: SCHOOL_ZONE_TAG },
];

// Equipo 6 (9 zonas)
const EQ_6_ZONES: WorkZone[] = [
  { id: 'z-20178', code: '20178', name: 'Ciutat de Querétaro' },
  { id: 'z-20135', code: '20135', name: 'México Avda.' },
  { id: 'z-38556', code: '38556', name: 'Caracas ZV' },
  { id: 'z-40090', code: '40090', name: 'Escuela Taller' },
  { id: 'z-50014', code: '50014', name: 'Son Puça' },
  { id: 'z-50013', code: '50013', name: 'Can Blau' },
  { id: 'z-50033', code: '50033', name: 'Calle Bogotá' },
  { id: 'z-38576', code: '38576', name: 'Mínimos Mob.' },
  { id: 'z-38587', code: '38587', name: 'Lima (Pol. Levante), Mob.' },
];

// Equipo 6 BIS (8 zonas, incl. 1 colegio)
const EQ_6_BIS_ZONES: WorkZone[] = [
  { id: 'z-00280', code: '00280', name: 'Frente Marítimo - Los Ceibos' },
  { id: 'z-00281', code: '00281', name: 'Frente Marítimo - Albert Camus' },
  { id: 'z-00306', code: '00306', name: 'Joan Maragall' },
  { id: 'z-38882', code: '38882', name: 'Plaça de la Guàrdia Civil' },
  { id: 'z-20216', code: '20216', name: 'Manuel Azaña (mob)' },
  { id: 'z-50023', code: '50023', name: 'Parking Manacor Vallado' },
  { id: 'z-jem-al05', code: 'JEM-AL05', name: 'Síquia de la Vila' },
  { id: 'z-es-60037', code: 'ES-60037', name: 'Alexandre Rosselló', tag: SCHOOL_ZONE_TAG },
];

// Equipo 15 Fachada Marítima (4 zonas)
const EQ_15_ZONES: WorkZone[] = [
  { id: 'z-50035', code: '50035', name: 'Fachada Marítima Fase 0' },
  { id: 'z-50036', code: '50036', name: 'Fachada Marítima Fase II' },
  { id: 'z-50037', code: '50037', name: 'Fachada Marítima Fase III (Can Palou)' },
  { id: 'z-50020', code: '50020', name: 'Fachada Marítima Fase IV (Parc Son Pedrals)' },
];

// Parque WIFI (1 zona, sin código)
const EQ_WIFI_ZONES: WorkZone[] = [
  { id: 'z-parque-wifi', name: 'Parque WIFI' },
];

// Equipo 16 (3 zonas, sin códigos)
const EQ_16_ZONES: WorkZone[] = [
  { id: 'z-son-malferit-este', name: 'Son Malferit Este' },
  { id: 'z-son-malferit-oeste', name: 'Son Malferit Oeste' },
  { id: 'z-mediana-poligono', name: 'Mediana Polígono' },
];

// Total: 39 + 25 + 13 + 36 + 9 + 8 + 4 + 1 + 3 = 138 zonas únicas
export const INITIAL_ZONES: WorkZone[] = [
  ...EQ_1_2_ZONES,
  ...EQ_3_ZONES,
  ...EQ_4_ZONES,
  ...EQ_5_ZONES,
  ...EQ_6_ZONES,
  ...EQ_6_BIS_ZONES,
  ...EQ_15_ZONES,
  ...EQ_WIFI_ZONES,
  ...EQ_16_ZONES,
];

const eq12Ids = EQ_1_2_ZONES.map((z) => z.id);

export const INITIAL_TEAMS: Team[] = [
  {
    id: 'eq-1',
    name: 'Equipo 1',
    zoneIds: [...eq12Ids],
    description: 'Comparte las 39 zonas con Equipo 2',
  },
  {
    id: 'eq-2',
    name: 'Equipo 2',
    zoneIds: [...eq12Ids],
    description: 'Comparte las 39 zonas con Equipo 1',
  },
  {
    id: 'eq-3',
    name: 'Equipo 3',
    zoneIds: EQ_3_ZONES.map((z) => z.id),
  },
  {
    id: 'eq-4',
    name: 'Equipo 4',
    zoneIds: EQ_4_ZONES.map((z) => z.id),
  },
  {
    id: 'eq-5',
    name: 'Equipo 5',
    zoneIds: EQ_5_ZONES.map((z) => z.id),
  },
  {
    id: 'eq-6',
    name: 'Equipo 6',
    zoneIds: EQ_6_ZONES.map((z) => z.id),
  },
  {
    id: 'eq-6-bis',
    name: 'Equipo 6 BIS',
    zoneIds: EQ_6_BIS_ZONES.map((z) => z.id),
  },
  {
    id: 'eq-15',
    name: 'Equipo 15 (Fachada Marítima)',
    zoneIds: EQ_15_ZONES.map((z) => z.id),
  },
  {
    id: 'eq-parque-wifi',
    name: 'Parque WIFI',
    zoneIds: EQ_WIFI_ZONES.map((z) => z.id),
  },
  {
    id: 'eq-16',
    name: 'Equipo 16',
    zoneIds: EQ_16_ZONES.map((z) => z.id),
  },
  {
    id: 'eq-riego',
    name: 'Equipo de Riego',
    zoneIds: [],
    allZones: true,
    taskTypes: [...IRRIGATION_TASK_TYPES],
    description: 'Sin zonas propias · Opera en cualquiera de las 138 zonas',
  },
];

export function formatZoneLabel(zone?: WorkZone | null): string {
  if (!zone) return 'Zona';
  return zone.code ? `${zone.code} · ${zone.name}` : zone.name;
}

export function getTaskTypesForTeam(
  team: Team | undefined,
  defaultTaskTypes: string[],
): string[] {
  if (team?.taskTypes && team.taskTypes.length > 0) {
    return team.taskTypes;
  }
  return defaultTaskTypes;
}

export function getZonesForTeam(
  team: Team | undefined,
  zones: WorkZone[],
): WorkZone[] {
  if (!team || team.allZones) return zones;
  const set = new Set(team.zoneIds);
  return zones.filter((z) => set.has(z.id));
}

const todayISO = () => {
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
};

const daysAgoISO = (days: number) => {
  const d = new Date();
  d.setDate(d.getDate() - days);
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
};

const hoursAgo = (h: number) => Date.now() - h * 60 * 60 * 1000;

export const INITIAL_TASKS: Task[] = [
  {
    id: 't-1',
    code: 'TAR-214',
    status: 'TODO',
    taskType: 'Poda de Setos',
    teamId: 'eq-1',
    zoneId: 'z-38915',
    date: todayISO(),
    createdAt: hoursAgo(5),
    comment: 'Lateral oeste junto a la entrada principal de Via Asima.',
    updatedAt: hoursAgo(5),
  },
  {
    id: 't-2',
    code: 'TAR-215',
    status: 'TODO',
    taskType: 'Fugas',
    teamId: 'eq-riego',
    zoneId: 'z-50065',
    date: daysAgoISO(1),
    createdAt: hoursAgo(30),
    comment: 'Fuga localizada junto a la arqueta norte del Parc de les Palmeres.',
    updatedAt: hoursAgo(30),
  },
  {
    id: 't-3',
    code: 'TAR-216',
    status: 'TODO',
    taskType: 'Deshierbe',
    teamId: 'eq-3',
    zoneId: 'z-es-60027',
    date: daysAgoISO(2),
    createdAt: hoursAgo(55),
    comment: 'Revisión semanal de patio y accesos del colegio Es Vivero.',
    updatedAt: hoursAgo(55),
  },
  {
    id: 't-4',
    code: 'TAR-217',
    status: 'TODO',
    taskType: 'Perfilado',
    teamId: 'eq-5',
    zoneId: 'z-50063',
    date: daysAgoISO(4),
    createdAt: hoursAgo(100),
    comment: 'Pendiente desde el jueves. Revisar bordillos en Nuredduna.',
    updatedAt: hoursAgo(100),
  },
  {
    id: 't-5',
    code: 'TAR-210',
    status: 'DOING',
    taskType: 'Electroválvulas',
    teamId: 'eq-riego',
    zoneId: 'z-50035',
    date: todayISO(),
    createdAt: hoursAgo(3),
    comment: 'Sustitución de electroválvula en sector 2 de Fachada Marítima Fase 0.',
    updatedAt: hoursAgo(1),
  },
  {
    id: 't-6',
    code: 'TAR-211',
    status: 'DOING',
    taskType: 'Desbroce',
    teamId: 'eq-2',
    zoneId: 'z-38813',
    date: todayISO(),
    createdAt: hoursAgo(4),
    comment: 'Mitad norte hecha en Rtda. y Parterre 16 de Julio.',
    updatedAt: hoursAgo(0.5),
  },
  {
    id: 't-7',
    code: 'TAR-205',
    status: 'DONE',
    taskType: 'Perfilado',
    teamId: 'eq-4',
    zoneId: 'z-20209',
    date: daysAgoISO(1),
    createdAt: hoursAgo(28),
    comment: 'Cerrado sin incidencias en Ses Sorts.',
    updatedAt: hoursAgo(20),
  },
  {
    id: 't-8',
    code: 'TAR-206',
    status: 'DONE',
    taskType: 'Poda de Setos',
    teamId: 'eq-6',
    zoneId: 'z-20178',
    date: daysAgoISO(1),
    createdAt: hoursAgo(32),
    comment: 'Restos recogidos y retirados en Ciutat de Querétaro.',
    updatedAt: hoursAgo(22),
  },
  {
    id: 't-9',
    code: 'TAR-203',
    status: 'DONE',
    taskType: 'Deshierbe',
    teamId: 'eq-3',
    zoneId: 'z-20146',
    date: daysAgoISO(2),
    createdAt: hoursAgo(50),
    comment: '',
    updatedAt: hoursAgo(40),
  },
];

export const INITIAL_SENT: SentRecord[] = [
  {
    id: 's-1',
    sentAt: hoursAgo(2),
    summary: 'Parte diario Equipo 2 · 38813 Rtda. y Parterre 16 de Julio',
    taskCount: 3,
    teamName: 'Equipo 2',
    zoneName: '38813 · Rtda. y Parterre 16 de Julio',
    status: 'enviado',
  },
  {
    id: 's-2',
    sentAt: hoursAgo(26),
    summary: 'Parte Equipo de Riego · 50065 Parc de les Palmeres',
    taskCount: 2,
    teamName: 'Equipo de Riego',
    zoneName: '50065 · Parc de les Palmeres',
    status: 'enviado',
  },
  {
    id: 's-3',
    sentAt: hoursAgo(50),
    summary: 'Resumen Equipo 3 · 20146 Rafal Vell',
    taskCount: 5,
    teamName: 'Equipo 3',
    zoneName: '20146 · Rafal Vell',
    status: 'enviado',
  },
];

export function deviceDateISO(now = new Date()): string {
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

export function formatDisplayDate(iso: string): string {
  const [y, m, d] = iso.split('-').map(Number);
  if (!y || !m || !d) return iso;
  const date = new Date(y, m - 1, d);
  return date.toLocaleDateString('es-ES', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
  });
}

export function formatDateTime(ts: number): string {
  return new Date(ts).toLocaleString('es-ES', {
    day: '2-digit',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function nextTaskCode(tasks: Task[]): string {
  const nums = tasks
    .map((t) => Number(t.code.replace(/\D/g, '')))
    .filter((n) => !Number.isNaN(n));
  const next = (nums.length ? Math.max(...nums) : 200) + 1;
  return `TAR-${next}`;
}
