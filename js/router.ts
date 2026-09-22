import { state } from "./state.ts";

const validViews = [
  "dashboard",
  "evidence",
  "people",
  "timeline",
  "workspace",
] as const;

type ViewName = (typeof validViews)[number];
type Renderers = Record<ViewName, () => void>;

const isValidView = (value: string): value is ViewName =>
  validViews.some((view) => view === value);

export const navigateTo = (viewName: string) => {
  window.location.hash = viewName;
};

export const createHashChangeHandler = (renderers: Renderers) => () => {
  const requestedView = window.location.hash.replace("#", "");
  const viewName = isValidView(requestedView) ? requestedView : "dashboard";
  state.currentPage = viewName;

  document
    .querySelectorAll(".view")
    .forEach((section) => section.classList.remove("active"));

  document.getElementById(`view-${viewName}`)?.classList.add("active");

  document.querySelectorAll<HTMLElement>(".nav-btn").forEach((button) => {
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
