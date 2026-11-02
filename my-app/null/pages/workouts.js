import { jsx, jsxs } from "react/jsx-runtime";
import { Page, Text, Button, Input, Select, useNavigate, Avatar } from "zmp-ui";
import React, { useState, useEffect, useRef } from "react";
import { BackButton, SearchIcon } from "../components/icons";
import { useAppContext, today, tomorrow } from "../context/AppContext";
import { saveScroll, restoreScroll } from "../utils/scroll";
function formatDateLabel(dateStr) {
  const date = new Date(dateStr);
  const todayDate = new Date(today);
  const tomorrowDate = new Date(tomorrow);
  if (dateStr === today) return "H\xF4m nay";
  if (dateStr === tomorrow) return "Ng\xE0y mai";
  return date.toLocaleDateString("vi-VN", { weekday: "short", day: "2-digit", month: "2-digit" });
}
function getStatusStyle(status) {
  switch (status) {
    case "\u0110\xE3 ho\xE0n th\xE0nh":
      return { bg: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400", dot: "bg-green-500" };
    case "S\u1EAFp t\u1EDBi":
      return { bg: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400", dot: "bg-blue-500" };
    case "C\u1EA7n nh\u1EAFc l\u1ECBch":
      return { bg: "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400", dot: "bg-amber-500" };
    case "\u0110\xE3 d\u1EDDi l\u1ECBch":
      return { bg: "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300", dot: "bg-gray-500" };
    default:
      return { bg: "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300", dot: "bg-gray-500" };
  }
}
function getFocusPillStyle() {
  return "bg-purple-50 text-purple-700 border border-purple-200 dark:bg-purple-900/20 dark:text-purple-300 dark:border-purple-800";
}
function getProgressPillStyle() {
  return "bg-indigo-50 text-indigo-700 border border-indigo-200 dark:bg-indigo-900/20 dark:text-indigo-300 dark:border-indigo-800";
}
function getDatePillStyle() {
  return "bg-teal-50 text-teal-700 border border-teal-200 dark:bg-teal-900/20 dark:text-teal-300 dark:border-teal-800";
}
function getDayGroup(dateStr) {
  if (dateStr === today) return "today";
  if (dateStr === tomorrow) return "tomorrow";
  return "past";
}
function SessionCard({ session, onClick, onComplete, onRemindDone }) {
  const statusStyle = getStatusStyle(session.status);
  const isUpcoming = session.status === "S\u1EAFp t\u1EDBi" || session.status === "C\u1EA7n nh\u1EAFc l\u1ECBch";
  const showActions = isUpcoming && (session.status === "S\u1EAFp t\u1EDBi" || session.status === "C\u1EA7n nh\u1EAFc l\u1ECBch");
  return /* @__PURE__ */ jsx(
    "div",
    {
      className: "bg-white rounded-xl border border-slate-300 shadow-sm p-4 cursor-pointer hover:bg-slate-50 dark:bg-slate-800 dark:border-slate-700 dark:hover:bg-slate-700 transition-colors",
      onClick: (e) => {
        if (!e.target.closest("button")) onClick(session);
      },
      children: /* @__PURE__ */ jsxs("div", { className: "flex items-start gap-3", children: [
        /* @__PURE__ */ jsx(Avatar, { size: "medium", src: `https://i.pravatar.cc/150?u=${session.id}`, alt: session.clientName }),
        /* @__PURE__ */ jsxs("div", { className: "flex-1 min-w-0", children: [
          /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between gap-2 mb-2", children: [
            /* @__PURE__ */ jsx("div", { className: "inline-flex items-center justify-center px-3 py-1 rounded-lg bg-slate-100 text-slate-700 dark:bg-slate-700 dark:text-slate-300 text-xs font-semibold flex-shrink-0", children: session.time }),
            /* @__PURE__ */ jsx("span", { className: `justify-center text-center inline-flex items-center px-2.5 py-1 text-xs font-medium rounded-full ${statusStyle.bg} flex-shrink-0`, children: session.status })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "flex flex-col items-start gap-1 mb-2", children: [
            /* @__PURE__ */ jsx(Text.Title, { size: "medium", className: "font-semibold text-gray-900 dark:text-white truncate", children: session.clientName }),
            /* @__PURE__ */ jsx(Text, { className: "text-xs text-slate-500 dark:text-slate-400", children: session.phone })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-3 gap-2 w-full mt-3", children: [
            /* @__PURE__ */ jsxs("div", { className: `flex flex-col items-center justify-center text-center p-2 rounded-xl min-w-0 ${getFocusPillStyle()}`, children: [
              /* @__PURE__ */ jsx("span", { className: "text-[10px] font-semibold uppercase opacity-75 leading-tight mb-0.5", children: "N\u1ED8I DUNG" }),
              /* @__PURE__ */ jsx("span", { className: "text-xs font-bold leading-snug line-clamp-2 break-words w-full", children: session.focus })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: `flex flex-col items-center justify-center text-center p-2 rounded-xl min-w-0 ${getProgressPillStyle()}`, children: [
              /* @__PURE__ */ jsx("span", { className: "text-[10px] font-semibold uppercase opacity-75 leading-tight mb-0.5", children: "TI\u1EBEN \u0110\u1ED8" }),
              /* @__PURE__ */ jsx("span", { className: "text-xs font-bold leading-snug line-clamp-2 break-words w-full", children: session.sessionNumber })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: `flex flex-col items-center justify-center text-center p-2 rounded-xl min-w-0 ${getDatePillStyle()}`, children: [
              /* @__PURE__ */ jsx("span", { className: "text-[10px] font-semibold uppercase opacity-75 leading-tight mb-0.5", children: "NG\xC0Y T\u1EACP" }),
              /* @__PURE__ */ jsx("span", { className: "text-xs font-bold leading-snug line-clamp-2 break-words w-full", children: formatDateLabel(session.date) })
            ] })
          ] }),
          showActions && /* @__PURE__ */ jsxs("div", { className: "flex flex-wrap justify-end gap-2 mt-3", children: [
            session.status === "S\u1EAFp t\u1EDBi" && /* @__PURE__ */ jsx(
              Button,
              {
                variant: "primary",
                size: "small",
                className: "inline-flex items-center justify-center text-center w-auto px-4 py-1.5 text-xs font-medium rounded-lg",
                onClick: (e) => {
                  e.stopPropagation();
                  onComplete(session.id);
                },
                children: "Ho\xE0n th\xE0nh"
              }
            ),
            (session.status === "C\u1EA7n nh\u1EAFc l\u1ECBch" || session.status === "S\u1EAFp t\u1EDBi") && /* @__PURE__ */ jsx(
              Button,
              {
                variant: "outline",
                size: "small",
                className: "inline-flex items-center justify-center text-center w-auto px-4 py-1.5 text-xs font-medium rounded-lg",
                onClick: (e) => {
                  e.stopPropagation();
                  onRemindDone(session.id);
                },
                children: "\u0110\xE3 nh\u1EAFc l\u1ECBch"
              }
            )
          ] }),
          !isUpcoming && session.notes && session.notes.length > 0 && /* @__PURE__ */ jsx("div", { className: "pt-2", children: /* @__PURE__ */ jsxs(Text, { className: "text-xs text-gray-500 dark:text-gray-400 line-clamp-2", children: [
            session.notes[session.notes.length - 1].time,
            " - ",
            session.notes[session.notes.length - 1].text
          ] }) })
        ] })
      ] })
    }
  );
}
export function WorkoutAddView() {
  const navigate = useNavigate();
  const { addSession } = useAppContext();
  const clients = workoutClients;
  const scrollRef = useRef(null);
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = 0;
    }
  }, []);
  const [formData, setFormData] = useState({
    clientId: "",
    date: today,
    time: "18:00 - 19:00",
    focus: "Th\xE2n tr\xEAn - Ng\u1EF1c & Tay sau",
    sessionNumber: 1,
    status: "S\u1EAFp t\u1EDBi",
    notes: ""
  });
  const focuses = [
    "Th\xE2n tr\xEAn - Ng\u1EF1c & Tay sau",
    "Th\xE2n tr\xEAn - L\u01B0ng & Vai",
    "Th\xE2n tr\xEAn - Vai & Tay tr\u01B0\u1EDBc",
    "Ch\xE2n & M\xF4ng",
    "Ch\xE2n - Squat & Deadlift",
    "Ch\xE2n - Lunge & Step up",
    "Full Body - HIIT",
    "Cardio & Core",
    "Cardio - Interval Running",
    "Core & Mobility"
  ];
  const statuses = ["S\u1EAFp t\u1EDBi", "C\u1EA7n nh\u1EAFc l\u1ECBch", "\u0110\xE3 d\u1EDDi l\u1ECBch"];
  useEffect(() => {
    if (clients.length > 0) {
      setFormData((prev) => ({ ...prev, clientId: clients[0].id }));
    }
  }, [clients]);
  const handleSubmit = (e) => {
    e.preventDefault();
    const client = clients.find((c) => String(c.id) === String(formData.clientId));
    if (!client) return;
    const notesArray = formData.notes && formData.notes.trim() ? [{
      id: Date.now(),
      time: (/* @__PURE__ */ new Date()).toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" }),
      text: formData.notes.trim()
    }] : [];
    addSession({
      ...formData,
      clientName: client.name,
      phone: client.phone,
      notes: notesArray
    });
    navigate(-1);
  };
  return /* @__PURE__ */ jsxs(Page, { ref: scrollRef, className: "p-4 pb-28 space-y-4 bg-slate-100 dark:bg-slate-900", children: [
    /* @__PURE__ */ jsxs(
      "div",
      {
        className: "flex items-center gap-3 pb-3 border-b border-gray-200 dark:border-gray-700 sticky top-0 bg-slate-100 dark:bg-slate-900 z-30 pr-24",
        style: { paddingTop: "max(env(safe-area-inset-top, 44px), 44px)" },
        children: [
          /* @__PURE__ */ jsx(BackButton, { onClick: () => navigate(-1) }),
          /* @__PURE__ */ jsx(Text.Title, { size: "xLarge", className: "font-bold text-gray-900 dark:text-white", children: "Th\xEAm bu\u1ED5i t\u1EADp m\u1EDBi" })
        ]
      }
    ),
    /* @__PURE__ */ jsxs("form", { onSubmit: handleSubmit, className: "space-y-4", children: [
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsxs(Text, { className: "text-sm text-gray-500 dark:text-gray-400 mb-1 block", children: [
          "H\u1ECDc vi\xEAn ",
          /* @__PURE__ */ jsx("span", { className: "text-red-500", children: "*" })
        ] }),
        /* @__PURE__ */ jsx(Select, { value: formData.clientId, onChange: (e) => setFormData({ ...formData, clientId: e.target.value }), className: "w-full", children: clients.map((c) => /* @__PURE__ */ jsxs("option", { value: c.id, children: [
          c.name,
          " - ",
          c.phone
        ] }, c.id)) })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-2 gap-3", children: [
        /* @__PURE__ */ jsxs("div", { className: "min-w-0", children: [
          /* @__PURE__ */ jsxs(Text, { className: "text-sm text-gray-500 dark:text-gray-400 mb-1 block", children: [
            "Ng\xE0y t\u1EADp ",
            /* @__PURE__ */ jsx("span", { className: "text-red-500", children: "*" })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "relative w-full overflow-hidden rounded-xl border border-slate-200 bg-white", children: [
            /* @__PURE__ */ jsx(
              "input",
              {
                type: "date",
                value: formData.date,
                onChange: (e) => setFormData({ ...formData, date: e.target.value }),
                className: "block w-full max-w-full min-w-0 box-border appearance-none bg-transparent px-3 py-2.5 pr-10 text-sm text-slate-800 focus:outline-none",
                style: { WebkitAppearance: "none", minWidth: 0, width: "100%" }
              }
            ),
            /* @__PURE__ */ jsxs(
              "svg",
              {
                xmlns: "http://www.w3.org/2000/svg",
                viewBox: "0 0 24 24",
                fill: "none",
                stroke: "currentColor",
                strokeWidth: "2",
                strokeLinecap: "round",
                strokeLinejoin: "round",
                className: "w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none",
                children: [
                  /* @__PURE__ */ jsx("rect", { x: "3", y: "4", width: "18", height: "18", rx: "2", ry: "2" }),
                  /* @__PURE__ */ jsx("line", { x1: "16", y1: "2", x2: "16", y2: "6" }),
                  /* @__PURE__ */ jsx("line", { x1: "8", y1: "2", x2: "8", y2: "6" }),
                  /* @__PURE__ */ jsx("line", { x1: "3", y1: "10", x2: "21", y2: "10" })
                ]
              }
            )
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsxs(Text, { className: "text-sm text-gray-500 dark:text-gray-400 mb-1 block", children: [
            "Khung gi\u1EDD ",
            /* @__PURE__ */ jsx("span", { className: "text-red-500", children: "*" })
          ] }),
          /* @__PURE__ */ jsx(
            Input,
            {
              type: "text",
              value: formData.time,
              onChange: (e) => setFormData({ ...formData, time: e.target.value }),
              placeholder: "18:00 - 19:00",
              className: "w-full"
            }
          )
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsxs(Text, { className: "text-sm text-gray-500 dark:text-gray-400 mb-1 block", children: [
          "N\u1ED9i dung t\u1EADp ",
          /* @__PURE__ */ jsx("span", { className: "text-red-500", children: "*" })
        ] }),
        /* @__PURE__ */ jsx(Select, { value: formData.focus, onChange: (e) => setFormData({ ...formData, focus: e.target.value }), className: "w-full", children: focuses.map((f) => /* @__PURE__ */ jsx("option", { value: f, children: f }, f)) })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-2 gap-3", children: [
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsxs(Text, { className: "text-sm text-gray-500 dark:text-gray-400 mb-1 block", children: [
            "S\u1ED1 bu\u1ED5i (VD: 9/24) ",
            /* @__PURE__ */ jsx("span", { className: "text-red-500", children: "*" })
          ] }),
          /* @__PURE__ */ jsx(
            Input,
            {
              type: "number",
              value: formData.sessionNumber,
              onChange: (e) => setFormData({ ...formData, sessionNumber: parseInt(e.target.value) || 1 }),
              min: "1",
              className: "w-full"
            }
          )
        ] }),
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx(Text, { className: "text-sm text-gray-500 dark:text-gray-400 mb-1 block", children: "Tr\u1EA1ng th\xE1i" }),
          /* @__PURE__ */ jsx(Select, { value: formData.status, onChange: (e) => setFormData({ ...formData, status: e.target.value }), className: "w-full", children: statuses.map((s) => /* @__PURE__ */ jsx("option", { value: s, children: s }, s)) })
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx(Text, { className: "text-sm text-gray-500 dark:text-gray-400 mb-1 block", children: "Ghi ch\xFA" }),
        /* @__PURE__ */ jsx(
          "textarea",
          {
            value: formData.notes,
            onChange: (e) => setFormData({ ...formData, notes: e.target.value }),
            rows: 3,
            className: "w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 bg-white dark:bg-gray-800 text-gray-900 dark:text-white",
            placeholder: "Ghi ch\xFA th\xEAm v\u1EC1 bu\u1ED5i t\u1EADp..."
          }
        )
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "flex justify-end gap-2 pt-2", children: [
        /* @__PURE__ */ jsx(Button, { className: "inline-flex items-center justify-center text-center", variant: "outline", type: "button", onClick: () => navigate(-1), children: "H\u1EE7y" }),
        /* @__PURE__ */ jsx(Button, { className: "inline-flex items-center justify-center text-center", variant: "primary", type: "submit", children: "T\u1EA1o bu\u1ED5i t\u1EADp" })
      ] })
    ] })
  ] });
}
export function WorkoutDetailView() {
  const navigate = useNavigate();
  const { selectedSession: session, updateSession: onUpdateSession } = useAppContext();
  const clients = workoutClients;
  const scrollRef = useRef(null);
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = 0;
    }
  }, []);
  const [localSession, setLocalSession] = useState(session);
  const [editNotes, setEditNotes] = useState("");
  const [saved, setSaved] = useState(false);
  useEffect(() => {
    setLocalSession(session);
    setEditNotes("");
  }, [session]);
  if (!localSession) {
    return /* @__PURE__ */ jsx(Page, { className: "bg-slate-100 dark:bg-slate-900 p-4", children: /* @__PURE__ */ jsx(BackButton, { onClick: () => navigate(-1) }) });
  }
  const client = clients.find((c) => c.id === localSession.clientId) || clients.find((c) => c.name === localSession.clientName);
  const statusStyle = getStatusStyle(localSession.status);
  const handleStatusChange = (newStatus) => {
    const updated = { ...localSession, status: newStatus };
    setLocalSession(updated);
    onUpdateSession(localSession.id, updated);
  };
  const handleSaveNotes = () => {
    if (!editNotes.trim()) return;
    const newNote = {
      id: Date.now(),
      time: (/* @__PURE__ */ new Date()).toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" }),
      text: editNotes.trim()
    };
    const updatedNotes = [...localSession.notes, newNote];
    const updated = { ...localSession, notes: updatedNotes };
    setLocalSession(updated);
    onUpdateSession(localSession.id, updated);
    setEditNotes("");
    setSaved(true);
    setTimeout(() => setSaved(false), 1500);
  };
  const handleDeleteNote = (id) => {
    const updatedNotes = localSession.notes.filter((n) => n.id !== id);
    const updated = { ...localSession, notes: updatedNotes };
    setLocalSession(updated);
    onUpdateSession(localSession.id, updated);
  };
  return /* @__PURE__ */ jsxs(Page, { ref: scrollRef, className: "p-4 pb-28 space-y-4 bg-slate-100 dark:bg-slate-900", children: [
    /* @__PURE__ */ jsxs(
      "div",
      {
        className: "flex items-center gap-3 pb-3 border-b border-gray-200 dark:border-gray-700 sticky top-0 bg-slate-100 dark:bg-slate-900 z-30 pr-24",
        style: { paddingTop: "max(env(safe-area-inset-top, 44px), 44px)" },
        children: [
          /* @__PURE__ */ jsx(BackButton, { onClick: () => navigate(-1) }),
          /* @__PURE__ */ jsxs("div", { className: "flex-1 min-w-0", children: [
            /* @__PURE__ */ jsx(Text.Title, { size: "xLarge", className: "font-bold text-gray-900 dark:text-white truncate", children: "Chi ti\u1EBFt bu\u1ED5i t\u1EADp" }),
            /* @__PURE__ */ jsxs(Text, { className: "text-sm text-gray-500 dark:text-gray-400", children: [
              localSession.clientName,
              " \u2022 ",
              formatDateLabel(localSession.date)
            ] })
          ] })
        ]
      }
    ),
    /* @__PURE__ */ jsxs("div", { className: "bg-white dark:bg-slate-800 rounded-xl border border-slate-300 dark:border-slate-700 p-4 space-y-4", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between flex-wrap gap-2", children: [
        /* @__PURE__ */ jsx("div", { className: "inline-flex items-center justify-center px-3 py-1.5 text-sm font-medium rounded-lg bg-slate-100 text-slate-700 dark:bg-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-600", children: localSession.time }),
        /* @__PURE__ */ jsx("span", { className: `justify-center text-center inline-flex items-center px-3 py-1.5 text-sm font-medium rounded-full ${statusStyle.bg}`, children: localSession.status })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3 pt-2", children: [
        /* @__PURE__ */ jsx(Avatar, { size: "large", src: client?.avatar || `https://i.pravatar.cc/150?u=${localSession.clientId || localSession.id}`, alt: localSession.clientName }),
        /* @__PURE__ */ jsxs("div", { className: "flex-1 min-w-0", children: [
          /* @__PURE__ */ jsx(Text.Title, { size: "medium", className: "font-semibold text-gray-900 dark:text-white", children: localSession.clientName }),
          /* @__PURE__ */ jsx(Text, { className: "text-xs text-slate-500 dark:text-slate-400", children: localSession.phone })
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-3 gap-2 w-full pt-2", children: [
        /* @__PURE__ */ jsxs("div", { className: `flex flex-col items-center justify-center text-center p-2 rounded-xl min-w-0 ${getFocusPillStyle()}`, children: [
          /* @__PURE__ */ jsx("span", { className: "text-[10px] font-semibold uppercase opacity-75 leading-tight mb-0.5", children: "N\u1ED8I DUNG" }),
          /* @__PURE__ */ jsx("span", { className: "text-xs font-bold leading-snug line-clamp-2 break-words w-full", children: localSession.focus })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: `flex flex-col items-center justify-center text-center p-2 rounded-xl min-w-0 ${getProgressPillStyle()}`, children: [
          /* @__PURE__ */ jsx("span", { className: "text-[10px] font-semibold uppercase opacity-75 leading-tight mb-0.5", children: "TI\u1EBEN \u0110\u1ED8" }),
          /* @__PURE__ */ jsx("span", { className: "text-xs font-bold leading-snug line-clamp-2 break-words w-full", children: localSession.sessionNumber })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: `flex flex-col items-center justify-center text-center p-2 rounded-xl min-w-0 ${getDatePillStyle()}`, children: [
          /* @__PURE__ */ jsx("span", { className: "text-[10px] font-semibold uppercase opacity-75 leading-tight mb-0.5", children: "NG\xC0Y T\u1EACP" }),
          /* @__PURE__ */ jsx("span", { className: "text-xs font-bold leading-snug line-clamp-2 break-words w-full", children: formatDateLabel(localSession.date) })
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "bg-white dark:bg-slate-800 rounded-xl border border-slate-300 dark:border-slate-700 p-4 space-y-3", children: [
      /* @__PURE__ */ jsx(Text.Title, { size: "medium", className: "font-bold text-gray-900 dark:text-white", children: "Ghi ch\xFA bu\u1ED5i t\u1EADp" }),
      localSession.notes && localSession.notes.length > 0 && /* @__PURE__ */ jsx("div", { className: "space-y-2", children: localSession.notes.slice().reverse().map((note, idx) => /* @__PURE__ */ jsxs("div", { className: "bg-slate-50 dark:bg-slate-900/50 rounded-lg p-3 border border-slate-200 dark:border-slate-700 flex flex-col gap-1", children: [
        /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between", children: [
          /* @__PURE__ */ jsx("span", { className: "text-[10px] opacity-75 uppercase", children: note.time }),
          /* @__PURE__ */ jsx("button", { onClick: () => handleDeleteNote(note.id), className: "inline-flex items-center justify-center text-center text-xs text-red-500 hover:text-red-700 font-medium px-2 py-0.5 rounded hover:bg-red-50", children: "X\xF3a" })
        ] }),
        /* @__PURE__ */ jsx(Text, { className: "text-xs text-gray-700 dark:text-gray-300 whitespace-pre-line", children: note.text })
      ] }, note.id)) }),
      /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
        /* @__PURE__ */ jsx(
          "textarea",
          {
            value: editNotes,
            onChange: (e) => setEditNotes(e.target.value),
            rows: 3,
            className: "w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white",
            placeholder: "Nh\u1EADp ghi ch\xFA m\u1EDBi cho bu\u1ED5i t\u1EADp..."
          }
        ),
        /* @__PURE__ */ jsx("div", { className: "flex justify-end gap-2", children: /* @__PURE__ */ jsx(Button, { className: "inline-flex items-center justify-center text-center", variant: "primary", onClick: handleSaveNotes, children: "L\u01B0u ghi ch\xFA m\u1EDBi" }) }),
        saved && /* @__PURE__ */ jsx(Text, { className: "text-xs text-green-600 dark:text-green-400", children: "\u0110\xE3 l\u01B0u ghi ch\xFA!" })
      ] })
    ] }),
    (localSession.status === "S\u1EAFp t\u1EDBi" || localSession.status === "C\u1EA7n nh\u1EAFc l\u1ECBch") && /* @__PURE__ */ jsxs("div", { className: "bg-white dark:bg-slate-800 rounded-xl border border-slate-300 dark:border-slate-700 p-4 space-y-2", children: [
      /* @__PURE__ */ jsx(Text, { className: "font-medium text-gray-900 dark:text-white", children: "C\u1EADp nh\u1EADt tr\u1EA1ng th\xE1i" }),
      /* @__PURE__ */ jsxs("div", { className: "flex flex-wrap justify-end gap-2", children: [
        /* @__PURE__ */ jsx(
          Button,
          {
            variant: localSession.status === "\u0110\xE3 ho\xE0n th\xE0nh" ? "primary" : "outline",
            size: "small",
            className: "inline-flex items-center justify-center text-center w-auto px-4 py-1.5 text-xs font-medium rounded-lg",
            onClick: () => handleStatusChange("\u0110\xE3 ho\xE0n th\xE0nh"),
            children: "\u0110\xE3 ho\xE0n th\xE0nh"
          }
        ),
        /* @__PURE__ */ jsx(
          Button,
          {
            variant: localSession.status === "C\u1EA7n nh\u1EAFc l\u1ECBch" ? "primary" : "outline",
            size: "small",
            className: "inline-flex items-center justify-center text-center w-auto px-4 py-1.5 text-xs font-medium rounded-lg",
            onClick: () => handleStatusChange("C\u1EA7n nh\u1EAFc l\u1ECBch"),
            children: "C\u1EA7n nh\u1EAFc l\u1ECBch"
          }
        ),
        /* @__PURE__ */ jsx(
          Button,
          {
            variant: localSession.status === "\u0110\xE3 d\u1EDDi l\u1ECBch" ? "primary" : "outline",
            size: "small",
            className: "inline-flex items-center justify-center text-center w-auto px-4 py-1.5 text-xs font-medium rounded-lg",
            onClick: () => handleStatusChange("\u0110\xE3 d\u1EDDi l\u1ECBch"),
            children: "\u0110\xE3 d\u1EDDi l\u1ECBch"
          }
        ),
        /* @__PURE__ */ jsx(
          Button,
          {
            variant: localSession.status === "S\u1EAFp t\u1EDBi" ? "primary" : "outline",
            size: "small",
            className: "inline-flex items-center justify-center text-center w-auto px-4 py-1.5 text-xs font-medium rounded-lg",
            onClick: () => handleStatusChange("S\u1EAFp t\u1EDBi"),
            children: "S\u1EAFp t\u1EDBi"
          }
        )
      ] })
    ] }),
    (localSession.status === "\u0110\xE3 ho\xE0n th\xE0nh" || localSession.status === "\u0110\xE3 d\u1EDDi l\u1ECBch") && /* @__PURE__ */ jsxs("div", { className: "bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl p-4", children: [
      /* @__PURE__ */ jsx("div", { className: "flex items-center gap-2 mb-2", children: /* @__PURE__ */ jsx(Text, { className: "font-medium text-green-800 dark:text-green-300", children: localSession.status === "\u0110\xE3 ho\xE0n th\xE0nh" ? "Bu\u1ED5i t\u1EADp \u0111\xE3 ho\xE0n th\xE0nh" : "Bu\u1ED5i t\u1EADp \u0111\xE3 \u0111\u01B0\u1EE3c d\u1EDDi l\u1ECBch" }) }),
      /* @__PURE__ */ jsx(Text, { className: "text-sm text-green-700 dark:text-green-400", children: "Tr\u1EA1ng th\xE1i n\xE0y kh\xF4ng th\u1EC3 thay \u0111\u1ED5i. T\u1EA1o bu\u1ED5i t\u1EADp m\u1EDBi n\u1EBFu c\u1EA7n." })
    ] })
  ] });
}
const workoutClients = [
  { id: 1, name: "Nguy\u1EC5n V\u0103n An", phone: "0901 234 567" },
  { id: 2, name: "Tr\u1EA7n Th\u1ECB B\xECnh", phone: "0912 345 678" },
  { id: 3, name: "L\xEA V\u0103n C\u01B0\u1EDDng", phone: "0923 456 789" },
  { id: 4, name: "Ph\u1EA1m Th\u1ECB Dung", phone: "0934 567 890" },
  { id: 5, name: "Ho\xE0ng V\u0103n Em", phone: "0945 678 901" },
  { id: 6, name: "V\u0169 Th\u1ECB Ph\u01B0\u1EE3ng", phone: "0956 789 012" },
  { id: 7, name: "\u0110\u1EB7ng V\u0103n Giang", phone: "0967 890 123" },
  { id: 8, name: "B\xF9i Th\u1ECB H\u1EA1nh", phone: "0978 901 234" },
  { id: 9, name: "Ng\xF4 V\u0103n Kh\u1EA3i", phone: "0989 012 345" },
  { id: 10, name: "D\u01B0\u01A1ng Th\u1ECB Lan", phone: "0990 123 456" },
  { id: 11, name: "Phan V\u0103n Minh", phone: "0901 111 222" },
  { id: 12, name: "V\xF5 Th\u1ECB Nga", phone: "0912 222 333" }
];
export default function WorkoutsPage() {
  const navigate = useNavigate();
  const { sessions, setSelectedSession, updateSession } = useAppContext();
  const scrollRef = useRef(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState("all");
  useEffect(() => {
    return restoreScroll("scroll_workouts", scrollRef);
  }, []);
  let filteredSessions = [...sessions].sort((a, b) => {
    if (a.date !== b.date) return a.date.localeCompare(b.date);
    return a.time.localeCompare(b.time);
  });
  if (searchQuery.trim()) {
    const q = searchQuery.toLowerCase().trim();
    filteredSessions = filteredSessions.filter(
      (s) => s.clientName.toLowerCase().includes(q) || s.focus.toLowerCase().includes(q)
    );
  }
  if (activeFilter === "today") {
    filteredSessions = filteredSessions.filter((s) => s.date === today);
  } else if (activeFilter === "remind") {
    filteredSessions = filteredSessions.filter((s) => s.status === "C\u1EA7n nh\u1EAFc l\u1ECBch");
  } else if (activeFilter === "completed") {
    filteredSessions = filteredSessions.filter((s) => s.status === "\u0110\xE3 ho\xE0n th\xE0nh");
  }
  const groupedSessions = {};
  filteredSessions.forEach((s) => {
    const group = getDayGroup(s.date);
    if (!groupedSessions[group]) groupedSessions[group] = [];
    groupedSessions[group].push(s);
  });
  const filters = [
    { key: "all", label: "T\u1EA5t c\u1EA3", count: sessions.length },
    { key: "today", label: "H\xF4m nay", count: sessions.filter((s) => s.date === today).length },
    { key: "remind", label: "C\u1EA7n nh\u1EAFc l\u1ECBch", count: sessions.filter((s) => s.status === "C\u1EA7n nh\u1EAFc l\u1ECBch").length },
    { key: "completed", label: "\u0110\xE3 ho\xE0n th\xE0nh", count: sessions.filter((s) => s.status === "\u0110\xE3 ho\xE0n th\xE0nh").length }
  ];
  const handleComplete = (id) => {
    updateSession(id, { status: "\u0110\xE3 ho\xE0n th\xE0nh" });
  };
  const handleRemindDone = (id) => {
    updateSession(id, { status: "S\u1EAFp t\u1EDBi" });
  };
  const handleOpenDetail = (session) => {
    saveScroll("scroll_workouts", scrollRef);
    setSelectedSession(session);
    navigate("/workout-detail");
  };
  const handleOpenAdd = () => {
    saveScroll("scroll_workouts", scrollRef);
    navigate("/workout-add");
  };
  return /* @__PURE__ */ jsx(Page, { ref: scrollRef, className: "bg-slate-100 dark:bg-slate-900 min-h-screen", children: /* @__PURE__ */ jsxs("div", { children: [
    /* @__PURE__ */ jsx(
      "div",
      {
        className: "bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-4 pb-3 sticky top-0 z-30 pr-24",
        style: { paddingTop: "max(env(safe-area-inset-top, 44px), 44px)" },
        children: /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
          /* @__PURE__ */ jsx(BackButton, { onClick: () => navigate(-1) }),
          /* @__PURE__ */ jsxs("div", { className: "flex-1 min-w-0", children: [
            /* @__PURE__ */ jsx(Text.Title, { size: "xLarge", className: "font-bold text-gray-900 dark:text-white", children: "L\u1ECBch & Bu\u1ED5i t\u1EADp" }),
            /* @__PURE__ */ jsx(Text, { className: "text-sm text-gray-500 dark:text-gray-400", children: "Qu\u1EA3n l\xFD bu\u1ED5i t\u1EADp h\u1ECDc vi\xEAn" })
          ] })
        ] })
      }
    ),
    /* @__PURE__ */ jsxs("div", { className: "p-4 pb-28 space-y-3", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex gap-3", children: [
        /* @__PURE__ */ jsxs("div", { className: "relative flex-1", children: [
          /* @__PURE__ */ jsx(SearchIcon, {}),
          /* @__PURE__ */ jsx(
            "input",
            {
              type: "search",
              value: searchQuery,
              onChange: (e) => setSearchQuery(e.target.value),
              placeholder: "T\xECm theo t\xEAn h\u1ECDc vi\xEAn ho\u1EB7c n\u1ED9i dung t\u1EADp...",
              className: "w-full pl-9 pr-4 h-9 text-sm px-3 py-1.5 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            }
          )
        ] }),
        /* @__PURE__ */ jsx(Button, { className: "inline-flex items-center justify-center text-center", variant: "primary", size: "small", onClick: handleOpenAdd, children: "+ Th\xEAm bu\u1ED5i" })
      ] }),
      /* @__PURE__ */ jsx("div", { className: "flex gap-2 overflow-x-auto pb-1 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]", children: filters.map((f) => /* @__PURE__ */ jsxs(
        Button,
        {
          variant: activeFilter === f.key ? "primary" : "outline",
          size: "small",
          className: "justify-center text-center inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap flex-shrink-0",
          onClick: () => setActiveFilter(f.key),
          children: [
            f.label,
            /* @__PURE__ */ jsx("span", { className: "inline-flex items-center justify-center ml-1 min-w-[18px] px-1.5 py-0.5 text-[10px] rounded-full bg-white/30 dark:bg-white/10 text-center font-bold", children: f.count })
          ]
        },
        f.key
      )) }),
      /* @__PURE__ */ jsxs("div", { className: "flex flex-col space-y-6", children: [
        groupedSessions.today && groupedSessions.today.length > 0 && /* @__PURE__ */ jsxs("div", { className: "px-4", children: [
          /* @__PURE__ */ jsx("div", { className: "flex items-center gap-2 mb-3", children: /* @__PURE__ */ jsxs(Text.Title, { size: "medium", className: "font-bold text-gray-900 dark:text-white", children: [
            "H\xF4m nay (",
            groupedSessions.today.length,
            ")"
          ] }) }),
          /* @__PURE__ */ jsx("div", { className: "flex flex-col space-y-4", children: groupedSessions.today.map((s) => /* @__PURE__ */ jsx(
            SessionCard,
            {
              session: s,
              onClick: handleOpenDetail,
              onComplete: handleComplete,
              onRemindDone: handleRemindDone
            },
            s.id
          )) })
        ] }),
        groupedSessions.tomorrow && groupedSessions.tomorrow.length > 0 && /* @__PURE__ */ jsxs("div", { className: "px-4", children: [
          /* @__PURE__ */ jsx("div", { className: "flex items-center gap-2 mb-3", children: /* @__PURE__ */ jsxs(Text.Title, { size: "medium", className: "font-bold text-gray-900 dark:text-white", children: [
            "Ng\xE0y mai (",
            groupedSessions.tomorrow.length,
            ")"
          ] }) }),
          /* @__PURE__ */ jsx("div", { className: "flex flex-col space-y-4", children: groupedSessions.tomorrow.map((s) => /* @__PURE__ */ jsx(
            SessionCard,
            {
              session: s,
              onClick: handleOpenDetail,
              onComplete: handleComplete,
              onRemindDone: handleRemindDone
            },
            s.id
          )) })
        ] }),
        groupedSessions.past && groupedSessions.past.length > 0 && /* @__PURE__ */ jsxs("div", { className: "px-4", children: [
          /* @__PURE__ */ jsx("div", { className: "flex items-center gap-2 mb-3", children: /* @__PURE__ */ jsxs(Text.Title, { size: "medium", className: "font-bold text-gray-900 dark:text-white", children: [
            "Ng\xE0y tr\u01B0\u1EDBc (",
            groupedSessions.past.length,
            ")"
          ] }) }),
          /* @__PURE__ */ jsx("div", { className: "flex flex-col space-y-4", children: groupedSessions.past.map((s) => /* @__PURE__ */ jsx(
            SessionCard,
            {
              session: s,
              onClick: handleOpenDetail,
              onComplete: handleComplete,
              onRemindDone: handleRemindDone
            },
            s.id
          )) })
        ] }),
        filteredSessions.length === 0 && /* @__PURE__ */ jsxs("div", { className: "bg-white rounded-xl shadow-sm p-8 text-center dark:bg-slate-800 dark:border dark:border-slate-700", children: [
          /* @__PURE__ */ jsx(Text.Title, { size: "medium", className: "font-bold text-gray-900 dark:text-white mb-1", children: "Kh\xF4ng t\xECm th\u1EA5y bu\u1ED5i t\u1EADp" }),
          /* @__PURE__ */ jsx(Text, { className: "text-gray-500 dark:text-gray-400", children: searchQuery ? "Th\u1EED t\u1EEB kh\xF3a kh\xE1c ho\u1EB7c x\xF3a b\u1ED9 l\u1ECDc" : "Ch\u01B0a c\xF3 bu\u1ED5i t\u1EADp n\xE0o. H\xE3y th\xEAm bu\u1ED5i t\u1EADp \u0111\u1EA7u ti\xEAn!" })
        ] })
      ] })
    ] })
  ] }) });
}
