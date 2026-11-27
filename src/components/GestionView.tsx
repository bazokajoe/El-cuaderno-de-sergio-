import { useMemo, useState } from 'react';
import { Check, Link2, MapPin, Plus, UsersRound } from 'lucide-react';
import type { Team, WorkZone } from '../types/task';

interface GestionViewProps {
  teams: Team[];
  zones: WorkZone[];
  onCreateTeam: (name: string, zoneIds: string[]) => void;
  onCreateZone: (name: string) => string;
  onUpdateTeamZones: (teamId: string, zoneIds: string[]) => void;
  focusCreate?: boolean;
}

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
  const [newZoneName, setNewZoneName] = useState('');
  const [editingTeamId, setEditingTeamId] = useState<string | null>(null);

  const editingTeam = useMemo(
    () => teams.find((t) => t.id === editingTeamId) ?? null,
    [teams, editingTeamId],
  );

  const toggleZone = (zoneId: string, list: string[], setList: (v: string[]) => void) => {
    setList(
      list.includes(zoneId)
        ? list.filter((id) => id !== zoneId)
        : [...list, zoneId],
    );
  };

  const handleCreateTeam = (e: React.FormEvent) => {
    e.preventDefault();
    const name = teamName.trim();
    if (!name || selectedZoneIds.length === 0) return;
    onCreateTeam(name, selectedZoneIds);
    setTeamName('');
    setSelectedZoneIds([]);
    setShowCreate(false);
  };

  const handleAddZone = () => {
    const name = newZoneName.trim();
    if (!name) return;
    const id = onCreateZone(name);
    setNewZoneName('');
    setSelectedZoneIds((prev) => [...prev, id]);
    if (editingTeam) {
      onUpdateTeamZones(editingTeam.id, [...editingTeam.zoneIds, id]);
    }
  };

  return (
    <div className="space-y-5">
      <header className="hero-atmosphere relative overflow-hidden rounded-b-[28px] px-5 pt-6 pb-6 text-white md:rounded-[28px]">
        <p className="font-mono text-[10.5px] uppercase tracking-[0.14em] text-[#9DD4BF]">
          Equipos y zonas
        </p>
        <h1 className="mt-2 font-display text-[2.1rem] font-extrabold tracking-[-0.03em]">
          Gestión
        </h1>
        <p className="mt-1.5 text-[13.5px] text-[#CBE3D8]">
          Crea equipos, añade zonas y enlázalas de forma sencilla.
        </p>
      </header>

      <div className="space-y-5 px-4 sm:px-6 md:px-1">
        <div className="flex items-center justify-between gap-3">
          <h2 className="font-display text-[1.25rem] font-bold text-[#0E1F1A]">
            Equipos
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
                placeholder="Ej. Equipo 5"
                className="mt-2 w-full rounded-xl border border-[#CEDCD4] bg-[#F7FAF8] px-3.5 py-2.5 text-[14.5px] focus:border-[#118A56] focus:outline-none focus:ring-2 focus:ring-[#118A56]/18"
              />
            </label>

            <div>
              <p className="font-mono text-[10.5px] font-semibold uppercase tracking-[0.14em] text-[#536B62]">
                Enlazar zonas de trabajo
              </p>
              <div className="mt-2 flex flex-wrap gap-2">
                {zones.map((zone) => {
                  const selected = selectedZoneIds.includes(zone.id);
                  return (
                    <button
                      key={zone.id}
                      type="button"
                      onClick={() =>
                        toggleZone(zone.id, selectedZoneIds, setSelectedZoneIds)
                      }
                      className={`rounded-xl border px-3 py-1.5 text-[12.5px] font-semibold ${
                        selected
                          ? 'border-[#0B241E] bg-[#0B241E] text-white'
                          : 'border-[#D2DFD7] bg-[#F6FAF7] text-[#243D34]'
                      }`}
                    >
                      {zone.name}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="flex gap-2">
              <input
                value={newZoneName}
                onChange={(e) => setNewZoneName(e.target.value)}
                placeholder="Nueva zona (ej. Son Ferriol)"
                className="flex-1 rounded-xl border border-[#CEDCD4] bg-[#F7FAF8] px-3 py-2.5 text-[13.5px] focus:border-[#118A56] focus:outline-none"
              />
              <button
                type="button"
                onClick={handleAddZone}
                className="rounded-xl border border-[#D2DFD7] bg-white px-3 py-2 text-[13px] font-semibold text-[#0B241E]"
              >
                Añadir
              </button>
            </div>

            <button
              type="submit"
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#0B241E] py-3 text-[14px] font-semibold text-white"
            >
              <Check className="h-4 w-4 text-[#34D399]" />
              Guardar equipo
            </button>
          </form>
        )}

        <div className="space-y-3">
          {teams.map((team) => {
            const linked = zones.filter((z) => team.zoneIds.includes(z.id));
            const isEditing = editingTeamId === team.id;
            return (
              <article
                key={team.id}
                className="rounded-2xl border border-[#D2DFD7] bg-white p-4"
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h3 className="inline-flex items-center gap-2 text-[16px] font-semibold text-[#0E1F1A]">
                      <UsersRound className="h-4.5 w-4.5 text-[#118A56]" />
                      {team.name}
                    </h3>
                    <p className="mt-1 text-[12.5px] text-[#5B7269]">
                      {linked.length} zona{linked.length === 1 ? '' : 's'} enlazada
                      {linked.length === 1 ? '' : 's'}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() =>
                      setEditingTeamId(isEditing ? null : team.id)
                    }
                    className="inline-flex items-center gap-1 rounded-lg bg-[#EEF4F1] px-2.5 py-1.5 text-[12px] font-semibold text-[#0E666B]"
                  >
                    <Link2 className="h-3.5 w-3.5" />
                    {isEditing ? 'Cerrar' : 'Enlazar'}
                  </button>
                </div>

                <div className="mt-3 flex flex-wrap gap-1.5">
                  {linked.map((zone) => (
                    <span
                      key={zone.id}
                      className="inline-flex items-center gap-1 rounded-md bg-[#F1F7F3] px-2 py-1 text-[12px] font-medium text-[#2A463C]"
                    >
                      <MapPin className="h-3 w-3 text-[#118A56]" />
                      {zone.name}
                    </span>
                  ))}
                </div>

                {isEditing && (
                  <div className="mt-3 border-t border-[#E4EDE8] pt-3">
                    <p className="mb-2 text-[12px] font-medium text-[#536B62]">
                      Marca las zonas de este equipo
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {zones.map((zone) => {
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
                            className={`rounded-xl border px-3 py-1.5 text-[12.5px] font-semibold ${
                              selected
                                ? 'border-[#118A56] bg-[#E8F6EF] text-[#0B5133]'
                                : 'border-[#D2DFD7] bg-[#F6FAF7] text-[#243D34]'
                            }`}
                          >
                            {zone.name}
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
