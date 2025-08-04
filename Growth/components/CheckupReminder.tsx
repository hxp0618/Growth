import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Modal,
  Alert,
  ViewStyle,
} from 'react-native';
import { Card } from '@/components/ui';
import { Colors, Typography, Spacing } from '@/constants/Theme';
import { CommonStyles } from '@/constants/Styles';
import { checkupService, CheckupSchedule, CheckupReminder as CheckupReminderType, CheckupRecord } from '@/services/checkupService';

interface CheckupReminderProps {
  currentWeek?: number;
  style?: ViewStyle;
}

export default function CheckupReminder({ currentWeek = 24, style }: CheckupReminderProps) {
  const [upcomingCheckups, setUpcomingCheckups] = useState<CheckupSchedule[]>([]);
  const [reminders, setReminders] = useState<CheckupReminderType[]>([]);
  const [checkupHistory, setCheckupHistory] = useState<CheckupRecord[]>([]);
  const [selectedCheckup, setSelectedCheckup] = useState<CheckupSchedule | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showHistory, setShowHistory] = useState(false);

  useEffect(() => {
    loadCheckupData();
  }, [currentWeek]);

  const loadCheckupData = () => {
    try {
      const schedule = checkupService.getStandardCheckupSchedule();
      const upcoming = schedule.filter(checkup => 
        checkup.week >= currentWeek && checkup.week <= currentWeek + 8
      );
      
      const reminderList = checkupService.getUpcomingCheckupReminders(currentWeek);
      const history = checkupService.getCheckupHistory();
      
      setUpcomingCheckups(upcoming);
      setReminders(reminderList);
      setCheckupHistory(history);
    } catch (error) {
      console.error('加载产检数据失败:', error);
    }
  };

  const handleCheckupPress = (checkup: CheckupSchedule) => {
    setSelectedCheckup(checkup);
    setShowDetailModal(true);
  };

  const handleScheduleAppointment = (checkup: CheckupSchedule) => {
    Alert.alert(
      '预约产检',
      `确定要预约${checkup.title}吗？`,
      [
        { text: '取消', style: 'cancel' },
        { 
          text: '确定', 
          onPress: () => {
            Alert.alert('预约成功', '已为您预约产检，请注意查收短信通知');
            setShowDetailModal(false);
          }
        }
      ]
    );
  };

  const getCheckupStatusColor = (week: number) => {
    if (week < currentWeek) return Colors.neutral400;
    if (week === currentWeek) return Colors.warning;
    if (week <= currentWeek + 2) return Colors.info;
    return Colors.neutral600;
  };

  const getCheckupStatusText = (week: number) => {
    if (week < currentWeek) return '已过期';
    if (week === currentWeek) return '本周';
    if (week <= currentWeek + 2) return '即将到来';
    return '计划中';
  };

  const renderCheckupItem = (checkup: CheckupSchedule) => (
    <TouchableOpacity
      key={checkup.id}
      style={styles.checkupItem}
      onPress={() => handleCheckupPress(checkup)}
    >
      <View style={styles.checkupHeader}>
        <View style={styles.checkupInfo}>
          <Text style={[CommonStyles.textBody, styles.checkupTitle]}>
            {checkup.title}
          </Text>
          <Text style={[CommonStyles.textCaption, styles.checkupWeek]}>
            第{checkup.week}周
          </Text>
        </View>
        <View style={styles.checkupStatus}>
          <View style={[
            styles.statusBadge,
            { backgroundColor: getCheckupStatusColor(checkup.week) }
          ]}>
            <Text style={[CommonStyles.textCaption, styles.statusText]}>
              {getCheckupStatusText(checkup.week)}
            </Text>
          </View>
          {checkup.importance === 'high' && (
            <Text style={styles.importanceIcon}>⭐</Text>
          )}
        </View>
      </View>
      
      <Text style={[CommonStyles.textBodySmall, styles.checkupDescription]}>
        {checkup.description}
      </Text>
      
      <View style={styles.checkupMeta}>
        <Text style={[CommonStyles.textCaption, styles.metaText]}>
          ⏱️ 约{checkup.estimatedDuration}分钟
        </Text>
        {checkup.cost && (
          <Text style={[CommonStyles.textCaption, styles.metaText]}>
            💰 {checkup.cost}
          </Text>
        )}
      </View>
    </TouchableOpacity>
  );

  const renderDetailModal = () => (
    <Modal
      visible={showDetailModal}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={() => setShowDetailModal(false)}
    >
      <View style={styles.modalContainer}>
        <View style={styles.modalHeader}>
          <Text style={[CommonStyles.textH3, styles.modalTitle]}>
            {selectedCheckup?.title}
          </Text>
          <TouchableOpacity
            style={styles.closeButton}
            onPress={() => setShowDetailModal(false)}
          >
            <Text style={styles.closeButtonText}>✕</Text>
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.modalContent}>
          {selectedCheckup && (
            <>
              <View style={styles.detailSection}>
                <Text style={[CommonStyles.textH4, styles.sectionTitle]}>
                  📋 检查项目
                </Text>
                {selectedCheckup.items.map((item, index) => (
                  <Text key={index} style={[CommonStyles.textBody, styles.listItem]}>
                    • {item}
                  </Text>
                ))}
              </View>

              <View style={styles.detailSection}>
                <Text style={[CommonStyles.textH4, styles.sectionTitle]}>
                  📝 检查准备
                </Text>
                {selectedCheckup.preparation.map((prep, index) => (
                  <Text key={index} style={[CommonStyles.textBody, styles.listItem]}>
                    • {prep}
                  </Text>
                ))}
              </View>

              <View style={styles.detailSection}>
                <Text style={[CommonStyles.textH4, styles.sectionTitle]}>
                  ℹ️ 检查说明
                </Text>
                <Text style={[CommonStyles.textBody, styles.description]}>
                  {selectedCheckup.description}
                </Text>
                <Text style={[CommonStyles.textBodySmall, styles.explanation]}>
                  {checkupService.getCheckupItemExplanation(selectedCheckup.title)}
                </Text>
              </View>

              <View style={styles.detailSection}>
                <Text style={[CommonStyles.textH4, styles.sectionTitle]}>
                  💰 费用预估
                </Text>
                <Text style={[CommonStyles.textBody, styles.costInfo]}>
                  {selectedCheckup.cost || '费用因医院而异，请咨询具体医院'}
                </Text>
              </View>
            </>
          )}
        </ScrollView>

        <View style={styles.modalActions}>
          <TouchableOpacity
            style={[styles.actionButton, styles.scheduleButton]}
            onPress={() => selectedCheckup && handleScheduleAppointment(selectedCheckup)}
          >
            <Text style={styles.scheduleButtonText}>预约检查</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );

  return (
    <Card style={style ? { ...styles.card, ...style } : styles.card}>
      <View style={styles.header}>
        <Text style={CommonStyles.textH4}>🏥 产检提醒</Text>
        <TouchableOpacity
          style={styles.historyButton}
          onPress={() => setShowHistory(!showHistory)}
        >
          <Text style={styles.historyButtonText}>
            {showHistory ? '隐藏历史' : '查看历史'}
          </Text>
        </TouchableOpacity>
      </View>

      {/* 即将到来的提醒 */}
      {reminders.length > 0 && (
        <View style={styles.remindersSection}>
          <Text style={[CommonStyles.textBodySmall, styles.sectionTitle]}>
            🔔 近期提醒
          </Text>
          {reminders.slice(0, 2).map((reminder) => (
            <View key={reminder.id} style={styles.reminderItem}>
              <Text style={[CommonStyles.textBodySmall, styles.reminderTitle]}>
                {reminder.title}
              </Text>
              <Text style={[CommonStyles.textCaption, styles.reminderMessage]}>
                {reminder.message}
              </Text>
            </View>
          ))}
        </View>
      )}

      {/* 即将到来的产检 */}
      <View style={styles.upcomingSection}>
        <Text style={[CommonStyles.textBodySmall, styles.sectionTitle]}>
          📅 即将到来的产检
        </Text>
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          style={styles.checkupScroll}
        >
          {upcomingCheckups.map(renderCheckupItem)}
        </ScrollView>
      </View>

      {/* 产检历史 */}
      {showHistory && (
        <View style={styles.historySection}>
          <Text style={[CommonStyles.textBodySmall, styles.sectionTitle]}>
            📋 产检历史
          </Text>
          {checkupHistory.length > 0 ? (
            checkupHistory.map((record) => (
              <View key={record.id} style={styles.historyItem}>
                <View style={styles.historyHeader}>
                  <Text style={[CommonStyles.textBodySmall, styles.historyTitle]}>
                    {record.date.toLocaleDateString()} - {record.hospital}
                  </Text>
                  <Text style={[CommonStyles.textCaption, styles.historyDoctor]}>
                    {record.doctor}
                  </Text>
                </View>
                <Text style={[CommonStyles.textCaption, styles.historyNotes]}>
                  {record.notes}
                </Text>
              </View>
            ))
          ) : (
            <Text style={[CommonStyles.textBodySmall, styles.emptyText]}>
              暂无产检记录
            </Text>
          )}
        </View>
      )}

      {renderDetailModal()}
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    marginBottom: Spacing.md,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  historyButton: {
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
    backgroundColor: Colors.neutral200,
    borderRadius: 6,
  },
  historyButtonText: {
    fontSize: Typography.fontSize.bodySmall,
    color: Colors.primary,
    fontWeight: Typography.fontWeight.medium,
  },
  remindersSection: {
    marginBottom: Spacing.md,
    padding: Spacing.sm,
    backgroundColor: Colors.warningLight,
    borderRadius: 8,
    borderLeftWidth: 3,
    borderLeftColor: Colors.warning,
  },
  reminderItem: {
    marginTop: Spacing.xs,
  },
  reminderTitle: {
    fontWeight: Typography.fontWeight.medium,
    color: Colors.neutral800,
  },
  reminderMessage: {
    color: Colors.neutral600,
    marginTop: 2,
  },
  upcomingSection: {
    marginBottom: Spacing.md,
  },
  sectionTitle: {
    fontWeight: Typography.fontWeight.medium,
    color: Colors.neutral700,
    marginBottom: Spacing.sm,
  },
  checkupScroll: {
    marginHorizontal: -Spacing.xs,
  },
  checkupItem: {
    width: 280,
    backgroundColor: Colors.neutral100,
    borderRadius: 12,
    padding: Spacing.md,
    marginHorizontal: Spacing.xs,
    borderWidth: 1,
    borderColor: Colors.neutral200,
  },
  checkupHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: Spacing.sm,
  },
  checkupInfo: {
    flex: 1,
  },
  checkupTitle: {
    fontWeight: Typography.fontWeight.medium,
    marginBottom: 2,
  },
  checkupWeek: {
    color: Colors.neutral600,
  },
  checkupStatus: {
    alignItems: 'flex-end',
  },
  statusBadge: {
    paddingHorizontal: Spacing.xs,
    paddingVertical: 2,
    borderRadius: 4,
    marginBottom: 2,
  },
  statusText: {
    color: Colors.neutral100,
    fontSize: Typography.fontSize.caption,
  },
  importanceIcon: {
    fontSize: 12,
  },
  checkupDescription: {
    color: Colors.neutral600,
    marginBottom: Spacing.sm,
    lineHeight: 18,
  },
  checkupMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  metaText: {
    color: Colors.neutral500,
  },
  historySection: {
    borderTopWidth: 1,
    borderTopColor: Colors.neutral200,
    paddingTop: Spacing.md,
  },
  historyItem: {
    backgroundColor: Colors.neutral100,
    padding: Spacing.sm,
    borderRadius: 8,
    marginBottom: Spacing.sm,
  },
  historyHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.xs,
  },
  historyTitle: {
    fontWeight: Typography.fontWeight.medium,
  },
  historyDoctor: {
    color: Colors.neutral600,
  },
  historyNotes: {
    color: Colors.neutral600,
    lineHeight: 16,
  },
  emptyText: {
    textAlign: 'center',
    color: Colors.neutral500,
    fontStyle: 'italic',
  },
  // Modal styles
  modalContainer: {
    flex: 1,
    backgroundColor: Colors.neutral100,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: Spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: Colors.neutral200,
  },
  modalTitle: {
    flex: 1,
  },
  closeButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: Colors.neutral200,
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeButtonText: {
    fontSize: 16,
    color: Colors.neutral600,
  },
  modalContent: {
    flex: 1,
    padding: Spacing.lg,
  },
  detailSection: {
    marginBottom: Spacing.lg,
  },
  listItem: {
    marginBottom: Spacing.xs,
    lineHeight: 20,
  },
  description: {
    marginBottom: Spacing.sm,
    lineHeight: 20,
  },
  explanation: {
    color: Colors.neutral600,
    lineHeight: 18,
    fontStyle: 'italic',
  },
  costInfo: {
    color: Colors.success,
    fontWeight: Typography.fontWeight.medium,
  },
  modalActions: {
    padding: Spacing.lg,
    borderTopWidth: 1,
    borderTopColor: Colors.neutral200,
  },
  actionButton: {
    paddingVertical: Spacing.md,
    borderRadius: 8,
    alignItems: 'center',
  },
  scheduleButton: {
    backgroundColor: Colors.primary,
  },
  scheduleButtonText: {
    color: Colors.neutral100,
    fontSize: Typography.fontSize.body,
    fontWeight: Typography.fontWeight.medium,
  },
});