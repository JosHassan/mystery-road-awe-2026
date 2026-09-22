import { state } from "./state.ts";
import {
  certaintyBadgeClass,
  escapeHtml,
  findEvidenceById,
  findLocationById,
  formatDate,
  requireElement,
} from "./utils.ts";
import { navigateTo } from "./router.ts";
import { openEvidenceDetail } from "./evidence.ts";

export const populateTimelineDropdowns = () => {
  const personSelect = document.getElementById("timelinePersonFilter");
  const locationSelect = document.getElementById("timelineLocationFilter");
  const typeSelect = document.getElementById("timelineTypeFilter");
  if (!personSelect || !locationSelect || !typeSelect) return;

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
          `<option value="${escapeHtml(location.id)}">${escapeHtml(location.id)}</option>`,
      )
      .join("");
  typeSelect.innerHTML =
    '<option value="">All event types</option>' +
    [...new Set(state.allTimeline.map((event) => event.type))]
      .map(
        (type) =>
          `<option value="${escapeHtml(type)}">${escapeHtml(type)}</option>`,
      )
      .join("");
};

const getVisibleEvents = () => {
  const personId = requireElement(
    "timelinePersonFilter",
    HTMLSelectElement,
  ).value;
  const locationId = requireElement(
    "timelineLocationFilter",
    HTMLSelectElement,
  ).value;
  const type = requireElement("timelineTypeFilter", HTMLSelectElement).value;
  const descending =
    requireElement("timelineOrder", HTMLSelectElement).value === "desc";

  return state.allTimeline
    .filter(
      (event) =>
        (!personId || event.personIds.some((id) => id === personId)) &&
        (!locationId || event.locationIds.includes(locationId)) &&
        (!type || event.type === type),
    )
    .slice()
    .sort((a, b) => {
      const difference =
        new Date(a.time).getTime() - new Date(b.time).getTime();
      return descending ? -difference : difference;
    });
};

export const renderTimeline = () => {
  const container = document.getElementById("timelineContainer");
  if (!container) return;
  const events = getVisibleEvents();
  container.innerHTML = events.length
    ? events
        .map((event) => {
          const locations = event.locationIds.map((id) => {
            const location = findLocationById(id);
            return location ? `${location.id} - ${location.name}` : id;
          });
          return `
      <div class="timeline-event certainty-${escapeHtml(event.certainty)}">
        <div class="timeline-time">${formatDate(event.time)}&nbsp;&middot;&nbsp;<span class="badge badge-${certaintyBadgeClass(event.certainty)}">${escapeHtml(event.certainty)}</span></div>
        <h3>${escapeHtml(event.title)}</h3>
        <p>${escapeHtml(event.description)}</p>
        ${locations.length ? `<p class="evidence-meta">Location: ${locations.map(escapeHtml).join(", ")}</p>` : ""}
        ${event.evidenceIds.map((id) => `<button type="button" class="evidence-link-btn" data-evidence-id="${escapeHtml(id)}">View ${escapeHtml(id)}</button>`).join("")}
      </div>`;
        })
        .join("")
    : "<p>No timeline events match the current filters.</p>";

  if (!container.dataset.listenerAttached) {
    container.addEventListener("click", (event) => {
      if (!(event.target instanceof Element)) return;
      const button =
        event.target.closest<HTMLButtonElement>(".evidence-link-btn");
      if (button?.dataset.evidenceId)
        openEvidenceModal(button.dataset.evidenceId);
    });
    container.dataset.listenerAttached = "true";
  }
};

const getOrCreateModal = () => {
  let modal = document.getElementById("quickViewModal");
  if (!modal) {
    const createdModal = document.createElement("div");
    createdModal.id = "quickViewModal";
    document.body.appendChild(createdModal);
    createdModal.addEventListener("click", (event) => {
      if (!(event.target instanceof Element)) return;
      if (event.target.matches(".modal-close-btn, .modal-backdrop"))
        createdModal.innerHTML = "";
      const openButton = event.target.closest<HTMLElement>("[data-open-full]");
      if (!openButton) return;
      const evidenceId = openButton.dataset.openFull;
      if (!evidenceId) return;
      createdModal.innerHTML = "";
      navigateTo("evidence");
      setTimeout(() => openEvidenceDetail(evidenceId), 0);
    });
    modal = createdModal;
  }
  return modal;
};

export const openEvidenceModal = (evidenceId: string) => {
  const evidence = findEvidenceById(evidenceId);
  if (!evidence) return;
  const modal = getOrCreateModal();
  modal.innerHTML = `
    <div class="modal-backdrop"><div class="modal-box">
      <button type="button" class="modal-close-btn" aria-label="Close">&times;</button>
      <h3>${escapeHtml(evidence.title)}</h3>
      <p class="evidence-meta">${escapeHtml(evidence.id)} &middot; ${escapeHtml(evidence.type)} &middot; ${formatDate(evidence.timestamp)}</p>
      <p>${escapeHtml(evidence.summary)}</p>
      <button type="button" class="btn btn-primary btn-small" data-open-full="${escapeHtml(evidence.id)}">Open full evidence</button>
    </div></div>`;
};
