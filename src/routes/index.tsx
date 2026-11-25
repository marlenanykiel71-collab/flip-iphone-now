import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { ShieldCheck, Banknote, Truck, Video, GraduationCap, Phone, Search, X, Check, ShoppingBag, HandCoins, Wrench, TrendingUp, Users } from "lucide-react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { LeadForm, scrollToNearestForm } from "@/components/LeadForm";
import { captureSource, TIKTOK_URL, LEAD_EMAIL } from "@/lib/lead";
import iphone15 from "@/assets/iphone15.jpg";
import kacper from "@/assets/kacper.jpg";

type Flip = {
  model: string;
  done: string;
  cost: string;
  price: string;
  priceLabel: string;
  sold: boolean;
  profit: string;
  photo?: string;
};

const FLIPS: Flip[] = [
  { model: "iPhone 14 Pro Max 1 TB", done: "Bateria 86%, nic nie wymieniane", cost: "1400 zł", price: "1650 zł", priceLabel: "Sprzedaż", sold: true, profit: "+250 zł" },
  { model: "iPhone 15", done: "Wymienione plecki + bateria", cost: "1130 zł", price: "1400 zł", priceLabel: "Sprzedaż", sold: true, profit: "+270 zł", photo: iphone15 },
  { model: "iPhone 11 Pro Max", done: "Wymieniona bateria (telefon 300 zł + bateria 60 zł)", cost: "360 zł", price: "550 zł", priceLabel: "Wystawiony za", sold: false, profit: "do +190 zł" },
  { model: "iPhone 14 Pro", done: "Wymieniony ekran + bateria", cost: "900 zł", price: "1400 zł", priceLabel: "Wystawiony za", sold: false, profit: "do +500 zł" },
  { model: "iPhone 13 Pro Max", done: "Wymieniona bateria, cena zbita o 200 zł", cost: "[KOSZT] zł", price: "1200 zł", priceLabel: "Wystawiony za", sold: false, profit: "do +[ZYSK] zł" },
  { model: "iPhone 13", done: "Telefon 330 zł + części 180 zł", cost: "510 zł", price: "750 zł", priceLabel: "Wystawiony za", sold: false, profit: "do +240 zł" },
];

const TITLE = "Kacper – sprawdzone iPhone'y, skup, naprawa i nauka flipowania | Podkarpacie i cała Polska";
const DESC = "Kupisz, sprzedasz albo naprawisz iPhone'a bez ryzyka. Uczę też flipowania: mentoring i Discord. Zostaw kontakt – oddzwonimy z konkretną propozycją.";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESC },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESC },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Home,
});

function Cta({ children = "Zostaw kontakt", className = "" }: { children?: React.ReactNode; className?: string }) {
  return (
    <button onClick={scrollToNearestForm} className={`btn-cta rounded-2xl px-6 py-3.5 font-extrabold ${className}`}>{children}</button>
  );
}

function Section({ id, title, sub, children }: { id?: string; title: string; sub?: string; children: React.ReactNode }) {
  return (
    <section id={id} className="px-5 py-16 sm:py-24 animate-fade-up">
      <div className="mx-auto max-w-5xl">
        <h2 className="text-3xl sm:text-4xl font-black leading-tight">{title}</h2>
        {sub && <p className="mt-3 text-muted-foreground text-lg">{sub}</p>}
        <div className="mt-10">{children}</div>
      </div>
    </section>
  );
}

function Home() {
  const [sticky, setSticky] = useState(false);
  const [exitOpen, setExitOpen] = useState(false);

  useEffect(() => {
    captureSource();
    const onScroll = () => setSticky(window.scrollY > window.innerHeight * 0.9);
    window.addEventListener("scroll", onScroll, { passive: true });
    const desktop = window.matchMedia("(min-width: 1024px) and (pointer: fine)").matches;
    const onLeave = (e: MouseEvent) => {
      if (e.clientY > 0 || sessionStorage.getItem("exit_shown")) return;
      sessionStorage.setItem("exit_shown", "1");
      setExitOpen(true);
    };
    if (desktop) document.addEventListener("mouseout", onLeave);
    return () => { window.removeEventListener("scroll", onScroll); document.removeEventListener("mouseout", onLeave); };
  }, []);

  return (
    <main className="overflow-x-hidden pb-24 lg:pb-0">
      {/* HERO */}
      <section className="px-5 pt-8 pb-14 sm:pt-16">
        <div className="mx-auto max-w-5xl grid lg:grid-cols-2 gap-10 items-start">
          <div className="animate-fade-up">
            <span className="inline-block rounded-full border border-border bg-card px-4 py-1.5 text-sm font-semibold">📍 Podkarpacie · 🚚 wysyłka w całej Polsce</span>
            <h1 className="mt-5 text-4xl sm:text-5xl font-black leading-[1.05]">
              Kupisz, sprzedasz albo naprawisz iPhone'a – <span className="text-accent">bez ryzyka</span> i bez szukania na OLX
            </h1>
            <p className="mt-5 text-lg text-muted-foreground">
              Jestem Kacper. Codziennie kupuję, sprawdzam i naprawiam używane iPhone'y – i uczę innych, jak na tym zarabiać. Zostaw kontakt, oddzwonimy z konkretną propozycją.
            </p>
            <ul className="mt-6 space-y-2 text-sm font-semibold hidden lg:block">
              <TrustItems />
            </ul>
          </div>
          <div>
            <LeadForm id="form-hero" />
            <ul className="mt-5 space-y-2 text-sm font-semibold lg:hidden"><TrustItems /></ul>
          </div>
        </div>
      </section>

      {/* DLA KOGO */}
      <Section title="Z czym mogę Ci pomóc?">
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[
            { i: ShoppingBag, t: "KUPUJESZ", d: "Sprawdzony iPhone bez ukrytych wad, blokad i niespodzianek." },
            { i: HandCoins, t: "SPRZEDAJESZ", d: "Bez ogłoszeń, oszustów i targowania się z 30 osobami." },
            { i: Wrench, t: "NAPRAWA", d: "Bateria, plecki, ekran – powiem uczciwie, czy się opłaca." },
            { i: TrendingUp, t: "CHCESZ ZARABIAĆ NA FLIPACH", d: "Mentoring krok po kroku – od pierwszego telefonu do regularnego zysku." },
            { i: Users, t: "SPOŁECZNOŚĆ I NARZĘDZIA", d: "Discord z okazjami i wsparciem + produkty cyfrowe dla flipperów." },
          ].map(({ i: I, t, d }) => (
            <div key={t} className="rounded-2xl border border-border bg-card p-6 flex flex-col transition hover:-translate-y-1 hover:border-primary">
              <I className="h-8 w-8 text-primary" />
              <h3 className="mt-4 font-black text-lg">{t}</h3>
              <p className="mt-2 text-muted-foreground flex-1">{d}</p>
              <Cta className="mt-5 w-full">Zostaw kontakt</Cta>
            </div>
          ))}
        </div>
      </Section>

      {/* PROBLEM */}
      <Section title="Znasz to?">
        <div className="grid lg:grid-cols-2 gap-6">
          <ul className="rounded-2xl border border-border bg-card p-6 space-y-3">
            {["Oszuści na OLX", "Telefony z blokadą", "Wady, które wychodzą po tygodniu", "Tygodnie czekania na kupca", "Zaniżone oferty skupów", "Brak wiedzy, od czego zacząć flipowanie"].map((x) => (
              <li key={x} className="flex gap-3"><X className="h-6 w-6 shrink-0 text-destructive" />{x}</li>
            ))}
          </ul>
          <div className="rounded-2xl border border-primary bg-card p-6 flex flex-col justify-center">
            <p className="flex gap-3 text-2xl font-black"><Check className="h-8 w-8 shrink-0 text-primary" />Jeden kontakt i sprawa załatwiona.</p>
            <Cta className="mt-6">Zostaw kontakt</Cta>
          </div>
        </div>
      </Section>

      {/* DLACZEGO JA */}
      <Section title="Dlaczego ja?">
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[
            { i: Search, t: "Sprawdzam każdy telefon", d: "Bateria, Face ID, aparaty, IMEI, blokady." },
            { i: Phone, t: "Uczciwa wycena przez telefon", d: "Bez zgadywania i bez zaniżania." },
            { i: Banknote, t: "Szybka gotówka albo przelew", d: "Jak Ci wygodniej." },
            { i: Truck, t: "Odbiór albo wysyłka", d: "Osobiście na Podkarpaciu albo wysyłka w całą Polskę." },
            { i: Video, t: "Wszystko pokazuję na TikToku", d: "Publicznie, bez ściemy." },
            { i: GraduationCap, t: "Uczę tego, co sam robię", d: "Na co dzień. Zero teorii." },
          ].map(({ i: I, t, d }) => (
            <div key={t} className="rounded-2xl border border-border bg-card p-6">
              <I className="h-7 w-7 text-accent" />
              <h3 className="mt-3 font-extrabold">{t}</h3>
              <p className="mt-1 text-muted-foreground">{d}</p>
            </div>
          ))}
        </div>
      </Section>

      {/* JAK TO DZIAŁA */}
      <Section title="Jak to działa?">
        <ol className="grid sm:grid-cols-3 gap-4">
          {["Zostawiasz kontakt (niecała minuta)", "Oddzwaniamy i pytamy, czego potrzebujesz", "Dostajesz konkretną propozycję i decydujesz"].map((s, i) => (
            <li key={s} className="rounded-2xl border border-border bg-card p-6">
              <span className="grid h-10 w-10 place-items-center rounded-full bg-accent text-accent-foreground font-black">{i + 1}</span>
              <p className="mt-4 font-bold text-lg">{s}</p>
            </li>
          ))}
        </ol>
        <Cta className="mt-8 w-full sm:w-auto">Zostaw kontakt – to nic nie kosztuje</Cta>
      </Section>

      {/* FLIPY */}
      <Section title="Prawdziwe flipy" sub="Telefony, które przeszły przez moje ręce.">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {FLIPS.map((f) => (
            <article key={f.model} className="group overflow-hidden rounded-2xl border border-border bg-card transition hover:-translate-y-1 hover:border-primary">
              <div className="relative aspect-[4/5] overflow-hidden bg-muted">
                {f.photo ? (
                  <img src={f.photo} alt={f.model} loading="lazy" className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.04]" />
                ) : (
                  <div className="grid h-full place-items-center"><Phone className="h-10 w-10 text-muted-foreground opacity-30" /></div>
                )}
                <span className={`absolute left-3 top-3 rounded-full px-3 py-1 text-xs font-black tracking-wide ${f.sold ? "bg-primary text-primary-foreground" : "bg-accent text-accent-foreground"}`}>
                  {f.sold ? "SPRZEDANY" : "NA SPRZEDAŻ"}
                </span>
              </div>
              <div className="p-5">
                <h3 className="font-black text-lg leading-tight">{f.model}</h3>
                <p className="mt-1 text-sm text-muted-foreground">{f.done}</p>
                <p className="mt-4 text-sm leading-relaxed">
                  <span className="text-muted-foreground">Koszt</span> <span className="font-bold">{f.cost}</span>
                  <span className="text-muted-foreground"> → {f.priceLabel}</span> <span className="font-bold">{f.price}</span>
                </p>
                <p className="mt-3 text-3xl font-black text-primary">{f.profit}</p>
              </div>
            </article>
          ))}
        </div>
        <Cta className="mt-8 w-full sm:w-auto">Chcesz robić to samo? Zostaw kontakt</Cta>
        <div className="mt-4">
          <a href={TIKTOK_URL} target="_blank" rel="noopener noreferrer" className="inline-block rounded-2xl border border-border bg-card px-6 py-3.5 font-extrabold hover:border-primary">Zobacz więcej na TikToku →</a>
        </div>
      </Section>

      {/* OPINIE */}
      <Section title="Opinie">
        <div className="grid sm:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <figure key={i} className="rounded-2xl border border-border bg-card p-6">
              <p className="text-accent">★★★★★</p>
              <blockquote className="mt-3">„[OPINIA]”</blockquote>
              <figcaption className="mt-4 text-sm font-bold">[IMIĘ], [MIASTO]</figcaption>
            </figure>
          ))}
        </div>
      </Section>

      {/* O MNIE */}
      <Section title="Kim jestem?">
        <div className="grid sm:grid-cols-[220px_1fr] gap-8 items-center">
          <div className="aspect-square overflow-hidden rounded-3xl border border-border bg-muted">
            <img src={kacper} alt="Kacper – kupuję, naprawiam i sprzedaję iPhone'y" className="h-full w-full object-cover object-center" />
          </div>
          <div className="space-y-4 text-lg text-muted-foreground">
            <p><span className="text-foreground font-bold">Cześć, jestem Kacper.</span> Na co dzień kupuję, sprawdzam, naprawiam i sprzedaję używane iPhone'y.</p>
            <p>Uczę też innych, jak na tym zarabiać – przez mentoring, społeczność na Discordzie i produkty cyfrowe dla flipperów.</p>
            <p>Działam na Podkarpaciu i wysyłam w całą Polskę. Wszystko pokazuję na TikToku:{" "}
              <a href={TIKTOK_URL} target="_blank" rel="noopener noreferrer" className="text-accent font-bold underline">@kapi_flipper7</a>.</p>
          </div>
        </div>
      </Section>

      {/* FAQ */}
      <Section title="Najczęstsze pytania">
        <Accordion type="single" collapsible className="rounded-2xl border border-border bg-card px-5">
          {[
            ["Skąd mam wiedzieć, że telefon nie ma wad?", "Każdy telefon sprawdzam punkt po punkcie: baterię, Face ID, aparaty, IMEI i blokady. Zostaw kontakt, a opowiemy Ci o konkretnym egzemplarzu."],
            ["Ile dostanę za mojego iPhone'a?", "Zależy od modelu i stanu – zostaw kontakt, wycenimy go przez telefon w kilka minut."],
            ["Czy wysyłacie poza Podkarpacie?", "Tak, wysyłamy w całą Polskę. Zostaw kontakt, a ustalimy szczegóły."],
            ["Jak wygląda odbiór osobisty?", "Umawiamy się na Podkarpaciu, sprawdzasz telefon na miejscu i dopiero wtedy decydujesz. Zostaw kontakt, dogadamy termin."],
            ["Czy naprawiacie też telefony, których nie sprzedajecie?", "Tak – bateria, plecki, ekran i powiem uczciwie, czy naprawa się opłaca. Zostaw kontakt i opisz problem."],
            ["Czym jest mentoring i dla kogo jest Discord?", "Mentoring to nauka flipowania krok po kroku, a Discord to społeczność z okazjami i wsparciem. Zostaw kontakt, powiemy, co pasuje do Ciebie."],
            ["Czy zostawienie kontaktu do czegoś zobowiązuje?", "Nie. To tylko rozmowa – zostaw kontakt i sam zdecydujesz."],
          ].map(([q, a]) => (
            <AccordionItem key={q} value={q!}>
              <AccordionTrigger className="text-left font-bold">{q}</AccordionTrigger>
              <AccordionContent className="text-muted-foreground">{a}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </Section>

      {/* FINAŁ */}
      <section className="px-5 py-16 sm:py-24">
        <div className="mx-auto max-w-3xl rounded-3xl bg-cta border border-border p-5 sm:p-10">
          <h2 className="text-3xl sm:text-4xl font-black leading-tight text-center">Nie musisz nic wiedzieć. Wystarczy, że zostawisz kontakt.</h2>
          <p className="mt-3 text-center text-muted-foreground">Szybko · bez zobowiązań · bez spamu</p>
          <div className="mt-8"><LeadForm id="form-final" /></div>
        </div>
      </section>

      <footer className="border-t border-border px-5 py-10 text-sm text-muted-foreground">
        <div className="mx-auto max-w-5xl flex flex-col sm:flex-row flex-wrap gap-x-6 gap-y-2">
          <span className="font-bold text-foreground">Kacper</span>
          <span>Podkarpacie / cała Polska</span>
          <a href={TIKTOK_URL} target="_blank" rel="noopener noreferrer" className="hover:text-foreground">TikTok @kapi_flipper7</a>
          <a href={`mailto:${LEAD_EMAIL}`} className="hover:text-foreground">{LEAD_EMAIL}</a>
          <a href="./polityka-prywatnosci" className="hover:text-foreground underline">Polityka prywatności</a>
        </div>
      </footer>

      {/* STICKY MOBILE */}
      <div className={`fixed inset-x-0 bottom-0 z-40 p-3 bg-background/95 border-t border-border lg:hidden transition-transform ${sticky ? "translate-y-0" : "translate-y-full"}`}>
        <Cta className="w-full text-lg">📞 Oddzwońcie do mnie</Cta>
      </div>

      <Dialog open={exitOpen} onOpenChange={setExitOpen}>
        <DialogContent className="max-w-lg max-h-[92vh] overflow-y-auto bg-background border-border p-4">
          <DialogTitle className="text-2xl font-black">Zanim wyjdziesz – zostaw kontakt, oddzwonimy</DialogTitle>
          <LeadForm id="form-exit" heading={false} />
        </DialogContent>
      </Dialog>
    </main>
  );
}

function TrustItems() {
  return (
    <>
      <li className="flex gap-2"><ShieldCheck className="h-5 w-5 text-primary" />Każdy telefon sprawdzony punkt po punkcie</li>
      <li className="flex gap-2"><ShieldCheck className="h-5 w-5 text-primary" />Szybka gotówka za Twój telefon</li>
      <li className="flex gap-2"><ShieldCheck className="h-5 w-5 text-primary" />Znasz mnie z TikToka @kapi_flipper7</li>
    </>
  );
}
