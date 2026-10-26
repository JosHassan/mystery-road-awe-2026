import type { Person } from "../../js/types.ts";
import { Link } from "react-router";

type PersonCardProps = {
  person: Person;
};

export function PersonCard({ person }: PersonCardProps) {
  return (
    <article className="person-card">
      <div className="person-card-header">
        <img className="person-avatar" src={`/${person.avatar}`} alt="" />
        <div>
          <h3>
            <Link to={`/team/people/${person.id}`}>{person.name}</Link>
          </h3>
          <p className="person-role">{person.role}</p>
        </div>
      </div>
      <p>
        <strong>Speciality:</strong> {person.speciality}
      </p>
      <ul>
        {person.responsibilities.map((job) => (
          <li key={job}>{job}</li>
        ))}
      </ul>
      <p className="person-statement">{person.statement}</p>
    </article>
  );
}
