# Exercise 5 Demo 1

## Was verlangt ist

Evidence Catalogue und Workspace sollen nicht mehr nur Platzhalter in der React-App sein. Die Angabe verlangt Karten, Filterleiste, Notizenliste und Hypothesenformular als JSX. Dazu müssen mindestens drei echte Benutzeraktionen aus der alten App als React-Handler umgesetzt werden. In den neuen React-Ansichten darf dafür kein `onclick` im HTML-String und kein manuell angebrachtes `addEventListener` nötig sein.

## Was jetzt im Projekt passiert

Die Daten werden wie bisher von `App` geladen. `EvidencePage` zeigt 18 Evidence-Karten und die zunächst nur sichtbare Filterleiste. `WorkspacePage` zeigt markierte Beweise, gespeicherte Notizen und alle Felder des Hypothesenformulars. `EvidenceCard` ist eine einzelne Karte.

Die drei übernommenen Aktionen sind:

1. Stern auf einer Karte anklicken: `EvidenceCard` ruft über `onClick` die Funktion `onToggleBookmark` aus `App` auf. Die ID landet in einer neuen Bookmark-Liste und wird in `localStorage` gespeichert. Workspace und Dashboard sehen denselben Zustand.
2. Titel einer Karte anklicken: `EvidenceCard` ruft über `onClick` `openEvidence` auf. `EvidencePage` merkt sich die ausgewählte ID und zeigt die Details.
3. Notiz speichern: Der „Save note“-Button ruft `saveCurrentNote` auf. Die Notiz wird der ausgewählten Evidence-ID zugeordnet, in `localStorage` gespeichert und im Workspace angezeigt.

Wichtig: Die alte Vanilla-App unter `/` bleibt für den Vergleich erhalten. Dort gibt es weiterhin ihre alten Listener. **In den neuen React-Ansichten** gibt es keine manuell registrierten DOM-Listener für diese drei Aktionen; die Interaktionen stehen direkt in JSX als `onClick`.

## So kannst du es vorzeigen

Starte das Projekt mit `npm.cmd run dev` und öffne `http://localhost:5173/react.html#/evidence`. Klicke bei „Morning calibration failure report“ auf den Stern. Klicke auf den Titel derselben Karte, schreibe `Wichtiger Kalibrierungsfehler` in „Personal note“ und klicke „Save note“. Öffne oben „Workspace“: Der markierte Beweis und die Notiz stehen dort. Lade die Seite neu: Beide bleiben erhalten, weil sie im Browser gespeichert wurden. Zeige danach in VS Code `react/evidence/EvidenceCard.tsx` und `react/evidence/EvidencePage.tsx` die drei `onClick`-Stellen.

Das Hypothesenformular und die Such-/Filterfelder sind für Demo 1 nur aufgebaut. Der Speichern-Knopf des Formulars ist deshalb noch deaktiviert. In Demo 2 werden Suche und sämtliche Formularfelder kontrolliert und das Formular speicherbar gemacht. Demo 1 behauptet noch nicht, dass die Filter funktionieren.

## Die zwei Fragen aus der Angabe

**React-Klick gegenüber Vanilla-Klick:** In der alten App wurde ein nativer Browser-Listener mit `addEventListener("click", ...)` an die Evidence-Liste gehängt. Die Funktion erhielt ein natives `MouseEvent`. In React steht die Aktion als `onClick={...}` am Button. Wenn die React-Funktion einen `event`-Parameter annimmt, ist das ein `React.MouseEvent`, also Reacts `SyntheticEvent` mit Zugriff auf das native Ereignis über `event.nativeEvent`. Unsere einfachen Klick-Funktionen brauchen den Event-Wert nicht; sie verwenden direkt die bekannte `evidence.id` der Karte.

**Brauchen wir noch Event Delegation?** In der alten App wurde nur ein Listener an die ganze Liste gehängt. Dann musste `event.target.closest(...)` herausfinden, ob ein Stern oder eine Karte getroffen wurde. Das half auch, weil die Liste per `innerHTML` immer wieder neu aufgebaut wurde. In React schreiben wir `onClick` direkt an Stern- und Titelbutton. React verwaltet das Rendern und die Handler selbst; wir müssen nicht bei jedem Render DOM-Listener neu anbringen und auch nicht manuell `event.target` untersuchen. React kann intern Ereignisse delegieren, aber das ist nicht der selbst geschriebene Container-Listener der alten App.
