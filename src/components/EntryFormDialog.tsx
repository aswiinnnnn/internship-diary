import { useState } from "react";
import { format } from "date-fns";
import { DiaryEntry } from "@/types/diary";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

interface EntryFormDialogProps {
  open: boolean;
  onClose: () => void;
  onSave: (entry: Omit<DiaryEntry, "id">) => boolean | void;
  initial?: DiaryEntry;
  existingDates?: string[];
}

export function EntryFormDialog({ open, onClose, onSave, initial, existingDates = [] }: EntryFormDialogProps) {
  const [date, setDate] = useState<Date | undefined>(initial ? new Date(initial.date + "T00:00:00") : new Date());
  const [workSummary, setWorkSummary] = useState(initial?.workSummary ?? "");
  const [hoursWorked, setHoursWorked] = useState(initial?.hoursWorked ?? "");
  const [showYourWork, setShowYourWork] = useState(initial?.showYourWork ?? "");
  const [learnings, setLearnings] = useState(initial?.learnings ?? "");
  const [blockers, setBlockers] = useState(initial?.blockers ?? "");

  if (!open) return null;

  const handleSave = () => {
    if (!date) {
      toast.error("Please select a date");
      return;
    }
    const dateStr = format(date, "yyyy-MM-dd");
    const isDuplicate = existingDates.includes(dateStr) && (!initial || initial.date !== dateStr);
    if (isDuplicate) {
      toast.error("An entry for this date already exists");
      return;
    }
    const result = onSave({ date: dateStr, workSummary, hoursWorked, showYourWork, learnings, blockers });
    if (result !== false) {
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/30">
      <div className="relative w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto bg-card border-3 border-foreground rounded-lg p-6 shadow-brutal">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold">{initial ? "Edit Entry" : "New Entry"}</h2>
          <button onClick={onClose} className="w-9 h-9 flex items-center justify-center border-2 border-foreground rounded-full shadow-brutal-sm hover:bg-secondary transition-all">
            <X size={18} />
          </button>
        </div>

        <div className="space-y-5">
          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1.5 block">Date</label>
            <Popover>
              <PopoverTrigger asChild>
                <button className={cn("w-full flex items-center gap-2 px-4 py-3 border-3 border-foreground rounded-lg text-left shadow-brutal-sm", !date && "text-muted-foreground")}>
                  <CalendarIcon size={16} />
                  {date ? format(date, "dd-MM-yyyy") : "Pick a date"}
                </button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0 border-3 border-foreground" align="start">
                <Calendar mode="single" selected={date} onSelect={setDate} initialFocus className="p-3 pointer-events-auto" />
              </PopoverContent>
            </Popover>
          </div>

          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1.5 block">Work Summary</label>
            <textarea value={workSummary} onChange={(e) => setWorkSummary(e.target.value)} className="w-full px-4 py-3 border-3 border-foreground rounded-lg bg-card resize-none min-h-[100px] shadow-brutal-sm focus:outline-none focus:ring-2 focus:ring-ring" />
          </div>

          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1.5 block">Hours Worked</label>
            <input value={hoursWorked} onChange={(e) => setHoursWorked(e.target.value)} className="w-full px-4 py-3 border-3 border-foreground rounded-lg bg-card shadow-brutal-sm focus:outline-none focus:ring-2 focus:ring-ring" />
          </div>

          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1.5 block">Show Your Work (Links)</label>
            <textarea value={showYourWork} onChange={(e) => setShowYourWork(e.target.value)} className="w-full px-4 py-3 border-3 border-foreground rounded-lg bg-card resize-none min-h-[80px] shadow-brutal-sm focus:outline-none focus:ring-2 focus:ring-ring" />
          </div>

          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1.5 block">Learnings / Outcomes</label>
            <textarea value={learnings} onChange={(e) => setLearnings(e.target.value)} className="w-full px-4 py-3 border-3 border-foreground rounded-lg bg-card resize-none min-h-[100px] shadow-brutal-sm focus:outline-none focus:ring-2 focus:ring-ring" />
          </div>

          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1.5 block">Blockers / Risks</label>
            <textarea value={blockers} onChange={(e) => setBlockers(e.target.value)} className="w-full px-4 py-3 border-3 border-foreground rounded-lg bg-card resize-none min-h-[80px] shadow-brutal-sm focus:outline-none focus:ring-2 focus:ring-ring" />
          </div>

          <button onClick={handleSave} className="w-full py-3 bg-primary text-primary-foreground font-bold rounded-lg border-3 border-foreground shadow-brutal hover:opacity-90 transition-all">
            {initial ? "Update" : "Save"}
          </button>
        </div>
      </div>
    </div>
  );
}
