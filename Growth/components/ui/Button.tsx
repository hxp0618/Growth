import React from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ViewStyle,
  TextStyle,
  ActivityIndicator,
} from 'react-native';
import { Colors, Typography, BorderRadius, ComponentSizes } from '../../constants/Theme';

export interface ButtonProps {
  children: React.ReactNode;
  onPress?: () => void;
  variant?: 'primary' | 'secondary' | 'text';
  size?: 'small' | 'medium' | 'large';
  disabled?: boolean;
  loading?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
  color?: 'primary' | 'secondary' | 'success' | 'warning' | 'error';
}

const Button: React.FC<ButtonProps> = ({
  children,
  onPress,
  variant = 'primary',
  size = 'medium',
  disabled = false,
  loading = false,
  style,
  textStyle,
  color = 'primary',
}) => {
  const getButtonStyle = (): ViewStyle => {
    const baseStyle: ViewStyle = {
      borderRadius: BorderRadius.md,
      justifyContent: 'center',
      alignItems: 'center',
      flexDirection: 'row',
    };

    // 尺寸样式
    const sizeStyles: Record<string, ViewStyle> = {
      small: {
        paddingVertical: 8,
        paddingHorizontal: 16,
        minHeight: 36,
      },
      medium: {
        paddingVertical: 12,
        paddingHorizontal: 24,
        minHeight: ComponentSizes.touchTarget,
      },
      large: {
        paddingVertical: 16,
        paddingHorizontal: 32,
        minHeight: 52,
      },
    };

    // 颜色映射
    const colorMap = {
      primary: Colors.primary,
      secondary: Colors.secondary,
      success: Colors.success,
      warning: Colors.warning,
      error: Colors.error,
    };

    // 变体样式
    const variantStyles: Record<string, ViewStyle> = {
      primary: {
        backgroundColor: colorMap[color],
      },
      secondary: {
        backgroundColor: 'transparent',
        borderWidth: 1,
        borderColor: colorMap[color],
      },
      text: {
        backgroundColor: 'transparent',
      },
    };

    // 禁用状态
    const disabledStyle: ViewStyle = disabled || loading ? {
      opacity: 0.6,
    } : {};

    return {
      ...baseStyle,
      ...sizeStyles[size],
      ...variantStyles[variant],
      ...disabledStyle,
    };
  };

  const getTextStyle = (): TextStyle => {
    const baseStyle: TextStyle = {
      fontWeight: Typography.fontWeight.medium,
    };

    // 尺寸对应的字体大小
    const sizeStyles: Record<string, TextStyle> = {
      small: {
        fontSize: Typography.fontSize.bodySmall,
      },
      medium: {
        fontSize: Typography.fontSize.body,
      },
      large: {
        fontSize: Typography.fontSize.bodyLarge,
      },
    };

    // 颜色映射
    const colorMap = {
      primary: Colors.primary,
      secondary: Colors.secondary,
      success: Colors.success,
      warning: Colors.warning,
      error: Colors.error,
    };

    // 变体对应的文字颜色
    const variantStyles: Record<string, TextStyle> = {
      primary: {
        color: Colors.neutral100,
      },
      secondary: {
        color: colorMap[color],
      },
      text: {
        color: colorMap[color],
      },
    };

    return {
      ...baseStyle,
      ...sizeStyles[size],
      ...variantStyles[variant],
    };
  };

  return (
    <TouchableOpacity
      style={[getButtonStyle(), style]}
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.8}
    >
      {loading && (
        <ActivityIndicator
          size="small"
          color={variant === 'primary' ? Colors.neutral100 : Colors.primary}
          style={{ marginRight: 8 }}
        />
      )}
      <Text style={[getTextStyle(), textStyle]}>
        {children}
      </Text>
    </TouchableOpacity>
  );
};

export default Button;