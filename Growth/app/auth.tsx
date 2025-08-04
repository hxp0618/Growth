import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Button, Input } from '../components/ui';
import { Colors, Typography, Spacing, BorderRadius } from '../constants/Theme';
import { CommonStyles } from '../constants/Styles';

type AuthMode = 'login' | 'register';

export default function AuthScreen() {
  const [authMode, setAuthMode] = useState<AuthMode>('login');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleAuth = async () => {
    if (!phone.trim()) {
      Alert.alert('提示', '请输入手机号');
      return;
    }

    if (!password.trim()) {
      Alert.alert('提示', '请输入密码');
      return;
    }

    if (authMode === 'register') {
      if (password !== confirmPassword) {
        Alert.alert('提示', '两次输入的密码不一致');
        return;
      }
      if (!verificationCode.trim()) {
        Alert.alert('提示', '请输入验证码');
        return;
      }
    }

    setIsLoading(true);

    // 模拟API调用
    setTimeout(() => {
      setIsLoading(false);
      Alert.alert(
        authMode === 'login' ? '登录成功' : '注册成功',
        '欢迎使用家有孕宝',
        [
          {
            text: '确定',
            onPress: () => router.replace('/role-selection'),
          },
        ]
      );
    }, 1500);
  };

  const handleSendCode = () => {
    if (!phone.trim()) {
      Alert.alert('提示', '请先输入手机号');
      return;
    }
    Alert.alert('验证码已发送', '请查收短信验证码');
  };

  const handleSwitchMode = () => {
    setAuthMode(authMode === 'login' ? 'register' : 'login');
    setPassword('');
    setConfirmPassword('');
    setVerificationCode('');
  };

  const handleSkip = () => {
    router.replace('/(tabs)');
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView 
        style={styles.keyboardView}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
          {/* 头部 */}
          <View style={styles.header}>
            <View style={styles.logo}>
              <Text style={styles.logoEmoji}>🤱</Text>
            </View>
            <Text style={CommonStyles.textH2}>家有孕宝</Text>
            <Text style={CommonStyles.textBody}>
              {authMode === 'login' ? '欢迎回来' : '创建账户'}
            </Text>
          </View>

          {/* 表单 */}
          <View style={styles.form}>
            <Input
              label="手机号"
              placeholder="请输入手机号"
              value={phone}
              onChangeText={setPhone}
              keyboardType="phone-pad"
              maxLength={11}
            />

            <Input
              label="密码"
              placeholder="请输入密码"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
            />

            {authMode === 'register' && (
              <>
                <Input
                  label="确认密码"
                  placeholder="请再次输入密码"
                  value={confirmPassword}
                  onChangeText={setConfirmPassword}
                  secureTextEntry
                />

                <View style={styles.codeContainer}>
                  <Input
                    label="验证码"
                    placeholder="请输入验证码"
                    value={verificationCode}
                    onChangeText={setVerificationCode}
                    keyboardType="number-pad"
                    maxLength={6}
                    containerStyle={styles.codeInput}
                  />
                  <Button
                    variant="secondary"
                    onPress={handleSendCode}
                    style={styles.sendCodeButton}
                  >
                    发送验证码
                  </Button>
                </View>
              </>
            )}

            <Button
              onPress={handleAuth}
              loading={isLoading}
              style={styles.authButton}
            >
              {authMode === 'login' ? '登录' : '注册'}
            </Button>

            <View style={styles.switchContainer}>
              <Text style={CommonStyles.textBodySmall}>
                {authMode === 'login' ? '还没有账户？' : '已有账户？'}
              </Text>
              <TouchableOpacity onPress={handleSwitchMode}>
                <Text style={[CommonStyles.textBodySmall, { color: Colors.primary }]}>
                  {authMode === 'login' ? '立即注册' : '立即登录'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* 其他登录方式 */}
          <View style={styles.otherMethods}>
            <View style={styles.divider}>
              <View style={styles.dividerLine} />
              <Text style={[CommonStyles.textCaption, { color: Colors.neutral500 }]}>
                其他方式
              </Text>
              <View style={styles.dividerLine} />
            </View>

            <View style={styles.socialButtons}>
              <TouchableOpacity style={styles.socialButton}>
                <Text style={styles.socialEmoji}>📱</Text>
                <Text style={CommonStyles.textBodySmall}>微信登录</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.socialButton}>
                <Text style={styles.socialEmoji}>🍎</Text>
                <Text style={CommonStyles.textBodySmall}>Apple ID</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* 跳过选项 */}
          <View style={styles.skipContainer}>
            <TouchableOpacity onPress={handleSkip}>
              <Text style={[CommonStyles.textBodySmall, { color: Colors.neutral500 }]}>
                暂时跳过，稍后登录
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.neutral100,
  },
  keyboardView: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
    paddingHorizontal: Spacing.pagePadding,
  },
  header: {
    alignItems: 'center',
    paddingVertical: Spacing.xxl,
    gap: Spacing.sm,
  },
  logo: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: Colors.primaryLight,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  logoEmoji: {
    fontSize: 40,
  },
  form: {
    gap: Spacing.lg,
    marginBottom: Spacing.xl,
  },
  codeContainer: {
    flexDirection: 'row',
    gap: Spacing.sm,
    alignItems: 'flex-end',
  },
  codeInput: {
    flex: 1,
  },
  sendCodeButton: {
    paddingHorizontal: Spacing.md,
  },
  authButton: {
    marginTop: Spacing.md,
  },
  switchContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 4,
    marginTop: Spacing.sm,
  },
  otherMethods: {
    marginBottom: Spacing.xl,
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.lg,
    gap: Spacing.sm,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: Colors.neutral300,
  },
  socialButtons: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: Spacing.lg,
  },
  socialButton: {
    alignItems: 'center',
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.lg,
    backgroundColor: Colors.neutral200,
    borderRadius: BorderRadius.lg,
    gap: 4,
    minWidth: 100,
  },
  socialEmoji: {
    fontSize: 24,
  },
  skipContainer: {
    alignItems: 'center',
    paddingBottom: Spacing.xl,
  },
});