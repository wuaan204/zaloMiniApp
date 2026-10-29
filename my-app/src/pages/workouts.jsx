import { Page, Text, Button, Input, Select, useNavigate, Avatar } from "zmp-ui";
import React, { useState, useEffect, useRef } from "react";
import { BackButton, SearchIcon } from "../components/icons";
import { useAppContext, today, tomorrow } from "../context/AppContext";
import { saveScroll, restoreScroll } from "../utils/scroll";

// ============================================
// Cấu trúc file: (1) Hàm hỗ trợ + dữ liệu mẫu, (2) State, (3) Handlers, (4) Giao diện
// Danh sách buổi tập nằm trong src/context/AppContext.jsx
// ============================================

// Các hàm hỗ trợ (helpers)
function formatDateLabel(dateStr) {
  const date = new Date(dateStr);
  const todayDate = new Date(today);
  const tomorrowDate = new Date(tomorrow);

  if (dateStr === today) return "Hôm nay";
  if (dateStr === tomorrow) return "Ngày mai";

  return date.toLocaleDateString("vi-VN", { weekday: "short", day: "2-digit", month: "2-digit" });
}

function getStatusStyle(status) {
  switch (status) {
    case "Đã hoàn thành":
      return { bg: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400", dot: "bg-green-500" };
    case "Sắp tới":
      return { bg: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400", dot: "bg-blue-500" };
    case "Cần nhắc lịch":
      return { bg: "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400", dot: "bg-amber-500" };
    case "Đã dời lịch":
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

// ============================================
// Session Card Component
// ============================================
function SessionCard({ session, onClick, onComplete, onRemindDone }) {
  const statusStyle = getStatusStyle(session.status);
  const isUpcoming = session.status === "Sắp tới" || session.status === "Cần nhắc lịch";
  const showActions = isUpcoming && (session.status === "Sắp tới" || session.status === "Cần nhắc lịch");

  return (
    <div
      className="bg-white rounded-xl border border-slate-300 shadow-sm p-4 cursor-pointer hover:bg-slate-50 dark:bg-slate-800 dark:border-slate-700 dark:hover:bg-slate-700 transition-colors"
      onClick={(e) => {
        if (!e.target.closest('button')) onClick(session);
      }}
    >
      <div className="flex items-start gap-3">
        <Avatar size="medium" src={`https://i.pravatar.cc/150?u=${session.id}`} alt={session.clientName} />
        <div className="flex-1 min-w-0">
          {/* Top row: Time badge + Status */}
          <div className="flex items-center justify-between gap-2 mb-2">
            <div className="inline-flex items-center justify-center px-3 py-1 rounded-lg bg-slate-100 text-slate-700 dark:bg-slate-700 dark:text-slate-300 text-xs font-semibold flex-shrink-0">
              {session.time}
            </div>
            <span className={`justify-center text-center inline-flex items-center px-2.5 py-1 text-xs font-medium rounded-full ${statusStyle.bg} flex-shrink-0`}>
              {session.status}
            </span>
          </div>

          {/* Client Name & Phone */}
          <div className="flex flex-col items-start gap-1 mb-2">
            <Text.Title size="medium" className="font-semibold text-gray-900 dark:text-white truncate">{session.clientName}</Text.Title>
            <Text className="text-xs text-slate-500 dark:text-slate-400">{session.phone}</Text>
          </div>

          {/* Colored Pill Boxes: Focus, Progress, Date — strict grid-cols-3, never wraps */}
          <div className="grid grid-cols-3 gap-2 w-full mt-3">
            <div className={`flex flex-col items-center justify-center text-center p-2 rounded-xl min-w-0 ${getFocusPillStyle()}`}>
              <span className="text-[10px] font-semibold uppercase opacity-75 leading-tight mb-0.5">NỘI DUNG</span>
              <span className="text-xs font-bold leading-snug line-clamp-2 break-words w-full">{session.focus}</span>
            </div>
            <div className={`flex flex-col items-center justify-center text-center p-2 rounded-xl min-w-0 ${getProgressPillStyle()}`}>
              <span className="text-[10px] font-semibold uppercase opacity-75 leading-tight mb-0.5">TIẾN ĐỘ</span>
              <span className="text-xs font-bold leading-snug line-clamp-2 break-words w-full">{session.sessionNumber}</span>
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
              <Text className="text-xs text-gray-500 dark:text-gray-400 line-clamp-2">
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
  const { addSession } = useAppContext();
  const clients = workoutClients;

  // Scroll ref riêng biệt cho màn hình này
  const scrollRef = useRef(null);

  // Màn hình thêm buổi tập luôn bắt đầu từ đầu trang (scrollTop = 0)
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = 0;
    }
  }, []);

  // Dữ liệu đang nhập trong form
  const [formData, setFormData] = useState({
    clientId: "",
    date: today,
    time: "18:00 - 19:00",
    focus: "Thân trên - Ngực & Tay sau",
    sessionNumber: 1,
    status: "Sắp tới",
    notes: "",
  });

  // Danh sách lựa chọn cho ô Nội dung tập và Trạng thái
  const focuses = [
    "Thân trên - Ngực & Tay sau",
    "Thân trên - Lưng & Vai",
    "Thân trên - Vai & Tay trước",
    "Chân & Mông",
    "Chân - Squat & Deadlift",
    "Chân - Lunge & Step up",
    "Full Body - HIIT",
    "Cardio & Core",
    "Cardio - Interval Running",
    "Core & Mobility",
  ];

  const statuses = ["Sắp tới", "Cần nhắc lịch", "Đã dời lịch"];

  // Mặc định chọn học viên đầu tiên trong danh sách
  useEffect(() => {
    if (clients.length > 0) {
      setFormData(prev => ({ ...prev, clientId: clients[0].id }));
    }
  }, [clients]);

  // Bấm "Tạo buổi tập": lưu vào Context rồi quay lại trang trước (hiệu ứng trượt ngược)
  const handleSubmit = (e) => {
    e.preventDefault();
    const client = clients.find(c => String(c.id) === String(formData.clientId));
    if (!client) return;

    const notesArray = formData.notes && formData.notes.trim() ? [{
      id: Date.now(),
      time: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }),
      text: formData.notes.trim()
    }] : [];

    addSession({
      ...formData,
      clientName: client.name,
      phone: client.phone,
      notes: notesArray,
    });
    navigate(-1);
  };

  return (
    <Page ref={scrollRef} className="p-4 pb-28 space-y-4 bg-slate-100 dark:bg-slate-900">
      {/* Header — safe-area-inset-top keeps title below status bar; pr-24 clears Zalo capsule */}
      <div
        className="flex items-center gap-3 pb-3 border-b border-gray-200 dark:border-gray-700 sticky top-0 bg-slate-100 dark:bg-slate-900 z-30 pr-24"
        style={{ paddingTop: 'max(env(safe-area-inset-top, 44px), 44px)' }}
      >
        <BackButton onClick={() => navigate(-1)} />
        <Text.Title size="xLarge" className="font-bold text-gray-900 dark:text-white">Thêm buổi tập mới</Text.Title>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Client Select */}
        <div>
          <Text className="text-sm text-gray-500 dark:text-gray-400 mb-1 block">Học viên <span className="text-red-500">*</span></Text>
          <Select value={formData.clientId} onChange={e => setFormData({...formData, clientId: e.target.value})} className="w-full">
            {clients.map(c => (
              <option key={c.id} value={c.id}>{c.name} - {c.phone}</option>
            ))}
          </Select>
        </div>

        {/* Date & Time */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <Text className="text-sm text-gray-500 dark:text-gray-400 mb-1 block">Ngày tập <span className="text-red-500">*</span></Text>
            <Input
              type="date"
              value={formData.date}
              onChange={e => setFormData({...formData, date: e.target.value})}
              className="w-full"
            />
          </div>
          <div>
            <Text className="text-sm text-gray-500 dark:text-gray-400 mb-1 block">Khung giờ <span className="text-red-500">*</span></Text>
            <Input
              type="text"
              value={formData.time}
              onChange={e => setFormData({...formData, time: e.target.value})}
              placeholder="18:00 - 19:00"
              className="w-full"
            />
          </div>
        </div>

        {/* Focus */}
        <div>
          <Text className="text-sm text-gray-500 dark:text-gray-400 mb-1 block">Nội dung tập <span className="text-red-500">*</span></Text>
          <Select value={formData.focus} onChange={e => setFormData({...formData, focus: e.target.value})} className="w-full">
            {focuses.map(f => <option key={f} value={f}>{f}</option>)}
          </Select>
        </div>

        {/* Session Number & Status */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <Text className="text-sm text-gray-500 dark:text-gray-400 mb-1 block">Số buổi (VD: 9/24) <span className="text-red-500">*</span></Text>
            <Input
              type="number"
              value={formData.sessionNumber}
              onChange={e => setFormData({...formData, sessionNumber: parseInt(e.target.value) || 1})}
              min="1"
              className="w-full"
            />
          </div>
          <div>
            <Text className="text-sm text-gray-500 dark:text-gray-400 mb-1 block">Trạng thái</Text>
            <Select value={formData.status} onChange={e => setFormData({...formData, status: e.target.value})} className="w-full">
              {statuses.map(s => <option key={s} value={s}>{s}</option>)}
            </Select>
          </div>
        </div>

        {/* Notes */}
        <div>
          <Text className="text-sm text-gray-500 dark:text-gray-400 mb-1 block">Ghi chú</Text>
          <textarea
            value={formData.notes}
            onChange={e => setFormData({...formData, notes: e.target.value})}
            rows={3}
            className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
            placeholder="Ghi chú thêm về buổi tập..."
          />
        </div>

        {/* Submit Buttons */}
        <div className="flex justify-end gap-2 pt-2">
          <Button className="inline-flex items-center justify-center text-center" variant="outline" type="button" onClick={() => navigate(-1)}>Hủy</Button>
          <Button className="inline-flex items-center justify-center text-center" variant="primary" type="submit">Tạo buổi tập</Button>
        </div>
      </form>
    </Page>
  );
}

// ============================================
// Trang chi tiết buổi tập (route "/workout-detail")
// ============================================
export function WorkoutDetailView() {
  const navigate = useNavigate();
  const { selectedSession: session, updateSession: onUpdateSession } = useAppContext();
  const clients = workoutClients;

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
      <Page className="bg-slate-100 dark:bg-slate-900 p-4">
        <BackButton onClick={() => navigate(-1)} />
      </Page>
    );
  }

  const client = clients.find(c => c.id === localSession.clientId) ||
                 clients.find(c => c.name === localSession.clientName);

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
    const updatedNotes = [...localSession.notes, newNote];
    const updated = { ...localSession, notes: updatedNotes };
    setLocalSession(updated);
    onUpdateSession(localSession.id, updated);
    setEditNotes('');
    setSaved(true);
    setTimeout(() => setSaved(false), 1500);
  };

  // Xóa 1 ghi chú của buổi tập
  const handleDeleteNote = (id) => {
    const updatedNotes = localSession.notes.filter(n => n.id !== id);
    const updated = {...localSession, notes: updatedNotes};
    setLocalSession(updated);
    onUpdateSession(localSession.id, updated);
  };

  return (
    <Page ref={scrollRef} className="p-4 pb-28 space-y-4 bg-slate-100 dark:bg-slate-900">
      {/* Header — safe-area-inset-top keeps title below status bar; pr-24 clears Zalo capsule */}
      <div
        className="flex items-center gap-3 pb-3 border-b border-gray-200 dark:border-gray-700 sticky top-0 bg-slate-100 dark:bg-slate-900 z-30 pr-24"
        style={{ paddingTop: 'max(env(safe-area-inset-top, 44px), 44px)' }}
      >
        <BackButton onClick={() => navigate(-1)} />
        <div className="flex-1 min-w-0">
          <Text.Title size="xLarge" className="font-bold text-gray-900 dark:text-white truncate">Chi tiết buổi tập</Text.Title>
          <Text className="text-sm text-gray-500 dark:text-gray-400">{localSession.clientName} • {formatDateLabel(localSession.date)}</Text>
        </div>
      </div>

      {/* Main Info Card */}
      <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-300 dark:border-slate-700 p-4 space-y-4">
        {/* Time & Status */}
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div className="inline-flex items-center justify-center px-3 py-1.5 text-sm font-medium rounded-lg bg-slate-100 text-slate-700 dark:bg-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-600">
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
            <Text.Title size="medium" className="font-semibold text-gray-900 dark:text-white">{localSession.clientName}</Text.Title>
            <Text className="text-xs text-slate-500 dark:text-slate-400">{localSession.phone}</Text>
          </div>
        </div>

        {/* Colored Pill Boxes — strict grid-cols-3, never wraps */}
        <div className="grid grid-cols-3 gap-2 w-full pt-2">
          <div className={`flex flex-col items-center justify-center text-center p-2 rounded-xl min-w-0 ${getFocusPillStyle()}`}>
            <span className="text-[10px] font-semibold uppercase opacity-75 leading-tight mb-0.5">NỘI DUNG</span>
            <span className="text-xs font-bold leading-snug line-clamp-2 break-words w-full">{localSession.focus}</span>
          </div>
          <div className={`flex flex-col items-center justify-center text-center p-2 rounded-xl min-w-0 ${getProgressPillStyle()}`}>
            <span className="text-[10px] font-semibold uppercase opacity-75 leading-tight mb-0.5">TIẾN ĐỘ</span>
            <span className="text-xs font-bold leading-snug line-clamp-2 break-words w-full">{localSession.sessionNumber}</span>
          </div>
          <div className={`flex flex-col items-center justify-center text-center p-2 rounded-xl min-w-0 ${getDatePillStyle()}`}>
            <span className="text-[10px] font-semibold uppercase opacity-75 leading-tight mb-0.5">NGÀY TẬP</span>
            <span className="text-xs font-bold leading-snug line-clamp-2 break-words w-full">{formatDateLabel(localSession.date)}</span>
          </div>
        </div>
      </div>

      {/* Notes Section */}
      <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-300 dark:border-slate-700 p-4 space-y-3">
        <Text.Title size="medium" className="font-bold text-gray-900 dark:text-white">Ghi chú buổi tập</Text.Title>
        {/* Existing notes list */}
        {localSession.notes && localSession.notes.length > 0 && (
          <div className="space-y-2">
            {localSession.notes.slice().reverse().map((note, idx) => (
              <div key={note.id} className="bg-slate-50 dark:bg-slate-900/50 rounded-lg p-3 border border-slate-200 dark:border-slate-700 flex flex-col gap-1">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] opacity-75 uppercase">{note.time}</span>
                  <button onClick={() => handleDeleteNote(note.id)} className="inline-flex items-center justify-center text-center text-xs text-red-500 hover:text-red-700 font-medium px-2 py-0.5 rounded hover:bg-red-50">Xóa</button>
                </div>
                <Text className="text-xs text-gray-700 dark:text-gray-300 whitespace-pre-line">{note.text}</Text>
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
            className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            placeholder="Nhập ghi chú mới cho buổi tập..."
          />
          <div className="flex justify-end gap-2">
            <Button className="inline-flex items-center justify-center text-center" variant="primary" onClick={handleSaveNotes}>Lưu ghi chú mới</Button>
          </div>
          {saved && (
            <Text className="text-xs text-green-600 dark:text-green-400">Đã lưu ghi chú!</Text>
          )}
        </div>
      </div>

      {/* Status Actions for Upcoming Sessions */}
      {(localSession.status === "Sắp tới" || localSession.status === "Cần nhắc lịch") && (
        <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-300 dark:border-slate-700 p-4 space-y-2">
          <Text className="font-medium text-gray-900 dark:text-white">Cập nhật trạng thái</Text>
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
        <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl p-4">
          <div className="flex items-center gap-2 mb-2">
            
            <Text className="font-medium text-green-800 dark:text-green-300">
              {localSession.status === "Đã hoàn thành" ? "Buổi tập đã hoàn thành" : "Buổi tập đã được dời lịch"}
            </Text>
          </div>
          <Text className="text-sm text-green-700 dark:text-green-400">
            Trạng thái này không thể thay đổi. Tạo buổi tập mới nếu cần.
          </Text>
        </div>
      )}
    </Page>
  );
}

// ============================================
// Dữ liệu mẫu: danh sách học viên cho ô chọn khi thêm buổi tập
// (Danh sách buổi tập nằm trong src/context/AppContext.jsx)
// ============================================
const workoutClients = [
  { id: 1, name: "Nguyễn Văn An", phone: "0901 234 567" },
  { id: 2, name: "Trần Thị Bình", phone: "0912 345 678" },
  { id: 3, name: "Lê Văn Cường", phone: "0923 456 789" },
  { id: 4, name: "Phạm Thị Dung", phone: "0934 567 890" },
  { id: 5, name: "Hoàng Văn Em", phone: "0945 678 901" },
  { id: 6, name: "Vũ Thị Phượng", phone: "0956 789 012" },
  { id: 7, name: "Đặng Văn Giang", phone: "0967 890 123" },
  { id: 8, name: "Bùi Thị Hạnh", phone: "0978 901 234" },
  { id: 9, name: "Ngô Văn Khải", phone: "0989 012 345" },
  { id: 10, name: "Dương Thị Lan", phone: "0990 123 456" },
  { id: 11, name: "Phan Văn Minh", phone: "0901 111 222" },
  { id: 12, name: "Võ Thị Nga", phone: "0912 222 333" },
];

// ============================================
// Trang chính: Lịch & Buổi tập (route "/workouts")
// ============================================
export default function WorkoutsPage() {
  const navigate = useNavigate();

  // Lấy danh sách buổi tập và các hàm xử lý từ Context dùng chung
  const { sessions, setSelectedSession, updateSession } = useAppContext();

  // Scroll ref riêng biệt cho danh sách buổi tập
  const scrollRef = useRef(null);

  // ----- (2) STATE -----

  // Từ khóa tìm kiếm và tab bộ lọc đang chọn
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState("all");

  // Khi vào trang: khôi phục vị trí cuộn đã lưu (nếu có)
  useEffect(() => {
    return restoreScroll("scroll_workouts", scrollRef);
  }, []);

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
      (s) => s.clientName.toLowerCase().includes(q) || s.focus.toLowerCase().includes(q)
    );
  }

  // Lọc theo tab bộ lọc đang chọn
  if (activeFilter === "today") {
    filteredSessions = filteredSessions.filter((s) => s.date === today);
  } else if (activeFilter === "remind") {
    filteredSessions = filteredSessions.filter((s) => s.status === "Cần nhắc lịch");
  } else if (activeFilter === "completed") {
    filteredSessions = filteredSessions.filter((s) => s.status === "Đã hoàn thành");
  }

  // Gom các buổi tập theo nhóm ngày: today / tomorrow / past
  const groupedSessions = {};
  filteredSessions.forEach((s) => {
    const group = getDayGroup(s.date);
    if (!groupedSessions[group]) groupedSessions[group] = [];
    groupedSessions[group].push(s);
  });

  // Các tab bộ lọc kèm số lượng buổi tập của từng tab
  const filters = [
    { key: "all", label: "Tất cả", count: sessions.length },
    { key: "today", label: "Hôm nay", count: sessions.filter((s) => s.date === today).length },
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

  // Bấm nút "+ Thêm buổi": lưu vị trí cuộn rồi chuyển sang trang form thêm buổi tập
  const handleOpenAdd = () => {
    saveScroll("scroll_workouts", scrollRef);
    navigate("/workout-add");
  };

  // ----- (4) GIAO DIỆN -----
  return (
    <Page ref={scrollRef} className="bg-slate-100 dark:bg-slate-900 min-h-screen">
      <div>
          {/* Header — safe-area-inset-top keeps title below status bar; pr-24 clears Zalo capsule */}
          <div
            className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-4 pb-3 sticky top-0 z-30 pr-24"
            style={{ paddingTop: 'max(env(safe-area-inset-top, 44px), 44px)' }}
          >
            <div className="flex items-center gap-2">
              <BackButton onClick={() => navigate(-1)} />
              <div className="flex-1 min-w-0">
                <Text.Title size="xLarge" className="font-bold text-gray-900 dark:text-white">Lịch & Buổi tập</Text.Title>
                <Text className="text-sm text-gray-500 dark:text-gray-400">Quản lý buổi tập học viên</Text>
              </div>
            </div>
          </div>

          {/* Search & Filter */}
          <div className="p-4 pb-28 space-y-3">
            {/* Search Input */}
            <div className="flex gap-3">
              <div className="relative flex-1">
                <SearchIcon />
                <input
                  type="search"
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  placeholder="Tìm theo tên học viên hoặc nội dung tập..."
                  className="w-full pl-9 pr-4 h-9 text-sm px-3 py-1.5 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                  <span className="inline-flex items-center justify-center ml-1 min-w-[18px] px-1.5 py-0.5 text-[10px] rounded-full bg-white/30 dark:bg-white/10 text-center font-bold">
                    {f.count}
                  </span>
                </Button>
              ))}
            </div>

            {/* Session List - Grouped by Day */}
            <div className="flex flex-col space-y-6">
              {/* Today */}
              {(groupedSessions.today && groupedSessions.today.length > 0) && (
                <div className="px-4">
                  <div className="flex items-center gap-2 mb-3">
                    <Text.Title size="medium" className="font-bold text-gray-900 dark:text-white">Hôm nay ({groupedSessions.today.length})</Text.Title>
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
                <div className="px-4">
                  <div className="flex items-center gap-2 mb-3">
                    <Text.Title size="medium" className="font-bold text-gray-900 dark:text-white">Ngày mai ({groupedSessions.tomorrow.length})</Text.Title>
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
                <div className="px-4">
                  <div className="flex items-center gap-2 mb-3">
                    <Text.Title size="medium" className="font-bold text-gray-900 dark:text-white">Ngày trước ({groupedSessions.past.length})</Text.Title>
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
                <div className="bg-white rounded-xl shadow-sm p-8 text-center dark:bg-slate-800 dark:border dark:border-slate-700">
                  
                  <Text.Title size="medium" className="font-bold text-gray-900 dark:text-white mb-1">Không tìm thấy buổi tập</Text.Title>
                  <Text className="text-gray-500 dark:text-gray-400">
                    {searchQuery ? "Thử từ khóa khác hoặc xóa bộ lọc" : "Chưa có buổi tập nào. Hãy thêm buổi tập đầu tiên!"}
                  </Text>
                </div>
              )}
            </div>
          </div>
        </div>
    </Page>
  );
}
