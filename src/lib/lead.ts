export const LEAD_EMAIL = "flipperiphone7@gmail.com";
export const TIKTOK_URL = "https://www.tiktok.com/@kapi_flipper";
export const ABOUT_MAX = 1000;

/** Accepts 9 digits with optional +48/0048, spaces, dashes. Returns "+48 XXX XXX XXX" or null. */
export function normalizePlPhone(raw: string): string | null {
  let d = raw.replace(/[\s-]/g, "");
  if (d.startsWith("+48")) d = d.slice(3);
  else if (d.startsWith("0048")) d = d.slice(4);
  else if (d.length === 11 && d.startsWith("48")) d = d.slice(2);
  if (!/^\d{9}$/.test(d)) return null;
  return `+48 ${d.slice(0, 3)} ${d.slice(3, 6)} ${d.slice(6)}`;
}

export function isValidEmail(v: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.trim()) && v.trim().length <= 255;
}

export type LeadInput = {
  name: string; phone: string; email: string; about: string;
  consentContact: boolean; consentRodo: boolean;
};
export type LeadErrors = Partial<Record<keyof LeadInput, string>>;

export function validateLead(v: LeadInput): LeadErrors {
  const e: LeadErrors = {};
  if (!v.name.trim()) e.name = "Podaj swoje imię – wystarczy samo imię 🙂";
  else if (v.name.trim().length > 60) e.name = "To imię jest trochę za długie.";
  if (!normalizePlPhone(v.phone)) e.phone = "Sprawdź numer – potrzebujemy 9 cyfr, np. 600 123 456.";
  if (!isValidEmail(v.email)) e.email = "Ten e-mail wygląda na niepełny – sprawdź go, proszę.";
  if (v.about.length > ABOUT_MAX) e.about = `Maksymalnie ${ABOUT_MAX} znaków.`;
  if (!v.consentContact) e.consentContact = "Zaznacz zgodę, żebyśmy mogli do Ciebie oddzwonić.";
  if (!v.consentRodo) e.consentRodo = "Potrzebujemy tej zgody, żeby obsłużyć zgłoszenie.";
  return e;
}

const UTM_KEY = "lead_source";
export function captureSource() {
  if (typeof window === "undefined") return;
  if (sessionStorage.getItem(UTM_KEY)) return;
  const p = new URLSearchParams(window.location.search);
  const src = {
    utm_source: p.get("utm_source") ?? "",
    utm_medium: p.get("utm_medium") ?? "",
    utm_campaign: p.get("utm_campaign") ?? "",
    referrer: document.referrer || "",
  };
  sessionStorage.setItem(UTM_KEY, JSON.stringify(src));
}
function readSource(): Record<string, string> {
  try { return JSON.parse(sessionStorage.getItem(UTM_KEY) || "{}"); } catch { return {}; }
}

/** Static FTP copy has no server, so it posts to the published Lovable app. */
const PUBLISHED_ORIGIN = "https://flip-iphone-now.lovable.app";
export const LEAD_TIMEOUT_MS = 15000;
function leadEndpoint(): string {
  const h = window.location.hostname;
  const local = h === "localhost" || h.endsWith(".lovable.app") || h.endsWith(".lovableproject.com");
  return `${local ? "" : PUBLISHED_ORIGIN}/api/public/lead`;
}

export async function sendLead(v: LeadInput) {
  const name = v.name.trim();
  const src = readSource();
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), LEAD_TIMEOUT_MS);
  try {
    const res = await fetch(leadEndpoint(), {
      method: "POST",
      signal: ctrl.signal,
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify({
        name, phone: v.phone, email: v.email.trim(), about: v.about.trim(),
        consentContact: v.consentContact, consentRodo: v.consentRodo,
        utm_source: src["utm_source"] ?? "", utm_medium: src["utm_medium"] ?? "",
        utm_campaign: src["utm_campaign"] ?? "", referrer: src["referrer"] ?? "",
      }),
    });
    const data = (await res.json().catch(() => ({}))) as { ok?: boolean };
    if (!res.ok || data.ok !== true) throw new Error("send failed");
  } finally {
    clearTimeout(timer);
  }
  sessionStorage.setItem("lead_name", name);
}
