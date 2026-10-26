import { Link } from "react-router";
import type { Evidence, Person } from "../../js/types.ts";

type WorkspacePageProps = {
  evidence: Evidence[];
  people: Person[];
  bookmarks: string[];
  notes: Record<string, string>;
};

export function WorkspacePage({
  evidence,
  people,
  bookmarks,
  notes,
}: WorkspacePageProps) {
  const bookmarkedEvidence = evidence.filter((item) =>
    bookmarks.includes(item.id),
  );
  const notedEvidence = evidence.filter(
    (item) => (notes[item.id] ?? "").trim() !== "",
  );

  return (
    <section>
      <h2>Investigator Workspace</h2>
      <div className="workspace-grid">
        <div>
          <h3>Bookmarked Evidence</h3>
          <div className="bookmarks-list">
            {bookmarkedEvidence.length === 0 ? (
              <p>
                No bookmarked evidence yet. Bookmark items from the Evidence
                view.
              </p>
            ) : (
              bookmarkedEvidence.map((item) => (
                <div className="mini-list-item" key={item.id}>
                  <strong>{item.id}</strong> — {item.title}{" "}
                  <Link to="/evidence">Open Evidence</Link>
                </div>
              ))
            )}
          </div>
        </div>
        <div>
          <h3>Personal Notes</h3>
          <p className="hint-text">Notes are attached to evidence items.</p>
          <div className="notes-list">
            {notedEvidence.length === 0 ? (
              <p>No notes yet. Add one from an evidence item’s detail view.</p>
            ) : (
              notedEvidence.map((item) => (
                <div className="mini-list-item" key={item.id}>
                  <strong>{item.id}</strong> — {item.title}
                  <div>{notes[item.id]}</div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      <div className="hypothesis-card">
        <h3>Hypothesis Draft</h3>
        <form onSubmit={(event) => event.preventDefault()}>
          <div className="form-row">
            <label htmlFor="react-hyp-suspect">
              Suspected responsible person
            </label>
            <select id="react-hyp-suspect" defaultValue="">
              <option value="">Select a person…</option>
              {people.map((person) => (
                <option key={person.id} value={person.id}>
                  {person.name}
                </option>
              ))}
            </select>
          </div>
          <div className="form-row">
            <label htmlFor="react-hyp-nature">
              Accidental or deliberate incident
            </label>
            <select id="react-hyp-nature" defaultValue="">
              <option value="">Select…</option>
              <option value="accidental">Accidental</option>
              <option value="deliberate">Deliberate</option>
              <option value="unclear">Unclear</option>
            </select>
          </div>
          <div className="form-row">
            <label htmlFor="react-hyp-evidence">
              Selected supporting evidence
            </label>
            <select id="react-hyp-evidence" multiple size={6}>
              {evidence.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.id} - {item.title}
                </option>
              ))}
            </select>
          </div>
          <div className="form-row">
            <label htmlFor="react-hyp-confidence">Confidence (0–100)</label>
            <input
              id="react-hyp-confidence"
              type="range"
              min="0"
              max="100"
              defaultValue="50"
            />
            <output>50</output>
          </div>
          <div className="form-row">
            <label htmlFor="react-hyp-explanation">Written explanation</label>
            <textarea
              id="react-hyp-explanation"
              rows={4}
              placeholder="Explain your reasoning…"
            />
          </div>
          <div className="form-row">
            <label htmlFor="react-hyp-alternative">
              Alternative explanation
            </label>
            <textarea
              id="react-hyp-alternative"
              rows={3}
              placeholder="What else could explain the evidence?"
            />
          </div>
          <div className="form-actions">
            <button type="submit" className="btn btn-primary" disabled>
              Save hypothesis draft
            </button>
            <span className="hint-text">Form behavior follows in Demo 2.</span>
          </div>
        </form>
      </div>
    </section>
  );
}
