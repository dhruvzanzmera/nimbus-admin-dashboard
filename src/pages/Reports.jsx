import { useState, useMemo } from "react";
import { Icon, icons, StatusBadge } from "../components/Icon";
import { TableCard, Table, Pagination, SearchInput, SegmentFilter, usePagination, Modal, DropdownMenu, useToast, Toast } from "../components/Table";

const REPORTS = [
  { id: "RPT-0021", name: "Monthly Revenue Summary",     type: "Financial",  generated: "Aug 21, 2024", size: "2.4 MB", status: "published", author: "System", pages: 12 },
  { id: "RPT-0020", name: "User Acquisition Q3",         type: "Growth",     generated: "Aug 15, 2024", size: "1.8 MB", status: "published", author: "Priya Sharma", pages: 8 },
  { id: "RPT-0019", name: "Churn Analysis — Aug",        type: "Retention",  generated: "Aug 10, 2024", size: "3.1 MB", status: "draft",     author: "Omar Haddad", pages: 20 },
  { id: "RPT-0018", name: "Infrastructure Cost Report",  type: "Operations", generated: "Aug 5, 2024",  size: "0.9 MB", status: "published", author: "System", pages: 5 },
  { id: "RPT-0017", name: "Sales Pipeline Q3",           type: "Sales",      generated: "Jul 31, 2024", size: "1.4 MB", status: "published", author: "Daniel Cho", pages: 9 },
  { id: "RPT-0016", name: "Customer Satisfaction",       type: "CX",         generated: "Jul 25, 2024", size: "2.0 MB", status: "draft",     author: "Amara Obi", pages: 14 },
  { id: "RPT-0015", name: "Product Usage Analytics",     type: "Product",    generated: "Jul 20, 2024", size: "4.2 MB", status: "published", author: "System", pages: 25 },
  { id: "RPT-0014", name: "Security Audit Q2",           type: "Security",   generated: "Jun 30, 2024", size: "1.1 MB", status: "published", author: "Ravi Patel", pages: 7 },
];

const TYPE_STYLES = {
  Financial:  "text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-500/20",
  Growth:     "text-sky-650 dark:text-sky-400 bg-sky-50 dark:bg-sky-950/20 border-sky-200 dark:border-sky-500/20",
  Retention:  "text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/20 border-amber-200 dark:border-amber-500/20",
  Operations: "text-violet-650 dark:text-violet-400 bg-violet-50 dark:bg-violet-950/20 border-violet-200 dark:border-violet-500/20",
  Sales:      "text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/20 border-rose-200 dark:border-rose-500/20",
  CX:         "text-slate-655 dark:text-slate-400 bg-slate-100 dark:bg-slate-800/10 border-slate-200 dark:border-slate-700/20",
  Product:    "text-teal-650 dark:text-teal-400 bg-teal-50 dark:bg-teal-950/20 border-teal-200 dark:border-teal-500/20",
  Security:   "text-orange-600 dark:text-orange-400 bg-orange-50 dark:bg-orange-950/20 border-orange-200 dark:border-orange-500/20",
};

export default function Reports() {
  const [query,        setQuery]    = useState("");
  const [statusFilter, setStatus]   = useState("all");
  const [selected,     setSelected] = useState([]);
  const [preview,      setPreview]  = useState(null);
  const { toasts, show }            = useToast();

  const filtered = useMemo(() => {
    const q = query.toLowerCase();
    return REPORTS.filter(r =>
      (r.name.toLowerCase().includes(q) || r.type.toLowerCase().includes(q) || r.id.toLowerCase().includes(q)) &&
      (statusFilter === "all" || r.status === statusFilter)
    );
  }, [query, statusFilter]);

  const { page, setPage, totalPages, paginated } = usePagination(filtered, 6);

  const statusOpts = [
    { value: "all",       label: "All",       count: REPORTS.length },
    { value: "published", label: "Published", count: REPORTS.filter(r => r.status === "published").length },
    { value: "draft",     label: "Draft",     count: REPORTS.filter(r => r.status === "draft").length },
  ];

  const COLS = [
    {
      key: "name", label: "Report",
      render: r => (
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-bg-hover flex items-center justify-center shrink-0">
            <Icon path={icons.file} className="w-4 h-4 text-accent" />
          </div>
          <div>
            <p className="text-[13px] font-semibold text-text-main">{r.name}</p>
            <p className="text-[11px] text-text-dim font-mono">{r.id}</p>
          </div>
        </div>
      )
    },
    { key: "type",      label: "Type",      render: r => <span className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-full border ${TYPE_STYLES[r.type]}`}>{r.type}</span> },
    { key: "author",    label: "Author",    cellClassName: "text-text-sub text-[12px] hidden md:table-cell", className: "hidden md:table-cell" },
    { key: "generated", label: "Generated", cellClassName: "text-text-sub text-[12px] hidden sm:table-cell", className: "hidden sm:table-cell" },
    { key: "size",      label: "Size",      cellClassName: "text-text-sub text-[12px] hidden lg:table-cell", className: "hidden lg:table-cell" },
    { key: "pages",     label: "Pages",     cellClassName: "text-text-muted text-[12px] hidden lg:table-cell", className: "hidden lg:table-cell" },
    { key: "status",    label: "Status",    render: r => <StatusBadge status={r.status} /> },
    {
      key: "_a", label: "", sortable: false,
      render: r => (
        <DropdownMenu
          trigger={<button className="w-7 h-7 flex items-center justify-center rounded-lg text-text-dim hover:text-text-main hover:bg-bg-hover transition-colors cursor-pointer"><Icon path={icons.dotsV} className="w-4 h-4" /></button>}
          items={[
            { label: "Preview",       icon: icons.eye,      onClick: () => setPreview(r) },
            { label: "Download PDF",  icon: icons.download, onClick: () => show(`${r.name} downloaded!`, "success") },
            { label: "Duplicate",     icon: icons.copy,     onClick: () => show("Report duplicated", "default") },
            "---",
            { label: r.status === "published" ? "Unpublish" : "Publish", icon: icons.globe, onClick: () => show(`Report ${r.status === "published" ? "unpublished" : "published"}!`, "success") },
            { label: "Delete",        icon: icons.trash,    danger: true, onClick: () => show(`${r.name} deleted`, "error") },
          ]}
        />
      )
    },
  ];

  return (
    <div className="space-y-6">
      <Toast toasts={toasts} />

      {/* Header */}
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-[22px] font-bold font-display tracking-tight text-text-main">Reports</h1>
          <p className="text-[13px] text-text-sub mt-1">Analytics reports and data exports</p>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          {selected.length > 0 && (
            <div className="flex items-center gap-2 bg-accent-light border border-accent-border rounded-xl px-3 py-2">
              <span className="text-[12px] text-accent font-medium">{selected.length} selected</span>
              <button onClick={() => { show(`${selected.length} reports downloaded`, "success"); setSelected([]); }} className="text-[12px] text-accent hover:underline">Download all</button>
              <button onClick={() => setSelected([])} className="text-text-sub hover:text-text-main"><Icon path={icons.x} className="w-3.5 h-3.5" /></button>
            </div>
          )}
          <button className="inline-flex items-center gap-2 bg-accent text-bg-sidebar text-[13px] font-bold px-4 py-2 rounded-xl hover:bg-accent-hover transition-all shadow-[0_0_20px_var(--accent-light)] cursor-pointer">
            <Icon path={icons.plus} className="w-4 h-4" /> Generate Report
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Total Reports",   value: REPORTS.length,                                          color: "var(--text-main)" },
          { label: "Published",       value: REPORTS.filter(r => r.status === "published").length,    color: "var(--accent)" },
          { label: "Drafts",          value: REPORTS.filter(r => r.status === "draft").length,        color: "#FBBF24" },
          { label: "This Month",      value: REPORTS.filter(r => r.generated.includes("Aug")).length, color: "#38BDF8" },
        ].map(s => (
          <div key={s.label} className="bg-bg-card border border-border-card rounded-2xl px-5 py-4 hover:border-border-hover transition-all">
            <p className="text-[11px] font-medium text-text-sub uppercase tracking-wider">{s.label}</p>
            <p className="text-[28px] font-bold font-display mt-1" style={{ color: s.color }}>{s.value}</p>
          </div>
        ))}
      </div>

      {/* Table */}
      <TableCard
        title="All Reports"
        subtitle={`${filtered.length} reports found`}
        toolbar={
          <>
            <SearchInput value={query} onChange={v => { setQuery(v); setPage(1); }} placeholder="Search reports…" className="w-52" />
            <SegmentFilter options={statusOpts} value={statusFilter} onChange={v => { setStatus(v); setPage(1); }} />
          </>
        }
        footer={<Pagination page={page} totalPages={totalPages} total={filtered.length} pageSize={6} setPage={setPage} />}
      >
        <Table
          columns={COLS}
          data={paginated}
          emptyText={`No reports match "${query}"`}
          selectable
          selected={selected}
          onSelect={setSelected}
          onSelectAll={setSelected}
          rowKey={r => r.id}
          onRowClick={r => setPreview(r)}
        />
      </TableCard>

      {/* Preview Modal */}
      <Modal open={!!preview} onClose={() => setPreview(null)} title="Report Preview" size="lg">
        {preview && (
          <div className="space-y-4">
            <div className="flex items-start gap-4 pb-4 border-b border-border-card">
              <div className="w-12 h-12 rounded-xl bg-bg-hover flex items-center justify-center shrink-0">
                <Icon path={icons.file} className="w-6 h-6 text-accent" />
              </div>
              <div className="flex-1">
                <p className="text-[16px] font-bold text-text-main">{preview.name}</p>
                <p className="text-[12px] text-text-dim mt-0.5 font-mono">{preview.id}</p>
                <div className="flex items-center gap-2 mt-2">
                  <span className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-full border ${TYPE_STYLES[preview.type]}`}>{preview.type}</span>
                  <StatusBadge status={preview.status} />
                </div>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-3">
              {[
                { label: "Generated",   value: preview.generated },
                { label: "Author",      value: preview.author },
                { label: "File Size",   value: preview.size },
                { label: "Pages",       value: `${preview.pages} pages` },
                { label: "Report ID",   value: preview.id, mono: true },
              ].map(f => (
                <div key={f.label} className="bg-bg-input rounded-xl p-3 border border-border-card">
                  <p className="text-[11px] text-text-dim mb-1">{f.label}</p>
                  <p className={`text-[13px] text-text-main font-medium ${f.mono ? "font-mono" : ""}`}>{f.value}</p>
                </div>
              ))}
            </div>
            {/* Mock preview area */}
            <div className="bg-bg-input rounded-xl border border-border-card p-6 text-center min-h-[100px] flex items-center justify-center">
              <div className="text-text-dim">
                <Icon path={icons.file} className="w-10 h-10 mx-auto mb-2 opacity-40" />
                <p className="text-[13px]">PDF preview not available in demo</p>
              </div>
            </div>
            <div className="flex gap-2 pt-1">
              <button onClick={() => { show(`${preview.name} downloaded!`, "success"); setPreview(null); }}
                className="flex-1 flex items-center justify-center gap-2 bg-accent text-bg-sidebar text-[13px] font-bold py-2.5 rounded-xl hover:bg-accent-hover transition-all cursor-pointer">
                <Icon path={icons.download} className="w-4 h-4" /> Download PDF
              </button>
              <button onClick={() => setPreview(null)}
                className="px-4 py-2.5 rounded-xl bg-bg-hover text-text-muted text-[13px] border border-border-card hover:text-text-main transition-colors cursor-pointer">
                Close
              </button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
