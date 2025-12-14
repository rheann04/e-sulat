// Storage utility that mimics AsyncStorage API for web
// This makes it easier to port to React Native later

class WebStorage {
  private isClient(): boolean {
    return typeof window !== 'undefined';
  }

  async getItem(key: string): Promise<string | null> {
    try {
      if (!this.isClient()) return null;
      return localStorage.getItem(key);
    } catch (error) {
      console.error('Storage getItem error:', error);
      return null;
    }
  }

  async setItem(key: string, value: string): Promise<void> {
    try {
      if (!this.isClient()) return;
      localStorage.setItem(key, value);
    } catch (error) {
      console.error('Storage setItem error:', error);
    }
  }

  async removeItem(key: string): Promise<void> {
    try {
      if (!this.isClient()) return;
      localStorage.removeItem(key);
    } catch (error) {
      console.error('Storage removeItem error:', error);
    }
  }

  async clear(): Promise<void> {
    try {
      if (!this.isClient()) return;
      localStorage.clear();
    } catch (error) {
      console.error('Storage clear error:', error);
    }
  }

  async getAllKeys(): Promise<string[]> {
    try {
      if (!this.isClient()) return [];
      return Object.keys(localStorage);
    } catch (error) {
      console.error('Storage getAllKeys error:', error);
      return [];
    }
  }
}

// Export a singleton instance
export const AsyncStorage = new WebStorage();

// Helper functions for common operations
export const StorageKeys = {
  FOLDERS: 'folders',
  NOTES: 'notes',
  ARCHIVED_NOTES: 'archivedNotes',
  TRASHED_NOTES: 'trashedNotes',
  HIDE_WELCOME: 'hideWelcome',
} as const;

// Typed storage helpers
export const StorageHelpers = {
  async getFolders() {
    const data = await AsyncStorage.getItem(StorageKeys.FOLDERS);
    return data ? JSON.parse(data) : [];
  },

  async setFolders(folders: any[]) {
    await AsyncStorage.setItem(StorageKeys.FOLDERS, JSON.stringify(folders));
  },

  async getNotes() {
    const data = await AsyncStorage.getItem(StorageKeys.NOTES);
    return data ? JSON.parse(data) : [];
  },

  async setNotes(notes: any[]) {
    await AsyncStorage.setItem(StorageKeys.NOTES, JSON.stringify(notes));
  },

  async getArchivedNotes() {
    const data = await AsyncStorage.getItem(StorageKeys.ARCHIVED_NOTES);
    return data ? JSON.parse(data) : [];
  },

  async setArchivedNotes(notes: any[]) {
    await AsyncStorage.setItem(StorageKeys.ARCHIVED_NOTES, JSON.stringify(notes));
  },

  async getTrashedNotes() {
    const data = await AsyncStorage.getItem(StorageKeys.TRASHED_NOTES);
    return data ? JSON.parse(data) : [];
  },

  async setTrashedNotes(notes: any[]) {
    await AsyncStorage.setItem(StorageKeys.TRASHED_NOTES, JSON.stringify(notes));
  },

  async getHideWelcome() {
    const data = await AsyncStorage.getItem(StorageKeys.HIDE_WELCOME);
    return data === 'true';
  },

  async setHideWelcome(hide: boolean) {
    await AsyncStorage.setItem(StorageKeys.HIDE_WELCOME, hide.toString());
  },
};