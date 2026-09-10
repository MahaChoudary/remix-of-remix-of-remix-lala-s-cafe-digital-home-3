import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { LuxButton } from "@/components/ui-kit/Button";
import { Field, fieldClass } from "@/components/forms/Field";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/admin/login")({
  ssr: false,
  head: () => ({
    meta: [
      { title: "Staff sign in — Lala's Cafe" },
      { name: "description", content: "Sign in to manage the Lala's Cafe website." },
      { name: "robots", content: "noindex, nofollow" },
      { property: "og:title", content: "Staff sign in — Lala's Cafe" },
      { property: "og:description", content: "Private sign-in for the Lala's Cafe team." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: AdminLogin,
});

function AdminLogin() {
  const navigate = useNavigate();
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) navigate({ to: "/admin", replace: true });
    });
  }, [navigate]);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setNotice(null);
    const fd = new FormData(e.currentTarget);
    const email = String(fd.get("email") ?? "").trim();
    const password = String(fd.get("password") ?? "");
    if (!email || password.length < 8) {
      setError("Enter your email and a password of at least 8 characters.");
      return;
    }
    setBusy(true);
    const result =
      mode === "signin"
        ? await supabase.auth.signInWithPassword({ email, password })
        : await supabase.auth.signUp({
            email,
            password,
            options: { emailRedirectTo: `${window.location.origin}/admin` },
          });
    setBusy(false);

    if (result.error) {
      setError(result.error.message);
      return;
    }
    if (!result.data.session) {
      setNotice("Check your email to confirm the account, then sign in here.");
      return;
    }
    await supabase.rpc("claim_admin");
    navigate({ to: "/admin", replace: true });
  }

  return (
    <section className="container-lux flex min-h-screen items-center justify-center py-32">
      <div className="surface-panel w-full max-w-md rounded-3xl p-8 sm:p-10">
        <p className="text-eyebrow">Staff only</p>
        <h1 className="mt-3 text-3xl">
          {mode === "signin" ? "Sign in to manage the site" : "Create your staff account"}
        </h1>
        <form onSubmit={onSubmit} className="mt-8 grid gap-5">
          <Field label="Email" htmlFor="email">
            <input id="email" name="email" type="email" autoComplete="email" className={fieldClass} required />
          </Field>
          <Field label="Password" htmlFor="password" hint="At least 8 characters">
            <input
              id="password"
              name="password"
              type="password"
              autoComplete={mode === "signin" ? "current-password" : "new-password"}
              className={fieldClass}
              required
            />
          </Field>
          {error && (
            <p role="alert" className="text-sm text-destructive">
              {error}
            </p>
          )}
          {notice && <p className="text-sm text-primary">{notice}</p>}
          <LuxButton type="submit" disabled={busy}>
            {busy ? "Please wait…" : mode === "signin" ? "Sign in" : "Create account"}
          </LuxButton>
        </form>
        <button
          type="button"
          onClick={() => {
            setMode(mode === "signin" ? "signup" : "signin");
            setError(null);
            setNotice(null);
          }}
          className="mt-6 text-sm text-muted-foreground underline-offset-4 hover:text-primary hover:underline"
        >
          {mode === "signin" ? "First time here? Create an account" : "Already have an account? Sign in"}
        </button>
      </div>
    </section>
  );
}
