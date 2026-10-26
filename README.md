# Project ReMotion – Investigation Portal

Investigate the failure of an AI-assisted rehabilitation robot.

## Exercise 1 solution

The application has been refactored into native ES modules under `js/`. Start it with VS Code Live Server or another local HTTP server.

- [`CHANGES.md`](CHANGES.md) summarises the code changes and their reasons.

## About

Project ReMotion is a browser-based investigation platform built around a fictional incident.
During a pre-demonstration calibration test, the AI-assisted rehabilitation robot **ReMotion**
loaded the wrong calibration profile and triggered its emergency stop. This application lets an
investigator review the evidence, people, locations, and timeline surrounding the incident, and
build up a working hypothesis about what happened.

This repository contains an existing vanilla-JavaScript (no frameworks used) investigation application. The system is
functional but has accumulated technical debt and inconsistent implementation decisions. Your task
during the course will be to analyse, maintain, refactor, migrate, and extend it.

## Running the application

Install the locked dependencies and start the Vite development server:

```bash
npm ci
npm run dev
```

On Windows PowerShell, use `npm.cmd ci` and `npm.cmd run dev` if the script execution policy blocks `npm.ps1`.
Open `http://localhost:5173/` for the original application or
`http://localhost:5173/react.html` for the React migration. Both use the same JSON data.
Run `npm run typecheck`, `npm run lint`, and `npm run build` before presenting.

Exercise 4 migrates Dashboard, People & Locations, and Timeline to React. The last two views,
Evidence and Workspace, are still in the original application until Exercise 5. The React pages
have shareable hash routes, for example `react.html#/team/locations` and
`react.html#/timeline?person=nova-byte`. The exercise tasks and presentation notes are in
[`docs/exercise-4/README.md`](docs/exercise-4/README.md).

## Features

- **Dashboard** — case summary and key statistics calculated from the loaded case data.
- **Evidence catalogue** — search, filter (by type, person, location, status, relevance), sort,
  bookmark, and open detailed evidence records.
- **People & Locations** — profile cards for the investigation team and the six key locations.
- **Timeline** — chronological view of case events with filtering and links to related evidence.
- **Investigator workspace** — bookmarked evidence, personal notes, and a hypothesis draft form.
  Workspace data is saved to your browser's local storage and will still be there when you reload
  the page.

## Browser requirements

A recent version of any evergreen desktop browser (Chrome, Firefox, Edge, Safari). JavaScript must
be enabled. The layout targets common desktop and tablet widths.

## Project status

This is a brownfield application being migrated one view at a time. The original application
remains available while the React version is incomplete.
