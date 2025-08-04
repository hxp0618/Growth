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
import { Button, Input } from '../components/ui';
import { Colors, Typography, Spacing, BorderRadius } from '../constants/Theme';
import { CommonStyles } from '../constants/Styles';

type SetupMode = 'create' | 'join';

export default function FamilySetupScreen() {
  const [setupMode, setSetupMode] = useState<SetupMode | null>(null);
  const [familyCode, setFamilyCode] = useState('');
  const [familyName, setFamilyName] = useState('');

  const handleModeSelect = (mode: SetupMode) => {
    setSetupMode(mode);
  };

  const handleComplete = () => {
    if (setupMode === 'create') {
      if (!familyName.trim()) {
        Alert.alert('提示', '请输入家庭名称');
        return;
      }
      // 创建家庭组
      const generatedCode = Math.random().toString(36).substr(2, 8).toUpperCase();
      Alert.alert(
        '家庭组创建成功',
        `家庭名称：${familyName}\n邀请码：${generatedCode}\n\n请将邀请码分享给家庭成员`,
        [
          {
            text: '完成',
            onPress: () => router.replace('/(tabs)'),
          },
        ]
      );
    } else if (setupMode === 'join') {
      if (!familyCode.trim()) {
        Alert.alert('提示', '请输入8位家庭邀请码');
        return;
      }
      if (familyCode.length !== 8) {
        Alert.alert('提示', '邀请码应为8位字符');
        return;
      }
      // 加入家庭组
      Alert.alert(
        '加入成功',
        '您已成功加入家庭组',
        [
          {
            text: '完成',
            onPress: () => router.replace('/(tabs)'),
          },
        ]
      );
    }
  };

  const handleBack = () => {
    if (setupMode) {
      setSetupMode(null);
    } else {
      router.back();
    }
  };

  const handleSkip = () => {
    router.replace('/(tabs)');
  };

  const renderModeSelection = () => (
    <View style={styles.content}>
      <View style={styles.titleContainer}>
        <Text style={CommonStyles.textH3}>家庭组设置</Text>
        <Text style={CommonStyles.textBody}>
          创建新的家庭组或加入现有家庭组
        </Text>
      </View>

      <View style={styles.optionsContainer}>
        <TouchableOpacity
          style={styles.modeOption}
          onPress={() => handleModeSelect('create')}
          activeOpacity={0.8}
        >
          <View style={[styles.modeIcon, { backgroundColor: Colors.successLight }]}>
            <Text style={styles.modeEmoji}>👨‍👩‍👧‍👦</Text>
          </View>
          <View style={styles.modeContent}>
            <Text style={CommonStyles.textH4}>创建新家庭组</Text>
            <Text style={CommonStyles.textBodySmall}>
              创建一个新的家庭组，获得邀请码分享给家人
            </Text>
          </View>
          <Text style={styles.arrow}>›</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.modeOption}
          onPress={() => handleModeSelect('join')}
          activeOpacity={0.8}
        >
          <View style={[styles.modeIcon, { backgroundColor: Colors.infoLight }]}>
            <Text style={styles.modeEmoji}>🔗</Text>
          </View>
          <View style={styles.modeContent}>
            <Text style={CommonStyles.textH4}>加入现有家庭组</Text>
            <Text style={CommonStyles.textBodySmall}>
              使用8位邀请码加入已有的家庭组
            </Text>
          </View>
          <Text style={styles.arrow}>›</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.skipContainer}>
        <TouchableOpacity onPress={handleSkip}>
          <Text style={[CommonStyles.textBodySmall, { color: Colors.neutral500 }]}>
            暂时跳过，稍后设置
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderCreateFamily = () => (
    <View style={styles.content}>
      <View style={styles.titleContainer}>
        <Text style={CommonStyles.textH3}>创建家庭组</Text>
        <Text style={CommonStyles.textBody}>
          为您的家庭组起一个温馨的名字
        </Text>
      </View>

      <View style={styles.formContainer}>
        <Input
          label="家庭名称"
          placeholder="例如：小雨的温馨之家"
          value={familyName}
          onChangeText={setFamilyName}
          maxLength={20}
        />
        
        <View style={styles.infoBox}>
          <Text style={CommonStyles.textBodySmall}>
            💡 创建成功后，系统将生成8位邀请码，您可以分享给家庭成员邀请他们加入
          </Text>
        </View>
      </View>
    </View>
  );

  const renderJoinFamily = () => (
    <View style={styles.content}>
      <View style={styles.titleContainer}>
        <Text style={CommonStyles.textH3}>加入家庭组</Text>
        <Text style={CommonStyles.textBody}>
          请输入家庭成员分享给您的8位邀请码
        </Text>
      </View>

      <View style={styles.formContainer}>
        <Input
          label="邀请码"
          placeholder="请输入8位邀请码"
          value={familyCode}
          onChangeText={(text) => setFamilyCode(text.toUpperCase())}
          maxLength={8}
          autoCapitalize="characters"
        />
        
        <View style={styles.infoBox}>
          <Text style={CommonStyles.textBodySmall}>
            💡 邀请码由家庭组创建者提供，通常为8位字母数字组合
          </Text>
        </View>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={handleBack}>
          <Text style={styles.backButtonText}>←</Text>
        </TouchableOpacity>
        <Text style={CommonStyles.textH4}>家庭设置</Text>
        <View style={styles.placeholder} />
      </View>

      {!setupMode && renderModeSelection()}
      {setupMode === 'create' && renderCreateFamily()}
      {setupMode === 'join' && renderJoinFamily()}

      {setupMode && (
        <View style={styles.footer}>
          <Button
            onPress={handleComplete}
            style={styles.completeButton}
          >
            {setupMode === 'create' ? '创建家庭组' : '加入家庭组'}
          </Button>
        </View>
      )}
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
    gap: Spacing.sm,
  },
  optionsContainer: {
    gap: Spacing.md,
    marginBottom: Spacing.xl,
  },
  modeOption: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.lg,
    backgroundColor: Colors.neutral100,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    borderColor: Colors.neutral200,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  modeIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Spacing.md,
  },
  modeEmoji: {
    fontSize: 24,
  },
  modeContent: {
    flex: 1,
    gap: 4,
  },
  arrow: {
    fontSize: 20,
    color: Colors.neutral400,
  },
  skipContainer: {
    alignItems: 'center',
    marginTop: Spacing.xl,
  },
  formContainer: {
    gap: Spacing.lg,
  },
  infoBox: {
    padding: Spacing.md,
    backgroundColor: Colors.infoLight,
    borderRadius: BorderRadius.md,
    borderLeftWidth: 4,
    borderLeftColor: Colors.info,
  },
  footer: {
    paddingHorizontal: Spacing.pagePadding,
    paddingVertical: Spacing.lg,
    borderTopWidth: 1,
    borderTopColor: Colors.neutral200,
  },
  completeButton: {
    width: '100%',
  },
});