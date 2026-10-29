# Project Context & Rules for Claude Code

## 1. Project Overview

- Topic: Zalo Mini App for Personal Trainers (PTs) to manage clients and track workout progress[cite: 1].
- End Users: PTs only (Clients do not use the app directly)[cite: 1].
- Core MVP Features: Dashboard (with 7-10 days inactive client alerts), Client Management, Workout & Session Schedule, InBody Progress Tracking, and Interaction Notes[cite: 1].
- Tech Stack: React (JavaScript, Vite 5)[cite: 3], Tailwind CSS, ZaUI (`zmp-ui` package).
- Working Directory: `my-app/`.

## 2. STRICT ZaUI (`zmp-ui`) & JSX RULES (NEVER VIOLATE)

- **NO HALLUCINATED LAYOUT COMPONENTS**: `zmp-ui` DOES NOT HAVE `<Card>`, `<Row>`, `<Col>`, `<Grid>`, or `<Container>`. NEVER import or use them.
- **NO HALLUCINATED UI COMPONENTS**: `zmp-ui` DOES NOT HAVE `<Badge>`, `<Tag>`, `<Chip>`, `<Divider>`, or `<Empty>`. NEVER import or use them. Replace with standard HTML `<span>`/`<div>` + Tailwind CSS.
- **USE HTML + TAILWIND FOR LAYOUTS**: Build all cards, grids, columns, and containers using standard HTML tags (`<div>`, `<span>`) styled with Tailwind CSS (e.g., `<div className="bg-white rounded-xl shadow-sm p-4 mb-3 flex flex-col">`).
- **ALLOWED `zmp-ui` IMPORTS ONLY**: Only import verified components from `zmp-ui`: `App`, `ZMPRouter`, `AnimationRoutes`, `Page`, `Header`, `Box`, `Text`, `Button`, `Icon`, `Input`, `Select`, `DatePicker`, `List`, `Tabs`, `BottomNavigation`, `Modal`, `Avatar`, `Switch`, `Checkbox`.
- **PAGE WRAPPER**: Every screen component inside `src/pages/`[cite: 4] must return a `<Page>` tag as its root wrapper.
- **STRICT JSX MATCHING**: Before saving any file, verify that every opening tag (`<div>`, `<Box>`, `<Page>`) has its exact corresponding closing tag (`</div>`, `</Box>`, `</Page>`). Never leave orphaned tags like `</Col>`.

## 3. Coding Workflow

- Only modify the files requested in the current task.
- Keep components clean, modular, and beginner-friendly.
- Use mock data in state/constants for UI development before Firebase integration.

## 5. THESIS DEFENSE CODE SIMPLICITY RULES (MANDATORY)

- Write clean, minimal, beginner-friendly React code that is easy to read and explain during a university thesis defense.
- ONLY use `useState` and `useEffect`. Avoid `useReducer`, `useMemo`, `useCallback`, `useLayoutEffect`, and `requestAnimationFrame`.
- Use standard Tailwind utility classes (`transition-transform duration-300 translate-x-0 translate-x-full`) instead of complex inline style objects whenever possible.
- Add brief, clear Vietnamese comments (`// ...`) above state declarations, event handlers, and main JSX sections.
