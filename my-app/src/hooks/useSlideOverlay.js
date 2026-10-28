import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";

// ============================================
// SLIDING OVERLAY STACK (dùng chung cho mọi trang)
// ============================================
// View con (chi tiết / form thêm) được render trong một overlay `position: fixed`
// nằm CÙNG CẤP với danh sách chính (sibling), không lồng vào phần tử có transform.
//
// Vì sao phải là sibling? `position: fixed` của một phần tử nằm trong cha có
// `transform` sẽ lấy chính cha đó làm containing block => overlay bị đẩy lệch
// và cắt mất mép. Cha (và <Page>) vì thế luôn giữ `transform: none`.
//
// Cách dùng:
//   const panel = useSlideOverlay();
//   panel.open({ type: "detail", client });
//   panel.close();
//
//   {panel.isVisible && (
//     <div ref={panel.overlayRef} style={panel.overlayStyle}
//          className="bg-slate-100 overflow-y-auto pb-28" />
//   )}
//
// Luồng animation:
//   - Mở: gán payload -> 2 frame -> isOpen = true
//     => trượt từ translate3d(100%,0,0) về translate3d(0,0,0).
//   - Đóng: isOpen = false trước (trượt ra phải), sau EXIT_MS mới xoá payload
//     => cả chiều vào và chiều ra đều mượt, không bị "snap" 0ms.

// Thời lượng transition của overlay (khớp với style bên dưới)
const SLIDE_MS = 260;
// Chờ lâu hơn transition một chút trước khi unmount nội dung
const EXIT_MS = SLIDE_MS + 40;

export function useSlideOverlay() {
  const [payload, setPayload] = useState(null);
  const [isOpen, setIsOpen] = useState(false);

  const overlayRef = useRef(null);
  const enterFrameRef = useRef(0);
  const enterFrame2Ref = useRef(0);
  const exitTimerRef = useRef(0);

  const open = useCallback((nextPayload) => {
    clearTimeout(exitTimerRef.current);
    cancelAnimationFrame(enterFrameRef.current);
    cancelAnimationFrame(enterFrame2Ref.current);

    setPayload(nextPayload);
    // Bắt đầu từ ngoài màn hình (translate3d(100%,0,0)) rồi mới bật isOpen.
    // Hai frame liên tiếp để chắc chắn browser đã PAINT trạng thái off-screen;
    // nếu bật quá sớm trong cùng một frame, browser sẽ gộp 2 giá trị và
    // transition không chạy (view hiện ra tức thì).
    enterFrameRef.current = requestAnimationFrame(() => {
      enterFrame2Ref.current = requestAnimationFrame(() => {
        setIsOpen(true);
      });
    });
  }, []);

  const close = useCallback(() => {
    cancelAnimationFrame(enterFrameRef.current);
    cancelAnimationFrame(enterFrame2Ref.current);
    setIsOpen(false);

    clearTimeout(exitTimerRef.current);
    exitTimerRef.current = setTimeout(() => {
      setPayload(null);
    }, EXIT_MS);
  }, []);

  // Mỗi lần mở nội dung mới: overlay luôn bắt đầu từ đầu trang
  useLayoutEffect(() => {
    if (!payload) return;
    const node = overlayRef.current;
    if (node) node.scrollTop = 0;
  }, [payload]);

  useEffect(
    () => () => {
      cancelAnimationFrame(enterFrameRef.current);
      cancelAnimationFrame(enterFrame2Ref.current);
      clearTimeout(exitTimerRef.current);
    },
    []
  );

  const overlayStyle = {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    width: "100%",
    zIndex: 50,
    transform: isOpen ? "translate3d(0, 0, 0)" : "translate3d(100%, 0, 0)",
    transition: `transform ${SLIDE_MS}ms cubic-bezier(0.22, 1, 0.36, 1)`,
    willChange: "transform",
    WebkitOverflowScrolling: "touch",
    // Không để thao tác cuộn của overlay "chảy" xuống danh sách phía sau
    overscrollBehavior: "contain",
  };

  return {
    payload,
    setPayload,
    isOpen,
    isVisible: payload !== null,
    open,
    close,
    overlayRef,
    overlayStyle,
  };
}

export default useSlideOverlay;