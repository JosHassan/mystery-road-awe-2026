import { state } from "./state.js";
import { escapeHtml, formatDate, getStatusBadgeClass } from "./utils.js";

const statCardHtml = (value, label) => `
  <div class="stat-card">
    <div class="stat-value">${value}</div>
    <div class="stat-label">${label}</div>
  </div>`;

export const renderDashboard = () => {
  const container = document.getElementById("dashboardContent");
  if (!container) return;

  const reviewedCount = state.allEvidence.filter(
    (evidence) => (evidence.status || "").toLowerCase() === "reviewed",
  ).length;
  const progress = state.allEvidence.length
    ? Math.round((reviewedCount / state.allEvidence.length) * 100)
    : 0;

  const recentEvidence = state.allEvidence.slice(-5).reverse();
  const recentTimeline = state.allTimeline.slice(-5).reverse();

  container.innerHTML = `
    <div class="case-summary-card">
      <h3>${escapeHtml(state.caseData.title || "Case")}</h3>
      <p><span class="badge badge-flagged">${escapeHtml((state.caseData.status || "unknown").toUpperCase())}</span></p>
      <p>${escapeHtml(state.caseData.summary || "")}</p>
    </div>
    <div class="stat-grid">
      ${statCardHtml(state.allEvidence.length, "Evidence items")}
      ${statCardHtml(state.allPeople.length, "People")}
      ${statCardHtml(state.allLocations.length, "Locations")}
      ${statCardHtml(state.bookmarks.length, "Bookmarked")}
      ${statCardHtml(reviewedCount, "Reviewed")}
    </div>
    <div class="dashboard-panel">
      <h3>Review progress</h3>
      <div class="progress-bar-outer"><div class="progress-bar-inner" style="width:${progress}%"></div></div>
      <p>${progress}% of evidence reviewed</p>
    </div>
    <div class="dashboard-columns">
      <div class="dashboard-panel">
        <h3>Recent evidence</h3>
        ${recentEvidence.length ? recentEvidence.map((evidence) => `
          <div class="mini-list-item">
            <strong>${escapeHtml(evidence.id)}</strong> &mdash; ${escapeHtml(evidence.title)}
            <span class="badge ${getStatusBadgeClass(evidence.status)}">${escapeHtml(evidence.status)}</span>
          </div>`).join("") : "<p>No evidence loaded yet.</p>"}
      </div>
      <div class="dashboard-panel">
        <h3>Recent timeline events</h3>
        ${recentTimeline.length ? recentTimeline.map((event) => `
          <div class="mini-list-item"><strong>${formatDate(event.time)}</strong><br>${escapeHtml(event.title)}</div>`).join("") : "<p>No timeline events loaded yet.</p>"}
      </div>
    </div>`;
};
