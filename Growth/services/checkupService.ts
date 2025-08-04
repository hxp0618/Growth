export interface CheckupSchedule {
  id: string;
  week: number;
  title: string;
  description: string;
  items: string[];
  importance: 'low' | 'medium' | 'high';
  estimatedDuration: number; // 分钟
  preparation: string[];
  cost?: string;
}

export interface CheckupRecord {
  id: string;
  scheduleId: string;
  date: Date;
  hospital: string;
  doctor: string;
  results: CheckupResult[];
  notes: string;
  nextAppointment?: Date;
  images?: string[]; // 检查报告图片
  audioNotes?: string[]; // 语音记录
}

export interface CheckupResult {
  item: string;
  value: string;
  unit?: string;
  normalRange?: string;
  status: 'normal' | 'attention' | 'abnormal';
  note?: string;
}

export interface CheckupReminder {
  id: string;
  scheduleId: string;
  title: string;
  message: string;
  reminderTime: Date;
  type: 'upcoming' | 'preparation' | 'overdue';
  isCompleted: boolean;
}

class CheckupService {
  /**
   * 获取标准产检时间表
   */
  getStandardCheckupSchedule(): CheckupSchedule[] {
    return [
      {
        id: 'checkup_6_8',
        week: 6,
        title: '首次产检',
        description: '确认宫内孕，建立孕期档案',
        items: ['血HCG', 'B超检查', '妇科检查', '血常规', '尿常规'],
        importance: 'high',
        estimatedDuration: 120,
        preparation: [
          '携带身份证、医保卡',
          '准备既往病史资料',
          '记录末次月经时间',
          '空腹检查（如需抽血）'
        ],
        cost: '200-500元'
      },
      {
        id: 'checkup_11_13',
        week: 11,
        title: 'NT检查',
        description: '颈项透明层检查，早期唐筛',
        items: ['NT超声检查', '血清学筛查', '常规产检'],
        importance: 'high',
        estimatedDuration: 90,
        preparation: [
          '预约NT检查时间',
          '检查前适量饮水',
          '穿宽松衣物',
          '携带前次检查报告'
        ],
        cost: '300-600元'
      },
      {
        id: 'checkup_15_20',
        week: 15,
        title: '中期唐筛',
        description: '唐氏综合征筛查',
        items: ['血清学筛查', '常规产检', '营养咨询'],
        importance: 'high',
        estimatedDuration: 60,
        preparation: [
          '空腹抽血',
          '准确提供孕周信息',
          '携带前次检查报告'
        ],
        cost: '150-300元'
      },
      {
        id: 'checkup_20_24',
        week: 20,
        title: '大排畸检查',
        description: '四维彩超，全面检查胎儿发育',
        items: ['四维彩超', '胎儿结构筛查', '常规产检'],
        importance: 'high',
        estimatedDuration: 120,
        preparation: [
          '提前预约四维彩超',
          '检查前适量进食',
          '穿分体衣物便于检查',
          '可邀请家属陪同'
        ],
        cost: '400-800元'
      },
      {
        id: 'checkup_24_28',
        week: 24,
        title: '糖耐量试验',
        description: '筛查妊娠糖尿病',
        items: ['OGTT检查', '血常规', '尿常规', '常规产检'],
        importance: 'high',
        estimatedDuration: 180,
        preparation: [
          '检查前3天正常饮食',
          '检查前8-12小时空腹',
          '携带糖粉或医院购买',
          '准备充足时间（3小时）'
        ],
        cost: '100-200元'
      },
      {
        id: 'checkup_28_32',
        week: 28,
        title: '孕晚期常规检查',
        description: '进入孕晚期，加强监测',
        items: ['B超检查', '胎心监护', '血常规', '尿常规', '肝肾功能'],
        importance: 'medium',
        estimatedDuration: 90,
        preparation: [
          '监测胎动情况',
          '记录体重变化',
          '注意水肿情况'
        ],
        cost: '200-400元'
      },
      {
        id: 'checkup_32_36',
        week: 32,
        title: '胎位检查',
        description: '检查胎位，评估分娩方式',
        items: ['B超检查', '胎位检查', '骨盆测量', '胎心监护'],
        importance: 'medium',
        estimatedDuration: 90,
        preparation: [
          '了解胎动规律',
          '准备分娩相关问题',
          '讨论分娩计划'
        ],
        cost: '200-350元'
      },
      {
        id: 'checkup_36_40',
        week: 36,
        title: '足月准备检查',
        description: '每周检查，准备分娩',
        items: ['胎心监护', 'B超检查', '宫颈检查', '血常规'],
        importance: 'high',
        estimatedDuration: 60,
        preparation: [
          '准备待产包',
          '了解分娩征象',
          '确认分娩医院',
          '准备紧急联系方式'
        ],
        cost: '150-250元'
      }
    ];
  }

  /**
   * 根据预产期生成个人产检计划
   */
  generatePersonalCheckupPlan(dueDate: Date): CheckupSchedule[] {
    const standardSchedule = this.getStandardCheckupSchedule();
    const lastMenstrualPeriod = new Date(dueDate);
    lastMenstrualPeriod.setDate(lastMenstrualPeriod.getDate() - 280);

    return standardSchedule.map(schedule => ({
      ...schedule,
      // 可以根据个人情况调整检查项目
    }));
  }

  /**
   * 获取下次产检提醒
   */
  getUpcomingCheckupReminders(currentWeek: number): CheckupReminder[] {
    const schedule = this.getStandardCheckupSchedule();
    const reminders: CheckupReminder[] = [];

    // 查找即将到来的检查
    const upcomingCheckups = schedule.filter(checkup => 
      checkup.week >= currentWeek && checkup.week <= currentWeek + 4
    );

    upcomingCheckups.forEach(checkup => {
      // 提前3天提醒
      const reminderDate = new Date();
      reminderDate.setDate(reminderDate.getDate() + (checkup.week - currentWeek) * 7 - 3);

      reminders.push({
        id: `reminder_${checkup.id}`,
        scheduleId: checkup.id,
        title: `即将进行${checkup.title}`,
        message: `第${checkup.week}周需要进行${checkup.title}，请提前预约`,
        reminderTime: reminderDate,
        type: 'upcoming',
        isCompleted: false
      });

      // 检查准备提醒
      const preparationDate = new Date();
      preparationDate.setDate(preparationDate.getDate() + (checkup.week - currentWeek) * 7 - 1);

      reminders.push({
        id: `prep_${checkup.id}`,
        scheduleId: checkup.id,
        title: `${checkup.title}准备提醒`,
        message: `明天进行${checkup.title}，请做好相关准备`,
        reminderTime: preparationDate,
        type: 'preparation',
        isCompleted: false
      });
    });

    return reminders.sort((a, b) => a.reminderTime.getTime() - b.reminderTime.getTime());
  }

  /**
   * 保存产检记录
   */
  saveCheckupRecord(record: Omit<CheckupRecord, 'id'>): CheckupRecord {
    const newRecord: CheckupRecord = {
      ...record,
      id: `record_${Date.now()}`
    };

    // 这里应该保存到本地存储或服务器
    // 暂时返回记录对象
    return newRecord;
  }

  /**
   * 获取产检记录历史
   */
  getCheckupHistory(): CheckupRecord[] {
    // 模拟数据，实际应该从存储中获取
    return [
      {
        id: 'record_1',
        scheduleId: 'checkup_6_8',
        date: new Date('2024-12-15'),
        hospital: '北京妇产医院',
        doctor: '李主任',
        results: [
          {
            item: '血HCG',
            value: '25000',
            unit: 'mIU/mL',
            normalRange: '1000-50000',
            status: 'normal'
          },
          {
            item: '胎心',
            value: '140',
            unit: '次/分',
            normalRange: '120-160',
            status: 'normal'
          }
        ],
        notes: '胎儿发育正常，建议继续观察',
        nextAppointment: new Date('2025-01-15')
      }
    ];
  }

  /**
   * 获取检查项目说明
   */
  getCheckupItemExplanation(item: string): string {
    const explanations: { [key: string]: string } = {
      'NT检查': 'NT(颈项透明层)检查是通过B超测量胎儿颈后透明层厚度，用于评估染色体异常风险的重要筛查项目。正常值通常小于2.5mm。',
      '四维彩超': '四维彩超能够实时观察胎儿在宫内的活动情况，全面检查胎儿各器官发育情况，排除重大结构畸形。',
      'OGTT检查': '口服葡萄糖耐量试验，用于筛查妊娠糖尿病。需要空腹12小时，服用75g葡萄糖后分别在1小时、2小时测血糖。',
      '胎心监护': '通过监测胎儿心率变化，评估胎儿在宫内的健康状况。正常胎心率为120-160次/分。',
      '唐氏筛查': '通过检测孕妇血清中的特定蛋白质，评估胎儿患唐氏综合征的风险。'
    };

    return explanations[item] || '这是一项重要的产检项目，请咨询医生了解详细信息。';
  }

  /**
   * 计算检查费用预估
   */
  estimateCheckupCost(scheduleId: string): { min: number; max: number; description: string } {
    const schedule = this.getStandardCheckupSchedule().find(s => s.id === scheduleId);
    
    if (!schedule || !schedule.cost) {
      return { min: 100, max: 300, description: '费用因医院而异' };
    }

    const costRange = schedule.cost.match(/(\d+)-(\d+)/);
    if (costRange) {
      return {
        min: parseInt(costRange[1]),
        max: parseInt(costRange[2]),
        description: '费用包含基本检查项目，特殊检查可能额外收费'
      };
    }

    return { min: 100, max: 300, description: '费用因医院而异' };
  }
}

export const checkupService = new CheckupService();