import { state } from "./state.ts";
import type { Evidence, Location, Person } from "./types.ts";

export const findEvidenceById = (id: string): Evidence | null =>
  state.allEvidence.find((evidence) => evidence.id === id) ?? null;

export const findPersonById = (id: string): Person | null =>
  state.allPeople.find((person) => person.id === id) ?? null;

export const findLocationById = (id: string): Location | null =>
  state.allLocations.find((location) => location.id === id) ?? null;

export const evidenceMentionsPerson = (
  evidence: Evidence,
  person: Person,
): boolean =>
  evidence.personIds.some((id) => id === person.id || id === person.name);

export const requireElement = <T extends HTMLElement>(
  id: string,
  expected: { new (): T },
): T => {
  const element = document.getElementById(id);
  if (!(element instanceof expected)) {
    throw new Error(`Missing or invalid element: ${id}`);
  }
  return element;
};

export const formatDate = (timestamp: string | null | undefined) => {
  if (!timestamp) return "Unknown date";
  const date = new Date(timestamp);
  if (Number.isNaN(date.getTime())) return timestamp;
  return `${date.toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  })} ${date.toLocaleTimeString(undefined, { hour: "2-digit", minute: "2-digit" })}`;
};

export const getStatusBadgeClass = (status: string | null | undefined) => {
  const normalized = (status || "").toLowerCase();
  if (normalized === "reviewed") return "badge-reviewed";
  if (normalized === "flagged") return "badge-flagged";
  return "badge-unreviewed";
};

export const getRelevanceBadgeClass = (relevance: string | null | undefined) =>
  (relevance || "").toLowerCase() === "relevant"
    ? "badge-relevant"
    : "badge-unreviewed";

export const escapeHtml = (value: unknown = "") =>
  String(value).replace(
    /[&<>'"]/g,
    (character) =>
      ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        "'": "&#39;",
        '"': "&quot;",
      })[character] ?? character,
  );

export const certaintyBadgeClass = (certainty: string | null | undefined) => {
  if (certainty==="confirmed") return "reviewed";
  if (certainty === "contradictory") return "critical";
  if (certainty === "reported") return "flagged";
  return "unreviewed";
};
