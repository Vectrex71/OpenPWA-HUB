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
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        {/* Clean Typographic Brand Mark - No Clunky Icon */}
        <a
          href="#"
          className="group text-lg sm:text-xl font-extrabold tracking-tight text-slate-800 whitespace-nowrap shrink-0 transition-opacity hover:opacity-90"
        >
          OpenPWA <span className="text-sky-600 font-black">Hub</span>
        </a>

        {/* Right Section: Compact Search Bar + Primary Action */}
        <div className="flex items-center gap-3 shrink-0">
          {/* Stable Neumorphic Search Bar */}
          <div className="relative flex items-center rounded-xl neu-inset px-2.5 py-1.5 w-44 sm:w-60 md:w-72">
            <Search className="pointer-events-none h-3.5 w-3.5 text-slate-400 mr-2 shrink-0" />
            <input
              ref={searchInputRef}
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="PWA suchen..."
              className="w-full bg-transparent text-xs font-semibold text-slate-800 placeholder:text-slate-400 focus:outline-none"
            />
            <div className="flex items-center gap-1 shrink-0 ml-1">
              {searchQuery ? (
                <button
                  type="button"
                  onClick={() => onSearchChange('')}
                  className="flex h-4 w-4 items-center justify-center text-slate-400 hover:text-slate-700 transition-colors cursor-pointer"
                  title="Suche leeren"
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

          {/* Primary Action Button: Permanent "+ PWA vorschlagen" */}
          <button
            type="button"
            onClick={onOpenSubmit}
            className="flex items-center gap-1.5 sm:gap-2 rounded-xl neu-button-primary px-3.5 sm:px-4 py-2 text-xs font-bold tracking-wide whitespace-nowrap shrink-0 cursor-pointer"
          >
            <Plus className="h-4 w-4 stroke-[2.5]" />
            <span>PWA vorschlagen</span>
          </button>
        </div>
      </div>
    </header>
  );
};
