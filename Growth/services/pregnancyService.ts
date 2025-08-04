export interface PregnancyInfo {
  dueDate: Date;
  lastMenstrualPeriod: Date;
  currentWeek: number;
  currentDay: number;
  daysRemaining: number;
  trimester: 1 | 2 | 3;
  totalDays: number;
  completedDays: number;
}

export interface FetalDevelopment {
  week: number;
  size: string;
  sizeComparison: string;
  length: string;
  weight: string;
  developments: string[];
  maternalChanges: string[];
  recommendations: string[];
  icon: string;
}

export interface WeeklyMilestone {
  week: number;
  title: string;
  description: string;
  importance: 'low' | 'medium' | 'high';
  category: 'development' | 'checkup' | 'preparation';
}

class PregnancyService {
  // 标准孕期280天
  private readonly PREGNANCY_DAYS = 280;

  /**
   * 计算孕期信息
   */
  calculatePregnancyInfo(dueDate: Date): PregnancyInfo {
    const now = new Date();
    const dueDateObj = new Date(dueDate);
    
    // 计算末次月经日期（预产期前280天）
    const lastMenstrualPeriod = new Date(dueDateObj);
    lastMenstrualPeriod.setDate(lastMenstrualPeriod.getDate() - this.PREGNANCY_DAYS);
    
    // 计算已怀孕天数
    const timeDiff = now.getTime() - lastMenstrualPeriod.getTime();
    const completedDays = Math.floor(timeDiff / (1000 * 3600 * 24));
    
    // 计算当前孕周和天数
    const currentWeek = Math.floor(completedDays / 7);
    const currentDay = completedDays % 7;
    
    // 计算剩余天数
    const daysRemaining = Math.max(0, this.PREGNANCY_DAYS - completedDays);
    
    // 确定孕期阶段
    let trimester: 1 | 2 | 3;
    if (currentWeek <= 12) {
      trimester = 1;
    } else if (currentWeek <= 28) {
      trimester = 2;
    } else {
      trimester = 3;
    }

    return {
      dueDate: dueDateObj,
      lastMenstrualPeriod,
      currentWeek,
      currentDay,
      daysRemaining,
      trimester,
      totalDays: this.PREGNANCY_DAYS,
      completedDays: Math.max(0, completedDays)
    };
  }

  /**
   * 获取胎儿发育信息
   */
  getFetalDevelopment(week: number): FetalDevelopment {
    const developmentData = this.getFetalDevelopmentData();
    
    // 确保周数在合理范围内
    const safeWeek = Math.max(1, Math.min(40, week));
    
    return developmentData[safeWeek] || developmentData[1];
  }

  /**
   * 获取本周重要里程碑
   */
  getWeeklyMilestones(week: number): WeeklyMilestone[] {
    const milestones: WeeklyMilestone[] = [];
    
    // 重要检查时间点
    if (week === 6) {
      milestones.push({
        week,
        title: '首次产检',
        description: '确认宫内孕，听胎心',
        importance: 'high',
        category: 'checkup'
      });
    }
    
    if (week === 12) {
      milestones.push({
        week,
        title: 'NT检查',
        description: '颈项透明层检查，早期唐筛',
        importance: 'high',
        category: 'checkup'
      });
    }
    
    if (week === 20) {
      milestones.push({
        week,
        title: '大排畸检查',
        description: '四维彩超，全面检查胎儿发育',
        importance: 'high',
        category: 'checkup'
      });
    }
    
    if (week === 24) {
      milestones.push({
        week,
        title: '糖耐量试验',
        description: '筛查妊娠糖尿病',
        importance: 'high',
        category: 'checkup'
      });
    }
    
    if (week === 28) {
      milestones.push({
        week,
        title: '进入孕晚期',
        description: '开始准备待产包，学习分娩知识',
        importance: 'medium',
        category: 'preparation'
      });
    }
    
    if (week === 36) {
      milestones.push({
        week,
        title: '足月准备',
        description: '胎儿已足月，随时可能分娩',
        importance: 'high',
        category: 'preparation'
      });
    }

    return milestones;
  }

  /**
   * 获取今日建议
   */
  getTodayRecommendations(week: number, day: number): string[] {
    const recommendations: string[] = [];
    
    // 基于孕周的通用建议
    if (week <= 12) {
      recommendations.push('多休息，避免剧烈运动');
      recommendations.push('补充叶酸，预防神经管缺陷');
      recommendations.push('少食多餐，缓解孕吐反应');
    } else if (week <= 28) {
      recommendations.push('均衡饮食，控制体重增长');
      recommendations.push('适量运动，如散步、孕妇瑜伽');
      recommendations.push('开始胎教，与宝宝互动');
    } else {
      recommendations.push('注意胎动，定期数胎动');
      recommendations.push('准备待产包，学习分娩知识');
      recommendations.push('保持心情愉快，做好迎接准备');
    }
    
    // 基于星期的特殊建议
    const dayOfWeek = new Date().getDay();
    if (dayOfWeek === 0) { // 周日
      recommendations.push('周末时光，与家人一起度过');
    } else if (dayOfWeek === 6) { // 周六
      recommendations.push('适合进行孕期购物，准备必需品');
    }
    
    return recommendations;
  }

  /**
   * 胎儿发育数据库
   */
  private getFetalDevelopmentData(): Record<number, FetalDevelopment> {
    return {
      1: {
        week: 1,
        size: '0.1mm',
        sizeComparison: '针尖',
        length: '0.1mm',
        weight: '0g',
        developments: ['受精卵形成', '开始细胞分裂'],
        maternalChanges: ['可能还未察觉怀孕', '月经可能延迟'],
        recommendations: ['开始补充叶酸', '保持健康生活方式'],
        icon: '🔬'
      },
      4: {
        week: 4,
        size: '2mm',
        sizeComparison: '芝麻粒',
        length: '2mm',
        weight: '0.02g',
        developments: ['胚胎着床', '开始形成胎盘', '神经管开始发育'],
        maternalChanges: ['月经停止', '可能出现轻微出血', '开始有妊娠反应'],
        recommendations: ['确认怀孕', '开始产前检查', '避免有害物质'],
        icon: '🌱'
      },
      8: {
        week: 8,
        size: '1.6cm',
        sizeComparison: '蓝莓',
        length: '1.6cm',
        weight: '1g',
        developments: ['心脏开始跳动', '四肢开始发育', '面部特征开始形成'],
        maternalChanges: ['晨吐可能加重', '乳房开始胀痛', '情绪波动'],
        recommendations: ['少食多餐', '充足休息', '避免剧烈运动'],
        icon: '🫐'
      },
      12: {
        week: 12,
        size: '5.4cm',
        sizeComparison: '李子',
        length: '5.4cm',
        weight: '14g',
        developments: ['器官基本形成', '开始有吞咽动作', '指甲开始生长'],
        maternalChanges: ['晨吐开始缓解', '精力逐渐恢复', '子宫增大'],
        recommendations: ['进行NT检查', '适量运动', '均衡饮食'],
        icon: '🍇'
      },
      16: {
        week: 16,
        size: '10cm',
        sizeComparison: '牛油果',
        length: '10cm',
        weight: '100g',
        developments: ['性别可以辨别', '开始长头发', '骨骼开始硬化'],
        maternalChanges: ['腹部开始显怀', '皮肤可能出现色素沉着', '食欲增加'],
        recommendations: ['进行唐氏筛查', '开始胎教', '注意营养均衡'],
        icon: '🥑'
      },
      20: {
        week: 20,
        size: '16cm',
        sizeComparison: '香蕉',
        length: '16cm',
        weight: '300g',
        developments: ['可以感受到胎动', '听觉系统发育', '睡眠周期形成'],
        maternalChanges: ['明显感受胎动', '腰部开始酸痛', '体重增加明显'],
        recommendations: ['进行大排畸检查', '开始数胎动', '适当按摩'],
        icon: '🍌'
      },
      24: {
        week: 24,
        size: '30cm',
        sizeComparison: '玉米',
        length: '30cm',
        weight: '600g',
        developments: ['肺部开始发育', '听觉更加敏感', '皮肤开始变厚'],
        maternalChanges: ['胎动更加频繁', '可能出现妊娠纹', '睡眠质量下降'],
        recommendations: ['糖耐量检查', '控制体重', '左侧卧睡姿'],
        icon: '🌽'
      },
      28: {
        week: 28,
        size: '35cm',
        sizeComparison: '茄子',
        length: '35cm',
        weight: '1000g',
        developments: ['眼睛可以睁开', '大脑快速发育', '开始储存脂肪'],
        maternalChanges: ['进入孕晚期', '呼吸可能困难', '腿部可能水肿'],
        recommendations: ['开始准备待产包', '学习分娩知识', '定期产检'],
        icon: '🍆'
      },
      32: {
        week: 32,
        size: '40cm',
        sizeComparison: '椰子',
        length: '40cm',
        weight: '1700g',
        developments: ['骨骼继续硬化', '免疫系统发育', '指甲长到指尖'],
        maternalChanges: ['子宫压迫内脏', '频繁小便', '腰背疼痛加重'],
        recommendations: ['监测胎动', '准备新生儿用品', '练习呼吸法'],
        icon: '🥥'
      },
      36: {
        week: 36,
        size: '45cm',
        sizeComparison: '哈密瓜',
        length: '45cm',
        weight: '2500g',
        developments: ['肺部基本成熟', '头部转向下方', '皮下脂肪增加'],
        maternalChanges: ['胎儿入盆', '宫缩可能出现', '行动更加不便'],
        recommendations: ['随时准备分娩', '注意宫缩频率', '保持心情平静'],
        icon: '🍈'
      },
      40: {
        week: 40,
        size: '50cm',
        sizeComparison: '西瓜',
        length: '50cm',
        weight: '3200g',
        developments: ['完全发育成熟', '随时准备出生', '各器官功能完善'],
        maternalChanges: ['预产期到达', '宫缩规律', '见红或破水'],
        recommendations: ['立即就医', '保持冷静', '准备迎接宝宝'],
        icon: '🍉'
      }
    };
  }

  /**
   * 格式化孕周显示
   */
  formatPregnancyWeek(week: number, day: number): string {
    if (week === 0) {
      return `怀孕第${day}天`;
    }
    return `怀孕第${week}周${day > 0 ? `${day}天` : ''}`;
  }

  /**
   * 计算预产期倒计时
   */
  formatDaysRemaining(days: number): string {
    if (days <= 0) {
      return '已到预产期';
    }
    
    const weeks = Math.floor(days / 7);
    const remainingDays = days % 7;
    
    if (weeks > 0) {
      return `还有${weeks}周${remainingDays > 0 ? `${remainingDays}天` : ''}`;
    } else {
      return `还有${days}天`;
    }
  }
}

export const pregnancyService = new PregnancyService();