import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Card, ProgressBar, Button } from './ui';
import { Colors, Typography, Spacing } from '../constants/Theme';
import { CommonStyles } from '../constants/Styles';

type UserRole = 'pregnant' | 'partner' | 'grandparent' | 'family';

interface RoleBasedHomeProps {
  userRole: UserRole;
  userName: string;
}

const RoleBasedHome: React.FC<RoleBasedHomeProps> = ({ userRole, userName }) => {
  const renderPregnantHome = () => (
    <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
      {/* 孕妇主界面 - 已在index.tsx中实现 */}
      <Text style={CommonStyles.textH3}>👋 早安，{userName}</Text>
      {/* 这里可以复用index.tsx的内容 */}
    </ScrollView>
  );

  const renderPartnerHome = () => (
    <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <Text style={CommonStyles.textH3}>👋 早安，{userName}</Text>
        <View style={styles.headerActions}>
          <TouchableOpacity style={styles.headerButton}>
            <Text style={styles.headerButtonText}>🔔</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.headerButton}>
            <Text style={styles.headerButtonText}>⚙️</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* 小雨的孕期状态 */}
      <Card style={styles.card} variant="partner">
        <Text style={CommonStyles.textH4}>👩 小雨的孕期状态</Text>
        <View style={styles.statusRow}>
          <Text style={CommonStyles.textBody}>第24周 - 一切正常</Text>
          <Text style={styles.statusEmoji}>😊</Text>
        </View>
        <View style={styles.statusRow}>
          <Text style={CommonStyles.textBody}>今日胎动: 15次</Text>
          <Text style={[CommonStyles.textBodySmall, { color: Colors.success }]}>✓</Text>
        </View>
        <View style={styles.statusRow}>
          <Text style={CommonStyles.textBody}>心情: 开心</Text>
          <Text style={styles.statusEmoji}>😊</Text>
        </View>
        <TouchableOpacity style={styles.detailButton}>
          <Text style={[CommonStyles.textBodySmall, { color: Colors.primary }]}>查看详细</Text>
        </TouchableOpacity>
      </Card>

      {/* 我的任务 */}
      <Card style={styles.card}>
        <Text style={CommonStyles.textH4}>📋 我的任务 (2项待完成)</Text>
        
        <View style={styles.taskItem}>
          <View style={styles.taskIcon}>
            <Text>🛒</Text>
          </View>
          <View style={styles.taskContent}>
            <Text style={CommonStyles.textBody}>购买孕妇奶粉</Text>
            <View style={[styles.statusBadge, { backgroundColor: Colors.warningLight }]}>
              <Text style={[CommonStyles.textBodySmall, { color: Colors.warning }]}>进行中</Text>
            </View>
          </View>
        </View>

        <View style={styles.taskItem}>
          <View style={styles.taskIcon}>
            <Text>🚗</Text>
          </View>
          <View style={styles.taskContent}>
            <Text style={CommonStyles.textBody}>明天陪同产检</Text>
            <View style={[styles.statusBadge, { backgroundColor: Colors.infoLight }]}>
              <Text style={[CommonStyles.textBodySmall, { color: Colors.info }]}>待开始</Text>
            </View>
          </View>
        </View>

        <TouchableOpacity style={styles.detailButton}>
          <Text style={[CommonStyles.textBodySmall, { color: Colors.primary }]}>查看全部任务</Text>
        </TouchableOpacity>
      </Card>

      {/* 今日建议 */}
      <Card style={styles.card}>
        <Text style={CommonStyles.textH4}>💡 今日建议</Text>
        <View style={styles.suggestionList}>
          <Text style={CommonStyles.textBody}>• 提醒小雨按时服用叶酸</Text>
          <Text style={CommonStyles.textBody}>• 准备明天产检的相关资料</Text>
          <Text style={CommonStyles.textBody}>• 多陪小雨聊天，缓解孕期焦虑</Text>
        </View>
      </Card>

      {/* 学习角 */}
      <Card style={styles.card}>
        <Text style={CommonStyles.textH4}>📚 学习角</Text>
        <View style={styles.learningItem}>
          <Text style={CommonStyles.textBody}>"准爸爸必读：如何陪伴孕期"</Text>
          <TouchableOpacity style={styles.continueButton}>
            <Text style={[CommonStyles.textBodySmall, { color: Colors.primary }]}>继续学习</Text>
          </TouchableOpacity>
        </View>
      </Card>
    </ScrollView>
  );

  const renderGrandparentHome = () => (
    <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <Text style={CommonStyles.textH3}>👋 您好，{userName}</Text>
        <View style={styles.headerActions}>
          <TouchableOpacity style={styles.headerButton}>
            <Text style={styles.headerButtonText}>🔔</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.headerButton}>
            <Text style={styles.headerButtonText}>⚙️</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* 孙辈成长进度 */}
      <Card style={styles.card} variant="grandparent">
        <Text style={CommonStyles.textH4}>👶 孙辈成长进度</Text>
        <Text style={CommonStyles.textBody}>小雨怀孕第24周</Text>
        <View style={styles.statusRow}>
          <Text style={CommonStyles.textBody}>宝宝发育正常，一切顺利</Text>
          <Text style={[CommonStyles.textBodySmall, { color: Colors.success }]}>✓</Text>
        </View>
        <TouchableOpacity style={styles.detailButton}>
          <Text style={[CommonStyles.textBodySmall, { color: Colors.primary }]}>查看成长相册</Text>
        </TouchableOpacity>
      </Card>

      {/* 我的关怀 */}
      <Card style={styles.card}>
        <Text style={CommonStyles.textH4}>💝 我的关怀</Text>
        <Text style={CommonStyles.textBody}>今日已完成:</Text>
        <View style={styles.careList}>
          <View style={styles.careItem}>
            <Text style={[CommonStyles.textBodySmall, { color: Colors.success }]}>✓ 预约了下次产检</Text>
          </View>
          <View style={styles.careItem}>
            <Text style={[CommonStyles.textBodySmall, { color: Colors.success }]}>✓ 分享了营养食谱</Text>
          </View>
        </View>
        <TouchableOpacity style={styles.blessButton}>
          <Text style={[CommonStyles.textBodySmall, { color: Colors.primary }]}>发送祝福</Text>
        </TouchableOpacity>
      </Card>

      {/* 经验分享 */}
      <Card style={styles.card}>
        <Text style={CommonStyles.textH4}>📖 经验分享</Text>
        <View style={styles.experienceItem}>
          <Text style={CommonStyles.textBody}>"孕期营养搭配的小窍门"</Text>
          <Text style={CommonStyles.textBodySmall}>已有3位家庭成员查看</Text>
          <TouchableOpacity style={styles.shareButton}>
            <Text style={[CommonStyles.textBodySmall, { color: Colors.primary }]}>分享更多经验</Text>
          </TouchableOpacity>
        </View>
      </Card>

      {/* 家庭动态 */}
      <Card style={styles.card}>
        <Text style={CommonStyles.textH4}>🎉 家庭动态</Text>
        <View style={styles.activityList}>
          <Text style={CommonStyles.textBody}>小雨今天心情很好 😊</Text>
          <Text style={CommonStyles.textBody}>志明完成了购物任务</Text>
        </View>
        <TouchableOpacity style={styles.detailButton}>
          <Text style={[CommonStyles.textBodySmall, { color: Colors.primary }]}>查看更多</Text>
        </TouchableOpacity>
      </Card>
    </ScrollView>
  );

  const renderFamilyHome = () => (
    <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <Text style={CommonStyles.textH3}>👋 您好，{userName}</Text>
      </View>

      {/* 家庭概况 */}
      <Card style={styles.card} variant="family">
        <Text style={CommonStyles.textH4}>👨‍👩‍👧‍👦 家庭概况</Text>
        <Text style={CommonStyles.textBody}>小雨怀孕第24周，一切顺利</Text>
        <TouchableOpacity style={styles.detailButton}>
          <Text style={[CommonStyles.textBodySmall, { color: Colors.primary }]}>了解更多</Text>
        </TouchableOpacity>
      </Card>

      {/* 我可以帮助的 */}
      <Card style={styles.card}>
        <Text style={CommonStyles.textH4}>🤝 我可以帮助的</Text>
        <View style={styles.helpList}>
          <TouchableOpacity style={styles.helpItem}>
            <Text style={styles.helpEmoji}>🛒</Text>
            <Text style={CommonStyles.textBody}>购物跑腿</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.helpItem}>
            <Text style={styles.helpEmoji}>🍳</Text>
            <Text style={CommonStyles.textBody}>准备营养餐</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.helpItem}>
            <Text style={styles.helpEmoji}>🚗</Text>
            <Text style={CommonStyles.textBody}>接送服务</Text>
          </TouchableOpacity>
        </View>
      </Card>
    </ScrollView>
  );

  const renderContent = () => {
    switch (userRole) {
      case 'pregnant':
        return renderPregnantHome();
      case 'partner':
        return renderPartnerHome();
      case 'grandparent':
        return renderGrandparentHome();
      case 'family':
        return renderFamilyHome();
      default:
        return renderPregnantHome();
    }
  };

  return (
    <SafeAreaView style={CommonStyles.container}>
      {renderContent()}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
    paddingHorizontal: Spacing.pagePadding,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: Spacing.lg,
  },
  headerActions: {
    flexDirection: 'row',
    gap: Spacing.sm,
  },
  headerButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: Colors.neutral200,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerButtonText: {
    fontSize: 16,
  },
  card: {
    marginBottom: Spacing.md,
  },
  statusRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: Spacing.sm,
  },
  statusEmoji: {
    fontSize: 20,
  },
  detailButton: {
    marginTop: Spacing.md,
    paddingVertical: Spacing.xs,
    paddingHorizontal: Spacing.sm,
    backgroundColor: Colors.neutral200,
    borderRadius: 4,
    alignSelf: 'flex-start',
  },
  taskItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: Spacing.md,
  },
  taskIcon: {
    width: 32,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Spacing.sm,
  },
  taskContent: {
    flex: 1,
    gap: 4,
  },
  statusBadge: {
    paddingHorizontal: Spacing.xs,
    paddingVertical: 2,
    borderRadius: 12,
    alignSelf: 'flex-start',
  },
  suggestionList: {
    marginTop: Spacing.sm,
    gap: 4,
  },
  learningItem: {
    marginTop: Spacing.sm,
    gap: 8,
  },
  continueButton: {
    paddingVertical: Spacing.xs,
    paddingHorizontal: Spacing.sm,
    backgroundColor: Colors.primaryLight,
    borderRadius: 4,
    alignSelf: 'flex-start',
  },
  careList: {
    marginTop: Spacing.sm,
    gap: 4,
  },
  careItem: {
    marginTop: 4,
  },
  blessButton: {
    marginTop: Spacing.md,
    paddingVertical: Spacing.xs,
    paddingHorizontal: Spacing.sm,
    backgroundColor: Colors.successLight,
    borderRadius: 4,
    alignSelf: 'flex-start',
  },
  experienceItem: {
    marginTop: Spacing.sm,
    gap: 4,
  },
  shareButton: {
    paddingVertical: Spacing.xs,
    paddingHorizontal: Spacing.sm,
    backgroundColor: Colors.warningLight,
    borderRadius: 4,
    alignSelf: 'flex-start',
  },
  activityList: {
    marginTop: Spacing.sm,
    gap: 4,
  },
  helpList: {
    flexDirection: 'row',
    marginTop: Spacing.md,
    gap: Spacing.sm,
  },
  helpItem: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: Spacing.md,
    backgroundColor: Colors.neutral200,
    borderRadius: 8,
    gap: 4,
  },
  helpEmoji: {
    fontSize: 24,
  },
});

export default RoleBasedHome;