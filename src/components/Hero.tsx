import React, { useState, useEffect, useCallback, useMemo } from 'react';
import {
  ExternalLink,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  Wifi,
  Code2,
  Info,
} from 'lucide-react';
import { PWAEntry } from '../types/pwa';
import { resolveAssetUrl } from '../utils/config';

interface HeroProps {
  apps: PWAEntry[];
  onOpenDetails: (app: PWAEntry) => void;
}

export const Hero: React.FC<HeroProps> = ({ apps, onOpenDetails }) => {
  // Select apps with screenshots, prioritizing featured ones
  const spotlightApps = useMemo(() => {
    const withScreenshots = apps.filter(
      (a) => a.screenshots && a.screenshots.length > 0
    );
    if (withScreenshots.length > 0) {
      return withScreenshots.slice(0, 7);
    }
    return apps.slice(0, 5);
  }, [apps]);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [imageError, setImageError] = useState<Record<string, boolean>>({});
  const [iconErrors, setIconErrors] = useState<Record<string, boolean>>({});

  const count = spotlightApps.length;

  const nextSlide = useCallback(() => {
    if (count > 0) {
      setCurrentIndex((prev) => (prev + 1) % count);
    }
  }, [count]);

  const prevSlide = useCallback(() => {
    if (count > 0) {
      setCurrentIndex((prev) => (prev === 0 ? count - 1 : prev - 1));
    }
  }, [count]);

  // Auto-advance timer (6.5s) for smooth cinematic showcase pacing; pauses on hover
  useEffect(() => {
    if (count <= 1 || isPaused) return;
    const interval = setInterval(() => {
      nextSlide();
    }, 6500);
    return () => clearInterval(interval);
  }, [count, isPaused, nextSlide]);

  if (count === 0) {
    return null;
  }

  const currentApp = spotlightApps[currentIndex];
  const isOffline = currentApp?.tags?.some((t) => t.toLowerCase().includes('offline'));
  const isOpenSource =
    currentApp?.tags?.some((t) => t.toLowerCase().includes('open source')) ||
    Boolean(currentApp?.githubUrl);

  return (
    <section className="relative pt-2 sm:pt-4 pb-2">
      <div className="mx-auto max-w-7xl px-3 sm:px-6 lg:px-8">
        {/* Rotating Showcase Carousel Card */}
        <div
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
          className="group relative overflow-hidden rounded-3xl neu-flat transition-all duration-300"
        >
          {/* Main Visual Frame: Responsive height on mobile prevents crowding */}
          <div className="relative h-[390px] sm:h-auto sm:aspect-[21/9] w-full neu-inset-deep overflow-hidden">
            {/* Stack of spotlight slides with smooth 1000ms cross-dissolve & butter-smooth Ken Burns */}
            {spotlightApps.map((app, idx) => {
              const isActive = idx === currentIndex;
              // Rule: Screenshot 1 (index 0) = Hero
              const rawScreenshot = app.screenshots?.[0];
              const screenshotUrl = rawScreenshot ? resolveAssetUrl(rawScreenshot) : undefined;
              const kenBurnsClass = idx % 2 === 0 ? 'kenburns-smooth-1' : 'kenburns-smooth-2';

              return (
                <div
                  key={app.id}
                  className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
                    isActive ? 'opacity-100 z-0' : 'opacity-0 pointer-events-none -z-10'
                  }`}
                  aria-hidden={!isActive}
                >
                  {screenshotUrl && !imageError[screenshotUrl] ? (
                    <img
                      src={screenshotUrl}
                      alt={`${app.name} Showcase Screenshot`}
                      className={`h-full w-full object-cover object-center ${
                        isActive ? kenBurnsClass : ''
                      }`}
                      referrerPolicy="no-referrer"
                      onError={() =>
                        setImageError((prev) => ({ ...prev, [screenshotUrl]: true }))
                      }
                    />
                  ) : (
                    <div className="h-full w-full bg-gradient-to-tr from-slate-900 via-slate-800 to-slate-950 flex items-center justify-center">
                      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-sky-900/10 via-slate-900/40 to-slate-950" />
                    </div>
                  )}
                </div>
              );
            })}

            {/* Ambient Gradient Scrim: Deep, high-contrast protection against bright backgrounds */}
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/85 to-slate-950/50 sm:bg-gradient-to-r sm:from-slate-950/95 sm:via-slate-950/70 sm:to-transparent pointer-events-none z-10" />

            {/* Mobile Controls: Sleek top-right buttons that NEVER block or overlap text */}
            <div className="sm:hidden absolute top-3.5 right-3.5 z-30 flex items-center gap-1.5">
              <span className="text-[10px] font-bold text-slate-300 bg-slate-900/80 px-2 py-1 rounded-lg backdrop-blur-md border border-white/10">
                {currentIndex + 1}/{count}
              </span>
              <button
                type="button"
                onClick={prevSlide}
                className="flex h-8 w-8 items-center justify-center rounded-xl bg-slate-900/80 hover:bg-slate-900 text-white shadow-md backdrop-blur-md border border-white/15 active:scale-90 cursor-pointer"
                title="Previous PWA"
              >
                <ChevronLeft className="h-4 w-4 stroke-[2.5]" />
              </button>
              <button
                type="button"
                onClick={nextSlide}
                className="flex h-8 w-8 items-center justify-center rounded-xl bg-slate-900/80 hover:bg-slate-900 text-white shadow-md backdrop-blur-md border border-white/15 active:scale-90 cursor-pointer"
                title="Next PWA"
              >
                <ChevronRight className="h-4 w-4 stroke-[2.5]" />
              </button>
            </div>

            {/* Desktop Controls: Side Arrows */}
            <div className="hidden sm:flex absolute inset-y-0 left-3 right-3 items-center justify-between pointer-events-none z-20">
              <button
                type="button"
                onClick={prevSlide}
                className="pointer-events-auto flex h-10 w-10 items-center justify-center rounded-2xl bg-white/80 hover:bg-white text-slate-800 shadow-md backdrop-blur-md transition-all active:scale-90 cursor-pointer"
                title="Previous PWA"
              >
                <ChevronLeft className="h-5 w-5 stroke-[2.5]" />
              </button>
              <button
                type="button"
                onClick={nextSlide}
                className="pointer-events-auto flex h-10 w-10 items-center justify-center rounded-2xl bg-white/80 hover:bg-white text-slate-800 shadow-md backdrop-blur-md transition-all active:scale-90 cursor-pointer"
                title="Next PWA"
              >
                <ChevronRight className="h-5 w-5 stroke-[2.5]" />
              </button>
            </div>

            {/* Floating Info Overlay inside the Frame */}
            <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-8 max-w-2xl text-white z-20">
              <div className="flex items-start sm:items-center gap-3 mb-2.5">
                {/* App Icon */}
                <div className="h-11 w-11 sm:h-14 sm:w-14 rounded-2xl bg-white/95 p-1.5 shadow-lg shrink-0 flex items-center justify-center overflow-hidden">
                  {!iconErrors[currentApp.id] && currentApp.iconUrl ? (
                    <img
                      key={currentApp.id}
                      src={resolveAssetUrl(currentApp.iconUrl)}
                      alt={`${currentApp.name} Icon`}
                      className="h-full w-full object-contain rounded-xl"
                      referrerPolicy="no-referrer"
                      onError={() =>
                        setIconErrors((prev) => ({ ...prev, [currentApp.id]: true }))
                      }
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center rounded-xl bg-gradient-to-br from-sky-500 to-indigo-600 text-white font-extrabold text-base sm:text-xl shadow-inner">
                      {currentApp.name.slice(0, 2).toUpperCase()}
                    </div>
                  )}
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h2 className="text-lg sm:text-2xl md:text-3xl font-extrabold tracking-tight drop-shadow-sm text-white truncate">
                      {currentApp.name}
                    </h2>
                    {currentApp.featured && (
                      <span className="inline-flex items-center gap-1 rounded-md bg-amber-500/20 border border-amber-400/40 px-2 py-0.5 text-[10px] sm:text-[11px] font-bold text-amber-300">
                        <Sparkles className="h-3 w-3 fill-amber-300" />
                        <span>Featured</span>
                      </span>
                    )}
                  </div>

                  <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-[11px] sm:text-xs font-medium text-slate-300 mt-0.5">
                    <span className="text-sky-300 font-semibold">{currentApp.category}</span>
                    {isOffline && (
                      <>
                        <span aria-hidden="true" className="text-slate-500">·</span>
                        <span className="inline-flex items-center gap-1 text-emerald-300 font-semibold">
                          <Wifi className="h-3 w-3" /> Offline
                        </span>
                      </>
                    )}
                    {isOpenSource && (
                      <>
                        <span aria-hidden="true" className="text-slate-500">·</span>
                        <span className="inline-flex items-center gap-1 text-sky-200 font-semibold">
                          <Code2 className="h-3 w-3" /> Open Source
                        </span>
                      </>
                    )}
                  </div>
                </div>
              </div>

              {/* Description: Protected with line-clamp and high-contrast text */}
              <p className="line-clamp-2 sm:line-clamp-3 text-xs sm:text-sm text-slate-200 leading-relaxed font-normal drop-shadow-sm max-w-xl">
                {currentApp.description}
              </p>

              {/* Responsive Action Buttons: 2-column grid on mobile, row on desktop */}
              <div className="mt-3.5 sm:mt-4 grid grid-cols-2 sm:flex sm:items-center gap-2 sm:gap-3">
                <a
                  href={currentApp.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-1.5 sm:gap-2 rounded-xl bg-sky-500 hover:bg-sky-400 text-slate-950 font-extrabold px-3 sm:px-5 py-2 sm:py-2.5 text-xs shadow-lg shadow-sky-500/30 transition-all active:scale-95 text-center"
                >
                  <span>Launch App</span>
                  <ExternalLink className="h-3.5 w-3.5 stroke-[2.5]" />
                </a>

                <button
                  type="button"
                  onClick={() => onOpenDetails(currentApp)}
                  className="inline-flex items-center justify-center gap-1.5 rounded-xl bg-white/15 hover:bg-white/25 border border-white/20 text-white font-bold px-3 sm:px-4 py-2 sm:py-2.5 text-xs backdrop-blur-md transition-all active:scale-95 cursor-pointer text-center"
                >
                  <Info className="h-3.5 w-3.5" />
                  <span>View Details</span>
                </button>
              </div>
            </div>
          </div>

          {/* Bottom App Quick Selector Tabs: Smooth horizontal touch scroll */}
          <div className="flex items-center justify-between border-t border-slate-300/40 bg-[#e6ecf4] px-3 sm:px-6 py-2.5 sm:py-3 gap-2 overflow-x-auto scrollbar-none touch-pan-x">
            <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
              {spotlightApps.map((app, idx) => {
                const isActive = idx === currentIndex;
                return (
                  <button
                    key={app.id}
                    type="button"
                    onClick={() => setCurrentIndex(idx)}
                    className={`flex items-center gap-1.5 sm:gap-2 rounded-full px-3 sm:px-3.5 py-1 sm:py-1.5 text-xs font-bold transition-all whitespace-nowrap cursor-pointer shrink-0 ${
                      isActive
                        ? 'neu-inset text-sky-700'
                        : 'neu-button text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    <span className="truncate max-w-[90px] sm:max-w-[140px]">{app.name}</span>
                  </button>
                );
              })}
            </div>

            {/* Slide Dots on Desktop */}
            <div className="hidden md:flex items-center gap-1.5 shrink-0 pl-2">
              {spotlightApps.map((_, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setCurrentIndex(idx)}
                  className={`h-2 rounded-full transition-all cursor-pointer ${
                    idx === currentIndex
                      ? 'w-6 bg-sky-600'
                      : 'w-2 bg-slate-400 hover:bg-slate-600'
                  }`}
                  title={`Go to slide ${idx + 1}`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
