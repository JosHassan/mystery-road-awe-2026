import type { Person, TimelineEvent } from "../../js/types.ts";
import { useSearchParams } from "react-router";
import { Panel } from "../components/Panel";
import { TimelineEventCard } from "./TimelineEventCard";

type TimelinePageProps = {
  events: TimelineEvent[];
  people: Person[];
};

export function TimelinePage({ events, people }: TimelinePageProps) {
  const [searchParams] = useSearchParams();
  const personId = searchParams.get("person") ?? "";
  const visibleEvents = personId
    ? events.filter((event) => event.personIds.some((id) => id === personId))
    : events;

  return (
    <section>
      <h2>Timeline</h2>
      <div className="toolbar toolbar-row">
        <select aria-label="Person filter" defaultValue={personId}>
          <option value="">All people</option>
          {people.map((person) => (
            <option key={person.id} value={person.id}>
              {person.name}
            </option>
          ))}
        </select>
        <select aria-label="Event type" defaultValue="">
          <option value="">All types</option>
          {[...new Set(events.map((event) => event.type))].map((type) => (
            <option key={type} value={type}>
              {type}
            </option>
          ))}
        </select>
        <select aria-label="Certainty" defaultValue="">
          <option value="">All certainty levels</option>
          {[...new Set(events.map((event) => event.certainty))].map(
            (certainty) => (
              <option key={certainty} value={certainty}>
                {certainty}
              </option>
            ),
          )}
        </select>
      </div>
      <Panel>
        {visibleEvents.length === 0 ? (
          <p>No timeline events match this person.</p>
        ) : (
          <div className="timeline-container">
            {visibleEvents.map((event) => (
              <TimelineEventCard key={event.id} event={event} />
            ))}
          </div>
        )}
      </Panel>
    </section>
  );
}
