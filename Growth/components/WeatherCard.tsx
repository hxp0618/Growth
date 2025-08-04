import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  ViewStyle,
} from 'react-native';
import { Card } from '@/components/ui';
import { Colors, Typography, Spacing } from '@/constants/Theme';
import { CommonStyles } from '@/constants/Styles';
import { weatherService, WeatherData, WeatherAdvice } from '@/services/weatherService';

interface WeatherCardProps {
  style?: ViewStyle;
}

export default function WeatherCard({ style }: WeatherCardProps) {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [advice, setAdvice] = useState<WeatherAdvice | null>(null);
  const [loading, setLoading] = useState(true);
  const [showAdvice, setShowAdvice] = useState(false);

  useEffect(() => {
    loadWeatherData();
  }, []);

  const loadWeatherData = async () => {
    try {
      setLoading(true);
      const weatherData = await weatherService.getWeatherData();
      if (weatherData) {
        setWeather(weatherData);
        const weatherAdvice = weatherService.getWeatherAdvice(weatherData);
        setAdvice(weatherAdvice);
      } else {
        Alert.alert('提示', '无法获取天气信息，请检查网络连接');
      }
    } catch (error) {
      console.error('加载天气数据失败:', error);
      Alert.alert('错误', '获取天气信息失败');
    } finally {
      setLoading(false);
    }
  };

  const refreshWeather = () => {
    loadWeatherData();
  };

  if (loading) {
    return (
      <Card style={style ? { ...styles.card, ...style } : styles.card}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={Colors.primary} />
          <Text style={[CommonStyles.textBodySmall, { marginTop: Spacing.sm }]}>
            获取天气信息中...
          </Text>
        </View>
      </Card>
    );
  }

  if (!weather || !advice) {
    return (
      <Card style={style ? { ...styles.card, ...style } : styles.card}>
        <View style={styles.errorContainer}>
          <Text style={styles.errorIcon}>🌤️</Text>
          <Text style={CommonStyles.textBodySmall}>暂无天气信息</Text>
          <TouchableOpacity style={styles.retryButton} onPress={refreshWeather}>
            <Text style={styles.retryText}>重试</Text>
          </TouchableOpacity>
        </View>
      </Card>
    );
  }

  return (
    <Card style={style ? { ...styles.card, ...style } : styles.card}>
      {/* 天气信息头部 */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Text style={CommonStyles.textH4}>🌤️ 今日天气</Text>
          <Text style={[CommonStyles.textCaption, { color: Colors.neutral500 }]}>
            {weather.city}
          </Text>
        </View>
        <TouchableOpacity style={styles.refreshButton} onPress={refreshWeather}>
          <Text style={styles.refreshIcon}>🔄</Text>
        </TouchableOpacity>
      </View>

      {/* 主要天气信息 */}
      <View style={styles.mainWeather}>
        <View style={styles.temperatureSection}>
          <Text style={styles.weatherIcon}>{weather.icon}</Text>
          <View style={styles.temperatureInfo}>
            <Text style={styles.temperature}>{weather.temperature}°</Text>
            <Text style={[CommonStyles.textBodySmall, { color: Colors.neutral600 }]}>
              体感 {weather.feelsLike}°
            </Text>
          </View>
        </View>
        <View style={styles.weatherDetails}>
          <Text style={CommonStyles.textBody}>{weather.description}</Text>
          <View style={styles.detailsRow}>
            <Text style={CommonStyles.textBodySmall}>湿度 {weather.humidity}%</Text>
            <Text style={CommonStyles.textBodySmall}>风速 {weather.windSpeed}km/h</Text>
          </View>
        </View>
      </View>

      {/* 生活建议切换按钮 */}
      <TouchableOpacity
        style={styles.adviceToggle}
        onPress={() => setShowAdvice(!showAdvice)}
      >
        <Text style={styles.adviceToggleText}>
          {showAdvice ? '收起建议' : '查看生活建议'} {showAdvice ? '▲' : '▼'}
        </Text>
      </TouchableOpacity>

      {/* 生活建议内容 */}
      {showAdvice && (
        <View style={styles.adviceContainer}>
          {/* 穿衣建议 */}
          <View style={styles.adviceItem}>
            <Text style={styles.adviceIcon}>{advice.icon}</Text>
            <View style={styles.adviceContent}>
              <Text style={[CommonStyles.textBodySmall, styles.adviceTitle]}>穿衣建议</Text>
              <Text style={CommonStyles.textBodySmall}>{advice.clothing}</Text>
            </View>
          </View>

          {/* 带伞提醒 */}
          {advice.umbrella && (
            <View style={styles.adviceItem}>
              <Text style={styles.adviceIcon}>☂️</Text>
              <View style={styles.adviceContent}>
                <Text style={[CommonStyles.textBodySmall, styles.adviceTitle]}>出行提醒</Text>
                <Text style={CommonStyles.textBodySmall}>今天有雨，记得带伞</Text>
              </View>
            </View>
          )}

          {/* 台风预警 */}
          {advice.typhoonWarning && (
            <View style={[styles.adviceItem, styles.warningItem]}>
              <Text style={styles.adviceIcon}>⚠️</Text>
              <View style={styles.adviceContent}>
                <Text style={[CommonStyles.textBodySmall, styles.warningTitle]}>天气预警</Text>
                <Text style={[CommonStyles.textBodySmall, { color: Colors.error }]}>
                  强风暴雨天气，建议减少外出
                </Text>
              </View>
            </View>
          )}

          {/* 健康提示 */}
          {advice.healthTips.length > 0 && (
            <View style={styles.healthTips}>
              <Text style={[CommonStyles.textBodySmall, styles.adviceTitle]}>💡 健康提示</Text>
              {advice.healthTips.map((tip, index) => (
                <Text key={index} style={[CommonStyles.textBodySmall, styles.healthTip]}>
                  • {tip}
                </Text>
              ))}
            </View>
          )}
        </View>
      )}
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    marginBottom: Spacing.md,
  },
  loadingContainer: {
    alignItems: 'center',
    paddingVertical: Spacing.lg,
  },
  errorContainer: {
    alignItems: 'center',
    paddingVertical: Spacing.lg,
  },
  errorIcon: {
    fontSize: 32,
    marginBottom: Spacing.sm,
  },
  retryButton: {
    marginTop: Spacing.sm,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
    backgroundColor: Colors.primary,
    borderRadius: 6,
  },
  retryText: {
    color: Colors.neutral100,
    fontSize: Typography.fontSize.bodySmall,
    fontWeight: Typography.fontWeight.medium,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: Spacing.md,
  },
  headerLeft: {
    flex: 1,
  },
  refreshButton: {
    padding: Spacing.xs,
  },
  refreshIcon: {
    fontSize: 16,
  },
  mainWeather: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  temperatureSection: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: Spacing.lg,
  },
  weatherIcon: {
    fontSize: 48,
    marginRight: Spacing.sm,
  },
  temperatureInfo: {
    alignItems: 'flex-start',
  },
  temperature: {
    fontSize: 32,
    fontWeight: Typography.fontWeight.bold,
    color: Colors.neutral800,
    lineHeight: 36,
  },
  weatherDetails: {
    flex: 1,
  },
  detailsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: Spacing.xs,
  },
  adviceToggle: {
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.md,
    backgroundColor: Colors.neutral100,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: Spacing.sm,
  },
  adviceToggleText: {
    fontSize: Typography.fontSize.bodySmall,
    fontWeight: Typography.fontWeight.medium,
    color: Colors.primary,
  },
  adviceContainer: {
    marginTop: Spacing.md,
    paddingTop: Spacing.md,
    borderTopWidth: 1,
    borderTopColor: Colors.neutral200,
  },
  adviceItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: Spacing.md,
  },
  warningItem: {
    backgroundColor: Colors.errorLight,
    padding: Spacing.sm,
    borderRadius: 8,
    borderLeftWidth: 3,
    borderLeftColor: Colors.error,
  },
  adviceIcon: {
    fontSize: 20,
    marginRight: Spacing.sm,
    marginTop: 2,
  },
  adviceContent: {
    flex: 1,
  },
  adviceTitle: {
    fontWeight: Typography.fontWeight.medium,
    color: Colors.neutral700,
    marginBottom: 2,
  },
  warningTitle: {
    fontWeight: Typography.fontWeight.medium,
    color: Colors.error,
    marginBottom: 2,
  },
  healthTips: {
    backgroundColor: Colors.infoLight,
    padding: Spacing.sm,
    borderRadius: 8,
    borderLeftWidth: 3,
    borderLeftColor: Colors.info,
  },
  healthTip: {
    marginTop: Spacing.xs,
    color: Colors.neutral700,
  },
});