import { useMemo, useState } from 'react';
import { ArrowLeft, CalendarDays, Check } from 'lucide-react';
import {
  DEFAULT_TASK_TYPES,
  deviceDateISO,
  formatDisplayDate,
} from '../data/mockData';
import type { Task, TaskStatus, Team, WorkZone } from '../types/task';

interface TaskFormViewProps {
  mode: 'create' | 'edit';
  task?: Task | null;
  teams: Team[];
  zones: WorkZone[];
  taskTypes: string[];
  onSave: (payload: {
    taskType: string;
    teamId: string;
    zoneId: string;
    status: TaskStatus;
    date: string;
    comment: string;
  }) => void;
  onCancel: () => void;
}

const STATUS_OPTIONS: { value: TaskStatus; label: string }[] = [
  { value: 'TODO', label: 'Por hacer' },
  { value: 'DOING', label: 'En curso' },
  { value: 'DONE', label: 'Hecha' },
];

export function TaskFormView({
  mode,
  task,
  teams,
  zones,
  taskTypes,
  onSave,
  onCancel,
}: TaskFormViewProps) {
  const phoneDate = deviceDateISO();
  const [taskType, setTaskType] = useState(
    task?.taskType ?? taskTypes[0] ?? DEFAULT_TASK_TYPES[0],
  );
  const [teamId, setTeamId] = useState(task?.teamId ?? teams[0]?.id ?? '');
  const [zoneId, setZoneId] = useState(task?.zoneId ?? '');
  const [status, setStatus] = useState<TaskStatus>(task?.status ?? 'TODO');
  const [comment, setComment] = useState(task?.comment ?? '');
  const date = mode === 'create' ? phoneDate : (task?.date ?? phoneDate);

  const availableZones = useMemo(() => {
    const team = teams.find((t) => t.id === teamId);
    if (!team) return zones;
    return zones.filter((z) => team.zoneIds.includes(z.id));
  }, [teamId, teams, zones]);

  // Keep zone valid when team changes
  const effectiveZoneId =
    availableZones.some((z) => z.id === zoneId)
      ? zoneId
      : (availableZones[0]?.id ?? '');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!taskType || !teamId || !effectiveZoneId) return;
    onSave({
      taskType,
      teamId,
      zoneId: effectiveZoneId,
      status,
      date,
      comment: comment.trim(),
    });
  };

  return (
    <div className="space-y-4">
      <header className="hero-atmosphere relative overflow-hidden rounded-b-[28px] px-5 pt-5 pb-5 text-white md:rounded-[28px]">
        <button
          type="button"
          onClick={onCancel}
          className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1.5 text-[13px] font-medium text-[#D7ECE3]"
        >
          <ArrowLeft className="h-4 w-4" />
          Volver
        </button>
        <h1 className="mt-3 font-display text-[2rem] font-extrabold tracking-[-0.03em]">
          {mode === 'create' ? 'Nueva tarea' : 'Editar tarea'}
        </h1>
        <p className="mt-1.5 inline-flex items-center gap-1.5 text-[13px] text-[#CBE3D8]">
          <CalendarDays className="h-4 w-4 text-[#34D399]" />
          Fecha del móvil: {formatDisplayDate(date)}
        </p>
      </header>

      <form
        onSubmit={handleSubmit}
        className="animate-fade-rise space-y-4 px-4 sm:px-6 md:px-1"
      >
        <section className="overflow-hidden rounded-2xl border border-[#D2DFD7] bg-white">
          <div className="border-b border-[#E4EDE8] p-4">
            <p className="font-mono text-[10.5px] font-semibold uppercase tracking-[0.14em] text-[#536B62]">
              Tipo de tarea
            </p>
            <div className="mt-2.5 flex flex-wrap gap-2">
              {taskTypes.map((type) => {
                const selected = taskType === type;
                return (
                  <button
                    key={type}
                    type="button"
                    onClick={() => setTaskType(type)}
                    className={`rounded-xl border px-3 py-2 text-[13px] font-semibold transition-all ${
                      selected
                        ? 'border-[#0B241E] bg-[#0B241E] text-white'
                        : 'border-[#D2DFD7] bg-[#F6FAF7] text-[#243D34]'
                    }`}
                  >
                    {type}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 border-b border-[#E4EDE8] p-4 sm:grid-cols-2">
            <label className="block">
              <span className="font-mono text-[10.5px] font-semibold uppercase tracking-[0.14em] text-[#536B62]">
                Equipo
              </span>
              <select
                value={teamId}
                onChange={(e) => setTeamId(e.target.value)}
                className="mt-2 w-full rounded-xl border border-[#CEDCD4] bg-[#F7FAF8] px-3 py-2.5 text-[14.5px] text-[#0E1F1A] focus:border-[#118A56] focus:outline-none focus:ring-2 focus:ring-[#118A56]/18"
              >
                {teams.map((team) => (
                  <option key={team.id} value={team.id}>
                    {team.name}
                  </option>
                ))}
              </select>
            </label>

            <label className="block">
              <span className="font-mono text-[10.5px] font-semibold uppercase tracking-[0.14em] text-[#536B62]">
                Zona de trabajo
              </span>
              <select
                value={effectiveZoneId}
                onChange={(e) => setZoneId(e.target.value)}
                className="mt-2 w-full rounded-xl border border-[#CEDCD4] bg-[#F7FAF8] px-3 py-2.5 text-[14.5px] text-[#0E1F1A] focus:border-[#118A56] focus:outline-none focus:ring-2 focus:ring-[#118A56]/18"
              >
                {availableZones.map((zone) => (
                  <option key={zone.id} value={zone.id}>
                    {zone.name}
                  </option>
                ))}
              </select>
            </label>
          </div>

          <div className="border-b border-[#E4EDE8] p-4">
            <p className="font-mono text-[10.5px] font-semibold uppercase tracking-[0.14em] text-[#536B62]">
              Estado
            </p>
            <div className="mt-2.5 grid grid-cols-3 gap-2">
              {STATUS_OPTIONS.map((opt) => {
                const active = status === opt.value;
                return (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => setStatus(opt.value)}
                    className={`rounded-xl border px-2 py-2.5 text-[13px] font-semibold ${
                      active
                        ? 'border-[#118A56] bg-[#E8F6EF] text-[#0B5133]'
                        : 'border-[#D2DFD7] bg-[#F7FAF8] text-[#2A423A]'
                    }`}
                  >
                    {opt.label}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="p-4">
            <label htmlFor="task-comment" className="block">
              <span className="font-mono text-[10.5px] font-semibold uppercase tracking-[0.14em] text-[#536B62]">
                Comentario de Sergio
              </span>
              <textarea
                id="task-comment"
                rows={4}
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Anota incidencias, material o detalle de la zona..."
                className="mt-2 w-full resize-none rounded-xl border border-[#CEDCD4] bg-[#F7FAF8] px-3.5 py-2.5 text-[14px] text-[#0E1F1A] placeholder:text-[#7F948C] focus:border-[#118A56] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#118A56]/18"
              />
            </label>
          </div>
        </section>

        <button
          type="submit"
          className="flex w-full items-center justify-center gap-2 rounded-2xl bg-[#118A56] px-5 py-3.5 text-[15px] font-semibold text-white shadow-[0_12px_24px_-12px_rgba(17,138,86,0.72)] active:scale-[0.985]"
        >
          <Check className="h-4.5 w-4.5" />
          {mode === 'create' ? 'Guardar tarea' : 'Guardar cambios'}
        </button>
      </form>
    </div>
  );
}
