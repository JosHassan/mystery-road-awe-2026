import { state, STORAGE_KEYS } from "./state.js";

const readJson = (key, fallback) => {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch (error) {
    console.warn(`Could not read ${key}; using a safe default.`, error);
    return fallback;
  }
};

const writeJson = (key, value) => {
  localStorage.setItem(key, JSON.stringify(value));
};

export const loadBookmarksFromStorage = () => {
  const parsed = readJson(STORAGE_KEYS.bookmarks, []);
  state.bookmarks = Array.isArray(parsed) ? parsed : [];
};

export const saveBookmarksToStorage = () => {
  writeJson(STORAGE_KEYS.bookmarks, state.bookmarks);
};

export const loadNotesFromStorage = () => {
  const parsed = readJson(STORAGE_KEYS.notes, {});
  state.notesStore = parsed && typeof parsed === "object" && !Array.isArray(parsed) ? parsed : {};
};

export const saveNoteForEvidence = (evidenceId, text) => {
  state.notesStore[evidenceId] = text;
  writeJson(STORAGE_KEYS.notes, state.notesStore);
};

export const loadNoteForEvidence = (evidenceId) => state.notesStore[evidenceId] || "";

export const saveHypothesisToStorage = (draft) => {
  writeJson(STORAGE_KEYS.hypothesis, draft);
};

export const loadHypothesisFromStorage = () => {
  const parsed = readJson(STORAGE_KEYS.hypothesis, null);
  return parsed && typeof parsed === "object" && !Array.isArray(parsed) ? parsed : null;
};
