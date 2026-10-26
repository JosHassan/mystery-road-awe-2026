import { useState } from "react";

const sample = [
  { id: "signal-scholar", name: "Signal Scholar" },
  { id: "nova-byte", name: "Nova Byte" },
  { id: "patch-vector", name: "Patch Vector" },
];

// This is an isolated throwaway demonstration for Exercise 4, Demo 4.
// The actual People, Locations and Timeline lists all use stable ids.
export function KeyIdentityDemo() {
  const [reversed, setReversed] = useState(false);
  const list = reversed ? [...sample].reverse() : sample;

  return (
    <section>
      <h2>Why list keys matter</h2>
      <p>
        The input starts with each person’s name. Click “Reverse order”: on the
        left, names and input values no longer match.
      </p>
      <button
        className="btn btn-primary"
        type="button"
        onClick={() => setReversed((value) => !value)}
      >
        Reverse order
      </button>
      <div className="dashboard-columns" style={{ marginTop: 18 }}>
        <div className="dashboard-panel">
          <h3>Wrong: array index as key</h3>
          {list.map((person, index) => (
            <label className="key-demo-row" key={index}>
              {person.name}
              <input
                defaultValue={person.name}
                aria-label={`Index-key value for ${person.name}`}
              />
            </label>
          ))}
        </div>
        <div className="dashboard-panel">
          <h3>Correct: stable person id as key</h3>
          {list.map((person) => (
            <label className="key-demo-row" key={person.id}>
              {person.name}
              <input
                defaultValue={person.name}
                aria-label={`Id-key value for ${person.name}`}
              />
            </label>
          ))}
        </div>
      </div>
    </section>
  );
}
