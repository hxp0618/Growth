import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  FlatList,
  ViewStyle,
} from 'react-native';
import { Card } from '@/components/ui';
import { Colors, Typography, Spacing } from '@/constants/Theme';
import { CommonStyles } from '@/constants/Styles';
import { nutritionService, NutritionRecommendation, FoodItem } from '@/services/nutritionService';

interface NutritionGuideProps {
  pregnancyWeek?: number;
  style?: ViewStyle;
  variant?: 'default' | 'compact';
  size?: 'compact' | 'default' | 'large';
}

export default function NutritionGuide({
  pregnancyWeek = 24,
  style,
  variant = 'default',
  size = 'default'
}: NutritionGuideProps) {
  const [recommendation, setRecommendation] = useState<NutritionRecommendation | null>(null);
  const [activeTab, setActiveTab] = useState<'recommended' | 'limited' | 'forbidden'>('recommended');
  const [showSeasonalFoods, setShowSeasonalFoods] = useState(false);

  useEffect(() => {
    loadNutritionData();
  }, []);

  const loadNutritionData = () => {
    try {
      const data = nutritionService.getNutritionRecommendation(pregnancyWeek);
      setRecommendation(data);
    } catch (error) {
      console.error('加载营养数据失败:', error);
    }
  };

  const renderFoodItem = ({ item }: { item: FoodItem }) => (
    <View style={styles.foodItem}>
      <Text style={styles.foodIcon}>{item.icon}</Text>
      <View style={styles.foodContent}>
        <Text style={[CommonStyles.textBody, styles.foodName]}>{item.name}</Text>
        <Text style={[CommonStyles.textBodySmall, styles.foodReason]}>{item.reason}</Text>
        {item.limit && (
          <Text style={[CommonStyles.textCaption, styles.foodLimit]}>
            限量：{item.limit}
          </Text>
        )}
        {item.alternatives && item.alternatives.length > 0 && (
          <Text style={[CommonStyles.textCaption, styles.foodAlternatives]}>
            替代：{item.alternatives.join('、')}
          </Text>
        )}
      </View>
      <View style={[
        styles.statusIndicator,
        { backgroundColor: getStatusColor(item.status) }
      ]} />
    </View>
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'recommended':
        return Colors.success;
      case 'limited':
        return Colors.warning;
      case 'forbidden':
        return Colors.error;
      default:
        return Colors.neutral400;
    }
  };

  const getTabStyle = (tab: string) => [
    styles.tab,
    activeTab === tab && styles.activeTab
  ];

  const getTabTextStyle = (tab: string) => [
    styles.tabText,
    activeTab === tab && styles.activeTabText
  ];

  const getCurrentFoods = () => {
    if (!recommendation) return [];
    
    switch (activeTab) {
      case 'recommended':
        return recommendation.recommendedFoods;
      case 'limited':
        return recommendation.limitedFoods;
      case 'forbidden':
        return recommendation.forbiddenFoods;
      default:
        return [];
    }
  };

  const getTabTitle = () => {
    switch (activeTab) {
      case 'recommended':
        return '✅ 推荐食物';
      case 'limited':
        return '⚠️ 限量食物';
      case 'forbidden':
        return '❌ 避免食物';
      default:
        return '';
    }
  };

  if (!recommendation) {
    return (
      <Card
        style={style}
        variant="elevated"
        shadow="card"
        size={size}
      >
        <View style={styles.loadingContainer}>
          <Text style={CommonStyles.textBody}>加载营养指导中...</Text>
        </View>
      </Card>
    );
  }

  return (
    <Card
      style={style}
      variant="elevated"
      shadow="card"
      size={size}
    >
      {/* 头部 */}
      <View style={styles.header}>
        <Text style={CommonStyles.textH4}>🍎 今日饮食指导</Text>
        <Text style={[CommonStyles.textCaption, { color: Colors.neutral600 }]}>
          第{pregnancyWeek}周专属建议
        </Text>
      </View>

      {/* 标签页 */}
      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={getTabStyle('recommended')}
          onPress={() => setActiveTab('recommended')}
        >
          <Text style={getTabTextStyle('recommended')}>推荐</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={getTabStyle('limited')}
          onPress={() => setActiveTab('limited')}
        >
          <Text style={getTabTextStyle('limited')}>限量</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={getTabStyle('forbidden')}
          onPress={() => setActiveTab('forbidden')}
        >
          <Text style={getTabTextStyle('forbidden')}>避免</Text>
        </TouchableOpacity>
      </View>

      {/* 当前标签内容 */}
      <View style={styles.contentContainer}>
        <Text style={[CommonStyles.textBodySmall, styles.sectionTitle]}>
          {getTabTitle()}
        </Text>
        
        {getCurrentFoods().map((item) => (
          <View key={item.id} style={styles.foodItem}>
            <Text style={styles.foodIcon}>{item.icon}</Text>
            <View style={styles.foodContent}>
              <Text style={[CommonStyles.textBody, styles.foodName]}>{item.name}</Text>
              <Text style={[CommonStyles.textBodySmall, styles.foodReason]}>{item.reason}</Text>
              {item.limit && (
                <Text style={[CommonStyles.textCaption, styles.foodLimit]}>
                  限量：{item.limit}
                </Text>
              )}
              {item.alternatives && item.alternatives.length > 0 && (
                <Text style={[CommonStyles.textCaption, styles.foodAlternatives]}>
                  替代：{item.alternatives.join('、')}
                </Text>
              )}
            </View>
            <View style={[
              styles.statusIndicator,
              { backgroundColor: getStatusColor(item.status) }
            ]} />
          </View>
        ))}
      </View>

      {/* 应季食物推荐 */}
      <TouchableOpacity
        style={styles.seasonalToggle}
        onPress={() => setShowSeasonalFoods(!showSeasonalFoods)}
      >
        <Text style={styles.seasonalToggleText}>
          🌸 应季食物推荐 {showSeasonalFoods ? '▲' : '▼'}
        </Text>
      </TouchableOpacity>

      {showSeasonalFoods && (
        <View style={styles.seasonalContainer}>
          <Text style={[CommonStyles.textBodySmall, styles.sectionTitle]}>
            当季新鲜推荐
          </Text>
          {recommendation.seasonalRecommendations.map((item) => (
            <View key={item.id} style={styles.foodItem}>
              <Text style={styles.foodIcon}>{item.icon}</Text>
              <View style={styles.foodContent}>
                <Text style={[CommonStyles.textBody, styles.foodName]}>{item.name}</Text>
                <Text style={[CommonStyles.textBodySmall, styles.foodReason]}>{item.reason}</Text>
                {item.limit && (
                  <Text style={[CommonStyles.textCaption, styles.foodLimit]}>
                    限量：{item.limit}
                  </Text>
                )}
                {item.alternatives && item.alternatives.length > 0 && (
                  <Text style={[CommonStyles.textCaption, styles.foodAlternatives]}>
                    替代：{item.alternatives.join('、')}
                  </Text>
                )}
              </View>
              <View style={[
                styles.statusIndicator,
                { backgroundColor: getStatusColor(item.status) }
              ]} />
            </View>
          ))}
        </View>
      )}

      {/* 每日营养建议 */}
      <View style={styles.tipsContainer}>
        <Text style={[CommonStyles.textBodySmall, styles.sectionTitle]}>
          💡 今日营养建议
        </Text>
        {recommendation.dailyTips.map((tip, index) => (
          <Text key={index} style={[CommonStyles.textBodySmall, styles.tipItem]}>
            • {tip}
          </Text>
        ))}
      </View>

      {/* 快捷操作 */}
      <View style={styles.quickActions}>
        <TouchableOpacity style={styles.quickActionButton}>
          <Text style={styles.quickActionIcon}>📝</Text>
          <Text style={CommonStyles.textCaption}>记录饮食</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.quickActionButton}>
          <Text style={styles.quickActionIcon}>🛒</Text>
          <Text style={CommonStyles.textCaption}>购物清单</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.quickActionButton}>
          <Text style={styles.quickActionIcon}>📊</Text>
          <Text style={CommonStyles.textCaption}>营养分析</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.quickActionButton}>
          <Text style={styles.quickActionIcon}>👨‍⚕️</Text>
          <Text style={CommonStyles.textCaption}>咨询营养师</Text>
        </TouchableOpacity>
      </View>
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
    marginBottom: Spacing.md,
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: Colors.neutral100,
    borderRadius: 8,
    padding: 4,
    marginBottom: Spacing.md,
  },
  tab: {
    flex: 1,
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.xs,
    borderRadius: 6,
    alignItems: 'center',
  },
  activeTab: {
    backgroundColor: Colors.neutral100,
    shadowColor: Colors.neutral800,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  tabText: {
    fontSize: Typography.fontSize.bodySmall,
    color: Colors.neutral600,
    fontWeight: Typography.fontWeight.medium,
  },
  activeTabText: {
    color: Colors.primary,
    fontWeight: Typography.fontWeight.bold,
  },
  contentContainer: {
    marginBottom: Spacing.md,
  },
  sectionTitle: {
    fontWeight: Typography.fontWeight.medium,
    color: Colors.neutral700,
    marginBottom: Spacing.sm,
  },
  foodItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.xs,
    marginBottom: Spacing.xs,
    backgroundColor: Colors.neutral100,
    borderRadius: 8,
  },
  foodIcon: {
    fontSize: 24,
    marginRight: Spacing.sm,
  },
  foodContent: {
    flex: 1,
  },
  foodName: {
    fontWeight: Typography.fontWeight.medium,
    marginBottom: 2,
  },
  foodReason: {
    color: Colors.neutral600,
    marginBottom: 2,
  },
  foodLimit: {
    color: Colors.warning,
    fontStyle: 'italic',
  },
  foodAlternatives: {
    color: Colors.info,
    fontStyle: 'italic',
  },
  statusIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginLeft: Spacing.sm,
  },
  seasonalToggle: {
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.md,
    backgroundColor: Colors.successLight,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  seasonalToggleText: {
    fontSize: Typography.fontSize.bodySmall,
    fontWeight: Typography.fontWeight.medium,
    color: Colors.success,
  },
  seasonalContainer: {
    marginBottom: Spacing.md,
    paddingTop: Spacing.sm,
    borderTopWidth: 1,
    borderTopColor: Colors.neutral200,
  },
  tipsContainer: {
    backgroundColor: Colors.infoLight,
    padding: Spacing.md,
    borderRadius: 8,
    marginBottom: Spacing.md,
    borderLeftWidth: 3,
    borderLeftColor: Colors.info,
  },
  tipItem: {
    marginBottom: Spacing.xs,
    color: Colors.neutral700,
    lineHeight: 20,
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