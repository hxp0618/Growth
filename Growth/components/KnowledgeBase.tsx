import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Modal,
  Alert
} from 'react-native';
import Card from './ui/Card';
import Button from './ui/Button';
import Theme from '../constants/Theme';
import {
  knowledgeService,
  KnowledgeArticle,
  FAQ,
  KnowledgeCategory,
  SearchResult
} from '../services/knowledgeService';

interface KnowledgeBaseProps {
  pregnancyWeek?: number;
  style?: any;
}

export const KnowledgeBase: React.FC<KnowledgeBaseProps> = ({
  pregnancyWeek = 28,
  style
}) => {
  const [categories, setCategories] = useState<KnowledgeCategory[]>([]);
  const [recommendedArticles, setRecommendedArticles] = useState<KnowledgeArticle[]>([]);
  const [popularArticles, setPopularArticles] = useState<KnowledgeArticle[]>([]);
  const [faqs, setFaqs] = useState<FAQ[]>([]);
  const [activeTab, setActiveTab] = useState<'home' | 'categories' | 'search' | 'bookmarks'>('home');
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<SearchResult | null>(null);
  const [selectedArticle, setSelectedArticle] = useState<KnowledgeArticle | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  useEffect(() => {
    loadData();
  }, [pregnancyWeek]);

  const loadData = () => {
    const categoriesData = knowledgeService.getCategories();
    const recommendedData = knowledgeService.getRecommendedArticles(pregnancyWeek, 5);
    const popularData = knowledgeService.getPopularArticles(5);
    const faqsData = knowledgeService.getFAQs(undefined, pregnancyWeek);

    setCategories(categoriesData);
    setRecommendedArticles(recommendedData);
    setPopularArticles(popularData);
    setFaqs(faqsData.slice(0, 5));
  };

  const handleSearch = () => {
    if (!searchQuery.trim()) return;

    const results = knowledgeService.search(searchQuery, {
      pregnancyWeek: pregnancyWeek
    });
    setSearchResults(results);
    setActiveTab('search');
  };

  const handleArticlePress = (article: KnowledgeArticle) => {
    setSelectedArticle(article);
  };

  const handleCategoryPress = (categoryId: string) => {
    setSelectedCategory(categoryId);
    setActiveTab('categories');
  };

  const handleBookmark = (articleId: string) => {
    const isBookmarked = knowledgeService.toggleBookmark(articleId);
    Alert.alert('提示', isBookmarked ? '已添加到收藏' : '已取消收藏');
    loadData(); // 重新加载数据
  };

  const handleLike = (articleId: string) => {
    knowledgeService.likeArticle(articleId);
    loadData(); // 重新加载数据
  };

  const handleFAQHelpful = (faqId: string) => {
    const success = knowledgeService.markFAQHelpful(faqId);
    if (success) {
      Alert.alert('感谢', '感谢您的反馈！');
      loadData();
    }
  };

  const getCategoryIcon = (categoryId: string) => {
    const category = categories.find(c => c.id === categoryId);
    return category?.icon || '📚';
  };

  const getCategoryColor = (categoryId: string) => {
    const category = categories.find(c => c.id === categoryId);
    return category?.color || Theme.Colors.neutral500;
  };

  const renderHomeTab = () => (
    <ScrollView style={styles.tabContent}>
      {/* 搜索框 */}
      <Card style={styles.searchCard}>
        <View style={styles.searchContainer}>
          <TextInput
            style={styles.searchInput}
            placeholder="搜索孕期知识、常见问题..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            onSubmitEditing={handleSearch}
          />
          <TouchableOpacity style={styles.searchButton} onPress={handleSearch}>
            <Text style={styles.searchButtonText}>🔍</Text>
          </TouchableOpacity>
        </View>
      </Card>

      {/* 分类快捷入口 */}
      <Card style={styles.categoriesCard}>
        <Text style={styles.cardTitle}>知识分类</Text>
        <View style={styles.categoriesGrid}>
          {categories.slice(0, 6).map(category => (
            <TouchableOpacity
              key={category.id}
              style={[styles.categoryItem, { backgroundColor: category.color + '20' }]}
              onPress={() => handleCategoryPress(category.id)}
            >
              <Text style={styles.categoryIcon}>{category.icon}</Text>
              <Text style={styles.categoryName}>{category.name}</Text>
              <Text style={styles.categoryCount}>{category.articleCount}篇</Text>
            </TouchableOpacity>
          ))}
        </View>
      </Card>

      {/* 推荐文章 */}
      <Card style={styles.articlesCard}>
        <Text style={styles.cardTitle}>📖 为您推荐（第{pregnancyWeek}周）</Text>
        {recommendedArticles.map(article => (
          <TouchableOpacity
            key={article.id}
            style={styles.articleItem}
            onPress={() => handleArticlePress(article)}
          >
            <View style={styles.articleContent}>
              <Text style={styles.articleTitle} numberOfLines={2}>
                {article.title}
              </Text>
              <Text style={styles.articleSummary} numberOfLines={2}>
                {article.summary}
              </Text>
              <View style={styles.articleMeta}>
                <Text style={styles.articleCategory}>
                  {getCategoryIcon(article.category)} {article.category}
                </Text>
                <Text style={styles.articleReadTime}>
                  📖 {article.readTime}分钟
                </Text>
                <Text style={styles.articleViews}>
                  👁 {article.views}
                </Text>
              </View>
            </View>
            <View style={styles.articleActions}>
              <TouchableOpacity
                style={styles.bookmarkButton}
                onPress={() => handleBookmark(article.id)}
              >
                <Text style={styles.bookmarkIcon}>
                  {article.isBookmarked ? '🔖' : '📑'}
                </Text>
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        ))}
      </Card>

      {/* 热门文章 */}
      <Card style={styles.articlesCard}>
        <Text style={styles.cardTitle}>🔥 热门文章</Text>
        {popularArticles.map(article => (
          <TouchableOpacity
            key={article.id}
            style={styles.articleItem}
            onPress={() => handleArticlePress(article)}
          >
            <View style={styles.articleContent}>
              <Text style={styles.articleTitle} numberOfLines={1}>
                {article.title}
              </Text>
              <View style={styles.articleMeta}>
                <Text style={styles.articleCategory}>
                  {getCategoryIcon(article.category)}
                </Text>
                <Text style={styles.articleViews}>
                  👁 {article.views}
                </Text>
                <Text style={styles.articleLikes}>
                  ❤️ {article.likes}
                </Text>
              </View>
            </View>
          </TouchableOpacity>
        ))}
      </Card>

      {/* 常见问题 */}
      <Card style={styles.faqCard}>
        <Text style={styles.cardTitle}>❓ 常见问题</Text>
        {faqs.map(faq => (
          <View key={faq.id} style={styles.faqItem}>
            <TouchableOpacity style={styles.faqQuestion}>
              <Text style={styles.faqQuestionText}>{faq.question}</Text>
            </TouchableOpacity>
            <Text style={styles.faqAnswer}>{faq.answer}</Text>
            <View style={styles.faqActions}>
              <TouchableOpacity
                style={styles.helpfulButton}
                onPress={() => handleFAQHelpful(faq.id)}
                disabled={faq.isHelpful}
              >
                <Text style={[
                  styles.helpfulButtonText,
                  faq.isHelpful && styles.helpfulButtonTextActive
                ]}>
                  👍 有用 ({faq.helpfulCount})
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        ))}
      </Card>
    </ScrollView>
  );

  const renderCategoriesTab = () => {
    if (selectedCategory) {
      const { articles } = knowledgeService.getArticlesByCategory(selectedCategory as any);
      const category = categories.find(c => c.id === selectedCategory);

      return (
        <ScrollView style={styles.tabContent}>
          <Card style={styles.categoryDetailCard}>
            <View style={styles.categoryDetailHeader}>
              <TouchableOpacity
                style={styles.backButton}
                onPress={() => setSelectedCategory(null)}
              >
                <Text style={styles.backButtonText}>← 返回</Text>
              </TouchableOpacity>
              <View style={styles.categoryDetailInfo}>
                <Text style={styles.categoryDetailIcon}>{category?.icon}</Text>
                <Text style={styles.categoryDetailName}>{category?.name}</Text>
                <Text style={styles.categoryDetailDescription}>
                  {category?.description}
                </Text>
              </View>
            </View>
          </Card>

          <Card style={styles.articlesCard}>
            <Text style={styles.cardTitle}>文章列表 ({articles.length}篇)</Text>
            {articles.map(article => (
              <TouchableOpacity
                key={article.id}
                style={styles.articleItem}
                onPress={() => handleArticlePress(article)}
              >
                <View style={styles.articleContent}>
                  <Text style={styles.articleTitle} numberOfLines={2}>
                    {article.title}
                  </Text>
                  <Text style={styles.articleSummary} numberOfLines={2}>
                    {article.summary}
                  </Text>
                  <View style={styles.articleMeta}>
                    <Text style={styles.articleReadTime}>
                      📖 {article.readTime}分钟
                    </Text>
                    <Text style={styles.articleViews}>
                      👁 {article.views}
                    </Text>
                    <Text style={styles.articleDifficulty}>
                      {article.difficulty === 'beginner' ? '🟢 入门' :
                       article.difficulty === 'intermediate' ? '🟡 进阶' : '🔴 高级'}
                    </Text>
                  </View>
                </View>
                <View style={styles.articleActions}>
                  <TouchableOpacity
                    style={styles.bookmarkButton}
                    onPress={() => handleBookmark(article.id)}
                  >
                    <Text style={styles.bookmarkIcon}>
                      {article.isBookmarked ? '🔖' : '📑'}
                    </Text>
                  </TouchableOpacity>
                </View>
              </TouchableOpacity>
            ))}
          </Card>
        </ScrollView>
      );
    }

    return (
      <ScrollView style={styles.tabContent}>
        <Card style={styles.categoriesListCard}>
          <Text style={styles.cardTitle}>知识分类</Text>
          {categories.map(category => (
            <TouchableOpacity
              key={category.id}
              style={[styles.categoryListItem, { borderLeftColor: category.color }]}
              onPress={() => handleCategoryPress(category.id)}
            >
              <View style={styles.categoryListContent}>
                <Text style={styles.categoryListIcon}>{category.icon}</Text>
                <View style={styles.categoryListInfo}>
                  <Text style={styles.categoryListName}>{category.name}</Text>
                  <Text style={styles.categoryListDescription}>
                    {category.description}
                  </Text>
                </View>
                <View style={styles.categoryListMeta}>
                  <Text style={styles.categoryListCount}>
                    {category.articleCount}篇
                  </Text>
                  <Text style={styles.categoryListArrow}>›</Text>
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </Card>
      </ScrollView>
    );
  };

  const renderSearchTab = () => (
    <ScrollView style={styles.tabContent}>
      {searchResults && (
        <>
          <Card style={styles.searchResultsCard}>
            <Text style={styles.cardTitle}>
              搜索结果 ({searchResults.totalResults}个)
            </Text>
            <Text style={styles.searchTime}>
              搜索用时: {searchResults.searchTime}ms
            </Text>
          </Card>

          {searchResults.articles.length > 0 && (
            <Card style={styles.articlesCard}>
              <Text style={styles.cardTitle}>相关文章 ({searchResults.articles.length})</Text>
              {searchResults.articles.map(article => (
                <TouchableOpacity
                  key={article.id}
                  style={styles.articleItem}
                  onPress={() => handleArticlePress(article)}
                >
                  <View style={styles.articleContent}>
                    <Text style={styles.articleTitle} numberOfLines={2}>
                      {article.title}
                    </Text>
                    <Text style={styles.articleSummary} numberOfLines={2}>
                      {article.summary}
                    </Text>
                    <View style={styles.articleMeta}>
                      <Text style={styles.articleCategory}>
                        {getCategoryIcon(article.category)} {article.category}
                      </Text>
                      <Text style={styles.articleReadTime}>
                        📖 {article.readTime}分钟
                      </Text>
                    </View>
                  </View>
                </TouchableOpacity>
              ))}
            </Card>
          )}

          {searchResults.faqs.length > 0 && (
            <Card style={styles.faqCard}>
              <Text style={styles.cardTitle}>相关问题 ({searchResults.faqs.length})</Text>
              {searchResults.faqs.map(faq => (
                <View key={faq.id} style={styles.faqItem}>
                  <Text style={styles.faqQuestionText}>{faq.question}</Text>
                  <Text style={styles.faqAnswer}>{faq.answer}</Text>
                </View>
              ))}
            </Card>
          )}

          {searchResults.suggestions.length > 0 && (
            <Card style={styles.suggestionsCard}>
              <Text style={styles.cardTitle}>搜索建议</Text>
              <View style={styles.suggestionsContainer}>
                {searchResults.suggestions.map((suggestion, index) => (
                  <TouchableOpacity
                    key={index}
                    style={styles.suggestionItem}
                    onPress={() => {
                      setSearchQuery(suggestion);
                      handleSearch();
                    }}
                  >
                    <Text style={styles.suggestionText}>{suggestion}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </Card>
          )}
        </>
      )}
    </ScrollView>
  );

  const renderBookmarksTab = () => {
    const bookmarkedArticles = knowledgeService.getBookmarkedArticles();

    return (
      <ScrollView style={styles.tabContent}>
        <Card style={styles.articlesCard}>
          <Text style={styles.cardTitle}>我的收藏 ({bookmarkedArticles.length})</Text>
          {bookmarkedArticles.length === 0 ? (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>暂无收藏文章</Text>
              <Text style={styles.emptySubtext}>收藏感兴趣的文章，方便随时查看</Text>
            </View>
          ) : (
            bookmarkedArticles.map(article => (
              <TouchableOpacity
                key={article.id}
                style={styles.articleItem}
                onPress={() => handleArticlePress(article)}
              >
                <View style={styles.articleContent}>
                  <Text style={styles.articleTitle} numberOfLines={2}>
                    {article.title}
                  </Text>
                  <Text style={styles.articleSummary} numberOfLines={2}>
                    {article.summary}
                  </Text>
                  <View style={styles.articleMeta}>
                    <Text style={styles.articleCategory}>
                      {getCategoryIcon(article.category)} {article.category}
                    </Text>
                    <Text style={styles.articleReadTime}>
                      📖 {article.readTime}分钟
                    </Text>
                  </View>
                </View>
                <View style={styles.articleActions}>
                  <TouchableOpacity
                    style={styles.bookmarkButton}
                    onPress={() => handleBookmark(article.id)}
                  >
                    <Text style={styles.bookmarkIcon}>🔖</Text>
                  </TouchableOpacity>
                </View>
              </TouchableOpacity>
            ))
          )}
        </Card>
      </ScrollView>
    );
  };

  return (
    <View style={[styles.container, style]}>
      <Card style={styles.headerCard}>
        <View style={styles.header}>
          <Text style={styles.title}>📚 孕期知识库</Text>
        </View>
        
        <View style={styles.tabBar}>
          {[
            { key: 'home', label: '首页' },
            { key: 'categories', label: '分类' },
            { key: 'search', label: '搜索' },
            { key: 'bookmarks', label: '收藏' }
          ].map(tab => (
            <TouchableOpacity
              key={tab.key}
              style={[
                styles.tab,
                activeTab === tab.key && styles.tabActive
              ]}
              onPress={() => setActiveTab(tab.key as any)}
            >
              <Text style={[
                styles.tabText,
                activeTab === tab.key && styles.tabTextActive
              ]}>
                {tab.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </Card>

      {activeTab === 'home' && renderHomeTab()}
      {activeTab === 'categories' && renderCategoriesTab()}
      {activeTab === 'search' && renderSearchTab()}
      {activeTab === 'bookmarks' && renderBookmarksTab()}

      {/* 文章详情模态框 */}
      {selectedArticle && (
        <Modal
          visible={!!selectedArticle}
          animationType="slide"
          presentationStyle="pageSheet"
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <TouchableOpacity onPress={() => setSelectedArticle(null)}>
                <Text style={styles.modalCancel}>关闭</Text>
              </TouchableOpacity>
              <Text style={styles.modalTitle}>文章详情</Text>
              <TouchableOpacity onPress={() => handleLike(selectedArticle.id)}>
                <Text style={styles.modalLike}>❤️ {selectedArticle.likes}</Text>
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.modalContent}>
              <View style={styles.articleDetailContainer}>
                <Text style={styles.articleDetailTitle}>
                  {selectedArticle.title}
                </Text>
                
                <View style={styles.articleDetailMeta}>
                  <Text style={styles.articleDetailCategory}>
                    {getCategoryIcon(selectedArticle.category)} {selectedArticle.category}
                  </Text>
                  <Text style={styles.articleDetailReadTime}>
                    📖 {selectedArticle.readTime}分钟阅读
                  </Text>
                  <Text style={styles.articleDetailAuthor}>
                    👨‍⚕️ {selectedArticle.author}
                  </Text>
                  <Text style={styles.articleDetailDate}>
                    📅 {selectedArticle.publishDate.toLocaleDateString('zh-CN')}
                  </Text>
                </View>

                <Text style={styles.articleDetailContent}>
                  {selectedArticle.content}
                </Text>

                <View style={styles.articleDetailActions}>
                  <TouchableOpacity
                    style={styles.bookmarkDetailButton}
                    onPress={() => handleBookmark(selectedArticle.id)}
                  >
                    <Text style={styles.bookmarkDetailText}>
                      {selectedArticle.isBookmarked ? '🔖 已收藏' : '📑 收藏'}
                    </Text>
                  </TouchableOpacity>
                  
                  <TouchableOpacity
                    style={styles.likeDetailButton}
                    onPress={() => handleLike(selectedArticle.id)}
                  >
                    <Text style={styles.likeDetailText}>
                      ❤️ 点赞 ({selectedArticle.likes})
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </ScrollView>
          </View>
        </Modal>
      )}
    </View>
  );
};

const styles = {
  container: {
    marginBottom: 16,
  },
  headerCard: {
    marginBottom: 12,
  },
  header: {
    marginBottom: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold' as const,
    color: Theme.Colors.neutral900,
  },
  tabBar: {
    flexDirection: 'row' as const,
    backgroundColor: Theme.Colors.neutral100,
    borderRadius: 8,
    padding: 4,
  },
  tab: {
    flex: 1,
    paddingVertical: 8,
    alignItems: 'center' as const,
    borderRadius: 6,
  },
  tabActive: {
    backgroundColor: 'white',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  tabText: {
    fontSize: 14,
    color: Theme.Colors.neutral500,
  },
  tabTextActive: {
    color: Theme.Colors.primary,
    fontWeight: '500' as const,
  },
  tabContent: {
    flex: 1,
  },
  searchCard: {
    marginBottom: 12,
  },
  searchContainer: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    gap: 8,
  },
  searchInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: Theme.Colors.neutral200,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: 14,
    color: Theme.Colors.neutral900,
  },
  searchButton: {
    width: 40,
    height: 40,
    borderRadius: 8,
    backgroundColor: Theme.Colors.primary,
    justifyContent: 'center' as const,
    alignItems: 'center' as const,
  },
  searchButtonText: {
    fontSize: 16,
  },
  categoriesCard: {
    marginBottom: 12,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: 'bold' as const,
    color: Theme.Colors.neutral900,
    marginBottom: 12,
  },
  categoriesGrid: {
    flexDirection: 'row' as const,
    flexWrap: 'wrap' as const,
    gap: 8,
  },
  categoryItem: {
    width: 100,
    alignItems: 'center' as const,
    padding: 12,
    borderRadius: 8,
  },
  categoryIcon: {
    fontSize: 24,
    marginBottom: 4,
  },
  categoryName: {
    fontSize: 12,
    fontWeight: '500' as const,
    color: Theme.Colors.neutral900,
    textAlign: 'center' as const,
    marginBottom: 2,
  },
  categoryCount: {
    fontSize: 10,
    color: Theme.Colors.neutral500,
  },
  articlesCard: {
    marginBottom: 12,
  },
  articleItem: {
    flexDirection: 'row' as const,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: Theme.Colors.neutral200,
  },
  articleContent: {
    flex: 1,
    marginRight: 12,
  },
  articleTitle: {
    fontSize: 14,
    fontWeight: '500' as const,
    color: Theme.Colors.neutral900,
    marginBottom: 4,
    lineHeight: 20,
  },
  articleSummary: {
    fontSize: 12,
    color: Theme.Colors.neutral600,
    lineHeight: 18,
    marginBottom: 8,
  },
  articleMeta: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    gap: 12,
  },
  articleCategory: {
    fontSize: 10,
    color: Theme.Colors.neutral500,
  },
  articleReadTime: {
    fontSize: 10,
    color: Theme.Colors.neutral500,
  },
  articleViews: {
    fontSize: 10,
    color: Theme.Colors.neutral500,
  },
  articleLikes: {
    fontSize: 10,
    color: Theme.Colors.neutral500,
  },
  articleDifficulty: {
    fontSize: 10,
    color: Theme.Colors.neutral500,
  },
  articleActions: {
    justifyContent: 'center' as const,
  },
  bookmarkButton: {
    padding: 4,
  },
  bookmarkIcon: {
    fontSize: 16,
  },
  faqCard: {
    marginBottom: 12,
  },
  faqItem: {
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: Theme.Colors.neutral200,
  },
  faqQuestion: {
    marginBottom: 8,
  },
  faqQuestionText: {
    fontSize: 14,
    fontWeight: '500' as const,
    color: Theme.Colors.neutral900,
  },
  faqAnswer: {
    fontSize: 13,
    color: Theme.Colors.neutral700,
    lineHeight: 18,
    marginBottom: 8,
  },
  faqActions: {
    flexDirection: 'row' as const,
    justifyContent: 'flex-end' as const,
  },
  helpfulButton: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    backgroundColor: Theme.Colors.neutral200,
  },
  helpfulButtonText: {
    fontSize: 12,
    color: Theme.Colors.neutral600,
  },
  helpfulButtonTextActive: {
    color: Theme.Colors.success,
  },
  categoriesListCard: {
    marginBottom: 12,
  },
  categoryListItem: {
    borderLeftWidth: 4,
    paddingLeft: 12,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: Theme.Colors.neutral200,
  },
  categoryListContent: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
  },
  categoryListIcon: {
    fontSize: 20,
    marginRight: 12,
  },
  categoryListInfo: {
    flex: 1,
  },
  categoryListName: {
    fontSize: 14,
    fontWeight: '500' as const,
    color: Theme.Colors.neutral900,
    marginBottom: 2,
  },
  categoryListDescription: {
    fontSize: 12,
    color: Theme.Colors.neutral600,
  },
  categoryListMeta: {
    alignItems: 'center' as const,
  },
  categoryListCount: {
    fontSize: 12,
    color: Theme.Colors.neutral500,
    marginBottom: 2,
  },
  categoryListArrow: {
    fontSize: 16,
    color: Theme.Colors.neutral400,
  },
  categoryDetailCard: {
    marginBottom: 12,
  },
  categoryDetailHeader: {
    alignItems: 'center' as const,
  },
  backButton: {
    alignSelf: 'flex-start' as const,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: Theme.Colors.neutral200,
    marginBottom: 16,
  },
  backButtonText: {
    fontSize: 14,
    color: Theme.Colors.neutral700,
  },
  categoryDetailInfo: {
    alignItems: 'center' as const,
  },
  categoryDetailIcon: {
    fontSize: 32,
    marginBottom: 8,
  },
  categoryDetailName: {
    fontSize: 18,
    fontWeight: 'bold' as const,
    color: Theme.Colors.neutral900,
    marginBottom: 4,
  },
  categoryDetailDescription: {
    fontSize: 14,
    color: Theme.Colors.neutral600,
    textAlign: 'center' as const,
  },
  searchResultsCard: {
    marginBottom: 12,
  },
  searchTime: {
    fontSize: 12,
    color: Theme.Colors.neutral500,
  },
  suggestionsCard: {
    marginBottom: 12,
  },
  suggestionsContainer: {
    flexDirection: 'row' as const,
    flexWrap: 'wrap' as const,
    gap: 8,
  },
  suggestionItem: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: Theme.Colors.neutral200,
  },
  suggestionText: {
    fontSize: 12,
    color: Theme.Colors.neutral700,
  },
  emptyContainer: {
    alignItems: 'center' as const,
    paddingVertical: 40,
  },
  emptyText: {
    fontSize: 16,
    color: Theme.Colors.neutral500,
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    color: Theme.Colors.neutral400,
    textAlign: 'center' as const,
  },
  // Modal styles
  modalContainer: {
    flex: 1,
    backgroundColor: 'white',
  },
  modalHeader: {
    flexDirection: 'row' as const,
    justifyContent: 'space-between' as const,
    alignItems: 'center' as const,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: Theme.Colors.neutral200,
  },
  modalCancel: {
    fontSize: 16,
    color: Theme.Colors.primary,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold' as const,
    color: Theme.Colors.neutral900,
  },
  modalLike: {
    fontSize: 14,
    color: Theme.Colors.error,
  },
  modalContent: {
    flex: 1,
  },
  articleDetailContainer: {
    padding: 16,
  },
  articleDetailTitle: {
    fontSize: 20,
    fontWeight: 'bold' as const,
    color: Theme.Colors.neutral900,
    lineHeight: 28,
    marginBottom: 16,
  },
  articleDetailMeta: {
    flexDirection: 'row' as const,
    flexWrap: 'wrap' as const,
    gap: 16,
    marginBottom: 20,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: Theme.Colors.neutral200,
  },
  articleDetailCategory: {
    fontSize: 12,
    color: Theme.Colors.neutral600,
  },
  articleDetailReadTime: {
    fontSize: 12,
    color: Theme.Colors.neutral600,
  },
  articleDetailAuthor: {
    fontSize: 12,
    color: Theme.Colors.neutral600,
  },
  articleDetailDate: {
    fontSize: 12,
    color: Theme.Colors.neutral600,
  },
  articleDetailContent: {
    fontSize: 16,
    lineHeight: 24,
    color: Theme.Colors.neutral800,
    marginBottom: 24,
  },
  articleDetailActions: {
    flexDirection: 'row' as const,
    justifyContent: 'space-around' as const,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: Theme.Colors.neutral200,
  },
  bookmarkDetailButton: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    backgroundColor: Theme.Colors.neutral200,
  },
  bookmarkDetailText: {
    fontSize: 14,
    color: Theme.Colors.neutral700,
  },
  likeDetailButton: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    backgroundColor: Theme.Colors.error + '20',
  },
  likeDetailText: {
    fontSize: 14,
    color: Theme.Colors.error,
  },
};

export default KnowledgeBase;