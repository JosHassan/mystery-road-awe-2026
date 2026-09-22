import { state } from "./state.js";
import {
  fetchCoreData,
  fetchEvidenceData,
  fetchTimelineData,
  loadNoteAsync,
} from "./data.ts";
import { loadBookmarksFromStorage, loadNotesFromStorage } from "./storage.js";
import { createHashChangeHandler, navigateTo } from "./router.ts";
import { renderDashboard } from "./dashboard.js";
import {
  applyStoredBookmarkFlags,
  clearFilters,
  handleSearchInput,
  populateEvidenceDropdowns,
  renderEvidenceList,
} from "./evidence.js";
import { renderPeopleAndLocations, switchPeopleTab } from "./people.js";
import { populateTimelineDropdowns, renderTimeline } from "./timeline.js";
import {
  populateHypothesisDropdowns,
  renderWorkspace,
  saveHypothesis,
} from "./workspace.js";

const showLoadingOverlay = (message) => {
  document.getElementById("loadingText").textContent = message;
  document.getElementById("loadingOverlay").classList.remove("hidden");
};

const hideLoadingStep = () => {
  state.loadingStepsRemaining -= 1;
  if (state.loadingStepsRemaining <= 0) {
    document.getElementById("loadingOverlay").classList.add("hidden");
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

  document.querySelectorAll(".nav-btn, [data-navigate]").forEach((button) => {
    button.addEventListener("click", (event) => {
      const viewName =
        event.currentTarget.dataset.view ||
        event.currentTarget.dataset.navigate;
      navigateTo(viewName);
    });
  });

  document
    .getElementById("tabPeopleBtn")
    .addEventListener("click", () => switchPeopleTab("people"));
  document
    .getElementById("tabLocationsBtn")
    .addEventListener("click", () => switchPeopleTab("locations"));
  document
    .getElementById("evidenceSearch")
    .addEventListener("input", handleSearchInput);
  [
    "filterType",
    "filterPerson",
    "filterLocation",
    "filterStatus",
    "filterRelevance",
    "sortEvidence",
  ].forEach((id) =>
    document.getElementById(id).addEventListener("change", renderEvidenceList),
  );
  document
    .getElementById("clearFiltersBtn")
    .addEventListener("click", clearFilters);
  [
    "timelineOrder",
    "timelinePersonFilter",
    "timelineLocationFilter",
    "timelineTypeFilter",
  ].forEach((id) =>
    document.getElementById(id).addEventListener("change", renderTimeline),
  );
  document
    .getElementById("hypConfidence")
    .addEventListener("input", (event) => {
      document.getElementById("hypConfidenceValue").textContent =
        event.target.value;
    });
  document
    .getElementById("saveHypothesisBtn")
    .addEventListener("click", saveHypothesis);
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
