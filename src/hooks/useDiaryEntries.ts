import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { DiaryEntry } from "@/types/diary";
import { api } from "@/lib/api";
import { toast } from "sonner";

export function useDiaryEntries() {
  const queryClient = useQueryClient();

  const { data: entries = [], isLoading } = useQuery({
    queryKey: ["diary-entries"],
    queryFn: async () => {
      const response = await api.get<DiaryEntry[]>("entries/");
      return response.data;
    },
  });

  const addEntryMutation = useMutation({
    mutationFn: async (entry: Omit<DiaryEntry, "id">) => {
      const response = await api.post<DiaryEntry>("entries/", entry);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["diary-entries"] });
      toast.success("Entry added successfully");
    },
    onError: (error: any) => {
      console.error(error);
      if (error.response?.data?.date) {
        toast.error("An entry for this date already exists.");
      } else {
        toast.error("Failed to add entry");
      }
    },
  });

  const updateEntryMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Omit<DiaryEntry, "id"> }) => {
      const response = await api.put<DiaryEntry>(`entries/${id}/`, data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["diary-entries"] });
      toast.success("Entry updated successfully");
    },
    onError: () => {
      toast.error("Failed to update entry");
    },
  });

  const addEntry = async (entry: Omit<DiaryEntry, "id">) => {
    // Check if entry for date exists in current data (optimistic check or rely on backend)
    // Here we relying on backend but for better UX we might check locally too.
    // The previous implementation returned boolean. The new one is async void.
    // We need to adapt the calling component or keep the signature similar.
    // However, existing usage expects boolean.
    // Let's wrap mutation.
    try {
      await addEntryMutation.mutateAsync(entry);
      return true;
    } catch {
      return false;
    }
  };

  const updateEntry = (id: string, data: Omit<DiaryEntry, "id">) => {
    updateEntryMutation.mutate({ id, data });
  };

  return { entries, addEntry, updateEntry };
}
