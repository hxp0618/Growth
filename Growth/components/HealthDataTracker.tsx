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
  healthDataService,
  HealthMetric,
  HealthAlert,
  HealthReport,
  HealthTrend
} from '../services/healthDataService';

interface HealthDataTrackerProps {
  pregnancyWeek?: number;
  style?: any;
}

const { width } = Dimensions.get('window');

export const HealthDataTracker: React.FC<HealthDataTrackerProps> = ({
  pregnancyWeek = 28,
  style
}) => {
  const [latestMetrics, setLatestMetrics] = useState<{ [key: string]: HealthMetric }>({});
  const [alerts, setAlerts] = useState<HealthAlert[]>([]);
  const [report, setReport] = useState<HealthReport | null>(null);
  const [activeTab, setActiveTab] = useState<'overview' | 'add' | 'trends' | 'alerts'>('overview');
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedMetricType, setSelectedMetricType] = useState<string>('weight');
  const [inputValue, setInputValue] = useState('');
  const [inputValue2, setInputValue2] = useState(''); // 用于血压的舒张压
  const [inputNote, setInputNote] = useState('');
  const [selectedPeriod, setSelectedPeriod] = useState<'7days' | '30days' | '90days'>('30days');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    const latest = healthDataService.getLatestMetrics();
    const alertsData = healthDataService.getAlerts();
    const reportData = healthDataService.generateReport(selectedPeriod);

    setLatestMetrics(latest);
    setAlerts(alertsData);
    setReport(reportData);
  };

  const handleAddMetric = () => {
    if (!inputValue.trim()) {
      Alert.alert('提示', '请输入数值');
      return;
    }

    let value: number | { systolic: number; diastolic: number };
    
    if (selectedMetricType === 'blood_pressure') {
      if (!inputValue2.trim()) {
        Alert.alert('提示', '请输入舒张压数值');
        return;
      }
      value = {
        systolic: parseFloat(inputValue),
        diastolic: parseFloat(inputValue2)
      };
    } else {
      value = parseFloat(inputValue);
    }

    const metric = {
      type: selectedMetricType as HealthMetric['type'],
      value,
      unit: getMetricUnit(selectedMetricType),
      date: new Date(),
      time: new Date().toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' }),
      note: inputNote.trim() || undefined,
      pregnancyWeek
    };

    healthDataService.addMetric(metric);
    
    // 重置表单
    setInputValue('');
    setInputValue2('');
    setInputNote('');
    setShowAddModal(false);
    
    // 重新加载数据
    loadData();
    
    Alert.alert('成功', '健康数据已记录');
  };

  const getMetricUnit = (type: string): string => {
    const units = {
      weight: 'kg',
      blood_pressure: 'mmHg',
      blood_sugar: 'mmol/L',
      heart_rate: 'bpm',
      temperature: '°C'
    };
    return units[type as keyof typeof units] || '';
  };

  const formatMetricValue = (metric: HealthMetric): string => {
    if (typeof metric.value === 'object') {
      return `${metric.value.systolic}/${metric.value.diastolic}`;
    }
    return metric.value.toFixed(1);
  };

  const getMetricColor = (metric: HealthMetric): string => {
    return metric.isNormal ? Theme.Colors.success : Theme.Colors.error;
  };

  const getTrendIcon = (trend: 'up' | 'down' | 'stable'): string => {
    switch (trend) {
      case 'up': return '📈';
      case 'down': return '📉';
      case 'stable': return '➡️';
      default: return '➡️';
    }
  };

  const getAlertIcon = (type: 'warning' | 'danger' | 'info'): string => {
    switch (type) {
      case 'danger': return '🚨';
      case 'warning': return '⚠️';
      case 'info': return 'ℹ️';
      default: return 'ℹ️';
    }
  };

  const renderOverviewTab = () => (
    <ScrollView style={styles.tabContent}>
      {/* 健康评分 */}
      {report && (
        <Card style={styles.scoreCard}>
          <View style={styles.scoreContainer}>
            <View style={styles.scoreCircle}>
              <Text style={styles.scoreNumber}>{report.overallScore}</Text>
              <Text style={styles.scoreLabel}>健康评分</Text>
            </View>
            <View style={styles.scoreInfo}>
              <Text style={styles.scoreTitle}>整体健康状况</Text>
              <Text style={styles.scoreDescription}>
                {report.overallScore >= 90 ? '优秀' : 
                 report.overallScore >= 80 ? '良好' : 
                 report.overallScore >= 70 ? '一般' : '需要关注'}
              </Text>
              <Text style={styles.scorePeriod}>基于{report.period}数据</Text>
            </View>
          </View>
        </Card>
      )}

      {/* 最新指标 */}
      <Card style={styles.metricsCard}>
        <Text style={styles.cardTitle}>📊 最新指标</Text>
        <View style={styles.metricsGrid}>
          {Object.entries(latestMetrics).map(([type, metric]) => (
            <View key={type} style={styles.metricItem}>
              <Text style={styles.metricIcon}>
                {healthDataService.getMetricIcon(type)}
              </Text>
              <Text style={styles.metricName}>
                {healthDataService.getMetricDisplayName(type)}
              </Text>
              <Text style={[styles.metricValue, { color: getMetricColor(metric) }]}>
                {formatMetricValue(metric)}
              </Text>
              <Text style={styles.metricUnit}>{metric.unit}</Text>
              <Text style={styles.metricTime}>
                {metric.date.toLocaleDateString('zh-CN')}
              </Text>
            </View>
          ))}
        </View>
      </Card>

      {/* 未读警告 */}
      {alerts.filter(a => !a.isRead).length > 0 && (
        <Card style={styles.alertsCard}>
          <Text style={styles.cardTitle}>⚠️ 健康提醒</Text>
          {alerts.filter(a => !a.isRead).slice(0, 3).map(alert => (
            <TouchableOpacity
              key={alert.id}
              style={[styles.alertItem, { borderLeftColor: 
                alert.type === 'danger' ? Theme.Colors.error :
                alert.type === 'warning' ? Theme.Colors.warning : Theme.Colors.info
              }]}
              onPress={() => {
                healthDataService.markAlertAsRead(alert.id);
                loadData();
              }}
            >
              <Text style={styles.alertIcon}>{getAlertIcon(alert.type)}</Text>
              <View style={styles.alertContent}>
                <Text style={styles.alertTitle}>{alert.title}</Text>
                <Text style={styles.alertMessage}>{alert.message}</Text>
                <Text style={styles.alertTime}>
                  {alert.date.toLocaleDateString('zh-CN')}
                </Text>
              </View>
            </TouchableOpacity>
          ))}
        </Card>
      )}

      {/* 快速操作 */}
      <Card style={styles.actionsCard}>
        <Text style={styles.cardTitle}>⚡ 快速记录</Text>
        <View style={styles.actionsGrid}>
          {['weight', 'blood_pressure', 'blood_sugar', 'heart_rate'].map(type => (
            <TouchableOpacity
              key={type}
              style={styles.actionItem}
              onPress={() => {
                setSelectedMetricType(type);
                setShowAddModal(true);
              }}
            >
              <Text style={styles.actionIcon}>
                {healthDataService.getMetricIcon(type)}
              </Text>
              <Text style={styles.actionName}>
                {healthDataService.getMetricDisplayName(type)}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </Card>
    </ScrollView>
  );

  const renderTrendsTab = () => {
    const metricTypes = ['weight', 'blood_pressure', 'blood_sugar', 'heart_rate'];
    
    return (
      <ScrollView style={styles.tabContent}>
        {/* 时间段选择 */}
        <Card style={styles.periodCard}>
          <Text style={styles.cardTitle}>📈 趋势分析</Text>
          <View style={styles.periodSelector}>
            {[
              { key: '7days', label: '7天' },
              { key: '30days', label: '30天' },
              { key: '90days', label: '90天' }
            ].map(period => (
              <TouchableOpacity
                key={period.key}
                style={[
                  styles.periodButton,
                  selectedPeriod === period.key && styles.periodButtonActive
                ]}
                onPress={() => {
                  setSelectedPeriod(period.key as any);
                  loadData();
                }}
              >
                <Text style={[
                  styles.periodButtonText,
                  selectedPeriod === period.key && styles.periodButtonTextActive
                ]}>
                  {period.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </Card>

        {/* 趋势图表 */}
        {metricTypes.map(type => {
          const trend = healthDataService.getTrend(type, selectedPeriod);
          if (trend.data.length === 0) return null;

          return (
            <Card key={type} style={styles.trendCard}>
              <View style={styles.trendHeader}>
                <Text style={styles.trendIcon}>
                  {healthDataService.getMetricIcon(type)}
                </Text>
                <View style={styles.trendInfo}>
                  <Text style={styles.trendTitle}>
                    {healthDataService.getMetricDisplayName(type)}
                  </Text>
                  <View style={styles.trendMeta}>
                    <Text style={styles.trendIcon}>{getTrendIcon(trend.trend)}</Text>
                    <Text style={styles.trendChange}>
                      {trend.changePercent > 0 ? '+' : ''}{trend.changePercent.toFixed(1)}%
                    </Text>
                  </View>
                </View>
              </View>
              
              {/* 简单的趋势可视化 */}
              <View style={styles.trendChart}>
                {trend.data.slice(-7).map((point, index) => (
                  <View key={index} style={styles.chartPoint}>
                    <View 
                      style={[
                        styles.chartBar,
                        { 
                          height: Math.max(20, (point.value / Math.max(...trend.data.map(d => d.value))) * 60),
                          backgroundColor: trend.trend === 'up' ? Theme.Colors.success : 
                                         trend.trend === 'down' ? Theme.Colors.error : Theme.Colors.info
                        }
                      ]} 
                    />
                    <Text style={styles.chartLabel}>
                      {new Date(point.date).getDate()}
                    </Text>
                  </View>
                ))}
              </View>
            </Card>
          );
        })}
      </ScrollView>
    );
  };

  const renderAlertsTab = () => (
    <ScrollView style={styles.tabContent}>
      <Card style={styles.alertsListCard}>
        <Text style={styles.cardTitle}>🔔 健康提醒</Text>
        {alerts.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>暂无健康提醒</Text>
            <Text style={styles.emptySubtext}>继续保持良好的健康状态</Text>
          </View>
        ) : (
          alerts.map(alert => (
            <TouchableOpacity
              key={alert.id}
              style={[
                styles.alertListItem,
                { borderLeftColor: 
                  alert.type === 'danger' ? Theme.Colors.error :
                  alert.type === 'warning' ? Theme.Colors.warning : Theme.Colors.info
                },
                !alert.isRead && styles.alertUnread
              ]}
              onPress={() => {
                if (!alert.isRead) {
                  healthDataService.markAlertAsRead(alert.id);
                  loadData();
                }
              }}
            >
              <View style={styles.alertListHeader}>
                <Text style={styles.alertListIcon}>{getAlertIcon(alert.type)}</Text>
                <Text style={styles.alertListTitle}>{alert.title}</Text>
                {!alert.isRead && <View style={styles.unreadDot} />}
              </View>
              <Text style={styles.alertListMessage}>{alert.message}</Text>
              <Text style={styles.alertListTime}>
                {alert.date.toLocaleDateString('zh-CN')} {alert.date.toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' })}
              </Text>
            </TouchableOpacity>
          ))
        )}
      </Card>
    </ScrollView>
  );

  return (
    <View style={[styles.container, style]}>
      <Card style={styles.headerCard}>
        <View style={styles.header}>
          <Text style={styles.title}>📊 健康数据追踪</Text>
        </View>
        
        <View style={styles.tabBar}>
          {[
            { key: 'overview', label: '概览' },
            { key: 'trends', label: '趋势' },
            { key: 'alerts', label: '提醒' }
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
      {activeTab === 'alerts' && renderAlertsTab()}

      {/* 添加数据按钮 */}
      <TouchableOpacity
        style={styles.addButton}
        onPress={() => setShowAddModal(true)}
      >
        <Text style={styles.addButtonText}>+</Text>
      </TouchableOpacity>

      {/* 添加数据模态框 */}
      <Modal
        visible={showAddModal}
        animationType="slide"
        presentationStyle="pageSheet"
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <TouchableOpacity onPress={() => setShowAddModal(false)}>
              <Text style={styles.modalCancel}>取消</Text>
            </TouchableOpacity>
            <Text style={styles.modalTitle}>记录健康数据</Text>
            <TouchableOpacity onPress={handleAddMetric}>
              <Text style={styles.modalSave}>保存</Text>
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.modalContent}>
            {/* 指标类型选择 */}
            <View style={styles.formSection}>
              <Text style={styles.formLabel}>选择指标类型</Text>
              <View style={styles.typeSelector}>
                {['weight', 'blood_pressure', 'blood_sugar', 'heart_rate', 'temperature'].map(type => (
                  <TouchableOpacity
                    key={type}
                    style={[
                      styles.typeButton,
                      selectedMetricType === type && styles.typeButtonActive
                    ]}
                    onPress={() => setSelectedMetricType(type)}
                  >
                    <Text style={styles.typeIcon}>
                      {healthDataService.getMetricIcon(type)}
                    </Text>
                    <Text style={[
                      styles.typeText,
                      selectedMetricType === type && styles.typeTextActive
                    ]}>
                      {healthDataService.getMetricDisplayName(type)}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* 数值输入 */}
            <View style={styles.formSection}>
              <Text style={styles.formLabel}>
                {selectedMetricType === 'blood_pressure' ? '收缩压' : '数值'}
              </Text>
              <TextInput
                style={styles.input}
                value={inputValue}
                onChangeText={setInputValue}
                placeholder={`请输入${healthDataService.getMetricDisplayName(selectedMetricType)}数值`}
                keyboardType="numeric"
              />
              
              {selectedMetricType === 'blood_pressure' && (
                <>
                  <Text style={[styles.formLabel, { marginTop: 16 }]}>舒张压</Text>
                  <TextInput
                    style={styles.input}
                    value={inputValue2}
                    onChangeText={setInputValue2}
                    placeholder="请输入舒张压数值"
                    keyboardType="numeric"
                  />
                </>
              )}
            </View>

            {/* 备注 */}
            <View style={styles.formSection}>
              <Text style={styles.formLabel}>备注（可选）</Text>
              <TextInput
                style={[styles.input, styles.noteInput]}
                value={inputNote}
                onChangeText={setInputNote}
                placeholder="添加备注信息..."
                multiline
                numberOfLines={3}
              />
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
    marginBottom: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold' as const,
    color: Theme.Colors.neutral900,
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
  scoreCard: {
    marginBottom: 12,
  },
  scoreContainer: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
  },
  scoreCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: Theme.Colors.primary + '20',
    justifyContent: 'center' as const,
    alignItems: 'center' as const,
    marginRight: 16,
  },
  scoreNumber: {
    fontSize: 24,
    fontWeight: 'bold' as const,
    color: Theme.Colors.primary,
  },
  scoreLabel: {
    fontSize: 10,
    color: Theme.Colors.neutral600,
  },
  scoreInfo: {
    flex: 1,
  },
  scoreTitle: {
    fontSize: 16,
    fontWeight: '500' as const,
    color: Theme.Colors.neutral900,
    marginBottom: 4,
  },
  scoreDescription: {
    fontSize: 14,
    color: Theme.Colors.neutral700,
    marginBottom: 4,
  },
  scorePeriod: {
    fontSize: 12,
    color: Theme.Colors.neutral500,
  },
  metricsCard: {
    marginBottom: 12,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: 'bold' as const,
    color: Theme.Colors.neutral900,
    marginBottom: 12,
  },
  metricsGrid: {
    flexDirection: 'row' as const,
    flexWrap: 'wrap' as const,
    gap: 8,
  },
  metricItem: {
    width: (width - 64) / 2,
    backgroundColor: Theme.Colors.neutral100,
    borderRadius: 8,
    padding: 12,
    alignItems: 'center' as const,
  },
  metricIcon: {
    fontSize: 24,
    marginBottom: 4,
  },
  metricName: {
    fontSize: 12,
    color: Theme.Colors.neutral600,
    marginBottom: 4,
  },
  metricValue: {
    fontSize: 18,
    fontWeight: 'bold' as const,
    marginBottom: 2,
  },
  metricUnit: {
    fontSize: 10,
    color: Theme.Colors.neutral500,
    marginBottom: 4,
  },
  metricTime: {
    fontSize: 10,
    color: Theme.Colors.neutral400,
  },
  alertsCard: {
    marginBottom: 12,
  },
  alertItem: {
    flexDirection: 'row' as const,
    paddingVertical: 12,
    paddingLeft: 12,
    borderLeftWidth: 4,
    marginBottom: 8,
    backgroundColor: Theme.Colors.neutral100,
    borderRadius: 8,
  },
  alertIcon: {
    fontSize: 20,
    marginRight: 12,
  },
  alertContent: {
    flex: 1,
  },
  alertTitle: {
    fontSize: 14,
    fontWeight: '500' as const,
    color: Theme.Colors.neutral900,
    marginBottom: 4,
  },
  alertMessage: {
    fontSize: 12,
    color: Theme.Colors.neutral700,
    lineHeight: 18,
    marginBottom: 4,
  },
  alertTime: {
    fontSize: 10,
    color: Theme.Colors.neutral500,
  },
  actionsCard: {
    marginBottom: 12,
  },
  actionsGrid: {
    flexDirection: 'row' as const,
    flexWrap: 'wrap' as const,
    gap: 8,
  },
  actionItem: {
    width: (width - 64) / 2,
    backgroundColor: Theme.Colors.neutral100,
    borderRadius: 8,
    padding: 16,
    alignItems: 'center' as const,
  },
  actionIcon: {
    fontSize: 32,
    marginBottom: 8,
  },
  actionName: {
    fontSize: 14,
    color: Theme.Colors.neutral700,
    textAlign: 'center' as const,
  },
  periodCard: {
    marginBottom: 12,
  },
  periodSelector: {
    flexDirection: 'row' as const,
    gap: 8,
  },
  periodButton: {
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 16,
    backgroundColor: Theme.Colors.neutral200,
    alignItems: 'center' as const,
  },
  periodButtonActive: {
    backgroundColor: Theme.Colors.primary,
  },
  periodButtonText: {
    fontSize: 14,
    color: Theme.Colors.neutral700,
  },
  periodButtonTextActive: {
    color: 'white',
    fontWeight: '500' as const,
  },
  trendCard: {
    marginBottom: 12,
  },
  trendHeader: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    marginBottom: 16,
  },
  trendIcon: {
    fontSize: 24,
    marginRight: 12,
  },
  trendInfo: {
    flex: 1,
  },
  trendTitle: {
    fontSize: 16,
    fontWeight: '500' as const,
    color: Theme.Colors.neutral900,
    marginBottom: 4,
  },
  trendMeta: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    gap: 8,
  },
  trendChange: {
    fontSize: 14,
    color: Theme.Colors.neutral600,
  },
  trendChart: {
    flexDirection: 'row' as const,
    justifyContent: 'space-between' as const,
    alignItems: 'flex-end' as const,
    height: 80,
    paddingHorizontal: 8,
  },
  chartPoint: {
    alignItems: 'center' as const,
  },
  chartBar: {
    width: 20,
    borderRadius: 2,
    marginBottom: 4,
  },
  chartLabel: {
    fontSize: 10,
    color: Theme.Colors.neutral500,
  },
  alertsListCard: {
    marginBottom: 12,
  },
  alertListItem: {
    paddingVertical: 12,
    paddingLeft: 12,
    borderLeftWidth: 4,
    marginBottom: 8,
    backgroundColor: Theme.Colors.neutral100,
    borderRadius: 8,
  },
  alertUnread: {
    backgroundColor: Theme.Colors.primary + '10',
  },
  alertListHeader: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    marginBottom: 4,
  },
  alertListIcon: {
    fontSize: 16,
    marginRight: 8,
  },
  alertListTitle: {
    flex: 1,
    fontSize: 14,
    fontWeight: '500' as const,
    color: Theme.Colors.neutral900,
  },
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Theme.Colors.primary,
  },
  alertListMessage: {
    fontSize: 12,
    color: Theme.Colors.neutral700,
    lineHeight: 18,
    marginBottom: 4,
    paddingLeft: 24,
  },
  alertListTime: {
    fontSize: 10,
    color: Theme.Colors.neutral500,
    paddingLeft: 24,
  },
  emptyContainer: {
    alignItems: 'center' as const,
    paddingVertical: 40,
  },
  emptyText: {
    fontSize: 16,
    color: Theme.Colors.neutral500,
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    color: Theme.Colors.neutral400,
    textAlign: 'center' as const,
  },
  addButton: {
    position: 'absolute' as const,
    right: 16,
    bottom: 16,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: Theme.Colors.primary,
    justifyContent: 'center' as const,
    alignItems: 'center' as const,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  addButtonText: {
    fontSize: 24,
    color: 'white',
    fontWeight: 'bold' as const,
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
    color: Theme.Colors.neutral600,
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
  formSection: {
    marginBottom: 24,
  },
  formLabel: {
    fontSize: 16,
    fontWeight: '500' as const,
    color: Theme.Colors.neutral900,
    marginBottom: 8,
  },
  typeSelector: {
    flexDirection: 'row' as const,
    flexWrap: 'wrap' as const,
    gap: 8,
  },
  typeButton: {
    width: (width - 64) / 2,
    padding: 12,
    borderRadius: 8,
    backgroundColor: Theme.Colors.neutral100,
    alignItems: 'center' as const,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  typeButtonActive: {
    backgroundColor: Theme.Colors.primary + '20',
    borderColor: Theme.Colors.primary,
  },
  typeIcon: {
    fontSize: 24,
    marginBottom: 4,
  },
  typeText: {
    fontSize: 12,
    color: Theme.Colors.neutral700,
    textAlign: 'center' as const,
  },
  typeTextActive: {
    color: Theme.Colors.primary,
    fontWeight: '500' as const,
  },
  input: {
    borderWidth: 1,
    borderColor: Theme.Colors.neutral200,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
    fontSize: 16,
    color: Theme.Colors.neutral900,
    backgroundColor: 'white',
  },
  noteInput: {
    height: 80,
    textAlignVertical: 'top' as const,
  },
};

export default HealthDataTracker;