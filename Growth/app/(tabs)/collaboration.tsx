import React from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Card, Button } from '@/components/ui';
import { Colors, Typography, Spacing } from '@/constants/Theme';
import { CommonStyles } from '@/constants/Styles';

export default function CollaborationScreen() {
  return (
    <SafeAreaView style={CommonStyles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={CommonStyles.textH2}>家庭协作</Text>
        </View>

        {/* 家庭成员 */}
        <Card style={styles.card}>
          <Text style={CommonStyles.textH4}>👨‍👩‍👧‍👦 家庭成员 (4人在线)</Text>
          <View style={styles.membersContainer}>
            <View style={styles.memberItem}>
              <View style={[styles.avatar, { backgroundColor: Colors.pregnant }]}>
                <Text style={styles.avatarText}>👩</Text>
              </View>
              <Text style={CommonStyles.textBodySmall}>小雨(我)</Text>
            </View>
            <View style={styles.memberItem}>
              <View style={[styles.avatar, { backgroundColor: Colors.partner }]}>
                <Text style={styles.avatarText}>👨</Text>
              </View>
              <Text style={CommonStyles.textBodySmall}>老公</Text>
            </View>
            <View style={styles.memberItem}>
              <View style={[styles.avatar, { backgroundColor: Colors.grandparent }]}>
                <Text style={styles.avatarText}>👴</Text>
              </View>
              <Text style={CommonStyles.textBodySmall}>爸爸</Text>
            </View>
            <View style={styles.memberItem}>
              <View style={[styles.avatar, { backgroundColor: Colors.grandparent }]}>
                <Text style={styles.avatarText}>👵</Text>
              </View>
              <Text style={CommonStyles.textBodySmall}>妈妈</Text>
            </View>
          </View>
          <TouchableOpacity style={styles.inviteButton}>
            <Text style={[CommonStyles.textBodySmall, { color: Colors.primary }]}>邀请更多成员</Text>
          </TouchableOpacity>
        </Card>

        {/* 待办任务 */}
        <Card style={styles.card}>
          <Text style={CommonStyles.textH4}>📋 待办任务 (3项)</Text>
          
          <View style={styles.taskItem}>
            <View style={styles.taskIcon}>
              <Text>🛒</Text>
            </View>
            <View style={styles.taskContent}>
              <Text style={CommonStyles.textBody}>购买孕妇奶粉</Text>
              <View style={styles.taskMeta}>
                <Text style={CommonStyles.textBodySmall}>👨 老公</Text>
                <View style={[styles.statusBadge, { backgroundColor: Colors.warningLight }]}>
                  <Text style={[CommonStyles.textBodySmall, { color: Colors.warning }]}>进行中</Text>
                </View>
              </View>
            </View>
          </View>

          <View style={styles.taskItem}>
            <View style={styles.taskIcon}>
              <Text>🏥</Text>
            </View>
            <View style={styles.taskContent}>
              <Text style={CommonStyles.textBody}>预约下次产检</Text>
              <View style={styles.taskMeta}>
                <Text style={CommonStyles.textBodySmall}>👵 妈妈</Text>
                <View style={[styles.statusBadge, { backgroundColor: Colors.successLight }]}>
                  <Text style={[CommonStyles.textBodySmall, { color: Colors.success }]}>已完成 ✓</Text>
                </View>
              </View>
            </View>
          </View>

          <View style={styles.taskItem}>
            <View style={styles.taskIcon}>
              <Text>📚</Text>
            </View>
            <View style={styles.taskContent}>
              <Text style={CommonStyles.textBody}>准备待产包</Text>
              <View style={styles.taskMeta}>
                <Text style={CommonStyles.textBodySmall}>未分配</Text>
                <TouchableOpacity style={styles.claimButton}>
                  <Text style={[CommonStyles.textBodySmall, { color: Colors.primary }]}>认领</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>

          <Button 
            variant="secondary" 
            style={styles.addTaskButton}
            onPress={() => {}}
          >
            + 添加新任务
          </Button>
        </Card>

        {/* 家庭消息 */}
        <Card style={styles.card}>
          <Text style={CommonStyles.textH4}>💬 家庭消息</Text>
          
          <View style={styles.messageItem}>
            <View style={[styles.messageAvatar, { backgroundColor: Colors.partner }]}>
              <Text style={styles.avatarText}>👨</Text>
            </View>
            <View style={styles.messageContent}>
              <Text style={CommonStyles.textBodySmall}>老公</Text>
              <Text style={CommonStyles.textBody}>"奶粉已经买好了 ❤️"</Text>
              <Text style={[CommonStyles.textCaption, { color: Colors.neutral500 }]}>5分钟前</Text>
            </View>
          </View>

          <View style={styles.messageItem}>
            <View style={[styles.messageAvatar, { backgroundColor: Colors.grandparent }]}>
              <Text style={styles.avatarText}>👵</Text>
            </View>
            <View style={styles.messageContent}>
              <Text style={CommonStyles.textBodySmall}>妈妈</Text>
              <Text style={CommonStyles.textBody}>"产检已预约，周三上午"</Text>
              <Text style={[CommonStyles.textCaption, { color: Colors.neutral500 }]}>1小时前</Text>
            </View>
          </View>

          <TouchableOpacity style={styles.viewAllButton}>
            <Text style={[CommonStyles.textBodySmall, { color: Colors.primary }]}>查看全部</Text>
          </TouchableOpacity>
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
  membersContainer: {
    flexDirection: 'row',
    marginTop: Spacing.md,
    gap: Spacing.md,
  },
  memberItem: {
    alignItems: 'center',
    gap: Spacing.xs,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    fontSize: 20,
  },
  inviteButton: {
    marginTop: Spacing.md,
    paddingVertical: Spacing.xs,
    paddingHorizontal: Spacing.sm,
    backgroundColor: Colors.neutral200,
    borderRadius: 4,
    alignSelf: 'flex-start',
  },
  taskItem: {
    flexDirection: 'row',
    marginTop: Spacing.md,
    alignItems: 'flex-start',
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
  },
  taskMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: Spacing.xs,
  },
  statusBadge: {
    paddingHorizontal: Spacing.xs,
    paddingVertical: 2,
    borderRadius: 12,
  },
  claimButton: {
    paddingHorizontal: Spacing.xs,
    paddingVertical: 2,
    backgroundColor: Colors.neutral200,
    borderRadius: 4,
  },
  addTaskButton: {
    marginTop: Spacing.md,
  },
  messageItem: {
    flexDirection: 'row',
    marginTop: Spacing.md,
    alignItems: 'flex-start',
  },
  messageAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Spacing.sm,
  },
  messageContent: {
    flex: 1,
    gap: 2,
  },
  viewAllButton: {
    marginTop: Spacing.md,
    paddingVertical: Spacing.xs,
    paddingHorizontal: Spacing.sm,
    backgroundColor: Colors.neutral200,
    borderRadius: 4,
    alignSelf: 'flex-start',
  },
});