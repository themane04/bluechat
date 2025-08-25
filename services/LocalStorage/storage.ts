import AsyncStorage from '@react-native-async-storage/async-storage';

class StorageService {
  static async setItem<T>(key: string, value: T): Promise<void> {
    try {
      const jsonValue = JSON.stringify(value);
      await AsyncStorage.setItem(key, jsonValue);
    } catch (e) {
      console.error(`Error saving "${key}" to storage`, e);
    }
  }

  static async getItem<T>(key: string): Promise<T | null> {
    try {
      const jsonValue = await AsyncStorage.getItem(key);
      return jsonValue != null ? (JSON.parse(jsonValue) as T) : null;
    } catch (e) {
      console.error(`Error reading "${key}" from storage`, e);
      return null;
    }
  }

  static async getItemById<T extends { id: string | number }>(
    key: string,
    id: string | number,
  ): Promise<T | null> {
    try {
      const jsonValue = await AsyncStorage.getItem(key);
      if (!jsonValue) return null;
      const items: T[] = JSON.parse(jsonValue);
      // Find the item with the matching id
      const item = items.find(i => i.id === id);
      return item ?? null;
    } catch (e) {
      console.error(`Error reading "${key}" by id from storage`, e);
      return null;
    }
  }

  static async removeItem(key: string): Promise<void> {
    try {
      await AsyncStorage.removeItem(key);
    } catch (e) {
      console.error(`Error removing "${key}" from storage`, e);
    }
  }

  static async clear(): Promise<void> {
    try {
      await AsyncStorage.clear();
    } catch (e) {
      console.error('Error clearing storage', e);
    }
  }
}

export default StorageService;
