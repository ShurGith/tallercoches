---
version: 1
slug: "src-app-js"
primary_target: "src/App.js"
related_targets: []
---

# Surface brief: TallerCoches workshop operations

## Scope
Authenticated workshop dashboard with navigation for overview, customers, estimates, appointments, parts, team, and working hours.

## Visitor mode
Operate.

## Audience, job, and action
**Assumption, unconfirmed:** a workshop owner or manager is the primary visitor, with reception and workshop staff as collaborators. They need to see the day's work, find the relevant record, and move between operational areas without losing context.

## Proof and content
Customer records continue to use the existing API. Other requested panels use clearly labeled synthetic demonstration records only. Show useful operational states and realistic Spanish labels; make no commercial or performance claims.

## Constraints
Preserve login, customer search/CRUD/archive behavior, and the current API/database boundary. Do not write demo records to Supabase or alter the existing user. Keep navigation keyboard-accessible and usable on narrow screens.

## Unresolved decisions
Role-specific permissions, persistence and APIs for estimates, appointments, inventory, staff, and schedules remain future work. The user was unavailable to choose a visual direction; this build uses the assigned direction from the concept roll as an explicit working assumption, not a confirmed preference.

## Direction contract
THESIS: Make today's workshop flow legible at a glance and keep every operational area one familiar navigation action away; avoid a generic KPI dashboard whose data cannot point to a next step.
OWN-WORLD: Use a deep petrol-teal navigation rail, a cool pale service-bay ground, clean white work surfaces, and acid-lime only for active progress and primary actions; use a system sans with compact, aligned labels and readable table density. Amber and red remain reserved for meaningful warning and critical states.
STORY: The team sees which jobs need attention, follows their status through the day, and can move directly to the customer, estimate, parts, or schedule view. Demo records are visibly synthetic and never imply persistence.
FIRST VIEWPORT: A fixed desktop side rail names all seven areas; the working canvas opens on a clear daily summary, four scoped status measures, and a time-ordered service lane with statuses and next actions. On mobile, the rail becomes an explicit menu and the same content stacks without horizontal page overflow.
FORM: Service-lane signal grid, sixth of seven grounded directions; signature move is a colored status track connecting appointment rows to their current workshop stage. `seed:282d16841163c9cb`.
FINISH: unreviewed and undocumented is unfinished; this build ends with the finish review, the verdict, DESIGN.md, and every shipping raster carrying its provenance
