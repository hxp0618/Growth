// 待产包清单服务
export interface DeliveryBagItem {
  id: string;
  name: string;
  category: 'mother' | 'baby' | 'hospital' | 'postpartum';
  quantity: number;
  unit: string;
  isChecked: boolean;
  priority: 'high' | 'medium' | 'low';
  description?: string;
  tips?: string;
  pregnancyWeekStart?: number; // 建议开始准备的孕周
  pregnancyWeekEnd?: number; // 建议完成准备的孕周
  brand?: string;
  estimatedPrice?: number;
  purchaseUrl?: string;
  isPurchased: boolean;
  purchaseDate?: Date;
  notes?: string;
}

export interface DeliveryBagCategory {
  id: string;
  name: string;
  icon: string;
  description: string;
  color: string;
  totalItems: number;
  checkedItems: number;
  completionRate: number;
}

export interface DeliveryBagTemplate {
  id: string;
  name: string;
  description: string;
  pregnancyWeekRange: { start: number; end: number };
  items: DeliveryBagItem[];
  isRecommended: boolean;
}

export interface DeliveryBagProgress {
  totalItems: number;
  checkedItems: number;
  purchasedItems: number;
  completionRate: number;
  categoryProgress: { [key: string]: { checked: number; total: number; rate: number } };
  urgentItems: DeliveryBagItem[];
  recentlyAdded: DeliveryBagItem[];
}

class DeliveryBagService {
  private items: DeliveryBagItem[] = [];
  private templates: DeliveryBagTemplate[] = [];

  constructor() {
    this.initializeTemplates();
    this.generateMockData();
  }

  private initializeTemplates() {
    this.templates = [
      {
        id: 'basic_template',
        name: '基础待产包',
        description: '包含最基本的待产用品，适合预算有限的准妈妈',
        pregnancyWeekRange: { start: 32, end: 36 },
        isRecommended: true,
        items: this.getBasicTemplateItems()
      },
      {
        id: 'complete_template',
        name: '完整待产包',
        description: '全面的待产用品清单，确保万无一失',
        pregnancyWeekRange: { start: 30, end: 36 },
        isRecommended: true,
        items: this.getCompleteTemplateItems()
      },
      {
        id: 'luxury_template',
        name: '豪华待产包',
        description: '高品质待产用品，给妈妈和宝宝最好的呵护',
        pregnancyWeekRange: { start: 28, end: 34 },
        isRecommended: false,
        items: this.getLuxuryTemplateItems()
      }
    ];
  }

  private getBasicTemplateItems(): DeliveryBagItem[] {
    return [
      // 妈妈用品
      {
        id: 'basic_mom_1',
        name: '产妇卫生巾',
        category: 'mother',
        quantity: 3,
        unit: '包',
        isChecked: false,
        priority: 'high',
        description: '产后专用，超长夜用型',
        tips: '选择透气性好的品牌',
        pregnancyWeekStart: 32,
        pregnancyWeekEnd: 36,
        estimatedPrice: 60,
        isPurchased: false
      },
      {
        id: 'basic_mom_2',
        name: '哺乳内衣',
        category: 'mother',
        quantity: 3,
        unit: '件',
        isChecked: false,
        priority: 'high',
        description: '前开扣式，方便哺乳',
        tips: '建议比孕期内衣大一个罩杯',
        pregnancyWeekStart: 30,
        pregnancyWeekEnd: 36,
        estimatedPrice: 150,
        isPurchased: false
      },
      {
        id: 'basic_mom_3',
        name: '月子服',
        category: 'mother',
        quantity: 3,
        unit: '套',
        isChecked: false,
        priority: 'medium',
        description: '纯棉材质，前开扣',
        tips: '选择宽松舒适的款式',
        pregnancyWeekStart: 32,
        pregnancyWeekEnd: 36,
        estimatedPrice: 200,
        isPurchased: false
      },
      // 宝宝用品
      {
        id: 'basic_baby_1',
        name: '新生儿纸尿裤',
        category: 'baby',
        quantity: 2,
        unit: '包',
        isChecked: false,
        priority: 'high',
        description: 'NB码，适合新生儿',
        tips: '不要囤太多，宝宝长得很快',
        pregnancyWeekStart: 32,
        pregnancyWeekEnd: 36,
        estimatedPrice: 100,
        isPurchased: false
      },
      {
        id: 'basic_baby_2',
        name: '婴儿连体衣',
        category: 'baby',
        quantity: 5,
        unit: '件',
        isChecked: false,
        priority: 'high',
        description: '纯棉材质，52-59码',
        tips: '选择前开扣或侧开扣的款式',
        pregnancyWeekStart: 30,
        pregnancyWeekEnd: 36,
        estimatedPrice: 150,
        isPurchased: false
      },
      {
        id: 'basic_baby_3',
        name: '婴儿包被',
        category: 'baby',
        quantity: 2,
        unit: '条',
        isChecked: false,
        priority: 'medium',
        description: '纯棉纱布材质',
        tips: '准备厚薄各一条',
        pregnancyWeekStart: 32,
        pregnancyWeekEnd: 36,
        estimatedPrice: 80,
        isPurchased: false
      },
      // 医院用品
      {
        id: 'basic_hospital_1',
        name: '身份证件',
        category: 'hospital',
        quantity: 1,
        unit: '套',
        isChecked: false,
        priority: 'high',
        description: '身份证、户口本、准生证、产检资料',
        tips: '提前复印备份',
        pregnancyWeekStart: 28,
        pregnancyWeekEnd: 32,
        estimatedPrice: 0,
        isPurchased: false
      },
      {
        id: 'basic_hospital_2',
        name: '洗漱用品',
        category: 'hospital',
        quantity: 1,
        unit: '套',
        isChecked: false,
        priority: 'medium',
        description: '牙刷、牙膏、毛巾、洗面奶等',
        tips: '选择旅行装',
        pregnancyWeekStart: 32,
        pregnancyWeekEnd: 36,
        estimatedPrice: 50,
        isPurchased: false
      }
    ];
  }

  private getCompleteTemplateItems(): DeliveryBagItem[] {
    const basicItems = this.getBasicTemplateItems();
    const additionalItems: DeliveryBagItem[] = [
      // 额外的妈妈用品
      {
        id: 'complete_mom_1',
        name: '防溢乳垫',
        category: 'mother',
        quantity: 2,
        unit: '盒',
        isChecked: false,
        priority: 'medium',
        description: '一次性防溢乳垫',
        tips: '选择透气性好的品牌',
        pregnancyWeekStart: 32,
        pregnancyWeekEnd: 36,
        estimatedPrice: 40,
        isPurchased: false
      },
      {
        id: 'complete_mom_2',
        name: '产后收腹带',
        category: 'mother',
        quantity: 1,
        unit: '条',
        isChecked: false,
        priority: 'medium',
        description: '帮助产后恢复',
        tips: '选择透气材质',
        pregnancyWeekStart: 30,
        pregnancyWeekEnd: 36,
        estimatedPrice: 120,
        isPurchased: false
      },
      // 额外的宝宝用品
      {
        id: 'complete_baby_1',
        name: '婴儿湿巾',
        category: 'baby',
        quantity: 5,
        unit: '包',
        isChecked: false,
        priority: 'medium',
        description: '无酒精、无香料',
        tips: '选择大品牌，质量有保障',
        pregnancyWeekStart: 32,
        pregnancyWeekEnd: 36,
        estimatedPrice: 100,
        isPurchased: false
      },
      {
        id: 'complete_baby_2',
        name: '婴儿奶瓶',
        category: 'baby',
        quantity: 2,
        unit: '个',
        isChecked: false,
        priority: 'medium',
        description: '玻璃材质，120ml',
        tips: '备用，以防母乳不足',
        pregnancyWeekStart: 30,
        pregnancyWeekEnd: 36,
        estimatedPrice: 160,
        isPurchased: false
      },
      // 产后用品
      {
        id: 'complete_postpartum_1',
        name: '月子帽',
        category: 'postpartum',
        quantity: 2,
        unit: '顶',
        isChecked: false,
        priority: 'low',
        description: '纯棉材质，保暖透气',
        tips: '传统月子必备',
        pregnancyWeekStart: 32,
        pregnancyWeekEnd: 36,
        estimatedPrice: 30,
        isPurchased: false
      }
    ];

    return [...basicItems, ...additionalItems];
  }

  private getLuxuryTemplateItems(): DeliveryBagItem[] {
    const completeItems = this.getCompleteTemplateItems();
    const luxuryItems: DeliveryBagItem[] = [
      {
        id: 'luxury_mom_1',
        name: '高端产妇卫生巾',
        category: 'mother',
        quantity: 5,
        unit: '包',
        isChecked: false,
        priority: 'high',
        description: '进口品牌，超柔软',
        tips: '品质更好，更舒适',
        pregnancyWeekStart: 28,
        pregnancyWeekEnd: 34,
        estimatedPrice: 200,
        isPurchased: false
      },
      {
        id: 'luxury_baby_1',
        name: '有机棉婴儿服',
        category: 'baby',
        quantity: 8,
        unit: '件',
        isChecked: false,
        priority: 'medium',
        description: '100%有机棉，多种尺码',
        tips: '对宝宝皮肤更温和',
        pregnancyWeekStart: 28,
        pregnancyWeekEnd: 34,
        estimatedPrice: 400,
        isPurchased: false
      }
    ];

    return [...completeItems, ...luxuryItems];
  }

  private generateMockData() {
    // 使用基础模板作为默认清单
    const basicTemplate = this.templates.find(t => t.id === 'basic_template');
    if (basicTemplate) {
      this.items = basicTemplate.items.map(item => ({
        ...item,
        // 随机设置一些项目为已完成
        isChecked: Math.random() > 0.7,
        isPurchased: Math.random() > 0.8,
        purchaseDate: Math.random() > 0.8 ? new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000) : undefined
      }));
    }
  }

  // 获取所有清单项目
  getItems(category?: string): DeliveryBagItem[] {
    let filtered = this.items;
    
    if (category) {
      filtered = filtered.filter(item => item.category === category);
    }
    
    return filtered.sort((a, b) => {
      // 按优先级排序
      const priorityOrder = { high: 3, medium: 2, low: 1 };
      if (priorityOrder[a.priority] !== priorityOrder[b.priority]) {
        return priorityOrder[b.priority] - priorityOrder[a.priority];
      }
      // 按名称排序
      return a.name.localeCompare(b.name);
    });
  }

  // 获取分类信息
  getCategories(): DeliveryBagCategory[] {
    const categories = [
      { id: 'mother', name: '妈妈用品', icon: '🤱', description: '产妇专用物品', color: '#FF6B9D' },
      { id: 'baby', name: '宝宝用品', icon: '👶', description: '新生儿必需品', color: '#4ECDC4' },
      { id: 'hospital', name: '医院用品', icon: '🏥', description: '住院期间用品', color: '#45B7D1' },
      { id: 'postpartum', name: '产后用品', icon: '🏠', description: '月子期间用品', color: '#96CEB4' }
    ];

    return categories.map(cat => {
      const categoryItems = this.getItems(cat.id);
      const checkedItems = categoryItems.filter(item => item.isChecked).length;
      
      return {
        ...cat,
        totalItems: categoryItems.length,
        checkedItems,
        completionRate: categoryItems.length > 0 ? Math.round((checkedItems / categoryItems.length) * 100) : 0
      };
    });
  }

  // 获取进度信息
  getProgress(): DeliveryBagProgress {
    const totalItems = this.items.length;
    const checkedItems = this.items.filter(item => item.isChecked).length;
    const purchasedItems = this.items.filter(item => item.isPurchased).length;
    const completionRate = totalItems > 0 ? Math.round((checkedItems / totalItems) * 100) : 0;

    // 分类进度
    const categoryProgress: { [key: string]: { checked: number; total: number; rate: number } } = {};
    const categories = this.getCategories();
    categories.forEach(cat => {
      categoryProgress[cat.id] = {
        checked: cat.checkedItems,
        total: cat.totalItems,
        rate: cat.completionRate
      };
    });

    // 紧急项目（高优先级且未完成）
    const urgentItems = this.items.filter(item => 
      item.priority === 'high' && !item.isChecked
    ).slice(0, 5);

    // 最近添加的项目
    const recentlyAdded = this.items
      .filter(item => item.purchaseDate)
      .sort((a, b) => (b.purchaseDate?.getTime() || 0) - (a.purchaseDate?.getTime() || 0))
      .slice(0, 3);

    return {
      totalItems,
      checkedItems,
      purchasedItems,
      completionRate,
      categoryProgress,
      urgentItems,
      recentlyAdded
    };
  }

  // 切换项目完成状态
  toggleItemChecked(itemId: string): boolean {
    const item = this.items.find(i => i.id === itemId);
    if (item) {
      item.isChecked = !item.isChecked;
      return item.isChecked;
    }
    return false;
  }

  // 切换项目购买状态
  toggleItemPurchased(itemId: string): boolean {
    const item = this.items.find(i => i.id === itemId);
    if (item) {
      item.isPurchased = !item.isPurchased;
      if (item.isPurchased) {
        item.purchaseDate = new Date();
      } else {
        item.purchaseDate = undefined;
      }
      return item.isPurchased;
    }
    return false;
  }

  // 添加自定义项目
  addCustomItem(itemData: Omit<DeliveryBagItem, 'id' | 'isChecked' | 'isPurchased'>): DeliveryBagItem {
    const newItem: DeliveryBagItem = {
      ...itemData,
      id: `custom_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      isChecked: false,
      isPurchased: false
    };

    this.items.push(newItem);
    return newItem;
  }

  // 删除项目
  deleteItem(itemId: string): boolean {
    const index = this.items.findIndex(i => i.id === itemId);
    if (index !== -1) {
      this.items.splice(index, 1);
      return true;
    }
    return false;
  }

  // 更新项目
  updateItem(itemId: string, updates: Partial<DeliveryBagItem>): DeliveryBagItem | null {
    const item = this.items.find(i => i.id === itemId);
    if (item) {
      Object.assign(item, updates);
      return item;
    }
    return null;
  }

  // 应用模板
  applyTemplate(templateId: string, replaceExisting: boolean = false): boolean {
    const template = this.templates.find(t => t.id === templateId);
    if (!template) return false;

    if (replaceExisting) {
      this.items = [...template.items];
    } else {
      // 合并模板，避免重复
      const existingNames = new Set(this.items.map(item => item.name));
      const newItems = template.items.filter(item => !existingNames.has(item.name));
      this.items.push(...newItems);
    }

    return true;
  }

  // 获取模板列表
  getTemplates(): DeliveryBagTemplate[] {
    return this.templates;
  }

  // 根据孕周获取建议项目
  getRecommendedItems(pregnancyWeek: number): DeliveryBagItem[] {
    return this.items.filter(item => {
      const startWeek = item.pregnancyWeekStart || 0;
      const endWeek = item.pregnancyWeekEnd || 40;
      return pregnancyWeek >= startWeek && pregnancyWeek <= endWeek && !item.isChecked;
    }).slice(0, 5);
  }

  // 获取购物清单（未购买的项目）
  getShoppingList(): DeliveryBagItem[] {
    return this.items
      .filter(item => !item.isPurchased)
      .sort((a, b) => {
        const priorityOrder = { high: 3, medium: 2, low: 1 };
        return priorityOrder[b.priority] - priorityOrder[a.priority];
      });
  }

  // 计算总预算
  getTotalBudget(): { total: number; purchased: number; remaining: number } {
    const total = this.items.reduce((sum, item) => sum + (item.estimatedPrice || 0), 0);
    const purchased = this.items
      .filter(item => item.isPurchased)
      .reduce((sum, item) => sum + (item.estimatedPrice || 0), 0);
    const remaining = total - purchased;

    return { total, purchased, remaining };
  }

  // 导出清单
  exportList(): string {
    const categories = this.getCategories();
    let exportText = '待产包清单\n\n';

    categories.forEach(category => {
      const categoryItems = this.getItems(category.id);
      if (categoryItems.length === 0) return;

      exportText += `${category.icon} ${category.name}\n`;
      exportText += `完成度: ${category.completionRate}% (${category.checkedItems}/${category.totalItems})\n\n`;

      categoryItems.forEach(item => {
        const status = item.isChecked ? '✅' : '⬜';
        const purchased = item.isPurchased ? '🛒' : '';
        exportText += `${status} ${item.name} x${item.quantity}${item.unit} ${purchased}\n`;
        if (item.description) {
          exportText += `   ${item.description}\n`;
        }
        if (item.tips) {
          exportText += `   💡 ${item.tips}\n`;
        }
        exportText += '\n';
      });

      exportText += '\n';
    });

    const budget = this.getTotalBudget();
    exportText += `预算统计:\n`;
    exportText += `总预算: ¥${budget.total}\n`;
    exportText += `已购买: ¥${budget.purchased}\n`;
    exportText += `剩余: ¥${budget.remaining}\n`;

    return exportText;
  }
}

export const deliveryBagService = new DeliveryBagService();