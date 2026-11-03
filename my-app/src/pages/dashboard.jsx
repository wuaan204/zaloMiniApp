import { Page, Text, Avatar, Button, useNavigate } from "zmp-ui";
import React, { useEffect, useRef } from "react";
import { BackButton } from "../components/icons";
import { useAppContext, today, tomorrow } from "../context/AppContext";
import { saveScroll, restoreScroll, resetScroll } from "../utils/scroll";

// Icon SVG cho 4 thẻ thống kê
const SvgUsers = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
    <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a4 4 0 00-5-3.87M9 20H4v-2a4 4 0 015-3.87M15 11a4 4 0 10-8 0 4 4 0 008 0zm6-4a3 3 0 11-6 0 3 3 0 016 0z" />
  </svg>
);
const SvgCheckCircle = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);
const SvgCalendar = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
    <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
  </svg>
);
const SvgChart = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414A1 1 0 0120 9.414V19a2 2 0 01-2 2z" />
  </svg>
);

// Dữ liệu mẫu cho 4 thẻ thống kê
// (riêng thẻ "Tổng học viên" sẽ lấy số thật từ Context để đúng khi demo 500 học viên)
const stats = [
  { label: "Tổng học viên",     value: "0",   color: "text-blue-600",   bg: "bg-blue-50",   SvgIcon: SvgUsers },
  { label: "Đi tập tuần này",   value: "28",  color: "text-green-600",  bg: "bg-green-50",  SvgIcon: SvgCheckCircle },
  { label: "Buổi dạy tuần này", value: "67",  color: "text-purple-600", bg: "bg-purple-50", SvgIcon: SvgCalendar },
  { label: "Bản ghi InBody",    value: "156", color: "text-orange-600", bg: "bg-orange-50", SvgIcon: SvgChart },
];

// Nhãn ngày dễ đọc cho phần "Buổi tập sắp tới" (Hôm nay / Ngày mai / 16/10)
function sessionDayLabel(dateStr) {
  if (dateStr === today) return "Hôm nay";
  if (dateStr === tomorrow) return "Ngày mai";
  const [, m, d] = dateStr.split("-");
  return `${d}/${m}`;
}

// Ngày dạng 12/10/2026
function formatDate(dateStr) {
  return new Date(dateStr).toLocaleDateString("vi-VN");
}

// Thẻ 1 chỉ số thống kê
function StatCard({ label, value, SvgIcon, color, bg }) {
  return (
    <div className="bg-white rounded-xl shadow-sm p-4 flex items-center gap-3">
      <div className={`p-3 rounded-lg ${bg} flex items-center justify-center flex-shrink-0`}>
        <span className={color}><SvgIcon /></span>
      </div>
      <div className="min-w-0">
        <Text className="text-sm text-gray-500 leading-tight">{label}</Text>
        <Text.Title size="large" className="font-bold text-gray-900">{value}</Text.Title>
      </div>
    </div>
  );
}

// Thẻ hiển thị 1 học viên cần theo dõi
function InactiveClientCard({ client, onClick }) {
  return (
    <div
      className="bg-slate-50 hover:bg-slate-100 rounded-xl border border-slate-300 p-3.5 flex items-center justify-between cursor-pointer"
      onClick={() => onClick(client)}
    >
      <Avatar size="large" src={client.avatar} alt={client.name} />
      <div className="flex-1 min-w-0 space-y-1">
        <Text.Title size="medium" className="font-semibold text-gray-900 truncate">{client.name}</Text.Title>
        <Text className="text-sm text-gray-500 truncate">{client.phone}</Text>
      </div>
      <div className="flex items-center gap-2">
        <span className="inline-flex items-center justify-center text-center bg-red-50 text-red-700 border border-red-200 px-2.5 py-1 rounded-full text-xs font-semibold">
          {client.inactiveDays} ngày chưa tương tác
        </span>
      </div>
    </div>
  );
}

// Dòng xem nhanh 1 buổi tập sắp tới
function UpcomingSessionRow({ session, onClick }) {
  return (
    <div
      className="bg-slate-50 hover:bg-slate-100 rounded-xl border border-slate-300 p-3 flex items-center gap-3 cursor-pointer"
      onClick={onClick}
    >
      {/* Cột trái: ngày + giờ bắt đầu */}
      <div className="flex flex-col items-center justify-center flex-shrink-0 w-14">
        <span className="text-[10px] font-semibold uppercase text-slate-500 leading-tight">{sessionDayLabel(session.date)}</span>
        <span className="text-xs font-bold text-slate-800 leading-tight">{session.time.split(" - ")[0]}</span>
      </div>
      {/* Cột phải: tên học viên + nội dung tập */}
      <div className="flex-1 min-w-0">
        <Text.Title size="medium" className="font-semibold text-gray-900 truncate">{session.clientName}</Text.Title>
        <Text className="text-xs text-gray-500 truncate">{session.focus}</Text>
      </div>
    </div>
  );
}

// Trang chi tiết học viên cần theo dõi (route "/dashboard-client")
export function DashboardClientDetail() {
  const navigate = useNavigate();
  const { selectedInactiveClient: client, contactClientViaZalo } = useAppContext();

  // Scroll ref riêng biệt cho màn hình này
  const scrollRef = useRef(null);

  // Màn hình chi tiết luôn bắt đầu từ đầu trang (scrollTop = 0)
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = 0;
    }
  }, []);

  // Bấm "Xem hồ sơ đầy đủ": chuyển sang trang Học viên
  const handleViewFullProfile = () => {
    navigate("/clients");
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
  // Số điện thoại chỉ giữ chữ số để tạo link zalo.me chính xác
  const cleanPhone = String(client.phone || "").replace(/\D/g, "");

  return (
    <Page ref={scrollRef} className="bg-slate-100">
      {/* Header — matches spacing of clients.jsx & workouts.jsx */}
      <div
        className="bg-white px-4 pb-3 border-b border-slate-200 sticky top-0 z-30 pr-24"
        style={{ paddingTop: "max(env(safe-area-inset-top, 44px), 44px)" }}
      >
        <div className="flex items-center gap-3">
          <BackButton onClick={() => navigate(-1)} />
          <Avatar size="large" src={client.avatar} alt={client.name} className="flex-shrink-0" />
          <div className="flex-1 min-w-0">
            <Text.Title size="large" className="font-bold text-gray-900 truncate">{client.name}</Text.Title>
            <Text className="text-sm text-gray-500">{client.phone}</Text>
          </div>
          <span className="items-center justify-center text-center bg-red-100 text-red-700 border border-red-200 px-2.5 py-1 rounded-full text-xs font-semibold flex-shrink-0">
            {client.inactiveDays === 0 ? "Hôm nay" : `${client.inactiveDays} ngày`}
          </span>
        </div>
      </div>

      {/* Scrollable body */}
      <div className="p-4 pb-28 space-y-4">

        {/* 3 Summary Pill Boxes — strict grid-cols-3, never wraps */}
        <div className="grid grid-cols-3 gap-2 w-full">
          <div className="flex flex-col items-center justify-center text-center p-2 rounded-xl min-w-0 bg-blue-50 text-blue-700 border border-blue-200">
            <span className="text-[10px] font-semibold uppercase opacity-75 leading-tight mb-0.5">MỤC TIÊU</span>
            <span className="text-xs font-bold leading-snug line-clamp-2 break-words w-full">{client.goal}</span>
          </div>
          <div className="flex flex-col items-center justify-center text-center p-2 rounded-xl min-w-0 bg-indigo-50 text-indigo-700 border border-indigo-200">
            <span className="text-[10px] font-semibold uppercase opacity-75 leading-tight mb-0.5">GÓI TẬP</span>
            <span className="text-xs font-bold leading-snug line-clamp-2 break-words w-full">Gói {client.packageTotal} buổi</span>
          </div>
          <div className="flex flex-col items-center justify-center text-center p-2 rounded-xl min-w-0 bg-red-50 text-red-700 border border-red-200">
            <span className="text-[10px] font-semibold uppercase opacity-75 leading-tight mb-0.5">TÌNH TRẠNG</span>
            <span className="text-xs font-bold leading-snug break-words w-full">{client.status}</span>
          </div>
        </div>

        {/* Session Progress Card */}
        <div className="bg-white rounded-xl border border-slate-200 p-4">
          <div className="flex items-center justify-between mb-2">
            <Text className="font-semibold text-gray-900 text-sm">Tiến độ gói tập</Text>
            <Text className="font-bold text-gray-900 text-sm">
              {client.packageUsed}/{client.packageTotal} buổi
            </Text>
          </div>
          <div className="h-2.5 bg-gray-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-blue-600 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
          <Text className="text-xs text-gray-500 mt-1 text-right">{progress}% hoàn thành</Text>
        </div>

        {/* Last Workout & Notes Card */}
        <div className="bg-white rounded-xl border border-slate-200 p-4 space-y-3">
          {/* Last workout date */}
          <div className="flex items-start justify-between gap-2">
            <Text className="text-sm font-semibold text-gray-700">Buổi tập cuối</Text>
            <Text className="text-sm font-bold text-gray-900">{formatDate(client.lastWorkoutDate)}</Text>
          </div>

          {/* Divider */}
          <div className="border-t border-slate-100" />

          {/* Client note */}
          <div>
            <Text className="text-xs font-semibold text-gray-500 uppercase mb-1.5 block">Ghi chú học viên</Text>
            <div className="bg-blue-50 border border-blue-100 rounded-xl p-3">
              <Text className="text-xs text-blue-900 leading-relaxed">{client.note || "Chưa có ghi chú."}</Text>
            </div>
          </div>

          {/* Tin nhắn Zalo gần nhất */}
          {client.lastZaloMessage && (
            <div>
              <Text className="text-xs font-semibold text-gray-500 uppercase mb-1.5 block">Tin nhắn Zalo gần nhất</Text>
              <div className={`rounded-xl p-3 border ${client.hasUnreadZalo ? "bg-blue-50 border-blue-300" : "bg-slate-50 border-slate-200"}`}>
                <Text className="text-xs text-blue-900 leading-relaxed">{client.lastZaloMessage}</Text>
                <Text className="text-[11px] text-gray-500 mt-1 block">{client.lastZaloTime}</Text>
              </div>
            </div>
          )}

          {/* Suggested action */}
          <div>
            <Text className="text-xs font-semibold text-gray-500 uppercase mb-1.5 block">Gợi ý hành động</Text>
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-3">
              <Text className="text-xs text-amber-900 leading-relaxed">
                {client.hasUnreadZalo
                  ? "Khách đang chờ trả lời Zalo — mở Zalo phản hồi ngay."
                  : "Nhắn Zalo hỏi thăm tình hình tập luyện và hẹn lịch buổi tiếp theo."}
              </Text>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col gap-2 pt-1">
          {/* Thẻ <a> thật để iOS/Zalo WebView mở link Zalo ngay khi chạm.
              Không gọi e.preventDefault() để Universal Link hoạt động */}
          <a
            href={"https://zalo.me/" + cleanPhone}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full py-2.5 px-4 rounded-xl bg-blue-600 active:bg-blue-700 text-white font-semibold text-sm flex items-center justify-center text-center no-underline"
            onClick={() => contactClientViaZalo(client.id, client.phone)}
          >
            Đã liên hệ qua Zalo
          </a>
          <Button variant="secondary" className="inline-flex items-center justify-center text-center w-full" onClick={handleViewFullProfile}>
            Xem hồ sơ đầy đủ
          </Button>
        </div>
      </div>
    </Page>
  );
}

// ============================================
// Trang chính: Tổng quan (route "/")
// ============================================
function DashboardPage() {
  const navigate = useNavigate();

  // Lấy danh sách học viên, buổi tập và bộ lọc ưu tiên dùng chung từ Context
  const { clients, setSelectedInactiveClient, sessions, setActiveClientFilter } = useAppContext();

  // ----- (2) STATE & REF -----
  // Scroll ref riêng biệt cho Dashboard, không ảnh hưởng trang khác
  const scrollRef = useRef(null);

  // Ref trỏ tới khu vực "Học viên cần theo dõi" để nút danh mục cuộn xuống đúng chỗ
  const inactiveSectionRef = useRef(null);

  // Khi vào trang: khôi phục vị trí cuộn đã lưu (nếu có)
  useEffect(() => {
    return restoreScroll("scroll_dashboard", scrollRef);
  }, []);

  // ----- DỮ LIỆU TÍNH TỪ STATE -----

  // Khách đang chờ PT trả lời Zalo -> hiện banner nhắc việc
  const unreadClients = clients.filter((c) => c.hasUnreadZalo === true);

  // 5 học viên vắng mặt lâu nhất (từ 7 ngày) để PT liên hệ trước
  const inactiveClients = clients
    .filter((c) => c.inactiveDays >= 7)
    .sort((a, b) => b.inactiveDays - a.inactiveDays)
    .slice(0, 5);

  // Thẻ "Tổng học viên" luôn đúng số hiện có (kể cả khi demo 500 học viên)
  const dashboardStats = stats.map((stat, index) =>
    index === 0 ? { ...stat, value: String(clients.length) } : stat
  );

  // ----- (3) HANDLERS -----

  // Chuyển sang trang khác: lưu vị trí cuộn trước để khi bấm Back vẫn nằm đúng chỗ cũ
  const goTo = (path) => {
    saveScroll("scroll_dashboard", scrollRef);
    // Vào trang Học viên từ danh mục thì xem toàn bộ danh sách và bắt đầu từ đầu trang
    if (path === "/clients") {
      setActiveClientFilter("all");
      resetScroll("scroll_clients");
    }
    if (path === "/workouts") resetScroll("scroll_workouts");
    if (path === "/progress") resetScroll("scroll_progress");
    navigate(path);
  };

  // Mở trang Học viên với phễu lọc "Chờ phản hồi Zalo"
  const handleOpenUnreadZalo = () => {
    saveScroll("scroll_dashboard", scrollRef);
    setActiveClientFilter("unread");
    resetScroll("scroll_clients");
    navigate("/clients");
  };

  // Mở trang Học viên với phễu lọc "Vắng mặt >= 7 ngày"
  const handleOpenInactiveList = () => {
    saveScroll("scroll_dashboard", scrollRef);
    setActiveClientFilter("inactive");
    resetScroll("scroll_clients");
    navigate("/clients");
  };

  // Bấm vào 1 học viên cần theo dõi: lưu vào Context rồi chuyển sang trang chi tiết
  const handleOpenDetail = (client) => {
    saveScroll("scroll_dashboard", scrollRef);
    setSelectedInactiveClient(client);
    navigate("/dashboard-client");
  };

  // Nút "Học viên cần theo dõi": cuộn xuống đúng khu vực này trong cùng trang
  const handleScrollToInactive = () => {
    if (inactiveSectionRef.current) {
      inactiveSectionRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  // 3 buổi tập sắp tới gần nhất để xem nhanh ở cuối trang
  const upcomingSessions = [...sessions]
    .filter((s) => s.status === "Sắp tới" || s.status === "Cần nhắc lịch")
    .sort((a, b) => a.date.localeCompare(b.date) || a.time.localeCompare(b.time))
    .slice(0, 3);

  // ----- (4) GIAO DIỆN -----
  return (
    <Page ref={scrollRef} className="bg-gray-50 min-h-screen">
      {/* Màn hình Tổng quan chính */}
      <div>
        {/* Header — safe-area-inset-top keeps title below status bar; pr-24 clears Zalo capsule */}
        <div
          className="bg-white border-b border-gray-200 px-4 pb-3 sticky top-0 z-30 pr-24"
          style={{ paddingTop: "max(env(safe-area-inset-top, 44px), 44px)" }}
        >
          <div className="flex items-center gap-2">
            <div className="flex-1 min-w-0">
              <Text.Title size="xLarge" className="font-bold text-gray-900">Tổng quan</Text.Title>
              <Text className="text-sm text-gray-500">Xin chào! Dưới đây là tình hình học viên hôm nay.</Text>
            </div>
          </div>
        </div>

        {/* Content — chỉ <Page> cuộn, không lồng thêm vùng cuộn */}
        <div className="p-4 space-y-6 pb-28">
          {/* (1) 4 thẻ thống kê — lưới 2x2 */}
          <div className="grid grid-cols-2 gap-3">
            {dashboardStats.map((stat, index) => (
              <StatCard key={index} {...stat} />
            ))}
          </div>

          {/* (2) Banner nhắc việc: khách đang chờ PT trả lời Zalo */}
          {unreadClients.length > 0 && (
            <button
              type="button"
              onClick={handleOpenUnreadZalo}
              className="w-full bg-blue-50 border border-blue-300 rounded-xl p-4 flex flex-col items-center justify-center text-center gap-1 active:bg-blue-100"
            >
              <span className="text-sm font-bold text-blue-800">
                {unreadClients.length} học viên đang chờ PT trả lời Zalo
              </span>
              <span className="text-xs text-blue-700">Học viên có tin nhắn mới luôn nằm đầu danh sách ưu tiên</span>
              <span className="mt-1 inline-flex items-center justify-center text-center px-4 py-1.5 rounded-full bg-blue-600 text-white text-xs font-bold">
                Mở danh sách chờ phản hồi
              </span>
            </button>
          )}

          {/* (3) Danh mục quản lý — đặt ngay dưới thẻ thống kê để PT vào nhanh tính năng chính */}
          <div className="bg-white rounded-xl shadow-sm p-4 space-y-3">
            <Text.Title size="medium" className="font-bold text-gray-900">Danh mục quản lý</Text.Title>
            <div className="grid grid-cols-2 gap-3">
              {/* Mỗi nút dùng thẻ <button> thường + nền pastel; khi nhấn chỉ đậm hơn 1 cấp
                  (100 -> 200) và chữ vẫn đậm 800/900 nên luôn đọc được, không bị thành nền xanh đậm */}
              <button
                type="button"
                className="bg-blue-100 hover:bg-blue-100 focus:bg-blue-100 active:bg-blue-200 text-blue-800 focus:text-blue-800 active:text-blue-900 border border-blue-200 font-bold flex flex-col items-center justify-center text-center py-3.5 px-3 rounded-xl shadow-sm text-sm active:scale-[0.98] transition-all duration-150 select-none outline-none"
                style={{ WebkitTapHighlightColor: "transparent" }}
                onClick={() => goTo("/clients")}
              >
                Quản lý học viên
              </button>
              <button
                type="button"
                className="bg-indigo-100 hover:bg-indigo-100 focus:bg-indigo-100 active:bg-indigo-200 text-indigo-800 focus:text-indigo-800 active:text-indigo-900 border border-indigo-200 font-bold flex flex-col items-center justify-center text-center py-3.5 px-3 rounded-xl shadow-sm text-sm active:scale-[0.98] transition-all duration-150 select-none outline-none"
                style={{ WebkitTapHighlightColor: "transparent" }}
                onClick={() => goTo("/workouts")}
              >
                Lịch & Buổi tập
              </button>
              <button
                type="button"
                className="bg-emerald-100 hover:bg-emerald-100 focus:bg-emerald-100 active:bg-emerald-200 text-emerald-800 focus:text-emerald-800 active:text-emerald-900 border border-emerald-200 font-bold flex flex-col items-center justify-center text-center py-3.5 px-3 rounded-xl shadow-sm text-sm active:scale-[0.98] transition-all duration-150 select-none outline-none"
                style={{ WebkitTapHighlightColor: "transparent" }}
                onClick={() => goTo("/progress")}
              >
                Chỉ số InBody
              </button>
              <button
                type="button"
                className="bg-rose-100 hover:bg-rose-100 focus:bg-rose-100 active:bg-rose-200 text-rose-800 focus:text-rose-800 active:text-rose-900 border border-rose-200 font-bold flex flex-col items-center justify-center text-center py-3.5 px-3 rounded-xl shadow-sm text-sm active:scale-[0.98] transition-all duration-150 select-none outline-none"
                style={{ WebkitTapHighlightColor: "transparent" }}
                onClick={handleScrollToInactive}
              >
                Học viên cần theo dõi
              </button>
            </div>
          </div>

          {/* (4) Học viên cần theo dõi (vắng từ 7 ngày) */}
          <div ref={inactiveSectionRef} className="bg-white rounded-xl shadow-sm">
            <div className="p-4 border-b border-gray-200 flex items-center justify-between gap-2">
              <Text.Title size="large" className="font-bold text-gray-900">
                Học viên cần theo dõi (vắng từ 7 ngày)
              </Text.Title>
              <Button className="inline-flex items-center justify-center text-center flex-shrink-0" variant="text" size="small" onClick={handleOpenInactiveList}>Xem tất cả</Button>
            </div>
            <div className="p-4 space-y-3">
              {inactiveClients.map((client) => (
                <InactiveClientCard key={client.id} client={client} onClick={handleOpenDetail} />
              ))}
              {inactiveClients.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  <Text>Không có học viên cần hỏi thăm. Tuyệt vời!</Text>
                </div>
              )}
            </div>
          </div>

          {/* (5) Buổi tập sắp tới — xem nhanh ở cuối trang */}
          <div className="bg-white rounded-xl shadow-sm">
            <div className="p-4 border-b border-gray-200 flex items-center justify-between">
              <Text.Title size="large" className="font-bold text-gray-900">Buổi tập sắp tới</Text.Title>
              <Button className="inline-flex items-center justify-center text-center" variant="text" size="small" onClick={() => goTo("/workouts")}>Xem lịch</Button>
            </div>
            <div className="p-4 space-y-3">
              {upcomingSessions.map((session) => (
                <UpcomingSessionRow key={session.id} session={session} onClick={() => goTo("/workouts")} />
              ))}
              {upcomingSessions.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  <Text>Chưa có buổi tập nào sắp tới.</Text>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </Page>
  );
}

export default DashboardPage;
