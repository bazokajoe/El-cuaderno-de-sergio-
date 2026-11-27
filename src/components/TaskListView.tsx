import { ArrowLeft, GraduationCap, MapPin, Pencil, Users } from 'lucide-react';
import type { Task, TaskStatus, Team, WorkZone } from '../types/task';
import { formatDisplayDate, formatZoneLabel } from '../data/mockData';

interface TaskListViewProps {
  status: TaskStatus;
  tasks: Task[];
  teams: Team[];
  zones: WorkZone[];
  onBack: () => void;
  onEdit: (taskId: string) => void;
}

const STATUS_COPY: Record<
  TaskStatus,
  { title: string; code: string; empty: string }
> = {
  TODO: {
    title: 'Por hacer',
    code: 'TO DO',
    empty: 'No hay tareas pendientes.',
  },
  DOING: {
    title: 'En curso',
    code: 'ONGOING',
    empty: 'Ninguna tarea en curso ahora.',
  },
  DONE: {
    title: 'Hechas',
    code: 'DONE',
    empty: 'Aún no hay tareas cerradas.',
  },
};

function ageTier(createdAt: number): 'fresh' | 'yellow' | 'orange' | 'red' {
  const days = (Date.now() - createdAt) / (24 * 60 * 60 * 1000);
  if (days > 3) return 'red';
  if (days > 2) return 'orange';
  if (days > 1) return 'yellow';
  return 'fresh';
}

const TIER_SURFACE = {
  fresh: 'bg-white border-[#D2DFD7]',
  yellow: 'bg-[#FEF08A] border-[#CA8A04]/40',
  orange: 'bg-[#FED09E] border-[#EA580C]/40',
  red: 'bg-[#FECACA] border-[#DC2626]/40',
} as const;

export function TaskListView({
  status,
  tasks,
  teams,
  zones,
  onBack,
  onEdit,
}: TaskListViewProps) {
  const copy = STATUS_COPY[status];
  const teamName = (id: string) =>
    teams.find((t) => t.id === id)?.name ?? 'Equipo';
  const findZone = (id: string) => zones.find((z) => z.id === id);

  return (
    <div className="space-y-4">
      <header className="hero-atmosphere relative overflow-hidden rounded-b-[28px] px-5 pt-5 pb-5 text-white md:rounded-[28px]">
        <button
          type="button"
          onClick={onBack}
          className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1.5 text-[13px] font-medium text-[#D7ECE3]"
        >
          <ArrowLeft className="h-4 w-4" />
          Dashboard
        </button>
        <h1 className="mt-3 font-display text-[2rem] font-extrabold tracking-[-0.03em]">
          {copy.title}
        </h1>
        <p className="mt-1 font-mono text-[11px] uppercase tracking-[0.14em] text-[#9DD4BF]">
          {copy.code} · {tasks.length}
        </p>
      </header>

      <div className="space-y-3 px-4 sm:px-6 md:px-1">
        {tasks.length === 0 ? (
          <p className="py-10 text-center text-[14px] text-[#5E746C]">
            {copy.empty}
          </p>
        ) : (
          tasks.map((task, idx) => {
            const surface =
              status === 'TODO'
                ? TIER_SURFACE[ageTier(task.createdAt)]
                : status === 'DOING'
                  ? 'bg-[#F1F9F5] border-[#BBD9CC]'
                  : 'bg-[#F7FAF8] border-[#D4E0D9]';

            return (
              <button
                key={task.id}
                type="button"
                onClick={() => onEdit(task.id)}
                style={{ animationDelay: `${idx * 45}ms` }}
                className={`animate-fade-rise flex w-full flex-col gap-2 rounded-2xl border p-4 text-left transition-transform active:scale-[0.985] ${surface}`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <p className="font-mono text-[10.5px] font-semibold text-[#526960]">
                      {task.code} · {formatDisplayDate(task.date)}
                    </p>
                    <h2 className="mt-1 text-[16px] font-semibold tracking-[-0.01em] text-[#0E1F1A]">
                      {task.taskType}
                    </h2>
                  </div>
                  <span className="inline-flex items-center gap-1 rounded-md bg-[#0B241E]/8 px-2 py-1 text-[11px] font-semibold text-[#0B241E]">
                    <Pencil className="h-3 w-3" />
                    Editar
                  </span>
                </div>

                <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[12.5px] font-medium text-[#3F564D]">
                  <span className="inline-flex items-center gap-1">
                    <Users className="h-3.5 w-3.5 text-[#118A56]" />
                    {teamName(task.teamId)}
                  </span>
                  <span className="inline-flex items-center gap-1">
                    <MapPin className="h-3.5 w-3.5 text-[#0E666B]" />
                    {formatZoneLabel(findZone(task.zoneId))}
                  </span>
                  {findZone(task.zoneId)?.tag && (
                    <span className="inline-flex items-center gap-1 rounded bg-[#FEF3C7] px-1.5 py-0.5 text-[11px] font-semibold text-[#92400E]">
                      <GraduationCap className="h-3 w-3" />
                      {findZone(task.zoneId)?.tag}
                    </span>
                  )}
                </div>

                {task.comment ? (
                  <p className="line-clamp-2 text-[13px] leading-snug text-[#4B635B]">
                    {task.comment}
                  </p>
                ) : null}
              </button>
            );
          })
        )}
      </div>
    </div>
  );
}
