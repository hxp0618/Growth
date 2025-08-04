export interface FoodItem {
  id: string;
  name: string;
  category: 'vegetable' | 'fruit' | 'protein' | 'dairy' | 'grain' | 'snack' | 'beverage';
  status: 'recommended' | 'limited' | 'forbidden';
  icon: string;
  reason: string;
  limit?: string;
  nutritionBenefits?: string[];
  alternatives?: string[];
  season?: 'spring' | 'summer' | 'autumn' | 'winter' | 'all';
}

export interface NutritionRecommendation {
  pregnancyWeek: number;
  recommendedFoods: FoodItem[];
  limitedFoods: FoodItem[];
  forbiddenFoods: FoodItem[];
  dailyTips: string[];
  seasonalRecommendations: FoodItem[];
}

export interface NutritionTarget {
  calories: number;
  protein: number;
  calcium: number;
  iron: number;
  folicAcid: number;
  vitaminC: number;
  dha: number;
}

class NutritionService {
  /**
   * 获取孕期营养推荐
   */
  getNutritionRecommendation(pregnancyWeek: number): NutritionRecommendation {
    const allFoods = this.getFoodDatabase();
    const currentSeason = this.getCurrentSeason();
    
    // 根据孕周筛选适合的食物
    const recommendedFoods = allFoods.filter(food => 
      food.status === 'recommended' && this.isFoodSuitableForWeek(food, pregnancyWeek)
    );
    
    const limitedFoods = allFoods.filter(food => 
      food.status === 'limited'
    );
    
    const forbiddenFoods = allFoods.filter(food => 
      food.status === 'forbidden'
    );
    
    // 应季食物推荐
    const seasonalRecommendations = allFoods.filter(food => 
      food.status === 'recommended' && 
      (food.season === currentSeason || food.season === 'all')
    ).slice(0, 6);
    
    return {
      pregnancyWeek,
      recommendedFoods: recommendedFoods.slice(0, 8),
      limitedFoods: limitedFoods.slice(0, 6),
      forbiddenFoods: forbiddenFoods.slice(0, 6),
      dailyTips: this.getDailyNutritionTips(pregnancyWeek),
      seasonalRecommendations
    };
  }

  /**
   * 获取营养目标
   */
  getNutritionTargets(pregnancyWeek: number): NutritionTarget {
    // 基础营养需求
    let baseCalories = 2200;
    let baseProtein = 75;
    let baseCalcium = 1000;
    let baseIron = 27;
    let baseFolicAcid = 600;
    let baseVitaminC = 85;
    let baseDHA = 200;

    // 根据孕期阶段调整
    if (pregnancyWeek <= 12) {
      // 孕早期
      baseCalories = 2000;
      baseFolicAcid = 800; // 孕早期需要更多叶酸
    } else if (pregnancyWeek <= 28) {
      // 孕中期
      baseCalories = 2200;
      baseProtein = 80;
    } else {
      // 孕晚期
      baseCalories = 2400;
      baseProtein = 85;
      baseCalcium = 1200;
    }

    return {
      calories: baseCalories,
      protein: baseProtein,
      calcium: baseCalcium,
      iron: baseIron,
      folicAcid: baseFolicAcid,
      vitaminC: baseVitaminC,
      dha: baseDHA
    };
  }

  /**
   * 获取每日营养建议
   */
  getDailyNutritionTips(pregnancyWeek: number): string[] {
    const tips: string[] = [];
    
    if (pregnancyWeek <= 12) {
      tips.push('多吃富含叶酸的食物，如菠菜、西兰花');
      tips.push('少食多餐，缓解孕吐反应');
      tips.push('避免生冷食物，注意食品安全');
      tips.push('补充维生素B6，有助缓解晨吐');
    } else if (pregnancyWeek <= 28) {
      tips.push('增加蛋白质摄入，促进胎儿发育');
      tips.push('多吃含钙食物，如奶制品、豆腐');
      tips.push('适量摄入坚果，补充DHA');
      tips.push('控制糖分摄入，预防妊娠糖尿病');
    } else {
      tips.push('注意铁质补充，预防贫血');
      tips.push('控制盐分摄入，预防水肿');
      tips.push('少量多餐，减轻胃部压迫感');
      tips.push('多吃富含纤维的食物，预防便秘');
    }
    
    // 添加通用建议
    tips.push('每天喝足够的水，保持身体水分');
    tips.push('选择新鲜食材，避免加工食品');
    
    return tips;
  }

  /**
   * 获取当前季节
   */
  private getCurrentSeason(): 'spring' | 'summer' | 'autumn' | 'winter' {
    const month = new Date().getMonth() + 1;
    
    if (month >= 3 && month <= 5) return 'spring';
    if (month >= 6 && month <= 8) return 'summer';
    if (month >= 9 && month <= 11) return 'autumn';
    return 'winter';
  }

  /**
   * 判断食物是否适合当前孕周
   */
  private isFoodSuitableForWeek(food: FoodItem, week: number): boolean {
    // 这里可以根据具体需求添加更复杂的逻辑
    return true;
  }

  /**
   * 食物数据库
   */
  private getFoodDatabase(): FoodItem[] {
    return [
      // 推荐蔬菜
      {
        id: 'spinach',
        name: '菠菜',
        category: 'vegetable',
        status: 'recommended',
        icon: '🥬',
        reason: '富含叶酸和铁质',
        nutritionBenefits: ['叶酸', '铁', '维生素K'],
        season: 'all'
      },
      {
        id: 'broccoli',
        name: '西兰花',
        category: 'vegetable',
        status: 'recommended',
        icon: '🥦',
        reason: '富含维生素C和叶酸',
        nutritionBenefits: ['维生素C', '叶酸', '纤维'],
        season: 'all'
      },
      {
        id: 'carrot',
        name: '胡萝卜',
        category: 'vegetable',
        status: 'recommended',
        icon: '🥕',
        reason: '富含胡萝卜素',
        nutritionBenefits: ['维生素A', '纤维', '钾'],
        season: 'all'
      },
      {
        id: 'tomato',
        name: '番茄',
        category: 'vegetable',
        status: 'recommended',
        icon: '🍅',
        reason: '富含维生素C和番茄红素',
        nutritionBenefits: ['维生素C', '番茄红素', '钾'],
        season: 'summer'
      },

      // 推荐水果
      {
        id: 'apple',
        name: '苹果',
        category: 'fruit',
        status: 'recommended',
        icon: '🍎',
        reason: '富含纤维和维生素',
        nutritionBenefits: ['纤维', '维生素C', '钾'],
        season: 'autumn'
      },
      {
        id: 'orange',
        name: '橙子',
        category: 'fruit',
        status: 'recommended',
        icon: '🍊',
        reason: '富含维生素C和叶酸',
        nutritionBenefits: ['维生素C', '叶酸', '纤维'],
        season: 'winter'
      },
      {
        id: 'banana',
        name: '香蕉',
        category: 'fruit',
        status: 'recommended',
        icon: '🍌',
        reason: '富含钾和维生素B6',
        nutritionBenefits: ['钾', '维生素B6', '纤维'],
        season: 'all'
      },
      {
        id: 'kiwi',
        name: '猕猴桃',
        category: 'fruit',
        status: 'recommended',
        icon: '🥝',
        reason: '维生素C含量极高',
        nutritionBenefits: ['维生素C', '叶酸', '纤维'],
        season: 'autumn'
      },

      // 推荐蛋白质
      {
        id: 'salmon',
        name: '三文鱼',
        category: 'protein',
        status: 'recommended',
        icon: '🐟',
        reason: '富含DHA和优质蛋白',
        nutritionBenefits: ['DHA', '蛋白质', 'Omega-3'],
        season: 'all'
      },
      {
        id: 'egg',
        name: '鸡蛋',
        category: 'protein',
        status: 'recommended',
        icon: '🥚',
        reason: '完整蛋白质来源',
        nutritionBenefits: ['蛋白质', '胆碱', '维生素D'],
        season: 'all'
      },
      {
        id: 'chicken',
        name: '鸡肉',
        category: 'protein',
        status: 'recommended',
        icon: '🐔',
        reason: '优质蛋白质，低脂肪',
        nutritionBenefits: ['蛋白质', '铁', '锌'],
        season: 'all'
      },

      // 推荐奶制品
      {
        id: 'milk',
        name: '牛奶',
        category: 'dairy',
        status: 'recommended',
        icon: '🥛',
        reason: '富含钙质和蛋白质',
        nutritionBenefits: ['钙', '蛋白质', '维生素D'],
        season: 'all'
      },
      {
        id: 'yogurt',
        name: '酸奶',
        category: 'dairy',
        status: 'recommended',
        icon: '🍶',
        reason: '含益生菌，助消化',
        nutritionBenefits: ['钙', '蛋白质', '益生菌'],
        season: 'all'
      },

      // 限量食物
      {
        id: 'mango',
        name: '芒果',
        category: 'fruit',
        status: 'limited',
        icon: '🥭',
        reason: '含糖量较高',
        limit: '每日不超过200g',
        alternatives: ['苹果', '梨'],
        season: 'summer'
      },
      {
        id: 'watermelon',
        name: '西瓜',
        category: 'fruit',
        status: 'limited',
        icon: '🍉',
        reason: '利尿作用强，含糖量高',
        limit: '每日不超过300g',
        alternatives: ['橙子', '柚子'],
        season: 'summer'
      },
      {
        id: 'coffee',
        name: '咖啡',
        category: 'beverage',
        status: 'limited',
        icon: '☕',
        reason: '含咖啡因',
        limit: '每日不超过200mg咖啡因',
        alternatives: ['柠檬蜂蜜水', '孕妇奶粉'],
        season: 'all'
      },
      {
        id: 'chocolate',
        name: '巧克力',
        category: 'snack',
        status: 'limited',
        icon: '🍫',
        reason: '含糖量和咖啡因较高',
        limit: '每日不超过30g',
        alternatives: ['坚果', '酸奶'],
        season: 'all'
      },

      // 禁忌食物
      {
        id: 'raw_fish',
        name: '生鱼片',
        category: 'protein',
        status: 'forbidden',
        icon: '🍣',
        reason: '可能含有细菌和寄生虫',
        alternatives: ['熟鱼', '虾'],
        season: 'all'
      },
      {
        id: 'raw_oyster',
        name: '生蚝',
        category: 'protein',
        status: 'forbidden',
        icon: '🦪',
        reason: '高风险食物，易感染',
        alternatives: ['熟虾', '蟹肉'],
        season: 'all'
      },
      {
        id: 'alcohol',
        name: '酒精饮品',
        category: 'beverage',
        status: 'forbidden',
        icon: '🍷',
        reason: '对胎儿发育有害',
        alternatives: ['果汁', '柠檬水'],
        season: 'all'
      },
      {
        id: 'raw_meat',
        name: '未熟肉类',
        category: 'protein',
        status: 'forbidden',
        icon: '🥩',
        reason: '可能含有细菌',
        alternatives: ['充分煮熟的肉类'],
        season: 'all'
      },
      {
        id: 'unpasteurized_cheese',
        name: '未消毒奶酪',
        category: 'dairy',
        status: 'forbidden',
        icon: '🧀',
        reason: '可能含有李斯特菌',
        alternatives: ['巴氏消毒奶酪'],
        season: 'all'
      },
      {
        id: 'high_mercury_fish',
        name: '高汞鱼类',
        category: 'protein',
        status: 'forbidden',
        icon: '🐟',
        reason: '汞含量过高，影响胎儿神经发育',
        alternatives: ['三文鱼', '沙丁鱼'],
        season: 'all'
      }
    ];
  }
}

export const nutritionService = new NutritionService();