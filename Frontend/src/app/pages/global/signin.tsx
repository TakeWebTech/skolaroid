import { useState, type FormEvent } from "react";
import { useNavigate } from "react-router";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { Icon } from "../../components/shared/icon";
import { SCHOOL } from "../../lib/mock-data";
import { useT } from "../../lib/i18n";
import { login, roleFromSession, saveAuth } from "../../lib/auth-api";
import { ROLES } from "../../lib/roles";
import { useApp } from "../../store/app-context";

export function SignIn() {
  const navigate = useNavigate();
  const t = useT();
  const { setRole } = useApp();
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      const session = await login(identifier, password);
      saveAuth(session);
      const nextRole = roleFromSession(session) ?? "teacher";
      setRole(nextRole);
      navigate(ROLES[nextRole].home);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Sign in failed");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-primary/5 via-background to-info/5 p-4">
      <div className="w-full max-w-sm">
        <div className="mb-6 flex flex-col items-center gap-2 text-center">
          <span className="flex size-12 items-center justify-center rounded-xl bg-primary text-primary-foreground"><Icon name="GraduationCap" className="size-7" /></span>
          <h1 className="text-[24px] font-semibold">{t("Sign in to Skolaroid")}</h1>
          <p className="text-[14px] text-muted-foreground">{SCHOOL.name}</p>
        </div>
        <form className="space-y-4 rounded-2xl border border-border bg-card p-6" onSubmit={submit}>
          <div className="space-y-1.5"><Label htmlFor="identifier">{t("Email or phone")}</Label><Input id="identifier" type="text" placeholder="you@school.edu" autoComplete="username" value={identifier} onChange={(event) => setIdentifier(event.target.value)} disabled={submitting} /></div>
          <div className="space-y-1.5">
            <div className="flex items-center justify-between"><Label htmlFor="password">{t("Password")}</Label><button type="button" className="text-[13px] text-primary hover:underline">{t("Forgot?")}</button></div>
            <Input id="password" type="password" placeholder="••••••••" autoComplete="current-password" value={password} onChange={(event) => setPassword(event.target.value)} disabled={submitting} />
          </div>
          {error && <p className="rounded-lg border border-destructive/30 bg-destructive/10 px-3 py-2 text-[13px] text-destructive">{error}</p>}
          <Button type="submit" size="lg" className="w-full" disabled={submitting}>{submitting ? t("Signing in...") : t("Sign In")}</Button>
          <div className="relative py-1 text-center text-[12px] text-muted-foreground"><span className="bg-card px-2">{t("or")}</span><div className="absolute inset-x-0 top-1/2 -z-10 h-px bg-border" /></div>
          <Button type="button" variant="outline" size="lg" className="w-full" disabled><Icon name="KeyRound" className="size-4" /> {t("Continue with SSO")}</Button>
        </form>
        <p className="mt-4 text-center text-[13px] text-muted-foreground">{t("A teacher who can use WhatsApp can use Skolaroid. Need help?")} <button className="text-primary hover:underline">{t("Contact your school")}</button>.</p>
      </div>
    </div>
  );
}
