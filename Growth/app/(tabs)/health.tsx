import React from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Card, ProgressBar } from '@/components/ui';
import { Colors, Typography, Spacing } from '@/constants/Theme';
import { CommonStyles } from '@/constants/Styles';

export default function HealthScreen() {
  return (
    <SafeAreaView style={CommonStyles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={CommonStyles.textH2}>健康管理</Text>
        </View>

        {/* 本周数据概览 */}
        <Card style={styles.card}>
          <Text style={CommonStyles.textH4}>📊 本周数据概览</Text>
          <View style={styles.dataRow}>
            <Text style={CommonStyles.textBody}>体重: 65.2kg (+0.5kg)</Text>
          </View>
          <View style={styles.dataRow}>
            <Text style={CommonStyles.textBody}>血压: 120/80 mmHg</Text>
            <Text style={[CommonStyles.textBodySmall, { color: Colors.success }]}>✓</Text>
          </View>
          <View style={styles.dataRow}>
            <Text style={CommonStyles.textBody}>胎动: 平均 15次/小时</Text>
            <Text style={[CommonStyles.textBodySmall, { color: Colors.success }]}>✓</Text>
          </View>
        </Card>

        {/* 产检记录 */}
        <Card style={styles.card}>
          <Text style={CommonStyles.textH4}>📅 产检记录</Text>
          <View style={styles.appointmentInfo}>
            <Text style={CommonStyles.textBody}>下次产检: 2025-01-15 09:00</Text>
            <Text style={CommonStyles.textBodySmall}>北京妇产医院 - 李医生</Text>
          </View>
          <View style={styles.buttonRow}>
            <View style={styles.actionButton}>
              <Text style={[CommonStyles.textBodySmall, { color: Colors.primary }]}>设置提醒</Text>
            </View>
            <View style={styles.actionButton}>
              <Text style={[CommonStyles.textBodySmall, { color: Colors.primary }]}>查看历史</Text>
            </View>
          </View>
        </Card>

        {/* 营养管理 */}
        <Card style={styles.card}>
          <Text style={CommonStyles.textH4}>🍎 营养管理</Text>
          <View style={styles.nutritionInfo}>
            <Text style={CommonStyles.textBody}>今日摄入: 1850/2200 卡路里</Text>
            <ProgressBar 
              progress={84} 
              color={Colors.success}
              style={styles.progressBar}
            />
          </View>
          <View style={styles.nutritionStatus}>
            <View style={styles.statusItem}>
              <Text style={[CommonStyles.textBodySmall, { color: Colors.success }]}>蛋白质 ✓</Text>
            </View>
            <View style={styles.statusItem}>
              <Text style={[CommonStyles.textBodySmall, { color: Colors.warning }]}>钙质 ⚠️</Text>
            </View>
            <View style={styles.statusItem}>
              <Text style={[CommonStyles.textBodySmall, { color: Colors.success }]}>叶酸 ✓</Text>
            </View>
          </View>
          <View style={styles.actionButton}>
            <Text style={[CommonStyles.textBodySmall, { color: Colors.primary }]}>记录饮食</Text>
          </View>
        </Card>

        {/* 胎动记录 */}
        <Card style={styles.card}>
          <Text style={CommonStyles.textH4}>👶 胎动记录</Text>
          <View style={styles.fetalMovement}>
            <Text style={CommonStyles.textBody}>今日胎动: 2次 (目标3次)</Text>
            <ProgressBar 
              progress={67} 
              color={Colors.primary}
              style={styles.progressBar}
            />
          </View>
          <View style={styles.actionButton}>
            <Text style={[CommonStyles.textBodySmall, { color: Colors.primary }]}>开始计数</Text>
          </View>
        </Card>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
    paddingHorizontal: Spacing.pagePadding,
  },
  header: {
    paddingVertical: Spacing.lg,
  },
  card: {
    marginBottom: Spacing.md,
  },
  dataRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: Spacing.sm,
  },
  appointmentInfo: {
    marginTop: Spacing.sm,
  },
  buttonRow: {
    flexDirection: 'row',
    marginTop: Spacing.md,
    gap: Spacing.md,
  },
  actionButton: {
    paddingVertical: Spacing.xs,
    paddingHorizontal: Spacing.sm,
    borderRadius: 4,
    backgroundColor: Colors.neutral200,
    alignSelf: 'flex-start',
    marginTop: Spacing.sm,
  },
  nutritionInfo: {
    marginTop: Spacing.sm,
  },
  progressBar: {
    marginTop: Spacing.xs,
  },
  nutritionStatus: {
    flexDirection: 'row',
    marginTop: Spacing.sm,
    gap: Spacing.md,
  },
  statusItem: {
    flex: 1,
  },
  fetalMovement: {
    marginTop: Spacing.sm,
  },
});