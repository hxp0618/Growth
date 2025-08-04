import { StyleSheet } from 'react-native';
import { Colors, Typography, Spacing, BorderRadius, Shadows } from './Theme';

// 通用样式
export const CommonStyles = StyleSheet.create({
  // 容器样式
  container: {
    flex: 1,
    backgroundColor: Colors.neutral100,
  },
  
  safeContainer: {
    flex: 1,
    backgroundColor: Colors.neutral100,
    paddingHorizontal: Spacing.pagePadding,
  },

  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.neutral100,
  },

  // 卡片样式
  card: {
    backgroundColor: Colors.neutral100,
    borderRadius: BorderRadius.lg,
    padding: Spacing.cardPadding,
    margin: Spacing.cardMargin,
    borderWidth: 1,
    borderColor: Colors.neutral200,
    ...Shadows.sm,
  },

  cardHeader: {
    paddingBottom: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.neutral200,
    marginBottom: Spacing.md,
  },

  // 按钮样式
  buttonPrimary: {
    backgroundColor: Colors.primary,
    borderRadius: BorderRadius.md,
    paddingVertical: 12,
    paddingHorizontal: 24,
    minHeight: 44,
    justifyContent: 'center',
    alignItems: 'center',
  },

  buttonSecondary: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: Colors.primary,
    borderRadius: BorderRadius.md,
    paddingVertical: 12,
    paddingHorizontal: 24,
    minHeight: 44,
    justifyContent: 'center',
    alignItems: 'center',
  },

  buttonText: {
    backgroundColor: 'transparent',
    paddingVertical: 8,
    paddingHorizontal: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },

  // 输入框样式
  inputField: {
    borderWidth: 1,
    borderColor: Colors.neutral300,
    borderRadius: BorderRadius.md,
    paddingVertical: 12,
    paddingHorizontal: 16,
    fontSize: Typography.fontSize.body,
    minHeight: 44,
    backgroundColor: Colors.neutral100,
  },

  inputFieldFocused: {
    borderColor: Colors.primary,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
  },

  inputFieldError: {
    borderColor: Colors.error,
  },

  // 文字样式
  textH1: {
    fontSize: Typography.fontSize.h1,
    fontWeight: Typography.fontWeight.bold,
    lineHeight: Typography.lineHeight.h1,
    color: Colors.neutral800,
  },

  textH2: {
    fontSize: Typography.fontSize.h2,
    fontWeight: Typography.fontWeight.semibold,
    lineHeight: Typography.lineHeight.h2,
    color: Colors.neutral800,
  },

  textH3: {
    fontSize: Typography.fontSize.h3,
    fontWeight: Typography.fontWeight.medium,
    lineHeight: Typography.lineHeight.h3,
    color: Colors.neutral800,
  },

  textH4: {
    fontSize: Typography.fontSize.h4,
    fontWeight: Typography.fontWeight.medium,
    lineHeight: Typography.lineHeight.h4,
    color: Colors.neutral800,
  },

  textBody: {
    fontSize: Typography.fontSize.body,
    fontWeight: Typography.fontWeight.regular,
    lineHeight: Typography.lineHeight.body,
    color: Colors.neutral700,
  },

  textBodyLarge: {
    fontSize: Typography.fontSize.bodyLarge,
    fontWeight: Typography.fontWeight.regular,
    lineHeight: Typography.lineHeight.bodyLarge,
    color: Colors.neutral700,
  },

  textBodySmall: {
    fontSize: Typography.fontSize.bodySmall,
    fontWeight: Typography.fontWeight.regular,
    lineHeight: Typography.lineHeight.bodySmall,
    color: Colors.neutral600,
  },

  textCaption: {
    fontSize: Typography.fontSize.caption,
    fontWeight: Typography.fontWeight.regular,
    lineHeight: Typography.lineHeight.caption,
    color: Colors.neutral500,
  },

  textPrimary: {
    color: Colors.primary,
  },

  textSecondary: {
    color: Colors.secondary,
  },

  textSuccess: {
    color: Colors.success,
  },

  textWarning: {
    color: Colors.warning,
  },

  textError: {
    color: Colors.error,
  },

  // 布局样式
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  rowBetween: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  rowCenter: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },

  column: {
    flexDirection: 'column',
  },

  columnCenter: {
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },

  // 间距样式
  marginXS: { margin: Spacing.xs },
  marginSM: { margin: Spacing.sm },
  marginMD: { margin: Spacing.md },
  marginLG: { margin: Spacing.lg },
  marginXL: { margin: Spacing.xl },

  paddingXS: { padding: Spacing.xs },
  paddingSM: { padding: Spacing.sm },
  paddingMD: { padding: Spacing.md },
  paddingLG: { padding: Spacing.lg },
  paddingXL: { padding: Spacing.xl },

  // 分割线
  divider: {
    height: 1,
    backgroundColor: Colors.neutral200,
    marginVertical: Spacing.md,
  },

  dividerVertical: {
    width: 1,
    backgroundColor: Colors.neutral200,
    marginHorizontal: Spacing.md,
  },

  // 阴影样式
  shadowSM: Shadows.sm,
  shadowMD: Shadows.md,
  shadowLG: Shadows.lg,
  shadowXL: Shadows.xl,
});

// 角色专属样式
export const RoleStyles = StyleSheet.create({
  pregnantCard: {
    ...CommonStyles.card,
    borderLeftWidth: 4,
    borderLeftColor: Colors.pregnant,
  },

  partnerCard: {
    ...CommonStyles.card,
    borderLeftWidth: 4,
    borderLeftColor: Colors.partner,
  },

  grandparentCard: {
    ...CommonStyles.card,
    borderLeftWidth: 4,
    borderLeftColor: Colors.grandparent,
  },

  familyCard: {
    ...CommonStyles.card,
    borderLeftWidth: 4,
    borderLeftColor: Colors.family,
  },
});

// 状态样式
export const StatusStyles = StyleSheet.create({
  successBadge: {
    backgroundColor: Colors.successLight,
    borderRadius: BorderRadius.full,
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
  },

  warningBadge: {
    backgroundColor: Colors.warningLight,
    borderRadius: BorderRadius.full,
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
  },

  errorBadge: {
    backgroundColor: Colors.errorLight,
    borderRadius: BorderRadius.full,
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
  },

  infoBadge: {
    backgroundColor: Colors.infoLight,
    borderRadius: BorderRadius.full,
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
  },
});

export default {
  CommonStyles,
  RoleStyles,
  StatusStyles,
};