import { useMemo, useState } from 'react';
import {
  ArrowLeft,
  Check,
  CheckCircle2,
  Clock3,
  MessageCircle,
  Send,
} from 'lucide-react';
import type { SentRecord, Task, Team, WorkZone } from '../types/task';
import { formatDateTime, formatDisplayDate, formatZoneLabel } from '../data/mockData';

interface EnviarViewProps {
  sent: SentRecord[];
  tasks: Task[];
  teams: Team[];
  zones: WorkZone[];
  onRecordSent: (record: Omit<SentRecord, 'id' | 'sentAt' | 'status'>) => void;
}

type SendStep = 'lista' | 'equipo' | 'checklist';

const STATUS_LABEL: Record<Task['status'], string> = {
  TODO: 'Por hacer',
  DOING: 'En curso',
  DONE: 'Hecha',
};

function buildWhatsAppMessage(
  teamName: string,
  selected: Task[],
  zones: WorkZone[],
): string {
  const lines = selected.map((task) => {
    const zone = formatZoneLabel(zones.find((z) => z.id === task.zoneId));
    return `• ${task.taskType} · ${zone}`;
  });

  return [
    `Parte ${teamName}`,
    formatDisplayDate(new Date().toISOString().slice(0, 10)),
    '',
    ...lines,
    '',
    'Listo. Sergio',
  ].join('\n');
}

export function EnviarView({
  sent,
  tasks,
  teams,
  zones,
  onRecordSent,
}: EnviarViewProps) {
  const [step, setStep] = useState<SendStep>('lista');
  const [teamId, setTeamId] = useState(teams[0]?.id ?? '');
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const teamTasks = useMemo(
    () => tasks.filter((t) => t.teamId === teamId),
    [tasks, teamId],
  );

  const selectedTasks = useMemo(
    () => teamTasks.filter((t) => selectedIds.includes(t.id)),
    [teamTasks, selectedIds],
  );

  const teamName = teams.find((t) => t.id === teamId)?.name ?? 'Equipo';

  const startSend = () => {
    setStep('equipo');
    setSelectedIds([]);
  };

  const openChecklist = () => {
    // Pre-check DONE + DOING for the chosen team
    setSelectedIds(
      teamTasks
        .filter((t) => t.status === 'DONE' || t.status === 'DOING')
        .map((t) => t.id),
    );
    setStep('checklist');
  };

  const toggleTask = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
    );
  };

  const sendWhatsApp = () => {
    if (selectedTasks.length === 0) return;
    const message = buildWhatsAppMessage(teamName, selectedTasks, zones);
    const url = `https://wa.me/?text=${encodeURIComponent(message)}`;

    const firstZoneObj = zones.find((z) => z.id === selectedTasks[0]?.zoneId);
    const firstZone = firstZoneObj
      ? formatZoneLabel(firstZoneObj)
      : 'Varias zonas';

    onRecordSent({
      summary: `WhatsApp · ${teamName}`,
      taskCount: selectedTasks.length,
      teamName,
      zoneName: firstZone,
    });

    window.open(url, '_blank', 'noopener,noreferrer');
    setStep('lista');
    setSelectedIds([]);
  };

  return (
    <div className="space-y-5">
      <header className="hero-atmosphere relative overflow-hidden rounded-b-[28px] px-5 pt-6 pb-6 text-white md:rounded-[28px]">
        <p className="font-mono text-[10.5px] uppercase tracking-[0.14em] text-[#9DD4BF]">
          Partes y envíos
        </p>
        <h1 className="mt-2 font-display text-[2.1rem] font-extrabold tracking-[-0.03em]">
          Enviar
        </h1>
        <p className="mt-1.5 text-[13.5px] text-[#CBE3D8]">
          Selecciona equipo, marca el checklist y comparte por WhatsApp.
        </p>
      </header>

      <div className="space-y-4 px-4 sm:px-6 md:px-1">
        {step === 'lista' && (
          <>
            <section className="rounded-2xl border border-[#D2DFD7] bg-white p-4">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h2 className="text-[15px] font-semibold text-[#0E1F1A]">
                    Enviar ahora
                  </h2>
                  <p className="mt-1 text-[13px] text-[#5B7269]">
                    Comparte el parte breve por WhatsApp
                  </p>
                </div>
                <button
                  type="button"
                  onClick={startSend}
                  className="inline-flex items-center gap-1.5 rounded-xl bg-[#128C7E] px-3.5 py-2.5 text-[13px] font-semibold text-white"
                >
                  <MessageCircle className="h-4 w-4" />
                  Enviar ahora
                </button>
              </div>
            </section>

            <section>
              <h2 className="mb-3 font-display text-[1.25rem] font-bold text-[#0E1F1A]">
                Últimos registros enviados
              </h2>
              <div className="space-y-3">
                {sent.map((record, idx) => (
                  <article
                    key={record.id}
                    style={{ animationDelay: `${idx * 45}ms` }}
                    className="animate-fade-rise rounded-2xl border border-[#D2DFD7] bg-white p-4"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <p className="inline-flex items-center gap-1.5 font-mono text-[11px] font-semibold text-[#0E666B]">
                          <CheckCircle2 className="h-3.5 w-3.5" />
                          Enviado
                        </p>
                        <h3 className="mt-1 text-[15px] font-semibold text-[#0E1F1A]">
                          {record.summary}
                        </h3>
                      </div>
                      <span className="font-mono text-[11px] text-[#5B7269]">
                        {record.taskCount}
                      </span>
                    </div>
                    <p className="mt-2 text-[13px] text-[#4B635B]">
                      {record.teamName} · {record.zoneName}
                    </p>
                    <p className="mt-1.5 inline-flex items-center gap-1 text-[12px] text-[#667D74]">
                      <Clock3 className="h-3.5 w-3.5" />
                      {formatDateTime(record.sentAt)}
                    </p>
                  </article>
                ))}
              </div>
            </section>
          </>
        )}

        {step === 'equipo' && (
          <section className="animate-fade-rise space-y-4 rounded-2xl border border-[#D2DFD7] bg-white p-4">
            <button
              type="button"
              onClick={() => setStep('lista')}
              className="inline-flex items-center gap-1.5 text-[13px] font-medium text-[#5B7269]"
            >
              <ArrowLeft className="h-4 w-4" />
              Volver
            </button>

            <div>
              <h2 className="text-[16px] font-semibold text-[#0E1F1A]">
                Selecciona equipo
              </h2>
              <p className="mt-1 text-[13px] text-[#5B7269]">
                Luego verás el checklist para WhatsApp
              </p>
            </div>

            <div className="space-y-2">
              {teams.map((team) => {
                const count = tasks.filter((t) => t.teamId === team.id).length;
                const active = teamId === team.id;
                return (
                  <button
                    key={team.id}
                    type="button"
                    onClick={() => setTeamId(team.id)}
                    className={`flex w-full items-center justify-between rounded-xl border px-3.5 py-3 text-left ${
                      active
                        ? 'border-[#118A56] bg-[#E8F6EF]'
                        : 'border-[#D2DFD7] bg-[#F7FAF8]'
                    }`}
                  >
                    <span className="text-[14.5px] font-semibold text-[#0E1F1A]">
                      {team.name}
                    </span>
                    <span className="font-mono text-[11px] text-[#5B7269]">
                      {count}
                    </span>
                  </button>
                );
              })}
            </div>

            <button
              type="button"
              onClick={openChecklist}
              disabled={!teamId}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#0B241E] py-3 text-[14px] font-semibold text-white disabled:opacity-50"
            >
              Continuar
            </button>
          </section>
        )}

        {step === 'checklist' && (
          <section className="animate-fade-rise space-y-4 rounded-2xl border border-[#D2DFD7] bg-white p-4">
            <button
              type="button"
              onClick={() => setStep('equipo')}
              className="inline-flex items-center gap-1.5 text-[13px] font-medium text-[#5B7269]"
            >
              <ArrowLeft className="h-4 w-4" />
              Cambiar equipo
            </button>

            <div>
              <h2 className="text-[16px] font-semibold text-[#0E1F1A]">
                Checklist · {teamName}
              </h2>
              <p className="mt-1 text-[13px] text-[#5B7269]">
                Marca lo que quieres incluir en el mensaje
              </p>
            </div>

            {teamTasks.length === 0 ? (
              <p className="py-6 text-center text-[13.5px] text-[#5E746C]">
                Este equipo no tiene registros todavía.
              </p>
            ) : (
              <div className="divide-y divide-[#E4EDE8] overflow-hidden rounded-xl border border-[#E4EDE8]">
                {teamTasks.map((task) => {
                  const checked = selectedIds.includes(task.id);
                  const zone = formatZoneLabel(
                    zones.find((z) => z.id === task.zoneId),
                  );
                  return (
                    <button
                      key={task.id}
                      type="button"
                      onClick={() => toggleTask(task.id)}
                      className="flex w-full items-start gap-3 px-3.5 py-3 text-left hover:bg-[#F4F8F6]"
                    >
                      <span
                        className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-md border ${
                          checked
                            ? 'border-[#118A56] bg-[#118A56] text-white'
                            : 'border-[#B8CBC1] bg-white'
                        }`}
                      >
                        {checked && <Check className="h-3.5 w-3.5" strokeWidth={2.5} />}
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="block text-[14px] font-semibold text-[#0E1F1A]">
                          {task.taskType}
                        </span>
                        <span className="mt-0.5 block text-[12.5px] text-[#5B7269]">
                          {zone} · {STATUS_LABEL[task.status]}
                        </span>
                      </span>
                    </button>
                  );
                })}
              </div>
            )}

            {selectedTasks.length > 0 && (
              <div className="rounded-xl bg-[#F1F7F3] px-3.5 py-3">
                <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.12em] text-[#536B62]">
                  Vista previa del mensaje
                </p>
                <pre className="mt-1.5 whitespace-pre-wrap font-sans text-[12.5px] leading-relaxed text-[#243D34]">
                  {buildWhatsAppMessage(teamName, selectedTasks, zones)}
                </pre>
              </div>
            )}

            <button
              type="button"
              onClick={sendWhatsApp}
              disabled={selectedTasks.length === 0}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#128C7E] py-3.5 text-[15px] font-semibold text-white disabled:opacity-50"
            >
              <Send className="h-4.5 w-4.5" />
              Enviar por WhatsApp
            </button>
          </section>
        )}
      </div>
    </div>
  );
}
