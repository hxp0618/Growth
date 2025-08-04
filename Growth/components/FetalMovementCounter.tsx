import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Modal,
  Alert,
  Animated,
} from 'react-native';
import { Card, Button, ProgressBar } from './ui';
import { Colors, Typography, Spacing, BorderRadius } from '../constants/Theme';
import { CommonStyles } from '../constants/Styles';
import { fetalMovementService } from '../services/fetalMovementService';
import { FetalMovementAnalytics } from './FetalMovementAnalytics';

interface FetalMovementCounterProps {
  pregnancyWeek?: number;
  onCountingComplete?: (count: number, duration: number) => void;
}

const FetalMovementCounter: React.FC<FetalMovementCounterProps> = ({
  pregnancyWeek = 28,
  onCountingComplete,
}) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [count, setCount] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [time, setTime] = useState(0);
  const [targetReached, setTargetReached] = useState(false);
  const [showAnalytics, setShowAnalytics] = useState(false);
  const [quality, setQuality] = useState<'weak' | 'normal' | 'strong'>('normal');
  const [pattern, setPattern] = useState<'regular' | 'irregular' | 'clustered'>('regular');
  
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const pulseAnim = useRef(new Animated.Value(1)).current;

  const TARGET_COUNT = 10;
  const TARGET_TIME = 3600; // 1小时 = 3600秒

  useEffect(() => {
    if (isActive) {
      intervalRef.current = setInterval(() => {
        setTime(prevTime => {
          const newTime = prevTime + 1;
          if (newTime >= TARGET_TIME) {
            handleStopCounting();
          }
          return newTime;
        });
      }, 1000);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isActive]);

  useEffect(() => {
    if (count >= TARGET_COUNT && !targetReached) {
      setTargetReached(true);
      handleTargetReached();
    }
  }, [count, targetReached]);

  const startPulseAnimation = () => {
    Animated.sequence([
      Animated.timing(pulseAnim, {
        toValue: 1.2,
        duration: 150,
        useNativeDriver: true,
      }),
      Animated.timing(pulseAnim, {
        toValue: 1,
        duration: 150,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const handleStartCounting = () => {
    setModalVisible(true);
    setCount(0);
    setTime(0);
    setIsActive(true);
    setTargetReached(false);
  };

  const handleCountPress = () => {
    setCount(prevCount => prevCount + 1);
    startPulseAnimation();
  };

  const handlePauseCounting = () => {
    setIsActive(!isActive);
  };

  const handleStopCounting = () => {
    setIsActive(false);
    const duration = time;
    const finalCount = count;
    
    Alert.alert(
      '记录完成',
      `本次记录：${finalCount}次胎动，用时${formatTime(duration)}`,
      [
        {
          text: '保存记录',
          onPress: () => {
            // 保存到服务中
            const startTime = new Date();
            startTime.setSeconds(startTime.getSeconds() - duration);
            
            fetalMovementService.saveRecord({
              date: new Date(),
              startTime,
              endTime: new Date(),
              count: finalCount,
              duration,
              pregnancyWeek,
              quality,
              pattern,
              notes: `记录时长: ${formatTime(duration)}`
            });
            
            onCountingComplete?.(finalCount, duration);
            setModalVisible(false);
          },
        },
        {
          text: '继续记录',
          style: 'cancel',
        },
      ]
    );
  };

  const handleTargetReached = () => {
    Alert.alert(
      '目标达成！',
      `恭喜！已记录到${TARGET_COUNT}次胎动，宝宝很活跃哦！`,
      [
        {
          text: '完成记录',
          onPress: () => {
            // 保存到服务中
            const startTime = new Date();
            startTime.setSeconds(startTime.getSeconds() - time);
            
            fetalMovementService.saveRecord({
              date: new Date(),
              startTime,
              endTime: new Date(),
              count,
              duration: time,
              pregnancyWeek,
              quality,
              pattern,
              notes: `目标达成记录`
            });
            
            onCountingComplete?.(count, time);
            setModalVisible(false);
          },
        },
        {
          text: '继续记录',
          style: 'cancel',
        },
      ]
    );
  };

  const handleCloseModal = () => {
    if (isActive || count > 0) {
      Alert.alert(
        '确认退出',
        '当前记录尚未保存，确定要退出吗？',
        [
          { text: '取消', style: 'cancel' },
          {
            text: '退出',
            style: 'destructive',
            onPress: () => {
              setIsActive(false);
              setModalVisible(false);
            },
          },
        ]
      );
    } else {
      setModalVisible(false);
    }
  };

  const formatTime = (seconds: number): string => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
  };

  const getProgressPercentage = (): number => {
    return Math.min((count / TARGET_COUNT) * 100, 100);
  };

  const getTimeProgressPercentage = (): number => {
    return (time / TARGET_TIME) * 100;
  };

  return (
    <>
      <View style={styles.containerWrapper}>
        <View style={styles.buttonRow}>
          <TouchableOpacity
            style={[styles.counterButton, { flex: 1, marginRight: 8 }]}
            onPress={handleStartCounting}
            activeOpacity={0.8}
          >
            <View style={styles.buttonContent}>
              <Text style={styles.buttonIcon}>👶</Text>
              <Text style={styles.buttonText}>开始记录</Text>
            </View>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[styles.analyticsButton, { flex: 1, marginLeft: 8 }]}
            onPress={() => setShowAnalytics(true)}
            activeOpacity={0.8}
          >
            <View style={styles.buttonContent}>
              <Text style={styles.buttonIcon}>📊</Text>
              <Text style={styles.buttonText}>查看分析</Text>
            </View>
          </TouchableOpacity>
        </View>
        
        {/* 今日简要统计 */}
        <View style={styles.todayStats}>
          <Text style={styles.todayStatsTitle}>今日胎动</Text>
          <View style={styles.todayStatsContent}>
            <View style={styles.todayStatItem}>
              <Text style={styles.todayStatValue}>
                {fetalMovementService.getTodayRecords().reduce((sum, r) => sum + r.count, 0)}
              </Text>
              <Text style={styles.todayStatLabel}>次数</Text>
            </View>
            <View style={styles.todayStatItem}>
              <Text style={styles.todayStatValue}>
                {fetalMovementService.getTodayRecords().length}
              </Text>
              <Text style={styles.todayStatLabel}>记录</Text>
            </View>
          </View>
        </View>
      </View>

      <Modal
        animationType="slide"
        transparent={false}
        visible={modalVisible}
        onRequestClose={handleCloseModal}
      >
        <View style={styles.modalContainer}>
          <View style={styles.header}>
            <TouchableOpacity
              style={styles.backButton}
              onPress={handleCloseModal}
            >
              <Text style={styles.backButtonText}>←</Text>
            </TouchableOpacity>
            <Text style={CommonStyles.textH3}>胎动记录</Text>
            <View style={styles.placeholder} />
          </View>

          <View style={styles.content}>
            <Text style={styles.subtitle}>👶 感受宝宝的活力</Text>

            <Animated.View style={[styles.counterCircle, { transform: [{ scale: pulseAnim }] }]}>
              <TouchableOpacity
                style={styles.countButton}
                onPress={handleCountPress}
                disabled={!isActive}
                activeOpacity={0.8}
              >
                <Text style={styles.countButtonText}>点击记录</Text>
                <Text style={styles.countButtonSubtext}>胎动次数</Text>
                <Text style={styles.countNumber}>{count}</Text>
              </TouchableOpacity>
            </Animated.View>

            <View style={styles.statsContainer}>
              <View style={styles.statItem}>
                <Text style={CommonStyles.textBodySmall}>计时</Text>
                <Text style={CommonStyles.textH4}>{formatTime(time)}</Text>
              </View>
              <View style={styles.statItem}>
                <Text style={CommonStyles.textBodySmall}>目标</Text>
                <Text style={CommonStyles.textH4}>{TARGET_COUNT}次/小时</Text>
              </View>
            </View>

            <Card style={styles.progressCard}>
              <Text style={CommonStyles.textBody}>胎动进度</Text>
              <ProgressBar
                progress={getProgressPercentage()}
                color={targetReached ? Colors.success : Colors.primary}
                style={styles.progressBar}
              />
              <Text style={CommonStyles.textBodySmall}>
                {count}/{TARGET_COUNT} 次
              </Text>
            </Card>

            <Card style={styles.progressCard}>
              <Text style={CommonStyles.textBody}>时间进度</Text>
              <ProgressBar
                progress={getTimeProgressPercentage()}
                color={Colors.secondary}
                style={styles.progressBar}
              />
              <Text style={CommonStyles.textBodySmall}>
                {formatTime(time)}/1:00:00
              </Text>
            </Card>

            {/* 胎动质量和模式选择 */}
            <Card style={styles.qualityCard}>
              <Text style={CommonStyles.textBody}>胎动质量</Text>
              <View style={styles.qualityButtons}>
                {[
                  { key: 'weak', label: '较弱', color: Colors.warning },
                  { key: 'normal', label: '正常', color: Colors.info },
                  { key: 'strong', label: '强烈', color: Colors.success }
                ].map(item => (
                  <TouchableOpacity
                    key={item.key}
                    style={[
                      styles.qualityButton,
                      quality === item.key && { backgroundColor: item.color + '20', borderColor: item.color }
                    ]}
                    onPress={() => setQuality(item.key as any)}
                  >
                    <Text style={[
                      styles.qualityButtonText,
                      quality === item.key && { color: item.color }
                    ]}>
                      {item.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </Card>

            <Card style={styles.patternCard}>
              <Text style={CommonStyles.textBody}>胎动模式</Text>
              <View style={styles.patternButtons}>
                {[
                  { key: 'regular', label: '规律' },
                  { key: 'irregular', label: '不规律' },
                  { key: 'clustered', label: '集中' }
                ].map(item => (
                  <TouchableOpacity
                    key={item.key}
                    style={[
                      styles.patternButton,
                      pattern === item.key && styles.patternButtonActive
                    ]}
                    onPress={() => setPattern(item.key as any)}
                  >
                    <Text style={[
                      styles.patternButtonText,
                      pattern === item.key && styles.patternButtonTextActive
                    ]}>
                      {item.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </Card>
          </View>

          <View style={styles.footer}>
            <Button
              variant="secondary"
              onPress={handlePauseCounting}
              style={styles.footerButton}
            >
              {isActive ? '暂停' : '继续'}
            </Button>
            <Button
              onPress={handleStopCounting}
              style={styles.footerButton}
            >
              完成记录
            </Button>
          </View>
        </View>
      </Modal>

      {/* 分析模态框 */}
      <Modal
        visible={showAnalytics}
        animationType="slide"
        presentationStyle="pageSheet"
      >
        <View style={styles.analyticsModalContainer}>
          <View style={styles.analyticsHeader}>
            <TouchableOpacity onPress={() => setShowAnalytics(false)}>
              <Text style={styles.analyticsCloseText}>完成</Text>
            </TouchableOpacity>
            <Text style={styles.analyticsTitle}>胎动分析</Text>
            <View style={styles.placeholder} />
          </View>
          <FetalMovementAnalytics pregnancyWeek={pregnancyWeek} />
        </View>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  containerWrapper: {
    gap: 12,
  },
  buttonRow: {
    flexDirection: 'row',
  },
  counterButton: {
    backgroundColor: Colors.primary,
    borderRadius: BorderRadius.lg,
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.lg,
    alignItems: 'center',
  },
  analyticsButton: {
    backgroundColor: Colors.secondary,
    borderRadius: BorderRadius.lg,
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.lg,
    alignItems: 'center',
  },
  todayStats: {
    backgroundColor: Colors.neutral100,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
  },
  todayStatsTitle: {
    fontSize: Typography.fontSize.body,
    fontWeight: Typography.fontWeight.medium,
    color: Colors.neutral700,
    marginBottom: Spacing.sm,
    textAlign: 'center',
  },
  todayStatsContent: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  todayStatItem: {
    alignItems: 'center',
  },
  todayStatValue: {
    fontSize: Typography.fontSize.h3,
    fontWeight: Typography.fontWeight.bold,
    color: Colors.primary,
  },
  todayStatLabel: {
    fontSize: Typography.fontSize.bodySmall,
    color: Colors.neutral500,
  },
  buttonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  buttonIcon: {
    fontSize: 24,
  },
  buttonText: {
    fontSize: Typography.fontSize.bodyLarge,
    fontWeight: Typography.fontWeight.semibold,
    color: Colors.neutral100,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: Colors.neutral100,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.neutral200,
  },
  backButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: Colors.neutral200,
    justifyContent: 'center',
    alignItems: 'center',
  },
  backButtonText: {
    fontSize: 18,
    color: Colors.neutral700,
  },
  placeholder: {
    width: 32,
  },
  content: {
    flex: 1,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.xl,
    alignItems: 'center',
  },
  subtitle: {
    fontSize: Typography.fontSize.bodyLarge,
    color: Colors.neutral600,
    marginBottom: Spacing.xl,
  },
  counterCircle: {
    marginBottom: Spacing.xl,
  },
  countButton: {
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: Colors.primaryLight,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 4,
    borderColor: Colors.primary,
  },
  countButtonText: {
    fontSize: Typography.fontSize.body,
    fontWeight: Typography.fontWeight.medium,
    color: Colors.primary,
    marginBottom: 4,
  },
  countButtonSubtext: {
    fontSize: Typography.fontSize.bodySmall,
    color: Colors.primary,
    marginBottom: 8,
  },
  countNumber: {
    fontSize: 48,
    fontWeight: Typography.fontWeight.bold,
    color: Colors.primary,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginBottom: Spacing.xl,
  },
  statItem: {
    alignItems: 'center',
    gap: 4,
  },
  progressCard: {
    width: '100%',
    marginBottom: Spacing.md,
  },
  progressBar: {
    marginVertical: Spacing.sm,
  },
  footer: {
    flexDirection: 'row',
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.lg,
    gap: Spacing.md,
    borderTopWidth: 1,
    borderTopColor: Colors.neutral200,
  },
  footerButton: {
    flex: 1,
  },
  qualityCard: {
    width: '100%',
    marginBottom: Spacing.md,
  },
  qualityButtons: {
    flexDirection: 'row',
    gap: Spacing.sm,
    marginTop: Spacing.sm,
  },
  qualityButton: {
    flex: 1,
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.xs,
    borderRadius: BorderRadius.sm,
    backgroundColor: Colors.neutral200,
    borderWidth: 1,
    borderColor: Colors.neutral300,
    alignItems: 'center',
  },
  qualityButtonText: {
    fontSize: Typography.fontSize.bodySmall,
    color: Colors.neutral700,
  },
  patternCard: {
    width: '100%',
    marginBottom: Spacing.md,
  },
  patternButtons: {
    flexDirection: 'row',
    gap: Spacing.sm,
    marginTop: Spacing.sm,
  },
  patternButton: {
    flex: 1,
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.xs,
    borderRadius: BorderRadius.sm,
    backgroundColor: Colors.neutral200,
    borderWidth: 1,
    borderColor: Colors.neutral300,
    alignItems: 'center',
  },
  patternButtonActive: {
    backgroundColor: Colors.primaryLight,
    borderColor: Colors.primary,
  },
  patternButtonText: {
    fontSize: Typography.fontSize.bodySmall,
    color: Colors.neutral700,
  },
  patternButtonTextActive: {
    color: Colors.primary,
    fontWeight: Typography.fontWeight.medium,
  },
  analyticsModalContainer: {
    flex: 1,
    backgroundColor: Colors.neutral100,
  },
  analyticsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.neutral200,
  },
  analyticsCloseText: {
    fontSize: Typography.fontSize.bodyLarge,
    color: Colors.primary,
    fontWeight: Typography.fontWeight.medium,
  },
  analyticsTitle: {
    fontSize: Typography.fontSize.h4,
    fontWeight: Typography.fontWeight.semibold,
    color: Colors.neutral900,
  },
});

export default FetalMovementCounter;