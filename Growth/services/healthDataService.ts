// 健康数据追踪服务
export interface HealthMetric {
  id: string;
  type: 'weight' | 'blood_pressure' | 'blood_sugar' | 'heart_rate' | 'temperature';
  value: number | { systolic: number; diastolic: number }; // 血压需要两个值
  unit: string;
  date: Date;
  time: string;
  note?: string;
  pregnancyWeek: number;
  isNormal: boolean;
  trend?: 'up' | 'down' | 'stable';
}

export interface HealthTarget {
  type: string;
  minValue?: number;
  maxValue?: number;
  targetValue?: number;
  unit: string;
  description: string;
}

export interface HealthTrend {
  type: string;
  data: { date: string; value: number }[];
  trend: 'up' | 'down' | 'stable';
  changePercent: number;
  period: '7days' | '30days' | '90days';
}

export interface HealthAlert {
  id: string;
  type: 'warning' | 'danger' | 'info';
  title: string;
  message: string;
  metricType: string;
  value: number | { systolic: number; diastolic: number };
  date: Date;
  isRead: boolean;
  actionRequired: boolean;
}

export interface HealthReport {
  period: string;
  metrics: {
    type: string;
    average: number;
    min: number;
    max: number;
    trend: 'up' | 'down' | 'stable';
    normalCount: number;
    abnormalCount: number;
  }[];
  alerts: HealthAlert[];
  recommendations: string[];
  overallScore: number; // 0-100
}

class HealthDataService {
  private metrics: HealthMetric[] = [];
  private targets: HealthTarget[] = [];
  private alerts: HealthAlert[] = [];

  constructor() {
    this.initializeTargets();
    this.generateMockData();
  }

  private initializeTargets() {
    this.targets = [
      {
        type: 'weight',
        minValue: 50,
        maxValue: 85,
        unit: 'kg',
        description: '孕期体重应控制在合理范围内'
      },
      {
        type: 'blood_pressure',
        minValue: 90, // 收缩压
        maxValue: 140,
        unit: 'mmHg',
        description: '血压应保持在正常范围内'
      },
      {
        type: 'blood_sugar',
        minValue: 3.9,
        maxValue: 6.1,
        unit: 'mmol/L',
        description: '空腹血糖应控制在正常范围'
      },
      {
        type: 'heart_rate',
        minValue: 60,
        maxValue: 100,
        unit: 'bpm',
        description: '静息心率应保持正常'
      },
      {
        type: 'temperature',
        minValue: 36.0,
        maxValue: 37.5,
        unit: '°C',
        description: '体温应保持正常范围'
      }
    ];
  }

  private generateMockData() {
    const now = new Date();
    const types: HealthMetric['type'][] = ['weight', 'blood_pressure', 'blood_sugar', 'heart_rate', 'temperature'];
    
    // 生成过去30天的数据
    for (let i = 30; i >= 0; i--) {
      const date = new Date(now);
      date.setDate(date.getDate() - i);
      
      types.forEach(type => {
        // 不是每天都记录所有指标
        if (Math.random() > 0.3) return;
        
        const metric = this.generateMockMetric(type, date, 28 + Math.floor(i / 7));
        this.metrics.push(metric);
      });
    }

    // 生成一些警告
    this.generateMockAlerts();
  }

  private generateMockMetric(type: HealthMetric['type'], date: Date, pregnancyWeek: number): HealthMetric {
    const id = `${type}_${date.getTime()}_${Math.random().toString(36).substr(2, 9)}`;
    let value: number | { systolic: number; diastolic: number };
    let unit: string;
    let isNormal: boolean;

    switch (type) {
      case 'weight':
        value = 65 + Math.random() * 10 + pregnancyWeek * 0.3; // 孕期体重逐渐增加
        unit = 'kg';
        isNormal = value >= 50 && value <= 85;
        break;
      case 'blood_pressure':
        const systolic = 110 + Math.random() * 20;
        const diastolic = 70 + Math.random() * 15;
        value = { systolic, diastolic };
        unit = 'mmHg';
        isNormal = systolic >= 90 && systolic <= 140 && diastolic >= 60 && diastolic <= 90;
        break;
      case 'blood_sugar':
        value = 4.5 + Math.random() * 2;
        unit = 'mmol/L';
        isNormal = value >= 3.9 && value <= 6.1;
        break;
      case 'heart_rate':
        value = 70 + Math.random() * 20 + pregnancyWeek * 0.5; // 孕期心率略高
        unit = 'bpm';
        isNormal = value >= 60 && value <= 100;
        break;
      case 'temperature':
        value = 36.5 + Math.random() * 0.8;
        unit = '°C';
        isNormal = value >= 36.0 && value <= 37.5;
        break;
      default:
        value = 0;
        unit = '';
        isNormal = true;
    }

    return {
      id,
      type,
      value,
      unit,
      date,
      time: `${String(Math.floor(Math.random() * 12) + 8).padStart(2, '0')}:${String(Math.floor(Math.random() * 60)).padStart(2, '0')}`,
      pregnancyWeek,
      isNormal,
      note: Math.random() > 0.7 ? this.getRandomNote(type) : undefined
    };
  }

  private getRandomNote(type: string): string {
    const notes = {
      weight: ['餐后测量', '晨起空腹', '运动后', '感觉有些水肿'],
      blood_pressure: ['休息5分钟后测量', '有些紧张', '感觉正常', '头有点晕'],
      blood_sugar: ['空腹测量', '餐后2小时', '感觉有点饿', '刚吃完水果'],
      heart_rate: ['静息状态', '刚运动完', '有点紧张', '感觉正常'],
      temperature: ['腋下测量', '感觉有点热', '正常体温', '刚洗完澡']
    };
    
    const typeNotes = notes[type as keyof typeof notes] || ['正常记录'];
    return typeNotes[Math.floor(Math.random() * typeNotes.length)];
  }

  private generateMockAlerts() {
    const alertTypes = [
      {
        type: 'warning' as const,
        title: '血压偏高提醒',
        message: '您的血压连续3天超过正常范围，建议咨询医生',
        metricType: 'blood_pressure'
      },
      {
        type: 'info' as const,
        title: '体重增长正常',
        message: '本周体重增长在正常范围内，继续保持',
        metricType: 'weight'
      },
      {
        type: 'danger' as const,
        title: '血糖异常',
        message: '血糖值异常，请立即联系医生',
        metricType: 'blood_sugar'
      }
    ];

    alertTypes.forEach((alert, index) => {
      const alertData: HealthAlert = {
        id: `alert_${index}`,
        type: alert.type,
        title: alert.title,
        message: alert.message,
        metricType: alert.metricType,
        value: alert.metricType === 'blood_pressure' ? { systolic: 145, diastolic: 95 } : 6.8,
        date: new Date(Date.now() - index * 24 * 60 * 60 * 1000),
        isRead: index > 0,
        actionRequired: alert.type === 'danger'
      };
      this.alerts.push(alertData);
    });
  }

  // 添加健康数据
  addMetric(metric: Omit<HealthMetric, 'id' | 'isNormal' | 'trend'>): HealthMetric {
    const id = `${metric.type}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const target = this.targets.find(t => t.type === metric.type);
    
    let isNormal = true;
    if (target) {
      if (metric.type === 'blood_pressure' && typeof metric.value === 'object') {
        isNormal = metric.value.systolic >= (target.minValue || 0) && 
                  metric.value.systolic <= (target.maxValue || 200) &&
                  metric.value.diastolic >= 60 && metric.value.diastolic <= 90;
      } else if (typeof metric.value === 'number') {
        isNormal = metric.value >= (target.minValue || 0) && 
                  metric.value <= (target.maxValue || 1000);
      }
    }

    const newMetric: HealthMetric = {
      ...metric,
      id,
      isNormal
    };

    this.metrics.push(newMetric);
    
    // 检查是否需要生成警告
    this.checkForAlerts(newMetric);
    
    return newMetric;
  }

  private checkForAlerts(metric: HealthMetric) {
    if (!metric.isNormal) {
      const alert: HealthAlert = {
        id: `alert_${Date.now()}`,
        type: 'warning',
        title: `${this.getMetricDisplayName(metric.type)}异常`,
        message: `您的${this.getMetricDisplayName(metric.type)}超出正常范围，建议关注`,
        metricType: metric.type,
        value: metric.value,
        date: new Date(),
        isRead: false,
        actionRequired: false
      };
      
      this.alerts.unshift(alert);
    }
  }

  // 获取指标数据
  getMetrics(type?: string, days?: number): HealthMetric[] {
    let filtered = this.metrics;
    
    if (type) {
      filtered = filtered.filter(m => m.type === type);
    }
    
    if (days) {
      const cutoffDate = new Date();
      cutoffDate.setDate(cutoffDate.getDate() - days);
      filtered = filtered.filter(m => m.date >= cutoffDate);
    }
    
    return filtered.sort((a, b) => b.date.getTime() - a.date.getTime());
  }

  // 获取最新数据
  getLatestMetrics(): { [key: string]: HealthMetric } {
    const latest: { [key: string]: HealthMetric } = {};
    
    ['weight', 'blood_pressure', 'blood_sugar', 'heart_rate', 'temperature'].forEach(type => {
      const typeMetrics = this.getMetrics(type);
      if (typeMetrics.length > 0) {
        latest[type] = typeMetrics[0];
      }
    });
    
    return latest;
  }

  // 获取趋势数据
  getTrend(type: string, period: '7days' | '30days' | '90days' = '30days'): HealthTrend {
    const days = period === '7days' ? 7 : period === '30days' ? 30 : 90;
    const metrics = this.getMetrics(type, days);
    
    const data = metrics.map(m => ({
      date: m.date.toISOString().split('T')[0],
      value: typeof m.value === 'object' ? m.value.systolic : m.value
    })).reverse();
    
    // 计算趋势
    let trend: 'up' | 'down' | 'stable' = 'stable';
    let changePercent = 0;
    
    if (data.length >= 2) {
      const firstValue = data[0].value;
      const lastValue = data[data.length - 1].value;
      changePercent = ((lastValue - firstValue) / firstValue) * 100;
      
      if (Math.abs(changePercent) < 5) {
        trend = 'stable';
      } else if (changePercent > 0) {
        trend = 'up';
      } else {
        trend = 'down';
      }
    }
    
    return {
      type,
      data,
      trend,
      changePercent,
      period
    };
  }

  // 获取健康目标
  getTargets(): HealthTarget[] {
    return this.targets;
  }

  // 获取警告
  getAlerts(unreadOnly: boolean = false): HealthAlert[] {
    let alerts = this.alerts;
    if (unreadOnly) {
      alerts = alerts.filter(a => !a.isRead);
    }
    return alerts.sort((a, b) => b.date.getTime() - a.date.getTime());
  }

  // 标记警告为已读
  markAlertAsRead(alertId: string): boolean {
    const alert = this.alerts.find(a => a.id === alertId);
    if (alert) {
      alert.isRead = true;
      return true;
    }
    return false;
  }

  // 生成健康报告
  generateReport(period: '7days' | '30days' | '90days' = '30days'): HealthReport {
    const days = period === '7days' ? 7 : period === '30days' ? 30 : 90;
    const types = ['weight', 'blood_pressure', 'blood_sugar', 'heart_rate', 'temperature'];
    
    const metrics = types.map(type => {
      const typeMetrics = this.getMetrics(type, days);
      const values = typeMetrics.map(m => 
        typeof m.value === 'object' ? m.value.systolic : m.value
      );
      
      const trend = this.getTrend(type, period);
      
      return {
        type,
        average: values.length > 0 ? values.reduce((a, b) => a + b, 0) / values.length : 0,
        min: values.length > 0 ? Math.min(...values) : 0,
        max: values.length > 0 ? Math.max(...values) : 0,
        trend: trend.trend,
        normalCount: typeMetrics.filter(m => m.isNormal).length,
        abnormalCount: typeMetrics.filter(m => !m.isNormal).length
      };
    });

    const alerts = this.getAlerts().filter(a => {
      const alertDate = new Date(a.date);
      const cutoffDate = new Date();
      cutoffDate.setDate(cutoffDate.getDate() - days);
      return alertDate >= cutoffDate;
    });

    const recommendations = this.generateRecommendations(metrics);
    const overallScore = this.calculateOverallScore(metrics);

    return {
      period: period === '7days' ? '近7天' : period === '30days' ? '近30天' : '近90天',
      metrics,
      alerts,
      recommendations,
      overallScore
    };
  }

  private generateRecommendations(metrics: any[]): string[] {
    const recommendations: string[] = [];
    
    metrics.forEach(metric => {
      if (metric.abnormalCount > metric.normalCount) {
        switch (metric.type) {
          case 'weight':
            recommendations.push('建议控制体重增长速度，注意饮食均衡');
            break;
          case 'blood_pressure':
            recommendations.push('血压偏高，建议减少盐分摄入，适当休息');
            break;
          case 'blood_sugar':
            recommendations.push('血糖控制需要改善，建议调整饮食结构');
            break;
          case 'heart_rate':
            recommendations.push('心率异常，建议适当运动，保持心情愉快');
            break;
          case 'temperature':
            recommendations.push('体温异常，建议多休息，必要时就医');
            break;
        }
      }
    });

    if (recommendations.length === 0) {
      recommendations.push('各项指标正常，继续保持良好的生活习惯');
      recommendations.push('建议定期监测，记录健康数据');
    }

    return recommendations;
  }

  private calculateOverallScore(metrics: any[]): number {
    let totalScore = 0;
    let validMetrics = 0;

    metrics.forEach(metric => {
      if (metric.normalCount + metric.abnormalCount > 0) {
        const normalRate = metric.normalCount / (metric.normalCount + metric.abnormalCount);
        totalScore += normalRate * 100;
        validMetrics++;
      }
    });

    return validMetrics > 0 ? Math.round(totalScore / validMetrics) : 85;
  }

  // 获取指标显示名称
  getMetricDisplayName(type: string): string {
    const names = {
      weight: '体重',
      blood_pressure: '血压',
      blood_sugar: '血糖',
      heart_rate: '心率',
      temperature: '体温'
    };
    return names[type as keyof typeof names] || type;
  }

  // 获取指标图标
  getMetricIcon(type: string): string {
    const icons = {
      weight: '⚖️',
      blood_pressure: '🩺',
      blood_sugar: '🩸',
      heart_rate: '❤️',
      temperature: '🌡️'
    };
    return icons[type as keyof typeof icons] || '📊';
  }

  // 删除指标数据
  deleteMetric(id: string): boolean {
    const index = this.metrics.findIndex(m => m.id === id);
    if (index !== -1) {
      this.metrics.splice(index, 1);
      return true;
    }
    return false;
  }

  // 更新指标数据
  updateMetric(id: string, updates: Partial<HealthMetric>): HealthMetric | null {
    const metric = this.metrics.find(m => m.id === id);
    if (metric) {
      Object.assign(metric, updates);
      
      // 重新检查是否正常
      const target = this.targets.find(t => t.type === metric.type);
      if (target) {
        if (metric.type === 'blood_pressure' && typeof metric.value === 'object') {
          metric.isNormal = metric.value.systolic >= (target.minValue || 0) && 
                           metric.value.systolic <= (target.maxValue || 200) &&
                           metric.value.diastolic >= 60 && metric.value.diastolic <= 90;
        } else if (typeof metric.value === 'number') {
          metric.isNormal = metric.value >= (target.minValue || 0) && 
                           metric.value <= (target.maxValue || 1000);
        }
      }
      
      return metric;
    }
    return null;
  }
}

export const healthDataService = new HealthDataService();