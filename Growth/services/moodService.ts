export interface MoodEntry {
  id: string;
  date: Date;
  mood: MoodType;
  intensity: number; // 1-5
  note: string;
  tags: string[];
  triggers?: string[];
  activities?: string[];
  photos?: string[];
  audioNote?: string;
}

export interface MoodType {
  id: string;
  name: string;
  emoji: string;
  color: string;
  description: string;
}

export interface MoodTrend {
  period: 'week' | 'month' | 'trimester';
  averageMood: number;
  moodDistribution: { [key: string]: number };
  trends: {
    improving: boolean;
    stable: boolean;
    declining: boolean;
  };
  insights: string[];
}

export interface MoodRecommendation {
  type: 'activity' | 'relaxation' | 'social' | 'professional';
  title: string;
  description: string;
  icon: string;
  priority: 'low' | 'medium' | 'high';
}

class MoodService {
  /**
   * 获取可选择的心情类型
   */
  getMoodTypes(): MoodType[] {
    return [
      {
        id: 'happy',
        name: '开心',
        emoji: '😊',
        color: '#FFD700',
        description: '感到快乐、满足、充满活力'
      },
      {
        id: 'calm',
        name: '平静',
        emoji: '😌',
        color: '#87CEEB',
        description: '内心平和、放松、安详'
      },
      {
        id: 'excited',
        name: '兴奋',
        emoji: '😍',
        color: '#FF69B4',
        description: '充满期待、激动、热情'
      },
      {
        id: 'grateful',
        name: '感恩',
        emoji: '🤗',
        color: '#98FB98',
        description: '感激、温暖、被爱包围'
      },
      {
        id: 'tired',
        name: '疲惫',
        emoji: '😴',
        color: '#D3D3D3',
        description: '身体或精神上感到疲劳'
      },
      {
        id: 'anxious',
        name: '焦虑',
        emoji: '😰',
        color: '#FFA500',
        description: '担心、不安、紧张'
      },
      {
        id: 'sad',
        name: '难过',
        emoji: '😢',
        color: '#4682B4',
        description: '伤心、失落、情绪低落'
      },
      {
        id: 'frustrated',
        name: '烦躁',
        emoji: '😤',
        color: '#DC143C',
        description: '易怒、不耐烦、烦闷'
      },
      {
        id: 'worried',
        name: '担心',
        emoji: '😟',
        color: '#9370DB',
        description: '对未来感到不确定或恐惧'
      }
    ];
  }

  /**
   * 获取常见的情绪标签
   */
  getCommonTags(): string[] {
    return [
      '胎动', '产检', '家人陪伴', '工作压力', '身体不适',
      '睡眠不好', '食欲变化', '体重增加', '外貌变化',
      '准备用品', '学习育儿', '经济压力', '社交活动',
      '运动锻炼', '听音乐', '看书', '散步', '购物'
    ];
  }

  /**
   * 获取情绪触发因素
   */
  getCommonTriggers(): string[] {
    return [
      '荷尔蒙变化', '身体不适', '睡眠不足', '工作压力',
      '家庭关系', '经济担忧', '对分娩的恐惧', '对育儿的担心',
      '身体形象变化', '社交孤立', '医疗检查结果', '他人评论'
    ];
  }

  /**
   * 保存心情记录
   */
  saveMoodEntry(entry: Omit<MoodEntry, 'id'>): MoodEntry {
    const newEntry: MoodEntry = {
      ...entry,
      id: `mood_${Date.now()}`
    };

    // 这里应该保存到本地存储或服务器
    return newEntry;
  }

  /**
   * 获取心情记录历史
   */
  getMoodHistory(days: number = 30): MoodEntry[] {
    // 模拟数据，实际应该从存储中获取
    const moodTypes = this.getMoodTypes();
    const history: MoodEntry[] = [];

    for (let i = 0; i < days; i++) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      
      // 随机生成一些历史数据
      if (Math.random() > 0.3) { // 70%的天数有记录
        const randomMood = moodTypes[Math.floor(Math.random() * moodTypes.length)];
        history.push({
          id: `mood_${date.getTime()}`,
          date,
          mood: randomMood,
          intensity: Math.floor(Math.random() * 5) + 1,
          note: this.generateSampleNote(randomMood.name),
          tags: this.getRandomTags(),
          triggers: Math.random() > 0.5 ? this.getRandomTriggers() : undefined
        });
      }
    }

    return history.sort((a, b) => b.date.getTime() - a.date.getTime());
  }

  /**
   * 分析心情趋势
   */
  analyzeMoodTrend(entries: MoodEntry[], period: 'week' | 'month' | 'trimester' = 'week'): MoodTrend {
    if (entries.length === 0) {
      return {
        period,
        averageMood: 0,
        moodDistribution: {},
        trends: { improving: false, stable: true, declining: false },
        insights: ['暂无足够数据进行分析']
      };
    }

    // 计算平均心情强度
    const averageMood = entries.reduce((sum, entry) => sum + entry.intensity, 0) / entries.length;

    // 计算心情分布
    const moodDistribution: { [key: string]: number } = {};
    entries.forEach(entry => {
      moodDistribution[entry.mood.name] = (moodDistribution[entry.mood.name] || 0) + 1;
    });

    // 分析趋势
    const recentEntries = entries.slice(0, Math.min(7, entries.length));
    const olderEntries = entries.slice(7, Math.min(14, entries.length));
    
    const recentAverage = recentEntries.length > 0 
      ? recentEntries.reduce((sum, entry) => sum + entry.intensity, 0) / recentEntries.length 
      : averageMood;
    
    const olderAverage = olderEntries.length > 0 
      ? olderEntries.reduce((sum, entry) => sum + entry.intensity, 0) / olderEntries.length 
      : averageMood;

    const difference = recentAverage - olderAverage;
    const trends = {
      improving: difference > 0.5,
      stable: Math.abs(difference) <= 0.5,
      declining: difference < -0.5
    };

    // 生成洞察
    const insights = this.generateInsights(entries, averageMood, moodDistribution, trends);

    return {
      period,
      averageMood,
      moodDistribution,
      trends,
      insights
    };
  }

  /**
   * 获取心情建议
   */
  getMoodRecommendations(currentMood: MoodType, intensity: number): MoodRecommendation[] {
    const recommendations: MoodRecommendation[] = [];

    // 基于当前心情给出建议
    if (currentMood.id === 'anxious' || currentMood.id === 'worried') {
      recommendations.push(
        {
          type: 'relaxation',
          title: '深呼吸练习',
          description: '尝试4-7-8呼吸法，吸气4秒，屏气7秒，呼气8秒',
          icon: '🫁',
          priority: 'high'
        },
        {
          type: 'activity',
          title: '轻柔瑜伽',
          description: '进行适合孕期的瑜伽练习，帮助放松身心',
          icon: '🧘‍♀️',
          priority: 'medium'
        }
      );
    }

    if (currentMood.id === 'sad' || currentMood.id === 'frustrated') {
      recommendations.push(
        {
          type: 'social',
          title: '与家人聊天',
          description: '分享你的感受，获得家人的支持和理解',
          icon: '👨‍👩‍👧‍👦',
          priority: 'high'
        },
        {
          type: 'activity',
          title: '听舒缓音乐',
          description: '选择一些轻柔的音乐，让心情平静下来',
          icon: '🎵',
          priority: 'medium'
        }
      );
    }

    if (currentMood.id === 'tired') {
      recommendations.push(
        {
          type: 'relaxation',
          title: '适当休息',
          description: '给自己一些休息时间，不要过度劳累',
          icon: '😴',
          priority: 'high'
        },
        {
          type: 'activity',
          title: '温水泡脚',
          description: '用温水泡脚15-20分钟，有助于放松和改善睡眠',
          icon: '🛁',
          priority: 'medium'
        }
      );
    }

    // 如果强度很低，建议寻求专业帮助
    if (intensity <= 2 && (currentMood.id === 'sad' || currentMood.id === 'anxious')) {
      recommendations.push({
        type: 'professional',
        title: '咨询专业人士',
        description: '如果持续感到低落或焦虑，建议咨询心理健康专家',
        icon: '👨‍⚕️',
        priority: 'high'
      });
    }

    // 通用建议
    recommendations.push(
      {
        type: 'activity',
        title: '户外散步',
        description: '到户外走走，呼吸新鲜空气，适量的阳光有助于改善心情',
        icon: '🚶‍♀️',
        priority: 'low'
      },
      {
        type: 'relaxation',
        title: '写心情日记',
        description: '记录下今天的感受和想法，有助于情绪的释放',
        icon: '📝',
        priority: 'low'
      }
    );

    return recommendations;
  }

  /**
   * 生成示例笔记
   */
  private generateSampleNote(moodName: string): string {
    const sampleNotes: { [key: string]: string[] } = {
      '开心': [
        '今天感受到了明显的胎动，小宝宝好活跃！',
        '老公给我准备了营养丰富的晚餐，很感动',
        '产检结果一切正常，心情特别好'
      ],
      '平静': [
        '今天心情很平和，在家里休息了一整天',
        '听了一些轻音乐，感觉很放松',
        '和妈妈聊了很久，心情很平静'
      ],
      '焦虑': [
        '担心宝宝的健康状况，有点紧张',
        '对即将到来的分娩感到不安',
        '工作上的压力让我有些焦虑'
      ],
      '疲惫': [
        '今天特别累，可能是没睡好',
        '身体感觉很沉重，需要多休息',
        '做了一些家务，现在很疲惫'
      ]
    };

    const notes = sampleNotes[moodName] || ['今天的心情比较复杂'];
    return notes[Math.floor(Math.random() * notes.length)];
  }

  /**
   * 获取随机标签
   */
  private getRandomTags(): string[] {
    const allTags = this.getCommonTags();
    const count = Math.floor(Math.random() * 3) + 1;
    const shuffled = allTags.sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
  }

  /**
   * 获取随机触发因素
   */
  private getRandomTriggers(): string[] {
    const allTriggers = this.getCommonTriggers();
    const count = Math.floor(Math.random() * 2) + 1;
    const shuffled = allTriggers.sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
  }

  /**
   * 生成洞察建议
   */
  private generateInsights(
    entries: MoodEntry[], 
    averageMood: number, 
    moodDistribution: { [key: string]: number },
    trends: { improving: boolean; stable: boolean; declining: boolean }
  ): string[] {
    const insights: string[] = [];

    // 基于平均心情给出建议
    if (averageMood >= 4) {
      insights.push('你的整体心情状态很好，继续保持积极的生活态度！');
    } else if (averageMood >= 3) {
      insights.push('你的心情状态总体稳定，注意保持良好的生活习惯。');
    } else {
      insights.push('最近心情可能有些低落，建议多关注自己的情绪健康。');
    }

    // 基于趋势给出建议
    if (trends.improving) {
      insights.push('你的心情正在好转，这是一个积极的信号！');
    } else if (trends.declining) {
      insights.push('最近心情有所下降，建议寻找合适的放松方式。');
    }

    // 基于心情分布给出建议
    const mostCommonMood = Object.keys(moodDistribution).reduce((a, b) => 
      moodDistribution[a] > moodDistribution[b] ? a : b
    );

    if (mostCommonMood === '焦虑' || mostCommonMood === '担心') {
      insights.push('你经常感到焦虑，建议尝试一些放松技巧，如深呼吸或冥想。');
    }

    // 分析常见标签
    const allTags = entries.flatMap(entry => entry.tags);
    const tagCounts: { [key: string]: number } = {};
    allTags.forEach(tag => {
      tagCounts[tag] = (tagCounts[tag] || 0) + 1;
    });

    const mostCommonTag = Object.keys(tagCounts).reduce((a, b) => 
      tagCounts[a] > tagCounts[b] ? a : b, ''
    );

    if (mostCommonTag && tagCounts[mostCommonTag] > 2) {
      insights.push(`"${mostCommonTag}"经常影响你的心情，可以重点关注这个方面。`);
    }

    return insights;
  }
}

export const moodService = new MoodService();