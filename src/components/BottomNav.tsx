import { FileBarChart2, Home, Send, UsersRound } from 'lucide-react';
import type { TabId } from '../types/task';

interface BottomNavProps {
  activeTab: TabId;
  onChangeTab: (tab: TabId) => void;
  doingCount: number;
}

const ITEMS: { id: TabId; label: string; icon: typeof Home }[] = [
  { id: 'inicio', label: 'Inicio', icon: Home },
  { id: 'gestion', label: 'Gestión', icon: UsersRound },
  { id: 'enviar', label: 'Enviar', icon: Send },
  { id: 'reportes', label: 'Reportes', icon: FileBarChart2 },
];

export function BottomNav({
  activeTab,
  onChangeTab,
  doingCount,
}: BottomNavProps) {
  return (
    <nav
      aria-label="Navegación principal"
      className="fixed inset-x-0 bottom-0 z-40 md:bottom-5 md:flex md:justify-center md:px-4"
    >
      <div className="bottom-nav-safe mx-auto grid w-full grid-cols-4 items-center border-t border-[#D2DFD7] bg-white/96 px-1.5 pt-1.5 backdrop-blur-xl shadow-[0_-10px_28px_-16px_rgba(7,26,21,0.3)] md:max-w-md md:rounded-3xl md:border md:border-[#C8D8CF] md:px-2 md:py-2 md:shadow-[0_18px_38px_-14px_rgba(7,26,21,0.35)]">
        {ITEMS.map(({ id, label, icon: Icon }) => {
          const isActive = activeTab === id;
          return (
            <button
              key={id}
              type="button"
              onClick={() => onChangeTab(id)}
              aria-current={isActive ? 'page' : undefined}
              className="group relative flex flex-col items-center justify-center gap-0.5 py-1 focus-visible:outline-none"
            >
              <span
                className={`relative flex h-9 w-12 items-center justify-center rounded-2xl transition-all duration-200 active:scale-95 ${
                  isActive
                    ? 'bg-[#E5F3EC] text-[#0B241E]'
                    : 'text-[#5A7068] group-hover:bg-[#EEF4F1] group-hover:text-[#0E1F1A]'
                }`}
              >
                <Icon
                  className="h-[20px] w-[20px]"
                  strokeWidth={isActive ? 2.3 : 1.85}
                />
                {id === 'inicio' && doingCount > 0 && (
                  <span
                    aria-label={`${doingCount} tareas en curso`}
                    className="absolute -top-0.5 -right-0.5 flex h-4.5 min-w-4.5 items-center justify-center rounded-full bg-[#0E666B] px-1 font-mono text-[10px] font-bold text-white"
                  >
                    {doingCount}
                  </span>
                )}
              </span>
              <span
                className={`text-[11px] transition-colors ${
                  isActive
                    ? 'font-semibold text-[#0B241E]'
                    : 'font-medium text-[#5A7068]'
                }`}
              >
                {label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
