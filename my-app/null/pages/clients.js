import { jsx, jsxs } from "react/jsx-runtime";
import { Page, Text, Button, Avatar, Input, Select, useNavigate } from "zmp-ui";
import React, { useState, useEffect, useRef } from "react";
import { BackButton, SearchIcon } from "../components/icons";
import { useAppContext } from "../context/AppContext";
import { saveScroll, restoreScroll } from "../utils/scroll";
function getDaysSince(dateStr) {
  const today = /* @__PURE__ */ new Date("2026-10-14");
  const lastDate = new Date(dateStr);
  return Math.ceil((today - lastDate) / (1e3 * 60 * 60 * 24));
}
function getStatusBadge(status) {
  switch (status) {
    case "\u0110ang t\u1EADp":
      return { variant: "success", text: "\u0110ang t\u1EADp" };
    case "T\u1EA1m d\u1EEBng":
      return { variant: "warning", text: "T\u1EA1m d\u1EEBng" };
    case "S\u1EAFp h\u1EBFt g\xF3i":
      return { variant: "danger", text: "S\u1EAFp h\u1EBFt g\xF3i" };
    default:
      return { variant: "default", text: status };
  }
}
function formatDate(dateStr) {
  return new Date(dateStr).toLocaleDateString("vi-VN");
}
function pillClasses(type, daysSince) {
  if (type === "goal") return "bg-blue-50 text-blue-700 border border-blue-200 dark:bg-blue-900/20 dark:text-blue-300 dark:border-blue-800";
  if (type === "package") return "bg-indigo-50 text-indigo-700 border border-indigo-200 dark:bg-indigo-900/20 dark:text-indigo-300 dark:border-indigo-800";
  if (daysSince >= 7) return "bg-red-50 text-red-700 border border-red-200 dark:bg-red-900/20 dark:text-red-300 dark:border-red-800";
  return "bg-emerald-50 text-emerald-700 border border-emerald-200 dark:bg-emerald-900/20 dark:text-emerald-300 dark:border-emerald-800";
}
function ClientCard({ client, onClick }) {
  const daysSince = getDaysSince(client.lastInteractionDate);
  const progress = Math.round(client.completedSessions / client.totalSessions * 100);
  const statusInfo = getStatusBadge(client.status);
  const isInactive = daysSince >= 7;
  return /* @__PURE__ */ jsx(
    "div",
    {
      className: "bg-white rounded-xl border border-slate-300 shadow-sm p-4 cursor-pointer hover:bg-slate-50 dark:bg-slate-800 dark:border-slate-700 dark:hover:bg-slate-700 transition-colors",
      onClick: () => onClick(client),
      children: /* @__PURE__ */ jsxs("div", { className: "flex items-start gap-3", children: [
        /* @__PURE__ */ jsx(Avatar, { size: "large", src: client.avatar, alt: client.name }),
        /* @__PURE__ */ jsxs("div", { className: "flex-1 min-w-0", children: [
          /* @__PURE__ */ jsxs("div", { className: "flex items-start justify-between gap-2 mb-2", children: [
            /* @__PURE__ */ jsxs("div", { className: "flex-1 min-w-0", children: [
              /* @__PURE__ */ jsx(Text.Title, { size: "medium", className: "font-semibold text-gray-900 dark:text-white truncate", children: client.name }),
              /* @__PURE__ */ jsx(Text, { className: "text-sm text-gray-500 dark:text-gray-400", children: client.phone })
            ] }),
            /* @__PURE__ */ jsx("span", { className: `justify-center text-center inline-flex items-center px-2.5 py-0.5 text-xs font-medium rounded-full ${statusInfo.variant === "success" ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400" : statusInfo.variant === "warning" ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400" : statusInfo.variant === "danger" ? "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400" : "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300"}`, children: statusInfo.text })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-3 gap-2 mb-2", children: [
            /* @__PURE__ */ jsx("span", { className: `flex items-center justify-center text-center px-2 py-1.5 rounded-full text-xs font-semibold w-full min-w-0 ${pillClasses("goal")}`, children: client.goal }),
            /* @__PURE__ */ jsx("span", { className: `flex items-center justify-center text-center px-2 py-1.5 rounded-full text-xs font-semibold w-full min-w-0 ${pillClasses("package")}`, children: client.packageName }),
            /* @__PURE__ */ jsx("span", { className: `flex items-center justify-center text-center px-2 py-1.5 rounded-full text-xs font-semibold w-full min-w-0 leading-tight ${pillClasses("contact", daysSince)}`, children: isInactive ? `C\u1EA7n theo d\xF5i` : `${daysSince}ng tr\u01B0\u1EDBc` })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "mb-2", children: [
            /* @__PURE__ */ jsxs("div", { className: "flex justify-between text-xs mb-1", children: [
              /* @__PURE__ */ jsx(Text, { className: "text-gray-500 dark:text-gray-400", children: "Ti\u1EBFn \u0111\u1ED9" }),
              /* @__PURE__ */ jsxs(Text, { className: "font-medium text-gray-900 dark:text-white", children: [
                client.completedSessions,
                "/",
                client.totalSessions,
                " bu\u1ED5i"
              ] })
            ] }),
            /* @__PURE__ */ jsx("div", { className: "h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden", children: /* @__PURE__ */ jsx("div", { className: "h-full bg-blue-600 rounded-full transition-all duration-300", style: { width: `${progress}%` } }) })
          ] })
        ] })
      ] })
    }
  );
}
export function ClientAddView() {
  const navigate = useNavigate();
  const { addClient } = useAppContext();
  const scrollRef = useRef(null);
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = 0;
    }
  }, []);
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    goal: "Gi\u1EA3m m\u1EE1",
    packageName: "G\xF3i 24 bu\u1ED5i",
    totalSessions: 24,
    notes: ""
  });
  const goals = ["Gi\u1EA3m m\u1EE1", "T\u0103ng c\u01A1", "Duy tr\xEC form", "T\u0103ng s\u1EE9c b\u1EC1n", "Ph\u1EE5c h\u1ED3i ch\u1EE9c n\u0103ng"];
  const packages = ["G\xF3i 12 bu\u1ED5i", "G\xF3i 24 bu\u1ED5i", "G\xF3i 36 bu\u1ED5i", "G\xF3i 48 bu\u1ED5i"];
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.phone.trim()) return;
    addClient({ ...formData });
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
          /* @__PURE__ */ jsxs("div", { className: "flex-1 min-w-0", children: [
            /* @__PURE__ */ jsx(Text.Title, { size: "large", className: "font-bold text-gray-900 dark:text-white truncate", children: "Th\xEAm h\u1ECDc vi\xEAn m\u1EDBi" }),
            /* @__PURE__ */ jsx(Text, { className: "text-sm text-gray-500 dark:text-gray-400", children: "\u0110i\u1EC1n th\xF4ng tin c\u01A1 b\u1EA3n c\u1EE7a h\u1ECDc vi\xEAn" })
          ] })
        ]
      }
    ),
    /* @__PURE__ */ jsxs("form", { onSubmit: handleSubmit, className: "bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-4 space-y-4", children: [
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsxs(Text, { className: "text-sm text-gray-500 dark:text-gray-400 mb-1 block", children: [
          "H\u1ECD t\xEAn ",
          /* @__PURE__ */ jsx("span", { className: "text-red-500", children: "*" })
        ] }),
        /* @__PURE__ */ jsx(Input, { value: formData.name, onChange: (e) => setFormData({ ...formData, name: e.target.value }), placeholder: "Nguy\u1EC5n V\u0103n A", className: "w-full" })
      ] }),
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsxs(Text, { className: "text-sm text-gray-500 dark:text-gray-400 mb-1 block", children: [
          "S\u1ED1 \u0111i\u1EC7n tho\u1EA1i ",
          /* @__PURE__ */ jsx("span", { className: "text-red-500", children: "*" })
        ] }),
        /* @__PURE__ */ jsx(Input, { type: "tel", value: formData.phone, onChange: (e) => setFormData({ ...formData, phone: e.target.value }), placeholder: "0901 234 567", className: "w-full" })
      ] }),
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx(Text, { className: "text-sm text-gray-500 dark:text-gray-400 mb-1 block", children: "M\u1EE5c ti\xEAu t\u1EADp" }),
        /* @__PURE__ */ jsx(Select, { value: formData.goal, onChange: (e) => setFormData({ ...formData, goal: e.target.value }), className: "w-full", children: goals.map((g) => /* @__PURE__ */ jsx("option", { value: g, children: g }, g)) })
      ] }),
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx(Text, { className: "text-sm text-gray-500 dark:text-gray-400 mb-1 block", children: "G\xF3i t\u1EADp" }),
        /* @__PURE__ */ jsx(Select, { value: formData.packageName, onChange: (e) => setFormData({ ...formData, packageName: e.target.value }), className: "w-full", children: packages.map((p) => /* @__PURE__ */ jsx("option", { value: p, children: p }, p)) })
      ] }),
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx(Text, { className: "text-sm text-gray-500 dark:text-gray-400 mb-1 block", children: "T\u1ED5ng s\u1ED1 bu\u1ED5i" }),
        /* @__PURE__ */ jsx(Input, { type: "number", value: formData.totalSessions, onChange: (e) => setFormData({ ...formData, totalSessions: parseInt(e.target.value) || 0 }), min: "1", className: "w-full" })
      ] }),
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx(Text, { className: "text-sm text-gray-500 dark:text-gray-400 mb-1 block", children: "Ghi ch\xFA" }),
        /* @__PURE__ */ jsx("textarea", { value: formData.notes, onChange: (e) => setFormData({ ...formData, notes: e.target.value }), rows: 3, className: "w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 bg-white dark:bg-gray-800 text-gray-900 dark:text-white", placeholder: "Ghi ch\xFA th\xEAm v\u1EC1 h\u1ECDc vi\xEAn..." })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "flex justify-end gap-2 pt-2", children: [
        /* @__PURE__ */ jsx(Button, { className: "inline-flex items-center justify-center text-center", variant: "outline", type: "button", onClick: () => navigate(-1), children: "H\u1EE7y" }),
        /* @__PURE__ */ jsx(Button, { className: "inline-flex items-center justify-center text-center", variant: "primary", type: "submit", children: "Th\xEAm h\u1ECDc vi\xEAn" })
      ] })
    ] })
  ] });
}
export function ClientDetailView() {
  const navigate = useNavigate();
  const { selectedClient: client, updateClient, addNote } = useAppContext();
  const scrollRef = useRef(null);
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = 0;
    }
  }, []);
  const [newInteraction, setNewInteraction] = useState({ content: "", nextAction: "" });
  const [showAddInteraction, setShowAddInteraction] = useState(false);
  const handleAddInteraction = (e) => {
    e.preventDefault();
    if (!newInteraction.content.trim()) return;
    const today = "2026-10-14";
    const newLog = { date: today, content: newInteraction.content, nextAction: newInteraction.nextAction || "Ch\u01B0a c\xF3 k\u1EBF ho\u1EA1ch ti\u1EBFp theo" };
    addNote(client.id, newLog);
    setNewInteraction({ content: "", nextAction: "" });
    setShowAddInteraction(false);
  };
  const handleAddSession = () => {
    const next = Math.min(client.completedSessions + 1, client.totalSessions);
    updateClient(client.id, { completedSessions: next });
  };
  if (!client) {
    return /* @__PURE__ */ jsx(Page, { className: "bg-slate-100 dark:bg-slate-900 p-4", children: /* @__PURE__ */ jsx(BackButton, { onClick: () => navigate(-1) }) });
  }
  const daysSince = getDaysSince(client.lastInteractionDate);
  const progress = Math.round(client.completedSessions / client.totalSessions * 100);
  const statusInfo = getStatusBadge(client.status);
  return /* @__PURE__ */ jsxs(Page, { ref: scrollRef, className: "p-4 pb-28 space-y-4 bg-slate-100 dark:bg-slate-900", children: [
    /* @__PURE__ */ jsxs(
      "div",
      {
        className: "flex items-center gap-3 pb-3 border-b border-gray-200 dark:border-gray-700 sticky top-0 bg-slate-100 dark:bg-slate-900 z-30 px-0 pr-24",
        style: { paddingTop: "max(env(safe-area-inset-top, 44px), 44px)" },
        children: [
          /* @__PURE__ */ jsx(BackButton, { onClick: () => navigate(-1) }),
          /* @__PURE__ */ jsx(Avatar, { size: "xlarge", src: client.avatar, alt: client.name }),
          /* @__PURE__ */ jsxs("div", { className: "flex-1 min-w-0", children: [
            /* @__PURE__ */ jsx(Text.Title, { size: "large", className: "font-bold text-gray-900 dark:text-white truncate", children: client.name }),
            /* @__PURE__ */ jsx(Text, { className: "text-gray-500 dark:text-gray-400", children: client.phone })
          ] }),
          /* @__PURE__ */ jsx("span", { className: `justify-center text-center inline-flex items-center px-3 py-1 text-sm font-medium rounded-full ${statusInfo.variant === "success" ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400" : statusInfo.variant === "warning" ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400" : statusInfo.variant === "danger" ? "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400" : "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300"}`, children: statusInfo.text })
        ]
      }
    ),
    /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-3 gap-2 w-full mt-3", children: [
      /* @__PURE__ */ jsxs("div", { className: `flex flex-col items-center justify-center text-center p-2 rounded-xl min-w-0 ${pillClasses("goal")} border`, children: [
        /* @__PURE__ */ jsx("span", { className: "text-[10px] font-semibold uppercase opacity-75 leading-tight mb-0.5", children: "M\u1EE5c ti\xEAu" }),
        /* @__PURE__ */ jsx("span", { className: "text-xs font-bold leading-snug line-clamp-2 break-words w-full", children: client.goal })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: `flex flex-col items-center justify-center text-center p-2 rounded-xl min-w-0 ${pillClasses("package")} border`, children: [
        /* @__PURE__ */ jsx("span", { className: "text-[10px] font-semibold uppercase opacity-75 leading-tight mb-0.5", children: "G\xF3i t\u1EADp" }),
        /* @__PURE__ */ jsx("span", { className: "text-xs font-bold leading-snug line-clamp-2 break-words w-full", children: client.packageName })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: `flex flex-col items-center justify-center text-center p-2 rounded-xl min-w-0 ${pillClasses("contact", daysSince)} border`, children: [
        /* @__PURE__ */ jsx("span", { className: "text-[10px] font-semibold uppercase opacity-75 leading-tight mb-0.5", children: "Li\xEAn h\u1EC7" }),
        /* @__PURE__ */ jsxs("span", { className: "text-xs font-bold leading-snug line-clamp-2 break-words w-full", children: [
          daysSince,
          " ng\xE0y tr\u01B0\u1EDBc"
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-4", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between mb-2", children: [
        /* @__PURE__ */ jsx(Text, { className: "font-medium text-gray-900 dark:text-white", children: "Ti\u1EBFn \u0111\u1ED9 bu\u1ED5i t\u1EADp" }),
        /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
          /* @__PURE__ */ jsxs(Text, { className: "font-semibold text-gray-900 dark:text-white", children: [
            client.completedSessions,
            "/",
            client.totalSessions
          ] }),
          /* @__PURE__ */ jsx(Button, { size: "small", variant: "primary", className: "text-center w-8 h-8 p-0 flex items-center justify-center rounded-full", onClick: handleAddSession, disabled: client.completedSessions >= client.totalSessions, children: /* @__PURE__ */ jsx("span", { className: "text-white text-xl font-bold leading-none", children: "+" }) })
        ] })
      ] }),
      /* @__PURE__ */ jsx("div", { className: "h-3 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden", children: /* @__PURE__ */ jsx("div", { className: "h-full bg-blue-600 rounded-full transition-all duration-300", style: { width: `${progress}%` } }) }),
      /* @__PURE__ */ jsxs(Text, { className: "text-xs text-gray-500 dark:text-gray-400 mt-1 text-right", children: [
        progress,
        "% ho\xE0n th\xE0nh"
      ] })
    ] }),
    client.notes && /* @__PURE__ */ jsxs("div", { className: "bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-4", children: [
      /* @__PURE__ */ jsx("div", { className: "flex items-center gap-1 mb-1", children: /* @__PURE__ */ jsx(Text, { className: "text-sm font-medium text-blue-800 dark:text-blue-300", children: "Ghi ch\xFA chung" }) }),
      /* @__PURE__ */ jsx(Text, { className: "text-sm text-blue-700 dark:text-blue-400", children: client.notes })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between", children: [
      /* @__PURE__ */ jsx(Text.Title, { size: "medium", className: "font-bold text-gray-900 dark:text-white", children: "Nh\u1EADt k\xFD t\u01B0\u01A1ng t\xE1c" }),
      /* @__PURE__ */ jsx(Button, { size: "small", variant: "primary", className: "text-center w-8 h-8 p-0 flex items-center justify-center rounded-full", onClick: () => setShowAddInteraction(!showAddInteraction), children: /* @__PURE__ */ jsx("span", { className: "text-white text-xl font-bold leading-none", children: showAddInteraction ? "\xD7" : "+" }) })
    ] }),
    showAddInteraction && /* @__PURE__ */ jsxs("form", { onSubmit: handleAddInteraction, className: "bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-4 space-y-3", children: [
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsxs(Text, { className: "text-sm text-gray-500 dark:text-gray-400 mb-1 block", children: [
          "N\u1ED9i dung trao \u0111\u1ED5i ",
          /* @__PURE__ */ jsx("span", { className: "text-red-500", children: "*" })
        ] }),
        /* @__PURE__ */ jsx("textarea", { value: newInteraction.content, onChange: (e) => setNewInteraction({ ...newInteraction, content: e.target.value }), rows: 3, className: "w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white", placeholder: "V\xED d\u1EE5: \u0110\xE3 trao \u0111\u1ED5i v\u1EC1 menu \u0103n, kh\xE1ch h\xE0ng ph\u1EA3n h\u1ED3i kh\u1ECFe...", required: true })
      ] }),
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx(Text, { className: "text-sm text-gray-500 dark:text-gray-400 mb-1 block", children: "Vi\u1EC7c c\u1EA7n l\xE0m ti\u1EBFp theo" }),
        /* @__PURE__ */ jsx("textarea", { value: newInteraction.nextAction, onChange: (e) => setNewInteraction({ ...newInteraction, nextAction: e.target.value }), rows: 2, className: "w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white", placeholder: "V\xED d\u1EE5: G\u1EEDi file menu qua Zalo, \u0111\u1EB7t l\u1ECBch bu\u1ED5i t\u1EDBi..." })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "flex justify-end gap-2", children: [
        /* @__PURE__ */ jsx(Button, { className: "inline-flex items-center justify-center text-center", variant: "outline", type: "button", onClick: () => setShowAddInteraction(false), children: "H\u1EE7y" }),
        /* @__PURE__ */ jsx(Button, { className: "inline-flex items-center justify-center text-center", variant: "primary", type: "submit", children: "L\u01B0u ghi ch\xFA" })
      ] })
    ] }),
    /* @__PURE__ */ jsx("div", { className: "space-y-3", children: client.interactionLogs.length === 0 ? /* @__PURE__ */ jsx("div", { className: "text-center py-6 text-gray-500 dark:text-gray-400", children: /* @__PURE__ */ jsx(Text, { children: "Ch\u01B0a c\xF3 ghi ch\xFA t\u01B0\u01A1ng t\xE1c" }) }) : client.interactionLogs.map((log, i) => /* @__PURE__ */ jsxs("div", { className: "bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-4", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex items-start justify-between gap-2 mb-2", children: [
        /* @__PURE__ */ jsx(Text, { className: "text-xs text-gray-500 dark:text-gray-400 font-medium", children: formatDate(log.date) }),
        /* @__PURE__ */ jsx(Text, { className: "text-xs px-2 py-0.5 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded", children: "T\u01B0\u01A1ng t\xE1c" })
      ] }),
      /* @__PURE__ */ jsx(Text, { className: "text-sm text-gray-900 dark:text-white mb-2", children: log.content }),
      log.nextAction && /* @__PURE__ */ jsxs("div", { className: "bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-2", children: [
        /* @__PURE__ */ jsx("div", { className: "flex items-center gap-1 text-xs text-yellow-800 dark:text-yellow-300 mb-1", children: /* @__PURE__ */ jsx(Text, { className: "font-medium", children: "Vi\u1EC7c c\u1EA7n l\xE0m:" }) }),
        /* @__PURE__ */ jsx(Text, { className: "text-sm text-yellow-700 dark:text-yellow-400", children: log.nextAction })
      ] })
    ] }, i)) })
  ] });
}
export default function ClientsPage() {
  const navigate = useNavigate();
  const { clients, setSelectedClient } = useAppContext();
  const scrollRef = useRef(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState("all");
  useEffect(() => {
    return restoreScroll("scroll_clients", scrollRef);
  }, []);
  let filteredClients = clients;
  if (searchQuery.trim()) {
    const q = searchQuery.toLowerCase().trim();
    const qPhone = q.replace(/\s/g, "");
    filteredClients = filteredClients.filter(
      (c) => c.name.toLowerCase().includes(q) || c.phone.replace(/\s/g, "").includes(qPhone)
    );
  }
  if (activeFilter === "active") {
    filteredClients = filteredClients.filter((c) => c.status === "\u0110ang t\u1EADp");
  } else if (activeFilter === "inactive") {
    filteredClients = filteredClients.filter((c) => getDaysSince(c.lastInteractionDate) >= 7);
  } else if (activeFilter === "expiring") {
    filteredClients = filteredClients.filter((c) => c.status === "S\u1EAFp h\u1EBFt g\xF3i");
  }
  const filters = [
    { key: "all", label: "T\u1EA5t c\u1EA3", count: clients.length },
    { key: "active", label: "\u0110ang t\u1EADp", count: clients.filter((c) => c.status === "\u0110ang t\u1EADp").length },
    { key: "inactive", label: "C\u1EA7n theo d\xF5i", count: clients.filter((c) => getDaysSince(c.lastInteractionDate) >= 7).length },
    { key: "expiring", label: "S\u1EAFp h\u1EBFt g\xF3i", count: clients.filter((c) => c.status === "S\u1EAFp h\u1EBFt g\xF3i").length }
  ];
  const handleOpenDetail = (client) => {
    saveScroll("scroll_clients", scrollRef);
    setSelectedClient(client);
    navigate("/client-detail");
  };
  const handleOpenAdd = () => {
    saveScroll("scroll_clients", scrollRef);
    navigate("/client-add");
  };
  return /* @__PURE__ */ jsxs(Page, { ref: scrollRef, className: "bg-slate-100 dark:bg-slate-900 min-h-screen", children: [
    /* @__PURE__ */ jsx(
      "div",
      {
        className: "bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-4 pb-3 sticky top-0 z-30 pr-24",
        style: { paddingTop: "max(env(safe-area-inset-top, 44px), 44px)" },
        children: /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
          /* @__PURE__ */ jsx(BackButton, { onClick: () => navigate(-1) }),
          /* @__PURE__ */ jsxs("div", { className: "flex-1 min-w-0", children: [
            /* @__PURE__ */ jsx(Text.Title, { size: "xLarge", className: "font-bold text-gray-900 dark:text-white", children: "H\u1ECDc vi\xEAn" }),
            /* @__PURE__ */ jsx(Text, { className: "text-sm text-gray-500 dark:text-gray-400", children: "Qu\u1EA3n l\xFD h\u1ECDc vi\xEAn" })
          ] })
        ] })
      }
    ),
    /* @__PURE__ */ jsxs("div", { className: "p-4 pb-28 space-y-3", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex gap-3", children: [
        /* @__PURE__ */ jsxs("div", { className: "relative flex-1", children: [
          /* @__PURE__ */ jsx(SearchIcon, {}),
          /* @__PURE__ */ jsx("input", { type: "search", value: searchQuery, onChange: (e) => setSearchQuery(e.target.value), placeholder: "T\xECm theo t\xEAn ho\u1EB7c S\u0110T...", className: "w-full pl-9 pr-4 h-9 text-sm px-3 py-1.5 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500" })
        ] }),
        /* @__PURE__ */ jsx(Button, { className: "inline-flex items-center justify-center text-center", variant: "primary", size: "small", onClick: handleOpenAdd, children: "+ Th\xEAm HV" })
      ] }),
      /* @__PURE__ */ jsx("div", { className: "flex gap-2 overflow-x-auto pb-1 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]", children: filters.map((f) => /* @__PURE__ */ jsxs(Button, { variant: activeFilter === f.key ? "primary" : "outline", size: "small", className: "justify-center text-center inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap flex-shrink-0", onClick: () => setActiveFilter(f.key), children: [
        f.label,
        /* @__PURE__ */ jsx("span", { className: "inline-flex items-center justify-center ml-1 min-w-[18px] px-1.5 py-0.5 text-[10px] rounded-full bg-white/30 dark:bg-white/10 text-center font-bold", children: f.count })
      ] }, f.key)) }),
      /* @__PURE__ */ jsx("div", { className: "flex flex-col space-y-4 px-4", children: filteredClients.length > 0 ? filteredClients.map((c) => /* @__PURE__ */ jsx(ClientCard, { client: c, onClick: handleOpenDetail }, c.id)) : /* @__PURE__ */ jsxs("div", { className: "bg-white rounded-xl shadow-sm p-8 text-center dark:bg-slate-800 dark:border dark:border-slate-700", children: [
        /* @__PURE__ */ jsx(Text.Title, { size: "medium", className: "font-bold text-gray-900 dark:text-white mb-1", children: "Kh\xF4ng t\xECm th\u1EA5y h\u1ECDc vi\xEAn" }),
        /* @__PURE__ */ jsx(Text, { className: "text-gray-500 dark:text-gray-400", children: searchQuery ? "Th\u1EED t\u1EEB kh\xF3a kh\xE1c ho\u1EB7c x\xF3a b\u1ED9 l\u1ECDc" : "Ch\u01B0a c\xF3 h\u1ECDc vi\xEAn n\xE0o. H\xE3y th\xEAm h\u1ECDc vi\xEAn \u0111\u1EA7u ti\xEAn!" })
      ] }) })
    ] })
  ] });
}
