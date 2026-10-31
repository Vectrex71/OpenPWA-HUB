import React, { useState, useEffect, useMemo } from 'react';
import {
  X,
  ExternalLink,
  Github,
  Wifi,
  Sparkles,
  Check,
  Play,
  MessageSquare,
  Smartphone,
  Monitor,
  HelpCircle,
  Copy,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { PWAEntry } from '../types/pwa';
import { getGitHubRepo, resolveAssetUrl, extractYouTubeId } from '../utils/config';

interface MediaItem {
  id: string;
  type: 'video' | 'screenshot';
  thumbnailUrl: string;
  screenshotIndex?: number;
  label: string;
}

interface AppDetailModalProps {
  app: PWAEntry | null;
  onClose: () => void;
  onSelectTag?: (tag: string) => void;
}

export const AppDetailModal: React.FC<AppDetailModalProps> = ({
  app,
  onClose,
  onSelectTag,
}) => {
  const [selectedMediaIndex, setSelectedMediaIndex] = useState(0);
  const [copiedLink, setCopiedLink] = useState(false);
  const [showInstallGuide, setShowInstallGuide] = useState(false);
  const [iconError, setIconError] = useState(false);

  const videoId = app ? extractYouTubeId(app.youtubeVideoId || app.youtubeUrl) : undefined;
  const hasVideo = Boolean(videoId);

  // Steam-style unified media strip: Video at index 0 (if available), followed by Screenshots 1..N
  const mediaList: MediaItem[] = useMemo(() => {
    if (!app) return [];
    const list: MediaItem[] = [];

    // Item 0: Video
    if (videoId) {
      list.push({
        id: `video-${videoId}`,
        type: 'video',
        thumbnailUrl: `https://img.youtube.com/vi/${videoId}/mqdefault.jpg`,
        label: 'Video Preview',
      });
    }

    // Subsequent items: Screenshots
    if (app.screenshots && app.screenshots.length > 0) {
      app.screenshots.forEach((src, idx) => {
        list.push({
          id: `screenshot-${idx}`,
          type: 'screenshot',
          thumbnailUrl: resolveAssetUrl(src),
          screenshotIndex: idx,
          label: `Screenshot ${idx + 1}`,
        });
      });
    }

    return list;
  }, [app, videoId]);

  useEffect(() => {
    if (!app) return;
    // Initial active media:
    // If video exists, start on video (index 0)
    // If no video, follow rule: if >1 screenshots, Screenshot 2 = Info (index 1)
    if (videoId) {
      setSelectedMediaIndex(0);
    } else if (app.screenshots && app.screenshots.length > 1) {
      setSelectedMediaIndex(1);
    } else {
      setSelectedMediaIndex(0);
    }
    setIconError(false);
  }, [app, videoId]);

  // Lock body scroll when modal is open
  useEffect(() => {
    if (app) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [app]);

  if (!app) return null;

  const repo = getGitHubRepo();
  const hasScreenshots = app.screenshots && app.screenshots.length > 0;
  const isOffline = app.tags.some((t) => t.toLowerCase().includes('offline'));

  const handleCopyLink = () => {
    navigator.clipboard.writeText(app.url);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 md:p-6 overflow-y-auto bg-slate-900/30 backdrop-blur-sm animate-in fade-in duration-200">
      {/* Backdrop */}
      <div className="fixed inset-0" onClick={onClose} />

      {/* Neumorphic Modal Dialog */}
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-app-name"
        className="relative z-10 w-full max-w-4xl max-h-[92vh] flex flex-col rounded-3xl neu-flat overflow-hidden"
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-slate-300/40 px-6 py-4 bg-[#e6ecf4]">
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-500">
            <span>PWA Details</span>
            <span aria-hidden="true" className="text-slate-400">·</span>
            <span className="text-sky-700">{app.category}</span>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-xl neu-button text-slate-600 hover:text-slate-900 transition-colors cursor-pointer"
            title="Close"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div className="overflow-y-auto p-6 space-y-7">
          {/* Main App Bar Lockup */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 pb-6 border-b border-slate-300/40">
            <div className="flex items-center gap-4">
              <div className="relative flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden rounded-2xl neu-flat-sm p-2">
                {!iconError ? (
                  <img
                    src={resolveAssetUrl(app.iconUrl)}
                    alt={app.name}
                    className="h-full w-full object-contain rounded-xl"
                    referrerPolicy="no-referrer"
                    onError={() => setIconError(true)}
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center rounded-xl bg-sky-100 font-extrabold text-2xl text-sky-800">
                    {app.name.slice(0, 2).toUpperCase()}
                  </div>
                )}
              </div>

              <div>
                <div className="flex items-center gap-2.5">
                  <h2 id="modal-app-name" className="text-2xl font-extrabold text-slate-900 tracking-tight">
                    {app.name}
                  </h2>
                  {app.featured && (
                    <span className="inline-flex items-center gap-1 rounded-lg neu-flat-sm px-2.5 py-0.5 text-xs font-bold text-amber-700">
                      <Sparkles className="h-3 w-3 fill-amber-400 text-amber-500" />
                      <span>Featured</span>
                    </span>
                  )}
                </div>

                <div className="mt-1 flex flex-wrap items-center gap-2 text-xs font-medium text-slate-600">
                  {app.author && <span>Created by {app.author}</span>}
                  {app.author && <span aria-hidden="true" className="text-slate-400">·</span>}
                  {app.license && <span>License: {app.license}</span>}
                  {isOffline && (
                    <>
                      <span aria-hidden="true" className="text-slate-400">·</span>
                      <span className="inline-flex items-center gap-1 text-emerald-700 font-semibold">
                        <Wifi className="h-3 w-3 stroke-[2.5]" /> Offline Ready
                      </span>
                    </>
                  )}
                </div>
              </div>
            </div>

            {/* Launch & Action Buttons */}
            <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
              <a
                href={app.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 rounded-xl neu-button-primary px-5 py-3 text-sm font-bold active:scale-95 transition-all"
              >
                <span>Launch in Browser</span>
                <ExternalLink className="h-4 w-4" />
              </a>

              <button
                type="button"
                onClick={handleCopyLink}
                className="flex h-11 w-11 items-center justify-center rounded-xl neu-button text-slate-700 hover:text-slate-900 transition-colors cursor-pointer"
                title="Copy PWA Link"
              >
                {copiedLink ? <Check className="h-4 w-4 text-emerald-600" /> : <Copy className="h-4 w-4" />}
              </button>

              {app.githubUrl && (
                <a
                  href={app.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex h-11 w-11 items-center justify-center rounded-xl neu-button text-slate-700 hover:text-slate-900 transition-colors"
                  title="View Source on GitHub"
                >
                  <Github className="h-4 w-4" />
                </a>
              )}
            </div>
          </div>

          {/* Steam-Style Unified Media Showcase: Video at item 0, Screenshots following, all in one row below */}
          {mediaList.length > 0 && (
            <div className="space-y-3">
              {/* Main Media Viewport */}
              {(() => {
                const activeItem = mediaList[selectedMediaIndex] || mediaList[0];
                const prevMedia = () => {
                  if (mediaList.length <= 1) return;
                  setSelectedMediaIndex((prev) => (prev === 0 ? mediaList.length - 1 : prev - 1));
                };
                const nextMedia = () => {
                  if (mediaList.length <= 1) return;
                  setSelectedMediaIndex((prev) => (prev === mediaList.length - 1 ? 0 : prev + 1));
                };

                return (
                  <>
                    <div className="relative aspect-video w-full overflow-hidden rounded-2xl neu-inset-deep bg-slate-950/25 flex items-center justify-center">
                      {activeItem.type === 'video' && videoId ? (
                        <iframe
                          key={`video-frame-${videoId}`}
                          src={`https://www.youtube-nocookie.com/embed/${videoId}?rel=0`}
                          title={`${app.name} Video Preview`}
                          className="absolute inset-0 h-full w-full"
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                          allowFullScreen
                        />
                      ) : activeItem.type === 'screenshot' && app.screenshots ? (
                        <img
                          key={`screenshot-view-${activeItem.screenshotIndex}`}
                          src={resolveAssetUrl(app.screenshots[activeItem.screenshotIndex ?? 0])}
                          alt={`${app.name} ${activeItem.label}`}
                          className="max-h-full max-w-full object-contain rounded-lg shadow-sm"
                          referrerPolicy="no-referrer"
                        />
                      ) : null}

                      {/* Previous / Next Overlay Controls */}
                      {mediaList.length > 1 && (
                        <div className="absolute inset-x-3 top-1/2 -translate-y-1/2 flex justify-between pointer-events-none z-10">
                          <button
                            type="button"
                            onClick={prevMedia}
                            className="pointer-events-auto flex h-9 w-9 items-center justify-center rounded-full bg-white/85 hover:bg-white text-slate-800 shadow-md backdrop-blur-md transition-all active:scale-90 cursor-pointer"
                            title="Previous Media"
                          >
                            <ChevronLeft className="h-5 w-5 stroke-[2.5]" />
                          </button>
                          <button
                            type="button"
                            onClick={nextMedia}
                            className="pointer-events-auto flex h-9 w-9 items-center justify-center rounded-full bg-white/85 hover:bg-white text-slate-800 shadow-md backdrop-blur-md transition-all active:scale-90 cursor-pointer"
                            title="Next Media"
                          >
                            <ChevronRight className="h-5 w-5 stroke-[2.5]" />
                          </button>
                        </div>
                      )}
                    </div>

                    {/* Unified Thumbnail Strip DIRECTLY UNDER the Viewport (Steam Style) */}
                    {mediaList.length > 1 && (
                      <div className="flex items-center gap-2.5 overflow-x-auto pb-1.5 pt-1 px-1 scrollbar-none">
                        {mediaList.map((item, idx) => {
                          const isSelected = selectedMediaIndex === idx;
                          return (
                            <button
                              key={item.id}
                              type="button"
                              onClick={() => setSelectedMediaIndex(idx)}
                              className={`group relative h-16 w-28 shrink-0 overflow-hidden rounded-xl transition-all cursor-pointer ${
                                isSelected
                                  ? 'ring-2 ring-sky-500 shadow-md neu-inset p-0.5 scale-[1.02] z-10'
                                  : 'neu-button opacity-75 hover:opacity-100 p-0.5 hover:scale-[1.01]'
                              }`}
                              title={item.label}
                            >
                              <div className="relative h-full w-full overflow-hidden rounded-lg bg-slate-900 flex items-center justify-center">
                                <img
                                  src={item.thumbnailUrl}
                                  alt={item.label}
                                  className="h-full w-full object-cover"
                                  referrerPolicy="no-referrer"
                                />

                                {/* Steam-style Play Icon Overlay for Video (Item 0) */}
                                {item.type === 'video' && (
                                  <div className="absolute inset-0 flex items-center justify-center bg-black/45 group-hover:bg-black/25 transition-colors">
                                    <div className="flex h-7 w-7 items-center justify-center rounded-full bg-sky-500 text-white shadow-md">
                                      <Play className="h-3.5 w-3.5 fill-white text-white ml-0.5" />
                                    </div>
                                    <span className="absolute bottom-1 right-1 rounded bg-black/85 px-1 py-0.5 text-[9px] font-bold text-sky-300 uppercase tracking-wider">
                                      Video
                                    </span>
                                  </div>
                                )}

                                {/* Subtle Index Indicator for Screenshots */}
                                {item.type === 'screenshot' && (
                                  <span className="absolute bottom-1 right-1 rounded bg-black/70 px-1 py-0.5 text-[9px] font-semibold text-slate-200">
                                    #{(item.screenshotIndex ?? 0) + 1}
                                  </span>
                                )}
                              </div>
                            </button>
                          );
                        })}
                      </div>
                    )}
                  </>
                );
              })()}
            </div>
          )}

          {/* Description Section */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Description
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-slate-700 font-normal whitespace-pre-line">
              {app.description}
            </p>
          </div>

          {/* Tags */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Tags &amp; Features
            </h3>
            <div className="mt-2.5 flex flex-wrap gap-2">
              {app.tags.map((tag) => (
                <button
                  key={tag}
                  type="button"
                  onClick={() => {
                    onSelectTag?.(tag);
                    onClose();
                  }}
                  className="rounded-xl neu-button px-3 py-1.5 text-xs font-semibold text-slate-700 hover:text-sky-700 transition-colors cursor-pointer"
                >
                  #{tag}
                </button>
              ))}
            </div>
          </div>

          {/* PWA Installation Guide Accordion */}
          <div className="rounded-2xl neu-flat-sm p-4">
            <button
              type="button"
              onClick={() => setShowInstallGuide(!showInstallGuide)}
              className="flex w-full items-center justify-between text-left text-xs font-bold text-slate-800 hover:text-sky-700 transition-colors cursor-pointer"
            >
              <div className="flex items-center gap-2">
                <HelpCircle className="h-4 w-4 text-sky-600" />
                <span>How do I install this PWA on my desktop or smartphone?</span>
              </div>
              <span className="text-slate-500 font-medium">{showInstallGuide ? 'Collapse' : 'Expand'}</span>
            </button>

            {showInstallGuide && (
              <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4 pt-3 border-t border-slate-300/40 text-xs text-slate-600">
                <div className="space-y-1.5 neu-inset p-3 rounded-xl">
                  <div className="flex items-center gap-1.5 font-bold text-slate-800">
                    <Monitor className="h-4 w-4 text-sky-600" />
                    <span>Chrome / Edge / Brave</span>
                  </div>
                  <p>
                    Click the install icon in the address bar or select <em>“Install App”</em> from the browser menu.
                  </p>
                </div>

                <div className="space-y-1.5 neu-inset p-3 rounded-xl">
                  <div className="flex items-center gap-1.5 font-bold text-slate-800">
                    <Smartphone className="h-4 w-4 text-sky-600" />
                    <span>iPhone &amp; iPad (Safari)</span>
                  </div>
                  <p>
                    Tap the Share button at the bottom of Safari and select <em>“Add to Home Screen”</em>.
                  </p>
                </div>

                <div className="space-y-1.5 neu-inset p-3 rounded-xl">
                  <div className="flex items-center gap-1.5 font-bold text-slate-800">
                    <Smartphone className="h-4 w-4 text-sky-600" />
                    <span>Android</span>
                  </div>
                  <p>
                    Tap the browser menu (three dots) and select <em>“Install app”</em> or <em>“Add to Home screen”</em>.
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Giscus GitHub Discussions Integration Box */}
          <div className="rounded-2xl neu-flat-sm p-5 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-sm font-bold text-slate-800">
                <MessageSquare className="h-4 w-4 text-sky-600" />
                <span>Community &amp; Feedback</span>
              </div>
              <span className="text-xs text-slate-500 font-mono font-medium">repo: {repo}</span>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed font-normal">
              Discussions and feedback are hosted serverlessly directly on <strong>GitHub Discussions</strong>.
              Zero tracking cookies or third-party databases.
            </p>

            <div
              id="giscus-discussion-container"
              className="mt-3 rounded-xl neu-inset p-4 text-center text-xs text-slate-600"
            >
              <div className="flex flex-col items-center justify-center gap-2 py-2">
                <Github className="h-6 w-6 text-slate-600" />
                <p className="text-slate-800 font-bold">
                  GitHub Discussions for {app.name}
                </p>
                <p className="max-w-md text-slate-600 font-normal">
                  Discussions are linked to your GitHub repository.
                </p>
                <a
                  href={`https://github.com/${repo.replace(/^https?:\/\/github\.com\//, '')}/discussions`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-1 inline-flex items-center gap-1.5 rounded-xl neu-button px-4 py-2 text-xs font-bold text-slate-800 hover:text-sky-700 transition-colors"
                >
                  <MessageSquare className="h-3.5 w-3.5" />
                  <span>Open Discussion on GitHub</span>
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="flex items-center justify-between border-t border-slate-300/40 px-6 py-4 bg-[#e6ecf4]">
          <div className="text-xs text-slate-500 font-mono font-medium">ID: {app.id}</div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl neu-button px-4 py-2 text-xs font-bold text-slate-700 hover:text-slate-900 transition-colors cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
