export interface StoredFile {
  id: string;
  name: string;
  type: 'risup' | 'risum' | 'charx';
  size: number;
  uploadedAt: string; // ISO string
  parseError?: string;
}

export interface StoredParsedContent {
  fileId: string;
  content: any;
  parsedAt: string; // ISO string
}

export interface AppState {
  fileIds: string[];
  selectedFileId: string | null;
  activeTab: 'risup' | 'risum' | 'charx';
  leftPanelOpen: boolean;
  rightPanelVisible: boolean;
  selectedKey: string | null;
  selectedValue: any;
  lastUpdated: string; // ISO string
}

export interface StorageConfig {
  maxFiles: number;
  maxTotalSize: number; // bytes
  dataRetentionDays: number;
}

export const DEFAULT_CONFIG: StorageConfig = {
  maxFiles: 50,
  maxTotalSize: 100 * 1024 * 1024, // 100MB
  dataRetentionDays: 30
};