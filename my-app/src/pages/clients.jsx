import { Page, Text, Button, Avatar, Input, Select, useNavigate } from "zmp-ui";
import React, { useState, useEffect, useRef } from "react";
import { BackButton, SearchIcon } from "../components/icons";
import { useAppContext } from "../context/AppContext";
import { saveScroll, restoreScroll } from "../utils/scroll";

// ============================================
// Dữ liệu học viên nằm trong src/context/AppContext.jsx
// Cấu trúc file: (1) Hàm hỗ trợ, (2) State, (3) Handlers, (4) Giao diện
// ============================================

// Các hàm hỗ trợ (helpers)
function getDaysSince(dateStr) {
  const today = new Date("2026-10-14");
  const lastDate = new Date(dateStr);
  return Math.ceil((today - lastDate) / (1000 * 60 * 60 * 24));
}
function getStatusBadge(status) {
  switch (status) {
    case "Đang tập": return { variant: "success", text: "Đang tập" };
    case "Tạm dừng": return { variant: "warning", text: "Tạm dừng" };
    case "Sắp hết gói": return { variant: "danger", text: "Sắp hết gói" };
    default: return { variant: "default", text: status };
  }
}
function formatDate(dateStr) {
  return new Date(dateStr).toLocaleDateString("vi-VN");
}
function pillClasses(type, daysSince) {
  // type: 'goal' | 'package' | 'contact'
  if (type === 'goal') return "bg-blue-50 text-blue-700 border border-blue-200 dark:bg-blue-900/20 dark:text-blue-300 dark:border-blue-800";
  if (type === 'package') return "bg-indigo-50 text-indigo-700 border border-indigo-200 dark:bg-indigo-900/20 dark:text-indigo-300 dark:border-indigo-800";
  // contact
  if (daysSince >= 7) return "bg-red-50 text-red-700 border border-red-200 dark:bg-red-900/20 dark:text-red-300 dark:border-red-800";
  return "bg-emerald-50 text-emerald-700 border border-emerald-200 dark:bg-emerald-900/20 dark:text-emerald-300 dark:border-emerald-800";
}

// ============================================
// Client Card Component
// ============================================
function ClientCard({ client, onClick }) {
  const daysSince = getDaysSince(client.lastInteractionDate);
  const progress = Math.round((client.completedSessions / client.totalSessions) * 100);
  const statusInfo = getStatusBadge(client.status);
  const isInactive = daysSince >= 7;

  return (
    <div
      className="bg-white rounded-xl border border-slate-300 shadow-sm p-4 cursor-pointer hover:bg-slate-50 dark:bg-slate-800 dark:border-slate-700 dark:hover:bg-slate-700 transition-colors"
      onClick={() => onClick(client)}
    >
      <div className="flex items-start gap-3">
        <Avatar size="large" src={client.avatar} alt={client.name} />
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2 mb-2">
            <div className="flex-1 min-w-0">
              <Text.Title size="medium" className="font-semibold text-gray-900 dark:text-white truncate">{client.name}</Text.Title>
              <Text className="text-sm text-gray-500 dark:text-gray-400">{client.phone}</Text>
            </div>
            <span className={`justify-center text-center inline-flex items-center px-2.5 py-0.5 text-xs font-medium rounded-full ${
              statusInfo.variant === 'success' ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' :
              statusInfo.variant === 'warning' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400' :
              statusInfo.variant === 'danger' ? 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400' :
              'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
            }`}>
              {statusInfo.text}
            </span>
          </div>

          {/* Pills row — 3-col grid, text centered in every pill */}
          <div className="grid grid-cols-3 gap-2 mb-2">
            <span className={`flex items-center justify-center text-center px-2 py-1.5 rounded-full text-xs font-semibold w-full min-w-0 ${pillClasses('goal')}`}>
              {client.goal}
            </span>
            <span className={`flex items-center justify-center text-center px-2 py-1.5 rounded-full text-xs font-semibold w-full min-w-0 ${pillClasses('package')}`}>
              {client.packageName}
            </span>
            <span className={`flex items-center justify-center text-center px-2 py-1.5 rounded-full text-xs font-semibold w-full min-w-0 leading-tight ${pillClasses('contact', daysSince)}`}>
              {isInactive ? `Cần theo dõi` : `${daysSince}ng trước`}
            </span>
          </div>

          {/* Progress Bar */}
          <div className="mb-2">
            <div className="flex justify-between text-xs mb-1">
              <Text className="text-gray-500 dark:text-gray-400">Tiến độ</Text>
              <Text className="font-medium text-gray-900 dark:text-white">{client.completedSessions}/{client.totalSessions} buổi</Text>
            </div>
            <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
              <div className="h-full bg-blue-600 rounded-full transition-all duration-300" style={{ width: `${progress}%` }} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ============================================
// Trang form thêm học viên (route "/client-add")
// ============================================
export function ClientAddView() {
  const navigate = useNavigate();
  const { addClient } = useAppContext();

  // Scroll ref riêng biệt cho màn hình này
  const scrollRef = useRef(null);

  // Màn hình thêm mới luôn bắt đầu từ đầu trang (scrollTop = 0)
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = 0;
    }
  }, []);

  // Dữ liệu đang nhập trong form
  const [formData, setFormData] = useState({
    name: "", phone: "", goal: "Giảm mỡ", packageName: "Gói 24 buổi", totalSessions: 24, notes: "",
  });
  // Danh sách lựa chọn cho ô Mục tiêu và Gói tập
  const goals = ["Giảm mỡ","Tăng cơ","Duy trì form","Tăng sức bền","Phục hồi chức năng"];
  const packages = ["Gói 12 buổi","Gói 24 buổi","Gói 36 buổi","Gói 48 buổi"];
  // Bấm "Thêm học viên": kiểm tra tên + SĐT, lưu vào Context rồi quay lại trang trước (hiệu ứng trượt ngược)
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.phone.trim()) return;
    addClient({ ...formData });
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
        <div className="flex-1 min-w-0">
          <Text.Title size="large" className="font-bold text-gray-900 dark:text-white truncate">Thêm học viên mới</Text.Title>
          <Text className="text-sm text-gray-500 dark:text-gray-400">Điền thông tin cơ bản của học viên</Text>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-4 space-y-4">
        <div><Text className="text-sm text-gray-500 dark:text-gray-400 mb-1 block">Họ tên <span className="text-red-500">*</span></Text>
          <Input value={formData.name} onChange={e=>setFormData({...formData,name:e.target.value})} placeholder="Nguyễn Văn A" className="w-full" /></div>
        <div><Text className="text-sm text-gray-500 dark:text-gray-400 mb-1 block">Số điện thoại <span className="text-red-500">*</span></Text>
          <Input type="tel" value={formData.phone} onChange={e=>setFormData({...formData,phone:e.target.value})} placeholder="0901 234 567" className="w-full" /></div>
        <div><Text className="text-sm text-gray-500 dark:text-gray-400 mb-1 block">Mục tiêu tập</Text>
          <Select value={formData.goal} onChange={e=>setFormData({...formData,goal:e.target.value})} className="w-full">{goals.map(g=><option key={g} value={g}>{g}</option>)}</Select></div>
        <div><Text className="text-sm text-gray-500 dark:text-gray-400 mb-1 block">Gói tập</Text>
          <Select value={formData.packageName} onChange={e=>setFormData({...formData,packageName:e.target.value})} className="w-full">{packages.map(p=><option key={p} value={p}>{p}</option>)}</Select></div>
        <div><Text className="text-sm text-gray-500 dark:text-gray-400 mb-1 block">Tổng số buổi</Text>
          <Input type="number" value={formData.totalSessions} onChange={e=>setFormData({...formData,totalSessions:parseInt(e.target.value)||0})} min="1" className="w-full" /></div>
        <div><Text className="text-sm text-gray-500 dark:text-gray-400 mb-1 block">Ghi chú</Text>
          <textarea value={formData.notes} onChange={e=>setFormData({...formData,notes:e.target.value})} rows={3} className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 bg-white dark:bg-gray-800 text-gray-900 dark:text-white" placeholder="Ghi chú thêm về học viên..." /></div>
        <div className="flex justify-end gap-2 pt-2"><Button className="inline-flex items-center justify-center text-center" variant="outline" type="button" onClick={() => navigate(-1)}>Hủy</Button><Button className="inline-flex items-center justify-center text-center" variant="primary" type="submit">Thêm học viên</Button></div>
      </form>
    </Page>
  );
}

// ============================================
// Trang chi tiết học viên (route "/client-detail")
// ============================================
export function ClientDetailView() {
  const navigate = useNavigate();
  const { selectedClient: client, updateClient, addNote } = useAppContext();

  // Scroll ref riêng biệt cho màn hình này
  const scrollRef = useRef(null);

  // Màn hình chi tiết luôn bắt đầu từ đầu trang (scrollTop = 0)
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = 0;
    }
  }, []);

  // Nội dung ghi chú đang nhập và trạng thái bật/tắt form ghi chú
  const [newInteraction, setNewInteraction] = useState({ content: "", nextAction: "" });
  const [showAddInteraction, setShowAddInteraction] = useState(false);
  // Lưu ghi chú tương tác mới vào lịch sử của học viên
  const handleAddInteraction = (e) => {
    e.preventDefault(); if (!newInteraction.content.trim()) return;
    const today = "2026-10-14";
    const newLog = { date: today, content: newInteraction.content, nextAction: newInteraction.nextAction || "Chưa có kế hoạch tiếp theo" };
    addNote(client.id, newLog);
    setNewInteraction({ content: "", nextAction: "" }); setShowAddInteraction(false);
  };
  // Bấm nút "+": tăng số buổi đã tập thêm 1 (tối đa bằng tổng số buổi)
  const handleAddSession = () => {
    const next = Math.min(client.completedSessions + 1, client.totalSessions);
    updateClient(client.id, { completedSessions: next });
  };

  // Chưa chọn học viên (ví dụ tải lại trang): hiện nút quay lại
  if (!client) {
    return (
      <Page className="bg-slate-100 dark:bg-slate-900 p-4">
        <BackButton onClick={() => navigate(-1)} />
      </Page>
    );
  }
  const daysSince = getDaysSince(client.lastInteractionDate);
  const progress = Math.round((client.completedSessions / client.totalSessions) * 100);
  const statusInfo = getStatusBadge(client.status);

  return (
    <Page ref={scrollRef} className="p-4 pb-28 space-y-4 bg-slate-100 dark:bg-slate-900">
      {/* Header inside page — safe-area-inset-top keeps title below status bar; pr-24 clears Zalo capsule */}
      <div
        className="flex items-center gap-3 pb-3 border-b border-gray-200 dark:border-gray-700 sticky top-0 bg-slate-100 dark:bg-slate-900 z-30 px-0 pr-24"
        style={{ paddingTop: 'max(env(safe-area-inset-top, 44px), 44px)' }}
      >
        <BackButton onClick={() => navigate(-1)} />
        <Avatar size="xlarge" src={client.avatar} alt={client.name} />
        <div className="flex-1 min-w-0">
          <Text.Title size="large" className="font-bold text-gray-900 dark:text-white truncate">{client.name}</Text.Title>
          <Text className="text-gray-500 dark:text-gray-400">{client.phone}</Text>
        </div>
        <span className={`justify-center text-center inline-flex items-center px-3 py-1 text-sm font-medium rounded-full ${
          statusInfo.variant==='success'?'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400':
          statusInfo.variant==='warning'?'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400':
          statusInfo.variant==='danger'?'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400':
          'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'}`}>
          {statusInfo.text}
        </span>
      </div>

      {/* Summary boxes — strict 3-column grid, never wraps */}
      <div className="grid grid-cols-3 gap-2 w-full mt-3">
        <div className={`flex flex-col items-center justify-center text-center p-2 rounded-xl min-w-0 ${pillClasses('goal')} border`}>
          <span className="text-[10px] font-semibold uppercase opacity-75 leading-tight mb-0.5">Mục tiêu</span>
          <span className="text-xs font-bold leading-snug line-clamp-2 break-words w-full">{client.goal}</span>
        </div>
        <div className={`flex flex-col items-center justify-center text-center p-2 rounded-xl min-w-0 ${pillClasses('package')} border`}>
          <span className="text-[10px] font-semibold uppercase opacity-75 leading-tight mb-0.5">Gói tập</span>
          <span className="text-xs font-bold leading-snug line-clamp-2 break-words w-full">{client.packageName}</span>
        </div>
        <div className={`flex flex-col items-center justify-center text-center p-2 rounded-xl min-w-0 ${pillClasses('contact', daysSince)} border`}>
          <span className="text-[10px] font-semibold uppercase opacity-75 leading-tight mb-0.5">Liên hệ</span>
          <span className="text-xs font-bold leading-snug line-clamp-2 break-words w-full">{daysSince} ngày trước</span>
        </div>
      </div>

      {/* Progress Section */}
      <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-4">
        <div className="flex items-center justify-between mb-2">
          <Text className="font-medium text-gray-900 dark:text-white">Tiến độ buổi tập</Text>
          <div className="flex items-center gap-2">
            <Text className="font-semibold text-gray-900 dark:text-white">{client.completedSessions}/{client.totalSessions}</Text>
            <Button size="small" variant="primary" className="text-center w-8 h-8 p-0 flex items-center justify-center rounded-full" onClick={handleAddSession} disabled={client.completedSessions>=client.totalSessions}>
              <span className="text-white text-xl font-bold leading-none">+</span>
            </Button>
          </div>
        </div>
        <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
          <div className="h-full bg-blue-600 rounded-full transition-all duration-300" style={{width:`${progress}%`}} />
        </div>
        <Text className="text-xs text-gray-500 dark:text-gray-400 mt-1 text-right">{progress}% hoàn thành</Text>
      </div>

      {/* Notes */}
      {client.notes && (
        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-4">
          <div className="flex items-center gap-1 mb-1"><Text className="text-sm font-medium text-blue-800 dark:text-blue-300">Ghi chú chung</Text></div>
          <Text className="text-sm text-blue-700 dark:text-blue-400">{client.notes}</Text>
        </div>
      )}

      {/* Interaction Logs */}
      <div className="flex items-center justify-between">
        <Text.Title size="medium" className="font-bold text-gray-900 dark:text-white">Nhật ký tương tác</Text.Title>
        <Button size="small" variant="primary" className="text-center w-8 h-8 p-0 flex items-center justify-center rounded-full" onClick={()=>setShowAddInteraction(!showAddInteraction)}>
          <span className="text-white text-xl font-bold leading-none">{showAddInteraction?'×':'+'}</span>
        </Button>
      </div>

      {showAddInteraction && (
        <form onSubmit={handleAddInteraction} className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-4 space-y-3">
          <div><Text className="text-sm text-gray-500 dark:text-gray-400 mb-1 block">Nội dung trao đổi <span className="text-red-500">*</span></Text>
            <textarea value={newInteraction.content} onChange={e=>setNewInteraction({...newInteraction,content:e.target.value})} rows={3} className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white" placeholder="Ví dụ: Đã trao đổi về menu ăn, khách hàng phản hồi khỏe..." required /></div>
          <div><Text className="text-sm text-gray-500 dark:text-gray-400 mb-1 block">Việc cần làm tiếp theo</Text>
            <textarea value={newInteraction.nextAction} onChange={e=>setNewInteraction({...newInteraction,nextAction:e.target.value})} rows={2} className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white" placeholder="Ví dụ: Gửi file menu qua Zalo, đặt lịch buổi tới..." /></div>
          <div className="flex justify-end gap-2"><Button className="inline-flex items-center justify-center text-center" variant="outline" type="button" onClick={()=>setShowAddInteraction(false)}>Hủy</Button><Button className="inline-flex items-center justify-center text-center" variant="primary" type="submit">Lưu ghi chú</Button></div>
        </form>
      )}

      <div className="space-y-3">
        {client.interactionLogs.length===0 ? (
          <div className="text-center py-6 text-gray-500 dark:text-gray-400"><Text>Chưa có ghi chú tương tác</Text></div>
        ) : (
          client.interactionLogs.map((log,i)=>(
            <div key={i} className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-4">
              <div className="flex items-start justify-between gap-2 mb-2">
                <Text className="text-xs text-gray-500 dark:text-gray-400 font-medium">{formatDate(log.date)}</Text>
                <Text className="text-xs px-2 py-0.5 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded">Tương tác</Text>
              </div>
              <Text className="text-sm text-gray-900 dark:text-white mb-2">{log.content}</Text>
              {log.nextAction && (
                <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-2">
                  <div className="flex items-center gap-1 text-xs text-yellow-800 dark:text-yellow-300 mb-1"><Text className="font-medium">Việc cần làm:</Text></div>
                  <Text className="text-sm text-yellow-700 dark:text-yellow-400">{log.nextAction}</Text>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </Page>
  );
}

// ============================================
// Trang chính: Danh sách học viên (route "/clients")
// ============================================
export default function ClientsPage() {
  const navigate = useNavigate();

  // Lấy danh sách học viên và hàm chọn học viên từ Context dùng chung
  const { clients, setSelectedClient } = useAppContext();

  // Scroll ref riêng biệt cho danh sách học viên
  const scrollRef = useRef(null);

  // ----- (2) STATE -----

  // Từ khóa tìm kiếm và tab bộ lọc đang chọn
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState("all");

  // Khi vào trang: khôi phục vị trí cuộn đã lưu (nếu có)
  useEffect(() => {
    return restoreScroll("scroll_clients", scrollRef);
  }, []);

  // ----- Dữ liệu tính toán từ state -----

  // Lọc danh sách theo từ khóa tìm kiếm
  let filteredClients = clients;
  if (searchQuery.trim()) {
    const q = searchQuery.toLowerCase().trim();
    const qPhone = q.replace(/\s/g, "");
    filteredClients = filteredClients.filter(
      (c) => c.name.toLowerCase().includes(q) || c.phone.replace(/\s/g, "").includes(qPhone)
    );
  }

  // Lọc tiếp theo tab bộ lọc đang chọn
  if (activeFilter === "active") {
    filteredClients = filteredClients.filter((c) => c.status === "Đang tập");
  } else if (activeFilter === "inactive") {
    filteredClients = filteredClients.filter((c) => getDaysSince(c.lastInteractionDate) >= 7);
  } else if (activeFilter === "expiring") {
    filteredClients = filteredClients.filter((c) => c.status === "Sắp hết gói");
  }

  // Các tab bộ lọc kèm số lượng học viên của từng tab
  const filters = [
    { key: "all", label: "Tất cả", count: clients.length },
    { key: "active", label: "Đang tập", count: clients.filter((c) => c.status === "Đang tập").length },
    { key: "inactive", label: "Cần theo dõi", count: clients.filter((c) => getDaysSince(c.lastInteractionDate) >= 7).length },
    { key: "expiring", label: "Sắp hết gói", count: clients.filter((c) => c.status === "Sắp hết gói").length },
  ];

  // ----- (3) HANDLERS -----

  // Bấm vào 1 học viên: lưu vị trí cuộn, lưu học viên đã chọn vào Context rồi chuyển sang trang chi tiết
  const handleOpenDetail = (client) => {
    saveScroll("scroll_clients", scrollRef);
    setSelectedClient(client);
    navigate("/client-detail");
  };

  // Bấm nút "+ Thêm HV": lưu vị trí cuộn rồi chuyển sang trang form thêm học viên
  const handleOpenAdd = () => {
    saveScroll("scroll_clients", scrollRef);
    navigate("/client-add");
  };

  // ----- (4) GIAO DIỆN -----
  return (
    <Page ref={scrollRef} className="bg-slate-100 dark:bg-slate-900 min-h-screen">
      {/* Thanh tiêu đề: chừa chỗ cho thanh trạng thái và nút capsule của Zalo */}
      <div
        className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-4 pb-3 sticky top-0 z-30 pr-24"
        style={{ paddingTop: "max(env(safe-area-inset-top, 44px), 44px)" }}
      >
        <div className="flex items-center gap-2">
          <BackButton onClick={() => navigate(-1)} />
          <div className="flex-1 min-w-0">
            <Text.Title size="xLarge" className="font-bold text-gray-900 dark:text-white">Học viên</Text.Title>
            <Text className="text-sm text-gray-500 dark:text-gray-400">Quản lý học viên</Text>
          </div>
        </div>
      </div>

      <div className="p-4 pb-28 space-y-3">
        {/* Ô tìm kiếm và nút thêm học viên */}
        <div className="flex gap-3">
          <div className="relative flex-1">
            <SearchIcon />
            <input type="search" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="Tìm theo tên hoặc SĐT..." className="w-full pl-9 pr-4 h-9 text-sm px-3 py-1.5 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
          <Button className="inline-flex items-center justify-center text-center" variant="primary" size="small" onClick={handleOpenAdd}>
            + Thêm HV
          </Button>
        </div>

        {/* Các tab bộ lọc (ẩn thanh cuộn ngang cho gọn) */}
        <div className="flex gap-2 overflow-x-auto pb-1 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
          {filters.map((f) => (
            <Button key={f.key} variant={activeFilter === f.key ? "primary" : "outline"} size="small" className="justify-center text-center inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap flex-shrink-0" onClick={() => setActiveFilter(f.key)}>
              {f.label}
              <span className="inline-flex items-center justify-center ml-1 min-w-[18px] px-1.5 py-0.5 text-[10px] rounded-full bg-white/30 dark:bg-white/10 text-center font-bold">{f.count}</span>
            </Button>
          ))}
        </div>

        {/* Danh sách học viên (hoặc thông báo rỗng) */}
        <div className="flex flex-col space-y-4 px-4">
          {filteredClients.length > 0 ? (
            filteredClients.map((c) => <ClientCard key={c.id} client={c} onClick={handleOpenDetail} />)
          ) : (
            <div className="bg-white rounded-xl shadow-sm p-8 text-center dark:bg-slate-800 dark:border dark:border-slate-700">
              <Text.Title size="medium" className="font-bold text-gray-900 dark:text-white mb-1">Không tìm thấy học viên</Text.Title>
              <Text className="text-gray-500 dark:text-gray-400">{searchQuery ? "Thử từ khóa khác hoặc xóa bộ lọc" : "Chưa có học viên nào. Hãy thêm học viên đầu tiên!"}</Text>
            </div>
          )}
        </div>
      </div>
    </Page>
  );
}
