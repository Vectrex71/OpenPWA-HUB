import React, { useState } from 'react';
import { X, Github, Check } from 'lucide-react';
import { getGitHubRepo, setGitHubRepo } from '../utils/config';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({ isOpen, onClose }) => {
  const current = getGitHubRepo();
  const [repoInput, setRepoInput] = useState(current);
  const [saved, setSaved] = useState(false);

  if (!isOpen) return null;

  const handleSave = () => {
    let clean = repoInput.trim();
    if (clean.startsWith('https://github.com/')) {
      clean = clean.replace('https://github.com/', '');
    }
    setGitHubRepo(clean || 'OpenPWA/directory');
    setSaved(true);
    setTimeout(() => {
      setSaved(false);
      onClose();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/30 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="fixed inset-0" onClick={onClose} />

      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="settings-modal-title"
        className="relative z-10 w-full max-w-lg rounded-3xl neu-flat p-6 space-y-5"
      >
        <div className="flex items-center justify-between border-b border-slate-300/40 pb-4">
          <div className="flex items-center gap-2.5">
            <Github className="h-5 w-5 text-sky-600" />
            <h2 id="settings-modal-title" className="text-base font-extrabold text-slate-900">
              GitHub Repository konfigurieren
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

        <div className="space-y-3.5 text-xs text-slate-600">
          <p className="font-normal leading-relaxed">
            Gib das GitHub-Repository an, an welches neue PWA-Einreichungen via Issues gesendet und für welches Kommentare vorbereitet werden sollen.
          </p>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              Repository (Format: <code className="text-sky-700">Benutzername/Repository</code>)
            </label>
            <input
              type="text"
              value={repoInput}
              onChange={(e) => setRepoInput(e.target.value)}
              placeholder="z. B. deingit/pwa-store"
              className="w-full rounded-xl neu-inset px-4 py-2.5 text-sm font-mono text-slate-800 placeholder:text-slate-400 focus:outline-none"
            />
          </div>

          <div className="rounded-2xl neu-inset p-3.5 text-[11px] text-slate-600 space-y-1.5">
            <div className="font-bold text-slate-800">Auswirkung:</div>
            <div>• „Auf GitHub einreichen“-Button öffnet: <span className="font-mono text-sky-700 font-semibold break-all">github.com/{repoInput || 'user/repo'}/issues/new</span></div>
            <div>• GitHub-Link in der Navigation verweist auf dein Repository.</div>
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-300/40">
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl neu-button px-4 py-2 text-xs font-bold text-slate-600 hover:text-slate-900 transition-colors cursor-pointer"
          >
            Abbrechen
          </button>
          <button
            type="button"
            onClick={handleSave}
            className="flex items-center gap-1.5 rounded-xl neu-button-primary px-4 py-2 text-xs font-bold cursor-pointer"
          >
            {saved ? <Check className="h-4 w-4" /> : null}
            <span>{saved ? 'Gespeichert!' : 'Speichern'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
