export interface KnowledgeArticle {
  id: string;
  title: string;
  summary: string;
  content: string;
  category: 'pregnancy' | 'nutrition' | 'health' | 'preparation' | 'postpartum' | 'baby_care';
  tags: string[];
  pregnancyWeekRange?: {
    start: number;
    end: number;
  };
  readTime: number; // 分钟
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  author: string;
  publishDate: Date;
  lastUpdated: Date;
  views: number;
  likes: number;
  isBookmarked: boolean;
  relatedArticles: string[]; // 相关文章ID
  images?: string[];
  videos?: string[];
}

export interface FAQ {
  id: string;
  question: string;
  answer: string;
  category: KnowledgeArticle['category'];
  pregnancyWeek?: number;
  tags: string[];
  isHelpful: boolean;
  helpfulCount: number;
  relatedQuestions: string[];
}

export interface KnowledgeCategory {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
  articleCount: number;
  subcategories?: KnowledgeSubcategory[];
}

export interface KnowledgeSubcategory {
  id: string;
  name: string;
  description: string;
  articleCount: number;
}

export interface ReadingProgress {
  articleId: string;
  userId: string;
  progress: number; // 0-100
  lastReadAt: Date;
  isCompleted: boolean;
  bookmarked: boolean;
  notes?: string;
}

export interface SearchResult {
  articles: KnowledgeArticle[];
  faqs: FAQ[];
  totalResults: number;
  searchTime: number;
  suggestions: string[];
}

class KnowledgeService {
  private articles: KnowledgeArticle[] = [];
  private faqs: FAQ[] = [];
  private categories: KnowledgeCategory[] = [];
  private readingProgress: ReadingProgress[] = [];

  constructor() {
    this.initializeCategories();
    this.initializeArticles();
    this.initializeFAQs();
  }

  /**
   * 获取分类列表
   */
  getCategories(): KnowledgeCategory[] {
    return this.categories;
  }

  /**
   * 根据孕周获取推荐文章
   */
  getRecommendedArticles(pregnancyWeek: number, limit: number = 5): KnowledgeArticle[] {
    return this.articles
      .filter(article => {
        if (!article.pregnancyWeekRange) return true;
        return pregnancyWeek >= article.pregnancyWeekRange.start && 
               pregnancyWeek <= article.pregnancyWeekRange.end;
      })
      .sort((a, b) => b.views - a.views)
      .slice(0, limit);
  }

  /**
   * 根据分类获取文章
   */
  getArticlesByCategory(category: KnowledgeArticle['category'], page: number = 1, limit: number = 10): {
    articles: KnowledgeArticle[];
    totalPages: number;
    currentPage: number;
  } {
    const categoryArticles = this.articles.filter(article => article.category === category);
    const totalPages = Math.ceil(categoryArticles.length / limit);
    const startIndex = (page - 1) * limit;
    const articles = categoryArticles.slice(startIndex, startIndex + limit);

    return {
      articles,
      totalPages,
      currentPage: page
    };
  }

  /**
   * 获取热门文章
   */
  getPopularArticles(limit: number = 10): KnowledgeArticle[] {
    return this.articles
      .sort((a, b) => b.views - a.views)
      .slice(0, limit);
  }

  /**
   * 获取最新文章
   */
  getLatestArticles(limit: number = 10): KnowledgeArticle[] {
    return this.articles
      .sort((a, b) => b.publishDate.getTime() - a.publishDate.getTime())
      .slice(0, limit);
  }

  /**
   * 获取收藏的文章
   */
  getBookmarkedArticles(): KnowledgeArticle[] {
    return this.articles.filter(article => article.isBookmarked);
  }

  /**
   * 搜索文章和FAQ
   */
  search(query: string, filters?: {
    category?: KnowledgeArticle['category'];
    pregnancyWeek?: number;
    difficulty?: KnowledgeArticle['difficulty'];
  }): SearchResult {
    const startTime = Date.now();
    const lowercaseQuery = query.toLowerCase();

    // 搜索文章
    let articles = this.articles.filter(article => 
      article.title.toLowerCase().includes(lowercaseQuery) ||
      article.summary.toLowerCase().includes(lowercaseQuery) ||
      article.content.toLowerCase().includes(lowercaseQuery) ||
      article.tags.some(tag => tag.toLowerCase().includes(lowercaseQuery))
    );

    // 搜索FAQ
    let faqs = this.faqs.filter(faq =>
      faq.question.toLowerCase().includes(lowercaseQuery) ||
      faq.answer.toLowerCase().includes(lowercaseQuery) ||
      faq.tags.some(tag => tag.toLowerCase().includes(lowercaseQuery))
    );

    // 应用过滤器
    if (filters) {
      if (filters.category) {
        articles = articles.filter(article => article.category === filters.category);
        faqs = faqs.filter(faq => faq.category === filters.category);
      }
      if (filters.pregnancyWeek) {
        articles = articles.filter(article => {
          if (!article.pregnancyWeekRange) return true;
          return filters.pregnancyWeek! >= article.pregnancyWeekRange.start && 
                 filters.pregnancyWeek! <= article.pregnancyWeekRange.end;
        });
        faqs = faqs.filter(faq => 
          !faq.pregnancyWeek || faq.pregnancyWeek === filters.pregnancyWeek
        );
      }
      if (filters.difficulty) {
        articles = articles.filter(article => article.difficulty === filters.difficulty);
      }
    }

    const searchTime = Date.now() - startTime;
    const suggestions = this.generateSearchSuggestions(query);

    return {
      articles,
      faqs,
      totalResults: articles.length + faqs.length,
      searchTime,
      suggestions
    };
  }

  /**
   * 获取文章详情
   */
  getArticleById(id: string): KnowledgeArticle | null {
    const article = this.articles.find(a => a.id === id);
    if (article) {
      // 增加浏览量
      article.views += 1;
    }
    return article || null;
  }

  /**
   * 获取相关文章
   */
  getRelatedArticles(articleId: string, limit: number = 5): KnowledgeArticle[] {
    const article = this.getArticleById(articleId);
    if (!article) return [];

    return this.articles
      .filter(a => 
        a.id !== articleId && 
        (a.category === article.category || 
         a.tags.some(tag => article.tags.includes(tag)))
      )
      .sort((a, b) => b.views - a.views)
      .slice(0, limit);
  }

  /**
   * 获取FAQ列表
   */
  getFAQs(category?: KnowledgeArticle['category'], pregnancyWeek?: number): FAQ[] {
    let faqs = [...this.faqs];

    if (category) {
      faqs = faqs.filter(faq => faq.category === category);
    }

    if (pregnancyWeek) {
      faqs = faqs.filter(faq => 
        !faq.pregnancyWeek || faq.pregnancyWeek === pregnancyWeek
      );
    }

    return faqs.sort((a, b) => b.helpfulCount - a.helpfulCount);
  }

  /**
   * 切换文章收藏状态
   */
  toggleBookmark(articleId: string): boolean {
    const article = this.articles.find(a => a.id === articleId);
    if (article) {
      article.isBookmarked = !article.isBookmarked;
      return article.isBookmarked;
    }
    return false;
  }

  /**
   * 点赞文章
   */
  likeArticle(articleId: string): boolean {
    const article = this.articles.find(a => a.id === articleId);
    if (article) {
      article.likes += 1;
      return true;
    }
    return false;
  }

  /**
   * 标记FAQ为有用
   */
  markFAQHelpful(faqId: string): boolean {
    const faq = this.faqs.find(f => f.id === faqId);
    if (faq && !faq.isHelpful) {
      faq.isHelpful = true;
      faq.helpfulCount += 1;
      return true;
    }
    return false;
  }

  /**
   * 更新阅读进度
   */
  updateReadingProgress(articleId: string, userId: string, progress: number): void {
    const existingProgress = this.readingProgress.find(
      p => p.articleId === articleId && p.userId === userId
    );

    if (existingProgress) {
      existingProgress.progress = progress;
      existingProgress.lastReadAt = new Date();
      existingProgress.isCompleted = progress >= 100;
    } else {
      this.readingProgress.push({
        articleId,
        userId,
        progress,
        lastReadAt: new Date(),
        isCompleted: progress >= 100,
        bookmarked: false
      });
    }
  }

  /**
   * 获取阅读进度
   */
  getReadingProgress(userId: string): ReadingProgress[] {
    return this.readingProgress.filter(p => p.userId === userId);
  }

  /**
   * 生成搜索建议
   */
  private generateSearchSuggestions(query: string): string[] {
    const commonSuggestions = [
      '孕期营养', '胎儿发育', '产检注意事项', '孕期运动',
      '分娩准备', '新生儿护理', '母乳喂养', '产后恢复',
      '孕期不适', '胎动异常', '孕期用药', '待产包准备'
    ];

    return commonSuggestions
      .filter(suggestion => 
        suggestion.toLowerCase().includes(query.toLowerCase()) ||
        query.toLowerCase().includes(suggestion.toLowerCase())
      )
      .slice(0, 5);
  }

  /**
   * 初始化分类
   */
  private initializeCategories(): void {
    this.categories = [
      {
        id: 'pregnancy',
        name: '孕期知识',
        description: '孕期各阶段的基础知识和注意事项',
        icon: '🤱',
        color: '#FF8A9B',
        articleCount: 0,
        subcategories: [
          { id: 'early', name: '孕早期', description: '1-12周', articleCount: 0 },
          { id: 'middle', name: '孕中期', description: '13-27周', articleCount: 0 },
          { id: 'late', name: '孕晚期', description: '28-40周', articleCount: 0 }
        ]
      },
      {
        id: 'nutrition',
        name: '营养饮食',
        description: '孕期营养需求和饮食指导',
        icon: '🥗',
        color: '#96CEB4',
        articleCount: 0
      },
      {
        id: 'health',
        name: '健康管理',
        description: '孕期健康监测和疾病预防',
        icon: '💪',
        color: '#74B9FF',
        articleCount: 0
      },
      {
        id: 'preparation',
        name: '分娩准备',
        description: '分娩知识和待产准备',
        icon: '🏥',
        color: '#FDCB6E',
        articleCount: 0
      },
      {
        id: 'postpartum',
        name: '产后护理',
        description: '产后恢复和护理知识',
        icon: '🌸',
        color: '#E17055',
        articleCount: 0
      },
      {
        id: 'baby_care',
        name: '新生儿护理',
        description: '新生儿护理和育儿知识',
        icon: '👶',
        color: '#A29BFE',
        articleCount: 0
      }
    ];
  }

  /**
   * 初始化文章
   */
  private initializeArticles(): void {
    this.articles = [
      {
        id: 'article_1',
        title: '孕早期注意事项：前三个月的关键要点',
        summary: '孕早期是胎儿发育的关键时期，了解这个阶段的注意事项对母婴健康至关重要。',
        content: `孕早期（1-12周）是胎儿器官形成的关键时期，准妈妈需要特别注意以下几个方面：

## 营养补充
- 叶酸：每日400-800微克，预防神经管缺陷
- 维生素：多种维生素补充剂
- 蛋白质：优质蛋白质摄入

## 生活习惯
- 戒烟戒酒：完全避免烟酒
- 规律作息：保证充足睡眠
- 适量运动：轻度有氧运动

## 注意事项
- 避免接触有害物质
- 谨慎用药，遵医嘱
- 定期产检

## 常见不适及应对
- 孕吐：少食多餐，避免空腹
- 疲劳：适当休息，不要过度劳累
- 情绪波动：保持心情愉快，寻求支持`,
        category: 'pregnancy',
        tags: ['孕早期', '注意事项', '营养', '生活习惯'],
        pregnancyWeekRange: { start: 1, end: 12 },
        readTime: 8,
        difficulty: 'beginner',
        author: '张医生',
        publishDate: new Date('2024-01-15'),
        lastUpdated: new Date('2024-01-20'),
        views: 1250,
        likes: 89,
        isBookmarked: false,
        relatedArticles: ['article_2', 'article_3']
      },
      {
        id: 'article_2',
        title: '孕期营养全攻略：吃什么对宝宝最好',
        summary: '科学的孕期营养搭配，为胎儿健康发育提供充足的营养支持。',
        content: `孕期营养对胎儿发育和母体健康都至关重要。以下是详细的营养指导：

## 蛋白质需求
- 每日增加15-25克蛋白质
- 优质来源：瘦肉、鱼类、蛋类、豆制品
- 植物蛋白与动物蛋白合理搭配

## 维生素和矿物质
- 叶酸：绿叶蔬菜、柑橘类水果
- 铁质：红肉、菠菜、豆类
- 钙质：奶制品、芝麻、小鱼干
- DHA：深海鱼类、核桃

## 饮食原则
- 均衡搭配，多样化
- 少食多餐，避免暴饮暴食
- 充足水分摄入
- 避免生冷、辛辣食物

## 不同孕期的营养重点
- 孕早期：叶酸、维生素B6
- 孕中期：铁质、钙质、蛋白质
- 孕晚期：DHA、维生素K`,
        category: 'nutrition',
        tags: ['营养', '饮食', '蛋白质', '维生素'],
        readTime: 12,
        difficulty: 'intermediate',
        author: '李营养师',
        publishDate: new Date('2024-01-10'),
        lastUpdated: new Date('2024-01-25'),
        views: 2100,
        likes: 156,
        isBookmarked: true,
        relatedArticles: ['article_1', 'article_4']
      },
      {
        id: 'article_3',
        title: '胎动监测：如何正确记录宝宝的活动',
        summary: '学会正确监测和记录胎动，及时了解胎儿在宫内的健康状况。',
        content: `胎动是胎儿健康的重要指标，正确监测胎动对孕期管理非常重要：

## 胎动的意义
- 反映胎儿在宫内的健康状况
- 是胎儿神经系统发育的表现
- 帮助建立母婴情感联系

## 胎动监测方法
- 时间选择：餐后1-2小时
- 体位：左侧卧位或半坐位
- 环境：安静、舒适的环境
- 记录方式：每日固定时间记录

## 正常胎动规律
- 孕20周左右开始感受到胎动
- 孕28-32周胎动最为活跃
- 每小时胎动3-5次为正常
- 12小时胎动计数不少于30次

## 异常情况及处理
- 胎动突然减少或消失
- 胎动过于频繁和强烈
- 胎动规律突然改变
- 出现异常情况应及时就医

## 胎动记录技巧
- 使用胎动记录表或APP
- 记录时间、次数、强度
- 注意胎动的规律性
- 与医生分享记录结果`,
        category: 'health',
        tags: ['胎动', '监测', '健康', '记录'],
        pregnancyWeekRange: { start: 20, end: 40 },
        readTime: 10,
        difficulty: 'intermediate',
        author: '王医生',
        publishDate: new Date('2024-01-08'),
        lastUpdated: new Date('2024-01-22'),
        views: 1800,
        likes: 134,
        isBookmarked: false,
        relatedArticles: ['article_1', 'article_5']
      },
      {
        id: 'article_4',
        title: '待产包准备清单：分娩前必备物品',
        summary: '详细的待产包准备清单，确保分娩时所需物品一应俱全。',
        content: `提前准备待产包，让分娩更加从容。以下是详细的准备清单：

## 妈妈用品
### 证件类
- 身份证、医保卡
- 产检资料、病历本
- 准生证（如需要）

### 衣物类
- 哺乳内衣2-3件
- 月子服2-3套
- 一次性内裤
- 拖鞋、袜子

### 洗护用品
- 产妇卫生巾
- 洗漱用品
- 毛巾、浴巾
- 湿纸巾

### 哺乳用品
- 防溢乳垫
- 乳头保护罩
- 吸奶器
- 哺乳枕

## 宝宝用品
### 衣物类
- 新生儿衣服3-5套
- 包被2-3条
- 帽子、手套、袜子
- 尿布或纸尿裤

### 喂养用品
- 奶瓶2个
- 奶嘴
- 奶粉（备用）
- 小勺子

### 洗护用品
- 婴儿湿纸巾
- 婴儿毛巾
- 婴儿洗护用品

## 其他必需品
- 手机充电器
- 现金和银行卡
- 相机（记录珍贵时刻）
- 小零食（补充体力）

## 准备时间
- 孕32周开始准备
- 孕36周完成准备
- 放在容易拿取的地方`,
        category: 'preparation',
        tags: ['待产包', '分娩', '准备', '清单'],
        pregnancyWeekRange: { start: 32, end: 40 },
        readTime: 15,
        difficulty: 'beginner',
        author: '陈护士长',
        publishDate: new Date('2024-01-05'),
        lastUpdated: new Date('2024-01-28'),
        views: 3200,
        likes: 245,
        isBookmarked: true,
        relatedArticles: ['article_3', 'article_6']
      },
      {
        id: 'article_5',
        title: '产后恢复指南：新妈妈的身心调理',
        summary: '产后恢复的全面指导，帮助新妈妈尽快恢复身心健康。',
        content: `产后恢复是新妈妈面临的重要课题，需要从多个方面进行调理：

## 身体恢复
### 子宫恢复
- 产后6-8周子宫恢复正常大小
- 恶露观察：颜色、量、气味
- 适当活动促进子宫收缩

### 伤口护理
- 顺产：会阴伤口护理
- 剖腹产：腹部伤口护理
- 保持清洁干燥
- 观察感染征象

### 乳房护理
- 正确哺乳姿势
- 预防乳腺炎
- 乳头护理
- 断奶时的乳房护理

## 营养调理
### 月子餐原则
- 营养均衡，易消化
- 适量补充蛋白质
- 充足的维生素和矿物质
- 避免生冷、辛辣食物

### 哺乳期营养
- 增加热量摄入
- 充足的水分补充
- 优质蛋白质
- DHA补充

## 心理调适
### 产后抑郁预防
- 保持良好心态
- 寻求家人支持
- 适当社交活动
- 必要时寻求专业帮助

### 角色转换
- 接受新身份
- 学习育儿技能
- 与伴侣沟通
- 建立新的生活节奏

## 运动恢复
### 产后6周内
- 深呼吸练习
- 简单的伸展运动
- 盆底肌训练

### 产后6周后
- 逐步增加运动强度
- 有氧运动
- 力量训练
- 瑜伽、普拉提`,
        category: 'postpartum',
        tags: ['产后恢复', '身心调理', '营养', '运动'],
        readTime: 18,
        difficulty: 'intermediate',
        author: '刘医生',
        publishDate: new Date('2024-01-03'),
        lastUpdated: new Date('2024-01-30'),
        views: 2800,
        likes: 198,
        isBookmarked: false,
        relatedArticles: ['article_4', 'article_6']
      },
      {
        id: 'article_6',
        title: '新生儿护理基础：新手父母必知',
        summary: '新生儿护理的基础知识，帮助新手父母更好地照顾宝宝。',
        content: `新生儿护理需要细心和耐心，以下是基础护理知识：

## 日常护理
### 喂养护理
- 母乳喂养的正确姿势
- 人工喂养的注意事项
- 喂养频率和量的控制
- 拍嗝的重要性和方法

### 睡眠护理
- 安全的睡眠环境
- 睡眠姿势：仰卧位
- 睡眠时间：新生儿每天16-20小时
- 建立良好的睡眠习惯

### 清洁护理
- 脐带护理：保持干燥清洁
- 洗澡：水温37-40℃
- 换尿布：及时更换，预防尿布疹
- 口腔清洁：用纱布轻拭

## 健康监测
### 体重增长
- 出生后前几天体重下降是正常的
- 一周后开始稳定增长
- 每周增长150-200克

### 大小便观察
- 胎便：出生后24-48小时排出
- 正常大便：金黄色、糊状
- 小便：每天6-8次

### 体温监测
- 正常体温：36.5-37.5℃
- 测量方法：腋下测温
- 发热时的处理

## 常见问题处理
### 黄疸
- 生理性黄疸：出生后2-3天出现
- 病理性黄疸：需要医疗干预
- 观察皮肤和眼白颜色

### 湿疹
- 保持皮肤清洁干燥
- 选择合适的护肤品
- 避免过敏原

### 肠绞痛
- 症状：无明显原因的哭闹
- 缓解方法：按摩、抱抱、轻摇
- 通常3-4个月后自然缓解

## 安全注意事项
- 避免摇晃婴儿
- 注意防止窒息
- 保持环境温度适宜
- 定期体检和疫苗接种`,
        category: 'baby_care',
        tags: ['新生儿', '护理', '喂养', '健康'],
        readTime: 20,
        difficulty: 'beginner',
        author: '赵护士',
        publishDate: new Date('2024-01-01'),
        lastUpdated: new Date('2024-02-01'),
        views: 4500,
        likes: 312,
        isBookmarked: true,
        relatedArticles: ['article_5', 'article_1']
      }
    ];

    // 更新分类文章数量
    this.categories.forEach(category => {
      category.articleCount = this.articles.filter(article => article.category === category.id).length;
    });
  }

  /**
   * 初始化FAQ
   */
  private initializeFAQs(): void {
    this.faqs = [
      {
        id: 'faq_1',
        question: '孕期可以喝咖啡吗？',
        answer: '孕期可以适量饮用咖啡，但建议每天咖啡因摄入量不超过200毫克（约1-2杯咖啡）。过量咖啡因可能增加流产和早产的风险。建议选择低咖啡因或无咖啡因的替代品。',
        category: 'nutrition',
        tags: ['咖啡', '咖啡因', '饮食'],
        isHelpful: false,
        helpfulCount: 45,
        relatedQuestions: ['faq_2', 'faq_3']
      },
      {
        id: 'faq_2',
        question: '孕期感冒了怎么办？',
        answer: '孕期感冒应该：1. 多休息，保证充足睡眠；2. 多喝温水，保持水分；3. 可以喝蜂蜜柠檬水缓解症状；4. 避免自行用药，如症状严重应及时就医；5. 保持室内空气流通。一般轻微感冒不会影响胎儿健康。',
        category: 'health',
        pregnancyWeek: 20,
        tags: ['感冒', '用药', '健康'],
        isHelpful: false,
        helpfulCount: 78,
        relatedQuestions: ['faq_1', 'faq_4']
      },
      {
        id: 'faq_3',
        question: '胎动什么时候开始？',
        answer: '大多数孕妇在孕18-20周开始感受到胎动，初产妇可能稍晚一些（20-22周）。最初的胎动感觉像肠胃蠕动或气泡破裂，随着孕周增加，胎动会越来越明显和规律。',
        category: 'health',
        pregnancyWeek: 18,
        tags: ['胎动', '孕周', '感受'],
        isHelpful: false,
        helpfulCount: 92,
        relatedQuestions: ['faq_2', 'faq_4']
      },
      {
        id: 'faq_4',
        question: '孕期体重增加多少合适？',
        answer: '孕期体重增加因人而异，主要取决于孕前BMI：1. 体重不足（BMI<18.5）：增加12.5-18kg；2. 正常体重（BMI 18.5-24.9）：增加11.5-16kg；3. 超重（BMI 25-29.9）：增加7-11.5kg；4. 肥胖（BMI≥30）：增加5-9kg。建议每周增重0.5kg左右。',
        category: 'health',
        tags: ['体重', '增重', 'BMI'],
        isHelpful: false,
        helpfulCount: 67,
        relatedQuestions: ['faq_1', 'faq_5']
      },
      {
        id: 'faq_5',
        question: '孕期可以运动吗？',
        answer: '孕期适量运动对母婴都有益处。推荐的运动包括：散步、游泳、孕妇瑜伽、孕妇操等。运动强度以不感到疲劳为宜，每次20-30分钟，每周3-4次。避免剧烈运动、接触性运动和有跌倒风险的运动。运动前最好咨询医生。',
        category: 'health',
        tags: ['运动', '锻炼', '安全'],
        isHelpful: false,
        helpfulCount: 54,
        relatedQuestions: ['faq_4', 'faq_6']
      },
      {
        id: 'faq_6',
        question: '什么时候需要立即就医？',
        answer: '出现以下情况需要立即就医：1. 阴道出血；2. 剧烈腹痛；3. 持续头痛、视力模糊；4. 胎动明显减少或消失；5. 破水；6. 持续呕吐无法进食；7. 高烧不退；8. 面部、手脚严重水肿；9. 呼吸困难、胸痛。',
        category: 'health',
        tags: ['紧急情况', '就医', '症状'],
        isHelpful: false,
        helpfulCount: 156,
        relatedQuestions: ['faq_2', 'faq_3']
      }
    ];
  }
}

export const knowledgeService = new KnowledgeService();