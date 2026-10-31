import React, { useState, useMemo } from 'react';
import {
  X,
  Github,
  Copy,
  Check,
  Download,
  Eye,
  Code,
  Plus,
  Trash2,
  AlertCircle,
  Sparkles,
  ExternalLink,
} from 'lucide-react';
import { PWAEntry } from '../types/pwa';
import { AppCard } from './AppCard';
import { getGitHubRepo, createGitHubIssueUrl } from '../utils/config';

interface SubmissionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSimulateAdd?: (entry: PWAEntry) => void;
}

const COMMON_TAGS = [
  'Offline',
  'Open Source',
  '3D',
  'Audio',
  'WebAssembly',
  'Photo Editing',
  'Diagrams',
  'Collaboration',
  'Development',
  'Security',
  'Casual',
  'Puzzle',
];

const PREDEFINED_CATEGORIES = [
  'Productivity',
  'Graphics & Design',
  'Audio & Video',
  'Developer Tools',
  'Games & Fun',
  'Utilities',
  'Education & Science',
];

export const SubmissionModal: React.FC<SubmissionModalProps> = ({
  isOpen,
  onClose,
  onSimulateAdd,
}) => {
  const [name, setName] = useState('');
  const [url, setUrl] = useState('');
  const [category, setCategory] = useState(PREDEFINED_CATEGORIES[0]);
  const [description, setDescription] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>(['Offline']);
  const [customTagInput, setCustomTagInput] = useState('');
  const [iconUrl, setIconUrl] = useState('');
  const [screenshotUrls, setScreenshotUrls] = useState<string[]>(['']);
  const [youtubeVideoId, setYoutubeVideoId] = useState('');
  const [author, setAuthor] = useState('');
  const [license, setLicense] = useState('MIT');
  const [githubUrl, setGithubUrl] = useState('');

  const [activeTab, setActiveTab] = useState<'form' | 'preview' | 'json'>('form');
  const [copiedJson, setCopiedJson] = useState(false);
  const [touched, setTouched] = useState(false);

  // Generate ID slug
  const idSlug = useMemo(() => {
    return name
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9_-]/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '') || 'my-app';
  }, [name]);

  // Clean Screenshot URLs
  const validScreenshots = useMemo(() => {
    return screenshotUrls.map((s) => s.trim()).filter((s) => s.length > 0);
  }, [screenshotUrls]);

  // Validation
  const errors = useMemo(() => {
    const errs: Record<string, string> = {};
    if (!name.trim()) errs.name = 'App name is required.';
    if (!url.trim()) {
      errs.url = 'Web URL is required.';
    } else if (!/^https?:\/\/.+/.test(url.trim())) {
      errs.url = 'URL must start with https:// or http://';
    }
    if (!description.trim() || description.trim().length < 15) {
      errs.description = 'Description must be at least 15 characters.';
    }
    if (!iconUrl.trim()) {
      errs.iconUrl = 'Icon URL is required.';
    }
    return errs;
  }, [name, url, description, iconUrl]);

  const isValid = Object.keys(errors).length === 0;

  // Generated JSON Object
  const generatedAppEntry: PWAEntry = useMemo(() => {
    return {
      id: idSlug,
      name: name.trim() || 'My PWA',
      url: url.trim() || 'https://example.com',
      description:
        description.trim() ||
        'An innovative Progressive Web App with offline support.',
      category,
      tags: selectedTags.length > 0 ? selectedTags : ['PWA'],
      iconUrl:
        iconUrl.trim() ||
        'https://raw.githubusercontent.com/lucide-icons/lucide/main/icons/globe.svg',
      screenshots: validScreenshots,
      youtubeVideoId: youtubeVideoId.trim() || undefined,
      featured: false,
      author: author.trim() || undefined,
      license: license.trim() || undefined,
      githubUrl: githubUrl.trim() || undefined,
    };
  }, [
    idSlug,
    name,
    url,
    description,
    category,
    selectedTags,
    iconUrl,
    validScreenshots,
    youtubeVideoId,
    author,
    license,
    githubUrl,
  ]);

  const formattedJson = useMemo(() => {
    return JSON.stringify(generatedAppEntry, null, 2);
  }, [generatedAppEntry]);

  if (!isOpen) return null;

  const handleToggleTag = (tag: string) => {
    if (selectedTags.includes(tag)) {
      setSelectedTags(selectedTags.filter((t) => t !== tag));
    } else {
      setSelectedTags([...selectedTags, tag]);
    }
  };

  const handleAddCustomTag = (e: React.KeyboardEvent | React.MouseEvent) => {
    if ('key' in e && e.key !== 'Enter') return;
    e.preventDefault();
    const tag = customTagInput.trim();
    if (tag && !selectedTags.includes(tag)) {
      setSelectedTags([...selectedTags, tag]);
      setCustomTagInput('');
    }
  };

  const handleAddScreenshotField = () => {
    setScreenshotUrls([...screenshotUrls, '']);
  };

  const handleScreenshotChange = (index: number, value: string) => {
    const updated = [...screenshotUrls];
    updated[index] = value;
    setScreenshotUrls(updated);
  };

  const handleRemoveScreenshotField = (index: number) => {
    if (screenshotUrls.length <= 1) {
      setScreenshotUrls(['']);
      return;
    }
    setScreenshotUrls(screenshotUrls.filter((_, i) => i !== index));
  };

  const handleCopyJson = () => {
    navigator.clipboard.writeText(formattedJson);
    setCopiedJson(true);
    setTimeout(() => setCopiedJson(false), 2000);
  };

  const handleDownloadJson = () => {
    const blob = new Blob([formattedJson], { type: 'application/json' });
    const blobUrl = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = blobUrl;
    link.download = `${idSlug}.json`;
    link.click();
    URL.revokeObjectURL(blobUrl);
  };

  const handleGitHubSubmit = () => {
    setTouched(true);
    if (!isValid) return;

    const repo = getGitHubRepo();
    const issueUrl = createGitHubIssueUrl(repo, name.trim(), formattedJson);
    window.open(issueUrl, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 md:p-6 overflow-y-auto bg-slate-900/30 backdrop-blur-sm animate-in fade-in duration-200">
      {/* Backdrop */}
      <div className="fixed inset-0" onClick={onClose} />

      {/* Modal Dialog */}
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="submit-modal-title"
        className="relative z-10 w-full max-w-3xl max-h-[92vh] flex flex-col rounded-3xl neu-flat overflow-hidden"
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-slate-300/40 px-6 py-4 bg-[#e6ecf4]">
          <div>
            <h2 id="submit-modal-title" className="text-lg font-extrabold text-slate-900 tracking-tight">
              Submit a PWA
            </h2>
            <p className="text-xs text-slate-500 font-medium">
              Fill out the form · JSON is generated automatically and pre-filled in a new GitHub Issue
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-xl neu-button text-slate-600 hover:text-slate-900 transition-colors cursor-pointer"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* View Switcher Tabs (Form / Preview / JSON) */}
        <div className="flex items-center gap-2 border-b border-slate-300/40 bg-[#e6ecf4] px-6 py-3">
          <button
            type="button"
            onClick={() => setActiveTab('form')}
            className={`rounded-xl px-3.5 py-1.5 text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'form'
                ? 'neu-inset text-sky-700'
                : 'neu-button text-slate-600 hover:text-slate-900'
            }`}
          >
            1. App Details
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('preview')}
            className={`flex items-center gap-1.5 rounded-xl px-3.5 py-1.5 text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'preview'
                ? 'neu-inset text-sky-700'
                : 'neu-button text-slate-600 hover:text-slate-900'
            }`}
          >
            <Eye className="h-3.5 w-3.5" />
            <span>2. Live Preview</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('json')}
            className={`flex items-center gap-1.5 rounded-xl px-3.5 py-1.5 text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'json'
                ? 'neu-inset text-sky-700'
                : 'neu-button text-slate-600 hover:text-slate-900'
            }`}
          >
            <Code className="h-3.5 w-3.5" />
            <span>3. Generated JSON</span>
          </button>
        </div>

        {/* Modal Scroll Content */}
        <div className="overflow-y-auto p-6 space-y-6">
          {activeTab === 'form' && (
            <form onSubmit={(e) => e.preventDefault()} className="space-y-5">
              {/* App Name & Category Row */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    App Name *
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Photopea or Excalidraw"
                    className="w-full rounded-xl neu-inset px-4 py-2.5 text-sm font-medium text-slate-800 placeholder:text-slate-400 focus:outline-none"
                  />
                  {touched && errors.name && (
                    <p className="mt-1.5 text-[11px] text-rose-600 font-semibold flex items-center gap-1">
                      <AlertCircle className="h-3 w-3" /> {errors.name}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    Category *
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full rounded-xl neu-button px-4 py-2.5 text-sm font-semibold text-slate-800 focus:outline-none cursor-pointer"
                  >
                    {PREDEFINED_CATEGORIES.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Web App URL */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Web URL (PWA Homepage) *
                </label>
                <input
                  type="url"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  placeholder="https://my-pwa.app/"
                  className="w-full rounded-xl neu-inset px-4 py-2.5 text-sm font-medium text-slate-800 placeholder:text-slate-400 focus:outline-none"
                />
                {touched && errors.url && (
                  <p className="mt-1.5 text-[11px] text-rose-600 font-semibold flex items-center gap-1">
                    <AlertCircle className="h-3 w-3" /> {errors.url}
                  </p>
                )}
              </div>

              {/* Description */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Description *
                </label>
                <textarea
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Concise overview of features, use-cases, and offline capabilities..."
                  className="w-full rounded-xl neu-inset px-4 py-2.5 text-sm font-medium text-slate-800 placeholder:text-slate-400 focus:outline-none"
                />
                {touched && errors.description && (
                  <p className="mt-1.5 text-[11px] text-rose-600 font-semibold flex items-center gap-1">
                    <AlertCircle className="h-3 w-3" /> {errors.description}
                  </p>
                )}
              </div>

              {/* Icon URL */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Icon URL (at least 192x192 or 512x512 PNG/SVG) *
                </label>
                <div className="flex items-center gap-3">
                  <input
                    type="url"
                    value={iconUrl}
                    onChange={(e) => setIconUrl(e.target.value)}
                    placeholder="https://my-pwa.app/icon-512.png"
                    className="flex-1 rounded-xl neu-inset px-4 py-2.5 text-sm font-medium text-slate-800 placeholder:text-slate-400 focus:outline-none"
                  />
                  {iconUrl && (
                    <div className="h-10 w-10 shrink-0 overflow-hidden rounded-xl neu-flat-sm p-1 flex items-center justify-center">
                      <img
                        src={iconUrl}
                        alt="Icon Preview"
                        className="max-h-full max-w-full object-contain"
                        referrerPolicy="no-referrer"
                        onError={(e) => {
                          (e.target as HTMLElement).style.display = 'none';
                        }}
                      />
                    </div>
                  )}
                </div>
                {touched && errors.iconUrl && (
                  <p className="mt-1.5 text-[11px] text-rose-600 font-semibold flex items-center gap-1">
                    <AlertCircle className="h-3 w-3" /> {errors.iconUrl}
                  </p>
                )}
              </div>

              {/* Tags Selection & Custom Tag */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Tags &amp; Features
                </label>
                <div className="flex flex-wrap gap-2 mb-3">
                  {COMMON_TAGS.map((tag) => {
                    const isSelected = selectedTags.includes(tag);
                    return (
                      <button
                        key={tag}
                        type="button"
                        onClick={() => handleToggleTag(tag)}
                        className={`rounded-xl px-3 py-1.5 text-xs font-bold transition-all cursor-pointer ${
                          isSelected
                            ? 'neu-inset text-sky-700'
                            : 'neu-button text-slate-600 hover:text-slate-900'
                        }`}
                      >
                        {tag}
                      </button>
                    );
                  })}
                </div>

                {/* Custom Tag Input */}
                <div className="flex items-center gap-2 max-w-sm">
                  <input
                    type="text"
                    value={customTagInput}
                    onChange={(e) => setCustomTagInput(e.target.value)}
                    onKeyDown={handleAddCustomTag}
                    placeholder="Add custom tag..."
                    className="flex-1 rounded-xl neu-inset px-3 py-1.5 text-xs font-medium text-slate-800 placeholder:text-slate-400 focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={handleAddCustomTag}
                    className="rounded-xl neu-button px-3.5 py-1.5 text-xs font-bold text-slate-700 hover:text-slate-900 transition-colors cursor-pointer"
                  >
                    Add
                  </button>
                </div>
              </div>

              {/* Screenshots Array Inputs */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-bold text-slate-700">
                    Screenshots (Image URLs)
                  </label>
                  <button
                    type="button"
                    onClick={handleAddScreenshotField}
                    className="flex items-center gap-1 text-[11px] font-bold text-sky-700 hover:text-sky-900 cursor-pointer"
                  >
                    <Plus className="h-3 w-3" /> Add screenshot URL
                  </button>
                </div>

                <div className="space-y-2">
                  {screenshotUrls.map((scUrl, idx) => (
                    <div key={idx} className="flex items-center gap-2">
                      <input
                        type="url"
                        value={scUrl}
                        onChange={(e) => handleScreenshotChange(idx, e.target.value)}
                        placeholder={`https://my-pwa.app/screenshot-${idx + 1}.png`}
                        className="flex-1 rounded-xl neu-inset px-3.5 py-2 text-xs font-medium text-slate-800 placeholder:text-slate-400 focus:outline-none"
                      />
                      {screenshotUrls.length > 1 && (
                        <button
                          type="button"
                          onClick={() => handleRemoveScreenshotField(idx)}
                          className="flex h-8 w-8 items-center justify-center rounded-xl neu-button text-slate-500 hover:text-rose-600 transition-colors cursor-pointer"
                          title="Remove"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Optional Fields (YouTube ID, Author, License, GitHub) */}
              <div className="border-t border-slate-300/40 pt-4 space-y-4">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  Optional Additional Information
                </span>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-slate-600 mb-1">
                      YouTube Video ID (e.g. <code className="text-sky-700 font-bold">dQw4w9WgXcQ</code>)
                    </label>
                    <input
                      type="text"
                      value={youtubeVideoId}
                      onChange={(e) => setYoutubeVideoId(e.target.value)}
                      placeholder="Video ID only (11 characters)"
                      className="w-full rounded-xl neu-inset px-3 py-2 text-xs font-medium text-slate-800 placeholder:text-slate-400 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-600 mb-1">
                      GitHub Repository URL
                    </label>
                    <input
                      type="url"
                      value={githubUrl}
                      onChange={(e) => setGithubUrl(e.target.value)}
                      placeholder="https://github.com/user/pwa"
                      className="w-full rounded-xl neu-inset px-3 py-2 text-xs font-medium text-slate-800 placeholder:text-slate-400 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-600 mb-1">
                      Author / Organization
                    </label>
                    <input
                      type="text"
                      value={author}
                      onChange={(e) => setAuthor(e.target.value)}
                      placeholder="e.g. Google Chrome Labs"
                      className="w-full rounded-xl neu-inset px-3 py-2 text-xs font-medium text-slate-800 placeholder:text-slate-400 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-600 mb-1">
                      License (e.g. MIT, Apache-2.0, Free)
                    </label>
                    <input
                      type="text"
                      value={license}
                      onChange={(e) => setLicense(e.target.value)}
                      placeholder="MIT"
                      className="w-full rounded-xl neu-inset px-3 py-2 text-xs font-medium text-slate-800 placeholder:text-slate-400 focus:outline-none"
                    />
                  </div>
                </div>
              </div>
            </form>
          )}

          {/* Live Preview Tab */}
          {activeTab === 'preview' && (
            <div className="space-y-4">
              <div className="rounded-2xl neu-flat-sm p-4 text-xs font-semibold text-sky-800">
                <span>Live Preview:</span> This is how the card will be displayed to all visitors.
              </div>

              <div className="max-w-md mx-auto">
                <AppCard app={generatedAppEntry} onOpenDetails={() => {}} />
              </div>
            </div>
          )}

          {/* JSON Code Tab */}
          {activeTab === 'json' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs text-slate-600">
                <span>File location: <code className="text-sky-700 font-mono font-bold">apps/{idSlug}.json</code>:</span>
                <span className="font-mono text-slate-500 font-medium">{formattedJson.length} Bytes</span>
              </div>

              <pre className="max-h-96 overflow-auto rounded-2xl neu-inset-deep p-4 font-mono text-xs text-slate-800 leading-relaxed scrollbar-thin">
                {formattedJson}
              </pre>
            </div>
          )}
        </div>

        {/* Modal Actions Footer */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-slate-300/40 px-6 py-4 bg-[#e6ecf4]">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleCopyJson}
              className="flex items-center gap-1.5 rounded-xl neu-button px-3 py-2 text-xs font-bold text-slate-700 hover:text-slate-900 transition-colors cursor-pointer"
              title="Copy JSON to clipboard"
            >
              {copiedJson ? <Check className="h-3.5 w-3.5 text-emerald-600" /> : <Copy className="h-3.5 w-3.5" />}
              <span>{copiedJson ? 'Copied!' : 'Copy JSON'}</span>
            </button>

            <button
              type="button"
              onClick={handleDownloadJson}
              className="flex items-center gap-1.5 rounded-xl neu-button px-3 py-2 text-xs font-bold text-slate-700 hover:text-slate-900 transition-colors cursor-pointer"
              title="Download as .json file"
            >
              <Download className="h-3.5 w-3.5" />
              <span>Download .json</span>
            </button>

            {onSimulateAdd && (
              <button
                type="button"
                onClick={() => {
                  setTouched(true);
                  if (!isValid) return;
                  onSimulateAdd(generatedAppEntry);
                  onClose();
                }}
                className="hidden sm:inline-flex items-center gap-1.5 rounded-xl neu-button px-3 py-2 text-xs font-bold text-sky-700 hover:text-sky-900 transition-colors cursor-pointer"
                title="Test immediately in local view"
              >
                <Sparkles className="h-3.5 w-3.5" />
                <span>Test Locally</span>
              </button>
            )}
          </div>

          {/* Primary Action Button: "Submit via GitHub Issue" */}
          <button
            type="button"
            onClick={handleGitHubSubmit}
            className="w-full sm:w-auto flex items-center justify-center gap-2 rounded-xl neu-button-primary px-5 py-2.5 text-xs font-bold transition-all active:scale-95 cursor-pointer"
          >
            <Github className="h-4 w-4" />
            <span>Submit via GitHub Issue</span>
            <ExternalLink className="h-3.5 w-3.5 opacity-90" />
          </button>
        </div>
      </div>
    </div>
  );
};
