import type {
  CaseData,
  Evidence,
  Location,
  Person,
  TimelineEvent,
} from "./types.ts";

const parseJsonResponse = async <T>(response: Response): Promise<T> => {
  if (!response.ok) {
    throw new Error(
      `Request failed: ${response.status} ${response.statusText}`,
    );
  }

  const data: unknown = await response.json();
  return data as T;
};

// Deliberately sequential: later exercises may optimise this loading strategy.
export const fetchCoreData = async () => {
  const caseResponse = await fetch("data/case.json");
  const caseData = await parseJsonResponse<CaseData>(caseResponse);

  const peopleResponse = await fetch("data/people.json");
  const people = await parseJsonResponse<Person[]>(peopleResponse);

  const locationsResponse = await fetch("data/locations.json");
  const locations = await parseJsonResponse<Location[]>(locationsResponse);

  return { caseData, people, locations };
};

export const fetchEvidenceData = async () => {
  const response = await fetch("data/evidence.json");
  return parseJsonResponse<Evidence[]>(response);
};

export const fetchTimelineData = async () => {
  const response = await fetch("data/timeline.json");
  return parseJsonResponse<TimelineEvent[]>(response);
};

export const loadNoteAsync = (
  notesStore: Record<string, string>,
  evidenceId: string,
): Promise<string> => Promise.resolve(notesStore[evidenceId] || "");
