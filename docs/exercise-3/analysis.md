# Exercise 3: analysis for Demos 1–4

These are observations about this project, not claims that every website follows one pattern.

## Demo 1: how the web got here

| Stage | What the browser receives and does | Problem that pushed the next stage |
| --- | --- | --- |
| Mostly static documents | Server sends HTML; links request another document. | Each interaction often needs a new page. |
| Server-generated pages | Server builds HTML from data on each request. | Small updates still often reload the document. |
| AJAX / jQuery era | JavaScript requests data in the background and changes part of the DOM. | Manual DOM updates, event handlers and state become hard to coordinate. |
| SPA frameworks | One document stays loaded; client-side routing and components describe the UI from state. | More JavaScript, startup work and client complexity. |
| Hybrid approaches | Server can send useful HTML first and then add client interaction. | More infrastructure and decisions about which part runs where. |

This project began as a hand-written, client-side SPA. Its original `app.js` used `fetch()` for JSON data, `#dashboard`/`#evidence` for navigation, and `innerHTML` for updates. Exercise 2 added Vite and TypeScript, but that did **not** turn it into server-side rendering. Exercise 3 adds a separate React entry; it is still client-rendered. Hash routing is an older SPA routing pattern that was common before the History API became widely used. It remains useful on simple static hosting.

AJAX solved “reload the whole page just to update one part.” For example, this app can load `evidence.json` after the first HTML response instead of asking the server for a new complete page. The new problem is that the browser must now manage asynchronous data, UI state, DOM updates, errors, history and event handlers. Libraries/frameworks organize that work; they do not eliminate all complexity.

## Demo 2: SSR and CSR

| Question | Server-side rendering (SSR) | Client-side rendering (CSR) |
| --- | --- | --- |
| First response | HTML already contains the main content, generated on the server. | Often an HTML shell plus JavaScript; the browser builds important content. |
| Before content is visible | Browser can show server-produced HTML. | Browser downloads/runs JS and may fetch data before rendering content. |
| Later navigation | Often another document request, though hybrid SSR sites can also navigate client-side. | Usually JS changes the current page without a new document request. |
| Main trade-off | Server does more rendering work and requests may be more expensive. | More work and JavaScript dependency on the client; first content can be delayed. |

Public example: a Wikipedia article, e.g. <https://en.wikipedia.org/wiki/JavaScript>, is primarily server-rendered. MediaWiki's own architecture documentation describes the server outputting article HTML. Live demonstration: open an article, use **View page source** in your browser, and find the article heading or a sentence in the returned HTML. In the Network tab, opening a different article normally requests another document. Wikipedia still uses JavaScript for enhancements, so “primarily SSR” is more accurate than “no client JS.”

Our app is different: `index.html` supplies a static header and section skeleton, but **the Dashboard's case summary, statistics and recent lists are built in the browser**. Sequence: request `index.html` → load CSS and `js/main.ts` through Vite → browser runs `initApp()` → `fetchCoreData()` requests JSON → evidence and timeline JSON load → `renderDashboard()` computes counts and writes markup into `#dashboardContent`. The server does not generate those numbers. If JavaScript is disabled, the static shell remains but the useful case data does not appear. Slow JS/data loading delays it; a crawler that does not execute JS may miss it. This is a client-rendered data view, even though the HTML shell is not empty.

## Demo 3: virtual DOM and a real old-code example

The virtual DOM is an in-memory description of the UI. A UI library compares a new description with the previous one and then updates the real DOM where needed. It does not mean that all DOM updates are magically faster: comparing descriptions itself uses CPU and memory. Direct, carefully targeted DOM changes can be faster for a tiny update. The benefit is usually easier coordination between data and UI in a complex app.

In the professor's original `app.js` (commit `22cb2d8`), `handleBookmarkClick(evidenceId)` changes one bookmark and then calls `renderEvidenceList()`. That function builds every card again and assigns the whole result to `container.innerHTML`. One star changed, yet the list DOM and its nodes were recreated. To show it live, compare the original code with the refactored `js/evidence.ts`; the newer code still uses the same broad `innerHTML` pattern, so the issue is easy to point out.

Conceptually, a component-based virtual-DOM approach could keep keyed card components and change only the bookmark button's affected attributes/text. This is not a blanket guarantee: unstable keys, rerendering a huge tree, expensive calculations in render, large bundles, bad effects and unnecessary state updates can make a React app slow too. React also performs comparison work before a real DOM change.

## Demo 4: SPA navigation and state

```text
Click a nav button
  → navigateTo(view) sets window.location.hash
  → browser fires hashchange
  → handleHashChange / createHashChangeHandler reads the hash
  → currentPage changes, CSS classes toggle, a view renderer runs
  → no new HTML document is requested
```

Browser Back goes to the preceding hash-history entry, fires `hashchange`, and the app shows that view again. The address bar is therefore part of the navigation state. An unknown hash falls back to Dashboard in both the vanilla and new React shell.

| State in the vanilla app | Full reload result |
| --- | --- |
| `allEvidence`, `allPeople`, `allLocations`, `allTimeline`, `caseData` | In-memory arrays/objects disappear; JSON is fetched again. |
| `filteredEvidence`, selected evidence, filter controls, current people tab | Reset to their initial UI state. |
| `currentPage`, `viewRendered`, loading flags, search request ID | In-memory values reset. The **hash in the URL can restore the visible view**, not the render flags. |
| `bookmarks`, `notesStore` | In-memory copies reset but are restored from `localStorage`. |
| Hypothesis draft | Restored from `localStorage` when the workspace loads. |

Local storage keys are `remotion_bookmarks`, `remotion_notes`, and `remotion_hypothesis`. They persist in this browser and origin; they are not a server database or automatically shared with another computer.

In a traditional multi-page app, each request can be reconstructed from the URL plus server-side database/session (or form/cookie data), and the server sends a new HTML document. In this SPA, most working data lives in browser memory while the document stays open. That makes transitions quick and avoids document reloads, but makes refresh persistence and synchronization the app's responsibility.

The hand-built router matches only five fixed hashes and toggles sections. A router library can additionally provide route parameters, nested layouts, link/navigation helpers, not-found routes and integration with browser history; some also add data-loading APIs. We did not add one in Exercise 3 because five fixed views need only a small hash listener.

## References used

- [MDN: AJAX](https://developer.mozilla.org/en-US/docs/Glossary/AJAX)
- [MDN: hash routing](https://developer.mozilla.org/en-US/docs/Glossary/Hash_routing)
- [MDN: SSR](https://developer.mozilla.org/en-US/docs/Glossary/SSR)
- [MDN: History API](https://developer.mozilla.org/en-US/docs/Web/API/History_API/Working_with_the_History_API)
- [MediaWiki architecture](https://www.mediawiki.org/wiki/Manual:MediaWiki_architecture)
