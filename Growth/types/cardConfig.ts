export interface CardConfig {
  id: string;
  name: string;
  title: string;
  description: string;
  icon: string;
  isVisible: boolean;
  order: number;
  category: 'health' | 'family' | 'knowledge' | 'tools' | 'other';
  component: string;
  props?: Record<string, any>;
}

export interface CardCategory {
  id: string;
  name: string;
  description: string;
  icon: string;
}

export const CARD_CATEGORIES: CardCategory[] = [
  {
    id: 'health',
    name: '健康管理',
    description: '孕期健康相关功能',
    icon: '🏥',
  },
  {
    id: 'family',
    name: '家庭协作',
    description: '家庭成员互动功能',
    icon: '👨‍👩‍👧‍👦',
  },
  {
    id: 'knowledge',
    name: '知识学习',
    description: '孕期知识和指导',
    icon: '📚',
  },
  {
    id: 'tools',
    name: '实用工具',
    description: '日常使用的工具',
    icon: '🛠️',
  },
  {
    id: 'other',
    name: '其他',
    description: '其他功能',
    icon: '📋',
  },
];

export const DEFAULT_CARDS: CardConfig[] = [
  {
    id: 'pregnancy-calendar',
    name: 'PregnancyCalendar',
    title: '孕期日历',
    description: '查看孕期进度和重要时间节点',
    icon: '📅',
    isVisible: true,
    order: 1,
    category: 'health',
    component: 'PregnancyCalendar',
  },
  {
    id: 'weather-card',
    name: 'WeatherCard',
    title: '天气信息',
    description: '当前天气状况和出行建议',
    icon: '🌤️',
    isVisible: true,
    order: 2,
    category: 'tools',
    component: 'WeatherCard',
  },
  {
    id: 'nutrition-guide',
    name: 'NutritionGuide',
    title: '营养指导',
    description: '孕期营养建议和饮食指导',
    icon: '🥗',
    isVisible: true,
    order: 3,
    category: 'knowledge',
    component: 'NutritionGuide',
    props: { pregnancyWeek: 24 },
  },
  {
    id: 'checkup-reminder',
    name: 'CheckupReminder',
    title: '产检提醒',
    description: '产检时间提醒和注意事项',
    icon: '🏥',
    isVisible: true,
    order: 4,
    category: 'health',
    component: 'CheckupReminder',
    props: { currentWeek: 24 },
  },
  {
    id: 'mood-diary',
    name: 'MoodDiary',
    title: '情绪日记',
    description: '记录每日心情和感受',
    icon: '😊',
    isVisible: true,
    order: 5,
    category: 'health',
    component: 'MoodDiary',
  },
  {
    id: 'fetal-movement',
    name: 'FetalMovementCounter',
    title: '胎动记录',
    description: '记录和统计胎动情况',
    icon: '👶',
    isVisible: true,
    order: 6,
    category: 'health',
    component: 'FetalMovementCounter',
    props: { pregnancyWeek: 24 },
  },
  {
    id: 'family-collaboration',
    name: 'FamilyCollaboration',
    title: '家庭协作',
    description: '家庭成员任务分配和协作',
    icon: '👨‍👩‍👧‍👦',
    isVisible: true,
    order: 7,
    category: 'family',
    component: 'FamilyCollaboration',
    props: { currentUserId: 'member_1', pregnancyWeek: 24 },
  },
  {
    id: 'calendar',
    name: 'Calendar',
    title: '综合日历',
    description: '查看所有重要日程安排',
    icon: '📅',
    isVisible: true,
    order: 8,
    category: 'tools',
    component: 'Calendar',
  },
  {
    id: 'delivery-bag',
    name: 'DeliveryBagChecklist',
    title: '待产包清单',
    description: '待产包物品准备清单',
    icon: '🎒',
    isVisible: true,
    order: 9,
    category: 'tools',
    component: 'DeliveryBagChecklist',
    props: { pregnancyWeek: 24 },
  },
  {
    id: 'emergency-contact',
    name: 'EmergencyContact',
    title: '紧急联系',
    description: '紧急情况联系方式',
    icon: '🚨',
    isVisible: true,
    order: 10,
    category: 'tools',
    component: 'EmergencyContact',
  },
  {
    id: 'daily-tasks',
    name: 'DailyTasks',
    title: '今日任务',
    description: '查看和管理每日任务',
    icon: '📋',
    isVisible: true,
    order: 11,
    category: 'other',
    component: 'DailyTasks',
  },
  {
    id: 'quick-notification',
    name: 'QuickNotification',
    title: '一键通知',
    description: '快速发送通知给家人',
    icon: '🚨',
    isVisible: true,
    order: 12,
    category: 'family',
    component: 'QuickNotification',
  },
  {
    id: 'family-activity',
    name: 'FamilyActivity',
    title: '家庭动态',
    description: '查看家庭成员最新动态',
    icon: '👨‍👩‍👧‍👦',
    isVisible: true,
    order: 13,
    category: 'family',
    component: 'FamilyActivity',
  },
  {
    id: 'quick-actions',
    name: 'QuickActions',
    title: '快捷操作',
    description: '常用功能快捷入口',
    icon: '⚡',
    isVisible: true,
    order: 14,
    category: 'tools',
    component: 'QuickActions',
  },
];