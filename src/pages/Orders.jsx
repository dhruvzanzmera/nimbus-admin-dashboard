import { useState, useMemo } from "react";
import { Icon, icons, StatusBadge } from "../components/Icon";
import { TableCard, Table, Pagination, SearchInput, SegmentFilter, usePagination, Modal, DropdownMenu, useToast, Toast } from "../components/Table";

const grad = () => "from-slate-500 to-slate-700";
const initials = (name) => name.split(" ").map(n => n[0]).join("").slice(0, 2);

const ORDERS = [
  { id: "ORD-8231", customer: "Priya Sharma",   product: "Nimbus Pro — Annual",   amount: 1299, status: "paid",       date: "Aug 20, 2024", method: "Visa •••• 4242",      items: 1 },
  { id: "ORD-8230", customer: "Daniel Cho",      product: "Team Seats × 12",       amount: 4680, status: "paid",       date: "Aug 20, 2024", method: "Mastercard •••• 9102", items: 12 },
  { id: "ORD-8229", customer: "Amara Obi",       product: "Nimbus Starter",        amount: 89,   status: "pending",    date: "Aug 19, 2024", method: "PayPal",               items: 1 },
  { id: "ORD-8228", customer: "Lucas Meyer",     product: "Storage Add-on 2TB",    amount: 240,  status: "paid",       date: "Aug 19, 2024", method: "Visa •••• 1337",      items: 1 },
  { id: "ORD-8227", customer: "Hana Kobayashi",  product: "Nimbus Pro — Monthly",  amount: 129,  status: "failed",     date: "Aug 18, 2024", method: "Visa •••• 8811",      items: 1 },
  { id: "ORD-8226", customer: "Omar Haddad",     product: "Team Seats × 5",        amount: 1950, status: "pending",    date: "Aug 18, 2024", method: "Wire Transfer",        items: 5 },
  { id: "ORD-8225", customer: "Sofia Rossi",     product: "Nimbus Starter",        amount: 89,   status: "paid",       date: "Aug 17, 2024", method: "Visa •••• 3392",      items: 1 },
  { id: "ORD-8224", customer: "Ravi Patel",      product: "Nimbus Pro — Annual",   amount: 1299, status: "paid",       date: "Aug 16, 2024", method: "Mastercard •••• 5571", items: 1 },
  { id: "ORD-8223", customer: "Carlos Lima",     product: "Team Seats × 8",        amount: 3120, status: "paid",       date: "Aug 15, 2024", method: "Visa •••• 7743",      items: 8 },
  { id: "ORD-8222", customer: "Nadia Ivanova",   product: "Nimbus Starter",        amount: 89,   status: "failed",     date: "Aug 14, 2024", method: "PayPal",               items: 1 },
  { id: "ORD-8221", customer: "Mei Lin",         product: "Pro Annual",            amount: 1299, status: "paid",       date: "Aug 13, 2024", method: "Visa •••• 2211",      items: 1 },
  { id: "ORD-8220", customer: "Ethan Brooks",    product: "Team Seats × 12",       amount: 4680, status: "processing", date: "Aug 12, 2024", method: "Mastercard •••• 8844", items: 12 },
];

const COLS = [
  { key: "id",       label: "Order ID",  cellClassName: "font-mono text-accent text-[12px]" },
  {
    key: "customer", label: "Customer",
    render: r => (
      <div className="flex items-center gap-2.5">
        <div className={`w-8 h-8 rounded-full bg-gradient-to-br ${grad(r.customer)} flex items-center justify-center text-[10px] font-bold text-white shrink-0`}>{initials(r.customer)}</div>
        <span className="text-text-main font-semibold text-[13px]">{r.customer}</span>
      </div>
    )
  },
  { key: "product",  label: "Product",  cellClassName: "text-text-sub max-w-[200px] truncate hidden md:table-cell", className: "hidden md:table-cell" },
  { key: "amount",   label: "Amount",   cellClassName: "font-mono font-bold text-text-main", render: r => `$${r.amount.toLocaleString()}` },
  { key: "status",   label: "Status",   render: r => <StatusBadge status={r.status} /> },
  { key: "method",   label: "Method",   cellClassName: "text-text-sub text-[12px] hidden lg:table-cell", className: "hidden lg:table-cell" },
  { key: "date",     label: "Date",     cellClassName: "text-text-sub text-[12px] hidden sm:table-cell", className: "hidden sm:table-cell" },
  {
    key: "_a", label: "", sortable: false,
    render: r => (
      <DropdownMenu
        trigger={<button className="w-7 h-7 flex items-center justify-center rounded-lg text-text-dim hover:text-text-main hover:bg-bg-hover transition-colors cursor-pointer"><Icon path={icons.dotsV} className="w-4 h-4" /></button>}
        items={[
          { label: "View details",    icon: icons.eye },
          { label: "Download invoice",icon: icons.download },
          { label: "Copy order ID",   icon: icons.copy },
          "---",
          { label: "Refund order",    icon: icons.refresh, danger: true },
          { label: "Cancel order",    icon: icons.x,       danger: true },
        ]}
      />
    )
  },
];

export default function Orders() {
  const [query,        setQuery]    = useState("");
  const [statusFilter, setStatus]   = useState("all");
  const [selected,     setSelected] = useState([]);
  const [detailOrder,  setDetail]   = useState(null);
  const { toasts, show }            = useToast();

  const filtered = useMemo(() => {
    const q = query.toLowerCase();
    return ORDERS.filter(o =>
      (o.customer.toLowerCase().includes(q) || o.id.toLowerCase().includes(q) || o.product.toLowerCase().includes(q)) &&
      (statusFilter === "all" || o.status === statusFilter)
    );
  }, [query, statusFilter]);

  const { page, setPage, totalPages, paginated } = usePagination(filtered, 8);

  const paidTotal    = ORDERS.filter(o => o.status === "paid").reduce((a, o) => a + o.amount, 0);
  const pendingTotal = ORDERS.filter(o => o.status === "pending").reduce((a, o) => a + o.amount, 0);

  const statusOpts = [
    { value: "all",        label: "All",        count: ORDERS.length },
    { value: "paid",       label: "Paid",       count: ORDERS.filter(o => o.status === "paid").length },
    { value: "pending",    label: "Pending",    count: ORDERS.filter(o => o.status === "pending").length },
    { value: "processing", label: "Processing", count: ORDERS.filter(o => o.status === "processing").length },
    { value: "failed",     label: "Failed",     count: ORDERS.filter(o => o.status === "failed").length },
  ];

  return (
    <div className="space-y-6">
      <Toast toasts={toasts} />

      {/* Header */}
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-[22px] font-bold font-display tracking-tight text-text-main">Orders</h1>
          <p className="text-[13px] text-text-sub mt-1">All transactions across plans and add-ons</p>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          {selected.length > 0 && (
            <div className="flex items-center gap-2 bg-accent-light border border-accent-border rounded-xl px-3 py-2">
              <span className="text-[12px] text-accent font-medium">{selected.length} selected</span>
              <button onClick={() => show(`${selected.length} orders exported`, "success")} className="text-[12px] text-accent hover:underline">Export</button>
              <button onClick={() => setSelected([])} className="text-text-sub hover:text-text-main"><Icon path={icons.x} className="w-3.5 h-3.5" /></button>
            </div>
          )}
          <button onClick={() => show("CSV exported!", "success")} className="inline-flex items-center gap-2 bg-bg-card border border-border-card text-text-muted text-[13px] font-medium px-4 py-2 rounded-xl hover:border-border-hover hover:text-text-main transition-all cursor-pointer">
            <Icon path={icons.download} className="w-4 h-4" /> Export
          </button>
          <button className="inline-flex items-center gap-2 bg-accent text-accent-foreground text-[13px] font-bold px-4 py-2 rounded-xl hover:bg-accent-hover transition-all cursor-pointer">
            <Icon path={icons.plus} className="w-4 h-4" /> New Order
          </button>
        </div>
      </div>

      {/* KPI Strip */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Total Orders",   value: ORDERS.length,         color: "var(--text-main)", sub: "all time" },
          { label: "Revenue",        value: `$${paidTotal.toLocaleString()}`, color: "var(--accent)", sub: "from paid orders" },
          { label: "Pending Value",  value: `$${pendingTotal.toLocaleString()}`, color: "var(--text-muted)", sub: "awaiting payment" },
          { label: "Failed",         value: ORDERS.filter(o => o.status === "failed").length, color: "var(--text-muted)", sub: "need attention" },
        ].map(s => (
          <div key={s.label} className="bg-bg-card border border-border-card rounded-2xl px-5 py-4 hover:border-border-hover transition-all">
            <p className="text-[11px] font-medium text-text-sub uppercase tracking-wider">{s.label}</p>
            <p className="text-[26px] font-bold font-display mt-1" style={{ color: s.color }}>{s.value}</p>
            <p className="text-[11px] text-text-dim mt-0.5">{s.sub}</p>
          </div>
        ))}
      </div>

      {/* Table */}
      <TableCard
        title="All Orders"
        subtitle={`${filtered.length} results`}
        toolbar={
          <>
            <SearchInput value={query} onChange={v => { setQuery(v); setPage(1); }} placeholder="Search orders…" className="w-56" />
            <SegmentFilter options={statusOpts} value={statusFilter} onChange={v => { setStatus(v); setPage(1); }} />
          </>
        }
        footer={<Pagination page={page} totalPages={totalPages} total={filtered.length} pageSize={8} setPage={setPage} />}
      >
        <Table
          columns={COLS}
          data={paginated}
          emptyText={`No orders match "${query}"`}
          selectable
          selected={selected}
          onSelect={setSelected}
          onSelectAll={setSelected}
          rowKey={r => r.id}
          onRowClick={r => setDetail(r)}
        />
      </TableCard>

      {/* Order Detail Modal */}
      <Modal open={!!detailOrder} onClose={() => setDetail(null)} title="Order Details" size="md">
        {detailOrder && (
          <div className="space-y-4">
            <div className="flex items-center gap-3 pb-4 border-b border-border-card">
              <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${grad(detailOrder.customer)} flex items-center justify-center text-[12px] font-bold text-white`}>{initials(detailOrder.customer)}</div>
              <div>
                <p className="text-[15px] font-bold text-text-main">{detailOrder.customer}</p>
                <p className="text-[12px] text-text-sub font-mono">{detailOrder.id}</p>
              </div>
              <div className="ml-auto"><StatusBadge status={detailOrder.status} /></div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {[
                { label: "Product",    value: detailOrder.product },
                { label: "Amount",     value: `$${detailOrder.amount.toLocaleString()}`, mono: true },
                { label: "Date",       value: detailOrder.date },
                { label: "Payment",    value: detailOrder.method },
                { label: "Items",      value: detailOrder.items },
              ].map(f => (
                <div key={f.label} className="bg-bg-input rounded-xl p-3 border border-border-card">
                  <p className="text-[11px] text-text-dim mb-1">{f.label}</p>
                  <p className={`text-[13px] text-text-main font-medium ${f.mono ? "font-mono" : ""}`}>{f.value}</p>
                </div>
              ))}
            </div>
            <div className="flex gap-2 pt-1">
              <button onClick={() => { show("Invoice downloaded!", "success"); setDetail(null); }}
                className="flex-1 flex items-center justify-center gap-2 bg-accent text-accent-foreground text-[13px] font-bold py-2.5 rounded-xl hover:bg-accent-hover transition-all cursor-pointer">
                <Icon path={icons.download} className="w-4 h-4" /> Download Invoice
              </button>
              <button onClick={() => { show("Order refunded", "error"); setDetail(null); }}
                className="px-4 py-2.5 rounded-xl bg-red-500/10 text-red-500 text-[13px] border border-red-500/20 hover:bg-red-550/20 transition-colors cursor-pointer">
                Refund
              </button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
