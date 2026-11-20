import { useState, useEffect, useRef } from "react";
import { BrowserRouter, Routes, Route, NavLink, useLocation, Link } from "react-router-dom";
import { Icon, icons } from "./components/Icon";
import Overview from "./pages/Overview";
import Users from "./pages/Users";
import Orders from "./pages/Orders";
import Revenue from "./pages/Revenue";
import Reports from "./pages/Reports";
import Settings from "./pages/Settings";

/* ── Nav config ── */
const NAV_GROUPS = [
  {
    label: "Main",
    items: [
      { to: "/",        label: "Overview",  icon: icons.grid,     badge: null },
      { to: "/users",   label: "Users",     icon: icons.users,    badge: "12" },
      { to: "/orders",  label: "Orders",    icon: icons.cart,     badge: "5" },
      { to: "/revenue", label: "Revenue",   icon: icons.chart,    badge: null },
    ]
  },
  {
    label: "Reports",
    items: [
      { to: "/reports",  label: "Reports",  icon: icons.file,     badge: "3" },
    ]
  },
  {
    label: "System",
    items: [
      { to: "/settings", label: "Settings", icon: icons.settings, badge: null },
    ]
  }
];

const PAGE_META = {
  "/":        { title: "Overview",  icon: icons.grid },
  "/users":   { title: "Users",     icon: icons.users },
  "/orders":  { title: "Orders",    icon: icons.cart },
  "/revenue": { title: "Revenue",   icon: icons.chart },
  "/reports": { title: "Reports",   icon: icons.file },
  "/settings":{ title: "Settings",  icon: icons.settings },
};

const NOTIFICATIONS = [
  { id: 1, type: "payment", msg: "Hana Kobayashi payment failed",  time: "3m ago",  read: false },
  { id: 2, type: "user",    msg: "Daniel Cho invited 12 teammates", time: "1h ago",  read: false },
  { id: 3, type: "system",  msg: "Nightly backup completed",        time: "41m ago", read: true  },
  { id: 4, type: "upgrade", msg: "Priya Sharma upgraded to Pro",    time: "2h ago",  read: true  },
];

/* ── Sidebar ── */
function Sidebar({ collapsed, setCollapsed, mobileOpen, setMobileOpen }) {
  const location = useLocation();

  return (
    <>
      {/* Backdrop */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-30 lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      <aside
        className={`
          fixed lg:relative z-40 h-screen flex flex-col
          bg-bg-sidebar border-r border-border-main
          transition-all duration-300 ease-in-out shrink-0
          ${collapsed ? "w-[72px]" : "w-[240px]"}
          ${mobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
        `}
      >
        {/* Logo */}
        <div className={`flex items-center h-16 border-b border-border-main shrink-0 transition-all duration-300 ${collapsed ? "px-0 justify-center" : "px-5 gap-3"}`}>
          <div className="w-8 h-8 rounded-xl bg-accent flex items-center justify-center shrink-0 shadow-sm">
            <span className="text-accent-foreground font-black text-sm font-display">N</span>
          </div>
          <div className={`overflow-hidden transition-all duration-300 ${collapsed ? "w-0 opacity-0" : "w-auto opacity-100"}`}>
            <span className="font-display font-bold text-[15px] tracking-tight text-text-main whitespace-nowrap">Nimbus</span>
            <span className="block text-[10px] text-text-dim font-medium">Admin Console</span>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto overflow-x-hidden py-4 space-y-5">
          {NAV_GROUPS.map(group => (
            <div key={group.label}>
              {!collapsed && (
                <p className="px-5 text-[10px] font-semibold uppercase tracking-widest text-text-dim mb-1.5 transition-all duration-300">
                  {group.label}
                </p>
              )}
              <div className="px-2 space-y-0.5">
                {group.items.map(item => (
                  <NavLink
                    key={item.to}
                    to={item.to}
                    end={item.to === "/"}
                    onClick={() => setMobileOpen(false)}
                    title={collapsed ? item.label : undefined}
                    className={({ isActive }) => `
                      group relative flex items-center rounded-xl px-3 py-2.5 transition-all duration-150 cursor-pointer
                      ${collapsed ? "justify-center" : "gap-3"}
                      ${isActive
                        ? "bg-accent-light text-accent shadow-[inset_0_0_0_1px_var(--accent-border)] font-semibold"
                        : "text-text-muted hover:text-text-main hover:bg-bg-hover"
                      }
                    `}
                  >
                    {({ isActive }) => (
                      <>
                        {isActive && (
                          <span className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-5 rounded-r-full bg-accent" />
                        )}
                        <Icon path={item.icon} className="w-[18px] h-[18px] shrink-0" style={{ width: "18px", height: "18px" }} />
                        <span className={`text-[13px] font-medium whitespace-nowrap overflow-hidden transition-all duration-300 ${collapsed ? "w-0 opacity-0" : "w-auto opacity-100"}`}>
                          {item.label}
                        </span>
                        {item.badge && !collapsed && (
                          <span className={`ml-auto text-[10px] font-bold px-1.5 py-0.5 rounded-full min-w-[18px] text-center
                            ${isActive ? "bg-accent/20 text-accent" : "bg-bg-hover text-text-muted"}`}>
                            {item.badge}
                          </span>
                        )}
                        {item.badge && collapsed && (
                          <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-accent" />
                        )}
                      </>
                    )}
                  </NavLink>
                ))}
              </div>
            </div>
          ))}
        </nav>

        {/* User + Collapse */}
        <div className="border-t border-border-main shrink-0">
          {/* User card */}
          <div className={`flex items-center gap-3 p-3 m-2 rounded-xl hover:bg-bg-hover cursor-pointer transition-colors ${collapsed ? "justify-center" : ""}`}>
            <div className="w-8 h-8 rounded-full bg-accent flex items-center justify-center text-[11px] font-bold text-accent-foreground shrink-0">RJ</div>
            <div className={`flex-1 min-w-0 overflow-hidden transition-all duration-300 ${collapsed ? "w-0 opacity-0" : "w-auto opacity-100"}`}>
              <p className="text-[12px] font-semibold text-text-main truncate whitespace-nowrap">Riya Jain</p>
              <p className="text-[10px] text-text-dim truncate whitespace-nowrap">Administrator</p>
            </div>
            {!collapsed && <Icon path={icons.chevronDown} className="w-3.5 h-3.5 text-text-dim shrink-0" />}
          </div>
          {/* Collapse button */}
          <button
            onClick={() => setCollapsed(c => !c)}
            className={`w-full flex items-center gap-3 px-5 py-3 text-[12px] text-text-dim hover:text-text-main hover:bg-bg-hover transition-all duration-150 ${collapsed ? "justify-center" : ""}`}
          >
            <Icon path={icons.chevronsLeft} className={`w-4 h-4 transition-transform duration-300 ${collapsed ? "rotate-180" : ""}`} />
            {!collapsed && <span className="whitespace-nowrap overflow-hidden transition-all duration-300">Collapse sidebar</span>}
          </button>
        </div>
      </aside>
    </>
  );
}

/* ── Topbar ── */
function Topbar({ mobileOpen, setMobileOpen, theme, toggleTheme }) {
  const [profileOpen, setProfileOpen]   = useState(false);
  const [notifOpen, setNotifOpen]       = useState(false);
  const [unread, setUnread]             = useState(NOTIFICATIONS.filter(n => !n.read).length);
  const location = useLocation();
  const meta = PAGE_META[location.pathname] || { title: "Page", icon: icons.grid };
  const profileRef = useRef(null);
  const notifRef   = useRef(null);

  // Close dropdowns on outside click
  useEffect(() => {
    const handler = (e) => {
      if (profileRef.current && !profileRef.current.contains(e.target)) setProfileOpen(false);
      if (notifRef.current   && !notifRef.current.contains(e.target))   setNotifOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <header className="h-16 shrink-0 border-b border-border-main bg-bg-sidebar/90 backdrop-blur-md sticky top-0 z-20 flex items-center gap-3 px-4 lg:px-6">
      {/* Mobile menu */}
      <button
        className="lg:hidden w-9 h-9 flex items-center justify-center rounded-xl text-text-muted hover:text-text-main hover:bg-bg-hover transition-colors"
        onClick={() => setMobileOpen(true)}
      >
        <Icon path={icons.menu} className="w-5 h-5" />
      </button>

      {/* Breadcrumb */}
      <div className="hidden lg:flex items-center gap-2 text-[13px]">
        <span className="text-text-dim">Nimbus</span>
        <Icon path={icons.chevronRight} className="w-3.5 h-3.5 text-border-main" />
        <span className="text-text-main font-medium">{meta.title}</span>
      </div>

      <div className="flex-1" />

      {/* System status */}
      <div className="hidden md:flex items-center gap-2 text-[11px] text-text-dim font-medium mr-2">
        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
        All systems operational
      </div>

      {/* Theme Toggle */}
      <button
        onClick={toggleTheme}
        className="w-9 h-9 flex items-center justify-center rounded-xl text-text-muted hover:text-text-main hover:bg-bg-hover transition-colors"
        title="Toggle Theme"
      >
        <Icon path={theme === "dark" ? icons.sun : icons.moon} className="w-[18px] h-[18px]" />
      </button>

      {/* Notifications */}
      <div className="relative" ref={notifRef}>
        <button
          onClick={() => { setNotifOpen(o => !o); if (!notifOpen) setUnread(0); }}
          className="relative w-9 h-9 flex items-center justify-center rounded-xl text-text-muted hover:text-text-main hover:bg-bg-hover transition-colors"
        >
          <Icon path={icons.bell} className="w-[18px] h-[18px]" />
          {unread > 0 && (
            <span className="absolute top-1.5 right-1.5 w-4 h-4 rounded-full bg-red-500 text-white text-[9px] font-bold flex items-center justify-center leading-none">
              {unread}
            </span>
          )}
        </button>
        {notifOpen && (
          <div className="absolute right-0 top-full mt-2 w-80 bg-bg-sidebar border border-border-main rounded-2xl shadow-2xl z-30 overflow-hidden"
            style={{ animation: "menuIn 0.15s ease" }}>
            <div className="flex items-center justify-between px-4 py-3 border-b border-border-main">
              <p className="text-[13px] font-semibold text-text-main">Notifications</p>
              <button className="text-[11px] text-accent hover:underline">Mark all read</button>
            </div>
            <div className="divide-y divide-border-main/50 max-h-80 overflow-y-auto">
              {NOTIFICATIONS.map(n => (
                <div key={n.id} className={`flex gap-3 px-4 py-3 hover:bg-bg-hover cursor-pointer transition-colors ${!n.read ? "bg-accent-light/30" : ""}`}>
                  <div className={`w-2 h-2 rounded-full mt-1.5 shrink-0 ${!n.read ? "bg-accent" : "bg-transparent"}`} />
                  <div className="min-w-0 flex-1">
                    <p className="text-[12px] text-text-main leading-snug">{n.msg}</p>
                    <p className="text-[10px] text-text-dim mt-0.5">{n.time}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="px-4 py-2.5 border-t border-border-main text-center">
              <button className="text-[12px] text-accent hover:underline">View all notifications</button>
            </div>
          </div>
        )}
      </div>

      {/* Profile */}
      <div className="relative" ref={profileRef}>
        <button
          onClick={() => setProfileOpen(o => !o)}
          className="flex items-center gap-2 pl-1 pr-2 py-1 rounded-xl hover:bg-bg-hover transition-colors"
        >
          <div className="w-8 h-8 rounded-full bg-accent flex items-center justify-center text-[11px] font-bold text-accent-foreground">RJ</div>
          <div className="hidden sm:block text-left">
            <p className="text-[12px] font-semibold text-text-main leading-tight">Riya Jain</p>
            <p className="text-[10px] text-text-dim">Admin</p>
          </div>
          <Icon path={icons.chevronDown} className="w-3.5 h-3.5 text-text-dim hidden sm:block" />
        </button>
        {profileOpen && (
          <div className="absolute right-0 top-full mt-2 w-56 bg-bg-sidebar border border-border-main rounded-2xl shadow-2xl z-30 py-1.5 overflow-hidden"
            style={{ animation: "menuIn 0.15s ease" }}>
            <div className="px-4 py-3 border-b border-border-main">
              <p className="text-[13px] font-bold text-text-main">Riya Jain</p>
              <p className="text-[11px] text-text-dim">riya@nimbus.io</p>
              <span className="inline-block mt-1.5 text-[10px] font-semibold px-2 py-0.5 rounded-full bg-accent-light text-accent border border-accent-border">Admin</span>
            </div>
            {[
              { label: "View Profile",       icon: icons.eye,      to: "/settings" },
              { label: "Account Settings",   icon: icons.settings, to: "/settings" },
              { label: "Keyboard Shortcuts", icon: icons.zap,      to: null },
            ].map(item => (
              item.to
                ? <Link key={item.label} to={item.to} onClick={() => setProfileOpen(false)}
                    className="flex items-center gap-2.5 px-4 py-2.5 text-[13px] text-text-muted hover:text-text-main hover:bg-bg-hover transition-colors">
                    <Icon path={item.icon} className="w-4 h-4" /> {item.label}
                  </Link>
                : <button key={item.label}
                    className="w-full flex items-center gap-2.5 px-4 py-2.5 text-[13px] text-text-muted hover:text-text-main hover:bg-bg-hover transition-colors">
                    <Icon path={item.icon} className="w-4 h-4" /> {item.label}
                  </button>
            ))}
            <div className="border-t border-border-main mt-1 pt-1">
              <button className="w-full flex items-center gap-2.5 px-4 py-2.5 text-[13px] text-red-500 hover:bg-red-550/10 dark:hover:bg-red-400/10 transition-colors">
                <Icon path={icons.logout} className="w-4 h-4" /> Sign out
              </button>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}

/* ── Layout ── */
function Layout({ theme, toggleTheme }) {
  const [collapsed, setCollapsed]   = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="min-h-screen w-full bg-bg-app text-text-main flex font-sans antialiased transition-colors duration-200">
      <style>{`
        ::selection { background: var(--accent); color: var(--bg-sidebar); }

        /* Scrollbar */
        * { scrollbar-width: thin; scrollbar-color: var(--border-main) transparent; }
        ::-webkit-scrollbar { width: 5px; height: 5px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: var(--border-main); border-radius: 99px; }
        ::-webkit-scrollbar-thumb:hover { background: var(--border-hover); }

        /* Hide scrollbar for tabs */
        .no-scrollbar { scrollbar-width: none; }
        .no-scrollbar::-webkit-scrollbar { display: none; }

        /* Animations */
        @keyframes menuIn {
          from { opacity: 0; transform: translateY(-6px) scale(0.97); }
          to   { opacity: 1; transform: translateY(0)  scale(1); }
        }
        @keyframes modalIn {
          from { opacity: 0; transform: scale(0.95) translateY(8px); }
          to   { opacity: 1; transform: scale(1)    translateY(0); }
        }
        @keyframes slideInRight {
          from { opacity: 0; transform: translateX(12px); }
          to   { opacity: 1; transform: translateX(0); }
        }
        @keyframes pulseGlow {
          0%, 100% { box-shadow: 0 0 4px 0 rgba(94,234,212,0.4); }
          50%       { box-shadow: 0 0 8px 3px rgba(94,234,212,0.6); }
        }
        .glow-dot { animation: pulseGlow 2s ease-in-out infinite; }
      `}</style>

      <Sidebar
        collapsed={collapsed}
        setCollapsed={setCollapsed}
        mobileOpen={mobileOpen}
        setMobileOpen={setMobileOpen}
      />

      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
        <Topbar mobileOpen={mobileOpen} setMobileOpen={setMobileOpen} theme={theme} toggleTheme={toggleTheme} />
        <main className="flex-1 overflow-y-auto p-4 lg:p-6 bg-bg-app">
          <Routes>
            <Route path="/"        element={<Overview />} />
            <Route path="/users"   element={<Users />} />
            <Route path="/orders"  element={<Orders />} />
            <Route path="/revenue" element={<Revenue />} />
            <Route path="/reports" element={<Reports />} />
            <Route path="/settings"element={<Settings />} />
          </Routes>
        </main>
      </div>
    </div>
  );
}

export default function App() {
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem("theme") || "dark";
  });

  useEffect(() => {
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
    localStorage.setItem("theme", theme);
  }, [theme]);

  const toggleTheme = () => setTheme(t => t === "dark" ? "light" : "dark");

  return (
    <BrowserRouter>
      <Layout theme={theme} toggleTheme={toggleTheme} />
    </BrowserRouter>
  );
}