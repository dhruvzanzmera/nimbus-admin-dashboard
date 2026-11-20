import { useState, useMemo } from "react";
import { Icon, icons } from "./Icon";

/* ── Pagination helper ── */
export function usePagination(data, pageSize = 10) {
  const [page, setPage] = useState(1);
  const totalPages = Math.max(1, Math.ceil(data.length / pageSize));
  const safePage = Math.min(page, totalPages);
  const paginated = useMemo(
    () => data.slice((safePage - 1) * pageSize, safePage * pageSize),
    [data, safePage, pageSize]
  );
  return { page: safePage, setPage, totalPages, paginated };
}

/* ── Sortable Table ── */
export function Table({
  columns,
  data,
  emptyText = "No data found.",
  selectable = false,
  selected = [],
  onSelect,
  onSelectAll,
  rowKey = (r, i) => i,
  onRowClick,
}) {
  const [sortKey, setSortKey] = useState(null);
  const [sortDir, setSortDir] = useState("asc");

  const sorted = useMemo(() => {
    if (!sortKey) return data;
    return [...data].sort((a, b) => {
      const av = a[sortKey]; const bv = b[sortKey];
      const cmp = typeof av === "number"
        ? av - bv
        : String(av ?? "").localeCompare(String(bv ?? ""));
      return sortDir === "asc" ? cmp : -cmp;
    });
  }, [data, sortKey, sortDir]);

  const toggleSort = (key) => {
    if (sortKey === key) setSortDir(d => d === "asc" ? "desc" : "asc");
    else { setSortKey(key); setSortDir("asc"); }
  };

  const allSelected = data.length > 0 && data.every(r => selected.includes(rowKey(r)));

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="border-b border-border-main">
            {selectable && (
              <th className="w-10 px-4 py-3">
                <input
                  type="checkbox"
                  checked={allSelected}
                  onChange={() => onSelectAll?.(allSelected ? [] : data.map(rowKey))}
                  className="accent-accent w-3.5 h-3.5 cursor-pointer"
                />
              </th>
            )}
            {columns.map((col) => (
              <th
                key={col.key}
                className={`px-4 py-3 text-[11px] font-semibold uppercase tracking-wider text-text-sub select-none whitespace-nowrap ${col.className || ""} ${col.sortable !== false && !col.render?.noSort ? "cursor-pointer hover:text-text-main transition-colors" : ""}`}
                onClick={() => col.sortable !== false && !col.render ? toggleSort(col.key) : undefined}
              >
                <div className="flex items-center gap-1.5">
                  {col.label}
                  {col.sortable !== false && !col.render && (
                    <span className="opacity-40">
                      {sortKey === col.key
                        ? <Icon path={sortDir === "asc" ? icons.chevronUp : icons.chevronDown} className="w-3 h-3 opacity-100 text-accent" />
                        : <Icon path={icons.chevronDown} className="w-3 h-3" />}
                    </span>
                  )}
                </div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {sorted.length === 0 ? (
            <tr>
              <td colSpan={columns.length + (selectable ? 1 : 0)} className="px-4 py-16 text-center">
                <div className="flex flex-col items-center gap-2 text-text-dim">
                  <Icon path={icons.filter} className="w-8 h-8 opacity-40" />
                  <p className="text-[13px]">{emptyText}</p>
                </div>
              </td>
            </tr>
          ) : (
            sorted.map((row, rowIdx) => {
              const key = rowKey(row, rowIdx);
              const isSelected = selected.includes(key);
              return (
                <tr
                  key={key}
                  onClick={() => onRowClick?.(row)}
                  className={`border-b border-border-main/50 transition-all duration-150 group
                    ${onRowClick ? "cursor-pointer" : ""}
                    ${isSelected ? "bg-accent-light border-accent-border" : "hover:bg-bg-hover"}`}
                >
                  {selectable && (
                    <td className="w-10 px-4 py-3.5" onClick={e => e.stopPropagation()}>
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => {
                          const next = isSelected
                            ? selected.filter(s => s !== key)
                            : [...selected, key];
                          onSelect?.(next);
                        }}
                        className="accent-accent w-3.5 h-3.5 cursor-pointer"
                      />
                    </td>
                  )}
                  {columns.map((col) => (
                    <td
                      key={col.key}
                      className={`px-4 py-3.5 text-[13px] text-text-muted whitespace-nowrap ${col.cellClassName || ""}`}
                    >
                      {col.render ? col.render(row, rowIdx) : row[col.key]}
                    </td>
                  ))}
                </tr>
              );
            })
          )}
        </tbody>
      </table>
    </div>
  );
}

/* ── Pagination Bar ── */
export function Pagination({ page, totalPages, total, pageSize, setPage }) {
  const start = Math.min((page - 1) * pageSize + 1, total);
  const end = Math.min(page * pageSize, total);
  const pages = useMemo(() => {
    const arr = [];
    const delta = 1;
    for (let i = 1; i <= totalPages; i++) {
      if (i === 1 || i === totalPages || (i >= page - delta && i <= page + delta)) arr.push(i);
      else if (arr[arr.length - 1] !== "…") arr.push("…");
    }
    return arr;
  }, [page, totalPages]);

  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 px-4 py-3.5 border-t border-border-card">
      <p className="text-[12px] text-text-sub">
        Showing <span className="text-text-muted font-medium">{start}–{end}</span> of <span className="text-text-muted font-medium">{total}</span>
      </p>
      <div className="flex items-center gap-1">
        <PgBtn onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1} icon={icons.chevronLeft} />
        {pages.map((p, i) =>
          p === "…"
            ? <span key={`e${i}`} className="px-2 py-1 text-[12px] text-text-dim">…</span>
            : <button
              key={p}
              onClick={() => setPage(p)}
              className={`min-w-[30px] h-7 px-2 rounded-md text-[12px] font-medium transition-colors ${page === p ? "bg-accent text-accent-foreground font-bold" : "text-text-muted hover:bg-bg-hover hover:text-text-main"}`}
            >{p}</button>
        )}
        <PgBtn onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages} icon={icons.chevronRight} />
      </div>
    </div>
  );
}

function PgBtn({ onClick, disabled, icon }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className="w-7 h-7 flex items-center justify-center rounded-md text-text-muted hover:bg-bg-hover hover:text-text-main disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
    >
      <Icon path={icon} className="w-3.5 h-3.5" />
    </button>
  );
}

/* ── Card wrapper ── */
export function TableCard({ title, subtitle, toolbar, footer, children, className = "" }) {
  return (
    <div className={`bg-bg-card border border-border-card rounded-2xl overflow-hidden shadow-sm ${className}`}>
      {(title || toolbar) && (
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-5 py-4 border-b border-border-card">
          <div>
            {title && <h2 className="text-[14px] font-semibold text-text-main">{title}</h2>}
            {subtitle && <p className="text-[12px] text-text-sub mt-0.5">{subtitle}</p>}
          </div>
          {toolbar && <div className="flex flex-wrap items-center gap-2">{toolbar}</div>}
        </div>
      )}
      {children}
      {footer}
    </div>
  );
}

/* ── Search Input ── */
export function SearchInput({ value, onChange, placeholder = "Search…", className = "" }) {
  return (
    <div className={`flex items-center gap-2 bg-bg-input border border-border-card rounded-xl px-3 py-2 focus-within:border-accent/40 transition-colors ${className}`}>
      <Icon path={icons.search} className="w-3.5 h-3.5 text-text-dim shrink-0" />
      <input
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        className="bg-transparent outline-none text-[13px] text-text-main placeholder:text-text-dim w-full min-w-0"
      />
      {value && (
        <button onClick={() => onChange("")} className="text-text-dim hover:text-text-main transition-colors">
          <Icon path={icons.x} className="w-3.5 h-3.5" />
        </button>
      )}
    </div>
  );
}

/* ── Segmented Filter ── */
export function SegmentFilter({ options, value, onChange }) {
  return (
    <div className="flex items-center bg-bg-input border border-border-card rounded-xl p-1 gap-0.5">
      {options.map(opt => (
        <button
          key={opt.value ?? opt}
          onClick={() => onChange(opt.value ?? opt)}
          className={`px-3 py-1.5 rounded-lg text-[12px] font-medium capitalize transition-all ${(opt.value ?? opt) === value ? "bg-bg-hover text-text-main shadow-sm" : "text-text-sub hover:text-text-muted"}`}
        >
          {opt.label ?? opt}
          {opt.count !== undefined && (
            <span className={`ml-1.5 text-[10px] px-1 rounded ${(opt.value ?? opt) === value ? "text-accent font-semibold" : "text-text-dim"}`}>{opt.count}</span>
          )}
        </button>
      ))}
    </div>
  );
}

/* ── Stat Card ── */
export function StatCard({ label, value, delta, up, icon, accent = "var(--accent)", spark }) {
  return (
    <div className="bg-bg-card border border-border-card rounded-2xl p-5 flex flex-col gap-3 hover:border-border-hover transition-all duration-200 group relative overflow-hidden">
      <div className="flex items-start justify-between relative">
        <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0" style={{ background: "var(--accent-light)", color: accent }}>
          <Icon path={icon} className="w-4.5 h-4.5" style={{ width: "18px", height: "18px" }} />
        </div>
        {delta !== undefined && (
          <span className={`inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-full ${up ? "text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-450/10" : "text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-450/10"}`}>
            <Icon path={up ? icons.trendingUp : icons.trendingDown} className="w-3 h-3" />
            {Math.abs(delta)}%
          </span>
        )}
      </div>
      <div className="relative">
        <p className="text-[12px] text-text-sub font-medium">{label}</p>
        <p className="text-2xl font-bold text-text-main font-display tracking-tight mt-0.5">{value}</p>
        {spark && (
          <div className="flex items-end gap-[3px] h-6 mt-2">
            {(() => {
              const max = Math.max(...spark); return spark.map((p, i) => (
                <div key={i} className="flex-1 rounded-sm transition-all" style={{ height: `${(p / max) * 100}%`, background: up !== false ? `color-mix(in srgb, ${accent} 38%, transparent)` : "var(--chart-3)" }} />
              ));
            })()}
          </div>
        )}
      </div>
    </div>
  );
}

/* ── Modal ── */
export function Modal({ open, onClose, title, children, size = "md" }) {
  if (!open) return null;
  const sizes = { sm: "max-w-sm", md: "max-w-lg", lg: "max-w-2xl", xl: "max-w-4xl" };
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
      <div
        className={`relative w-full ${sizes[size]} bg-bg-card border border-border-main rounded-2xl shadow-2xl`}
        onClick={e => e.stopPropagation()}
        style={{ animation: "modalIn 0.18s cubic-bezier(0.34,1.56,0.64,1)" }}
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-border-card">
          <h3 className="text-[15px] font-semibold text-text-main font-display">{title}</h3>
          <button onClick={onClose} className="w-7 h-7 flex items-center justify-center rounded-lg text-text-sub hover:text-text-main hover:bg-bg-hover transition-colors">
            <Icon path={icons.x} className="w-4 h-4" />
          </button>
        </div>
        <div className="px-6 py-5">{children}</div>
      </div>
    </div>
  );
}

/* ── Dropdown Menu ── */
export function DropdownMenu({ trigger, items }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="relative" onBlur={(e) => { if (!e.currentTarget.contains(e.relatedTarget)) setOpen(false); }} tabIndex={-1}>
      <div onClick={() => setOpen(o => !o)}>{trigger}</div>
      {open && (
        <div className="absolute right-0 top-full mt-1.5 w-44 bg-bg-card border border-border-main rounded-xl shadow-2xl z-40 py-1 overflow-hidden"
          style={{ animation: "menuIn 0.12s ease" }}>
          {items.map((item, i) =>
            item === "---"
              ? <div key={i} className="h-px bg-border-main my-1" />
              : <button
                key={i}
                onClick={() => { item.onClick?.(); setOpen(false); }}
                className={`w-full flex items-center gap-2.5 px-3.5 py-2 text-[13px] transition-colors ${item.danger ? "text-red-500 hover:bg-red-500/10" : "text-text-muted hover:text-text-main hover:bg-bg-hover"}`}
              >
                {item.icon && <Icon path={item.icon} className="w-3.5 h-3.5 shrink-0" />}
                {item.label}
              </button>
          )}
        </div>
      )}
    </div>
  );
}

/* ── Toast ── */
export function Toast({ toasts }) {
  return (
    <div className="fixed bottom-5 right-5 z-[100] flex flex-col gap-2 pointer-events-none">
      {toasts.map(t => (
        <div key={t.id} className={`flex items-center gap-3 px-4 py-3 rounded-xl border shadow-xl text-[13px] font-medium pointer-events-auto transition-all duration-200
          ${t.type === "success" ? "bg-emerald-50 dark:bg-emerald-950/80 border-emerald-200 dark:border-emerald-500/30 text-emerald-700 dark:text-emerald-400" :
            t.type === "error" ? "bg-red-50 dark:bg-red-950/80 border-red-200 dark:border-red-500/30 text-red-700 dark:text-red-400" :
              "bg-bg-card border-border-card text-text-main"}`}
          style={{ animation: "slideInRight 0.2s ease" }}>
          <Icon path={t.type === "success" ? icons.checkCircle : t.type === "error" ? icons.xCircle : icons.info} className="w-4 h-4 shrink-0" />
          {t.message}
        </div>
      ))}
    </div>
  );
}

export function useToast() {
  const [toasts, setToasts] = useState([]);
  const show = (message, type = "default") => {
    const id = Date.now();
    setToasts(t => [...t, { id, message, type }]);
    setTimeout(() => setToasts(t => t.filter(x => x.id !== id)), 3000);
  };
  return { toasts, show };
}
