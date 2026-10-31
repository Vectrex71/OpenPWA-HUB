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
              Architecture &amp; Workflow Documentation
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
              <span>1. Static Architecture (100% Serverless &amp; Free)</span>
            </div>
            <p>
              This PWA directory requires <strong>neither a backend server nor a database</strong>.
              All app entries are maintained as individual JSON files in the <code className="text-sky-700 font-mono font-bold">/apps/&lt;app-id&gt;.json</code> directory.
            </p>
            <p>
              During build time, <code className="text-sky-700 font-mono font-bold">scripts/build-db.js</code> validates required fields, bundles all apps, and generates the optimized static file <code className="text-sky-700 font-mono font-bold">public/database.json</code>.
            </p>
          </div>

          {/* Section 2 */}
          <div className="rounded-2xl neu-flat-sm p-4 space-y-2">
            <div className="flex items-center gap-2 font-bold text-slate-900 text-sm">
              <Terminal className="h-4 w-4 text-sky-600" />
              <span>2. Local Development &amp; Scripts</span>
            </div>
            <div className="space-y-1.5 font-mono text-[11px] neu-inset-deep p-3.5 rounded-xl text-slate-800">
              <div><span className="text-slate-500"># Compile database from /apps/*.json:</span></div>
              <div className="text-sky-700 font-bold">npm run build:db</div>
              <div className="pt-2"><span className="text-slate-500"># Start local Vite development server:</span></div>
              <div className="text-sky-700 font-bold">npm run dev</div>
              <div className="pt-2"><span className="text-slate-500"># Production build for GitHub Pages:</span></div>
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
              The workflow at <code className="text-sky-700 font-mono font-bold">.github/workflows/deploy.yml</code> handles automatic deployments:
            </p>
            <ul className="list-disc list-inside space-y-1 pl-1 text-slate-600">
              <li>Triggers on push to the <code className="text-slate-800 font-mono font-semibold">main</code> branch or via manual dispatch.</li>
              <li>Executes <code className="text-slate-800 font-mono font-semibold">npm run build</code>.</li>
              <li>Deploys the static bundle <code className="text-slate-800 font-mono font-semibold">dist/</code> to <strong>GitHub Pages</strong>.</li>
            </ul>
          </div>

          {/* Section 4 */}
          <div className="rounded-2xl neu-flat-sm p-4 space-y-2">
            <div className="flex items-center gap-2 font-bold text-slate-900 text-sm">
              <CheckCircle2 className="h-4 w-4 text-emerald-600" />
              <span>4. Submitting &amp; Approving New PWAs</span>
            </div>
            <p>
              Visitors use the <em>“+ Submit PWA”</em> modal.
              Clicking <em>“Submit via GitHub Issue”</em> opens a pre-formatted GitHub Issue containing the validated JSON. Maintainers can simply copy it into <code className="text-sky-700 font-mono font-bold">apps/&lt;app-id&gt;.json</code> to merge!
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
            Got it
          </button>
        </div>
      </div>
    </div>
  );
};
