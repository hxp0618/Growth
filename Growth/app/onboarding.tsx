import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  Animated,
  PanResponder,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Button } from '../components/ui';
import { Colors, Typography, Spacing, BorderRadius } from '../constants/Theme';
import { CommonStyles } from '../constants/Styles';

const { width, height } = Dimensions.get('window');

interface OnboardingStep {
  id: number;
  title: string;
  subtitle: string;
  description: string;
  emoji: string;
  backgroundColor: string;
}

const onboardingSteps: OnboardingStep[] = [
  {
    id: 1,
    title: '欢迎来到家有孕宝',
    subtitle: '陪伴每一个美好时刻',
    description: '专为孕期家庭打造的全方位陪伴应用，让爱与关怀无处不在',
    emoji: '🤱',
    backgroundColor: Colors.primaryLight,
  },
  {
    id: 2,
    title: '记录孕期点滴',
    subtitle: '珍藏美好回忆',
    description: '胎动记录、情绪日记、成长相册，每一个瞬间都值得纪念',
    emoji: '📝',
    backgroundColor: Colors.successLight,
  },
  {
    id: 3,
    title: '家庭协作共享',
    subtitle: '爱的力量更强大',
    description: '家人共同参与，分享任务，一起迎接新生命的到来',
    emoji: '👨‍👩‍👧‍👦',
    backgroundColor: Colors.warningLight,
  },
  {
    id: 4,
    title: '专业指导建议',
    subtitle: '科学孕育更安心',
    description: '营养指导、产检提醒、健康建议，专业知识伴您左右',
    emoji: '👩‍⚕️',
    backgroundColor: Colors.infoLight,
  },
];

export default function OnboardingScreen() {
  const [currentStep, setCurrentStep] = useState(0);
  const scrollX = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(0)).current;
  const fadeAnim = useRef(new Animated.Value(1)).current;

  const panResponder = PanResponder.create({
    onMoveShouldSetPanResponder: (_, gestureState) => {
      return Math.abs(gestureState.dx) > Math.abs(gestureState.dy) && Math.abs(gestureState.dx) > 10;
    },
    onPanResponderMove: (_, gestureState) => {
      scrollX.setValue(-gestureState.dx);
    },
    onPanResponderRelease: (_, gestureState) => {
      const threshold = width * 0.3;
      
      if (gestureState.dx > threshold && currentStep > 0) {
        // 向右滑动，上一步
        goToPreviousStep();
      } else if (gestureState.dx < -threshold && currentStep < onboardingSteps.length - 1) {
        // 向左滑动，下一步
        goToNextStep();
      } else {
        // 回弹
        Animated.spring(scrollX, {
          toValue: 0,
          useNativeDriver: true,
        }).start();
      }
    },
  });

  const goToNextStep = () => {
    if (currentStep < onboardingSteps.length - 1) {
      animateTransition(() => {
        setCurrentStep(currentStep + 1);
      });
    }
  };

  const goToPreviousStep = () => {
    if (currentStep > 0) {
      animateTransition(() => {
        setCurrentStep(currentStep - 1);
      });
    }
  };

  const animateTransition = (callback: () => void) => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 50,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start(() => {
      callback();
      scrollX.setValue(0);
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();
    });
  };

  const handleGetStarted = () => {
    router.replace('/role-selection');
  };

  const handleSkip = () => {
    router.replace('/role-selection');
  };

  const currentStepData = onboardingSteps[currentStep];

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: currentStepData.backgroundColor }]}>
      {/* 跳过按钮 */}
      <View style={styles.topBar}>
        <TouchableOpacity onPress={handleSkip} style={styles.skipButton}>
          <Text style={[CommonStyles.textBodySmall, { color: Colors.neutral600 }]}>
            跳过
          </Text>
        </TouchableOpacity>
      </View>

      {/* 主要内容 */}
      <View style={styles.content} {...panResponder.panHandlers}>
        <Animated.View
          style={[
            styles.stepContent,
            {
              opacity: fadeAnim,
              transform: [
                { translateY: slideAnim },
                { translateX: scrollX },
              ],
            },
          ]}
        >
          {/* 图标 */}
          <View style={styles.iconContainer}>
            <Text style={styles.emoji}>{currentStepData.emoji}</Text>
          </View>

          {/* 文本内容 */}
          <View style={styles.textContainer}>
            <Text style={styles.title}>{currentStepData.title}</Text>
            <Text style={styles.subtitle}>{currentStepData.subtitle}</Text>
            <Text style={styles.description}>{currentStepData.description}</Text>
          </View>
        </Animated.View>
      </View>

      {/* 底部导航 */}
      <View style={styles.bottomContainer}>
        {/* 指示器 */}
        <View style={styles.indicators}>
          {onboardingSteps.map((_, index) => (
            <View
              key={index}
              style={[
                styles.indicator,
                {
                  backgroundColor: index === currentStep ? Colors.primary : Colors.neutral300,
                  width: index === currentStep ? 24 : 8,
                },
              ]}
            />
          ))}
        </View>

        {/* 导航按钮 */}
        <View style={styles.navigation}>
          {currentStep > 0 && (
            <TouchableOpacity onPress={goToPreviousStep} style={styles.navButton}>
              <Text style={[CommonStyles.textBody, { color: Colors.primary }]}>上一步</Text>
            </TouchableOpacity>
          )}
          
          <View style={styles.navButtonSpacer} />
          
          {currentStep < onboardingSteps.length - 1 ? (
            <TouchableOpacity onPress={goToNextStep} style={styles.navButton}>
              <Text style={[CommonStyles.textBody, { color: Colors.primary }]}>下一步</Text>
            </TouchableOpacity>
          ) : (
            <Button onPress={handleGetStarted} style={styles.getStartedButton}>
              开始使用
            </Button>
          )}
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    paddingHorizontal: Spacing.pagePadding,
    paddingTop: Spacing.md,
  },
  skipButton: {
    paddingVertical: Spacing.xs,
    paddingHorizontal: Spacing.sm,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: Spacing.pagePadding,
  },
  stepContent: {
    alignItems: 'center',
    width: '100%',
  },
  iconContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Spacing.xxl,
  },
  emoji: {
    fontSize: 60,
  },
  textContainer: {
    alignItems: 'center',
    paddingHorizontal: Spacing.lg,
  },
  title: {
    fontSize: Typography.fontSize.h1,
    fontWeight: Typography.fontWeight.bold,
    color: Colors.neutral800,
    textAlign: 'center',
    marginBottom: Spacing.sm,
  },
  subtitle: {
    fontSize: Typography.fontSize.bodyLarge,
    fontWeight: Typography.fontWeight.medium,
    color: Colors.neutral700,
    textAlign: 'center',
    marginBottom: Spacing.md,
  },
  description: {
    fontSize: Typography.fontSize.body,
    color: Colors.neutral600,
    textAlign: 'center',
    lineHeight: 24,
    paddingHorizontal: Spacing.md,
  },
  bottomContainer: {
    paddingHorizontal: Spacing.pagePadding,
    paddingBottom: Spacing.xl,
  },
  indicators: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Spacing.xl,
    gap: Spacing.xs,
  },
  indicator: {
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.neutral300,
  },
  navigation: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  navButton: {
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.lg,
  },
  navButtonSpacer: {
    flex: 1,
  },
  getStartedButton: {
    paddingHorizontal: Spacing.xl,
  },
});