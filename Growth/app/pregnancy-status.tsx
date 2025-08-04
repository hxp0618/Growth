import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Button } from '../components/ui';
import { Colors, Typography, Spacing, BorderRadius } from '../constants/Theme';
import { CommonStyles } from '../constants/Styles';

type PregnancyStatus = 'preconception' | 'pregnant';

interface StatusOption {
  id: PregnancyStatus;
  title: string;
  description: string;
  emoji: string;
}

const statusOptions: StatusOption[] = [
  {
    id: 'preconception',
    title: '备孕中',
    description: '正在准备怀孕，希望获得备孕指导',
    emoji: '💕',
  },
  {
    id: 'pregnant',
    title: '已怀孕',
    description: '已经怀孕，需要孕期管理和家庭协作',
    emoji: '🤱',
  },
];

export default function PregnancyStatusScreen() {
  const [selectedStatus, setSelectedStatus] = useState<PregnancyStatus | null>(null);

  const handleStatusSelect = (status: PregnancyStatus) => {
    setSelectedStatus(status);
  };

  const handleContinue = () => {
    if (!selectedStatus) {
      Alert.alert('提示', '请选择您的当前状态');
      return;
    }

    // 跳转到家庭设置页面
    router.push('/family-setup');
  };

  const handleBack = () => {
    router.back();
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={handleBack}>
          <Text style={styles.backButtonText}>←</Text>
        </TouchableOpacity>
        <Text style={CommonStyles.textH3}>选择当前状态</Text>
        <View style={styles.placeholder} />
      </View>

      <View style={styles.content}>
        <View style={styles.titleContainer}>
          <Text style={CommonStyles.textBody}>
            请选择您当前的状态，我们将为您提供相应的功能和建议
          </Text>
        </View>

        <View style={styles.optionsContainer}>
          {statusOptions.map((option) => (
            <TouchableOpacity
              key={option.id}
              style={[
                styles.statusOption,
                selectedStatus === option.id && styles.selectedOption,
              ]}
              onPress={() => handleStatusSelect(option.id)}
              activeOpacity={0.8}
            >
              <View style={styles.statusIcon}>
                <Text style={styles.statusEmoji}>{option.emoji}</Text>
              </View>
              <View style={styles.statusContent}>
                <Text style={CommonStyles.textH4}>{option.title}</Text>
                <Text style={CommonStyles.textBodySmall}>{option.description}</Text>
              </View>
              {selectedStatus === option.id && (
                <View style={styles.checkmark}>
                  <Text style={styles.checkmarkText}>✓</Text>
                </View>
              )}
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <View style={styles.footer}>
        <Button
          onPress={handleContinue}
          disabled={!selectedStatus}
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
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing.pagePadding,
    paddingVertical: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.neutral200,
  },
  backButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: Colors.neutral200,
    justifyContent: 'center',
    alignItems: 'center',
  },
  backButtonText: {
    fontSize: 18,
    color: Colors.neutral700,
  },
  placeholder: {
    width: 32,
  },
  content: {
    flex: 1,
    paddingHorizontal: Spacing.pagePadding,
    paddingVertical: Spacing.xl,
  },
  titleContainer: {
    alignItems: 'center',
    marginBottom: Spacing.xl,
  },
  optionsContainer: {
    gap: Spacing.md,
  },
  statusOption: {
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
    borderColor: Colors.primary,
    backgroundColor: Colors.primaryLight + '20',
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  statusIcon: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: Colors.primaryLight,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Spacing.md,
  },
  statusEmoji: {
    fontSize: 28,
  },
  statusContent: {
    flex: 1,
    gap: 4,
  },
  checkmark: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkmarkText: {
    color: Colors.neutral100,
    fontSize: 14,
    fontWeight: Typography.fontWeight.bold,
  },
  footer: {
    paddingHorizontal: Spacing.pagePadding,
    paddingVertical: Spacing.lg,
    borderTopWidth: 1,
    borderTopColor: Colors.neutral200,
  },
  continueButton: {
    width: '100%',
  },
});