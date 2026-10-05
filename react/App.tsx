import { useEffect, useState } from "react";
import {
  fetchCoreData,
  fetchEvidenceData,
  fetchTimelineData,
} from "../js/data.ts";
import { STORAGE_KEYS } from "../js/state.ts";
import { DashboardPage, type DashboardData } from "./DashboardPage";
import { StaticExample } from "./StaticExample";

const readBookmarkCount = (): number => {
  try {
    const value: unknown = JSON.parse(
      localStorage.getItem(STORAGE_KEYS.bookmarks) ?? "[]",
    );
    return Array.isArray(value)
      ? value.filter((id) => typeof id === "string").length
      : 0;
  } catch {
    return 0;
  }
};

const views = [
  { id: "dashboard", label: "Dashboard" },
  { id: "evidence", label: "Evidence" },
  { id: "people", label: "People & Locations" },
  { id: "timeline", label: "Timeline" },
  { id: "workspace", label: "Workspace" },
] as const;

type ViewName = (typeof views)[number]["id"];

const currentHashView = (): ViewName => {
  const hash = window.location.hash.slice(1);
  return views.find((view) => view.id === hash)?.id ?? "dashboard";
};

function AppHeader({ currentView }: { currentView: ViewName }) {
  return (
    <header className="app-header">
      <div className="header-inner">
        <div className="brand">
          <img
            src="/assets/logo/logo.svg"
            alt="Project ReMotion logo"
            className="brand-logo"
          />
          <div>
            <h1>Project ReMotion</h1>
            <StaticExample />
          </div>
        </div>
        <nav className="main-nav" aria-label="Main navigation">
          {views.map((view) => (
            <button
              key={view.id}
              type="button"
              className={`nav-btn ${currentView === view.id ? "active" : ""}`}
              aria-current={currentView === view.id ? "page" : undefined}
              onClick={() => {
                window.location.hash = view.id;
              }}
            >
              {view.label}
            </button>
          ))}
        </nav>
      </div>
    </header>
  );
}

function StubPage({ view }: { view: Exclude<ViewName, "dashboard"> }) {
  const title = views.find((item) => item.id === view)?.label ?? view;
  return (
    <section>
      <h2>{title}</h2>
      <p>
        This page remains in the original app for now. It will move to React in
        a later exercise.
      </p>
      <p>
        <a href={`/#${view}`}>Open {title} in the original app</a>
      </p>
    </section>
  );
}

export function App() {
  const [view, setView] = useState<ViewName>(currentHashView);
  const [data, setData] = useState<DashboardData | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [bookmarkCount, setBookmarkCount] = useState(readBookmarkCount);

  useEffect(() => {
    const onHashChange = () => setView(currentHashView());
    window.addEventListener("hashchange", onHashChange);
    return () => window.removeEventListener("hashchange", onHashChange);
  }, []);

  useEffect(() => {
    let active = true;
    Promise.all([fetchCoreData(), fetchEvidenceData(), fetchTimelineData()])
      .then(([core, evidence, timeline]) => {
        if (active) setData({ ...core, evidence, timeline });
      })
      .catch((error: unknown) => {
        if (active)
          setLoadError(
            error instanceof Error ? error.message : "Unknown loading error",
          );
      });
    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    const onStorage = (event: StorageEvent) => {
      if (event.key === STORAGE_KEYS.bookmarks)
        setBookmarkCount(readBookmarkCount());
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  return (
    <>
      <AppHeader currentView={view} />
      <main className="app-main">
        {view === "dashboard" ? (
          <DashboardPage
            data={data}
            loadError={loadError}
            bookmarkCount={bookmarkCount}
          />
        ) : (
          <StubPage view={view} />
        )}
        <p>
          <a href="/">Return to the original app</a>
        </p>
      </main>
      <footer className="app-footer">
        <p>
          Project ReMotion Investigation Portal — Research Center AI, Software
          and IT-Security of HCW (fictional case study)
        </p>
      </footer>
    </>
  );
}
