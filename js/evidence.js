import { state } from "./state.js";
import {
  escapeHtml,
  evidenceMentionsPerson,
  findEvidenceById,
  findLocationById,
  findPersonById,
  formatDate,
  getRelevanceBadgeClass,
  getStatusBadgeClass,
} from "./utils.ts";
import {
  loadNoteForEvidence,
  saveBookmarksToStorage,
  saveNoteForEvidence,
} from "./storage.js";

export const applyStoredBookmarkFlags = () => {
  state.allEvidence.forEach((evidence) => {
    evidence.bookmarked = state.bookmarks.includes(evidence.id);
  });
};

export const populateEvidenceDropdowns = () => {
  const typeSelect = document.getElementById("filterType");
  const personSelect = document.getElementById("filterPerson");
  const locationSelect = document.getElementById("filterLocation");
  if (!typeSelect || !personSelect || !locationSelect) return;

  const types = [
    ...new Set(state.allEvidence.map((item) => item.type.toLowerCase())),
  ];
  typeSelect.innerHTML =
    '<option value="">All types</option>' +
    types
      .map(
        (type) =>
          `<option value="${escapeHtml(type)}">${escapeHtml(type)}</option>`,
      )
      .join("");
  personSelect.innerHTML =
    '<option value="">All people</option>' +
    state.allPeople
      .map(
        (person) =>
          `<option value="${escapeHtml(person.id)}">${escapeHtml(person.name)}</option>`,
      )
      .join("");
  locationSelect.innerHTML =
    '<option value="">All locations</option>' +
    state.allLocations
      .map(
        (location) =>
          `<option value="${escapeHtml(location.id)}">${escapeHtml(location.id)} - ${escapeHtml(location.name)}</option>`,
      )
      .join("");
};

const getFilteredEvidence = () => {
  const searchTerm =
    document.getElementById("evidenceSearch")?.value.toLowerCase().trim() ?? "";
  const type = document.getElementById("filterType").value;
  const personId = document.getElementById("filterPerson").value;
  const locationId = document.getElementById("filterLocation").value;
  const status = document.getElementById("filterStatus").value;
  const relevance = document.getElementById("filterRelevance").value;
  const person = personId ? findPersonById(personId) : null;

  return state.allEvidence.filter((item) => {
    const haystack =
      `${item.title} ${item.summary} ${(item.tags || []).join(" ")}`.toLowerCase();
    return (
      (!searchTerm || haystack.includes(searchTerm)) &&
      (!type || item.type.toLowerCase() === type) &&
      (!personId || (person && evidenceMentionsPerson(item, person))) &&
      (!locationId || item.locationIds.includes(locationId)) &&
      (!status || (item.status || "").toLowerCase() === status) &&
      (!relevance || (item.relevance || "").toLowerCase() === relevance)
    );
  });
};

const sortEvidence = (items) => {
  const sortValue = document.getElementById("sortEvidence").value;
  // Task 2: always sort a copy. Sorting the original array caused the reference bug.
  return [...items].sort((a, b) => {
    if (sortValue === "title-asc") return a.title.localeCompare(b.title);
    if (sortValue === "title-desc") return b.title.localeCompare(a.title);
    const dateDifference = new Date(a.timestamp) - new Date(b.timestamp);
    return sortValue === "date-asc" ? dateDifference : -dateDifference;
  });
};

const renderEvidenceCardHtml = (evidence) => {
  const isBookmarked = state.bookmarks.includes(evidence.id);
  return `
    <div class="evidence-card" data-id="${escapeHtml(evidence.id)}">
      <button class="bookmark-btn ${isBookmarked ? "active" : ""}" data-action="bookmark" data-id="${escapeHtml(evidence.id)}" aria-label="Toggle bookmark for ${escapeHtml(evidence.title)}">
        <span class="bookmark-icon">${isBookmarked ? "★" : "☆"}</span>
      </button>
      <h3>${escapeHtml(evidence.title)}</h3>
      <div class="evidence-meta">${escapeHtml(evidence.id)} &middot; ${escapeHtml(evidence.type)} &middot; ${formatDate(evidence.timestamp)}</div>
      <div class="evidence-summary">${escapeHtml(evidence.summary)}</div>
      ${(evidence.tags || []).includes("critical") ? '<span class="badge badge-critical">Critical</span>' : ""}
      <span class="badge ${getStatusBadgeClass(evidence.status)}">${escapeHtml(evidence.status)}</span>
      <span class="badge ${getRelevanceBadgeClass(evidence.relevance)}">${escapeHtml(evidence.relevance)}</span>
      <div>${(evidence.tags || []).map((tag) => `<span class="tag-chip">${escapeHtml(tag)}</span>`).join("")}</div>
    </div>`;
};

const handleBookmarkClick = (evidenceId) => {
  const evidence = findEvidenceById(evidenceId);
  if (!evidence) return;

  if (state.bookmarks.includes(evidenceId)) {
    state.bookmarks = state.bookmarks.filter((id) => id !== evidenceId);
    evidence.bookmarked = false;
  } else {
    state.bookmarks.push(evidenceId);
    evidence.bookmarked = true;
  }
  saveBookmarksToStorage();
  renderEvidenceList();
};

const handleEvidenceListClick = (event) => {
  const bookmarkButton = event.target.closest('[data-action="bookmark"]');
  if (bookmarkButton) {
    event.stopPropagation();
    handleBookmarkClick(bookmarkButton.dataset.id);
    return;
  }
  const card = event.target.closest(".evidence-card");
  if (card) openEvidenceDetail(card.dataset.id);
};

export const renderEvidenceList = () => {
  const container = document.getElementById("evidenceList");
  if (!container) return;

  const loadingIndicator = document.getElementById("evidenceLoadingIndicator");
  loadingIndicator?.classList.toggle("hidden", !state.evidenceViewLoading);
  if (state.evidenceViewLoading) {
    container.innerHTML = "";
    return;
  }

  state.filteredEvidence = sortEvidence(getFilteredEvidence());
  container.innerHTML = state.filteredEvidence.length
    ? state.filteredEvidence.map(renderEvidenceCardHtml).join("")
    : "<p>No evidence matches the current filters.</p>";

  if (!container.dataset.listenerAttached) {
    container.addEventListener("click", handleEvidenceListClick);
    container.dataset.listenerAttached = "true";
  }
};

export const clearFilters = () => {
  [
    "evidenceSearch",
    "filterType",
    "filterPerson",
    "filterLocation",
    "filterStatus",
    "filterRelevance",
  ].forEach((id) => {
    document.getElementById(id).value = "";
  });
  renderEvidenceList();
};

const simulateAsyncSearch = (term) =>
  new Promise((resolve) => {
    setTimeout(() => resolve(term), 300);
  });

export const handleSearchInput = async (event) => {
  const requestId = ++state.latestSearchRequestId;
  await simulateAsyncSearch(event.target.value);
  if (requestId === state.latestSearchRequestId) renderEvidenceList();
};

const statusOptionHtml = (current, value, label) =>
  `<option value="${value}"${(current || "").toLowerCase() === value ? " selected" : ""}>${label}</option>`;

export const closeEvidenceDetail = () => {
  const section = document.getElementById("evidenceDetailSection");
  section.classList.add("hidden");
  section.innerHTML = "";
  state.selectedEvidence = null;
};

const saveCurrentNote = () => {
  const textarea = document.getElementById("evidenceNoteInput");
  if (!textarea) return;
  saveNoteForEvidence(textarea.dataset.evidenceId, textarea.value);
  const preview = document.getElementById("notePreview");
  if (preview) preview.textContent = textarea.value;
};

export const renderEvidenceDetail = (evidence) => {
  const section = document.getElementById("evidenceDetailSection");
  const people = evidence.personIds.map((id) => findPersonById(id)?.name ?? id);
  const locations = evidence.locationIds.map((id) => {
    const location = findLocationById(id);
    return location ? `${location.id} - ${location.name}` : id;
  });
  const storedNote = loadNoteForEvidence(evidence.id);

  section.innerHTML = `
    <div class="evidence-detail-header">
      <div><h2>${escapeHtml(evidence.title)}</h2><div class="evidence-meta">${escapeHtml(evidence.id)} &middot; ${escapeHtml(evidence.type)} &middot; ${formatDate(evidence.timestamp)}</div></div>
      <button type="button" class="btn btn-secondary btn-small" data-action="close-detail">Close</button>
    </div>
    ${(evidence.tags || []).includes("critical") ? '<div class="warning-banner">This item is tagged as critical evidence.</div>' : ""}
    <div class="detail-field"><strong>Summary</strong>${escapeHtml(evidence.summary)}</div>
    <div class="evidence-detail-content">${escapeHtml(evidence.content)}</div>
    <div class="detail-field"><strong>Related people</strong>${people.map(escapeHtml).join(", ")}</div>
    <div class="detail-field"><strong>Related locations</strong>${locations.map(escapeHtml).join(", ")}</div>
    <div class="detail-field"><strong>Tags</strong>${(evidence.tags || []).map((tag) => `<span class="tag-chip">${escapeHtml(tag)}</span>`).join("")}</div>
    <div class="detail-field"><strong>Review status</strong><select id="detailStatusSelect">
      ${statusOptionHtml(evidence.status, "unreviewed", "Unreviewed")}
      ${statusOptionHtml(evidence.status, "reviewed", "Reviewed")}
      ${statusOptionHtml(evidence.status, "flagged", "Flagged")}
    </select></div>
    <div class="detail-field"><strong>Relevance</strong><select id="detailRelevanceSelect">
      ${statusOptionHtml(evidence.relevance, "unknown", "Unknown")}
      ${statusOptionHtml(evidence.relevance, "relevant", "Relevant")}
      ${statusOptionHtml(evidence.relevance, "irrelevant", "Irrelevant")}
    </select></div>
    <div class="detail-field"><strong>Investigator note</strong>
      <textarea id="evidenceNoteInput" class="note-textarea" rows="3" data-evidence-id="${escapeHtml(evidence.id)}" placeholder="Add a private note about this evidence...">${escapeHtml(storedNote)}</textarea>
      <button type="button" class="btn btn-primary btn-small" style="margin-top:6px" data-action="save-note">Save note</button>
    </div>
    <div class="detail-field"><strong>Note preview</strong><div id="notePreview">${escapeHtml(storedNote)}</div></div>`;

  section
    .querySelector('[data-action="close-detail"]')
    .addEventListener("click", closeEvidenceDetail);
  section
    .querySelector('[data-action="save-note"]')
    .addEventListener("click", saveCurrentNote);
  section
    .querySelector("#detailStatusSelect")
    .addEventListener("change", (event) => {
      evidence.status = event.target.value;
      renderEvidenceDetail(evidence);
      renderEvidenceList();
    });
  section
    .querySelector("#detailRelevanceSelect")
    .addEventListener("change", (event) => {
      evidence.relevance = event.target.value;
      renderEvidenceDetail(evidence);
      renderEvidenceList();
    });
};

export const openEvidenceDetail = (evidenceId) => {
  const evidence = findEvidenceById(evidenceId);
  if (!evidence) return;
  state.selectedEvidence = evidence;
  const section = document.getElementById("evidenceDetailSection");
  section.classList.remove("hidden");
  renderEvidenceDetail(evidence);
  section.scrollIntoView({ behavior: "smooth", block: "start" });
};
