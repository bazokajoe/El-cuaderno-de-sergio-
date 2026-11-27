export type TaskStatus = 'TODO' | 'DOING' | 'DONE';

export type TabId = 'inicio' | 'gestion' | 'enviar' | 'reportes';

export type FabAction = 'nueva-tarea' | 'nueva-gestion' | 'enviar-tareas' | 'crear-reporte';

export type TaskTypeName =
  | 'Perfilado'
  | 'Desbroce'
  | 'Deshierbe'
  | 'Poda de Setos'
  | 'Recorte Arbustivas'
  | 'Tubería y tubo de riego'
  | 'Electroválvulas'
  | 'Fugas';

export interface WorkZone {
  id: string;
  code?: string;
  name: string;
  /** Optional zone category/tag such as 'Mantenimiento semanal colegio' */
  tag?: string;
}

export interface Team {
  id: string;
  name: string;
  zoneIds: string[];
  /** When true (e.g. Equipo de Riego), team operates across all zones without owning specific ones */
  allZones?: boolean;
  /** Optional team-specific task types overriding the default gardening ones */
  taskTypes?: string[];
  /** Optional short note shown in Gestión */
  description?: string;
}

export interface Task {
  id: string;
  code: string;
  status: TaskStatus;
  taskType: string;
  teamId: string;
  zoneId: string;
  /** ISO date YYYY-MM-DD taken from device clock on create */
  date: string;
  createdAt: number;
  comment: string;
  updatedAt: number;
}

export interface SentRecord {
  id: string;
  sentAt: number;
  summary: string;
  taskCount: number;
  teamName: string;
  zoneName: string;
  status: 'enviado' | 'pendiente';
}

export type ReportGroupBy = 'fecha' | 'equipo' | 'zona' | 'tipo' | 'estado';

export type AppScreen =
  | { name: 'dashboard' }
  | { name: 'task-list'; status: TaskStatus }
  | { name: 'task-form'; mode: 'create' | 'edit'; taskId?: string }
  | { name: 'gestion' }
  | { name: 'nueva-gestion' }
  | { name: 'enviar' }
  | { name: 'reportes' };
