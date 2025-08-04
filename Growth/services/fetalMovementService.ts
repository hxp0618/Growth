export interface FetalMovementRecord {
  id: string;
  date: Date;
  startTime: Date;
  endTime: Date;
  count: number;
  duration: number; // 秒
  pregnancyWeek: number;
  notes?: string;
  quality: 'weak' | 'normal' | 'strong';
  pattern: 'regular' | 'irregular' | 'clustered';
}

export interface FetalMovementStats {
  totalRecords: number;
  averageCount: number;
  averageDuration: number;
  bestTime: string; // 最活跃时间段
  weeklyTrend: {
    week: number;
    averageCount: number;
    recordCount: number;
  }[];
  dailyPattern: {
    hour: number;
    averageCount: number;
    frequency: number;
  }[];
  qualityDistribution: {
    weak: number;
    normal: number;
    strong: number;
  };
}

export interface FetalMovementAnalysis {
  status: 'normal' | 'attention' | 'concern';
  message: string;
  recommendations: string[];
  trends: {
    increasing: boolean;
    decreasing: boolean;
    stable: boolean;
  };
  alerts: {
    type: 'info' | 'warning' | 'danger';
    message: string;
  }[];
}

export interface DailyGoal {
  date: Date;
  targetCount: number;
  actualCount: number;
  completed: boolean;
  sessions: number;
}

class FetalMovementService {
  private records: FetalMovementRecord[] = [];

  /**
   * 保存胎动记录
   */
  saveRecord(record: Omit<FetalMovementRecord, 'id'>): FetalMovementRecord {
    const newRecord: FetalMovementRecord = {
      ...record,
      id: `fm_${Date.now()}`
    };

    this.records.unshift(newRecord);
    return newRecord;
  }

  /**
   * 获取胎动记录历史
   */
  getRecords(days: number = 30): FetalMovementRecord[] {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - days);

    return this.records.filter(record => record.date >= cutoffDate);
  }

  /**
   * 获取今日记录
   */
  getTodayRecords(): FetalMovementRecord[] {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    return this.records.filter(record => 
      record.date >= today && record.date < tomorrow
    );
  }

  /**
   * 计算统计数据
   */
  calculateStats(days: number = 30): FetalMovementStats {
    const records = this.getRecords(days);
    
    if (records.length === 0) {
      return {
        totalRecords: 0,
        averageCount: 0,
        averageDuration: 0,
        bestTime: '暂无数据',
        weeklyTrend: [],
        dailyPattern: [],
        qualityDistribution: { weak: 0, normal: 0, strong: 0 }
      };
    }

    // 基础统计
    const totalRecords = records.length;
    const averageCount = records.reduce((sum, r) => sum + r.count, 0) / totalRecords;
    const averageDuration = records.reduce((sum, r) => sum + r.duration, 0) / totalRecords;

    // 每日模式分析
    const hourlyData: { [hour: number]: { count: number; frequency: number } } = {};
    records.forEach(record => {
      const hour = record.startTime.getHours();
      if (!hourlyData[hour]) {
        hourlyData[hour] = { count: 0, frequency: 0 };
      }
      hourlyData[hour].count += record.count;
      hourlyData[hour].frequency += 1;
    });

    const dailyPattern = Object.entries(hourlyData).map(([hour, data]) => ({
      hour: parseInt(hour),
      averageCount: data.count / data.frequency,
      frequency: data.frequency
    })).sort((a, b) => a.hour - b.hour);

    // 找出最活跃时间段
    const bestHour = dailyPattern.reduce((best, current) => 
      current.averageCount > best.averageCount ? current : best,
      dailyPattern[0] || { hour: 0, averageCount: 0, frequency: 0 }
    );

    const bestTime = bestHour ? `${bestHour.hour}:00-${bestHour.hour + 1}:00` : '暂无数据';

    // 周趋势分析
    const weeklyData: { [week: number]: { count: number; records: number } } = {};
    records.forEach(record => {
      const week = record.pregnancyWeek;
      if (!weeklyData[week]) {
        weeklyData[week] = { count: 0, records: 0 };
      }
      weeklyData[week].count += record.count;
      weeklyData[week].records += 1;
    });

    const weeklyTrend = Object.entries(weeklyData).map(([week, data]) => ({
      week: parseInt(week),
      averageCount: data.count / data.records,
      recordCount: data.records
    })).sort((a, b) => a.week - b.week);

    // 质量分布
    const qualityDistribution = records.reduce((acc, record) => {
      acc[record.quality] += 1;
      return acc;
    }, { weak: 0, normal: 0, strong: 0 });

    return {
      totalRecords,
      averageCount,
      averageDuration,
      bestTime,
      weeklyTrend,
      dailyPattern,
      qualityDistribution
    };
  }

  /**
   * 分析胎动情况
   */
  analyzeMovement(pregnancyWeek: number): FetalMovementAnalysis {
    const recentRecords = this.getRecords(7); // 最近7天
    const todayRecords = this.getTodayRecords();
    
    const alerts: { type: 'info' | 'warning' | 'danger'; message: string }[] = [];
    let status: 'normal' | 'attention' | 'concern' = 'normal';
    let message = '胎动情况正常';
    const recommendations: string[] = [];

    // 基于孕周的正常范围
    const normalRanges = this.getNormalRangeByWeek(pregnancyWeek);
    
    if (recentRecords.length === 0) {
      status = 'attention';
      message = '最近没有胎动记录';
      recommendations.push('建议每天记录胎动情况');
      alerts.push({
        type: 'info',
        message: '开始记录胎动，了解宝宝的活动规律'
      });
    } else {
      const recentAverage = recentRecords.reduce((sum, r) => sum + r.count, 0) / recentRecords.length;
      
      // 检查胎动频率
      if (recentAverage < normalRanges.minCount) {
        status = 'concern';
        message = '胎动频率偏低';
        recommendations.push('建议咨询医生');
        recommendations.push('注意观察胎动变化');
        alerts.push({
          type: 'warning',
          message: '胎动次数低于正常范围，请密切关注'
        });
      } else if (recentAverage > normalRanges.maxCount) {
        status = 'attention';
        message = '胎动较为频繁';
        recommendations.push('观察是否有其他异常');
        alerts.push({
          type: 'info',
          message: '胎动比较活跃，属于正常现象'
        });
      }

      // 检查今日记录
      const todayCount = todayRecords.reduce((sum, r) => sum + r.count, 0);
      if (todayCount === 0 && new Date().getHours() > 12) {
        alerts.push({
          type: 'info',
          message: '今天还没有记录胎动，建议进行记录'
        });
      }

      // 检查记录频率
      if (recentRecords.length < 3) {
        recommendations.push('建议增加记录频率，每天至少记录一次');
      }
    }

    // 趋势分析
    const trends = this.analyzeTrends(recentRecords);

    // 通用建议
    recommendations.push('保持规律的作息时间');
    recommendations.push('适当进行孕期运动');
    recommendations.push('注意营养均衡');

    return {
      status,
      message,
      recommendations,
      trends,
      alerts
    };
  }

  /**
   * 获取每日目标
   */
  getDailyGoals(days: number = 7): DailyGoal[] {
    const goals: DailyGoal[] = [];
    
    for (let i = 0; i < days; i++) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      date.setHours(0, 0, 0, 0);
      
      const dayRecords = this.records.filter(record => {
        const recordDate = new Date(record.date);
        recordDate.setHours(0, 0, 0, 0);
        return recordDate.getTime() === date.getTime();
      });
      
      const actualCount = dayRecords.reduce((sum, r) => sum + r.count, 0);
      const targetCount = 10; // 标准目标
      
      goals.push({
        date,
        targetCount,
        actualCount,
        completed: actualCount >= targetCount,
        sessions: dayRecords.length
      });
    }
    
    return goals.reverse();
  }

  /**
   * 获取胎动提醒建议
   */
  getReminders(): string[] {
    const todayRecords = this.getTodayRecords();
    const currentHour = new Date().getHours();
    const reminders: string[] = [];

    if (todayRecords.length === 0) {
      if (currentHour >= 9 && currentHour <= 11) {
        reminders.push('早上是记录胎动的好时机，宝宝通常比较活跃');
      } else if (currentHour >= 14 && currentHour <= 16) {
        reminders.push('午后时光，来记录一下宝宝的活动吧');
      } else if (currentHour >= 19 && currentHour <= 21) {
        reminders.push('晚餐后是胎动的活跃期，不要忘记记录哦');
      }
    }

    const stats = this.calculateStats(7);
    if (stats.totalRecords > 0 && stats.averageCount < 8) {
      reminders.push('最近胎动记录偏少，建议增加记录频率');
    }

    return reminders;
  }

  /**
   * 生成模拟数据用于演示
   */
  generateMockData(days: number = 14): void {
    const mockRecords: FetalMovementRecord[] = [];
    const currentWeek = 28; // 假设当前孕28周

    for (let i = 0; i < days; i++) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      
      // 每天生成1-3次记录
      const sessionsCount = Math.floor(Math.random() * 3) + 1;
      
      for (let j = 0; j < sessionsCount; j++) {
        const startTime = new Date(date);
        const hour = Math.floor(Math.random() * 14) + 8; // 8-22点
        startTime.setHours(hour, Math.floor(Math.random() * 60));
        
        const duration = Math.floor(Math.random() * 1800) + 600; // 10-40分钟
        const endTime = new Date(startTime.getTime() + duration * 1000);
        
        const count = Math.floor(Math.random() * 8) + 6; // 6-14次
        const qualities: ('weak' | 'normal' | 'strong')[] = ['weak', 'normal', 'strong'];
        const patterns: ('regular' | 'irregular' | 'clustered')[] = ['regular', 'irregular', 'clustered'];
        
        mockRecords.push({
          id: `mock_${Date.now()}_${i}_${j}`,
          date: new Date(date),
          startTime,
          endTime,
          count,
          duration,
          pregnancyWeek: currentWeek,
          quality: qualities[Math.floor(Math.random() * qualities.length)],
          pattern: patterns[Math.floor(Math.random() * patterns.length)],
          notes: Math.random() > 0.7 ? '宝宝今天很活跃' : undefined
        });
      }
    }

    this.records = mockRecords.sort((a, b) => b.date.getTime() - a.date.getTime());
  }

  /**
   * 根据孕周获取正常范围
   */
  private getNormalRangeByWeek(week: number): { minCount: number; maxCount: number } {
    if (week < 20) {
      return { minCount: 3, maxCount: 8 };
    } else if (week < 28) {
      return { minCount: 6, maxCount: 12 };
    } else if (week < 36) {
      return { minCount: 8, maxCount: 15 };
    } else {
      return { minCount: 6, maxCount: 12 }; // 后期可能会减少
    }
  }

  /**
   * 分析趋势
   */
  private analyzeTrends(records: FetalMovementRecord[]): {
    increasing: boolean;
    decreasing: boolean;
    stable: boolean;
  } {
    if (records.length < 3) {
      return { increasing: false, decreasing: false, stable: true };
    }

    const recent = records.slice(0, Math.floor(records.length / 2));
    const older = records.slice(Math.floor(records.length / 2));

    const recentAvg = recent.reduce((sum, r) => sum + r.count, 0) / recent.length;
    const olderAvg = older.reduce((sum, r) => sum + r.count, 0) / older.length;

    const difference = recentAvg - olderAvg;
    const threshold = 2;

    return {
      increasing: difference > threshold,
      decreasing: difference < -threshold,
      stable: Math.abs(difference) <= threshold
    };
  }
}

export const fetalMovementService = new FetalMovementService();

// 生成模拟数据
fetalMovementService.generateMockData(14);