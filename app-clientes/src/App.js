import { useEffect, useState } from 'react';
import api from './api';
import { demoAppointments, demoEstimates, demoParts, demoShifts, demoStaff } from './demoData';

const emptyCliente = { nombre: '', email: '', telefono: '', notas: '' };
const progressSteps = ['Recepción', 'Diagnóstico', 'Reparación', 'Entrega'];
const navigationItems = [
  { id: 'overview', label: 'Resumen', icon: 'overview' },
  { id: 'clients', label: 'Clientes', icon: 'clients' },
  { id: 'estimates', label: 'Presupuestos', icon: 'estimates' },
  { id: 'appointments', label: 'Citas', icon: 'appointments' },
  { id: 'inventory', label: 'Repuestos', icon: 'inventory' },
  { id: 'team', label: 'Personal', icon: 'team' },
  { id: 'schedule', label: 'Horarios', icon: 'schedule' },
  { id: 'settings', label: 'Configuración', icon: 'settings' },
];
const paletteOptions = [
  { id: 'azul', label: 'Azul + gris + naranja', colors: ['#1E3A8A', '#F3F4F6', '#F97316'] },
  { id: 'verde', label: 'Verde + blanco + amarillo', colors: ['#215E33', '#E5E7EB', '#FBBF24'] },
  { id: 'grafito', label: 'Grafito + celeste + rojo', colors: ['#2E2E2E', '#EEF6FF', '#EF4444'] },
  { id: 'petroleo', label: 'Azul petróleo + crema + coral', colors: ['#264653', '#F4F1DE', '#E76F51'] },
  { id: 'morado', label: 'Morado + gris perla + verde lima', colors: ['#5D3A77', '#E1E1E1', '#9BE564'] },
  { id: 'carbono', label: 'Negro + gris claro + amarillo mostaza', colors: ['#1C1C1C', '#CFCFCF', '#D4A017'] },
];
const pageDetails = {
  overview: ['Resumen', 'El trabajo de hoy y lo que necesita atención.'],
  clients: ['Clientes', 'Registros conectados al sistema del taller.'],
  estimates: ['Presupuestos', 'Ejemplos de estados y trabajos presupuestados.'],
  appointments: ['Citas', 'Agenda de ejemplo y avance de cada trabajo.'],
  inventory: ['Repuestos', 'Existencias de demostración y mínimos orientativos.'],
  team: ['Personal', 'Equipo y turnos de demostración.'],
  schedule: ['Horarios', 'Vista semanal de ejemplo para el equipo.'],
  settings: ['Configuración', 'Elige la paleta de colores de la aplicación.'],
};

function getErrorMessage(error) {
  return error.response?.data?.error || 'No se pudo completar la operación. Inténtalo de nuevo.';
}

function Icon({ name }) {
  const drawings = {
    overview: <path d="M3 3h7v7H3zM14 3h7v7h-7zM14 14h7v7h-7zM3 14h7v7H3z" />,
    clients: (
      <>
        <path d="M16 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
        <circle cx="10" cy="7" r="4" />
        <path d="M20 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
      </>
    ),
    estimates: (
      <>
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
        <path d="M14 2v6h6M8 13h8M8 17h8" />
      </>
    ),
    appointments: (
      <>
        <rect x="3" y="5" width="18" height="16" rx="2" />
        <path d="M16 3v4M8 3v4M3 10h18" />
      </>
    ),
    inventory: (
      <>
        <path d="m3 7 9-4 9 4-9 4zM3 7v10l9 4 9-4V7M12 11v10M7.5 5l9 4" />
      </>
    ),
    team: (
      <>
        <circle cx="9" cy="8" r="4" />
        <path d="M3 21v-2a6 6 0 0 1 12 0v2M16 4.5a4 4 0 0 1 0 7.5M18 15a5 5 0 0 1 3 4.5V21" />
      </>
    ),
    schedule: (
      <>
        <rect x="3" y="4" width="18" height="17" rx="2" />
        <path d="M8 2v4M16 2v4M3 9h18M8 13h2M14 13h2M8 17h2" />
      </>
    ),
    menu: <path d="M4 6h16M4 12h16M4 18h16" />,
    settings: (
      <>
        <circle cx="12" cy="12" r="3" />
        <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 1 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 1 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 1 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 1 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
      </>
    ),
    logout: <path d="M10 17l5-5-5-5M15 12H3M12 3h6a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-6" />,
    edit: <path d="M12 20h9M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4z" />,
    car: (
      <>
        <path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9l-1.4 2.9A3.7 3.7 0 0 0 2 12v4c0 .6.4 1 1 1h2" />
        <path d="M9 17h6" />
        <circle cx="7" cy="17" r="2" />
        <circle cx="17" cy="17" r="2" />
      </>
    ),
    archive: <path d="M3 4h18v4H3zM5 8v12h14V8M10 12h4" />,
    save: <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2zM17 21v-8H7v8M7 3v5h8" />,
    close: <path d="M18 6L6 18M6 6l12 12" />,
  };

  return (
    <svg aria-hidden="true" className="icon" fill="none" viewBox="0 0 24 24">
      {drawings[name]}
    </svg>
  );
}

function DemoNotice({ children = 'Datos sintéticos de demostración. No se guardan en la base de datos.' }) {
  return <p className="m-0 rounded-[10px] border border-[#c9d8d1] bg-[#e2ece7] px-[15px] py-3 text-[13px] leading-[1.5] text-[#38595a]">{children}</p>;
}

function StatusBadge({ children, tone = 'neutral', className = '' }) {
  return <span className={`status-badge status-${tone} ${className}`}>{children}</span>;
}

const primaryButton = 'inline-flex min-h-[42px] cursor-pointer items-center justify-center gap-[9px] rounded-lg border border-lime bg-lime px-4 py-2.5 font-[650] text-on-accent shadow-[0_1px_2px_rgba(15,23,42,0.12)] transition duration-200 hover:enabled:brightness-[1.06] hover:enabled:shadow-[0_4px_12px_rgba(15,23,42,0.18)] active:enabled:scale-95 disabled:cursor-wait disabled:opacity-65 [&_.icon]:h-[15px] [&_.icon]:w-[15px] [&_.icon]:stroke-2';
const secondaryButton = 'inline-flex min-h-[42px] cursor-pointer items-center justify-center gap-[9px] rounded-lg border border-line bg-surface px-[13px] py-[9px] text-[13px] font-[650] text-ink shadow-[0_1px_2px_rgba(15,23,42,0.12)] transition duration-200 hover:border-[#aabbb5] hover:bg-surface-tint active:scale-95 [&_.icon]:h-[15px] [&_.icon]:w-[15px] [&_.icon]:stroke-2';
const customerForm = 'grid gap-[15px]';
const formActions = 'mt-1 flex flex-wrap gap-2';
const formLabel = 'grid gap-2 text-[13px] font-[650] text-text';
const formInput = 'min-h-10 w-full rounded-lg border border-[#bccbc6] bg-surface px-3 py-2.5 text-[13px] font-normal text-text';
const formError = 'm-0 rounded-lg border border-[#f1c7c1] bg-red-bg px-3.5 py-3 text-[14px] text-red';
const actionChip = 'inline-flex min-h-8 cursor-pointer items-center gap-1.5 rounded-lg border-0 px-[11px] py-1.5 text-[13px] font-semibold shadow-[0_1px_2px_rgba(15,23,42,0.12)] transition duration-200 hover:brightness-[1.06] hover:shadow-[0_4px_10px_rgba(15,23,42,0.18)] active:scale-95 [&_.icon]:h-[15px] [&_.icon]:w-[15px] [&_.icon]:stroke-2';
const actionIcon = 'relative mr-2 inline-flex h-10 min-h-0 w-10 cursor-pointer items-center justify-center rounded-lg border-0 p-0 text-[13px] font-semibold shadow-[0_1px_2px_rgba(15,23,42,0.12)] transition duration-200 last:mr-0 hover:brightness-[1.06] hover:shadow-[0_4px_10px_rgba(15,23,42,0.18)] active:scale-95 [&_.icon]:h-5 [&_.icon]:w-5 [&_.icon]:stroke-2';
const actionTone = {
  edit: 'bg-[color-mix(in_srgb,var(--ink)_80%,transparent)] text-[#fff]',
  cars: 'bg-[color-mix(in_srgb,var(--lime)_80%,transparent)] text-on-accent',
  archive: 'bg-[color-mix(in_srgb,var(--red)_80%,transparent)] text-[#fff]',
};
const textButton = 'inline-flex min-h-[34px] cursor-pointer items-center justify-center rounded-lg border-0 bg-transparent px-[9px] py-1.5 text-[13px] font-[650] text-ink transition-colors duration-200 hover:text-lime-deep hover:underline hover:underline-offset-[3px]';
const pageContent = 'grid gap-[22px]';
const contentSection = 'min-w-0 rounded-xl border border-line bg-surface p-[22px] max-[760px]:p-[17px]';
const sectionHeading = 'mb-[18px] flex items-start justify-between gap-4';
const sectionTitle = 'm-0 text-[18px] leading-[1.3] tracking-[-0.02em]';
const sectionText = 'mb-0 mt-1.5 text-[13px] leading-[1.5] text-muted';
const searchField = 'block w-[min(100%,290px)] max-[760px]:w-full';
const emptyState = 'rounded-[10px] border border-dashed border-[#b9c9c3] px-4 py-9 text-center text-muted';
const loadingMessage = 'px-4 py-9 text-center text-muted';
const customerLayout = 'grid grid-cols-[minmax(0,1fr)_minmax(280px,340px)] items-start gap-5 max-[1100px]:grid-cols-[minmax(0,1fr)]';
const tableScroll = 'min-w-0 overflow-x-auto';
const dataTable = 'w-full border-collapse text-left text-[13px] [&_td_strong]:block [&_tbody_tr:last-child_td]:border-b-0';
const tableHeadCell = 'whitespace-nowrap border-b border-line bg-surface-tint px-3.5 py-3 text-[11px] font-bold text-[#4b6260] max-[760px]:px-[11px]';
const tableCell = 'border-b border-[#e6ece9] px-3.5 py-[15px] align-middle max-[760px]:px-[11px]';
const tableDetail = 'mt-1 block max-w-[34ch] overflow-hidden text-ellipsis whitespace-nowrap text-[11px] text-muted';
const tableActions = 'min-w-[160px] whitespace-nowrap text-right';
const numericCell = 'tabular-nums whitespace-nowrap';
const detailText = 'mt-1 text-[12px] leading-[1.5] text-muted';
const noEvents = 'my-2 text-[11px] text-[#73827f]';
const teamRow = 'grid grid-cols-[42px_minmax(130px,1fr)_minmax(120px,180px)_auto] items-center gap-[15px] border-b border-[#e6ece9] py-4 last:border-b-0 max-[760px]:grid-cols-[38px_minmax(0,1fr)_auto] max-[760px]:gap-2.5';
const teamInitials = 'grid h-[38px] w-[38px] place-items-center rounded-full border border-[#cfddd6] bg-[#e2ece7] text-[11px] font-[750] text-ink';
const teamShift = 'text-[12px] tabular-nums text-muted max-[760px]:col-start-2 max-[760px]:row-start-2';
const paletteGrid = 'grid grid-cols-[repeat(auto-fit,minmax(230px,1fr))] gap-4';
const paletteCard = 'grid cursor-pointer gap-3 rounded-xl border-2 border-line bg-surface p-[18px] text-left text-text shadow-[0_1px_3px_rgba(15,23,42,0.08)] transition duration-200 hover:shadow-[0_6px_16px_rgba(15,23,42,0.12)] active:scale-[0.98] aria-pressed:border-ink';
const paletteSwatches = 'flex h-11 overflow-hidden rounded-lg';
const swatchFlex = ['flex-[6]', 'flex-[3]', 'flex-[1]'];
const modalBackdrop = 'fixed inset-0 z-50 flex items-center justify-center bg-[rgba(16,45,47,0.45)] p-4';
const modalDialog = 'relative max-h-[90vh] w-[min(640px,100%)] overflow-y-auto rounded-xl bg-surface p-6 shadow-[0_24px_60px_rgba(16,45,47,0.25)]';
const modalClose = 'absolute right-3 top-3 grid h-8 w-8 cursor-pointer place-items-center rounded-full border-0 bg-surface-tint text-[20px] leading-none text-ink';
const calendarToolbar = 'flex items-center justify-between gap-4 max-[760px]:flex-col max-[760px]:items-start';
const calendarSwitch = 'inline-flex gap-[3px] rounded-[9px] bg-[#e2ebe6] p-1';
const calendarTab = 'min-h-[34px] cursor-pointer rounded-[7px] border-0 bg-transparent px-[13px] py-1.5 text-[13px] font-[650] text-[#435d5b] transition-colors duration-200 aria-pressed:bg-surface aria-pressed:text-ink-deep aria-pressed:shadow-[0_1px_3px_rgb(21_56_58/0.13)]';
const calendarPeriod = 'm-0 text-[13px] font-semibold text-muted';
const weekScroll = 'min-w-0 overflow-x-auto pb-0.5 max-[760px]:overflow-visible';
const weekCalendar = 'grid min-w-[820px] grid-cols-[repeat(7,minmax(112px,1fr))] overflow-hidden rounded-xl border border-line bg-surface max-[760px]:min-w-0 max-[760px]:grid-cols-[minmax(0,1fr)]';
const weekDay = 'min-h-[280px] border-r border-line last:border-r-0 max-[760px]:grid max-[760px]:min-h-0 max-[760px]:grid-cols-[76px_minmax(0,1fr)] max-[760px]:border-b max-[760px]:border-r-0 max-[760px]:last:border-b-0';
const weekDayHeading = 'm-0 flex items-center justify-between border-b border-line bg-surface-tint px-2.5 py-3 text-[12px] capitalize text-muted max-[760px]:border-b-0 max-[760px]:items-start';
const weekDayNumber = 'grid h-[26px] w-[26px] place-items-center rounded-full text-[12px] text-text';
const weekEvents = 'grid content-start gap-2 p-2 max-[760px]:min-w-0 max-[760px]:border-l max-[760px]:border-line';
const weekEvent = 'grid gap-1 rounded-[7px] border border-[#d5e5bb] bg-[#edf4e0] px-2 py-[9px] text-ink';
const monthScroll = 'min-w-0 overflow-x-auto pb-0.5 max-[760px]:overflow-visible';
const monthCalendar = 'grid min-w-[720px] grid-cols-[repeat(7,minmax(98px,1fr))] border-l border-t border-line bg-surface max-[760px]:min-w-0 max-[760px]:grid-cols-[repeat(7,minmax(0,1fr))]';
const monthWeekday = 'border-b border-r border-line bg-surface-tint p-2.5 text-center text-[11px] font-bold text-[#4b6260] max-[760px]:px-0.5 max-[760px]:py-2 max-[760px]:text-[9px]';
const monthDay = 'relative min-h-24 min-w-0 border-b border-r border-line p-2 max-[760px]:min-h-[58px] max-[760px]:p-1';
const monthDayNumber = 'inline-grid h-[25px] w-[25px] place-items-center text-[12px] font-[650] tabular-nums max-[760px]:h-[21px] max-[760px]:w-[21px] max-[760px]:text-[10px]';
const monthEvent = 'mt-[5px] block overflow-hidden text-ellipsis whitespace-nowrap rounded bg-[#edf4e0] px-[5px] py-1 text-[9px] text-ink max-[760px]:h-[7px] max-[760px]:w-[7px] max-[760px]:rounded-full max-[760px]:bg-transparent max-[760px]:p-0 max-[760px]:text-[0]';
const monthEventDot = 'hidden max-[760px]:block max-[760px]:h-[7px] max-[760px]:w-[7px] max-[760px]:rounded-full max-[760px]:bg-[#5a8225]';
const appointmentRow = 'grid grid-cols-[70px_minmax(0,1fr)_auto] items-start gap-[18px] border-b border-[#e6ece9] py-[18px] last:border-b-0 max-[760px]:grid-cols-[48px_minmax(0,1fr)] max-[760px]:gap-x-3 max-[760px]:gap-y-2';
const appointmentTime = 'pt-0.5 text-[14px] font-[750] tabular-nums text-ink';
const jobTitleLine = 'flex flex-wrap items-center gap-x-[11px] gap-y-2';
const jobTitle = 'm-0 text-[14px] font-[700]';
const jobId = 'text-[11px] tabular-nums text-muted';

function ServiceProgress({ stage, className = '' }) {
  return (
    <ol aria-label={`Estado del trabajo: ${progressSteps[stage]}`} className={`mt-3.5 grid grid-cols-4 list-none p-0 max-[760px]:gap-px ${className}`}>
      {progressSteps.map((step, index) => {
        const reached = index <= stage;
        const current = index === stage;
        return (
          <li
            aria-current={current ? 'step' : undefined}
            className={`relative grid min-w-0 grid-rows-[12px_auto] justify-items-start gap-[5px] text-[10px] leading-[1.2] text-[#748582] after:absolute after:left-[10px] after:top-[5px] after:h-0.5 after:w-[calc(100%_-_10px)] after:content-[''] last:after:hidden ${reached ? 'after:bg-[#93b94a]' : 'after:bg-[#dce5e1]'}`}
            key={step}
          >
            <span
              className={`relative z-[1] h-[11px] w-[11px] rounded-full border-2 ${current ? 'border-ink bg-lime shadow-[0_0_0_3px_#edf5d6]' : reached ? 'border-[#6a8c21] bg-[#a9cf50]' : 'border-[#bdcbc6] bg-surface'}`}
            />
            <span className="max-w-full overflow-hidden text-ellipsis whitespace-nowrap">{step}</span>
          </li>
        );
      })}
    </ol>
  );
}

function getTodayLabel() {
  const label = new Intl.DateTimeFormat('es-ES', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  }).format(new Date());
  return label.charAt(0).toUpperCase() + label.slice(1);
}

function getDateKey(date) {
  return `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`;
}

function getAppointmentsForDate(date) {
  return demoAppointments.filter((appointment) => {
    const appointmentDate = new Date();
    appointmentDate.setHours(0, 0, 0, 0);
    appointmentDate.setDate(appointmentDate.getDate() + appointment.dateOffset);
    return getDateKey(appointmentDate) === getDateKey(date);
  });
}

function getWeekDates() {
  const firstDay = new Date();
  firstDay.setHours(0, 0, 0, 0);
  firstDay.setDate(firstDay.getDate() - ((firstDay.getDay() + 6) % 7));
  return Array.from({ length: 7 }, (_, index) => {
    const date = new Date(firstDay);
    date.setDate(firstDay.getDate() + index);
    return date;
  });
}

function getMonthDates() {
  const today = new Date();
  const monthStart = new Date(today.getFullYear(), today.getMonth(), 1);
  const firstWeekday = (monthStart.getDay() + 6) % 7;
  const daysInMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0).getDate();
  const cellCount = Math.ceil((firstWeekday + daysInMonth) / 7) * 7;
  const gridStart = new Date(monthStart);
  gridStart.setDate(monthStart.getDate() - firstWeekday);
  return Array.from({ length: cellCount }, (_, index) => {
    const date = new Date(gridStart);
    date.setDate(gridStart.getDate() + index);
    return date;
  });
}

function OverviewPanel({ customerCount, onNavigate }) {
  const lowStock = demoParts.filter((part) => part.stock < part.minimum).length;
  const pendingEstimates = demoEstimates.filter((estimate) => estimate.status === 'Pendiente').length;
  const todayAppointments = getAppointmentsForDate(new Date());

  return (
    <div className={pageContent}>
      <div className="flex items-center justify-between gap-5 pb-1 max-[760px]:flex-col max-[760px]:items-start">
        <div>
          <h2 className="m-0 text-[21px] leading-[1.3] tracking-[-0.02em]">La jornada en marcha</h2>
          <p className="mt-1.5 text-[14px] leading-[1.5] text-muted">{getTodayLabel()} · actividad de ejemplo para explorar el panel</p>
        </div>
        <button className={`${primaryButton} max-[760px]:w-full`} onClick={() => onNavigate('appointments')} type="button">
          Abrir agenda
        </button>
      </div>

      <DemoNotice>Las citas, presupuestos y existencias de esta vista son ejemplos; no se guardan en la base de datos.</DemoNotice>

      <section aria-label="Resumen operativo" className="grid grid-cols-4 rounded-xl border border-line bg-surface py-[18px] max-[760px]:grid-cols-2 max-[760px]:gap-y-4 max-[760px]:py-4">
        <p className="m-0 flex items-baseline gap-2.5 px-5 [p+&]:border-l [p+&]:border-line max-[1100px]:grid max-[1100px]:gap-0.5 max-[1100px]:px-3.5 max-[760px]:px-3.5 max-[760px]:[&:nth-child(3)]:border-l-0"><strong className="text-[24px] tabular-nums text-ink">{customerCount}</strong><span className="text-[12px] leading-[1.35] text-muted">{customerCount === 1 ? 'cliente registrado' : 'clientes registrados'}</span></p>
        <p className="m-0 flex items-baseline gap-2.5 px-5 [p+&]:border-l [p+&]:border-line max-[1100px]:grid max-[1100px]:gap-0.5 max-[1100px]:px-3.5 max-[760px]:px-3.5 max-[760px]:[&:nth-child(3)]:border-l-0"><strong className="text-[24px] tabular-nums text-ink">{todayAppointments.length}</strong><span className="text-[12px] leading-[1.35] text-muted">citas de ejemplo hoy</span></p>
        <p className="m-0 flex items-baseline gap-2.5 px-5 [p+&]:border-l [p+&]:border-line max-[1100px]:grid max-[1100px]:gap-0.5 max-[1100px]:px-3.5 max-[760px]:px-3.5 max-[760px]:[&:nth-child(3)]:border-l-0"><strong className="text-[24px] tabular-nums text-ink">{pendingEstimates}</strong><span className="text-[12px] leading-[1.35] text-muted">presupuestos por revisar</span></p>
        <p className="m-0 flex items-baseline gap-2.5 px-5 [p+&]:border-l [p+&]:border-line max-[1100px]:grid max-[1100px]:gap-0.5 max-[1100px]:px-3.5 max-[760px]:px-3.5 max-[760px]:[&:nth-child(3)]:border-l-0"><strong className="text-[24px] tabular-nums text-ink">{lowStock}</strong><span className="text-[12px] leading-[1.35] text-muted">repuestos bajo mínimo</span></p>
      </section>

      <div className="grid grid-cols-[minmax(0,1.7fr)_minmax(280px,0.9fr)] items-start gap-5 max-[1100px]:grid-cols-1">
        <section className={contentSection}>
          <div className={sectionHeading}>
            <div>
              <h2 className={sectionTitle}>Trabajo de hoy</h2>
              <p className={sectionText}>Seguimiento de las citas de demostración.</p>
            </div>
            <button className={textButton} onClick={() => onNavigate('appointments')} type="button">
              Ver todas
            </button>
          </div>
          <div className="grid">
            {todayAppointments.map((appointment) => (
              <article className="grid grid-cols-[58px_minmax(0,1fr)] gap-3.5 border-t border-[#e6ece9] py-[17px] max-[760px]:grid-cols-[48px_minmax(0,1fr)] max-[760px]:gap-2" key={appointment.id}>
                <div className="pt-0.5 text-[14px] font-[750] tabular-nums text-ink">{appointment.time}</div>
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-x-[11px] gap-y-2">
                    <h3 className="m-0 text-[14px] font-[700]">{appointment.client}</h3>
                    <span className="text-[11px] tabular-nums text-muted">{appointment.id}</span>
                  </div>
                  <p className="mt-1 text-[12px] leading-[1.5] text-muted">{appointment.vehicle} <span aria-hidden="true">·</span> {appointment.service}</p>
                  <ServiceProgress stage={appointment.stage} />
                </div>
              </article>
            ))}
          </div>
        </section>

        <aside className={`${contentSection} pt-[22px] px-[18px] pb-2.5`}>
          <div className={sectionHeading}>
            <div>
              <h2 className={sectionTitle}>Por resolver</h2>
              <p className={sectionText}>Elementos de ejemplo que requieren seguimiento.</p>
            </div>
          </div>
          <button className="grid w-full grid-cols-[10px_minmax(0,1fr)_12px] items-center gap-[11px] border-0 border-t border-[#e6ece9] bg-transparent px-0.5 py-[15px] text-left text-text group" onClick={() => onNavigate('estimates')} type="button">
            <span className="size-[9px] rounded-full bg-[#d7941e]" />
            <span><strong className="block text-[13px] group-hover:text-lime-deep group-hover:underline group-hover:underline-offset-[3px]">{pendingEstimates} presupuestos pendientes</strong><small className="mt-1 block text-[11px] leading-[1.4] text-muted">Revisar y comunicar al cliente</small></span>
            <span aria-hidden="true" className="text-[20px] text-muted">›</span>
          </button>
          <button className="grid w-full grid-cols-[10px_minmax(0,1fr)_12px] items-center gap-[11px] border-0 border-t border-[#e6ece9] bg-transparent px-0.5 py-[15px] text-left text-text group" onClick={() => onNavigate('inventory')} type="button">
            <span className="size-[9px] rounded-full bg-[#bd5548]" />
            <span><strong className="block text-[13px] group-hover:text-lime-deep group-hover:underline group-hover:underline-offset-[3px]">{lowStock} referencias bajo mínimo</strong><small className="mt-1 block text-[11px] leading-[1.4] text-muted">Consultar el inventario de ejemplo</small></span>
            <span aria-hidden="true" className="text-[20px] text-muted">›</span>
          </button>
          <button className="grid w-full grid-cols-[10px_minmax(0,1fr)_12px] items-center gap-[11px] border-0 border-t border-[#e6ece9] bg-transparent px-0.5 py-[15px] text-left text-text group" onClick={() => onNavigate('clients')} type="button">
            <span className="size-[9px] rounded-full bg-[#4a8b7b]" />
            <span><strong className="block text-[13px] group-hover:text-lime-deep group-hover:underline group-hover:underline-offset-[3px]">{customerCount} {customerCount === 1 ? 'cliente' : 'clientes'} en el registro</strong><small className="mt-1 block text-[11px] leading-[1.4] text-muted">Abrir la lista conectada al sistema</small></span>
            <span aria-hidden="true" className="text-[20px] text-muted">›</span>
          </button>
        </aside>
      </div>
    </div>
  );
}

function CustomersPanel({
  clientes,
  search,
  setSearch,
  form,
  editingCliente,
  loading,
  onFormChange,
  onSubmit,
  onEdit,
  onArchive,
  onCancel,
}) {
  const [vehiculosCliente, setVehiculosCliente] = useState(null);

  return (
    <div className={customerLayout}>
      <section className={contentSection}>
        <div className={`${sectionHeading} items-center max-[760px]:flex-col max-[760px]:items-start`}>
          <div>
            <h2 className={sectionTitle}>Registro de clientes</h2>
            <p className={sectionText}>{clientes.length} registros activos</p>
          </div>
          <label className={searchField}>
            <span className="sr-only">Buscar clientes</span>
            <input
              className={formInput}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Buscar nombre, email o teléfono"
              type="search"
              value={search}
            />
          </label>
        </div>

        {loading && <p className={loadingMessage}>Cargando clientes…</p>}
        {!loading && clientes.length === 0 && (
          <div className={emptyState}>
            <h3 className="m-0 text-[15px] text-text">{search ? 'No hay resultados' : 'Todavía no hay clientes'}</h3>
            <p className="mb-0 mt-[7px] text-[13px] leading-[1.5]">Añade un cliente para empezar a organizar su historial.</p>
          </div>
        )}
        {!loading && clientes.length > 0 && (
          <div className={tableScroll}>
            <table className={dataTable}>
              <thead>
                <tr><th className={tableHeadCell}>Nombre</th><th className={tableHeadCell}>Contacto</th><th className={tableHeadCell}><span className="sr-only">Acciones</span></th></tr>
              </thead>
              <tbody>
                {clientes.map((cliente) => (
                  <tr key={cliente.id}>
                    <td className={tableCell}>
                      <strong>{cliente.nombre}</strong>
                      {cliente.notas && <small className={tableDetail}>{cliente.notas}</small>}
                    </td>
                    <td className={tableCell}>
                      <span>{cliente.email || 'Sin email'}</span>
                      <small className={tableDetail}>{cliente.telefono || 'Sin teléfono'}</small>
                    </td>
                    <td className={`table-actions ${tableCell} ${tableActions}`}>
                      <button aria-label="Editar" className={`action-icon action-edit ${actionIcon} ${actionTone.edit}`} data-tooltip="Editar" onClick={() => onEdit(cliente)} type="button"><Icon name="edit" /></button>
                      <button aria-label="Coches" className={`action-icon action-cars ${actionIcon} ${actionTone.cars}`} data-tooltip="Coches" onClick={() => setVehiculosCliente(cliente)} type="button"><Icon name="car" /></button>
                      <button aria-label="Archivar" className={`action-icon action-archive ${actionIcon} ${actionTone.archive}`} data-tooltip="Archivar" onClick={() => onArchive(cliente.id)} type="button"><Icon name="archive" /></button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      <section className={contentSection}>
        <div className={`${sectionHeading} !mb-5`}>
          <div>
            <h2 className={sectionTitle}>{editingCliente ? 'Editar cliente' : 'Nuevo cliente'}</h2>
            <p className={sectionText}>Los campos marcados son necesarios para guardar.</p>
          </div>
        </div>
        <form className={customerForm} onSubmit={onSubmit}>
          <label className={formLabel}>
            Nombre *
            <input className={formInput} name="nombre" onChange={onFormChange} required value={form.nombre} />
          </label>
          <label className={formLabel}>
            Email
            <input className={formInput} name="email" onChange={onFormChange} type="email" value={form.email} />
          </label>
          <label className={formLabel}>
            Teléfono
            <input className={formInput} name="telefono" onChange={onFormChange} type="tel" value={form.telefono} />
          </label>
          <label className={formLabel}>
            Notas
            <textarea className={`${formInput} resize-y`} name="notas" onChange={onFormChange} rows="4" value={form.notas} />
          </label>
          <div className={formActions}>
            <button className={primaryButton} disabled={loading} type="submit">
              <Icon name="save" />
              {loading ? 'Guardando…' : editingCliente ? 'Guardar cambios' : 'Crear cliente'}
            </button>
            {editingCliente && (
              <button
                className={secondaryButton}
                onClick={onCancel}
                type="button"
              >
                <Icon name="close" />
                Cancelar
              </button>
            )}
          </div>
        </form>
      </section>

      {vehiculosCliente && (
        <VehiclesModal cliente={vehiculosCliente} onClose={() => setVehiculosCliente(null)} />
      )}
    </div>
  );
}

const emptyVehiculo = { matricula: '', marca: '', modelo: '', anio: '', km: '' };

function VehiclesEditor({ cliente }) {
  const [vehiculos, setVehiculos] = useState([]);
  const [form, setForm] = useState(emptyVehiculo);
  const [editingId, setEditingId] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let active = true;
    api.get(`/clientes/${cliente.id}/vehiculos`)
      .then(({ data }) => {
        if (active) setVehiculos(data);
      })
      .catch((requestError) => {
        if (active) setError(getErrorMessage(requestError));
      });
    return () => {
      active = false;
    };
  }, [cliente.id]);

  function resetForm() {
    setForm(emptyVehiculo);
    setEditingId(null);
  }

  function handleChange(event) {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  }

  function startEditing(vehiculo) {
    setForm({
      matricula: vehiculo.matricula,
      marca: vehiculo.marca,
      modelo: vehiculo.modelo || '',
      anio: vehiculo.anio ?? '',
      km: vehiculo.km ?? '',
    });
    setEditingId(vehiculo.id);
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setError('');
    setLoading(true);
    try {
      if (editingId) {
        await api.put(`/vehiculos/${editingId}`, form);
      } else {
        await api.post(`/clientes/${cliente.id}/vehiculos`, form);
      }
      const { data } = await api.get(`/clientes/${cliente.id}/vehiculos`);
      setVehiculos(data);
      resetForm();
    } catch (requestError) {
      setError(getErrorMessage(requestError));
    } finally {
      setLoading(false);
    }
  }

  async function archiveVehiculo(id) {
    if (!window.confirm('¿Quieres archivar este vehículo?')) return;
    setError('');
    try {
      await api.delete(`/vehiculos/${id}`);
      setVehiculos((current) => current.filter((vehiculo) => vehiculo.id !== id));
    } catch (requestError) {
      setError(getErrorMessage(requestError));
    }
  }

  return (
    <section className="min-w-0">
      <div className={`${sectionHeading} !mb-5`}>
        <div>
          <h2 className={sectionTitle}>Vehículos de {cliente.nombre}</h2>
          <p className={sectionText}>{vehiculos.length} registrados. Un cliente puede tener varios.</p>
        </div>
      </div>

      {vehiculos.length > 0 && (
        <div className={tableScroll}>
          <table className={dataTable}>
            <thead>
              <tr><th className={tableHeadCell}>Matrícula</th><th className={tableHeadCell}>Vehículo</th><th className={tableHeadCell}><span className="sr-only">Acciones</span></th></tr>
            </thead>
            <tbody>
              {vehiculos.map((vehiculo) => (
                <tr key={vehiculo.id}>
                  <td className={tableCell}><strong>{vehiculo.matricula}</strong></td>
                  <td className={tableCell}>
                    <span>{[vehiculo.marca, vehiculo.modelo].filter(Boolean).join(' ')}</span>
                    <small className={tableDetail}>
                      {[vehiculo.anio, vehiculo.km != null ? `${vehiculo.km} km` : null].filter(Boolean).join(' · ') || 'Sin año ni kilómetros'}
                    </small>
                  </td>
                  <td className={`${tableCell} ${tableActions}`}>
                    <button className={`${actionChip} ${actionTone.edit}`} onClick={() => startEditing(vehiculo)} type="button"><Icon name="edit" />Editar</button>
                    <button className={`${actionChip} ml-[5px] ${actionTone.archive}`} onClick={() => archiveVehiculo(vehiculo.id)} type="button"><Icon name="archive" />Archivar</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <form className={customerForm} onSubmit={handleSubmit}>
        <label className={formLabel}>
          Matrícula *
          <input className={formInput} name="matricula" onChange={handleChange} required value={form.matricula} />
        </label>
        <label className={formLabel}>
          Marca *
          <input className={formInput} name="marca" onChange={handleChange} required value={form.marca} />
        </label>
        <label className={formLabel}>
          Modelo
          <input className={formInput} name="modelo" onChange={handleChange} value={form.modelo} />
        </label>
        <label className={formLabel}>
          Año
          <input className={formInput} min="0" name="anio" onChange={handleChange} type="number" value={form.anio} />
        </label>
        <label className={formLabel}>
          Kilómetros
          <input className={formInput} min="0" name="km" onChange={handleChange} type="number" value={form.km} />
        </label>
        {error && <p className={formError} role="alert">{error}</p>}
        <div className={formActions}>
          <button className={primaryButton} disabled={loading} type="submit">
            <Icon name="save" />
            {loading ? 'Guardando…' : editingId ? 'Guardar vehículo' : 'Añadir vehículo'}
          </button>
          {editingId && (
            <button className={secondaryButton} onClick={resetForm} type="button"><Icon name="close" />Cancelar</button>
          )}
        </div>
      </form>
    </section>
  );
}

function VehiclesModal({ cliente, onClose }) {
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  return (
    <div className={modalBackdrop} onClick={onClose} role="presentation">
      <div
        aria-label={`Vehículos de ${cliente.nombre}`}
        aria-modal="true"
        className={modalDialog}
        onClick={(event) => event.stopPropagation()}
        role="dialog"
      >
        <button aria-label="Cerrar" className={modalClose} onClick={onClose} type="button">×</button>
        <VehiclesEditor cliente={cliente} />
      </div>
    </div>
  );
}

function EstimatesPanel() {
  return (
    <div className={pageContent}>
      <div className={sectionHeading}>
        <div><h2 className={sectionTitle}>Presupuestos recientes</h2><p className={sectionText}>Estados y valores ficticios para probar la vista.</p></div>
        <StatusBadge tone="demo">Datos demo</StatusBadge>
      </div>
      <DemoNotice />
      <div className={`${contentSection} ${tableScroll}`}>
        <table className={dataTable}>
          <thead><tr><th className={tableHeadCell}>Referencia</th><th className={tableHeadCell}>Cliente y vehículo</th><th className={tableHeadCell}>Fecha</th><th className={tableHeadCell}>Importe</th><th className={tableHeadCell}>Estado</th></tr></thead>
          <tbody>
            {demoEstimates.map((estimate) => (
              <tr key={estimate.id}>
                <td className={tableCell}><strong>{estimate.id}</strong></td>
                <td className={tableCell}><strong>{estimate.client}</strong><small className={tableDetail}>{estimate.vehicle}</small></td>
                <td className={tableCell}>{estimate.date}</td>
                <td className={tableCell}>{new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR' }).format(estimate.amount)}</td>
                <td className={tableCell}><StatusBadge tone={estimate.status.toLowerCase()}>{estimate.status}</StatusBadge></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function AppointmentsPanel() {
  const [calendarView, setCalendarView] = useState('day');
  const weekDates = getWeekDates();
  const monthDates = getMonthDates();
  const monthLabel = new Intl.DateTimeFormat('es-ES', { month: 'long', year: 'numeric' }).format(new Date());

  return (
    <div className={pageContent}>
      <div className={sectionHeading}>
        <div><h2 className={sectionTitle}>Agenda de hoy</h2><p className={sectionText}>Las horas y los trabajos son ejemplos de demostración.</p></div>
        <StatusBadge tone="demo">Datos demo</StatusBadge>
      </div>
      <DemoNotice />
      <div className={calendarToolbar}>
        <div aria-label="Vista de agenda" className={calendarSwitch} role="group">
          {['day', 'week', 'month'].map((view) => (
            <button
              aria-pressed={calendarView === view}
              className={calendarTab}
              key={view}
              onClick={() => setCalendarView(view)}
              type="button"
            >
              {{ day: 'Día', week: 'Semana', month: 'Mes' }[view]}
            </button>
          ))}
        </div>
        <p className={calendarPeriod}>
          {calendarView === 'day' ? getTodayLabel() : calendarView === 'week' ? 'Semana actual' : monthLabel}
        </p>
      </div>
      {calendarView === 'day' && (
        <section aria-label="Citas del día" className={`${contentSection} py-1`}>
          {getAppointmentsForDate(new Date()).map((appointment) => (
            <article className={appointmentRow} key={appointment.id}>
              <time className={appointmentTime}>{appointment.time}</time>
              <div className="min-w-0">
                <div className={jobTitleLine}>
                  <h3 className={jobTitle}>{appointment.client}</h3>
                  <span className={jobId}>{appointment.id}</span>
                </div>
                <p className={detailText}>{appointment.vehicle} <span aria-hidden="true">·</span> {appointment.service}</p>
                <ServiceProgress className="max-w-[560px]" stage={appointment.stage} />
              </div>
              <StatusBadge className="max-[760px]:col-start-2 max-[760px]:justify-self-start" tone={appointment.stage === 3 ? 'aprobado' : appointment.stage === 0 ? 'pendiente' : 'neutral'}>
                {progressSteps[appointment.stage]}
              </StatusBadge>
            </article>
          ))}
        </section>
      )}
      {calendarView === 'week' && (
        <div className={weekScroll}>
          <div className={weekCalendar}>
            {weekDates.map((date) => (
              <section className={weekDay} key={getDateKey(date)}>
                <h3 className={weekDayHeading}>
                  <span>{new Intl.DateTimeFormat('es-ES', { weekday: 'short' }).format(date)}</span>
                  <strong className={`${weekDayNumber} ${getDateKey(date) === getDateKey(new Date()) ? 'bg-lime text-ink-deep' : ''}`}>{date.getDate()}</strong>
                </h3>
                <div className={weekEvents}>
                  {getAppointmentsForDate(date).map((appointment) => (
                    <article className={weekEvent} key={appointment.id}>
                      <time className="text-[11px] tabular-nums">{appointment.time}</time>
                      <strong className="text-[11px] tabular-nums">{appointment.client}</strong>
                      <span className="text-[10px] leading-[1.35] text-[#526461]">{appointment.service}</span>
                    </article>
                  ))}
                  {getAppointmentsForDate(date).length === 0 && <p className={noEvents}>Sin citas</p>}
                </div>
              </section>
            ))}
          </div>
        </div>
      )}
      {calendarView === 'month' && (
        <div className={monthScroll}>
          <div aria-label={`Calendario de ${monthLabel}`} className={monthCalendar} role="grid">
            {['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'].map((day) => (
              <div className={monthWeekday} key={day} role="columnheader">{day}</div>
            ))}
            {monthDates.map((date) => {
              const isCurrentMonth = date.getMonth() === new Date().getMonth()
                && date.getFullYear() === new Date().getFullYear();
              const isToday = getDateKey(date) === getDateKey(new Date());
              const appointments = getAppointmentsForDate(date);
              const dateLabel = new Intl.DateTimeFormat('es-ES', {
                weekday: 'long',
                day: 'numeric',
                month: 'long',
              }).format(date);
              const appointmentLabel = appointments.map((appointment) => `${appointment.time}, ${appointment.client}`).join('; ');
              return (
                <div
                  aria-current={isToday ? 'date' : undefined}
                  aria-label={appointmentLabel ? `${dateLabel}: ${appointmentLabel}` : dateLabel}
                  className={`${monthDay}${isCurrentMonth ? '' : ' bg-[#f5f7f6] text-[#8a9995]'}${isToday ? ' bg-[#f5f9e9]' : ''}`}
                  key={getDateKey(date)}
                  role="gridcell"
                >
                  <span className={`${monthDayNumber} ${isToday ? 'rounded-full bg-lime text-ink-deep' : ''}`}>{date.getDate()}</span>
                  {appointments.map((appointment) => (
                    <span className={monthEvent} key={appointment.id}>
                      <span aria-hidden="true" className={monthEventDot} />
                      {appointment.time} · {appointment.client}
                    </span>
                  ))}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

function InventoryPanel() {
  return (
    <div className={pageContent}>
      <div className={sectionHeading}>
        <div><h2 className={sectionTitle}>Existencias</h2><p className={sectionText}>Unidades disponibles frente al mínimo orientativo.</p></div>
        <StatusBadge tone="demo">Datos demo</StatusBadge>
      </div>
      <DemoNotice />
      <div className={`${contentSection} ${tableScroll}`}>
        <table className={dataTable}>
          <thead><tr><th className={tableHeadCell}>Referencia</th><th className={tableHeadCell}>Repuesto</th><th className={tableHeadCell}>Disponible</th><th className={tableHeadCell}>Mínimo</th><th className={tableHeadCell}>Estado</th></tr></thead>
          <tbody>
            {demoParts.map((part) => {
              const lowStock = part.stock < part.minimum;
              return (
                <tr key={part.sku}>
                  <td className={tableCell}><strong>{part.sku}</strong></td>
                  <td className={tableCell}><strong>{part.name}</strong><small className={tableDetail}>{part.detail}</small></td>
                  <td className={`${tableCell} ${numericCell}`}>{part.stock} un.</td>
                  <td className={`${tableCell} ${numericCell}`}>{part.minimum} un.</td>
                  <td className={tableCell}><StatusBadge tone={lowStock ? 'rechazado' : 'aprobado'}>{lowStock ? 'Reponer' : 'En stock'}</StatusBadge></td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function TeamPanel() {
  return (
    <div className={pageContent}>
      <div className={sectionHeading}>
        <div><h2 className={sectionTitle}>Equipo del taller</h2><p className={sectionText}>Personas y estados de turno ficticios.</p></div>
        <StatusBadge tone="demo">Datos demo</StatusBadge>
      </div>
      <DemoNotice />
      <section className={`${contentSection} py-1`}>
        {demoStaff.map((member) => (
          <article className={teamRow} key={member.initials}>
            <span aria-hidden="true" className={teamInitials}>{member.initials}</span>
            <div><h3 className={jobTitle}>{member.name}</h3><p className={detailText}>{member.role}</p></div>
            <span className={teamShift}>{member.shift}</span>
            <StatusBadge className="max-[760px]:col-start-3 max-[760px]:row-start-1 max-[760px]:row-span-2" tone={member.status === 'En turno' ? 'aprobado' : 'neutral'}>{member.status}</StatusBadge>
          </article>
        ))}
      </section>
    </div>
  );
}

function SettingsPanel({ palette, onPaletteChange }) {
  return (
    <div className={pageContent}>
      <div className={sectionHeading}>
        <div><h2 className={sectionTitle}>Paleta de colores</h2><p className={sectionText}>Regla 60-30-10: 60% base, 30% secundario y 10% acento.</p></div>
      </div>
      <div className={paletteGrid}>
        {paletteOptions.map((option) => (
          <button
            aria-pressed={palette === option.id}
            className={paletteCard}
            key={option.id}
            onClick={() => onPaletteChange(option.id)}
            type="button"
          >
            <span className={paletteSwatches} aria-hidden="true">
              {option.colors.map((color, index) => <span className={swatchFlex[index]} key={color} style={{ background: color }} />)}
            </span>
            <strong>{option.label}</strong>
            <small className="text-[14px] text-muted">{option.colors.join(' · ')}</small>
          </button>
        ))}
      </div>
    </div>
  );
}

function SchedulePanel() {
  return (
    <div className={pageContent}>
      <div className={sectionHeading}>
        <div><h2 className={sectionTitle}>Turnos de esta semana</h2><p className={sectionText}>Planificación ficticia, de lunes a viernes.</p></div>
        <StatusBadge tone="demo">Datos demo</StatusBadge>
      </div>
      <DemoNotice />
      <div className={`${contentSection} ${tableScroll}`}>
        <table className={`${dataTable} min-w-[740px]`}>
          <thead><tr><th className={tableHeadCell}>Persona</th><th className={tableHeadCell}>Lun</th><th className={tableHeadCell}>Mar</th><th className={tableHeadCell}>Mié</th><th className={tableHeadCell}>Jue</th><th className={tableHeadCell}>Vie</th></tr></thead>
          <tbody>
            {demoShifts.map((shift) => (
              <tr key={shift.name}>
                <td className={tableCell}><strong>{shift.name}</strong><small className={tableDetail}>{shift.role}</small></td>
                <td className={`${tableCell} whitespace-nowrap text-[12px]`}>{shift.monday}</td><td className={`${tableCell} whitespace-nowrap text-[12px]`}>{shift.tuesday}</td><td className={`${tableCell} whitespace-nowrap text-[12px]`}>{shift.wednesday}</td><td className={`${tableCell} whitespace-nowrap text-[12px]`}>{shift.thursday}</td><td className={`${tableCell} whitespace-nowrap text-[12px]`}>{shift.friday}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function App() {
  const [token, setToken] = useState(() => sessionStorage.getItem('token'));
  const [authMode, setAuthMode] = useState('login');
  const [credentials, setCredentials] = useState({ email: '', password: '' });
  const [clientes, setClientes] = useState([]);
  const [activeView, setActiveView] = useState('overview');
  const [palette, setPalette] = useState(() => localStorage.getItem('tc-palette') || 'azul');
  useEffect(() => {
    document.documentElement.dataset.palette = palette;
    localStorage.setItem('tc-palette', palette);
  }, [palette]);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [form, setForm] = useState(emptyCliente);
  const [editingCliente, setEditingCliente] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!token) return undefined;
    let active = true;
    setLoading(true);
    api.get('/clientes', { params: { q: search.trim() } })
      .then(({ data }) => {
        if (active) {
          setClientes(data);
          setError('');
        }
      })
      .catch((requestError) => {
        if (active) setError(getErrorMessage(requestError));
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [token, search]);

  async function handleAuthSubmit(event) {
    event.preventDefault();
    setError('');
    setLoading(true);
    try {
      if (authMode === 'register') await api.post('/register', credentials);
      const { data } = await api.post('/login', credentials);
      sessionStorage.setItem('token', data.token);
      setToken(data.token);
    } catch (requestError) {
      setError(getErrorMessage(requestError));
    } finally {
      setLoading(false);
    }
  }

  function handleLogout() {
    sessionStorage.removeItem('token');
    setToken(null);
    setClientes([]);
    setActiveView('overview');
  }

  function handleFormChange(event) {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  }

  async function handleClienteSubmit(event) {
    event.preventDefault();
    setError('');
    setLoading(true);
    try {
      if (editingCliente) {
        await api.put(`/clientes/${editingCliente.id}`, form);
      } else {
        await api.post('/clientes', form);
      }
      setForm(emptyCliente);
      setEditingCliente(null);
      const { data } = await api.get('/clientes', { params: { q: search.trim() } });
      setClientes(data);
    } catch (requestError) {
      setError(getErrorMessage(requestError));
    } finally {
      setLoading(false);
    }
  }

  function startEditing(cliente) {
    setForm({
      nombre: cliente.nombre || '',
      email: cliente.email || '',
      telefono: cliente.telefono || '',
      notas: cliente.notas || '',
    });
    setEditingCliente(cliente);
  }

  async function archiveCliente(id) {
    if (!window.confirm('¿Quieres archivar este cliente? Se conservará su registro.')) return;
    setError('');
    try {
      await api.delete(`/clientes/${id}`);
      setClientes((current) => current.filter((cliente) => cliente.id !== id));
    } catch (requestError) {
      setError(getErrorMessage(requestError));
    }
  }

  function navigateTo(view) {
    setActiveView(view);
    setMobileMenuOpen(false);
  }

  if (!token) {
    const registering = authMode === 'register';
    return (
      <main className="grid min-h-screen grid-cols-[minmax(0,1fr)] gap-3 p-3 min-[761px]:grid-cols-[minmax(0,1fr)_minmax(340px,480px)] min-[761px]:gap-5 min-[761px]:p-6">
        <section className="flex min-h-[190px] flex-col justify-between rounded-2xl bg-ink p-6 text-[#f5fbf7] min-[761px]:min-h-[calc(100vh_-_48px)] min-[761px]:p-[clamp(32px,6vw,88px)]">
          <p className="m-0 text-[15px] font-[750] tracking-[0.02em] text-lime">TallerCoches</p>
          <div className="mb-3.5 mt-[30px] max-w-[620px] min-[761px]:my-auto">
            <h1 className="m-0 max-w-[12ch] text-[38px] leading-[1.02] tracking-[-0.035em] min-[761px]:max-w-[9ch] min-[761px]:text-[clamp(42px,6vw,76px)]">Tu espacio de trabajo.</h1>
            <p className="m-0 mt-3 max-w-[38ch] text-[14px] leading-[1.6] text-[#d2e0db] min-[761px]:mt-[22px] min-[761px]:text-[17px]">Accede al panel del taller para continuar con la gestión diaria.</p>
          </div>
          <p className="m-0 hidden text-[13px] text-[#d2e0db] min-[761px]:block">Acceso seguro para el equipo del taller</p>
        </section>
        <section aria-labelledby="auth-heading" className="w-full self-start rounded-2xl border border-line bg-surface p-[25px] min-[761px]:self-center min-[761px]:p-[clamp(28px,4vw,48px)]">
          <h2 className="m-0 text-[28px] tracking-[-0.025em]" id="auth-heading">{registering ? 'Crear cuenta' : 'Iniciar sesión'}</h2>
          <p className="mb-7 mt-[9px] leading-[1.5] text-muted">Introduce tus datos para acceder.</p>
          <form className="grid gap-[18px]" onSubmit={handleAuthSubmit}>
            <label className="grid gap-2 text-[14px] font-[650] text-text">
              Email
              <input
                autoComplete="email"
                className="w-full min-h-[44px] rounded-lg border border-[#bccbc6] bg-surface px-3 py-2.5 text-text"
                onChange={(event) => setCredentials((value) => ({ ...value, email: event.target.value }))}
                required
                type="email"
                value={credentials.email}
              />
            </label>
            <label className="grid gap-2 text-[14px] font-[650] text-text">
              Contraseña
              <input
                autoComplete={registering ? 'new-password' : 'current-password'}
                className="w-full min-h-[44px] rounded-lg border border-[#bccbc6] bg-surface px-3 py-2.5 text-text"
                minLength={registering ? 8 : undefined}
                onChange={(event) => setCredentials((value) => ({ ...value, password: event.target.value }))}
                required
                type="password"
                value={credentials.password}
              />
            </label>
            {error && (
              <p className="m-0 rounded-lg border border-[#f1c7c1] bg-red-bg px-3.5 py-3 text-[14px] text-red" role="alert">{error}</p>
            )}
            <button className={`${primaryButton} mt-1 w-full`} disabled={loading} type="submit">
              {loading ? 'Procesando…' : registering ? 'Crear cuenta' : 'Entrar'}
            </button>
          </form>
          <button
            className="mt-5 w-full border-0 bg-transparent p-2 font-[650] text-ink hover:underline hover:underline-offset-[3px]"
            onClick={() => {
              setAuthMode(registering ? 'login' : 'register');
              setError('');
            }}
            type="button"
          >
            {registering ? 'Ya tengo una cuenta' : 'Crear una cuenta'}
          </button>
        </section>
      </main>
    );
  }

  return (
    <div className="min-h-screen">
      {mobileMenuOpen && (
        <button
          aria-label="Cerrar navegación"
          className="fixed inset-0 z-[19] block border-0 bg-[rgb(16_45_47_/_45%)] min-[761px]:hidden"
          onClick={() => setMobileMenuOpen(false)}
          type="button"
        />
      )}
      <aside
        className={`fixed inset-y-0 left-0 z-20 flex w-[min(290px,calc(100vw_-_48px))] flex-col bg-ink px-[18px] pb-[18px] pt-6 text-[#eff7f3] transition-transform duration-200 ease-[cubic-bezier(0.16,1,0.3,1)] min-[761px]:w-[258px] min-[761px]:visible min-[761px]:transform-none ${
          mobileMenuOpen ? 'visible translate-x-0' : 'invisible -translate-x-[105%]'
        }`}
      >
        <a aria-label="TallerCoches, resumen" className="flex items-center gap-[11px] px-1.5 py-0.5 text-[17px] font-[750] text-white no-underline" href="#resumen" onClick={(event) => {
          event.preventDefault();
          navigateTo('overview');
        }}>
          <span aria-hidden="true" className="grid h-9 w-9 place-items-center rounded-[9px] bg-lime text-[13px] font-[850] tracking-[-0.04em] text-on-accent">TC</span>
          <span>TallerCoches</span>
        </a>
        <nav aria-label="Navegación principal" className="mt-12 grid gap-[5px]" id="primary-navigation">
          <p className="mx-2.5 mb-2.5 mt-0 text-[12px] font-[650] text-[#b7cbc4]">Espacio de trabajo</p>
          {navigationItems.map((item) => (
            <button
              aria-current={activeView === item.id ? 'page' : undefined}
              className="flex min-h-[46px] w-full items-center gap-3 rounded-[9px] border-0 bg-transparent px-3 py-2.5 text-left text-[14px] font-[570] text-[#e3eeea] transition duration-200 hover:bg-ink-soft hover:text-white active:scale-95 aria-[current=page]:bg-lime aria-[current=page]:font-[720] aria-[current=page]:text-on-accent"
              key={item.id}
              onClick={() => navigateTo(item.id)}
              type="button"
            >
              <Icon name={item.icon} />
              <span>{item.label}</span>
            </button>
          ))}
        </nav>
        <div className="mt-auto flex items-center gap-[9px] border-t border-[#466465] px-2 pb-1 pt-[18px] text-[12px] text-[#d2e0db]">
          <span className="h-2 w-2 rounded-full bg-lime" />
          <span>Módulos nuevos · datos demo</span>
        </div>
      </aside>

      <main className="min-w-0 ml-0 min-[761px]:ml-[258px]">
        <header className="flex min-h-[78px] items-center gap-4 border-b border-line bg-surface px-[18px] py-3.5 min-[761px]:min-h-[94px] min-[761px]:px-[clamp(22px,4vw,54px)] min-[761px]:py-[18px]">
          <button
            aria-controls="primary-navigation"
            aria-expanded={mobileMenuOpen}
            aria-label={mobileMenuOpen ? 'Cerrar menú' : 'Abrir menú'}
            className="inline-flex min-h-[40px] w-10 min-w-[40px] cursor-pointer items-center justify-center gap-[9px] rounded-lg border border-line bg-surface p-2 font-[650] text-ink shadow-[0_1px_2px_rgba(15,23,42,0.12)] transition duration-200 active:scale-95 min-[761px]:hidden"
            onClick={() => setMobileMenuOpen((open) => !open)}
            type="button"
          >
            <Icon name="menu" />
          </button>
          <div>
            <h1 className="m-0 text-[20px] leading-[1.2] tracking-[-0.025em] min-[761px]:text-[24px]">{pageDetails[activeView][0]}</h1>
            <p className="mt-[5px] max-w-[42ch] text-[12px] text-muted min-[761px]:max-w-none min-[761px]:text-[14px]">{pageDetails[activeView][1]}</p>
          </div>
          <button
            className="ml-auto inline-flex min-h-[40px] w-10 min-w-[40px] cursor-pointer items-center justify-center gap-[9px] overflow-hidden rounded-lg border border-line bg-surface p-2 text-[0] font-[650] text-ink shadow-[0_1px_2px_rgba(15,23,42,0.12)] transition duration-200 hover:border-[#aabbb5] hover:bg-surface-tint active:scale-95 [&_.icon]:h-[18px] [&_.icon]:w-[18px] min-[761px]:w-auto min-[761px]:min-w-0 min-[761px]:overflow-visible min-[761px]:px-3 min-[761px]:py-2 min-[761px]:text-[13px] min-[761px]:[&_.icon]:h-4 min-[761px]:[&_.icon]:w-4"
            onClick={handleLogout}
            type="button"
          >
            <Icon name="logout" />
            Cerrar sesión
          </button>
        </header>
        <div className="mx-auto w-full max-w-[1500px] px-4 pb-10 pt-[22px] min-[761px]:px-[clamp(20px,4vw,54px)] min-[761px]:pb-14 min-[761px]:pt-8">
          {error && <p className="mb-5 rounded-lg border border-[#f1c7c1] bg-red-bg px-3.5 py-3 text-[14px] text-red" role="alert">{error}</p>}
          {activeView === 'overview' && <OverviewPanel customerCount={clientes.length} onNavigate={navigateTo} />}
          {activeView === 'clients' && (
            <CustomersPanel
              clientes={clientes}
              editingCliente={editingCliente}
              form={form}
              loading={loading}
              onArchive={archiveCliente}
              onCancel={() => {
                setEditingCliente(null);
                setForm(emptyCliente);
              }}
              onEdit={startEditing}
              onFormChange={handleFormChange}
              onSubmit={handleClienteSubmit}
              search={search}
              setSearch={setSearch}
            />
          )}
          {activeView === 'estimates' && <EstimatesPanel />}
          {activeView === 'appointments' && <AppointmentsPanel />}
          {activeView === 'inventory' && <InventoryPanel />}
          {activeView === 'team' && <TeamPanel />}
          {activeView === 'schedule' && <SchedulePanel />}
          {activeView === 'settings' && <SettingsPanel palette={palette} onPaletteChange={setPalette} />}
        </div>
      </main>
    </div>
  );
}

export default App;
