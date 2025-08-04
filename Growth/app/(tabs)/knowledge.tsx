import React from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Card, Input } from '@/components/ui';
import { Colors, Typography, Spacing } from '@/constants/Theme';
import { CommonStyles } from '@/constants/Styles';

export default function KnowledgeScreen() {
  return (
    <SafeAreaView style={CommonStyles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={CommonStyles.textH2}>知识库</Text>
          <Input 
            placeholder="搜索孕期知识..."
            style={styles.searchInput}
          />
        </View>

        {/* 今日推荐 */}
        <Card style={styles.card}>
          <Text style={CommonStyles.textH4}>📚 今日推荐</Text>
          <View style={styles.articleItem}>
            <View style={styles.articleImage}>
              <Text style={styles.articleEmoji}>🤱</Text>
            </View>
            <View style={styles.articleContent}>
              <Text style={CommonStyles.textBody}>孕24周：宝宝的听觉发育</Text>
              <Text style={CommonStyles.textBodySmall}>了解宝宝在第24周的发育特点，以及如何进行胎教</Text>
              <Text style={[CommonStyles.textCaption, { color: Colors.neutral500 }]}>阅读时间 5分钟</Text>
            </View>
          </View>
        </Card>

        {/* 分类浏览 */}
        <Card style={styles.card}>
          <Text style={CommonStyles.textH4}>🗂️ 分类浏览</Text>
          <View style={styles.categoryGrid}>
            <TouchableOpacity style={styles.categoryItem}>
              <Text style={styles.categoryEmoji}>🤰</Text>
              <Text style={CommonStyles.textBodySmall}>孕期变化</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.categoryItem}>
              <Text style={styles.categoryEmoji}>👶</Text>
              <Text style={CommonStyles.textBodySmall}>胎儿发育</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.categoryItem}>
              <Text style={styles.categoryEmoji}>🍎</Text>
              <Text style={CommonStyles.textBodySmall}>营养饮食</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.categoryItem}>
              <Text style={styles.categoryEmoji}>🏃‍♀️</Text>
              <Text style={CommonStyles.textBodySmall}>运动健身</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.categoryItem}>
              <Text style={styles.categoryEmoji}>🏥</Text>
              <Text style={CommonStyles.textBodySmall}>产检指南</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.categoryItem}>
              <Text style={styles.categoryEmoji}>🎵</Text>
              <Text style={CommonStyles.textBodySmall}>胎教音乐</Text>
            </TouchableOpacity>
          </View>
        </Card>

        {/* 热门文章 */}
        <Card style={styles.card}>
          <Text style={CommonStyles.textH4}>🔥 热门文章</Text>
          
          <TouchableOpacity style={styles.articleItem}>
            <View style={styles.articleRank}>
              <Text style={[CommonStyles.textBodySmall, { color: Colors.primary }]}>1</Text>
            </View>
            <View style={styles.articleContent}>
              <Text style={CommonStyles.textBody}>孕期营养搭配的黄金法则</Text>
              <Text style={CommonStyles.textBodySmall}>科学搭配营养，让宝宝健康成长</Text>
              <View style={styles.articleMeta}>
                <Text style={[CommonStyles.textCaption, { color: Colors.neutral500 }]}>1.2万阅读</Text>
                <Text style={[CommonStyles.textCaption, { color: Colors.neutral500 }]}>•</Text>
                <Text style={[CommonStyles.textCaption, { color: Colors.neutral500 }]}>昨天</Text>
              </View>
            </View>
          </TouchableOpacity>

          <TouchableOpacity style={styles.articleItem}>
            <View style={styles.articleRank}>
              <Text style={[CommonStyles.textBodySmall, { color: Colors.primary }]}>2</Text>
            </View>
            <View style={styles.articleContent}>
              <Text style={CommonStyles.textBody}>准爸爸必读：如何陪伴孕期</Text>
              <Text style={CommonStyles.textBodySmall}>给准爸爸的贴心指南</Text>
              <View style={styles.articleMeta}>
                <Text style={[CommonStyles.textCaption, { color: Colors.neutral500 }]}>8.5千阅读</Text>
                <Text style={[CommonStyles.textCaption, { color: Colors.neutral500 }]}>•</Text>
                <Text style={[CommonStyles.textCaption, { color: Colors.neutral500 }]}>2天前</Text>
              </View>
            </View>
          </TouchableOpacity>

          <TouchableOpacity style={styles.articleItem}>
            <View style={styles.articleRank}>
              <Text style={[CommonStyles.textBodySmall, { color: Colors.primary }]}>3</Text>
            </View>
            <View style={styles.articleContent}>
              <Text style={CommonStyles.textBody}>孕期常见不适及缓解方法</Text>
              <Text style={CommonStyles.textBodySmall}>专业医生教你应对孕期不适</Text>
              <View style={styles.articleMeta}>
                <Text style={[CommonStyles.textCaption, { color: Colors.neutral500 }]}>6.8千阅读</Text>
                <Text style={[CommonStyles.textCaption, { color: Colors.neutral500 }]}>•</Text>
                <Text style={[CommonStyles.textCaption, { color: Colors.neutral500 }]}>3天前</Text>
              </View>
            </View>
          </TouchableOpacity>
        </Card>

        {/* AI问答助手 */}
        <Card style={styles.card}>
          <Text style={CommonStyles.textH4}>🤖 AI问答助手</Text>
          <Text style={CommonStyles.textBodySmall}>有任何孕期问题，随时问我</Text>
          <TouchableOpacity style={styles.aiButton}>
            <Text style={[CommonStyles.textBody, { color: Colors.primary }]}>开始提问</Text>
          </TouchableOpacity>
        </Card>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
    paddingHorizontal: Spacing.pagePadding,
  },
  header: {
    paddingVertical: Spacing.lg,
  },
  searchInput: {
    marginTop: Spacing.md,
  },
  card: {
    marginBottom: Spacing.md,
  },
  articleItem: {
    flexDirection: 'row',
    marginTop: Spacing.md,
    alignItems: 'flex-start',
  },
  articleImage: {
    width: 48,
    height: 48,
    backgroundColor: Colors.neutral200,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Spacing.sm,
  },
  articleEmoji: {
    fontSize: 24,
  },
  articleContent: {
    flex: 1,
    gap: 4,
  },
  articleMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 4,
  },
  categoryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: Spacing.md,
    gap: Spacing.sm,
  },
  categoryItem: {
    width: '30%',
    aspectRatio: 1,
    backgroundColor: Colors.neutral200,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 4,
  },
  categoryEmoji: {
    fontSize: 24,
  },
  articleRank: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: Colors.primaryLight,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Spacing.sm,
  },
  aiButton: {
    marginTop: Spacing.md,
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.md,
    backgroundColor: Colors.primaryLight,
    borderRadius: 8,
    alignItems: 'center',
  },
});