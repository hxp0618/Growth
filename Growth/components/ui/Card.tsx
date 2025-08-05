import React from 'react';
import {
  View,
  StyleSheet,
  ViewStyle,
  TouchableOpacity,
} from 'react-native';
import { Colors, BorderRadius, Spacing, Shadows, ComponentSizes } from '../../constants/Theme';

export interface CardProps {
  children: React.ReactNode;
  style?: ViewStyle;
  onPress?: () => void;
  variant?: 'default' | 'pregnant' | 'partner' | 'grandparent' | 'family' | 'elevated' | 'outlined' | 'filled';
  shadow?: 'none' | 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'card' | 'floating';
  padding?: number;
  size?: 'compact' | 'default' | 'large';
  borderWidth?: number;
  borderColor?: string;
  backgroundColor?: string;
}

const Card: React.FC<CardProps> = ({
  children,
  style,
  onPress,
  variant = 'default',
  shadow = 'card',
  padding,
  size = 'default',
  borderWidth,
  borderColor,
  backgroundColor,
}) => {
  const getCardStyle = (): ViewStyle => {
    // 基础样式
    const baseStyle: ViewStyle = {
      backgroundColor: backgroundColor || Colors.neutral100,
      borderRadius: BorderRadius.lg,
      borderWidth: borderWidth || 1,
      borderColor: borderColor || Colors.neutral300,
      // 移除固定最小高度，让内容自适应
    };

    // 尺寸样式
    const sizeStyles: Record<string, ViewStyle> = {
      compact: {
        padding: padding || Spacing.md,
        borderRadius: BorderRadius.md,
        // 移除固定最小高度
      },
      default: {
        padding: padding || Spacing.cardPadding,
        borderRadius: BorderRadius.lg,
        // 移除固定最小高度
      },
      large: {
        padding: padding || Spacing.xl,
        borderRadius: BorderRadius.xl,
        // 移除固定最小高度
      },
    };

    // 阴影样式
    const shadowStyles = {
      none: Shadows.none,
      xs: Shadows.xs,
      sm: Shadows.sm,
      md: Shadows.md,
      lg: Shadows.lg,
      xl: Shadows.xl,
      card: Shadows.card,
      floating: Shadows.floating,
    };

    // 变体样式
    const variantStyles: Record<string, ViewStyle> = {
      default: {
        backgroundColor: backgroundColor || Colors.neutral100,
        borderColor: borderColor || Colors.neutral300,
      },
      elevated: {
        backgroundColor: backgroundColor || Colors.neutral100,
        borderWidth: 0,
        ...Shadows.md,
      },
      outlined: {
        backgroundColor: backgroundColor || 'transparent',
        borderWidth: borderWidth || 2,
        borderColor: borderColor || Colors.neutral400,
        ...Shadows.none,
      },
      filled: {
        backgroundColor: backgroundColor || Colors.neutral200,
        borderWidth: 0,
        ...Shadows.xs,
      },
      pregnant: {
        backgroundColor: backgroundColor || Colors.neutral100,
        borderLeftWidth: 4,
        borderLeftColor: Colors.pregnant,
        borderColor: borderColor || Colors.neutral300,
      },
      partner: {
        backgroundColor: backgroundColor || Colors.neutral100,
        borderLeftWidth: 4,
        borderLeftColor: Colors.partner,
        borderColor: borderColor || Colors.neutral300,
      },
      grandparent: {
        backgroundColor: backgroundColor || Colors.neutral100,
        borderLeftWidth: 4,
        borderLeftColor: Colors.grandparent,
        borderColor: borderColor || Colors.neutral300,
      },
      family: {
        backgroundColor: backgroundColor || Colors.neutral100,
        borderLeftWidth: 4,
        borderLeftColor: Colors.family,
        borderColor: borderColor || Colors.neutral300,
      },
    };

    return {
      ...baseStyle,
      ...sizeStyles[size],
      ...shadowStyles[shadow],
      ...variantStyles[variant],
    };
  };

  const cardStyle = getCardStyle();

  if (onPress) {
    return (
      <TouchableOpacity
        style={[cardStyle, style]}
        onPress={onPress}
        activeOpacity={0.85}
      >
        {children}
      </TouchableOpacity>
    );
  }

  return (
    <View style={[cardStyle, style]}>
      {children}
    </View>
  );
};

export default Card;