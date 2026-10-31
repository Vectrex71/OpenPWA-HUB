export interface PWAEntry {
  id: string;
  name: string;
  url: string;
  description: string;
  category: string;
  tags: string[];
  iconUrl: string;
  screenshots: string[];
  youtubeVideoId?: string;
  youtubeUrl?: string;
  featured: boolean;
  githubUrl?: string;
  author?: string;
  license?: string;
  addedAt?: string;
}

export type CategoryKey =
  | 'all'
  | 'Productivity'
  | 'Graphics & Design'
  | 'Audio & Video'
  | 'Developer Tools'
  | 'Games & Fun'
  | 'Utilities'
  | 'Education & Science';

export interface CategoryItem {
  id: CategoryKey;
  label: string;
  description: string;
  iconName: string;
}

export interface DatabaseMetadata {
  version: string;
  generatedAt: string;
  totalApps: number;
  categories: string[];
}

export interface DatabasePayload {
  meta?: DatabaseMetadata;
  apps: PWAEntry[];
}
