import React from 'react';
import {
  View,
  StyleSheet,
  ViewStyle,
  TouchableOpacity,
} from 'react-native';
import { Colors, BorderRadius, Spacing, Shadows } from '../../constants/Theme';

export interface CardProps {
  children: React.ReactNode;
  style?: ViewStyle;
  onPress?: () => void;
  variant?: 'default' | 'pregnant' | 'partner' | 'grandparent' | 'family';
  shadow?: 'none' | 'sm' | 'md' | 'lg' | 'xl';
  padding?: number;
}

const Card: React.FC<CardProps> = ({
  children,
  style,
  onPress,
  variant = 'default',
  shadow = 'sm',
  padding = Spacing.cardPadding,
}) => {
  const getCardStyle = (): ViewStyle => {
    const baseStyle: ViewStyle = {
      backgroundColor: Colors.neutral100,
      borderRadius: BorderRadius.lg,
      padding,
      borderWidth: 1,
      borderColor: Colors.neutral200,
    };

    // 阴影样式
    const shadowStyles = {
      none: {},
      sm: Shadows.sm,
      md: Shadows.md,
      lg: Shadows.lg,
      xl: Shadows.xl,
    };

    // 角色变体样式
    const variantStyles: Record<string, ViewStyle> = {
      default: {},
      pregnant: {
        borderLeftWidth: 4,
        borderLeftColor: Colors.pregnant,
      },
      partner: {
        borderLeftWidth: 4,
        borderLeftColor: Colors.partner,
      },
      grandparent: {
        borderLeftWidth: 4,
        borderLeftColor: Colors.grandparent,
      },
      family: {
        borderLeftWidth: 4,
        borderLeftColor: Colors.family,
      },
    };

    return {
      ...baseStyle,
      ...shadowStyles[shadow],
      ...variantStyles[variant],
    };
  };

  if (onPress) {
    return (
      <TouchableOpacity
        style={[getCardStyle(), style]}
        onPress={onPress}
        activeOpacity={0.8}
      >
        {children}
      </TouchableOpacity>
    );
  }

  return (
    <View style={[getCardStyle(), style]}>
      {children}
    </View>
  );
};

export default Card;