import {
  ClipboardList,
  FileBarChart2,
  Plus,
  Send,
  UsersRound,
  X,
} from 'lucide-react';
import type { FabAction } from '../types/task';

interface FabMenuProps {
  open: boolean;
  onToggle: () => void;
  onAction: (action: FabAction) => void;
}

const ACTIONS: {
  id: FabAction;
  label: string;
  hint: string;
  icon: typeof Plus;
}[] = [
  {
    id: 'nueva-tarea',
    label: 'Crear nueva tarea',
    hint: 'Alta rápida con fecha del móvil',
    icon: ClipboardList,
  },
  {
    id: 'nueva-gestion',
    label: 'Nueva Gestión',
    hint: 'Equipo y zonas de trabajo',
    icon: UsersRound,
  },
  {
    id: 'enviar-tareas',
    label: 'Enviar Tareas',
    hint: 'Preparar envío del parte',
    icon: Send,
  },
  {
    id: 'crear-reporte',
    label: 'Crear reporte',
    hint: 'Por fecha, equipo o zona',
    icon: FileBarChart2,
  },
];

export function FabMenu({ open, onToggle, onAction }: FabMenuProps) {
  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-0 z-50 flex justify-end px-4 md:justify-center">
      <div className="relative w-full max-w-3xl">
        <div className="pointer-events-auto absolute right-0 bottom-[calc(4.85rem+env(safe-area-inset-bottom,0px))] flex flex-col items-end gap-3 md:right-6">
          {open && (
            <div
              className="animate-fab-pop flex w-[min(18.5rem,calc(100vw-2.5rem))] flex-col overflow-hidden rounded-2xl border border-[#C8D8CF] bg-white shadow-[0_18px_40px_-16px_rgba(7,26,21,0.45)]"
              role="menu"
              aria-label="Acciones rápidas"
            >
              {ACTIONS.map((action, idx) => {
                const Icon = action.icon;
                return (
                  <button
                    key={action.id}
                    type="button"
                    role="menuitem"
                    onClick={() => onAction(action.id)}
                    className={`flex items-start gap-3 px-3.5 py-3 text-left transition-colors hover:bg-[#F1F7F3] active:bg-[#E7F1EB] ${
                      idx > 0 ? 'border-t border-[#E4EDE8]' : ''
                    }`}
                  >
                    <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#E8F6EF] text-[#118A56]">
                      <Icon className="h-4.5 w-4.5" strokeWidth={2.2} />
                    </span>
                    <span>
                      <span className="block text-[14px] font-semibold text-[#0E1F1A]">
                        {action.label}
                      </span>
                      <span className="mt-0.5 block text-[12px] text-[#5B7269]">
                        {action.hint}
                      </span>
                    </span>
                  </button>
                );
              })}
            </div>
          )}

          <button
            type="button"
            aria-label={open ? 'Cerrar menú de acciones' : 'Abrir menú de acciones'}
            aria-expanded={open}
            onClick={onToggle}
            className={`flex h-14 w-14 items-center justify-center rounded-full text-white shadow-[0_14px_28px_-10px_rgba(17,138,86,0.75)] transition-all active:scale-95 ${
              open
                ? 'bg-[#0B241E] rotate-0'
                : 'bg-[#118A56] hover:bg-[#0E7548]'
            }`}
          >
            {open ? (
              <X className="h-6 w-6" strokeWidth={2.4} />
            ) : (
              <Plus className="h-7 w-7" strokeWidth={2.4} />
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
