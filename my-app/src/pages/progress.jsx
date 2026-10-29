import { Page, useNavigate } from "zmp-ui";
import React, { useState, useEffect, useRef } from "react";
import { BackButton } from "../components/icons";
import { useAppContext } from "../context/AppContext";
import { saveScroll, restoreScroll } from "../utils/scroll";

// ============================================
// Dữ liệu học viên + lịch sử đo InBody nằm trong src/context/AppContext.jsx
// Cấu trúc file: (1) Hàm hỗ trợ, (2) State, (3) Handlers, (4) Giao diện
// height: chiều cao mặc định (cm) dùng để tính BMI tự động
// ============================================

// ============================================
// CẤU HÌNH 3 CHỈ SỐ CHÍNH (dùng cho ô tổng quan + biểu đồ)
// ============================================
const METRICS = [
  {
    key: "weight",
    label: "CÂN NẶNG",
    name: "Cân nặng",
    unit: "kg",
    decimals: 1,
    boxClass: "bg-blue-50 border-blue-200 text-blue-800",
    barClass: "bg-blue-500",
    textClass: "text-blue-600",
    goodWhenLower: true,
  },
  {
    key: "smm",
    label: "CƠ XƯƠNG",
    name: "Cơ xương (SMM)",
    unit: "kg",
    decimals: 1,
    boxClass: "bg-emerald-50 border-emerald-200 text-emerald-800",
    barClass: "bg-emerald-500",
    textClass: "text-emerald-600",
    goodWhenLower: false,
  },
  {
    key: "pbf",
    label: "TỶ LỆ MỠ",
    name: "Tỷ lệ mỡ (PBF)",
    unit: "%",
    decimals: 1,
    boxClass: "bg-amber-50 border-amber-200 text-amber-800",
    barClass: "bg-amber-500",
    textClass: "text-amber-600",
    goodWhenLower: true,
  },
];

// ============================================
// HELPERS
// ============================================
function isoToVnDate(isoStr) {
  // "2026-10-27" -> "27/10/2026"
  if (!isoStr) return "";
  const [y, m, d] = isoStr.split("-");
  return `${d}/${m}/${y}`;
}

function todayIso() {
  const now = new Date();
  const m = String(now.getMonth() + 1).padStart(2, "0");
  const d = String(now.getDate()).padStart(2, "0");
  return `${now.getFullYear()}-${m}-${d}`;
}

function shortDate(dateStr) {
  // "20/10/2026" -> "20/10"
  return (dateStr || "").slice(0, 5);
}

function calcBmi(weight, height) {
  const w = parseFloat(weight);
  const h = parseFloat(height);
  if (!(w > 0) || !(h > 0)) return "";
  return (w / ((h / 100) ** 2)).toFixed(1);
}

function deltaOf(latestRecord, oldestRecord, key) {
  if (!latestRecord || !oldestRecord || latestRecord.id === oldestRecord.id) return null;
  if (latestRecord[key] === undefined || oldestRecord[key] === undefined) return null;
  const raw = Number(latestRecord[key]) - Number(oldestRecord[key]);
  // làm tròn 1 chữ số thập phân để tránh lỗi 0.30000000000004
  return Math.round(raw * 10) / 10;
}

function formatDelta(delta, unit) {
  const sign = delta > 0 ? "+" : "";
  return `${sign}${delta.toFixed(1)} ${unit}`;
}

function deltaBadgeClass(metric, delta) {
  if (delta === null || delta === 0) return "bg-white/70 text-slate-500 border border-slate-200";
  const isGood = metric.goodWhenLower ? delta < 0 : delta > 0;
  return isGood
    ? "bg-emerald-100 text-emerald-700 border border-emerald-200"
    : "bg-red-100 text-red-700 border border-red-200";
}

function barHeightPercent(value, min, max) {
  if (max === min) return 60;
  return 25 + (75 * (Number(value) - min)) / (max - min);
}

const BackIcon = ({ className = "w-5 h-5 text-white" }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <polyline points="15 18 9 12 15 6" />
  </svg>
);

const CalendarIcon = ({ className = "w-3.5 h-3.5 text-slate-400" }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
    <line x1="16" y1="2" x2="16" y2="6" />
    <line x1="8" y1="2" x2="8" y2="6" />
    <line x1="3" y1="10" x2="21" y2="10" />
  </svg>
);

// ============================================
// HEADER DÙNG CHUNG (an toàn trên mobile)
// ============================================
function PageHeader({ title, subtitle, onBack }) {
  return (
    <div
      className="bg-white border-b border-gray-200 px-4 pb-3 sticky top-0 z-30 pr-24"
      style={{ paddingTop: "max(env(safe-area-inset-top, 44px), 44px)" }}
    >
      <div className="flex items-center gap-2">
        <BackButton onClick={onBack} />
        <div className="flex-1 min-w-0">
          <h1 className="text-lg font-bold text-gray-900 leading-tight truncate">{title}</h1>
          <p className="text-xs text-gray-500 truncate">{subtitle}</p>
        </div>
      </div>
    </div>
  );
}

// ============================================
// Ô CHỈ SỐ (1 trong 3 cột)
// ============================================
function MetricBox({ metric, record, delta }) {
  return (
    <div
      className={`flex flex-col items-center justify-center text-center p-2.5 rounded-xl min-w-0 border ${metric.boxClass}`}
    >
      <span className="text-[10px] font-semibold uppercase opacity-75 leading-tight">{metric.label}</span>
      <span className="text-lg font-bold leading-tight mt-1">
        {record ? Number(record[metric.key]).toFixed(metric.decimals) : "--"}
      </span>
      <span className="text-[10px] font-medium opacity-70 leading-tight">{metric.unit}</span>
      {delta !== null && delta !== undefined ? (
        <span className={`mt-1 px-1.5 py-0.5 rounded-md text-[10px] font-bold leading-tight ${deltaBadgeClass(metric, delta)}`}>
          {formatDelta(delta, metric.unit)}
        </span>
      ) : (
        <span className="mt-1 px-1.5 py-0.5 rounded-md text-[10px] font-medium leading-tight bg-white/70 text-slate-400 border border-slate-200">
          Lần đầu
        </span>
      )}
    </div>
  );
}

// Thẻ mini hiển thị 1 chỉ số phụ trong lịch sử
function MiniMetric({ label, value, tone = "slate" }) {
  const toneClass =
    tone === "blue"
      ? "bg-blue-50 border-blue-100 text-blue-800"
      : tone === "amber"
      ? "bg-amber-50 border-amber-100 text-amber-800"
      : tone === "emerald"
      ? "bg-emerald-50 border-emerald-100 text-emerald-800"
      : "bg-slate-50 border-slate-200 text-slate-800";

  return (
    <div className={`flex flex-col items-center justify-center text-center border rounded-lg p-2 min-w-0 ${toneClass}`}>
      <span className="text-[10px] font-semibold uppercase opacity-70 leading-tight">{label}</span>
      <span className="text-xs font-bold leading-tight mt-0.5 break-words w-full">{value}</span>
    </div>
  );
}

// ============================================
// BIỂU ĐỒ BIẾN CHUYỂN (HTML + Tailwind)
// ============================================
function TrendChart({ recordsAsc }) {
  if (!recordsAsc || recordsAsc.length === 0) return null;

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4">
      <div className="flex items-start justify-between gap-2">
        <h2 className="text-sm font-bold text-slate-900 leading-snug">Biểu đồ biến chuyển qua các lần đo</h2>
        <span className="items-center justify-center text-center flex-shrink-0 text-[10px] font-semibold px-2 py-0.5 rounded-full bg-slate-100 text-slate-500">
          {recordsAsc.length} lần đo
        </span>
      </div>
      <p className="text-[11px] text-slate-400 mt-0.5">Cột đậm nhất là lần đo gần nhất</p>

      <div className="mt-3 divide-y divide-slate-100">
        {METRICS.map((metric) => {
          const values = recordsAsc.map((r) => Number(r[metric.key]));
          const min = Math.min(...values);
          const max = Math.max(...values);
          const delta = deltaOf(recordsAsc[recordsAsc.length - 1], recordsAsc[0], metric.key);

          return (
            <div key={metric.key} className="py-3 first:pt-0 last:pb-0">
              <div className="flex items-center justify-between gap-2 mb-2">
                <span className="text-xs font-semibold text-slate-700">
                  {metric.name} ({metric.unit})
                </span>
                {delta !== null ? (
                  <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-md ${deltaBadgeClass(metric, delta)}`}>
                    {formatDelta(delta, metric.unit)}
                  </span>
                ) : (
                  <span className="text-[10px] font-medium text-slate-400">Chưa đủ dữ liệu</span>
                )}
              </div>

              <div className="flex items-end gap-1.5 h-24">
                {recordsAsc.map((record, index) => {
                  const isLatest = index === recordsAsc.length - 1;
                  return (
                    <div key={record.id} className="flex-1 flex flex-col items-center justify-end h-full min-w-0">
                      <span className={`text-[10px] font-bold leading-none mb-1 ${isLatest ? metric.textClass : "text-slate-500"}`}>
                        {Number(record[metric.key]).toFixed(metric.decimals)}
                      </span>
                      <div className="w-full flex-1 flex items-end">
                        <div
                          className={`w-full rounded-t-md transition-all duration-300 ${metric.barClass} ${isLatest ? "" : "opacity-35"}`}
                          style={{ height: `${barHeightPercent(record[metric.key], min, max)}%` }}
                        />
                      </div>
                      <span className={`text-[9px] leading-none mt-1 whitespace-nowrap ${isLatest ? "font-bold text-slate-700" : "text-slate-400"}`}>
                        {shortDate(record.date)}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ============================================
// CARD LỊCH SỬ ĐO
// ============================================
function HistoryCard({ record, isLatest, onDelete }) {
  const [showDetails, setShowDetails] = useState(false);

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4">
      {/* Header: ngày đo + điểm InBody + nút xóa */}
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2 min-w-0">
          <CalendarIcon className="w-4 h-4 text-slate-400 flex-shrink-0" />
          <span className="text-sm font-bold text-slate-900 truncate">{record.date}</span>
          {isLatest && (
            <span className="items-center justify-center text-center flex-shrink-0 text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-blue-100 text-blue-700">
              Mới nhất
            </span>
          )}
        </div>
        <div className="flex items-center gap-2 flex-shrink-0">
          {record.inbodyScore !== undefined && (
            <span className="inline-flex items-center justify-center text-center text-[10px] font-bold px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200">
              Điểm {record.inbodyScore}
            </span>
          )}
          <button
            type="button"
            onClick={() => onDelete(record.id)}
            className="inline-flex items-center justify-center text-center text-xs font-semibold text-red-600 px-2.5 py-1 rounded-lg border border-red-200 bg-red-50 active:bg-red-100"
          >
            Xóa
          </button>
        </div>
      </div>

      {/* Nhóm 1: 3 chỉ số cơ bản */}
      <div className="grid grid-cols-3 gap-2 mt-3">
        <MiniMetric label="Cân nặng" value={`${Number(record.weight).toFixed(1)} kg`} tone="blue" />
        <MiniMetric label="Cơ xương" value={`${Number(record.smm).toFixed(1)} kg`} tone="emerald" />
        <MiniMetric label="Tỷ lệ mỡ" value={`${Number(record.pbf).toFixed(1)} %`} tone="amber" />
      </div>

      {/* Nhóm 2: chỉ số chuyển hóa nhanh */}
      <div className="grid grid-cols-3 gap-2 mt-2">
        <MiniMetric label="BMI" value={Number(record.bmi).toFixed(1)} />
        <MiniMetric label="Mỡ nội tạng" value={`Cấp ${record.visceralFat}`} />
        <MiniMetric label="BMR" value={`${record.bmr} kcal`} />
      </div>

      {/* Nhóm 3: chi tiết mở rộng */}
      {showDetails && (
        <>
          <div className="grid grid-cols-3 gap-2 mt-2">
            <MiniMetric label="Khối lượng mỡ" value={`${Number(record.bodyFatMass).toFixed(1)} kg`} />
            <MiniMetric label="Nước (TBW)" value={`${Number(record.tbw).toFixed(1)} L`} />
            <MiniMetric label="Chiều cao" value={`${record.height} cm`} />
          </div>
          <div className="grid grid-cols-3 gap-2 mt-2">
            <MiniMetric label="Vòng eo" value={`${record.waist} cm`} />
            <MiniMetric label="Vòng mông" value={`${record.hip} cm`} />
            <MiniMetric label="Vòng ngực" value={`${record.chest} cm`} />
          </div>
        </>
      )}

      <button
        type="button"
        onClick={() => setShowDetails((prev) => !prev)}
        className="inline-flex items-center justify-center text-center mt-2 w-full h-8 rounded-lg bg-slate-50 border border-slate-200 text-[11px] font-semibold text-slate-600 active:bg-slate-100"
      >
        {showDetails ? "Thu gọn chỉ số" : "Xem chi tiết chỉ số"}
      </button>

      {record.note && (
        <div className="mt-2.5 bg-blue-50 border border-blue-200 rounded-lg p-2.5">
          <span className="text-[10px] font-bold uppercase text-blue-700">Nhận xét của PT</span>
          <p className="text-xs text-blue-800 leading-relaxed mt-0.5">{record.note}</p>
        </div>
      )}
    </div>
  );
}

// ============================================
// VIEW THÊM BẢN GHI INBODY
// ============================================
function SectionTitle({ index, title, desc }) {
  return (
    <div className="flex items-start gap-2">
      <span className="flex-shrink-0 w-5 h-5 rounded-full bg-blue-600 text-white text-[11px] font-bold flex items-center justify-center mt-0.5">
        {index}
      </span>
      <div className="min-w-0">
        <h3 className="text-sm font-bold text-slate-900 leading-tight">{title}</h3>
        {desc && <p className="text-[11px] text-slate-400 leading-tight mt-0.5">{desc}</p>}
      </div>
    </div>
  );
}

const FieldLabel = ({ children, required }) => (
  <label className="text-xs font-semibold text-slate-600 mb-1 block leading-tight">
    {children} {required && <span className="text-red-500">*</span>}
  </label>
);

const inputClass =
  "w-full h-10 rounded-lg border border-gray-300 bg-white px-3 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500";

// Trang form thêm bản ghi InBody (route "/progress-add")
export function ProgressAddView() {
  const navigate = useNavigate();
  const { progressClients, selectedProgressClientId, addInbodyRecord } = useAppContext();

  // Học viên đang chọn ở trang Tiến độ
  const client = progressClients.find((c) => c.id === selectedProgressClientId) || progressClients[0];

  // Scroll ref riêng biệt cho màn hình này
  const scrollRef = useRef(null);

  // Màn hình thêm mới luôn bắt đầu từ đầu trang (scrollTop = 0)
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = 0;
    }
  }, []);

  // Dữ liệu đang nhập trong form
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
    note: "",
  });
  const [errors, setErrors] = useState({});
  const [bmiManual, setBmiManual] = useState(false);

  const setField = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: "" }));
  };

  // BMI tự động = cân nặng / (chiều cao tính bằng m)^2
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

    if (!form.dateIso) nextErrors.dateIso = "Vui lòng chọn ngày đo";
    if (!(height > 0)) nextErrors.height = "Nhập chiều cao hợp lệ (> 0)";
    if (!(weight > 0)) nextErrors.weight = "Nhập cân nặng hợp lệ (> 0)";
    if (!(inbodyScore >= 0) || inbodyScore > 100) nextErrors.inbodyScore = "Điểm InBody trong khoảng 0 - 100";
    if (!(smm > 0)) nextErrors.smm = "Nhập khối lượng cơ xương (> 0)";
    if (!(bodyFatMass > 0)) nextErrors.bodyFatMass = "Nhập khối lượng mỡ (> 0)";
    if (!(pbf > 0) || pbf >= 100) nextErrors.pbf = "Tỷ lệ mỡ trong khoảng 0 - 100%";
    if (!(tbw > 0)) nextErrors.tbw = "Nhập tổng lượng nước cơ thể (> 0)";
    if (!(bmi > 0)) nextErrors.bmi = "Nhập chỉ số BMI hợp lệ";
    if (!(bmr > 0)) nextErrors.bmr = "Nhập BMR hợp lệ (> 0)";
    if (!(visceralFat >= 1) || visceralFat > 20) nextErrors.visceralFat = "Mỡ nội tạng từ cấp 1 đến 20";
    if (!(waist > 0)) nextErrors.waist = "Nhập vòng eo (> 0)";
    if (!(hip > 0)) nextErrors.hip = "Nhập vòng mông (> 0)";
    if (!(chest > 0)) nextErrors.chest = "Nhập vòng ngực (> 0)";

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
      note: form.note.trim() || "Chưa có nhận xét cho lần đo này.",
    });
    // Lưu xong thì quay lại trang trước (hiệu ứng trượt ngược)
    navigate(-1);
  };

  return (
    <Page ref={scrollRef} className="bg-slate-100 pb-28">
      <PageHeader
        title="Thêm bản ghi InBody"
        subtitle={client.name + " • " + client.phone}
        onBack={() => navigate(-1)}
      />

      <form onSubmit={handleSubmit} className="p-4 space-y-4">
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-3">
          <p className="text-[11px] text-blue-800 leading-relaxed">
            Nhập chỉ số từ máy InBody sau buổi đo. Bản ghi mới sẽ được thêm lên đầu danh sách và cập nhật ngay phần tổng quan.
          </p>
        </div>

        {/* NHÓM 1 — Chỉ số cơ bản & tổng quan */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4 space-y-3">
          <SectionTitle index="1" title="Chỉ số cơ bản & tổng quan" desc="Thông tin chung của lần đo" />

          <div>
            <FieldLabel required>Ngày đo</FieldLabel>
            <input
              type="date"
              value={form.dateIso}
              onChange={(e) => setField("dateIso", e.target.value)}
              className={inputClass}
            />
            {errors.dateIso && <p className="text-[11px] text-red-600 mt-1">{errors.dateIso}</p>}
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <FieldLabel required>Chiều cao (cm)</FieldLabel>
              <input
                type="number"
                inputMode="decimal"
                step="0.5"
                min="0"
                value={form.height}
                onChange={(e) => handleNumberChange("height", e.target.value)}
                placeholder="172"
                className={inputClass}
              />
              {errors.height && <p className="text-[11px] text-red-600 mt-1">{errors.height}</p>}
            </div>
            <div>
              <FieldLabel required>Cân nặng (kg)</FieldLabel>
              <input
                type="number"
                inputMode="decimal"
                step="0.1"
                min="0"
                value={form.weight}
                onChange={(e) => handleNumberChange("weight", e.target.value)}
                placeholder="70.5"
                className={inputClass}
              />
              {errors.weight && <p className="text-[11px] text-red-600 mt-1">{errors.weight}</p>}
            </div>
          </div>

          <div>
            <FieldLabel required>Điểm InBody (thang 100)</FieldLabel>
            <input
              type="number"
              inputMode="numeric"
              step="1"
              min="0"
              max="100"
              value={form.inbodyScore}
              onChange={(e) => setField("inbodyScore", e.target.value)}
              placeholder="76"
              className={inputClass}
            />
            {errors.inbodyScore && <p className="text-[11px] text-red-600 mt-1">{errors.inbodyScore}</p>}
          </div>
        </div>

        {/* NHÓM 2 — Thành phần Cơ - Mỡ - Nước */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4 space-y-3">
          <SectionTitle index="2" title="Thành phần Cơ - Mỡ - Nước" desc="Khối lượng cơ xương, mỡ và nước" />

          <div className="grid grid-cols-2 gap-3">
            <div>
              <FieldLabel required>Cơ xương - SMM (kg)</FieldLabel>
              <input
                type="number"
                inputMode="decimal"
                step="0.1"
                min="0"
                value={form.smm}
                onChange={(e) => setField("smm", e.target.value)}
                placeholder="31.2"
                className={inputClass}
              />
              {errors.smm && <p className="text-[11px] text-red-600 mt-1">{errors.smm}</p>}
            </div>
            <div>
              <FieldLabel required>Khối lượng mỡ - BFM (kg)</FieldLabel>
              <input
                type="number"
                inputMode="decimal"
                step="0.1"
                min="0"
                value={form.bodyFatMass}
                onChange={(e) => setField("bodyFatMass", e.target.value)}
                placeholder="15.8"
                className={inputClass}
              />
              {errors.bodyFatMass && <p className="text-[11px] text-red-600 mt-1">{errors.bodyFatMass}</p>}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <FieldLabel required>Tỷ lệ mỡ - PBF (%)</FieldLabel>
              <input
                type="number"
                inputMode="decimal"
                step="0.1"
                min="0"
                value={form.pbf}
                onChange={(e) => setField("pbf", e.target.value)}
                placeholder="22.4"
                className={inputClass}
              />
              {errors.pbf && <p className="text-[11px] text-red-600 mt-1">{errors.pbf}</p>}
            </div>
            <div>
              <FieldLabel required>Tổng lượng nước - TBW (L)</FieldLabel>
              <input
                type="number"
                inputMode="decimal"
                step="0.1"
                min="0"
                value={form.tbw}
                onChange={(e) => setField("tbw", e.target.value)}
                placeholder="40.5"
                className={inputClass}
              />
              {errors.tbw && <p className="text-[11px] text-red-600 mt-1">{errors.tbw}</p>}
            </div>
          </div>
        </div>

        {/* NHÓM 3 — Chuyển hóa & số đo hình thể */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4 space-y-3">
          <SectionTitle index="3" title="Chuyển hóa & số đo hình thể" desc="BMI, BMR, mỡ nội tạng và vòng đo" />

          <div>
            <div className="flex items-center justify-between">
              <FieldLabel required>Chỉ số BMI</FieldLabel>
              <button
                type="button"
                onClick={() => {
                  setForm((prev) => ({ ...prev, bmi: calcBmi(prev.weight, prev.height) }));
                  setBmiManual(false);
                  setErrors((prev) => ({ ...prev, bmi: "" }));
                }}
                className="inline-flex items-center justify-center text-center text-[11px] font-semibold text-blue-600 px-2 py-0.5 mb-1 rounded-md bg-blue-50 border border-blue-200 active:bg-blue-100"
              >
                Tự động tính
              </button>
            </div>
            <input
              type="number"
              inputMode="decimal"
              step="0.1"
              min="0"
              value={form.bmi}
              onChange={(e) => {
                setBmiManual(true);
                setField("bmi", e.target.value);
              }}
              placeholder="25.1"
              className={inputClass}
            />
            <p className="text-[11px] text-slate-400 mt-1">
              Tự động theo cân nặng &amp; chiều cao, vẫn có thể sửa tay.
            </p>
            {errors.bmi && <p className="text-[11px] text-red-600 mt-1">{errors.bmi}</p>}
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <FieldLabel required>BMR (kcal)</FieldLabel>
              <input
                type="number"
                inputMode="numeric"
                step="1"
                min="0"
                value={form.bmr}
                onChange={(e) => setField("bmr", e.target.value)}
                placeholder="1650"
                className={inputClass}
              />
              {errors.bmr && <p className="text-[11px] text-red-600 mt-1">{errors.bmr}</p>}
            </div>
            <div>
              <FieldLabel required>Mỡ nội tạng (1-20)</FieldLabel>
              <input
                type="number"
                inputMode="numeric"
                step="1"
                min="1"
                max="20"
                value={form.visceralFat}
                onChange={(e) => setField("visceralFat", e.target.value)}
                placeholder="7"
                className={inputClass}
              />
              {errors.visceralFat && <p className="text-[11px] text-red-600 mt-1">{errors.visceralFat}</p>}
            </div>
          </div>

          <div className="grid grid-cols-3 gap-2">
            <div>
              <FieldLabel required>Vòng eo</FieldLabel>
              <input
                type="number"
                inputMode="decimal"
                step="0.5"
                min="0"
                value={form.waist}
                onChange={(e) => setField("waist", e.target.value)}
                placeholder="88"
                className={inputClass}
              />
              {errors.waist && <p className="text-[11px] text-red-600 mt-1">{errors.waist}</p>}
            </div>
            <div>
              <FieldLabel required>Vòng mông</FieldLabel>
              <input
                type="number"
                inputMode="decimal"
                step="0.5"
                min="0"
                value={form.hip}
                onChange={(e) => setField("hip", e.target.value)}
                placeholder="98"
                className={inputClass}
              />
              {errors.hip && <p className="text-[11px] text-red-600 mt-1">{errors.hip}</p>}
            </div>
            <div>
              <FieldLabel required>Vòng ngực</FieldLabel>
              <input
                type="number"
                inputMode="decimal"
                step="0.5"
                min="0"
                value={form.chest}
                onChange={(e) => setField("chest", e.target.value)}
                placeholder="102"
                className={inputClass}
              />
              {errors.chest && <p className="text-[11px] text-red-600 mt-1">{errors.chest}</p>}
            </div>
          </div>
          <p className="text-[11px] text-slate-400">Số đo tính bằng cm.</p>
        </div>

        {/* NHÓM 4 — Đánh giá của PT */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4 space-y-3">
          <SectionTitle index="4" title="Đánh giá của PT" desc="Nhận xét & điều chỉnh dinh dưỡng/tập luyện" />
          <textarea
            value={form.note}
            onChange={(e) => setField("note", e.target.value)}
            rows={4}
            placeholder="Ví dụ: Mỡ giảm tốt, cơ xương tăng nhẹ. Tăng thêm 1 buổi HIIT mỗi tuần và giữ protein 2g/kg."
            className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="flex justify-end gap-2 pt-1">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="inline-flex items-center justify-center text-center h-10 px-4 rounded-lg border border-gray-300 bg-white text-sm font-semibold text-gray-700 active:bg-gray-50"
          >
            Hủy
          </button>
          <button
            type="submit"
            className="inline-flex items-center justify-center text-center h-10 px-4 rounded-lg bg-blue-600 text-sm font-semibold text-white active:bg-blue-700 shadow-sm"
          >
            Lưu chỉ số InBody
          </button>
        </div>
      </form>
    </Page>
  );
}

// ============================================
// Trang chính: Chỉ số InBody (route "/progress")
// ============================================
export default function ProgressPage() {
  const navigate = useNavigate();

  // Lấy danh sách học viên kèm bản ghi InBody và các hàm xử lý từ Context dùng chung
  const {
    progressClients: clients,
    selectedProgressClientId: selectedClientId,
    setSelectedProgressClientId: setSelectedClientId,
    deleteInbodyRecord,
  } = useAppContext();

  // Scroll ref riêng biệt cho trang InBody
  const scrollRef = useRef(null);

  // ----- (2) STATE -----

  // Từ khóa tìm kiếm học viên
  const [searchQuery, setSearchQuery] = useState("");

  // Khi vào trang: khôi phục vị trí cuộn đã lưu (nếu có)
  useEffect(() => {
    return restoreScroll("scroll_progress", scrollRef);
  }, []);

  // ----- Dữ liệu tính toán từ state -----

  // Học viên đang chọn (nếu không tìm thấy thì lấy người đầu tiên)
  const selectedClient = clients.find((c) => c.id === selectedClientId) || clients[0];

  // Các bản ghi InBody của học viên đang chọn (mới nhất -> cũ nhất)
  const records = selectedClient.inbodyRecords;
  const latest = records[0] || null;
  let oldest = null;
  if (records.length > 0) {
    oldest = records[records.length - 1];
  }

  // Bản ghi theo thứ tự cũ -> mới để vẽ biểu đồ xu hướng
  const recordsAsc = [...records].reverse();

  // Lọc danh sách học viên theo từ khóa tìm kiếm (tên hoặc SĐT)
  let filteredClients = clients;
  const q = searchQuery.toLowerCase().trim();
  if (q) {
    const qPhone = q.replace(/\s/g, "");
    filteredClients = clients.filter(
      (c) => c.name.toLowerCase().includes(q) || c.phone.replace(/\s/g, "").includes(qPhone)
    );
  }

  // ----- (3) HANDLERS -----

  // Bấm nút "+": lưu vị trí cuộn rồi chuyển sang trang form thêm bản ghi InBody
  const handleOpenAdd = () => {
    saveScroll("scroll_progress", scrollRef);
    navigate("/progress-add");
  };

  // Xóa 1 bản ghi InBody của học viên đang chọn
  const handleDeleteRecord = (recordId) => {
    deleteInbodyRecord(recordId);
  };

  // ----- (4) GIAO DIỆN -----
  return (
    <Page ref={scrollRef} className="bg-slate-100 pb-28">
      {/* Màn hình chính (luôn hiển thị phía sau lớp trượt) */}
      <div>
          <PageHeader
            title="Chỉ số InBody"
            subtitle="Theo dõi tiến độ & hình thể học viên"
            onBack={() => navigate(-1)}
          />

          {/* Sub-header: tìm kiếm + nút thêm + bộ chọn học viên */}
          <div className="px-4 pt-3 space-y-3">
            <div className="flex items-center gap-2">
              <div className="relative flex-1 min-w-0">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400"
                >
                  <circle cx="11" cy="11" r="7" />
                  <line x1="21" y1="21" x2="16.65" y2="16.65" />
                </svg>
                <input
                  type="search"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Tìm học viên theo tên hoặc SĐT..."
                  className="w-full h-10 pl-9 pr-3 text-sm rounded-xl border border-gray-300 bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <button
                type="button"
                onClick={handleOpenAdd}
                aria-label="Thêm bản ghi InBody"
                className="text-center flex-shrink-0 w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-sm active:bg-blue-700"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="w-5 h-5"
                >
                  <line x1="12" y1="5" x2="12" y2="19" />
                  <line x1="5" y1="12" x2="19" y2="12" />
                </svg>
              </button>
            </div>

            {/* Pills chọn học viên — ẩn scrollbar */}
            <div className="flex gap-2 overflow-x-auto pb-1 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
              {filteredClients.map((client) => {
                const isActive = client.id === selectedClientId;
                return (
                  <button
                    key={client.id}
                    type="button"
                    onClick={() => setSelectedClientId(client.id)}
                    className={`items-center justify-center text-center flex-shrink-0 whitespace-nowrap px-3 py-1.5 rounded-full text-xs font-semibold border transition-colors ${
                      isActive
                        ? "bg-blue-600 text-white border-blue-600 shadow-sm"
                        : "bg-white text-slate-600 border-slate-300 active:bg-slate-50"
                    }`}
                  >
                    {client.name}
                  </button>
                );
              })}
              {filteredClients.length === 0 && (
                <span className="text-xs text-slate-400 py-1.5">Không tìm thấy học viên phù hợp</span>
              )}
            </div>
          </div>

          <div className="p-4 space-y-4">
            {/* ---------- Tổng quan hiện tại ---------- */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4">
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <h2 className="text-base font-bold text-slate-900 truncate">{selectedClient.name}</h2>
                  <p className="text-xs text-slate-500 mt-0.5">{selectedClient.phone}</p>
                </div>
                <span className="items-center justify-center text-center flex-shrink-0 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-blue-50 text-blue-700 border border-blue-200">
                  {selectedClient.goal}
                </span>
              </div>

              <div className="flex items-center gap-1.5 mt-2 text-xs text-slate-500">
                <CalendarIcon />
                <span className="truncate">
                  Lần đo gần nhất:{" "}
                  <span className="font-semibold text-slate-700">{latest ? latest.date : "--"}</span>
                </span>
                {latest && latest.inbodyScore !== undefined && (
                  <span className="items-center justify-center text-center flex-shrink-0 ml-auto text-[10px] font-bold px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200">
                    Điểm {latest.inbodyScore}/100
                  </span>
                )}
              </div>

              {/* 3 ô chỉ số: luôn 1 hàng 3 cột */}
              <div className="grid grid-cols-3 gap-2 w-full mt-3">
                {METRICS.map((metric) => (
                  <MetricBox
                    key={metric.key}
                    metric={metric}
                    record={latest}
                    delta={deltaOf(latest, oldest, metric.key)}
                  />
                ))}
              </div>

              {/* Chỉ số chuyển hóa nhanh của lần đo mới nhất */}
              {latest && (
                <div className="grid grid-cols-3 gap-2 mt-2">
                  <MiniMetric label="BMI" value={Number(latest.bmi).toFixed(1)} />
                  <MiniMetric label="BMR" value={`${latest.bmr} kcal`} />
                  <MiniMetric label="Mỡ nội tạng" value={`Cấp ${latest.visceralFat}`} />
                </div>
              )}

              {latest && oldest && latest.id !== oldest.id && (
                <p className="text-[11px] text-slate-400 text-center mt-2">
                  So với lần đo đầu tiên ({oldest.date})
                </p>
              )}
              {records.length <= 1 && (
                <p className="text-[11px] text-slate-400 text-center mt-2">
                  Chưa đủ dữ liệu để so sánh — hãy thêm ít nhất 2 lần đo.
                </p>
              )}
            </div>

            {/* ---------- Biểu đồ / Lịch sử ---------- */}
            {records.length === 0 ? (
              <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-8 text-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="w-12 h-12 mx-auto mb-3 text-slate-300"
                >
                  <line x1="18" y1="20" x2="18" y2="10" />
                  <line x1="12" y1="20" x2="12" y2="4" />
                  <line x1="6" y1="20" x2="6" y2="14" />
                </svg>
                <p className="text-sm font-bold text-slate-700">Chưa có bản ghi InBody</p>
                <p className="text-xs text-slate-500 mt-1">
                  Nhấn nút + để thêm lần đo đầu tiên cho {selectedClient.name}.
                </p>
              </div>
            ) : (
              <>
                <TrendChart recordsAsc={recordsAsc} />

                <div className="flex items-center justify-between">
                  <h2 className="text-sm font-bold text-slate-900">Lịch sử đo InBody</h2>
                  <span className="inline-flex items-center justify-center text-center text-[11px] font-semibold px-2 py-0.5 rounded-full bg-white border border-slate-200 text-slate-500">
                    {records.length} bản ghi
                  </span>
                </div>

                <div className="space-y-3">
                  {records.map((record, index) => (
                    <HistoryCard
                      key={record.id}
                      record={record}
                      isLatest={index === 0}
                      onDelete={handleDeleteRecord}
                    />
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
    </Page>
  );
}
