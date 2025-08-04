import { familyCollaborationService, Task } from './familyCollaborationService';
import { checkupService, CheckupSchedule } from './checkupService';
import { moodService, MoodEntry } from './moodService';
import { fetalMovementService, FetalMovementRecord } from './fetalMovementService';

export interface CalendarEvent {
  id: string;
  title: string;
  description?: string;
  startDate: Date;
  endDate?: Date;
  allDay: boolean;
  type: 'task' | 'checkup' | 'mood' | 'fetal_movement' | 'custom' | 'reminder' | 'milestone';
  category: 'medical' | 'personal' | 'family' | 'health' | 'preparation' | 'other';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  status: 'pending' | 'in_progress' | 'completed' | 'cancelled';
  color: string;
  location?: string;
  attendees?: string[];
  reminders?: EventReminder[];
  recurrence?: EventRecurrence;
  notes?: string;
  attachments?: string[];
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
  sourceId?: string; // 关联的原始数据ID
  sourceType?: string; // 原始数据类型
}

export interface EventReminder {
  id: string;
  type: 'notification' | 'email' | 'sms';
  minutesBefore: number;
  message?: string;
}

export interface EventRecurrence {
  type: 'daily' | 'weekly' | 'monthly' | 'yearly';
  interval: number; // 每隔多少个周期
  endDate?: Date;
  count?: number; // 重复次数
  daysOfWeek?: number[]; // 周几 (0=周日, 1=周一, ...)
  dayOfMonth?: number; // 每月第几天
}

export interface CalendarView {
  type: 'month' | 'week' | 'day' | 'agenda';
  currentDate: Date;
  startDate: Date;
  endDate: Date;
}

export interface EventTemplate {
  id: string;
  title: string;
  description: string;
  category: CalendarEvent['category'];
  type: CalendarEvent['type'];
  priority: CalendarEvent['priority'];
  duration: number; // 分钟
  color: string;
  defaultReminders: EventReminder[];
  isPregnancyRelated: boolean;
  pregnancyWeekRange?: {
    start: number;
    end: number;
  };
}

class CalendarService {
  private events: CalendarEvent[] = [];
  private eventTemplates: EventTemplate[] = [];

  constructor() {
    this.initializeTemplates();
    this.syncExternalData();
  }

  /**
   * 获取指定日期范围的事件
   */
  getEvents(startDate: Date, endDate: Date, filters?: {
    type?: CalendarEvent['type'][];
    category?: CalendarEvent['category'][];
    status?: CalendarEvent['status'][];
  }): CalendarEvent[] {
    let filteredEvents = this.events.filter(event => {
      const eventStart = new Date(event.startDate);
      const eventEnd = event.endDate ? new Date(event.endDate) : eventStart;
      
      return (eventStart <= endDate && eventEnd >= startDate);
    });

    if (filters) {
      if (filters.type) {
        filteredEvents = filteredEvents.filter(event => filters.type!.includes(event.type));
      }
      if (filters.category) {
        filteredEvents = filteredEvents.filter(event => filters.category!.includes(event.category));
      }
      if (filters.status) {
        filteredEvents = filteredEvents.filter(event => filters.status!.includes(event.status));
      }
    }

    return filteredEvents.sort((a, b) => a.startDate.getTime() - b.startDate.getTime());
  }

  /**
   * 获取指定日期的事件
   */
  getEventsForDate(date: Date): CalendarEvent[] {
    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);
    
    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999);

    return this.getEvents(startOfDay, endOfDay);
  }

  /**
   * 创建新事件
   */
  createEvent(eventData: Omit<CalendarEvent, 'id' | 'createdAt' | 'updatedAt'>): CalendarEvent {
    const newEvent: CalendarEvent = {
      ...eventData,
      id: `event_${Date.now()}`,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    this.events.push(newEvent);
    this.sortEvents();
    
    return newEvent;
  }

  /**
   * 更新事件
   */
  updateEvent(eventId: string, updates: Partial<CalendarEvent>): CalendarEvent | null {
    const eventIndex = this.events.findIndex(e => e.id === eventId);
    if (eventIndex === -1) return null;

    this.events[eventIndex] = {
      ...this.events[eventIndex],
      ...updates,
      updatedAt: new Date()
    };

    this.sortEvents();
    return this.events[eventIndex];
  }

  /**
   * 删除事件
   */
  deleteEvent(eventId: string): boolean {
    const eventIndex = this.events.findIndex(e => e.id === eventId);
    if (eventIndex === -1) return false;

    this.events.splice(eventIndex, 1);
    return true;
  }

  /**
   * 从模板创建事件
   */
  createEventFromTemplate(templateId: string, date: Date, customData?: Partial<CalendarEvent>): CalendarEvent | null {
    const template = this.eventTemplates.find(t => t.id === templateId);
    if (!template) return null;

    const startDate = new Date(date);
    const endDate = new Date(startDate.getTime() + template.duration * 60000);

    return this.createEvent({
      title: template.title,
      description: template.description,
      startDate,
      endDate,
      allDay: template.duration >= 1440, // 24小时或以上为全天事件
      type: template.type,
      category: template.category,
      priority: template.priority,
      status: 'pending',
      color: template.color,
      reminders: template.defaultReminders,
      createdBy: 'user',
      ...customData
    });
  }

  /**
   * 获取事件模板
   */
  getEventTemplates(pregnancyWeek?: number): EventTemplate[] {
    if (!pregnancyWeek) return this.eventTemplates;

    return this.eventTemplates.filter(template => {
      if (!template.isPregnancyRelated) return true;
      if (!template.pregnancyWeekRange) return true;
      
      return pregnancyWeek >= template.pregnancyWeekRange.start && 
             pregnancyWeek <= template.pregnancyWeekRange.end;
    });
  }

  /**
   * 获取月视图数据
   */
  getMonthViewData(year: number, month: number): {
    days: Array<{
      date: Date;
      isCurrentMonth: boolean;
      events: CalendarEvent[];
      hasEvents: boolean;
    }>;
    weekHeaders: string[];
  } {
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const startDate = new Date(firstDay);
    startDate.setDate(startDate.getDate() - firstDay.getDay()); // 从周日开始
    
    const endDate = new Date(lastDay);
    endDate.setDate(endDate.getDate() + (6 - lastDay.getDay())); // 到周六结束

    const days: Array<{
      date: Date;
      isCurrentMonth: boolean;
      events: CalendarEvent[];
      hasEvents: boolean;
    }> = [];

    const currentDate = new Date(startDate);
    while (currentDate <= endDate) {
      const dayEvents = this.getEventsForDate(currentDate);
      days.push({
        date: new Date(currentDate),
        isCurrentMonth: currentDate.getMonth() === month,
        events: dayEvents,
        hasEvents: dayEvents.length > 0
      });
      currentDate.setDate(currentDate.getDate() + 1);
    }

    const weekHeaders = ['日', '一', '二', '三', '四', '五', '六'];

    return { days, weekHeaders };
  }

  /**
   * 获取周视图数据
   */
  getWeekViewData(date: Date): {
    days: Array<{
      date: Date;
      events: CalendarEvent[];
      hourlyEvents: { [hour: number]: CalendarEvent[] };
    }>;
    weekRange: { start: Date; end: Date };
  } {
    const startOfWeek = new Date(date);
    startOfWeek.setDate(date.getDate() - date.getDay());
    startOfWeek.setHours(0, 0, 0, 0);

    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 6);
    endOfWeek.setHours(23, 59, 59, 999);

    const days: Array<{
      date: Date;
      events: CalendarEvent[];
      hourlyEvents: { [hour: number]: CalendarEvent[] };
    }> = [];

    for (let i = 0; i < 7; i++) {
      const currentDay = new Date(startOfWeek);
      currentDay.setDate(startOfWeek.getDate() + i);
      
      const dayEvents = this.getEventsForDate(currentDay);
      const hourlyEvents: { [hour: number]: CalendarEvent[] } = {};

      // 按小时分组事件
      dayEvents.forEach(event => {
        if (!event.allDay) {
          const hour = event.startDate.getHours();
          if (!hourlyEvents[hour]) {
            hourlyEvents[hour] = [];
          }
          hourlyEvents[hour].push(event);
        }
      });

      days.push({
        date: new Date(currentDay),
        events: dayEvents,
        hourlyEvents
      });
    }

    return {
      days,
      weekRange: { start: startOfWeek, end: endOfWeek }
    };
  }

  /**
   * 搜索事件
   */
  searchEvents(query: string, startDate?: Date, endDate?: Date): CalendarEvent[] {
    let events = this.events;

    if (startDate && endDate) {
      events = this.getEvents(startDate, endDate);
    }

    const lowercaseQuery = query.toLowerCase();
    return events.filter(event => 
      event.title.toLowerCase().includes(lowercaseQuery) ||
      event.description?.toLowerCase().includes(lowercaseQuery) ||
      event.notes?.toLowerCase().includes(lowercaseQuery)
    );
  }

  /**
   * 获取即将到来的事件
   */
  getUpcomingEvents(days: number = 7): CalendarEvent[] {
    const now = new Date();
    const futureDate = new Date();
    futureDate.setDate(now.getDate() + days);

    return this.getEvents(now, futureDate)
      .filter(event => event.status !== 'completed' && event.status !== 'cancelled')
      .slice(0, 10); // 最多返回10个事件
  }

  /**
   * 获取今日事件摘要
   */
  getTodaySummary(): {
    totalEvents: number;
    completedEvents: number;
    pendingEvents: number;
    upcomingEvents: CalendarEvent[];
    overdueEvents: CalendarEvent[];
  } {
    const today = new Date();
    const todayEvents = this.getEventsForDate(today);
    const now = new Date();

    const completedEvents = todayEvents.filter(e => e.status === 'completed').length;
    const pendingEvents = todayEvents.filter(e => e.status === 'pending' || e.status === 'in_progress').length;
    
    const upcomingEvents = todayEvents.filter(e => 
      e.startDate > now && (e.status === 'pending' || e.status === 'in_progress')
    );
    
    const overdueEvents = todayEvents.filter(e => 
      e.startDate < now && (e.status === 'pending' || e.status === 'in_progress')
    );

    return {
      totalEvents: todayEvents.length,
      completedEvents,
      pendingEvents,
      upcomingEvents,
      overdueEvents
    };
  }

  /**
   * 同步外部数据源
   */
  private syncExternalData(): void {
    // 同步家庭协作任务
    const tasks = familyCollaborationService.getTasks();
    tasks.forEach(task => {
      if (task.dueDate) {
        this.createEventFromTask(task);
      }
    });

    // 同步产检预约
    const checkups = checkupService.getStandardCheckupSchedule();
    checkups.forEach(checkup => {
      this.createEventFromCheckupSchedule(checkup);
    });

    // 同步心情记录（作为提醒）
    this.createMoodReminders();

    // 同步胎动记录提醒
    this.createFetalMovementReminders();
  }

  /**
   * 从任务创建事件
   */
  private createEventFromTask(task: Task): void {
    if (!task.dueDate) return;

    const existingEvent = this.events.find(e => e.sourceId === task.id && e.sourceType === 'task');
    if (existingEvent) return;

    this.createEvent({
      title: task.title,
      description: task.description,
      startDate: task.dueDate,
      allDay: true,
      type: 'task',
      category: task.category === 'medical' ? 'medical' : 
                task.category === 'shopping' ? 'preparation' : 
                task.category === 'care' ? 'health' : 'family',
      priority: task.priority,
      status: task.status,
      color: this.getCategoryColor(task.category),
      createdBy: task.createdBy,
      sourceId: task.id,
      sourceType: 'task'
    });
  }

  /**
   * 从产检计划创建事件
   */
  private createEventFromCheckupSchedule(checkup: CheckupSchedule): void {
    const existingEvent = this.events.find(e => e.sourceId === checkup.id && e.sourceType === 'checkup');
    if (existingEvent) return;

    // 计算产检日期（基于当前日期和孕周）
    const today = new Date();
    const checkupDate = new Date(today);
    checkupDate.setDate(today.getDate() + (checkup.week - 24) * 7); // 假设当前24周

    const endDate = new Date(checkupDate);
    endDate.setHours(endDate.getHours() + Math.floor(checkup.estimatedDuration / 60));

    this.createEvent({
      title: `产检 - ${checkup.title}`,
      description: `第${checkup.week}周产检\n检查项目: ${checkup.items.join(', ')}\n准备事项: ${checkup.preparation.join(', ')}`,
      startDate: checkupDate,
      endDate,
      allDay: false,
      type: 'checkup',
      category: 'medical',
      priority: checkup.importance === 'high' ? 'high' : checkup.importance === 'medium' ? 'medium' : 'low',
      status: 'pending',
      color: '#FF6B6B',
      createdBy: 'system',
      sourceId: checkup.id,
      sourceType: 'checkup'
    });
  }

  /**
   * 创建心情记录提醒
   */
  private createMoodReminders(): void {
    const today = new Date();
    const reminderTime = new Date(today);
    reminderTime.setHours(20, 0, 0, 0); // 每天晚上8点提醒

    if (reminderTime > today) {
      this.createEvent({
        title: '记录今日心情',
        description: '花几分钟记录一下今天的心情和感受',
        startDate: reminderTime,
        allDay: false,
        type: 'reminder',
        category: 'personal',
        priority: 'low',
        status: 'pending',
        color: '#FFD93D',
        createdBy: 'system'
      });
    }
  }

  /**
   * 创建胎动记录提醒
   */
  private createFetalMovementReminders(): void {
    const today = new Date();
    const morningReminder = new Date(today);
    morningReminder.setHours(10, 0, 0, 0);
    
    const eveningReminder = new Date(today);
    eveningReminder.setHours(21, 0, 0, 0);

    if (morningReminder > today) {
      this.createEvent({
        title: '胎动记录提醒',
        description: '记录宝宝的胎动情况',
        startDate: morningReminder,
        allDay: false,
        type: 'reminder',
        category: 'health',
        priority: 'medium',
        status: 'pending',
        color: '#6BCF7F',
        createdBy: 'system'
      });
    }

    if (eveningReminder > today) {
      this.createEvent({
        title: '胎动记录提醒',
        description: '记录宝宝的胎动情况',
        startDate: eveningReminder,
        allDay: false,
        type: 'reminder',
        category: 'health',
        priority: 'medium',
        status: 'pending',
        color: '#6BCF7F',
        createdBy: 'system'
      });
    }
  }

  /**
   * 获取分类颜色
   */
  private getCategoryColor(category: string): string {
    const colors = {
      medical: '#FF6B6B',
      personal: '#4ECDC4',
      family: '#45B7D1',
      health: '#96CEB4',
      preparation: '#FFEAA7',
      other: '#DDA0DD'
    };
    return colors[category as keyof typeof colors] || colors.other;
  }

  /**
   * 初始化事件模板
   */
  private initializeTemplates(): void {
    this.eventTemplates = [
      {
        id: 'template_checkup',
        title: '产检预约',
        description: '定期产检，监测母婴健康',
        category: 'medical',
        type: 'checkup',
        priority: 'high',
        duration: 120,
        color: '#FF6B6B',
        defaultReminders: [
          { id: 'r1', type: 'notification', minutesBefore: 1440, message: '明天有产检预约' },
          { id: 'r2', type: 'notification', minutesBefore: 60, message: '1小时后产检' }
        ],
        isPregnancyRelated: true
      },
      {
        id: 'template_mood_record',
        title: '心情记录',
        description: '记录每日心情和感受',
        category: 'personal',
        type: 'mood',
        priority: 'low',
        duration: 15,
        color: '#FFD93D',
        defaultReminders: [
          { id: 'r3', type: 'notification', minutesBefore: 0, message: '记录今日心情' }
        ],
        isPregnancyRelated: false
      },
      {
        id: 'template_fetal_movement',
        title: '胎动记录',
        description: '记录宝宝的胎动情况',
        category: 'health',
        type: 'fetal_movement',
        priority: 'medium',
        duration: 30,
        color: '#6BCF7F',
        defaultReminders: [
          { id: 'r4', type: 'notification', minutesBefore: 0, message: '开始胎动记录' }
        ],
        isPregnancyRelated: true,
        pregnancyWeekRange: { start: 20, end: 40 }
      },
      {
        id: 'template_exercise',
        title: '孕期运动',
        description: '适合孕期的轻度运动',
        category: 'health',
        type: 'custom',
        priority: 'medium',
        duration: 60,
        color: '#74B9FF',
        defaultReminders: [
          { id: 'r5', type: 'notification', minutesBefore: 15, message: '准备开始运动' }
        ],
        isPregnancyRelated: true
      },
      {
        id: 'template_nutrition',
        title: '营养补充',
        description: '服用孕期营养补充剂',
        category: 'health',
        type: 'reminder',
        priority: 'medium',
        duration: 5,
        color: '#A29BFE',
        defaultReminders: [
          { id: 'r6', type: 'notification', minutesBefore: 0, message: '服用营养补充剂' }
        ],
        isPregnancyRelated: true
      }
    ];
  }

  /**
   * 排序事件
   */
  private sortEvents(): void {
    this.events.sort((a, b) => a.startDate.getTime() - b.startDate.getTime());
  }
}

export const calendarService = new CalendarService();