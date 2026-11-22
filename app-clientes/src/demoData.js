export const demoAppointments = [
  {
    id: 'C-1042',
    time: '08:30',
    client: 'Lucía Morales',
    vehicle: 'SEAT Ibiza · 2019',
    service: 'Revisión y cambio de aceite',
    stage: 2,
    dateOffset: 0,
  },
  {
    id: 'C-1047',
    time: '10:00',
    client: 'Hugo Martín',
    vehicle: 'Ford Focus · 2017',
    service: 'Revisión de frenos',
    stage: 1,
    dateOffset: 0,
  },
  {
    id: 'C-1051',
    time: '11:30',
    client: 'Sara Ortega',
    vehicle: 'Renault Clio · 2021',
    service: 'Diagnóstico de motor',
    stage: 0,
    dateOffset: 1,
  },
  {
    id: 'C-1056',
    time: '13:00',
    client: 'Pablo Ruiz',
    vehicle: 'Toyota Yaris · 2020',
    service: 'Sustitución de batería',
    stage: 3,
    dateOffset: 3,
  },
];

export const demoEstimates = [
  { id: 'P-0187', client: 'Marta Ríos', vehicle: 'Toyota Yaris · 2018', date: 'Hoy', amount: 486.5, status: 'Pendiente' },
  { id: 'P-0186', client: 'Hugo Martín', vehicle: 'Ford Focus · 2017', date: 'Hoy', amount: 235, status: 'Aprobado' },
  { id: 'P-0185', client: 'Sara Ortega', vehicle: 'Renault Clio · 2021', date: 'Ayer', amount: 128.75, status: 'Pendiente' },
  { id: 'P-0184', client: 'Pablo Ruiz', vehicle: 'Toyota Yaris · 2020', date: 'Ayer', amount: 342, status: 'Rechazado' },
];

export const demoParts = [
  { sku: 'REP-014', name: 'Filtro de aceite', detail: 'Motor · universal', stock: 12, minimum: 8 },
  { sku: 'REP-028', name: 'Pastillas de freno', detail: 'Eje delantero · compactos', stock: 3, minimum: 6 },
  { sku: 'REP-041', name: 'Lámpara H7', detail: 'Iluminación · 12 V', stock: 4, minimum: 5 },
  { sku: 'REP-056', name: 'Filtro de habitáculo', detail: 'Climatización · estándar', stock: 18, minimum: 8 },
  { sku: 'REP-072', name: 'Aceite 5W-30', detail: 'Lubricantes · envase 1 L', stock: 9, minimum: 10 },
];

export const demoStaff = [
  { name: 'Alicia Gómez', initials: 'AG', role: 'Recepción', shift: '08:00–16:00', status: 'En turno' },
  { name: 'Bruno Vega', initials: 'BV', role: 'Mecánica', shift: '08:30–16:30', status: 'En turno' },
  { name: 'Carla Méndez', initials: 'CM', role: 'Mecánica', shift: '10:00–18:00', status: 'Próximo turno' },
  { name: 'Diego Santos', initials: 'DS', role: 'Mecánica', shift: 'Descanso', status: 'Libre' },
];

export const demoShifts = [
  { name: 'Alicia Gómez', role: 'Recepción', monday: '08:00–16:00', tuesday: '08:00–16:00', wednesday: '08:00–16:00', thursday: '08:00–16:00', friday: '08:00–14:00' },
  { name: 'Bruno Vega', role: 'Mecánica', monday: '08:30–16:30', tuesday: '08:30–16:30', wednesday: 'Descanso', thursday: '08:30–16:30', friday: '08:30–16:30' },
  { name: 'Carla Méndez', role: 'Mecánica', monday: '10:00–18:00', tuesday: '10:00–18:00', wednesday: '10:00–18:00', thursday: 'Descanso', friday: '10:00–18:00' },
  { name: 'Diego Santos', role: 'Mecánica', monday: '08:00–16:00', tuesday: 'Descanso', wednesday: '08:00–16:00', thursday: '08:00–16:00', friday: '08:00–16:00' },
];
