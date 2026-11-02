// React core
import React from "react";
import { createRoot } from "react-dom/client";

// ZaUI stylesheet
import "zmp-ui/zaui.css";

// Tailwind stylesheet
import "./css/tailwind.scss";

// Your stylesheet
import "./css/app.scss";

// Expose app configuration
import appConfig from "../app-config.json";
if (!window.APP_CONFIG) {
  window.APP_CONFIG = appConfig;
}

// Mount the app
import Layout from "./components/layout";
// Context dùng chung: giữ state (học viên, buổi tập, InBody...) cho mọi trang
import { AppProvider } from "./context/AppContext";

// ----- KHOÁ CHẾ ĐỘ SÁNG -----
// Xoá mọi dấu vết Dark Mode cũ và bắt trình duyệt luôn dùng bảng màu sáng,
// kể cả khi điện thoại / Zalo WebView đang bật Dark Mode.
document.documentElement.classList.remove("dark", "dark-mode");
document.body.classList.remove("dark", "dark-mode");
document.documentElement.style.colorScheme = "light";
document.body.style.colorScheme = "light";
// Xoá lựa chọn "Chế độ tối" cũ (nếu trước đây người dùng đã bật)
localStorage.removeItem("pt_dark_mode");

const root = createRoot(document.getElementById("app"));
root.render(
  React.createElement(AppProvider, null, React.createElement(Layout))
);