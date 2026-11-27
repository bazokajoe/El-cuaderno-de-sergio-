import { useMemo, useState } from 'react';
import { BottomNav } from './components/BottomNav';
import { DashboardView } from './components/DashboardView';
import { EnviarView } from './components/EnviarView';
import { FabMenu } from './components/FabMenu';
import { GestionView } from './components/GestionView';
import { ReportesView } from './components/ReportesView';
import { TaskFormView } from './components/TaskFormView';
import { TaskListView } from './components/TaskListView';
import {
  ALL_TASK_TYPES,
  DEFAULT_TASK_TYPES,
  INITIAL_SENT,
  INITIAL_TASKS,
  INITIAL_TEAMS,
  INITIAL_ZONES,
  nextTaskCode,
} from './data/mockData';
import type {
  AppScreen,
  FabAction,
  SentRecord,
  TabId,
  Task,
  TaskStatus,
  Team,
  WorkZone,
} from './types/task';

function tabFromScreen(screen: AppScreen): TabId {
  switch (screen.name) {
    case 'gestion':
    case 'nueva-gestion':
      return 'gestion';
    case 'enviar':
      return 'enviar';
    case 'reportes':
      return 'reportes';
    default:
      return 'inicio';
  }
}

export function App() {
  const [tasks, setTasks] = useState<Task[]>(INITIAL_TASKS);
  const [teams, setTeams] = useState<Team[]>(INITIAL_TEAMS);
  const [zones, setZones] = useState<WorkZone[]>(INITIAL_ZONES);
  const [taskTypes] = useState<string[]>([...DEFAULT_TASK_TYPES]);
  const [sent, setSent] = useState<SentRecord[]>(INITIAL_SENT);
  const [screen, setScreen] = useState<AppScreen>({ name: 'dashboard' });
  const [fabOpen, setFabOpen] = useState(false);

  const counts = useMemo(
    () => ({
      TODO: tasks.filter((t) => t.status === 'TODO').length,
      DOING: tasks.filter((t) => t.status === 'DOING').length,
      DONE: tasks.filter((t) => t.status === 'DONE').length,
    }),
    [tasks],
  );

  const allReportTaskTypes = useMemo(() => {
    const set = new Set<string>(ALL_TASK_TYPES);
    for (const team of teams) {
      for (const t of team.taskTypes ?? []) set.add(t);
    }
    for (const task of tasks) {
      set.add(task.taskType);
    }
    return Array.from(set);
  }, [teams, tasks]);

  const activeTab = tabFromScreen(screen);

  const goTab = (tab: TabId) => {
    setFabOpen(false);
    if (tab === 'inicio') setScreen({ name: 'dashboard' });
    if (tab === 'gestion') setScreen({ name: 'gestion' });
    if (tab === 'enviar') setScreen({ name: 'enviar' });
    if (tab === 'reportes') setScreen({ name: 'reportes' });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleFabAction = (action: FabAction) => {
    setFabOpen(false);
    if (action === 'nueva-tarea') {
      setScreen({ name: 'task-form', mode: 'create' });
    }
    if (action === 'nueva-gestion') {
      setScreen({ name: 'nueva-gestion' });
    }
    if (action === 'enviar-tareas') {
      setScreen({ name: 'enviar' });
    }
    if (action === 'crear-reporte') {
      setScreen({ name: 'reportes' });
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSaveTask = (payload: {
    taskType: string;
    teamId: string;
    zoneId: string;
    status: TaskStatus;
    date: string;
    comment: string;
  }) => {
    const now = Date.now();
    if (screen.name === 'task-form' && screen.mode === 'edit' && screen.taskId) {
      setTasks((prev) =>
        prev.map((task) =>
          task.id === screen.taskId
            ? {
                ...task,
                ...payload,
                updatedAt: now,
              }
            : task,
        ),
      );
      setScreen({ name: 'task-list', status: payload.status });
      return;
    }

    const created: Task = {
      id: `t-${now}`,
      code: nextTaskCode(tasks),
      createdAt: now,
      updatedAt: now,
      ...payload,
    };
    setTasks((prev) => [created, ...prev]);
    setScreen({ name: 'task-list', status: payload.status });
  };

  const handleCreateTeam = (name: string, zoneIds: string[]) => {
    setTeams((prev) => [
      ...prev,
      {
        id: `eq-${Date.now()}`,
        name,
        zoneIds,
      },
    ]);
    setScreen({ name: 'gestion' });
  };

  const handleCreateZone = (
    name: string,
    options?: { code?: string; tag?: string },
  ) => {
    const id = `z-${Date.now()}`;
    const code = options?.code?.trim() || undefined;
    const tag = options?.tag?.trim() || undefined;
    setZones((prev) => [...prev, { id, name, ...(code ? { code } : {}), ...(tag ? { tag } : {}) }]);
    return id;
  };

  const handleUpdateTeamZones = (teamId: string, zoneIds: string[]) => {
    setTeams((prev) =>
      prev.map((team) => (team.id === teamId ? { ...team, zoneIds } : team)),
    );
  };

  const handleRecordSent = (record: {
    summary: string;
    taskCount: number;
    teamName: string;
    zoneName: string;
  }) => {
    setSent((prev) => [
      {
        id: `s-${Date.now()}`,
        sentAt: Date.now(),
        status: 'enviado',
        ...record,
      },
      ...prev,
    ]);
  };

  const editingTask =
    screen.name === 'task-form' && screen.mode === 'edit' && screen.taskId
      ? tasks.find((t) => t.id === screen.taskId) ?? null
      : null;

  return (
    <div className="min-h-dvh pb-safe-nav md:pb-28">
      {fabOpen && (
        <button
          type="button"
          aria-label="Cerrar menú"
          className="fixed inset-0 z-40 bg-[#071A15]/35 backdrop-blur-[1px]"
          onClick={() => setFabOpen(false)}
        />
      )}

      <main className="mx-auto w-full max-w-3xl md:px-6 md:pt-5">
        {screen.name === 'dashboard' && (
          <DashboardView
            counts={counts}
            onOpenStatus={(status) => setScreen({ name: 'task-list', status })}
          />
        )}

        {screen.name === 'task-list' && (
          <TaskListView
            status={screen.status}
            tasks={tasks
              .filter((t) => t.status === screen.status)
              .sort((a, b) => a.createdAt - b.createdAt)}
            teams={teams}
            zones={zones}
            onBack={() => setScreen({ name: 'dashboard' })}
            onEdit={(taskId) =>
              setScreen({ name: 'task-form', mode: 'edit', taskId })
            }
          />
        )}

        {screen.name === 'task-form' && (
          <TaskFormView
            mode={screen.mode}
            task={editingTask}
            teams={teams}
            zones={zones}
            taskTypes={taskTypes}
            onCancel={() => {
              if (screen.mode === 'edit' && editingTask) {
                setScreen({ name: 'task-list', status: editingTask.status });
              } else {
                setScreen({ name: 'dashboard' });
              }
            }}
            onSave={handleSaveTask}
          />
        )}

        {(screen.name === 'gestion' || screen.name === 'nueva-gestion') && (
          <GestionView
            teams={teams}
            zones={zones}
            focusCreate={screen.name === 'nueva-gestion'}
            onCreateTeam={handleCreateTeam}
            onCreateZone={handleCreateZone}
            onUpdateTeamZones={handleUpdateTeamZones}
          />
        )}

        {screen.name === 'enviar' && (
          <EnviarView
            sent={sent}
            tasks={tasks}
            teams={teams}
            zones={zones}
            onRecordSent={handleRecordSent}
          />
        )}

        {screen.name === 'reportes' && (
          <ReportesView
            tasks={tasks}
            teams={teams}
            zones={zones}
            taskTypes={allReportTaskTypes}
          />
        )}
      </main>

      <FabMenu
        open={fabOpen}
        onToggle={() => setFabOpen((v) => !v)}
        onAction={handleFabAction}
      />

      <BottomNav
        activeTab={activeTab}
        onChangeTab={goTab}
        doingCount={counts.DOING}
      />
    </div>
  );
}

export default App;
