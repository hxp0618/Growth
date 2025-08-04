import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Button } from '../components/ui';
import { Colors, Typography, Spacing, BorderRadius } from '../constants/Theme';
import { CommonStyles } from '../constants/Styles';

type UserRole = 'pregnant' | 'partner' | 'grandparent' | 'family';

interface RoleOption {
  id: UserRole;
  title: string;
  description: string;
  emoji: string;
  color: string;
}

const roleOptions: RoleOption[] = [
  {
    id: 'pregnant',
    title: '我是准妈妈',
    description: '开始记录孕期美好时光',
    emoji: '👶',
    color: Colors.pregnant,
  },
  {
    id: 'partner',
    title: '我是准爸爸',
    description: '陪伴和支持我的爱人',
    emoji: '👨',
    color: Colors.partner,
  },
  {
    id: 'grandparent',
    title: '我是祖父母',
    description: '关注孙辈的成长',
    emoji: '👴👵',
    color: Colors.grandparent,
  },
  {
    id: 'family',
    title: '其他家庭成员',
    description: '参与家庭协作',
    emoji: '👨‍👩‍👧‍👦',
    color: Colors.family,
  },
];

export default function RoleSelectionScreen() {
  const [selectedRole, setSelectedRole] = useState<UserRole | null>(null);

  const handleRoleSelect = (role: UserRole) => {
    setSelectedRole(role);
  };

  const handleContinue = () => {
    if (!selectedRole) {
      Alert.alert('提示', '请选择您的身份');
      return;
    }

    // 根据角色跳转到不同的流程
    if (selectedRole === 'pregnant') {
      // 孕妇需要选择状态（备孕或已怀孕）
      router.push('/pregnancy-status');
    } else {
      // 其他角色直接进入家庭设置
      router.push('/family-setup');
    }
  };

  const handleSkip = () => {
    // 跳过角色选择，直接进入主应用
    router.replace('/(tabs)');
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* 头部 */}
        <View style={styles.header}>
          <Text style={CommonStyles.textH2}>选择您的身份</Text>
          <Text style={CommonStyles.textBody}>
            选择最符合您身份的选项，我们将为您提供个性化的体验
          </Text>
        </View>

        {/* 角色选项 */}
        <View style={styles.optionsContainer}>
          {roleOptions.map((option) => (
            <TouchableOpacity
              key={option.id}
              style={[
                styles.roleOption,
                selectedRole === option.id && styles.selectedOption,
                { borderColor: option.color },
              ]}
              onPress={() => handleRoleSelect(option.id)}
              activeOpacity={0.8}
            >
              <View style={[styles.roleIcon, { backgroundColor: `${option.color}20` }]}>
                <Text style={styles.roleEmoji}>{option.emoji}</Text>
              </View>
              <View style={styles.roleContent}>
                <Text style={[CommonStyles.textH4, { color: option.color }]}>
                  {option.title}
                </Text>
                <Text style={CommonStyles.textBodySmall}>
                  {option.description}
                </Text>
              </View>
              {selectedRole === option.id && (
                <View style={[styles.checkmark, { backgroundColor: option.color }]}>
                  <Text style={styles.checkmarkText}>✓</Text>
                </View>
              )}
            </TouchableOpacity>
          ))}
        </View>

        {/* 说明文字 */}
        <View style={styles.infoContainer}>
          <Text style={CommonStyles.textBodySmall}>
            💡 您可以随时在设置中更改身份信息
          </Text>
        </View>
      </ScrollView>

      {/* 底部按钮 */}
      <View style={styles.footer}>
        <Button
          variant="secondary"
          onPress={handleSkip}
          style={styles.skipButton}
        >
          暂时跳过
        </Button>
        <Button
          onPress={handleContinue}
          disabled={!selectedRole}
          style={styles.continueButton}
        >
          继续
        </Button>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.neutral100,
  },
  scrollView: {
    flex: 1,
    paddingHorizontal: Spacing.pagePadding,
  },
  header: {
    paddingVertical: Spacing.xl,
    alignItems: 'center',
    gap: Spacing.sm,
  },
  optionsContainer: {
    gap: Spacing.md,
    paddingBottom: Spacing.xl,
  },
  roleOption: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.lg,
    backgroundColor: Colors.neutral100,
    borderRadius: BorderRadius.lg,
    borderWidth: 2,
    borderColor: Colors.neutral200,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  selectedOption: {
    backgroundColor: Colors.neutral200,
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  roleIcon: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Spacing.md,
  },
  roleEmoji: {
    fontSize: 28,
  },
  roleContent: {
    flex: 1,
    gap: 4,
  },
  checkmark: {
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkmarkText: {
    color: Colors.neutral100,
    fontSize: 14,
    fontWeight: Typography.fontWeight.bold,
  },
  infoContainer: {
    alignItems: 'center',
    paddingVertical: Spacing.lg,
  },
  footer: {
    flexDirection: 'row',
    paddingHorizontal: Spacing.pagePadding,
    paddingVertical: Spacing.lg,
    gap: Spacing.md,
    borderTopWidth: 1,
    borderTopColor: Colors.neutral200,
  },
  skipButton: {
    flex: 1,
  },
  continueButton: {
    flex: 2,
  },
});