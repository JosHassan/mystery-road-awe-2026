const parseJsonResponse = async (response) => {
  if (!response.ok) {
    throw new Error(`Request failed: ${response.status} ${response.statusText}`);
  }
  return response.json();
};

// Deliberately sequential: later exercises may optimise this loading strategy.
export const fetchCoreData = async () => {
  const caseResponse = await fetch("data/case.json");
  const caseData = await parseJsonResponse(caseResponse);

  const peopleResponse = await fetch("data/people.json");
  const people = await parseJsonResponse(peopleResponse);

  const locationsResponse = await fetch("data/locations.json");
  const locations = await parseJsonResponse(locationsResponse);

  return { caseData, people, locations };
};

export const fetchEvidenceData = async () => {
  const response = await fetch("data/evidence.json");
  return parseJsonResponse(response);
};

export const fetchTimelineData = async () => {
  const response = await fetch("data/timeline.json");
  return parseJsonResponse(response);
};

export const loadNoteAsync = (notesStore, evidenceId) =>
  Promise.resolve(notesStore[evidenceId] || "");
