import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";

import { GradientButton } from "@/components/ui-kit/GradientButton";
import { useAuth } from "@/context/AuthContext";

export const Route = createFileRoute("/app/settings")({
  head: () => ({ meta: [{ title: "Settings - Pincher" }] }),
  component: Settings,
});

function Toggle({
  on,
  onChange,
}: {
  on: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <button
      type="button"
      onClick={() => onChange(!on)}
      className={`relative h-6 w-11 rounded-full transition ${
        on ? "bg-foreground" : "bg-border"
      }`}
    >
      <span
        className={`absolute top-0.5 h-5 w-5 rounded-full bg-background transition ${
          on ? "left-[1.4rem]" : "left-0.5"
        }`}
      />
    </button>
  );
}

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-3xl border border-border bg-card p-6 shadow-soft">
      <h3 className="font-display text-xl">{title}</h3>
      <div className="mt-5 space-y-5">{children}</div>
    </div>
  );
}

function Row({
  label,
  hint,
  children,
}: {
  label: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex items-center justify-between gap-6">
      <div>
        <p className="text-sm font-medium">{label}</p>
        {hint && <p className="text-xs text-muted-foreground">{hint}</p>}
      </div>
      {children}
    </div>
  );
}

function Settings() {
  const { user, updateUser } = useAuth();

  const [emails, setEmails] = useState(true);
  const [push, setPush] = useState(false);
  const [pub, setPub] = useState(true);

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (user) {
      setUsername(user.username || "");
      setEmail(user.email || "");
    }
  }, [user]);

  const saveAccount = async () => {
    const nextUsername = username.trim();

    if (!nextUsername) {
      setError("Username cannot be empty.");
      setMessage("");
      return;
    }

    setSaving(true);
    setError("");
    setMessage("");

    try {
      await updateUser({ username: nextUsername });
      setUsername(nextUsername);
      setMessage("Username saved.");
    } catch (err: any) {
      setError(err.response?.data?.detail || "Could not save username.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-3xl space-y-8">
      <div>
        <h1 className="font-display text-4xl">Settings</h1>
        <p className="mt-2 text-muted-foreground">
          Manage your account, preferences and privacy.
        </p>
      </div>

      <Section title="Account">
        <Row label="Display name">
          <input
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-64 rounded-xl border border-border bg-background px-3 py-2 text-sm outline-none focus:border-foreground/40"
          />
        </Row>

        <Row label="Email" hint="Email is locked to this account and cannot be changed here.">
          <input
            value={email}
            readOnly
            aria-readonly="true"
            className="w-64 cursor-not-allowed rounded-xl border border-border bg-secondary px-3 py-2 text-sm text-muted-foreground outline-none"
          />
        </Row>
      </Section>

      <Section title="Notifications">
        <Row
          label="Weekly style edit"
          hint="Curated trends every Monday morning."
        >
          <Toggle on={emails} onChange={setEmails} />
        </Row>

        <Row
          label="Push notifications"
          hint="When a style report is ready."
        >
          <Toggle on={push} onChange={setPush} />
        </Row>
      </Section>

      <Section title="Privacy">
        <Row
          label="Public profile"
          hint="Allow others to see your style direction and palette."
        >
          <Toggle on={pub} onChange={setPub} />
        </Row>

        <Row
          label="Delete account"
          hint="Permanently remove your data."
        >
          <button
            type="button"
            className="rounded-full border border-destructive/40 px-4 py-2 text-xs text-destructive transition hover:bg-destructive hover:text-destructive-foreground"
          >
            Delete
          </button>
        </Row>
      </Section>

      <div className="flex flex-col items-end gap-3">
        {message && <p className="text-sm text-foreground">{message}</p>}
        {error && <p className="text-sm text-destructive">{error}</p>}
        <GradientButton onClick={saveAccount} disabled={saving}>
          {saving ? "Saving..." : "Save changes"}
        </GradientButton>
      </div>
    </div>
  );
}
