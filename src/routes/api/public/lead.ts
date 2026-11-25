import { createFileRoute } from "@tanstack/react-router";
import { normalizePlPhone, isValidEmail, ABOUT_MAX } from "@/lib/lead";

const TO = "flipperiphone7@gmail.com";
const CORS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Accept",
  "Access-Control-Max-Age": "86400",
};
const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), { status, headers: { ...CORS, "Content-Type": "application/json" } });
const esc = (s: string) => s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!);
const str = (v: unknown, max: number) => (typeof v === "string" ? v.trim().slice(0, max) : "");

export const Route = createFileRoute("/api/public/lead")({
  server: {
    handlers: {
      OPTIONS: async () => new Response(null, { status: 204, headers: CORS }),
      POST: async ({ request }) => {
        let b: Record<string, unknown>;
        try { b = (await request.json()) as Record<string, unknown>; } catch { return json({ ok: false, error: "bad json" }, 400); }
        if (str(b["_honey"], 10)) return json({ ok: true });
        const name = str(b["name"], 60);
        const phone = normalizePlPhone(str(b["phone"], 30));
        const email = str(b["email"], 255);
        const about = str(b["about"], ABOUT_MAX);
        if (!name || !phone || !isValidEmail(email) || b["consentContact"] !== true || b["consentRodo"] !== true)
          return json({ ok: false, error: "invalid" }, 400);
        const src = {
          utm_source: str(b["utm_source"], 200), utm_medium: str(b["utm_medium"], 200),
          utm_campaign: str(b["utm_campaign"], 200), referrer: str(b["referrer"], 500),
        };

        const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
        const { data: row, error } = await supabaseAdmin.from("leady").insert({
          name, phone, email, about: about || null, ...src, consent_contact: true, consent_rodo: true,
        }).select("id, created_at").single();
        if (error || !row) { console.error("lead insert failed", error); return json({ ok: false, error: "db" }, 500); }

        let emailSent = false; let emailError: string | null = null;
        try {
          const key = process.env["RESEND_API_KEY"];
          if (!key) throw new Error("RESEND_API_KEY missing");
          const when = new Date(row.created_at).toLocaleString("pl-PL", { timeZone: "Europe/Warsaw" });
          const rows: [string, string][] = [
            ["Imię", name], ["Telefon", phone], ["E-mail", email], ["O sobie", about || "—"], ["Data i godzina", when],
            ["Źródło", src.utm_source || "—"], ["Kampania", src.utm_campaign || "—"], ["Medium", src.utm_medium || "—"],
            ["Referrer", src.referrer || "bezpośrednio"], ["Zgody", `kontakt + RODO: TAK (${when})`],
          ];
          const html = `<table cellpadding="6" style="border-collapse:collapse;font-family:sans-serif">${rows.map(([k, v]) => `<tr><td style="border:1px solid #ddd"><b>${esc(k)}</b></td><td style="border:1px solid #ddd;white-space:pre-wrap">${esc(v)}</td></tr>`).join("")}</table>`;
          const ctrl = new AbortController(); const t = setTimeout(() => ctrl.abort(), 8000);
          const res = await fetch("https://api.resend.com/emails", {
            method: "POST", signal: ctrl.signal,
            headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json", "Idempotency-Key": `lead-${row.id}` },
            body: JSON.stringify({ from: "Leady Kacper <onboarding@resend.dev>", to: [TO], reply_to: email, subject: `🔥 NOWY LEAD: ${name} – ${phone}`, html }),
          }).finally(() => clearTimeout(t));
          if (!res.ok) throw new Error(`Resend ${res.status}: ${await res.text()}`);
          emailSent = true;
        } catch (e) {
          emailError = e instanceof Error ? e.message : String(e);
          console.error("lead email failed", emailError);
        }
        await supabaseAdmin.from("leady").update({ email_sent: emailSent, email_error: emailError }).eq("id", row.id);
        return json({ ok: true, id: row.id, emailSent });
      },
    },
  },
});
