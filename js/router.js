import { state } from "./state.js";

const validViews = new Set(["dashboard", "evidence", "people", "timeline", "workspace"]);

export const navigateTo = (viewName) => {
  window.location.hash = viewName;
};

export const createHashChangeHandler = (renderers) => () => {
  const requestedView = window.location.hash.replace("#", "");
  const viewName = validViews.has(requestedView) ? requestedView : "dashboard";
  state.currentPage = viewName;

  document.querySelectorAll(".view").forEach((section) => section.classList.remove("active"));
  document.getElementById(`view-${viewName}`).classList.add("active");

  document.querySelectorAll(".nav-btn").forEach((button) => {
    button.classList.toggle("active", button.dataset.view === viewName);
  });

  if (viewName === "workspace" || viewName === "dashboard") {
    renderers[viewName]();
    return;
  }

  if (!state.viewRendered[viewName]) {
    renderers[viewName]();
    state.viewRendered[viewName] = true;
  }
};
