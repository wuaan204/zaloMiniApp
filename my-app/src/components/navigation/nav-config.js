// Cấu hình điều hướng dùng chung cho sidebar desktop, rail tablet và bottom nav mobile.
// Chỉ chứa dữ liệu hiển thị; mọi hành vi điều hướng vẫn do AppShell truyền vào.

export const PRIMARY_LINKS = [
  {
    id: "dashboard",
    path: "/",
    label: "Tổng quan",
    shortLabel: "Tổng quan",
    mobileLabel: "Tổng quan",
    icon: "dashboard",
  },
  {
    id: "clients",
    path: "/clients",
    label: "Quản lý học viên",
    shortLabel: "Học viên",
    mobileLabel: "Học viên",
    icon: "users",
  },
  {
    id: "workouts",
    path: "/workouts",
    label: "Lịch & Buổi tập",
    shortLabel: "Lịch tập",
    mobileLabel: "Lịch tập",
    icon: "calendar",
  },
  {
    id: "progress",
    path: "/progress",
    label: "Chỉ số InBody",
    shortLabel: "InBody",
    mobileLabel: "InBody",
    icon: "progress",
  },
];

export const ZALO_LINK = {
  id: "chat",
  path: "/clients",
  label: "Hộp thư Chat Zalo",
  shortLabel: "Chat Zalo",
  mobileLabel: "Chat Zalo",
  icon: "chat",
};

export const MOBILE_TABS = [
  PRIMARY_LINKS[0],
  PRIMARY_LINKS[1],
  ZALO_LINK,
  PRIMARY_LINKS[2],
  PRIMARY_LINKS[3],
];

export const CRM_FILTERS = [
  { key: "all", label: "Tất cả", dotClass: "bg-slate-400" },
  { key: "unread", label: "Chờ phản hồi Zalo", dotClass: "bg-danger" },
  { key: "inactive", label: "Vắng >= 7 ngày", dotClass: "bg-warning" },
  { key: "lowSession", label: "Sắp hết gói", dotClass: "bg-orange-500" },
];

// Xác định mục đang hoạt động từ route + bộ lọc CRM hiện tại.
// Giữ nguyên cách hiểu cũ: khách đang chờ Zalo thì mục Chat Zalo được tô đậm.
export function getActiveNavKey(pathname, activeClientFilter) {
  if (pathname === "/") return "dashboard";
  if (pathname.startsWith("/clients")) {
    return activeClientFilter === "unread" ? "chat" : "clients";
  }
  if (pathname.startsWith("/workouts")) return "workouts";
  if (pathname.startsWith("/progress")) return "progress";
  return "";
}
