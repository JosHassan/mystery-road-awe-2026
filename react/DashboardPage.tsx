import type {
  CaseData,
  Evidence,
  Location,
  Person,
  TimelineEvent,
} from "../js/types.ts";
import { formatDate, getStatusBadgeClass } from "../js/utils.ts";

export interface DashboardData {
  caseData: CaseData;
  people: Person[];
  locations: Location[];
  evidence: Evidence[];
  timeline: TimelineEvent[];
}

interface DashboardPageProps {
  data: DashboardData | null;
  loadError: string | null;
  bookmarkCount: number;
}

function CaseSummary({ caseData }: { caseData: CaseData }) {
  return (
    <div className="case-summary-card">
      <h3>{caseData.title}</h3>
      <p>
        <span className="badge badge-flagged">
          {caseData.status.toUpperCase()}
        </span>
      </p>
      <p>{caseData.summary}</p>
    </div>
  );
}

function StatCard({ value, label }: { value: number; label: string }) {
  return (
    <div className="stat-card">
      <div className="stat-value">{value}</div>
      <div className="stat-label">{label}</div>
    </div>
  );
}

function ReviewProgress({
  reviewed,
  total,
}: {
  reviewed: number;
  total: number;
}) {
  const percentage = total ? Math.round((reviewed / total) * 100) : 0;
  return (
    <div className="dashboard-panel">
      <h3>Review progress</h3>
      <div className="progress-bar-outer">
        <div
          className="progress-bar-inner"
          style={{ width: `${percentage}%` }}
        />
      </div>
      <p>{percentage}% of evidence reviewed</p>
    </div>
  );
}

function RecentEvidenceList({ evidence }: { evidence: Evidence[] }) {
  return (
    <div className="dashboard-panel">
      <h3>Recent evidence</h3>
      {evidence.length === 0 ? (
        <p>No evidence loaded yet.</p>
      ) : (
        evidence.map((item) => (
          <div className="mini-list-item" key={item.id}>
            <strong>{item.id}</strong> — {item.title}{" "}
            <span className={`badge ${getStatusBadgeClass(item.status)}`}>
              {item.status}
            </span>
          </div>
        ))
      )}
    </div>
  );
}

function RecentTimelineList({ timeline }: { timeline: TimelineEvent[] }) {
  return (
    <div className="dashboard-panel">
      <h3>Recent timeline events</h3>
      {timeline.length === 0 ? (
        <p>No timeline events loaded yet.</p>
      ) : (
        timeline.map((event) => (
          <div className="mini-list-item" key={event.id}>
            <strong>{formatDate(event.time)}</strong>
            <br />
            {event.title}
          </div>
        ))
      )}
    </div>
  );
}

export function DashboardPage({
  data,
  loadError,
  bookmarkCount,
}: DashboardPageProps) {
  if (loadError)
    return (
      <section>
        <h2>Case Dashboard</h2>
        <p role="alert">Could not load the case: {loadError}</p>
      </section>
    );
  if (!data)
    return (
      <section>
        <h2>Case Dashboard</h2>
        <p>Loading case data…</p>
      </section>
    );

  const reviewed = data.evidence.filter(
    (item) => item.status.toLowerCase() === "reviewed",
  ).length;
  const recentEvidence = data.evidence.slice(-5).reverse();
  const recentTimeline = data.timeline.slice(-5).reverse();

  return (
    <section>
      <h2>Case Dashboard</h2>
      <CaseSummary caseData={data.caseData} />
      <div className="stat-grid">
        <StatCard value={data.evidence.length} label="Evidence items" />
        <StatCard value={data.people.length} label="People" />
        <StatCard value={data.locations.length} label="Locations" />
        <StatCard value={bookmarkCount} label="Bookmarked" />
        <StatCard value={reviewed} label="Reviewed" />
      </div>
      <ReviewProgress reviewed={reviewed} total={data.evidence.length} />
      <div className="dashboard-columns">
        <RecentEvidenceList evidence={recentEvidence} />
        <RecentTimelineList timeline={recentTimeline} />
      </div>
    </section>
  );
}
