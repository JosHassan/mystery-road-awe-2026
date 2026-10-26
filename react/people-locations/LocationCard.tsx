import type { Location } from "../../js/types.ts";

type LocationCardProps = {
  location: Location;
};

export function LocationCard({ location }: LocationCardProps) {
  return (
    <article className="location-card">
      <h3>
        {location.id} — {location.name}
      </h3>
      <p>{location.description}</p>
      <ul>
        {location.contains.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    </article>
  );
}
