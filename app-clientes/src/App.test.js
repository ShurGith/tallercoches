import { act, fireEvent, render, screen, waitFor } from '@testing-library/react';
import App from './App';
import api from './api';

jest.mock('./api', () => ({
  get: jest.fn().mockResolvedValue({ data: [] }),
  post: jest.fn(),
  put: jest.fn(),
  delete: jest.fn(),
}));

beforeEach(() => {
  sessionStorage.clear();
  jest.clearAllMocks();
  api.get.mockResolvedValue({ data: [] });
  api.post.mockResolvedValue({ data: { token: 'test-token' } });
  api.put.mockResolvedValue({ data: {} });
  api.delete.mockResolvedValue({ data: {} });
});

async function renderAuthenticatedApp() {
  sessionStorage.setItem('token', 'test-token');
  let result;
  await act(async () => {
    result = render(<App />);
    await new Promise((resolve) => setTimeout(resolve, 0));
  });
  return result;
}

test('renders the sign-in form', () => {
  render(<App />);
  expect(screen.getByRole('heading', { name: /iniciar sesión/i })).toBeInTheDocument();
  expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
});

test('navigates to demo panels without persisting demo data', async () => {
  await renderAuthenticatedApp();

  expect(await screen.findByRole('heading', { name: 'Resumen' })).toBeInTheDocument();
  fireEvent.click(screen.getByRole('button', { name: 'Presupuestos' }));

  expect(screen.getByRole('heading', { name: 'Presupuestos recientes' })).toBeInTheDocument();
  expect(screen.getByText(/no se guardan en la base de datos/i)).toBeInTheDocument();
});

test('adds a plated vehicle to the customer being edited', async () => {
  const cliente = { id: 7, nombre: 'Ana Pérez', email: '', telefono: '', notas: '' };
  const vehiculo = { id: 1, cliente_id: 7, matricula: '1234ABC', marca: 'Seat', modelo: 'Ibiza', anio: 2015, km: 90000 };
  api.get.mockImplementation((url) => Promise.resolve({
    data: url === '/clientes' ? [cliente] : url === '/clientes/7/vehiculos' ? [vehiculo] : [],
  }));

  await renderAuthenticatedApp();
  fireEvent.click(await screen.findByRole('button', { name: 'Clientes' }));
  fireEvent.click((await screen.findAllByRole('button', { name: 'Editar' }))[0]);

  expect(await screen.findByText('1234ABC')).toBeInTheDocument();
  fireEvent.change(screen.getByLabelText(/matrícula/i), { target: { name: 'matricula', value: '5678 DEF' } });
  fireEvent.change(screen.getByLabelText(/marca/i), { target: { name: 'marca', value: 'Renault' } });
  fireEvent.click(screen.getByRole('button', { name: 'Añadir vehículo' }));

  await waitFor(() => expect(api.post).toHaveBeenCalledWith('/clientes/7/vehiculos', expect.objectContaining({ matricula: '5678 DEF', marca: 'Renault' })));
});

test('all requested workshop panels are reachable from the sidebar', async () => {
  await renderAuthenticatedApp();

  const panels = [
    ['Clientes', 'Registro de clientes'],
    ['Presupuestos', 'Presupuestos recientes'],
    ['Citas', 'Agenda de hoy'],
    ['Repuestos', 'Existencias'],
    ['Personal', 'Equipo del taller'],
    ['Horarios', 'Turnos de esta semana'],
  ];

  panels.forEach(([navigationLabel, heading]) => {
    fireEvent.click(screen.getByRole('button', { name: navigationLabel }));
    expect(screen.getByRole('heading', { name: heading })).toBeInTheDocument();
  });
});

test('switches the appointments calendar between day, week, and month', async () => {
  await renderAuthenticatedApp();

  await screen.findByRole('heading', { name: 'Resumen' });
  fireEvent.click(screen.getByRole('button', { name: 'Citas' }));
  expect(screen.getByRole('region', { name: 'Citas del día' })).toBeInTheDocument();

  fireEvent.click(screen.getByRole('button', { name: 'Semana' }));
  expect(screen.getByText('Semana actual')).toBeInTheDocument();
  expect(screen.getByText('Lucía Morales')).toBeInTheDocument();

  fireEvent.click(screen.getByRole('button', { name: 'Mes' }));
  expect(screen.getByLabelText(/calendario de/i)).toBeInTheDocument();
});

test('mobile navigation closes after selecting a panel', async () => {
  await renderAuthenticatedApp();

  const menuButton = screen.getByRole('button', { name: 'Abrir menú' });
  fireEvent.click(menuButton);
  expect(screen.getByRole('button', { name: 'Cerrar menú' })).toHaveAttribute('aria-expanded', 'true');

  fireEvent.click(screen.getByRole('button', { name: 'Repuestos' }));
  expect(screen.getByRole('heading', { name: 'Existencias' })).toBeInTheDocument();
  expect(screen.getByRole('button', { name: 'Abrir menú' })).toHaveAttribute('aria-expanded', 'false');
});
