export interface Gift {
  id: string;
  title: string;
  productUrl: string;
  imageUrl: string;
  order: number;
  visible: boolean;
  timestamp: number;
  createdAt: string;
  source: 'google_sheets';
}

export interface AppConfig {
  syncInterval: number;
  cacheTimeout: number;
  maxRetries: number;
  animationDuration: number;
}

export interface SheetsConfig {
  spreadsheetId: string;
  csvUrls: string[];
  editUrl: string;
}

export interface LoadingState {
  isLoading: boolean;
  message: string;
  progress?: number;
}

export interface SyncState {
  isOnline: boolean;
  lastSync: number | null;
  syncStatus: 'idle' | 'syncing' | 'success' | 'error';
  errorMessage?: string;
}

export interface ValidationResult {
  gift: Gift;
  isValid: boolean;
  error?: string;
}

export interface CacheData {
  presentes: Gift[];
  lastUpdate: number;
  source?: string;
}
