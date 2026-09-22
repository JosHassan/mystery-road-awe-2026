import { state } from "./state.js";
import { escapeHtml, evidenceMentionsPerson } from "./utils.js";
import { navigateTo } from "./router.js";
import { renderEvidenceList } from "./evidence.js";

export const switchPeopleTab = (tab) => {
  state.currentPeopleTab = tab;
  const showPeople = tab === "people";
  document
    .getElementById("peoplePanel")
    .classList.toggle("hidden", !showPeople);
  document
    .getElementById("locationsPanel")
    .classList.toggle("hidden", showPeople);
  document
    .getElementById("tabPeopleBtn")
    .classList.toggle("active", showPeople);
  document
    .getElementById("tabLocationsBtn")
    .classList.toggle("active", !showPeople);
};

const countEvidenceForPerson = (person) =>
  state.allEvidence.filter((evidence) =>
    evidenceMentionsPerson(evidence, person),
  ).length;

export const renderPeople = () => {
  const container = document.getElementById("peoplePanel");
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
      const link = event.target.closest(".evidence-count-link");
      if (!link) return;
      document.getElementById("filterPerson").value = link.dataset.personId;
      navigateTo("evidence");
      setTimeout(renderEvidenceList, 0);
    });
    container.dataset.listenerAttached = "true";
  }
};

export const renderLocations = () => {
  document.getElementById("locationsPanel").innerHTML = state.allLocations
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
