import { useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { Loader2 } from "lucide-react";
import { ABOUT_MAX, sendLead, validateLead, type LeadErrors, type LeadInput } from "@/lib/lead";

const empty: LeadInput = { name: "", phone: "", email: "", about: "", consentContact: false, consentRodo: false };

export function LeadForm({ id, heading = true }: { id: string; heading?: boolean }) {
  const [v, setV] = useState<LeadInput>(empty);
  const [hp, setHp] = useState("");
  const [errors, setErrors] = useState<LeadErrors>({});
  const [loading, setLoading] = useState(false);
  const [fail, setFail] = useState(false);
  const navigate = useNavigate();
  const set = <K extends keyof LeadInput>(k: K, val: LeadInput[K]) => {
    setV((s) => ({ ...s, [k]: val }));
    if (errors[k]) setErrors((e) => ({ ...e, [k]: undefined }));
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (loading) return;
    if (hp) return; // honeypot
    const errs = validateLead(v);
    setErrors(errs);
    if (Object.keys(errs).length) return;
    setLoading(true); setFail(false);
    try {
      await sendLead(v);
      navigate({ to: "/dziekuje" });
    } catch {
      setFail(true); setLoading(false);
    }
  };

  const f = (k: keyof LeadInput) => `${id}-${k}`;
  const inputCls = "w-full rounded-xl border border-input bg-background px-4 py-3.5 text-base text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring";

  return (
    <form id={id} onSubmit={submit} noValidate className="lead-form rounded-3xl border border-border bg-card p-5 sm:p-7 shadow-2xl scroll-mt-24">
      {heading && (
        <h2 className="text-xl sm:text-2xl font-extrabold leading-tight mb-5">
          Zostaw kontakt – oddzwonimy i powiemy Ci konkretnie, co możemy dla Ciebie zrobić
        </h2>
      )}
      <div className="space-y-4">
        <Field id={f("name")} label="Imię*" error={errors.name}>
          <input id={f("name")} autoComplete="given-name" className={inputCls} placeholder="Np. Tomek" value={v.name} onChange={(e) => set("name", e.target.value)} />
        </Field>
        <Field id={f("phone")} label="Numer telefonu*" error={errors.phone}>
          <input id={f("phone")} type="tel" inputMode="tel" autoComplete="tel" className={inputCls} placeholder="600 123 456" value={v.phone} onChange={(e) => set("phone", e.target.value)} />
        </Field>
        <Field id={f("email")} label="E-mail*" error={errors.email}>
          <input id={f("email")} type="email" inputMode="email" autoComplete="email" className={inputCls} placeholder="twoj@email.pl" value={v.email} onChange={(e) => set("email", e.target.value)} />
        </Field>
        <Field id={f("about")} label="Opowiedz coś o sobie" error={errors.about}
          hint="Czym się zajmujesz i co chcesz osiągnąć? Np. chcę dorobić do pensji na flipach, chcę zacząć od 500 zł, interesuje mnie mentoring albo Discord, szukam iPhone'a 13, chcę sprzedać swój telefon…">
          <textarea id={f("about")} rows={4} maxLength={ABOUT_MAX} className={inputCls} value={v.about} onChange={(e) => set("about", e.target.value)} />
          <div className="text-right text-xs text-muted-foreground">{v.about.length}/{ABOUT_MAX}</div>
        </Field>
        <input type="text" name="_honey" tabIndex={-1} autoComplete="off" aria-hidden="true" className="hidden" value={hp} onChange={(e) => setHp(e.target.value)} />
        <Check id={f("consentContact")} checked={v.consentContact} onChange={(c) => set("consentContact", c)} error={errors.consentContact}>
          Wyrażam zgodę na kontakt telefoniczny i mailowy w sprawie mojego zgłoszenia.*
        </Check>
        <Check id={f("consentRodo")} checked={v.consentRodo} onChange={(c) => set("consentRodo", c)} error={errors.consentRodo}>
          Zapoznałem/am się z{" "}
          <a href="./polityka-prywatnosci" target="_blank" rel="noopener" className="underline text-accent">Polityką prywatności</a>{" "}
          i wyrażam zgodę na przetwarzanie moich danych osobowych zgodnie z RODO (art. 6 ust. 1 lit. a) w celu obsługi zgłoszenia.*
        </Check>
        {fail && <p className="text-sm text-destructive">Coś poszło nie tak – spróbuj ponownie za chwilę.</p>}
        <button type="submit" disabled={loading} className="btn-cta w-full rounded-2xl py-4 text-lg font-extrabold tracking-wide flex items-center justify-center gap-2 disabled:opacity-70">
          {loading ? <><Loader2 className="h-5 w-5 animate-spin" /> Wysyłam…</> : "ODDZWOŃCIE DO MNIE →"}
        </button>
        <p className="text-xs text-muted-foreground text-center leading-relaxed">
          🔒 Bez spamu. Twoje dane widzimy tylko my. Oddzwaniamy zwykle w ciągu kilku godzin. Zgodę możesz wycofać w każdej chwili.
        </p>
      </div>
    </form>
  );
}

function Field({ id, label, hint, error, children }: { id: string; label: string; hint?: string; error?: string | undefined; children: React.ReactNode }) {
  return (
    <div className="space-y-1.5">
      <label htmlFor={id} className="block text-sm font-semibold">{label}</label>
      {hint && <p className="text-xs text-muted-foreground">{hint}</p>}
      {children}
      {error && <p className="text-sm text-destructive">{error}</p>}
    </div>
  );
}

function Check({ id, checked, onChange, error, children }: { id: string; checked: boolean; onChange: (c: boolean) => void; error?: string | undefined; children: React.ReactNode }) {
  return (
    <div>
      <label htmlFor={id} className="flex gap-3 items-start text-sm text-muted-foreground cursor-pointer">
        <input id={id} type="checkbox" checked={checked} onChange={(e) => onChange(e.target.checked)} className="mt-0.5 h-5 w-5 shrink-0 accent-primary" />
        <span>{children}</span>
      </label>
      {error && <p className="text-sm text-destructive mt-1 ml-8">{error}</p>}
    </div>
  );
}

export function scrollToNearestForm() {
  const forms = Array.from(document.querySelectorAll<HTMLElement>(".lead-form"));
  if (!forms.length) return;
  const mid = window.scrollY + window.innerHeight / 2;
  const best = forms.reduce((a, b) => Math.abs(b.offsetTop - mid) < Math.abs(a.offsetTop - mid) ? b : a);
  best.scrollIntoView({ behavior: "smooth", block: "start" });
}
