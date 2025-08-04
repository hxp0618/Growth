import React from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Card } from '@/components/ui';
import { Colors, Typography, Spacing } from '@/constants/Theme';
import { CommonStyles } from '@/constants/Styles';

export default function ProfileScreen() {
  return (
    <SafeAreaView style={CommonStyles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={CommonStyles.textH2}>我的</Text>
        </View>

        {/* 用户信息卡片 */}
        <Card style={styles.profileCard} variant="pregnant">
          <View style={styles.profileHeader}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>👩</Text>
            </View>
            <View style={styles.profileInfo}>
              <Text style={CommonStyles.textH4}>小雨</Text>
              <Text style={CommonStyles.textBodySmall}>孕24周 • 准妈妈</Text>
              <Text style={CommonStyles.textBodySmall}>预产期：2025年5月15日</Text>
            </View>
            <TouchableOpacity style={styles.editButton}>
              <Text style={[CommonStyles.textBodySmall, { color: Colors.primary }]}>编辑</Text>
            </TouchableOpacity>
          </View>
          
          <View style={styles.statsContainer}>
            <View style={styles.statItem}>
              <Text style={CommonStyles.textH4}>168</Text>
              <Text style={CommonStyles.textCaption}>记录天数</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={CommonStyles.textH4}>4</Text>
              <Text style={CommonStyles.textCaption}>家庭成员</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={CommonStyles.textH4}>12</Text>
              <Text style={CommonStyles.textCaption}>产检次数</Text>
            </View>
          </View>
        </Card>

        {/* 健康档案 */}
        <Card style={styles.card}>
          <View style={styles.menuItem}>
            <View style={styles.menuIcon}>
              <Text>📋</Text>
            </View>
            <Text style={CommonStyles.textBody}>健康档案</Text>
            <Text style={styles.arrow}>›</Text>
          </View>
        </Card>

        {/* 家庭管理 */}
        <Card style={styles.card}>
          <View style={styles.menuItem}>
            <View style={styles.menuIcon}>
              <Text>👨‍👩‍👧‍👦</Text>
            </View>
            <Text style={CommonStyles.textBody}>家庭管理</Text>
            <Text style={styles.arrow}>›</Text>
          </View>
        </Card>

        {/* 设置选项 */}
        <Card style={styles.card}>
          <TouchableOpacity style={styles.menuItem}>
            <View style={styles.menuIcon}>
              <Text>🔔</Text>
            </View>
            <Text style={CommonStyles.textBody}>通知设置</Text>
            <Text style={styles.arrow}>›</Text>
          </TouchableOpacity>
          
          <View style={styles.divider} />
          
          <TouchableOpacity style={styles.menuItem}>
            <View style={styles.menuIcon}>
              <Text>🔒</Text>
            </View>
            <Text style={CommonStyles.textBody}>隐私设置</Text>
            <Text style={styles.arrow}>›</Text>
          </TouchableOpacity>
          
          <View style={styles.divider} />
          
          <TouchableOpacity style={styles.menuItem}>
            <View style={styles.menuIcon}>
              <Text>📱</Text>
            </View>
            <Text style={CommonStyles.textBody}>数据同步</Text>
            <Text style={styles.arrow}>›</Text>
          </TouchableOpacity>
        </Card>

        {/* 帮助与支持 */}
        <Card style={styles.card}>
          <TouchableOpacity style={styles.menuItem}>
            <View style={styles.menuIcon}>
              <Text>❓</Text>
            </View>
            <Text style={CommonStyles.textBody}>帮助中心</Text>
            <Text style={styles.arrow}>›</Text>
          </TouchableOpacity>
          
          <View style={styles.divider} />
          
          <TouchableOpacity style={styles.menuItem}>
            <View style={styles.menuIcon}>
              <Text>💬</Text>
            </View>
            <Text style={CommonStyles.textBody}>意见反馈</Text>
            <Text style={styles.arrow}>›</Text>
          </TouchableOpacity>
          
          <View style={styles.divider} />
          
          <TouchableOpacity style={styles.menuItem}>
            <View style={styles.menuIcon}>
              <Text>ℹ️</Text>
            </View>
            <Text style={CommonStyles.textBody}>关于我们</Text>
            <Text style={styles.arrow}>›</Text>
          </TouchableOpacity>
        </Card>

        {/* 版本信息 */}
        <View style={styles.versionInfo}>
          <Text style={[CommonStyles.textCaption, { color: Colors.neutral500 }]}>
            家有孕宝 v1.0.0
          </Text>
        </View>

        {/* 退出登录 */}
        <TouchableOpacity style={styles.logoutButton}>
          <Text style={[CommonStyles.textBody, { color: Colors.error }]}>退出登录</Text>
        </TouchableOpacity>
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
  profileCard: {
    marginBottom: Spacing.md,
  },
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.lg,
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: Colors.primaryLight,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Spacing.md,
  },
  avatarText: {
    fontSize: 30,
  },
  profileInfo: {
    flex: 1,
    gap: 4,
  },
  editButton: {
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
    backgroundColor: Colors.neutral200,
    borderRadius: 4,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingTop: Spacing.md,
    borderTopWidth: 1,
    borderTopColor: Colors.neutral200,
  },
  statItem: {
    alignItems: 'center',
    gap: 4,
  },
  statDivider: {
    width: 1,
    height: 40,
    backgroundColor: Colors.neutral200,
  },
  card: {
    marginBottom: Spacing.md,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: Spacing.sm,
  },
  menuIcon: {
    width: 32,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Spacing.md,
  },
  arrow: {
    marginLeft: 'auto',
    fontSize: 18,
    color: Colors.neutral400,
  },
  divider: {
    height: 1,
    backgroundColor: Colors.neutral200,
    marginVertical: Spacing.xs,
    marginLeft: 48,
  },
  versionInfo: {
    alignItems: 'center',
    paddingVertical: Spacing.md,
  },
  logoutButton: {
    alignItems: 'center',
    paddingVertical: Spacing.md,
    marginBottom: Spacing.xl,
  },
});