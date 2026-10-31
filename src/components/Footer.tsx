import React from 'react';
import { Github, Globe } from 'lucide-react';
import { getGitHubRepo } from '../utils/config';

interface FooterProps {
  onOpenSubmit: () => void;
  onOpenDocs: () => void;
  onOpenSettings: () => void;
}

export const Footer: React.FC<FooterProps> = ({
  onOpenSubmit,
  onOpenDocs,
  onOpenSettings,
}) => {
  const repo = getGitHubRepo();

  return (
    <footer className="mt-20 border-t border-white/60 bg-[#e6ecf4] py-12 text-xs text-slate-500 shadow-[0_-4px_16px_rgba(184,196,214,0.3)]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-1.5 max-w-md">
            <div className="text-base font-extrabold text-slate-800">
              OpenPWA <span className="text-sky-600 font-black">Hub</span>
            </div>
            <p className="text-slate-600 text-xs font-normal">
              A 100% static, open-source directory for high-quality Progressive Web Apps crafted with soft neumorphism.
              Engineered for GitHub Pages with zero tracking, cookies, or backend servers.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 text-slate-600 font-semibold">
            <button
              type="button"
              onClick={onOpenSubmit}
              className="neu-button px-3 py-1.5 rounded-xl hover:text-sky-700 transition-colors cursor-pointer"
            >
              + Submit PWA
            </button>
            <button
              type="button"
              onClick={onOpenDocs}
              className="neu-button px-3 py-1.5 rounded-xl hover:text-sky-700 transition-colors cursor-pointer"
            >
              Architecture
            </button>
            <button
              type="button"
              onClick={onOpenSettings}
              className="neu-button px-3 py-1.5 rounded-xl hover:text-sky-700 transition-colors cursor-pointer"
            >
              Repo Settings
            </button>
            <a
              href={`https://github.com/${repo.replace(/^https?:\/\/github\.com\//, '')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="neu-button flex items-center gap-1.5 px-3 py-1.5 rounded-xl hover:text-slate-900 transition-colors"
            >
              <Github className="h-3.5 w-3.5" />
              <span>GitHub</span>
            </a>
            <a
              href="https://web.dev/progressive-web-apps/"
              target="_blank"
              rel="noopener noreferrer"
              className="neu-button flex items-center gap-1.5 px-3 py-1.5 rounded-xl hover:text-slate-900 transition-colors"
            >
              <Globe className="h-3.5 w-3.5 text-sky-600" />
              <span>web.dev/pwa</span>
            </a>
          </div>
        </div>

        {/* Bottom line: Copyright & Synthek Design Link */}
        <div className="mt-8 pt-6 border-t border-slate-300/40 flex flex-col sm:flex-row items-center justify-between gap-4 text-slate-500 font-medium">
          <div>
            © {new Date().getFullYear()} OpenPWA Hub · MIT License · Soft Neumorphic Edition.
          </div>
          <div>
            <a
              href="https://hj-wuethrich.cv"
              target="_blank"
              rel="noopener noreferrer"
              className="neu-button px-3.5 py-1.5 rounded-xl inline-flex items-center gap-2 transition-all hover:scale-[1.02] active:scale-95 cursor-pointer"
              title="Visit hj-wuethrich.cv"
            >
              <span className="text-[11px] font-semibold text-slate-500">Design by</span>
              <img
                src="./site-assets/SynthekDesign.png"
                alt="Synthek Design"
                className="h-4.5 w-auto object-contain rounded"
                onError={(e) => {
                  (e.currentTarget as HTMLImageElement).src = './site-assets/SynthelDesign.png';
                }}
              />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};
