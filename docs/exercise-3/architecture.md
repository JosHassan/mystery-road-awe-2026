# Exercise 3: planned component hierarchy and architecture decision

This is the **whole-app plan** for Demo 7. Only the shell and Dashboard are implemented in React in this exercise; Evidence, People, Timeline and Workspace are placeholders until later exercises.

```text
App (route and loaded case data)
├─ AppHeader
│  ├─ Brand / StaticExample
│  └─ Navigation (five route buttons)
├─ CurrentPage
│  ├─ DashboardPage [implemented]
│  │  ├─ CaseSummary [implemented]
│  │  ├─ StatCard × 5 [implemented]
│  │  ├─ ReviewProgress [implemented]
│  │  ├─ RecentEvidenceList [implemented]
│  │  └─ RecentTimelineList [implemented]
│  ├─ EvidencePage [future]
│  │  ├─ EvidenceFilters / FilterControl [future]
│  │  ├─ EvidenceCard / StatusBadge / BookmarkButton [future]
│  │  └─ EvidenceDetail / NoteEditor [future]
│  ├─ PeopleLocationsPage [future]
│  │  ├─ PersonCard [future]
│  │  └─ LocationCard [future]
│  ├─ TimelinePage [future]
│  │  ├─ TimelineFilters [future]
│  │  └─ TimelineItem [future]
│  └─ WorkspacePage [future]
│     ├─ BookmarkedEvidenceList [future]
│     ├─ NotesList [future]
│     └─ HypothesisForm [future]
└─ AppFooter
```

| Component | Data/props it needs | Source |
| --- | --- | --- |
| `AppHeader` | `currentView` | Hash in browser URL, read by `App` |
| `DashboardPage` | case data, evidence, people, locations, timeline, bookmark count | Existing JSON loaders in `js/data.ts`; bookmark count from local storage |
| `CaseSummary` | one case object | `case.json`, passed via Dashboard |
| `StatCard` | number and label | Derived by Dashboard from its arrays |
| `ReviewProgress` | reviewed and total evidence counts | Derived from `evidence.json` |
| `RecentEvidenceList` | five evidence objects | Last five from `evidence.json` |
| `RecentTimelineList` | five timeline events | Last five from `timeline.json` |
| `EvidenceCard` (future) | evidence object, bookmarked flag, click callbacks | Evidence data plus bookmark state |
| `StatusBadge` (future) | status text and visual variant | Evidence or timeline item |
| `PersonCard` (future) | one person object | `people.json` |

I made a separate component when it has a clear job, is repeated, is likely reusable, or makes the parent easier to read. A one-off single line does not need a component merely because it is JSX. `StatCard` is repeated five times. A future `StatusBadge` can be reused in Evidence cards, detail views and recent lists rather than copying the same badge markup; the vanilla code generated similar badge strings in multiple render functions.

Planning the whole tree now makes the boundaries and needed data visible before more views are migrated. It prevents the Dashboard-only design from forcing an awkward structure later. The diagram is a proposal, not a claim that all components have already been implemented.

## Demo 8: architecture decision record (ADR)

**Context.** Project ReMotion is a small investigation portal with five views, many interactions (filters, bookmarks, notes and a hypothesis form), and JSON data. It is not a public article site where search-engine indexing is the main goal. The current vanilla SPA already uses client-side hash navigation.

**Decision.** Continue the SPA for this course and migrate incrementally to React. Keep the vanilla page at `/` and the React version at `/react.html` during Exercise 3. Use the same JSON files. React owns only its own root element; the two renderers never mutate the same DOM subtree.

**Why this is reasonable.** Components can isolate repeated UI pieces. State-driven rendering can replace fragile manual `innerHTML` updates and class toggles as the app grows. Keeping the old app working lets us compare behavior and migrate one view at a time. A separate page makes the boundary obvious and gives a fallback while the React version is incomplete.

**Costs and alternatives.** React adds a dependency, build configuration, bundle size and a learning curve. Client rendering delays the useful dashboard until JS and JSON load; users without JS do not get the data view. The React build currently adds about 70 kB gzipped JS, while the old vanilla code is much smaller (see `npm run build` output). Vanilla JS with a small router could remain a good choice for only five views and would avoid the React dependency. Server-rendered HTML could show initial content sooner and work better without JS, but needs server code and would not automatically solve rich interactions. A hybrid SSR + client approach could combine fast first content with interactivity but increases architecture complexity beyond this exercise.

**If low-end devices or poor connections became a hard requirement.** Reconsider a server-rendered or hybrid first view, minimize JavaScript, and measure actual load and interaction times. Do not assume React is always the best choice. Keep rich interactions only where they earn their cost.

**Consequences / follow-up.** The non-Dashboard React views are honest stubs, not hidden incomplete implementations. Later exercises can migrate them. The current React Dashboard keeps data in `App` state and passes it down as props. That is sufficient for this small first migration, but a later shared data layer might be useful when multiple React pages need the same data or updates.
