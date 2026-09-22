import { state } from "./state.ts";
import { escapeHtml, requireElement } from "./utils.ts";
import type { HypothesisDraft } from "./types.ts";
import { navigateTo } from "./router.ts";
import { openEvidenceDetail } from "./evidence.ts";
import {
  loadHypothesisFromStorage,
  saveHypothesisToStorage,
} from "./storage.ts";

const renderBookmarksList = () => {
  const container = document.getElementById("bookmarksList");
  if (!container) return;
  const items = state.allEvidence.filter((evidence) => evidence.bookmarked);
  container.innerHTML = items.length
    ? items
        .map(
          (evidence) => `
    <div class="mini-list-item"><strong>${escapeHtml(evidence.id)}</strong> &mdash; ${escapeHtml(evidence.title)}
      <button type="button" class="btn btn-small btn-secondary" data-open-evidence="${escapeHtml(evidence.id)}">Open</button>
    </div>`,
        )
        .join("")
    : "<p>No bookmarked evidence yet. Bookmark items from the Evidence view.</p>";

  if (!container.dataset.listenerAttached) {
    container.addEventListener("click", (event) => {
      if (!(event.target instanceof Element)) return;
      const button = event.target.closest<HTMLElement>("[data-open-evidence]");
      if (!button) return;
      const evidenceId = button.dataset.openEvidence;
      if (!evidenceId) return;
      navigateTo("evidence");
      setTimeout(() => openEvidenceDetail(evidenceId), 0);
    });
    container.dataset.listenerAttached = "true";
  }
};

const renderNotesList = () => {
  const container = document.getElementById("notesList");
  if (!container) return;
  const entries = state.allEvidence
    .map((evidence) => ({ evidence, note: state.notesStore[evidence.id] }))
    .filter(({ note }) => note);
  container.innerHTML = entries.length
    ? entries
        .map(
          ({ evidence, note }) => `
    <div class="mini-list-item"><strong>${escapeHtml(evidence.id)}</strong> &mdash; ${escapeHtml(evidence.title)}
      <div>${escapeHtml(note)}</div>
    </div>`,
        )
        .join("")
    : "<p>No notes yet. Add one from an evidence item's detail view.</p>";
};

export const populateHypothesisDropdowns = () => {
  const suspectSelect = document.getElementById("hypSuspect");
  const evidenceSelect = document.getElementById("hypEvidence");
  if (
    !(suspectSelect instanceof HTMLSelectElement) ||
    !(evidenceSelect instanceof HTMLSelectElement)
  )
    return;
  const currentSuspect = suspectSelect.value;
  const selectedEvidenceIds = [...evidenceSelect.selectedOptions].map(
    (option) => option.value,
  );
  suspectSelect.innerHTML =
    '<option value="">Select a person…</option>' +
    state.allPeople
      .map(
        (person) =>
          `<option value="${escapeHtml(person.id)}">${escapeHtml(person.name)}</option>`,
      )
      .join("");
  suspectSelect.value = currentSuspect;
  evidenceSelect.innerHTML = state.allEvidence
    .map(
      (evidence) =>
        `<option value="${escapeHtml(evidence.id)}">${escapeHtml(evidence.id)} - ${escapeHtml(evidence.title)}</option>`,
    )
    .join("");
  [...evidenceSelect.options].forEach((option) => {
    option.selected = selectedEvidenceIds.includes(option.value);
  });
};

const restoreHypothesisForm = () => {
  const draft = loadHypothesisFromStorage();
  if (!draft) return;
  requireElement("hypSuspect", HTMLSelectElement).value = draft.suspectId;
  requireElement("hypNature", HTMLSelectElement).value = draft.nature;
  requireElement("hypConfidence", HTMLInputElement).value = String(
    draft.confidence,
  );
  requireElement("hypConfidenceValue", HTMLOutputElement).textContent = String(
    draft.confidence,
  );
  requireElement("hypExplanation", HTMLTextAreaElement).value =
    draft.explanation;
  requireElement("hypAlternative", HTMLTextAreaElement).value =
    draft.alternative;
  const evidenceSelect = requireElement("hypEvidence", HTMLSelectElement);
  [...evidenceSelect.options].forEach((option) => {
    option.selected = draft.evidenceIds.includes(option.value);
  });
};

export const saveHypothesis = () => {
  const draft: HypothesisDraft = {
    suspectId: requireElement("hypSuspect", HTMLSelectElement).value,
    nature: requireElement("hypNature", HTMLSelectElement).value,
    evidenceIds: [
      ...requireElement("hypEvidence", HTMLSelectElement).selectedOptions,
    ].map((option) => option.value),
    confidence: requireElement("hypConfidence", HTMLInputElement).value,
    explanation: requireElement("hypExplanation", HTMLTextAreaElement).value,
    alternative: requireElement("hypAlternative", HTMLTextAreaElement).value,
    savedAt: new Date().toISOString(),
  };
  try {
    saveHypothesisToStorage(draft);
  } catch (error) {
    console.error("Could not save hypothesis draft", error);
    alert("Your hypothesis could not be saved to local storage.");
    return;
  }
  const message = requireElement("hypothesisSavedMsg", HTMLElement);
  message.classList.remove("hidden");
  setTimeout(() => message.classList.add("hidden"), 2000);
};

export const renderWorkspace = () => {
  renderBookmarksList();
  renderNotesList();
  populateHypothesisDropdowns();
  restoreHypothesisForm();
};
