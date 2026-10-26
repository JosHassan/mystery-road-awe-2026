import type { ReactNode } from "react";
import { NavLink, useLocation } from "react-router";

type AppShellProps = { children: ReactNode };

const links = [
  { to: "/dashboard", label: "Dashboard" },
  { to: "/evidence", label: "Evidence" },
  { to: "/team/people", label: "People & Locations" },
  { to: "/timeline", label: "Timeline" },
  { to: "/workspace", label: "Workspace" },
];

export function AppShell({ children }: AppShellProps) {
  const location = useLocation();
  return (
    <>
      <header className="app-header">
        <div className="header-inner">
          <div className="brand">
            <img
              src="/assets/logo/logo.svg"
              alt="Project ReMotion logo"
              className="brand-logo"
            />
            <div>
              <h1>Project ReMotion</h1>
              <p className="subtitle">
                Investigate the failure of an AI-assisted rehabilitation robot.
              </p>
            </div>
          </div>
          <nav className="main-nav" aria-label="Main navigation">
            {links.map(({ to, label }) => {
              const active =
                to === "/team/people"
                  ? location.pathname.startsWith("/team/")
                  : location.pathname === to;
              return (
                <NavLink
                  key={to}
                  to={to}
                  className={`nav-btn ${active ? "active" : ""}`}
                  aria-current={active ? "page" : undefined}
                >
                  {label}
                </NavLink>
              );
            })}
          </nav>
        </div>
      </header>
      <main className="app-main">
        {children}
        <p>
          <a href="/">Return to the original app</a>
        </p>
      </main>
      <footer className="app-footer">
        <p>
          Project ReMotion Investigation Portal — Research Center AI, Software
          and IT-Security of HCW (fictional case study)
        </p>
      </footer>
    </>
  );
}
