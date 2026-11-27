import { useMemo, useState } from 'react';
import {
  Check,
  ChevronDown,
  ChevronUp,
  Droplets,
  GraduationCap,
  Link2,
  MapPin,
  Plus,
  Search,
  UsersRound,
} from 'lucide-react';
import { formatZoneLabel, SCHOOL_ZONE_TAG } from '../data/mockData';
import type { Team, WorkZone } from '../types/task';

interface GestionViewProps {
  teams: Team[];
  zones: WorkZone[];
  onCreateTeam: (name: string, zoneIds: string[]) => void;
  onCreateZone: (
    name: string,
    options?: { code?: string; tag?: string },
  ) => string;
  onUpdateTeamZones: (teamId: string, zoneIds: string[]) => void;
  focusCreate?: boolean;
}

const PREVIEW_LIMIT = 6;

export function GestionView({
  teams,
  zones,
  onCreateTeam,
  onCreateZone,
  onUpdateTeamZones,
  focusCreate = false,
}: GestionViewProps) {
  const [showCreate, setShowCreate] = useState(focusCreate);
  const [teamName, setTeamName] = useState('');
  const [selectedZoneIds, setSelectedZoneIds] = useState<string[]>([]);
  const [newZoneCode, setNewZoneCode] = useState('');
  const [newZoneName, setNewZoneName] = useState('');
  const [newZoneIsSchool, setNewZoneIsSchool] = useState(false);
  const [editingTeamId, setEditingTeamId] = useState<string | null>(null);
  const [expandedTeamIds, setExpandedTeamIds] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [pickerQuery, setPickerQuery] = useState('');

  const editingTeam = useMemo(
    () => teams.find((t) => t.id === editingTeamId) ?? null,
    [teams, editingTeamId],
  );

  const normalizedQuery = searchQuery.trim().toLowerCase();

  const filteredPickerZones = useMemo(() => {
    const q = pickerQuery.trim().toLowerCase();
    if (!q) return zones;
    return zones.filter((z) =>
      `${z.code ?? ''} ${z.name} ${z.tag ?? ''}`.toLowerCase().includes(q),
    );
  }, [zones, pickerQuery]);

  const schoolCountTotal = useMemo(
    () => zones.filter((z) => z.tag === SCHOOL_ZONE_TAG).length,
    [zones],
  );

  const toggleZone = (
    zoneId: string,
    list: string[],
    setList: (v: string[]) => void,
  ) => {
    setList(
      list.includes(zoneId)
        ? list.filter((id) => id !== zoneId)
        : [...list, zoneId],
    );
  };

  const toggleExpanded = (teamId: string) => {
    setExpandedTeamIds((prev) =>
      prev.includes(teamId)
        ? prev.filter((id) => id !== teamId)
        : [...prev, teamId],
    );
  };

  const handleCreateTeam = (e: React.FormEvent) => {
    e.preventDefault();
    const name = teamName.trim();
    if (!name || selectedZoneIds.length === 0) return;
    onCreateTeam(name, selectedZoneIds);
    setTeamName('');
    setSelectedZoneIds([]);
    setPickerQuery('');
    setShowCreate(false);
  };

  const handleAddZone = () => {
    const name = newZoneName.trim();
    if (!name) return;
    const id = onCreateZone(name, {
      code: newZoneCode.trim() || undefined,
      tag: newZoneIsSchool ? SCHOOL_ZONE_TAG : undefined,
    });
    setNewZoneCode('');
    setNewZoneName('');
    setNewZoneIsSchool(false);
    setSelectedZoneIds((prev) => [...prev, id]);
    if (editingTeam && !editingTeam.allZones) {
      onUpdateTeamZones(editingTeam.id, [...editingTeam.zoneIds, id]);
    }
  };

  return (
    <div className="space-y-5">
      <header className="hero-atmosphere relative overflow-hidden rounded-b-[28px] px-5 pt-6 pb-6 text-white md:rounded-[28px]">
        <p className="font-mono text-[10.5px] uppercase tracking-[0.14em] text-[#9DD4BF]">
          {teams.length} equipos · {zones.length} zonas únicas · {schoolCountTotal} colegios
        </p>
        <h1 className="mt-2 font-display text-[2.1rem] font-extrabold tracking-[-0.03em]">
          Gestión
        </h1>
        <p className="mt-1.5 text-[13.5px] text-[#CBE3D8]">
          Equipos reales, zonas con código, colegios y Equipo de Riego global.
        </p>
      </header>

      <div className="space-y-4 px-4 sm:px-6 md:px-1">
        <div className="flex items-center justify-between gap-3">
          <h2 className="font-display text-[1.25rem] font-bold text-[#0E1F1A]">
            Equipos y zonas
          </h2>
          <button
            type="button"
            onClick={() => setShowCreate((v) => !v)}
            className="inline-flex items-center gap-1.5 rounded-xl bg-[#118A56] px-3 py-2 text-[13px] font-semibold text-white"
          >
            <Plus className="h-4 w-4" />
            Nuevo equipo
          </button>
        </div>

        <div className="relative">
          <Search className="pointer-events-none absolute top-1/2 left-3.5 h-4 w-4 -translate-y-1/2 text-[#6B8279]" />
          <input
            type="search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Buscar equipo, código, zona o colegio..."
            className="w-full rounded-xl border border-[#CEDCD4] bg-white py-2.5 pr-3.5 pl-10 text-[14px] text-[#0E1F1A] placeholder:text-[#7F948C] focus:border-[#118A56] focus:outline-none focus:ring-2 focus:ring-[#118A56]/18"
          />
        </div>

        {showCreate && (
          <form
            onSubmit={handleCreateTeam}
            className="animate-fade-rise space-y-3 rounded-2xl border border-[#D2DFD7] bg-white p-4"
          >
            <label className="block">
              <span className="font-mono text-[10.5px] font-semibold uppercase tracking-[0.14em] text-[#536B62]">
                Nombre del equipo
              </span>
              <input
                value={teamName}
                onChange={(e) => setTeamName(e.target.value)}
                placeholder="Ej. Equipo 17"
                className="mt-2 w-full rounded-xl border border-[#CEDCD4] bg-[#F7FAF8] px-3.5 py-2.5 text-[14.5px] focus:border-[#118A56] focus:outline-none focus:ring-2 focus:ring-[#118A56]/18"
              />
            </label>

            <div>
              <div className="flex items-center justify-between gap-2">
                <p className="font-mono text-[10.5px] font-semibold uppercase tracking-[0.14em] text-[#536B62]">
                  Enlazar zonas ({selectedZoneIds.length} seleccionadas)
                </p>
              </div>
              <input
                type="search"
                value={pickerQuery}
                onChange={(e) => setPickerQuery(e.target.value)}
                placeholder="Filtrar entre las zonas existentes..."
                className="mt-2 w-full rounded-xl border border-[#CEDCD4] bg-[#F7FAF8] px-3 py-2 text-[13px] focus:border-[#118A56] focus:outline-none"
              />
              <div className="mt-2 flex max-h-48 flex-wrap gap-1.5 overflow-y-auto pr-1">
                {filteredPickerZones.map((zone) => {
                  const selected = selectedZoneIds.includes(zone.id);
                  return (
                    <button
                      key={zone.id}
                      type="button"
                      onClick={() =>
                        toggleZone(zone.id, selectedZoneIds, setSelectedZoneIds)
                      }
                      className={`rounded-xl border px-2.5 py-1.5 text-left text-[12px] font-semibold ${
                        selected
                          ? 'border-[#0B241E] bg-[#0B241E] text-white'
                          : 'border-[#D2DFD7] bg-[#F6FAF7] text-[#243D34]'
                      }`}
                    >
                      {formatZoneLabel(zone)}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="space-y-2 rounded-xl border border-[#E4EDE8] bg-[#F7FAF8] p-3">
              <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.12em] text-[#536B62]">
                Añadir nueva zona
              </p>
              <div className="flex gap-2">
                <input
                  value={newZoneCode}
                  onChange={(e) => setNewZoneCode(e.target.value)}
                  placeholder="Código (opc.)"
                  className="w-28 rounded-xl border border-[#CEDCD4] bg-white px-2.5 py-2 text-[13px] font-mono focus:border-[#118A56] focus:outline-none"
                />
                <input
                  value={newZoneName}
                  onChange={(e) => setNewZoneName(e.target.value)}
                  placeholder="Nombre de la zona"
                  className="flex-1 rounded-xl border border-[#CEDCD4] bg-white px-3 py-2 text-[13.5px] focus:border-[#118A56] focus:outline-none"
                />
                <button
                  type="button"
                  onClick={handleAddZone}
                  className="rounded-xl border border-[#D2DFD7] bg-white px-3 py-2 text-[13px] font-semibold text-[#0B241E]"
                >
                  Añadir
                </button>
              </div>
              <label className="inline-flex cursor-pointer items-center gap-2 text-[12.5px] font-medium text-[#364F46]">
                <input
                  type="checkbox"
                  checked={newZoneIsSchool}
                  onChange={(e) => setNewZoneIsSchool(e.target.checked)}
                  className="h-4 w-4 rounded border-[#B8CBC1] accent-[#118A56]"
                />
                {SCHOOL_ZONE_TAG}
              </label>
            </div>

            <button
              type="submit"
              disabled={!teamName.trim() || selectedZoneIds.length === 0}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#0B241E] py-3 text-[14px] font-semibold text-white disabled:opacity-45"
            >
              <Check className="h-4 w-4 text-[#34D399]" />
              Guardar equipo
            </button>
          </form>
        )}

        <div className="space-y-3">
          {teams.map((team) => {
            const isIrrigation = Boolean(team.allZones);
            const linked = isIrrigation
              ? []
              : zones.filter((z) => team.zoneIds.includes(z.id));

            const matchingZones = normalizedQuery
              ? linked.filter((z) =>
                  `${z.code ?? ''} ${z.name} ${z.tag ?? ''}`
                    .toLowerCase()
                    .includes(normalizedQuery),
                )
              : linked;

            const teamMatchesQuery =
              !normalizedQuery ||
              `${team.name} ${team.description ?? ''} ${(team.taskTypes ?? []).join(' ')}`
                .toLowerCase()
                .includes(normalizedQuery) ||
              matchingZones.length > 0;

            if (!teamMatchesQuery) return null;

            const schoolCount = linked.filter((z) => z.tag === SCHOOL_ZONE_TAG).length;
            const isEditing = editingTeamId === team.id;
            const isExpanded =
              expandedTeamIds.includes(team.id) || Boolean(normalizedQuery);
            const displayZones = normalizedQuery
              ? matchingZones.length > 0
                ? matchingZones
                : linked
              : linked;
            const visibleZones = isExpanded
              ? displayZones
              : displayZones.slice(0, PREVIEW_LIMIT);
            const hiddenCount = displayZones.length - visibleZones.length;

            return (
              <article
                key={team.id}
                className={`rounded-2xl border bg-white p-4 ${
                  isIrrigation ? 'border-[#A7D5DA]' : 'border-[#D2DFD7]'
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <h3 className="inline-flex items-center gap-2 text-[16px] font-semibold text-[#0E1F1A]">
                      {isIrrigation ? (
                        <Droplets className="h-4.5 w-4.5 shrink-0 text-[#0E666B]" />
                      ) : (
                        <UsersRound className="h-4.5 w-4.5 shrink-0 text-[#118A56]" />
                      )}
                      {team.name}
                    </h3>
                    <p className="mt-1 text-[12.5px] text-[#5B7269]">
                      {isIrrigation ? (
                        <>
                          Sin zonas propias · Acceso a las {zones.length} zonas
                        </>
                      ) : (
                        <>
                          {linked.length} zona{linked.length === 1 ? '' : 's'}
                          {schoolCount > 0
                            ? ` (incl. ${schoolCount} colegio${schoolCount === 1 ? '' : 's'})`
                            : ''}
                          {team.description ? ` · ${team.description}` : ''}
                        </>
                      )}
                    </p>
                  </div>
                  {!isIrrigation && (
                    <button
                      type="button"
                      onClick={() => {
                        setPickerQuery('');
                        setEditingTeamId(isEditing ? null : team.id);
                      }}
                      className="inline-flex shrink-0 items-center gap-1 rounded-lg bg-[#EEF4F1] px-2.5 py-1.5 text-[12px] font-semibold text-[#0E666B]"
                    >
                      <Link2 className="h-3.5 w-3.5" />
                      {isEditing ? 'Cerrar' : 'Enlazar'}
                    </button>
                  )}
                </div>

                {isIrrigation ? (
                  <div className="mt-3 space-y-2">
                    <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.12em] text-[#536B62]">
                      Tipos de avería de riego
                    </p>
                    <div className="flex flex-wrap gap-1.5">
                      {(team.taskTypes ?? []).map((type) => (
                        <span
                          key={type}
                          className="inline-flex items-center gap-1 rounded-md bg-[#E6F4F6] px-2.5 py-1 text-[12px] font-semibold text-[#0E666B]"
                        >
                          <Droplets className="h-3 w-3" />
                          {type}
                        </span>
                      ))}
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="mt-3 flex flex-wrap gap-1.5">
                      {visibleZones.map((zone) => {
                        const isSchool = zone.tag === SCHOOL_ZONE_TAG;
                        return (
                          <span
                            key={zone.id}
                            className={`inline-flex flex-wrap items-center gap-1 rounded-md px-2 py-1 text-[12px] font-medium ${
                              isSchool
                                ? 'border border-[#F59E0B]/35 bg-[#FEF3C7]/70 text-[#78350F]'
                                : 'bg-[#F1F7F3] text-[#2A463C]'
                            }`}
                          >
                            {isSchool ? (
                              <GraduationCap className="h-3 w-3 shrink-0 text-[#B45309]" />
                            ) : (
                              <MapPin className="h-3 w-3 shrink-0 text-[#118A56]" />
                            )}
                            {zone.code && (
                              <span className="font-mono text-[11px] font-semibold opacity-80">
                                {zone.code}
                              </span>
                            )}
                            <span>{zone.name}</span>
                            {isSchool && (
                              <span className="rounded bg-[#FDE68A] px-1.5 py-0.5 text-[10px] font-semibold text-[#92400E]">
                                {zone.tag}
                              </span>
                            )}
                          </span>
                        );
                      })}
                    </div>

                    {!normalizedQuery && displayZones.length > PREVIEW_LIMIT && (
                      <button
                        type="button"
                        onClick={() => toggleExpanded(team.id)}
                        className="mt-2.5 inline-flex items-center gap-1 text-[12.5px] font-semibold text-[#0E666B]"
                      >
                        {isExpanded ? (
                          <>
                            <ChevronUp className="h-3.5 w-3.5" />
                            Mostrar menos
                          </>
                        ) : (
                          <>
                            <ChevronDown className="h-3.5 w-3.5" />
                            Ver {hiddenCount} más ({displayZones.length} en total)
                          </>
                        )}
                      </button>
                    )}
                  </>
                )}

                {isEditing && !isIrrigation && (
                  <div className="mt-3 border-t border-[#E4EDE8] pt-3">
                    <p className="mb-2 text-[12px] font-medium text-[#536B62]">
                      Marca las zonas de este equipo
                    </p>
                    <input
                      type="search"
                      value={pickerQuery}
                      onChange={(e) => setPickerQuery(e.target.value)}
                      placeholder="Filtrar zonas por código o nombre..."
                      className="mb-2 w-full rounded-xl border border-[#CEDCD4] bg-[#F7FAF8] px-3 py-2 text-[13px] focus:border-[#118A56] focus:outline-none"
                    />
                    <div className="flex max-h-56 flex-wrap gap-1.5 overflow-y-auto pr-1">
                      {filteredPickerZones.map((zone) => {
                        const selected = team.zoneIds.includes(zone.id);
                        return (
                          <button
                            key={zone.id}
                            type="button"
                            onClick={() => {
                              const next = selected
                                ? team.zoneIds.filter((id) => id !== zone.id)
                                : [...team.zoneIds, zone.id];
                              onUpdateTeamZones(team.id, next);
                            }}
                            className={`rounded-xl border px-2.5 py-1.5 text-left text-[12px] font-semibold ${
                              selected
                                ? 'border-[#118A56] bg-[#E8F6EF] text-[#0B5133]'
                                : 'border-[#D2DFD7] bg-[#F6FAF7] text-[#243D34]'
                            }`}
                          >
                            {formatZoneLabel(zone)}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}
              </article>
            );
          })}
        </div>
      </div>
    </div>
  );
}
