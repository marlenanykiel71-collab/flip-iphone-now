import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Smartphone, Sparkles, ShieldCheck, Zap, BookOpen, MessageCircle, Star, ArrowRight } from "lucide-react";
import { Toaster } from "@/components/ui/sonner";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { QuoteForm } from "@/components/QuoteForm";
import heroIphone from "@/assets/hero-iphone.jpg";
import ebookMockup from "@/assets/ebook-mockup.png";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "FlipPhone — Wycena iPhone w 30 sekund" },
      { name: "description", content: "Sprawdź wycenę swojego iPhone — od iPhone X do iPhone 17 Pro Max. Wypełnij formularz i otrzymaj indywidualną wycenę." },
      { property: "og:title", content: "FlipPhone — Wycena iPhone" },
      { property: "og:description", content: "Indywidualna wycena Twojego iPhone w 30 sekund." },
      { property: "og:type", content: "website" },
    ],
    links: [{ rel: "canonical", href: "/" }],
  }),
  component: Home,
});

function Home() {
  const [open, setOpen] = useState(false);
  return (
    <div className="min-h-screen relative overflow-x-hidden">
      <Toaster theme="dark" position="top-center" />
      <BackgroundFX />
      <Nav onQuote={() => setOpen(true)} />
      <Hero onQuote={() => setOpen(true)} />
      <Features />
      <Ebook />
      <Discord />
      <Testimonials />
      <FAQ />
      <Footer />
      <QuoteForm open={open} onOpenChange={setOpen} />
    </div>
  );
}

function BackgroundFX() {
  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 -z-10">
      <div className="absolute top-[-10%] left-1/2 -translate-x-1/2 h-[600px] w-[900px] rounded-full"
           style={{ background: "radial-gradient(closest-side, oklch(0.6 0.22 235 / 0.35), transparent)" }} />
      <div className="absolute bottom-[-20%] right-[-10%] h-[500px] w-[500px] rounded-full"
           style={{ background: "radial-gradient(closest-side, oklch(0.6 0.22 200 / 0.25), transparent)" }} />
    </div>
  );
}

function Nav({ onQuote }: { onQuote: () => void }) {
  return (
    <header className="sticky top-0 z-40 px-4 pt-4">
      <div className="glass mx-auto flex max-w-6xl items-center justify-between rounded-full px-5 py-3">
        <a href="#top" className="flex items-center gap-2 font-semibold tracking-tight">
          <div className="grid place-items-center h-8 w-8 rounded-xl btn-premium">
            <Smartphone className="h-4 w-4" />
          </div>
          <span>FlipPhone</span>
        </a>
        <nav className="hidden md:flex items-center gap-7 text-sm text-muted-foreground">
          <a href="#features" className="hover:text-foreground transition">Dlaczego my</a>
          <a href="#ebook" className="hover:text-foreground transition">Ebook</a>
          <a href="#discord" className="hover:text-foreground transition">Społeczność</a>
          <a href="#faq" className="hover:text-foreground transition">FAQ</a>
        </nav>
        <button onClick={onQuote} className="btn-premium btn-premium-hover rounded-full px-5 py-2 text-sm font-medium">
          Wyceń telefon
        </button>
      </div>
    </header>
  );
}

function Hero({ onQuote }: { onQuote: () => void }) {
  return (
    <section id="top" className="relative px-4 pt-20 pb-32 md:pt-32 md:pb-40">
      <div className="mx-auto max-w-6xl grid md:grid-cols-2 gap-12 items-center">
        <div className="animate-fade-up">
          <div className="glass inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs text-muted-foreground">
            <Sparkles className="h-3.5 w-3.5 text-primary" />
            Wycena w 30 sekund • Bez zobowiązań
          </div>
          <h1 className="mt-6 text-5xl md:text-7xl font-semibold tracking-tight leading-[1.05]">
            <span className="text-gradient">Sprawdź wycenę</span>
            <br />
            <span className="text-gradient-primary">swojego iPhone&apos;a</span>
          </h1>
          <p className="mt-6 text-lg text-muted-foreground max-w-md">
            Wypełnij formularz i otrzymaj indywidualną wycenę swojego telefonu.
          </p>
          <div className="mt-9 flex flex-wrap gap-3">
            <button onClick={onQuote} className="btn-premium btn-premium-hover rounded-full px-7 py-4 font-semibold text-base inline-flex items-center gap-2">
              Wyceń telefon <ArrowRight className="h-4 w-4" />
            </button>
            <a href="#features" className="glass rounded-full px-7 py-4 font-medium text-base hover:bg-white/10 transition">
              Dowiedz się więcej
            </a>
          </div>
          <div className="mt-10 flex items-center gap-6 text-xs text-muted-foreground">
            <Trust icon={ShieldCheck} text="Bezpiecznie" />
            <Trust icon={Zap} text="Szybko" />
            <Trust icon={Star} text="500+ wycen" />
          </div>
        </div>

        <div className="relative animate-fade-up [animation-delay:200ms]">
          <div className="absolute inset-0 blur-3xl opacity-60"
               style={{ background: "radial-gradient(closest-side, oklch(0.6 0.22 235 / 0.5), transparent)" }} />
          <img
            src={heroIphone}
            alt="iPhone premium"
            width={1024} height={1024}
            className="relative w-full max-w-md mx-auto rounded-3xl animate-float"
            style={{ filter: "drop-shadow(0 40px 80px rgba(0,0,0,0.6))" }}
          />
        </div>
      </div>
    </section>
  );
}

function Trust({ icon: Icon, text }: { icon: any; text: string }) {
  return (
    <div className="flex items-center gap-2">
      <Icon className="h-4 w-4 text-primary" /> {text}
    </div>
  );
}

function Features() {
  const items = [
    { icon: Zap, title: "Najlepsza wycena", desc: "Płacimy więcej niż lombardy i komisy. Wycena szyta na miarę." },
    { icon: ShieldCheck, title: "Pełne bezpieczeństwo", desc: "Transparentny proces, umowa, bezpieczna płatność." },
    { icon: Sparkles, title: "Bez ukrytych kosztów", desc: "Cena z wyceny to cena, którą dostajesz na konto." },
  ];
  return (
    <section id="features" className="px-4 py-24">
      <div className="mx-auto max-w-6xl">
        <h2 className="text-4xl md:text-5xl font-semibold tracking-tight text-gradient text-center">
          Dlaczego FlipPhone
        </h2>
        <p className="mt-4 text-center text-muted-foreground max-w-xl mx-auto">
          Najprostszy sposób, żeby zamienić starego iPhone&apos;a na gotówkę.
        </p>
        <div className="mt-14 grid md:grid-cols-3 gap-5">
          {items.map((it) => (
            <div key={it.title} className="glass rounded-3xl p-7 hover:-translate-y-1 hover:bg-white/10 transition duration-500">
              <div className="h-12 w-12 rounded-2xl btn-premium grid place-items-center">
                <it.icon className="h-5 w-5" />
              </div>
              <h3 className="mt-5 text-xl font-semibold">{it.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{it.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Ebook() {
  return (
    <section id="ebook" className="px-4 py-24">
      <div className="mx-auto max-w-6xl glass rounded-[2rem] p-8 md:p-14 grid md:grid-cols-2 gap-12 items-center overflow-hidden relative">
        <div
          aria-hidden
          className="absolute -top-20 -left-20 h-72 w-72 rounded-full opacity-50"
          style={{ background: "radial-gradient(closest-side, oklch(0.6 0.22 235 / 0.6), transparent)" }}
        />
        <div className="relative">
          <div className="inline-flex items-center gap-2 text-xs text-primary">
            <BookOpen className="h-4 w-4" /> EBOOK
          </div>
          <h2 className="mt-3 text-4xl md:text-5xl font-semibold tracking-tight text-gradient">
            Ebook o flipowaniu iPhone
          </h2>
          <p className="mt-4 text-muted-foreground max-w-md">
            Dowiedz się jak zarabiać na kupowaniu i sprzedawaniu iPhone.
          </p>
          <a
            href="https://www.naffy.io/iphone/flipiphone"
            target="_blank" rel="noopener noreferrer"
            className="btn-premium btn-premium-hover mt-7 inline-flex items-center gap-2 rounded-full px-7 py-4 font-semibold"
          >
            Pobierz ebook <ArrowRight className="h-4 w-4" />
          </a>
        </div>
        <div className="relative">
          <img
            src={ebookMockup}
            alt="Ebook iPhone Flipping mockup"
            loading="lazy" width={1024} height={1024}
            className="w-full max-w-sm mx-auto animate-float"
            style={{ filter: "drop-shadow(0 30px 60px rgba(0,0,0,0.7))" }}
          />
        </div>
      </div>
    </section>
  );
}

function Discord() {
  return (
    <section id="discord" className="px-4 py-24">
      <div className="mx-auto max-w-4xl glass rounded-[2rem] p-10 md:p-16 text-center relative overflow-hidden">
        <div aria-hidden className="absolute inset-0 opacity-60"
             style={{ background: "radial-gradient(ellipse at center, oklch(0.5 0.2 270 / 0.35), transparent 70%)" }} />
        <div className="relative">
          <div className="mx-auto h-14 w-14 rounded-2xl btn-premium grid place-items-center">
            <MessageCircle className="h-6 w-6" />
          </div>
          <h2 className="mt-6 text-4xl md:text-5xl font-semibold tracking-tight text-gradient">
            Dołącz do darmowej społeczności
          </h2>
          <p className="mt-4 text-muted-foreground max-w-md mx-auto">
            Społeczność osób zajmujących się flipowaniem iPhone.
          </p>
          <a
            href="https://discord.gg/e8hKFCGsQc"
            target="_blank" rel="noopener noreferrer"
            className="btn-premium btn-premium-hover mt-8 inline-flex items-center gap-2 rounded-full px-7 py-4 font-semibold"
          >
            Dołącz do Discorda <ArrowRight className="h-4 w-4" />
          </a>
        </div>
      </div>
    </section>
  );
}

function Testimonials() {
  const items = [
    { name: "Michał K.", text: "Wycena lepsza niż w 3 innych miejscach. Pieniądze na koncie tego samego dnia.", model: "iPhone 14 Pro" },
    { name: "Anna W.", text: "Profesjonalna obsługa i konkretna komunikacja. Polecam każdemu.", model: "iPhone 13" },
    { name: "Krzysztof L.", text: "Sprzedałem 4 telefony — zawsze szybko, uczciwie i bez problemów.", model: "iPhone 15 Pro Max" },
  ];
  return (
    <section className="px-4 py-24">
      <div className="mx-auto max-w-6xl">
        <h2 className="text-4xl md:text-5xl font-semibold tracking-tight text-gradient text-center">
          Co mówią klienci
        </h2>
        <div className="mt-14 grid md:grid-cols-3 gap-5">
          {items.map((t) => (
            <div key={t.name} className="glass rounded-3xl p-7 hover:-translate-y-1 transition duration-500">
              <div className="flex gap-1 text-primary">
                {[...Array(5)].map((_, i) => <Star key={i} className="h-4 w-4 fill-current" />)}
              </div>
              <p className="mt-4 text-foreground/90 leading-relaxed">&ldquo;{t.text}&rdquo;</p>
              <div className="mt-6 flex items-center justify-between text-sm">
                <span className="font-medium">{t.name}</span>
                <span className="text-muted-foreground">{t.model}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function FAQ() {
  const items = [
    { q: "Jak długo czeka się na wycenę?", a: "Wycenę odsyłamy zazwyczaj tego samego dnia — w godzinach pracy w ciągu kilku godzin." },
    { q: "Czy wycena jest wiążąca?", a: "Nie. Wycena jest niezobowiązująca — możesz, ale nie musisz sprzedać telefonu." },
    { q: "Jakie modele skupujecie?", a: "Wszystkie modele iPhone od iPhone X po najnowsze iPhone 17 Pro Max." },
    { q: "W jaki sposób płacicie?", a: "Najczęściej przelewem na konto w dniu odbioru telefonu lub gotówką przy odbiorze osobistym." },
    { q: "Czy skupujecie uszkodzone iPhone?", a: "Tak — wyceniamy również telefony z uszkodzeniami, po zalaniu czy z wymienianym ekranem." },
  ];
  return (
    <section id="faq" className="px-4 py-24">
      <div className="mx-auto max-w-3xl">
        <h2 className="text-4xl md:text-5xl font-semibold tracking-tight text-gradient text-center">
          Najczęstsze pytania
        </h2>
        <Accordion type="single" collapsible className="mt-12 space-y-3">
          {items.map((it, i) => (
            <AccordionItem
              key={i}
              value={`item-${i}`}
              className="glass rounded-2xl px-5 border-white/10"
            >
              <AccordionTrigger className="text-left hover:no-underline">{it.q}</AccordionTrigger>
              <AccordionContent className="text-muted-foreground">{it.a}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="px-4 pb-10 pt-20">
      <div className="mx-auto max-w-6xl glass rounded-3xl p-8 md:p-10 flex flex-col md:flex-row gap-6 items-start md:items-center justify-between">
        <div>
          <div className="flex items-center gap-2 font-semibold">
            <div className="grid place-items-center h-8 w-8 rounded-xl btn-premium">
              <Smartphone className="h-4 w-4" />
            </div>
            FlipPhone
          </div>
          <p className="mt-3 text-sm text-muted-foreground max-w-sm">
            Premium skup i wycena iPhone. Szybko, bezpiecznie, uczciwie.
          </p>
        </div>
        <div className="flex flex-wrap gap-x-8 gap-y-3 text-sm text-muted-foreground">
          <a href="#features" className="hover:text-foreground transition">Dlaczego my</a>
          <a href="#ebook" className="hover:text-foreground transition">Ebook</a>
          <a href="#discord" className="hover:text-foreground transition">Discord</a>
          <a href="#faq" className="hover:text-foreground transition">FAQ</a>
          <a href="mailto:flipperiphone7@gmail.com" className="hover:text-foreground transition">Kontakt</a>
        </div>
      </div>
      <p className="mt-6 text-center text-xs text-muted-foreground">
        © {new Date().getFullYear()} FlipPhone. Wszelkie prawa zastrzeżone.
      </p>
    </footer>
  );
}
