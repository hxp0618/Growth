import { Platform } from 'react-native';
import { CardConfig, DEFAULT_CARDS } from '../types/cardConfig';

const CARD_CONFIG_KEY = 'card_config';

// Web环境下的存储适配器
const storage = {
  async getItem(key: string): Promise<string | null> {
    if (Platform.OS === 'web') {
      return localStorage.getItem(key);
    } else {
      const AsyncStorage = require('@react-native-async-storage/async-storage').default;
      return await AsyncStorage.getItem(key);
    }
  },
  
  async setItem(key: string, value: string): Promise<void> {
    if (Platform.OS === 'web') {
      localStorage.setItem(key, value);
    } else {
      const AsyncStorage = require('@react-native-async-storage/async-storage').default;
      await AsyncStorage.setItem(key, value);
    }
  },
};

export class CardConfigService {
  private static instance: CardConfigService;
  private cardConfigs: CardConfig[] = [];

  private constructor() {}

  public static getInstance(): CardConfigService {
    if (!CardConfigService.instance) {
      CardConfigService.instance = new CardConfigService();
    }
    return CardConfigService.instance;
  }

  /**
   * 初始化卡片配置
   */
  public async initialize(): Promise<void> {
    try {
      const savedConfig = await storage.getItem(CARD_CONFIG_KEY);
      if (savedConfig) {
        this.cardConfigs = JSON.parse(savedConfig);
        console.log('Loaded saved config:', this.cardConfigs.length, 'cards');
        // 检查是否有新的默认卡片需要添加
        await this.mergeWithDefaultCards();
      } else {
        // 首次使用，使用默认配置
        console.log('No saved config, using defaults:', DEFAULT_CARDS.length, 'cards');
        this.cardConfigs = [...DEFAULT_CARDS];
        await this.saveConfig();
      }
    } catch (error) {
      console.error('Failed to initialize card config:', error);
      this.cardConfigs = [...DEFAULT_CARDS];
      console.log('Using fallback config:', this.cardConfigs.length, 'cards');
    }
  }

  /**
   * 合并默认卡片配置（用于版本更新时添加新卡片）
   */
  private async mergeWithDefaultCards(): Promise<void> {
    const existingIds = new Set(this.cardConfigs.map(card => card.id));
    const newCards = DEFAULT_CARDS.filter(card => !existingIds.has(card.id));
    
    if (newCards.length > 0) {
      // 新卡片默认添加到末尾，且默认隐藏
      const maxOrder = Math.max(...this.cardConfigs.map(card => card.order));
      newCards.forEach((card, index) => {
        card.order = maxOrder + index + 1;
        card.isVisible = false; // 新卡片默认隐藏
      });
      
      this.cardConfigs.push(...newCards);
      await this.saveConfig();
    }
  }

  /**
   * 获取所有卡片配置
   */
  public getCardConfigs(): CardConfig[] {
    return [...this.cardConfigs];
  }

  /**
   * 获取可见的卡片配置（按顺序排列）
   */
  public getVisibleCards(): CardConfig[] {
    return this.cardConfigs
      .filter(card => card.isVisible)
      .sort((a, b) => a.order - b.order);
  }

  /**
   * 获取隐藏的卡片配置
   */
  public getHiddenCards(): CardConfig[] {
    return this.cardConfigs
      .filter(card => !card.isVisible)
      .sort((a, b) => a.order - b.order);
  }

  /**
   * 根据ID获取卡片配置
   */
  public getCardById(id: string): CardConfig | undefined {
    return this.cardConfigs.find(card => card.id === id);
  }

  /**
   * 根据分类获取卡片配置
   */
  public getCardsByCategory(category: string): CardConfig[] {
    return this.cardConfigs
      .filter(card => card.category === category)
      .sort((a, b) => a.order - b.order);
  }

  /**
   * 更新卡片可见性
   */
  public async updateCardVisibility(cardId: string, isVisible: boolean): Promise<void> {
    const cardIndex = this.cardConfigs.findIndex(card => card.id === cardId);
    if (cardIndex !== -1) {
      this.cardConfigs[cardIndex].isVisible = isVisible;
      await this.saveConfig();
    }
  }

  /**
   * 批量更新卡片可见性
   */
  public async updateMultipleCardVisibility(updates: { cardId: string; isVisible: boolean }[]): Promise<void> {
    updates.forEach(({ cardId, isVisible }) => {
      const cardIndex = this.cardConfigs.findIndex(card => card.id === cardId);
      if (cardIndex !== -1) {
        this.cardConfigs[cardIndex].isVisible = isVisible;
      }
    });
    await this.saveConfig();
  }

  /**
   * 更新卡片顺序
   */
  public async updateCardOrder(cardId: string, newOrder: number): Promise<void> {
    const cardIndex = this.cardConfigs.findIndex(card => card.id === cardId);
    if (cardIndex !== -1) {
      const oldOrder = this.cardConfigs[cardIndex].order;
      this.cardConfigs[cardIndex].order = newOrder;

      // 调整其他卡片的顺序
      this.cardConfigs.forEach((card, index) => {
        if (index !== cardIndex) {
          if (newOrder > oldOrder) {
            // 向后移动，前面的卡片顺序减1
            if (card.order > oldOrder && card.order <= newOrder) {
              card.order -= 1;
            }
          } else {
            // 向前移动，后面的卡片顺序加1
            if (card.order >= newOrder && card.order < oldOrder) {
              card.order += 1;
            }
          }
        }
      });

      await this.saveConfig();
    }
  }

  /**
   * 重新排序卡片
   */
  public async reorderCards(cardIds: string[]): Promise<void> {
    const reorderedCards: CardConfig[] = [];
    
    // 按新顺序重新排列卡片
    cardIds.forEach((cardId, index) => {
      const card = this.cardConfigs.find(c => c.id === cardId);
      if (card) {
        card.order = index + 1;
        reorderedCards.push(card);
      }
    });

    // 添加未在新顺序中的卡片
    const reorderedIds = new Set(cardIds);
    const remainingCards = this.cardConfigs.filter(card => !reorderedIds.has(card.id));
    remainingCards.forEach((card, index) => {
      card.order = cardIds.length + index + 1;
      reorderedCards.push(card);
    });

    this.cardConfigs = reorderedCards;
    await this.saveConfig();
  }

  /**
   * 重置为默认配置
   */
  public async resetToDefault(): Promise<void> {
    this.cardConfigs = [...DEFAULT_CARDS];
    await this.saveConfig();
  }

  /**
   * 保存配置到本地存储
   */
  private async saveConfig(): Promise<void> {
    try {
      await storage.setItem(CARD_CONFIG_KEY, JSON.stringify(this.cardConfigs));
    } catch (error) {
      console.error('Failed to save card config:', error);
    }
  }

  /**
   * 导出配置
   */
  public exportConfig(): string {
    return JSON.stringify(this.cardConfigs, null, 2);
  }

  /**
   * 导入配置
   */
  public async importConfig(configJson: string): Promise<boolean> {
    try {
      const importedConfig = JSON.parse(configJson);
      if (Array.isArray(importedConfig) && this.validateConfig(importedConfig)) {
        this.cardConfigs = importedConfig;
        await this.saveConfig();
        return true;
      }
      return false;
    } catch (error) {
      console.error('Failed to import config:', error);
      return false;
    }
  }

  /**
   * 验证配置格式
   */
  private validateConfig(config: any[]): boolean {
    return config.every(card => 
      typeof card.id === 'string' &&
      typeof card.name === 'string' &&
      typeof card.title === 'string' &&
      typeof card.isVisible === 'boolean' &&
      typeof card.order === 'number'
    );
  }
}

// 导出单例实例
export const cardConfigService = CardConfigService.getInstance();