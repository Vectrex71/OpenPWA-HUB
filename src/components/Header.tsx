import React, { useRef, useEffect } from 'react';
import { Plus, Search, X } from 'lucide-react';

interface HeaderProps {
  onOpenSubmit: () => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenSubmit,
  searchQuery,
  onSearchChange,
}) => {
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Keyboard shortcut: Press "/" to focus search anywhere on the page
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === '/' && document.activeElement !== searchInputRef.current) {
        if (
          document.activeElement?.tagName === 'INPUT' ||
          document.activeElement?.tagName === 'TEXTAREA'
        ) {
          return;
        }
        e.preventDefault();
        searchInputRef.current?.focus();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <header className="sticky top-0 z-40 w-full bg-[#e6ecf4]/95 backdrop-blur-md border-b border-white/60 shadow-[0_4px_14px_rgba(184,196,214,0.4)]">
      <div className="mx-auto max-w-7xl px-3 sm:px-6 lg:px-8 py-2.5 sm:py-0 sm:h-16 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2.5 sm:gap-4">
        {/* Top Bar on Mobile / Left Section on Desktop */}
        <div className="flex items-center justify-between gap-3 w-full sm:w-auto">
          {/* Brand Mark with Custom App Icon */}
          <a
            href="#"
            className="group flex items-center gap-2 text-lg sm:text-xl font-extrabold tracking-tight text-slate-800 whitespace-nowrap shrink-0 transition-transform active:scale-95"
          >
            <img
              src="/icon.svg"
              alt="OpenPWA Logo"
              className="h-7 w-7 sm:h-8 sm:w-8 rounded-xl shadow-md transition-transform group-hover:rotate-6"
            />
            <span>
              OpenPWA <span className="text-sky-600 font-black">Hub</span>
            </span>
          </a>

          {/* Action button on Mobile */}
          <div className="flex items-center sm:hidden shrink-0">
            <button
              type="button"
              onClick={onOpenSubmit}
              className="flex items-center gap-1.5 rounded-xl neu-button-primary px-3 py-1.5 text-xs font-bold tracking-wide whitespace-nowrap cursor-pointer shadow-sm active:scale-95"
              title="Submit a PWA"
            >
              <Plus className="h-3.5 w-3.5 stroke-[2.5]" />
              <span>Submit PWA</span>
            </button>
          </div>
        </div>

        {/* Search Bar: Full-width on Mobile, Compact on Desktop */}
        <div className="w-full sm:w-auto flex-1 sm:max-w-xs md:max-w-sm">
          <div className="relative flex items-center rounded-xl neu-inset px-3 py-1.5 sm:py-1.5 w-full">
            <Search className="pointer-events-none h-3.5 w-3.5 text-slate-400 mr-2 shrink-0" />
            <input
              ref={searchInputRef}
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Search PWAs... (/)"
              className="w-full bg-transparent text-xs font-semibold text-slate-800 placeholder:text-slate-400 focus:outline-none"
            />
            <div className="flex items-center gap-1 shrink-0 ml-1">
              {searchQuery ? (
                <button
                  type="button"
                  onClick={() => onSearchChange('')}
                  className="flex h-4 w-4 items-center justify-center text-slate-400 hover:text-slate-700 transition-colors cursor-pointer"
                  title="Clear search"
                >
                  <X className="h-3 w-3" />
                </button>
              ) : (
                <kbd className="hidden sm:inline-flex items-center rounded neu-flat-sm px-1.5 py-0.2 text-[10px] font-mono text-slate-400 font-bold">
                  /
                </kbd>
              )}
            </div>
          </div>
        </div>

        {/* Desktop-only Actions */}
        <div className="hidden sm:flex items-center gap-3 shrink-0">
          <button
            type="button"
            onClick={onOpenSubmit}
            className="flex items-center gap-1.5 rounded-xl neu-button-primary px-4 py-2 text-xs font-bold tracking-wide whitespace-nowrap cursor-pointer active:scale-95 shadow-sm"
          >
            <Plus className="h-4 w-4 stroke-[2.5]" />
            <span>Submit PWA</span>
          </button>
        </div>
      </div>
    </header>
  );
};
