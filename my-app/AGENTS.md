# Project Context & Rules for Claude Code / OpenCode

## 1. Project Overview

- **Topic:** Zalo Mini App for Personal Trainers (PTs) to manage clients and track workout progress.
- **End Users:** PTs only (Clients do not use the app directly).
- **Core MVP Features:** Dashboard (with 7-10 days inactive client alerts), Client Management, Workout & Session Schedule, InBody Progress Tracking, and Interaction Notes.
- **Tech Stack:** React (JavaScript, Vite 5), Tailwind CSS, ZaUI (`zmp-ui` package).
- **Working Directory:** `my-app/`.
- **Target Runtime:** Zalo Mini App WebView (Android/iOS). **Không** giả định đây là trình duyệt web độc lập.

## 2. STRICT ZaUI (`zmp-ui`) & JSX RULES (NEVER VIOLATE)

- **NO HALLUCINATED LAYOUT COMPONENTS:** `zmp-ui` DOES NOT HAVE `<Card>`, `<Row>`, `<Col>`, `<Grid>`, or `<Container>`. NEVER import or use them.
- **NO HALLUCINATED UI COMPONENTS:** `zmp-ui` DOES NOT HAVE `<Badge>`, `<Tag>`, `<Chip>`, `<Divider>`, or `<Empty>`. NEVER import or use them. Replace with standard HTML `<span>`/`<div>` + Tailwind CSS.
- **USE HTML + TAILWIND FOR LAYOUTS:** Build all cards, grids, columns, and containers using standard HTML tags (`<div>`, `<span>`) styled with Tailwind CSS (e.g., `<div className="bg-white rounded-xl shadow-sm p-4 mb-3 flex flex-col">`).
- **ALLOWED `zmp-ui` IMPORTS ONLY:** Only import verified components from `zmp-ui`: `App`, `ZMPRouter`, `AnimationRoutes`, `Page`, `Header`, `Box`, `Text`, `Button`, `Icon`, `Input`, `Select`, `DatePicker`, `List`, `Tabs`, `BottomNavigation`, `Modal`, `Avatar`, `Switch`, `Checkbox`.
- **PAGE WRAPPER:** Every screen component inside `src/pages/` must return a `<Page>` tag as its root wrapper.
- **STRICT JSX MATCHING:** Before saving any file, verify that every opening tag (`<div>`, `<Box>`, `<Page>`) has its exact corresponding closing tag (`</div>`, `</Box>`, `</Page>`). Never leave orphaned tags like `</Col>`.

## 3. Coding Workflow

- Only modify the files requested in the current task.
- Keep components clean, modular, and beginner-friendly.
- Use mock data in state/constants for UI development before Firebase integration.

## 4. THESIS DEFENSE CODE SIMPLICITY RULES (MANDATORY)

- Write clean, minimal, beginner-friendly React code that is easy to read and explain during a university thesis defense.
- **ONLY use `useState` and `useEffect`.** Avoid `useReducer`, `useMemo`, `useCallback`, `useLayoutEffect`, and `requestAnimationFrame`.
- Use standard Tailwind utility classes (`transition-transform duration-300 translate-x-0 translate-x-full`) instead of complex inline style objects whenever possible.
- Add brief, clear Vietnamese comments (`// ...`) above state declarations, event handlers, and main JSX sections.

---

## 5. SKILL ORCHESTRATION (MWG + Zalo Mini App Skills)

You have **2 skills** installed in OpenCode:
- **`modern-web-guidance` (MWG):** General modern web knowledge (CSS, Performance, Accessibility, Browser APIs).
- **`zalo-mini-app-skills`:** Zalo Mini App-specific knowledge (ZaUI components, `zmp-sdk`, Checkout SDK, Zalo design guidelines).

### 5.1. Priority Rule

When the two skills give conflicting suggestions, **`zalo-mini-app-skills` always wins** if the conflict involves:
- UI components (ZaUI vs. plain HTML/CSS).
- Storage APIs (`nativeStorage` vs. `localStorage`/`sessionStorage`/`Cookie`).
- App configuration (`app-config.json` vs. CSS/JS).
- Design System (colors, typography, spacing per Zalo).

`modern-web-guidance` is used to **optimize the web core** (layout, animation, performance, accessibility) **within** Zalo's constraints.

### 5.2. When to Use Which Skill

| Situation | Preferred Skill | Notes |
|---|---|---|
| Writing/editing JSX with ZaUI | `zalo-mini-app-skills` | Prioritize verified ZaUI components in Section 2. |
| Layout, grid, flex, spacing | `modern-web-guidance` (if needed) + Tailwind | **Do not** use non-existent ZaUI layout components. |
| Animation, transition, modal behavior | `modern-web-guidance` | But verify Zalo WebView compatibility. |
| Calling Zalo APIs (`authorize`, `getUserInfo`, `Storage`, etc.) | `zalo-mini-app-skills` | Never substitute with browser APIs. |
| Data storage | `zalo-mini-app-skills` | Must use `nativeStorage` from `zmp-sdk`. |
| Performance optimization (LCP, INP, images) | `modern-web-guidance` | Apply within Zalo WebView limits. |
| Accessibility (screen reader, focus) | `modern-web-guidance` | Combine with Zalo design guidelines. |
| Header, status bar, navigation config | `zalo-mini-app-skills` | Edit `app-config.json`, not plain CSS. |

### 5.3. Baseline Target for MWG

To make MWG suggest features compatible with Zalo's WebView (which often runs on older Chromium than the latest browsers), declare the Baseline target in this file:

```markdown
## AI Development Configuration
This project's Baseline target is Baseline 2023.

## HARNESS WORKFLOW (Appended from learn-harness-engineering)

### Mandatory Startup Procedure (Every Session)

Before writing any code, do the following in order:

1. Run `pwd` to confirm you are in `my-app/`.
2. Read `progress.md` to get the last verified state and next step.
3. Read `feature_list.json` and pick **exactly one** unfinished feature with the highest priority.
4. Run `git log --oneline -5` to review recent commits.
5. Run `./init.sh` to verify the environment is healthy.
6. **If `init.sh` fails**, repair the baseline first. Do not start a new feature on a broken baseline.

### In-Session Rules

- **One feature at a time.** Do not expand scope to other features.
- **Do not claim "done"** without running the required verification and recording evidence.
- Stay in scope: do not modify files unrelated to the selected feature.
- Do not silently change verification rules during implementation.

### Definition of Done

A feature is marked `passing` in `feature_list.json` only when **all** of the following are true:

- The intended user-visible behavior is implemented.
- The required verification command(s) have **actually run and passed**.
- Evidence (command output, commit hash, or manual test description) is recorded in the `evidence` field of that feature.

### Session Close-Out (Mandatory)

Before ending a session:

1. Update `progress.md` with what was done, what is in progress, next steps, and any risks or blockers.
2. Update `feature_list.json` with the new feature status and evidence.
3. Commit with a descriptive message (e.g., `feat: add inactive client alert on dashboard`).
4. Leave the repo clean enough for the next session to run `./init.sh` immediately.