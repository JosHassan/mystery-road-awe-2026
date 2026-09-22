import { state } from "./state.ts";
import type { Evidence } from "./types.ts";
import {
  escapeHtml,
  evidenceMentionsPerson,
  findEvidenceById,
  findLocationById,
  findPersonById,
  formatDate,
  getRelevanceBadgeClass,
  getStatusBadgeClass,
  requireElement,
} from "./utils.ts";
import {
  loadNoteForEvidence,
  saveBookmarksToStorage,
  saveNoteForEvidence,
} from "./storage.ts";

export const applyStoredBookmarkFlags = () => {
  state.allEvidence.forEach((evidence) => {
    evidence.bookmarked = state.bookmarks.includes(evidence.id);
  });
};

export const populateEvidenceDropdowns = () => {
  const typeSelect = document.getElementById("filterType");
  const personSelect = document.getElementById("filterPerson");
  const locationSelect = document.getElementById("filterLocation");
  if (
    !(typeSelect instanceof HTMLSelectElement) ||
    !(personSelect instanceof HTMLSelectElement) ||
    !(locationSelect instanceof HTMLSelectElement)
  )
    return;

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
  const searchInput = document.getElementById("evidenceSearch");
  const searchTerm =
    searchInput instanceof HTMLInputElement
      ? searchInput.value.toLowerCase().trim()
      : "";
  const type = requireElement("filterType", HTMLSelectElement).value;
  const personId = requireElement("filterPerson", HTMLSelectElement).value;
  const locationId = requireElement("filterLocation", HTMLSelectElement).value;
  const status = requireElement("filterStatus", HTMLSelectElement).value;
  const relevance = requireElement("filterRelevance", HTMLSelectElement).value;
  const person = personId ? findPersonById(personId) : null;

  return state.allEvidence.filter((item) => {
    const haystack =
      `${item.title} ${item.summary} ${(item.tags || []).join(" ")}`.toLowerCase();
    return (
      (!searchTerm || haystack.includes(searchTerm)) &&
      (!type || item.type.toLowerCase() === type) &&
      (!personId ||
        (person !== null && evidenceMentionsPerson(item, person))) &&
      (!locationId || item.locationIds.includes(locationId)) &&
      (!status || (item.status || "").toLowerCase() === status) &&
      (!relevance || (item.relevance || "").toLowerCase() === relevance)
    );
  });
};

const sortEvidence = (items: Evidence[]): Evidence[] => {
  const sortValue = requireElement("sortEvidence", HTMLSelectElement).value;
  // Task 2: always sort a copy. Sorting the original array caused the reference bug.
  return [...items].sort((a, b) => {
    if (sortValue === "title-asc") return a.title.localeCompare(b.title);
    if (sortValue === "title-desc") return b.title.localeCompare(a.title);
    const dateDifference =
      new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime();
    return sortValue === "date-asc" ? dateDifference : -dateDifference;
  });
};

const renderEvidenceCardHtml = (evidence: Evidence) => {
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

const handleBookmarkClick = (evidenceId: string) => {
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

const handleEvidenceListClick = (event: MouseEvent) => {
  if (!(event.target instanceof Element)) return;
  const bookmarkButton = event.target.closest<HTMLElement>(
    '[data-action="bookmark"]',
  );
  if (bookmarkButton) {
    event.stopPropagation();
    if (bookmarkButton.dataset.id)
      handleBookmarkClick(bookmarkButton.dataset.id);
    return;
  }
  const card = event.target.closest<HTMLElement>(".evidence-card");
  if (card?.dataset.id) openEvidenceDetail(card.dataset.id);
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
    const control = document.getElementById(id);
    if (
      control instanceof HTMLInputElement ||
      control instanceof HTMLSelectElement
    )
      control.value = "";
  });
  renderEvidenceList();
};

const simulateAsyncSearch = (term: string): Promise<string> =>
  new Promise((resolve) => {
    setTimeout(() => resolve(term), 300);
  });

export const handleSearchInput = async (event: Event) => {
  if (!(event.target instanceof HTMLInputElement)) return;
  const requestId = ++state.latestSearchRequestId;
  await simulateAsyncSearch(event.target.value);
  if (requestId === state.latestSearchRequestId) renderEvidenceList();
};

const statusOptionHtml = (current: string, value: string, label: string) =>
  `<option value="${value}"${(current || "").toLowerCase() === value ? " selected" : ""}>${label}</option>`;

export const closeEvidenceDetail = () => {
  const section = requireElement("evidenceDetailSection", HTMLElement);
  section.classList.add("hidden");
  section.innerHTML = "";
  state.selectedEvidence = null;
};

const saveCurrentNote = () => {
  const textarea = document.getElementById("evidenceNoteInput");
  if (
    !(textarea instanceof HTMLTextAreaElement) ||
    !textarea.dataset.evidenceId
  )
    return;
  saveNoteForEvidence(textarea.dataset.evidenceId, textarea.value);
  const preview = document.getElementById("notePreview");
  if (preview) preview.textContent = textarea.value;
};

export const renderEvidenceDetail = (evidence: Evidence) => {
  const section = requireElement("evidenceDetailSection", HTMLElement);
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

  const closeButton = section.querySelector<HTMLButtonElement>(
    '[data-action="close-detail"]',
  );
  const saveButton = section.querySelector<HTMLButtonElement>(
    '[data-action="save-note"]',
  );
  const statusSelect = section.querySelector<HTMLSelectElement>(
    "#detailStatusSelect",
  );
  const relevanceSelect = section.querySelector<HTMLSelectElement>(
    "#detailRelevanceSelect",
  );
  if (!closeButton || !saveButton || !statusSelect || !relevanceSelect) {
    throw new Error("Evidence detail controls are missing");
  }

  closeButton.addEventListener("click", closeEvidenceDetail);
  saveButton.addEventListener("click", saveCurrentNote);
  statusSelect.addEventListener("change", () => {
    evidence.status = statusSelect.value;
    renderEvidenceDetail(evidence);
    renderEvidenceList();
  });
  relevanceSelect.addEventListener("change", () => {
    evidence.relevance = relevanceSelect.value;
    renderEvidenceDetail(evidence);
    renderEvidenceList();
  });
};

export const openEvidenceDetail = (evidenceId: string) => {
  const evidence = findEvidenceById(evidenceId);
  if (!evidence) return;
  state.selectedEvidence = evidence;
  const section = requireElement("evidenceDetailSection", HTMLElement);
  section.classList.remove("hidden");
  renderEvidenceDetail(evidence);
  section.scrollIntoView({ behavior: "smooth", block: "start" });
};
