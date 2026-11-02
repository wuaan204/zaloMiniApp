import { Fragment, jsx, jsxs } from "react/jsx-runtime";
import { Page, useNavigate } from "zmp-ui";
import React, { useState, useEffect, useRef } from "react";
import { BackButton } from "../components/icons";
import { useAppContext } from "../context/AppContext";
import { saveScroll, restoreScroll } from "../utils/scroll";
const METRICS = [
  {
    key: "weight",
    label: "C\xC2N N\u1EB6NG",
    name: "C\xE2n n\u1EB7ng",
    unit: "kg",
    decimals: 1,
    boxClass: "bg-blue-50 border-blue-200 text-blue-800",
    barClass: "bg-blue-500",
    textClass: "text-blue-600",
    goodWhenLower: true
  },
  {
    key: "smm",
    label: "C\u01A0 X\u01AF\u01A0NG",
    name: "C\u01A1 x\u01B0\u01A1ng (SMM)",
    unit: "kg",
    decimals: 1,
    boxClass: "bg-emerald-50 border-emerald-200 text-emerald-800",
    barClass: "bg-emerald-500",
    textClass: "text-emerald-600",
    goodWhenLower: false
  },
  {
    key: "pbf",
    label: "T\u1EF6 L\u1EC6 M\u1EE0",
    name: "T\u1EF7 l\u1EC7 m\u1EE1 (PBF)",
    unit: "%",
    decimals: 1,
    boxClass: "bg-amber-50 border-amber-200 text-amber-800",
    barClass: "bg-amber-500",
    textClass: "text-amber-600",
    goodWhenLower: true
  }
];
function isoToVnDate(isoStr) {
  if (!isoStr) return "";
  const [y, m, d] = isoStr.split("-");
  return `${d}/${m}/${y}`;
}
function todayIso() {
  const now = /* @__PURE__ */ new Date();
  const m = String(now.getMonth() + 1).padStart(2, "0");
  const d = String(now.getDate()).padStart(2, "0");
  return `${now.getFullYear()}-${m}-${d}`;
}
function shortDate(dateStr) {
  return (dateStr || "").slice(0, 5);
}
function calcBmi(weight, height) {
  const w = parseFloat(weight);
  const h = parseFloat(height);
  if (!(w > 0) || !(h > 0)) return "";
  return (w / (h / 100) ** 2).toFixed(1);
}
function deltaOf(latestRecord, oldestRecord, key) {
  if (!latestRecord || !oldestRecord || latestRecord.id === oldestRecord.id) return null;
  if (latestRecord[key] === void 0 || oldestRecord[key] === void 0) return null;
  const raw = Number(latestRecord[key]) - Number(oldestRecord[key]);
  return Math.round(raw * 10) / 10;
}
function formatDelta(delta, unit) {
  const sign = delta > 0 ? "+" : "";
  return `${sign}${delta.toFixed(1)} ${unit}`;
}
function deltaBadgeClass(metric, delta) {
  if (delta === null || delta === 0) return "bg-white/70 text-slate-500 border border-slate-200";
  const isGood = metric.goodWhenLower ? delta < 0 : delta > 0;
  return isGood ? "bg-emerald-100 text-emerald-700 border border-emerald-200" : "bg-red-100 text-red-700 border border-red-200";
}
function barHeightPercent(value, min, max) {
  if (max === min) return 60;
  return 25 + 75 * (Number(value) - min) / (max - min);
}
const BackIcon = ({ className = "w-5 h-5 text-white" }) => /* @__PURE__ */ jsx(
  "svg",
  {
    xmlns: "http://www.w3.org/2000/svg",
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "2.5",
    strokeLinecap: "round",
    strokeLinejoin: "round",
    className,
    children: /* @__PURE__ */ jsx("polyline", { points: "15 18 9 12 15 6" })
  }
);
const CalendarIcon = ({ className = "w-3.5 h-3.5 text-slate-400" }) => /* @__PURE__ */ jsxs(
  "svg",
  {
    xmlns: "http://www.w3.org/2000/svg",
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "2",
    strokeLinecap: "round",
    strokeLinejoin: "round",
    className,
    children: [
      /* @__PURE__ */ jsx("rect", { x: "3", y: "4", width: "18", height: "18", rx: "2", ry: "2" }),
      /* @__PURE__ */ jsx("line", { x1: "16", y1: "2", x2: "16", y2: "6" }),
      /* @__PURE__ */ jsx("line", { x1: "8", y1: "2", x2: "8", y2: "6" }),
      /* @__PURE__ */ jsx("line", { x1: "3", y1: "10", x2: "21", y2: "10" })
    ]
  }
);
function PageHeader({ title, subtitle, onBack }) {
  return /* @__PURE__ */ jsx(
    "div",
    {
      className: "bg-white border-b border-gray-200 px-4 pb-3 sticky top-0 z-30 pr-24",
      style: { paddingTop: "max(env(safe-area-inset-top, 44px), 44px)" },
      children: /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
        /* @__PURE__ */ jsx(BackButton, { onClick: onBack }),
        /* @__PURE__ */ jsxs("div", { className: "flex-1 min-w-0", children: [
          /* @__PURE__ */ jsx("h1", { className: "text-lg font-bold text-gray-900 leading-tight truncate", children: title }),
          /* @__PURE__ */ jsx("p", { className: "text-xs text-gray-500 truncate", children: subtitle })
        ] })
      ] })
    }
  );
}
function MetricBox({ metric, record, delta }) {
  return /* @__PURE__ */ jsxs(
    "div",
    {
      className: `flex flex-col items-center justify-center text-center p-2.5 rounded-xl min-w-0 border ${metric.boxClass}`,
      children: [
        /* @__PURE__ */ jsx("span", { className: "text-[10px] font-semibold uppercase opacity-75 leading-tight", children: metric.label }),
        /* @__PURE__ */ jsx("span", { className: "text-lg font-bold leading-tight mt-1", children: record ? Number(record[metric.key]).toFixed(metric.decimals) : "--" }),
        /* @__PURE__ */ jsx("span", { className: "text-[10px] font-medium opacity-70 leading-tight", children: metric.unit }),
        delta !== null && delta !== void 0 ? /* @__PURE__ */ jsx("span", { className: `mt-1 px-1.5 py-0.5 rounded-md text-[10px] font-bold leading-tight ${deltaBadgeClass(metric, delta)}`, children: formatDelta(delta, metric.unit) }) : /* @__PURE__ */ jsx("span", { className: "mt-1 px-1.5 py-0.5 rounded-md text-[10px] font-medium leading-tight bg-white/70 text-slate-400 border border-slate-200", children: "L\u1EA7n \u0111\u1EA7u" })
      ]
    }
  );
}
function MiniMetric({ label, value, tone = "slate" }) {
  const toneClass = tone === "blue" ? "bg-blue-50 border-blue-100 text-blue-800" : tone === "amber" ? "bg-amber-50 border-amber-100 text-amber-800" : tone === "emerald" ? "bg-emerald-50 border-emerald-100 text-emerald-800" : "bg-slate-50 border-slate-200 text-slate-800";
  return /* @__PURE__ */ jsxs("div", { className: `flex flex-col items-center justify-center text-center border rounded-lg p-2 min-w-0 ${toneClass}`, children: [
    /* @__PURE__ */ jsx("span", { className: "text-[10px] font-semibold uppercase opacity-70 leading-tight", children: label }),
    /* @__PURE__ */ jsx("span", { className: "text-xs font-bold leading-tight mt-0.5 break-words w-full", children: value })
  ] });
}
function TrendChart({ recordsAsc }) {
  if (!recordsAsc || recordsAsc.length === 0) return null;
  return /* @__PURE__ */ jsxs("div", { className: "bg-white rounded-xl border border-slate-200 shadow-sm p-4", children: [
    /* @__PURE__ */ jsxs("div", { className: "flex items-start justify-between gap-2", children: [
      /* @__PURE__ */ jsx("h2", { className: "text-sm font-bold text-slate-900 leading-snug", children: "Bi\u1EC3u \u0111\u1ED3 bi\u1EBFn chuy\u1EC3n qua c\xE1c l\u1EA7n \u0111o" }),
      /* @__PURE__ */ jsxs("span", { className: "items-center justify-center text-center flex-shrink-0 text-[10px] font-semibold px-2 py-0.5 rounded-full bg-slate-100 text-slate-500", children: [
        recordsAsc.length,
        " l\u1EA7n \u0111o"
      ] })
    ] }),
    /* @__PURE__ */ jsx("p", { className: "text-[11px] text-slate-400 mt-0.5", children: "C\u1ED9t \u0111\u1EADm nh\u1EA5t l\xE0 l\u1EA7n \u0111o g\u1EA7n nh\u1EA5t" }),
    /* @__PURE__ */ jsx("div", { className: "mt-3 divide-y divide-slate-100", children: METRICS.map((metric) => {
      const values = recordsAsc.map((r) => Number(r[metric.key]));
      const min = Math.min(...values);
      const max = Math.max(...values);
      const delta = deltaOf(recordsAsc[recordsAsc.length - 1], recordsAsc[0], metric.key);
      return /* @__PURE__ */ jsxs("div", { className: "py-3 first:pt-0 last:pb-0", children: [
        /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between gap-2 mb-2", children: [
          /* @__PURE__ */ jsxs("span", { className: "text-xs font-semibold text-slate-700", children: [
            metric.name,
            " (",
            metric.unit,
            ")"
          ] }),
          delta !== null ? /* @__PURE__ */ jsx("span", { className: `text-[10px] font-bold px-1.5 py-0.5 rounded-md ${deltaBadgeClass(metric, delta)}`, children: formatDelta(delta, metric.unit) }) : /* @__PURE__ */ jsx("span", { className: "text-[10px] font-medium text-slate-400", children: "Ch\u01B0a \u0111\u1EE7 d\u1EEF li\u1EC7u" })
        ] }),
        /* @__PURE__ */ jsx("div", { className: "flex items-end gap-1.5 h-24", children: recordsAsc.map((record, index) => {
          const isLatest = index === recordsAsc.length - 1;
          return /* @__PURE__ */ jsxs("div", { className: "flex-1 flex flex-col items-center justify-end h-full min-w-0", children: [
            /* @__PURE__ */ jsx("span", { className: `text-[10px] font-bold leading-none mb-1 ${isLatest ? metric.textClass : "text-slate-500"}`, children: Number(record[metric.key]).toFixed(metric.decimals) }),
            /* @__PURE__ */ jsx("div", { className: "w-full flex-1 flex items-end", children: /* @__PURE__ */ jsx(
              "div",
              {
                className: `w-full rounded-t-md transition-all duration-300 ${metric.barClass} ${isLatest ? "" : "opacity-35"}`,
                style: { height: `${barHeightPercent(record[metric.key], min, max)}%` }
              }
            ) }),
            /* @__PURE__ */ jsx("span", { className: `text-[9px] leading-none mt-1 whitespace-nowrap ${isLatest ? "font-bold text-slate-700" : "text-slate-400"}`, children: shortDate(record.date) })
          ] }, record.id);
        }) })
      ] }, metric.key);
    }) })
  ] });
}
function HistoryCard({ record, isLatest, onDelete }) {
  const [showDetails, setShowDetails] = useState(false);
  return /* @__PURE__ */ jsxs("div", { className: "bg-white rounded-xl border border-slate-200 shadow-sm p-4", children: [
    /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between gap-2", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 min-w-0", children: [
        /* @__PURE__ */ jsx(CalendarIcon, { className: "w-4 h-4 text-slate-400 flex-shrink-0" }),
        /* @__PURE__ */ jsx("span", { className: "text-sm font-bold text-slate-900 truncate", children: record.date }),
        isLatest && /* @__PURE__ */ jsx("span", { className: "items-center justify-center text-center flex-shrink-0 text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-blue-100 text-blue-700", children: "M\u1EDBi nh\u1EA5t" })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 flex-shrink-0", children: [
        record.inbodyScore !== void 0 && /* @__PURE__ */ jsxs("span", { className: "inline-flex items-center justify-center text-center text-[10px] font-bold px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200", children: [
          "\u0110i\u1EC3m ",
          record.inbodyScore
        ] }),
        /* @__PURE__ */ jsx(
          "button",
          {
            type: "button",
            onClick: () => onDelete(record.id),
            className: "inline-flex items-center justify-center text-center text-xs font-semibold text-red-600 px-2.5 py-1 rounded-lg border border-red-200 bg-red-50 active:bg-red-100",
            children: "X\xF3a"
          }
        )
      ] })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-3 gap-2 mt-3", children: [
      /* @__PURE__ */ jsx(MiniMetric, { label: "C\xE2n n\u1EB7ng", value: `${Number(record.weight).toFixed(1)} kg`, tone: "blue" }),
      /* @__PURE__ */ jsx(MiniMetric, { label: "C\u01A1 x\u01B0\u01A1ng", value: `${Number(record.smm).toFixed(1)} kg`, tone: "emerald" }),
      /* @__PURE__ */ jsx(MiniMetric, { label: "T\u1EF7 l\u1EC7 m\u1EE1", value: `${Number(record.pbf).toFixed(1)} %`, tone: "amber" })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-3 gap-2 mt-2", children: [
      /* @__PURE__ */ jsx(MiniMetric, { label: "BMI", value: Number(record.bmi).toFixed(1) }),
      /* @__PURE__ */ jsx(MiniMetric, { label: "M\u1EE1 n\u1ED9i t\u1EA1ng", value: `C\u1EA5p ${record.visceralFat}` }),
      /* @__PURE__ */ jsx(MiniMetric, { label: "BMR", value: `${record.bmr} kcal` })
    ] }),
    showDetails && /* @__PURE__ */ jsxs(Fragment, { children: [
      /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-3 gap-2 mt-2", children: [
        /* @__PURE__ */ jsx(MiniMetric, { label: "Kh\u1ED1i l\u01B0\u1EE3ng m\u1EE1", value: `${Number(record.bodyFatMass).toFixed(1)} kg` }),
        /* @__PURE__ */ jsx(MiniMetric, { label: "N\u01B0\u1EDBc (TBW)", value: `${Number(record.tbw).toFixed(1)} L` }),
        /* @__PURE__ */ jsx(MiniMetric, { label: "Chi\u1EC1u cao", value: `${record.height} cm` })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-3 gap-2 mt-2", children: [
        /* @__PURE__ */ jsx(MiniMetric, { label: "V\xF2ng eo", value: `${record.waist} cm` }),
        /* @__PURE__ */ jsx(MiniMetric, { label: "V\xF2ng m\xF4ng", value: `${record.hip} cm` }),
        /* @__PURE__ */ jsx(MiniMetric, { label: "V\xF2ng ng\u1EF1c", value: `${record.chest} cm` })
      ] })
    ] }),
    /* @__PURE__ */ jsx(
      "button",
      {
        type: "button",
        onClick: () => setShowDetails((prev) => !prev),
        className: "inline-flex items-center justify-center text-center mt-2 w-full h-8 rounded-lg bg-slate-50 border border-slate-200 text-[11px] font-semibold text-slate-600 active:bg-slate-100",
        children: showDetails ? "Thu g\u1ECDn ch\u1EC9 s\u1ED1" : "Xem chi ti\u1EBFt ch\u1EC9 s\u1ED1"
      }
    ),
    record.note && /* @__PURE__ */ jsxs("div", { className: "mt-2.5 bg-blue-50 border border-blue-200 rounded-lg p-2.5", children: [
      /* @__PURE__ */ jsx("span", { className: "text-[10px] font-bold uppercase text-blue-700", children: "Nh\u1EADn x\xE9t c\u1EE7a PT" }),
      /* @__PURE__ */ jsx("p", { className: "text-xs text-blue-800 leading-relaxed mt-0.5", children: record.note })
    ] })
  ] });
}
function SectionTitle({ index, title, desc }) {
  return /* @__PURE__ */ jsxs("div", { className: "flex items-start gap-2", children: [
    /* @__PURE__ */ jsx("span", { className: "flex-shrink-0 w-5 h-5 rounded-full bg-blue-600 text-white text-[11px] font-bold flex items-center justify-center mt-0.5", children: index }),
    /* @__PURE__ */ jsxs("div", { className: "min-w-0", children: [
      /* @__PURE__ */ jsx("h3", { className: "text-sm font-bold text-slate-900 leading-tight", children: title }),
      desc && /* @__PURE__ */ jsx("p", { className: "text-[11px] text-slate-400 leading-tight mt-0.5", children: desc })
    ] })
  ] });
}
const FieldLabel = ({ children, required }) => /* @__PURE__ */ jsxs("label", { className: "text-xs font-semibold text-slate-600 mb-1 block leading-tight", children: [
  children,
  " ",
  required && /* @__PURE__ */ jsx("span", { className: "text-red-500", children: "*" })
] });
const inputClass = "w-full h-10 rounded-lg border border-gray-300 bg-white px-3 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500";
export function ProgressAddView() {
  const navigate = useNavigate();
  const { progressClients, selectedProgressClientId, addInbodyRecord } = useAppContext();
  const client = progressClients.find((c) => c.id === selectedProgressClientId) || progressClients[0];
  const scrollRef = useRef(null);
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = 0;
    }
  }, []);
  const [form, setForm] = useState({
    dateIso: todayIso(),
    height: String(client.height || ""),
    weight: "",
    inbodyScore: "",
    smm: "",
    bodyFatMass: "",
    pbf: "",
    tbw: "",
    bmi: "",
    bmr: "",
    visceralFat: "",
    waist: "",
    hip: "",
    chest: "",
    note: ""
  });
  const [errors, setErrors] = useState({});
  const [bmiManual, setBmiManual] = useState(false);
  const setField = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: "" }));
  };
  const handleNumberChange = (field, value) => {
    setForm((prev) => {
      const next = { ...prev, [field]: value };
      if (!bmiManual && (field === "weight" || field === "height")) {
        next.bmi = calcBmi(next.weight, next.height);
      }
      return next;
    });
    setErrors((prev) => ({ ...prev, [field]: "", bmi: "" }));
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    const nextErrors = {};
    const height = parseFloat(form.height);
    const weight = parseFloat(form.weight);
    const inbodyScore = parseFloat(form.inbodyScore);
    const smm = parseFloat(form.smm);
    const bodyFatMass = parseFloat(form.bodyFatMass);
    const pbf = parseFloat(form.pbf);
    const tbw = parseFloat(form.tbw);
    const bmi = parseFloat(form.bmi);
    const bmr = parseFloat(form.bmr);
    const visceralFat = parseInt(form.visceralFat, 10);
    const waist = parseFloat(form.waist);
    const hip = parseFloat(form.hip);
    const chest = parseFloat(form.chest);
    if (!form.dateIso) nextErrors.dateIso = "Vui l\xF2ng ch\u1ECDn ng\xE0y \u0111o";
    if (!(height > 0)) nextErrors.height = "Nh\u1EADp chi\u1EC1u cao h\u1EE3p l\u1EC7 (> 0)";
    if (!(weight > 0)) nextErrors.weight = "Nh\u1EADp c\xE2n n\u1EB7ng h\u1EE3p l\u1EC7 (> 0)";
    if (!(inbodyScore >= 0) || inbodyScore > 100) nextErrors.inbodyScore = "\u0110i\u1EC3m InBody trong kho\u1EA3ng 0 - 100";
    if (!(smm > 0)) nextErrors.smm = "Nh\u1EADp kh\u1ED1i l\u01B0\u1EE3ng c\u01A1 x\u01B0\u01A1ng (> 0)";
    if (!(bodyFatMass > 0)) nextErrors.bodyFatMass = "Nh\u1EADp kh\u1ED1i l\u01B0\u1EE3ng m\u1EE1 (> 0)";
    if (!(pbf > 0) || pbf >= 100) nextErrors.pbf = "T\u1EF7 l\u1EC7 m\u1EE1 trong kho\u1EA3ng 0 - 100%";
    if (!(tbw > 0)) nextErrors.tbw = "Nh\u1EADp t\u1ED5ng l\u01B0\u1EE3ng n\u01B0\u1EDBc c\u01A1 th\u1EC3 (> 0)";
    if (!(bmi > 0)) nextErrors.bmi = "Nh\u1EADp ch\u1EC9 s\u1ED1 BMI h\u1EE3p l\u1EC7";
    if (!(bmr > 0)) nextErrors.bmr = "Nh\u1EADp BMR h\u1EE3p l\u1EC7 (> 0)";
    if (!(visceralFat >= 1) || visceralFat > 20) nextErrors.visceralFat = "M\u1EE1 n\u1ED9i t\u1EA1ng t\u1EEB c\u1EA5p 1 \u0111\u1EBFn 20";
    if (!(waist > 0)) nextErrors.waist = "Nh\u1EADp v\xF2ng eo (> 0)";
    if (!(hip > 0)) nextErrors.hip = "Nh\u1EADp v\xF2ng m\xF4ng (> 0)";
    if (!(chest > 0)) nextErrors.chest = "Nh\u1EADp v\xF2ng ng\u1EF1c (> 0)";
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;
    addInbodyRecord({
      id: Date.now(),
      date: isoToVnDate(form.dateIso),
      height,
      weight,
      inbodyScore,
      smm,
      bodyFatMass,
      pbf,
      tbw,
      bmi,
      bmr,
      visceralFat,
      waist,
      hip,
      chest,
      note: form.note.trim() || "Ch\u01B0a c\xF3 nh\u1EADn x\xE9t cho l\u1EA7n \u0111o n\xE0y."
    });
    navigate(-1);
  };
  return /* @__PURE__ */ jsxs(Page, { ref: scrollRef, className: "bg-slate-100 pb-28", children: [
    /* @__PURE__ */ jsx(
      PageHeader,
      {
        title: "Th\xEAm b\u1EA3n ghi InBody",
        subtitle: client.name + " \u2022 " + client.phone,
        onBack: () => navigate(-1)
      }
    ),
    /* @__PURE__ */ jsxs("form", { onSubmit: handleSubmit, className: "p-4 space-y-4", children: [
      /* @__PURE__ */ jsx("div", { className: "bg-blue-50 border border-blue-200 rounded-xl p-3", children: /* @__PURE__ */ jsx("p", { className: "text-[11px] text-blue-800 leading-relaxed", children: "Nh\u1EADp ch\u1EC9 s\u1ED1 t\u1EEB m\xE1y InBody sau bu\u1ED5i \u0111o. B\u1EA3n ghi m\u1EDBi s\u1EBD \u0111\u01B0\u1EE3c th\xEAm l\xEAn \u0111\u1EA7u danh s\xE1ch v\xE0 c\u1EADp nh\u1EADt ngay ph\u1EA7n t\u1ED5ng quan." }) }),
      /* @__PURE__ */ jsxs("div", { className: "bg-white rounded-xl border border-slate-200 shadow-sm p-4 space-y-3", children: [
        /* @__PURE__ */ jsx(SectionTitle, { index: "1", title: "Ch\u1EC9 s\u1ED1 c\u01A1 b\u1EA3n & t\u1ED5ng quan", desc: "Th\xF4ng tin chung c\u1EE7a l\u1EA7n \u0111o" }),
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx(FieldLabel, { required: true, children: "Ng\xE0y \u0111o" }),
          /* @__PURE__ */ jsxs("div", { className: "relative w-full overflow-hidden rounded-xl border border-slate-200 bg-white", children: [
            /* @__PURE__ */ jsx(
              "input",
              {
                type: "date",
                value: form.dateIso,
                onChange: (e) => setField("dateIso", e.target.value),
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
          ] }),
          errors.dateIso && /* @__PURE__ */ jsx("p", { className: "text-[11px] text-red-600 mt-1", children: errors.dateIso })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-2 gap-3", children: [
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx(FieldLabel, { required: true, children: "Chi\u1EC1u cao (cm)" }),
            /* @__PURE__ */ jsx(
              "input",
              {
                type: "number",
                inputMode: "decimal",
                step: "0.5",
                min: "0",
                value: form.height,
                onChange: (e) => handleNumberChange("height", e.target.value),
                placeholder: "172",
                className: inputClass
              }
            ),
            errors.height && /* @__PURE__ */ jsx("p", { className: "text-[11px] text-red-600 mt-1", children: errors.height })
          ] }),
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx(FieldLabel, { required: true, children: "C\xE2n n\u1EB7ng (kg)" }),
            /* @__PURE__ */ jsx(
              "input",
              {
                type: "number",
                inputMode: "decimal",
                step: "0.1",
                min: "0",
                value: form.weight,
                onChange: (e) => handleNumberChange("weight", e.target.value),
                placeholder: "70.5",
                className: inputClass
              }
            ),
            errors.weight && /* @__PURE__ */ jsx("p", { className: "text-[11px] text-red-600 mt-1", children: errors.weight })
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx(FieldLabel, { required: true, children: "\u0110i\u1EC3m InBody (thang 100)" }),
          /* @__PURE__ */ jsx(
            "input",
            {
              type: "number",
              inputMode: "numeric",
              step: "1",
              min: "0",
              max: "100",
              value: form.inbodyScore,
              onChange: (e) => setField("inbodyScore", e.target.value),
              placeholder: "76",
              className: inputClass
            }
          ),
          errors.inbodyScore && /* @__PURE__ */ jsx("p", { className: "text-[11px] text-red-600 mt-1", children: errors.inbodyScore })
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "bg-white rounded-xl border border-slate-200 shadow-sm p-4 space-y-3", children: [
        /* @__PURE__ */ jsx(SectionTitle, { index: "2", title: "Th\xE0nh ph\u1EA7n C\u01A1 - M\u1EE1 - N\u01B0\u1EDBc", desc: "Kh\u1ED1i l\u01B0\u1EE3ng c\u01A1 x\u01B0\u01A1ng, m\u1EE1 v\xE0 n\u01B0\u1EDBc" }),
        /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-2 gap-3", children: [
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx(FieldLabel, { required: true, children: "C\u01A1 x\u01B0\u01A1ng - SMM (kg)" }),
            /* @__PURE__ */ jsx(
              "input",
              {
                type: "number",
                inputMode: "decimal",
                step: "0.1",
                min: "0",
                value: form.smm,
                onChange: (e) => setField("smm", e.target.value),
                placeholder: "31.2",
                className: inputClass
              }
            ),
            errors.smm && /* @__PURE__ */ jsx("p", { className: "text-[11px] text-red-600 mt-1", children: errors.smm })
          ] }),
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx(FieldLabel, { required: true, children: "Kh\u1ED1i l\u01B0\u1EE3ng m\u1EE1 - BFM (kg)" }),
            /* @__PURE__ */ jsx(
              "input",
              {
                type: "number",
                inputMode: "decimal",
                step: "0.1",
                min: "0",
                value: form.bodyFatMass,
                onChange: (e) => setField("bodyFatMass", e.target.value),
                placeholder: "15.8",
                className: inputClass
              }
            ),
            errors.bodyFatMass && /* @__PURE__ */ jsx("p", { className: "text-[11px] text-red-600 mt-1", children: errors.bodyFatMass })
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-2 gap-3", children: [
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx(FieldLabel, { required: true, children: "T\u1EF7 l\u1EC7 m\u1EE1 - PBF (%)" }),
            /* @__PURE__ */ jsx(
              "input",
              {
                type: "number",
                inputMode: "decimal",
                step: "0.1",
                min: "0",
                value: form.pbf,
                onChange: (e) => setField("pbf", e.target.value),
                placeholder: "22.4",
                className: inputClass
              }
            ),
            errors.pbf && /* @__PURE__ */ jsx("p", { className: "text-[11px] text-red-600 mt-1", children: errors.pbf })
          ] }),
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx(FieldLabel, { required: true, children: "T\u1ED5ng l\u01B0\u1EE3ng n\u01B0\u1EDBc - TBW (L)" }),
            /* @__PURE__ */ jsx(
              "input",
              {
                type: "number",
                inputMode: "decimal",
                step: "0.1",
                min: "0",
                value: form.tbw,
                onChange: (e) => setField("tbw", e.target.value),
                placeholder: "40.5",
                className: inputClass
              }
            ),
            errors.tbw && /* @__PURE__ */ jsx("p", { className: "text-[11px] text-red-600 mt-1", children: errors.tbw })
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "bg-white rounded-xl border border-slate-200 shadow-sm p-4 space-y-3", children: [
        /* @__PURE__ */ jsx(SectionTitle, { index: "3", title: "Chuy\u1EC3n h\xF3a & s\u1ED1 \u0111o h\xECnh th\u1EC3", desc: "BMI, BMR, m\u1EE1 n\u1ED9i t\u1EA1ng v\xE0 v\xF2ng \u0111o" }),
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between", children: [
            /* @__PURE__ */ jsx(FieldLabel, { required: true, children: "Ch\u1EC9 s\u1ED1 BMI" }),
            /* @__PURE__ */ jsx(
              "button",
              {
                type: "button",
                onClick: () => {
                  setForm((prev) => ({ ...prev, bmi: calcBmi(prev.weight, prev.height) }));
                  setBmiManual(false);
                  setErrors((prev) => ({ ...prev, bmi: "" }));
                },
                className: "inline-flex items-center justify-center text-center text-[11px] font-semibold text-blue-600 px-2 py-0.5 mb-1 rounded-md bg-blue-50 border border-blue-200 active:bg-blue-100",
                children: "T\u1EF1 \u0111\u1ED9ng t\xEDnh"
              }
            )
          ] }),
          /* @__PURE__ */ jsx(
            "input",
            {
              type: "number",
              inputMode: "decimal",
              step: "0.1",
              min: "0",
              value: form.bmi,
              onChange: (e) => {
                setBmiManual(true);
                setField("bmi", e.target.value);
              },
              placeholder: "25.1",
              className: inputClass
            }
          ),
          /* @__PURE__ */ jsx("p", { className: "text-[11px] text-slate-400 mt-1", children: "T\u1EF1 \u0111\u1ED9ng theo c\xE2n n\u1EB7ng & chi\u1EC1u cao, v\u1EABn c\xF3 th\u1EC3 s\u1EEDa tay." }),
          errors.bmi && /* @__PURE__ */ jsx("p", { className: "text-[11px] text-red-600 mt-1", children: errors.bmi })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-2 gap-3", children: [
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx(FieldLabel, { required: true, children: "BMR (kcal)" }),
            /* @__PURE__ */ jsx(
              "input",
              {
                type: "number",
                inputMode: "numeric",
                step: "1",
                min: "0",
                value: form.bmr,
                onChange: (e) => setField("bmr", e.target.value),
                placeholder: "1650",
                className: inputClass
              }
            ),
            errors.bmr && /* @__PURE__ */ jsx("p", { className: "text-[11px] text-red-600 mt-1", children: errors.bmr })
          ] }),
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx(FieldLabel, { required: true, children: "M\u1EE1 n\u1ED9i t\u1EA1ng (1-20)" }),
            /* @__PURE__ */ jsx(
              "input",
              {
                type: "number",
                inputMode: "numeric",
                step: "1",
                min: "1",
                max: "20",
                value: form.visceralFat,
                onChange: (e) => setField("visceralFat", e.target.value),
                placeholder: "7",
                className: inputClass
              }
            ),
            errors.visceralFat && /* @__PURE__ */ jsx("p", { className: "text-[11px] text-red-600 mt-1", children: errors.visceralFat })
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-3 gap-2", children: [
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx(FieldLabel, { required: true, children: "V\xF2ng eo" }),
            /* @__PURE__ */ jsx(
              "input",
              {
                type: "number",
                inputMode: "decimal",
                step: "0.5",
                min: "0",
                value: form.waist,
                onChange: (e) => setField("waist", e.target.value),
                placeholder: "88",
                className: inputClass
              }
            ),
            errors.waist && /* @__PURE__ */ jsx("p", { className: "text-[11px] text-red-600 mt-1", children: errors.waist })
          ] }),
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx(FieldLabel, { required: true, children: "V\xF2ng m\xF4ng" }),
            /* @__PURE__ */ jsx(
              "input",
              {
                type: "number",
                inputMode: "decimal",
                step: "0.5",
                min: "0",
                value: form.hip,
                onChange: (e) => setField("hip", e.target.value),
                placeholder: "98",
                className: inputClass
              }
            ),
            errors.hip && /* @__PURE__ */ jsx("p", { className: "text-[11px] text-red-600 mt-1", children: errors.hip })
          ] }),
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx(FieldLabel, { required: true, children: "V\xF2ng ng\u1EF1c" }),
            /* @__PURE__ */ jsx(
              "input",
              {
                type: "number",
                inputMode: "decimal",
                step: "0.5",
                min: "0",
                value: form.chest,
                onChange: (e) => setField("chest", e.target.value),
                placeholder: "102",
                className: inputClass
              }
            ),
            errors.chest && /* @__PURE__ */ jsx("p", { className: "text-[11px] text-red-600 mt-1", children: errors.chest })
          ] })
        ] }),
        /* @__PURE__ */ jsx("p", { className: "text-[11px] text-slate-400", children: "S\u1ED1 \u0111o t\xEDnh b\u1EB1ng cm." })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "bg-white rounded-xl border border-slate-200 shadow-sm p-4 space-y-3", children: [
        /* @__PURE__ */ jsx(SectionTitle, { index: "4", title: "\u0110\xE1nh gi\xE1 c\u1EE7a PT", desc: "Nh\u1EADn x\xE9t & \u0111i\u1EC1u ch\u1EC9nh dinh d\u01B0\u1EE1ng/t\u1EADp luy\u1EC7n" }),
        /* @__PURE__ */ jsx(
          "textarea",
          {
            value: form.note,
            onChange: (e) => setField("note", e.target.value),
            rows: 4,
            placeholder: "V\xED d\u1EE5: M\u1EE1 gi\u1EA3m t\u1ED1t, c\u01A1 x\u01B0\u01A1ng t\u0103ng nh\u1EB9. T\u0103ng th\xEAm 1 bu\u1ED5i HIIT m\u1ED7i tu\u1EA7n v\xE0 gi\u1EEF protein 2g/kg.",
            className: "w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
          }
        )
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "flex justify-end gap-2 pt-1", children: [
        /* @__PURE__ */ jsx(
          "button",
          {
            type: "button",
            onClick: () => navigate(-1),
            className: "inline-flex items-center justify-center text-center h-10 px-4 rounded-lg border border-gray-300 bg-white text-sm font-semibold text-gray-700 active:bg-gray-50",
            children: "H\u1EE7y"
          }
        ),
        /* @__PURE__ */ jsx(
          "button",
          {
            type: "submit",
            className: "inline-flex items-center justify-center text-center h-10 px-4 rounded-lg bg-blue-600 text-sm font-semibold text-white active:bg-blue-700 shadow-sm",
            children: "L\u01B0u ch\u1EC9 s\u1ED1 InBody"
          }
        )
      ] })
    ] })
  ] });
}
export default function ProgressPage() {
  const navigate = useNavigate();
  const {
    progressClients: clients,
    selectedProgressClientId: selectedClientId,
    setSelectedProgressClientId: setSelectedClientId,
    deleteInbodyRecord
  } = useAppContext();
  const scrollRef = useRef(null);
  const [searchQuery, setSearchQuery] = useState("");
  useEffect(() => {
    return restoreScroll("scroll_progress", scrollRef);
  }, []);
  const selectedClient = clients.find((c) => c.id === selectedClientId) || clients[0];
  const records = selectedClient.inbodyRecords;
  const latest = records[0] || null;
  let oldest = null;
  if (records.length > 0) {
    oldest = records[records.length - 1];
  }
  const recordsAsc = [...records].reverse();
  let filteredClients = clients;
  const q = searchQuery.toLowerCase().trim();
  if (q) {
    const qPhone = q.replace(/\s/g, "");
    filteredClients = clients.filter(
      (c) => c.name.toLowerCase().includes(q) || c.phone.replace(/\s/g, "").includes(qPhone)
    );
  }
  const handleOpenAdd = () => {
    saveScroll("scroll_progress", scrollRef);
    navigate("/progress-add");
  };
  const handleDeleteRecord = (recordId) => {
    deleteInbodyRecord(recordId);
  };
  return /* @__PURE__ */ jsx(Page, { ref: scrollRef, className: "bg-slate-100 pb-28", children: /* @__PURE__ */ jsxs("div", { children: [
    /* @__PURE__ */ jsx(
      PageHeader,
      {
        title: "Ch\u1EC9 s\u1ED1 InBody",
        subtitle: "Theo d\xF5i ti\u1EBFn \u0111\u1ED9 & h\xECnh th\u1EC3 h\u1ECDc vi\xEAn",
        onBack: () => navigate(-1)
      }
    ),
    /* @__PURE__ */ jsxs("div", { className: "px-4 pt-3 space-y-3", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
        /* @__PURE__ */ jsxs("div", { className: "relative flex-1 min-w-0", children: [
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
              className: "absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400",
              children: [
                /* @__PURE__ */ jsx("circle", { cx: "11", cy: "11", r: "7" }),
                /* @__PURE__ */ jsx("line", { x1: "21", y1: "21", x2: "16.65", y2: "16.65" })
              ]
            }
          ),
          /* @__PURE__ */ jsx(
            "input",
            {
              type: "search",
              value: searchQuery,
              onChange: (e) => setSearchQuery(e.target.value),
              placeholder: "T\xECm h\u1ECDc vi\xEAn theo t\xEAn ho\u1EB7c S\u0110T...",
              className: "w-full h-10 pl-9 pr-3 text-sm rounded-xl border border-gray-300 bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
            }
          )
        ] }),
        /* @__PURE__ */ jsx(
          "button",
          {
            type: "button",
            onClick: handleOpenAdd,
            "aria-label": "Th\xEAm b\u1EA3n ghi InBody",
            className: "text-center flex-shrink-0 w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-sm active:bg-blue-700",
            children: /* @__PURE__ */ jsxs(
              "svg",
              {
                xmlns: "http://www.w3.org/2000/svg",
                viewBox: "0 0 24 24",
                fill: "none",
                stroke: "currentColor",
                strokeWidth: "2.5",
                strokeLinecap: "round",
                strokeLinejoin: "round",
                className: "w-5 h-5",
                children: [
                  /* @__PURE__ */ jsx("line", { x1: "12", y1: "5", x2: "12", y2: "19" }),
                  /* @__PURE__ */ jsx("line", { x1: "5", y1: "12", x2: "19", y2: "12" })
                ]
              }
            )
          }
        )
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "flex gap-2 overflow-x-auto pb-1 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]", children: [
        filteredClients.map((client) => {
          const isActive = client.id === selectedClientId;
          return /* @__PURE__ */ jsx(
            "button",
            {
              type: "button",
              onClick: () => setSelectedClientId(client.id),
              className: `items-center justify-center text-center flex-shrink-0 whitespace-nowrap px-3 py-1.5 rounded-full text-xs font-semibold border transition-colors ${isActive ? "bg-blue-600 text-white border-blue-600 shadow-sm" : "bg-white text-slate-600 border-slate-300 active:bg-slate-50"}`,
              children: client.name
            },
            client.id
          );
        }),
        filteredClients.length === 0 && /* @__PURE__ */ jsx("span", { className: "text-xs text-slate-400 py-1.5", children: "Kh\xF4ng t\xECm th\u1EA5y h\u1ECDc vi\xEAn ph\xF9 h\u1EE3p" })
      ] })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "p-4 space-y-4", children: [
      /* @__PURE__ */ jsxs("div", { className: "bg-white rounded-xl border border-slate-200 shadow-sm p-4", children: [
        /* @__PURE__ */ jsxs("div", { className: "flex items-start justify-between gap-2", children: [
          /* @__PURE__ */ jsxs("div", { className: "min-w-0", children: [
            /* @__PURE__ */ jsx("h2", { className: "text-base font-bold text-slate-900 truncate", children: selectedClient.name }),
            /* @__PURE__ */ jsx("p", { className: "text-xs text-slate-500 mt-0.5", children: selectedClient.phone })
          ] }),
          /* @__PURE__ */ jsx("span", { className: "items-center justify-center text-center flex-shrink-0 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-blue-50 text-blue-700 border border-blue-200", children: selectedClient.goal })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-1.5 mt-2 text-xs text-slate-500", children: [
          /* @__PURE__ */ jsx(CalendarIcon, {}),
          /* @__PURE__ */ jsxs("span", { className: "truncate", children: [
            "L\u1EA7n \u0111o g\u1EA7n nh\u1EA5t:",
            " ",
            /* @__PURE__ */ jsx("span", { className: "font-semibold text-slate-700", children: latest ? latest.date : "--" })
          ] }),
          latest && latest.inbodyScore !== void 0 && /* @__PURE__ */ jsxs("span", { className: "items-center justify-center text-center flex-shrink-0 ml-auto text-[10px] font-bold px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200", children: [
            "\u0110i\u1EC3m ",
            latest.inbodyScore,
            "/100"
          ] })
        ] }),
        /* @__PURE__ */ jsx("div", { className: "grid grid-cols-3 gap-2 w-full mt-3", children: METRICS.map((metric) => /* @__PURE__ */ jsx(
          MetricBox,
          {
            metric,
            record: latest,
            delta: deltaOf(latest, oldest, metric.key)
          },
          metric.key
        )) }),
        latest && /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-3 gap-2 mt-2", children: [
          /* @__PURE__ */ jsx(MiniMetric, { label: "BMI", value: Number(latest.bmi).toFixed(1) }),
          /* @__PURE__ */ jsx(MiniMetric, { label: "BMR", value: `${latest.bmr} kcal` }),
          /* @__PURE__ */ jsx(MiniMetric, { label: "M\u1EE1 n\u1ED9i t\u1EA1ng", value: `C\u1EA5p ${latest.visceralFat}` })
        ] }),
        latest && oldest && latest.id !== oldest.id && /* @__PURE__ */ jsxs("p", { className: "text-[11px] text-slate-400 text-center mt-2", children: [
          "So v\u1EDBi l\u1EA7n \u0111o \u0111\u1EA7u ti\xEAn (",
          oldest.date,
          ")"
        ] }),
        records.length <= 1 && /* @__PURE__ */ jsx("p", { className: "text-[11px] text-slate-400 text-center mt-2", children: "Ch\u01B0a \u0111\u1EE7 d\u1EEF li\u1EC7u \u0111\u1EC3 so s\xE1nh \u2014 h\xE3y th\xEAm \xEDt nh\u1EA5t 2 l\u1EA7n \u0111o." })
      ] }),
      records.length === 0 ? /* @__PURE__ */ jsxs("div", { className: "bg-white rounded-xl border border-slate-200 shadow-sm p-8 text-center", children: [
        /* @__PURE__ */ jsxs(
          "svg",
          {
            xmlns: "http://www.w3.org/2000/svg",
            viewBox: "0 0 24 24",
            fill: "none",
            stroke: "currentColor",
            strokeWidth: "1.5",
            strokeLinecap: "round",
            strokeLinejoin: "round",
            className: "w-12 h-12 mx-auto mb-3 text-slate-300",
            children: [
              /* @__PURE__ */ jsx("line", { x1: "18", y1: "20", x2: "18", y2: "10" }),
              /* @__PURE__ */ jsx("line", { x1: "12", y1: "20", x2: "12", y2: "4" }),
              /* @__PURE__ */ jsx("line", { x1: "6", y1: "20", x2: "6", y2: "14" })
            ]
          }
        ),
        /* @__PURE__ */ jsx("p", { className: "text-sm font-bold text-slate-700", children: "Ch\u01B0a c\xF3 b\u1EA3n ghi InBody" }),
        /* @__PURE__ */ jsxs("p", { className: "text-xs text-slate-500 mt-1", children: [
          "Nh\u1EA5n n\xFAt + \u0111\u1EC3 th\xEAm l\u1EA7n \u0111o \u0111\u1EA7u ti\xEAn cho ",
          selectedClient.name,
          "."
        ] })
      ] }) : /* @__PURE__ */ jsxs(Fragment, { children: [
        /* @__PURE__ */ jsx(TrendChart, { recordsAsc }),
        /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between", children: [
          /* @__PURE__ */ jsx("h2", { className: "text-sm font-bold text-slate-900", children: "L\u1ECBch s\u1EED \u0111o InBody" }),
          /* @__PURE__ */ jsxs("span", { className: "inline-flex items-center justify-center text-center text-[11px] font-semibold px-2 py-0.5 rounded-full bg-white border border-slate-200 text-slate-500", children: [
            records.length,
            " b\u1EA3n ghi"
          ] })
        ] }),
        /* @__PURE__ */ jsx("div", { className: "space-y-3", children: records.map((record, index) => /* @__PURE__ */ jsx(
          HistoryCard,
          {
            record,
            isLatest: index === 0,
            onDelete: handleDeleteRecord
          },
          record.id
        )) })
      ] })
    ] })
  ] }) });
}
