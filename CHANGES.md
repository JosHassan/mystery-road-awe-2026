# Exercise 1 – Änderungen

Hier steht kurz, was im Code geändert wurde und warum. Die praktischen Vorführungen und Theoriefragen sind damit nicht automatisch erledigt.

## Task 1 – Module

Die große `app.js` wurde in Dateien im Ordner `js` aufgeteilt:

- `main.js` startet die App und verbindet die Event Listener.
- `state.js` enthält die gemeinsam verwendeten Daten.
- `data.js` lädt die JSON-Dateien, `storage.js` verwaltet den lokalen Speicher.
- `router.js` übernimmt die Navigation, `utils.js` enthält Hilfsfunktionen.
- Dashboard, Evidence, People, Timeline und Workspace haben jeweils eine eigene Datei.

`index.html` lädt jetzt `js/main.js` mit `type="module"`. Benötigte Funktionen und Daten werden importiert. Der gemeinsame `state` bleibt dabei veränderbar.

## Task 2 – Fehler beim Sortieren

Vorher zeigte `filteredEvidence = allEvidence` auf dasselbe Array. Durch `sort()` wurde deshalb auch die ursprüngliche Reihenfolge verändert. Das konnte die Anzeige im Dashboard beeinflussen.

In `main.js` wird jetzt mit `[...state.allEvidence]` eine Kopie erstellt. In `evidence.js` sortiert `sortEvidence()` ebenfalls eine Kopie: `[...items].sort(...)`. Die Objekte darin bleiben dieselben, aber die Reihenfolge der beiden Arrays ist unabhängig.

Prüfweg: Dashboard-Reihenfolge merken, Evidence nach Titel sortieren und zum Dashboard zurückkehren. Dort soll die Reihenfolge gleich bleiben.

## Task 3 – Evidence bleibt beim Laden hängen

Die Daten waren geladen, aber `evidenceViewLoading` blieb auf `true`. Deshalb erschienen keine Karten. `loadEvidence()` setzt den Wert jetzt nach Erfolg und im Fehlerfall auf `false`.

Zusätzlich wartet die Notizvorschau mit `await` auf `loadNoteAsync()`. Dadurch wird der Notiztext statt des Promise-Objekts ausgegeben.

Prüfweg: Seite neu laden und Evidence öffnen. Nach erfolgreichem Laden sollen die Karten erscheinen.

## Task 4 – Konsolenfehler bei der Navigation

Die alten Klick-Listener verwendeten den Schleifenindex `var i`. Beim späteren Klick war die Schleife fertig und `navButtons[i]` war `undefined`. Die Ansicht wechselte trotzdem, weil zusätzlich ein `onclick` im HTML vorhanden war.

Jetzt wird das Ziel über `event.currentTarget.dataset` gelesen. Die Inline-Handler wurden entfernt.

Prüfweg: Konsole öffnen und alle Navigationsbuttons anklicken. Der bisherige `TypeError` soll nicht mehr auftreten.

## Task 5 – Weitere Korrekturen

- **Timeline:** Statt eines ganzen Ortsobjekts werden ID und Name ausgegeben. Dadurch steht dort nicht mehr `[object Object]`.
- **Quick View:** Modal und Klick-Listener werden nur einmal angelegt, statt bei jedem Öffnen weitere Listener hinzuzufügen.
- **Lokaler Speicher:** Ungültiges JSON wird beim Einlesen abgefangen. Die App verwendet dann einen Ersatzwert und gibt eine Warnung aus.
- **Notizen:** Die Vorschau verwendet `textContent`, damit eingegebener Text nicht als HTML interpretiert wird.
- **HTTP-Fehler:** `response.ok` wird geprüft, weil `fetch()` bei einem Status wie 404 nicht automatisch abbricht.
- **Workspace:** Ist er beim Laden geöffnet, wird er nach dem Eintreffen der Evidence-Daten nochmals angezeigt. Gespeicherte Bookmarks können dadurch den geladenen Daten zugeordnet werden.
- **Dashboard-Zähler:** Beim Zurückwechseln wurde die alte Anzeige wiederverwendet. Das Dashboard wird jetzt bei jedem Besuch neu gerendert. Bookmark setzen und entfernen aktualisiert den Zähler wieder.
- **Hypothesen-Auswahl:** Beim erneuten Aufbau der Beleg-Auswahlliste gingen ausgewählte Einträge verloren. Die Auswahl wird jetzt vor dem Aufbau gemerkt und danach wieder gesetzt. Nach einem Reload bleiben die gespeicherten Belege ausgewählt.

Prüfweg: Alle Ansichten benutzen, filtern und suchen, Quick View mehrfach öffnen sowie Bookmarks, Notizen und Hypothese speichern. Danach neu laden und gespeicherte Inhalte sowie die Konsole kontrollieren.

## Tasks 6 und 7 – Debugger und DevTools

Diese Tasks sind praktische Vorführungen, keine zusätzlichen Code-Fixes. Dazu gehören Breakpoints, Einzelschritte, Call Stack, Watch und das Ändern eines Werts während einer Pause. Außerdem werden Console, Network, Application und Elements verwendet.

## Task 8 – Code aufräumen

`var` wurde durch `const` oder `let` ersetzt: `const`, wenn keine Neuzuweisung nötig ist, sonst `let`. Weitere Änderungen sind die Modulaufteilung, entfernte Inline-Handler und einmalig registrierte Listener.

## Task 9 – async/await

Die verschachtelten `.then()`-Aufrufe wurden durch `async`/`await` ersetzt. Case, People und Locations werden weiterhin nacheinander geladen. Es wurde keine parallele Datenladung eingeführt. Fehler werden in den aufrufenden Ladefunktionen behandelt.

## Task 10 – Arrow Functions

Unter anderem wurden Array-Callbacks und Event Listener in Arrow Functions umgeschrieben. Die Navigation verwendet `event.currentTarget` und braucht daher kein eigenes `this` im Callback.

## Prüfstand

Die JavaScript-Dateien haben die Syntaxprüfung bestanden. Im Browser wurden folgende Fälle geprüft:

- Daten laden: 18 Evidence-Einträge, 6 Personen und 6 Orte werden angezeigt.
- A–Z/Z–A sortieren, Suche ohne Treffer und Typfilter `test-report` (zwei Treffer).
- Dashboard-Reihenfolge bleibt beim Sortieren gleich; Bookmark-Zähler folgt beim Setzen und Entfernen mit 1 bzw. 0.
- Notiz mit `<b>Testnotiz</b>` wird als Text angezeigt und bleibt nach einem Reload erhalten.
- Timeline zeigt Ortsnamen; Quick View lässt sich mehrfach öffnen und schließen. Der Wechsel zum vollständigen Beleg funktioniert.
- Hypothesen-Text und ausgewählte Belege E01/E14 bleiben nach dem Fix beim Reload erhalten.

In diesen Abläufen wurden keine Konsolenfehler erfasst. Zusätzlich bestanden sieben lokale Regressionstests, unter anderem für ungültiges Speicher-JSON, HTTP 404 und die Ladefolge. Nicht alle Filterkombinationen, Bildschirmgrößen und Netzwerkverzögerungen wurden vollständig geprüft. Die persönliche Debugger-/DevTools-Vorführung und Theoriefragen sind dadurch nicht erledigt.

Der ursprüngliche Code liegt im Git-Commit `22cb2d8673e25ecf786e970efe5592af87cc3a0a`. Mit `git show 22cb2d8:app.js` lässt er sich ansehen, ohne die Lösung zu überschreiben. Ein separater Zwischen-Commit nur für die Modulaufteilung ohne Fehlerkorrekturen liegt nicht vor.
