import React, { useState } from 'react';
import { ExternalLink, Wifi, Sparkles, Code2 } from 'lucide-react';
import { PWAEntry } from '../types/pwa';

interface AppCardProps {
  app: PWAEntry;
  onOpenDetails: (app: PWAEntry) => void;
  onTagClick?: (tag: string) => void;
}

export const AppCard: React.FC<AppCardProps> = ({ app, onOpenDetails, onTagClick }) => {
  const [imageError, setImageError] = useState(false);

  const isOffline = app.tags.some((t) => t.toLowerCase().includes('offline'));
  const isOpenSource =
    app.tags.some((t) => t.toLowerCase().includes('open source')) || Boolean(app.githubUrl);

  const getDomain = (url: string) => {
    try {
      return new URL(url).hostname.replace(/^www\./, '');
    } catch {
      return url;
    }
  };

  return (
    <article
      onClick={() => onOpenDetails(app)}
      className="group relative flex flex-col justify-between rounded-2xl neu-flat p-5 transition-all duration-200 hover:-translate-y-1 hover:shadow-[9px_9px_20px_#b8c4d6,-9px_-9px_20px_#ffffff] cursor-pointer"
    >
      <div>
        {/* Top bar in card: Icon + Title + Direct Launch Action */}
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-3.5 min-w-0">
            {/* App Icon with Neumorphic Inset Frame */}
            <div className="relative flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-xl neu-flat-sm p-1.5 transition-transform group-hover:scale-105">
              {!imageError ? (
                <img
                  src={app.iconUrl}
                  alt={`${app.name} Icon`}
                  className="h-full w-full object-contain rounded-lg"
                  loading="lazy"
                  referrerPolicy="no-referrer"
                  onError={() => setImageError(true)}
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center rounded-lg bg-sky-100 text-sky-700 font-extrabold text-lg">
                  {app.name.slice(0, 2).toUpperCase()}
                </div>
              )}
            </div>

            {/* Name + Clean Metadata */}
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-slate-900 group-hover:text-sky-700 transition-colors truncate">
                  {app.name}
                </h3>
                {app.featured && (
                  <span
                    className="inline-flex items-center text-amber-500 shrink-0"
                    title="Von der Redaktion empfohlen"
                  >
                    <Sparkles className="h-3.5 w-3.5 fill-amber-400 text-amber-500" />
                  </span>
                )}
              </div>

              {/* Clean unboxed metadata with typographic separators */}
              <div className="mt-0.5 flex items-center gap-1.5 text-xs text-slate-500 truncate font-medium">
                <span className="text-slate-700">{app.category}</span>
                <span aria-hidden="true" className="text-slate-400">·</span>
                <span className="truncate">{getDomain(app.url)}</span>
              </div>
            </div>
          </div>

          {/* Direct Launch Neumorphic Button */}
          <a
            href={app.url}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl neu-button text-slate-700 hover:text-sky-700 transition-all active:scale-95"
            title={`${app.name} direkt im Browser starten`}
          >
            <ExternalLink className="h-4 w-4" />
          </a>
        </div>

        {/* Short Description */}
        <p className="mt-3.5 line-clamp-2 text-xs leading-relaxed text-slate-600 font-normal">
          {app.description}
        </p>
      </div>

      {/* Card Footer: Badges / Tags & Action Kicker */}
      <div className="mt-5 flex flex-wrap items-center justify-between gap-2 border-t border-slate-300/40 pt-3.5">
        {/* Subtle Feature Indicators */}
        <div className="flex flex-wrap items-center gap-2 text-[11px] font-semibold text-slate-600">
          {isOffline && (
            <span className="inline-flex items-center gap-1 text-emerald-700">
              <Wifi className="h-3 w-3 stroke-[2.5]" />
              <span>Offline</span>
            </span>
          )}

          {isOpenSource && (
            <span className="inline-flex items-center gap-1 text-sky-700">
              <Code2 className="h-3 w-3 stroke-[2.5]" />
              <span>Open Source</span>
            </span>
          )}

          {app.license && (
            <span className="text-slate-400 font-mono text-[10px]">
              {app.license}
            </span>
          )}
        </div>

        {/* Details prompt */}
        <span className="text-[11px] font-bold text-sky-700 group-hover:text-sky-900 transition-colors">
          Details →
        </span>
      </div>
    </article>
  );
};
