import { state } from "./state.ts";
import {
  fetchCoreData,
  fetchEvidenceData,
  fetchTimelineData,
  loadNoteAsync,
} from "./data.ts";
import { loadBookmarksFromStorage, loadNotesFromStorage } from "./storage.ts";
import { createHashChangeHandler, navigateTo } from "./router.ts";
import { renderDashboard } from "./dashboard.ts";
import {
  applyStoredBookmarkFlags,
  clearFilters,
  handleSearchInput,
  populateEvidenceDropdowns,
  renderEvidenceList,
} from "./evidence.ts";
import { renderPeopleAndLocations, switchPeopleTab } from "./people.ts";
import { populateTimelineDropdowns, renderTimeline } from "./timeline.ts";
import {
  populateHypothesisDropdowns,
  renderWorkspace,
  saveHypothesis,
} from "./workspace.ts";
import { requireElement } from "./utils.ts";

const showLoadingOverlay = (message: string) => {
  requireElement("loadingText", HTMLElement).textContent = message;
  requireElement("loadingOverlay", HTMLElement).classList.remove("hidden");
};

const hideLoadingStep = () => {
  state.loadingStepsRemaining -= 1;
  if (state.loadingStepsRemaining <= 0) {
    requireElement("loadingOverlay", HTMLElement).classList.add("hidden");
  }
};

const populateAllDropdowns = () => {
  populateEvidenceDropdowns();
  populateTimelineDropdowns();
  populateHypothesisDropdowns();
};

const refreshDataDependentViews = () => {
  renderDashboard();
  populateAllDropdowns();
};

const loadEvidence = async () => {
  try {
    state.allEvidence = await fetchEvidenceData();
    applyStoredBookmarkFlags();
    state.filteredEvidence = [...state.allEvidence];
    state.evidenceViewLoading = false;
    refreshDataDependentViews();
    if (state.currentPage === "evidence") renderEvidenceList();
    if (state.currentPage === "workspace") renderWorkspace();
  } catch (error) {
    state.evidenceViewLoading = false;
    console.error("Failed to load evidence.json", error);
    alert("Evidence could not be loaded. Some views may be incomplete.");
    renderEvidenceList();
  }
};

const loadTimeline = async () => {
  try {
    state.allTimeline = await fetchTimelineData();
    refreshDataDependentViews();
    if (state.currentPage === "timeline") renderTimeline();
  } catch (error) {
    console.error("Failed to load timeline.json", error);
  } finally {
    hideLoadingStep();
  }
};

const loadAllData = async () => {
  showLoadingOverlay("Loading case file…");
  state.loadingStepsRemaining = 2;
  try {
    const core = await fetchCoreData();
    state.caseData = core.caseData;
    state.allPeople = core.people;
    state.allLocations = core.locations;
    hideLoadingStep();
    refreshDataDependentViews();
  } catch (error) {
    console.error("Failed to load core case data", error);
    hideLoadingStep();
    hideLoadingStep();
    throw error;
  }

  // Match the original lifecycle: evidence and timeline begin after core data,
  // while each loader updates its own view when it resolves.
  void loadEvidence();
  void loadTimeline();
};

const handleHashChange = createHashChangeHandler({
  dashboard: renderDashboard,
  evidence: renderEvidenceList,
  people: renderPeopleAndLocations,
  timeline: renderTimeline,
  workspace: renderWorkspace,
});

const setupEventListeners = () => {
  window.addEventListener("hashchange", handleHashChange);

  document
    .querySelectorAll<HTMLElement>(".nav-btn, [data-navigate]")
    .forEach((button) => {
      button.addEventListener("click", (event) => {
        if (!(event.currentTarget instanceof HTMLElement)) return;
        const viewName =
          event.currentTarget.dataset.view ||
          event.currentTarget.dataset.navigate;
        if (viewName) navigateTo(viewName);
      });
    });

  requireElement("tabPeopleBtn", HTMLElement).addEventListener("click", () =>
    switchPeopleTab("people"),
  );
  requireElement("tabLocationsBtn", HTMLElement).addEventListener("click", () =>
    switchPeopleTab("locations"),
  );
  requireElement("evidenceSearch", HTMLInputElement).addEventListener(
    "input",
    handleSearchInput,
  );
  [
    "filterType",
    "filterPerson",
    "filterLocation",
    "filterStatus",
    "filterRelevance",
    "sortEvidence",
  ].forEach((id) =>
    requireElement(id, HTMLSelectElement).addEventListener(
      "change",
      renderEvidenceList,
    ),
  );
  requireElement("clearFiltersBtn", HTMLElement).addEventListener(
    "click",
    clearFilters,
  );
  [
    "timelineOrder",
    "timelinePersonFilter",
    "timelineLocationFilter",
    "timelineTypeFilter",
  ].forEach((id) =>
    requireElement(id, HTMLSelectElement).addEventListener(
      "change",
      renderTimeline,
    ),
  );
  const confidenceInput = requireElement("hypConfidence", HTMLInputElement);
  confidenceInput.addEventListener("input", () => {
    requireElement("hypConfidenceValue", HTMLOutputElement).textContent =
      confidenceInput.value;
  });
  requireElement("saveHypothesisBtn", HTMLElement).addEventListener(
    "click",
    saveHypothesis,
  );
};

const initApp = async () => {
  loadBookmarksFromStorage();
  loadNotesFromStorage();
  setupEventListeners();
  await loadAllData();
  handleHashChange();

  const firstNote = await loadNoteAsync(state.notesStore, "E01");
  console.info("First note preview:", firstNote || "(empty)");
};

window.addEventListener("DOMContentLoaded", initApp);
