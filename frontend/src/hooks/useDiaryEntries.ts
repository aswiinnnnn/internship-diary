import { api } from "@/lib/api";
import { DiaryEntry } from "@/types/diary";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

const ADMIN_USERNAME = "learneradmin";
const ADMIN_PASSWORD = "admin@890";
const ADMIN_AUTH_FLAG_KEY = "diaryAdminAuthed";
const ADMIN_USER_KEY = "diaryAdminUser";
const ADMIN_PASS_KEY = "diaryAdminPass";

function getAdminHeaders(): Record<string, string> | undefined {
  if (sessionStorage.getItem(ADMIN_AUTH_FLAG_KEY) !== "1") return undefined;
  const username = sessionStorage.getItem(ADMIN_USER_KEY) || "";
  const password = sessionStorage.getItem(ADMIN_PASS_KEY) || "";
  if (!username || !password) return undefined;
  return {
    "X-Admin-Username": username,
    "X-Admin-Password": password,
  };
}

async function ensureAdminAuthenticated(): Promise<boolean> {
  if (sessionStorage.getItem(ADMIN_AUTH_FLAG_KEY) === "1") return true;

  const username = window.prompt("Enter admin username");
  if (username == null) return false;
  const password = window.prompt("Enter admin password");
  if (password == null) return false;

  if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
    sessionStorage.setItem(ADMIN_AUTH_FLAG_KEY, "1");
    sessionStorage.setItem(ADMIN_USER_KEY, username);
    sessionStorage.setItem(ADMIN_PASS_KEY, password);
    return true;
  }

  toast.error("Invalid admin credentials");
  return false;
}

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
      const ok = await ensureAdminAuthenticated();
      if (!ok) {
        throw new Error("Not authorized");
      }
      const response = await api.post<DiaryEntry>("entries/", entry, {
        headers: getAdminHeaders(),
      });
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
      const ok = await ensureAdminAuthenticated();
      if (!ok) {
        throw new Error("Not authorized");
      }
      const response = await api.put<DiaryEntry>(`entries/${id}/`, data, {
        headers: getAdminHeaders(),
      });
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

  const updateEntry = async (id: string, data: Omit<DiaryEntry, "id">) => {
    try {
      await updateEntryMutation.mutateAsync({ id, data });
      return true;
    } catch {
      return false;
    }
  };

  return { entries, addEntry, updateEntry };
}
