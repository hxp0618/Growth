// 紧急联系服务
export interface EmergencyContact {
  id: string;
  name: string;
  relationship: 'partner' | 'parent' | 'doctor' | 'hospital' | 'friend' | 'other';
  phoneNumber: string;
  alternativePhone?: string;
  email?: string;
  address?: string;
  notes?: string;
  isPrimary: boolean;
  isAvailable24h: boolean;
  priority: number; // 1-10, 1为最高优先级
  lastContactTime?: Date;
  responseTime?: number; // 平均响应时间（分钟）
}

export interface EmergencyScenario {
  id: string;
  name: string;
  description: string;
  icon: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  autoCallContacts: string[]; // 自动呼叫的联系人ID
  messageTemplate: string;
  instructions: string[];
  requiresImmediate911?: boolean;
}

export interface EmergencyCall {
  id: string;
  contactId: string;
  scenarioId?: string;
  timestamp: Date;
  duration?: number; // 通话时长（秒）
  status: 'calling' | 'answered' | 'no_answer' | 'busy' | 'failed';
  notes?: string;
  location?: {
    latitude: number;
    longitude: number;
    address: string;
  };
}

export interface EmergencyAlert {
  id: string;
  type: 'medical' | 'safety' | 'urgent' | 'info';
  title: string;
  message: string;
  timestamp: Date;
  isRead: boolean;
  actionRequired: boolean;
  relatedContactIds?: string[];
  location?: {
    latitude: number;
    longitude: number;
    address: string;
  };
}

class EmergencyContactService {
  private contacts: EmergencyContact[] = [];
  private scenarios: EmergencyScenario[] = [];
  private callHistory: EmergencyCall[] = [];
  private alerts: EmergencyAlert[] = [];

  constructor() {
    this.initializeDefaultScenarios();
    this.generateMockData();
  }

  private initializeDefaultScenarios() {
    this.scenarios = [
      {
        id: 'medical_emergency',
        name: '医疗紧急情况',
        description: '出现严重身体不适、疼痛或其他医疗紧急情况',
        icon: '🚨',
        severity: 'critical',
        autoCallContacts: [],
        messageTemplate: '我遇到了医疗紧急情况，需要立即帮助。位置：{location}',
        instructions: [
          '保持冷静，不要惊慌',
          '如果情况严重，立即拨打120',
          '记录症状和时间',
          '准备好身份证和医保卡',
          '通知家人和医生'
        ],
        requiresImmediate911: true
      },
      {
        id: 'labor_signs',
        name: '临产征象',
        description: '出现规律宫缩、破水或见红等临产征象',
        icon: '👶',
        severity: 'high',
        autoCallContacts: [],
        messageTemplate: '我出现了临产征象，需要立即前往医院。位置：{location}',
        instructions: [
          '记录宫缩间隔和持续时间',
          '准备好待产包',
          '通知医生和家人',
          '安排交通工具前往医院',
          '保持冷静，深呼吸'
        ]
      },
      {
        id: 'severe_pain',
        name: '剧烈疼痛',
        description: '出现剧烈腹痛、头痛或其他严重疼痛',
        icon: '😰',
        severity: 'high',
        autoCallContacts: [],
        messageTemplate: '我出现了剧烈疼痛，需要医疗帮助。位置：{location}',
        instructions: [
          '记录疼痛位置和程度',
          '避免剧烈运动',
          '联系医生咨询',
          '准备前往医院',
          '通知家人陪同'
        ]
      },
      {
        id: 'bleeding',
        name: '异常出血',
        description: '出现阴道出血或其他异常出血情况',
        icon: '🩸',
        severity: 'high',
        autoCallContacts: [],
        messageTemplate: '我出现了异常出血，需要立即医疗帮助。位置：{location}',
        instructions: [
          '立即平躺休息',
          '记录出血量和颜色',
          '避免剧烈活动',
          '立即联系医生',
          '准备前往医院'
        ]
      },
      {
        id: 'feeling_unwell',
        name: '身体不适',
        description: '感觉头晕、恶心、乏力等身体不适',
        icon: '🤒',
        severity: 'medium',
        autoCallContacts: [],
        messageTemplate: '我感觉身体不适，可能需要帮助。位置：{location}',
        instructions: [
          '找个安全的地方休息',
          '测量体温和血压',
          '记录症状',
          '联系医生咨询',
          '通知家人'
        ]
      },
      {
        id: 'safety_concern',
        name: '安全问题',
        description: '遇到安全威胁或危险情况',
        icon: '⚠️',
        severity: 'high',
        autoCallContacts: [],
        messageTemplate: '我遇到了安全问题，需要帮助。位置：{location}',
        instructions: [
          '立即前往安全地点',
          '如有必要报警',
          '通知家人和朋友',
          '保持通讯畅通',
          '记录相关信息'
        ]
      },
      {
        id: 'need_support',
        name: '需要支持',
        description: '情绪低落或需要心理支持',
        icon: '💙',
        severity: 'low',
        autoCallContacts: [],
        messageTemplate: '我现在需要一些支持和陪伴。',
        instructions: [
          '找个安静的地方',
          '深呼吸放松',
          '联系信任的人',
          '考虑专业心理咨询',
          '进行适当的放松活动'
        ]
      }
    ];
  }

  private generateMockData() {
    // 生成模拟联系人
    this.contacts = [
      {
        id: 'contact_1',
        name: '老公（张明）',
        relationship: 'partner',
        phoneNumber: '138****1234',
        alternativePhone: '010-****5678',
        email: 'zhangming@email.com',
        isPrimary: true,
        isAvailable24h: true,
        priority: 1,
        responseTime: 2,
        notes: '主要紧急联系人，24小时可联系'
      },
      {
        id: 'contact_2',
        name: '妈妈（李华）',
        relationship: 'parent',
        phoneNumber: '139****5678',
        isPrimary: true,
        isAvailable24h: true,
        priority: 2,
        responseTime: 5,
        notes: '有丰富的育儿经验'
      },
      {
        id: 'contact_3',
        name: '产科医生（王医生）',
        relationship: 'doctor',
        phoneNumber: '136****9012',
        email: 'dr.wang@hospital.com',
        isPrimary: true,
        isAvailable24h: false,
        priority: 1,
        responseTime: 10,
        notes: '主治医生，工作时间：9:00-17:00'
      },
      {
        id: 'contact_4',
        name: '北京妇产医院',
        relationship: 'hospital',
        phoneNumber: '010-****1234',
        address: '北京市朝阳区姚家园路251号',
        isPrimary: true,
        isAvailable24h: true,
        priority: 1,
        responseTime: 0,
        notes: '产检医院，24小时急诊'
      },
      {
        id: 'contact_5',
        name: '婆婆（赵阿姨）',
        relationship: 'parent',
        phoneNumber: '137****3456',
        isPrimary: false,
        isAvailable24h: true,
        priority: 3,
        responseTime: 8,
        notes: '住得比较近，可以提供帮助'
      },
      {
        id: 'contact_6',
        name: '好友（小雨）',
        relationship: 'friend',
        phoneNumber: '135****7890',
        isPrimary: false,
        isAvailable24h: false,
        priority: 4,
        responseTime: 15,
        notes: '同事好友，也是准妈妈'
      }
    ];

    // 设置自动呼叫联系人
    this.scenarios.forEach(scenario => {
      switch (scenario.severity) {
        case 'critical':
          scenario.autoCallContacts = ['contact_1', 'contact_3', 'contact_4'];
          break;
        case 'high':
          scenario.autoCallContacts = ['contact_1', 'contact_2', 'contact_3'];
          break;
        case 'medium':
          scenario.autoCallContacts = ['contact_1', 'contact_2'];
          break;
        case 'low':
          scenario.autoCallContacts = ['contact_1'];
          break;
      }
    });

    // 生成模拟通话记录
    this.generateMockCallHistory();
    
    // 生成模拟警告
    this.generateMockAlerts();
  }

  private generateMockCallHistory() {
    const now = new Date();
    
    // 生成过去7天的通话记录
    for (let i = 0; i < 5; i++) {
      const callTime = new Date(now.getTime() - Math.random() * 7 * 24 * 60 * 60 * 1000);
      const contactId = this.contacts[Math.floor(Math.random() * this.contacts.length)].id;
      
      const call: EmergencyCall = {
        id: `call_${i}`,
        contactId,
        timestamp: callTime,
        duration: Math.floor(Math.random() * 300) + 30, // 30-330秒
        status: Math.random() > 0.2 ? 'answered' : 'no_answer',
        notes: Math.random() > 0.5 ? '通话正常，情况已解决' : undefined,
        location: {
          latitude: 39.9042 + (Math.random() - 0.5) * 0.1,
          longitude: 116.4074 + (Math.random() - 0.5) * 0.1,
          address: '北京市朝阳区某地'
        }
      };
      
      this.callHistory.push(call);
    }
  }

  private generateMockAlerts() {
    const now = new Date();
    
    const alerts: EmergencyAlert[] = [
      {
        id: 'alert_1',
        type: 'info',
        title: '紧急联系人更新',
        message: '您的紧急联系人信息已更新，请确认联系方式是否正确',
        timestamp: new Date(now.getTime() - 2 * 60 * 60 * 1000),
        isRead: false,
        actionRequired: true
      },
      {
        id: 'alert_2',
        type: 'medical',
        title: '产检提醒',
        message: '明天上午9:00有产检预约，请准时到达医院',
        timestamp: new Date(now.getTime() - 24 * 60 * 60 * 1000),
        isRead: true,
        actionRequired: false,
        relatedContactIds: ['contact_3', 'contact_4']
      }
    ];
    
    this.alerts = alerts;
  }

  // 获取所有联系人
  getContacts(primaryOnly: boolean = false): EmergencyContact[] {
    let contacts = this.contacts;
    
    if (primaryOnly) {
      contacts = contacts.filter(c => c.isPrimary);
    }
    
    return contacts.sort((a, b) => a.priority - b.priority);
  }

  // 获取紧急场景
  getScenarios(): EmergencyScenario[] {
    return this.scenarios.sort((a, b) => {
      const severityOrder = { critical: 4, high: 3, medium: 2, low: 1 };
      return severityOrder[b.severity] - severityOrder[a.severity];
    });
  }

  // 发起紧急呼叫
  async makeEmergencyCall(contactId: string, scenarioId?: string): Promise<EmergencyCall> {
    const contact = this.contacts.find(c => c.id === contactId);
    if (!contact) {
      throw new Error('联系人不存在');
    }

    // 模拟获取当前位置
    const location = {
      latitude: 39.9042,
      longitude: 116.4074,
      address: '北京市朝阳区当前位置'
    };

    const call: EmergencyCall = {
      id: `call_${Date.now()}`,
      contactId,
      scenarioId,
      timestamp: new Date(),
      status: 'calling',
      location
    };

    this.callHistory.unshift(call);

    // 模拟拨打电话
    return new Promise((resolve) => {
      setTimeout(() => {
        // 模拟通话结果
        const success = Math.random() > 0.2; // 80%成功率
        call.status = success ? 'answered' : 'no_answer';
        call.duration = success ? Math.floor(Math.random() * 300) + 30 : 0;
        
        // 更新联系人最后联系时间
        contact.lastContactTime = new Date();
        
        resolve(call);
      }, 2000); // 模拟2秒拨号时间
    });
  }

  // 触发紧急场景
  async triggerEmergencyScenario(scenarioId: string): Promise<EmergencyCall[]> {
    const scenario = this.scenarios.find(s => s.id === scenarioId);
    if (!scenario) {
      throw new Error('紧急场景不存在');
    }

    const calls: EmergencyCall[] = [];

    // 如果需要立即拨打911
    if (scenario.requiresImmediate911) {
      // 这里应该集成真实的紧急呼叫功能
      console.log('触发911紧急呼叫');
    }

    // 自动呼叫指定联系人
    for (const contactId of scenario.autoCallContacts) {
      try {
        const call = await this.makeEmergencyCall(contactId, scenarioId);
        calls.push(call);
      } catch (error) {
        console.error(`呼叫联系人 ${contactId} 失败:`, error);
      }
    }

    // 创建紧急警告
    const alert: EmergencyAlert = {
      id: `alert_${Date.now()}`,
      type: scenario.severity === 'critical' ? 'medical' : 'urgent',
      title: `紧急情况：${scenario.name}`,
      message: `已触发紧急场景"${scenario.name}"，正在联系相关人员`,
      timestamp: new Date(),
      isRead: false,
      actionRequired: true,
      relatedContactIds: scenario.autoCallContacts,
      location: {
        latitude: 39.9042,
        longitude: 116.4074,
        address: '北京市朝阳区当前位置'
      }
    };

    this.alerts.unshift(alert);

    return calls;
  }

  // 发送紧急短信
  async sendEmergencyMessage(contactIds: string[], message: string, location?: any): Promise<boolean> {
    // 这里应该集成真实的短信发送功能
    console.log('发送紧急短信:', { contactIds, message, location });
    
    // 模拟发送成功
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(true);
      }, 1000);
    });
  }

  // 添加联系人
  addContact(contactData: Omit<EmergencyContact, 'id'>): EmergencyContact {
    const newContact: EmergencyContact = {
      ...contactData,
      id: `contact_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    };

    this.contacts.push(newContact);
    return newContact;
  }

  // 更新联系人
  updateContact(contactId: string, updates: Partial<EmergencyContact>): EmergencyContact | null {
    const contact = this.contacts.find(c => c.id === contactId);
    if (contact) {
      Object.assign(contact, updates);
      return contact;
    }
    return null;
  }

  // 删除联系人
  deleteContact(contactId: string): boolean {
    const index = this.contacts.findIndex(c => c.id === contactId);
    if (index !== -1) {
      this.contacts.splice(index, 1);
      return true;
    }
    return false;
  }

  // 获取通话记录
  getCallHistory(limit?: number): EmergencyCall[] {
    const history = this.callHistory.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
    return limit ? history.slice(0, limit) : history;
  }

  // 获取警告
  getAlerts(unreadOnly: boolean = false): EmergencyAlert[] {
    let alerts = this.alerts;
    if (unreadOnly) {
      alerts = alerts.filter(a => !a.isRead);
    }
    return alerts.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
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

  // 获取联系人显示名称
  getContactDisplayName(contactId: string): string {
    const contact = this.contacts.find(c => c.id === contactId);
    return contact ? contact.name : '未知联系人';
  }

  // 获取关系显示名称
  getRelationshipDisplayName(relationship: string): string {
    const names = {
      partner: '配偶',
      parent: '父母',
      doctor: '医生',
      hospital: '医院',
      friend: '朋友',
      other: '其他'
    };
    return names[relationship as keyof typeof names] || relationship;
  }

  // 获取场景严重程度颜色
  getSeverityColor(severity: string): string {
    const colors = {
      critical: '#FF4444',
      high: '#FF8800',
      medium: '#FFBB33',
      low: '#00C851'
    };
    return colors[severity as keyof typeof colors] || '#666666';
  }

  // 获取场景严重程度标签
  getSeverityLabel(severity: string): string {
    const labels = {
      critical: '危急',
      high: '紧急',
      medium: '重要',
      low: '一般'
    };
    return labels[severity as keyof typeof labels] || severity;
  }

  // 测试联系人可用性
  async testContactAvailability(contactId: string): Promise<boolean> {
    const contact = this.contacts.find(c => c.id === contactId);
    if (!contact) return false;

    // 模拟测试联系人可用性
    return new Promise((resolve) => {
      setTimeout(() => {
        const isAvailable = Math.random() > 0.1; // 90%可用率
        resolve(isAvailable);
      }, 1000);
    });
  }

  // 获取紧急联系统计
  getEmergencyStats(): {
    totalContacts: number;
    primaryContacts: number;
    available24hContacts: number;
    recentCalls: number;
    unreadAlerts: number;
  } {
    const totalContacts = this.contacts.length;
    const primaryContacts = this.contacts.filter(c => c.isPrimary).length;
    const available24hContacts = this.contacts.filter(c => c.isAvailable24h).length;
    
    const oneWeekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    const recentCalls = this.callHistory.filter(c => c.timestamp >= oneWeekAgo).length;
    
    const unreadAlerts = this.alerts.filter(a => !a.isRead).length;

    return {
      totalContacts,
      primaryContacts,
      available24hContacts,
      recentCalls,
      unreadAlerts
    };
  }
}

export const emergencyContactService = new EmergencyContactService();