import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  Alert
} from 'react-native';
import Card from './ui/Card';
import Button from './ui/Button';
import Theme from '../constants/Theme';
import {
  fetalMovementService,
  FetalMovementStats,
  FetalMovementAnalysis,
  DailyGoal
} from '../services/fetalMovementService';

const { width } = Dimensions.get('window');

interface FetalMovementAnalyticsProps {
  pregnancyWeek: number;
  style?: any;
}

export const FetalMovementAnalytics: React.FC<FetalMovementAnalyticsProps> = ({
  pregnancyWeek,
  style
}) => {
  const [stats, setStats] = useState<FetalMovementStats | null>(null);
  const [analysis, setAnalysis] = useState<FetalMovementAnalysis | null>(null);
  const [dailyGoals, setDailyGoals] = useState<DailyGoal[]>([]);
  const [activeTab, setActiveTab] = useState<'overview' | 'trends' | 'goals'>('overview');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, [pregnancyWeek]);

  const loadData = async () => {
    setLoading(true);
    try {
      const statsData = fetalMovementService.calculateStats(30);
      const analysisData = fetalMovementService.analyzeMovement(pregnancyWeek);
      const goalsData = fetalMovementService.getDailyGoals(7);
      
      setStats(statsData);
      setAnalysis(analysisData);
      setDailyGoals(goalsData);
    } catch (error) {
      console.error('加载胎动数据失败:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'normal': return Theme.Colors.success;
      case 'attention': return Theme.Colors.warning;
      case 'concern': return Theme.Colors.error;
      default: return Theme.Colors.neutral500;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'normal': return '✅';
      case 'attention': return '⚠️';
      case 'concern': return '🚨';
      default: return 'ℹ️';
    }
  };

  const renderOverviewTab = () => (
    <ScrollView style={styles.tabContent}>
      {/* 整体状态 */}
      {analysis && (
        <Card style={styles.statusCard}>
          <View style={styles.statusHeader}>
            <Text style={styles.statusIcon}>{getStatusIcon(analysis.status)}</Text>
            <View style={styles.statusInfo}>
              <Text style={styles.statusTitle}>胎动状态</Text>
              <Text style={[styles.statusMessage, { color: getStatusColor(analysis.status) }]}>
                {analysis.message}
              </Text>
            </View>
          </View>
          
          {analysis.alerts.length > 0 && (
            <View style={styles.alertsContainer}>
              {analysis.alerts.map((alert, index) => (
                <View key={index} style={[styles.alert, { 
                  backgroundColor: alert.type === 'danger' ? Theme.Colors.errorLight :
                                  alert.type === 'warning' ? Theme.Colors.warningLight :
                                  Theme.Colors.infoLight
                }]}>
                  <Text style={styles.alertText}>{alert.message}</Text>
                </View>
              ))}
            </View>
          )}
        </Card>
      )}

      {/* 统计概览 */}
      {stats && (
        <Card style={styles.statsCard}>
          <Text style={styles.cardTitle}>📊 统计概览</Text>
          <View style={styles.statsGrid}>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{stats.totalRecords}</Text>
              <Text style={styles.statLabel}>总记录数</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{stats.averageCount.toFixed(1)}</Text>
              <Text style={styles.statLabel}>平均次数</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{Math.round(stats.averageDuration / 60)}</Text>
              <Text style={styles.statLabel}>平均时长(分)</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{stats.bestTime}</Text>
              <Text style={styles.statLabel}>最活跃时段</Text>
            </View>
          </View>
        </Card>
      )}

      {/* 质量分布 */}
      {stats && (
        <Card style={styles.qualityCard}>
          <Text style={styles.cardTitle}>💪 胎动质量分布</Text>
          <View style={styles.qualityBars}>
            {Object.entries(stats.qualityDistribution).map(([quality, count]) => {
              const total = Object.values(stats.qualityDistribution).reduce((sum, c) => sum + c, 0);
              const percentage = total > 0 ? (count / total) * 100 : 0;
              const qualityLabels = { weak: '较弱', normal: '正常', strong: '强烈' };
              const qualityColors = { 
                weak: Theme.Colors.warning, 
                normal: Theme.Colors.info, 
                strong: Theme.Colors.success 
              };
              
              return (
                <View key={quality} style={styles.qualityItem}>
                  <View style={styles.qualityHeader}>
                    <Text style={styles.qualityLabel}>
                      {qualityLabels[quality as keyof typeof qualityLabels]}
                    </Text>
                    <Text style={styles.qualityCount}>{count}次</Text>
                  </View>
                  <View style={styles.qualityBarContainer}>
                    <View 
                      style={[
                        styles.qualityBar,
                        { 
                          width: `${percentage}%`,
                          backgroundColor: qualityColors[quality as keyof typeof qualityColors]
                        }
                      ]} 
                    />
                  </View>
                  <Text style={styles.qualityPercentage}>{percentage.toFixed(1)}%</Text>
                </View>
              );
            })}
          </View>
        </Card>
      )}

      {/* 建议 */}
      {analysis && analysis.recommendations.length > 0 && (
        <Card style={styles.recommendationsCard}>
          <Text style={styles.cardTitle}>💡 专业建议</Text>
          {analysis.recommendations.map((recommendation, index) => (
            <View key={index} style={styles.recommendationItem}>
              <Text style={styles.recommendationBullet}>•</Text>
              <Text style={styles.recommendationText}>{recommendation}</Text>
            </View>
          ))}
        </Card>
      )}
    </ScrollView>
  );

  const renderTrendsTab = () => (
    <ScrollView style={styles.tabContent}>
      {/* 趋势分析 */}
      {analysis && (
        <Card style={styles.trendCard}>
          <Text style={styles.cardTitle}>📈 趋势分析</Text>
          <View style={styles.trendIndicators}>
            <View style={[styles.trendIndicator, analysis.trends.increasing && styles.trendActive]}>
              <Text style={styles.trendIcon}>📈</Text>
              <Text style={styles.trendLabel}>上升趋势</Text>
            </View>
            <View style={[styles.trendIndicator, analysis.trends.stable && styles.trendActive]}>
              <Text style={styles.trendIcon}>➡️</Text>
              <Text style={styles.trendLabel}>稳定状态</Text>
            </View>
            <View style={[styles.trendIndicator, analysis.trends.decreasing && styles.trendActive]}>
              <Text style={styles.trendIcon}>📉</Text>
              <Text style={styles.trendLabel}>下降趋势</Text>
            </View>
          </View>
        </Card>
      )}

      {/* 周趋势 */}
      {stats && stats.weeklyTrend.length > 0 && (
        <Card style={styles.weeklyTrendCard}>
          <Text style={styles.cardTitle}>📅 周趋势变化</Text>
          <View style={styles.weeklyTrendContainer}>
            {stats.weeklyTrend.slice(-4).map((week, index) => (
              <View key={week.week} style={styles.weeklyTrendItem}>
                <Text style={styles.weeklyTrendWeek}>第{week.week}周</Text>
                <View style={styles.weeklyTrendBar}>
                  <View 
                    style={[
                      styles.weeklyTrendFill,
                      { 
                        height: `${Math.min((week.averageCount / 15) * 100, 100)}%`,
                        backgroundColor: Theme.Colors.primary
                      }
                    ]} 
                  />
                </View>
                <Text style={styles.weeklyTrendValue}>{week.averageCount.toFixed(1)}</Text>
              </View>
            ))}
          </View>
        </Card>
      )}

      {/* 每日模式 */}
      {stats && stats.dailyPattern.length > 0 && (
        <Card style={styles.dailyPatternCard}>
          <Text style={styles.cardTitle}>🕐 每日活动模式</Text>
          <View style={styles.dailyPatternContainer}>
            {stats.dailyPattern.filter(p => p.frequency > 0).map((pattern, index) => (
              <View key={pattern.hour} style={styles.dailyPatternItem}>
                <Text style={styles.dailyPatternHour}>
                  {pattern.hour.toString().padStart(2, '0')}:00
                </Text>
                <View style={styles.dailyPatternBarContainer}>
                  <View 
                    style={[
                      styles.dailyPatternBar,
                      { 
                        width: `${Math.min((pattern.averageCount / 15) * 100, 100)}%`,
                        backgroundColor: Theme.Colors.secondary
                      }
                    ]} 
                  />
                </View>
                <Text style={styles.dailyPatternValue}>
                  {pattern.averageCount.toFixed(1)}次
                </Text>
              </View>
            ))}
          </View>
        </Card>
      )}
    </ScrollView>
  );

  const renderGoalsTab = () => (
    <ScrollView style={styles.tabContent}>
      <Card style={styles.goalsCard}>
        <Text style={styles.cardTitle}>🎯 每日目标完成情况</Text>
        <View style={styles.goalsContainer}>
          {dailyGoals.map((goal, index) => (
            <View key={index} style={styles.goalItem}>
              <View style={styles.goalDate}>
                <Text style={styles.goalDateText}>
                  {goal.date.toLocaleDateString('zh-CN', { 
                    month: 'short', 
                    day: 'numeric' 
                  })}
                </Text>
                <Text style={styles.goalWeekday}>
                  {goal.date.toLocaleDateString('zh-CN', { weekday: 'short' })}
                </Text>
              </View>
              
              <View style={styles.goalProgress}>
                <View style={styles.goalProgressBar}>
                  <View 
                    style={[
                      styles.goalProgressFill,
                      { 
                        width: `${Math.min((goal.actualCount / goal.targetCount) * 100, 100)}%`,
                        backgroundColor: goal.completed ? Theme.Colors.success : Theme.Colors.warning
                      }
                    ]} 
                  />
                </View>
                <Text style={styles.goalProgressText}>
                  {goal.actualCount}/{goal.targetCount}
                </Text>
              </View>
              
              <View style={styles.goalStatus}>
                <Text style={styles.goalStatusIcon}>
                  {goal.completed ? '✅' : '⏳'}
                </Text>
                <Text style={styles.goalSessions}>{goal.sessions}次记录</Text>
              </View>
            </View>
          ))}
        </View>
        
        <View style={styles.goalsSummary}>
          <Text style={styles.goalsSummaryText}>
            本周完成率: {Math.round((dailyGoals.filter(g => g.completed).length / dailyGoals.length) * 100)}%
          </Text>
        </View>
      </Card>

      {/* 提醒建议 */}
      <Card style={styles.remindersCard}>
        <Text style={styles.cardTitle}>⏰ 记录提醒</Text>
        {fetalMovementService.getReminders().map((reminder, index) => (
          <View key={index} style={styles.reminderItem}>
            <Text style={styles.reminderIcon}>💡</Text>
            <Text style={styles.reminderText}>{reminder}</Text>
          </View>
        ))}
      </Card>
    </ScrollView>
  );

  if (loading) {
    return (
      <Card style={style}>
        <Text style={styles.loadingText}>加载胎动数据中...</Text>
      </Card>
    );
  }

  return (
    <View style={[styles.container, style]}>
      <Card style={styles.headerCard}>
        <View style={styles.header}>
          <Text style={styles.title}>📊 胎动分析</Text>
          <TouchableOpacity onPress={loadData} style={styles.refreshButton}>
            <Text style={styles.refreshButtonText}>🔄</Text>
          </TouchableOpacity>
        </View>
        
        <View style={styles.tabBar}>
          {[
            { key: 'overview', label: '概览' },
            { key: 'trends', label: '趋势' },
            { key: 'goals', label: '目标' }
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

      {activeTab === 'overview' && renderOverviewTab()}
      {activeTab === 'trends' && renderTrendsTab()}
      {activeTab === 'goals' && renderGoalsTab()}
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
  refreshButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: Theme.Colors.neutral200,
    justifyContent: 'center' as const,
    alignItems: 'center' as const,
  },
  refreshButtonText: {
    fontSize: 16,
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
  loadingText: {
    textAlign: 'center' as const,
    color: Theme.Colors.neutral500,
    paddingVertical: 20,
  },
  statusCard: {
    marginBottom: 12,
  },
  statusHeader: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    marginBottom: 12,
  },
  statusIcon: {
    fontSize: 24,
    marginRight: 12,
  },
  statusInfo: {
    flex: 1,
  },
  statusTitle: {
    fontSize: 16,
    fontWeight: 'bold' as const,
    color: Theme.Colors.neutral900,
    marginBottom: 4,
  },
  statusMessage: {
    fontSize: 14,
    fontWeight: '500' as const,
  },
  alertsContainer: {
    gap: 8,
  },
  alert: {
    padding: 12,
    borderRadius: 8,
  },
  alertText: {
    fontSize: 13,
    color: Theme.Colors.neutral700,
  },
  statsCard: {
    marginBottom: 12,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: 'bold' as const,
    color: Theme.Colors.neutral900,
    marginBottom: 12,
  },
  statsGrid: {
    flexDirection: 'row' as const,
    flexWrap: 'wrap' as const,
    gap: 12,
  },
  statItem: {
    flex: 1,
    minWidth: (width - 80) / 2,
    alignItems: 'center' as const,
    padding: 12,
    backgroundColor: Theme.Colors.neutral100,
    borderRadius: 8,
  },
  statValue: {
    fontSize: 20,
    fontWeight: 'bold' as const,
    color: Theme.Colors.primary,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: Theme.Colors.neutral500,
    textAlign: 'center' as const,
  },
  qualityCard: {
    marginBottom: 12,
  },
  qualityBars: {
    gap: 12,
  },
  qualityItem: {
    gap: 6,
  },
  qualityHeader: {
    flexDirection: 'row' as const,
    justifyContent: 'space-between' as const,
    alignItems: 'center' as const,
  },
  qualityLabel: {
    fontSize: 14,
    color: Theme.Colors.neutral900,
  },
  qualityCount: {
    fontSize: 12,
    color: Theme.Colors.neutral500,
  },
  qualityBarContainer: {
    height: 8,
    backgroundColor: Theme.Colors.neutral200,
    borderRadius: 4,
  },
  qualityBar: {
    height: 8,
    borderRadius: 4,
  },
  qualityPercentage: {
    fontSize: 12,
    color: Theme.Colors.neutral500,
    textAlign: 'right' as const,
  },
  recommendationsCard: {
    marginBottom: 12,
  },
  recommendationItem: {
    flexDirection: 'row' as const,
    alignItems: 'flex-start' as const,
    marginBottom: 8,
  },
  recommendationBullet: {
    fontSize: 14,
    color: Theme.Colors.primary,
    marginRight: 8,
    marginTop: 2,
  },
  recommendationText: {
    flex: 1,
    fontSize: 14,
    color: Theme.Colors.neutral700,
    lineHeight: 20,
  },
  trendCard: {
    marginBottom: 12,
  },
  trendIndicators: {
    flexDirection: 'row' as const,
    justifyContent: 'space-around' as const,
  },
  trendIndicator: {
    alignItems: 'center' as const,
    padding: 12,
    borderRadius: 8,
    backgroundColor: Theme.Colors.neutral100,
    opacity: 0.5,
  },
  trendActive: {
    opacity: 1,
    backgroundColor: Theme.Colors.primaryLight,
  },
  trendIcon: {
    fontSize: 20,
    marginBottom: 4,
  },
  trendLabel: {
    fontSize: 12,
    color: Theme.Colors.neutral700,
  },
  weeklyTrendCard: {
    marginBottom: 12,
  },
  weeklyTrendContainer: {
    flexDirection: 'row' as const,
    justifyContent: 'space-around' as const,
    alignItems: 'flex-end' as const,
    height: 120,
  },
  weeklyTrendItem: {
    alignItems: 'center' as const,
    flex: 1,
  },
  weeklyTrendWeek: {
    fontSize: 12,
    color: Theme.Colors.neutral500,
    marginBottom: 8,
  },
  weeklyTrendBar: {
    width: 20,
    height: 80,
    backgroundColor: Theme.Colors.neutral200,
    borderRadius: 10,
    justifyContent: 'flex-end' as const,
  },
  weeklyTrendFill: {
    width: 20,
    borderRadius: 10,
    minHeight: 4,
  },
  weeklyTrendValue: {
    fontSize: 10,
    color: Theme.Colors.neutral600,
    marginTop: 4,
  },
  dailyPatternCard: {
    marginBottom: 12,
  },
  dailyPatternContainer: {
    gap: 8,
  },
  dailyPatternItem: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    gap: 12,
  },
  dailyPatternHour: {
    fontSize: 12,
    color: Theme.Colors.neutral600,
    width: 40,
  },
  dailyPatternBarContainer: {
    flex: 1,
    height: 8,
    backgroundColor: Theme.Colors.neutral200,
    borderRadius: 4,
  },
  dailyPatternBar: {
    height: 8,
    borderRadius: 4,
  },
  dailyPatternValue: {
    fontSize: 12,
    color: Theme.Colors.neutral600,
    width: 50,
    textAlign: 'right' as const,
  },
  goalsCard: {
    marginBottom: 12,
  },
  goalsContainer: {
    gap: 12,
  },
  goalItem: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    gap: 12,
  },
  goalDate: {
    width: 60,
    alignItems: 'center' as const,
  },
  goalDateText: {
    fontSize: 12,
    color: Theme.Colors.neutral900,
    fontWeight: '500' as const,
  },
  goalWeekday: {
    fontSize: 10,
    color: Theme.Colors.neutral500,
  },
  goalProgress: {
    flex: 1,
    gap: 4,
  },
  goalProgressBar: {
    height: 8,
    backgroundColor: Theme.Colors.neutral200,
    borderRadius: 4,
  },
  goalProgressFill: {
    height: 8,
    borderRadius: 4,
  },
  goalProgressText: {
    fontSize: 12,
    color: Theme.Colors.neutral600,
  },
  goalStatus: {
    alignItems: 'center' as const,
    width: 60,
  },
  goalStatusIcon: {
    fontSize: 16,
    marginBottom: 2,
  },
  goalSessions: {
    fontSize: 10,
    color: Theme.Colors.neutral500,
  },
  goalsSummary: {
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: Theme.Colors.neutral200,
    alignItems: 'center' as const,
  },
  goalsSummaryText: {
    fontSize: 14,
    color: Theme.Colors.primary,
    fontWeight: '500' as const,
  },
  remindersCard: {
    marginBottom: 12,
  },
  reminderItem: {
    flexDirection: 'row' as const,
    alignItems: 'flex-start' as const,
    marginBottom: 8,
  },
  reminderIcon: {
    fontSize: 16,
    marginRight: 8,
    marginTop: 2,
  },
  reminderText: {
    flex: 1,
    fontSize: 14,
    color: Theme.Colors.neutral700,
    lineHeight: 20,
  },
};