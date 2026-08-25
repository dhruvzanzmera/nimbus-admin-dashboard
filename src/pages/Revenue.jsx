import { useState } from "react";
import { Icon, icons } from "../components/Icon";
import { TableCard, Table, SearchInput, useToast, Toast } from "../components/Table";

const MONTHLY = [
  { month: "Jan", revenue: 18200, expenses: 9100, profit: 9100 },
  { month: "Feb", revenue: 21400, expenses: 10200, profit: 11200 },
  { month: "Mar", revenue: 19800, expenses: 9800, profit: 10000 },
  { month: "Apr", revenue: 24600, expenses: 11400, profit: 13200 },
  { month: "May", revenue: 28100, expenses: 12100, profit: 16000 },
  { month: "Jun", revenue: 31500, expenses: 13200, profit: 18300 },
  { month: "Jul", revenue: 29700, expenses: 12800, profit: 16900 },
  { month: "Aug", revenue: 34200, expenses: 14100, profit: 20100 },
];

const SOURCES = [
  { source: "Nimbus Pro Annual",  revenue: 142800, pct: "50.2%", orders: 110, growth: 14.2,  up: true  },
  { source: "Team Seats",         revenue: 98400,  pct: "34.6%", orders: 42,  growth: 8.7,   up: true  },
  { source: "Pro Monthly",        revenue: 24090,  pct: "8.5%",  orders: 187, growth: 3.1,   up: false },
  { source: "Storage Add-ons",    revenue: 12480,  pct: "4.4%",  orders: 52,  growth: 21.0,  up: true  },
  { source: "Starter Plan",       revenue: 6231,   pct: "2.2%",  orders: 70,  growth: 5.2,   up: true  },
];

const maxRev = Math.max(...MONTHLY.map(m => m.revenue));

const COLS = [
  { key: "source",  label: "Revenue Source",  cellClassName: "font-semibold text-text-main" },
  { key: "revenue", label: "Revenue",         cellClassName: "font-mono font-semibold text-text-main", render: r => `$${r.revenue.toLocaleString()}` },
  { key: "pct",     label: "% of Total",      cellClassName: "text-text-sub" },
  { key: "orders",  label: "Orders",          cellClassName: "text-text-muted" },
  {
    key: "growth", label: "Growth", sortable: false,
    render: r => (
      <div className="flex items-center gap-2">
        <span className={`inline-flex items-center gap-1 text-[12px] font-semibold ${r.up ? "text-emerald-600 dark:text-emerald-400" : "text-red-650 dark:text-red-400"}`}>
          <Icon path={r.up ? icons.trendingUp : icons.trendingDown} className="w-3 h-3" />
          {r.growth}%
        </span>
        <div className="flex-1 bg-bg-hover rounded-full h-1.5 w-20 overflow-hidden">
          <div className="h-full rounded-full" style={{ width: `${Math.min(r.growth * 4, 100)}%`, background: r.up ? "var(--accent)" : "#F87171" }} />
        </div>
      </div>
    )
  },
];

export default function Revenue() {
  const [chartType, setChartType] = useState("revenue");
  const [hovered, setHovered]     = useState(null);
  const { toasts, show }          = useToast();

  const totalRevenue = MONTHLY.reduce((a, m) => a + m.revenue, 0);
  const totalProfit  = MONTHLY.reduce((a, m) => a + m.profit, 0);
  const totalExpenses= MONTHLY.reduce((a, m) => a + m.expenses, 0);
  const avgMargin    = ((totalProfit / totalRevenue) * 100).toFixed(1);

  const dataKey = chartType;

  return (
    <div className="space-y-6">
      <Toast toasts={toasts} />

      {/* Header */}
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-[22px] font-bold font-display tracking-tight text-text-main">Revenue</h1>
          <p className="text-[13px] text-text-sub mt-1">Financial performance · Jan–Aug 2024</p>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={() => show("Report exported!", "success")} className="inline-flex items-center gap-2 bg-bg-card border border-border-card text-text-muted text-[13px] font-medium px-4 py-2 rounded-xl hover:border-border-hover hover:text-text-main transition-all cursor-pointer">
            <Icon path={icons.download} className="w-4 h-4" /> Export
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Total Revenue",  value: `$${(totalRevenue/1000).toFixed(0)}k`,   color: "var(--accent)", sub: "+12.4% YoY",   icon: icons.trendingUp },
          { label: "Net Profit",     value: `$${(totalProfit/1000).toFixed(0)}k`,    color: "#38BDF8", sub: `${avgMargin}% margin`, icon: icons.award },
          { label: "Total Expenses", value: `$${(totalExpenses/1000).toFixed(0)}k`,  color: "#FBBF24", sub: "well controlled", icon: icons.creditCard },
          { label: "MoM Growth",     value: "+8.2%",                                  color: "#A78BFA", sub: "Aug vs Jul",   icon: icons.zap },
        ].map(s => (
          <div key={s.label} className="bg-bg-card border border-border-card rounded-2xl px-5 py-4 hover:border-border-hover transition-all group relative overflow-hidden">
            <div className="absolute top-3 right-3 w-8 h-8 rounded-xl flex items-center justify-center" style={{ background: `${s.color}18`, color: s.color }}>
              <Icon path={s.icon} className="w-4 h-4" style={{ width: "16px", height: "16px" }} />
            </div>
            <p className="text-[11px] font-medium text-text-sub uppercase tracking-wider">{s.label}</p>
            <p className="text-[26px] font-bold font-display mt-1" style={{ color: s.color }}>{s.value}</p>
            <p className="text-[11px] text-text-dim mt-0.5">{s.sub}</p>
          </div>
        ))}
      </div>

      {/* Chart */}
      <div className="bg-bg-card border border-border-card rounded-2xl p-5 shadow-lg">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
          <div>
            <h2 className="text-[14px] font-semibold text-text-main">Monthly breakdown</h2>
            <p className="text-[12px] text-text-sub font-medium">Jan — Aug 2024</p>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1 bg-bg-input border border-border-card rounded-xl p-1">
              {[
                { key: "revenue",  label: "Revenue",  color: "var(--accent)" },
                { key: "profit",   label: "Profit",   color: "#38BDF8" },
                { key: "expenses", label: "Expenses", color: "#F87171" },
              ].map(t => (
                <button key={t.key} onClick={() => setChartType(t.key)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[12px] font-medium transition-all cursor-pointer ${chartType === t.key ? "bg-bg-hover text-text-main" : "text-text-sub hover:text-text-muted"}`}>
                  <span className="w-2 h-2 rounded-full" style={{ background: t.color }} />
                  {t.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="flex items-end gap-3 h-52">
          {MONTHLY.map((m, i) => {
            const val = m[dataKey];
            const colors = { revenue: "var(--accent)", profit: "#38BDF8", expenses: "#F87171" };
            const color = colors[dataKey];
            const isHov = hovered === i;
            return (
              <div key={m.month} className="flex-1 flex flex-col items-center gap-2"
                onMouseEnter={() => setHovered(i)} onMouseLeave={() => setHovered(null)}>
                {isHov && (
                  <div className="bg-bg-input border border-border-card rounded-lg px-2.5 py-1.5 text-[11px] shadow-xl whitespace-nowrap">
                    <p className="font-bold text-text-main" style={{ color }}>${val.toLocaleString()}</p>
                    <p className="text-text-dim">{m.month} 2024</p>
                  </div>
                )}
                <div className="w-full flex items-end h-40 rounded-t-lg overflow-hidden">
                  <div
                    className="w-full rounded-t-xl transition-all duration-300 cursor-pointer"
                    style={{
                      height: `${(val / maxRev) * 100}%`,
                      background: isHov
                        ? color
                        : `${color}40`,
                    }}
                  />
                </div>
                <span className="text-[11px] text-text-dim">{m.month}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Revenue by Source */}
      <TableCard title="Revenue by Source" subtitle="Breakdown of revenue streams">
        <Table columns={COLS} data={SOURCES} rowKey={r => r.source} />
      </TableCard>
    </div>
  );
}
