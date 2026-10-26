import type { Evidence } from "../../js/types.ts";
import {
  formatDate,
  getRelevanceBadgeClass,
  getStatusBadgeClass,
} from "../../js/utils.ts";

type EvidenceCardProps = {
  evidence: Evidence;
  bookmarked: boolean;
  onOpen: (evidenceId: string) => void;
  onToggleBookmark: (evidenceId: string) => void;
};

export function EvidenceCard({
  evidence,
  bookmarked,
  onOpen,
  onToggleBookmark,
}: EvidenceCardProps) {
  return (
    <article className="evidence-card">
      <button
        type="button"
        className={`bookmark-btn ${bookmarked ? "active" : ""}`}
        aria-label={`${bookmarked ? "Remove" : "Add"} bookmark for ${evidence.title}`}
        onClick={() => onToggleBookmark(evidence.id)}
      >
        {bookmarked ? "★" : "☆"}
      </button>
      <h3>
        <button
          type="button"
          className="evidence-title-btn"
          onClick={() => onOpen(evidence.id)}
        >
          {evidence.title}
        </button>
      </h3>
      <div className="evidence-meta">
        {evidence.id} · {evidence.type} · {formatDate(evidence.timestamp)}
      </div>
      <div className="evidence-summary">{evidence.summary}</div>
      {evidence.tags.includes("critical") && (
        <span className="badge badge-critical">Critical</span>
      )}
      <span className={`badge ${getStatusBadgeClass(evidence.status)}`}>
        {evidence.status}
      </span>
      <span className={`badge ${getRelevanceBadgeClass(evidence.relevance)}`}>
        {evidence.relevance}
      </span>
      <div>
        {evidence.tags.map((tag) => (
          <span className="tag-chip" key={tag}>
            {tag}
          </span>
        ))}
      </div>
    </article>
  );
}
