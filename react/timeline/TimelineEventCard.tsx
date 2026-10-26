import type { TimelineEvent } from "../../js/types.ts";
import { formatDate } from "../../js/utils.ts";

type TimelineEventCardProps = {
  event: TimelineEvent;
};

export function TimelineEventCard({ event }: TimelineEventCardProps) {
  const isContradictory = event.certainty === "contradictory";

  return (
    <article
      className={`timeline-event${isContradictory ? " certainty-contradictory" : ""}`}
    >
      <time className="timeline-time" dateTime={event.time}>
        {formatDate(event.time)}
      </time>
      <h3>{event.title}</h3>
      <p>{event.description}</p>
      <p>
        <span className="badge badge-relevant">{event.type}</span>
        <span className="badge badge-unreviewed">{event.certainty}</span>
      </p>
      {isContradictory && (
        <span className="badge badge-flagged">Contradictory</span>
      )}
    </article>
  );
}
