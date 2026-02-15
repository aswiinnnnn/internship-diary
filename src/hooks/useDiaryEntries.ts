import { useState } from "react";
import { DiaryEntry } from "@/types/diary";

const STORAGE_KEY = "internship-diary-entries";

function loadEntries(): DiaryEntry[] {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

function saveEntries(entries: DiaryEntry[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
}

export function useDiaryEntries() {
  const [entries, setEntries] = useState<DiaryEntry[]>(loadEntries);

  const addEntry = (entry: Omit<DiaryEntry, "id">) => {
    const existing = entries.find((e) => e.date === entry.date);
    if (existing) return false;
    const newEntry: DiaryEntry = { ...entry, id: crypto.randomUUID() };
    const updated = [newEntry, ...entries].sort((a, b) => b.date.localeCompare(a.date));
    setEntries(updated);
    saveEntries(updated);
    return true;
  };

  const updateEntry = (id: string, data: Omit<DiaryEntry, "id">) => {
    const updated = entries.map((e) => (e.id === id ? { ...e, ...data } : e));
    setEntries(updated);
    saveEntries(updated);
  };

  return { entries, addEntry, updateEntry };
}
