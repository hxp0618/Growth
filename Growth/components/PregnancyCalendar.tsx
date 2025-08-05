import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  ViewStyle,
} from 'react-native';
import { Card } from '@/components/ui';
import { Colors, Typography, Spacing, BorderRadius, Shadows } from '@/constants/Theme';
import { CommonStyles } from '@/constants/Styles';
import { pregnancyService, PregnancyInfo, FetalDevelopment, WeeklyMilestone } from '@/services/pregnancyService';

interface PregnancyCalendarProps {
  dueDate?: Date;
  style?: ViewStyle;
  variant?: 'default' | 'compact';
  size?: 'compact' | 'default' | 'large';
}

const { width } = Dimensions.get('window');

export default function PregnancyCalendar({
  dueDate,
  style,
  variant = 'default',
  size = 'default'
}: PregnancyCalendarProps) {
  const [pregnancyInfo, setPregnancyInfo] = useState<PregnancyInfo | null>(null);
  const [fetalDevelopment, setFetalDevelopment] = useState<FetalDevelopment | null>(null);
  const [milestones, setMilestones] = useState<WeeklyMilestone[]>([]);
  const [showDetails, setShowDetails] = useState(false);

  // 默认预产期（用于演示）
  const defaultDueDate = new Date('2025-06-15');
  const currentDueDate = dueDate || defaultDueDate;

  useEffect(() => {
    loadPregnancyData();
  }, []);

  const loadPregnancyData = () => {
    try {
      const info = pregnancyService.calculatePregnancyInfo(currentDueDate);
      const development = pregnancyService.getFetalDevelopment(info.currentWeek);
      const weeklyMilestones = pregnancyService.getWeeklyMilestones(info.currentWeek);
      
      setPregnancyInfo(info);
      setFetalDevelopment(development);
      setMilestones(weeklyMilestones);
    } catch (error) {
      console.error('加载孕期数据失败:', error);
    }
  };

  const getProgressPercentage = () => {
    if (!pregnancyInfo) return 0;
    return Math.min(100, (pregnancyInfo.completedDays / pregnancyInfo.totalDays) * 100);
  };

  const getTrimesterInfo = () => {
    if (!pregnancyInfo) return { name: '', color: Colors.neutral400 };
    
    switch (pregnancyInfo.trimester) {
      case 1:
        return { name: '孕早期', color: Colors.info };
      case 2:
        return { name: '孕中期', color: Colors.success };
      case 3:
        return { name: '孕晚期', color: Colors.warning };
      default:
        return { name: '', color: Colors.neutral400 };
    }
  };

  if (!pregnancyInfo || !fetalDevelopment) {
    return (
      <Card
        style={style}
        variant="pregnant"
        shadow="card"
        size={size}
      >
        <View style={styles.loadingContainer}>
          <Text style={CommonStyles.textBody}>加载孕期信息中...</Text>
        </View>
      </Card>
    );
  }

  const trimesterInfo = getTrimesterInfo();
  const progressPercentage = getProgressPercentage();

  return (
    <Card
      style={style}
      variant="pregnant"
      shadow="card"
      size={size}
    >
      {/* 卡片标题 */}
      <View style={styles.cardHeader}>
        <Text style={styles.cardTitle}>🤱 孕期日历</Text>
      </View>

      {/* 孕期进度头部 */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Text style={[CommonStyles.textH3, styles.weekText]}>
            {pregnancyService.formatPregnancyWeek(pregnancyInfo.currentWeek, pregnancyInfo.currentDay)}
          </Text>
          <View style={styles.trimesterBadge}>
            <View style={[styles.trimesterDot, { backgroundColor: trimesterInfo.color }]} />
            <Text style={[CommonStyles.textCaption, { color: trimesterInfo.color }]}>
              {trimesterInfo.name}
            </Text>
          </View>
        </View>
        <View style={styles.headerRight}>
          <Text style={styles.daysRemaining}>
            {pregnancyService.formatDaysRemaining(pregnancyInfo.daysRemaining)}
          </Text>
          <Text style={CommonStyles.textCaption}>距离预产期</Text>
        </View>
      </View>

      {/* 进度条 */}
      <View style={styles.progressSection}>
        <View style={styles.progressBar}>
          <View
            style={[
              styles.progressFill,
              { width: `${progressPercentage}%` }
            ]}
          />
        </View>
        <Text style={[CommonStyles.textCaption, styles.progressText]}>
          孕期进度 {Math.round(progressPercentage)}%
        </Text>
      </View>

      {/* 今日胎儿发育 */}
      <View style={styles.developmentSection}>
        <View style={styles.developmentHeader}>
          <Text style={styles.developmentIcon}>{fetalDevelopment.icon}</Text>
          <View style={styles.developmentInfo}>
            <Text style={CommonStyles.textH4}>
              宝宝像个{fetalDevelopment.sizeComparison}
            </Text>
            <Text style={CommonStyles.textBodySmall}>
              身长约{fetalDevelopment.length}，体重约{fetalDevelopment.weight}
            </Text>
          </View>
        </View>
      </View>

      {/* 详细信息切换 */}
      <TouchableOpacity
        style={styles.detailsToggle}
        onPress={() => setShowDetails(!showDetails)}
      >
        <Text style={styles.detailsToggleText}>
          {showDetails ? '收起详情' : '查看详细发育信息'} {showDetails ? '▲' : '▼'}
        </Text>
      </TouchableOpacity>

      {/* 详细发育信息 */}
      {showDetails && (
        <View style={styles.detailsContainer}>
          {/* 胎儿发育详情 */}
          <View style={styles.detailSection}>
            <Text style={[CommonStyles.textBodySmall, styles.sectionTitle]}>
              👶 胎儿发育
            </Text>
            {fetalDevelopment.developments.map((item, index) => (
              <Text key={index} style={[CommonStyles.textBodySmall, styles.listItem]}>
                • {item}
              </Text>
            ))}
          </View>

          {/* 妈妈变化 */}
          <View style={styles.detailSection}>
            <Text style={[CommonStyles.textBodySmall, styles.sectionTitle]}>
              👩 妈妈变化
            </Text>
            {fetalDevelopment.maternalChanges.map((item, index) => (
              <Text key={index} style={[CommonStyles.textBodySmall, styles.listItem]}>
                • {item}
              </Text>
            ))}
          </View>

          {/* 今日建议 */}
          <View style={styles.detailSection}>
            <Text style={[CommonStyles.textBodySmall, styles.sectionTitle]}>
              💡 今日建议
            </Text>
            {pregnancyService.getTodayRecommendations(pregnancyInfo.currentWeek, pregnancyInfo.currentDay).map((item, index) => (
              <Text key={index} style={[CommonStyles.textBodySmall, styles.listItem]}>
                • {item}
              </Text>
            ))}
          </View>

          {/* 本周里程碑 */}
          {milestones.length > 0 && (
            <View style={styles.detailSection}>
              <Text style={[CommonStyles.textBodySmall, styles.sectionTitle]}>
                🎯 本周重要事项
              </Text>
              {milestones.map((milestone, index) => (
                <View key={index} style={styles.milestoneItem}>
                  <View style={[
                    styles.milestoneIndicator,
                    { backgroundColor: milestone.importance === 'high' ? Colors.error : Colors.info }
                  ]} />
                  <View style={styles.milestoneContent}>
                    <Text style={[CommonStyles.textBodySmall, styles.milestoneTitle]}>
                      {milestone.title}
                    </Text>
                    <Text style={[CommonStyles.textCaption, styles.milestoneDescription]}>
                      {milestone.description}
                    </Text>
                  </View>
                </View>
              ))}
            </View>
          )}
        </View>
      )}

      {/* 快捷操作 */}
      <View style={styles.quickActions}>
        <TouchableOpacity style={styles.quickActionButton}>
          <Text style={styles.quickActionIcon}>📅</Text>
          <Text style={CommonStyles.textCaption}>产检日历</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.quickActionButton}>
          <Text style={styles.quickActionIcon}>👶</Text>
          <Text style={CommonStyles.textCaption}>胎动记录</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.quickActionButton}>
          <Text style={styles.quickActionIcon}>📚</Text>
          <Text style={CommonStyles.textCaption}>孕期知识</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.quickActionButton}>
          <Text style={styles.quickActionIcon}>💭</Text>
          <Text style={CommonStyles.textCaption}>心情日记</Text>
        </TouchableOpacity>
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    alignItems: 'center',
    paddingVertical: Spacing.lg,
  },
  cardHeader: {
    marginBottom: Spacing.md,
    paddingBottom: Spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: Colors.neutral300,
  },
  cardTitle: {
    fontSize: Typography.fontSize.h4,
    fontWeight: Typography.fontWeight.semibold,
    color: Colors.neutral800,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: Spacing.lg,
    padding: Spacing.md,
    backgroundColor: Colors.primaryLight + '20',
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    borderColor: Colors.pregnant + '30',
  },
  headerLeft: {
    flex: 1,
  },
  headerRight: {
    alignItems: 'flex-end',
  },
  weekText: {
    color: Colors.pregnant,
    fontWeight: Typography.fontWeight.bold,
    marginBottom: Spacing.xs,
  },
  trimesterBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: Colors.neutral100,
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.full,
  },
  trimesterDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  daysRemaining: {
    fontSize: Typography.fontSize.h4,
    fontWeight: Typography.fontWeight.bold,
    color: Colors.neutral800,
    textAlign: 'right',
  },
  progressSection: {
    marginBottom: Spacing.lg,
    padding: Spacing.md,
    backgroundColor: Colors.neutral100,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    borderColor: Colors.neutral200,
  },
  progressBar: {
    height: 10,
    backgroundColor: Colors.neutral200,
    borderRadius: BorderRadius.md,
    overflow: 'hidden',
    marginBottom: Spacing.sm,
  },
  progressFill: {
    height: '100%',
    backgroundColor: Colors.pregnant,
    borderRadius: BorderRadius.md,
  },
  progressText: {
    textAlign: 'center',
    color: Colors.neutral600,
    fontWeight: Typography.fontWeight.medium,
  },
  developmentSection: {
    marginBottom: Spacing.lg,
  },
  developmentHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.primaryLight + '30',
    padding: Spacing.lg,
    borderRadius: BorderRadius.xl,
    borderWidth: 1,
    borderColor: Colors.pregnant + '40',
    ...Shadows.sm,
  },
  developmentIcon: {
    fontSize: 48,
    marginRight: Spacing.lg,
  },
  developmentInfo: {
    flex: 1,
  },
  detailsToggle: {
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.lg,
    backgroundColor: Colors.primaryLight + '20',
    borderRadius: BorderRadius.lg,
    alignItems: 'center',
    marginBottom: Spacing.lg,
    borderWidth: 1,
    borderColor: Colors.primary + '30',
    ...Shadows.xs,
  },
  detailsToggleText: {
    fontSize: Typography.fontSize.body,
    fontWeight: Typography.fontWeight.semibold,
    color: Colors.primary,
  },
  detailsContainer: {
    marginBottom: Spacing.lg,
  },
  detailSection: {
    marginBottom: Spacing.lg,
    padding: Spacing.md,
    backgroundColor: Colors.neutral100,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    borderColor: Colors.neutral200,
  },
  sectionTitle: {
    fontWeight: Typography.fontWeight.semibold,
    color: Colors.neutral700,
    marginBottom: Spacing.md,
    fontSize: Typography.fontSize.body,
  },
  listItem: {
    marginBottom: Spacing.sm,
    color: Colors.neutral600,
    lineHeight: 22,
    paddingLeft: Spacing.sm,
  },
  milestoneItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: Spacing.md,
    padding: Spacing.sm,
    backgroundColor: Colors.neutral100,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    borderColor: Colors.neutral200,
  },
  milestoneIndicator: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginTop: 6,
    marginRight: Spacing.sm,
  },
  milestoneContent: {
    flex: 1,
  },
  milestoneTitle: {
    fontWeight: Typography.fontWeight.semibold,
    color: Colors.neutral700,
    marginBottom: 4,
  },
  milestoneDescription: {
    color: Colors.neutral600,
    lineHeight: 18,
  },
  quickActions: {
    flexDirection: 'row',
    gap: Spacing.sm,
    marginTop: Spacing.md,
  },
  quickActionButton: {
    flex: 1,
    aspectRatio: 1.2,
    backgroundColor: Colors.neutral100,
    borderRadius: BorderRadius.lg,
    justifyContent: 'center',
    alignItems: 'center',
    gap: Spacing.xs,
    borderWidth: 1,
    borderColor: Colors.neutral300,
    ...Shadows.xs,
  },
  quickActionIcon: {
    fontSize: 24,
  },
});