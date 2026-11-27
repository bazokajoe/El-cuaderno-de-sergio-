import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import type { Task, Team, WorkZone } from '../types/task';
import { formatDisplayDate, formatZoneLabel } from './mockData';

export interface ReportRow {
  label: string;
  todo: number;
  doing: number;
  done: number;
}

interface GenerateReportPdfInput {
  rows: ReportRow[];
  tasks: Task[];
  teams: Team[];
  zones: WorkZone[];
  groupByLabel: string;
  filters: {
    dateFrom: string;
    dateTo: string;
    team: string;
    zone: string;
    type: string;
  };
}

function statusLabel(status: Task['status']): string {
  if (status === 'TODO') return 'Por hacer';
  if (status === 'DOING') return 'En curso';
  return 'Hecha';
}

export function generateReportPdf({
  rows,
  tasks,
  teams,
  zones,
  groupByLabel,
  filters,
}: GenerateReportPdfInput): void {
  const doc = new jsPDF({ unit: 'mm', format: 'a4' });
  const now = new Date();
  const generatedAt = now.toLocaleString('es-ES', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  doc.setFillColor(11, 36, 30);
  doc.rect(0, 0, 210, 28, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(16);
  doc.text('Sergio · Reporte de campo', 14, 12);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  doc.text(`Generado: ${generatedAt}`, 14, 20);

  doc.setTextColor(14, 31, 26);
  doc.setFontSize(11);
  doc.text(`Agrupado por: ${groupByLabel}`, 14, 38);

  const filterBits = [
    filters.dateFrom || filters.dateTo
      ? `Fechas: ${filters.dateFrom || '…'} → ${filters.dateTo || '…'}`
      : 'Fechas: todas',
    `Equipo: ${filters.team}`,
    `Zona: ${filters.zone}`,
    `Tipo: ${filters.type}`,
  ];
  doc.setFontSize(9);
  doc.setTextColor(70, 90, 82);
  doc.text(filterBits.join('   ·   '), 14, 45);

  const totalTodo = rows.reduce((s, r) => s + r.todo, 0);
  const totalDoing = rows.reduce((s, r) => s + r.doing, 0);
  const totalDone = rows.reduce((s, r) => s + r.done, 0);

  autoTable(doc, {
    startY: 52,
    head: [['Grupo', 'Por hacer', 'En curso', 'Hechas', 'Total']],
    body: rows.map((row) => [
      row.label,
      String(row.todo),
      String(row.doing),
      String(row.done),
      String(row.todo + row.doing + row.done),
    ]),
    foot: [
      [
        'TOTAL',
        String(totalTodo),
        String(totalDoing),
        String(totalDone),
        String(totalTodo + totalDoing + totalDone),
      ],
    ],
    theme: 'grid',
    headStyles: {
      fillColor: [17, 138, 86],
      textColor: 255,
      fontStyle: 'bold',
    },
    footStyles: {
      fillColor: [238, 243, 240],
      textColor: [14, 31, 26],
      fontStyle: 'bold',
    },
    styles: {
      fontSize: 9,
      cellPadding: 2.5,
    },
    alternateRowStyles: {
      fillColor: [247, 250, 248],
    },
  });

  const afterSummaryY =
    (doc as jsPDF & { lastAutoTable?: { finalY: number } }).lastAutoTable
      ?.finalY ?? 70;

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(14, 31, 26);
  doc.text('Detalle', 14, afterSummaryY + 10);

  autoTable(doc, {
    startY: afterSummaryY + 14,
    head: [['Fecha', 'Tipo', 'Equipo', 'Zona', 'Estado', 'Comentario']],
    body: tasks.map((task) => [
      formatDisplayDate(task.date),
      task.taskType,
      teams.find((t) => t.id === task.teamId)?.name ?? '—',
      task.zoneId
        ? formatZoneLabel(zones.find((z) => z.id === task.zoneId))
        : '—',
      statusLabel(task.status),
      task.comment || '—',
    ]),
    theme: 'striped',
    headStyles: {
      fillColor: [11, 36, 30],
      textColor: 255,
      fontStyle: 'bold',
    },
    styles: {
      fontSize: 8,
      cellPadding: 2,
      overflow: 'linebreak',
    },
    columnStyles: {
      5: { cellWidth: 45 },
    },
  });

  const stamp = now.toISOString().slice(0, 10);
  doc.save(`reporte-sergio-${stamp}.pdf`);
}
