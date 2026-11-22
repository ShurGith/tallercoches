---
name: TallerCoches
description: Taller operations, kept clear from the service lane to the front desk.
colors:
  ink: "#15383a"
  ink-deep: "#102d2f"
  ink-soft: "#315455"
  canvas: "#edf2ef"
  surface: "#ffffff"
  surface-tint: "#f5f8f6"
  text: "#192f30"
  muted: "#627473"
  line: "#d7e1de"
  lime: "#d8f16a"
  lime-deep: "#35530d"
  amber: "#9a5c08"
  amber-bg: "#fff3d8"
  red: "#a13c34"
  red-bg: "#fde9e6"
  green: "#2f6848"
  green-bg: "#e4f2e9"
typography:
  display:
    fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif"
    fontSize: "clamp(42px, 6vw, 76px)"
    lineHeight: 1.02
    letterSpacing: "-0.035em"
  headline:
    fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif"
    fontSize: "21px"
    lineHeight: 1.3
  title:
    fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif"
    fontSize: "18px"
  body:
    fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif"
    fontSize: "14px"
    lineHeight: 1.5
  label:
    fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif"
    fontSize: "12px"
    fontWeight: 650
rounded:
  sm: "8px"
  nav: "9px"
  md: "12px"
  lg: "16px"
  pill: "999px"
spacing:
  sm: "8px"
  md: "12px"
  lg: "16px"
  xl: "20px"
  2xl: "24px"
components:
  button-primary:
    backgroundColor: "{colors.lime}"
    textColor: "{colors.ink-deep}"
    rounded: "{rounded.sm}"
    padding: "10px 16px"
    height: "42px"
  button-primary-hover:
    backgroundColor: "#e3f88a"
  button-secondary:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.ink}"
    rounded: "{rounded.sm}"
    padding: "9px 13px"
    height: "42px"
  input:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.text}"
    rounded: "{rounded.sm}"
    padding: "10px 12px"
    height: "44px"
  nav-active:
    backgroundColor: "{colors.lime}"
    textColor: "{colors.ink-deep}"
    rounded: "{rounded.nav}"
    padding: "10px 12px"
    height: "46px"
  status-chip-warning:
    backgroundColor: "{colors.amber-bg}"
    textColor: "{colors.amber}"
    rounded: "{rounded.pill}"
    padding: "4px 9px"
    height: "25px"
  content-panel:
    backgroundColor: "{colors.surface}"
    rounded: "{rounded.md}"
    padding: "22px"
---

# Design System: TallerCoches

## Overview

**Creative North Star: "The Service-Lane Signal Grid"**

This implementation-derived direction is an explicit working assumption, not a confirmed brand choice. TallerCoches should make the workshop's daily flow legible at a glance: keep the main work areas one familiar navigation action away, show the next operational step, and reserve strong color for meaningful state. The visual world pairs a deep petrol rail with a cool service-bay canvas and crisp white work surfaces.

The interface is practical and calm rather than promotional. Compact labels and aligned information support quick scanning, while the lime accent marks the active destination, current progress, and primary action. Warning and critical colors stay reserved for exceptions. Appointment, estimate, inventory, staff, and schedule examples must remain visibly synthetic until those modules are connected to real persistence.

**Key Characteristics:**
- Operational clarity over decorative dashboard metrics.
- Petrol navigation, cool neutral workspace, and restrained lime signals.
- A connected service-stage track that makes work status visible.
- Synthetic data is explicitly labeled and never presented as persisted.

## Colors

The palette uses petrol as its structural anchor, lime as a deliberate action and progress signal, cool neutrals for the working canvas, and separate semantic colors for operational states.

### Primary
- **Deep Petrol** (`#15383a`): Fixed desktop navigation rail and primary brand surface.
- **Workshop Lime** (`#d8f16a`): Active navigation, current progress, and primary actions; use sparingly so state remains easy to spot.
- **Dark Petrol** (`#102d2f`): High-contrast text and icon color on lime surfaces.

### Secondary
- **Soft Petrol** (`#315455`): Navigation hover and supporting petrol-colored details.
- **Olive Signal** (`#35530d`): Text and link emphasis where the lime accent needs a darker counterpart.

### Tertiary
- **Warning Ochre** (`#9a5c08`) on **Warm Warning Wash** (`#fff3d8`): Pending work and low-stock attention.
- **Repair Red** (`#a13c34`) on **Critical Wash** (`#fde9e6`): Errors and critical states only.
- **Confirmation Green** (`#2f6848`) on **Success Wash** (`#e4f2e9`): Completed or healthy states.

### Neutral
- **Service-Bay Canvas** (`#edf2ef`): Page background.
- **Clean Work Surface** (`#ffffff`): Cards, forms, and primary content panels.
- **Washed Surface** (`#f5f8f6`): Quiet hover and secondary surface treatment.
- **Carbon Teal Text** (`#192f30`): Default body copy.
- **Harbor Muted** (`#627473`): Supporting text and labels.
- **Mist Border** (`#d7e1de`): Panel outlines and dividers.

### Named Rules
**The Signal-Only Accent Rule.** Lime marks an active action, navigation state, or work-progress state; do not use it as decoration.

**The Exception-Only Status Rule.** Amber and red communicate actionable exceptions, not general emphasis.

## Typography

**Display Font:** System sans-serif stack (platform-native fallback)
**Body Font:** System sans-serif stack (platform-native fallback)
**Label/Mono Font:** No separate label or monospace family is used.

**Character:** Neutral, sturdy sans-serif typography keeps operational data familiar and quick to scan. The hierarchy comes from size, weight, alignment, and tabular numerals rather than a decorative font pairing.

### Hierarchy
- **Display** (browser heading weight, `clamp(42px, 6vw, 76px)`, line-height `1.02`): Authentication introduction only; reduces to `38px` on narrow screens.
- **Headline** (browser heading weight, `21px`, line-height `1.3`): Page and main-section headings.
- **Title** (browser heading weight, `18px`): Cards and subsection titles.
- **Body** (`400`, `14px`, line-height `1.5`): Record details, descriptions, and general interface copy.
- **Label** (`650–700`, `11–13px`): Navigation, status, and compact metadata; use tabular numerals for time and quantities.

### Named Rules
**The Scan-First Hierarchy Rule.** Use concise headings and compact supporting labels; do not promote secondary metadata above the record or task it describes.

## Layout

The desktop shell uses a fixed `258px` navigation rail beside a flexible content area, with the working page capped at `1500px` and horizontally centered. Main sections use a `20px` gap; the daily overview pairs a wider work list with a narrower attention list. The recurring spacing rhythm uses `8`, `12`, `16`, `20`, and `24px`, with page padding expanding from `20px` to a viewport-based maximum.

At `1100px`, two-column operational layouts collapse to one column. At `760px`, the fixed rail becomes an explicit off-canvas menu with a backdrop, page content loses its left offset, and the dashboard stacks vertically. Calendar views preserve the same task information without page-level horizontal overflow; dense day/week details can scroll within their own bounded region when necessary.

## Elevation & Depth

The interface is flat by default: white panels sit on the cool canvas and use a thin border rather than a broad shadow. Depth is mostly conveyed through tonal contrast, alignment, and separators. A small shadow differentiates the selected calendar tab, and the active service stage receives a subtle ring.

### Shadow Vocabulary
- **Selected calendar view** (`0 1px 3px rgb(21 56 58 / 13%)`): Separate the selected tab from its quiet segmented-control background.
- **Current service stage** (`0 0 0 3px #edf5d6`): Mark progress without making the whole work row appear elevated.

### Named Rules
**The Flat-By-Default Rule.** Do not add shadows to ordinary cards or navigation items; reserve depth for a selected control or live progress marker.

## Shapes

Controls and fields use an `8px` radius; navigation and compact brand marks use `9px`; content panels use `12px`; the authentication surfaces use `16px`. Status badges are pill-shaped. Borders are thin and quiet, with no recurring clipped or ornamental silhouettes.

## Components

### Buttons
- **Shape:** Compact rounded rectangle (`8px`).
- **Primary:** Workshop lime background, dark-petrol text, `10px 16px` padding, and `42px` minimum height.
- **Hover / Focus:** A lightened lime hover; keyboard focus uses a visible `3px` olive outline with `3px` offset.
- **Secondary:** White surface, petrol text, quiet border, `9px 13px` padding.

### Chips
- **Style:** Semantic status color on a pale matching background, with a pill radius and compact `4px 9px` padding.
- **State:** Keep amber, red, and green tied to pending, critical, and successful states; do not use status chips as generic decoration.

### Cards / Containers
- **Corner Style:** `12px` for operational panels.
- **Background:** White against the service-bay canvas.
- **Shadow Strategy:** Flat with a `1px` border; see the Flat-By-Default Rule.
- **Internal Padding:** `22px` for primary panels.

### Inputs / Fields
- **Style:** White background, `1px` muted border, `8px` radius, `10px 12px` padding, and `44px` minimum height.
- **Focus:** Visible `3px` olive outline with `3px` offset.
- **Error:** Red text on a pale-red surface with a matching quiet border.

### Navigation
- **Style:** Fixed petrol rail at desktop with `46px` minimum-height items. Inactive items use light text; hover uses soft petrol; the active page uses lime and dark-petrol text.
- **Mobile:** An explicit menu button opens an off-canvas rail and backdrop; selecting a destination closes it.

### Service-Stage Track
Appointment rows connect the workshop stages with a thin line and circular markers. Completed stages use a muted green, the current stage uses lime plus a restrained ring, and future stages remain neutral. Preserve the same ordered status when the layout stacks on mobile.

## Do's and Don'ts

### Do:
- **Do** keep daily work, its current stage, and the next action easy to scan.
- **Do** use the petrol rail and cool neutral workspace to maintain a stable frame between modules.
- **Do** label synthetic records and state clearly that demo panels are not persisted.
- **Do** keep keyboard focus visible and make mobile navigation explicit.

### Don't:
- **Don't** use lime as background decoration or across large content areas.
- **Don't** use amber or red for non-status emphasis.
- **Don't** imply synthetic customers, appointments, estimates, or stock are real or saved.
- **Don't** add decorative shadows to ordinary panels.
