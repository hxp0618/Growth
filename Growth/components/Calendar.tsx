import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Modal,
  TextInput,
  Alert,
  Dimensions
} from 'react-native';
import Card from './ui/Card';
import Button from './ui/Button';
import Theme from '../constants/Theme';
import {
  calendarService,
  CalendarEvent,
  CalendarView,
  EventTemplate
} from '../services/calendarService';

const { width } = Dimensions.get('window');

interface CalendarProps {
  style?: any;
}

export const Calendar: React.FC<CalendarProps> = ({ style }) => {
  const [currentView, setCurrentView] = useState<CalendarView['type']>('month');
  const [currentDate, setCurrentDate] = useState(new Date());
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [showEventDetail, setShowEventDetail] = useState<CalendarEvent | null>(null);
  const [showCreateEvent, setShowCreateEvent] = useState(false);

  // 创建事件表单状态
  const [newEvent, setNewEvent] = useState({
    title: '',
    description: '',
    category: 'other' as CalendarEvent['category'],
    priority: 'medium' as CalendarEvent['priority']
  });

  useEffect(() => {
    loadEvents();
  }, [currentDate, currentView]);

  const loadEvents = () => {
    const { startDate, endDate } = getViewDateRange();
    const eventsData = calendarService.getEvents(startDate, endDate);
    setEvents(eventsData);
  };

  const getViewDateRange = () => {
    const start = new Date(currentDate);
    const end = new Date(currentDate);

    switch (currentView) {
      case 'month':
        start.setDate(1);
        start.setHours(0, 0, 0, 0);
        end.setMonth(end.getMonth() + 1);
        end.setDate(0);
        end.setHours(23, 59, 59, 999);
        break;
      case 'week':
        const dayOfWeek = start.getDay();
        start.setDate(start.getDate() - dayOfWeek);
        start.setHours(0, 0, 0, 0);
        end.setDate(start.getDate() + 6);
        end.setHours(23, 59, 59, 999);
        break;
      case 'day':
        start.setHours(0, 0, 0, 0);
        end.setHours(23, 59, 59, 999);
        break;
      default:
        // agenda view - show next 30 days
        start.setHours(0, 0, 0, 0);
        end.setDate(end.getDate() + 30);
        end.setHours(23, 59, 59, 999);
    }

    return { startDate: start, endDate: end };
  };

  const handleCreateEvent = () => {
    if (!newEvent.title.trim()) {
      Alert.alert('提示', '请输入事件标题');
      return;
    }

    const startDate = selectedDate || new Date();
    const endDate = new Date(startDate);
    endDate.setHours(endDate.getHours() + 1);

    const event = calendarService.createEvent({
      title: newEvent.title,
      description: newEvent.description,
      startDate,
      endDate,
      allDay: false,
      type: 'custom',
      category: newEvent.category,
      priority: newEvent.priority,
      status: 'pending',
      color: getCategoryColor(newEvent.category),
      createdBy: 'user'
    });

    setEvents(prev => [...prev, event]);
    setNewEvent({
      title: '',
      description: '',
      category: 'other',
      priority: 'medium'
    });
    setShowCreateEvent(false);
    Alert.alert('成功', '事件创建成功');
  };

  const handleEventStatusChange = (eventId: string, status: CalendarEvent['status']) => {
    const updatedEvent = calendarService.updateEvent(eventId, { status });
    if (updatedEvent) {
      setEvents(prev => prev.map(e => e.id === eventId ? updatedEvent : e));
    }
  };

  const getCategoryColor = (category: CalendarEvent['category']) => {
    const colors = {
      medical: '#FF6B6B',
      personal: '#4ECDC4',
      family: '#45B7D1',
      health: '#96CEB4',
      preparation: '#FFEAA7',
      other: '#DDA0DD'
    };
    return colors[category] || colors.other;
  };

  const getCategoryIcon = (category: CalendarEvent['category']) => {
    const icons = {
      medical: '🏥',
      personal: '👤',
      family: '👨‍👩‍👧‍👦',
      health: '💪',
      preparation: '📦',
      other: '📅'
    };
    return icons[category] || icons.other;
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('zh-CN', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    });
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('zh-CN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const navigateDate = (direction: 'prev' | 'next') => {
    const newDate = new Date(currentDate);
    
    switch (currentView) {
      case 'month':
        newDate.setMonth(newDate.getMonth() + (direction === 'next' ? 1 : -1));
        break;
      case 'week':
        newDate.setDate(newDate.getDate() + (direction === 'next' ? 7 : -7));
        break;
      case 'day':
        newDate.setDate(newDate.getDate() + (direction === 'next' ? 1 : -1));
        break;
    }
    
    setCurrentDate(newDate);
  };

  const renderMonthView = () => {
    const monthData = calendarService.getMonthViewData(
      currentDate.getFullYear(),
      currentDate.getMonth()
    );

    return (
      <View style={styles.monthView}>
        {/* 星期标题 */}
        <View style={styles.weekHeader}>
          {monthData.weekHeaders.map(day => (
            <Text key={day} style={styles.weekHeaderText}>{day}</Text>
          ))}
        </View>

        {/* 日期网格 */}
        <View style={styles.monthGrid}>
          {monthData.days.map((day, index) => (
            <TouchableOpacity
              key={index}
              style={[
                styles.dayCell,
                !day.isCurrentMonth && styles.dayCellInactive,
                day.date.toDateString() === new Date().toDateString() && styles.dayCellToday
              ]}
              onPress={() => {
                setSelectedDate(day.date);
                if (day.events.length > 0) {
                  setShowEventDetail(day.events[0]);
                }
              }}
            >
              <Text style={[
                styles.dayCellText,
                !day.isCurrentMonth && styles.dayCellTextInactive,
                day.date.toDateString() === new Date().toDateString() && styles.dayCellTextToday
              ]}>
                {day.date.getDate()}
              </Text>
              
              {day.hasEvents && (
                <View style={styles.eventIndicators}>
                  {day.events.slice(0, 3).map((event, eventIndex) => (
                    <View
                      key={eventIndex}
                      style={[
                        styles.eventDot,
                        { backgroundColor: event.color }
                      ]}
                    />
                  ))}
                  {day.events.length > 3 && (
                    <Text style={styles.moreEventsText}>+{day.events.length - 3}</Text>
                  )}
                </View>
              )}
            </TouchableOpacity>
          ))}
        </View>
      </View>
    );
  };

  const renderAgendaView = () => {
    const upcomingEvents = calendarService.getUpcomingEvents(30);
    const groupedEvents: { [date: string]: CalendarEvent[] } = {};

    upcomingEvents.forEach(event => {
      const dateKey = event.startDate.toDateString();
      if (!groupedEvents[dateKey]) {
        groupedEvents[dateKey] = [];
      }
      groupedEvents[dateKey].push(event);
    });

    return (
      <ScrollView style={styles.agendaView}>
        {Object.entries(groupedEvents).map(([dateKey, dayEvents]) => (
          <View key={dateKey} style={styles.agendaDateSection}>
            <Text style={styles.agendaDateTitle}>
              {formatDate(new Date(dateKey))}
            </Text>
            {dayEvents.map(event => (
              <TouchableOpacity
                key={event.id}
                style={styles.agendaEventItem}
                onPress={() => setShowEventDetail(event)}
              >
                <View style={[styles.agendaEventColor, { backgroundColor: event.color }]} />
                <View style={styles.agendaEventContent}>
                  <Text style={styles.agendaEventTitle}>{event.title}</Text>
                  <Text style={styles.agendaEventTime}>
                    {event.allDay ? '全天' : formatTime(event.startDate)}
                  </Text>
                  <Text style={styles.agendaEventCategory}>
                    {getCategoryIcon(event.category)} {event.category}
                  </Text>
                </View>
                <View style={[styles.agendaEventStatus, {
                  backgroundColor: event.status === 'completed' ? Theme.Colors.success :
                                 event.status === 'in_progress' ? Theme.Colors.warning :
                                 Theme.Colors.neutral300
                }]} />
              </TouchableOpacity>
            ))}
          </View>
        ))}
      </ScrollView>
    );
  };

  return (
    <View style={[styles.container, style]}>
      <Card style={styles.headerCard}>
        {/* 顶部导航 */}
        <View style={styles.header}>
          <View style={styles.navigationRow}>
            <TouchableOpacity
              style={styles.navButton}
              onPress={() => navigateDate('prev')}
            >
              <Text style={styles.navButtonText}>‹</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.dateTitle}>
              <Text style={styles.dateTitleText}>
                {currentView === 'month' && currentDate.toLocaleDateString('zh-CN', { year: 'numeric', month: 'long' })}
                {currentView === 'week' && `${formatDate(currentDate)} 周`}
                {currentView === 'day' && formatDate(currentDate)}
                {currentView === 'agenda' && '日程'}
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={styles.navButton}
              onPress={() => navigateDate('next')}
            >
              <Text style={styles.navButtonText}>›</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.actionRow}>
            <TouchableOpacity
              style={styles.todayButton}
              onPress={() => setCurrentDate(new Date())}
            >
              <Text style={styles.todayButtonText}>今天</Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={styles.addButton}
              onPress={() => setShowCreateEvent(true)}
            >
              <Text style={styles.addButtonText}>+ 新建</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* 视图切换 */}
        <View style={styles.viewSwitcher}>
          {[
            { key: 'month', label: '月' },
            { key: 'agenda', label: '日程' }
          ].map(view => (
            <TouchableOpacity
              key={view.key}
              style={[
                styles.viewButton,
                currentView === view.key && styles.viewButtonActive
              ]}
              onPress={() => setCurrentView(view.key as CalendarView['type'])}
            >
              <Text style={[
                styles.viewButtonText,
                currentView === view.key && styles.viewButtonTextActive
              ]}>
                {view.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </Card>

      {/* 日历内容 */}
      <View style={styles.calendarContent}>
        {currentView === 'month' && renderMonthView()}
        {currentView === 'agenda' && renderAgendaView()}
      </View>

      {/* 创建事件模态框 */}
      <Modal
        visible={showCreateEvent}
        animationType="slide"
        presentationStyle="pageSheet"
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <TouchableOpacity onPress={() => setShowCreateEvent(false)}>
              <Text style={styles.modalCancel}>取消</Text>
            </TouchableOpacity>
            <Text style={styles.modalTitle}>新建事件</Text>
            <TouchableOpacity onPress={handleCreateEvent}>
              <Text style={styles.modalSave}>保存</Text>
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.modalContent}>
            <View style={styles.formGroup}>
              <Text style={styles.formLabel}>标题 *</Text>
              <TextInput
                style={styles.formInput}
                placeholder="输入事件标题"
                value={newEvent.title}
                onChangeText={(text) => setNewEvent(prev => ({ ...prev, title: text }))}
              />
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.formLabel}>描述</Text>
              <TextInput
                style={[styles.formInput, styles.formTextArea]}
                placeholder="输入事件描述"
                multiline
                numberOfLines={3}
                value={newEvent.description}
                onChangeText={(text) => setNewEvent(prev => ({ ...prev, description: text }))}
              />
            </View>
          </ScrollView>
        </View>
      </Modal>

      {/* 事件详情模态框 */}
      {showEventDetail && (
        <Modal
          visible={!!showEventDetail}
          animationType="slide"
          presentationStyle="pageSheet"
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <TouchableOpacity onPress={() => setShowEventDetail(null)}>
                <Text style={styles.modalCancel}>关闭</Text>
              </TouchableOpacity>
              <Text style={styles.modalTitle}>事件详情</Text>
              <View style={styles.placeholder} />
            </View>

            <ScrollView style={styles.modalContent}>
              <View style={styles.eventDetailContainer}>
                <Text style={styles.eventDetailTitle}>{showEventDetail.title}</Text>
                
                <View style={styles.eventDetailMeta}>
                  <Text style={styles.eventDetailTime}>
                    📅 {formatDate(showEventDetail.startDate)}
                  </Text>
                  {!showEventDetail.allDay && (
                    <Text style={styles.eventDetailTime}>
                      🕐 {formatTime(showEventDetail.startDate)}
                      {showEventDetail.endDate && ` - ${formatTime(showEventDetail.endDate)}`}
                    </Text>
                  )}
                  <Text style={styles.eventDetailCategory}>
                    {getCategoryIcon(showEventDetail.category)} {showEventDetail.category}
                  </Text>
                </View>

                {showEventDetail.description && (
                  <Text style={styles.eventDetailDescription}>
                    {showEventDetail.description}
                  </Text>
                )}

                {/* 状态操作按钮 */}
                {showEventDetail.status !== 'completed' && (
                  <View style={styles.eventActions}>
                    <Button
                      onPress={() => {
                        handleEventStatusChange(showEventDetail.id, 'completed');
                        setShowEventDetail(null);
                      }}
                      style={styles.completeButton}
                    >
                      标记为完成
                    </Button>
                  </View>
                )}
              </View>
            </ScrollView>
          </View>
        </Modal>
      )}
    </View>
  );
};

const styles = {
  container: {
    flex: 1,
  },
  headerCard: {
    marginBottom: 12,
  },
  header: {
    marginBottom: 16,
  },
  navigationRow: {
    flexDirection: 'row' as const,
    justifyContent: 'space-between' as const,
    alignItems: 'center' as const,
    marginBottom: 12,
  },
  navButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: Theme.Colors.neutral200,
    justifyContent: 'center' as const,
    alignItems: 'center' as const,
  },
  navButtonText: {
    fontSize: 18,
    color: Theme.Colors.neutral700,
  },
  dateTitle: {
    flex: 1,
    alignItems: 'center' as const,
  },
  dateTitleText: {
    fontSize: 18,
    fontWeight: 'bold' as const,
    color: Theme.Colors.neutral900,
  },
  actionRow: {
    flexDirection: 'row' as const,
    justifyContent: 'space-between' as const,
    alignItems: 'center' as const,
  },
  todayButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: Theme.Colors.neutral200,
  },
  todayButtonText: {
    fontSize: 14,
    color: Theme.Colors.neutral700,
  },
  addButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: Theme.Colors.primary,
  },
  addButtonText: {
    fontSize: 14,
    color: 'white',
    fontWeight: '500' as const,
  },
  viewSwitcher: {
    flexDirection: 'row' as const,
    backgroundColor: Theme.Colors.neutral100,
    borderRadius: 8,
    padding: 4,
  },
  viewButton: {
    flex: 1,
    paddingVertical: 8,
    alignItems: 'center' as const,
    borderRadius: 6,
  },
  viewButtonActive: {
    backgroundColor: 'white',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  viewButtonText: {
    fontSize: 14,
    color: Theme.Colors.neutral500,
  },
  viewButtonTextActive: {
    color: Theme.Colors.primary,
    fontWeight: '500' as const,
  },
  calendarContent: {
    flex: 1,
  },
  monthView: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
  },
  weekHeader: {
    flexDirection: 'row' as const,
    marginBottom: 8,
  },
  weekHeaderText: {
    flex: 1,
    textAlign: 'center' as const,
    fontSize: 12,
    color: Theme.Colors.neutral500,
    fontWeight: '500' as const,
  },
  monthGrid: {
    flexDirection: 'row' as const,
    flexWrap: 'wrap' as const,
  },
  dayCell: {
    width: (width - 64) / 7,
    height: 60,
    justifyContent: 'center' as const,
    alignItems: 'center' as const,
    borderWidth: 1,
    borderColor: Theme.Colors.neutral200,
  },
  dayCellInactive: {
    backgroundColor: Theme.Colors.neutral100,
  },
  dayCellToday: {
    backgroundColor: Theme.Colors.primaryLight,
  },
  dayCellText: {
    fontSize: 16,
    color: Theme.Colors.neutral900,
  },
  dayCellTextInactive: {
    color: Theme.Colors.neutral400,
  },
  dayCellTextToday: {
    color: Theme.Colors.primary,
    fontWeight: 'bold' as const,
  },
  eventIndicators: {
    flexDirection: 'row' as const,
    marginTop: 2,
    gap: 2,
  },
  eventDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
  },
  moreEventsText: {
    fontSize: 8,
    color: Theme.Colors.neutral500,
  },
  agendaView: {
    backgroundColor: 'white',
    borderRadius: 12,
    flex: 1,
    padding: 16,
  },
  agendaDateSection: {
    marginBottom: 16,
  },
  agendaDateTitle: {
    fontSize: 16,
    fontWeight: 'bold' as const,
    color: Theme.Colors.neutral900,
    marginBottom: 8,
  },
  agendaEventItem: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    padding: 12,
    backgroundColor: Theme.Colors.neutral100,
    borderRadius: 8,
    marginBottom: 8,
  },
  agendaEventColor: {
    width: 4,
    height: 40,
    borderRadius: 2,
    marginRight: 12,
  },
  agendaEventContent: {
    flex: 1,
  },
  agendaEventTitle: {
    fontSize: 14,
    fontWeight: '500' as const,
    color: Theme.Colors.neutral900,
    marginBottom: 2,
  },
  agendaEventTime: {
    fontSize: 12,
    color: Theme.Colors.neutral600,
    marginBottom: 2,
  },
  agendaEventCategory: {
    fontSize: 12,
    color: Theme.Colors.neutral500,
  },
  agendaEventStatus: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginLeft: 8,
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
  placeholder: {
    width: 32,
  },
  eventDetailContainer: {
    padding: 16,
  },
  eventDetailTitle: {
    fontSize: 20,
    fontWeight: 'bold' as const,
    color: Theme.Colors.neutral900,
    marginBottom: 16,
  },
  eventDetailMeta: {
    marginBottom: 16,
    gap: 8,
  },
  eventDetailTime: {
    fontSize: 14,
    color: Theme.Colors.neutral600,
  },
  eventDetailCategory: {
    fontSize: 14,
    color: Theme.Colors.neutral600,
  },
  eventDetailDescription: {
    fontSize: 14,
    color: Theme.Colors.neutral700,
    lineHeight: 20,
    marginBottom: 16,
  },
  eventActions: {
    marginTop: 16,
  },
  completeButton: {
    backgroundColor: Theme.Colors.success,
  },
};