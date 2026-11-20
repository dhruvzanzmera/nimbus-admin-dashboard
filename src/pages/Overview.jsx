import { useState, useMemo } from "react";
import { Icon, icons, StatusBadge } from "../components/Icon";
import { StatCard, TableCard, Table, Pagination, SearchInput, SegmentFilter, usePagination, Modal, DropdownMenu, useToast, Toast } from "../components/Table";

/* ─── Data ─── */
const STATS_DATA = [
  { label: "Total Revenue", value: "$284,391", delta: 12.4, up: true, icon: icons.trendingUp, accent: "var(--accent)", spark: [4, 6, 5, 8, 7, 9, 11] },
  { label: "Active Users", value: "8,492", delta: 3.1, up: true, icon: icons.users, accent: "var(--accent)", spark: [6, 5, 7, 6, 8, 8, 9] },
  { label: "Open Orders", value: "342", delta: 2.4, up: false, icon: icons.cart, accent: "var(--accent)", spark: [9, 8, 8, 7, 6, 6, 5] },
  { label: "Conversion", value: "4.8%", delta: 0.6, up: true, icon: icons.target, accent: "var(--accent)", spark: [3, 4, 4, 5, 5, 6, 6] },
];

const WEEKLY = [
  { day: "Mon", rev: 42, ord: 18 }, { day: "Tue", rev: 58, ord: 25 },
  { day: "Wed", rev: 51, ord: 22 }, { day: "Thu", rev: 74, ord: 31 },
  { day: "Fri", rev: 68, ord: 28 }, { day: "Sat", rev: 39, ord: 16 }, { day: "Sun", rev: 46, ord: 19 },
];

const ORDERS = [
  { id: "ORD-8231", customer: "Priya Sharma", product: "Nimbus Pro — Annual", amount: 1299, status: "paid", date: "Aug 20, 2024", avatar: "PS" },
  { id: "ORD-8230", customer: "Daniel Cho", product: "Team Seats × 12", amount: 4680, status: "paid", date: "Aug 20, 2024", avatar: "DC" },
  { id: "ORD-8229", customer: "Amara Obi", product: "Nimbus Starter", amount: 89, status: "pending", date: "Aug 19, 2024", avatar: "AO" },
  { id: "ORD-8228", customer: "Lucas Meyer", product: "Storage Add-on 2TB", amount: 240, status: "paid", date: "Aug 19, 2024", avatar: "LM" },
  { id: "ORD-8227", customer: "Hana Kobayashi", product: "Nimbus Pro — Monthly", amount: 129, status: "failed", date: "Aug 18, 2024", avatar: "HK" },
  { id: "ORD-8226", customer: "Omar Haddad", product: "Team Seats × 5", amount: 1950, status: "pending", date: "Aug 18, 2024", avatar: "OH" },
];

const ACTIVITY = [
  { who: "Priya Sharma", what: "upgraded to Pro Annual", time: "2m ago", type: "upgrade", avatar: "PS" },
  { who: "System", what: "nightly backup completed successfully", time: "41m ago", type: "system", avatar: "SY" },
  { who: "Daniel Cho", what: "invited 12 teammates", time: "1h ago", type: "invite", avatar: "DC" },
  { who: "Hana Kobayashi", what: "payment failed — card declined", time: "3h ago", type: "error", avatar: "HK" },
  { who: "System", what: "usage report generated", time: "5h ago", type: "system", avatar: "SY" },
  { who: "Omar Haddad", what: "purchased Team Seats × 5", time: "7h ago", type: "purchase", avatar: "OH" },
];

const DONUTS = [
  {
    title: "Subscription mix",
    subtitle: "Active customer plans",
    total: "8,492",
    caption: "active users",
    segments: [
      { label: "Pro annual", value: 42, color: "var(--chart-1)" },
      { label: "Team", value: 28, color: "var(--chart-2)" },
      { label: "Pro monthly", value: 18, color: "var(--chart-3)" },
      { label: "Starter", value: 12, color: "var(--chart-4)" },
    ],
  },
  {
    title: "Order status",
    subtitle: "342 orders this period",
    total: "68%",
    caption: "paid",
    segments: [
      { label: "Paid", value: 68, color: "var(--chart-1)" },
      { label: "Pending", value: 22, color: "var(--chart-2)" },
      { label: "Failed", value: 10, color: "var(--chart-3)" },
    ],
  },
  {
    title: "Acquisition",
    subtitle: "New users by channel",
    total: "1,284",
    caption: "new users",
    segments: [
      { label: "Organic", value: 38, color: "var(--chart-1)" },
      { label: "Referral", value: 27, color: "var(--chart-2)" },
      { label: "Paid", value: 21, color: "var(--chart-3)" },
      { label: "Social", value: 14, color: "var(--chart-4)" },
    ],
  },
];

const ACT_ICONS = {
  upgrade: { icon: icons.award, color: "var(--accent)" },
  system: { icon: icons.zap, color: "var(--accent)" },
  invite: { icon: icons.userPlus, color: "var(--accent)" },
  error: { icon: icons.alertTriangle, color: "#EF4444" },
  purchase: { icon: icons.creditCard, color: "var(--accent)" },
};

function DonutCard({ title, subtitle, total, caption, segments }) {
  let offset = 0;
  const gradient = segments.map(segment => {
    const start = offset;
    offset += segment.value;
    return `${segment.color} ${start}% ${offset}%`;
  }).join(", ");

  return (
    <section className="bg-bg-card border border-border-card rounded-2xl p-5 shadow-sm transition-all duration-200 hover:border-border-hover">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h2 className="text-[14px] font-semibold text-text-main">{title}</h2>
          <p className="text-[12px] text-text-sub mt-1">{subtitle}</p>
        </div>
        <span className="w-8 h-8 rounded-xl bg-bg-hover flex items-center justify-center text-text-sub text-lg leading-none" aria-hidden="true">···</span>
      </div>
      <div className="flex items-center gap-5 mt-5">
        <div
          className="relative w-[116px] h-[116px] shrink-0 rounded-full"
          role="img"
          aria-label={`${title}: ${segments.map(segment => `${segment.label} ${segment.value}%`).join(", ")}`}
          style={{ background: `conic-gradient(${gradient})` }}
        >
          <div className="absolute inset-[10px] rounded-full bg-bg-card flex flex-col items-center justify-center">
            <span className="text-[20px] font-bold tracking-tight text-text-main">{total}</span>
            <span className="text-[10px] text-text-sub mt-0.5">{caption}</span>
          </div>
        </div>
        <div className="flex-1 min-w-0 space-y-3">
          {segments.map(segment => (
            <div key={segment.label} className="flex items-center gap-2 min-w-0">
              <span className="w-2 h-2 rounded-full shrink-0" style={{ background: segment.color }} />
              <span className="text-[11px] text-text-sub truncate">{segment.label}</span>
              <span className="ml-auto text-[11px] font-semibold text-text-main">{segment.value}%</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

const avatarGrad = () => "from-slate-500 to-slate-700";

const ORDER_COLS = [
  {
    key: "id", label: "Order ID",
    cellClassName: "font-mono text-accent text-[12px]"
  },
  {
    key: "customer", label: "Customer",
    render: (r) => (
      <div className="flex items-center gap-2.5">
        <div className={`w-7 h-7 rounded-full bg-gradient-to-br ${avatarGrad(r.avatar)} flex items-center justify-center text-[10px] font-bold text-white shrink-0`}>{r.avatar}</div>
        <span className="text-text-main font-medium text-[13px]">{r.customer}</span>
      </div>
    )
  },
  { key: "product", label: "Product", cellClassName: "text-text-sub hidden md:table-cell", className: "hidden md:table-cell" },
  {
    key: "amount", label: "Amount",
    cellClassName: "font-mono font-semibold text-text-main",
    render: (r) => `$${r.amount.toLocaleString()}`
  },
  { key: "status", label: "Status", render: (r) => <StatusBadge status={r.status} /> },
  { key: "date", label: "Date", cellClassName: "text-text-sub text-[12px] hidden sm:table-cell", className: "hidden sm:table-cell" },
  {
    key: "_a", label: "", sortable: false,
    render: () => (
      <button className="flex justify-end w-full text-text-dim hover:text-text-main transition-colors">
        <Icon path={icons.dotsV} className="w-4 h-4" />
      </button>
    )
  },
];

/* ─── Chart ─── */
function BarChart({ data, range }) {
  const maxRev = Math.max(...data.map(d => d.rev));
  const [hovered, setHovered] = useState(null);

  return (
    <div className="flex items-end gap-2 h-44 mt-2">
      {data.map((d, i) => (
        <div key={d.day} className="flex-1 flex flex-col items-center gap-2 group" onMouseEnter={() => setHovered(i)} onMouseLeave={() => setHovered(null)}>
          {hovered === i && (
            <div className="bg-bg-input border border-border-card rounded-lg px-2.5 py-1.5 text-[11px] text-text-main whitespace-nowrap shadow-xl">
              <p className="font-semibold text-accent">${(d.rev * 62).toLocaleString()}</p>
              <p className="text-text-sub">{d.ord} orders</p>
            </div>
          )}
          <div className="w-full flex items-end h-36 rounded-t-lg overflow-hidden">
            <div
              className="w-full rounded-t-lg transition-all duration-300"
              style={{
                height: `${(d.rev / maxRev) * 100}%`,
                background: hovered === i
                  ? "var(--accent)"
                  : "var(--bg-hover)"
              }}
            />
          </div>
          <span className="text-[11px] text-text-dim">{d.day}</span>
        </div>
      ))}
    </div>
  );
}

/* ─── Component ─── */
export default function Overview() {
  const [range, setRange] = useState("Week");
  const [statusFilter, setStatusFilter] = useState("all");
  const [query, setQuery] = useState("");
  const [detailOrder, setDetailOrder] = useState(null);
  const { toasts, show } = useToast();

  const filtered = useMemo(() =>
    ORDERS.filter(o => {
      const q = query.toLowerCase();
      const mQ = o.customer.toLowerCase().includes(q) || o.id.toLowerCase().includes(q) || o.product.toLowerCase().includes(q);
      const mS = statusFilter === "all" || o.status === statusFilter;
      return mQ && mS;
    }), [query, statusFilter]);

  const statusOpts = [
    { value: "all", label: "All", count: ORDERS.length },
    { value: "paid", label: "Paid", count: ORDERS.filter(o => o.status === "paid").length },
    { value: "pending", label: "Pending", count: ORDERS.filter(o => o.status === "pending").length },
    { value: "failed", label: "Failed", count: ORDERS.filter(o => o.status === "failed").length },
  ];

  return (
    <div className="space-y-6">
      <Toast toasts={toasts} />

      {/* Header */}
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-accent mb-2">Thursday, August 21, 2024</p>
          <h1 className="text-[26px] font-bold font-display tracking-tight text-text-main">Good morning, Riya <span aria-hidden="true">👋</span></h1>
          <p className="text-[13px] text-text-sub mt-1">Here’s what’s happening with your business today.</p>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={() => show("Report exported!", "success")} className="inline-flex items-center gap-2 bg-bg-card border border-border-card text-text-muted text-[13px] font-medium px-4 py-2 rounded-xl hover:border-border-hover hover:text-text-main transition-all cursor-pointer">
            <Icon path={icons.download} className="w-4 h-4" /> Export
          </button>
          <button className="inline-flex items-center gap-2 bg-accent text-accent-foreground text-[13px] font-bold px-4 py-2 rounded-xl hover:bg-accent-hover transition-all cursor-pointer">
            <Icon path={icons.plus} className="w-4 h-4" /> New Order
          </button>
        </div>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {STATS_DATA.map(s => <StatCard key={s.label} {...s} />)}
      </div>

      {/* Business analytics */}
      <section>
        <div className="flex items-end justify-between gap-3 mb-3">
          <div>
            <h2 className="text-[15px] font-semibold text-text-main">Business analytics</h2>
            <p className="text-[12px] text-text-sub mt-1">A closer look at your customers and orders</p>
          </div>
          <span className="text-[11px] text-text-dim">Updated just now</span>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {DONUTS.map(chart => <DonutCard key={chart.title} {...chart} />)}
        </div>
      </section>

      {/* Chart + Activity */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
        {/* Chart */}
        <div className="xl:col-span-2 bg-bg-card border border-border-card rounded-2xl p-5 shadow-sm">
          <div className="flex items-center justify-between mb-1">
            <div>
              <h2 className="text-[14px] font-semibold text-text-main">Revenue overview</h2>
              <p className="text-[12px] text-text-sub mt-0.5">Aug 15 — Aug 21, 2024</p>
            </div>
            <div className="flex items-center gap-1 bg-bg-input border border-border-card rounded-xl p-1">
              {["Week", "Month", "Year"].map(r => (
                <button key={r} onClick={() => setRange(r)} className={`px-3 py-1.5 rounded-lg text-[12px] font-medium transition-all ${range === r ? "bg-bg-hover text-text-main" : "text-text-sub hover:text-text-muted"}`}>{r}</button>
              ))}
            </div>
          </div>
          <div className="flex items-center gap-4 mt-3 mb-1">
            <div>
              <p className="text-[11px] text-text-sub">Total this {range.toLowerCase()}</p>
              <p className="text-[22px] font-bold text-text-main font-display">$24,891</p>
            </div>
            <span className="inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-full text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-100 dark:border-emerald-900/20">
              <Icon path={icons.trendingUp} className="w-3 h-3" /> +12.4%
            </span>
          </div>
          <BarChart data={WEEKLY} range={range} />
        </div>

        {/* Activity */}
        <div className="bg-bg-card border border-border-card rounded-2xl p-5 shadow-sm flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-[14px] font-semibold text-text-main">Activity</h2>
            <button className="text-[12px] text-accent hover:underline">View all</button>
          </div>
          <div className="flex-1 space-y-3 overflow-y-auto">
            {ACTIVITY.map((a, i) => {
              const cfg = ACT_ICONS[a.type] || ACT_ICONS.system;
              return (
                <div key={i} className="flex gap-3 group">
                  <div className="relative shrink-0">
                    <div className={`w-8 h-8 rounded-full bg-gradient-to-br ${avatarGrad()} flex items-center justify-center text-[10px] font-bold text-white`}>{a.avatar}</div>
                    <div className="absolute -bottom-0.5 -right-0.5 w-4 h-4 rounded-full flex items-center justify-center" style={{ background: cfg.color + "25", border: `1px solid ${cfg.color}40` }}>
                      <Icon path={cfg.icon} className="w-2 h-2" style={{ color: cfg.color, width: "8px", height: "8px" }} />
                    </div>
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-[13px] leading-snug">
                      <span className="font-semibold text-text-main">{a.who}</span>{" "}
                      <span className="text-text-sub">{a.what}</span>
                    </p>
                    <p className="text-[11px] text-text-dim mt-0.5">{a.time}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Orders Table */}
      <TableCard
        title="Recent Orders"
        subtitle="Latest transactions across all plans"
        toolbar={
          <>
            <SearchInput value={query} onChange={setQuery} placeholder="Search orders…" className="w-52" />
            <SegmentFilter options={statusOpts} value={statusFilter} onChange={setStatusFilter} />
          </>
        }
        footer={
          <div className="flex items-center justify-between px-4 py-3.5 border-t border-border-card text-[12px] text-text-sub">
            <span>Showing <span className="text-text-muted">{filtered.length}</span> of <span className="text-text-muted">{ORDERS.length}</span></span>
            <button className="text-accent hover:underline text-[12px]">View all orders →</button>
          </div>
        }
      >
        <Table
          columns={ORDER_COLS}
          data={filtered}
          emptyText={`No orders match "${query}"`}
          rowKey={r => r.id}
          onRowClick={r => setDetailOrder(r)}
        />
      </TableCard>

      {/* Order Detail Modal */}
      <Modal open={!!detailOrder} onClose={() => setDetailOrder(null)} title="Order Details" size="md">
        {detailOrder && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              {[
                { label: "Order ID", value: detailOrder.id, mono: true },
                { label: "Date", value: detailOrder.date },
                { label: "Customer", value: detailOrder.customer },
                { label: "Amount", value: `$${detailOrder.amount.toLocaleString()}`, mono: true },
                { label: "Product", value: detailOrder.product },
                { label: "Status", value: <StatusBadge status={detailOrder.status} /> },
              ].map(f => (
                <div key={f.label} className="bg-bg-input rounded-xl p-3 border border-border-card">
                  <p className="text-[11px] text-text-sub mb-1">{f.label}</p>
                  <p className={`text-[13px] text-text-main font-medium ${f.mono ? "font-mono" : ""}`}>{f.value}</p>
                </div>
              ))}
            </div>
            <div className="flex gap-2 pt-1">
              <button onClick={() => { show("Invoice downloaded!", "success"); setDetailOrder(null); }}
                className="flex-1 flex items-center justify-center gap-2 bg-accent text-accent-foreground text-[13px] font-bold py-2.5 rounded-xl hover:bg-accent-hover transition-all cursor-pointer">
                <Icon path={icons.download} className="w-4 h-4" /> Download Invoice
              </button>
              <button onClick={() => setDetailOrder(null)}
                className="px-4 py-2.5 rounded-xl bg-bg-hover text-text-muted text-[13px] hover:text-text-main transition-colors border border-border-card cursor-pointer">
                Close
              </button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
