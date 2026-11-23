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

function StatusBadge({ children, tone = 'neutral' }) {
  return <span className={`status-badge status-${tone}`}>{children}</span>;
}

function ServiceProgress({ stage }) {
  return (
    <ol aria-label={`Estado del trabajo: ${progressSteps[stage]}`} className="service-progress">
      {progressSteps.map((step, index) => (
        <li
          aria-current={index === stage ? 'step' : undefined}
          className={index <= stage ? 'is-reached' : ''}
          key={step}
        >
          <span className="progress-node" />
          <span className="progress-label">{step}</span>
        </li>
      ))}
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
    <div className="page-content">
      <div className="overview-intro">
        <div>
          <h2>La jornada en marcha</h2>
          <p>{getTodayLabel()} · actividad de ejemplo para explorar el panel</p>
        </div>
        <button className="primary-button" onClick={() => onNavigate('appointments')} type="button">
          Abrir agenda
        </button>
      </div>

      <DemoNotice>Las citas, presupuestos y existencias de esta vista son ejemplos; no se guardan en la base de datos.</DemoNotice>

      <section aria-label="Resumen operativo" className="summary-strip">
        <p><strong>{customerCount}</strong><span>{customerCount === 1 ? 'cliente registrado' : 'clientes registrados'}</span></p>
        <p><strong>{todayAppointments.length}</strong><span>citas de ejemplo hoy</span></p>
        <p><strong>{pendingEstimates}</strong><span>presupuestos por revisar</span></p>
        <p><strong>{lowStock}</strong><span>repuestos bajo mínimo</span></p>
      </section>

      <div className="overview-grid">
        <section className="content-section">
          <div className="section-heading">
            <div>
              <h2>Trabajo de hoy</h2>
              <p>Seguimiento de las citas de demostración.</p>
            </div>
            <button className="text-button" onClick={() => onNavigate('appointments')} type="button">
              Ver todas
            </button>
          </div>
          <div className="job-list">
            {todayAppointments.map((appointment) => (
              <article className="job-row" key={appointment.id}>
                <div className="job-time">{appointment.time}</div>
                <div className="job-details">
                  <div className="job-title-line">
                    <h3>{appointment.client}</h3>
                    <span className="job-id">{appointment.id}</span>
                  </div>
                  <p>{appointment.vehicle} <span aria-hidden="true">·</span> {appointment.service}</p>
                  <ServiceProgress stage={appointment.stage} />
                </div>
              </article>
            ))}
          </div>
        </section>

        <aside className="content-section attention-section">
          <div className="section-heading">
            <div>
              <h2>Por resolver</h2>
              <p>Elementos de ejemplo que requieren seguimiento.</p>
            </div>
          </div>
          <button className="attention-link" onClick={() => onNavigate('estimates')} type="button">
            <span className="attention-mark attention-amber" />
            <span><strong>{pendingEstimates} presupuestos pendientes</strong><small>Revisar y comunicar al cliente</small></span>
            <span aria-hidden="true" className="attention-arrow">›</span>
          </button>
          <button className="attention-link" onClick={() => onNavigate('inventory')} type="button">
            <span className="attention-mark attention-red" />
            <span><strong>{lowStock} referencias bajo mínimo</strong><small>Consultar el inventario de ejemplo</small></span>
            <span aria-hidden="true" className="attention-arrow">›</span>
          </button>
          <button className="attention-link" onClick={() => onNavigate('clients')} type="button">
            <span className="attention-mark attention-teal" />
            <span><strong>{customerCount} {customerCount === 1 ? 'cliente' : 'clientes'} en el registro</strong><small>Abrir la lista conectada al sistema</small></span>
            <span aria-hidden="true" className="attention-arrow">›</span>
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
    <div className="customer-layout">
      <section className="content-section">
        <div className="section-heading customer-heading">
          <div>
            <h2>Registro de clientes</h2>
            <p>{clientes.length} registros activos</p>
          </div>
          <label className="search-field">
            <span className="sr-only">Buscar clientes</span>
            <input
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Buscar nombre, email o teléfono"
              type="search"
              value={search}
            />
          </label>
        </div>

        {loading && <p className="loading-message">Cargando clientes…</p>}
        {!loading && clientes.length === 0 && (
          <div className="empty-state">
            <h3>{search ? 'No hay resultados' : 'Todavía no hay clientes'}</h3>
            <p>Añade un cliente para empezar a organizar su historial.</p>
          </div>
        )}
        {!loading && clientes.length > 0 && (
          <div className="table-scroll">
            <table className="data-table">
              <thead>
                <tr><th>Nombre</th><th>Contacto</th><th><span className="sr-only">Acciones</span></th></tr>
              </thead>
              <tbody>
                {clientes.map((cliente) => (
                  <tr key={cliente.id}>
                    <td>
                      <strong>{cliente.nombre}</strong>
                      {cliente.notas && <small className="table-detail">{cliente.notas}</small>}
                    </td>
                    <td>
                      <span>{cliente.email || 'Sin email'}</span>
                      <small className="table-detail">{cliente.telefono || 'Sin teléfono'}</small>
                    </td>
                    <td className="table-actions">
                      <button aria-label="Editar" className="action-chip action-icon action-edit" data-tooltip="Editar" onClick={() => onEdit(cliente)} type="button"><Icon name="edit" /></button>
                      <button aria-label="Coches" className="action-chip action-icon action-cars" data-tooltip="Coches" onClick={() => setVehiculosCliente(cliente)} type="button"><Icon name="car" /></button>
                      <button aria-label="Archivar" className="action-chip action-icon action-archive" data-tooltip="Archivar" onClick={() => onArchive(cliente.id)} type="button"><Icon name="archive" /></button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      <section className="content-section form-section">
        <div className="section-heading">
          <div>
            <h2>{editingCliente ? 'Editar cliente' : 'Nuevo cliente'}</h2>
            <p>Los campos marcados son necesarios para guardar.</p>
          </div>
        </div>
        <form className="customer-form" onSubmit={onSubmit}>
          <label>
            Nombre *
            <input name="nombre" onChange={onFormChange} required value={form.nombre} />
          </label>
          <label>
            Email
            <input name="email" onChange={onFormChange} type="email" value={form.email} />
          </label>
          <label>
            Teléfono
            <input name="telefono" onChange={onFormChange} type="tel" value={form.telefono} />
          </label>
          <label>
            Notas
            <textarea name="notas" onChange={onFormChange} rows="4" value={form.notas} />
          </label>
          <div className="form-actions">
            <button className="primary-button" disabled={loading} type="submit">
              <Icon name="save" />
              {loading ? 'Guardando…' : editingCliente ? 'Guardar cambios' : 'Crear cliente'}
            </button>
            {editingCliente && (
              <button
                className="secondary-button"
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
    <section className="content-section form-section vehicles-section">
      <div className="section-heading">
        <div>
          <h2>Vehículos de {cliente.nombre}</h2>
          <p>{vehiculos.length} registrados. Un cliente puede tener varios.</p>
        </div>
      </div>

      {vehiculos.length > 0 && (
        <div className="table-scroll">
          <table className="data-table">
            <thead>
              <tr><th>Matrícula</th><th>Vehículo</th><th><span className="sr-only">Acciones</span></th></tr>
            </thead>
            <tbody>
              {vehiculos.map((vehiculo) => (
                <tr key={vehiculo.id}>
                  <td><strong>{vehiculo.matricula}</strong></td>
                  <td>
                    <span>{[vehiculo.marca, vehiculo.modelo].filter(Boolean).join(' ')}</span>
                    <small className="table-detail">
                      {[vehiculo.anio, vehiculo.km != null ? `${vehiculo.km} km` : null].filter(Boolean).join(' · ') || 'Sin año ni kilómetros'}
                    </small>
                  </td>
                  <td className="table-actions">
                    <button className="action-chip action-edit" onClick={() => startEditing(vehiculo)} type="button"><Icon name="edit" />Editar</button>
                    <button className="action-chip action-archive" onClick={() => archiveVehiculo(vehiculo.id)} type="button"><Icon name="archive" />Archivar</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <form className="customer-form" onSubmit={handleSubmit}>
        <label>
          Matrícula *
          <input name="matricula" onChange={handleChange} required value={form.matricula} />
        </label>
        <label>
          Marca *
          <input name="marca" onChange={handleChange} required value={form.marca} />
        </label>
        <label>
          Modelo
          <input name="modelo" onChange={handleChange} value={form.modelo} />
        </label>
        <label>
          Año
          <input min="0" name="anio" onChange={handleChange} type="number" value={form.anio} />
        </label>
        <label>
          Kilómetros
          <input min="0" name="km" onChange={handleChange} type="number" value={form.km} />
        </label>
        {error && <p className="form-error" role="alert">{error}</p>}
        <div className="form-actions">
          <button className="primary-button" disabled={loading} type="submit">
            <Icon name="save" />
            {loading ? 'Guardando…' : editingId ? 'Guardar vehículo' : 'Añadir vehículo'}
          </button>
          {editingId && (
            <button className="secondary-button" onClick={resetForm} type="button"><Icon name="close" />Cancelar</button>
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
    <div className="modal-backdrop" onClick={onClose} role="presentation">
      <div
        aria-label={`Vehículos de ${cliente.nombre}`}
        aria-modal="true"
        className="modal-dialog"
        onClick={(event) => event.stopPropagation()}
        role="dialog"
      >
        <button aria-label="Cerrar" className="modal-close" onClick={onClose} type="button">×</button>
        <VehiclesEditor cliente={cliente} />
      </div>
    </div>
  );
}

function EstimatesPanel() {
  return (
    <div className="page-content">
      <div className="section-heading">
        <div><h2>Presupuestos recientes</h2><p>Estados y valores ficticios para probar la vista.</p></div>
        <StatusBadge tone="demo">Datos demo</StatusBadge>
      </div>
      <DemoNotice />
      <div className="content-section table-scroll">
        <table className="data-table">
          <thead><tr><th>Referencia</th><th>Cliente y vehículo</th><th>Fecha</th><th>Importe</th><th>Estado</th></tr></thead>
          <tbody>
            {demoEstimates.map((estimate) => (
              <tr key={estimate.id}>
                <td><strong>{estimate.id}</strong></td>
                <td><strong>{estimate.client}</strong><small className="table-detail">{estimate.vehicle}</small></td>
                <td>{estimate.date}</td>
                <td>{new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR' }).format(estimate.amount)}</td>
                <td><StatusBadge tone={estimate.status.toLowerCase()}>{estimate.status}</StatusBadge></td>
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
    <div className="page-content">
      <div className="section-heading">
        <div><h2>Agenda de hoy</h2><p>Las horas y los trabajos son ejemplos de demostración.</p></div>
        <StatusBadge tone="demo">Datos demo</StatusBadge>
      </div>
      <DemoNotice />
      <div className="calendar-toolbar">
        <div aria-label="Vista de agenda" className="calendar-switch" role="group">
          {['day', 'week', 'month'].map((view) => (
            <button
              aria-pressed={calendarView === view}
              className="calendar-tab"
              key={view}
              onClick={() => setCalendarView(view)}
              type="button"
            >
              {{ day: 'Día', week: 'Semana', month: 'Mes' }[view]}
            </button>
          ))}
        </div>
        <p className="calendar-period">
          {calendarView === 'day' ? getTodayLabel() : calendarView === 'week' ? 'Semana actual' : monthLabel}
        </p>
      </div>
      {calendarView === 'day' && (
        <section aria-label="Citas del día" className="content-section appointment-list">
          {getAppointmentsForDate(new Date()).map((appointment) => (
            <article className="appointment-row" key={appointment.id}>
              <time className="appointment-time">{appointment.time}</time>
              <div className="appointment-details">
                <div className="job-title-line">
                  <h3>{appointment.client}</h3>
                  <span className="job-id">{appointment.id}</span>
                </div>
                <p>{appointment.vehicle} <span aria-hidden="true">·</span> {appointment.service}</p>
                <ServiceProgress stage={appointment.stage} />
              </div>
              <StatusBadge tone={appointment.stage === 3 ? 'aprobado' : appointment.stage === 0 ? 'pendiente' : 'neutral'}>
                {progressSteps[appointment.stage]}
              </StatusBadge>
            </article>
          ))}
        </section>
      )}
      {calendarView === 'week' && (
        <div className="week-calendar-scroll">
          <div className="week-calendar">
            {weekDates.map((date) => (
              <section className="week-day" key={getDateKey(date)}>
                <h3>
                  <span>{new Intl.DateTimeFormat('es-ES', { weekday: 'short' }).format(date)}</span>
                  <strong className={getDateKey(date) === getDateKey(new Date()) ? 'today' : ''}>{date.getDate()}</strong>
                </h3>
                <div className="week-events">
                  {getAppointmentsForDate(date).map((appointment) => (
                    <article className="week-event" key={appointment.id}>
                      <time>{appointment.time}</time>
                      <strong>{appointment.client}</strong>
                      <span>{appointment.service}</span>
                    </article>
                  ))}
                  {getAppointmentsForDate(date).length === 0 && <p className="no-events">Sin citas</p>}
                </div>
              </section>
            ))}
          </div>
        </div>
      )}
      {calendarView === 'month' && (
        <div className="month-calendar-scroll">
          <div aria-label={`Calendario de ${monthLabel}`} className="month-calendar" role="grid">
            {['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'].map((day) => (
              <div className="month-weekday" key={day} role="columnheader">{day}</div>
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
                  className={`month-day${isCurrentMonth ? '' : ' is-outside'}${isToday ? ' is-today' : ''}`}
                  key={getDateKey(date)}
                  role="gridcell"
                >
                  <span className="month-day-number">{date.getDate()}</span>
                  {appointments.map((appointment) => (
                    <span className="month-event" key={appointment.id}>
                      <span aria-hidden="true" className="month-event-dot" />
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
    <div className="page-content">
      <div className="section-heading">
        <div><h2>Existencias</h2><p>Unidades disponibles frente al mínimo orientativo.</p></div>
        <StatusBadge tone="demo">Datos demo</StatusBadge>
      </div>
      <DemoNotice />
      <div className="content-section table-scroll">
        <table className="data-table">
          <thead><tr><th>Referencia</th><th>Repuesto</th><th>Disponible</th><th>Mínimo</th><th>Estado</th></tr></thead>
          <tbody>
            {demoParts.map((part) => {
              const lowStock = part.stock < part.minimum;
              return (
                <tr key={part.sku}>
                  <td><strong>{part.sku}</strong></td>
                  <td><strong>{part.name}</strong><small className="table-detail">{part.detail}</small></td>
                  <td className="numeric-cell">{part.stock} un.</td>
                  <td className="numeric-cell">{part.minimum} un.</td>
                  <td><StatusBadge tone={lowStock ? 'rechazado' : 'aprobado'}>{lowStock ? 'Reponer' : 'En stock'}</StatusBadge></td>
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
    <div className="page-content">
      <div className="section-heading">
        <div><h2>Equipo del taller</h2><p>Personas y estados de turno ficticios.</p></div>
        <StatusBadge tone="demo">Datos demo</StatusBadge>
      </div>
      <DemoNotice />
      <section className="content-section team-list">
        {demoStaff.map((member) => (
          <article className="team-row" key={member.initials}>
            <span aria-hidden="true" className="team-initials">{member.initials}</span>
            <div className="team-person"><h3>{member.name}</h3><p>{member.role}</p></div>
            <span className="team-shift">{member.shift}</span>
            <StatusBadge tone={member.status === 'En turno' ? 'aprobado' : 'neutral'}>{member.status}</StatusBadge>
          </article>
        ))}
      </section>
    </div>
  );
}

function SettingsPanel({ palette, onPaletteChange }) {
  return (
    <div className="page-content">
      <div className="section-heading">
        <div><h2>Paleta de colores</h2><p>Regla 60-30-10: 60% base, 30% secundario y 10% acento.</p></div>
      </div>
      <div className="palette-grid">
        {paletteOptions.map((option) => (
          <button
            aria-pressed={palette === option.id}
            className="palette-card"
            key={option.id}
            onClick={() => onPaletteChange(option.id)}
            type="button"
          >
            <span className="palette-swatches" aria-hidden="true">
              {option.colors.map((color) => <span key={color} style={{ background: color }} />)}
            </span>
            <strong>{option.label}</strong>
            <small>{option.colors.join(' · ')}</small>
          </button>
        ))}
      </div>
    </div>
  );
}

function SchedulePanel() {
  return (
    <div className="page-content">
      <div className="section-heading">
        <div><h2>Turnos de esta semana</h2><p>Planificación ficticia, de lunes a viernes.</p></div>
        <StatusBadge tone="demo">Datos demo</StatusBadge>
      </div>
      <DemoNotice />
      <div className="content-section table-scroll">
        <table className="data-table schedule-table">
          <thead><tr><th>Persona</th><th>Lun</th><th>Mar</th><th>Mié</th><th>Jue</th><th>Vie</th></tr></thead>
          <tbody>
            {demoShifts.map((shift) => (
              <tr key={shift.name}>
                <td><strong>{shift.name}</strong><small className="table-detail">{shift.role}</small></td>
                <td>{shift.monday}</td><td>{shift.tuesday}</td><td>{shift.wednesday}</td><td>{shift.thursday}</td><td>{shift.friday}</td>
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
            <button className="primary-button mt-1 w-full" disabled={loading} type="submit">
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
