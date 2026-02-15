import { useState } from "react";
import { useDiaryEntries } from "@/hooks/useDiaryEntries";
import { DiaryCard } from "@/components/DiaryCard";
import { EntryFormDialog } from "@/components/EntryFormDialog";
import { DiaryEntry } from "@/types/diary";
import { Plus } from "lucide-react";

const Index = () => {
  const { entries, addEntry, updateEntry } = useDiaryEntries();
  const [showCreate, setShowCreate] = useState(false);
  const [editEntry, setEditEntry] = useState<DiaryEntry | null>(null);

  return (
    <div className="min-h-screen bg-background px-4 py-10">
      <div className="max-w-2xl mx-auto">
        <div className="flex items-start justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold">Internship Diary</h1>
            <p className="text-xs uppercase tracking-widest text-muted-foreground mt-1">Byte Learners</p>
          </div>
          <button
            onClick={() => setShowCreate(true)}
            className="flex items-center gap-1.5 px-5 py-2.5 bg-primary text-primary-foreground font-bold rounded-lg border-3 border-foreground hover:opacity-90 transition-opacity"
          >
            <Plus size={16} />
            Create
          </button>
        </div>

        <div className="space-y-3">
          {entries.length === 0 && (
            <p className="text-center text-muted-foreground py-20">No entries yet. Click Create to add your first diary entry.</p>
          )}
          {entries.map((entry) => (
            <DiaryCard key={entry.id} entry={entry} onEdit={setEditEntry} />
          ))}
        </div>
      </div>

      <EntryFormDialog
        open={showCreate}
        onClose={() => setShowCreate(false)}
        onSave={(data) => addEntry(data)}
        existingDates={entries.map((e) => e.date)}
      />

      {editEntry && (
        <EntryFormDialog
          open={true}
          onClose={() => setEditEntry(null)}
          onSave={(data) => {
            updateEntry(editEntry.id, data);
            setEditEntry(null);
            return true;
          }}
          initial={editEntry}
        />
      )}
    </div>
  );
};

export default Index;
