import AsyncStorage from '@react-native-async-storage/async-storage';
import { LegacyStory, InterviewSession, UserProfile, Photo } from '../types';

/**
 * Local Storage Service
 * Handles saving and retrieving data from device storage
 */

const STORAGE_KEYS = {
  STORIES: '@annes_diary:stories',
  SESSIONS: '@annes_diary:sessions',
  USER_PROFILE: '@annes_diary:user_profile',
  SETTINGS: '@annes_diary:settings',
  USER_PHOTOS: '@annes_diary:user_photos',
};

export class StorageService {
  /**
   * Save a legacy story
   */
  async saveStory(story: LegacyStory): Promise<void> {
    try {
      const stories = await this.getAllStories();
      const existingIndex = stories.findIndex((s) => s.id === story.id);

      if (existingIndex >= 0) {
        // Update existing story
        stories[existingIndex] = story;
      } else {
        // Add new story
        stories.push(story);
      }

      await AsyncStorage.setItem(STORAGE_KEYS.STORIES, JSON.stringify(stories));
    } catch (error) {
      console.error('Error saving story:', error);
      throw error;
    }
  }

  /**
   * Get all legacy stories
   */
  async getAllStories(): Promise<LegacyStory[]> {
    try {
      const data = await AsyncStorage.getItem(STORAGE_KEYS.STORIES);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Error getting stories:', error);
      return [];
    }
  }

  /**
   * Get a single story by ID
   */
  async getStory(storyId: string): Promise<LegacyStory | null> {
    try {
      const stories = await this.getAllStories();
      return stories.find((s) => s.id === storyId) || null;
    } catch (error) {
      console.error('Error getting story:', error);
      return null;
    }
  }

  /**
   * Delete a story
   */
  async deleteStory(storyId: string): Promise<void> {
    try {
      const stories = await this.getAllStories();
      const filtered = stories.filter((s) => s.id !== storyId);
      await AsyncStorage.setItem(STORAGE_KEYS.STORIES, JSON.stringify(filtered));
    } catch (error) {
      console.error('Error deleting story:', error);
      throw error;
    }
  }

  /**
   * Save an interview session
   */
  async saveSession(session: InterviewSession): Promise<void> {
    try {
      const sessions = await this.getAllSessions();
      const existingIndex = sessions.findIndex((s) => s.id === session.id);

      if (existingIndex >= 0) {
        sessions[existingIndex] = session;
      } else {
        sessions.push(session);
      }

      await AsyncStorage.setItem(
        STORAGE_KEYS.SESSIONS,
        JSON.stringify(sessions)
      );
    } catch (error) {
      console.error('Error saving session:', error);
      throw error;
    }
  }

  /**
   * Get all interview sessions
   */
  async getAllSessions(): Promise<InterviewSession[]> {
    try {
      const data = await AsyncStorage.getItem(STORAGE_KEYS.SESSIONS);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Error getting sessions:', error);
      return [];
    }
  }

  /**
   * Get a single session by ID
   */
  async getSession(sessionId: string): Promise<InterviewSession | null> {
    try {
      const sessions = await this.getAllSessions();
      return sessions.find((s) => s.id === sessionId) || null;
    } catch (error) {
      console.error('Error getting session:', error);
      return null;
    }
  }

  /**
   * Delete a session
   */
  async deleteSession(sessionId: string): Promise<void> {
    try {
      const sessions = await this.getAllSessions();
      const filtered = sessions.filter((s) => s.id !== sessionId);
      await AsyncStorage.setItem(
        STORAGE_KEYS.SESSIONS,
        JSON.stringify(filtered)
      );
    } catch (error) {
      console.error('Error deleting session:', error);
      throw error;
    }
  }

  /**
   * Save user profile
   */
  async saveUserProfile(profile: UserProfile): Promise<void> {
    try {
      await AsyncStorage.setItem(
        STORAGE_KEYS.USER_PROFILE,
        JSON.stringify(profile)
      );
    } catch (error) {
      console.error('Error saving user profile:', error);
      throw error;
    }
  }

  /**
   * Get user profile
   */
  async getUserProfile(): Promise<UserProfile | null> {
    try {
      const data = await AsyncStorage.getItem(STORAGE_KEYS.USER_PROFILE);
      return data ? JSON.parse(data) : null;
    } catch (error) {
      console.error('Error getting user profile:', error);
      return null;
    }
  }

  /**
   * Save settings
   */
  async saveSettings(settings: any): Promise<void> {
    try {
      await AsyncStorage.setItem(
        STORAGE_KEYS.SETTINGS,
        JSON.stringify(settings)
      );
    } catch (error) {
      console.error('Error saving settings:', error);
      throw error;
    }
  }

  /**
   * Get settings
   */
  async getSettings(): Promise<any> {
    try {
      const data = await AsyncStorage.getItem(STORAGE_KEYS.SETTINGS);
      return data ? JSON.parse(data) : {};
    } catch (error) {
      console.error('Error getting settings:', error);
      return {};
    }
  }

  /**
   * Save user photos
   */
  async saveUserPhotos(photos: Photo[]): Promise<void> {
    try {
      await AsyncStorage.setItem(
        STORAGE_KEYS.USER_PHOTOS,
        JSON.stringify(photos)
      );
    } catch (error) {
      console.error('Error saving user photos:', error);
      throw error;
    }
  }

  /**
   * Get user photos
   */
  async getUserPhotos(): Promise<Photo[]> {
    try {
      const data = await AsyncStorage.getItem(STORAGE_KEYS.USER_PHOTOS);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Error getting user photos:', error);
      return [];
    }
  }

  /**
   * Initialize default stories if none exist
   */
  async initializeDefaultStories(defaultStories: LegacyStory[]): Promise<void> {
    try {
      for (const defaultStory of defaultStories) {
        await this.saveStory(defaultStory);
      }
    } catch (error) {
      console.error('Error initializing default stories:', error);
      throw error;
    }
  }

  /**
   * Clear all data (use with caution)
   */
  async clearAll(): Promise<void> {
    try {
      await AsyncStorage.multiRemove(Object.values(STORAGE_KEYS));
    } catch (error) {
      console.error('Error clearing all data:', error);
      throw error;
    }
  }
}

// Export singleton instance
export const storageService = new StorageService();
