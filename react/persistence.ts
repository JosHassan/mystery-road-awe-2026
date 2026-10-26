import { STORAGE_KEYS } from "../js/state.ts";

export const readBookmarks = (): string[] => {
  try {
    const value: unknown = JSON.parse(
      localStorage.getItem(STORAGE_KEYS.bookmarks) ?? "[]",
    );
    return Array.isArray(value) && value.every((id) => typeof id === "string")
      ? value
      : [];
  } catch {
    return [];
  }
};

export const readNotes = (): Record<string, string> => {
  try {
    const value: unknown = JSON.parse(
      localStorage.getItem(STORAGE_KEYS.notes) ?? "{}",
    );
    if (typeof value !== "object" || value === null || Array.isArray(value))
      return {};
    return Object.fromEntries(
      Object.entries(value).filter(
        (entry): entry is [string, string] => typeof entry[1] === "string",
      ),
    );
  } catch {
    return {};
  }
};

export const writeBookmarks = (bookmarks: string[]): void => {
  localStorage.setItem(STORAGE_KEYS.bookmarks, JSON.stringify(bookmarks));
};

export const writeNotes = (notes: Record<string, string>): void => {
  localStorage.setItem(STORAGE_KEYS.notes, JSON.stringify(notes));
};
