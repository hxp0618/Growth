import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ViewStyle,
  TextStyle,
  Animated,
} from 'react-native';
import { Colors, BorderRadius, Typography, Spacing } from '../../constants/Theme';

export interface ProgressBarProps {
  progress: number; // 0-100
  height?: number;
  showLabel?: boolean;
  label?: string;
  color?: string;
  backgroundColor?: string;
  style?: ViewStyle;
  labelStyle?: TextStyle;
  animated?: boolean;
}

const ProgressBar: React.FC<ProgressBarProps> = ({
  progress,
  height = 8,
  showLabel = false,
  label,
  color = Colors.primary,
  backgroundColor = Colors.neutral200,
  style,
  labelStyle,
  animated = true,
}) => {
  const animatedValue = React.useRef(new Animated.Value(0)).current;
  const [displayProgress, setDisplayProgress] = React.useState(0);

  React.useEffect(() => {
    if (animated) {
      Animated.timing(animatedValue, {
        toValue: progress,
        duration: 1000,
        useNativeDriver: false,
      }).start();

      const listener = animatedValue.addListener(({ value }) => {
        setDisplayProgress(Math.round(value));
      });

      return () => {
        animatedValue.removeListener(listener);
      };
    } else {
      setDisplayProgress(progress);
    }
  }, [progress, animated]);

  const getProgressBarStyle = (): ViewStyle => {
    return {
      width: '100%',
      height,
      backgroundColor,
      borderRadius: BorderRadius.full,
      overflow: 'hidden',
    };
  };

  const getProgressFillStyle = (): ViewStyle => {
    const width = animated ? animatedValue : progress;
    
    return {
      height: '100%',
      backgroundColor: color,
      borderRadius: BorderRadius.full,
      width: animated 
        ? animatedValue.interpolate({
            inputRange: [0, 100],
            outputRange: ['0%', '100%'],
            extrapolate: 'clamp',
          })
        : `${Math.max(0, Math.min(100, progress))}%`,
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

  return (
    <View style={style}>
      {(showLabel || label) && (
        <View style={styles.labelContainer}>
          <Text style={[getLabelStyle(), labelStyle]}>
            {label || `进度 ${displayProgress}%`}
          </Text>
          {showLabel && (
            <Text style={[getLabelStyle(), labelStyle]}>
              {displayProgress}%
            </Text>
          )}
        </View>
      )}
      
      <View style={getProgressBarStyle()}>
        {animated ? (
          <Animated.View style={getProgressFillStyle()} />
        ) : (
          <View style={getProgressFillStyle()} />
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  labelContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.xs,
  },
});

export default ProgressBar;