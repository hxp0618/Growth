import React from 'react';
import {
  TouchableOpacity,
  Text,
  View,
  StyleSheet,
  ViewStyle,
  TextStyle,
  ActivityIndicator,
} from 'react-native';
import { Colors, Typography, BorderRadius, ComponentSizes, Shadows } from '../../constants/Theme';

export interface ButtonProps {
  children: React.ReactNode;
  onPress?: () => void;
  variant?: 'primary' | 'secondary' | 'text' | 'outlined' | 'filled' | 'elevated';
  size?: 'small' | 'medium' | 'large';
  disabled?: boolean;
  loading?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
  color?: 'primary' | 'secondary' | 'success' | 'warning' | 'error';
  fullWidth?: boolean;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
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
  fullWidth = false,
  icon,
  iconPosition = 'left',
}) => {
  const getButtonStyle = (): ViewStyle => {
    const baseStyle: ViewStyle = {
      borderRadius: BorderRadius.lg,
      justifyContent: 'center',
      alignItems: 'center',
      flexDirection: 'row',
      overflow: 'hidden',
    };

    // 尺寸样式
    const sizeStyles: Record<string, ViewStyle> = {
      small: {
        paddingVertical: 10,
        paddingHorizontal: 20,
        minHeight: 40,
        borderRadius: BorderRadius.md,
      },
      medium: {
        paddingVertical: 14,
        paddingHorizontal: 28,
        minHeight: ComponentSizes.touchTarget + 4,
        borderRadius: BorderRadius.lg,
      },
      large: {
        paddingVertical: 18,
        paddingHorizontal: 36,
        minHeight: 56,
        borderRadius: BorderRadius.xl,
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
        ...Shadows.button,
      },
      secondary: {
        backgroundColor: 'transparent',
        borderWidth: 2,
        borderColor: colorMap[color],
      },
      outlined: {
        backgroundColor: 'transparent',
        borderWidth: 1.5,
        borderColor: colorMap[color],
      },
      filled: {
        backgroundColor: `${colorMap[color]}15`,
        borderWidth: 0,
      },
      elevated: {
        backgroundColor: Colors.neutral100,
        borderWidth: 1,
        borderColor: Colors.neutral300,
        ...Shadows.md,
      },
      text: {
        backgroundColor: 'transparent',
        borderWidth: 0,
      },
    };

    // 全宽样式
    const fullWidthStyle: ViewStyle = fullWidth ? {
      width: '100%',
    } : {};

    // 禁用状态
    const disabledStyle: ViewStyle = disabled || loading ? {
      opacity: 0.5,
      transform: [{ scale: 0.98 }],
    } : {};

    return {
      ...baseStyle,
      ...sizeStyles[size],
      ...variantStyles[variant],
      ...fullWidthStyle,
      ...disabledStyle,
    };
  };

  const getTextStyle = (): TextStyle => {
    const baseStyle: TextStyle = {
      fontWeight: Typography.fontWeight.semibold,
      textAlign: 'center',
    };

    // 尺寸对应的字体大小
    const sizeStyles: Record<string, TextStyle> = {
      small: {
        fontSize: Typography.fontSize.bodySmall,
        fontWeight: Typography.fontWeight.medium,
      },
      medium: {
        fontSize: Typography.fontSize.body,
        fontWeight: Typography.fontWeight.semibold,
      },
      large: {
        fontSize: Typography.fontSize.bodyLarge,
        fontWeight: Typography.fontWeight.semibold,
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
      outlined: {
        color: colorMap[color],
      },
      filled: {
        color: colorMap[color],
      },
      elevated: {
        color: Colors.neutral800,
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

  const renderContent = () => {
    const iconElement = icon && (
      <View style={[
        styles.iconContainer,
        iconPosition === 'right' && styles.iconRight
      ]}>
        {icon}
      </View>
    );

    const textElement = (
      <Text style={[getTextStyle(), textStyle]}>
        {children}
      </Text>
    );

    const loadingElement = loading && (
      <ActivityIndicator
        size="small"
        color={variant === 'primary' ? Colors.neutral100 : Colors.primary}
        style={styles.loadingIndicator}
      />
    );

    return (
      <>
        {loading && loadingElement}
        {!loading && iconPosition === 'left' && iconElement}
        {textElement}
        {!loading && iconPosition === 'right' && iconElement}
      </>
    );
  };

  return (
    <TouchableOpacity
      style={[getButtonStyle(), style]}
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.85}
    >
      {renderContent()}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  iconContainer: {
    marginRight: 8,
  },
  iconRight: {
    marginRight: 0,
    marginLeft: 8,
  },
  loadingIndicator: {
    marginRight: 8,
  },
});

export default Button;