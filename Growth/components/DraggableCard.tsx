import React, { useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
  PanResponder,
  Dimensions,
  ViewStyle,
} from 'react-native';
import { Card } from './ui';
import { Colors, Spacing, BorderRadius } from '../constants/Theme';
import { CommonStyles } from '../constants/Styles';
import { CardConfig } from '../types/cardConfig';

const { width } = Dimensions.get('window');

interface DraggableCardProps {
  card: CardConfig;
  index: number;
  isEditing: boolean;
  onToggleVisibility: (cardId: string) => void;
  onDragStart: (index: number) => void;
  onDragMove: (gestureState: any) => void;
  onDragEnd: (fromIndex: number, toIndex: number) => void;
  children?: React.ReactNode;
}

export default function DraggableCard({
  card,
  index,
  isEditing,
  onToggleVisibility,
  onDragStart,
  onDragMove,
  onDragEnd,
  children,
}: DraggableCardProps) {
  const pan = useRef(new Animated.ValueXY()).current;
  const scale = useRef(new Animated.Value(1)).current;
  const opacity = useRef(new Animated.Value(card.isVisible ? 1 : 0.5)).current;

  const panResponder = PanResponder.create({
    onMoveShouldSetPanResponder: (_, gestureState) => {
      return isEditing && (Math.abs(gestureState.dx) > 5 || Math.abs(gestureState.dy) > 5);
    },
    onPanResponderGrant: () => {
      if (isEditing) {
        onDragStart(index);
        Animated.parallel([
          Animated.spring(scale, {
            toValue: 1.05,
            useNativeDriver: true,
          }),
          Animated.timing(opacity, {
            toValue: 0.8,
            duration: 200,
            useNativeDriver: true,
          }),
        ]).start();
      }
    },
    onPanResponderMove: (_, gestureState) => {
      if (isEditing) {
        pan.setValue({ x: gestureState.dx, y: gestureState.dy });
        onDragMove(gestureState);
      }
    },
    onPanResponderRelease: (_, gestureState) => {
      if (isEditing) {
        // 计算目标位置
        const cardHeight = 120; // 估算卡片高度
        const moveDistance = gestureState.dy;
        const targetIndex = Math.round(moveDistance / cardHeight);
        const newIndex = Math.max(0, Math.min(index + targetIndex, 20)); // 假设最多20个卡片

        onDragEnd(index, newIndex);

        // 重置动画
        Animated.parallel([
          Animated.spring(pan, {
            toValue: { x: 0, y: 0 },
            useNativeDriver: true,
          }),
          Animated.spring(scale, {
            toValue: 1,
            useNativeDriver: true,
          }),
          Animated.timing(opacity, {
            toValue: card.isVisible ? 1 : 0.5,
            duration: 200,
            useNativeDriver: true,
          }),
        ]).start();
      }
    },
  });

  const handleToggleVisibility = () => {
    onToggleVisibility(card.id);
    Animated.timing(opacity, {
      toValue: card.isVisible ? 0.5 : 1,
      duration: 300,
      useNativeDriver: true,
    }).start();
  };

  return (
    <Animated.View
      style={[
        styles.container,
        {
          transform: [
            { translateX: pan.x },
            { translateY: pan.y },
            { scale: scale },
          ],
          opacity: opacity,
          zIndex: isEditing ? 1000 : 1,
        },
      ]}
      {...(isEditing ? panResponder.panHandlers : {})}
    >
      <Card style={StyleSheet.flatten([styles.card, !card.isVisible && styles.hiddenCard])}>
        {isEditing && (
          <View style={styles.editingOverlay}>
            <View style={styles.editingHeader}>
              <View style={styles.dragHandle}>
                <View style={styles.dragLine} />
                <View style={styles.dragLine} />
                <View style={styles.dragLine} />
              </View>
              <TouchableOpacity
                style={[
                  styles.visibilityButton,
                  card.isVisible ? styles.visibleButton : styles.hiddenButton,
                ]}
                onPress={handleToggleVisibility}
              >
                <Text style={styles.visibilityIcon}>
                  {card.isVisible ? '👁️' : '👁️‍🗨️'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

        <View style={styles.cardHeader}>
          <Text style={styles.cardIcon}>{card.icon}</Text>
          <View style={styles.cardInfo}>
            <Text style={CommonStyles.textH4}>{card.title}</Text>
            <Text style={[CommonStyles.textBodySmall, { color: Colors.neutral500 }]}>
              {card.description}
            </Text>
          </View>
        </View>

        {!isEditing && children && (
          <View style={styles.cardContent}>
            {children}
          </View>
        )}

        {isEditing && (
          <View style={styles.editingInfo}>
            <Text style={[CommonStyles.textCaption, { color: Colors.neutral500 }]}>
              顺序: {card.order} | 分类: {getCategoryName(card.category)}
            </Text>
          </View>
        )}
      </Card>
    </Animated.View>
  );
}

function getCategoryName(category: string): string {
  const categoryMap: Record<string, string> = {
    health: '健康',
    family: '家庭',
    knowledge: '知识',
    tools: '工具',
    other: '其他',
  };
  return categoryMap[category] || category;
}

const styles = StyleSheet.create({
  container: {
    marginBottom: Spacing.md,
  },
  card: {
    position: 'relative',
  },
  hiddenCard: {
    backgroundColor: Colors.neutral100,
    borderColor: Colors.neutral300,
    borderWidth: 1,
    borderStyle: 'dashed',
  },
  editingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 10,
  },
  editingHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
    backgroundColor: 'rgba(0, 0, 0, 0.05)',
    borderTopLeftRadius: BorderRadius.md,
    borderTopRightRadius: BorderRadius.md,
  },
  dragHandle: {
    flexDirection: 'column',
    gap: 2,
  },
  dragLine: {
    width: 20,
    height: 2,
    backgroundColor: Colors.neutral400,
    borderRadius: 1,
  },
  visibilityButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  visibleButton: {
    backgroundColor: Colors.successLight,
  },
  hiddenButton: {
    backgroundColor: Colors.neutral300,
  },
  visibilityIcon: {
    fontSize: 16,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: Spacing.sm,
    marginBottom: Spacing.sm,
  },
  cardIcon: {
    fontSize: 24,
    marginRight: Spacing.sm,
  },
  cardInfo: {
    flex: 1,
  },
  cardContent: {
    marginTop: Spacing.sm,
  },
  editingInfo: {
    marginTop: Spacing.sm,
    paddingTop: Spacing.sm,
    borderTopWidth: 1,
    borderTopColor: Colors.neutral200,
  },
});