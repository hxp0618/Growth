import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Modal,
  Alert,
} from 'react-native';
import { Card, Button } from './ui';
import { Colors, Typography, Spacing, BorderRadius } from '../constants/Theme';
import { CommonStyles } from '../constants/Styles';

interface NotificationOption {
  id: string;
  title: string;
  description: string;
  icon: string;
  color: string;
}

const notificationOptions: NotificationOption[] = [
  {
    id: 'checkup',
    title: '产检提醒',
    description: '通知家人陪同产检',
    icon: '🏥',
    color: Colors.info,
  },
  {
    id: 'discomfort',
    title: '身体不适',
    description: '需要家人关注和照顾',
    icon: '😷',
    color: Colors.warning,
  },
  {
    id: 'emergency',
    title: '紧急情况',
    description: '立即通知所有家庭成员',
    icon: '🚨',
    color: Colors.error,
  },
  {
    id: 'joy',
    title: '分享喜悦',
    description: '分享胎动、B超等美好时刻',
    icon: '😊',
    color: Colors.success,
  },
  {
    id: 'custom',
    title: '自定义消息',
    description: '发送个性化通知内容',
    icon: '💬',
    color: Colors.primary,
  },
];

interface NotificationButtonProps {
  onNotificationSent?: (type: string) => void;
}

const NotificationButton: React.FC<NotificationButtonProps> = ({
  onNotificationSent,
}) => {
  const [modalVisible, setModalVisible] = useState(false);

  const handleNotificationPress = () => {
    setModalVisible(true);
  };

  const handleOptionPress = (option: NotificationOption) => {
    setModalVisible(false);
    
    // 模拟发送通知
    setTimeout(() => {
      Alert.alert(
        '通知已发送',
        `已向所有家庭成员发送"${option.title}"通知`,
        [{ text: '确定' }]
      );
      onNotificationSent?.(option.id);
    }, 300);
  };

  const handleCloseModal = () => {
    setModalVisible(false);
  };

  return (
    <>
      <TouchableOpacity
        style={styles.notificationButton}
        onPress={handleNotificationPress}
        activeOpacity={0.8}
      >
        <View style={styles.buttonContent}>
          <Text style={styles.buttonIcon}>🚨</Text>
          <Text style={styles.buttonText}>一键通知</Text>
        </View>
      </TouchableOpacity>

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={handleCloseModal}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={CommonStyles.textH3}>选择通知类型</Text>
              <TouchableOpacity
                style={styles.closeButton}
                onPress={handleCloseModal}
              >
                <Text style={styles.closeButtonText}>✕</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.optionsContainer}>
              {notificationOptions.map((option) => (
                <TouchableOpacity
                  key={option.id}
                  style={styles.optionItem}
                  onPress={() => handleOptionPress(option)}
                  activeOpacity={0.7}
                >
                  <View style={[styles.optionIcon, { backgroundColor: `${option.color}20` }]}>
                    <Text style={styles.optionEmoji}>{option.icon}</Text>
                  </View>
                  <View style={styles.optionContent}>
                    <Text style={CommonStyles.textBody}>{option.title}</Text>
                    <Text style={CommonStyles.textBodySmall}>{option.description}</Text>
                  </View>
                  <Text style={styles.optionArrow}>›</Text>
                </TouchableOpacity>
              ))}
            </View>

            <Button
              variant="secondary"
              onPress={handleCloseModal}
              style={styles.cancelButton}
            >
              取消
            </Button>
          </View>
        </View>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  notificationButton: {
    backgroundColor: Colors.primary,
    borderRadius: BorderRadius.lg,
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.lg,
    alignItems: 'center',
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  buttonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  buttonIcon: {
    fontSize: 24,
  },
  buttonText: {
    fontSize: Typography.fontSize.bodyLarge,
    fontWeight: Typography.fontWeight.semibold,
    color: Colors.neutral100,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: Colors.neutral100,
    borderTopLeftRadius: BorderRadius.xl,
    borderTopRightRadius: BorderRadius.xl,
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.lg,
    paddingBottom: Spacing.xl,
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.lg,
  },
  closeButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: Colors.neutral200,
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeButtonText: {
    fontSize: 16,
    color: Colors.neutral600,
  },
  optionsContainer: {
    gap: Spacing.sm,
  },
  optionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.md,
    backgroundColor: Colors.neutral200,
    borderRadius: BorderRadius.lg,
  },
  optionIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Spacing.md,
  },
  optionEmoji: {
    fontSize: 24,
  },
  optionContent: {
    flex: 1,
    gap: 4,
  },
  optionArrow: {
    fontSize: 20,
    color: Colors.neutral400,
  },
  cancelButton: {
    marginTop: Spacing.lg,
  },
});

export default NotificationButton;