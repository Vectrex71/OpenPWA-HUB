import React, { useState } from 'react';
import { ExternalLink, Wifi, Sparkles, Code2, Layers } from 'lucide-react';
import { PWAEntry } from '../types/pwa';
import { resolveAssetUrl } from '../utils/config';

interface AppCardProps {
  app: PWAEntry;
  onOpenDetails: (app: PWAEntry) => void;
  onTagClick?: (tag: string) => void;
}

export const AppCard: React.FC<AppCardProps> = ({ app, onOpenDetails, onTagClick }) => {
  const [iconError, setIconError] = useState(false);
  const [screenshotError, setScreenshotError] = useState(false);

  const isOffline = app.tags.some((t) => t.toLowerCase().includes('offline'));
  const isOpenSource =
    app.tags.some((t) => t.toLowerCase().includes('open source')) || Boolean(app.githubUrl);

  // Rule: If >1 screenshots, Screenshot 1 = Hero, Screenshot 2 = Info / Card preview
  const screenshot =
    app.screenshots && app.screenshots.length > 1
      ? resolveAssetUrl(app.screenshots[1])
      : app.screenshots && app.screenshots.length > 0
      ? resolveAssetUrl(app.screenshots[0])
      : null;
  const iconSrc = resolveAssetUrl(app.iconUrl);

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
      className="group relative flex flex-col justify-between rounded-2xl neu-flat p-4 transition-all duration-200 hover:-translate-y-1 hover:shadow-[9px_9px_22px_#b8c4d6,-9px_-9px_22px_#ffffff] cursor-pointer overflow-hidden"
    >
      <div>
        {/* Top Preview Frame: 16:9 Aspect Ratio with Inset Border */}
        <div className="relative aspect-[16/9] w-full overflow-hidden rounded-xl neu-inset bg-slate-200/50 mb-3.5">
          {screenshot && !screenshotError ? (
            <img
              src={screenshot}
              alt={`${app.name} preview`}
              className="h-full w-full object-cover object-top transition-transform duration-500 ease-out group-hover:scale-105"
              loading="lazy"
              referrerPolicy="no-referrer"
              onError={() => setScreenshotError(true)}
            />
          ) : (
            <div className="flex h-full w-full flex-col items-center justify-center bg-gradient-to-br from-slate-200/90 to-slate-300/40 text-slate-400">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl neu-flat-sm text-slate-600 mb-1">
                <Layers className="h-5 w-5" />
              </div>
              <span className="text-[11px] font-semibold text-slate-500">{app.category}</span>
            </div>
          )}

          {/* Featured Badge floating over top-left */}
          {app.featured && (
            <div className="absolute top-2.5 left-2.5 z-10 flex items-center gap-1 rounded-full bg-slate-900/80 backdrop-blur-md px-2.5 py-0.5 text-[10px] font-bold text-amber-300 shadow-sm border border-amber-400/30">
              <Sparkles className="h-3 w-3 fill-amber-300 text-amber-300" />
              <span>Featured</span>
            </div>
          )}

          {/* Subtle Hover Sheen */}
          <div className="absolute inset-0 bg-slate-900/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
        </div>

        {/* Content Section: Icon, Titles & Direct Launch Button */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            {/* App Icon */}
            <div className="relative flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-xl neu-flat-sm p-1.5 transition-transform group-hover:scale-105 bg-[#e6ecf4]">
              {!iconError ? (
                <img
                  src={iconSrc}
                  alt={`${app.name} Icon`}
                  className="h-full w-full object-contain rounded-lg"
                  loading="lazy"
                  referrerPolicy="no-referrer"
                  onError={() => setIconError(true)}
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center rounded-lg bg-sky-100 text-sky-700 font-extrabold text-base">
                  {app.name.slice(0, 2).toUpperCase()}
                </div>
              )}
            </div>

            {/* Name + Category & Domain */}
            <div className="min-w-0">
              <h3 className="text-base font-bold text-slate-900 group-hover:text-sky-700 transition-colors truncate">
                {app.name}
              </h3>
              <div className="mt-0.5 flex items-center gap-1.5 text-xs text-slate-500 truncate font-medium">
                <span className="text-slate-700">{app.category}</span>
                <span aria-hidden="true" className="text-slate-400">·</span>
                <span className="truncate">{getDomain(app.url)}</span>
              </div>
            </div>
          </div>

          {/* Direct Launch Button */}
          <a
            href={app.url}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg neu-button text-slate-700 hover:text-sky-700 transition-all active:scale-95"
            title={`Launch ${app.name} directly in browser`}
          >
            <ExternalLink className="h-3.5 w-3.5" />
          </a>
        </div>

        {/* Short Description */}
        <p className="mt-3 line-clamp-2 text-xs leading-relaxed text-slate-600 font-normal">
          {app.description}
        </p>
      </div>

      {/* Card Footer: Badges / Tags & Action Kicker */}
      <div className="mt-4 flex flex-wrap items-center justify-between gap-2 border-t border-slate-300/40 pt-3">
        {/* Indicators */}
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
        <span className="text-[11px] font-bold text-sky-700 group-hover:text-sky-900 group-hover:translate-x-0.5 transition-all inline-flex items-center gap-0.5">
          <span>Details</span>
          <span aria-hidden="true">→</span>
        </span>
      </div>
    </article>
  );
};
