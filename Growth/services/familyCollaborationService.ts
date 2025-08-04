export interface FamilyMember {
  id: string;
  name: string;
  role: 'pregnant' | 'partner' | 'grandparent' | 'family';
  avatar: string;
  phone?: string;
  email?: string;
  isActive: boolean;
  joinDate: Date;
  preferences: {
    notifications: boolean;
    taskReminders: boolean;
    emergencyAlerts: boolean;
  };
}

export interface Task {
  id: string;
  title: string;
  description: string;
  category: 'medical' | 'shopping' | 'preparation' | 'care' | 'emergency';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  status: 'pending' | 'in_progress' | 'completed' | 'cancelled';
  assignedTo: string; // member id
  createdBy: string; // member id
  dueDate?: Date;
  completedAt?: Date;
  completedBy?: string;
  notes?: string;
  attachments?: string[];
  subtasks?: SubTask[];
  feedback?: TaskFeedback;
}

export interface SubTask {
  id: string;
  title: string;
  completed: boolean;
  completedAt?: Date;
}

export interface TaskFeedback {
  rating: 1 | 2 | 3 | 4 | 5;
  comment?: string;
  photos?: string[];
  submittedAt: Date;
  submittedBy: string;
}

export interface TaskTemplate {
  id: string;
  title: string;
  description: string;
  category: Task['category'];
  priority: Task['priority'];
  estimatedDuration: number; // 分钟
  pregnancyWeekRange?: {
    start: number;
    end: number;
  };
  recommendedRole?: FamilyMember['role'];
  subtasks: string[];
}

export interface FamilyStats {
  totalTasks: number;
  completedTasks: number;
  pendingTasks: number;
  completionRate: number;
  memberStats: {
    [memberId: string]: {
      assigned: number;
      completed: number;
      completionRate: number;
      averageRating: number;
    };
  };
  categoryStats: {
    [category: string]: {
      total: number;
      completed: number;
    };
  };
}

export interface Notification {
  id: string;
  type: 'task_assigned' | 'task_completed' | 'task_overdue' | 'emergency' | 'reminder';
  title: string;
  message: string;
  recipientId: string;
  senderId?: string;
  taskId?: string;
  isRead: boolean;
  createdAt: Date;
  priority: 'low' | 'medium' | 'high';
}

class FamilyCollaborationService {
  private members: FamilyMember[] = [];
  private tasks: Task[] = [];
  private notifications: Notification[] = [];
  private taskTemplates: TaskTemplate[] = [];

  constructor() {
    this.initializeTemplates();
    this.generateMockData();
  }

  /**
   * 家庭成员管理
   */
  addMember(member: Omit<FamilyMember, 'id' | 'joinDate'>): FamilyMember {
    const newMember: FamilyMember = {
      ...member,
      id: `member_${Date.now()}`,
      joinDate: new Date()
    };
    this.members.push(newMember);
    return newMember;
  }

  getMembers(): FamilyMember[] {
    return this.members.filter(m => m.isActive);
  }

  getMemberById(id: string): FamilyMember | undefined {
    return this.members.find(m => m.id === id);
  }

  updateMember(id: string, updates: Partial<FamilyMember>): FamilyMember | null {
    const memberIndex = this.members.findIndex(m => m.id === id);
    if (memberIndex === -1) return null;
    
    this.members[memberIndex] = { ...this.members[memberIndex], ...updates };
    return this.members[memberIndex];
  }

  /**
   * 任务管理
   */
  createTask(task: Omit<Task, 'id' | 'status' | 'createdAt'>): Task {
    const newTask: Task = {
      ...task,
      id: `task_${Date.now()}`,
      status: 'pending'
    };
    
    this.tasks.unshift(newTask);
    
    // 发送通知给被分配的成员
    this.sendNotification({
      type: 'task_assigned',
      title: '新任务分配',
      message: `您被分配了新任务：${task.title}`,
      recipientId: task.assignedTo,
      senderId: task.createdBy,
      taskId: newTask.id,
      priority: task.priority === 'urgent' ? 'high' : 'medium'
    });
    
    return newTask;
  }

  getTasks(filters?: {
    status?: Task['status'];
    assignedTo?: string;
    category?: Task['category'];
    priority?: Task['priority'];
  }): Task[] {
    let filteredTasks = [...this.tasks];
    
    if (filters) {
      if (filters.status) {
        filteredTasks = filteredTasks.filter(t => t.status === filters.status);
      }
      if (filters.assignedTo) {
        filteredTasks = filteredTasks.filter(t => t.assignedTo === filters.assignedTo);
      }
      if (filters.category) {
        filteredTasks = filteredTasks.filter(t => t.category === filters.category);
      }
      if (filters.priority) {
        filteredTasks = filteredTasks.filter(t => t.priority === filters.priority);
      }
    }
    
    return filteredTasks;
  }

  updateTaskStatus(taskId: string, status: Task['status'], completedBy?: string): Task | null {
    const taskIndex = this.tasks.findIndex(t => t.id === taskId);
    if (taskIndex === -1) return null;
    
    const task = this.tasks[taskIndex];
    task.status = status;
    
    if (status === 'completed') {
      task.completedAt = new Date();
      task.completedBy = completedBy;
      
      // 发送完成通知
      this.sendNotification({
        type: 'task_completed',
        title: '任务已完成',
        message: `任务"${task.title}"已完成`,
        recipientId: task.createdBy,
        senderId: completedBy,
        taskId: taskId,
        priority: 'medium'
      });
    }
    
    return task;
  }

  addTaskFeedback(taskId: string, feedback: Omit<TaskFeedback, 'submittedAt'>): Task | null {
    const task = this.tasks.find(t => t.id === taskId);
    if (!task) return null;
    
    task.feedback = {
      ...feedback,
      submittedAt: new Date()
    };
    
    return task;
  }

  /**
   * 任务模板管理
   */
  getTaskTemplates(pregnancyWeek?: number): TaskTemplate[] {
    if (!pregnancyWeek) return this.taskTemplates;
    
    return this.taskTemplates.filter(template => {
      if (!template.pregnancyWeekRange) return true;
      return pregnancyWeek >= template.pregnancyWeekRange.start && 
             pregnancyWeek <= template.pregnancyWeekRange.end;
    });
  }

  createTaskFromTemplate(templateId: string, assignedTo: string, createdBy: string): Task | null {
    const template = this.taskTemplates.find(t => t.id === templateId);
    if (!template) return null;
    
    const subtasks: SubTask[] = template.subtasks.map((title, index) => ({
      id: `subtask_${Date.now()}_${index}`,
      title,
      completed: false
    }));
    
    return this.createTask({
      title: template.title,
      description: template.description,
      category: template.category,
      priority: template.priority,
      assignedTo,
      createdBy,
      subtasks
    });
  }

  /**
   * 统计分析
   */
  getFamilyStats(): FamilyStats {
    const totalTasks = this.tasks.length;
    const completedTasks = this.tasks.filter(t => t.status === 'completed').length;
    const pendingTasks = this.tasks.filter(t => t.status === 'pending').length;
    const completionRate = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;
    
    // 成员统计
    const memberStats: FamilyStats['memberStats'] = {};
    this.members.forEach(member => {
      const assignedTasks = this.tasks.filter(t => t.assignedTo === member.id);
      const completedByMember = assignedTasks.filter(t => t.status === 'completed');
      const ratings = completedByMember
        .filter(t => t.feedback?.rating)
        .map(t => t.feedback!.rating);
      
      memberStats[member.id] = {
        assigned: assignedTasks.length,
        completed: completedByMember.length,
        completionRate: assignedTasks.length > 0 ? (completedByMember.length / assignedTasks.length) * 100 : 0,
        averageRating: ratings.length > 0 ? ratings.reduce((sum, r) => sum + r, 0) / ratings.length : 0
      };
    });
    
    // 分类统计
    const categoryStats: FamilyStats['categoryStats'] = {};
    const categories: Task['category'][] = ['medical', 'shopping', 'preparation', 'care', 'emergency'];
    categories.forEach(category => {
      const categoryTasks = this.tasks.filter(t => t.category === category);
      const completedCategoryTasks = categoryTasks.filter(t => t.status === 'completed');
      
      categoryStats[category] = {
        total: categoryTasks.length,
        completed: completedCategoryTasks.length
      };
    });
    
    return {
      totalTasks,
      completedTasks,
      pendingTasks,
      completionRate,
      memberStats,
      categoryStats
    };
  }

  /**
   * 通知管理
   */
  sendNotification(notification: Omit<Notification, 'id' | 'isRead' | 'createdAt'>): Notification {
    const newNotification: Notification = {
      ...notification,
      id: `notification_${Date.now()}`,
      isRead: false,
      createdAt: new Date()
    };
    
    this.notifications.unshift(newNotification);
    return newNotification;
  }

  getNotifications(recipientId: string, unreadOnly: boolean = false): Notification[] {
    let notifications = this.notifications.filter(n => n.recipientId === recipientId);
    
    if (unreadOnly) {
      notifications = notifications.filter(n => !n.isRead);
    }
    
    return notifications.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }

  markNotificationAsRead(notificationId: string): boolean {
    const notification = this.notifications.find(n => n.id === notificationId);
    if (!notification) return false;
    
    notification.isRead = true;
    return true;
  }

  /**
   * 智能推荐
   */
  getRecommendedTasks(pregnancyWeek: number, memberId: string): TaskTemplate[] {
    const member = this.getMemberById(memberId);
    if (!member) return [];
    
    const templates = this.getTaskTemplates(pregnancyWeek);
    
    // 根据角色和孕周推荐任务
    return templates
      .filter(template => {
        if (template.recommendedRole && template.recommendedRole !== member.role) {
          return false;
        }
        
        // 检查是否已经有类似的未完成任务
        const existingSimilarTask = this.tasks.find(task => 
          task.title === template.title && 
          task.status !== 'completed' && 
          task.status !== 'cancelled'
        );
        
        return !existingSimilarTask;
      })
      .slice(0, 5); // 最多推荐5个任务
  }

  /**
   * 初始化任务模板
   */
  private initializeTemplates(): void {
    this.taskTemplates = [
      {
        id: 'template_1',
        title: '购买孕妇奶粉',
        description: '选择适合的孕妇奶粉，补充营养',
        category: 'shopping',
        priority: 'medium',
        estimatedDuration: 60,
        pregnancyWeekRange: { start: 12, end: 40 },
        recommendedRole: 'partner',
        subtasks: ['研究品牌和成分', '比较价格', '购买并试用']
      },
      {
        id: 'template_2',
        title: '准备待产包',
        description: '为分娩准备必需用品',
        category: 'preparation',
        priority: 'high',
        estimatedDuration: 180,
        pregnancyWeekRange: { start: 32, end: 38 },
        subtasks: ['列出必需品清单', '购买用品', '整理打包', '放置在易取位置']
      },
      {
        id: 'template_3',
        title: '陪同产检',
        description: '陪伴孕妇进行定期产检',
        category: 'medical',
        priority: 'high',
        estimatedDuration: 120,
        recommendedRole: 'partner',
        subtasks: ['确认产检时间', '准备相关资料', '陪同前往医院', '记录检查结果']
      },
      {
        id: 'template_4',
        title: '准备婴儿房',
        description: '布置和准备婴儿房间',
        category: 'preparation',
        priority: 'medium',
        estimatedDuration: 300,
        pregnancyWeekRange: { start: 28, end: 36 },
        subtasks: ['设计房间布局', '购买婴儿家具', '安装安全设施', '清洁和消毒']
      },
      {
        id: 'template_5',
        title: '学习育儿知识',
        description: '学习新生儿护理和育儿技巧',
        category: 'preparation',
        priority: 'medium',
        estimatedDuration: 120,
        pregnancyWeekRange: { start: 20, end: 40 },
        subtasks: ['阅读育儿书籍', '观看教学视频', '参加育儿课程', '练习护理技巧']
      },
      {
        id: 'template_6',
        title: '紧急联系人更新',
        description: '更新紧急联系人信息',
        category: 'emergency',
        priority: 'high',
        estimatedDuration: 30,
        subtasks: ['整理联系人列表', '确认电话号码', '分享给家庭成员', '保存在显眼位置']
      }
    ];
  }

  /**
   * 生成模拟数据
   */
  private generateMockData(): void {
    // 添加家庭成员
    this.members = [
      {
        id: 'member_1',
        name: '小雨',
        role: 'pregnant',
        avatar: '👩',
        isActive: true,
        joinDate: new Date('2024-01-01'),
        preferences: {
          notifications: true,
          taskReminders: true,
          emergencyAlerts: true
        }
      },
      {
        id: 'member_2',
        name: '老公',
        role: 'partner',
        avatar: '👨',
        phone: '138****8888',
        isActive: true,
        joinDate: new Date('2024-01-01'),
        preferences: {
          notifications: true,
          taskReminders: true,
          emergencyAlerts: true
        }
      },
      {
        id: 'member_3',
        name: '婆婆',
        role: 'grandparent',
        avatar: '👵',
        phone: '139****9999',
        isActive: true,
        joinDate: new Date('2024-01-15'),
        preferences: {
          notifications: true,
          taskReminders: false,
          emergencyAlerts: true
        }
      },
      {
        id: 'member_4',
        name: '妈妈',
        role: 'grandparent',
        avatar: '👩‍🦳',
        phone: '137****7777',
        isActive: true,
        joinDate: new Date('2024-01-20'),
        preferences: {
          notifications: true,
          taskReminders: true,
          emergencyAlerts: true
        }
      }
    ];

    // 生成一些示例任务
    const sampleTasks: Omit<Task, 'id'>[] = [
      {
        title: '购买孕妇奶粉',
        description: '选择适合的孕妇奶粉品牌，注意营养成分',
        category: 'shopping',
        priority: 'medium',
        status: 'completed',
        assignedTo: 'member_2',
        createdBy: 'member_1',
        completedAt: new Date(Date.now() - 86400000), // 1天前
        completedBy: 'member_2',
        feedback: {
          rating: 5,
          comment: '买到了很好的奶粉，小雨很喜欢',
          submittedAt: new Date(Date.now() - 86400000 + 3600000),
          submittedBy: 'member_1'
        }
      },
      {
        title: '陪同产检',
        description: '下周二上午9点产检，需要陪同',
        category: 'medical',
        priority: 'high',
        status: 'pending',
        assignedTo: 'member_2',
        createdBy: 'member_1',
        dueDate: new Date(Date.now() + 2 * 86400000) // 2天后
      },
      {
        title: '准备婴儿衣物',
        description: '购买新生儿衣物，包括连体衣、帽子、袜子等',
        category: 'shopping',
        priority: 'medium',
        status: 'in_progress',
        assignedTo: 'member_3',
        createdBy: 'member_1',
        notes: '已经买了一些，还需要补充'
      },
      {
        title: '学习新生儿护理',
        description: '学习如何给新生儿洗澡、换尿布等基本护理',
        category: 'preparation',
        priority: 'medium',
        status: 'pending',
        assignedTo: 'member_4',
        createdBy: 'member_1',
        subtasks: [
          { id: 'sub_1', title: '观看护理视频', completed: false },
          { id: 'sub_2', title: '阅读护理手册', completed: false },
          { id: 'sub_3', title: '实践练习', completed: false }
        ]
      }
    ];

    sampleTasks.forEach(task => {
      this.tasks.push({
        ...task,
        id: `task_${Date.now()}_${Math.random()}`
      });
    });

    // 生成一些通知
    this.notifications = [
      {
        id: 'notif_1',
        type: 'task_completed',
        title: '任务完成',
        message: '老公已完成"购买孕妇奶粉"任务',
        recipientId: 'member_1',
        senderId: 'member_2',
        taskId: this.tasks[0].id,
        isRead: false,
        createdAt: new Date(Date.now() - 3600000),
        priority: 'medium'
      },
      {
        id: 'notif_2',
        type: 'task_assigned',
        title: '新任务分配',
        message: '您被分配了新任务：陪同产检',
        recipientId: 'member_2',
        senderId: 'member_1',
        taskId: this.tasks[1].id,
        isRead: true,
        createdAt: new Date(Date.now() - 7200000),
        priority: 'high'
      }
    ];
  }
}

export const familyCollaborationService = new FamilyCollaborationService();