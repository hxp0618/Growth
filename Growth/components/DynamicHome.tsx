import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  RefreshControl,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Colors, Spacing, Shadows, BorderRadius } from '../constants/Theme';
import { CommonStyles } from '../constants/Styles';
import { CardConfig } from '../types/cardConfig';
import { cardConfigService } from '../services/cardConfigService';

// 导入所有卡片组件
import WeatherCard from './WeatherCard';
import PregnancyCalendar from './PregnancyCalendar';
import NutritionGuide from './NutritionGuide';
import CheckupReminder from './CheckupReminder';
import { MoodDiary } from './MoodDiary';
import FetalMovementCounter from './FetalMovementCounter';
import { FamilyCollaboration } from './FamilyCollaboration';
import { Calendar } from './Calendar';
import { DeliveryBagChecklist } from './DeliveryBagChecklist';
import { EmergencyContact } from './EmergencyContact';
import { Card, GridLayout } from './ui';

interface DynamicHomeProps {
  userRole?: 'pregnant' | 'partner' | 'grandparent' | 'family';
  userName?: string;
}

export default function DynamicHome({ userRole = 'pregnant', userName = '小雨' }: DynamicHomeProps) {
  const [visibleCards, setVisibleCards] = useState<CardConfig[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    initializeCards();
  }, []);

  const initializeCards = async () => {
    try {
      await cardConfigService.initialize();
      const cards = cardConfigService.getVisibleCards();
      console.log('Loaded visible cards:', cards.length);
      setVisibleCards(cards);
    } catch (error) {
      console.error('Failed to initialize cards:', error);
      // 如果初始化失败，使用默认卡片的前几个作为备用
      const fallbackCards = cardConfigService.getCardConfigs().slice(0, 5);
      setVisibleCards(fallbackCards);
    } finally {
      setIsLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await initializeCards();
    setRefreshing(false);
  };

  // 判断卡片是否适合网格布局
  const isGridCard = (component: string) => {
    const gridComponents = [
      'QuickActions',
      'QuickNotification',
      'DailyTasks',
      'FetalMovementCounter',
      'EmergencyContact'
    ];
    return gridComponents.includes(component);
  };

  const renderCard = (cardConfig: CardConfig, isGrid = false) => {
    const { component, props = {} } = cardConfig;
    const cardStyle = isGrid ? styles.gridCard : styles.fullCard;

    try {
      switch (component) {
        case 'PregnancyCalendar':
          return <PregnancyCalendar key={cardConfig.id} {...props} style={cardStyle} />;
        
        case 'WeatherCard':
          return <WeatherCard key={cardConfig.id} {...props} style={cardStyle} />;
        
        case 'NutritionGuide':
          return <NutritionGuide key={cardConfig.id} {...props} style={cardStyle} />;
        
        case 'CheckupReminder':
          return <CheckupReminder key={cardConfig.id} {...props} style={cardStyle} />;
        
        case 'MoodDiary':
          return <MoodDiary key={cardConfig.id} {...props} style={cardStyle} />;
        
        case 'FetalMovementCounter':
          return (
            <Card
              key={cardConfig.id}
              style={cardStyle}
              variant="elevated"
              shadow="card"
              size={isGrid ? "compact" : "default"}
            >
              <View style={styles.cardHeader}>
                <Text style={styles.cardTitle}>👶 胎动记录</Text>
              </View>
              <FetalMovementCounter {...props} />
            </Card>
          );
        
        case 'FamilyCollaboration':
          return <FamilyCollaboration key={cardConfig.id} {...props} style={cardStyle} />;
        
        case 'Calendar':
          return (
            <Card
              key={cardConfig.id}
              style={cardStyle}
              variant="elevated"
              shadow="card"
              size={isGrid ? "compact" : "default"}
            >
              <View style={styles.cardHeader}>
                <Text style={styles.cardTitle}>📅 综合日历</Text>
              </View>
              <Calendar {...props} />
            </Card>
          );
        
        case 'DeliveryBagChecklist':
          return <DeliveryBagChecklist key={cardConfig.id} {...props} style={cardStyle} />;
        
        case 'EmergencyContact':
          return <EmergencyContact key={cardConfig.id} {...props} style={cardStyle} />;
        
        case 'DailyTasks':
          return renderDailyTasks(cardConfig, isGrid);
        
        case 'QuickNotification':
          return renderQuickNotification(cardConfig, isGrid);
        
        case 'FamilyActivity':
          return renderFamilyActivity(cardConfig, isGrid);
        
        case 'QuickActions':
          return renderQuickActions(cardConfig, isGrid);
        
        default:
          return (
            <Card
              key={cardConfig.id}
              style={cardStyle}
              variant="outlined"
              shadow="sm"
              size={isGrid ? "compact" : "default"}
            >
              <View style={styles.cardHeader}>
                <Text style={styles.cardTitle}>{cardConfig.icon} {cardConfig.title}</Text>
              </View>
              <Text style={CommonStyles.textBody}>{cardConfig.description}</Text>
              <Text style={CommonStyles.textCaption}>组件: {component}</Text>
            </Card>
          );
      }
    } catch (error) {
      console.error(`Error rendering card ${cardConfig.id}:`, error);
      return (
        <Card
          key={cardConfig.id}
          style={cardStyle}
          variant="outlined"
          shadow="sm"
          backgroundColor={Colors.errorLight}
          borderColor={Colors.error}
        >
          <View style={styles.cardHeader}>
            <Text style={[styles.cardTitle, { color: Colors.error }]}>❌ {cardConfig.title}</Text>
          </View>
          <Text style={CommonStyles.textBody}>卡片渲染出错</Text>
          <Text style={CommonStyles.textCaption}>组件: {component}</Text>
        </Card>
      );
    }
  };

  const renderDailyTasks = (cardConfig: CardConfig, isGrid = false) => (
    <Card
      key={cardConfig.id}
      style={isGrid ? styles.gridCard : styles.fullCard}
      variant="elevated"
      shadow="card"
      size={isGrid ? "compact" : "default"}
    >
      <View style={styles.cardHeader}>
        <Text style={styles.cardTitle}>📋 今日任务</Text>
      </View>
      
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
  );

  const renderQuickNotification = (cardConfig: CardConfig, isGrid = false) => (
    <Card
      key={cardConfig.id}
      style={isGrid ? styles.gridCard : styles.fullCard}
      variant="elevated"
      shadow="card"
      size={isGrid ? "compact" : "default"}
    >
      <View style={styles.cardHeader}>
        <Text style={styles.cardTitle}>🚨 一键通知</Text>
      </View>
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
  );

  const renderFamilyActivity = (cardConfig: CardConfig, isGrid = false) => (
    <Card
      key={cardConfig.id}
      style={isGrid ? styles.gridCard : styles.fullCard}
      variant="elevated"
      shadow="card"
      size={isGrid ? "compact" : "default"}
    >
      <View style={styles.cardHeader}>
        <Text style={styles.cardTitle}>👨‍👩‍👧‍👦 家庭动态</Text>
      </View>
      
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
  );

  const renderQuickActions = (cardConfig: CardConfig, isGrid = false) => (
    <Card
      key={cardConfig.id}
      style={isGrid ? styles.gridCard : styles.fullCard}
      variant="filled"
      shadow="sm"
      size={isGrid ? "compact" : "default"}
      backgroundColor={Colors.primaryLight + '20'}
    >
      <View style={styles.cardHeader}>
        <Text style={styles.cardTitle}>⚡ 快捷操作</Text>
      </View>
      <View style={styles.quickActionsGrid}>
        <TouchableOpacity style={styles.quickActionItem}>
          <Text style={styles.quickActionIcon}>👶</Text>
          <Text style={styles.quickActionText}>胎动记录</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.quickActionItem}>
          <Text style={styles.quickActionIcon}>📊</Text>
          <Text style={styles.quickActionText}>健康数据</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.quickActionItem}>
          <Text style={styles.quickActionIcon}>📚</Text>
          <Text style={styles.quickActionText}>孕期知识</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.quickActionItem}>
          <Text style={styles.quickActionIcon}>👨‍👩‍👧‍👦</Text>
          <Text style={styles.quickActionText}>家庭协作</Text>
        </TouchableOpacity>
      </View>
    </Card>
  );

  if (isLoading) {
    return (
      <SafeAreaView style={CommonStyles.container}>
        <View style={styles.loadingContainer}>
          <Text style={CommonStyles.textBody}>加载中...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={CommonStyles.container}>
      <ScrollView 
        style={styles.scrollView} 
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {/* 顶部问候 */}
        <View style={styles.header}>
          <View style={styles.greeting}>
            <Text style={CommonStyles.textH3}>👋 早安，{userName}</Text>
            <View style={styles.headerActions}>
              <TouchableOpacity style={styles.headerButton}>
                <Text style={styles.headerButtonText}>🔔</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={styles.headerButton}
                onPress={() => router.push('/card-settings')}
              >
                <Text style={styles.headerButtonText}>⚙️</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* 动态渲染卡片 */}
        {visibleCards.map((cardConfig) => renderCard(cardConfig, isGridCard(cardConfig.component)))}

        {/* 空状态 */}
        {visibleCards.length === 0 && (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyIcon}>📋</Text>
            <Text style={CommonStyles.textBody}>暂无显示的卡片</Text>
            <TouchableOpacity 
              style={styles.settingsButton}
              onPress={() => router.push('/card-settings')}
            >
              <Text style={[CommonStyles.textBodySmall, { color: Colors.primary }]}>
                去设置卡片
              </Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
    paddingHorizontal: Spacing.pagePadding,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    paddingVertical: Spacing.lg,
    marginBottom: Spacing.sm,
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
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: Colors.neutral200,
    justifyContent: 'center',
    alignItems: 'center',
    ...Shadows.sm,
  },
  headerButtonText: {
    fontSize: 16,
  },
  // 卡片样式
  fullCard: {
    marginBottom: Spacing.md,
  },
  gridCard: {
    marginBottom: Spacing.sm,
    flex: 1,
  },
  cardHeader: {
    marginBottom: Spacing.sm,
    paddingBottom: Spacing.xs,
    borderBottomWidth: 1,
    borderBottomColor: Colors.neutral200,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.neutral800,
  },
  // 任务相关样式
  taskItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: Spacing.sm,
    paddingVertical: Spacing.xs,
    paddingHorizontal: Spacing.sm,
    backgroundColor: Colors.neutral100,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    borderColor: Colors.neutral200,
  },
  taskIcon: {
    width: 32,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Spacing.sm,
    backgroundColor: Colors.neutral200,
    borderRadius: 16,
  },
  taskContent: {
    flex: 1,
    gap: 2,
  },
  taskStatus: {
    marginLeft: Spacing.sm,
  },
  statusDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  // 通知按钮样式
  notificationButtons: {
    flexDirection: 'row',
    marginTop: Spacing.md,
    gap: Spacing.sm,
  },
  notificationButton: {
    flex: 1,
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.xs,
    borderRadius: BorderRadius.md,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.neutral300,
  },
  notificationButtonText: {
    fontSize: 12,
    fontWeight: '500',
    color: Colors.neutral700,
  },
  // 活动相关样式
  activityItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginTop: Spacing.sm,
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.sm,
    backgroundColor: Colors.neutral100,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    borderColor: Colors.neutral200,
  },
  activityAvatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
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
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.md,
    backgroundColor: Colors.primaryLight + '30',
    borderRadius: BorderRadius.md,
    alignSelf: 'flex-start',
    borderWidth: 1,
    borderColor: Colors.primary + '30',
  },
  // 快捷操作样式
  quickActionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
    marginTop: Spacing.sm,
  },
  quickActionItem: {
    flex: 1,
    minWidth: '45%',
    aspectRatio: 1.5,
    backgroundColor: Colors.neutral100,
    borderRadius: BorderRadius.md,
    justifyContent: 'center',
    alignItems: 'center',
    gap: Spacing.xs,
    borderWidth: 1,
    borderColor: Colors.neutral300,
    ...Shadows.xs,
  },
  quickActionIcon: {
    fontSize: 20,
  },
  quickActionText: {
    fontSize: 11,
    fontWeight: '500',
    color: Colors.neutral700,
    textAlign: 'center',
  },
  // 空状态样式
  emptyContainer: {
    alignItems: 'center',
    paddingVertical: Spacing.xxl,
    gap: Spacing.md,
  },
  emptyIcon: {
    fontSize: 48,
    opacity: 0.5,
  },
  settingsButton: {
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.md,
    backgroundColor: Colors.primaryLight + '40',
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    borderColor: Colors.primary + '40',
  },
});