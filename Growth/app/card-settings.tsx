import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
  Switch,
  Animated,
  Dimensions,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Button, Card } from '../components/ui';
import { Colors, Typography, Spacing, BorderRadius } from '../constants/Theme';
import { CommonStyles } from '../constants/Styles';
import { CardConfig, CARD_CATEGORIES } from '../types/cardConfig';
import { cardConfigService } from '../services/cardConfigService';

const { width, height } = Dimensions.get('window');
const isIOS = Platform.OS === 'ios';
const isSmallScreen = height < 700;

export default function CardSettingsScreen() {
  const [cards, setCards] = useState<CardConfig[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [isLoading, setIsLoading] = useState(true);
  const [animatedValues] = useState(() => 
    new Array(20).fill(0).map(() => new Animated.Value(0))
  );

  useEffect(() => {
    loadCards();
  }, []);

  useEffect(() => {
    // 卡片进入动画
    const animations = animatedValues.map((anim, index) =>
      Animated.timing(anim, {
        toValue: 1,
        duration: 300,
        delay: index * 50,
        useNativeDriver: true,
      })
    );
    Animated.stagger(50, animations).start();
  }, [cards]);

  const loadCards = async () => {
    try {
      await cardConfigService.initialize();
      const allCards = cardConfigService.getCardConfigs();
      setCards(allCards);
    } catch (error) {
      console.error('Failed to load cards:', error);
      Alert.alert('错误', '加载卡片配置失败');
    } finally {
      setIsLoading(false);
    }
  };

  const filteredCards = selectedCategory === 'all' 
    ? cards 
    : cards.filter(card => card.category === selectedCategory);

  const handleToggleVisibility = async (cardId: string) => {
    try {
      const card = cards.find(c => c.id === cardId);
      if (card) {
        await cardConfigService.updateCardVisibility(cardId, !card.isVisible);
        setCards(prev => prev.map(c => 
          c.id === cardId ? { ...c, isVisible: !c.isVisible } : c
        ));
      }
    } catch (error) {
      console.error('Failed to update card visibility:', error);
      Alert.alert('错误', '更新卡片显示状态失败');
    }
  };

  const handleResetToDefault = () => {
    Alert.alert(
      '重置确认',
      '确定要重置为默认配置吗？这将清除所有自定义设置。',
      [
        { text: '取消', style: 'cancel' },
        {
          text: '确定',
          style: 'destructive',
          onPress: async () => {
            try {
              await cardConfigService.resetToDefault();
              await loadCards();
              Alert.alert('成功', '已重置为默认配置');
            } catch (error) {
              console.error('Failed to reset config:', error);
              Alert.alert('错误', '重置配置失败');
            }
          },
        },
      ]
    );
  };

  const handleShowAllCards = async () => {
    try {
      const updates = cards.map(card => ({ cardId: card.id, isVisible: true }));
      await cardConfigService.updateMultipleCardVisibility(updates);
      await loadCards();
    } catch (error) {
      console.error('Failed to show all cards:', error);
      Alert.alert('错误', '显示所有卡片失败');
    }
  };

  const handleHideAllCards = async () => {
    try {
      const updates = cards.map(card => ({ cardId: card.id, isVisible: false }));
      await cardConfigService.updateMultipleCardVisibility(updates);
      await loadCards();
    } catch (error) {
      console.error('Failed to hide all cards:', error);
      Alert.alert('错误', '隐藏所有卡片失败');
    }
  };

  const renderCardItem = (card: CardConfig, index: number) => {
    const animatedStyle = {
      opacity: animatedValues[index],
      transform: [
        {
          translateY: animatedValues[index].interpolate({
            inputRange: [0, 1],
            outputRange: [20, 0],
          }),
        },
      ],
    };

    return (
      <Animated.View key={card.id} style={[styles.cardItemContainer, animatedStyle]}>
        <View style={StyleSheet.flatten([styles.cardItem, !card.isVisible && styles.hiddenCard])}>
          <View style={styles.cardHeader}>
            <View style={styles.cardIconContainer}>
              <Text style={styles.cardIcon}>{card.icon}</Text>
            </View>
            <View style={styles.cardInfo}>
              <Text style={styles.cardTitle}>{card.title}</Text>
              <Text style={styles.cardDescription} numberOfLines={1}>{card.description}</Text>
              <View style={styles.cardMeta}>
                <Text style={styles.cardCategory}>
                  {CARD_CATEGORIES.find(cat => cat.id === card.category)?.name || card.category}
                </Text>
              </View>
            </View>
            <View style={styles.cardActions}>
              <Switch
                value={card.isVisible}
                onValueChange={() => handleToggleVisibility(card.id)}
                trackColor={{ false: Colors.neutral300, true: Colors.primaryLight }}
                thumbColor={card.isVisible ? Colors.primary : Colors.neutral400}
                ios_backgroundColor={Colors.neutral300}
              />
            </View>
          </View>
        </View>
      </Animated.View>
    );
  };

  if (isLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>🎨</Text>
          <Text style={CommonStyles.textBody}>加载中...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* 头部 */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.push('/(tabs)')} style={styles.backButton}>
          <Text style={styles.backIcon}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>卡片设置</Text>
        <View style={styles.headerSpacer} />
      </View>

      {/* 统计卡片 */}
      <View style={styles.statsSection}>
        <Card style={styles.statsCard}>
          <View style={styles.statsContainer}>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>{filteredCards.length}</Text>
              <Text style={styles.statLabel}>总计</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={[styles.statNumber, { color: Colors.success }]}>
                {filteredCards.filter(card => card.isVisible).length}
              </Text>
              <Text style={styles.statLabel}>显示</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={[styles.statNumber, { color: Colors.neutral500 }]}>
                {filteredCards.filter(card => !card.isVisible).length}
              </Text>
              <Text style={styles.statLabel}>隐藏</Text>
            </View>
          </View>
        </Card>
      </View>

      {/* 分类筛选 */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.categoryFilter}
        contentContainerStyle={styles.categoryFilterContent}
      >
        <TouchableOpacity
          style={[
            styles.categoryChip,
            selectedCategory === 'all' && styles.activeCategoryChip,
          ]}
          onPress={() => setSelectedCategory('all')}
        >
          <Text style={styles.categoryChipIcon}>📋</Text>
          <Text
            style={[
              styles.categoryChipText,
              selectedCategory === 'all' && styles.activeCategoryChipText,
            ]}
          >
            全部
          </Text>
        </TouchableOpacity>
        {CARD_CATEGORIES.map(category => (
          <TouchableOpacity
            key={category.id}
            style={[
              styles.categoryChip,
              selectedCategory === category.id && styles.activeCategoryChip,
            ]}
            onPress={() => setSelectedCategory(category.id)}
          >
            <Text style={styles.categoryChipIcon}>{category.icon}</Text>
            <Text
              style={[
                styles.categoryChipText,
                selectedCategory === category.id && styles.activeCategoryChipText,
              ]}
            >
              {category.name}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* 快捷操作 */}
      <View style={styles.quickActions}>
        <TouchableOpacity style={styles.quickActionButton} onPress={handleShowAllCards}>
          <Text style={styles.quickActionIcon}>👁️</Text>
          <Text style={styles.quickActionText}>全部显示</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.quickActionButton} onPress={handleHideAllCards}>
          <Text style={styles.quickActionIcon}>👁️‍🗨️</Text>
          <Text style={styles.quickActionText}>全部隐藏</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.quickActionButton} onPress={handleResetToDefault}>
          <Text style={styles.quickActionIcon}>🔄</Text>
          <Text style={styles.quickActionText}>重置</Text>
        </TouchableOpacity>
      </View>

      {/* 卡片列表 */}
      <ScrollView style={styles.cardList} showsVerticalScrollIndicator={false}>
        {filteredCards.map((card, index) => renderCardItem(card, index))}
        
        {filteredCards.length === 0 && (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyIcon}>📋</Text>
            <Text style={styles.emptyText}>该分类下暂无卡片</Text>
          </View>
        )}

        <View style={styles.bottomSpacer} />
      </ScrollView>

      {/* 底部提示 */}
      <View style={styles.tipContainer}>
        <Text style={styles.tipText}>
          💡 使用开关控制卡片在首页的显示状态
        </Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.neutral200,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  loadingText: {
    fontSize: isSmallScreen ? 36 : 48,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.pagePadding,
    paddingVertical: isSmallScreen ? Spacing.sm : Spacing.md,
    backgroundColor: Colors.neutral100,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: Colors.neutral300,
    ...Platform.select({
      ios: {
        shadowColor: Colors.neutral900,
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  backButton: {
    width: isSmallScreen ? 36 : 40,
    height: isSmallScreen ? 36 : 40,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: isSmallScreen ? 18 : 20,
    backgroundColor: Colors.neutral200,
  },
  backIcon: {
    fontSize: isSmallScreen ? 18 : 20,
    color: Colors.primary,
  },
  headerTitle: {
    flex: 1,
    textAlign: 'center',
    fontSize: isSmallScreen ? Typography.fontSize.h4 : Typography.fontSize.h3,
    fontWeight: Typography.fontWeight.bold,
    color: Colors.neutral800,
  },
  headerSpacer: {
    width: isSmallScreen ? 36 : 40,
  },
  statsSection: {
    paddingHorizontal: Spacing.pagePadding,
    paddingVertical: isSmallScreen ? 4 : Spacing.xs,
  },
  statsCard: {
    backgroundColor: Colors.neutral100,
    paddingVertical: isSmallScreen ? 8 : 12,
  },
  statsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    minHeight: isSmallScreen ? 32 : 40,
  },
  statItem: {
    alignItems: 'center',
    gap: 1,
  },
  statNumber: {
    fontSize: isSmallScreen ? Typography.fontSize.h4 : Typography.fontSize.h3,
    fontWeight: Typography.fontWeight.bold,
    color: Colors.neutral800,
  },
  statLabel: {
    fontSize: Typography.fontSize.caption,
    color: Colors.neutral600,
  },
  statDivider: {
    width: StyleSheet.hairlineWidth,
    height: isSmallScreen ? 20 : 24,
    backgroundColor: Colors.neutral300,
  },
  categoryFilter: {
    backgroundColor: Colors.neutral100,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: Colors.neutral300,
  },
  categoryFilterContent: {
    paddingHorizontal: Spacing.pagePadding,
    paddingVertical: isSmallScreen ? 6 : Spacing.sm,
    gap: Spacing.xs,
  },
  categoryChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: isSmallScreen ? 8 : Spacing.sm,
    paddingVertical: isSmallScreen ? 4 : 6,
    backgroundColor: Colors.neutral200,
    borderRadius: BorderRadius.full,
    gap: 3,
    minHeight: isSmallScreen ? 28 : 32,
    minWidth: isSmallScreen ? 60 : 70, // 确保所有标签有一致的最小宽度
    justifyContent: 'center',
  },
  activeCategoryChip: {
    backgroundColor: Colors.primary,
    ...Platform.select({
      ios: {
        shadowColor: Colors.primary,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
      },
      android: {
        elevation: 3,
      },
    }),
  },
  categoryChipIcon: {
    fontSize: isSmallScreen ? 14 : 16,
  },
  categoryChipText: {
    fontSize: isSmallScreen ? Typography.fontSize.caption : Typography.fontSize.bodySmall,
    color: Colors.neutral700,
    fontWeight: Typography.fontWeight.medium,
  },
  activeCategoryChipText: {
    color: Colors.neutral100,
  },
  quickActions: {
    flexDirection: 'row',
    paddingHorizontal: Spacing.pagePadding,
    paddingVertical: isSmallScreen ? 6 : Spacing.sm,
    gap: Spacing.xs,
    backgroundColor: Colors.neutral100,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: Colors.neutral300,
  },
  quickActionButton: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: isSmallScreen ? 4 : 6,
    backgroundColor: Colors.neutral200,
    borderRadius: BorderRadius.sm,
    gap: 1,
    minHeight: isSmallScreen ? 36 : 44,
    justifyContent: 'center',
  },
  quickActionIcon: {
    fontSize: isSmallScreen ? 16 : 18,
  },
  quickActionText: {
    fontSize: Typography.fontSize.caption,
    color: Colors.neutral700,
    fontWeight: Typography.fontWeight.medium,
  },
  cardList: {
    flex: 1,
    paddingHorizontal: Spacing.pagePadding,
  },
  cardItemContainer: {
    marginTop: isSmallScreen ? Spacing.sm : Spacing.md,
  },
  cardItem: {
    backgroundColor: Colors.neutral100,
    paddingVertical: isSmallScreen ? 8 : 12,
    paddingHorizontal: isSmallScreen ? 12 : 16,
    borderRadius: BorderRadius.md,
    ...Platform.select({
      ios: {
        shadowColor: Colors.neutral900,
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
      },
      android: {
        elevation: 1,
      },
    }),
  },
  hiddenCard: {
    opacity: 0.6,
    backgroundColor: Colors.neutral200,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: isSmallScreen ? Spacing.sm : Spacing.md,
    minHeight: isSmallScreen ? 44 : 52,
  },
  cardIconContainer: {
    width: isSmallScreen ? 36 : 44,
    height: isSmallScreen ? 36 : 44,
    borderRadius: isSmallScreen ? 18 : 22,
    backgroundColor: Colors.primaryLight,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardIcon: {
    fontSize: isSmallScreen ? 18 : 22,
  },
  cardInfo: {
    flex: 1,
    gap: 1,
    justifyContent: 'center',
  },
  cardTitle: {
    fontSize: isSmallScreen ? Typography.fontSize.bodySmall : Typography.fontSize.body,
    fontWeight: Typography.fontWeight.semibold,
    color: Colors.neutral800,
    lineHeight: isSmallScreen ? 16 : 18,
  },
  cardDescription: {
    fontSize: Typography.fontSize.caption,
    color: Colors.neutral600,
    lineHeight: isSmallScreen ? 14 : 16,
  },
  cardMeta: {
    flexDirection: 'row',
    gap: Spacing.xs,
    marginTop: 2,
  },
  cardCategory: {
    fontSize: Typography.fontSize.overline,
    color: Colors.primary,
    backgroundColor: Colors.primaryLight,
    paddingHorizontal: 4,
    paddingVertical: 1,
    borderRadius: 3,
  },
  cardOrder: {
    fontSize: Typography.fontSize.overline,
    color: Colors.neutral500,
  },
  cardActions: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyContainer: {
    alignItems: 'center',
    paddingVertical: isSmallScreen ? Spacing.lg : Spacing.xxl,
    gap: Spacing.sm,
  },
  emptyIcon: {
    fontSize: isSmallScreen ? 36 : 48,
    opacity: 0.5,
  },
  emptyText: {
    fontSize: Typography.fontSize.bodySmall,
    color: Colors.neutral500,
  },
  bottomSpacer: {
    height: isSmallScreen ? Spacing.md : Spacing.lg,
  },
  tipContainer: {
    paddingHorizontal: Spacing.pagePadding,
    paddingVertical: isSmallScreen ? Spacing.sm : Spacing.md,
    backgroundColor: Colors.neutral100,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: Colors.neutral300,
    ...Platform.select({
      ios: {
        paddingBottom: isSmallScreen ? Spacing.sm + 10 : Spacing.md + 10, // 为iOS底部安全区域预留空间
      },
    }),
  },
  tipText: {
    fontSize: Typography.fontSize.overline,
    color: Colors.neutral500,
    textAlign: 'center',
    lineHeight: 14,
  },
});