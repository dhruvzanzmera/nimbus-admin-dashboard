import { useState } from "react";
import { Icon, icons } from "../components/Icon";
import { useToast, Toast } from "../components/Table";

function Toggle({ on, onChange }) {
  return (
    <button
      onClick={() => onChange(!on)}
      className="relative w-10 h-5 rounded-full transition-colors duration-200 focus:outline-none cursor-pointer"
      style={{ background: on ? "var(--accent)" : "var(--border-card)" }}
    >
      <span
        className="absolute top-0.5 w-4 h-4 rounded-full bg-white dark:bg-bg-sidebar shadow transition-transform duration-200"
        style={{ transform: on ? "translateX(22px)" : "translateX(2px)" }}
      />
    </button>
  );
}

function Section({ title, description, children }) {
  return (
    <div className="bg-bg-card border border-border-card rounded-2xl overflow-hidden shadow-sm">
      <div className="px-6 py-4 border-b border-border-card">
        <h2 className="text-[14px] font-semibold text-text-main">{title}</h2>
        {description && <p className="text-[12px] text-text-sub mt-0.5">{description}</p>}
      </div>
      <div className="px-6 py-2 divide-y divide-border-main/50">{children}</div>
    </div>
  );
}

function Row({ label, desc, children }) {
  return (
    <div className="flex items-start justify-between gap-6 py-4">
      <div className="min-w-0 flex-1">
        <p className="text-[13px] font-medium text-text-main">{label}</p>
        {desc && <p className="text-[12px] text-text-dim mt-0.5">{desc}</p>}
      </div>
      <div className="shrink-0 flex items-center">{children}</div>
    </div>
  );
}

function InputField({ label, defaultValue, type = "text", placeholder }) {
  return (
    <div>
      <label className="block text-[12px] font-medium text-text-sub mb-1.5">{label}</label>
      <input
        type={type}
        defaultValue={defaultValue}
        placeholder={placeholder}
        className="w-full bg-bg-input border border-border-card rounded-xl px-4 py-2.5 text-[13px] text-text-main outline-none focus:border-accent/40 placeholder:text-text-dim transition-colors"
      />
    </div>
  );
}

const TABS = ["Profile", "Notifications", "Security", "API Keys", "Billing", "Danger Zone"];

export default function Settings() {
  const [tab, setTab] = useState("Profile");
  const [notif, setNotif] = useState({ email: true, slack: false, sms: false, weekly: true, product: true, billing: true });
  const [sec, setSec]   = useState({ twofa: true, sessions: false, loginAlerts: true });
  const { toasts, show } = useToast();

  const API_KEYS = [
    { name: "Production API Key", key: "nim_prod_••••••••••••4f2a", created: "Jan 12, 2024", lastUsed: "2m ago",  scope: "Full access" },
    { name: "Development Key",    key: "nim_dev_••••••••••••8c1e",  created: "Mar 5, 2024",  lastUsed: "1d ago",  scope: "Read only" },
    { name: "Webhooks Secret",    key: "whsec_••••••••••••2b7d",    created: "Jun 20, 2024", lastUsed: "5m ago",  scope: "Webhooks" },
  ];

  return (
    <div className="space-y-6 max-w-4xl">
      <Toast toasts={toasts} />

      {/* Header */}
      <div>
        <h1 className="text-[22px] font-bold font-display tracking-tight text-text-main">Settings</h1>
        <p className="text-[13px] text-text-sub mt-1">Manage your account, workspace, and preferences</p>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-1 overflow-x-auto bg-bg-input border border-border-card rounded-2xl p-1.5 no-scrollbar">
        {TABS.map(t => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-4 py-2 rounded-xl text-[13px] font-medium transition-all whitespace-nowrap cursor-pointer ${
              tab === t ? "bg-bg-hover text-text-main shadow-sm" : "text-text-sub hover:text-text-muted"
            } ${t === "Danger Zone" ? "text-red-500 hover:text-red-400" : ""}`}
          >
            {t}
          </button>
        ))}
      </div>

      {/* Profile Tab */}
      {tab === "Profile" && (
        <div className="space-y-5">
          <Section title="Personal Information" description="Update your name, email, and profile photo">
            <div className="py-5">
              <div className="flex items-center gap-4 mb-6">
                <div className="relative">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#5EEAD4] to-[#3B82A0] flex items-center justify-center text-xl font-bold text-white font-display">RJ</div>
                  <button className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-accent flex items-center justify-center text-bg-sidebar hover:bg-accent-hover transition-colors shadow cursor-pointer">
                    <Icon path={icons.edit} className="w-3 h-3" />
                  </button>
                </div>
                <div>
                  <p className="text-[15px] font-bold text-text-main">Riya Jain</p>
                  <p className="text-[12px] text-text-sub">riya@nimbus.io</p>
                  <button className="text-[12px] text-accent hover:underline mt-1 cursor-pointer">Change photo</button>
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <InputField label="Full Name"    defaultValue="Riya Jain" />
                <InputField label="Display Name" defaultValue="Riya" />
                <InputField label="Email"        defaultValue="riya@nimbus.io"  type="email" />
                <InputField label="Phone"        defaultValue="+91 98765 43210"  type="tel" />
                <InputField label="Company"      defaultValue="Nimbus Inc." />
                <InputField label="Job Title"    defaultValue="Administrator" />
                <div className="sm:col-span-2">
                  <label className="block text-[12px] font-medium text-text-sub mb-1.5">Bio</label>
                  <textarea
                    defaultValue="Platform administrator at Nimbus. Manages team accounts and billing."
                    rows={3}
                    className="w-full bg-bg-input border border-border-card rounded-xl px-4 py-2.5 text-[13px] text-text-main outline-none focus:border-accent/40 resize-none transition-colors"
                  />
                </div>
              </div>
              <div className="flex justify-end mt-4 gap-2">
                <button onClick={() => show("Changes saved!", "success")} className="bg-accent text-bg-sidebar text-[13px] font-bold px-5 py-2.5 rounded-xl hover:bg-accent-hover transition-all shadow-[0_0_20px_var(--accent-light)] cursor-pointer">
                  Save Changes
                </button>
              </div>
            </div>
          </Section>

          <Section title="Workspace" description="Your organization settings">
            <Row label="Workspace Name" desc="Visible to all team members">
              <input defaultValue="Nimbus Inc." className="bg-bg-input border border-border-card rounded-xl px-3 py-1.5 text-[13px] text-text-main outline-none focus:border-accent/40 w-44 transition-colors" />
            </Row>
            <Row label="Workspace Slug" desc="Used in workspace URL">
              <div className="flex items-center gap-1 bg-bg-input border border-border-card rounded-xl px-3 py-1.5">
                <span className="text-[12px] text-text-dim">nimbus.io/</span>
                <input defaultValue="nimbus-inc" className="bg-transparent text-[13px] text-text-main outline-none w-28" />
              </div>
            </Row>
            <Row label="Timezone" desc="Used for reports and schedules">
              <select className="bg-bg-input border border-border-card rounded-xl px-3 py-1.5 text-[13px] text-text-muted outline-none cursor-pointer">
                <option>Asia/Kolkata (IST)</option>
                <option>UTC</option>
                <option>America/New_York</option>
              </select>
            </Row>
          </Section>
        </div>
      )}

      {/* Notifications Tab */}
      {tab === "Notifications" && (
        <Section title="Notification Preferences" description="Choose when and how you receive notifications">
          <Row label="Email Notifications" desc="Receive updates via your registered email"><Toggle on={notif.email} onChange={v => setNotif(n => ({ ...n, email: v }))} /></Row>
          <Row label="Slack Integration" desc="Post alerts to a connected Slack channel"><Toggle on={notif.slack} onChange={v => setNotif(n => ({ ...n, slack: v }))} /></Row>
          <Row label="SMS Alerts" desc="Critical alerts via text message"><Toggle on={notif.sms} onChange={v => setNotif(n => ({ ...n, sms: v }))} /></Row>
          <Row label="Weekly Digest" desc="Summary report every Monday 9 AM"><Toggle on={notif.weekly} onChange={v => setNotif(n => ({ ...n, weekly: v }))} /></Row>
          <Row label="Product Updates" desc="New features and changelog notifications"><Toggle on={notif.product} onChange={v => setNotif(n => ({ ...n, product: v }))} /></Row>
          <Row label="Billing Alerts" desc="Invoice and payment notifications"><Toggle on={notif.billing} onChange={v => setNotif(n => ({ ...n, billing: v }))} /></Row>
          <div className="py-3 flex justify-end">
            <button onClick={() => show("Preferences saved!", "success")} className="bg-accent text-bg-sidebar text-[13px] font-bold px-5 py-2.5 rounded-xl hover:bg-accent-hover transition-all cursor-pointer">Save Preferences</button>
          </div>
        </Section>
      )}

      {/* Security Tab */}
      {tab === "Security" && (
        <div className="space-y-5">
          <Section title="Authentication" description="Secure your account">
            <Row label="Two-Factor Authentication" desc="Require OTP at every login"><Toggle on={sec.twofa} onChange={v => setSec(s => ({ ...s, twofa: v }))} /></Row>
            <Row label="Login Notifications" desc="Email alert on new sign-in"><Toggle on={sec.loginAlerts} onChange={v => setSec(s => ({ ...s, loginAlerts: v }))} /></Row>
            <Row label="Change Password" desc="Last changed 3 months ago">
              <button onClick={() => show("Password reset email sent!", "success")} className="text-[12px] text-accent border border-accent/30 px-3 py-1.5 rounded-xl hover:bg-accent-light transition-colors cursor-pointer">Reset Password</button>
            </Row>
          </Section>
          <Section title="Active Sessions" description="Devices currently signed in">
            {[
              { device: "MacBook Pro",      location: "Mumbai, IN",   time: "Current session", current: true },
              { device: "iPhone 15 Pro",    location: "Mumbai, IN",   time: "2 hours ago",     current: false },
              { device: "Chrome on Windows",location: "Bangalore, IN", time: "3 days ago",     current: false },
            ].map((s, i) => (
              <Row key={i} label={<span>{s.device}{s.current && <span className="ml-2 text-[10px] text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/20 px-1.5 py-0.5 rounded-full border border-emerald-100 dark:border-emerald-900/20">Current</span>}</span>} desc={`${s.location} · ${s.time}`}>
                {!s.current && <button onClick={() => show("Session revoked", "default")} className="text-[12px] text-red-500 border border-red-500/25 px-3 py-1.5 rounded-xl hover:bg-red-500/10 transition-colors cursor-pointer">Revoke</button>}
              </Row>
            ))}
            <div className="py-3 flex justify-end">
              <button onClick={() => show("All sessions revoked", "error")} className="text-[12px] text-red-500 border border-red-500/25 px-4 py-2 rounded-xl hover:bg-red-500/10 transition-colors cursor-pointer">Revoke All Other Sessions</button>
            </div>
          </Section>
        </div>
      )}

      {/* API Keys Tab */}
      {tab === "API Keys" && (
        <div className="space-y-5">
          <div className="flex justify-between items-center">
            <p className="text-[13px] text-text-sub font-medium">Manage your API keys for programmatic access</p>
            <button onClick={() => show("New API key created!", "success")} className="inline-flex items-center gap-2 bg-accent text-bg-sidebar text-[13px] font-bold px-4 py-2 rounded-xl hover:bg-accent-hover transition-all cursor-pointer">
              <Icon path={icons.plus} className="w-4 h-4" /> New Key
            </button>
          </div>
          <div className="space-y-3">
            {API_KEYS.map((k, i) => (
              <div key={i} className="bg-bg-card border border-border-card rounded-2xl p-5 hover:border-border-hover transition-all">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-2">
                      <p className="text-[13px] font-semibold text-text-main">{k.name}</p>
                      <span className="text-[10px] bg-bg-hover text-text-sub px-2 py-0.5 rounded-full border border-border-card">{k.scope}</span>
                    </div>
                    <p className="font-mono text-[12px] text-accent bg-bg-input px-3 py-1.5 rounded-lg border border-border-card inline-block">{k.key}</p>
                    <p className="text-[11px] text-text-dim mt-2">Created {k.created} · Last used {k.lastUsed}</p>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <button onClick={() => show("Key copied!", "success")} className="w-8 h-8 flex items-center justify-center rounded-lg text-text-dim hover:text-accent hover:bg-accent-light transition-colors cursor-pointer">
                      <Icon path={icons.copy} className="w-3.5 h-3.5" />
                    </button>
                    <button onClick={() => show("Key revoked", "error")} className="w-8 h-8 flex items-center justify-center rounded-lg text-text-dim hover:text-red-500 hover:bg-red-500/10 transition-colors cursor-pointer">
                      <Icon path={icons.trash} className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Billing Tab */}
      {tab === "Billing" && (
        <div className="space-y-5">
          <div className="bg-bg-card border border-accent/20 rounded-2xl p-5">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-[11px] text-text-sub uppercase tracking-wider font-medium">Current Plan</p>
                <p className="text-[22px] font-bold text-text-main font-display mt-1">Nimbus Pro — Annual</p>
                <p className="text-[13px] text-text-sub mt-0.5">$1,299/year · Renews Jan 12, 2025</p>
              </div>
              <span className="text-[11px] font-semibold px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/20 text-emerald-600 dark:text-emerald-400 border border-emerald-100 dark:border-emerald-900/20">Active</span>
            </div>
            <button onClick={() => show("Redirecting to billing portal…", "default")} className="mt-4 text-[13px] text-accent border border-accent/30 px-4 py-2 rounded-xl hover:bg-accent-light transition-colors cursor-pointer">
              Manage Subscription
            </button>
          </div>
          <Section title="Payment Method" description="Your default payment method">
            <Row label="Visa •••• 4242" desc="Expires 09/2026">
              <div className="flex gap-2">
                <button onClick={() => show("Payment method updated!", "success")} className="text-[12px] text-accent border border-accent/30 px-3 py-1.5 rounded-xl hover:bg-accent-light transition-colors cursor-pointer font-semibold">Update</button>
                <button className="text-[12px] text-red-500 border border-red-500/25 px-3 py-1.5 rounded-xl hover:bg-red-500/10 transition-colors cursor-pointer">Remove</button>
              </div>
            </Row>
            <div className="py-3">
              <button className="inline-flex items-center gap-2 text-[12px] text-accent hover:underline cursor-pointer">
                <Icon path={icons.plus} className="w-3.5 h-3.5" /> Add payment method
              </button>
            </div>
          </Section>
          <Section title="Invoice History" description="Past billing records">
            {[
              { date: "Jan 12, 2024", desc: "Pro Annual",      amount: "$1,299", status: "Paid" },
              { date: "Jan 12, 2023", desc: "Pro Annual",      amount: "$1,199", status: "Paid" },
              { date: "Aug 1, 2024",  desc: "Storage Add-on",  amount: "$240",   status: "Paid" },
            ].map((inv, i) => (
              <Row key={i} label={inv.desc} desc={inv.date}>
                <div className="flex items-center gap-3">
                  <span className="font-mono text-[13px] text-text-main">{inv.amount}</span>
                  <button onClick={() => show("Invoice downloaded!", "success")} className="w-7 h-7 flex items-center justify-center rounded-lg text-text-dim hover:text-accent hover:bg-accent-light transition-colors cursor-pointer">
                    <Icon path={icons.download} className="w-3.5 h-3.5" />
                  </button>
                </div>
              </Row>
            ))}
          </Section>
        </div>
      )}

      {/* Danger Zone Tab */}
      {tab === "Danger Zone" && (
        <div className="space-y-4">
          <div className="bg-bg-card border border-red-500/20 rounded-2xl p-5 space-y-1">
            <p className="text-[13px] font-semibold text-red-500">Danger Zone</p>
            <p className="text-[12px] text-text-sub">These actions are irreversible. Please proceed with caution.</p>
          </div>
          {[
            { title: "Export All Data", desc: "Download a complete export of your workspace data.", btn: "Export Data", danger: false, action: () => show("Data export started!", "success") },
            { title: "Pause Workspace", desc: "Temporarily pause all workspace activity. You can resume anytime.", btn: "Pause Workspace", danger: false, action: () => show("Workspace paused", "default") },
            { title: "Transfer Ownership", desc: "Transfer this workspace to another team member.", btn: "Transfer", danger: false, action: () => show("Transfer initiated", "default") },
            { title: "Delete Workspace", desc: "Permanently delete this workspace and all its data. This cannot be undone.", btn: "Delete Workspace", danger: true, action: () => show("Workspace deleted", "error") },
          ].map(item => (
            <div key={item.title} className={`bg-bg-card border rounded-2xl p-5 flex items-center justify-between gap-4 ${item.danger ? "border-red-500/20" : "border-border-card"}`}>
              <div>
                <p className="text-[13px] font-semibold text-text-main">{item.title}</p>
                <p className="text-[12px] text-text-sub mt-0.5">{item.desc}</p>
              </div>
              <button
                onClick={item.action}
                className={`shrink-0 text-[12px] font-semibold px-4 py-2 rounded-xl border transition-colors cursor-pointer ${
                  item.danger
                    ? "text-red-550 dark:text-red-400 bg-red-50 dark:bg-red-950/20 border-red-200 dark:border-red-500/25 hover:bg-red-100 dark:hover:bg-red-950/40"
                    : "text-text-muted bg-bg-hover border-border-card hover:text-text-main hover:border-border-hover"
                }`}
              >{item.btn}</button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
