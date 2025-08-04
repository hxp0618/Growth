import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Animated,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Colors, Typography, Spacing } from '../constants/Theme';
import { CommonStyles } from '../constants/Styles';

const { width, height } = Dimensions.get('window');

export default function SplashScreen() {
  const logoScale = useRef(new Animated.Value(0.5)).current;
  const logoOpacity = useRef(new Animated.Value(0)).current;
  const titleOpacity = useRef(new Animated.Value(0)).current;
  const subtitleOpacity = useRef(new Animated.Value(0)).current;
  const progressWidth = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // 启动动画序列
    const animationSequence = Animated.sequence([
      // Logo 出现
      Animated.parallel([
        Animated.timing(logoOpacity, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.spring(logoScale, {
          toValue: 1,
          tension: 50,
          friction: 7,
          useNativeDriver: true,
        }),
      ]),
      // 标题出现
      Animated.timing(titleOpacity, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
      // 副标题出现
      Animated.timing(subtitleOpacity, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
      // 进度条动画
      Animated.timing(progressWidth, {
        toValue: 100,
        duration: 1500,
        useNativeDriver: false,
      }),
    ]);

    animationSequence.start(() => {
      // 动画完成后跳转到角色选择页面
      setTimeout(() => {
        router.replace('/(tabs)');
      }, 500);
    });
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        {/* Logo 区域 */}
        <Animated.View 
          style={[
            styles.logoContainer,
            {
              opacity: logoOpacity,
              transform: [{ scale: logoScale }],
            },
          ]}
        >
          <View style={styles.logo}>
            <Text style={styles.logoEmoji}>🤱</Text>
          </View>
        </Animated.View>

        {/* 标题 */}
        <Animated.View 
          style={[
            styles.titleContainer,
            { opacity: titleOpacity },
          ]}
        >
          <Text style={styles.title}>家有孕宝</Text>
          <Text style={styles.englishTitle}>Growth</Text>
        </Animated.View>

        {/* 副标题 */}
        <Animated.View 
          style={[
            styles.subtitleContainer,
            { opacity: subtitleOpacity },
          ]}
        >
          <Text style={styles.subtitle}>陪伴每一个美好时刻</Text>
        </Animated.View>

        {/* 加载进度条 */}
        <View style={styles.progressContainer}>
          <View style={styles.progressBar}>
            <Animated.View 
              style={[
                styles.progressFill,
                {
                  width: progressWidth.interpolate({
                    inputRange: [0, 100],
                    outputRange: ['0%', '100%'],
                  }),
                },
              ]}
            />
          </View>
        </View>
      </View>

      {/* 底部装饰 */}
      <View style={styles.decorationContainer}>
        <View style={styles.decoration}>
          <Text style={styles.decorationEmoji}>👶</Text>
          <Text style={styles.decorationEmoji}>❤️</Text>
          <Text style={styles.decorationEmoji}>👨‍👩‍👧‍👦</Text>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.neutral100,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: Spacing.xl,
  },
  logoContainer: {
    marginBottom: Spacing.xxl,
  },
  logo: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: Colors.primaryLight,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 8,
  },
  logoEmoji: {
    fontSize: 60,
  },
  titleContainer: {
    alignItems: 'center',
    marginBottom: Spacing.lg,
  },
  title: {
    fontSize: Typography.fontSize.h1,
    fontWeight: Typography.fontWeight.bold,
    color: Colors.primary,
    marginBottom: Spacing.xs,
  },
  englishTitle: {
    fontSize: Typography.fontSize.bodyLarge,
    fontWeight: Typography.fontWeight.medium,
    color: Colors.neutral600,
    letterSpacing: 2,
  },
  subtitleContainer: {
    marginBottom: Spacing.xxl,
  },
  subtitle: {
    fontSize: Typography.fontSize.bodyLarge,
    color: Colors.neutral600,
    textAlign: 'center',
  },
  progressContainer: {
    width: '80%',
    alignItems: 'center',
  },
  progressBar: {
    width: '100%',
    height: 4,
    backgroundColor: Colors.neutral200,
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: Colors.primary,
    borderRadius: 2,
  },
  decorationContainer: {
    paddingBottom: Spacing.xl,
    alignItems: 'center',
  },
  decoration: {
    flexDirection: 'row',
    gap: Spacing.lg,
  },
  decorationEmoji: {
    fontSize: 24,
    opacity: 0.6,
  },
});