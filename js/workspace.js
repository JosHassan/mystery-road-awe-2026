import { state } from "./state.js";
import { escapeHtml } from "./utils.js";
import { navigateTo } from "./router.js";
import { openEvidenceDetail } from "./evidence.js";
import {
  loadHypothesisFromStorage,
  saveHypothesisToStorage,
} from "./storage.js";

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
      const button = event.target.closest("[data-open-evidence]");
      if (!button) return;
      const evidenceId = button.dataset.openEvidence;
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
  if (!suspectSelect || !evidenceSelect) return;
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
  document.getElementById("hypSuspect").value = draft.suspectId || "";
  document.getElementById("hypNature").value = draft.nature || "";
  document.getElementById("hypConfidence").value = draft.confidence ?? 50;
  document.getElementById("hypConfidenceValue").textContent =
    draft.confidence ?? 50;
  document.getElementById("hypExplanation").value = draft.explanation || "";
  document.getElementById("hypAlternative").value = draft.alternative || "";
  const savedIds = draft.evidenceIds || [];
  [...document.getElementById("hypEvidence").options].forEach((option) => {
    option.selected = savedIds.includes(option.value);
  });
};

export const saveHypothesis = () => {
  const draft = {
    suspectId: document.getElementById("hypSuspect").value,
    nature: document.getElementById("hypNature").value,
    evidenceIds: [
      ...document.getElementById("hypEvidence").selectedOptions,
    ].map((option) => option.value),
    confidence: document.getElementById("hypConfidence").value,
    explanation: document.getElementById("hypExplanation").value,
    alternative: document.getElementById("hypAlternative").value,
    savedAt: new Date().toISOString(),
  };
  try {
    saveHypothesisToStorage(draft);
  } catch (error) {
    console.error("Could not save hypothesis draft", error);
    alert("Your hypothesis could not be saved to local storage.");
    return;
  }
  const message = document.getElementById("hypothesisSavedMsg");
  message.classList.remove("hidden");
  setTimeout(() => message.classList.add("hidden"), 2000);
};

export const renderWorkspace = () => {
  renderBookmarksList();
  renderNotesList();
  populateHypothesisDropdowns();
  restoreHypothesisForm();
};
