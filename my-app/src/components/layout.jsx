import { getSystemInfo } from "zmp-sdk";
import {
  AnimationRoutes,
  App,
  Route,
  SnackbarProvider,
  ZMPRouter,
  BottomNavigation,
} from "zmp-ui";

import DashboardPage, { DashboardClientDetail } from "../pages/dashboard";
import ClientsPage, { ClientDetailView, ClientAddView } from "../pages/clients";
import WorkoutsPage, { WorkoutDetailView, WorkoutAddView } from "../pages/workouts";
import ProgressPage, { ProgressAddView } from "../pages/progress";

const Layout = () => {
  return (
    <App theme={getSystemInfo().zaloTheme}>
      <SnackbarProvider>
        <ZMPRouter>
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
          <BottomNavigation
            tabs={[
              { key: "/", label: "Tổng quan", icon: "zi-dashboard" },
              { key: "/clients", label: "Học viên", icon: "zi-user-group" },
              { key: "/workouts", label: "Lịch & Buổi tập", icon: "zi-dumbbell" },
              { key: "/progress", label: "Tiến độ", icon: "zi-chart-line" },
            ]}
          />
        </ZMPRouter>
      </SnackbarProvider>
    </App>
  );
};
export default Layout;