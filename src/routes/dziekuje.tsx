import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { TIKTOK_URL } from "@/lib/lead";

export const Route = createFileRoute("/dziekuje")({
  head: () => ({
    meta: [
      { title: "Dziękuję – wkrótce oddzwonimy | Kacper iPhone" },
      { name: "description", content: "Twoje zgłoszenie dotarło. Wkrótce oddzwonimy z konkretną propozycją." },
      { property: "og:title", content: "Dziękuję – wkrótce oddzwonimy" },
      { property: "og:description", content: "Twoje zgłoszenie dotarło. Wkrótce oddzwonimy." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: Thanks,
});

function Thanks() {
  const [name, setName] = useState("");
  useEffect(() => { setName(sessionStorage.getItem("lead_name") || ""); }, []);
  return (
    <main className="min-h-screen px-5 py-16 grid place-items-center">
      <div className="max-w-xl w-full text-center animate-fade-up">
        <h1 className="text-3xl sm:text-4xl font-black leading-tight">Dzięki{name ? `, ${name}` : ""}! Wkrótce zadzwonimy – odbierz nieznany numer 🙂</h1>
        <ol className="mt-10 space-y-3 text-left">
          {["Dzwonimy", "Pytamy, czego potrzebujesz", "Dostajesz konkretną propozycję"].map((s, i) => (
            <li key={s} className="flex items-center gap-4 rounded-2xl border border-border bg-card p-4 font-bold">
              <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-accent text-accent-foreground font-black">{i + 1}</span>{s}
            </li>
          ))}
        </ol>
        <a href={TIKTOK_URL} target="_blank" rel="noopener noreferrer" className="btn-cta mt-10 inline-block rounded-2xl px-6 py-4 font-extrabold">Zobacz moje flipy na TikToku</a>
      </div>
    </main>
  );
}
