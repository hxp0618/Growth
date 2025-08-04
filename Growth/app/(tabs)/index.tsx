import React from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Card, ProgressBar, Button } from '@/components/ui';
import { Colors, Typography, Spacing } from '@/constants/Theme';
import { CommonStyles } from '@/constants/Styles';
import WeatherCard from '@/components/WeatherCard';
import PregnancyCalendar from '@/components/PregnancyCalendar';
import NutritionGuide from '@/components/NutritionGuide';
import CheckupReminder from '@/components/CheckupReminder';
import { MoodDiary } from '@/components/MoodDiary';
import FetalMovementCounter from '@/components/FetalMovementCounter';
import { FamilyCollaboration } from '@/components/FamilyCollaboration';
import { Calendar } from '@/components/Calendar';
import { DeliveryBagChecklist } from '@/components/DeliveryBagChecklist';
import { EmergencyContact } from '@/components/EmergencyContact';

export default function HomeScreen() {
  return (
    <SafeAreaView style={CommonStyles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* 顶部问候 */}
        <View style={styles.header}>
          <View style={styles.greeting}>
            <Text style={CommonStyles.textH3}>👋 早安，小雨</Text>
            <View style={styles.headerActions}>
              <TouchableOpacity style={styles.headerButton}>
                <Text style={styles.headerButtonText}>🔔</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.headerButton}>
                <Text style={styles.headerButtonText}>⚙️</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* 孕期日历 */}
        <PregnancyCalendar />

        {/* 天气信息 */}
        <WeatherCard />

        {/* 饮食营养指导 */}
        <NutritionGuide pregnancyWeek={24} />

        {/* 产检提醒 */}
        <CheckupReminder currentWeek={24} />

        {/* 情绪关怀 */}
        <MoodDiary />

        {/* 胎动记录 */}
        <Card style={styles.card}>
          <Text style={CommonStyles.textH4}>👶 胎动记录</Text>
          <FetalMovementCounter pregnancyWeek={24} />
        </Card>

        {/* 家庭协作 */}
        <FamilyCollaboration currentUserId="member_1" pregnancyWeek={24} />

        {/* 综合日历 */}
        <Card style={styles.card}>
          <Text style={CommonStyles.textH4}>📅 综合日历</Text>
          <Calendar />
        </Card>

        {/* 待产包清单 */}
        <DeliveryBagChecklist pregnancyWeek={24} />

        {/* 紧急联系 */}
        <EmergencyContact />

        {/* 今日任务 */}
        <Card style={styles.card}>
          <Text style={CommonStyles.textH4}>📋 今日任务</Text>
          
          <View style={styles.taskItem}>
            <View style={styles.taskIcon}>
              <Text>👶</Text>
            </View>
            <View style={styles.taskContent}>
              <Text style={CommonStyles.textBody}>记录胎动</Text>
              <Text style={CommonStyles.textBodySmall}>0/3 次</Text>
            </View>
            <View style={styles.taskStatus}>
              <View style={[styles.statusDot, { backgroundColor: Colors.warning }]} />
            </View>
          </View>

          <View style={styles.taskItem}>
            <View style={styles.taskIcon}>
              <Text>💊</Text>
            </View>
            <View style={styles.taskContent}>
              <Text style={CommonStyles.textBody}>服用叶酸</Text>
              <Text style={[CommonStyles.textBodySmall, { color: Colors.success }]}>已完成 ✓</Text>
            </View>
            <View style={styles.taskStatus}>
              <View style={[styles.statusDot, { backgroundColor: Colors.success }]} />
            </View>
          </View>

          <View style={styles.taskItem}>
            <View style={styles.taskIcon}>
              <Text>🏥</Text>
            </View>
            <View style={styles.taskContent}>
              <Text style={CommonStyles.textBody}>产检预约提醒</Text>
              <Text style={CommonStyles.textBodySmall}>明天 9:00</Text>
            </View>
            <View style={styles.taskStatus}>
              <View style={[styles.statusDot, { backgroundColor: Colors.info }]} />
            </View>
          </View>
        </Card>

        {/* 一键通知 */}
        <Card style={styles.card}>
          <Text style={CommonStyles.textH4}>🚨 一键通知</Text>
          <View style={styles.notificationButtons}>
            <TouchableOpacity style={[styles.notificationButton, { backgroundColor: Colors.infoLight }]}>
              <Text style={styles.notificationButtonText}>产检提醒</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.notificationButton, { backgroundColor: Colors.warningLight }]}>
              <Text style={styles.notificationButtonText}>身体不适</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.notificationButton, { backgroundColor: Colors.successLight }]}>
              <Text style={styles.notificationButtonText}>分享喜悦</Text>
            </TouchableOpacity>
          </View>
        </Card>

        {/* 家庭动态 */}
        <Card style={styles.card}>
          <Text style={CommonStyles.textH4}>👨‍👩‍👧‍👦 家庭动态</Text>
          
          <View style={styles.activityItem}>
            <View style={[styles.activityAvatar, { backgroundColor: Colors.partner }]}>
              <Text style={styles.avatarText}>👨</Text>
            </View>
            <View style={styles.activityContent}>
              <Text style={CommonStyles.textBodySmall}>老公：已完成"购买孕妇奶粉"</Text>
              <Text style={[CommonStyles.textCaption, { color: Colors.neutral500 }]}>10分钟前</Text>
            </View>
          </View>

          <View style={styles.activityItem}>
            <View style={[styles.activityAvatar, { backgroundColor: Colors.grandparent }]}>
              <Text style={styles.avatarText}>👵</Text>
            </View>
            <View style={styles.activityContent}>
              <Text style={CommonStyles.textBodySmall}>婆婆：分享了一篇育儿文章</Text>
              <Text style={[CommonStyles.textCaption, { color: Colors.neutral500 }]}>1小时前</Text>
            </View>
          </View>

          <TouchableOpacity style={styles.viewMoreButton}>
            <Text style={[CommonStyles.textBodySmall, { color: Colors.primary }]}>查看更多</Text>
          </TouchableOpacity>
        </Card>

        {/* 快捷操作 */}
        <View style={styles.quickActions}>
          <TouchableOpacity style={styles.quickActionButton}>
            <Text style={styles.quickActionIcon}>👶</Text>
            <Text style={CommonStyles.textBodySmall}>胎动记录</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.quickActionButton}>
            <Text style={styles.quickActionIcon}>📊</Text>
            <Text style={CommonStyles.textBodySmall}>健康数据</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.quickActionButton}>
            <Text style={styles.quickActionIcon}>📚</Text>
            <Text style={CommonStyles.textBodySmall}>孕期知识</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.quickActionButton}>
            <Text style={styles.quickActionIcon}>👨‍👩‍👧‍👦</Text>
            <Text style={CommonStyles.textBodySmall}>家庭协作</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
    paddingHorizontal: Spacing.pagePadding,
  },
  header: {
    paddingVertical: Spacing.lg,
  },
  greeting: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerActions: {
    flexDirection: 'row',
    gap: Spacing.sm,
  },
  headerButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: Colors.neutral200,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerButtonText: {
    fontSize: 16,
  },
  progressCard: {
    marginBottom: Spacing.md,
  },
  progressHeader: {
    marginBottom: Spacing.sm,
  },
  progressBar: {
    marginBottom: Spacing.sm,
  },
  card: {
    marginBottom: Spacing.md,
  },
  taskItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: Spacing.md,
  },
  taskIcon: {
    width: 32,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Spacing.sm,
  },
  taskContent: {
    flex: 1,
    gap: 2,
  },
  taskStatus: {
    marginLeft: Spacing.sm,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  notificationButtons: {
    flexDirection: 'row',
    marginTop: Spacing.md,
    gap: Spacing.sm,
  },
  notificationButton: {
    flex: 1,
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.xs,
    borderRadius: 8,
    alignItems: 'center',
  },
  notificationButtonText: {
    fontSize: Typography.fontSize.bodySmall,
    fontWeight: Typography.fontWeight.medium,
    color: Colors.neutral700,
  },
  activityItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginTop: Spacing.md,
  },
  activityAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Spacing.sm,
  },
  avatarText: {
    fontSize: 16,
  },
  activityContent: {
    flex: 1,
    gap: 2,
  },
  viewMoreButton: {
    marginTop: Spacing.md,
    paddingVertical: Spacing.xs,
    paddingHorizontal: Spacing.sm,
    backgroundColor: Colors.neutral200,
    borderRadius: 4,
    alignSelf: 'flex-start',
  },
  quickActions: {
    flexDirection: 'row',
    marginBottom: Spacing.xl,
    gap: Spacing.sm,
  },
  quickActionButton: {
    flex: 1,
    aspectRatio: 1,
    backgroundColor: Colors.neutral100,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 4,
    borderWidth: 1,
    borderColor: Colors.neutral200,
  },
  quickActionIcon: {
    fontSize: 24,
  },
});
