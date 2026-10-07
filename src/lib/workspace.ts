import { useFileStore } from "../store";
import { clearAllFilesFromDB, getAllFilesFromDB } from "./fileDB";

const OWNER_KEY = "file-storage-owner";

export async function syncLocalWorkspace(userId: string | null): Promise<void> {
  const owner = localStorage.getItem(OWNER_KEY);

  if (!userId) {
    await clearAllFilesFromDB();
    useFileStore.getState().reset();
    localStorage.removeItem(OWNER_KEY);
    localStorage.removeItem("file-storage");
    return;
  }

  if (owner !== userId) {
    await clearAllFilesFromDB();
    useFileStore.getState().reset();
    localStorage.removeItem("file-storage");
    localStorage.setItem(OWNER_KEY, userId);
    return;
  }

  const storedFiles = await getAllFilesFromDB();
  useFileStore.getState().setFiles(storedFiles);
}
