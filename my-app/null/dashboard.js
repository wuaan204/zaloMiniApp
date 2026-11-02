import { jsx, jsxs } from "react/jsx-runtime";
import { Page, Text, Avatar, Button, useNavigate } from "zmp-ui";
import React, { useEffect, useRef } from "react";
import { BackButton } from "../components/icons";
import { useAppContext, today, tomorrow } from "../context/AppContext";
import { saveScroll, restoreScroll, resetScroll } from "../utils/scroll";
const SvgUsers = () => /* @__PURE__ */ jsx("svg", { xmlns: "http://www.w3.org/2000/svg", className: "w-5 h-5", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor", strokeWidth: "2", children: /* @__PURE__ */ jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", d: "M17 20h5v-2a4 4 0 00-5-3.87M9 20H4v-2a4 4 0 015-3.87M15 11a4 4 0 10-8 0 4 4 0 008 0zm6-4a3 3 0 11-6 0 3 3 0 016 0z" }) });
const SvgCheckCircle = () => /* @__PURE__ */ jsx("svg", { xmlns: "http://www.w3.org/2000/svg", className: "w-5 h-5", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor", strokeWidth: "2", children: /* @__PURE__ */ jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", d: "M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" }) });
const SvgCalendar = () => /* @__PURE__ */ jsx("svg", { xmlns: "http://www.w3.org/2000/svg", className: "w-5 h-5", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor", strokeWidth: "2", children: /* @__PURE__ */ jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", d: "M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" }) });
const SvgChart = () => /* @__PURE__ */ jsx("svg", { xmlns: "http://www.w3.org/2000/svg", className: "w-5 h-5", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor", strokeWidth: "2", children: /* @__PURE__ */ jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", d: "M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414A1 1 0 0120 9.414V19a2 2 0 01-2 2z" }) });
const stats = [
  { label: "T\u1ED5ng h\u1ECDc vi\xEAn", value: "42", color: "text-blue-600", bg: "bg-blue-50", SvgIcon: SvgUsers },
  { label: "\u0110i t\u1EADp tu\u1EA7n n\xE0y", value: "28", color: "text-green-600", bg: "bg-green-50", SvgIcon: SvgCheckCircle },
  { label: "Bu\u1ED5i d\u1EA1y tu\u1EA7n n\xE0y", value: "67", color: "text-purple-600", bg: "bg-purple-50", SvgIcon: SvgCalendar },
  { label: "B\u1EA3n ghi InBody", value: "156", color: "text-orange-600", bg: "bg-orange-50", SvgIcon: SvgChart }
];
const inactiveClients = [
  {
    id: 1,
    name: "Nguy\u1EC5n V\u0103n An",
    lastActive: "8 ng\xE0y ch\u01B0a t\u01B0\u01A1ng t\xE1c",
    avatar: "https://i.pravatar.cc/150?u=1",
    phone: "0901 234 567",
    lastWorkout: "2026-10-05",
    daysInactive: 8,
    goal: "Gi\u1EA3m m\u1EE1",
    packageName: "G\xF3i 24 bu\u1ED5i",
    completedSessions: 8,
    totalSessions: 24,
    lastWorkoutFocus: "Th\xE2n tr\xEAn - Ng\u1EF1c & Tay sau",
    note: "\u0110ang \xE1p d\u1EE5ng th\u1EF1c \u0111\u01A1n gi\u1EA3m carb. C\u1EA7n h\u1ECFi th\u0103m c\xE2n n\u1EB7ng v\xE0 m\u1EE9c \u0111\u1ED9 ki\xEAn tr\xEC tu\u1EA7n n\xE0y.",
    suggestedAction: "Nh\u1EAFn Zalo h\u1ECFi th\u0103m c\xE2n n\u1EB7ng, nh\u1EAFc \u0111\u1EB7t l\u1ECBch bu\u1ED5i 9 v\xE0o th\u1EE9 4 tu\u1EA7n n\xE0y."
  },
  {
    id: 2,
    name: "Tr\u1EA7n Th\u1ECB B\xECnh",
    lastActive: "9 ng\xE0y ch\u01B0a t\u01B0\u01A1ng t\xE1c",
    avatar: "https://i.pravatar.cc/150?u=2",
    phone: "0912 345 678",
    lastWorkout: "2026-10-04",
    daysInactive: 9,
    goal: "T\u0103ng c\u01A1",
    packageName: "G\xF3i 36 bu\u1ED5i",
    completedSessions: 15,
    totalSessions: 36,
    lastWorkoutFocus: "Ch\xE2n & M\xF4ng - Squat PR 80kg",
    note: "\u0110ang t\u1EADp upper/lower split. Bu\u1ED5i cu\u1ED1i \u0111\u1EA1t PR squat 80kg, tinh th\u1EA7n t\u1ED1t.",
    suggestedAction: "H\u1ECFi th\u0103m t\xECnh tr\u1EA1ng ph\u1EE5c h\u1ED3i sau bu\u1ED5i leg day, g\u1EE3i \xFD \u0111\u1EB7t l\u1ECBch bu\u1ED5i 16."
  },
  {
    id: 3,
    name: "L\xEA V\u0103n C\u01B0\u1EDDng",
    lastActive: "7 ng\xE0y ch\u01B0a t\u01B0\u01A1ng t\xE1c",
    avatar: "https://i.pravatar.cc/150?u=3",
    phone: "0923 456 789",
    lastWorkout: "2026-10-06",
    daysInactive: 7,
    goal: "Duy tr\xEC form",
    packageName: "G\xF3i 24 bu\u1ED5i",
    completedSessions: 22,
    totalSessions: 24,
    lastWorkoutFocus: "Full Body Maintenance",
    note: "S\u1EAFp h\u1EBFt g\xF3i \u2014 c\xF2n 2 bu\u1ED5i. C\u1EA7n t\u01B0 v\u1EA5n gia h\u1EA1n ho\u1EB7c n\xE2ng c\u1EA5p l\xEAn g\xF3i 36 bu\u1ED5i.",
    suggestedAction: "G\u1ECDi \u0111i\u1EC7n t\u01B0 v\u1EA5n gia h\u1EA1n g\xF3i t\u1EADp. \u01AFu \u0111\xE3i 10% n\u1EBFu \u0111\u0103ng k\xFD tr\u01B0\u1EDBc 20/10."
  },
  {
    id: 4,
    name: "Ph\u1EA1m Th\u1ECB Dung",
    lastActive: "10 ng\xE0y ch\u01B0a t\u01B0\u01A1ng t\xE1c",
    avatar: "https://i.pravatar.cc/150?u=4",
    phone: "0934 567 890",
    lastWorkout: "2026-10-03",
    daysInactive: 10,
    goal: "Gi\u1EA3m m\u1EE1",
    packageName: "G\xF3i 12 bu\u1ED5i",
    completedSessions: 3,
    totalSessions: 12,
    lastWorkoutFocus: "Full Body HIIT - C\u01B0\u1EDDng \u0111\u1ED9 nh\u1EB9",
    note: "T\u1EA1m d\u1EEBng do b\u1EADn deadline d\u1EF1 \xE1n. \u0110\xE3 h\u1EE9a quay l\u1EA1i sau 2 tu\u1EA7n (d\u1EF1 ki\u1EBFn 20/10).",
    suggestedAction: "Nh\u1EAFn Zalo h\u1ECFi th\u0103m t\xECnh h\xECnh c\xF4ng vi\u1EC7c v\xE0 h\u1EB9n ng\xE0y quay l\u1EA1i t\u1EADp."
  },
  {
    id: 5,
    name: "Ho\xE0ng V\u0103n Em",
    lastActive: "8 ng\xE0y ch\u01B0a t\u01B0\u01A1ng t\xE1c",
    avatar: "https://i.pravatar.cc/150?u=5",
    phone: "0945 678 901",
    lastWorkout: "2026-10-05",
    daysInactive: 8,
    goal: "T\u0103ng s\u1EE9c b\u1EC1n",
    packageName: "G\xF3i 24 bu\u1ED5i",
    completedSessions: 12,
    totalSessions: 24,
    lastWorkoutFocus: "Long Run 8km - Pace 6:30/km",
    note: "\u0110ang chu\u1EA9n b\u1ECB cho marathon 10km v\xE0o th\xE1ng 11. C\u1EA7n duy tr\xEC l\u1ECBch t\u1EADp \u0111\u1EC1u \u0111\u1EB7n.",
    suggestedAction: "Nh\u1EAFc l\u1ECBch t\u1EADp cu\u1ED1i tu\u1EA7n: long run 10km. Theo d\xF5i HR zone sau ch\u1EA1y."
  }
];
function sessionDayLabel(dateStr) {
  if (dateStr === today) return "H\xF4m nay";
  if (dateStr === tomorrow) return "Ng\xE0y mai";
  const [, m, d] = dateStr.split("-");
  return `${d}/${m}`;
}
function StatCard({ label, value, SvgIcon, color, bg }) {
  return /* @__PURE__ */ jsxs("div", { className: "bg-white rounded-xl shadow-sm p-4 flex items-center gap-3 dark:bg-gray-800 dark:border dark:border-gray-700", children: [
    /* @__PURE__ */ jsx("div", { className: `p-3 rounded-lg ${bg} dark:bg-gray-700 flex items-center justify-center flex-shrink-0`, children: /* @__PURE__ */ jsx("span", { className: color, children: /* @__PURE__ */ jsx(SvgIcon, {}) }) }),
    /* @__PURE__ */ jsxs("div", { className: "min-w-0", children: [
      /* @__PURE__ */ jsx(Text, { className: "text-sm text-gray-500 dark:text-gray-400 leading-tight", children: label }),
      /* @__PURE__ */ jsx(Text.Title, { size: "large", className: "font-bold text-gray-900 dark:text-white", children: value })
    ] })
  ] });
}
function InactiveClientCard({ client, onClick }) {
  return /* @__PURE__ */ jsxs(
    "div",
    {
      className: "bg-slate-50 hover:bg-slate-100 rounded-xl border border-slate-300 p-3.5 flex items-center justify-between cursor-pointer",
      onClick: () => onClick(client),
      children: [
        /* @__PURE__ */ jsx(Avatar, { size: "large", src: client.avatar, alt: client.name }),
        /* @__PURE__ */ jsxs("div", { className: "flex-1 min-w-0 space-y-1", children: [
          /* @__PURE__ */ jsx(Text.Title, { size: "medium", className: "font-semibold text-gray-900 dark:text-white truncate", children: client.name }),
          /* @__PURE__ */ jsx(Text, { className: "text-sm text-gray-500 dark:text-gray-400 truncate", children: client.phone })
        ] }),
        /* @__PURE__ */ jsx("div", { className: "flex items-center gap-2", children: /* @__PURE__ */ jsx("span", { className: "inline-flex items-center justify-center text-center bg-red-50 text-red-700 border border-red-200 px-2.5 py-1 rounded-full text-xs font-semibold", children: client.lastActive }) })
      ]
    }
  );
}
function UpcomingSessionRow({ session, onClick }) {
  return /* @__PURE__ */ jsxs(
    "div",
    {
      className: "bg-slate-50 hover:bg-slate-100 rounded-xl border border-slate-300 p-3 flex items-center gap-3 cursor-pointer",
      onClick,
      children: [
        /* @__PURE__ */ jsxs("div", { className: "flex flex-col items-center justify-center flex-shrink-0 w-14", children: [
          /* @__PURE__ */ jsx("span", { className: "text-[10px] font-semibold uppercase text-slate-500 leading-tight", children: sessionDayLabel(session.date) }),
          /* @__PURE__ */ jsx("span", { className: "text-xs font-bold text-slate-800 leading-tight", children: session.time.split(" - ")[0] })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "flex-1 min-w-0", children: [
          /* @__PURE__ */ jsx(Text.Title, { size: "medium", className: "font-semibold text-gray-900 dark:text-white truncate", children: session.clientName }),
          /* @__PURE__ */ jsx(Text, { className: "text-xs text-gray-500 dark:text-gray-400 truncate", children: session.focus })
        ] })
      ]
    }
  );
}
export function DashboardClientDetail() {
  const navigate = useNavigate();
  const { selectedInactiveClient: client } = useAppContext();
  const scrollRef = useRef(null);
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = 0;
    }
  }, []);
  const handleMarkContacted = () => {
    navigate(-1);
  };
  const handleViewFullProfile = () => {
    navigate("/clients");
  };
  if (!client) {
    return /* @__PURE__ */ jsx(Page, { className: "bg-slate-100 dark:bg-slate-900 p-4", children: /* @__PURE__ */ jsx(BackButton, { onClick: () => navigate(-1) }) });
  }
  const progress = Math.round(client.completedSessions / client.totalSessions * 100);
  return /* @__PURE__ */ jsxs(Page, { ref: scrollRef, className: "bg-slate-100 dark:bg-slate-900", children: [
    /* @__PURE__ */ jsx(
      "div",
      {
        className: "bg-white dark:bg-gray-800 px-4 pb-3 border-b border-slate-200 dark:border-gray-700 sticky top-0 z-30 pr-24",
        style: { paddingTop: "max(env(safe-area-inset-top, 44px), 44px)" },
        children: /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3", children: [
          /* @__PURE__ */ jsx(BackButton, { onClick: () => navigate(-1) }),
          /* @__PURE__ */ jsx(Avatar, { size: "large", src: client.avatar, alt: client.name, className: "flex-shrink-0" }),
          /* @__PURE__ */ jsxs("div", { className: "flex-1 min-w-0", children: [
            /* @__PURE__ */ jsx(Text.Title, { size: "large", className: "font-bold text-gray-900 dark:text-white truncate", children: client.name }),
            /* @__PURE__ */ jsx(Text, { className: "text-sm text-gray-500 dark:text-gray-400", children: client.phone })
          ] }),
          /* @__PURE__ */ jsxs("span", { className: "items-center justify-center text-center bg-red-100 text-red-700 border border-red-200 px-2.5 py-1 rounded-full text-xs font-semibold flex-shrink-0", children: [
            client.daysInactive,
            " ng\xE0y"
          ] })
        ] })
      }
    ),
    /* @__PURE__ */ jsxs("div", { className: "p-4 pb-28 space-y-4", children: [
      /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-3 gap-2 w-full", children: [
        /* @__PURE__ */ jsxs("div", { className: "flex flex-col items-center justify-center text-center p-2 rounded-xl min-w-0 bg-blue-50 text-blue-700 border border-blue-200", children: [
          /* @__PURE__ */ jsx("span", { className: "text-[10px] font-semibold uppercase opacity-75 leading-tight mb-0.5", children: "M\u1EE4C TI\xCAU" }),
          /* @__PURE__ */ jsx("span", { className: "text-xs font-bold leading-snug line-clamp-2 break-words w-full", children: client.goal })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "flex flex-col items-center justify-center text-center p-2 rounded-xl min-w-0 bg-indigo-50 text-indigo-700 border border-indigo-200", children: [
          /* @__PURE__ */ jsx("span", { className: "text-[10px] font-semibold uppercase opacity-75 leading-tight mb-0.5", children: "G\xD3I T\u1EACP" }),
          /* @__PURE__ */ jsx("span", { className: "text-xs font-bold leading-snug line-clamp-2 break-words w-full", children: client.packageName })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "flex flex-col items-center justify-center text-center p-2 rounded-xl min-w-0 bg-red-50 text-red-700 border border-red-200", children: [
          /* @__PURE__ */ jsx("span", { className: "text-[10px] font-semibold uppercase opacity-75 leading-tight mb-0.5", children: "T\xCCNH TR\u1EA0NG" }),
          /* @__PURE__ */ jsx("span", { className: "text-xs font-bold leading-snug break-words w-full", children: client.lastActive })
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-4", children: [
        /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between mb-2", children: [
          /* @__PURE__ */ jsx(Text, { className: "font-semibold text-gray-900 dark:text-white text-sm", children: "Ti\u1EBFn \u0111\u1ED9 g\xF3i t\u1EADp" }),
          /* @__PURE__ */ jsxs(Text, { className: "font-bold text-gray-900 dark:text-white text-sm", children: [
            client.completedSessions,
            "/",
            client.totalSessions,
            " bu\u1ED5i"
          ] })
        ] }),
        /* @__PURE__ */ jsx("div", { className: "h-2.5 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden", children: /* @__PURE__ */ jsx(
          "div",
          {
            className: "h-full bg-blue-600 rounded-full transition-all duration-300",
            style: { width: `${progress}%` }
          }
        ) }),
        /* @__PURE__ */ jsxs(Text, { className: "text-xs text-gray-500 dark:text-gray-400 mt-1 text-right", children: [
          progress,
          "% ho\xE0n th\xE0nh"
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-4 space-y-3", children: [
        /* @__PURE__ */ jsxs("div", { className: "flex items-start justify-between gap-2", children: [
          /* @__PURE__ */ jsx(Text, { className: "text-sm font-semibold text-gray-700 dark:text-gray-300", children: "Bu\u1ED5i t\u1EADp cu\u1ED1i" }),
          /* @__PURE__ */ jsxs("div", { className: "text-right min-w-0", children: [
            /* @__PURE__ */ jsx(Text, { className: "text-sm font-bold text-gray-900 dark:text-white", children: client.lastWorkout }),
            /* @__PURE__ */ jsx(Text, { className: "text-xs text-gray-500 dark:text-gray-400 truncate", children: client.lastWorkoutFocus })
          ] })
        ] }),
        /* @__PURE__ */ jsx("div", { className: "border-t border-slate-100 dark:border-slate-700" }),
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx(Text, { className: "text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase mb-1.5", children: "Ghi ch\xFA h\u1ECDc vi\xEAn" }),
          /* @__PURE__ */ jsx("div", { className: "bg-blue-50 border border-blue-100 rounded-xl p-3", children: /* @__PURE__ */ jsx(Text, { className: "text-xs text-blue-900 dark:text-blue-200 leading-relaxed", children: client.note }) })
        ] }),
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx(Text, { className: "text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase mb-1.5", children: "G\u1EE3i \xFD h\xE0nh \u0111\u1ED9ng" }),
          /* @__PURE__ */ jsx("div", { className: "bg-amber-50 border border-amber-200 rounded-xl p-3", children: /* @__PURE__ */ jsx(Text, { className: "text-xs text-amber-900 dark:text-amber-200 leading-relaxed", children: client.suggestedAction }) })
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "flex flex-col gap-2 pt-1", children: [
        /* @__PURE__ */ jsx(Button, { variant: "primary", className: "inline-flex items-center justify-center text-center w-full", onClick: handleMarkContacted, children: "\u0110\xE3 li\xEAn h\u1EC7 qua Zalo" }),
        /* @__PURE__ */ jsx(Button, { variant: "secondary", className: "inline-flex items-center justify-center text-center w-full", onClick: handleViewFullProfile, children: "Xem h\u1ED3 s\u01A1 \u0111\u1EA7y \u0111\u1EE7" })
      ] })
    ] })
  ] });
}
function DashboardPage() {
  const navigate = useNavigate();
  const { setSelectedInactiveClient, sessions } = useAppContext();
  const scrollRef = useRef(null);
  const inactiveSectionRef = useRef(null);
  useEffect(() => {
    return restoreScroll("scroll_dashboard", scrollRef);
  }, []);
  const goTo = (path) => {
    saveScroll("scroll_dashboard", scrollRef);
    if (path === "/clients") resetScroll("scroll_clients");
    if (path === "/workouts") resetScroll("scroll_workouts");
    if (path === "/progress") resetScroll("scroll_progress");
    navigate(path);
  };
  const handleOpenDetail = (client) => {
    saveScroll("scroll_dashboard", scrollRef);
    setSelectedInactiveClient(client);
    navigate("/dashboard-client");
  };
  const handleScrollToInactive = () => {
    if (inactiveSectionRef.current) {
      inactiveSectionRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };
  const upcomingSessions = [...sessions].filter((s) => s.status === "S\u1EAFp t\u1EDBi" || s.status === "C\u1EA7n nh\u1EAFc l\u1ECBch").sort((a, b) => a.date.localeCompare(b.date) || a.time.localeCompare(b.time)).slice(0, 3);
  return /* @__PURE__ */ jsx(Page, { ref: scrollRef, className: "bg-gray-50 dark:bg-gray-900 min-h-screen", children: /* @__PURE__ */ jsxs("div", { children: [
    /* @__PURE__ */ jsx(
      "div",
      {
        className: "bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-4 pb-3 sticky top-0 z-30 pr-24",
        style: { paddingTop: "max(env(safe-area-inset-top, 44px), 44px)" },
        children: /* @__PURE__ */ jsx("div", { className: "flex items-center", children: /* @__PURE__ */ jsxs("div", { className: "flex-1 min-w-0", children: [
          /* @__PURE__ */ jsx(Text.Title, { size: "xLarge", className: "font-bold text-gray-900 dark:text-white", children: "T\u1ED5ng quan" }),
          /* @__PURE__ */ jsx(Text, { className: "text-sm text-gray-500 dark:text-gray-400", children: "Xin ch\xE0o! D\u01B0\u1EDBi \u0111\xE2y l\xE0 t\xECnh h\xECnh h\u1ECDc vi\xEAn h\xF4m nay." })
        ] }) })
      }
    ),
    /* @__PURE__ */ jsxs("div", { className: "p-4 space-y-6 pb-28", children: [
      /* @__PURE__ */ jsx("div", { className: "grid grid-cols-2 gap-3", children: stats.map((stat, index) => /* @__PURE__ */ jsx(StatCard, { ...stat }, index)) }),
      /* @__PURE__ */ jsxs("div", { className: "bg-white rounded-xl shadow-sm p-4 space-y-3 dark:bg-gray-800 dark:border dark:border-gray-700", children: [
        /* @__PURE__ */ jsx(Text.Title, { size: "medium", className: "font-bold text-gray-900 dark:text-white", children: "Danh m\u1EE5c qu\u1EA3n l\xFD" }),
        /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-2 gap-3", children: [
          /* @__PURE__ */ jsx(
            Button,
            {
              className: "bg-blue-100 hover:bg-blue-100 focus:bg-blue-100 active:bg-blue-200 text-blue-800 focus:text-blue-800 active:text-blue-900 border border-blue-200 font-bold flex flex-col items-center justify-center text-center py-3.5 px-3 rounded-xl shadow-sm text-sm active:scale-[0.98] transition-all duration-150 select-none outline-none",
              style: { WebkitTapHighlightColor: "transparent" },
              onClick: () => goTo("/clients"),
              children: "Qu\u1EA3n l\xFD h\u1ECDc vi\xEAn"
            }
          ),
          /* @__PURE__ */ jsx(
            Button,
            {
              className: "bg-indigo-100 hover:bg-indigo-100 focus:bg-indigo-100 active:bg-indigo-200 text-indigo-800 focus:text-indigo-800 active:text-indigo-900 border border-indigo-200 font-bold flex flex-col items-center justify-center text-center py-3.5 px-3 rounded-xl shadow-sm text-sm active:scale-[0.98] transition-all duration-150 select-none outline-none",
              style: { WebkitTapHighlightColor: "transparent" },
              onClick: () => goTo("/workouts"),
              children: "L\u1ECBch & Bu\u1ED5i t\u1EADp"
            }
          ),
          /* @__PURE__ */ jsx(
            Button,
            {
              className: "bg-emerald-100 hover:bg-emerald-100 focus:bg-emerald-100 active:bg-emerald-200 text-emerald-800 focus:text-emerald-800 active:text-emerald-900 border border-emerald-200 font-bold flex flex-col items-center justify-center text-center py-3.5 px-3 rounded-xl shadow-sm text-sm active:scale-[0.98] transition-all duration-150 select-none outline-none",
              style: { WebkitTapHighlightColor: "transparent" },
              onClick: () => goTo("/progress"),
              children: "Ch\u1EC9 s\u1ED1 InBody"
            }
          ),
          /* @__PURE__ */ jsx(
            Button,
            {
              className: "bg-rose-100 hover:bg-rose-100 focus:bg-rose-100 active:bg-rose-200 text-rose-800 focus:text-rose-800 active:text-rose-900 border border-rose-200 font-bold flex flex-col items-center justify-center text-center py-3.5 px-3 rounded-xl shadow-sm text-sm active:scale-[0.98] transition-all duration-150 select-none outline-none",
              style: { WebkitTapHighlightColor: "transparent" },
              onClick: handleScrollToInactive,
              children: "H\u1ECDc vi\xEAn c\u1EA7n theo d\xF5i"
            }
          )
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { ref: inactiveSectionRef, className: "bg-white rounded-xl shadow-sm dark:bg-gray-800 dark:border dark:border-gray-700", children: [
        /* @__PURE__ */ jsxs("div", { className: "p-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between", children: [
          /* @__PURE__ */ jsx(Text.Title, { size: "large", className: "font-bold text-gray-900 dark:text-white", children: "H\u1ECDc vi\xEAn c\u1EA7n theo d\xF5i (7-10 ng\xE0y)" }),
          /* @__PURE__ */ jsx(Button, { className: "inline-flex items-center justify-center text-center", variant: "text", size: "small", onClick: () => goTo("/clients"), children: "Xem t\u1EA5t c\u1EA3" })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "p-4 space-y-3", children: [
          inactiveClients.map((client) => /* @__PURE__ */ jsx(InactiveClientCard, { client, onClick: handleOpenDetail }, client.id)),
          inactiveClients.length === 0 && /* @__PURE__ */ jsx("div", { className: "text-center py-8 text-gray-500 dark:text-gray-400", children: /* @__PURE__ */ jsx(Text, { children: "Kh\xF4ng c\xF3 h\u1ECDc vi\xEAn c\u1EA7n h\u1ECFi th\u0103m. Tuy\u1EC7t v\u1EDDi!" }) })
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "bg-white rounded-xl shadow-sm dark:bg-gray-800 dark:border dark:border-gray-700", children: [
        /* @__PURE__ */ jsxs("div", { className: "p-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between", children: [
          /* @__PURE__ */ jsx(Text.Title, { size: "large", className: "font-bold text-gray-900 dark:text-white", children: "Bu\u1ED5i t\u1EADp s\u1EAFp t\u1EDBi" }),
          /* @__PURE__ */ jsx(Button, { className: "inline-flex items-center justify-center text-center", variant: "text", size: "small", onClick: () => goTo("/workouts"), children: "Xem l\u1ECBch" })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "p-4 space-y-3", children: [
          upcomingSessions.map((session) => /* @__PURE__ */ jsx(UpcomingSessionRow, { session, onClick: () => goTo("/workouts") }, session.id)),
          upcomingSessions.length === 0 && /* @__PURE__ */ jsx("div", { className: "text-center py-8 text-gray-500 dark:text-gray-400", children: /* @__PURE__ */ jsx(Text, { children: "Ch\u01B0a c\xF3 bu\u1ED5i t\u1EADp n\xE0o s\u1EAFp t\u1EDBi." }) })
        ] })
      ] })
    ] })
  ] }) });
}
export default DashboardPage;
