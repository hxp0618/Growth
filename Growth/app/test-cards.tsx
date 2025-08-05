import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Colors, Spacing } from '../constants/Theme';
import { CommonStyles } from '../constants/Styles';
import { CardConfig } from '../types/cardConfig';
import { cardConfigService } from '../services/cardConfigService';

export default function TestCardsScreen() {
  const [allCards, setAllCards] = useState<CardConfig[]>([]);
  const [visibleCards, setVisibleCards] = useState<CardConfig[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    initializeTest();
  }, []);

  const initializeTest = async () => {
    try {
      console.log('Starting card service initialization...');
      await cardConfigService.initialize();
      
      const all = cardConfigService.getCardConfigs();
      const visible = cardConfigService.getVisibleCards();
      
      console.log('All cards:', all.length);
      console.log('Visible cards:', visible.length);
      
      setAllCards(all);
      setVisibleCards(visible);
    } catch (error) {
      console.error('Test initialization failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleCardVisibility = async (cardId: string) => {
    try {
      const card = allCards.find(c => c.id === cardId);
      if (card) {
        await cardConfigService.updateCardVisibility(cardId, !card.isVisible);
        // 重新加载数据
        await initializeTest();
      }
    } catch (error) {
      console.error('Failed to toggle visibility:', error);
    }
  };

  if (isLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.center}>
          <Text style={CommonStyles.textBody}>加载中...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Text style={styles.backText}>← 返回</Text>
        </TouchableOpacity>
        <Text style={CommonStyles.textH3}>卡片测试页面</Text>
      </View>

      <View style={styles.stats}>
        <Text style={CommonStyles.textBody}>
          总卡片数: {allCards.length} | 可见: {visibleCards.length} | 隐藏: {allCards.length - visibleCards.length}
        </Text>
      </View>

      <ScrollView style={styles.scrollView}>
        <Text style={CommonStyles.textH4}>所有卡片配置:</Text>
        {allCards.map((card, index) => (
          <View key={card.id} style={[styles.cardItem, card.isVisible ? styles.visibleCard : styles.hiddenCard]}>
            <View style={styles.cardInfo}>
              <Text style={styles.cardIcon}>{card.icon}</Text>
              <View style={styles.cardDetails}>
                <Text style={CommonStyles.textBody}>{card.title}</Text>
                <Text style={CommonStyles.textBodySmall}>{card.description}</Text>
                <Text style={CommonStyles.textCaption}>
                  ID: {card.id} | 顺序: {card.order} | 分类: {card.category}
                </Text>
              </View>
            </View>
            <TouchableOpacity
              style={[styles.toggleButton, card.isVisible ? styles.visibleButton : styles.hiddenButton]}
              onPress={() => toggleCardVisibility(card.id)}
            >
              <Text style={styles.toggleText}>
                {card.isVisible ? '隐藏' : '显示'}
              </Text>
            </TouchableOpacity>
          </View>
        ))}

        <View style={styles.actions}>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => router.push('/(tabs)')}
          >
            <Text style={styles.actionText}>查看首页效果</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.neutral100,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.pagePadding,
    paddingVertical: Spacing.md,
    backgroundColor: Colors.neutral200,
    gap: Spacing.md,
  },
  backButton: {
    paddingVertical: Spacing.xs,
    paddingHorizontal: Spacing.sm,
  },
  backText: {
    color: Colors.primary,
    fontSize: 16,
  },
  stats: {
    paddingHorizontal: Spacing.pagePadding,
    paddingVertical: Spacing.md,
    backgroundColor: Colors.neutral200,
    borderBottomWidth: 1,
    borderBottomColor: Colors.neutral300,
  },
  scrollView: {
    flex: 1,
    paddingHorizontal: Spacing.pagePadding,
    paddingTop: Spacing.md,
  },
  cardItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.md,
    marginBottom: Spacing.sm,
    borderRadius: 8,
    borderWidth: 1,
  },
  visibleCard: {
    backgroundColor: Colors.successLight,
    borderColor: Colors.success,
  },
  hiddenCard: {
    backgroundColor: Colors.neutral200,
    borderColor: Colors.neutral400,
    opacity: 0.7,
  },
  cardInfo: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  cardIcon: {
    fontSize: 24,
  },
  cardDetails: {
    flex: 1,
    gap: 2,
  },
  toggleButton: {
    paddingVertical: Spacing.xs,
    paddingHorizontal: Spacing.sm,
    borderRadius: 4,
    minWidth: 60,
    alignItems: 'center',
  },
  visibleButton: {
    backgroundColor: Colors.warning,
  },
  hiddenButton: {
    backgroundColor: Colors.primary,
  },
  toggleText: {
    color: Colors.neutral100,
    fontSize: 12,
    fontWeight: '500',
  },
  actions: {
    paddingVertical: Spacing.xl,
    alignItems: 'center',
  },
  actionButton: {
    backgroundColor: Colors.primary,
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.xl,
    borderRadius: 8,
  },
  actionText: {
    color: Colors.neutral100,
    fontWeight: '500',
  },
});