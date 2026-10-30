import React from 'react';
import { X, BookOpen, Layers, Terminal, Github, CheckCircle2 } from 'lucide-react';

interface DocsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const DocsModal: React.FC<DocsModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 md:p-6 overflow-y-auto bg-slate-900/30 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="fixed inset-0" onClick={onClose} />

      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="docs-modal-title"
        className="relative z-10 w-full max-w-3xl max-h-[90vh] flex flex-col rounded-3xl neu-flat overflow-hidden"
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-300/40 px-6 py-4 bg-[#e6ecf4]">
          <div className="flex items-center gap-2.5">
            <BookOpen className="h-5 w-5 text-sky-600" />
            <h2 id="docs-modal-title" className="text-base font-extrabold text-slate-900">
              Architektur &amp; Workflow Dokumentation
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="flex h-7 w-7 items-center justify-center rounded-xl neu-button text-slate-500 hover:text-slate-900 transition-colors cursor-pointer"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Scroll Content */}
        <div className="overflow-y-auto p-6 space-y-6 text-xs text-slate-700 leading-relaxed">
          {/* Section 1 */}
          <div className="rounded-2xl neu-flat-sm p-4 space-y-2">
            <div className="flex items-center gap-2 font-bold text-slate-900 text-sm">
              <Layers className="h-4 w-4 text-sky-600" />
              <span>1. Das statische Datenkonzept (Serverless &amp; Kostenlos)</span>
            </div>
            <p>
              Dieses PWA-Verzeichnis benötigt <strong>weder Server noch Datenbank</strong>.
              Alle App-Einträge liegen als eigenständige JSON-Dateien im Ordner <code className="text-sky-700 font-mono font-bold">/apps/&lt;app-id&gt;.json</code>.
            </p>
            <p>
              Beim Build führt das Skript <code className="text-sky-700 font-mono font-bold">scripts/build-db.js</code> alle Apps zusammen, validiert deren Pflichtfelder und erzeugt die kompakte, optimierte <code className="text-sky-700 font-mono font-bold">public/database.json</code>.
            </p>
          </div>

          {/* Section 2 */}
          <div className="rounded-2xl neu-flat-sm p-4 space-y-2">
            <div className="flex items-center gap-2 font-bold text-slate-900 text-sm">
              <Terminal className="h-4 w-4 text-sky-600" />
              <span>2. Lokale Entwicklung &amp; Skripte</span>
            </div>
            <div className="space-y-1.5 font-mono text-[11px] neu-inset-deep p-3.5 rounded-xl text-slate-800">
              <div><span className="text-slate-500"># Datenbank aus /apps/*.json generieren:</span></div>
              <div className="text-sky-700 font-bold">npm run build:db</div>
              <div className="pt-2"><span className="text-slate-500"># Lokalen Entwicklungsserver starten:</span></div>
              <div className="text-sky-700 font-bold">npm run dev</div>
              <div className="pt-2"><span className="text-slate-500"># Vollständigen Produktions-Build für GitHub Pages:</span></div>
              <div className="text-sky-700 font-bold">npm run build</div>
            </div>
          </div>

          {/* Section 3 */}
          <div className="rounded-2xl neu-flat-sm p-4 space-y-2">
            <div className="flex items-center gap-2 font-bold text-slate-900 text-sm">
              <Github className="h-4 w-4 text-sky-600" />
              <span>3. GitHub Actions CI/CD Pipeline</span>
            </div>
            <p>
              Die Datei <code className="text-sky-700 font-mono font-bold">.github/workflows/deploy.yml</code> sorgt für vollautomatische Bereitstellung:
            </p>
            <ul className="list-disc list-inside space-y-1 pl-1 text-slate-600">
              <li>Triggert bei jedem Push auf den <code className="text-slate-800 font-mono font-semibold">main</code>-Branch.</li>
              <li>Führt <code className="text-slate-800 font-mono font-semibold">npm run build</code> aus.</li>
              <li>Lädt das kompilierte Verzeichnis <code className="text-slate-800 font-mono font-semibold">dist/</code> auf <strong>GitHub Pages</strong> hoch.</li>
            </ul>
          </div>

          {/* Section 4 */}
          <div className="rounded-2xl neu-flat-sm p-4 space-y-2">
            <div className="flex items-center gap-2 font-bold text-slate-900 text-sm">
              <CheckCircle2 className="h-4 w-4 text-emerald-600" />
              <span>4. Neue PWA einreichen &amp; prüfen</span>
            </div>
            <p>
              Besucher nutzen das Formular <em>„PWA vorschlagen“</em>.
              Beim Klick auf <em>„Auf GitHub einreichen“</em> wird ein neues GitHub Issue geöffnet, in dem die JSON-Datei bereits fertig formatiert eingefügt ist.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end border-t border-slate-300/40 px-6 py-4 bg-[#e6ecf4]">
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl neu-button-primary px-4 py-2 text-xs font-bold cursor-pointer"
          >
            Verstanden
          </button>
        </div>
      </div>
    </div>
  );
};
