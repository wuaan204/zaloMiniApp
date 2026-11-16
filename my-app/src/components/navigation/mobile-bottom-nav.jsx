import NavIcon from "./nav-icons";
import { MOBILE_TABS } from "./nav-config";

export default function MobileBottomNav({
  activeKey,
  unreadCount,
  onNavigate,
  onOpenZalo,
}) {
  // Bấm tab chính -> đánh dấu để AppShell tắt animation chuyển trang
  const markTabClick = () => {
    try {
      sessionStorage.setItem("nav_direction", "tab");
    } catch (error) {
      // Trình duyệt chặn storage -> bỏ qua
    }
  };

  return (
    <nav
      aria-label="Điều hướng chính"
      className="app-bottom-nav fixed inset-x-0 bottom-0 z-50 border-t border-line bg-surface md:hidden"
    >
      <div className="app-bottom-nav__inner flex items-stretch justify-around px-1">
        {MOBILE_TABS.map((item) => {
          const isChat = item.id === "chat";
          const active = activeKey === item.id;
          const count = isChat ? unreadCount : 0;
          const accessibleLabel =
            isChat && count > 0
              ? `${item.mobileLabel}, ${count} tin nhắn chưa trả lời`
              : item.mobileLabel;

          return (
            <button
              key={item.id}
              type="button"
              onClick={() => {
                markTabClick();
                if (isChat) onOpenZalo();
                else onNavigate(item.path);
              }}
              aria-current={active ? "page" : undefined}
              aria-label={accessibleLabel}
              className={`relative flex min-h-[64px] flex-1 flex-col items-center justify-center gap-1 px-1 text-[11px] font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-inset ${
                active ? "text-primary-600" : "text-content-muted"
              }`}
            >
              {active && (
                <span
                  aria-hidden="true"
                  className="absolute top-0 h-0.5 w-6 rounded-full bg-primary-600"
                />
              )}

              <span
                className={`relative flex h-6 w-9 items-center justify-center rounded-md ${
                  active ? "bg-primary-50" : ""
                }`}
              >
                <NavIcon name={item.icon} className="h-[22px] w-[22px]" />
                {isChat && count > 0 && (
                  <span
                    aria-hidden="true"
                    className="absolute -right-1.5 -top-1.5 flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-danger px-1 text-[10px] font-bold leading-none text-white"
                  >
                    {count > 99 ? "99+" : count}
                  </span>
                )}
              </span>

              <span className="leading-tight">{item.mobileLabel}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
