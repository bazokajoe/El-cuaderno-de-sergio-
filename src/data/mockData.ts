import type { SentRecord, Task, Team, WorkZone } from '../types/task';

export const DEFAULT_TASK_TYPES = [
  'Perfilado',
  'Desbroce',
  'Deshierbe',
  'Poda de Setos',
  'Recorte Arbustivas',
] as const;

export const INITIAL_ZONES: WorkZone[] = [
  { id: 'z-asima', name: 'Gran Vía Asima' },
  { id: 'z-palmeras', name: 'Las Palmeras' },
  { id: 'z-rafal-vell', name: 'Rafal Vell' },
  { id: 'z-rafal-nou', name: 'Rafal Nou' },
  { id: 'z-son-gotleu', name: 'Son Gotleu' },
  { id: 'z-pont-enlla', name: 'Pont d\'Inca' },
];

export const INITIAL_TEAMS: Team[] = [
  {
    id: 'eq-1',
    name: 'Equipo 1',
    zoneIds: ['z-asima', 'z-palmeras', 'z-son-gotleu'],
  },
  {
    id: 'eq-2',
    name: 'Equipo 2',
    zoneIds: ['z-asima', 'z-palmeras', 'z-pont-enlla'],
  },
  {
    id: 'eq-3',
    name: 'Equipo 3',
    zoneIds: ['z-rafal-vell', 'z-rafal-nou'],
  },
  {
    id: 'eq-4',
    name: 'Equipo 4',
    zoneIds: ['z-son-gotleu', 'z-pont-enlla'],
  },
];

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
    zoneId: 'z-asima',
    date: todayISO(),
    createdAt: hoursAgo(5),
    comment: 'Lateral oeste junto a la entrada de vecinos.',
    updatedAt: hoursAgo(5),
  },
  {
    id: 't-2',
    code: 'TAR-215',
    status: 'TODO',
    taskType: 'Desbroce',
    teamId: 'eq-2',
    zoneId: 'z-palmeras',
    date: daysAgoISO(1),
    createdAt: hoursAgo(30),
    comment: 'Zona de parking y bordes del seto.',
    updatedAt: hoursAgo(30),
  },
  {
    id: 't-3',
    code: 'TAR-216',
    status: 'TODO',
    taskType: 'Deshierbe',
    teamId: 'eq-3',
    zoneId: 'z-rafal-vell',
    date: daysAgoISO(2),
    createdAt: hoursAgo(55),
    comment: 'Priorizar pasillos peatonales.',
    updatedAt: hoursAgo(55),
  },
  {
    id: 't-4',
    code: 'TAR-217',
    status: 'TODO',
    taskType: 'Perfilado',
    teamId: 'eq-1',
    zoneId: 'z-palmeras',
    date: daysAgoISO(4),
    createdAt: hoursAgo(100),
    comment: 'Pendiente desde el jueves. Revisar bordillos.',
    updatedAt: hoursAgo(100),
  },
  {
    id: 't-5',
    code: 'TAR-210',
    status: 'DOING',
    taskType: 'Recorte Arbustivas',
    teamId: 'eq-3',
    zoneId: 'z-rafal-nou',
    date: todayISO(),
    createdAt: hoursAgo(3),
    comment: 'Equipo 3 en marcha desde las 09:15.',
    updatedAt: hoursAgo(1),
  },
  {
    id: 't-6',
    code: 'TAR-211',
    status: 'DOING',
    taskType: 'Desbroce',
    teamId: 'eq-2',
    zoneId: 'z-asima',
    date: todayISO(),
    createdAt: hoursAgo(4),
    comment: 'Mitad norte hecha. Queda el tramo hacia Asima.',
    updatedAt: hoursAgo(0.5),
  },
  {
    id: 't-7',
    code: 'TAR-205',
    status: 'DONE',
    taskType: 'Perfilado',
    teamId: 'eq-1',
    zoneId: 'z-asima',
    date: daysAgoISO(1),
    createdAt: hoursAgo(28),
    comment: 'Cerrado sin incidencias.',
    updatedAt: hoursAgo(20),
  },
  {
    id: 't-8',
    code: 'TAR-206',
    status: 'DONE',
    taskType: 'Poda de Setos',
    teamId: 'eq-4',
    zoneId: 'z-son-gotleu',
    date: daysAgoISO(1),
    createdAt: hoursAgo(32),
    comment: 'Restos recogidos y sacados.',
    updatedAt: hoursAgo(22),
  },
  {
    id: 't-9',
    code: 'TAR-203',
    status: 'DONE',
    taskType: 'Deshierbe',
    teamId: 'eq-3',
    zoneId: 'z-rafal-vell',
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
    summary: 'Parte diario Equipo 2 · Gran Vía Asima',
    taskCount: 3,
    teamName: 'Equipo 2',
    zoneName: 'Gran Vía Asima',
    status: 'enviado',
  },
  {
    id: 's-2',
    sentAt: hoursAgo(26),
    summary: 'Cierre jornada Equipo 1 · Las Palmeras',
    taskCount: 4,
    teamName: 'Equipo 1',
    zoneName: 'Las Palmeras',
    status: 'enviado',
  },
  {
    id: 's-3',
    sentAt: hoursAgo(50),
    summary: 'Resumen Equipo 3 · Rafal Vell / Rafal Nou',
    taskCount: 5,
    teamName: 'Equipo 3',
    zoneName: 'Rafal Vell',
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
