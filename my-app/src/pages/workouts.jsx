import { Page, Text, Button, useNavigate, Avatar } from "zmp-ui";
import React, { useState, useEffect, useRef } from "react";
import { BackButton, SearchIcon } from "../components/icons";
import { useAppContext, today, tomorrow, STANDARD_TIME_SLOTS } from "../context/AppContext";
import { saveScroll, restoreScroll } from "../utils/scroll";

// ============================================
// Cấu trúc file: (1) Hàm hỗ trợ + dữ liệu mẫu, (2) State, (3) Handlers, (4) Giao diện
// Danh sách buổi tập nằm trong src/context/AppContext.jsx
// ============================================

// Các hàm hỗ trợ (helpers)
function formatDateLabel(dateStr) {
  if (!dateStr) return "--";
  if (dateStr === today || dateStr === "Hôm nay") return "Hôm nay";
  if (dateStr === tomorrow || dateStr === "Ngày mai") return "Ngày mai";

  const date = new Date(dateStr);
  if (Number.isNaN(date.getTime())) return dateStr;

  return date.toLocaleDateString("vi-VN", { weekday: "short", day: "2-digit", month: "2-digit" });
}

function getStatusStyle(status) {
  switch (status) {
    case "Đã hoàn thành":
      return { bg: "bg-green-100 text-green-800", dot: "bg-green-500" };
    case "Sắp tới":
      return { bg: "bg-blue-100 text-blue-800", dot: "bg-blue-500" };
    case "Cần nhắc lịch":
      return { bg: "bg-amber-100 text-amber-800", dot: "bg-amber-500" };
    case "Đã dời lịch":
      return { bg: "bg-gray-100 text-gray-800", dot: "bg-gray-500" };
    default:
      return { bg: "bg-gray-100 text-gray-800", dot: "bg-gray-500" };
  }
}

function getFocusPillStyle() {
  return "bg-purple-50 text-purple-700 border border-purple-200";
}

function getProgressPillStyle() {
  return "bg-indigo-50 text-indigo-700 border border-indigo-200";
}

function getDatePillStyle() {
  return "bg-teal-50 text-teal-700 border border-teal-200";
}

function getDayGroup(session) {
  if (session.dateLabel === "Hôm nay" || session.date === today) return "today";
  if (session.dateLabel === "Ngày mai" || session.date === tomorrow) return "tomorrow";
  return "past";
}

// ============================================
// Session Card Component
// ============================================
function SessionCard({ session, onClick, onComplete, onRemindDone }) {
  const statusStyle = getStatusStyle(session.status);
  const isUpcoming = session.status === "Sắp tới" || session.status === "Cần nhắc lịch";
  const showActions = isUpcoming && (session.status === "Sắp tới" || session.status === "Cần nhắc lịch");

  return (
    <div
      className="bg-white rounded-xl border border-slate-300 shadow-sm p-4 cursor-pointer hover:bg-slate-50 transition-colors"
      onClick={(e) => {
        if (!e.target.closest('button')) onClick(session);
      }}
    >
      <div className="flex items-start gap-3">
        <Avatar size="medium" src={`https://i.pravatar.cc/150?u=${session.id}`} alt={session.clientName} />
        <div className="flex-1 min-w-0">
          {/* Top row: Time badge + Status */}
          <div className="flex items-center justify-between gap-2 mb-2">
            <div className="inline-flex items-center justify-center px-3 py-1 rounded-lg bg-slate-100 text-slate-700 text-xs font-semibold flex-shrink-0">
              {session.time}
            </div>
            <span className={`justify-center text-center inline-flex items-center px-2.5 py-1 text-xs font-medium rounded-full ${statusStyle.bg} flex-shrink-0`}>
              {session.status}
            </span>
          </div>

          {/* Client Name & Phone */}
          <div className="flex flex-col items-start gap-1 mb-2">
            <Text.Title size="medium" className="font-semibold text-gray-900 truncate">{session.clientName}</Text.Title>
            <Text className="text-xs text-slate-500">{session.phone}</Text>
          </div>

          {/* Colored Pill Boxes: Focus, Progress, Date — strict grid-cols-3, never wraps */}
          <div className="grid grid-cols-3 gap-2 w-full mt-3">
            <div className={`flex flex-col items-center justify-center text-center p-2 rounded-xl min-w-0 ${getFocusPillStyle()}`}>
              <span className="text-[10px] font-semibold uppercase opacity-75 leading-tight mb-0.5">NỘI DUNG</span>
              <span className="text-xs font-bold leading-snug line-clamp-2 break-words w-full">{session.workoutType || session.focus}</span>
            </div>
            <div className={`flex flex-col items-center justify-center text-center p-2 rounded-xl min-w-0 ${getProgressPillStyle()}`}>
              <span className="text-[10px] font-semibold uppercase opacity-75 leading-tight mb-0.5">TIẾN ĐỘ</span>
              <span className="text-xs font-bold leading-snug line-clamp-2 break-words w-full">{session.progressText || session.sessionNumber}</span>
            </div>
            <div className={`flex flex-col items-center justify-center text-center p-2 rounded-xl min-w-0 ${getDatePillStyle()}`}>
              <span className="text-[10px] font-semibold uppercase opacity-75 leading-tight mb-0.5">NGÀY TẬP</span>
              <span className="text-xs font-bold leading-snug line-clamp-2 break-words w-full">{formatDateLabel(session.date)}</span>
            </div>
          </div>

          {/* Quick Action Buttons */}
          {showActions && (
            <div className="flex flex-wrap justify-end gap-2 mt-3">
              {session.status === "Sắp tới" && (
                <Button
                  variant="primary"
                  size="small"
                  className="inline-flex items-center justify-center text-center w-auto px-4 py-1.5 text-xs font-medium rounded-lg"
                  onClick={(e) => { e.stopPropagation(); onComplete(session.id); }}
                >
                  Hoàn thành
                </Button>
              )}
              {(session.status === "Cần nhắc lịch" || session.status === "Sắp tới") && (
                <Button
                  variant="outline"
                  size="small"
                  className="inline-flex items-center justify-center text-center w-auto px-4 py-1.5 text-xs font-medium rounded-lg"
                  onClick={(e) => { e.stopPropagation(); onRemindDone(session.id); }}
                >
                  Đã nhắc lịch
                </Button>
              )}
            </div>
          )}

          {/* Notes preview for completed/rescheduled */}
          {!isUpcoming && session.notes && session.notes.length > 0 && (
            <div className="pt-2">
              <Text className="text-xs text-gray-500 line-clamp-2">
                {session.notes[session.notes.length - 1].time} - {session.notes[session.notes.length - 1].text}
              </Text>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ============================================
// Trang form thêm buổi tập (route "/workout-add")
// ============================================
export function WorkoutAddView() {
  const navigate = useNavigate();
  const {
    clients,
    addSession,
    prefillWorkoutSlot,
    setPrefillWorkoutSlot,
    getSlotAvailability,
  } = useAppContext();

  // Scroll ref riêng biệt cho màn hình này
  const scrollRef = useRef(null);

  // Màn hình thêm buổi tập luôn bắt đầu từ đầu trang (scrollTop = 0)
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = 0;
    }
  }, []);

  // Học viên đang chọn (mặc định lấy học viên đầu tiên trong CRM)
  const [selectedClientId, setSelectedClientId] = useState(() =>
    clients[0] ? String(clients[0].id) : ""
  );

  // Ngày tập + khung giờ lấy từ ca trống PT vừa bấm
  const [dateLabel, setDateLabel] = useState(prefillWorkoutSlot?.dateLabel || "Hôm nay");
  const [timeSlot, setTimeSlot] = useState(prefillWorkoutSlot?.time || STANDARD_TIME_SLOTS[0]);

  // Nội dung buổi tập và ghi chú / bài tập chi tiết
  const [workoutType, setWorkoutType] = useState("");
  const [note, setNote] = useState("");

  // Thông báo lỗi nhỏ khi thiếu dữ liệu
  const [formError, setFormError] = useState("");

  // Gợi ý nội dung buổi tập để PT bấm nhanh, không cần gõ
  const workoutPresets = [
    "Thân trên - Ngực & Tay sau",
    "Thân dưới - Chân & Mông",
    "Lưng - Xô & Tay trước",
    "Cardio & Core giảm mỡ",
    "Full Body tổng hợp",
  ];

  // Nếu danh sách học viên vừa tải xong thì tự chọn học viên đầu tiên
  useEffect(() => {
    if (!selectedClientId && clients.length > 0) {
      setSelectedClientId(String(clients[0].id));
    }
  }, [clients]);

  // Khi PT bấm ca trống ở trang Lịch -> cập nhật lại ngày + giờ trong form
  useEffect(() => {
    if (prefillWorkoutSlot) {
      setDateLabel(prefillWorkoutSlot.dateLabel);
      setTimeSlot(prefillWorkoutSlot.time);
    }
  }, [prefillWorkoutSlot]);

  // 7 khung giờ của ngày đang chọn, kèm trạng thái Còn trống / Đã kín
  const slots = getSlotAvailability(dateLabel);

  // Đổi ngày: nếu khung giờ đang chọn đã kín thì tự chuyển sang ca trống đầu tiên
  const handleChangeDay = (day) => {
    setDateLabel(day);
    const daySlots = getSlotAvailability(day);
    const currentSlot = daySlots.find((slot) => slot.time === timeSlot);
    if (!currentSlot || !currentSlot.isAvailable) {
      const firstFreeSlot = daySlots.find((slot) => slot.isAvailable);
      if (firstFreeSlot) setTimeSlot(firstFreeSlot.time);
    }
  };

  // Lưu buổi tập: kiểm tra dữ liệu -> addSession -> quay lại trang Lịch
  const handleSubmit = (e) => {
    e.preventDefault();

    if (!selectedClientId) {
      setFormError("Vui lòng chọn học viên.");
      return;
    }
    if (!workoutType.trim()) {
      setFormError("Vui lòng chọn hoặc nhập nội dung buổi tập.");
      return;
    }

    // Không cho lưu vào khung giờ đã có người đặt
    const selectedSlot = slots.find((slot) => slot.time === timeSlot);
    if (!selectedSlot || !selectedSlot.isAvailable) {
      setFormError("Khung giờ này đã kín. Vui lòng chọn khung giờ còn trống.");
      return;
    }

    setFormError("");
    addSession({
      clientId: selectedClientId,
      dateLabel: dateLabel,
      time: timeSlot,
      workoutType: workoutType.trim(),
      note: note.trim(),
    });

    // Giữ lại ngày + giờ vừa lưu để bảng Ca trống quay về đúng ngày đó
    setPrefillWorkoutSlot({ dateLabel: dateLabel, time: timeSlot });
    sessionStorage.setItem("nav_direction", "back");
    navigate(-1);
  };

  return (
    <Page className="h-full w-full overflow-hidden bg-slate-100">
      <div ref={scrollRef} className="app-page-scroll h-full w-full overflow-y-auto overflow-x-hidden p-3 sm:p-4 md:p-8 pb-28 space-y-4 bg-slate-100">
      {/* Header — safe-area-inset-top keeps title below status bar; pr-24 clears Zalo capsule */}
      <div
        className="flex items-center gap-3 pb-3 border-b border-gray-200 sticky top-0 bg-slate-100 z-30 pr-24"
        style={{ paddingTop: 'max(env(safe-area-inset-top, 0px), 36px)' }}
      >
        <BackButton onClick={() => navigate(-1)} />
        <Text.Title size="xLarge" className="font-bold text-gray-900">Thêm buổi tập mới</Text.Title>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* 1) Chọn học viên */}
        <div className="bg-white rounded-xl border border-slate-200 p-4 space-y-2">
          <label className="text-sm font-semibold text-slate-700 block">
            Học viên <span className="text-red-500">*</span>
          </label>
          <select
            value={selectedClientId}
            onChange={(e) => setSelectedClientId(e.target.value)}
            className="w-full h-10 rounded-lg border border-gray-300 bg-white text-gray-900 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {clients.map((c) => (
              <option key={c.id} value={String(c.id)}>
                {c.name} - {c.phone}
              </option>
            ))}
          </select>
        </div>

        {/* 2) Chọn ngày tập */}
        <div className="bg-white rounded-xl border border-slate-200 p-4 space-y-2">
          <label className="text-sm font-semibold text-slate-700 block">
            Ngày tập <span className="text-red-500">*</span>
          </label>
          <div className="flex gap-2">
            {["Hôm nay", "Ngày mai"].map((day) => (
              <button
                key={day}
                type="button"
                onClick={() => handleChangeDay(day)}
                className={`flex-1 flex items-center justify-center text-center px-3 py-2 rounded-lg text-sm font-semibold border ${
                  dateLabel === day
                    ? "bg-blue-600 text-white border-blue-600"
                    : "bg-white text-slate-600 border-slate-300"
                }`}
              >
                {day}
              </button>
            ))}
          </div>
        </div>

        {/* 3) Chọn khung giờ còn trống */}
        <div className="bg-white rounded-xl border border-slate-200 p-4 space-y-2">
          <label className="text-sm font-semibold text-slate-700 block">
            Khung giờ <span className="text-red-500">*</span>
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {slots.map((slot) => {
              const isSelected = slot.time === timeSlot;
              return (
                <button
                  key={slot.time}
                  type="button"
                  disabled={!slot.isAvailable}
                  onClick={() => {
                    if (slot.isAvailable) setTimeSlot(slot.time);
                  }}
                  className={`rounded-lg p-2 text-xs font-semibold flex flex-col items-center justify-center text-center border ${
                    !slot.isAvailable
                      ? "bg-slate-100 border-slate-200 text-slate-400 cursor-not-allowed"
                      : isSelected
                        ? "bg-blue-600 border-blue-600 text-white"
                        : "bg-emerald-50 border-emerald-300 text-emerald-800 active:bg-emerald-100"
                  }`}
                >
                  <span className="font-bold">{slot.time}</span>
                  <span className="text-[10px] mt-0.5">
                    {!slot.isAvailable
                      ? "Đã kín (" + slot.bookedBy + ")"
                      : isSelected
                        ? "Đang chọn"
                        : "Còn trống"}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* 4) Chọn nội dung buổi tập: pill gợi ý + ô nhập tự do */}
        <div className="bg-white rounded-xl border border-slate-200 p-4 space-y-3">
          <label className="text-sm font-semibold text-slate-700 block">
            Nội dung buổi tập <span className="text-red-500">*</span>
          </label>
          <div className="flex flex-wrap gap-2">
            {workoutPresets.map((preset) => (
              <button
                key={preset}
                type="button"
                onClick={() => setWorkoutType(preset)}
                className={`flex items-center justify-center text-center px-3 py-1.5 rounded-full text-xs font-semibold border ${
                  workoutType === preset
                    ? "bg-blue-600 text-white border-blue-600"
                    : "bg-blue-50 text-blue-700 border-blue-200"
                }`}
              >
                {preset}
              </button>
            ))}
          </div>
          <input
            type="text"
            value={workoutType}
            onChange={(e) => setWorkoutType(e.target.value)}
            placeholder="Hoặc nhập nội dung khác..."
            className="w-full h-10 rounded-lg border border-gray-300 bg-white text-gray-900 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* 5) Ghi chú / bài tập chi tiết */}
        <div className="bg-white rounded-xl border border-slate-200 p-4 space-y-2">
          <label className="text-sm font-semibold text-slate-700 block">
            Ghi chú / Bài tập chi tiết
          </label>
          <textarea
            value={note}
            onChange={(e) => setNote(e.target.value)}
            rows={3}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 bg-white text-gray-900"
            placeholder="Ví dụ: Khởi động 10 phút, bench press 4x8..."
          />
        </div>

        {/* Thông báo lỗi khi thiếu dữ liệu */}
        {formError && (
          <div className="bg-red-50 border border-red-200 text-red-700 text-xs font-medium rounded-lg p-3 text-center">
            {formError}
          </div>
        )}

        {/* Nút Hủy / Lưu buổi tập */}
        <div className="flex justify-end gap-2 pt-2">
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
            Lưu buổi tập
          </button>
        </div>
      </form>
      </div>
    </Page>
  );
}

// ============================================
// Trang chi tiết buổi tập (route "/workout-detail")
// ============================================
export function WorkoutDetailView() {
  const navigate = useNavigate();
  const {
    selectedSession: session,
    updateSession: onUpdateSession,
    clients,
  } = useAppContext();

  // Scroll ref riêng biệt cho màn hình này
  const scrollRef = useRef(null);

  // Màn hình chi tiết buổi tập luôn bắt đầu từ đầu trang (scrollTop = 0)
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = 0;
    }
  }, []);

  // Bản sao buổi tập đang xem, nội dung ghi chú đang nhập và cờ báo "đã lưu"
  const [localSession, setLocalSession] = useState(session);
  const [editNotes, setEditNotes] = useState('');
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    setLocalSession(session);
    setEditNotes('');
  }, [session]);

  // Chưa chọn buổi tập (ví dụ tải lại trang): hiện nút quay lại
  if (!localSession) {
    return (
      <Page className="bg-slate-100 p-4">
        <BackButton onClick={() => navigate(-1)} />
      </Page>
    );
  }

  const client =
    clients.find((c) => String(c.id) === String(localSession.clientId)) ||
    clients.find((c) => c.name === localSession.clientName);

  const statusStyle = getStatusStyle(localSession.status);

  // Đổi trạng thái buổi tập
  const handleStatusChange = (newStatus) => {
    const updated = { ...localSession, status: newStatus };
    setLocalSession(updated);
    onUpdateSession(localSession.id, updated);
  };

  // Lưu ghi chú mới cho buổi tập
  const handleSaveNotes = () => {
    if (!editNotes.trim()) return;
    const newNote = {
      id: Date.now(),
      time: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }),
      text: editNotes.trim()
    };
    const updatedNotes = [...(localSession.notes || []), newNote];
    const updated = { ...localSession, notes: updatedNotes };
    setLocalSession(updated);
    onUpdateSession(localSession.id, updated);
    setEditNotes('');
    setSaved(true);
    setTimeout(() => setSaved(false), 1500);
  };

  // Xóa 1 ghi chú của buổi tập
  const handleDeleteNote = (id) => {
    const updatedNotes = (localSession.notes || []).filter(n => n.id !== id);
    const updated = {...localSession, notes: updatedNotes};
    setLocalSession(updated);
    onUpdateSession(localSession.id, updated);
  };

  return (
    <Page className="h-full w-full overflow-hidden bg-slate-100">
      <div ref={scrollRef} className="app-page-scroll h-full w-full overflow-y-auto overflow-x-hidden p-3 sm:p-4 md:p-8 pb-28 space-y-4 bg-slate-100">
      {/* Header — safe-area-inset-top keeps title below status bar; pr-24 clears Zalo capsule */}
      <div
        className="flex items-center gap-3 pb-3 border-b border-gray-200 sticky top-0 bg-slate-100 z-30 pr-24"
        style={{ paddingTop: 'max(env(safe-area-inset-top, 0px), 36px)' }}
      >
        <BackButton onClick={() => navigate(-1)} />
        <div className="flex-1 min-w-0">
          <Text.Title size="xLarge" className="font-bold text-gray-900 truncate">Chi tiết buổi tập</Text.Title>
          <Text className="text-sm text-gray-500">{localSession.clientName} • {formatDateLabel(localSession.date)}</Text>
        </div>
      </div>

      {/* Main Info Card */}
      <div className="bg-white rounded-xl border border-slate-300 p-4 space-y-4">
        {/* Time & Status */}
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div className="inline-flex items-center justify-center px-3 py-1.5 text-sm font-medium rounded-lg bg-slate-100 text-slate-700 border border-slate-200">
            {localSession.time}
          </div>
          <span className={`justify-center text-center inline-flex items-center px-3 py-1.5 text-sm font-medium rounded-full ${statusStyle.bg}`}>
            {localSession.status}
          </span>
        </div>

        {/* Client Info */}
        <div className="flex items-center gap-3 pt-2">
          <Avatar size="large" src={client?.avatar || `https://i.pravatar.cc/150?u=${localSession.clientId || localSession.id}`} alt={localSession.clientName} />
          <div className="flex-1 min-w-0">
            <Text.Title size="medium" className="font-semibold text-gray-900">{localSession.clientName}</Text.Title>
            <Text className="text-xs text-slate-500">{localSession.phone}</Text>
          </div>
        </div>

        {/* Colored Pill Boxes — strict grid-cols-3, never wraps */}
        <div className="grid grid-cols-3 gap-2 w-full pt-2">
          <div className={`flex flex-col items-center justify-center text-center p-2 rounded-xl min-w-0 ${getFocusPillStyle()}`}>
            <span className="text-[10px] font-semibold uppercase opacity-75 leading-tight mb-0.5">NỘI DUNG</span>
            <span className="text-xs font-bold leading-snug line-clamp-2 break-words w-full">{localSession.workoutType || localSession.focus}</span>
          </div>
          <div className={`flex flex-col items-center justify-center text-center p-2 rounded-xl min-w-0 ${getProgressPillStyle()}`}>
            <span className="text-[10px] font-semibold uppercase opacity-75 leading-tight mb-0.5">TIẾN ĐỘ</span>
            <span className="text-xs font-bold leading-snug line-clamp-2 break-words w-full">{localSession.progressText || localSession.sessionNumber}</span>
          </div>
          <div className={`flex flex-col items-center justify-center text-center p-2 rounded-xl min-w-0 ${getDatePillStyle()}`}>
            <span className="text-[10px] font-semibold uppercase opacity-75 leading-tight mb-0.5">NGÀY TẬP</span>
            <span className="text-xs font-bold leading-snug line-clamp-2 break-words w-full">{formatDateLabel(localSession.date)}</span>
          </div>
        </div>
      </div>

      {/* Bài tập dự kiến của buổi tập (lấy từ trường exercises) */}
      {localSession.exercises && localSession.exercises.length > 0 && (
        <div className="bg-white rounded-xl border border-slate-300 p-4 space-y-2">
          <Text.Title size="medium" className="font-bold text-gray-900">Bài tập dự kiến</Text.Title>
          <div className="space-y-1.5">
            {localSession.exercises.map((exercise, index) => (
              <div key={index} className="flex items-start gap-2">
                <span className="shrink-0 w-5 h-5 rounded-full bg-blue-50 text-blue-700 text-[10px] font-bold flex items-center justify-center text-center">
                  {index + 1}
                </span>
                <Text className="text-sm text-gray-700 leading-snug">{exercise}</Text>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Notes Section */}
      <div className="bg-white rounded-xl border border-slate-300 p-4 space-y-3">
        <Text.Title size="medium" className="font-bold text-gray-900">Ghi chú buổi tập</Text.Title>
        {/* Existing notes list */}
        {localSession.notes && localSession.notes.length > 0 && (
          <div className="space-y-2">
            {localSession.notes.slice().reverse().map((note, idx) => (
              <div key={note.id} className="bg-slate-50 rounded-lg p-3 border border-slate-200 flex flex-col gap-1">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] opacity-75 uppercase">{note.time}</span>
                  <button onClick={() => handleDeleteNote(note.id)} className="inline-flex items-center justify-center text-center text-xs text-red-500 hover:text-red-700 font-medium px-2 py-0.5 rounded hover:bg-red-50">Xóa</button>
                </div>
                <Text className="text-xs text-gray-700 whitespace-pre-line">{note.text}</Text>
              </div>
            ))}
          </div>
        )}
        {/* Add new note */}
        <div className="space-y-2">
          <textarea
            value={editNotes}
            onChange={e => setEditNotes(e.target.value)}
            rows={3}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 bg-white text-gray-900"
            placeholder="Nhập ghi chú mới cho buổi tập..."
          />
          <div className="flex justify-end gap-2">
            <Button className="inline-flex items-center justify-center text-center" variant="primary" onClick={handleSaveNotes}>Lưu ghi chú mới</Button>
          </div>
          {saved && (
            <Text className="text-xs text-green-600">Đã lưu ghi chú!</Text>
          )}
        </div>
      </div>

      {/* Status Actions for Upcoming Sessions */}
      {(localSession.status === "Sắp tới" || localSession.status === "Cần nhắc lịch") && (
        <div className="bg-white rounded-xl border border-slate-300 p-4 space-y-2">
          <Text className="font-medium text-gray-900">Cập nhật trạng thái</Text>
          <div className="flex flex-wrap justify-end gap-2">
            <Button
              variant={localSession.status === "Đã hoàn thành" ? "primary" : "outline"}
              size="small"
              className="inline-flex items-center justify-center text-center w-auto px-4 py-1.5 text-xs font-medium rounded-lg"
              onClick={() => handleStatusChange("Đã hoàn thành")}
            >
              Đã hoàn thành
            </Button>
            <Button
              variant={localSession.status === "Cần nhắc lịch" ? "primary" : "outline"}
              size="small"
              className="inline-flex items-center justify-center text-center w-auto px-4 py-1.5 text-xs font-medium rounded-lg"
              onClick={() => handleStatusChange("Cần nhắc lịch")}
            >
              Cần nhắc lịch
            </Button>
            <Button
              variant={localSession.status === "Đã dời lịch" ? "primary" : "outline"}
              size="small"
              className="inline-flex items-center justify-center text-center w-auto px-4 py-1.5 text-xs font-medium rounded-lg"
              onClick={() => handleStatusChange("Đã dời lịch")}
            >
              Đã dời lịch
            </Button>
            <Button
              variant={localSession.status === "Sắp tới" ? "primary" : "outline"}
              size="small"
              className="inline-flex items-center justify-center text-center w-auto px-4 py-1.5 text-xs font-medium rounded-lg"
              onClick={() => handleStatusChange("Sắp tới")}
            >
              Sắp tới
            </Button>
          </div>
        </div>
      )}

      {/* Completed/Rescheduled Info */}
      {(localSession.status === "Đã hoàn thành" || localSession.status === "Đã dời lịch") && (
        <div className="bg-green-50 border border-green-200 rounded-xl p-4">
          <div className="flex items-center gap-2 mb-2">
            
            <Text className="font-medium text-green-800">
              {localSession.status === "Đã hoàn thành" ? "Buổi tập đã hoàn thành" : "Buổi tập đã được dời lịch"}
            </Text>
          </div>
          <Text className="text-sm text-green-700">
            Trạng thái này không thể thay đổi. Tạo buổi tập mới nếu cần.
          </Text>
        </div>
      )}
      </div>
    </Page>
  );
}

// ============================================
// Trang chính: Lịch & Buổi tập (route "/workouts")
// ============================================
export default function WorkoutsPage() {
  const navigate = useNavigate();

  // Lấy danh sách buổi tập + hàm kiểm tra khung giờ từ Context dùng chung
  const {
    sessions,
    setSelectedSession,
    updateSession,
    getSlotAvailability,
    prefillWorkoutSlot,
    setPrefillWorkoutSlot,
  } = useAppContext();

  // Scroll ref riêng biệt cho danh sách buổi tập
  const scrollRef = useRef(null);

  // ----- (2) STATE -----

  // Từ khóa tìm kiếm và tab bộ lọc đang chọn
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState("all");

  // Bảng kiểm tra ca trống / ca kín: ngày đang xem và trạng thái thu gọn
  const [selectedMatrixDay, setSelectedMatrixDay] = useState(
    prefillWorkoutSlot?.dateLabel || "Hôm nay"
  );
  const [showSlotBoard, setShowSlotBoard] = useState(true);

  // Danh sách 7 khung giờ của ngày đang chọn
  const slotBoard = getSlotAvailability(selectedMatrixDay);

  // Khi vào trang: khôi phục vị trí cuộn đã lưu (nếu có)
  useEffect(() => {
    return restoreScroll("scroll_workouts", scrollRef);
  }, []);

  // Sau khi lưu buổi tập, quay lại đúng ngày vừa đặt trên bảng Ca trống
  useEffect(() => {
    if (prefillWorkoutSlot && prefillWorkoutSlot.dateLabel) {
      setSelectedMatrixDay(prefillWorkoutSlot.dateLabel);
    }
  }, [prefillWorkoutSlot]);

  // ----- Dữ liệu tính toán từ state -----

  // Sắp xếp buổi tập theo ngày rồi theo giờ
  let filteredSessions = [...sessions].sort((a, b) => {
    if (a.date !== b.date) return a.date.localeCompare(b.date);
    return a.time.localeCompare(b.time);
  });

  // Lọc theo từ khóa tìm kiếm (tên học viên hoặc nội dung tập)
  if (searchQuery.trim()) {
    const q = searchQuery.toLowerCase().trim();
    filteredSessions = filteredSessions.filter(
      (s) =>
        (s.clientName || "").toLowerCase().includes(q) ||
        (s.workoutType || s.focus || "").toLowerCase().includes(q)
    );
  }

  // Lọc theo tab bộ lọc đang chọn
  if (activeFilter === "today") {
    filteredSessions = filteredSessions.filter(
      (s) => s.date === today || s.dateLabel === "Hôm nay"
    );
  } else if (activeFilter === "remind") {
    filteredSessions = filteredSessions.filter((s) => s.status === "Cần nhắc lịch");
  } else if (activeFilter === "completed") {
    filteredSessions = filteredSessions.filter((s) => s.status === "Đã hoàn thành");
  }

  // Gom các buổi tập theo nhóm ngày: today / tomorrow / past
  const groupedSessions = {};
  filteredSessions.forEach((s) => {
    const group = getDayGroup(s);
    if (!groupedSessions[group]) groupedSessions[group] = [];
    groupedSessions[group].push(s);
  });

  // Các tab bộ lọc kèm số lượng buổi tập của từng tab
  const filters = [
    { key: "all", label: "Tất cả", count: sessions.length },
    { key: "today", label: "Hôm nay", count: sessions.filter((s) => s.date === today || s.dateLabel === "Hôm nay").length },
    { key: "remind", label: "Cần nhắc lịch", count: sessions.filter((s) => s.status === "Cần nhắc lịch").length },
    { key: "completed", label: "Đã hoàn thành", count: sessions.filter((s) => s.status === "Đã hoàn thành").length },
  ];

  // ----- (3) HANDLERS -----

  // Đánh dấu buổi tập đã hoàn thành
  const handleComplete = (id) => {
    updateSession(id, { status: "Đã hoàn thành" });
  };

  // Đánh dấu đã nhắc lịch xong (chuyển về trạng thái "Sắp tới")
  const handleRemindDone = (id) => {
    updateSession(id, { status: "Sắp tới" });
  };

  // Bấm vào 1 buổi tập: lưu vị trí cuộn, lưu buổi đã chọn vào Context rồi chuyển sang trang chi tiết
  const handleOpenDetail = (session) => {
    saveScroll("scroll_workouts", scrollRef);
    setSelectedSession(session);
    navigate("/workout-detail");
  };

  // Bấm nút "+ Thêm buổi": mở form với khung giờ chuẩn đầu tiên của Hôm nay
  const handleOpenAdd = () => {
    setPrefillWorkoutSlot({
      dateLabel: "Hôm nay",
      time: STANDARD_TIME_SLOTS[0],
    });
    saveScroll("scroll_workouts", scrollRef);
    sessionStorage.setItem("nav_direction", "forward");
    navigate("/workout-add");
  };

  // Bấm 1 ca trống: mở form thêm buổi tập với đúng ngày + giờ đã chọn
  const handleOpenAddFromSlot = (timeSlot) => {
    setPrefillWorkoutSlot({
      dateLabel: selectedMatrixDay,
      time: timeSlot,
    });
    saveScroll("scroll_workouts", scrollRef);
    sessionStorage.setItem("nav_direction", "forward");
    navigate("/workout-add");
  };

  // ----- (4) GIAO DIỆN -----
  return (
    <Page className="h-full w-full overflow-hidden bg-slate-100">
      <div ref={scrollRef} className="app-page-scroll h-full w-full overflow-y-auto overflow-x-hidden pb-28 bg-slate-100">
      <div>
          {/* Header — safe-area-inset-top keeps title below status bar; pr-24 clears Zalo capsule */}
          <div
            className="bg-white border-b border-gray-200 px-3 sm:px-4 md:px-8 pb-3 sticky top-0 z-30 pr-24"
            style={{ paddingTop: 'max(env(safe-area-inset-top, 0px), 36px)' }}
          >
            <div className="flex items-center gap-2">
              <BackButton onClick={() => navigate(-1)} />
              <div className="flex-1 min-w-0">
                <Text.Title size="xLarge" className="font-bold text-gray-900">Lịch & Buổi tập</Text.Title>
                <Text className="text-sm text-gray-500">Quản lý buổi tập học viên</Text>
              </div>
            </div>
          </div>

          {/* Search & Filter */}
          <div className="px-3 sm:px-4 md:px-8 pt-4 pb-28 space-y-3">
            {/* Search Input */}
            <div className="flex gap-3">
              <div className="relative flex-1">
                <SearchIcon />
                <input
                  type="search"
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  placeholder="Tìm theo tên học viên hoặc nội dung tập..."
                  className="w-full pl-9 pr-4 h-9 text-sm px-3 py-1.5 rounded-lg border border-gray-300 bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <Button className="inline-flex items-center justify-center text-center" variant="primary" size="small" onClick={handleOpenAdd}>
                + Thêm buổi
              </Button>
            </div>

            {/* Filter Tabs — scrollbar hidden for clean mobile look */}
            <div className="flex gap-2 overflow-x-auto pb-1 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
              {filters.map(f => (
                <Button
                  key={f.key}
                  variant={activeFilter === f.key ? "primary" : "outline"}
                  size="small"
                  className="justify-center text-center inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap flex-shrink-0"
                  onClick={() => setActiveFilter(f.key)}
                >
                  {f.label}
                  <span className="inline-flex items-center justify-center ml-1 min-w-[18px] px-1.5 py-0.5 text-[10px] rounded-full bg-white/30 text-center font-bold">
                    {f.count}
                  </span>
                </Button>
              ))}
            </div>

            {/* Bảng kiểm tra nhanh Ca Trống / Ca Kín trong ngày */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-3">
              {/* Thanh tiêu đề: chạm để thu gọn / mở rộng bảng */}
              <button
                type="button"
                onClick={() => setShowSlotBoard(!showSlotBoard)}
                className="w-full flex items-center justify-between gap-2 text-left"
              >
                <span className="min-w-0">
                  <span className="block text-sm font-bold text-slate-900">
                    Trạng thái Khung giờ PT (Hôm nay &amp; Ngày mai)
                  </span>
                  <span className="block text-[11px] text-slate-500 mt-0.5">
                    Chạm vào ca trống để xếp lịch ngay
                  </span>
                </span>
                <span className="shrink-0 inline-flex items-center justify-center text-center px-2 py-0.5 rounded-full bg-slate-100 border border-slate-200 text-[10px] font-semibold text-slate-600">
                  {showSlotBoard ? "Thu gọn" : "Mở rộng"}
                </span>
              </button>

              {showSlotBoard && (
                <>
                  {/* Pills chọn Hôm nay / Ngày mai */}
                  <div className="flex gap-2 mt-3">
                    {["Hôm nay", "Ngày mai"].map((day) => (
                      <button
                        key={day}
                        type="button"
                        onClick={() => setSelectedMatrixDay(day)}
                        className={`flex-1 flex items-center justify-center text-center px-3 py-1.5 rounded-full text-xs font-semibold border ${
                          selectedMatrixDay === day
                            ? "bg-blue-600 text-white border-blue-600"
                            : "bg-white text-slate-600 border-slate-300"
                        }`}
                      >
                        {day}
                      </button>
                    ))}
                  </div>

                  {/* 7 khung giờ: xanh dương = đã kín, xanh lá nét đứt = còn trống */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2 mt-2">
                    {slotBoard.map((slot) =>
                      slot.isAvailable ? (
                        <button
                          key={slot.time}
                          type="button"
                          onClick={() => handleOpenAddFromSlot(slot.time)}
                          className="bg-emerald-50/60 border border-dashed border-emerald-400 text-emerald-800 rounded-lg p-2 text-xs font-semibold flex flex-col items-center justify-center text-center"
                        >
                          <span className="font-bold">{slot.time}</span>
                          <span className="text-[10px] mt-0.5">Ca trống (+ Xếp lịch)</span>
                        </button>
                      ) : (
                        <div
                          key={slot.time}
                          className="bg-blue-50 border border-blue-200 text-blue-800 rounded-lg p-2 text-xs flex flex-col items-center justify-center text-center"
                        >
                          <span className="font-bold">{slot.time}</span>
                          <span className="text-[10px] mt-0.5 line-clamp-2">{slot.bookedBy}</span>
                        </div>
                      )
                    )}
                  </div>
                </>
              )}
            </div>

            {/* Session List - Grouped by Day */}
            <div className="flex flex-col space-y-6">
              {/* Today */}
              {(groupedSessions.today && groupedSessions.today.length > 0) && (
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <Text.Title size="medium" className="font-bold text-gray-900">Hôm nay ({groupedSessions.today.length})</Text.Title>
                  </div>
                  <div className="flex flex-col space-y-4">
                    {groupedSessions.today.map(s => (
                      <SessionCard
                        key={s.id}
                        session={s}
                        onClick={handleOpenDetail}
                        onComplete={handleComplete}
                        onRemindDone={handleRemindDone}
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* Tomorrow */}
              {(groupedSessions.tomorrow && groupedSessions.tomorrow.length > 0) && (
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <Text.Title size="medium" className="font-bold text-gray-900">Ngày mai ({groupedSessions.tomorrow.length})</Text.Title>
                  </div>
                  <div className="flex flex-col space-y-4">
                    {groupedSessions.tomorrow.map(s => (
                      <SessionCard
                        key={s.id}
                        session={s}
                        onClick={handleOpenDetail}
                        onComplete={handleComplete}
                        onRemindDone={handleRemindDone}
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* Past Days */}
              {(groupedSessions.past && groupedSessions.past.length > 0) && (
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <Text.Title size="medium" className="font-bold text-gray-900">Ngày trước ({groupedSessions.past.length})</Text.Title>
                  </div>
                  <div className="flex flex-col space-y-4">
                    {groupedSessions.past.map(s => (
                      <SessionCard
                        key={s.id}
                        session={s}
                        onClick={handleOpenDetail}
                        onComplete={handleComplete}
                        onRemindDone={handleRemindDone}
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* Empty State */}
              {filteredSessions.length === 0 && (
                <div className="bg-white rounded-xl shadow-sm p-8 text-center">
                  
                  <Text.Title size="medium" className="font-bold text-gray-900 mb-1">Không tìm thấy buổi tập</Text.Title>
                  <Text className="text-gray-500">
                    {searchQuery ? "Thử từ khóa khác hoặc xóa bộ lọc" : "Chưa có buổi tập nào. Hãy thêm buổi tập đầu tiên!"}
                  </Text>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </Page>
  );
}
