import { Page, Text, Avatar, Button, useNavigate } from "zmp-ui";
import React, { useEffect, useRef } from "react";
import { BackButton } from "../components/icons";
import { useAppContext } from "../context/AppContext";
import { saveScroll, restoreScroll, resetScroll } from "../utils/scroll";

// Mock data for dashboard stats — svgIcon is inline SVG for each card
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

const stats = [
  { label: "Tổng học viên",     value: "42",  color: "text-blue-600",   bg: "bg-blue-50",   SvgIcon: SvgUsers },
  { label: "Đi tập tuần này",   value: "28",  color: "text-green-600",  bg: "bg-green-50",  SvgIcon: SvgCheckCircle },
  { label: "Buổi dạy tuần này", value: "67",  color: "text-purple-600", bg: "bg-purple-50", SvgIcon: SvgCalendar },
  { label: "Bản ghi InBody",    value: "156", color: "text-orange-600", bg: "bg-orange-50", SvgIcon: SvgChart },
];

// Mock data for inactive clients (7-10 days) — enriched with full profile info
const inactiveClients = [
  {
    id: 1, name: "Nguyễn Văn An", lastActive: "8 ngày chưa tương tác",
    avatar: "https://i.pravatar.cc/150?u=1", phone: "0901 234 567",
    lastWorkout: "2026-10-05", daysInactive: 8,
    goal: "Giảm mỡ", packageName: "Gói 24 buổi",
    completedSessions: 8, totalSessions: 24,
    lastWorkoutFocus: "Thân trên - Ngực & Tay sau",
    note: "Đang áp dụng thực đơn giảm carb. Cần hỏi thăm cân nặng và mức độ kiên trì tuần này.",
    suggestedAction: "Nhắn Zalo hỏi thăm cân nặng, nhắc đặt lịch buổi 9 vào thứ 4 tuần này.",
  },
  {
    id: 2, name: "Trần Thị Bình", lastActive: "9 ngày chưa tương tác",
    avatar: "https://i.pravatar.cc/150?u=2", phone: "0912 345 678",
    lastWorkout: "2026-10-04", daysInactive: 9,
    goal: "Tăng cơ", packageName: "Gói 36 buổi",
    completedSessions: 15, totalSessions: 36,
    lastWorkoutFocus: "Chân & Mông - Squat PR 80kg",
    note: "Đang tập upper/lower split. Buổi cuối đạt PR squat 80kg, tinh thần tốt.",
    suggestedAction: "Hỏi thăm tình trạng phục hồi sau buổi leg day, gợi ý đặt lịch buổi 16.",
  },
  {
    id: 3, name: "Lê Văn Cường", lastActive: "7 ngày chưa tương tác",
    avatar: "https://i.pravatar.cc/150?u=3", phone: "0923 456 789",
    lastWorkout: "2026-10-06", daysInactive: 7,
    goal: "Duy trì form", packageName: "Gói 24 buổi",
    completedSessions: 22, totalSessions: 24,
    lastWorkoutFocus: "Full Body Maintenance",
    note: "Sắp hết gói — còn 2 buổi. Cần tư vấn gia hạn hoặc nâng cấp lên gói 36 buổi.",
    suggestedAction: "Gọi điện tư vấn gia hạn gói tập. Ưu đãi 10% nếu đăng ký trước 20/10.",
  },
  {
    id: 4, name: "Phạm Thị Dung", lastActive: "10 ngày chưa tương tác",
    avatar: "https://i.pravatar.cc/150?u=4", phone: "0934 567 890",
    lastWorkout: "2026-10-03", daysInactive: 10,
    goal: "Giảm mỡ", packageName: "Gói 12 buổi",
    completedSessions: 3, totalSessions: 12,
    lastWorkoutFocus: "Full Body HIIT - Cường độ nhẹ",
    note: "Tạm dừng do bận deadline dự án. Đã hứa quay lại sau 2 tuần (dự kiến 20/10).",
    suggestedAction: "Nhắn Zalo hỏi thăm tình hình công việc và hẹn ngày quay lại tập.",
  },
  {
    id: 5, name: "Hoàng Văn Em", lastActive: "8 ngày chưa tương tác",
    avatar: "https://i.pravatar.cc/150?u=5", phone: "0945 678 901",
    lastWorkout: "2026-10-05", daysInactive: 8,
    goal: "Tăng sức bền", packageName: "Gói 24 buổi",
    completedSessions: 12, totalSessions: 24,
    lastWorkoutFocus: "Long Run 8km - Pace 6:30/km",
    note: "Đang chuẩn bị cho marathon 10km vào tháng 11. Cần duy trì lịch tập đều đặn.",
    suggestedAction: "Nhắc lịch tập cuối tuần: long run 10km. Theo dõi HR zone sau chạy.",
  },
];

function StatCard({ label, value, SvgIcon, color, bg }) {
  return (
    <div className="bg-white rounded-xl shadow-sm p-4 flex items-center gap-3 dark:bg-gray-800 dark:border dark:border-gray-700">
      <div className={`p-3 rounded-lg ${bg} dark:bg-gray-700 flex items-center justify-center flex-shrink-0`}>
        <span className={color}><SvgIcon /></span>
      </div>
      <div className="min-w-0">
        <Text className="text-sm text-gray-500 dark:text-gray-400 leading-tight">{label}</Text>
        <Text.Title size="large" className="font-bold text-gray-900 dark:text-white">{value}</Text.Title>
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
        <Text.Title size="medium" className="font-semibold text-gray-900 dark:text-white truncate">{client.name}</Text.Title>
        <Text className="text-sm text-gray-500 dark:text-gray-400 truncate">{client.phone}</Text>
      </div>
      <div className="flex items-center gap-2">
        <span className="inline-flex items-center justify-center text-center bg-red-50 text-red-700 border border-red-200 px-2.5 py-1 rounded-full text-xs font-semibold">
          {client.lastActive}
        </span>
        
      </div>
    </div>
  );
}

// Trang chi tiết học viên cần theo dõi (route "/dashboard-client")
export function DashboardClientDetail() {
  const navigate = useNavigate();
  const { selectedInactiveClient: client } = useAppContext();

  // Scroll ref riêng biệt cho màn hình này
  const scrollRef = useRef(null);

  // Màn hình chi tiết luôn bắt đầu từ đầu trang (scrollTop = 0)
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = 0;
    }
  }, []);

  // Bấm "Đã liên hệ qua Zalo": (thực tế sẽ gọi API đánh dấu đã liên hệ) rồi quay lại trang trước
  const handleMarkContacted = () => {
    navigate(-1);
  };

  // Bấm "Xem hồ sơ đầy đủ": chuyển sang trang Học viên
  const handleViewFullProfile = () => {
    navigate("/clients");
  };

  // Chưa chọn học viên (ví dụ tải lại trang): hiện nút quay lại
  if (!client) {
    return (
      <Page className="bg-slate-100 dark:bg-slate-900 p-4">
        <BackButton onClick={() => navigate(-1)} />
      </Page>
    );
  }

  const progress = Math.round((client.completedSessions / client.totalSessions) * 100);
  return (
    <Page ref={scrollRef} className="bg-slate-100 dark:bg-slate-900">
      {/* Header — matches spacing of clients.jsx & workouts.jsx */}
      <div
        className="bg-white dark:bg-gray-800 px-4 pb-3 border-b border-slate-200 dark:border-gray-700 sticky top-0 z-30 pr-24"
        style={{ paddingTop: 'max(env(safe-area-inset-top, 44px), 44px)' }}
      >
        <div className="flex items-center gap-3">
          <BackButton onClick={() => navigate(-1)} />
          <Avatar size="large" src={client.avatar} alt={client.name} className="flex-shrink-0" />
          <div className="flex-1 min-w-0">
            <Text.Title size="large" className="font-bold text-gray-900 dark:text-white truncate">{client.name}</Text.Title>
            <Text className="text-sm text-gray-500 dark:text-gray-400">{client.phone}</Text>
          </div>
          <span className="items-center justify-center text-center bg-red-100 text-red-700 border border-red-200 px-2.5 py-1 rounded-full text-xs font-semibold flex-shrink-0">
            {client.daysInactive} ngày
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
            <span className="text-xs font-bold leading-snug line-clamp-2 break-words w-full">{client.packageName}</span>
          </div>
          <div className="flex flex-col items-center justify-center text-center p-2 rounded-xl min-w-0 bg-red-50 text-red-700 border border-red-200">
            <span className="text-[10px] font-semibold uppercase opacity-75 leading-tight mb-0.5">TÌNH TRẠNG</span>
            <span className="text-xs font-bold leading-snug break-words w-full">{client.lastActive}</span>
          </div>
        </div>

        {/* Session Progress Card */}
        <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-4">
          <div className="flex items-center justify-between mb-2">
            <Text className="font-semibold text-gray-900 dark:text-white text-sm">Tiến độ gói tập</Text>
            <Text className="font-bold text-gray-900 dark:text-white text-sm">
              {client.completedSessions}/{client.totalSessions} buổi
            </Text>
          </div>
          <div className="h-2.5 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
            <div
              className="h-full bg-blue-600 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
          <Text className="text-xs text-gray-500 dark:text-gray-400 mt-1 text-right">{progress}% hoàn thành</Text>
        </div>

        {/* Last Workout & Notes Card */}
        <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-4 space-y-3">
          {/* Last workout date + focus */}
          <div className="flex items-start justify-between gap-2">
            <Text className="text-sm font-semibold text-gray-700 dark:text-gray-300">Buổi tập cuối</Text>
            <div className="text-right min-w-0">
              <Text className="text-sm font-bold text-gray-900 dark:text-white">{client.lastWorkout}</Text>
              <Text className="text-xs text-gray-500 dark:text-gray-400 truncate">{client.lastWorkoutFocus}</Text>
            </div>
          </div>

          {/* Divider */}
          <div className="border-t border-slate-100 dark:border-slate-700" />

          {/* Client note */}
          <div>
            <Text className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase mb-1.5">Ghi chú học viên</Text>
            <div className="bg-blue-50 border border-blue-100 rounded-xl p-3">
              <Text className="text-xs text-blue-900 dark:text-blue-200 leading-relaxed">{client.note}</Text>
            </div>
          </div>

          {/* Suggested action */}
          <div>
            <Text className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase mb-1.5">Gợi ý hành động</Text>
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-3">
              <Text className="text-xs text-amber-900 dark:text-amber-200 leading-relaxed">{client.suggestedAction}</Text>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col gap-2 pt-1">
          <Button variant="primary" className="inline-flex items-center justify-center text-center w-full" onClick={handleMarkContacted}>
            Đã liên hệ qua Zalo
          </Button>
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

  // Lấy hàm lưu học viên đang chọn từ Context dùng chung
  const { setSelectedInactiveClient } = useAppContext();

  // ----- (2) STATE & REF -----
  // Scroll ref riêng biệt cho Dashboard, không ảnh hưởng trang khác
  const scrollRef = useRef(null);

  // ----- (2) STATE -----

  // Khi vào trang: khôi phục vị trí cuộn đã lưu (nếu có)
  useEffect(() => {
    return restoreScroll("scroll_dashboard", scrollRef);
  }, []);

  // ----- (3) HANDLERS -----

  // Chuyển sang trang khác: lưu vị trí cuộn trước để khi bấm Back vẫn nằm đúng chỗ cũ
  const goTo = (path) => {
    saveScroll("scroll_dashboard", scrollRef);
    // Khi sang trang chính khác, xóa vị trí cuộn cũ để trang đó luôn mở từ đầu trang (scrollTop = 0)
    if (path === "/clients") resetScroll("scroll_clients");
    if (path === "/workouts") resetScroll("scroll_workouts");
    if (path === "/progress") resetScroll("scroll_progress");
    navigate(path);
  };

  // Bấm vào 1 học viên cần theo dõi: lưu vào Context rồi chuyển sang trang chi tiết
  const handleOpenDetail = (client) => {
    saveScroll("scroll_dashboard", scrollRef);
    setSelectedInactiveClient(client);
    navigate("/dashboard-client");
  };

  // ----- (4) GIAO DIỆN -----
  return (
    <Page ref={scrollRef} className="bg-gray-50 dark:bg-gray-900 min-h-screen">
      {/* Màn hình Tổng quan chính (luôn hiển thị phía sau lớp trượt) */}
      <div>
        {/* Header — safe-area-inset-top keeps title below status bar; pr-24 clears Zalo capsule */}
        <div
          className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-4 pb-3 sticky top-0 z-30 pr-24"
          style={{ paddingTop: 'max(env(safe-area-inset-top, 44px), 44px)' }}
        >
          <div className="flex items-center">
            <div className="flex-1 min-w-0">
              <Text.Title size="xLarge" className="font-bold text-gray-900 dark:text-white">Tổng quan</Text.Title>
              <Text className="text-sm text-gray-500 dark:text-gray-400">Xin chào! Dưới đây là tình hình học viên hôm nay.</Text>
            </div>
          </div>
        </div>

        {/* Sub-header: Action Button Row — sits below the title bar, fully clickable */}
        <div className="px-4 pt-3 pb-1 flex justify-end">
          <Button className="inline-flex items-center justify-center text-center" variant="primary" size="small" onClick={() => goTo('/clients')}>
            + Thêm học viên
          </Button>
        </div>

        {/* Content — chỉ <Page> cuộn, không lồng thêm vùng cuộn */}
        <div className="p-4 space-y-6 pb-28">
          {/* Stats Grid */}
          <div className="grid grid-cols-2 gap-3">
            {stats.map((stat, index) => (
              <StatCard key={index} {...stat} />
            ))}
          </div>

          {/* Inactive Clients Section */}
          <div className="bg-white rounded-xl shadow-sm dark:bg-gray-800 dark:border dark:border-gray-700">
            <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
              <Text.Title size="large" className="font-bold text-gray-900 dark:text-white">
                Học viên cần theo dõi (7-10 ngày)
              </Text.Title>
              <Button className="inline-flex items-center justify-center text-center" variant="text" size="small" onClick={() => goTo('/clients')}>Xem tất cả</Button>
            </div>
            <div className="p-4 space-y-3">
              {inactiveClients.map((client) => (
                <InactiveClientCard key={client.id} client={client} onClick={handleOpenDetail} />
              ))}
              {inactiveClients.length === 0 && (
                <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                  
                  <Text>Không có học viên cần hỏi thăm. Tuyệt vời!</Text>
                </div>
              )}
            </div>
          </div>

          {/* Management Menu */}
          <div className="bg-white rounded-xl shadow-sm p-4 space-y-3 dark:bg-gray-800 dark:border dark:border-gray-700">
            <Text.Title size="medium" className="font-bold text-gray-900 dark:text-white">Danh mục quản lý</Text.Title>
            <div className="grid grid-cols-2 gap-3">
              <Button className="bg-blue-100 border-2 border-blue-300 text-blue-800 font-bold flex flex-col items-center justify-center text-center py-3.5 px-3 rounded-xl shadow-sm text-sm" onClick={() => goTo('/clients')}>
                Quản lý học viên
              </Button>
              <Button className="bg-indigo-100 border-2 border-indigo-300 text-indigo-800 font-bold flex flex-col items-center justify-center text-center py-3.5 px-3 rounded-xl shadow-sm text-sm" onClick={() => goTo('/workouts')}>
                Lịch & Buổi tập
              </Button>
              <Button className="bg-emerald-100 border-2 border-emerald-300 text-emerald-800 font-bold flex flex-col items-center justify-center text-center py-3.5 px-3 rounded-xl shadow-sm text-sm" onClick={() => goTo('/progress')}>
                Chỉ số InBody
              </Button>
              <Button className="bg-amber-100 border-2 border-amber-300 text-amber-800 font-bold flex flex-col items-center justify-center text-center py-3.5 px-3 rounded-xl shadow-sm text-sm" onClick={() => goTo('/workouts')}>
                Đặt lịch tập mới
              </Button>
            </div>
          </div>
        </div>
      </div>
    </Page>
  );
}

export default DashboardPage;
