import { getSystemInfo } from "zmp-sdk";
import {
  AnimationRoutes,
  App,
  Route,
  SnackbarProvider,
  ZMPRouter,
  BottomNavigation,
} from "zmp-ui";

import DashboardPage from "../pages/dashboard";
import ClientsPage from "../pages/clients";
import WorkoutsPage from "../pages/workouts";
import ProgressPage from "../pages/progress";

const Layout = () => {
  return (
    <App theme={getSystemInfo().zaloTheme}>
      <SnackbarProvider>
        <ZMPRouter>
          <AnimationRoutes>
            <Route path="/" element={<DashboardPage />} />
            <Route path="/clients" element={<ClientsPage />} />
            <Route path="/workouts" element={<WorkoutsPage />} />
            <Route path="/progress" element={<ProgressPage />} />
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