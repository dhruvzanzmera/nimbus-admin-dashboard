import { useState, useMemo } from "react";
import { Icon, icons, StatusBadge } from "../components/Icon";
import { TableCard, Table, Pagination, SearchInput, SegmentFilter, usePagination, Modal, DropdownMenu, useToast, Toast } from "../components/Table";

const grad = () => "from-slate-500 to-slate-700";
const initials = (name) => name.split(" ").map(n => n[0]).join("").slice(0, 2);

const USERS = [
  { id: "USR-001", name: "Priya Sharma",   email: "priya@nimbus.io",   role: "Admin",  plan: "Pro Annual",  status: "active",    joined: "Jan 12, 2024", spend: 1820,  lastSeen: "2m ago" },
  { id: "USR-002", name: "Daniel Cho",     email: "daniel@nimbus.io",  role: "Owner",  plan: "Team 12",     status: "active",    joined: "Feb 3, 2024",  spend: 14040, lastSeen: "15m ago" },
  { id: "USR-003", name: "Amara Obi",      email: "amara@nimbus.io",   role: "Member", plan: "Starter",     status: "active",    joined: "Mar 18, 2024", spend: 267,   lastSeen: "1h ago" },
  { id: "USR-004", name: "Lucas Meyer",    email: "lucas@nimbus.io",   role: "Member", plan: "Pro Monthly", status: "inactive",  joined: "Apr 7, 2024",  spend: 516,   lastSeen: "3d ago" },
  { id: "USR-005", name: "Hana Kobayashi", email: "hana@nimbus.io",    role: "Member", plan: "Pro Monthly", status: "suspended", joined: "Apr 22, 2024", spend: 129,   lastSeen: "7d ago" },
  { id: "USR-006", name: "Omar Haddad",    email: "omar@nimbus.io",    role: "Admin",  plan: "Team 5",      status: "active",    joined: "May 5, 2024",  spend: 5850,  lastSeen: "Just now" },
  { id: "USR-007", name: "Sofia Rossi",    email: "sofia@nimbus.io",   role: "Member", plan: "Starter",     status: "active",    joined: "May 20, 2024", spend: 178,   lastSeen: "30m ago" },
  { id: "USR-008", name: "Ravi Patel",     email: "ravi@nimbus.io",    role: "Member", plan: "Pro Annual",  status: "active",    joined: "Jun 8, 2024",  spend: 1299,  lastSeen: "2h ago" },
  { id: "USR-009", name: "Nadia Ivanova",  email: "nadia@nimbus.io",   role: "Member", plan: "Starter",     status: "inactive",  joined: "Jun 30, 2024", spend: 89,    lastSeen: "5d ago" },
  { id: "USR-010", name: "Carlos Lima",    email: "carlos@nimbus.io",  role: "Owner",  plan: "Team 8",      status: "active",    joined: "Jul 14, 2024", spend: 9360,  lastSeen: "5m ago" },
  { id: "USR-011", name: "Mei Lin",        email: "mei@nimbus.io",     role: "Member", plan: "Pro Annual",  status: "active",    joined: "Jul 28, 2024", spend: 1299,  lastSeen: "1h ago" },
  { id: "USR-012", name: "Ethan Brooks",   email: "ethan@nimbus.io",   role: "Admin",  plan: "Team 12",     status: "active",    joined: "Aug 1, 2024",  spend: 4680,  lastSeen: "10m ago" },
];

const ROLE_STYLES = {
  Admin:  "text-blue-700 dark:text-blue-300 bg-blue-50 dark:bg-blue-950/20 border-blue-200 dark:border-blue-500/20",
  Owner:  "text-text-muted bg-bg-hover border-border-card",
  Member: "text-text-muted bg-bg-hover border-border-card",
};

export default function Users() {
  const [query, setQuery]           = useState("");
  const [statusFilter, setStatus]   = useState("all");
  const [roleFilter, setRole]       = useState("all");
  const [selected, setSelected]     = useState([]);
  const [editUser, setEditUser]     = useState(null);
  const [inviteOpen, setInvite]     = useState(false);
  const { toasts, show }            = useToast();

  const filtered = useMemo(() => {
    const q = query.toLowerCase();
    return USERS.filter(u =>
      (u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q) || u.id.toLowerCase().includes(q)) &&
      (statusFilter === "all" || u.status === statusFilter) &&
      (roleFilter === "all" || u.role === roleFilter)
    );
  }, [query, statusFilter, roleFilter]);

  const { page, setPage, totalPages, paginated } = usePagination(filtered, 8);

  const statusOpts = [
    { value: "all",       label: "All",       count: USERS.length },
    { value: "active",    label: "Active",    count: USERS.filter(u => u.status === "active").length },
    { value: "inactive",  label: "Inactive",  count: USERS.filter(u => u.status === "inactive").length },
    { value: "suspended", label: "Suspended", count: USERS.filter(u => u.status === "suspended").length },
  ];

  const COLS = [
    {
      key: "name", label: "User",
      render: (r) => (
        <div className="flex items-center gap-3">
          <div className={`w-9 h-9 rounded-full bg-gradient-to-br ${grad(r.name)} flex items-center justify-center text-[11px] font-bold text-white shrink-0 ring-2 ring-bg-sidebar`}>
            {initials(r.name)}
          </div>
          <div className="min-w-0">
            <p className="text-[13px] font-semibold text-text-main truncate">{r.name}</p>
            <p className="text-[11px] text-text-dim truncate">{r.email}</p>
          </div>
        </div>
      )
    },
    {
      key: "role", label: "Role",
      render: (r) => <span className={`inline-flex text-[11px] font-semibold px-2.5 py-0.5 rounded-full border ${ROLE_STYLES[r.role]}`}>{r.role}</span>
    },
    { key: "plan",    label: "Plan",     cellClassName: "text-text-sub text-[13px] hidden md:table-cell", className: "hidden md:table-cell" },
    { key: "status",  label: "Status",   render: r => <StatusBadge status={r.status} /> },
    { key: "joined",  label: "Joined",   cellClassName: "text-text-sub text-[12px] hidden lg:table-cell", className: "hidden lg:table-cell" },
    {
      key: "spend", label: "Spend",
      cellClassName: "font-mono font-semibold text-text-main text-[13px]",
      render: r => `$${r.spend.toLocaleString()}`
    },
    { key: "lastSeen", label: "Last seen", cellClassName: "text-text-dim text-[12px] hidden xl:table-cell", className: "hidden xl:table-cell" },
    {
      key: "_a", label: "", sortable: false,
      render: (r) => (
        <DropdownMenu
          trigger={
            <button className="w-7 h-7 flex items-center justify-center rounded-lg text-text-dim hover:text-text-main hover:bg-bg-hover transition-colors cursor-pointer">
              <Icon path={icons.dotsV} className="w-4 h-4" />
            </button>
          }
          items={[
            { label: "View profile", icon: icons.eye,    onClick: () => setEditUser(r) },
            { label: "Edit user",    icon: icons.edit,   onClick: () => { setEditUser(r); show("Editing " + r.name, "default"); } },
            { label: "Copy email",   icon: icons.copy,   onClick: () => show("Email copied!", "success") },
            "---",
            { label: r.status === "suspended" ? "Unsuspend" : "Suspend", icon: icons.shield, onClick: () => show(`${r.name} ${r.status === "suspended" ? "reactivated" : "suspended"}`, r.status === "suspended" ? "success" : "default") },
            { label: "Delete user",  icon: icons.trash,  danger: true, onClick: () => show(`${r.name} deleted`, "error") },
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
          <h1 className="text-[22px] font-bold font-display tracking-tight text-text-main">Users</h1>
          <p className="text-[13px] text-text-sub mt-1">{USERS.length} total members across all plans</p>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          {selected.length > 0 && (
            <div className="flex items-center gap-2 bg-accent-light border border-accent-border rounded-xl px-3 py-2">
              <span className="text-[12px] text-accent font-medium">{selected.length} selected</span>
              <button onClick={() => show(`${selected.length} users deleted`, "error")} className="text-[12px] text-red-500 hover:underline">Delete</button>
              <button onClick={() => setSelected([])} className="text-text-sub hover:text-text-main"><Icon path={icons.x} className="w-3.5 h-3.5" /></button>
            </div>
          )}
          <button onClick={() => show("CSV exported!", "success")} className="inline-flex items-center gap-2 bg-bg-card border border-border-card text-text-muted text-[13px] font-medium px-4 py-2 rounded-xl hover:border-border-hover hover:text-text-main transition-all cursor-pointer">
            <Icon path={icons.download} className="w-4 h-4" /> Export CSV
          </button>
          <button onClick={() => setInvite(true)} className="inline-flex items-center gap-2 bg-accent text-accent-foreground text-[13px] font-bold px-4 py-2 rounded-xl hover:bg-accent-hover transition-all cursor-pointer">
            <Icon path={icons.userPlus} className="w-4 h-4" /> Invite User
          </button>
        </div>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Total Members",  value: USERS.length,                                      color: "var(--text-main)", sub: "across all plans" },
          { label: "Active Now",     value: USERS.filter(u => u.status === "active").length,    color: "var(--accent)", sub: "healthy growth" },
          { label: "Inactive",       value: USERS.filter(u => u.status === "inactive").length,  color: "var(--text-muted)", sub: "need re-engagement" },
          { label: "Suspended",      value: USERS.filter(u => u.status === "suspended").length, color: "var(--text-muted)", sub: "policy violations" },
        ].map(s => (
          <div key={s.label} className="bg-bg-card border border-border-card rounded-2xl px-5 py-4 hover:border-border-hover transition-all">
            <p className="text-[11px] font-medium text-text-sub uppercase tracking-wider">{s.label}</p>
            <p className="text-[28px] font-bold font-display mt-1" style={{ color: s.color }}>{s.value}</p>
            <p className="text-[11px] text-text-dim mt-0.5">{s.sub}</p>
          </div>
        ))}
      </div>

      {/* Table */}
      <TableCard
        title="All Members"
        subtitle={`Showing ${filtered.length} of ${USERS.length} users`}
        toolbar={
          <>
            <SearchInput value={query} onChange={v => { setQuery(v); setPage(1); }} placeholder="Search by name, email…" className="w-56" />
            <select value={roleFilter} onChange={e => { setRole(e.target.value); setPage(1); }}
              className="bg-bg-input border border-border-card rounded-xl px-3 py-2 text-[12px] text-text-muted outline-none focus:border-accent/40 transition-colors cursor-pointer">
              <option value="all">All Roles</option>
              <option value="Owner">Owner</option>
              <option value="Admin">Admin</option>
              <option value="Member">Member</option>
            </select>
            <SegmentFilter options={statusOpts} value={statusFilter} onChange={v => { setStatus(v); setPage(1); }} />
          </>
        }
        footer={<Pagination page={page} totalPages={totalPages} total={filtered.length} pageSize={8} setPage={setPage} />}
      >
        <Table
          columns={COLS}
          data={paginated}
          emptyText={`No users match "${query}"`}
          selectable
          selected={selected}
          onSelect={setSelected}
          onSelectAll={setSelected}
          rowKey={r => r.id}
          onRowClick={r => setEditUser(r)}
        />
      </TableCard>

      {/* User Detail / Edit Modal */}
      <Modal open={!!editUser} onClose={() => setEditUser(null)} title="User Profile" size="md">
        {editUser && (
          <div className="space-y-4">
            <div className="flex items-center gap-4 pb-4 border-b border-border-card">
              <div className={`w-14 h-14 rounded-full bg-gradient-to-br ${grad(editUser.name)} flex items-center justify-center text-lg font-bold text-white`}>{initials(editUser.name)}</div>
              <div>
                <p className="text-[16px] font-bold text-text-main">{editUser.name}</p>
                <p className="text-[13px] text-text-sub">{editUser.email}</p>
                <div className="flex items-center gap-2 mt-1.5">
                  <span className={`inline-flex text-[11px] font-semibold px-2 py-0.5 rounded-full border ${ROLE_STYLES[editUser.role]}`}>{editUser.role}</span>
                  <StatusBadge status={editUser.status} />
                </div>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {[
                { label: "User ID", value: editUser.id, mono: true },
                { label: "Plan", value: editUser.plan },
                { label: "Joined", value: editUser.joined },
                { label: "Total Spend", value: `$${editUser.spend.toLocaleString()}`, mono: true },
                { label: "Last Seen", value: editUser.lastSeen },
                { label: "Status", value: <StatusBadge status={editUser.status} /> },
              ].map(f => (
                <div key={f.label} className="bg-bg-input rounded-xl p-3 border border-border-card">
                  <p className="text-[11px] text-text-sub mb-1">{f.label}</p>
                  <p className={`text-[13px] text-text-main font-medium ${f.mono ? "font-mono" : ""}`}>{f.value}</p>
                </div>
              ))}
            </div>
            <div className="flex gap-2 pt-1">
              <button onClick={() => { show(`${editUser.name} updated!`, "success"); setEditUser(null); }}
                className="flex-1 bg-accent text-accent-foreground text-[13px] font-bold py-2.5 rounded-xl hover:bg-accent-hover transition-all cursor-pointer">
                Save Changes
              </button>
              <button onClick={() => { show(`${editUser.name} deleted`, "error"); setEditUser(null); }}
                className="px-4 py-2.5 rounded-xl bg-red-500/10 text-red-500 text-[13px] border border-red-500/20 hover:bg-red-550/20 transition-colors cursor-pointer">
                Delete
              </button>
            </div>
          </div>
        )}
      </Modal>

      {/* Invite Modal */}
      <Modal open={inviteOpen} onClose={() => setInvite(false)} title="Invite User" size="sm">
        <div className="space-y-4">
          <div>
            <label className="block text-[12px] text-text-sub mb-1.5">Email address</label>
            <input placeholder="colleague@company.com" className="w-full bg-bg-input border border-border-card rounded-xl px-4 py-2.5 text-[13px] text-text-main outline-none focus:border-accent/40 placeholder:text-text-dim transition-colors" />
          </div>
          <div>
            <label className="block text-[12px] text-text-sub mb-1.5">Role</label>
            <select className="w-full bg-bg-input border border-border-card rounded-xl px-4 py-2.5 text-[13px] text-text-muted outline-none focus:border-accent/40 transition-colors cursor-pointer">
              <option>Member</option><option>Admin</option><option>Owner</option>
            </select>
          </div>
          <button onClick={() => { show("Invitation sent!", "success"); setInvite(false); }}
            className="w-full bg-accent text-accent-foreground text-[13px] font-bold py-2.5 rounded-xl hover:bg-accent-hover transition-all cursor-pointer">
            Send Invitation
          </button>
        </div>
      </Modal>
    </div>
  );
}
