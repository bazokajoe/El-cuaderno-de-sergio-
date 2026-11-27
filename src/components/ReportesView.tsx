import { useMemo, useState } from 'react';
import { Download, FileBarChart2 } from 'lucide-react';
import type { ReportGroupBy, Task, Team, WorkZone } from '../types/task';

interface ReportesViewProps {
  tasks: Task[];
  teams: Team[];
  zones: WorkZone[];
  taskTypes: string[];
}

const GROUP_OPTIONS: { value: ReportGroupBy; label: string }[] = [
  { value: 'fecha', label: 'Fecha' },
  { value: 'equipo', label: 'Equipo' },
  { value: 'zona', label: 'Zona' },
  { value: 'tipo', label: 'Tipo de tarea' },
  { value: 'estado', label: 'Estado' },
];

export function ReportesView({
  tasks,
  teams,
  zones,
  taskTypes,
}: ReportesViewProps) {
  const [groupBy, setGroupBy] = useState<ReportGroupBy>('equipo');
  const [teamFilter, setTeamFilter] = useState('all');
  const [zoneFilter, setZoneFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [pdfBusy, setPdfBusy] = useState(false);

  const filtered = useMemo(() => {
    return tasks.filter((task) => {
      if (teamFilter !== 'all' && task.teamId !== teamFilter) return false;
      if (zoneFilter !== 'all' && task.zoneId !== zoneFilter) return false;
      if (typeFilter !== 'all' && task.taskType !== typeFilter) return false;
      if (dateFrom && task.date < dateFrom) return false;
      if (dateTo && task.date > dateTo) return false;
      return true;
    });
  }, [tasks, teamFilter, zoneFilter, typeFilter, dateFrom, dateTo]);

  const rows = useMemo(() => {
    const map = new Map<
      string,
      { label: string; todo: number; doing: number; done: number }
    >();

    const labelFor = (task: Task): string => {
      switch (groupBy) {
        case 'fecha':
          return task.date;
        case 'equipo':
          return teams.find((t) => t.id === task.teamId)?.name ?? 'Equipo';
        case 'zona':
          return zones.find((z) => z.id === task.zoneId)?.name ?? 'Zona';
        case 'tipo':
          return task.taskType;
        case 'estado':
          return task.status === 'TODO'
            ? 'Por hacer'
            : task.status === 'DOING'
              ? 'En curso'
              : 'Hechas';
      }
    };

    for (const task of filtered) {
      const label = labelFor(task);
      const current = map.get(label) ?? {
        label,
        todo: 0,
        doing: 0,
        done: 0,
      };
      if (task.status === 'TODO') current.todo += 1;
      if (task.status === 'DOING') current.doing += 1;
      if (task.status === 'DONE') current.done += 1;
      map.set(label, current);
    }

    return Array.from(map.values()).sort((a, b) =>
      a.label.localeCompare(b.label, 'es'),
    );
  }, [filtered, groupBy, teams, zones]);

  const handleGeneratePdf = async () => {
    if (rows.length === 0 || pdfBusy) return;
    setPdfBusy(true);
    try {
      const { generateReportPdf } = await import('../data/reportPdf');
      generateReportPdf({
        rows,
        tasks: filtered,
        teams,
        zones,
        groupByLabel:
          GROUP_OPTIONS.find((o) => o.value === groupBy)?.label ?? groupBy,
        filters: {
          dateFrom,
          dateTo,
          team:
            teamFilter === 'all'
              ? 'Todos'
              : (teams.find((t) => t.id === teamFilter)?.name ?? 'Todos'),
          zone:
            zoneFilter === 'all'
              ? 'Todas'
              : (zones.find((z) => z.id === zoneFilter)?.name ?? 'Todas'),
          type: typeFilter === 'all' ? 'Todos' : typeFilter,
        },
      });
    } finally {
      window.setTimeout(() => setPdfBusy(false), 400);
    }
  };

  return (
    <div className="space-y-5">
      <header className="hero-atmosphere relative overflow-hidden rounded-b-[28px] px-5 pt-6 pb-6 text-white md:rounded-[28px]">
        <p className="font-mono text-[10.5px] uppercase tracking-[0.14em] text-[#9DD4BF]">
          Análisis de campo
        </p>
        <h1 className="mt-2 font-display text-[2.1rem] font-extrabold tracking-[-0.03em]">
          Reportes
        </h1>
        <p className="mt-1.5 text-[13.5px] text-[#CBE3D8]">
          Filtra, agrupa y descarga el resultado en PDF.
        </p>
      </header>

      <div className="space-y-4 px-4 sm:px-6 md:px-1">
        <section className="space-y-3 rounded-2xl border border-[#D2DFD7] bg-white p-4">
          <div className="grid grid-cols-2 gap-3">
            <label className="block">
              <span className="font-mono text-[10px] font-semibold uppercase tracking-[0.12em] text-[#536B62]">
                Desde
              </span>
              <input
                type="date"
                value={dateFrom}
                onChange={(e) => setDateFrom(e.target.value)}
                className="mt-1.5 w-full rounded-xl border border-[#CEDCD4] bg-[#F7FAF8] px-3 py-2 text-[13.5px] focus:border-[#118A56] focus:outline-none"
              />
            </label>
            <label className="block">
              <span className="font-mono text-[10px] font-semibold uppercase tracking-[0.12em] text-[#536B62]">
                Hasta
              </span>
              <input
                type="date"
                value={dateTo}
                onChange={(e) => setDateTo(e.target.value)}
                className="mt-1.5 w-full rounded-xl border border-[#CEDCD4] bg-[#F7FAF8] px-3 py-2 text-[13.5px] focus:border-[#118A56] focus:outline-none"
              />
            </label>
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
            <label className="block">
              <span className="font-mono text-[10px] font-semibold uppercase tracking-[0.12em] text-[#536B62]">
                Equipo
              </span>
              <select
                value={teamFilter}
                onChange={(e) => setTeamFilter(e.target.value)}
                className="mt-1.5 w-full rounded-xl border border-[#CEDCD4] bg-[#F7FAF8] px-3 py-2 text-[13.5px]"
              >
                <option value="all">Todos</option>
                {teams.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.name}
                  </option>
                ))}
              </select>
            </label>
            <label className="block">
              <span className="font-mono text-[10px] font-semibold uppercase tracking-[0.12em] text-[#536B62]">
                Zona
              </span>
              <select
                value={zoneFilter}
                onChange={(e) => setZoneFilter(e.target.value)}
                className="mt-1.5 w-full rounded-xl border border-[#CEDCD4] bg-[#F7FAF8] px-3 py-2 text-[13.5px]"
              >
                <option value="all">Todas</option>
                {zones.map((z) => (
                  <option key={z.id} value={z.id}>
                    {z.name}
                  </option>
                ))}
              </select>
            </label>
            <label className="block">
              <span className="font-mono text-[10px] font-semibold uppercase tracking-[0.12em] text-[#536B62]">
                Tipo
              </span>
              <select
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
                className="mt-1.5 w-full rounded-xl border border-[#CEDCD4] bg-[#F7FAF8] px-3 py-2 text-[13.5px]"
              >
                <option value="all">Todos</option>
                {taskTypes.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </label>
          </div>

          <div>
            <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.12em] text-[#536B62]">
              Agrupar por
            </p>
            <div className="mt-2 flex flex-wrap gap-2">
              {GROUP_OPTIONS.map((opt) => {
                const active = groupBy === opt.value;
                return (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => setGroupBy(opt.value)}
                    className={`rounded-xl border px-3 py-1.5 text-[12.5px] font-semibold ${
                      active
                        ? 'border-[#0B241E] bg-[#0B241E] text-white'
                        : 'border-[#D2DFD7] bg-[#F6FAF7] text-[#243D34]'
                    }`}
                  >
                    {opt.label}
                  </button>
                );
              })}
            </div>
          </div>
        </section>

        <button
          type="button"
          onClick={handleGeneratePdf}
          disabled={rows.length === 0 || pdfBusy}
          className="flex w-full items-center justify-center gap-2 rounded-2xl bg-[#0B241E] px-5 py-3.5 text-[15px] font-semibold text-white shadow-[0_12px_24px_-12px_rgba(11,36,30,0.55)] disabled:opacity-45 active:scale-[0.985]"
        >
          <Download className="h-4.5 w-4.5 text-[#34D399]" />
          {pdfBusy ? 'Generando PDF…' : 'Generar PDF'}
        </button>

        <section className="overflow-hidden rounded-2xl border border-[#D2DFD7] bg-white">
          <div className="flex items-center justify-between border-b border-[#E4EDE8] px-4 py-3">
            <h2 className="inline-flex items-center gap-2 text-[15px] font-semibold text-[#0E1F1A]">
              <FileBarChart2 className="h-4.5 w-4.5 text-[#118A56]" />
              Resultado
            </h2>
            <span className="font-mono text-[11px] text-[#5B7269]">
              {filtered.length} registros
            </span>
          </div>

          {rows.length === 0 ? (
            <p className="px-4 py-8 text-center text-[13.5px] text-[#5E746C]">
              No hay datos con estos filtros.
            </p>
          ) : (
            <div className="divide-y divide-[#E4EDE8]">
              {rows.map((row) => (
                <div
                  key={row.label}
                  className="grid grid-cols-[1fr_auto] gap-3 px-4 py-3"
                >
                  <div>
                    <p className="text-[14px] font-semibold text-[#0E1F1A]">
                      {row.label}
                    </p>
                    <p className="mt-0.5 text-[12px] text-[#5B7269]">
                      Total {row.todo + row.doing + row.done}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 font-mono text-[11px]">
                    <span className="rounded-md bg-[#FEF08A]/70 px-1.5 py-0.5 text-[#633906]">
                      {row.todo}
                    </span>
                    <span className="rounded-md bg-[#D1FAE5] px-1.5 py-0.5 text-[#065F46]">
                      {row.doing}
                    </span>
                    <span className="rounded-md bg-[#E8EEF0] px-1.5 py-0.5 text-[#334155]">
                      {row.done}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
