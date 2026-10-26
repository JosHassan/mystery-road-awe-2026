# Exercise 4 verstehen und vorzeigen

## Was die Aufgabe insgesamt verlangt

Die Angabe `EXERCISE_4 (1).md` verlangt, die Ansichten People & Locations und Timeline in React umzusetzen. Zusammen mit dem Dashboard aus Exercise 3 sind dann drei der fünf Ansichten React-Ansichten. Evidence und Workspace gehören noch nicht dazu. In Exercise 4 geht es um die Darstellung und die Aufteilung in Komponenten, nicht um fertig funktionierende Filter. In den drei migrierten Ansichten gibt es kein `innerHTML`, keine manuelle Erstellung von DOM-Elementen und keine direkte Änderung von Klassen über `classList`.

Die React-Version läuft neben der alten Version unter `http://localhost:5173/react.html`. Der Teil hinter `#` ist die React-Route. `react.html#/team/people` kann man als Link speichern und wieder öffnen. Weil die alte App auf `/` weiterläuft und kein Server für zusätzliche Pfade eingerichtet ist, verwendet dieses Projekt React Routers `HashRouter`.

Vor dem Vorzeigen: Im Projektordner `npm.cmd ci` ausführen, dann `npm.cmd run dev`. In VS Code oder im Browser `http://localhost:5173/react.html` öffnen. Mit `npm.cmd run typecheck`, `npm.cmd run lint` und `npm.cmd run build` wurden die Änderungen überprüft.

## Demo 1 JSX Komponenten Props und Children

**Aufgabe:** Mindestens drei kleine JSX-Komponenten für People & Locations oder Timeline bauen, alle mit typisierten Props. Mindestens eine Komponente soll `children` annehmen und wirklich verwendet werden.

**Im Projekt:** `PersonCard`, `LocationCard` und `TimelineEventCard` sind die drei Karten. Die Props sind jeweils als TypeScript-Typ beschrieben. `Panel` nimmt `children: ReactNode` entgegen und umschließt sowohl People/Locations als auch Timeline. In `PersonCard` zeigt `{person.name}` einen JavaScript-Wert in JSX an.

**Zeigen und sagen:** „Eine React-Komponente ist hier einfach eine Funktion, die Oberfläche zurückgibt. `PersonCard` bekommt genau eine Person als `person`-Prop. In `{person.name}` wird ihr Name eingesetzt. In JSX-Klammern kann ein JavaScript-Ausdruck stehen, etwa eine Variable, ein Rechenausdruck oder ein bedingter Ausdruck. Eine Anweisung wie `if` oder `for` kann ich nicht direkt als Ausdruck hineinschreiben; die Entscheidung kann ich vorher berechnen oder im JSX einen ternären Ausdruck verwenden. `Panel` ist allgemeiner: Sein Inhalt wird zwischen `<Panel>` und `</Panel>` als `children` übergeben.“

**Fragen:** Falsche Props erkennt TypeScript vor dem Browserstart. Zum Test wurde `person={42}` statt eines Person-Objekts eingesetzt; `npm.cmd run typecheck` meldete `Type 'number' is not assignable to type 'Person'`. Danach wurde die Zeile zurückgesetzt. `person={...}` ist ein benanntes Datenfeld, `children` ist der Inhalt zwischen zwei Komponenten-Tags. Der alte Code schrieb HTML direkt in das Dokument. React erwartet, dass es seinen eigenen Teil des DOM verwaltet; direkte Änderungen könnten beim nächsten Render überschrieben werden oder nicht mehr zu Reacts Vorstellung der Oberfläche passen.

## Demo 2 Bedingte Darstellung

**Aufgabe:** Zwei echte Fälle bedingt darstellen und mindestens zwei Techniken verwenden, zum Beispiel `? :` und `&&`.

**Im Projekt:** `PeopleLocationsPage` wählt mit `kind === "people" ? ... : ...` zwischen Personen und Orten. `TimelinePage` zeigt bei leerer Ergebnisliste einen Hinweis, sonst die Ereignisse. `TimelineEventCard` zeigt das rote „Contradictory“-Badge mit `isContradictory && ...` nur bei widersprüchlichen Ereignissen.

**Zeigen und sagen:** „Wenn ich People anklicke, erscheint die Personenliste, bei Locations die Ortsliste. Das sind zwei Alternativen, daher passt ein ternärer Ausdruck. Das Zusatz-Badge hat nur die Möglichkeiten sichtbar oder unsichtbar, daher reicht `&&`. Bei `0 && <Badge />` würde React die Zahl 0 anzeigen; mein Wert `isContradictory` ist ausdrücklich ein Boolean, deshalb passiert das hier nicht.“

**Fragen:** `return null` rendert gar keinen DOM-Knoten; ein leeres `<div>` erzeugt dagegen ein unnötiges Element. In diesem Code wird für den optionalen Badge `&&` verwendet und für die Listen ein ternärer Ausdruck; keiner der Karten-Komponenten muss `null` zurückgeben.

## Demo 3 Listen als Komponenten rendern

**Aufgabe:** Personen, Orte und Timeline-Ereignisse jeweils mit `map()` als Liste von Komponenten rendern und jeder Komponente einen `key` geben.

**Im Projekt:** `PeopleLocationsPage` enthält `people.map` mit `key={person.id}` und `locations.map` mit `key={location.id}`. `TimelinePage` enthält `visibleEvents.map` mit `key={event.id}`.

**Zeigen und sagen:** „`map()` läuft über die Datenliste und erzeugt pro Eintrag eine Karte. Der `key` ist die stabile Identität des Eintrags. React benutzt ihn, um beim nächsten Render dieselbe Karte wiederzuerkennen, auch wenn sich die Reihenfolge ändert.“

## Demo 4 Stabile Keys und Identität

**Aufgabe:** An einem wegwerfbaren Beispiel zunächst `key={index}` verwenden, durch eine Umordnung den sichtbaren Fehler zeigen und danach mit einer stabilen ID vergleichen.

**Im Projekt:** Die getrennte Seite `react.html#/key-demo` zeigt links `key={index}` und rechts `key={person.id}`. Der Knopf „Reverse order“ dreht beide Listen um. Links wandern die Namen, aber die unkontrollierten Eingabefelder bleiben an ihrer alten Position. Rechts wandert das Eingabefeld mit der richtigen Person mit. Nur diese isolierte Demonstration hat den für den Reorder-Knopf nötigen lokalen Zustand; die eigentlichen Exercise-4-Ansichten haben keine interaktiven Filter.

**Zeigen und sagen:** „Hier sieht man mehr als eine Warnung in der Konsole: Links steht nach dem Umdrehen etwa Patch Vector neben einem Feld, in dem noch Signal Scholar steht. Der Index 0 bezeichnet jetzt einen anderen Menschen, React hält das Element an Position 0 aber für dasselbe. Rechts bleibt die ID von Patch Vector gleich, also bleibt sein Feld bei ihm.“

**Fragen:** Fehlende oder doppelte Keys verhindern eine verlässliche Zuordnung; Index-Keys sind bei Umordnung oder Filterung problematisch. Der frühere Vanilla-Bug benutzte einen Arrayindex als Kennung: Bei verschobenen Daten kann dadurch auch in React ein sichtbarer Fehler entstehen, nicht bloß eine Warnung. Ein Index kann okay sein, wenn die Liste wirklich statisch bleibt, nie umsortiert oder gefiltert wird und keine eigene lokale DOM- oder Komponenten-Zustände trägt. Unsere Daten haben IDs, also benutzen wir die IDs.

## Demo 5 Verantwortlichkeiten der Komponenten

**Aufgabe:** Komponenten als darstellend oder als Feature-/Container-Komponenten einordnen. Eine Komponente mit zu vielen Aufgaben in zwei klar getrennte Teile aufspalten.

**Im Projekt:** `App` lädt die gemeinsamen Daten und verbindet die Routen. `AppShell` enthält Header, Navigation, Hauptbereich und Footer; diese Trennung wurde aus dem zuvor überladenen `App` herausgezogen. `PeopleLocationsPage`, `TimelinePage` und `DashboardPage` sind Feature-Komponenten: Sie wählen Daten und zusammengesetzte Ansichten. `PersonCard`, `LocationCard`, `TimelineEventCard`, `Panel` und die Dashboard-Unterkomponenten sind vorwiegend darstellend: Sie zeigen die übergebenen Daten an.

**Zeigen und sagen:** „Vorher hatte `App` auch den ganzen Header und die Navigation direkt im selben File. Jetzt kümmert sich `App` um Daten und darum, welche Seite zur URL gehört. `AppShell` kümmert sich um den immer gleichen Rahmen. Ändere ich die Navigation, muss ich nicht die Datenlogik anfassen.“

**Fragen:** Eine Karte, die nur Props anzeigt, gehört in die Darstellung. Eine Seite, die Daten auswählt, filtert oder mehrere Karten zusammensetzt, ist eine Feature-Komponente. Die Grenze ist praktisch und keine starre React-Regel.

## Demo 6 Ordner nach Features

**Aufgabe:** React-Dateien nach Dashboard, People & Locations, Timeline und gemeinsam verwendeten Teilen ordnen; die Entscheidung dokumentieren.

**Im Projekt:** `react/dashboard/`, `react/people-locations/`, `react/timeline/`, `react/shell/`, `react/components/` und `react/demos/`. `Panel` liegt in `components`, weil es in mehreren Features benutzt wird. `PersonCard` bleibt bei `people-locations`, weil nur dieses Feature eine Personenkarte braucht. `App` verbindet die Teile.

**Zeigen und sagen:** „Bei einer Ordnerstruktur nach Dateityp wären alle Karten quer durch die App in einem großen Komponentenordner. Hier finde ich alles zur Timeline zusammen. Ein Bestandteil wandert erst in den gemeinsamen Ordner, wenn er tatsächlich in mehreren Features verwendet wird.“

## Demo 7 Wiederverwendbares UI Element

**Aufgabe:** Ein darstellendes Element mit typisierten Props an mindestens zwei verschiedenen Stellen wiederverwenden.

**Im Projekt:** `Panel` hat die Prop `children: ReactNode` und wird in `PeopleLocationsPage`, `TimelinePage` und `PersonDetailPage` verwendet. Es hält die gleichbleibende Umrandung und Innenabstände fest; der Inhalt variiert über `children`.

**Zeigen und sagen:** „Hier verwende ich dasselbe `Panel` für Personen und für Timeline. Der Rahmen bleibt gleich, die Karten darin sind verschieden. Früher hätte ich denselben HTML-Rahmen mehrfach als String kopiert. Bei einer Änderung am gemeinsamen Rahmen passe ich jetzt nur `Panel` an.“

## Demo 8 Echte Routen

**Aufgabe:** Eine Router-Bibliothek installieren. Dashboard, People & Locations und Timeline als echte Routen erreichbar machen; People und Locations müssen eigene speicherbare URLs sein.

**Im Projekt:** `react-router` ist als Abhängigkeit installiert. `HashRouter` steht in `react/main.tsx`, die Routen in `react/App.tsx`, Links in `AppShell` und `PeopleLocationsPage`. Beispiele: `react.html#/dashboard`, `react.html#/team/people`, `react.html#/team/locations`, `react.html#/timeline`. Evidence und Workspace sind bis Exercise 5 ehrliche Platzhalter. Unbekannte Routen führen wie in der alten App zum Dashboard.

**Zeigen und sagen:** „Ich kann die URL `react.html#/team/locations` kopieren, neu öffnen und lande direkt bei Locations. Ein bloßer lokaler Tab-Zustand wäre nach dem Kopieren des Links nicht wiederherstellbar. Das `#` ist hier Absicht: Die alte App bleibt unter `/`, und die React-Routen bleiben innerhalb von `react.html`. Für unbekannte Routen ist eine Weiterleitung zum Dashboard definiert.“

## Demo 9 Parameter in der Route

**Aufgabe:** Mindestens eine Route mit ID als Parameter, passende Darstellung und einen Link dorthin einbauen.

**Im Projekt:** `react.html#/team/people/:personId` ist die Route. Die Namen in `PersonCard` sind Links. `PersonDetailPage` liest die ID mit `useParams`, sucht die Person in den Daten und zeigt bei unbekannter ID eine „Person not found“-Seite.

**Zeigen und sagen:** „Wenn ich auf Nova Byte klicke, steht ihre ID in der URL. Der Teil `:personId` ist ein Platzhalter in der Routendefinition. Im Component kommt der konkrete Wert als String oder `undefined` an. Deshalb suche ich sicher in den Daten und zeige einen Hinweis, wenn es keine passende Person gibt.“

**Fragen:** `/team/people/nova-byte` bezeichnet die Ressource „diese Person“. `?person=nova-byte` ist eher eine Auswahl oder ein Filter auf einer bestehenden Seite. Deshalb ist die Personendetailseite ein Routenparameter; bei der Timeline wird dieselbe ID als Filter in einem Queryparameter verwendet.

## Demo 10 Queryparameter und Abschluss

**Aufgabe:** Die Timeline soll beim Öffnen einen Queryparameter lesen und damit die anfänglich gezeigte Liste bestimmen. Danach prüfen, dass Dashboard, People & Locations und Timeline ganz in React laufen und über Routen erreichbar sind.

**Im Projekt:** Der Link auf der Personendetailseite führt zum Beispiel zu `react.html#/timeline?person=nova-byte`. `TimelinePage` liest `person` mit `useSearchParams` und bildet daraus die anfänglich sichtbaren Ereignisse. Die Dropdowns sind wie verlangt sichtbar, lösen aber noch keine Filterung bei Änderung aus. In den drei migrierten Ansichten gibt es kein `innerHTML`, `document.createElement` oder `classList`.

**Zeigen und sagen:** „Wenn ich in Nova Bytes Detailseite den Timeline-Link anklicke, enthält die Adresse `?person=nova-byte`. Die Timeline zeigt beim Öffnen nur ihre Ereignisse. Dafür muss ich keinen neuen gespeicherten React-Zustand anlegen: Die ID steht bereits in der URL und die Liste wird daraus berechnet. Wenn die Dropdowns beim Ändern sofort filtern sollen, bräuchte ich später `onChange` und `useState` oder eine Aktualisierung der URL. Diese Interaktivität ist erst Thema von Exercise 5.“

**Frage zum Abschluss:** Ein Teil der Badge-Gestaltung ist noch direkt in den Dashboard- und Timeline-Komponenten; man könnte später eine gemeinsame Badge-Komponente daraus machen. Ich habe sie nicht vorschnell abstrahiert, weil die bisherige Wiederverwendung von `Panel` klar und ausreichend war. Beim Umzug von Evidence in Exercise 5 lässt sich besser erkennen, welche Badge-Varianten tatsächlich gemeinsam gebraucht werden.

## Was für Exercise 5 noch offen ist

Exercise 4 ist die Darstellung. Demo 1 von Exercise 5 verlangt schon, auch Evidence und Workspace als React-Ansichten zu bauen und mindestens drei echte Ereignis-Handler zu migrieren. Das ist keine kleine Theorie-Ergänzung. Demo 2 verlangt danach ein kontrolliertes Suchfeld und ein vollständig kontrolliertes Hypothesenformular samt Speichern in `localStorage`. Beides ist hier noch nicht als erledigt markiert. Für Demo 2 bauen wir die nötige Oberfläche gemeinsam und beginnen beim einfachsten Beispiel: Suchtext als React-Zustand.
