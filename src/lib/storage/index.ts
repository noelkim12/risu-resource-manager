import localforage from 'localforage';
import type { StoredFile, StoredParsedContent, AppState, StorageConfig } from '../../types/storage/localforage.types';
import { DEFAULT_CONFIG } from '../../types/storage/localforage.types';

class RisuStorageManager {
  private storage: LocalForage;
  private config: StorageConfig;

  constructor(config: Partial<StorageConfig> = {}) {
    this.config = { ...DEFAULT_CONFIG, ...config };

    // RisuAI 전용 저장소 인스턴스 생성
    this.storage = localforage.createInstance({
      name: 'RisuAI-ResourceManager',
      storeName: 'risu_data',
      description: 'RisuAI 리소스 파일 및 앱 상태 저장소',
      driver: [localforage.INDEXEDDB, localforage.WEBSQL, localforage.LOCALSTORAGE]
    });
  }

  // 저장소 초기화 및 정리
  async initialize(): Promise<void> {
    try {
      await this.cleanup();
      console.log('RisuStorage initialized');
    } catch (error) {
      console.warn('Storage initialization failed:', error);
    }
  }

  // 앱 상태 저장
  async saveAppState(state: Partial<AppState>): Promise<void> {
    const currentState = await this.getAppState();
    const newState: AppState = {
      ...currentState,
      ...state,
      lastUpdated: new Date().toISOString()
    };

    await this.storage.setItem('appState', newState);
  }

  // 앱 상태 로드
  async getAppState(): Promise<AppState> {
    const defaultState: AppState = {
      fileIds: [],
      selectedFileId: null,
      activeTab: 'risup',
      leftPanelOpen: true,
      rightPanelVisible: false,
      selectedKey: null,
      selectedValue: null,
      lastUpdated: new Date().toISOString()
    };

    try {
      const stored = await this.storage.getItem<AppState>('appState');
      return stored ? { ...defaultState, ...stored } : defaultState;
    } catch (error) {
      console.warn('Failed to load app state:', error);
      return defaultState;
    }
  }

  // 파일 메타데이터 저장
  async saveFile(file: StoredFile): Promise<void> {
    await this.storage.setItem(`file:${file.id}`, file);

    // 파일 ID 목록 업데이트
    const state = await this.getAppState();
    if (!state.fileIds.includes(file.id)) {
      state.fileIds.push(file.id);
      await this.saveAppState({ fileIds: state.fileIds });
    }
  }

  // 파일 메타데이터 로드
  async getFile(fileId: string): Promise<StoredFile | null> {
    try {
      return await this.storage.getItem<StoredFile>(`file:${fileId}`);
    } catch (error) {
      console.warn(`Failed to load file ${fileId}:`, error);
      return null;
    }
  }

  // 모든 파일 메타데이터 로드
  async getAllFiles(): Promise<StoredFile[]> {
    const state = await this.getAppState();
    const files: StoredFile[] = [];

    for (const fileId of state.fileIds) {
      const file = await this.getFile(fileId);
      if (file) {
        files.push(file);
      }
    }

    return files;
  }

  // 파싱된 콘텐츠 저장
  async saveParsedContent(fileId: string, content: any): Promise<void> {
    const parsedData: StoredParsedContent = {
      fileId,
      content,
      parsedAt: new Date().toISOString()
    };

    await this.storage.setItem(`parsed:${fileId}`, parsedData);
  }

  // 파싱된 콘텐츠 로드
  async getParsedContent(fileId: string): Promise<any> {
    try {
      const stored = await this.storage.getItem<StoredParsedContent>(`parsed:${fileId}`);
      return stored?.content || null;
    } catch (error) {
      console.warn(`Failed to load parsed content for ${fileId}:`, error);
      return null;
    }
  }

  // 파일 삭제
  async deleteFile(fileId: string): Promise<void> {
    await this.storage.removeItem(`file:${fileId}`);
    await this.storage.removeItem(`parsed:${fileId}`);

    // 파일 ID 목록에서 제거
    const state = await this.getAppState();
    const updatedFileIds = state.fileIds.filter(id => id !== fileId);

    // 선택된 파일이 삭제된 경우 선택 해제
    const updates: Partial<AppState> = { fileIds: updatedFileIds };
    if (state.selectedFileId === fileId) {
      updates.selectedFileId = null;
      updates.rightPanelVisible = false;
      updates.selectedKey = null;
      updates.selectedValue = null;
    }

    await this.saveAppState(updates);
  }

  // 모든 데이터 삭제
  async clearAll(): Promise<void> {
    await this.storage.clear();
  }

  // 저장소 정리 (오래된 데이터, 용량 초과 시)
  async cleanup(): Promise<void> {
    const files = await this.getAllFiles();
    const now = new Date();
    const cutoffDate = new Date(now.getTime() - (this.config.dataRetentionDays * 24 * 60 * 60 * 1000));

    // 오래된 파일 삭제
    for (const file of files) {
      const uploadDate = new Date(file.uploadedAt);
      if (uploadDate < cutoffDate) {
        await this.deleteFile(file.id);
      }
    }

    // 파일 수 제한 체크
    const remainingFiles = await this.getAllFiles();
    if (remainingFiles.length > this.config.maxFiles) {
      // 오래된 파일부터 삭제
      const sortedFiles = remainingFiles.sort((a, b) =>
        new Date(a.uploadedAt).getTime() - new Date(b.uploadedAt).getTime()
      );

      const filesToDelete = sortedFiles.slice(0, remainingFiles.length - this.config.maxFiles);
      for (const file of filesToDelete) {
        await this.deleteFile(file.id);
      }
    }
  }

  // 저장소 사용량 정보
  async getStorageInfo(): Promise<{ fileCount: number; estimatedSize: number }> {
    const files = await this.getAllFiles();
    const totalSize = files.reduce((sum, file) => sum + file.size, 0);

    return {
      fileCount: files.length,
      estimatedSize: totalSize
    };
  }
}

// 싱글톤 인스턴스
export const risuStorage = new RisuStorageManager();

// 초기화 함수 (앱 시작 시 호출)
export async function initializeStorage(): Promise<void> {
  await risuStorage.initialize();
}

export type { StoredFile, StoredParsedContent, AppState, StorageConfig };