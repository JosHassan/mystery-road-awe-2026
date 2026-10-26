import { useEffect, useState } from "react";
import { Navigate, Route, Routes } from "react-router";
import {
  fetchCoreData,
  fetchEvidenceData,
  fetchTimelineData,
} from "../js/data.ts";
import { DashboardPage, type DashboardData } from "./dashboard/DashboardPage";
import { AppShell } from "./shell/AppShell";
import { PeopleLocationsPage } from "./people-locations/PeopleLocationsPage";
import { PersonDetailPage } from "./people-locations/PersonDetailPage";
import { TimelinePage } from "./timeline/TimelinePage";
import { KeyIdentityDemo } from "./demos/KeyIdentityDemo";
import { EvidencePage } from "./evidence/EvidencePage";
import { WorkspacePage } from "./workspace/WorkspacePage";
import {
  readBookmarks,
  readNotes,
  writeBookmarks,
  writeNotes,
} from "./persistence";

export function App() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [bookmarks, setBookmarks] = useState<string[]>(readBookmarks);
  const [notes, setNotes] = useState<Record<string, string>>(readNotes);
  const [saveError, setSaveError] = useState<string | null>(null);

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

  const toggleBookmark = (evidenceId: string) => {
    const next = bookmarks.includes(evidenceId)
      ? bookmarks.filter((id) => id !== evidenceId)
      : [...bookmarks, evidenceId];
    try {
      writeBookmarks(next);
      setBookmarks(next);
      setSaveError(null);
    } catch {
      setSaveError("Could not save bookmarks in this browser.");
    }
  };

  const saveNote = (evidenceId: string, text: string): boolean => {
    const next = { ...notes };
    if (text.trim()) next[evidenceId] = text;
    else delete next[evidenceId];
    try {
      writeNotes(next);
      setNotes(next);
      setSaveError(null);
      return true;
    } catch {
      setSaveError("Could not save the note in this browser.");
      return false;
    }
  };

  const loading = loadError ? (
    <p role="alert">Could not load the case: {loadError}</p>
  ) : (
    <p>Loading case data…</p>
  );

  return (
    <AppShell>
      {saveError && <p role="alert">{saveError}</p>}
      <Routes>
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route
          path="/dashboard"
          element={
            <DashboardPage
              data={data}
              loadError={loadError}
              bookmarkCount={bookmarks.length}
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
          element={
            data ? (
              <EvidencePage
                evidence={data.evidence}
                people={data.people}
                locations={data.locations}
                bookmarks={bookmarks}
                notes={notes}
                onToggleBookmark={toggleBookmark}
                onSaveNote={saveNote}
              />
            ) : (
              loading
            )
          }
        />
        <Route
          path="/workspace"
          element={
            data ? (
              <WorkspacePage
                evidence={data.evidence}
                people={data.people}
                bookmarks={bookmarks}
                notes={notes}
              />
            ) : (
              loading
            )
          }
        />
        <Route path="/key-demo" element={<KeyIdentityDemo />} />
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </AppShell>
  );
}
