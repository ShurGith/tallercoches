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
- Rama: `tailwind-migracion` (pusheada a origin). Commit `435470f` = WIP.
- `main` tiene `f5e259b`: parte 1 completa (auth, shell, sidebar, cabecera).
- En `435470f`: `App.js` con parte 2 a medias. `CustomersPanel`, `VehiclesEditor`, `VehiclesModal`, `EstimatesPanel`, `AppointmentsPanel` siguen con clases CSS. `index.css` sin tocar. Hay una constante `formError` sin usar (aviso de lint).
- Tests 8/8 y build compila (con 1 aviso).

## Pendiente
1. Parte 2: convertir a utilidades Tailwind: OverviewPanel (ya hecho), CustomersPanel, VehiclesEditor, VehiclesModal, EstimatesPanel, AppointmentsPanel. Borrar de `index.css` lo que ya no se use.
2. Parte 3: InventoryPanel, TeamPanel, SettingsPanel (paletas), SchedulePanel. Limpieza final de `index.css`.
3. Verificar: `CI=true pnpm --filter app-clientes test` (8 deben pasar) y `pnpm --filter app-clientes build`.
4. Commit y push a `tailwind-migracion`. Si hay error irreparable, volver al último commit bueno.

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
