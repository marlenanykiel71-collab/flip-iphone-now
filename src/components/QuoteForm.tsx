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
import { MailFallbackDialog, isDesktop } from "@/components/MailFallbackDialog";

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

const STORAGE = ["64 GB", "128 GB", "256 GB", "512 GB", "1 TB"];
const CONDITION = ["Jak nowy", "Bardzo dobry", "Dobry", "Zadowalający", "Uszkodzony"];
const YES_NO = ["Tak", "Nie"];

type FormState = {
  name: string;
  email: string;
  phone: string;
  model: string;
  storage: string;
  condition: string;
  battery: string;
  waterDamage: string;
  faceId: string;
  screenReplaced: string;
  damages: string;
  notes: string;
};

const initial: FormState = {
  name: "", email: "", phone: "", model: "", storage: "", condition: "",
  battery: "", waterDamage: "", faceId: "", screenReplaced: "", damages: "", notes: "",
};

export function QuoteForm({ open, onOpenChange }: { open: boolean; onOpenChange: (v: boolean) => void }) {
  const [form, setForm] = useState<FormState>(initial);
  const [loading, setLoading] = useState(false);
  const [fallbackOpen, setFallbackOpen] = useState(false);
  const [mailData, setMailData] = useState<{ subject: string; body: string }>({ subject: "", body: "" });

  const set = <K extends keyof FormState>(k: K, v: FormState[K]) => setForm((f) => ({ ...f, [k]: v }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const subject = "Nowa wycena iPhone";
    const body =
`Nowa wycena iPhone

Imię i nazwisko: ${form.name}
Email: ${form.email}
Numer telefonu: ${form.phone}

Model iPhone: ${form.model}
Pamięć: ${form.storage}
Stan telefonu: ${form.condition}
Kondycja baterii: ${form.battery}%
Czy telefon był zalany?: ${form.waterDamage}
Czy działa Face ID?: ${form.faceId}
Czy ekran był wymieniany?: ${form.screenReplaced}

Opis uszkodzeń:
${form.damages || "—"}

Dodatkowe informacje:
${form.notes || "—"}
`;

    // Auto-copy to clipboard
    try {
      await navigator.clipboard.writeText(`Do: flipperiphone7@gmail.com\nTemat: ${subject}\n\n${body}`);
    } catch {}

    const mailto = `mailto:flipperiphone7@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

    // Try to open mailto
    window.location.href = mailto;

    setLoading(false);

    if (isDesktop()) {
      // On desktop show fallback modal (mail client may not be configured)
      setMailData({ subject, body });
      onOpenChange(false);
      setTimeout(() => setFallbackOpen(true), 300);
    } else {
      toast("Otwieramy aplikację pocztową", {
        description: "Wiadomość została też skopiowana do schowka.",
      });
      onOpenChange(false);
    }
    setForm(initial);
  };

  return (
    <>
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="glass max-w-2xl max-h-[90vh] overflow-y-auto border-white/10">
        <DialogHeader>
          <DialogTitle className="text-2xl font-semibold text-gradient">Wyceń swojego iPhone</DialogTitle>
          <DialogDescription className="text-muted-foreground">
            Wypełnij formularz — wyślemy go na nasz adres przez Twoją aplikację pocztową.
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
              <SelectField value={form.model} onValueChange={(v) => set("model", v)} placeholder="Wybierz model" options={IPHONE_MODELS} />
            </Field>
            <Field label="Pamięć telefonu">
              <SelectField value={form.storage} onValueChange={(v) => set("storage", v)} placeholder="Wybierz pamięć" options={STORAGE} />
            </Field>
            <Field label="Stan telefonu">
              <SelectField value={form.condition} onValueChange={(v) => set("condition", v)} placeholder="Wybierz stan" options={CONDITION} />
            </Field>
            <Field label="Kondycja baterii (%)">
              <Input required type="number" min={1} max={100} value={form.battery} onChange={(e) => set("battery", e.target.value)} placeholder="np. 89" />
            </Field>
            <Field label="Czy był zalany?">
              <SelectField value={form.waterDamage} onValueChange={(v) => set("waterDamage", v)} placeholder="Wybierz" options={YES_NO} />
            </Field>
            <Field label="Czy działa Face ID?">
              <SelectField value={form.faceId} onValueChange={(v) => set("faceId", v)} placeholder="Wybierz" options={YES_NO} />
            </Field>
            <Field label="Czy ekran był wymieniany?">
              <SelectField value={form.screenReplaced} onValueChange={(v) => set("screenReplaced", v)} placeholder="Wybierz" options={YES_NO} />
            </Field>
          </div>

          <Field label="Opis uszkodzeń">
            <Textarea rows={3} value={form.damages} onChange={(e) => set("damages", e.target.value)} placeholder="Rysy, wgniecenia, pęknięcia..." />
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
              "Wyślij wycenę"
            )}
          </button>
        </form>
      </DialogContent>
    </Dialog>
    <MailFallbackDialog open={fallbackOpen} onOpenChange={setFallbackOpen} subject={mailData.subject} body={mailData.body} />
    </>
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

function SelectField({
  value, onValueChange, placeholder, options,
}: { value: string; onValueChange: (v: string) => void; placeholder: string; options: string[] }) {
  return (
    <Select value={value} onValueChange={onValueChange} required>
      <SelectTrigger><SelectValue placeholder={placeholder} /></SelectTrigger>
      <SelectContent className="max-h-72">
        {options.map((o) => <SelectItem key={o} value={o}>{o}</SelectItem>)}
      </SelectContent>
    </Select>
  );
}
