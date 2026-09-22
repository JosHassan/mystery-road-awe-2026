import { state, STORAGE_KEYS } from "./state.ts";
import type { HypothesisDraft } from "./types.ts";

const readJson = (key: string, fallback: unknown): unknown => {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;

    const parsed: unknown = JSON.parse(raw);
    return parsed;
  } catch (error) {
    console.warn(`Could not read ${key}; using a safe default.`, error);
    return fallback;
  }
};

const writeJson = (key: string, value: unknown): void => {
  const serialized = JSON.stringify(value);
  if (serialized === undefined) return;
  localStorage.setItem(key, serialized);
};

const isStringArray = (value: unknown): value is string[] =>
  Array.isArray(value) &&
  value.every((item: unknown) => typeof item === "string");

const isStringRecord = (value: unknown): value is Record<string, string> =>
  typeof value === "object" &&
  value !== null &&
  !Array.isArray(value) &&
  Object.values(value).every((item: unknown) => typeof item === "string");

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null && !Array.isArray(value);

const isHypothesisDraft = (value: unknown): value is HypothesisDraft =>
  isRecord(value) &&
  typeof value.suspectId === "string" &&
  typeof value.nature === "string" &&
  isStringArray(value.evidenceIds) &&
  (typeof value.confidence === "string" ||
    typeof value.confidence === "number") &&
  typeof value.explanation === "string" &&
  typeof value.alternative === "string" &&
  typeof value.savedAt === "string";

export const loadBookmarksFromStorage = (): void => {
  const parsed = readJson(STORAGE_KEYS.bookmarks, []);
  state.bookmarks = isStringArray(parsed) ? parsed : [];
};

export const saveBookmarksToStorage = (): void => {
  writeJson(STORAGE_KEYS.bookmarks, state.bookmarks);
};

export const loadNotesFromStorage = (): void => {
  const parsed = readJson(STORAGE_KEYS.notes, {});
  state.notesStore = isStringRecord(parsed) ? parsed : {};
};

export const saveNoteForEvidence = (evidenceId: string, text: string): void => {
  state.notesStore[evidenceId] = text;
  writeJson(STORAGE_KEYS.notes, state.notesStore);
};

export const loadNoteForEvidence = (evidenceId: string): string =>
  state.notesStore[evidenceId] || "";

export const saveHypothesisToStorage = (draft: HypothesisDraft): void => {
  writeJson(STORAGE_KEYS.hypothesis, draft);
};

export const loadHypothesisFromStorage = (): HypothesisDraft | null => {
  const parsed = readJson(STORAGE_KEYS.hypothesis, null);
  return isHypothesisDraft(parsed) ? parsed : null;
};
