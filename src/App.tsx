/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo } from 'react';
import { PWAEntry, CategoryKey, DatabasePayload } from './types/pwa';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { CategoryNav, SortOption } from './components/CategoryNav';
import { AppCard } from './components/AppCard';
import { AppDetailModal } from './components/AppDetailModal';
import { SubmissionModal } from './components/SubmissionModal';
import { SettingsModal } from './components/SettingsModal';
import { DocsModal } from './components/DocsModal';
import { Footer } from './components/Footer';
import fallbackData from './data/fallbackDatabase.json';
import { FilterX, AlertCircle, Plus } from 'lucide-react';

export default function App() {
  const [apps, setApps] = useState<PWAEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filters & Search
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<CategoryKey>('all');
  const [offlineOnly, setOfflineOnly] = useState(false);
  const [openSourceOnly, setOpenSourceOnly] = useState(false);
  const [featuredOnly, setFeaturedOnly] = useState(false);
  const [sortBy, setSortBy] = useState<SortOption>('featured');

  // Modals
  const [selectedApp, setSelectedApp] = useState<PWAEntry | null>(null);
  const [isSubmitOpen, setIsSubmitOpen] = useState(false);
  const [isDocsOpen, setIsDocsOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  // Load database.json asynchronously
  const loadDatabase = async () => {
    setLoading(true);
    setError(null);
    try {
      const basePath = import.meta.env.BASE_URL || './';
      const dbUrl = `${basePath.endsWith('/') ? basePath : basePath + '/'}database.json`;

      const response = await fetch(dbUrl, {
        cache: 'no-cache',
        headers: { Accept: 'application/json' },
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data: DatabasePayload = await response.json();
      if (Array.isArray(data.apps)) {
        setApps(data.apps);
      } else {
        throw new Error('Invalid database format: "apps" array missing.');
      }
    } catch (err: unknown) {
      console.warn('Failed to fetch database.json, using bundled fallback:', err);
      if (fallbackData && Array.isArray(fallbackData.apps)) {
        setApps(fallbackData.apps as PWAEntry[]);
      } else {
        setError(err instanceof Error ? err.message : 'Unknown loading error');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDatabase();
  }, []);

  // Compute category counts
  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = { all: apps.length };
    for (const app of apps) {
      counts[app.category] = (counts[app.category] || 0) + 1;
    }
    return counts;
  }, [apps]);

  // Filter & Search Logic
  const filteredApps = useMemo(() => {
    const query = searchQuery.toLowerCase().trim();

    return apps.filter((app) => {
      // Category filter
      if (selectedCategory !== 'all' && app.category !== selectedCategory) {
        return false;
      }

      // Quick filters
      if (offlineOnly && !app.tags.some((t) => t.toLowerCase().includes('offline'))) {
        return false;
      }
      if (
        openSourceOnly &&
        !app.tags.some((t) => t.toLowerCase().includes('open source')) &&
        !app.githubUrl
      ) {
        return false;
      }
      if (featuredOnly && !app.featured) {
        return false;
      }

      // Search Query filter
      if (query) {
        const matchesName = app.name.toLowerCase().includes(query);
        const matchesDesc = app.description.toLowerCase().includes(query);
        const matchesCategory = app.category.toLowerCase().includes(query);
        const matchesTags = app.tags.some((t) => t.toLowerCase().includes(query));
        const matchesAuthor = app.author?.toLowerCase().includes(query);

        if (!matchesName && !matchesDesc && !matchesCategory && !matchesTags && !matchesAuthor) {
          return false;
        }
      }

      return true;
    });
  }, [apps, selectedCategory, searchQuery, offlineOnly, openSourceOnly, featuredOnly]);

  // Sorting
  const sortedApps = useMemo(() => {
    const list = [...filteredApps];
    if (sortBy === 'featured') {
      list.sort((a, b) => {
        if (a.featured === b.featured) {
          return a.name.localeCompare(b.name, 'en', { sensitivity: 'base' });
        }
        return a.featured ? -1 : 1;
      });
    } else if (sortBy === 'name') {
      list.sort((a, b) => a.name.localeCompare(b.name, 'en', { sensitivity: 'base' }));
    } else if (sortBy === 'newest') {
      list.sort((a, b) => (b.addedAt || '').localeCompare(a.addedAt || ''));
    }
    return list;
  }, [filteredApps, sortBy]);

  const hasActiveFilters =
    searchQuery !== '' ||
    selectedCategory !== 'all' ||
    offlineOnly ||
    openSourceOnly ||
    featuredOnly;

  const handleResetFilters = () => {
    setSearchQuery('');
    setSelectedCategory('all');
    setOfflineOnly(false);
    setOpenSourceOnly(false);
    setFeaturedOnly(false);
  };

  const handleTagFilter = (tag: string) => {
    setSearchQuery(tag);
  };

  const handleSimulateAdd = (newEntry: PWAEntry) => {
    setApps((prev) => [newEntry, ...prev]);
    setSelectedApp(newEntry);
  };

  return (
    <div className="flex min-h-screen flex-col bg-[#e6ecf4] text-slate-800 font-sans selection:bg-sky-500/20 selection:text-sky-900">
      {/* Top Header with Compact Search Bar */}
      <Header
        onOpenSubmit={() => setIsSubmitOpen(true)}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
      />

      {/* Rotating Hero Spotlight Showcase with Screenshots */}
      <Hero
        apps={apps}
        onOpenDetails={(selected) => setSelectedApp(selected)}
      />

      {/* Catalog & Browse Section */}
      <main id="apps-list" className="mx-auto w-full max-w-7xl flex-1 px-4 sm:px-6 lg:px-8 py-6">
        {/* Navigation & Segmented Filters */}
        <CategoryNav
          selectedCategory={selectedCategory}
          onSelectCategory={setSelectedCategory}
          categoryCounts={categoryCounts}
          offlineOnly={offlineOnly}
          onToggleOffline={() => setOfflineOnly(!offlineOnly)}
          openSourceOnly={openSourceOnly}
          onToggleOpenSource={() => setOpenSourceOnly(!openSourceOnly)}
          featuredOnly={featuredOnly}
          onToggleFeatured={() => setFeaturedOnly(!featuredOnly)}
          sortBy={sortBy}
          onChangeSort={setSortBy}
          hasActiveFilters={hasActiveFilters}
          onResetFilters={handleResetFilters}
        />

        {/* Loading State */}
        {loading && apps.length === 0 && (
          <div className="mt-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div
                key={i}
                className="rounded-2xl neu-flat p-4 animate-pulse flex flex-col justify-between"
              >
                <div>
                  <div className="aspect-[16/9] w-full rounded-xl neu-inset mb-3.5" />
                  <div className="flex gap-3 items-center">
                    <div className="h-12 w-12 rounded-xl neu-inset shrink-0" />
                    <div className="flex-1 space-y-2 py-1">
                      <div className="h-4 w-3/4 rounded bg-slate-300/60" />
                      <div className="h-3 w-1/2 rounded bg-slate-300/40" />
                    </div>
                  </div>
                  <div className="mt-3 space-y-2">
                    <div className="h-3 w-full rounded bg-slate-300/40" />
                    <div className="h-3 w-4/5 rounded bg-slate-300/40" />
                  </div>
                </div>
                <div className="mt-4 pt-3 border-t border-slate-300/40 flex justify-between">
                  <div className="h-3 w-20 rounded bg-slate-300/40" />
                  <div className="h-3 w-14 rounded bg-slate-300/40" />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Error State */}
        {error && apps.length === 0 && (
          <div className="mt-12 rounded-3xl neu-flat p-8 text-center text-rose-700 max-w-lg mx-auto">
            <AlertCircle className="h-8 w-8 mx-auto text-rose-600 mb-3" />
            <h3 className="text-base font-bold text-rose-900">Loading Error</h3>
            <p className="mt-1 text-xs text-rose-700">{error}</p>
            <button
              type="button"
              onClick={loadDatabase}
              className="mt-4 inline-flex items-center gap-2 rounded-xl neu-button px-4 py-2 text-xs font-bold text-rose-800 hover:text-rose-900 transition-colors"
            >
              Try Again
            </button>
          </div>
        )}

        {/* Empty Search / Filter State */}
        {!loading && sortedApps.length === 0 && (
          <div className="mt-16 rounded-3xl neu-flat p-12 text-center max-w-md mx-auto">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl neu-inset mx-auto text-slate-500 mb-4">
              <FilterX className="h-6 w-6" />
            </div>
            <h3 className="text-base font-extrabold text-slate-900">No Web Apps Found</h3>
            <p className="mt-1.5 text-xs text-slate-600 leading-relaxed font-normal">
              No applications match your current search terms or filter selection.
            </p>
            <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
              <button
                type="button"
                onClick={handleResetFilters}
                className="rounded-xl neu-button px-4 py-2 text-xs font-bold text-slate-700 hover:text-slate-900 transition-colors cursor-pointer"
              >
                Reset Filters
              </button>
              <button
                type="button"
                onClick={() => setIsSubmitOpen(true)}
                className="flex items-center gap-1.5 rounded-xl neu-button-primary px-4 py-2 text-xs font-bold transition-colors cursor-pointer"
              >
                <Plus className="h-3.5 w-3.5 stroke-[2.5]" />
                <span>+ Submit PWA</span>
              </button>
            </div>
          </div>
        )}

        {/* Apps Cards Grid */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sortedApps.map((app) => (
            <AppCard
              key={app.id}
              app={app}
              onOpenDetails={(selected) => setSelectedApp(selected)}
              onTagClick={handleTagFilter}
            />
          ))}
        </div>
      </main>

      {/* Footer */}
      <Footer
        onOpenSubmit={() => setIsSubmitOpen(true)}
        onOpenDocs={() => setIsDocsOpen(true)}
        onOpenSettings={() => setIsSettingsOpen(true)}
      />

      {/* Modals */}
      <AppDetailModal
        app={selectedApp}
        onClose={() => setSelectedApp(null)}
        onSelectTag={handleTagFilter}
      />

      <SubmissionModal
        isOpen={isSubmitOpen}
        onClose={() => setIsSubmitOpen(false)}
        onSimulateAdd={handleSimulateAdd}
      />

      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
      />

      <DocsModal
        isOpen={isDocsOpen}
        onClose={() => setIsDocsOpen(false)}
      />
    </div>
  );
}
