import { useMemo } from 'react';
import { ArrowRight, CheckCircle2, CircleDashed, ListTodo } from 'lucide-react';
import type { TaskStatus } from '../types/task';
import { BrandMark } from './BrandMark';

interface DashboardViewProps {
  counts: Record<TaskStatus, number>;
  onOpenStatus: (status: TaskStatus) => void;
}

const QUOTES = [
  {
    text: 'El mejor momento para plantar un árbol fue hace 20 años. El segundo mejor momento es ahora.',
    author: 'Proverbio chino',
  },
  {
    text: 'La disciplina es el puente entre metas y logros.',
    author: 'Jim Rohn',
  },
  {
    text: 'No hay atajos hacia cualquier lugar que valga la pena ir.',
    author: 'Beverly Sills',
  },
  {
    text: 'Empieza donde estás. Usa lo que tienes. Haz lo que puedas.',
    author: 'Arthur Ashe',
  },
  {
    text: 'El éxito es la suma de pequeños esfuerzos repetidos día tras día.',
    author: 'Robert Collier',
  },
  {
    text: 'La calidad no es un acto, es un hábito.',
    author: 'Aristóteles',
  },
  {
    text: 'Hazlo con pasión o no lo hagas.',
    author: 'Rosa Nouchette Carey',
  },
];

const GROUPS: {
  status: TaskStatus;
  title: string;
  subtitle: string;
  icon: typeof ListTodo;
  accent: string;
  badge: string;
  glow: string;
}[] = [
  {
    status: 'TODO',
    title: 'Por hacer',
    subtitle: 'Pendientes de hoy',
    icon: ListTodo,
    accent: 'from-[#0B241E] to-[#164033]',
    badge: 'bg-[#FEF08A] text-[#633906]',
    glow: 'bg-[#FACC15]/25',
  },
  {
    status: 'DOING',
    title: 'En curso',
    subtitle: 'Ongoing · en obra',
    icon: CircleDashed,
    accent: 'from-[#0E666B] to-[#117A66]',
    badge: 'bg-[#A7F3D0] text-[#065F46]',
    glow: 'bg-[#34D399]/28',
  },
  {
    status: 'DONE',
    title: 'Hechas',
    subtitle: 'Cerradas y listas',
    icon: CheckCircle2,
    accent: 'from-[#1A4E40] to-[#245C4B]',
    badge: 'bg-white/18 text-white',
    glow: 'bg-white/12',
  },
];

function greetingForHour(hour: number): string {
  if (hour >= 6 && hour < 14) return 'Buenos días';
  if (hour >= 14 && hour < 21) return 'Buenas tardes';
  return 'Buenas noches';
}

export function DashboardView({ counts, onOpenStatus }: DashboardViewProps) {
  const { greeting, quote } = useMemo(() => {
    const now = new Date();
    const dayIndex = Math.floor(
      Date.UTC(now.getFullYear(), now.getMonth(), now.getDate()) /
        (24 * 60 * 60 * 1000),
    );
    return {
      greeting: greetingForHour(now.getHours()),
      quote: QUOTES[dayIndex % QUOTES.length],
    };
  }, []);

  return (
    <div className="space-y-5">
      <header className="hero-atmosphere relative overflow-hidden rounded-b-[26px] px-5 pt-4 pb-5 text-white md:rounded-[28px] sm:px-7 sm:pt-6">
        <div
          aria-hidden="true"
          className="animate-canopy-drift pointer-events-none absolute -top-14 -right-10 h-52 w-52 rounded-full bg-[#34D399]/18 blur-3xl"
        />
        <div className="relative z-10">
          <div className="flex items-center gap-2.5">
            <BrandMark className="h-8 w-8" />
            <span className="text-[13px] font-medium text-[#CBE3D8]">
              {greeting}, Sergio
            </span>
          </div>

          <blockquote className="mt-4 max-w-md">
            <p className="font-display text-[1.2rem] leading-snug font-semibold tracking-[-0.02em] text-white sm:text-[1.35rem]">
              «{quote.text}»
            </p>
            <footer className="mt-2 text-[12.5px] font-medium text-[#9DD4BF]">
              — {quote.author}
            </footer>
          </blockquote>
        </div>
      </header>

      <div className="space-y-2.5 px-4 sm:px-6 md:px-1">
        {GROUPS.map((group, idx) => {
          const Icon = group.icon;
          const count = counts[group.status];
          return (
            <button
              key={group.status}
              type="button"
              onClick={() => onOpenStatus(group.status)}
              style={{ animationDelay: `${idx * 60}ms` }}
              className={`animate-fade-rise relative flex w-full overflow-hidden rounded-[22px] bg-gradient-to-br ${group.accent} px-4 py-3.5 text-left text-white shadow-[0_14px_30px_-16px_rgba(7,26,21,0.55)] transition-transform active:scale-[0.985]`}
            >
              <span
                aria-hidden="true"
                className={`absolute -top-8 -right-6 h-24 w-24 rounded-full blur-2xl ${group.glow}`}
              />
              <div className="relative z-10 flex w-full items-center justify-between gap-3">
                <div className="min-w-0">
                  <span
                    className={`inline-flex items-center gap-1.5 rounded-md px-2 py-0.5 text-[10.5px] font-semibold ${group.badge}`}
                  >
                    <Icon className="h-3.5 w-3.5" />
                    {group.subtitle}
                  </span>
                  <div className="mt-2 flex items-end gap-3">
                    <span className="font-display text-[2.75rem] leading-none font-extrabold tabular-nums tracking-[-0.04em]">
                      {count}
                    </span>
                    <h2 className="pb-1 font-display text-[1.25rem] leading-none font-bold tracking-[-0.02em]">
                      {group.title}
                    </h2>
                  </div>
                </div>
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white/12">
                  <ArrowRight className="h-5 w-5" />
                </span>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
