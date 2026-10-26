import type { Location, Person } from "../../js/types.ts";
import { NavLink } from "react-router";
import { Panel } from "../components/Panel";
import { LocationCard } from "./LocationCard";
import { PersonCard } from "./PersonCard";

type PeopleLocationsPageProps = {
  kind: "people" | "locations";
  people: Person[];
  locations: Location[];
};

export function PeopleLocationsPage({
  kind,
  people,
  locations,
}: PeopleLocationsPageProps) {
  return (
    <section>
      <h2>People & Locations</h2>
      <nav className="tab-bar" aria-label="People and locations">
        <NavLink
          className={`tab-btn ${kind === "people" ? "active" : ""}`}
          to="/team/people"
        >
          People
        </NavLink>
        <NavLink
          className={`tab-btn ${kind === "locations" ? "active" : ""}`}
          to="/team/locations"
        >
          Locations
        </NavLink>
      </nav>
      {kind === "people" ? (
        <Panel>
          {people.length === 0 ? (
            <p>No people available.</p>
          ) : (
            <div className="people-grid">
              {people.map((person) => (
                <PersonCard key={person.id} person={person} />
              ))}
            </div>
          )}
        </Panel>
      ) : (
        <Panel>
          {locations.length === 0 ? (
            <p>No locations available.</p>
          ) : (
            <div className="locations-grid">
              {locations.map((location) => (
                <LocationCard key={location.id} location={location} />
              ))}
            </div>
          )}
        </Panel>
      )}
    </section>
  );
}
