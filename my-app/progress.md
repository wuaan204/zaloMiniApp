# Session Progress Log

## Current State

**Last Updated:** 2026-11-17
**Session ID:** N/A (OpenCode bug-fix session)
**Active Feature:** feat-011 - Critical Navigation, Zalo Deep Link & Top Safe-Area Fixes

## Status

### What's Done

- [x] Added feat-011 to `feature_list.json` and marked it `passing`.
- [x] Dashboard → `Xem hồ sơ đầy đủ` now syncs `selectedClient` from the shared `clients` list, marks forward navigation, and opens `/client-detail` directly for that client.
- [x] Back from the full profile returns cleanly via `navigate(-1)`.
- [x] Hardened `AppContext` selected-client sync/update with string ID comparisons.
- [x] Both quick-reschedule panels (`/clients` and `/workouts`) resolve the real client and clean phone number from Context.
- [x] Both Zalo confirmation actions are real `<a href="https://zalo.me/<phone>">` elements with `stopPropagation`, clipboard copy, and no `preventDefault`.
- [x] Removed top padding/margins before every sticky header so scroll containers start at `y = 0`.
- [x] All page/sub-page headers now use `sticky top-0 z-30 bg-white border-b border-slate-200 w-full` plus `paddingTop: max(env(safe-area-inset-top, 0px), 36px)`.
- [x] Verified all 10 routes in the running app at `localhost:2999`.

### What's In Progress

- [ ] None.

### What's Next

1. Verify feat-002 / feat-003 / feat-005 / feat-006 manually and record evidence.
2. Add real `build` / `lint` scripts to `package.json` if the thesis requires automated gates.
3. Migrate `sessionStorage` to `nativeStorage` from `zmp-sdk`.
4. Decide whether to restore `CLAUDE.md` or keep `AGENTS.md` as the only rule file.
5. Re-test the Zalo deep links on a real iPhone/Android Zalo WebView (browser smoke tests only verified the anchor contract).

## Blockers / Risks

- [ ] `CLAUDE.md` is absent from the working tree; `AGENTS.md` remains the source of truth.
- [ ] `AGENTS.md` requires `nativeStorage`, but the app still uses `sessionStorage` (mock/demo only).
- [ ] No lint/test scripts; verification is `npx zmp build` plus browser smoke tests.
- [ ] Custom dates store `dateLabel` as `DD/MM/YYYY` and `date` as `YYYY-MM-DD`; always keep both in sync via the exported helpers.
- [ ] Selected client state is in memory only; a hard reload on `/client-detail` still shows the fallback Back button.
- [ ] Zalo anchors rely on the OS/browser Universal Link; actual device behavior still needs manual confirmation.

## Decisions Made

- **ISO-date matching for availability**: `getSlotAvailability` matches either the exact `dateLabel` or the derived ISO `date`, so relative labels and calendar dates agree.
- **CSS `nav-instant` class on `<html>`**: does not import ZaUI's internal `AnimationRouterContext`; it is simpler and keeps the code beginner-friendly. The class is removed after 450ms.
- **150ms transform + opacity transitions**: subtle and fast for drill-down/back navigation.
- **Reschedule button on every workout card**: including completed sessions, so the PT can correct any schedule.
- **Date input next to quick pills**: highlighted with a blue border/ring when a specific calendar date is active.
- **Opaque sticky headers with safe-area padding**: avoids notch/status-bar bleed-through without adding a second scroll container.
- **Real `<a>` elements for Zalo**: native anchors are not blocked like `window.open`, and stopping propagation prevents the parent card from navigating away.

## Files Modified This Session

- `src/context/AppContext.jsx` - string-safe selected-client sync/update
- `src/pages/dashboard.jsx` - dashboard-to-full-profile navigation + safe-area header
- `src/pages/clients.jsx` - Zalo deep link, clean phone resolution, safe-area headers
- `src/pages/workouts.jsx` - Zalo deep link, clean phone resolution, safe-area headers
- `src/pages/progress.jsx` - solid safe-area header
- `feature_list.json` - added feat-011 with evidence
- `progress.md` - this close-out update

## Evidence of Completion

- [x] `npx zmp build` passed: 528 modules, built in ~8.9s.
- [x] Browser smoke tests at `http://localhost:2999`:
  - Dashboard → Phạm Thị Dung `Chi tiết` → `/dashboard-client` → `Xem hồ sơ đầy đủ` opened `/client-detail` for Phạm Thị Dung; `nav_direction=forward`.
  - Back from `/client-detail` returned to `/dashboard-client`; `nav_direction=back`.
  - Client quick-reschedule banner rendered `<a>` with `href=https://zalo.me/0912345678`, `target=_blank`, and `defaultPrevented=false`.
  - Workout quick-reschedule banner rendered `<a>` with `href=https://zalo.me/0901234567`, `target=_blank`, and `defaultPrevented=false`.
  - All 10 route headers (`/`, `/dashboard-client`, `/clients`, `/client-detail`, `/client-add`, `/workouts`, `/workout-detail`, `/workout-add`, `/progress`, `/progress-add`) computed `position=sticky`, `top=0px`, `z-index=30`, `background=rgb(255, 255, 255)`, `padding-top=36px`.
  - Every `.app-page-scroll` container computed `padding-top=0px`, `margin-top=0px`; header top was `y=0`.
  - No browser console errors.

## Notes for Next Session

`getSlotAvailability` is the single source of truth for free/booked slots. Keep `dateLabel` (`Hôm nay`, `Ngày mai`, `DD/MM/YYYY`) and `date` (`YYYY-MM-DD`) in sync. Tab navigation must always call `markTabNavigation()` before navigating; drill-down must call `markForwardNavigation()`, and form save/back should call `markBackNavigation()`. Full profile opens from `/dashboard-client` by calling `setSelectedClient(fullClient)` before `navigate("/client-detail")`.
