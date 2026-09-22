import { state } from "./state.js";

export const findEvidenceById = (id: string) => {
  const evidenceItems: { id: string }[] = state.allEvidence;
  return evidenceItems.find((evidence) => evidence.id === id) ?? null;
};

export const findPersonById = (id: string) => {
  const people: { id: string }[] = state.allPeople;
  return people.find((person) => person.id === id) ?? null;
};

export const findLocationById = (id: string) => {
  const locations: { id: string }[] = state.allLocations;
  return locations.find((location) => location.id === id) ?? null;
};

export const evidenceMentionsPerson = (
  evidence: { personIds?: string[] },
  person: { id: string; name: string },
) =>
  Array.isArray(evidence.personIds) &&
  (evidence.personIds.includes(person.id) ||
    evidence.personIds.includes(person.name));

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
  if (certainty === "confirmed") return "reviewed";
  if (certainty === "contradictory") return "critical";
  if (certainty === "reported") return "flagged";
  return "unreviewed";
};
