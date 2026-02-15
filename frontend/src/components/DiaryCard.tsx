import { useState } from "react";
import { format } from "date-fns";
import { DiaryEntry } from "@/types/diary";
import { ChevronDown, ChevronUp, Copy, Pencil } from "lucide-react";
import { toast } from "sonner";

interface DiaryCardProps {
  entry: DiaryEntry;
  onEdit: (entry: DiaryEntry) => void;
}

function CopyButton({ text, label }: { text: string; label: string }) {
  const copy = () => {
    navigator.clipboard.writeText(text);
    toast.success(`${label} copied`);
  };
  return (
    <button onClick={copy} className="flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-full border-2 border-foreground shadow-brutal-sm hover:bg-secondary transition-all" title={`Copy ${label}`}>
      <Copy size={14} />
    </button>
  );
}

export function DiaryCard({ entry, onEdit }: DiaryCardProps) {
  const [open, setOpen] = useState(false);
  const dateObj = new Date(entry.date + "T00:00:00");
  const dateLabel = format(dateObj, "dd MMM yyyy, EEEE");

  const fields = [
    { label: "Work Summary", value: entry.workSummary },
    { label: "Hours Worked", value: entry.hoursWorked },
    { label: "Show Your Work (Links)", value: entry.showYourWork },
    { label: "Learnings / Outcomes", value: entry.learnings },
    { label: "Blockers / Risks", value: entry.blockers },
  ];

  return (
    <div className="bg-card border-3 border-foreground rounded-lg overflow-hidden shadow-brutal">
      <button onClick={() => setOpen(!open)} className="w-full flex items-center justify-between px-6 py-4 text-left hover:bg-secondary/50 transition-colors">
        <span className="font-bold text-base">{dateLabel}</span>
        {open ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
      </button>

      {open && (
        <div className="border-t-3 border-foreground">
          <div className="px-6 py-3 flex justify-end">
            <button onClick={() => onEdit(entry)} className="flex items-center gap-1.5 px-4 py-1.5 border-2 border-foreground rounded-lg font-bold text-sm shadow-brutal-sm hover:bg-accent transition-all">
              <Pencil size={14} />
              Edit
            </button>
          </div>
          <div className="divide-y-2 divide-foreground/20">
            {fields.map((f) => (
              <div key={f.label} className="px-6 py-4">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1">{f.label}</p>
                    <p className="whitespace-pre-wrap break-words">{f.value || "—"}</p>
                  </div>
                  <CopyButton text={f.value || "—"} label={f.label} />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
