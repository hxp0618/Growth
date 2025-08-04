import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Modal,
  TextInput,
  Alert
} from 'react-native';
import Card from './ui/Card';
import Button from './ui/Button';
import Theme from '../constants/Theme';
import {
  familyCollaborationService,
  FamilyMember,
  Task,
  FamilyStats
} from '../services/familyCollaborationService';

interface FamilyCollaborationProps {
  currentUserId?: string;
  pregnancyWeek?: number;
  style?: any;
}

export const FamilyCollaboration: React.FC<FamilyCollaborationProps> = ({
  currentUserId = 'member_1',
  pregnancyWeek = 28,
  style
}) => {
  const [members, setMembers] = useState<FamilyMember[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [stats, setStats] = useState<FamilyStats | null>(null);
  const [activeTab, setActiveTab] = useState<'tasks' | 'members' | 'stats'>('tasks');
  const [showCreateTask, setShowCreateTask] = useState(false);
  const [taskFilter, setTaskFilter] = useState<'all' | 'pending' | 'completed'>('all');

  // 创建任务表单状态
  const [newTask, setNewTask] = useState({
    title: '',
    description: '',
    category: 'preparation' as Task['category'],
    priority: 'medium' as Task['priority'],
    assignedTo: ''
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    const membersData = familyCollaborationService.getMembers();
    const tasksData = familyCollaborationService.getTasks();
    const statsData = familyCollaborationService.getFamilyStats();

    setMembers(membersData);
    setTasks(tasksData);
    setStats(statsData);
  };

  const handleCreateTask = () => {
    if (!newTask.title.trim() || !newTask.assignedTo) {
      Alert.alert('提示', '请填写任务标题并选择负责人');
      return;
    }

    const task = familyCollaborationService.createTask({
      title: newTask.title,
      description: newTask.description,
      category: newTask.category,
      priority: newTask.priority,
      assignedTo: newTask.assignedTo,
      createdBy: currentUserId
    });

    setTasks(prev => [task, ...prev]);
    setNewTask({
      title: '',
      description: '',
      category: 'preparation',
      priority: 'medium',
      assignedTo: ''
    });
    setShowCreateTask(false);
    loadData();
    Alert.alert('成功', '任务创建成功');
  };

  const handleTaskStatusChange = (taskId: string, status: Task['status']) => {
    const updatedTask = familyCollaborationService.updateTaskStatus(taskId, status, currentUserId);
    if (updatedTask) {
      setTasks(prev => prev.map(t => t.id === taskId ? updatedTask : t));
      loadData();
    }
  };

  const getFilteredTasks = () => {
    switch (taskFilter) {
      case 'pending':
        return tasks.filter(t => t.status === 'pending' || t.status === 'in_progress');
      case 'completed':
        return tasks.filter(t => t.status === 'completed');
      default:
        return tasks;
    }
  };

  const getPriorityColor = (priority: Task['priority']) => {
    switch (priority) {
      case 'urgent': return Theme.Colors.error;
      case 'high': return Theme.Colors.warning;
      case 'medium': return Theme.Colors.info;
      case 'low': return Theme.Colors.neutral500;
      default: return Theme.Colors.neutral500;
    }
  };

  const getCategoryIcon = (category: Task['category']) => {
    switch (category) {
      case 'medical': return '🏥';
      case 'shopping': return '🛒';
      case 'preparation': return '📦';
      case 'care': return '💝';
      case 'emergency': return '🚨';
      default: return '📋';
    }
  };

  const getRoleColor = (role: FamilyMember['role']) => {
    switch (role) {
      case 'pregnant': return Theme.Colors.pregnant;
      case 'partner': return Theme.Colors.partner;
      case 'grandparent': return Theme.Colors.grandparent;
      case 'family': return Theme.Colors.family;
      default: return Theme.Colors.neutral500;
    }
  };

  const renderTasksTab = () => (
    <ScrollView style={styles.tabContent}>
      {/* 任务过滤器 */}
      <View style={styles.filterContainer}>
        {[
          { key: 'all', label: '全部' },
          { key: 'pending', label: '进行中' },
          { key: 'completed', label: '已完成' }
        ].map(filter => (
          <TouchableOpacity
            key={filter.key}
            style={[
              styles.filterButton,
              taskFilter === filter.key && styles.filterButtonActive
            ]}
            onPress={() => setTaskFilter(filter.key as any)}
          >
            <Text style={[
              styles.filterButtonText,
              taskFilter === filter.key && styles.filterButtonTextActive
            ]}>
              {filter.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* 任务列表 */}
      <View style={styles.tasksContainer}>
        {getFilteredTasks().map(task => {
          const assignedMember = members.find(m => m.id === task.assignedTo);
          
          return (
            <View key={task.id} style={styles.taskCard}>
              <View style={styles.taskHeader}>
                <View style={styles.taskTitleRow}>
                  <Text style={styles.taskCategoryIcon}>
                    {getCategoryIcon(task.category)}
                  </Text>
                  <Text style={styles.taskTitle} numberOfLines={1}>
                    {task.title}
                  </Text>
                  <View style={[
                    styles.priorityDot,
                    { backgroundColor: getPriorityColor(task.priority) }
                  ]} />
                </View>
                
                <View style={styles.taskMeta}>
                  <Text style={styles.taskAssignee}>
                    👤 {assignedMember?.name || '未知'}
                  </Text>
                  <View style={[styles.statusBadge, {
                    backgroundColor: task.status === 'completed' ? Theme.Colors.successLight :
                                   task.status === 'in_progress' ? Theme.Colors.warningLight :
                                   Theme.Colors.neutral200
                  }]}>
                    <Text style={[styles.statusText, {
                      color: task.status === 'completed' ? Theme.Colors.success :
                             task.status === 'in_progress' ? Theme.Colors.warning :
                             Theme.Colors.neutral600
                    }]}>
                      {task.status === 'completed' ? '已完成' :
                       task.status === 'in_progress' ? '进行中' :
                       task.status === 'pending' ? '待开始' : '已取消'}
                    </Text>
                  </View>
                </View>
              </View>
              
              {task.description && (
                <Text style={styles.taskDescription} numberOfLines={2}>
                  {task.description}
                </Text>
              )}
              
              {/* 任务操作按钮 */}
              {task.assignedTo === currentUserId && task.status !== 'completed' && (
                <View style={styles.taskActions}>
                  {task.status === 'pending' && (
                    <TouchableOpacity
                      style={styles.actionButton}
                      onPress={() => handleTaskStatusChange(task.id, 'in_progress')}
                    >
                      <Text style={styles.actionButtonText}>开始</Text>
                    </TouchableOpacity>
                  )}
                  {task.status === 'in_progress' && (
                    <TouchableOpacity
                      style={[styles.actionButton, styles.completeButton]}
                      onPress={() => handleTaskStatusChange(task.id, 'completed')}
                    >
                      <Text style={[styles.actionButtonText, styles.completeButtonText]}>完成</Text>
                    </TouchableOpacity>
                  )}
                </View>
              )}
            </View>
          );
        })}
      </View>

      {getFilteredTasks().length === 0 && (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>暂无任务</Text>
        </View>
      )}
    </ScrollView>
  );

  const renderMembersTab = () => (
    <ScrollView style={styles.tabContent}>
      <View style={styles.membersContainer}>
        {members.map(member => {
          const memberStats = stats?.memberStats[member.id];
          
          return (
            <Card key={member.id} style={styles.memberCard}>
              <View style={styles.memberHeader}>
                <View style={[styles.memberAvatar, { backgroundColor: getRoleColor(member.role) }]}>
                  <Text style={styles.memberAvatarText}>{member.avatar}</Text>
                </View>
                <View style={styles.memberInfo}>
                  <Text style={styles.memberName}>{member.name}</Text>
                  <Text style={styles.memberRole}>
                    {member.role === 'pregnant' ? '孕妇' :
                     member.role === 'partner' ? '伴侣' :
                     member.role === 'grandparent' ? '长辈' : '家人'}
                  </Text>
                </View>
                <View style={styles.memberStatus}>
                  <View style={[styles.statusIndicator, {
                    backgroundColor: member.isActive ? Theme.Colors.success : Theme.Colors.neutral400
                  }]} />
                </View>
              </View>
              
              {memberStats && (
                <View style={styles.memberStats}>
                  <View style={styles.memberStatItem}>
                    <Text style={styles.memberStatValue}>{memberStats.assigned}</Text>
                    <Text style={styles.memberStatLabel}>分配任务</Text>
                  </View>
                  <View style={styles.memberStatItem}>
                    <Text style={styles.memberStatValue}>{memberStats.completed}</Text>
                    <Text style={styles.memberStatLabel}>完成任务</Text>
                  </View>
                  <View style={styles.memberStatItem}>
                    <Text style={styles.memberStatValue}>
                      {memberStats.completionRate.toFixed(0)}%
                    </Text>
                    <Text style={styles.memberStatLabel}>完成率</Text>
                  </View>
                </View>
              )}
            </Card>
          );
        })}
      </View>
    </ScrollView>
  );

  const renderStatsTab = () => (
    <ScrollView style={styles.tabContent}>
      {stats && (
        <Card style={styles.overallStatsCard}>
          <Text style={styles.cardTitle}>📊 总体统计</Text>
          <View style={styles.overallStatsGrid}>
            <View style={styles.overallStatItem}>
              <Text style={styles.overallStatValue}>{stats.totalTasks}</Text>
              <Text style={styles.overallStatLabel}>总任务数</Text>
            </View>
            <View style={styles.overallStatItem}>
              <Text style={styles.overallStatValue}>{stats.completedTasks}</Text>
              <Text style={styles.overallStatLabel}>已完成</Text>
            </View>
            <View style={styles.overallStatItem}>
              <Text style={styles.overallStatValue}>{stats.pendingTasks}</Text>
              <Text style={styles.overallStatLabel}>待完成</Text>
            </View>
            <View style={styles.overallStatItem}>
              <Text style={styles.overallStatValue}>
                {stats.completionRate.toFixed(1)}%
              </Text>
              <Text style={styles.overallStatLabel}>完成率</Text>
            </View>
          </View>
        </Card>
      )}
    </ScrollView>
  );

  return (
    <View style={[styles.container, style]}>
      <Card style={styles.headerCard}>
        <View style={styles.header}>
          <Text style={styles.title}>👨‍👩‍👧‍👦 家庭协作</Text>
          <TouchableOpacity
            style={styles.createButton}
            onPress={() => setShowCreateTask(true)}
          >
            <Text style={styles.createButtonText}>+ 创建</Text>
          </TouchableOpacity>
        </View>
        
        <View style={styles.tabBar}>
          {[
            { key: 'tasks', label: '任务' },
            { key: 'members', label: '成员' },
            { key: 'stats', label: '统计' }
          ].map(tab => (
            <TouchableOpacity
              key={tab.key}
              style={[
                styles.tab,
                activeTab === tab.key && styles.tabActive
              ]}
              onPress={() => setActiveTab(tab.key as any)}
            >
              <Text style={[
                styles.tabText,
                activeTab === tab.key && styles.tabTextActive
              ]}>
                {tab.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </Card>

      {activeTab === 'tasks' && renderTasksTab()}
      {activeTab === 'members' && renderMembersTab()}
      {activeTab === 'stats' && renderStatsTab()}

      {/* 创建任务模态框 */}
      <Modal
        visible={showCreateTask}
        animationType="slide"
        presentationStyle="pageSheet"
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <TouchableOpacity onPress={() => setShowCreateTask(false)}>
              <Text style={styles.modalCancel}>取消</Text>
            </TouchableOpacity>
            <Text style={styles.modalTitle}>创建任务</Text>
            <TouchableOpacity onPress={handleCreateTask}>
              <Text style={styles.modalSave}>创建</Text>
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.modalContent}>
            <View style={styles.formGroup}>
              <Text style={styles.formLabel}>任务标题 *</Text>
              <TextInput
                style={styles.formInput}
                placeholder="输入任务标题"
                value={newTask.title}
                onChangeText={(text) => setNewTask(prev => ({ ...prev, title: text }))}
              />
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.formLabel}>任务描述</Text>
              <TextInput
                style={[styles.formInput, styles.formTextArea]}
                placeholder="输入任务描述"
                multiline
                numberOfLines={3}
                value={newTask.description}
                onChangeText={(text) => setNewTask(prev => ({ ...prev, description: text }))}
              />
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.formLabel}>负责人 *</Text>
              <View style={styles.memberButtons}>
                {members.map(member => (
                  <TouchableOpacity
                    key={member.id}
                    style={[
                      styles.memberButton,
                      newTask.assignedTo === member.id && styles.memberButtonActive
                    ]}
                    onPress={() => setNewTask(prev => ({ ...prev, assignedTo: member.id }))}
                  >
                    <Text style={styles.memberButtonAvatar}>{member.avatar}</Text>
                    <Text style={[
                      styles.memberButtonText,
                      newTask.assignedTo === member.id && styles.memberButtonTextActive
                    ]}>
                      {member.name}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          </ScrollView>
        </View>
      </Modal>
    </View>
  );
};

const styles = {
  container: {
    marginBottom: 16,
  },
  headerCard: {
    marginBottom: 12,
  },
  header: {
    flexDirection: 'row' as const,
    justifyContent: 'space-between' as const,
    alignItems: 'center' as const,
    marginBottom: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold' as const,
    color: Theme.Colors.neutral900,
  },
  createButton: {
    backgroundColor: Theme.Colors.primary,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  createButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '500' as const,
  },
  tabBar: {
    flexDirection: 'row' as const,
    backgroundColor: Theme.Colors.neutral100,
    borderRadius: 8,
    padding: 4,
  },
  tab: {
    flex: 1,
    paddingVertical: 8,
    alignItems: 'center' as const,
    borderRadius: 6,
  },
  tabActive: {
    backgroundColor: 'white',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  tabText: {
    fontSize: 14,
    color: Theme.Colors.neutral500,
  },
  tabTextActive: {
    color: Theme.Colors.primary,
    fontWeight: '500' as const,
  },
  tabContent: {
    flex: 1,
  },
  filterContainer: {
    flexDirection: 'row' as const,
    marginBottom: 12,
    gap: 8,
  },
  filterButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: Theme.Colors.neutral200,
  },
  filterButtonActive: {
    backgroundColor: Theme.Colors.primary,
  },
  filterButtonText: {
    fontSize: 14,
    color: Theme.Colors.neutral600,
  },
  filterButtonTextActive: {
    color: 'white',
    fontWeight: '500' as const,
  },
  tasksContainer: {
    gap: 8,
  },
  taskCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: Theme.Colors.neutral200,
  },
  taskHeader: {
    marginBottom: 8,
  },
  taskTitleRow: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    marginBottom: 8,
  },
  taskCategoryIcon: {
    fontSize: 16,
    marginRight: 8,
  },
  taskTitle: {
    flex: 1,
    fontSize: 16,
    fontWeight: '500' as const,
    color: Theme.Colors.neutral900,
  },
  priorityDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginLeft: 8,
  },
  taskMeta: {
    flexDirection: 'row' as const,
    justifyContent: 'space-between' as const,
    alignItems: 'center' as const,
  },
  taskAssignee: {
    fontSize: 12,
    color: Theme.Colors.neutral600,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '500' as const,
  },
  taskDescription: {
    fontSize: 14,
    color: Theme.Colors.neutral700,
    lineHeight: 20,
    marginBottom: 8,
  },
  taskActions: {
    flexDirection: 'row' as const,
    gap: 8,
    marginTop: 8,
  },
  actionButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: Theme.Colors.info,
  },
  completeButton: {
    backgroundColor: Theme.Colors.success,
  },
  actionButtonText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '500' as const,
  },
  completeButtonText: {
    color: 'white',
  },
  emptyContainer: {
    alignItems: 'center' as const,
    paddingVertical: 40,
  },
  emptyText: {
    fontSize: 16,
    color: Theme.Colors.neutral500,
  },
  membersContainer: {
    gap: 12,
  },
  memberCard: {
    marginBottom: 8,
  },
  memberHeader: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    marginBottom: 12,
  },
  memberAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center' as const,
    alignItems: 'center' as const,
    marginRight: 12,
  },
  memberAvatarText: {
    fontSize: 20,
  },
  memberInfo: {
    flex: 1,
  },
  memberName: {
    fontSize: 16,
    fontWeight: '500' as const,
    color: Theme.Colors.neutral900,
  },
  memberRole: {
    fontSize: 12,
    color: Theme.Colors.neutral500,
    marginTop: 2,
  },
  memberStatus: {
    alignItems: 'center' as const,
  },
  statusIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  memberStats: {
    flexDirection: 'row' as const,
    justifyContent: 'space-around' as const,
  },
  memberStatItem: {
    alignItems: 'center' as const,
  },
  memberStatValue: {
    fontSize: 18,
    fontWeight: 'bold' as const,
    color: Theme.Colors.primary,
  },
  memberStatLabel: {
    fontSize: 12,
    color: Theme.Colors.neutral500,
    marginTop: 2,
  },
  overallStatsCard: {
    marginBottom: 12,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: 'bold' as const,
    color: Theme.Colors.neutral900,
    marginBottom: 12,
  },
  overallStatsGrid: {
    flexDirection: 'row' as const,
    flexWrap: 'wrap' as const,
    gap: 12,
  },
  overallStatItem: {
    flex: 1,
    minWidth: 80,
    alignItems: 'center' as const,
    padding: 12,
    backgroundColor: Theme.Colors.neutral100,
    borderRadius: 8,
  },
  overallStatValue: {
    fontSize: 20,
    fontWeight: 'bold' as const,
    color: Theme.Colors.primary,
    marginBottom: 4,
  },
  overallStatLabel: {
    fontSize: 12,
    color: Theme.Colors.neutral500,
    textAlign: 'center' as const,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'white',
  },
  modalHeader: {
    flexDirection: 'row' as const,
    justifyContent: 'space-between' as const,
    alignItems: 'center' as const,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: Theme.Colors.neutral200,
  },
  modalCancel: {
    fontSize: 16,
    color: Theme.Colors.neutral500,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold' as const,
    color: Theme.Colors.neutral900,
  },
  modalSave: {
    fontSize: 16,
    color: Theme.Colors.primary,
    fontWeight: '500' as const,
  },
  modalContent: {
    flex: 1,
    padding: 16,
  },
  formGroup: {
    marginBottom: 16,
  },
  formLabel: {
    fontSize: 14,
    fontWeight: '500' as const,
    color: Theme.Colors.neutral900,
    marginBottom: 8,
  },
  formInput: {
    borderWidth: 1,
    borderColor: Theme.Colors.neutral200,
    borderRadius: 8,
    padding: 12,
    fontSize: 14,
    color: Theme.Colors.neutral900,
  },
  formTextArea: {
    textAlignVertical: 'top' as const,
    minHeight: 80,
  },
  memberButtons: {
    flexDirection: 'row' as const,
    flexWrap: 'wrap' as const,
    gap: 8,
  },
  memberButton: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: Theme.Colors.neutral200,
    borderWidth: 1,
    borderColor: Theme.Colors.neutral300,
  },
  memberButtonActive: {
    backgroundColor: Theme.Colors.primaryLight,
    borderColor: Theme.Colors.primary,
  },
  memberButtonAvatar: {
    fontSize: 16,
    marginRight: 6,
  },
  memberButtonText: {
    fontSize: 14,
    color: Theme.Colors.neutral700,
  },
  memberButtonTextActive: {
    color: Theme.Colors.primary,
    fontWeight: '500' as const,
  },
};