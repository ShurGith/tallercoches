# Handoff: migración Tailwind (TallerCoches)

## Cómo retomar desde otra máquina
```bash
git clone https://github.com/ShurGith/tallercoches.git
cd tallercoches
git checkout tailwind-migracion
pnpm install
```
Crea el `.env` de la raíz (PORT, DATABASE_URL, JWT_SECRET). No está en el repo.

## Estado
- Rama: `tailwind-migracion` (pusheada a origin).
- Partes 1, 2 y 3 completas: todos los paneles (Overview, Customers, VehiclesEditor, VehiclesModal, Estimates, Appointments, Inventory, Team, Settings, Schedule) usan utilidades Tailwind.
- `index.css` limpio: solo quedan `:root`, bloques `[data-palette]`, estilos base, `.sr-only`, scrollbars, `.icon`, tooltips `::after`, `.status-*` y `prefers-reduced-motion`.
- Aviso de lint de `formError` resuelto (ahora se usa en VehiclesEditor).
- Tests 8/8 y build compila sin avisos.

## Pendiente
1. Verificar en navegador (ver sección "Sin verificar").
2. Commit y push a `tailwind-migracion`. Si hay error irreparable, volver al último commit bueno.

## Reglas
- Mantener textos, aria-labels, `data-tooltip` y nombres accesibles ("Editar", "Coches") que usa `App.test.js`.
- Conservar en `index.css`: `:root` y bloques `[data-palette]`, `.sr-only`, scrollbars, reglas `::after` de tooltips, keyframes, `.status-*`, `.icon`.
- No tocar `index.js`, `api.js`, `database/`. No añadir dependencias.
- No commitear `repomix-output.xml`.
- Co-authored-by: Copilot App <223556219+Copilot@users.noreply.github.com>

## Comandos
- Tests: `CI=true pnpm --filter app-clientes test`
- Build: `pnpm --filter app-clientes build`
- API: `node index.js` (puerto 4000). Frontend: puerto 3010.

## Sin verificar en navegador
Tooltips, paletas 4-6, transparencias de badges y botones, redirección 401.
