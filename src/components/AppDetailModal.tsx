import React, { useState, useEffect } from 'react';
import {
  X,
  ExternalLink,
  Github,
  Wifi,
  Sparkles,
  Check,
  Play,
  Image as ImageIcon,
  MessageSquare,
  Smartphone,
  Monitor,
  HelpCircle,
  Copy,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { PWAEntry } from '../types/pwa';
import { getGitHubRepo } from '../utils/config';

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
  const [selectedScreenshotIndex, setSelectedScreenshotIndex] = useState(0);
  const [copiedLink, setCopiedLink] = useState(false);
  const [showInstallGuide, setShowInstallGuide] = useState(false);
  const [activeMediaTab, setActiveMediaTab] = useState<'screenshots' | 'video'>('screenshots');
  const [iconError, setIconError] = useState(false);

  useEffect(() => {
    setSelectedScreenshotIndex(0);
    setIconError(false);
    if (app?.youtubeVideoId) {
      setActiveMediaTab('video');
    } else {
      setActiveMediaTab('screenshots');
    }
  }, [app]);

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
  const hasVideo = Boolean(app.youtubeVideoId);
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
            <span>PWA Detailansicht</span>
            <span aria-hidden="true" className="text-slate-400">·</span>
            <span className="text-sky-700">{app.category}</span>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-xl neu-button text-slate-600 hover:text-slate-900 transition-colors cursor-pointer"
            title="Schließen"
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
                    src={app.iconUrl}
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
                      <span>Empfohlen</span>
                    </span>
                  )}
                </div>

                <div className="mt-1 flex flex-wrap items-center gap-2 text-xs font-medium text-slate-600">
                  {app.author && <span>Entwickelt von {app.author}</span>}
                  {app.author && <span aria-hidden="true" className="text-slate-400">·</span>}
                  {app.license && <span>Lizenz: {app.license}</span>}
                  {isOffline && (
                    <>
                      <span aria-hidden="true" className="text-slate-400">·</span>
                      <span className="inline-flex items-center gap-1 text-emerald-700 font-semibold">
                        <Wifi className="h-3 w-3 stroke-[2.5]" /> Offline nutzbar
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
                <span>App im Browser öffnen</span>
                <ExternalLink className="h-4 w-4" />
              </a>

              <button
                type="button"
                onClick={handleCopyLink}
                className="flex h-11 w-11 items-center justify-center rounded-xl neu-button text-slate-700 hover:text-slate-900 transition-colors cursor-pointer"
                title="PWA-Link kopieren"
              >
                {copiedLink ? <Check className="h-4 w-4 text-emerald-600" /> : <Copy className="h-4 w-4" />}
              </button>

              {app.githubUrl && (
                <a
                  href={app.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex h-11 w-11 items-center justify-center rounded-xl neu-button text-slate-700 hover:text-slate-900 transition-colors"
                  title="Source Code auf GitHub ansehen"
                >
                  <Github className="h-4 w-4" />
                </a>
              )}
            </div>
          </div>

          {/* Media Showcase: Screenshots / Video */}
          {(hasScreenshots || hasVideo) && (
            <div className="space-y-3">
              {/* Media Switcher Tabs if both present */}
              {hasScreenshots && hasVideo && (
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setActiveMediaTab('video')}
                    className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                      activeMediaTab === 'video'
                        ? 'neu-inset text-sky-700'
                        : 'neu-button text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    <Play className="h-3.5 w-3.5" /> Video-Vorschau
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveMediaTab('screenshots')}
                    className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                      activeMediaTab === 'screenshots'
                        ? 'neu-inset text-sky-700'
                        : 'neu-button text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    <ImageIcon className="h-3.5 w-3.5" /> Screenshots ({app.screenshots.length})
                  </button>
                </div>
              )}

              {/* Video Player */}
              {activeMediaTab === 'video' && hasVideo && (
                <div className="relative aspect-video w-full overflow-hidden rounded-2xl neu-inset-deep">
                  <iframe
                    src={`https://www.youtube-nocookie.com/embed/${app.youtubeVideoId}?rel=0`}
                    title={`${app.name} Video`}
                    className="absolute inset-0 h-full w-full"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                </div>
              )}

              {/* Screenshot Showcase */}
              {activeMediaTab === 'screenshots' && hasScreenshots && (
                <div className="space-y-3">
                  <div className="relative aspect-video w-full overflow-hidden rounded-2xl neu-inset-deep flex items-center justify-center p-2">
                    <img
                      src={app.screenshots[selectedScreenshotIndex]}
                      alt={`${app.name} Screenshot`}
                      className="max-h-full max-w-full object-contain rounded-lg shadow-sm"
                      referrerPolicy="no-referrer"
                    />

                    {/* Left/Right controls if multiple screenshots */}
                    {app.screenshots.length > 1 && (
                      <div className="absolute inset-x-3 top-1/2 -translate-y-1/2 flex justify-between pointer-events-none">
                        <button
                          type="button"
                          onClick={() =>
                            setSelectedScreenshotIndex((prev) =>
                              prev === 0 ? app.screenshots.length - 1 : prev - 1
                            )
                          }
                          className="pointer-events-auto flex h-9 w-9 items-center justify-center rounded-full neu-button text-slate-700 hover:text-slate-900 transition-transform active:scale-90"
                          title="Vorheriger Screenshot"
                        >
                          <ChevronLeft className="h-5 w-5" />
                        </button>
                        <button
                          type="button"
                          onClick={() =>
                            setSelectedScreenshotIndex((prev) =>
                              prev === app.screenshots.length - 1 ? 0 : prev + 1
                            )
                          }
                          className="pointer-events-auto flex h-9 w-9 items-center justify-center rounded-full neu-button text-slate-700 hover:text-slate-900 transition-transform active:scale-90"
                          title="Nächster Screenshot"
                        >
                          <ChevronRight className="h-5 w-5" />
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Thumbnail Row */}
                  {app.screenshots.length > 1 && (
                    <div className="flex items-center gap-2.5 overflow-x-auto pb-2 pt-1 px-1">
                      {app.screenshots.map((imgUrl, idx) => (
                        <button
                          key={imgUrl}
                          type="button"
                          onClick={() => setSelectedScreenshotIndex(idx)}
                          className={`relative h-14 w-24 shrink-0 overflow-hidden rounded-xl transition-all cursor-pointer ${
                            selectedScreenshotIndex === idx
                              ? 'neu-inset p-1 ring-2 ring-sky-500/40'
                              : 'neu-button opacity-70 hover:opacity-100 p-0.5'
                          }`}
                        >
                          <img
                            src={imgUrl}
                            alt=""
                            className="h-full w-full object-cover rounded-lg"
                            referrerPolicy="no-referrer"
                          />
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* Description Section */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Beschreibung
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-slate-700 font-normal whitespace-pre-line">
              {app.description}
            </p>
          </div>

          {/* Tags */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Tags & Eigenschaften
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
                <span>Wie installiere ich diese PWA auf meinem Desktop oder Smartphone?</span>
              </div>
              <span className="text-slate-500 font-medium">{showInstallGuide ? 'Einklappen' : 'Anzeigen'}</span>
            </button>

            {showInstallGuide && (
              <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4 pt-3 border-t border-slate-300/40 text-xs text-slate-600">
                <div className="space-y-1.5 neu-inset p-3 rounded-xl">
                  <div className="flex items-center gap-1.5 font-bold text-slate-800">
                    <Monitor className="h-4 w-4 text-sky-600" />
                    <span>Chrome / Edge / Brave</span>
                  </div>
                  <p>
                    Klicke in der Adressleiste auf das Installieren-Symbol oder im Menü auf <em>„App installieren“</em>.
                  </p>
                </div>

                <div className="space-y-1.5 neu-inset p-3 rounded-xl">
                  <div className="flex items-center gap-1.5 font-bold text-slate-800">
                    <Smartphone className="h-4 w-4 text-sky-600" />
                    <span>iPhone & iPad (Safari)</span>
                  </div>
                  <p>
                    Tippe unten in Safari auf Teilen und wähle <em>„Zum Home-Bildschirm“</em>.
                  </p>
                </div>

                <div className="space-y-1.5 neu-inset p-3 rounded-xl">
                  <div className="flex items-center gap-1.5 font-bold text-slate-800">
                    <Smartphone className="h-4 w-4 text-sky-600" />
                    <span>Android</span>
                  </div>
                  <p>
                    Tippe auf das Menü (drei Punkte) und wähle <em>„App installieren“</em>.
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
                <span>Community & Feedback (Giscus)</span>
              </div>
              <span className="text-xs text-slate-500 font-mono font-medium">repo: {repo}</span>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed font-normal">
              Kommentare werden serverseitig kostenlos direkt über <strong>GitHub Discussions</strong> gespeichert.
              Keine Tracking-Cookies oder fremde Server.
            </p>

            <div
              id="giscus-discussion-container"
              className="mt-3 rounded-xl neu-inset p-4 text-center text-xs text-slate-600"
            >
              <div className="flex flex-col items-center justify-center gap-2 py-2">
                <Github className="h-6 w-6 text-slate-600" />
                <p className="text-slate-800 font-bold">
                  GitHub Discussions für {app.name}
                </p>
                <p className="max-w-md text-slate-600 font-normal">
                  Kommentare sind vorkonfiguriert für dein GitHub-Repository.
                </p>
                <a
                  href={`https://github.com/${repo.replace(/^https?:\/\/github\.com\//, '')}/discussions`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-1 inline-flex items-center gap-1.5 rounded-xl neu-button px-4 py-2 text-xs font-bold text-slate-800 hover:text-sky-700 transition-colors"
                >
                  <MessageSquare className="h-3.5 w-3.5" />
                  <span>Diskussion auf GitHub öffnen</span>
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
            Schließen
          </button>
        </div>
      </div>
    </div>
  );
};
