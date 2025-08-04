import React, { useState } from 'react';
import {
  TextInput,
  View,
  Text,
  StyleSheet,
  ViewStyle,
  TextStyle,
  TextInputProps,
} from 'react-native';
import { Colors, Typography, BorderRadius, Spacing, ComponentSizes } from '../../constants/Theme';

export interface InputProps extends TextInputProps {
  label?: string;
  error?: string;
  helperText?: string;
  containerStyle?: ViewStyle;
  inputStyle?: TextStyle;
  labelStyle?: TextStyle;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

const Input: React.FC<InputProps> = ({
  label,
  error,
  helperText,
  containerStyle,
  inputStyle,
  labelStyle,
  leftIcon,
  rightIcon,
  ...textInputProps
}) => {
  const [isFocused, setIsFocused] = useState(false);

  const getInputContainerStyle = (): ViewStyle => {
    const baseStyle: ViewStyle = {
      borderWidth: 1,
      borderRadius: BorderRadius.md,
      paddingHorizontal: Spacing.md,
      minHeight: ComponentSizes.inputMinHeight,
      backgroundColor: Colors.neutral100,
      flexDirection: 'row',
      alignItems: 'center',
    };

    if (error) {
      return {
        ...baseStyle,
        borderColor: Colors.error,
      };
    }

    if (isFocused) {
      return {
        ...baseStyle,
        borderColor: Colors.primary,
        shadowColor: Colors.primary,
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.2,
        shadowRadius: 2,
        elevation: 2,
      };
    }

    return {
      ...baseStyle,
      borderColor: Colors.neutral300,
    };
  };

  const getInputStyle = (): TextStyle => {
    return {
      flex: 1,
      fontSize: Typography.fontSize.body,
      color: Colors.neutral800,
      paddingVertical: 12,
    };
  };

  const getLabelStyle = (): TextStyle => {
    return {
      fontSize: Typography.fontSize.bodySmall,
      fontWeight: Typography.fontWeight.medium,
      color: Colors.neutral700,
      marginBottom: Spacing.xs,
    };
  };

  const getHelperTextStyle = (): TextStyle => {
    return {
      fontSize: Typography.fontSize.caption,
      color: error ? Colors.error : Colors.neutral500,
      marginTop: Spacing.xs,
    };
  };

  return (
    <View style={containerStyle}>
      {label && (
        <Text style={[getLabelStyle(), labelStyle]}>
          {label}
        </Text>
      )}
      
      <View style={getInputContainerStyle()}>
        {leftIcon && (
          <View style={styles.iconContainer}>
            {leftIcon}
          </View>
        )}
        
        <TextInput
          style={[getInputStyle(), inputStyle]}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholderTextColor={Colors.neutral500}
          {...textInputProps}
        />
        
        {rightIcon && (
          <View style={styles.iconContainer}>
            {rightIcon}
          </View>
        )}
      </View>
      
      {(error || helperText) && (
        <Text style={getHelperTextStyle()}>
          {error || helperText}
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  iconContainer: {
    marginHorizontal: Spacing.xs,
  },
});

export default Input;