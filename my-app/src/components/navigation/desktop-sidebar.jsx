import NavIcon, { ChevronIcon } from "./nav-icons";
import { CRM_FILTERS, PRIMARY_LINKS, ZALO_LINK } from "./nav-config";

// Một mục điều hướng dùng chung cho trạng thái rail (tablet) và sidebar đầy đủ.
function SidebarItem({ item, active, collapsed, badgeCount, onClick }) {
  const shortLabelClass = collapsed
    ? "block leading-tight"
    : "block leading-tight lg:hidden";
  const fullLabelClass = collapsed
    ? "hidden"
    : "hidden truncate lg:block";

  return (
    <button
      type="button"
      onClick={onClick}
      aria-current={active ? "page" : undefined}
      aria-label={
        badgeCount > 0
          ? `${item.label}, ${badgeCount} tin nhắn chưa trả lời`
          : undefined
      }
      title={item.label}
      className={`relative flex w-full items-center rounded-nav transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-400 focus-visible:ring-offset-2 focus-visible:ring-offset-ink-950 ${
        collapsed
          ? "flex-col justify-center gap-1 px-1 py-2 text-[10px] font-semibold"
          : "flex-col justify-center gap-1 px-1 py-2 text-[10px] font-semibold lg:flex-row lg:justify-start lg:gap-3 lg:px-3 lg:py-2.5 lg:text-sm lg:font-medium"
      } ${
        active
          ? "bg-primary-600 text-white shadow-nav"
          : "text-ink-inactive hover:bg-ink-900 hover:text-white"
      }`}
    >
      <NavIcon name={item.icon} className="h-5 w-5 shrink-0" />
      <span className={shortLabelClass}>{item.shortLabel}</span>
      <span className={fullLabelClass}>{item.label}</span>

      {badgeCount > 0 && (
        <span
          aria-hidden="true"
          className={`absolute right-1 top-1 flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-danger px-1 text-[10px] font-bold leading-none text-white ${
            collapsed ? "" : "lg:static lg:ml-auto"
          }`}
        >
          {badgeCount > 99 ? "99+" : badgeCount}
        </span>
      )}
    </button>
  );
}

// Bộ lọc CRM ở chân sidebar; chỉ hiện khi sidebar đầy đủ.
function FilterItem({ filter, count, active, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={`flex w-full items-center gap-2 rounded-lg px-2.5 py-2 text-[13px] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-400 focus-visible:ring-offset-2 focus-visible:ring-offset-ink-950 ${
        active
          ? "bg-ink-900 font-semibold text-white"
          : "text-ink-inactive hover:bg-ink-900/70 hover:text-white"
      }`}
    >
      <span className={`h-1.5 w-1.5 shrink-0 rounded-full ${filter.dotClass}`} />
      <span className="min-w-0 flex-1 truncate text-left">{filter.label}</span>
      <span
        className={`shrink-0 rounded-full px-1.5 py-0.5 text-[10px] font-bold ${
          active ? "bg-white/10 text-white" : "bg-ink-800 text-ink-muted"
        }`}
      >
        {count}
      </span>
    </button>
  );
}

export default function DesktopSidebar({
  activeKey,
  activeFilter,
  filterCounts,
  collapsed,
  onToggleCollapsed,
  onNavigate,
  onOpenZalo,
  onSelectFilter,
}) {
  const unreadCount = filterCounts.unread || 0;
  const collapseLabel = collapsed
    ? "Mở rộng thanh điều hướng"
    : "Thu gọn thanh điều hướng";

  return (
    <aside
      className={`app-sidebar hidden h-full shrink-0 flex-col overflow-y-auto border-r border-ink-800 bg-ink-950 px-2 pb-4 md:flex md:w-[88px] lg:px-4 ${
        collapsed ? "lg:w-[76px]" : "lg:w-[264px]"
      }`}
    >
      {/* Thương hiệu: rail chỉ hiện logo, desktop hiện đầy đủ tên hệ thống */}
      <div className="flex items-center gap-3 px-2 md:justify-center lg:justify-start">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-primary-600 text-white shadow-nav">
          <NavIcon name="gym" className="h-5 w-5" />
        </div>
        <div className={`min-w-0 ${collapsed ? "hidden" : "hidden lg:block"}`}>
          <p className="truncate text-[15px] font-semibold leading-tight text-white">
            PT Manager CRM
          </p>
          <p className="mt-0.5 truncate text-[11px] leading-snug text-ink-icon">
            Hệ thống quản lý học viên
          </p>
        </div>
      </div>

      <nav id="app-primary-nav" aria-label="Điều hướng chính" className="mt-4 space-y-1">
        <p
          className={`px-2 pb-2 text-[11px] font-bold uppercase tracking-[0.06em] text-ink-icon ${
            collapsed ? "hidden" : "hidden lg:block"
          }`}
        >
          Điều hướng
        </p>
        {PRIMARY_LINKS.map((item) => (
          <SidebarItem
            key={item.id}
            item={item}
            active={activeKey === item.id}
            collapsed={collapsed}
            onClick={() => onNavigate(item.path)}
          />
        ))}
      </nav>

      <div className="mt-4 space-y-1">
        <p
          className={`px-2 pb-2 text-[11px] font-bold uppercase tracking-[0.06em] text-ink-icon ${
            collapsed ? "hidden" : "hidden lg:block"
          }`}
        >
          Tương tác
        </p>
        <SidebarItem
          item={ZALO_LINK}
          active={activeKey === ZALO_LINK.id}
          collapsed={collapsed}
          badgeCount={unreadCount}
          onClick={onOpenZalo}
        />
      </div>

      {/* CRM filters are secondary navigation; keep them out of the tablet rail. */}
      <div
        className={`mt-6 border-t border-ink-800 pt-4 ${
          collapsed ? "hidden" : "hidden lg:block"
        }`}
      >
        <p className="px-2 pb-2 text-[11px] font-bold uppercase tracking-[0.06em] text-ink-icon">
          Trạng thái CRM
        </p>
        <div className="space-y-1">
          {CRM_FILTERS.map((filter) => (
            <FilterItem
              key={filter.key}
              filter={filter}
              count={filterCounts[filter.key] || 0}
              active={activeFilter === filter.key}
              onClick={() => onSelectFilter(filter.key)}
            />
          ))}
        </div>
      </div>

      {/* Collapse control: desktop only, keyboard-accessible, state persisted by AppShell. */}
      <div className="mt-auto hidden border-t border-ink-800 pt-4 lg:block">
        <button
          type="button"
          onClick={onToggleCollapsed}
          aria-label={collapseLabel}
          aria-expanded={!collapsed}
          aria-controls="app-primary-nav"
          title={collapseLabel}
          className={`flex w-full items-center gap-2 rounded-lg py-2.5 text-sm font-medium text-ink-inactive transition-colors hover:bg-ink-900 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-400 focus-visible:ring-offset-2 focus-visible:ring-offset-ink-950 ${
            collapsed ? "justify-center px-0" : "px-3"
          }`}
        >
          <ChevronIcon
            className={`h-4 w-4 shrink-0 transition-transform ${
              collapsed ? "rotate-180" : ""
            }`}
          />
          <span className={collapsed ? "sr-only" : ""}>Thu gọn</span>
        </button>
      </div>
    </aside>
  );
}
