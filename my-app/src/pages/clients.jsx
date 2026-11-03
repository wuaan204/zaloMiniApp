import { Page, Text, Button, Avatar, Input, Select, useNavigate } from "zmp-ui";
import React, { useState, useEffect, useRef } from "react";
import { BackButton, SearchIcon } from "../components/icons";
import { useAppContext } from "../context/AppContext";
import { saveScroll, restoreScroll } from "../utils/scroll";

// ============================================
// Dữ liệu học viên nằm trong src/context/AppContext.jsx
// Cấu trúc file: (1) Hàm hỗ trợ, (2) Thẻ học viên, (3) Form thêm học viên,
// (4) Trang chi tiết, (5) Trang danh sách + phễu lọc ưu tiên + giả lập Zalo
// ============================================

// ----- (1) HÀM HỖ TRỢ -----

// Màu badge theo trạng thái học viên
function getStatusBadge(status) {
  switch (status) {
    case "Đang tập": return { variant: "success", text: "Đang tập" };
    case "Tạm nghỉ": return { variant: "warning", text: "Tạm nghỉ" };
    case "Hết hạn": return { variant: "danger", text: "Hết hạn" };
    default: return { variant: "default", text: status };
  }
}

// Ngày dạng 12/10/2026
function formatDate(dateStr) {
  return new Date(dateStr).toLocaleDateString("vi-VN");
}

// Nhãn "bao lâu chưa tương tác" dùng chung cho thẻ và trang chi tiết
function inactiveLabel(days) {
  if (days === 0) return "Hôm nay";
  return `${days} ngày trước`;
}

// Màu các pill: mục tiêu (xanh dương), gói tập (tím), liên hệ (đỏ nếu >= 7 ngày)
function pillClasses(type, inactiveDays) {
  if (type === "goal") return "bg-blue-50 text-blue-700 border border-blue-200";
  if (type === "package") return "bg-indigo-50 text-indigo-700 border border-indigo-200";
  if (inactiveDays >= 7) return "bg-red-50 text-red-700 border border-red-200";
  return "bg-emerald-50 text-emerald-700 border border-emerald-200";
}

// 3 tin nhắn mẫu để bấm nhanh trong bộ giả lập webhook
const quickMessages = [
  "Xin đổi lịch tập tối nay",
  "Gửi ảnh thực đơn bữa trưa",
  "Hỏi gia hạn gói tập mới",
];

// ============================================
// (2) THẺ HỌC VIÊN
// ============================================
function ClientCard({ client, onClick, onContactZalo }) {
  // Tiến độ gói tập + trạng thái + số buổi còn lại
  const progress = Math.round((client.packageUsed / client.packageTotal) * 100);
  const statusInfo = getStatusBadge(client.status);
  const remainingSessions = client.packageTotal - client.packageUsed;
  // Số điện thoại chỉ giữ chữ số để tạo link zalo.me chính xác
  const cleanPhone = String(client.phone || "").replace(/\D/g, "");

  return (
    <div
      className={`rounded-xl border shadow-sm p-4 cursor-pointer transition-colors ${
        client.hasUnreadZalo
          ? "border-blue-400 bg-blue-50/30"
          : "border-slate-300 bg-white hover:bg-slate-50"
      }`}
      onClick={() => onClick(client)}
    >
      {/* Dòng đầu: avatar, họ tên, số điện thoại, trạng thái */}
      <div className="flex items-start gap-3">
        <Avatar size="large" src={client.avatar} alt={client.name} />
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <div className="flex-1 min-w-0">
              <Text.Title size="medium" className="font-semibold text-gray-900 truncate">{client.name}</Text.Title>
              <Text className="text-sm text-gray-500">{client.phone}</Text>
            </div>
            <span className={`inline-flex items-center justify-center text-center px-2.5 py-0.5 text-xs font-medium rounded-full flex-shrink-0 ${
              statusInfo.variant === "success" ? "bg-green-100 text-green-800" :
              statusInfo.variant === "warning" ? "bg-yellow-100 text-yellow-800" :
              statusInfo.variant === "danger" ? "bg-red-100 text-red-800" :
              "bg-gray-100 text-gray-800"
            }`}>
              {statusInfo.text}
            </span>
          </div>
        </div>
      </div>

      {/* Khách vừa nhắn Zalo: badge cảnh báo + nội dung tin nhắn mới nhất */}
      {client.hasUnreadZalo && (
        <div className="mt-3">
          <span className="flex items-center justify-center text-center w-full px-2 py-1 rounded-full bg-blue-600 text-white text-xs font-semibold">
            Tin nhắn Zalo mới
          </span>
          <div className="mt-2 bg-white border border-blue-200 rounded-lg p-2">
            <Text className="text-sm text-gray-900 leading-snug">{client.lastZaloMessage}</Text>
            <Text className="text-xs text-gray-500 mt-1">{client.lastZaloTime}</Text>
          </div>
        </div>
      )}

      {/* 3 pill: mục tiêu, gói tập, số ngày chưa tương tác */}
      <div className="grid grid-cols-3 gap-2 mt-3 mb-2">
        <span className={`flex items-center justify-center text-center px-2 py-1.5 rounded-full text-xs font-semibold w-full min-w-0 ${pillClasses("goal")}`}>
          {client.goal}
        </span>
        <span className={`flex items-center justify-center text-center px-2 py-1.5 rounded-full text-xs font-semibold w-full min-w-0 ${pillClasses("package")}`}>
          Gói {client.packageTotal} buổi
        </span>
        <span className={`flex items-center justify-center text-center px-2 py-1.5 rounded-full text-xs font-semibold w-full min-w-0 leading-tight ${pillClasses("contact", client.inactiveDays)}`}>
          {client.inactiveDays >= 7 ? "Cần theo dõi" : inactiveLabel(client.inactiveDays)}
        </span>
      </div>

      {/* Tiến độ gói tập */}
      <div className="mb-2">
        <div className="flex justify-between text-xs mb-1">
          <Text className="text-gray-500">Tiến độ</Text>
          <Text className={`font-medium ${remainingSessions <= 3 ? "text-red-600" : "text-gray-900"}`}>
            {client.packageUsed}/{client.packageTotal} buổi
          </Text>
        </div>
        <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
          <div className="h-full bg-blue-600 rounded-full transition-all duration-300" style={{ width: `${progress}%` }} />
        </div>
      </div>

      {/* Nút Zalo: dùng thẻ <a> thật để iOS/Zalo WebView tin tưởng mở link khi người dùng chạm.
          KHÔNG gọi e.preventDefault() để Universal Link của Zalo được kích hoạt */}
      <a
        href={"https://zalo.me/" + cleanPhone}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-2 w-full flex items-center justify-center text-center py-2 rounded-lg bg-blue-600 text-white text-xs font-semibold no-underline active:bg-blue-700"
        onClick={(event) => {
          // Ngăn sự kiện click lan lên thẻ cha (tránh mở trang chi tiết)
          event.stopPropagation();
          // Chỉ cập nhật trạng thái đã liên hệ; link vẫn tự mở nhờ thẻ <a>
          onContactZalo(client.id, client.phone);
        }}
      >
        {client.hasUnreadZalo ? "Mở Zalo trả lời" : "Nhắn tin Zalo"}
      </a>
    </div>
  );
}

// ============================================
// (3) Trang form thêm học viên (route "/client-add")
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
    name: "", phone: "", goal: "Giảm mỡ", packageTotal: 24, note: "",
  });

  // Danh sách lựa chọn cho ô Mục tiêu và Gói tập
  const goals = ["Giảm mỡ", "Tăng cơ", "Duy trì vóc dáng", "Phục hồi chấn thương"];
  const packages = [12, 24, 36, 48];

  // Bấm "Thêm học viên": kiểm tra tên + SĐT, lưu vào Context rồi quay lại trang trước
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.phone.trim()) return;
    addClient({ ...formData });
    navigate(-1);
  };

  return (
    <Page ref={scrollRef} className="p-4 pb-28 space-y-4 bg-slate-100">
      {/* Header — safe-area-inset-top keeps title below status bar; pr-24 clears Zalo capsule */}
      <div
        className="flex items-center gap-3 pb-3 border-b border-gray-200 sticky top-0 bg-slate-100 z-30 pr-24"
        style={{ paddingTop: "max(env(safe-area-inset-top, 44px), 44px)" }}
      >
        <BackButton onClick={() => navigate(-1)} />
        <div className="flex-1 min-w-0">
          <Text.Title size="large" className="font-bold text-gray-900 truncate">Thêm học viên mới</Text.Title>
          <Text className="text-sm text-gray-500">Điền thông tin cơ bản của học viên</Text>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-xl border border-slate-200 p-4 space-y-4">
        <div>
          <Text className="text-sm text-gray-500 mb-1 block">Họ tên <span className="text-red-500">*</span></Text>
          <Input value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} placeholder="Nguyễn Văn A" className="w-full" />
        </div>
        <div>
          <Text className="text-sm text-gray-500 mb-1 block">Số điện thoại <span className="text-red-500">*</span></Text>
          <Input type="tel" value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} placeholder="0901 234 567" className="w-full" />
        </div>
        <div>
          <Text className="text-sm text-gray-500 mb-1 block">Mục tiêu tập</Text>
          <Select value={formData.goal} onChange={(e) => setFormData({ ...formData, goal: e.target.value })} className="w-full">
            {goals.map((g) => <option key={g} value={g}>{g}</option>)}
          </Select>
        </div>
        <div>
          <Text className="text-sm text-gray-500 mb-1 block">Gói tập</Text>
          <Select value={String(formData.packageTotal)} onChange={(e) => setFormData({ ...formData, packageTotal: Number(e.target.value) })} className="w-full">
            {packages.map((p) => <option key={p} value={p}>Gói {p} buổi</option>)}
          </Select>
        </div>
        <div>
          <Text className="text-sm text-gray-500 mb-1 block">Ghi chú</Text>
          <textarea value={formData.note} onChange={(e) => setFormData({ ...formData, note: e.target.value })} rows={3} className="w-full border border-gray-300 rounded-lg px-3 py-2 bg-white text-gray-900" placeholder="Ghi chú thêm về học viên..." />
        </div>
        <div className="flex justify-end gap-2 pt-2">
          <Button className="inline-flex items-center justify-center text-center" variant="outline" type="button" onClick={() => navigate(-1)}>Hủy</Button>
          <Button className="inline-flex items-center justify-center text-center" variant="primary" htmlType="submit">Thêm học viên</Button>
        </div>
      </form>
    </Page>
  );
}

// ============================================
// (4) Trang chi tiết học viên (route "/client-detail")
// ============================================
export function ClientDetailView() {
  const navigate = useNavigate();
  const { selectedClient: client, updateClient, addNote, contactClientViaZalo } = useAppContext();

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
    e.preventDefault();
    if (!newInteraction.content.trim()) return;
    const newLog = {
      date: "2026-10-15",
      content: newInteraction.content,
      nextAction: newInteraction.nextAction || "Chưa có kế hoạch tiếp theo",
    };
    addNote(client.id, newLog);
    setNewInteraction({ content: "", nextAction: "" });
    setShowAddInteraction(false);
  };

  // Bấm nút "+": tăng số buổi đã tập thêm 1 (tối đa bằng tổng số buổi)
  const handleAddSession = () => {
    const next = Math.min(client.packageUsed + 1, client.packageTotal);
    updateClient(client.id, { packageUsed: next });
  };

  // Chưa chọn học viên (ví dụ tải lại trang): hiện nút quay lại
  if (!client) {
    return (
      <Page className="bg-slate-100 p-4">
        <BackButton onClick={() => navigate(-1)} />
      </Page>
    );
  }

  const progress = Math.round((client.packageUsed / client.packageTotal) * 100);
  const statusInfo = getStatusBadge(client.status);
  // Số điện thoại chỉ giữ chữ số để tạo link zalo.me chính xác
  const cleanPhone = String(client.phone || "").replace(/\D/g, "");

  return (
    <Page ref={scrollRef} className="p-4 pb-28 space-y-4 bg-slate-100">
      {/* Header inside page — safe-area-inset-top keeps title below status bar; pr-24 clears Zalo capsule */}
      <div
        className="flex items-center gap-3 pb-3 border-b border-gray-200 sticky top-0 bg-slate-100 z-30 px-0 pr-24"
        style={{ paddingTop: "max(env(safe-area-inset-top, 44px), 44px)" }}
      >
        <BackButton onClick={() => navigate(-1)} />
        <Avatar size="xlarge" src={client.avatar} alt={client.name} />
        <div className="flex-1 min-w-0">
          <Text.Title size="large" className="font-bold text-gray-900 truncate">{client.name}</Text.Title>
          <Text className="text-gray-500">{client.phone}</Text>
        </div>
        <span className={`inline-flex items-center justify-center text-center px-3 py-1 text-sm font-medium rounded-full flex-shrink-0 ${
          statusInfo.variant === "success" ? "bg-green-100 text-green-800" :
          statusInfo.variant === "warning" ? "bg-yellow-100 text-yellow-800" :
          statusInfo.variant === "danger" ? "bg-red-100 text-red-800" :
          "bg-gray-100 text-gray-800"
        }`}>
          {statusInfo.text}
        </span>
      </div>

      {/* 3 ô tóm tắt: mục tiêu, gói tập, số ngày chưa tương tác */}
      <div className="grid grid-cols-3 gap-2 w-full mt-3">
        <div className={`flex flex-col items-center justify-center text-center p-2 rounded-xl min-w-0 ${pillClasses("goal")}`}>
          <span className="text-[10px] font-semibold uppercase opacity-75 leading-tight mb-0.5">Mục tiêu</span>
          <span className="text-xs font-bold leading-snug line-clamp-2 break-words w-full">{client.goal}</span>
        </div>
        <div className={`flex flex-col items-center justify-center text-center p-2 rounded-xl min-w-0 ${pillClasses("package")}`}>
          <span className="text-[10px] font-semibold uppercase opacity-75 leading-tight mb-0.5">Gói tập</span>
          <span className="text-xs font-bold leading-snug line-clamp-2 break-words w-full">Gói {client.packageTotal} buổi</span>
        </div>
        <div className={`flex flex-col items-center justify-center text-center p-2 rounded-xl min-w-0 ${pillClasses("contact", client.inactiveDays)}`}>
          <span className="text-[10px] font-semibold uppercase opacity-75 leading-tight mb-0.5">Liên hệ</span>
          <span className="text-xs font-bold leading-snug line-clamp-2 break-words w-full">{inactiveLabel(client.inactiveDays)}</span>
        </div>
      </div>

      {/* Khối Zalo: tin nhắn mới nhất + nút mở Zalo trả lời */}
      <div className={`bg-white rounded-xl border p-4 ${client.hasUnreadZalo ? "border-blue-400" : "border-slate-200"}`}>
        <div className="flex items-center justify-between gap-2 mb-2">
          <Text className="font-medium text-gray-900">Tin nhắn Zalo gần nhất</Text>
          <span className="inline-flex items-center justify-center text-center px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 border border-slate-200 text-xs font-medium flex-shrink-0">
            {client.lastZaloTime || "Chưa có"}
          </span>
        </div>
        {client.hasUnreadZalo && (
          <span className="flex items-center justify-center text-center w-full px-2 py-1 rounded-full bg-blue-600 text-white text-xs font-semibold mb-2">
            Tin nhắn Zalo mới
          </span>
        )}
        <Text className="text-sm text-gray-700 mb-3 leading-snug">
          {client.lastZaloMessage || "Chưa có tin nhắn nào."}
        </Text>
        {/* Thẻ <a> thật: iOS/Zalo WebView sẽ mở link ngay khi chạm, không bị chặn như window.open */}
        <a
          href={"https://zalo.me/" + cleanPhone}
          target="_blank"
          rel="noopener noreferrer"
          className="w-full py-2.5 px-4 rounded-xl bg-blue-600 active:bg-blue-700 text-white font-semibold text-sm flex items-center justify-center text-center no-underline"
          onClick={() => contactClientViaZalo(client.id, client.phone)}
        >
          {client.hasUnreadZalo ? "Mở Zalo trả lời" : "Nhắn tin Zalo"}
        </a>
      </div>

      {/* Tiến độ buổi tập */}
      <div className="bg-white rounded-xl border border-slate-200 p-4">
        <div className="flex items-center justify-between mb-2">
          <Text className="font-medium text-gray-900">Tiến độ buổi tập</Text>
          <div className="flex items-center gap-2">
            <Text className="font-semibold text-gray-900">{client.packageUsed}/{client.packageTotal}</Text>
            <Button
              size="small"
              variant="primary"
              className="text-center w-8 h-8 p-0 flex items-center justify-center rounded-full"
              onClick={handleAddSession}
              disabled={client.packageUsed >= client.packageTotal}
            >
              <span className="text-white text-xl font-bold leading-none">+</span>
            </Button>
          </div>
        </div>
        <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
          <div className="h-full bg-blue-600 rounded-full transition-all duration-300" style={{ width: `${progress}%` }} />
        </div>
        <Text className="text-xs text-gray-500 mt-1 text-right">{progress}% hoàn thành</Text>
      </div>

      {/* Ghi chú chung của học viên */}
      {client.note && (
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
          <Text className="text-sm font-medium text-blue-800 mb-1 block">Ghi chú chung</Text>
          <Text className="text-sm text-blue-700">{client.note}</Text>
        </div>
      )}

      {/* Nhật ký tương tác */}
      <div className="flex items-center justify-between">
        <Text.Title size="medium" className="font-bold text-gray-900">Nhật ký tương tác</Text.Title>
        <Button
          size="small"
          variant="primary"
          className="text-center w-8 h-8 p-0 flex items-center justify-center rounded-full"
          onClick={() => setShowAddInteraction(!showAddInteraction)}
        >
          <span className="text-white text-xl font-bold leading-none">{showAddInteraction ? "×" : "+"}</span>
        </Button>
      </div>

      {showAddInteraction && (
        <form onSubmit={handleAddInteraction} className="bg-white rounded-xl border border-slate-200 p-4 space-y-3">
          <div>
            <Text className="text-sm text-gray-500 mb-1 block">Nội dung trao đổi <span className="text-red-500">*</span></Text>
            <textarea value={newInteraction.content} onChange={(e) => setNewInteraction({ ...newInteraction, content: e.target.value })} rows={3} className="w-full border border-gray-300 rounded-lg px-3 py-2 bg-white text-gray-900" placeholder="Ví dụ: Đã trao đổi về menu ăn, khách hàng phản hồi khỏe..." required />
          </div>
          <div>
            <Text className="text-sm text-gray-500 mb-1 block">Việc cần làm tiếp theo</Text>
            <textarea value={newInteraction.nextAction} onChange={(e) => setNewInteraction({ ...newInteraction, nextAction: e.target.value })} rows={2} className="w-full border border-gray-300 rounded-lg px-3 py-2 bg-white text-gray-900" placeholder="Ví dụ: Gửi file menu qua Zalo, đặt lịch buổi tới..." />
          </div>
          <div className="flex justify-end gap-2">
            <Button className="inline-flex items-center justify-center text-center" variant="outline" type="button" onClick={() => setShowAddInteraction(false)}>Hủy</Button>
            <Button className="inline-flex items-center justify-center text-center" variant="primary" htmlType="submit">Lưu ghi chú</Button>
          </div>
        </form>
      )}

      <div className="space-y-3">
        {client.interactionLogs.length === 0 ? (
          <div className="text-center py-6 text-gray-500"><Text>Chưa có ghi chú tương tác</Text></div>
        ) : (
          client.interactionLogs.map((log, i) => (
            <div key={i} className="bg-white rounded-xl border border-slate-200 p-4">
              <div className="flex items-start justify-between gap-2 mb-2">
                <Text className="text-xs text-gray-500 font-medium">{formatDate(log.date)}</Text>
                <Text className="text-xs px-2 py-0.5 bg-blue-100 text-blue-700 rounded">Tương tác</Text>
              </div>
              <Text className="text-sm text-gray-900 mb-2">{log.content}</Text>
              {log.nextAction && (
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-2">
                  <Text className="font-medium text-xs text-yellow-800 mb-1 block">Việc cần làm:</Text>
                  <Text className="text-sm text-yellow-700">{log.nextAction}</Text>
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
// (5) Trang chính: Danh sách học viên (route "/clients")
// ============================================
export default function ClientsPage() {
  const navigate = useNavigate();

  // Lấy học viên + bộ lọc ưu tiên dùng chung từ Context
  const {
    clients,
    setSelectedClient,
    activeClientFilter: activeFilter,
    setActiveClientFilter: setActiveFilter,
    generateBulkClients,
    resetDefaultClients,
    simulateIncomingZaloWebhook,
    contactClientViaZalo,
  } = useAppContext();

  // Scroll ref riêng biệt cho danh sách học viên
  const scrollRef = useRef(null);

  // Ref trỏ tới đầu danh sách để cuộn xuống ngay sau khi giả lập webhook
  const listTopRef = useRef(null);

  // ----- (2) STATE -----

  // Từ khóa tìm kiếm
  const [searchQuery, setSearchQuery] = useState("");

  // Số học viên đang hiển thị: mỗi lần bấm "Tải thêm" sẽ tăng thêm 20
  const [visibleCount, setVisibleCount] = useState(20);

  // Bật/tắt bảng "Công cụ Demo Đồ Án"
  const [showDemoPanel, setShowDemoPanel] = useState(false);

  // Học viên + nội dung tin nhắn đang chọn trong bộ giả lập webhook
  const [demoClientId, setDemoClientId] = useState(clients.length > 0 ? String(clients[0].id) : "");
  const [demoMessage, setDemoMessage] = useState("");

  // Thông báo xác nhận sau khi tạo dữ liệu / nhận webhook
  const [demoNotice, setDemoNotice] = useState("");

  // Khi vào trang: khôi phục vị trí cuộn đã lưu (nếu có)
  useEffect(() => {
    return restoreScroll("scroll_clients", scrollRef);
  }, []);

  // Danh sách đổi (tạo 500 / khôi phục) thì tự chọn lại học viên đầu tiên cho dropdown
  useEffect(() => {
    if (clients.length > 0 && !clients.some((c) => String(c.id) === demoClientId)) {
      setDemoClientId(String(clients[0].id));
    }
  }, [clients]);

  // Đổi bộ lọc hoặc từ khóa tìm kiếm thì hiển thị lại từ 20 học viên đầu
  useEffect(() => {
    setVisibleCount(20);
  }, [activeFilter, searchQuery]);

  // ID hiển thị trên dropdown giả lập: luôn là học viên còn tồn tại,
  // nếu chưa chọn gì thì mặc định lấy học viên đầu tiên (clients[0])
  const demoSelectedId = clients.some((c) => String(c.id) === demoClientId)
    ? demoClientId
    : clients.length > 0
      ? String(clients[0].id)
      : "";

  // ----- SỐ LIỆU CHO PHỄU LỌC ƯU TIÊN -----

  // Số khách đang chờ PT trả lời Zalo
  const unreadCount = clients.filter((c) => c.hasUnreadZalo === true).length;

  // Số khách vắng mặt từ 7 ngày trở lên
  const inactiveCount = clients.filter((c) => c.inactiveDays >= 7).length;

  // Số khách sắp hết gói (còn 1 -> 3 buổi)
  const lowSessionCount = clients.filter((c) => {
    const remaining = c.packageTotal - c.packageUsed;
    return remaining <= 3 && remaining > 0;
  }).length;

  // Các nút phễu lọc kèm số lượng thực tế
  const filters = [
    { key: "all", label: "Tất cả", count: clients.length },
    { key: "unread", label: "Chờ phản hồi Zalo", count: unreadCount },
    { key: "inactive", label: "Vắng mặt >= 7 ngày", count: inactiveCount },
    { key: "lowSession", label: "Sắp hết gói", count: lowSessionCount },
    { key: "active", label: "Đang tập", count: clients.filter((c) => c.status === "Đang tập").length },
  ];

  // ----- (3) LỌC + SẮP XẾP ƯU TIÊN -----

  // 1) Lọc theo từ khóa tìm kiếm (tên hoặc số điện thoại)
  let filteredClients = clients;
  if (searchQuery.trim()) {
    const q = searchQuery.toLowerCase().trim();
    const qPhone = q.replace(/\s/g, "");
    filteredClients = filteredClients.filter(
      (c) => c.name.toLowerCase().includes(q) || c.phone.replace(/\s/g, "").includes(qPhone)
    );
  }

  // 2) Lọc theo phễu ưu tiên đang chọn
  if (activeFilter === "unread") {
    filteredClients = filteredClients.filter((c) => c.hasUnreadZalo === true);
  } else if (activeFilter === "inactive") {
    filteredClients = filteredClients.filter((c) => c.inactiveDays >= 7);
  } else if (activeFilter === "lowSession") {
    filteredClients = filteredClients.filter((c) => {
      const remaining = c.packageTotal - c.packageUsed;
      return remaining <= 3 && remaining > 0;
    });
  } else if (activeFilter === "active") {
    filteredClients = filteredClients.filter((c) => c.status === "Đang tập");
  }

  // 3) Ưu tiên: khách có tin Zalo chưa trả lời luôn đứng đầu.
  //    Trong nhóm đó, ai vừa nhắn gần nhất (unreadTimestamp lớn nhất) đứng trước.
  //    Các khách còn lại xếp theo số ngày vắng mặt giảm dần.
  const sortedClients = [...filteredClients].sort((a, b) => {
    if (a.hasUnreadZalo !== b.hasUnreadZalo) {
      return a.hasUnreadZalo ? -1 : 1;
    }
    if (a.hasUnreadZalo && b.hasUnreadZalo) {
      const timeDiff = (b.unreadTimestamp || 0) - (a.unreadTimestamp || 0);
      if (timeDiff !== 0) return timeDiff;
      return b.inactiveDays - a.inactiveDays;
    }
    return b.inactiveDays - a.inactiveDays;
  });

  // 4) Chỉ render 20 học viên mỗi lần để 500+ học viên vẫn mượt
  const visibleClients = sortedClients.slice(0, visibleCount);

  // ----- (4) HANDLERS -----

  // Bấm vào 1 học viên: lưu vị trí cuộn, chọn học viên rồi sang trang chi tiết
  const handleOpenDetail = (client) => {
    saveScroll("scroll_clients", scrollRef);
    setSelectedClient(client);
    navigate("/client-detail");
  };

  // Bấm nút "+ Thêm HV": lưu vị trí cuộn rồi sang form thêm học viên
  const handleOpenAdd = () => {
    saveScroll("scroll_clients", scrollRef);
    navigate("/client-add");
  };

  // Mở Zalo trả lời + đánh dấu đã liên hệ (xử lý trong Context)
  const handleContactZalo = (clientId, phone) => {
    contactClientViaZalo(clientId, phone);
  };

  // Tạo 500 học viên mẫu để demo dữ liệu lớn
  const handleGenerateBulk = () => {
    generateBulkClients(500);
    setVisibleCount(20);
    setDemoNotice("Đã tạo 500 học viên mẫu. Danh sách ưu tiên đã sẵn sàng để demo.");
  };

  // Khôi phục lại 5 học viên gốc
  const handleResetClients = () => {
    resetDefaultClients();
    setVisibleCount(20);
    setDemoNotice("Đã khôi phục 5 học viên gốc.");
  };

  // Giả lập webhook "user_send_text" do Zalo Official Account gửi về khi khách nhắn tin
  const handleSimulateWebhook = (e) => {
    e.preventDefault();
    // Nếu chưa chọn hoặc ID đã cũ sau khi tạo 500 KH thì lấy học viên đầu tiên
    const targetId = demoSelectedId || (clients[0] && clients[0].id);
    // Nếu PT chưa nhập tin nhắn thì dùng tin nhắn mặc định để nút luôn chạy được ngay
    const messageText = demoMessage.trim() || "Thầy ơi tối nay em xin đổi lịch tập nhé!";
    if (!targetId) return;
    const target = clients.find((c) => String(c.id) === String(targetId));
    setDemoClientId(String(targetId));
    simulateIncomingZaloWebhook(targetId, messageText);
    // Reset bộ lọc + từ khóa + số thẻ đang hiển thị để học viên vừa nhắn
    // chắc chắn nằm ở vị trí #1 ngay dưới bảng demo
    setActiveFilter("all");
    setSearchQuery("");
    setVisibleCount(20);
    setDemoNotice(
      `Đã nhận webhook "user_send_text" từ ${target ? target.name : "học viên"}: "${messageText}"`
    );
    setDemoMessage("");
    // Cuộn xuống đầu danh sách để PT thấy ngay thẻ đang nhấp nháy màu xanh
    setTimeout(() => {
      if (listTopRef.current) {
        listTopRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }, 100);
  };

  // ----- (5) GIAO DIỆN -----
  return (
    <Page ref={scrollRef} className="bg-slate-100 min-h-screen">
      {/* Thanh tiêu đề: chừa chỗ cho thanh trạng thái và nút capsule của Zalo */}
      <div
        className="bg-white border-b border-gray-200 px-4 pb-3 sticky top-0 z-30"
        style={{ paddingTop: "max(env(safe-area-inset-top, 44px), 44px)" }}
      >
        {/* Hàng tiêu đề: chỉ hàng này chừa pr-24 để tránh nút capsule của Zalo */}
        <div className="flex items-center gap-2 pr-24">
          <BackButton onClick={() => navigate(-1)} />
          <div className="flex-1 min-w-0">
            <Text.Title size="xLarge" className="font-bold text-gray-900">Học viên</Text.Title>
            <Text className="text-sm text-gray-500">Quản lý học viên</Text>
          </div>
        </div>

        {/* Nút bật/tắt bảng công cụ demo: đặt ngoài pr-24 và canh giữa toàn bộ chiều ngang header */}
        <div className="w-full mt-3">
          <button
            type="button"
            className="w-full flex flex-col items-center justify-center text-center px-3 py-2 rounded-lg border border-blue-300 bg-blue-50 text-blue-800 active:bg-blue-100"
            onClick={() => setShowDemoPanel(!showDemoPanel)}
          >
            <span className="text-xs font-bold">Công cụ Demo Đồ Án (Zalo &amp; 500 KH)</span>
            <span className="text-[10px] font-medium text-blue-600">
              {showDemoPanel ? "Đang mở — nhấn để đóng" : "Nhấn để mở"}
            </span>
          </button>
        </div>
      </div>

      <div className="p-4 pb-28 space-y-3">
        {/* ----- BẢNG CÔNG CỤ DEMO: TẠO DỮ LIỆU LỚN + GIẢ LẬP WEBHOOK ZALO ----- */}
        {showDemoPanel && (
          <div className="bg-white rounded-xl border border-blue-200 shadow-sm p-4 space-y-4">
            {/* 1. Quy mô dữ liệu */}
            <div>
              <Text.Title size="medium" className="font-bold text-gray-900 mb-1">1. Quy mô dữ liệu</Text.Title>
              <Text className="text-xs text-gray-500 mb-2 block">Đang có {clients.length} học viên trong hệ thống.</Text>
              <div className="flex flex-col gap-2">
                <Button
                  variant="primary"
                  className="inline-flex items-center justify-center text-center w-full"
                  onClick={handleGenerateBulk}
                >
                  Tạo 500 học viên mẫu
                </Button>
                <Button
                  variant="outline"
                  className="inline-flex items-center justify-center text-center w-full"
                  onClick={handleResetClients}
                >
                  Khôi phục 5 học viên gốc
                </Button>
              </div>
            </div>

            <div className="border-t border-slate-100" />

            {/* 2. Giả lập khách nhắn tin từ Zalo OA */}
            <form onSubmit={handleSimulateWebhook} className="space-y-2">
              <Text.Title size="medium" className="font-bold text-gray-900 mb-1">2. Giả lập khách nhắn tin từ Zalo OA</Text.Title>
              <Text className="text-xs text-gray-500 mb-2 block">Chọn học viên, chọn tin nhắn mẫu rồi bấm giả lập.</Text>

              <select
                value={demoSelectedId}
                onChange={(e) => setDemoClientId(e.target.value)}
                className="w-full h-10 rounded-lg border border-gray-300 bg-white text-gray-900 px-3 text-sm"
              >
                {clients.map((c) => (
                  <option key={c.id} value={c.id}>{c.name} - {c.phone}</option>
                ))}
              </select>

              <div className="flex flex-wrap gap-2">
                {quickMessages.map((message) => (
                  <button
                    key={message}
                    type="button"
                    className="flex items-center justify-center text-center px-2.5 py-1.5 rounded-full border border-blue-200 bg-blue-50 text-blue-700 text-[11px] font-medium"
                    onClick={() => setDemoMessage(message)}
                  >
                    {message}
                  </button>
                ))}
              </div>

              <input
                type="text"
                value={demoMessage}
                onChange={(e) => setDemoMessage(e.target.value)}
                placeholder="Hoặc nhập tin nhắn khách gửi..."
                className="w-full h-10 rounded-lg border border-gray-300 bg-white text-gray-900 px-3 text-sm"
              />

              {/* Dùng <button type="submit"> gốc của HTML: zmp-ui Button dùng htmlType
                  nên type="submit" không kích hoạt submit form */}
              <button
                type="submit"
                disabled={clients.length === 0}
                className="w-full flex items-center justify-center text-center px-4 py-2.5 rounded-xl bg-blue-600 active:bg-blue-700 text-white font-semibold text-sm disabled:opacity-50"
              >
                Giả lập khách nhắn qua Zalo
              </button>
            </form>

            {/* Thông báo xác nhận webhook / tạo dữ liệu */}
            {demoNotice && (
              <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-3">
                <Text className="text-xs text-emerald-800 leading-relaxed">{demoNotice}</Text>
              </div>
            )}
          </div>
        )}

        {/* Ô tìm kiếm và nút thêm học viên */}
        <div className="flex gap-3">
          <div className="relative flex-1">
            <SearchIcon />
            <input
              type="search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Tìm theo tên hoặc SĐT..."
              className="w-full pl-9 pr-4 h-9 text-sm px-3 py-1.5 rounded-lg border border-gray-300 bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <Button className="inline-flex items-center justify-center text-center flex-shrink-0" variant="primary" size="small" onClick={handleOpenAdd}>
            + Thêm HV
          </Button>
        </div>

        {/* Phễu lọc ưu tiên CRM (kèm số lượng thực tế) */}
        <div className="flex gap-2 overflow-x-auto pb-1 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
          {filters.map((f) => (
            <Button
              key={f.key}
              variant={activeFilter === f.key ? "primary" : "outline"}
              size="small"
              className="inline-flex items-center justify-center text-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap flex-shrink-0"
              onClick={() => setActiveFilter(f.key)}
            >
              {f.label}
              <span className="inline-flex items-center justify-center ml-1 min-w-[18px] px-1.5 py-0.5 text-[10px] rounded-full bg-white/30 text-center font-bold">
                {f.count}
              </span>
            </Button>
          ))}
        </div>

        {/* Gợi ý thứ tự ưu tiên để PT biết nên liên hệ ai trước */}
        <Text className="text-[11px] text-gray-500 text-center">
          Thứ tự ưu tiên: khách vừa nhắn Zalo → đang chờ trả lời → vắng mặt lâu nhất
        </Text>

        {/* Danh sách học viên ưu tiên (mỗi lần chỉ render 20 thẻ) */}
        <div ref={listTopRef} className="flex flex-col space-y-3 scroll-mt-40">
          {visibleClients.length > 0 ? (
            visibleClients.map((c) => (
              <ClientCard key={c.id} client={c} onClick={handleOpenDetail} onContactZalo={handleContactZalo} />
            ))
          ) : (
            <div className="bg-white rounded-xl shadow-sm p-8 text-center">
              <Text.Title size="medium" className="font-bold text-gray-900 mb-1">Không tìm thấy học viên</Text.Title>
              <Text className="text-gray-500">
                {searchQuery ? "Thử từ khóa khác hoặc xóa bộ lọc" : "Chưa có học viên nào trong nhóm này."}
              </Text>
            </div>
          )}

          {/* Nút tải thêm: chỉ hiện khi còn học viên chưa render */}
          {visibleCount < sortedClients.length && (
            <Button
              variant="outline"
              className="inline-flex items-center justify-center text-center w-full py-2.5"
              onClick={() => setVisibleCount(visibleCount + 20)}
            >
              Tải thêm học viên (Đang hiển thị {visibleClients.length} / {sortedClients.length})
            </Button>
          )}
        </div>
      </div>
    </Page>
  );
}
