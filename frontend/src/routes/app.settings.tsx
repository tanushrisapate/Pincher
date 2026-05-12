import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { GradientButton } from "@/components/ui-kit/GradientButton";

export const Route = createFileRoute("/app/settings")({
  head: () => ({ meta: [{ title: "Settings — Atelier AI" }] }),
  component: Settings,
});

function Toggle({ on, onChange }: { on: boolean; onChange: (v: boolean) => void }) {
  return (
    <button
      onClick={() => onChange(!on)}
      className={`relative h-6 w-11 rounded-full transition ${on ? "bg-foreground" : "bg-border"}`}
    >
      <span className={`absolute top-0.5 h-5 w-5 rounded-full bg-background transition ${on ? "left-[1.4rem]" : "left-0.5"}`} />
    </button>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-3xl border border-border bg-card p-6 shadow-soft">
      <h3 className="font-display text-xl">{title}</h3>
      <div className="mt-5 space-y-5">{children}</div>
    </div>
  );
}

function Row({ label, hint, children }: { label: string; hint?: string; children: React.ReactNode }) {
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
  const [emails, setEmails] = useState(true);
  const [push, setPush] = useState(false);
  const [pub, setPub] = useState(true);

  return (
    <div className="max-w-3xl space-y-8">
      <div>
        <h1 className="font-display text-4xl">Settings</h1>
        <p className="mt-2 text-muted-foreground">Manage your account, preferences and privacy.</p>
      </div>

      <Section title="Account">
        <Row label="Display name">
          <input defaultValue="Ava Laurent" className="w-64 rounded-xl border border-border bg-background px-3 py-2 text-sm outline-none focus:border-foreground/40" />
        </Row>
        <Row label="Email">
          <input defaultValue="ava@atelier.ai" className="w-64 rounded-xl border border-border bg-background px-3 py-2 text-sm outline-none focus:border-foreground/40" />
        </Row>
      </Section>

      <Section title="Notifications">
        <Row label="Weekly style edit" hint="Curated trends every Monday morning."><Toggle on={emails} onChange={setEmails} /></Row>
        <Row label="Push notifications" hint="Real-time when AI predictions are ready."><Toggle on={push} onChange={setPush} /></Row>
      </Section>

      <Section title="Privacy">
        <Row label="Public profile" hint="Allow others to see your aesthetic and palette."><Toggle on={pub} onChange={setPub} /></Row>
        <Row label="Delete account" hint="Permanently remove your data.">
          <button className="rounded-full border border-destructive/40 px-4 py-2 text-xs text-destructive hover:bg-destructive hover:text-destructive-foreground transition">Delete</button>
        </Row>
      </Section>

      <div className="flex justify-end">
        <GradientButton>Save changes</GradientButton>
      </div>
    </div>
  );
}
