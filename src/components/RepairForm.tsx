import { useState } from "react";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const IPHONE_MODELS = [
  "iPhone X", "iPhone XR", "iPhone XS", "iPhone XS Max",
  "iPhone 11", "iPhone 11 Pro", "iPhone 11 Pro Max",
  "iPhone SE (2020)", "iPhone 12 mini", "iPhone 12", "iPhone 12 Pro", "iPhone 12 Pro Max",
  "iPhone 13 mini", "iPhone 13", "iPhone 13 Pro", "iPhone 13 Pro Max",
  "iPhone SE (2022)", "iPhone 14", "iPhone 14 Plus", "iPhone 14 Pro", "iPhone 14 Pro Max",
  "iPhone 15", "iPhone 15 Plus", "iPhone 15 Pro", "iPhone 15 Pro Max",
  "iPhone 16", "iPhone 16 Plus", "iPhone 16 Pro", "iPhone 16 Pro Max",
  "iPhone 17", "iPhone 17 Plus", "iPhone 17 Pro", "iPhone 17 Pro Max",
];

type FormState = {
  name: string;
  email: string;
  phone: string;
  model: string;
  damage: string;
  notes: string;
};

const initial: FormState = {
  name: "", email: "", phone: "", model: "", damage: "", notes: "",
};

export function RepairForm({ open, onOpenChange }: { open: boolean; onOpenChange: (v: boolean) => void }) {
  const [form, setForm] = useState<FormState>(initial);
  const [loading, setLoading] = useState(false);

  const set = <K extends keyof FormState>(k: K, v: FormState[K]) => setForm((f) => ({ ...f, [k]: v }));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const body =
`Nowe zgłoszenie naprawy iPhone

Imię i nazwisko: ${form.name}
Email: ${form.email}
Numer telefonu: ${form.phone}

Model iPhone: ${form.model}

Opis uszkodzenia:
${form.damage}

Dodatkowe informacje:
${form.notes || "—"}
`;

    const mailto = `mailto:flipperiphone7@gmail.com?subject=${encodeURIComponent("Nowe zgłoszenie naprawy iPhone")}&body=${encodeURIComponent(body)}`;

    setTimeout(() => {
      window.location.href = mailto;
      setLoading(false);
      toast("Sprawdź aplikację pocztową aby wysłać formularz.", {
        description: "Otworzyliśmy okno emaila z gotową wiadomością.",
      });
      onOpenChange(false);
      setForm(initial);
    }, 900);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="glass max-w-2xl max-h-[90vh] overflow-y-auto border-white/10">
        <DialogHeader>
          <DialogTitle className="text-2xl font-semibold text-gradient">Zgłoś naprawę iPhone</DialogTitle>
          <DialogDescription className="text-muted-foreground">
            Opisz uszkodzenie — wyślemy zgłoszenie na nasz adres przez Twoją aplikację pocztową.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-5 pt-2">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Field label="Imię i nazwisko">
              <Input required value={form.name} onChange={(e) => set("name", e.target.value)} placeholder="Jan Kowalski" />
            </Field>
            <Field label="Email">
              <Input required type="email" value={form.email} onChange={(e) => set("email", e.target.value)} placeholder="jan@example.com" />
            </Field>
            <Field label="Numer telefonu">
              <Input required value={form.phone} onChange={(e) => set("phone", e.target.value)} placeholder="+48 600 000 000" />
            </Field>
            <Field label="Model iPhone">
              <Select value={form.model} onValueChange={(v) => set("model", v)} required>
                <SelectTrigger><SelectValue placeholder="Wybierz model" /></SelectTrigger>
                <SelectContent className="max-h-72">
                  {IPHONE_MODELS.map((o) => <SelectItem key={o} value={o}>{o}</SelectItem>)}
                </SelectContent>
              </Select>
            </Field>
          </div>

          <Field label="Opis uszkodzenia">
            <Textarea required rows={5} value={form.damage} onChange={(e) => set("damage", e.target.value)} placeholder="Opisz dokładnie co się stało — pęknięty ekran, nie działa głośnik, problem z baterią..." />
          </Field>
          <Field label="Dodatkowe informacje">
            <Textarea rows={2} value={form.notes} onChange={(e) => set("notes", e.target.value)} placeholder="Cokolwiek innego, co powinniśmy wiedzieć" />
          </Field>

          <button
            type="submit"
            disabled={loading}
            className="btn-premium btn-premium-hover w-full rounded-full px-6 py-4 font-semibold flex items-center justify-center gap-2 disabled:opacity-70"
          >
            {loading ? (
              <>
                <Loader2 className="h-5 w-5 animate-spin" />
                Przygotowywanie...
              </>
            ) : (
              "Wyślij zgłoszenie"
            )}
          </button>
        </form>
      </DialogContent>
    </Dialog>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-2">
      <Label className="text-sm text-muted-foreground">{label}</Label>
      {children}
    </div>
  );
}
