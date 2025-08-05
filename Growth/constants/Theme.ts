// 设计系统 - 基于UI设计规范
export const Colors = {
  // 主品牌色 - 温馨粉色
  primary: '#FF8A9B',
  primaryLight: '#FFB3C1',
  primaryDark: '#E6677A',

  // 辅助色 - 柔和蓝色
  secondary: '#7FB3D3',
  secondaryLight: '#A5C9E0',
  secondaryDark: '#5A9BC4',

  // 中性色系
  neutral100: '#FFFFFF',
  neutral200: '#F8F9FA',
  neutral300: '#E9ECEF',
  neutral400: '#DEE2E6',
  neutral500: '#ADB5BD',
  neutral600: '#6C757D',
  neutral700: '#495057',
  neutral800: '#343A40',
  neutral900: '#212529',

  // 功能色彩
  success: '#28A745',
  successLight: '#D4EDDA',
  warning: '#FFC107',
  warningLight: '#FFF3CD',
  error: '#DC3545',
  errorLight: '#F8D7DA',
  info: '#17A2B8',
  infoLight: '#D1ECF1',

  // 角色专属色彩
  pregnant: '#FF8A9B',      // 孕妇 - 主色调
  partner: '#4A90E2',       // 丈夫/伴侣 - 蓝色系
  grandparent: '#F5A623',   // 祖父母 - 金色系
  family: '#7ED321',        // 其他家庭成员 - 绿色系
};

export const Typography = {
  // 字体族
  fontFamily: {
    regular: 'PingFang SC',
    english: 'SF Pro Display',
    mono: 'SF Mono',
  },

  // 字体大小
  fontSize: {
    h1: 28,
    h2: 24,
    h3: 20,
    h4: 18,
    bodyLarge: 16,
    body: 14,
    bodySmall: 12,
    caption: 11,
    overline: 10,
  },

  // 字重
  fontWeight: {
    light: '300' as const,
    regular: '400' as const,
    medium: '500' as const,
    semibold: '600' as const,
    bold: '700' as const,
  },

  // 行高
  lineHeight: {
    h1: 36,
    h2: 32,
    h3: 28,
    h4: 24,
    bodyLarge: 24,
    body: 20,
    bodySmall: 18,
    caption: 16,
    overline: 14,
  },
};

export const Spacing = {
  // 基础间距单位
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,

  // 页面边距
  pagePadding: 20,

  // 卡片间距 - 优化卡片间距，增强视觉分离
  cardPadding: 20,
  cardMargin: 16,
  cardGap: 12, // 卡片内元素间距

  // 列表间距
  listItemPaddingVertical: 14,
  listItemPaddingHorizontal: 20,
  listItemMargin: 10,

  // 网格布局间距
  gridGap: 12,
  gridPadding: 16,
};

export const BorderRadius = {
  sm: 4,
  md: 8,
  lg: 12,
  xl: 16,
  full: 999,
};

export const Shadows = {
  none: {
    shadowColor: 'transparent',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0,
    shadowRadius: 0,
    elevation: 0,
  },
  xs: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.03,
    shadowRadius: 1,
    elevation: 1,
  },
  sm: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 3,
    elevation: 2,
  },
  md: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 4,
  },
  lg: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.12,
    shadowRadius: 16,
    elevation: 6,
  },
  xl: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 16 },
    shadowOpacity: 0.16,
    shadowRadius: 24,
    elevation: 8,
  },
  // 特殊阴影效果
  card: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 3,
  },
  button: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  floating: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 6,
  },
};

export const Animation = {
  // 动效时长
  duration: {
    fast: 150,
    normal: 300,
    slow: 500,
    complex: 800,
  },

  // 缓动函数
  easing: {
    standard: 'ease-in-out',
    decelerate: 'ease-out',
    accelerate: 'ease-in',
    sharp: 'ease-in-out',
  },
};

// 组件尺寸
export const ComponentSizes = {
  // 按钮最小触摸区域
  touchTarget: 44,
  
  // 导航栏高度
  topNavHeight: 56,
  bottomNavHeight: 60,
  
  // 输入框最小高度
  inputMinHeight: 48,
  
  // 卡片尺寸
  cardMinHeight: 100,
  cardMaxHeight: 400,
  
  // 网格卡片尺寸
  gridCardMinHeight: 120,
  gridCardAspectRatio: 1.2,
  
  // 图标尺寸
  iconXS: 16,
  iconSM: 20,
  iconMD: 24,
  iconLG: 32,
  iconXL: 48,
};

// 断点系统
export const Breakpoints = {
  mobile: 375,
  mobileLarge: 414,
  tablet: 768,
  tabletLarge: 1024,
  desktop: 1200,
  desktopLarge: 1440,
};

export default {
  Colors,
  Typography,
  Spacing,
  BorderRadius,
  Shadows,
  Animation,
  ComponentSizes,
  Breakpoints,
};