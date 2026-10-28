import { useCallback, useEffect, useLayoutEffect, useRef } from "react";

// ============================================
// SCROLL RESTORATION (hook dùng chung cho mọi trang)
// ============================================
// Lưu scrollTop của vùng cuộn thật sự (window / .zaui-page / <Page> div)
// vào sessionStorage, rồi khôi phục đúng vị trí khi quay về.
//
// Cách dùng:
//   const { ref: scrollRef, save: saveScroll } = useScrollRestoration("dashboard", !selectedClient);
//   <Page ref={scrollRef} ...>...</Page>
//
// - active = true  -> view danh sách chính: ghi nhớ + khôi phục vị trí
// - active = false -> view con (chi tiết / form thêm): tự cuộn lên đầu

const STORAGE_PREFIX = "scroll_";

// Thử lại vài lần vì chiều cao nội dung (ảnh, danh sách) có thể chưa render xong
const RESTORE_DELAYS = [0, 50, 140, 280, 500];

function readSavedTop(key) {
  if (typeof window === "undefined") return 0;
  try {
    const value = Number(window.sessionStorage.getItem(STORAGE_PREFIX + key));
    return Number.isFinite(value) && value > 0 ? value : 0;
  } catch (error) {
    return 0;
  }
}

function writeSavedTop(key, value) {
  if (typeof window === "undefined") return;
  try {
    window.sessionStorage.setItem(
      STORAGE_PREFIX + key,
      String(Math.max(0, Math.round(value)))
    );
  } catch (error) {
    // sessionStorage có thể bị chặn (chế độ riêng tư) -> bỏ qua an toàn
  }
}

// Tìm phần tử đang thật sự cuộn: <Page> được truyền vào -> .zaui-page bao ngoài -> window
function resolveScroller(hostEl) {
  const candidates = [];
  if (hostEl) {
    candidates.push(hostEl);
    const closestPage =
      typeof hostEl.closest === "function" ? hostEl.closest(".zaui-page") : null;
    if (closestPage && closestPage !== hostEl) candidates.push(closestPage);
  } else if (typeof document !== "undefined") {
    const anyPage = document.querySelector(".zaui-page");
    if (anyPage) candidates.push(anyPage);
  }
  if (typeof window !== "undefined") candidates.push(window);

  for (let i = 0; i < candidates.length; i += 1) {
    const candidate = candidates[i];
    if (candidate === window) {
      const docEl = document.documentElement;
      if (docEl && docEl.scrollHeight - window.innerHeight > 4) return window;
      if ((window.scrollY || 0) > 0) return window;
      continue;
    }
    if (candidate.scrollHeight - candidate.clientHeight > 4) return candidate;
    if ((candidate.scrollTop || 0) > 0) return candidate;
  }

  return candidates[0] || null;
}

function getScrollTop(scroller) {
  if (!scroller) return 0;
  if (scroller === window) {
    return (
      window.scrollY ||
      (document.documentElement && document.documentElement.scrollTop) ||
      0
    );
  }
  return scroller.scrollTop || 0;
}

function setScrollTop(scroller, top) {
  if (!scroller) return;
  if (scroller === window) {
    window.scrollTo(0, top);
    return;
  }
  if (typeof scroller.scrollTo === "function") {
    scroller.scrollTo({ top, left: 0, behavior: "auto" });
    return;
  }
  scroller.scrollTop = top;
}

// Đánh dấu trang đã từng được mở trong phiên này.
// Lần mount ĐẦU TIÊN thì luôn bắt đầu từ đầu trang (không khôi phục vị trí cũ của phiên trước),
// các lần mount sau (quay lại từ trang khác) mới khôi phục.
const visitedKeys = new Set();

export function useScrollRestoration(key, active = true) {
  const hostRef = useRef(null);
  const topRef = useRef(0);
  const scrollerRef = useRef(null);
  const frameRef = useRef(0);
  // Chặn ghi đè sessionStorage bằng 0 trong lúc đang khôi phục
  const readyRef = useRef(false);
  // Chặn ghi khi đang chuyển sang view con (sự kiện scroll = 0 là do mình tạo ra)
  const suppressRef = useRef(false);

  // Lưu ngay vị trí hiện tại (gọi trước khi navigate sang trang khác)
  const save = useCallback(() => {
    const scroller = scrollerRef.current || resolveScroller(hostRef.current);
    if (!scroller) return;
    const top = getScrollTop(scroller);
    topRef.current = top;
    writeSavedTop(key, top);
  }, [key]);

  // 1) Khôi phục vị trí khi view danh sách được hiển thị lại
  useLayoutEffect(() => {
    if (!active) return undefined;

    // Lần mở đầu tiên trong phiên: bắt đầu từ đầu trang
    const isFirstMount = !visitedKeys.has(key);
    visitedKeys.add(key);

    // Đọc 1 lần duy nhất, trước khi bất kỳ scroll listener nào kịp ghi đè
    const savedTop = isFirstMount ? 0 : readSavedTop(key);
    topRef.current = savedTop;
    readyRef.current = savedTop <= 0;

    if (savedTop <= 0) return undefined;

    let cancelled = false;
    const timers = [];

    // Thử khôi phục NGAY trong layout effect (trước khi browser paint) để tránh nháy,
    // sau đó retry thêm vài lần nếu nội dung chưa render đủ chiều cao.
    const applyOnce = (index) => {
      if (cancelled) return true;
      const scroller = resolveScroller(hostRef.current);
      if (!scroller) return false;

      scrollerRef.current = scroller;
      setScrollTop(scroller, savedTop);

      if (Math.abs(getScrollTop(scroller) - savedTop) <= 2) {
        readyRef.current = true;
        return true;
      }
      if (index >= RESTORE_DELAYS.length - 1) {
        // Hết lượt retry: chấp nhận vị trí thấp nhất có thể để không kẹt listener
        readyRef.current = true;
        return true;
      }
      return false;
    };

    if (applyOnce(0)) return undefined;

    const attempt = (index) => {
      if (cancelled || index >= RESTORE_DELAYS.length) {
        readyRef.current = true;
        return;
      }

      timers.push(
        setTimeout(() => {
          if (!applyOnce(index)) attempt(index + 1);
        }, RESTORE_DELAYS[index])
      );
    };

    attempt(1);

    return () => {
      cancelled = true;
      readyRef.current = true;
      timers.forEach((timer) => clearTimeout(timer));
    };
  }, [key, active]);

  // 2) Ghi nhớ vị trí cuộn trong lúc view danh sách đang hiển thị
  useEffect(() => {
    if (!active) return undefined;

    const scroller = resolveScroller(hostRef.current);
    if (!scroller) return undefined;
    scrollerRef.current = scroller;

    const target = scroller === window ? window : scroller;

    const handleScroll = () => {
      if (!readyRef.current || suppressRef.current) return;
      topRef.current = getScrollTop(scroller);
      cancelAnimationFrame(frameRef.current);
      frameRef.current = requestAnimationFrame(() =>
        writeSavedTop(key, topRef.current)
      );
    };

    target.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      target.removeEventListener("scroll", handleScroll);
      cancelAnimationFrame(frameRef.current);
      // Chỉ ghi khi đã thật sự cuộn, tránh xoá giá trị đã lưu bằng 0
      if (topRef.current > 0) writeSavedTop(key, topRef.current);
    };
  }, [key, active]);

  // 3) Mở view con (chi tiết / form thêm) -> đưa view con về đầu trang
  useLayoutEffect(() => {
    if (active) {
      // Quay lại view danh sách: mở khoá ghi nhớ vị trí
      suppressRef.current = false;
      return undefined;
    }

    let secondFrame = 0;
    const firstFrame = requestAnimationFrame(() => {
      secondFrame = requestAnimationFrame(() => {
        const scroller = resolveScroller(hostRef.current);
        if (!scroller) return;
        // Đang ở view con: bỏ qua scroll event do chính mình tạo ra
        suppressRef.current = true;
        setScrollTop(scroller, 0);
        setTimeout(() => {
          suppressRef.current = false;
        }, 120);
      });
    });

    return () => {
      cancelAnimationFrame(firstFrame);
      cancelAnimationFrame(secondFrame);
      suppressRef.current = false;
    };
  }, [active]);

  return { ref: hostRef, save };
}

export default useScrollRestoration;
