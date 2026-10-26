import { useEffect, useState } from "react";
import { Navigate, Route, Routes } from "react-router";
import {
  fetchCoreData,
  fetchEvidenceData,
  fetchTimelineData,
} from "../js/data.ts";
import { STORAGE_KEYS } from "../js/state.ts";
import { DashboardPage, type DashboardData } from "./dashboard/DashboardPage";
import { AppShell } from "./shell/AppShell";
import { PeopleLocationsPage } from "./people-locations/PeopleLocationsPage";
import { PersonDetailPage } from "./people-locations/PersonDetailPage";
import { TimelinePage } from "./timeline/TimelinePage";
import { KeyIdentityDemo } from "./demos/KeyIdentityDemo";

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

function FuturePage({
  title,
  originalHash,
}: {
  title: string;
  originalHash: string;
}) {
  return (
    <section>
      <h2>{title}</h2>
      <p>
        This view is still in the original app. It moves to React in Exercise 5.
      </p>
      <a href={`/#${originalHash}`}>Open {title} in the original app</a>
    </section>
  );
}

export function App() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [bookmarkCount, setBookmarkCount] = useState(readBookmarkCount);

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

  const loading = loadError ? (
    <p role="alert">Could not load the case: {loadError}</p>
  ) : (
    <p>Loading case data…</p>
  );

  return (
    <AppShell>
      <Routes>
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route
          path="/dashboard"
          element={
            <DashboardPage
              data={data}
              loadError={loadError}
              bookmarkCount={bookmarkCount}
            />
          }
        />
        <Route path="/team" element={<Navigate to="/team/people" replace />} />
        <Route
          path="/team/people"
          element={
            data ? (
              <PeopleLocationsPage
                kind="people"
                people={data.people}
                locations={data.locations}
              />
            ) : (
              loading
            )
          }
        />
        <Route
          path="/team/people/:personId"
          element={data ? <PersonDetailPage people={data.people} /> : loading}
        />
        <Route
          path="/team/locations"
          element={
            data ? (
              <PeopleLocationsPage
                kind="locations"
                people={data.people}
                locations={data.locations}
              />
            ) : (
              loading
            )
          }
        />
        <Route
          path="/timeline"
          element={
            data ? (
              <TimelinePage events={data.timeline} people={data.people} />
            ) : (
              loading
            )
          }
        />
        <Route
          path="/evidence"
          element={<FuturePage title="Evidence" originalHash="evidence" />}
        />
        <Route
          path="/workspace"
          element={<FuturePage title="Workspace" originalHash="workspace" />}
        />
        <Route path="/key-demo" element={<KeyIdentityDemo />} />
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </AppShell>
  );
}
