import { useState } from "react";
import {
  AnimationRoutes,
  App,
  Route,
  SnackbarProvider,
  ZMPRouter,
  useLocation,
  useNavigate,
} from "zmp-ui";

import DashboardPage, { DashboardClientDetail } from "../pages/dashboard";
import ClientsPage, { ClientDetailView, ClientAddView } from "../pages/clients";
import WorkoutsPage, { WorkoutDetailView, WorkoutAddView } from "../pages/workouts";
import ProgressPage, { ProgressAddView } from "../pages/progress";
import { useAppContext } from "../context/AppContext";
import { resetScroll } from "../utils/scroll";
import DesktopSidebar from "./navigation/desktop-sidebar";
import MobileBottomNav from "./navigation/mobile-bottom-nav";
import { getActiveNavKey } from "./navigation/nav-config";

// Khoá lưu trạng thái thu gọn sidebar (chỉ là UI state, không ảnh hưởng dữ liệu).
const SIDEBAR_COLLAPSED_KEY = "pt_sidebar_collapsed";

function readSidebarCollapsed() {
  try {
    return window.localStorage.getItem(SIDEBAR_COLLAPSED_KEY) === "1";
  } catch (error) {
    return false;
  }
}

// Khung ứng dụng nằm BÊN TRONG ZMPRouter để dùng được useNavigate / useLocation
function AppShell() {
  const navigate = useNavigate();
  const location = useLocation();

  // Lấy danh sách học viên, bộ lọc hiện tại và số tin Zalo chưa trả lời
  const {
    clients,
    activeClientFilter,
    setActiveClientFilter,
    unreadZaloCount,
  } = useAppContext();

  // Trạng thái thu gọn sidebar: đọc đồng bộ ngay lần render đầu để không bị layout shift.
  const [sidebarCollapsed, setSidebarCollapsed] = useState(readSidebarCollapsed);

  // Số khách vắng lâu và sắp hết gói để hiện pill đếm trên sidebar
  const inactiveClientCount = clients.filter((c) => c.inactiveDays >= 7).length;
  const lowSessionClientCount = clients.filter((c) => {
    const remaining = c.packageTotal - c.packageUsed;
    return remaining <= 3 && remaining > 0;
  }).length;
  const filterCounts = {
    all: clients.length,
    unread: unreadZaloCount,
    inactive: inactiveClientCount,
    lowSession: lowSessionClientCount,
  };

  // Mục đang mở trên desktop / rail / bottom nav
  const activeNavKey = getActiveNavKey(location.pathname, activeClientFilter);
  const activeFilterForKey =
    location.pathname === "/clients" ? activeClientFilter : null;

  // Chuyển trang chính; bấm "Quản lý học viên" thì trả bộ lọc về Tất cả
  const goToPage = (path) => {
    if (path === "/clients") setActiveClientFilter("all");
    navigate(path);
  };

  // Mở trang Học viên kèm danh mục CRM đã chọn
  const openClientFilter = (filterKey) => {
    setActiveClientFilter(filterKey);
    resetScroll("scroll_clients");
    if (location.pathname !== "/clients") navigate("/clients");
  };

  // Mở thẳng hộp thư Zalo: chuyển sang danh sách khách đang chờ trả lời
  const openZaloInbox = () => {
    openClientFilter("unread");
  };

  // Thu gọn/mở rộng sidebar và lưu lựa chọn cho lần tải sau.
  const toggleSidebarCollapsed = () => {
    setSidebarCollapsed((previous) => {
      const next = !previous;
      try {
        window.localStorage.setItem(SIDEBAR_COLLAPSED_KEY, next ? "1" : "0");
      } catch (error) {
        // Trình duyệt chặn storage -> vẫn đổi giao diện trong phiên hiện tại
      }
      return next;
    });
  };

  return (
    // Khung responsive: sidebar/rail bên trái trên tablet + PC, nội dung bên phải
    <div className="flex h-screen w-full flex-col overflow-hidden bg-slate-100 md:flex-row">
      <DesktopSidebar
        activeKey={activeNavKey}
        activeFilter={activeFilterForKey}
        filterCounts={filterCounts}
        collapsed={sidebarCollapsed}
        onToggleCollapsed={toggleSidebarCollapsed}
        onNavigate={goToPage}
        onOpenZalo={openZaloInbox}
        onSelectFilter={openClientFilter}
      />

      {/* Vùng nội dung chính: giữ nguyên scroll container và padding hiện tại */}
      <main className="h-full w-full min-w-0 flex-1 overflow-hidden bg-slate-100">
        <div className="h-full w-full min-w-0">
          <AnimationRoutes>
            {/* Mọi màn hình (kể cả màn chi tiết / form thêm) đều là Route thật
                để AnimationRoutes tạo hiệu ứng trượt giống hệt nhau */}
            <Route path="/" element={<DashboardPage />} />
            <Route path="/dashboard-client" element={<DashboardClientDetail />} />
            <Route path="/clients" element={<ClientsPage />} />
            <Route path="/client-detail" element={<ClientDetailView />} />
            <Route path="/client-add" element={<ClientAddView />} />
            <Route path="/workouts" element={<WorkoutsPage />} />
            <Route path="/workout-detail" element={<WorkoutDetailView />} />
            <Route path="/workout-add" element={<WorkoutAddView />} />
            <Route path="/progress" element={<ProgressPage />} />
            <Route path="/progress-add" element={<ProgressAddView />} />
          </AnimationRoutes>
        </div>
      </main>

      <MobileBottomNav
        activeKey={activeNavKey}
        unreadCount={unreadZaloCount}
        onNavigate={goToPage}
        onOpenZalo={openZaloInbox}
      />
    </div>
  );
}

const Layout = () => {
  // theme="light": luôn khoá giao diện ở chế độ Sáng, không theo Dark Mode của Zalo
  return (
    <App theme="light">
      <SnackbarProvider>
        <ZMPRouter>
          <AppShell />
        </ZMPRouter>
      </SnackbarProvider>
    </App>
  );
};
export default Layout;
