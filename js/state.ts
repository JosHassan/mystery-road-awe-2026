import type {
  CaseData,
  Evidence,
  Location,
  Person,
  TimelineEvent,
} from "./types.ts";

type ViewName = "dashboard" | "evidence" | "people" | "timeline" | "workspace";

interface AppState {
  allEvidence: Evidence[];
  filteredEvidence: Evidence[];
  selectedEvidence: Evidence | null;
  bookmarks: string[];
  currentPage: ViewName;
  allPeople: Person[];
  allLocations: Location[];
  allTimeline: TimelineEvent[];
  caseData: Partial<CaseData>;
  currentPeopleTab: "people" | "locations";
  loadingStepsRemaining: number;
  evidenceViewLoading: boolean;
  viewRendered: Record<ViewName, boolean>;
  notesStore: Record<string, string>;
  latestSearchRequestId: number;
}

export const state: AppState = {
  allEvidence: [],
  filteredEvidence: [],
  selectedEvidence: null,
  bookmarks: [],
  currentPage: "dashboard",
  allPeople: [],
  allLocations: [],
  allTimeline: [],
  caseData: {},
  currentPeopleTab: "people",
  loadingStepsRemaining: 2,
  evidenceViewLoading: true,
  viewRendered: {
    dashboard: false,
    evidence: false,
    people: false,
    timeline: false,
    workspace: false,
  },
  notesStore: {},
  latestSearchRequestId: 0,
};

export const STORAGE_KEYS = Object.freeze({
  bookmarks: "remotion_bookmarks",
  notes: "remotion_notes",
  hypothesis: "remotion_hypothesis",
});
