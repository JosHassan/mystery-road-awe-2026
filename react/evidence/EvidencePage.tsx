import { useState } from "react";
import type { Evidence, Location, Person } from "../../js/types.ts";
import { formatDate } from "../../js/utils.ts";
import { EvidenceCard } from "./EvidenceCard";

type EvidencePageProps = {
  evidence: Evidence[];
  people: Person[];
  locations: Location[];
  bookmarks: string[];
  notes: Record<string, string>;
  onToggleBookmark: (evidenceId: string) => void;
  onSaveNote: (evidenceId: string, text: string) => boolean;
};

export function EvidencePage({
  evidence,
  people,
  locations,
  bookmarks,
  notes,
  onToggleBookmark,
  onSaveNote,
}: EvidencePageProps) {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [noteText, setNoteText] = useState("");
  const [saveMessage, setSaveMessage] = useState("");
  const selected = evidence.find((item) => item.id === selectedId);
  const types = [...new Set(evidence.map((item) => item.type.toLowerCase()))];

  const openEvidence = (evidenceId: string) => {
    setSelectedId(evidenceId);
    setNoteText(notes[evidenceId] ?? "");
    setSaveMessage("");
  };

  const saveCurrentNote = () => {
    if (!selected) return;
    if (onSaveNote(selected.id, noteText)) setSaveMessage("Note saved.");
  };

  return (
    <section>
      <h2>Evidence Catalogue</h2>
      <div className="toolbar">
        <div className="toolbar-row">
          <label className="visually-hidden" htmlFor="react-evidence-search">
            Search evidence
          </label>
          <input
            id="react-evidence-search"
            type="text"
            placeholder="Search evidence by title, summary, or tag…"
          />
          <label className="visually-hidden" htmlFor="react-filter-type">
            Filter by type
          </label>
          <select id="react-filter-type" defaultValue="">
            <option value="">All types</option>
            {types.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
          <label className="visually-hidden" htmlFor="react-filter-person">
            Filter by person
          </label>
          <select id="react-filter-person" defaultValue="">
            <option value="">All people</option>
            {people.map((person) => (
              <option key={person.id} value={person.id}>
                {person.name}
              </option>
            ))}
          </select>
          <label className="visually-hidden" htmlFor="react-filter-location">
            Filter by location
          </label>
          <select id="react-filter-location" defaultValue="">
            <option value="">All locations</option>
            {locations.map((location) => (
              <option key={location.id} value={location.id}>
                {location.id} - {location.name}
              </option>
            ))}
          </select>
        </div>
        <div className="toolbar-row">
          <select aria-label="Filter by status" defaultValue="">
            <option value="">All statuses</option>
            <option value="unreviewed">Unreviewed</option>
            <option value="reviewed">Reviewed</option>
            <option value="flagged">Flagged</option>
          </select>
          <select aria-label="Filter by relevance" defaultValue="">
            <option value="">All relevance</option>
            <option value="unknown">Unknown</option>
            <option value="relevant">Relevant</option>
            <option value="irrelevant">Irrelevant</option>
          </select>
          <select aria-label="Sort evidence" defaultValue="date-desc">
            <option value="date-desc">Newest first</option>
            <option value="date-asc">Oldest first</option>
            <option value="title-asc">Title (A–Z)</option>
            <option value="title-desc">Title (Z–A)</option>
          </select>
          <button type="button" className="btn btn-secondary" disabled>
            Clear filters
          </button>
        </div>
        <p className="hint-text">
          Filter and search behavior follows in the next demos.
        </p>
      </div>

      <div className="evidence-grid">
        {evidence.map((item) => (
          <EvidenceCard
            key={item.id}
            evidence={item}
            bookmarked={bookmarks.includes(item.id)}
            onOpen={openEvidence}
            onToggleBookmark={onToggleBookmark}
          />
        ))}
      </div>

      {selected && (
        <section className="evidence-detail" aria-label="Evidence detail">
          <div className="evidence-detail-header">
            <h2>{selected.title}</h2>
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => setSelectedId(null)}
            >
              Close
            </button>
          </div>
          <p>
            {selected.id} · {selected.type} · {formatDate(selected.timestamp)}
          </p>
          <p>{selected.summary}</p>
          <div className="evidence-detail-content">{selected.content}</div>
          <label htmlFor="react-evidence-note">Personal note</label>
          <textarea
            id="react-evidence-note"
            className="note-textarea"
            rows={4}
            value={noteText}
            onChange={(event) => {
              setNoteText(event.target.value);
              setSaveMessage("");
            }}
          />
          <button
            type="button"
            className="btn btn-primary"
            onClick={saveCurrentNote}
          >
            Save note
          </button>
          {saveMessage && (
            <p className="saved-msg" role="status">
              {saveMessage}
            </p>
          )}
        </section>
      )}
    </section>
  );
}
