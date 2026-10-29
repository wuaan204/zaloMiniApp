// ============================================
// Quản lý vị trí cuộn cho từng trang độc lập (dùng ref)
// ============================================
// Tuyệt đối không dùng document.querySelector('.zaui-page') hay window.scrollTo
// để tránh rò rỉ vị trí cuộn giữa các trang đang chạy hiệu ứng chuyển trang (AnimationRoutes).

// Lưu vị trí cuộn của trang hiện tại vào sessionStorage trước khi chuyển trang
export function saveScroll(key, ref) {
  if (ref && ref.current) {
    sessionStorage.setItem(key, String(ref.current.scrollTop));
  }
}

// Khôi phục vị trí cuộn từ sessionStorage cho chính phần tử ref của trang đó
export function restoreScroll(key, ref) {
  const saved = Number(sessionStorage.getItem(key));
  if (!saved || !ref) return () => {};

  const timer = setTimeout(() => {
    if (ref.current) {
      ref.current.scrollTop = saved;
    }
  }, 30);

  return () => clearTimeout(timer);
}

// Đặt lại (xóa) vị trí cuộn khi muốn trang đích bắt đầu từ đầu trang (scrollTop = 0)
export function resetScroll(key) {
  sessionStorage.removeItem(key);
}
