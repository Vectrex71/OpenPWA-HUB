# 🚀 OpenPWA Hub — Das offene, statische PWA-Verzeichnis

Ein rein statisches, serverseitig kostenloses Verzeichnis für Progressive Web Apps (PWAs), optimiert für das Hosting auf **GitHub Pages**.

- 💸 **100% Hosting-Kostenfrei**: Keine Serverkosten, keine externe Datenbank (kein Supabase, kein Firebase).
- ⚡ **Blitzschnell**: Reine statische JSON-Dateien, clientseitige Filterung und Suche im Browser.
- 🎨 **Modernes App-Store-Design**: Inspiriert von Flathub und modernen App Stores mit Dark-Mode-Tailwind-Styling.
- 🛠️ **Automatisierte CI/CD-Pipeline**: GitHub Actions baut und validiert die Datenbank bei jedem Git-Push automatisch.
- 📬 **GitHub Issues Submission**: Benutzerfreundliches Web-Formular zur Einreichung neuer PWAs via GitHub Issue.
- 💬 **Giscus-Kommentare**: Diskussions- und Rezensionenspalte über GitHub Discussions ohne Drittanbieter-Tracker.

---

## 📁 Projekt- und Ordnerstruktur

```text
├── .github/
│   └── workflows/
│       └── deploy.yml        # GitHub Actions CI/CD Pipeline für GitHub Pages
├── apps/                     # Quell-Ordner für alle einzelnen PWA-Definitionen
│   ├── photopea.json
│   ├── excalidraw.json
│   ├── squoosh.json
│   ├── audiomass.json
│   └── ...                   # Jede App ist eine eigene, unabhängige JSON-Datei
├── public/
│   └── database.json         # Kompilierte Gesamtdatenbank (vom Build-Skript erzeugt)
├── scripts/
│   └── build-db.js           # Liest apps/*.json aus, validiert und erzeugt database.json
├── src/
│   ├── components/           # UI-Komponenten (Header, Hero, AppCard, Modal, etc.)
│   ├── types/pwa.ts          # TypeScript Typdefinitionen für PWA-Einträge
│   ├── utils/config.ts       # GitHub Repo Helper & Issue-URL-Generator
│   ├── App.tsx               # Hauptansicht mit Filterung, Suche & State
│   └── main.tsx
├── package.json
└── vite.config.ts
```

---

## 📄 Schema eines App-Eintrags (`apps/<id>.json`)

Jede App wird als eigenständige `.json`-Datei im Verzeichnis `/apps/` abgelegt (z. B. `apps/photopea.json`):

```json
{
  "id": "photopea",
  "name": "Photopea",
  "url": "https://www.photopea.com/",
  "description": "Leistungsfähiger, fortschrittlicher Bildeditor direkt im Webbrowser. Unterstützt PSD, AI, XD, RAW, Sketch und PDF.",
  "category": "Grafik & Design",
  "tags": [
    "Offline",
    "Bildbearbeitung",
    "PSD",
    "Vektor",
    "Design"
  ],
  "iconUrl": "https://www.photopea.com/promo/icon512.png",
  "screenshots": [
    "https://www.photopea.com/promo/screen0.png"
  ],
  "youtubeVideoId": "tP_g9_G-6f4",
  "featured": true,
  "author": "Ivan Kutskir",
  "license": "Freemium / Web"
}
```

### Pflichtfelder:
| Feld | Typ | Beschreibung |
| :--- | :--- | :--- |
| `id` | String | Eindeutiger Slug (z. B. `photopea`, Kleinbuchstaben & Bindestriche) |
| `name` | String | Name der Webanwendung |
| `url` | String | Vollständige HTTPS-URL zur Startseite der PWA |
| `description` | String | Aussagekräftige Beschreibung des Funktionsumfangs |
| `category` | String | Kategorie (z. B. Produktivität, Grafik & Design, Audio & Video) |
| `tags` | Array[String] | Schlagwörter wie `"Offline"`, `"Open Source"`, `"3D"`, `"Audio"` |
| `iconUrl` | String | Bild-URL zum App-Icon (mindestens 192x192 oder 512x512 PNG/SVG) |
| `screenshots`| Array[String] | Liste von Bild-URLs für die Screenshot-Galerie |

### Optionale Felder:
- `youtubeVideoId`: YouTube-ID (11 Zeichen) für eingebettete Video-Vorschau.
- `featured`: Boolean (`true`/`false`), hebt die App als Empfehlung hervor.
- `githubUrl`: Link zum Quellcode auf GitHub (aktiviert den GitHub-Button).
- `author`: Name des Entwicklers oder Teams.
- `license`: Lizenz (z. B. `MIT`, `GPL-3.0`, `Freemium`).

---

## 🛠️ Lokale Entwicklung

```bash
# 1. Abhängigkeiten installieren
npm install

# 2. Datenbank aus apps/*.json zusammenfügen & validieren
npm run build:db

# 3. Lokalen Entwicklungsserver starten
npm run dev
```

Der Entwicklungsserver startet unter `http://localhost:3000`.

---

## 🚀 Deployment auf GitHub Pages

Die mitgelieferte Datei `.github/workflows/deploy.yml` baut die Anwendung bei jedem Push auf den `main`-Branch und stellt sie automatisch auf GitHub Pages bereit.

### Einmalige GitHub-Aktivierung:
1. Navigiere in deinem GitHub-Repository zu **Settings** → **Pages**.
2. Wähle unter **Build and deployment** bei **Source** die Option:  
   👉 **GitHub Actions**.
3. Fertig! Sobald du einen Commit pushst oder einen Pull Request mergst, läuft die Action automatisch durch und die Seite ist live.

---

## 📬 Neue Apps einreichen (Submission Workflow)

1. **Über die Website:** Besucher klicken auf **„PWA vorschlagen“**, füllen das Formular aus und klicken auf **„Auf GitHub einreichen“**.
2. Es öffnet sich automatisch ein neues GitHub Issue in deinem Repository mit vorbefülltem Titel und fertigem JSON-Codeblock.
3. **Als Maintainer:**  
   - Kopiere den JSON-Codeblock in eine neue Datei `apps/<id>.json`.
   - Erstelle einen Commit oder merge den Pull Request in `main`.
   - GitHub Actions validiert die JSON-Syntax und aktualisiert `database.json` vollautomatisch!

---

## 💬 Giscus (GitHub Discussions Kommentare) einrichten

Giscus ermöglicht kostenlose, trackerfreie Kommentare via GitHub Discussions:
1. Stelle sicher, dass in deinem GitHub-Repository **Discussions** unter *Settings → General → Features* aktiviert ist.
2. Installiere die Giscus-App über [giscus.app](https://giscus.app).
3. Hinterlege dein Repository im Einstellungsmenü (Zahnrad-Symbol im Header von OpenPWA Hub).

---

## 📜 Lizenz
MIT License. Frei zur Nutzung für private und kommerzielle Open-Source-Projekte.
