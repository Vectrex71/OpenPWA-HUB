import React from 'react';
import { Wifi, Sparkles, Code2, ArrowUpDown, FilterX } from 'lucide-react';
import { CategoryKey } from '../types/pwa';

export const CATEGORIES: { id: CategoryKey; label: string }[] = [
  { id: 'all', label: 'Alle Kategorien' },
  { id: 'Produktivität', label: 'Produktivität' },
  { id: 'Grafik & Design', label: 'Grafik & Design' },
  { id: 'Audio & Video', label: 'Audio & Video' },
  { id: 'Entwicklung & Tools', label: 'Entwicklung' },
  { id: 'Spiele & Fun', label: 'Spiele' },
  { id: 'Dienstprogramme', label: 'Dienstprogramme' },
];

export type SortOption = 'featured' | 'name' | 'newest';

interface CategoryNavProps {
  selectedCategory: CategoryKey;
  onSelectCategory: (cat: CategoryKey) => void;
  categoryCounts: Record<string, number>;
  offlineOnly: boolean;
  onToggleOffline: () => void;
  openSourceOnly: boolean;
  onToggleOpenSource: () => void;
  featuredOnly: boolean;
  onToggleFeatured: () => void;
  sortBy: SortOption;
  onChangeSort: (sort: SortOption) => void;
  hasActiveFilters?: boolean;
  onResetFilters?: () => void;
}

export const CategoryNav: React.FC<CategoryNavProps> = ({
  selectedCategory,
  onSelectCategory,
  categoryCounts,
  offlineOnly,
  onToggleOffline,
  openSourceOnly,
  onToggleOpenSource,
  featuredOnly,
  onToggleFeatured,
  sortBy,
  onChangeSort,
  hasActiveFilters,
  onResetFilters,
}) => {
  return (
    <div className="space-y-3">
      {/* Primary Category Neumorphic Bar: generous pt/pb prevents shadow clipping by overflow-x */}
      <div className="flex items-center gap-2.5 overflow-x-auto pt-3.5 pb-3.5 px-3 -mx-3 scrollbar-none">
        {CATEGORIES.map((cat) => {
          const isActive = selectedCategory === cat.id;
          const count = cat.id === 'all' ? categoryCounts.all || 0 : categoryCounts[cat.id] || 0;

          return (
            <button
              key={cat.id}
              type="button"
              onClick={() => onSelectCategory(cat.id)}
              className={`flex items-center gap-2 rounded-full px-3.5 py-1.5 text-xs font-bold transition-all whitespace-nowrap shrink-0 cursor-pointer ${
                isActive
                  ? 'neu-inset text-sky-700'
                  : 'neu-button text-slate-700 hover:text-slate-900'
              }`}
            >
              <span>{cat.label}</span>
              <span
                className={`text-[10px] tabular-nums rounded-full px-2 py-0.5 font-bold ${
                  isActive
                    ? 'neu-flat-sm text-sky-800'
                    : 'neu-inset text-slate-500'
                }`}
              >
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Secondary Quick Filter Controls & Sort Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 pt-1">
        {/* Quick Toggles */}
        <div className="flex flex-wrap items-center gap-2.5">
          <span className="text-xs font-semibold text-slate-500 mr-1">Filter:</span>

          <button
            type="button"
            onClick={onToggleOffline}
            className={`flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-bold transition-all cursor-pointer ${
              offlineOnly
                ? 'neu-inset text-emerald-700'
                : 'neu-button text-slate-600 hover:text-slate-900'
            }`}
          >
            <Wifi className="h-3.5 w-3.5 stroke-[2.5]" />
            <span>Offline-fähig</span>
          </button>

          <button
            type="button"
            onClick={onToggleOpenSource}
            className={`flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-bold transition-all cursor-pointer ${
              openSourceOnly
                ? 'neu-inset text-sky-700'
                : 'neu-button text-slate-600 hover:text-slate-900'
            }`}
          >
            <Code2 className="h-3.5 w-3.5 stroke-[2.5]" />
            <span>Open Source</span>
          </button>

          <button
            type="button"
            onClick={onToggleFeatured}
            className={`flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-bold transition-all cursor-pointer ${
              featuredOnly
                ? 'neu-inset text-amber-700'
                : 'neu-button text-slate-600 hover:text-slate-900'
            }`}
          >
            <Sparkles className="h-3.5 w-3.5 stroke-[2.5]" />
            <span>Highlights</span>
          </button>

          {/* Seamless reset filter button directly inside filter controls */}
          {hasActiveFilters && onResetFilters && (
            <button
              type="button"
              onClick={onResetFilters}
              className="flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-bold transition-all cursor-pointer neu-button text-sky-700 hover:text-sky-900 ml-1"
              title="Alle Filter zurücksetzen"
            >
              <FilterX className="h-3.5 w-3.5" />
              <span>Zurücksetzen</span>
            </button>
          )}
        </div>

        {/* Sort Selector with matching rounded pill curve */}
        <div className="flex items-center gap-2 text-xs font-semibold text-slate-600">
          <ArrowUpDown className="h-3.5 w-3.5 text-slate-500" />
          <span className="text-slate-500">Sortierung:</span>
          <select
            value={sortBy}
            onChange={(e) => onChangeSort(e.target.value as SortOption)}
            className="rounded-full neu-button px-3.5 py-1.5 text-xs font-bold text-slate-700 focus:outline-none cursor-pointer"
          >
            <option value="featured">Highlights zuerst</option>
            <option value="name">Alphabetisch (A-Z)</option>
            <option value="newest">Neueste Einträge</option>
          </select>
        </div>
      </div>
    </div>
  );
};
