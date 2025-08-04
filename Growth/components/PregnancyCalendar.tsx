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
import { Colors, Typography, Spacing } from '@/constants/Theme';
import { CommonStyles } from '@/constants/Styles';
import { pregnancyService, PregnancyInfo, FetalDevelopment, WeeklyMilestone } from '@/services/pregnancyService';

interface PregnancyCalendarProps {
  dueDate?: Date;
  style?: ViewStyle;
}

const { width } = Dimensions.get('window');

export default function PregnancyCalendar({ dueDate, style }: PregnancyCalendarProps) {
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
      <Card style={style ? { ...styles.card, ...style } : styles.card}>
        <View style={styles.loadingContainer}>
          <Text style={CommonStyles.textBody}>加载孕期信息中...</Text>
        </View>
      </Card>
    );
  }

  const trimesterInfo = getTrimesterInfo();
  const progressPercentage = getProgressPercentage();

  return (
    <Card style={style ? { ...styles.card, ...style } : styles.card} variant="pregnant">
      <ScrollView showsVerticalScrollIndicator={false}>
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
      </ScrollView>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    marginBottom: Spacing.md,
  },
  loadingContainer: {
    alignItems: 'center',
    paddingVertical: Spacing.lg,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: Spacing.md,
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
    gap: 4,
  },
  trimesterDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  daysRemaining: {
    fontSize: Typography.fontSize.h4,
    fontWeight: Typography.fontWeight.bold,
    color: Colors.neutral800,
    textAlign: 'right',
  },
  progressSection: {
    marginBottom: Spacing.lg,
  },
  progressBar: {
    height: 8,
    backgroundColor: Colors.neutral200,
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: Spacing.xs,
  },
  progressFill: {
    height: '100%',
    backgroundColor: Colors.pregnant,
    borderRadius: 4,
  },
  progressText: {
    textAlign: 'center',
    color: Colors.neutral600,
  },
  developmentSection: {
    marginBottom: Spacing.md,
  },
  developmentHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.primaryLight,
    padding: Spacing.md,
    borderRadius: 12,
  },
  developmentIcon: {
    fontSize: 48,
    marginRight: Spacing.md,
  },
  developmentInfo: {
    flex: 1,
  },
  detailsToggle: {
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.md,
    backgroundColor: Colors.neutral100,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  detailsToggleText: {
    fontSize: Typography.fontSize.bodySmall,
    fontWeight: Typography.fontWeight.medium,
    color: Colors.primary,
  },
  detailsContainer: {
    marginBottom: Spacing.md,
  },
  detailSection: {
    marginBottom: Spacing.md,
    paddingBottom: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.neutral200,
  },
  sectionTitle: {
    fontWeight: Typography.fontWeight.medium,
    color: Colors.neutral700,
    marginBottom: Spacing.sm,
  },
  listItem: {
    marginBottom: Spacing.xs,
    color: Colors.neutral600,
    lineHeight: 20,
  },
  milestoneItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: Spacing.sm,
  },
  milestoneIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginTop: 6,
    marginRight: Spacing.sm,
  },
  milestoneContent: {
    flex: 1,
  },
  milestoneTitle: {
    fontWeight: Typography.fontWeight.medium,
    color: Colors.neutral700,
    marginBottom: 2,
  },
  milestoneDescription: {
    color: Colors.neutral600,
    lineHeight: 16,
  },
  quickActions: {
    flexDirection: 'row',
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
    fontSize: 20,
  },
});