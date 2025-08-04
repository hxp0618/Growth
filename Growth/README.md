# 家有孕宝 - Growth App

一个专为孕期家庭协作设计的React Native应用，提供全面的孕期管理和家庭协作功能。

## 项目概述

**应用名称**: Growth (家有孕宝)  
**技术栈**: React Native + Expo + TypeScript  
**设计理念**: 温馨、简洁、易用、协作  
**目标用户**: 孕妇及其家庭成员  

## 核心功能

### 🏠 主要页面
- **首页**: 孕妇专属主界面，显示孕期进度、今日任务、一键通知等
- **健康管理**: 健康数据追踪、产检记录、营养管理、胎动记录
- **家庭协作**: 家庭成员管理、任务分配、消息交流
- **知识库**: 孕期知识、AI问答、分类浏览
- **个人中心**: 用户信息、设置、健康档案

### 🎯 核心功能
- **一键通知**: 快速通知家庭成员各种情况（产检、不适、紧急、喜悦等）
- **胎动记录**: 专业的胎动计数器，支持目标追踪和进度显示
- **角色差异化**: 不同家庭角色（孕妇、伴侣、祖父母）有专属界面
- **家庭协作**: 任务分配、消息交流、关怀表达

## 技术架构

### 📱 前端技术
- **React Native**: 跨平台移动应用开发
- **Expo**: 开发工具链和运行时
- **TypeScript**: 类型安全的JavaScript
- **Expo Router**: 基于文件的路由系统

### 🎨 设计系统
- **颜色系统**: 温馨粉色主色调，角色专属色彩
- **字体系统**: 中文友好的字体层级
- **组件库**: 统一的UI组件规范
- **响应式设计**: 适配不同屏幕尺寸

### 📦 依赖包
```json
{
  "@react-native-async-storage/async-storage": "数据存储",
  "react-native-svg": "矢量图形",
  "react-native-chart-kit": "图表展示",
  "react-native-calendars": "日历组件",
  "react-native-modal": "模态框",
  "react-native-linear-gradient": "渐变效果",
  "@react-native-community/datetimepicker": "日期时间选择",
  "react-native-image-picker": "图片选择"
}
```

## 项目结构

```
Growth/
├── app/                    # 页面路由
│   └── (tabs)/            # 底部导航页面
│       ├── index.tsx      # 首页
│       ├── health.tsx     # 健康管理
│       ├── collaboration.tsx # 家庭协作
│       ├── knowledge.tsx  # 知识库
│       └── profile.tsx    # 个人中心
├── components/            # 组件库
│   ├── ui/               # 基础UI组件
│   │   ├── Button.tsx    # 按钮组件
│   │   ├── Input.tsx     # 输入框组件
│   │   ├── Card.tsx      # 卡片组件
│   │   └── ProgressBar.tsx # 进度条组件
│   ├── NotificationButton.tsx # 一键通知组件
│   ├── FetalMovementCounter.tsx # 胎动记录组件
│   └── RoleBasedHome.tsx # 角色差异化首页
├── constants/            # 常量配置
│   ├── Theme.ts         # 设计系统主题
│   └── Styles.ts        # 通用样式
└── assets/              # 静态资源
```

## 设计特色

### 🎨 视觉设计
- **温馨色彩**: 主色调为温馨粉色 (#FF8A9B)，营造温暖氛围
- **角色识别**: 不同角色使用专属颜色（孕妇粉色、伴侣蓝色、祖父母金色）
- **情感化图标**: 使用emoji增强情感表达
- **卡片式布局**: 信息层次清晰，易于浏览

### 🔧 交互设计
- **一键操作**: 重要功能支持一键快速操作
- **动画反馈**: 按钮点击、进度变化等有动画反馈
- **模态交互**: 复杂功能使用模态框展示
- **触摸友好**: 按钮尺寸符合触摸操作标准

### 👥 用户体验
- **角色差异化**: 不同角色看到不同的界面内容
- **任务导向**: 清晰的任务列表和完成状态
- **情感连接**: 支持家庭成员间的情感表达和互动
- **专业指导**: 提供专业的孕期知识和建议

## 开发进度

### ✅ 已完成功能
- [x] 项目基础架构搭建
- [x] 设计系统和组件库
- [x] 底部导航结构
- [x] 五个主要页面开发
- [x] 一键通知功能
- [x] 胎动记录功能
- [x] 角色差异化界面
- [x] 基础动效和交互

### 🚧 待完成功能
- [ ] 启动页面和角色选择
- [ ] 登录注册流程
- [ ] 数据持久化
- [ ] 推送通知
- [ ] 图表数据可视化
- [ ] 更多动效优化
- [ ] 单元测试

## 运行项目

### 环境要求
- Node.js 16+
- npm 或 yarn
- Expo CLI
- iOS模拟器或Android模拟器

### 安装依赖
```bash
cd Growth
npm install
```

### 启动开发服务器
```bash
npm start
```

### 运行平台
```bash
# iOS
npm run ios

# Android
npm run android

# Web
npm run web
```

## 设计规范

### 颜色规范
- **主色**: #FF8A9B (温馨粉色)
- **辅助色**: #7FB3D3 (柔和蓝色)
- **成功色**: #28A745
- **警告色**: #FFC107
- **错误色**: #DC3545

### 字体规范
- **主标题**: 28px, 粗体
- **二级标题**: 24px, 半粗体
- **正文**: 14px, 常规
- **小字**: 12px, 常规

### 间距规范
- **页面边距**: 16px
- **卡片间距**: 12px
- **元素间距**: 8px, 16px, 24px

## 贡献指南

1. Fork 项目
2. 创建功能分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 打开 Pull Request

## 许可证

本项目采用 MIT 许可证 - 查看 [LICENSE](LICENSE) 文件了解详情。

## 联系方式

如有问题或建议，请通过以下方式联系：
- 项目Issues: [GitHub Issues](https://github.com/your-repo/Growth/issues)
- 邮箱: your-email@example.com

---

**家有孕宝** - 陪伴每一个美好时刻 ❤️
