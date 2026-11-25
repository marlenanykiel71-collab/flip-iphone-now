import { createFileRoute } from "@tanstack/react-router";
import { LEAD_EMAIL } from "@/lib/lead";

export const Route = createFileRoute("/polityka-prywatnosci")({
  head: () => ({
    meta: [
      { title: "Polityka prywatności | Kacper iPhone" },
      { name: "description", content: "Jak przetwarzamy dane osobowe z formularza kontaktowego zgodnie z RODO." },
      { property: "og:title", content: "Polityka prywatności | Kacper iPhone" },
      { property: "og:description", content: "Zasady przetwarzania danych osobowych zgodnie z RODO." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: Privacy,
});

function Privacy() {
  const H = ({ children }: { children: React.ReactNode }) => <h2 className="mt-8 text-xl font-extrabold text-foreground">{children}</h2>;
  return (
    <main className="px-5 py-14">
      <article className="mx-auto max-w-3xl text-muted-foreground leading-relaxed">
        <a href="./" className="text-sm underline">← Strona główna</a>
        <h1 className="mt-4 text-3xl font-black text-foreground">Polityka prywatności</h1>
        <H>1. Administrator danych</H>
        <p>Administratorem danych jest [IMIĘ NAZWISKO / FIRMA, ADRES]. Kontakt: <a className="underline" href={`mailto:${LEAD_EMAIL}`}>{LEAD_EMAIL}</a>.</p>
        <H>2. Cel przetwarzania</H>
        <p>Dane z formularza (imię, numer telefonu, e-mail, informacje o sobie) przetwarzamy, aby skontaktować się w sprawie Twojego zgłoszenia i przedstawić ofertę.</p>
        <H>3. Podstawa prawna</H>
        <p>Art. 6 ust. 1 lit. a RODO – Twoja zgoda. Podanie danych jest dobrowolne, ale niezbędne do obsługi zgłoszenia.</p>
        <H>4. Odbiorcy danych</H>
        <p>Administrator i jego zespół sprzedażowy oraz dostawca usługi przesyłania formularzy (FormSubmit) i poczty e-mail (Google).</p>
        <H>5. Okres przechowywania</H>
        <p>[np. 12 miesięcy lub do wycofania zgody].</p>
        <H>6. Twoje prawa</H>
        <p>Masz prawo do dostępu do danych, ich sprostowania, usunięcia, ograniczenia przetwarzania, przenoszenia oraz wycofania zgody w dowolnym momencie (bez wpływu na zgodność z prawem wcześniejszego przetwarzania). Przysługuje Ci skarga do Prezesa Urzędu Ochrony Danych Osobowych (PUODO).</p>
        <H>7. Pliki cookies</H>
        <p>Strona nie używa cookies marketingowych. W pamięci sesji przeglądarki zapisujemy jedynie źródło wejścia (parametry UTM), aby wiedzieć, skąd trafiłeś na stronę. Dane te znikają po zamknięciu karty.</p>
      </article>
    </main>
  );
}
