import { state } from "./state.ts";
import { escapeHtml, evidenceMentionsPerson, requireElement } from "./utils.ts";
import type { Person } from "./types.ts";
import { navigateTo } from "./router.ts";
import { renderEvidenceList } from "./evidence.ts";

export const switchPeopleTab = (tab: "people" | "locations") => {
  state.currentPeopleTab = tab;
  const showPeople = tab === "people";
  requireElement("peoplePanel", HTMLElement).classList.toggle(
    "hidden",
    !showPeople,
  );
  requireElement("locationsPanel", HTMLElement).classList.toggle(
    "hidden",
    showPeople,
  );
  requireElement("tabPeopleBtn", HTMLElement).classList.toggle(
    "active",
    showPeople,
  );
  requireElement("tabLocationsBtn", HTMLElement).classList.toggle(
    "active",
    !showPeople,
  );
};

const countEvidenceForPerson = (person: Person) =>
  state.allEvidence.filter((evidence) =>
    evidenceMentionsPerson(evidence, person),
  ).length;

export const renderPeople = () => {
  const container = requireElement("peoplePanel", HTMLElement);
  container.innerHTML = state.allPeople
    .map((person) => {
      const count = countEvidenceForPerson(person);
      return `
      <div class="person-card">
        <div class="person-card-header">
          <img class="person-avatar" src="${escapeHtml(person.avatar)}" alt="Portrait of ${escapeHtml(person.name)}">
          <div><h3>${escapeHtml(person.name)}</h3><div class="person-role">${escapeHtml(person.role)}</div></div>
        </div>
        <p><strong>Speciality:</strong> ${escapeHtml(person.speciality)}</p>
        <ul>${person.responsibilities.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}</ul>
        <div class="person-statement">&ldquo;${escapeHtml(person.statement)}&rdquo;</div>
        <p>${count} related evidence item${count === 1 ? "" : "s"} &mdash;
          <button type="button" class="evidence-count-link" data-person-id="${escapeHtml(person.id)}">view</button>
        </p>
      </div>`;
    })
    .join("");

  if (!container.dataset.listenerAttached) {
    container.addEventListener("click", (event) => {
      if (!(event.target instanceof Element)) return;
      const link = event.target.closest<HTMLButtonElement>(
        ".evidence-count-link",
      );
      if (!link) return;
      requireElement("filterPerson", HTMLSelectElement).value =
        link.dataset.personId ?? "";
      navigateTo("evidence");
      setTimeout(renderEvidenceList, 0);
    });
    container.dataset.listenerAttached = "true";
  }
};

export const renderLocations = () => {
  requireElement("locationsPanel", HTMLElement).innerHTML = state.allLocations
    .map(
      (location) => `
    <div class="location-card">
      <h3>${escapeHtml(location.id)} &mdash; ${escapeHtml(location.name)}</h3>
      <p>${escapeHtml(location.description)}</p>
      <p><strong>Contains:</strong></p>
      <ul>${location.contains.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}</ul>
    </div>`,
    )
    .join("");
};

export const renderPeopleAndLocations = () => {
  renderPeople();
  renderLocations();
  switchPeopleTab(state.currentPeopleTab);
};
