# 孕期家庭协作应用 - UI/UX设计规范和原型图方案

## 设计概述

**产品名称**: 家有孕宝
**设计理念**: 温馨、简洁、易用、协作
**目标用户**: 孕妇及其家庭成员
**设计原则**: 以人为本、情感化设计、无障碍友好

---

## 1. 设计原则与理念

### 1.1 核心设计原则

#### 1.1.1 情感化设计
- **温馨关怀**: 体现家庭温暖和关爱
- **安全感**: 传递专业可靠的医疗健康信息
- **成长喜悦**: 记录和分享孕期美好时光
- **协作和谐**: 促进家庭成员间的良性互动

#### 1.1.2 易用性原则
- **简洁明了**: 减少认知负担，突出核心功能
- **一致性**: 保持界面元素和交互模式的统一
- **可预测性**: 用户能够预期操作结果
- **容错性**: 提供清晰的错误提示和恢复机制

#### 1.1.3 无障碍设计
- **视觉友好**: 考虑孕期视觉疲劳，使用大字体和高对比度
- **操作便利**: 适合单手操作，按钮区域足够大
- **信息清晰**: 重要信息突出显示，层次分明

### 1.2 用户体验目标

#### 1.2.1 孕妇用户体验
- **轻松记录**: 健康数据录入简单快捷
- **及时提醒**: 重要事项不遗漏
- **情感支持**: 感受到家庭的关爱和支持
- **专业指导**: 获得可信赖的专业建议

#### 1.2.2 家庭成员体验
- **实时了解**: 随时掌握孕妇和胎儿状况
- **积极参与**: 有明确的参与方式和任务
- **情感表达**: 便于表达关爱和祝福
- **协作高效**: 任务分配和完成流程顺畅

---

## 2. 视觉设计系统

### 2.1 色彩系统

#### 2.1.1 主色调
```css
/* 主品牌色 - 温馨粉色 */
--primary-color: #FF8A9B;
--primary-light: #FFB3C1;
--primary-dark: #E6677A;

/* 辅助色 - 柔和蓝色 */
--secondary-color: #7FB3D3;
--secondary-light: #A5C9E0;
--secondary-dark: #5A9BC4;

/* 中性色系 */
--neutral-100: #FFFFFF;
--neutral-200: #F8F9FA;
--neutral-300: #E9ECEF;
--neutral-400: #DEE2E6;
--neutral-500: #ADB5BD;
--neutral-600: #6C757D;
--neutral-700: #495057;
--neutral-800: #343A40;
--neutral-900: #212529;
```

#### 2.1.2 功能色彩
```css
/* 成功色 */
--success-color: #28A745;
--success-light: #D4EDDA;

/* 警告色 */
--warning-color: #FFC107;
--warning-light: #FFF3CD;

/* 错误色 */
--error-color: #DC3545;
--error-light: #F8D7DA;

/* 信息色 */
--info-color: #17A2B8;
--info-light: #D1ECF1;
```

#### 2.1.3 角色专属色彩
```css
/* 孕妇 - 主色调 */
--pregnant-color: #FF8A9B;

/* 丈夫/伴侣 - 蓝色系 */
--partner-color: #4A90E2;

/* 祖父母 - 金色系 */
--grandparent-color: #F5A623;

/* 其他家庭成员 - 绿色系 */
--family-color: #7ED321;
```

### 2.2 字体系统

#### 2.2.1 字体选择
```css
/* 主字体 - 中文 */
font-family: 'PingFang SC', 'Hiragino Sans GB', 'Microsoft YaHei', sans-serif;

/* 英文字体 */
font-family: 'SF Pro Display', 'Helvetica Neue', Arial, sans-serif;

/* 数字字体 */
font-family: 'SF Mono', 'Monaco', 'Consolas', monospace;
```

#### 2.2.2 字体层级
```css
/* 标题层级 */
--font-size-h1: 28px; /* 主标题 */
--font-size-h2: 24px; /* 二级标题 */
--font-size-h3: 20px; /* 三级标题 */
--font-size-h4: 18px; /* 四级标题 */

/* 正文层级 */
--font-size-body-large: 16px; /* 大正文 */
--font-size-body: 14px; /* 标准正文 */
--font-size-body-small: 12px; /* 小正文 */

/* 辅助文字 */
--font-size-caption: 11px; /* 说明文字 */
--font-size-overline: 10px; /* 标签文字 */
```

#### 2.2.3 字重规范
```css
--font-weight-light: 300;
--font-weight-regular: 400;
--font-weight-medium: 500;
--font-weight-semibold: 600;
--font-weight-bold: 700;
```

### 2.3 间距系统

#### 2.3.1 基础间距单位
```css
--spacing-xs: 4px;
--spacing-sm: 8px;
--spacing-md: 16px;
--spacing-lg: 24px;
--spacing-xl: 32px;
--spacing-xxl: 48px;
```

#### 2.3.2 组件间距
```css
/* 页面边距 */
--page-padding: 16px;

/* 卡片间距 */
--card-padding: 16px;
--card-margin: 12px;

/* 列表间距 */
--list-item-padding: 12px 16px;
--list-item-margin: 8px 0;
```

### 2.4 圆角和阴影

#### 2.4.1 圆角规范
```css
--border-radius-sm: 4px;
--border-radius-md: 8px;
--border-radius-lg: 12px;
--border-radius-xl: 16px;
--border-radius-full: 50%;
```

#### 2.4.2 阴影系统
```css
--shadow-sm: 0 1px 2px rgba(0, 0, 0, 0.05);
--shadow-md: 0 4px 6px rgba(0, 0, 0, 0.07);
--shadow-lg: 0 10px 15px rgba(0, 0, 0, 0.1);
--shadow-xl: 0 20px 25px rgba(0, 0, 0, 0.15);
```

---

## 3. 组件设计规范

### 3.1 基础组件

#### 3.1.1 按钮组件
```css
/* 主要按钮 */
.btn-primary {
  background: var(--primary-color);
  color: white;
  border-radius: var(--border-radius-md);
  padding: 12px 24px;
  font-size: var(--font-size-body);
  font-weight: var(--font-weight-medium);
  min-height: 44px; /* 适合触摸操作 */
}

/* 次要按钮 */
.btn-secondary {
  background: transparent;
  color: var(--primary-color);
  border: 1px solid var(--primary-color);
  border-radius: var(--border-radius-md);
  padding: 12px 24px;
}

/* 文字按钮 */
.btn-text {
  background: transparent;
  color: var(--primary-color);
  padding: 8px 16px;
  font-weight: var(--font-weight-medium);
}
```

#### 3.1.2 输入框组件
```css
.input-field {
  border: 1px solid var(--neutral-300);
  border-radius: var(--border-radius-md);
  padding: 12px 16px;
  font-size: var(--font-size-body);
  min-height: 44px;
  background: var(--neutral-100);
}

.input-field:focus {
  border-color: var(--primary-color);
  box-shadow: 0 0 0 2px rgba(255, 138, 155, 0.2);
}

.input-field.error {
  border-color: var(--error-color);
}
```

#### 3.1.3 卡片组件
```css
.card {
  background: var(--neutral-100);
  border-radius: var(--border-radius-lg);
  padding: var(--card-padding);
  margin: var(--card-margin);
  box-shadow: var(--shadow-sm);
  border: 1px solid var(--neutral-200);
}

.card-header {
  padding-bottom: var(--spacing-md);
  border-bottom: 1px solid var(--neutral-200);
  margin-bottom: var(--spacing-md);
}
```

### 3.2 导航组件

#### 3.2.1 底部导航栏
```css
.bottom-navigation {
  height: 60px;
  background: var(--neutral-100);
  border-top: 1px solid var(--neutral-200);
  display: flex;
  justify-content: space-around;
  align-items: center;
  padding: 0 var(--spacing-md);
}

.nav-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: var(--spacing-sm);
  min-width: 44px;
}

.nav-item.active {
  color: var(--primary-color);
}
```

#### 3.2.2 顶部导航栏
```css
.top-navigation {
  height: 56px;
  background: var(--neutral-100);
  display: flex;
  align-items: center;
  padding: 0 var(--spacing-md);
  border-bottom: 1px solid var(--neutral-200);
}

.nav-title {
  font-size: var(--font-size-h4);
  font-weight: var(--font-weight-medium);
  color: var(--neutral-800);
}
```

### 3.3 数据展示组件

#### 3.3.1 进度条组件
```css
.progress-bar {
  width: 100%;
  height: 8px;
  background: var(--neutral-200);
  border-radius: var(--border-radius-full);
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, var(--primary-color), var(--primary-light));
  border-radius: var(--border-radius-full);
  transition: width 0.3s ease;
}
```

#### 3.3.2 统计卡片
```css
.stat-card {
  background: linear-gradient(135deg, var(--primary-light), var(--primary-color));
  color: white;
  border-radius: var(--border-radius-lg);
  padding: var(--spacing-lg);
  text-align: center;
}

.stat-number {
  font-size: var(--font-size-h1);
  font-weight: var(--font-weight-bold);
  margin-bottom: var(--spacing-sm);
}

.stat-label {
  font-size: var(--font-size-body);
  opacity: 0.9;
}
```

---

## 4. 核心页面原型设计

### 4.1 启动和登录流程

#### 4.1.1 启动页面
```
┌─────────────────────────────────────┐
│                                     │
│              [LOGO]                 │
│            家有孕宝                  │
│                                     │
│         [孕期图标动画]               │
│                                     │
│        陪伴每一个美好时刻             │
│                                     │
│                                     │
│         [加载进度条]                 │
│                                     │
└─────────────────────────────────────┘
```

#### 4.1.2 角色选择页面
```
┌─────────────────────────────────────┐
│  ←  选择您的身份                     │
├─────────────────────────────────────┤
│                                     │
│  ┌─────────────────────────────────┐ │
│  │     👶  我是准妈妈              │ │
│  │     开始记录孕期美好时光         │ │
│  └─────────────────────────────────┘ │
│                                     │
│  ┌─────────────────────────────────┐ │
│  │     👨  我是准爸爸              │ │
│  │     陪伴和支持我的爱人           │ │
│  └─────────────────────────────────┘ │
│                                     │
│  ┌─────────────────────────────────┐ │
│  │     👴👵  我是祖父母            │ │
│  │     关注孙辈的成长               │ │
│  └─────────────────────────────────┘ │
│                                     │
│  ┌─────────────────────────────────┐ │
│  │     👨‍👩‍👧‍👦  其他家庭成员        │ │
│  │     参与家庭协作                 │ │
│  └─────────────────────────────────┘ │
│                                     │
└─────────────────────────────────────┘
```

### 4.2 孕妇主界面设计

#### 4.2.1 首页布局
```
┌─────────────────────────────────────┐
│  👋 早安，小雨  🔔 [通知]  ⚙️ [设置] │
├─────────────────────────────────────┤
│                                     │
│  ┌─────────────────────────────────┐ │
│  │  🤱 孕期进度 - 第24周           │ │
│  │  ████████████░░░░░░░ 60%        │ │
│  │  距离预产期还有 112 天           │ │
│  │  宝宝现在约 600g，像个芒果       │ │
│  └─────────────────────────────────┘ │
│                                     │
│  ┌─────────────────────────────────┐ │
│  │  📋 今日任务                    │ │
│  │  • 记录胎动 (0/3)               │ │
│  │  • 服用叶酸 ✓                   │ │
│  │  • 产检预约提醒 (明天 9:00)      │ │
│  └─────────────────────────────────┘ │
│                                     │
│  ┌─────────────────────────────────┐ │
│  │  🚨 一键通知                    │ │
│  │  [产检提醒] [身体不适] [分享喜悦] │ │
│  └─────────────────────────────────┘ │
│                                     │
│  ┌─────────────────────────────────┐ │
│  │  👨‍👩‍👧‍👦 家庭动态                │ │
│  │  老公：已完成"购买孕妇奶粉"       │ │
│  │  婆婆：分享了一篇育儿文章         │ │
│  │  [查看更多]                     │ │
│  └─────────────────────────────────┘ │
│                                     │
├─────────────────────────────────────┤
│ [首页] [健康] [协作] [知识] [我的]   │
└─────────────────────────────────────┘
```

#### 4.2.2 一键通知功能
```
┌─────────────────────────────────────┐
│  ←  一键通知                        │
├─────────────────────────────────────┤
│                                     │
│  选择通知类型：                      │
│                                     │
│  ┌─────────────────────────────────┐ │
│  │  🏥 产检提醒                    │ │
│  │  通知家人陪同产检                │ │
│  └─────────────────────────────────┘ │
│                                     │
│  ┌─────────────────────────────────┐ │
│  │  😷 身体不适                    │ │
│  │  需要家人关注和照顾              │ │
│  └─────────────────────────────────┘ │
│                                     │
│  ┌─────────────────────────────────┐ │
│  │  🚨 紧急情况                    │ │
│  │  立即通知所有家庭成员            │ │
│  └─────────────────────────────────┘ │
│                                     │
│  ┌─────────────────────────────────┐ │
│  │  😊 分享喜悦                    │ │
│  │  分享胎动、B超等美好时刻         │ │
│  └─────────────────────────────────┘ │
│                                     │
│  ┌─────────────────────────────────┐ │
│  │  💬 自定义消息                  │ │
│  │  发送个性化通知内容              │ │
│  └─────────────────────────────────┘ │
│                                     │
└─────────────────────────────────────┘
```

### 4.3 健康管理页面

#### 4.3.1 健康数据总览
```
┌─────────────────────────────────────┐
│  健康管理                           │
├─────────────────────────────────────┤
│                                     │
│  ┌─────────────────────────────────┐ │
│  │  📊 本周数据概览                │ │
│  │  体重: 65.2kg (+0.5kg)          │ │
│  │  血压: 120/80 mmHg ✓            │ │
│  │  胎动: 平均 15次/小时 ✓          │ │
│  └─────────────────────────────────┘ │
│                                     │
│  ┌─────────────────────────────────┐ │
│  │  📅 产检记录                    │ │
│  │  下次产检: 2025-01-15 09:00     │ │
│  │  北京妇产医院 - 李医生           │ │
│  │  [设置提醒] [查看历史]           │ │
│  └─────────────────────────────────┘ │
│                                     │
│  ┌─────────────────────────────────┐ │
│  │  🍎 营养管理                    │ │
│  │  今日摄入: 1850/2200 卡路里      │ │
│  │  蛋白质 ✓ 钙质 ⚠️ 叶酸 ✓        │ │
│  │  [记录饮食]                     │ │
│  └─────────────────────────────────┘ │
│                                     │
│  ┌─────────────────────────────────┐ │
│  │  👶 胎动记录                    │ │
│  │  今日胎动: 2次 (目标3次)         │ │
│  │  [开始计数]                     │ │
│  └─────────────────────────────────┘ │
│                                     │
├─────────────────────────────────────┤
│ [首页] [健康] [协作] [知识] [我的]   │
└─────────────────────────────────────┘
```

#### 4.3.2 胎动记录界面
```
┌─────────────────────────────────────┐
│  ←  胎动记录                        │
├─────────────────────────────────────┤
│                                     │
│         👶 感受宝宝的活力            │
│                                     │
│  ┌─────────────────────────────────┐ │
│  │                                 │ │
│  │        [大圆形按钮]              │ │
│  │         点击记录                 │ │
│  │         胎动次数                 │ │
│  │                                 │ │
│  │          15 次                  │ │
│  │                                 │ │
│  └─────────────────────────────────┘ │
│                                     │
│  计时: 00:45:32                     │
│  目标: 1小时内10次胎动               │
│                                     │
│  ┌─────────────────────────────────┐ │
│  │  📈 胎动趋势                    │ │
│  │  [简单的折线图显示近7天胎动]      │ │
│  └─────────────────────────────────┘ │
│                                     │
│  [暂停] [完成记录] [分享给家人]      │
│                                     │
└─────────────────────────────────────┘
```

### 4.4 家庭协作页面

#### 4.4.1 协作中心
```
┌─────────────────────────────────────┐
│  家庭协作                           │
├─────────────────────────────────────┤
│                                     │
│  ┌─────────────────────────────────┐ │
│  │  👨‍👩‍👧‍👦 家庭成员 (4人在线)      │ │
│  │  👩小雨(我) 👨老公 👴爸爸 👵妈妈   │ │
│  │  [邀请更多成员]                  │ │
│  └─────────────────────────────────┘ │
│                                     │
│  ┌─────────────────────────────────┐ │
│  │  📋 待办任务 (3项)               │ │
│  │                                 │ │
│  │  🛒 购买孕妇奶粉                │ │
│  │  👨 老公 - 进行中               │ │
│  │                                 │ │
│  │  🏥 预约下次产检                │ │
│  │  👵 妈妈 - 已完成 ✓             │ │
│  │                                 │ │
│  │  📚 准备待产包                  │ │
│  │  未分配 [认领]                  │ │
│  │                                 │ │
│  │  [+ 添加新任务]                 │ │
│  └─────────────────────────────────┘ │
│                                     │
│  ┌─────────────────────────────────┐ │
│  │  💬 家庭消息                    │ │
│  │  老公: "奶粉已经买好了 ❤️"       │ │
│  │  妈妈: "产检已预约，周三上午"     │ │
│  │  [查看全部]                     │ │
│  └─────────────────────────────────┘ │
│                                     │
├─────────────────────────────────────┤
│ [首页] [健康] [协作] [知识] [我的]   │
└─────────────────────────────────────┘
```

### 4.5 家庭成员界面设计

#### 4.5.1 丈夫/伴侣界面
```
┌─────────────────────────────────────┐
│  👋 早安，志明  🔔 [通知]  ⚙️ [设置] │
├─────────────────────────────────────┤
│                                     │
│  ┌─────────────────────────────────┐ │
│  │  👩 小雨的孕期状态               │ │
│  │  第24周 - 一切正常 😊            │ │
│  │  今日胎动: 15次 ✓                │ │
│  │  心情: 开心 😊                   │ │
│  │  [查看详细]                     │ │
│  └─────────────────────────────────┘ │
│                                     │
│  ┌─────────────────────────────────┐ │
│  │  📋 我的任务 (2项待完成)         │ │
│  │  🛒 购买孕妇奶粉 - 进行中        │ │
│  │  🚗 明天陪同产检 - 待开始        │ │
│  │  [查看全部任务]                 │ │
│  └─────────────────────────────────┘ │
│                                     │
│  ┌─────────────────────────────────┐ │
│  │  💡 今日建议                    │ │
│  │  • 提醒小雨按时服用叶酸          │ │
│  │  • 准备明天产检的相关资料        │ │
│  │  • 多陪小雨聊天，缓解孕期焦虑    │ │
│  └─────────────────────────────────┘ │
│                                     │
│  ┌─────────────────────────────────┐ │
│  │  📚 学习角                      │ │
│  │  "准爸爸必读：如何陪伴孕期"      │ │
│  │  [继续学习]                     │ │
│  └─────────────────────────────────┘ │
│                                     │
├─────────────────────────────────────┤
│ [关注] [任务] [学习] [互动] [我的]   │
└─────────────────────────────────────┘
```

#### 4.5.2 祖父母界面
```
┌─────────────────────────────────────┐
│  👋 您好，王奶奶  🔔 [通知]  ⚙️ [设置]│
├─────────────────────────────────────┤
│                                     │
│  ┌─────────────────────────────────┐ │
│  │  👶 孙辈成长进度                │ │
│  │  小雨怀孕第24周                 │ │
│  │  宝宝发育正常，一切顺利 ✓        │ │
│  │  [查看成长相册]                 │ │
│  └─────────────────────────────────┘ │
│                                     │
│  ┌─────────────────────────────────┐ │
│  │  💝 我的关怀                    │ │
│  │  今日已完成:                    │ │
│  │  ✓ 预约了下次产检               │ │
│  │  ✓ 分享了营养食谱               │ │
│  │  [发送祝福]                     │ │
│  └─────────────────────────────────┘ │
│                                     │
│  ┌─────────────────────────────────┐ │
│  │  📖 经验分享                    │ │
│  │  "孕期营养搭配的小窍门"          │ │
│  │  已有3位家庭成员查看             │ │
│  │  [分享更多经验]                 │ │
│  └─────────────────────────────────┘ │
│                                     │
│  ┌─────────────────────────────────┐ │
│  │  🎉 家庭动态                    │ │
│  │  小雨今天心情很好 😊             │ │
│  │  志明完成了购物任务              │ │
│  │  [查看更多]                     │ │
│  └─────────────────────────────────┘ │
│                                     │
├─────────────────────────────────────┤
│ [关注] [关怀] [分享] [动态] [我的]   │
└─────────────────────────────────────┘
```

---

## 5. 交互动效规范

### 5.
1 动效设计原则

#### 5.1.1 动效目的
- **引导注意**: 引导用户关注重要信息和操作
- **提供反馈**: 确认用户操作已被系统接收
- **增强体验**: 让界面更生动，减少等待焦虑
- **保持连贯**: 维持界面元素间的逻辑关系

#### 5.1.2 动效时长规范
```css
/* 微交互动效 */
--duration-fast: 150ms;

/* 标准交互动效 */
--duration-normal: 300ms;

/* 页面转场动效 */
--duration-slow: 500ms;

/* 复杂动画 */
--duration-complex: 800ms;
```

#### 5.1.3 缓动函数
```css
/* 标准缓动 */
--easing-standard: cubic-bezier(0.4, 0.0, 0.2, 1);

/* 进入动效 */
--easing-decelerate: cubic-bezier(0.0, 0.0, 0.2, 1);

/* 退出动效 */
--easing-accelerate: cubic-bezier(0.4, 0.0, 1, 1);

/* 强调动效 */
--easing-sharp: cubic-bezier(0.4, 0.0, 0.6, 1);
```

### 5.2 具体动效规范

#### 5.2.1 按钮交互动效
```css
.btn-primary {
  transition: all var(--duration-fast) var(--easing-standard);
}

.btn-primary:hover {
  transform: translateY(-1px);
  box-shadow: var(--shadow-md);
}

.btn-primary:active {
  transform: translateY(0);
  box-shadow: var(--shadow-sm);
}
```

#### 5.2.2 页面转场动效
```css
/* 页面进入 */
.page-enter {
  opacity: 0;
  transform: translateX(100%);
}

.page-enter-active {
  opacity: 1;
  transform: translateX(0);
  transition: all var(--duration-normal) var(--easing-decelerate);
}

/* 页面退出 */
.page-exit {
  opacity: 1;
  transform: translateX(0);
}

.page-exit-active {
  opacity: 0;
  transform: translateX(-100%);
  transition: all var(--duration-normal) var(--easing-accelerate);
}
```

#### 5.2.3 一键通知动效
```css
.notification-button {
  position: relative;
  overflow: hidden;
}

.notification-button::before {
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  width: 0;
  height: 0;
  background: rgba(255, 255, 255, 0.3);
  border-radius: 50%;
  transform: translate(-50%, -50%);
  transition: width var(--duration-normal), height var(--duration-normal);
}

.notification-button:active::before {
  width: 300px;
  height: 300px;
}
```

---

## 6. 响应式设计适配

### 6.1 断点系统

#### 6.1.1 设备断点
```css
/* 移动设备 */
--breakpoint-mobile: 375px;
--breakpoint-mobile-large: 414px;

/* 平板设备 */
--breakpoint-tablet: 768px;
--breakpoint-tablet-large: 1024px;

/* 桌面设备 */
--breakpoint-desktop: 1200px;
--breakpoint-desktop-large: 1440px;
```

#### 6.1.2 适配策略
- **移动优先**: 从小屏幕开始设计，逐步适配大屏
- **内容优先**: 确保核心内容在所有设备上都能良好展示
- **触摸友好**: 保证触摸目标至少44px×44px

### 6.2 布局适配

#### 6.2.1 栅格系统
```css
.container {
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 var(--spacing-md);
}

.row {
  display: flex;
  flex-wrap: wrap;
  margin: 0 -var(--spacing-sm);
}

.col {
  flex: 1;
  padding: 0 var(--spacing-sm);
}

/* 响应式列 */
@media (max-width: 768px) {
  .col-mobile-full {
    flex: 0 0 100%;
  }
}
```

#### 6.2.2 组件适配
```css
/* 卡片组件响应式 */
.card {
  margin: var(--spacing-sm);
}

@media (min-width: 768px) {
  .card {
    margin: var(--spacing-md);
    max-width: 400px;
  }
}

@media (min-width: 1024px) {
  .card {
    max-width: 300px;
  }
}
```

---

## 7. 无障碍设计考虑

### 7.1 视觉无障碍

#### 7.1.1 颜色对比度
```css
/* 确保文字对比度符合WCAG 2.1 AA标准 */
.text-primary {
  color: var(--neutral-800); /* 对比度 > 4.5:1 */
}

.text-secondary {
  color: var(--neutral-600); /* 对比度 > 3:1 */
}

/* 重要信息使用高对比度 */
.text-important {
  color: var(--neutral-900);
  font-weight: var(--font-weight-semibold);
}
```

#### 7.1.2 字体大小
```css
/* 最小字体大小 */
.text-minimum {
  font-size: 14px; /* 不小于14px */
}

/* 支持系统字体缩放 */
.text-scalable {
  font-size: 1rem; /* 使用相对单位 */
}
```

### 7.2 操作无障碍

#### 7.2.1 触摸目标
```css
.touch-target {
  min-width: 44px;
  min-height: 44px;
  display: flex;
  align-items: center;
  justify-content: center;
}
```

#### 7.2.2 焦点管理
```css
.focusable:focus {
  outline: 2px solid var(--primary-color);
  outline-offset: 2px;
}

.skip-link {
  position: absolute;
  top: -40px;
  left: 6px;
  background: var(--primary-color);
  color: white;
  padding: 8px;
  text-decoration: none;
  z-index: 1000;
}

.skip-link:focus {
  top: 6px;
}
```

### 7.3 语义化标记

#### 7.3.1 HTML结构
```html
<!-- 页面结构 -->
<header role="banner">
  <nav role="navigation" aria-label="主导航">
    <!-- 导航内容 -->
  </nav>
</header>

<main role="main">
  <section aria-labelledby="health-section">
    <h2 id="health-section">健康管理</h2>
    <!-- 健康管理内容 -->
  </section>
</main>

<footer role="contentinfo">
  <!-- 页脚内容 -->
</footer>
```

#### 7.3.2 ARIA标签
```html
<!-- 一键通知按钮 -->
<button 
  aria-label="一键通知家庭成员"
  aria-describedby="notification-help"
  class="notification-button">
  🚨 一键通知
</button>
<div id="notification-help" class="sr-only">
  点击此按钮可以快速通知所有家庭成员
</div>

<!-- 进度条 */
<div 
  role="progressbar" 
  aria-valuenow="24" 
  aria-valuemin="0" 
  aria-valuemax="40"
  aria-label="孕期进度">
  <div class="progress-fill" style="width: 60%"></div>
</div>
```

---

## 8. 设计组件库规划

### 8.1 组件分类

#### 8.1.1 基础组件
- **Button**: 按钮组件（主要、次要、文字、图标按钮）
- **Input**: 输入框组件（文本、数字、日期、搜索）
- **Select**: 选择器组件（下拉选择、多选）
- **Checkbox**: 复选框组件
- **Radio**: 单选框组件
- **Switch**: 开关组件
- **Slider**: 滑块组件

#### 8.1.2 布局组件
- **Container**: 容器组件
- **Grid**: 栅格组件
- **Card**: 卡片组件
- **List**: 列表组件
- **Divider**: 分割线组件
- **Spacer**: 间距组件

#### 8.1.3 导航组件
- **TopNavigation**: 顶部导航栏
- **BottomNavigation**: 底部导航栏
- **TabBar**: 标签栏
- **Breadcrumb**: 面包屑导航
- **Pagination**: 分页组件

#### 8.1.4 数据展示组件
- **Table**: 表格组件
- **Chart**: 图表组件（折线图、柱状图、饼图）
- **Progress**: 进度条组件
- **Badge**: 徽章组件
- **Tag**: 标签组件
- **Avatar**: 头像组件

#### 8.1.5 反馈组件
- **Alert**: 警告提示
- **Toast**: 轻提示
- **Modal**: 模态框
- **Drawer**: 抽屉
- **Popover**: 气泡卡片
- **Tooltip**: 文字提示

#### 8.1.6 业务组件
- **PregnancyProgress**: 孕期进度组件
- **FetalMovementCounter**: 胎动计数器
- **NotificationButton**: 一键通知按钮
- **FamilyMemberList**: 家庭成员列表
- **TaskCard**: 任务卡片
- **HealthDataChart**: 健康数据图表

### 8.2 组件设计规范

#### 8.2.1 组件命名规范
```
- 使用PascalCase命名
- 组件名称要具有描述性
- 避免缩写，使用完整单词
- 业务组件添加业务前缀

示例：
✓ PregnancyProgressCard
✓ FetalMovementCounter
✓ FamilyMemberAvatar
✗ PrgCard
✗ FMCounter
```

#### 8.2.2 组件属性规范
```typescript
interface ButtonProps {
  // 基础属性
  children: React.ReactNode;
  disabled?: boolean;
  loading?: boolean;
  
  // 样式属性
  variant?: 'primary' | 'secondary' | 'text';
  size?: 'small' | 'medium' | 'large';
  color?: 'primary' | 'secondary' | 'success' | 'warning' | 'error';
  
  // 事件属性
  onClick?: (event: MouseEvent) => void;
  onFocus?: (event: FocusEvent) => void;
  onBlur?: (event: FocusEvent) => void;
  
  // 无障碍属性
  'aria-label'?: string;
  'aria-describedby'?: string;
  role?: string;
}
```

### 8.3 组件文档规范

#### 8.3.1 文档结构
```markdown
# 组件名称

## 概述
组件的基本介绍和使用场景

## 示例
### 基础用法
代码示例和效果展示

### 高级用法
复杂场景的使用示例

## API
### Props
属性列表和说明

### Events
事件列表和说明

### Slots
插槽说明（如适用）

## 设计指南
### 何时使用
使用场景说明

### 何时不使用
不适用场景说明

## 无障碍
无障碍相关说明和最佳实践
```

---

## 9. 设计交付规范

### 9.1 设计文件规范

#### 9.1.1 文件命名
```
设计稿命名规范：
- 页面设计稿：[产品名]-[页面名]-[版本号].fig
- 组件库：[产品名]-Components-[版本号].fig
- 图标库：[产品名]-Icons-[版本号].fig

示例：
- 家有孕宝-首页-v1.0.fig
- 家有孕宝-Components-v1.0.fig
- 家有孕宝-Icons-v1.0.fig
```

#### 9.1.2 图层管理
```
图层命名规范：
- 页面：Page/[页面名]
- 组件：Component/[组件名]
- 图标：Icon/[图标名]
- 图片：Image/[图片描述]

图层分组：
- Header（页面头部）
- Content（页面内容）
- Footer（页面底部）
- Overlay（浮层内容）
```

### 9.2 切图规范

#### 9.2.1 图片格式
```
- PNG：透明背景图片、图标
- JPG：照片、复杂图像
- SVG：矢量图标、简单图形
- WebP：现代浏览器优化图片
```

#### 9.2.2 图片尺寸
```
移动端切图规范：
- @1x：基础尺寸
- @2x：2倍尺寸（主要）
- @3x：3倍尺寸（iPhone Plus/Pro Max）

图标尺寸规范：
- 16px, 20px, 24px, 32px, 48px, 64px
```

### 9.3 开发交付

#### 9.3.1 设计标注
```
标注内容：
- 尺寸：宽度、高度、间距
- 颜色：HEX值、RGBA值
- 字体：字体族、字号、行高、字重
- 圆角：border-radius值
- 阴影：box-shadow值
```

#### 9.3.2 交付清单
```
设计交付物：
□ 设计稿源文件
□ 切图资源包
□ 设计规范文档
□ 组件库文档
□ 交互原型
□ 动效说明
□ 开发标注
```

---

## 10. 设计验收标准

### 10.1 视觉还原度

#### 10.1.1 检查项目
- [ ] 颜色准确性（误差<5%）
- [ ] 字体大小和行高准确
- [ ] 间距和布局精确
- [ ] 圆角和阴影效果正确
- [ ] 图标和图片清晰度

#### 10.1.2 响应式检查
- [ ] 不同屏幕尺寸下布局正常
- [ ] 文字在各种设备上可读
- [ ] 触摸目标大小符合规范
- [ ] 横竖屏切换正常

### 10.2 交互体验

#### 10.2.1 操作流畅性
- [ ] 页面切换动画流畅
- [ ] 按钮点击反馈及时
- [ ] 加载状态提示清晰
- [ ] 错误提示友好明确

#### 10.2.2 功能完整性
- [ ] 所有交互功能正常
- [ ] 表单验证逻辑正确
- [ ] 数据展示准确
- [ ] 权限控制有效

### 10.3 无障碍检查

#### 10.3.1 基础检查
- [ ] 颜色对比度符合标准
- [ ] 键盘导航功能正常
- [ ] 屏幕阅读器兼容
- [ ] 焦点管理合理

#### 10.3.2 用户测试
- [ ] 孕妇用户易用性测试
- [ ] 老年用户（祖父母）测试
- [ ] 不同文化程度用户测试
- [ ] 视觉障碍用户测试

---

## 11. 设计迭代计划

### 11.1 版本规划

#### 11.1.1 V1.0 基础版本
**时间**: 开发第1-3个月
**内容**:
- 核心页面设计完成
- 基础组件库建立
- 主要交互流程设计
- 移动端适配完成

#### 11.1.2 V1.1 优化版本
**时间**: 开发第4-6个月
**内容**:
- 用户反馈优化
- 动效细节完善
- 无障碍功能增强
- 性能优化

#### 11.1.3 V2.0 增强版本
**时间**: 开发第7-9个月
**内容**:
- 新功能界面设计
- 会员功能界面
- 平板端适配
- 深色模式支持

### 11.2 持续优化

#### 11.2.1 数据驱动优化
- 用户行为数据分析
- A/B测试验证
- 热力图分析
- 用户反馈收集

#### 11.2.2 设计系统演进
- 组件库持续更新
- 设计规范完善
- 新设计趋势应用
- 品牌形象升级

---

## 12. 总结

本UI/UX设计规范和原型图方案为"家有孕宝"应用提供了完整的设计指导，涵盖了从设计理念到具体实现的各个方面。

### 12.1 核心亮点
1. **情感化设计**: 温馨的视觉风格，体现家庭关爱
2. **差异化体验**: 针对不同角色的个性化界面设计
3. **易用性优先**: 考虑孕期特殊需求的人性化设计
4. **无障碍友好**: 全面的无障碍设计考虑

### 12.2 实施建议
1. **分阶段实施**: 按照版本规划逐步完善设计
2. **用户测试**: 持续进行用户测试和反馈收集
3. **团队协作**: 建立设计师与开发者的高效协作机制
4. **质量把控**: 严格按照验收标准检查设计实现

这个设计方案将为产品的成功奠定坚实的基础，确保用户能够获得优秀的使用体验。