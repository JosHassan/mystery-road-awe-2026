import { Link, useParams } from "react-router";
import type { Person } from "../../js/types.ts";
import { Panel } from "../components/Panel";

type PersonDetailPageProps = { people: Person[] };

export function PersonDetailPage({ people }: PersonDetailPageProps) {
  const { personId } = useParams<{ personId: string }>();
  const person = people.find((item) => item.id === personId);
  if (!person)
    return (
      <section>
        <h2>Person not found</h2>
        <p>No person has the id “{personId}”.</p>
        <Link to="/team/people">Back to people</Link>
      </section>
    );

  return (
    <section>
      <p>
        <Link to="/team/people">← Back to people</Link>
      </p>
      <Panel>
        <div className="person-card-header">
          <img className="person-avatar" src={`/${person.avatar}`} alt="" />
          <div>
            <h2>{person.name}</h2>
            <p>{person.role}</p>
          </div>
        </div>
        <p>
          <strong>Speciality:</strong> {person.speciality}
        </p>
        <p>{person.background}</p>
        <p className="person-statement">{person.statement}</p>
        <Link to={`/timeline?person=${person.id}`}>
          Show this person's timeline events
        </Link>
      </Panel>
    </section>
  );
}
