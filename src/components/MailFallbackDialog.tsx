import { useState } from "react";
import { Copy, Mail, Check, ExternalLink } from "lucide-react";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

const EMAIL = "flipperiphone7@gmail.com";

export function MailFallbackDialog({
  open,
  onOpenChange,
  subject,
  body,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  subject: string;
  body: string;
}) {
  const [copied, setCopied] = useState(false);

  const fullMessage = `Do: ${EMAIL}\nTemat: ${subject}\n\n${body}`;

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(fullMessage);
      setCopied(true);
      toast("Skopiowano do schowka", { description: "Wklej wiadomość w swojej poczcie." });
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast("Nie udało się skopiować", { description: "Skopiuj ręcznie z pola poniżej." });
    }
  };

  const openGmail = () => {
    const url = `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(EMAIL)}&su=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    window.open(url, "_blank", "noopener,noreferrer");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="glass max-w-2xl max-h-[90vh] overflow-y-auto border-white/10 animate-scale-in">
        <DialogHeader>
          <DialogTitle className="text-2xl font-semibold text-gradient">Wyślij wiadomość</DialogTitle>
          <DialogDescription className="text-muted-foreground">
            Jeśli aplikacja pocztowa nie otworzyła się automatycznie, skopiuj wiadomość i wyślij ją ręcznie na:{" "}
            <span className="text-foreground font-medium">{EMAIL}</span>
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 pt-2">
          <div className="glass rounded-2xl p-4 border border-white/10">
            <div className="flex items-center justify-between text-xs text-muted-foreground mb-2">
              <span>Podgląd wiadomości</span>
              <span className="text-primary">{subject}</span>
            </div>
            <pre className="text-sm text-foreground/90 whitespace-pre-wrap font-mono max-h-72 overflow-y-auto leading-relaxed">
{body}
            </pre>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <button
              onClick={copy}
              className="glass hover:bg-white/10 transition rounded-full px-6 py-4 font-medium flex items-center justify-center gap-2 border border-white/10"
            >
              {copied ? <Check className="h-4 w-4 text-primary" /> : <Copy className="h-4 w-4" />}
              {copied ? "Skopiowano" : "Skopiuj wiadomość"}
            </button>
            <button
              onClick={openGmail}
              className="btn-premium btn-premium-hover rounded-full px-6 py-4 font-semibold flex items-center justify-center gap-2"
            >
              <Mail className="h-4 w-4" />
              Otwórz Gmail
              <ExternalLink className="h-3.5 w-3.5 opacity-70" />
            </button>
          </div>

          <p className="text-xs text-muted-foreground text-center">
            Po kliknięciu „Otwórz Gmail" otworzymy nowe okno z gotową wiadomością.
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export function isDesktop() {
  if (typeof window === "undefined") return false;
  const ua = navigator.userAgent || "";
  const mobile = /Mobi|Android|iPhone|iPad|iPod|Mobile/i.test(ua);
  return !mobile;
}
