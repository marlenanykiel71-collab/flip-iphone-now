export const LEAD_EMAIL = "flipperiphone7@gmail.com";
export const TIKTOK_URL = "https://www.tiktok.com/@kapi_flipper7";
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

export async function sendLead(v: LeadInput) {
  const phone = normalizePlPhone(v.phone)!;
  const name = v.name.trim();
  const src = readSource();
  const now = new Date().toLocaleString("pl-PL", { timeZone: "Europe/Warsaw" });
  const res = await fetch(`https://formsubmit.co/ajax/${LEAD_EMAIL}`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Accept: "application/json" },
    body: JSON.stringify({
      _subject: `🔥 NOWY LEAD: ${name} – ${phone}`,
      _replyto: v.email.trim(),
      _template: "table",
      _captcha: "false",
      "Imię": name,
      "Telefon": phone,
      "E-mail": v.email.trim(),
      "O sobie": v.about.trim() || "—",
      "Data i godzina": now,
      "Źródło (utm_source)": src["utm_source"] || "—",
      "Kampania (utm_campaign)": src["utm_campaign"] || "—",
      "Medium (utm_medium)": src["utm_medium"] || "—",
      "Referrer": src["referrer"] || "bezpośrednio",
      "Zgoda na kontakt": `TAK (${now})`,
      "Zgoda RODO": `TAK (${now})`,
    }),
  });
  const data = (await res.json().catch(() => ({}))) as { success?: string | boolean };
  if (!res.ok || String(data.success) === "false") throw new Error("send failed");
  sessionStorage.setItem("lead_name", name);
}
