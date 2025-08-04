import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Modal,
  TextInput,
  Alert,
  Dimensions
} from 'react-native';
import Card from './ui/Card';
import Button from './ui/Button';
import Theme from '../constants/Theme';
import { 
  moodService, 
  MoodEntry, 
  MoodType, 
  MoodTrend, 
  MoodRecommendation 
} from '../services/moodService';

const { width } = Dimensions.get('window');

interface MoodDiaryProps {
  style?: any;
}

export const MoodDiary: React.FC<MoodDiaryProps> = ({ style }) => {
  const [moodHistory, setMoodHistory] = useState<MoodEntry[]>([]);
  const [moodTrend, setMoodTrend] = useState<MoodTrend | null>(null);
  const [recommendations, setRecommendations] = useState<MoodRecommendation[]>([]);
  const [showAddMood, setShowAddMood] = useState(false);
  const [selectedMood, setSelectedMood] = useState<MoodType | null>(null);
  const [moodIntensity, setMoodIntensity] = useState(3);
  const [moodNote, setMoodNote] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState<'today' | 'history' | 'trends'>('today');

  const moodTypes = moodService.getMoodTypes();
  const commonTags = moodService.getCommonTags();

  useEffect(() => {
    loadMoodData();
  }, []);

  const loadMoodData = () => {
    const history = moodService.getMoodHistory(30);
    setMoodHistory(history);
    
    if (history.length > 0) {
      const trend = moodService.analyzeMoodTrend(history, 'week');
      setMoodTrend(trend);
      
      const latestEntry = history[0];
      const recs = moodService.getMoodRecommendations(latestEntry.mood, latestEntry.intensity);
      setRecommendations(recs);
    }
  };

  const handleSaveMood = () => {
    if (!selectedMood) {
      Alert.alert('提示', '请选择一个心情');
      return;
    }

    const newEntry = moodService.saveMoodEntry({
      date: new Date(),
      mood: selectedMood,
      intensity: moodIntensity,
      note: moodNote,
      tags: selectedTags
    });

    setMoodHistory(prev => [newEntry, ...prev]);
    
    // 重新计算趋势和建议
    const updatedHistory = [newEntry, ...moodHistory];
    const trend = moodService.analyzeMoodTrend(updatedHistory, 'week');
    setMoodTrend(trend);
    
    const recs = moodService.getMoodRecommendations(selectedMood, moodIntensity);
    setRecommendations(recs);

    // 重置表单
    setSelectedMood(null);
    setMoodIntensity(3);
    setMoodNote('');
    setSelectedTags([]);
    setShowAddMood(false);

    Alert.alert('成功', '心情记录已保存');
  };

  const toggleTag = (tag: string) => {
    setSelectedTags(prev => 
      prev.includes(tag) 
        ? prev.filter(t => t !== tag)
        : [...prev, tag]
    );
  };

  const renderMoodSelector = () => (
    <View style={styles.moodGrid}>
      {moodTypes.map(mood => (
        <TouchableOpacity
          key={mood.id}
          style={[
            styles.moodItem,
            selectedMood?.id === mood.id && { 
              backgroundColor: mood.color + '20',
              borderColor: mood.color,
              borderWidth: 2
            }
          ]}
          onPress={() => setSelectedMood(mood)}
        >
          <Text style={styles.moodEmoji}>{mood.emoji}</Text>
          <Text style={styles.moodName}>{mood.name}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );

  const renderIntensitySelector = () => (
    <View style={styles.intensityContainer}>
      <Text style={styles.sectionTitle}>心情强度</Text>
      <View style={styles.intensityScale}>
        {[1, 2, 3, 4, 5].map(level => (
          <TouchableOpacity
            key={level}
            style={[
              styles.intensityButton,
              moodIntensity === level && styles.intensityButtonActive
            ]}
            onPress={() => setMoodIntensity(level)}
          >
            <Text style={[
              styles.intensityText,
              moodIntensity === level && styles.intensityTextActive
            ]}>
              {level}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
      <View style={styles.intensityLabels}>
        <Text style={styles.intensityLabel}>很低</Text>
        <Text style={styles.intensityLabel}>很高</Text>
      </View>
    </View>
  );

  const renderTagSelector = () => (
    <View style={styles.tagContainer}>
      <Text style={styles.sectionTitle}>相关标签</Text>
      <View style={styles.tagGrid}>
        {commonTags.slice(0, 12).map(tag => (
          <TouchableOpacity
            key={tag}
            style={[
              styles.tag,
              selectedTags.includes(tag) && styles.tagSelected
            ]}
            onPress={() => toggleTag(tag)}
          >
            <Text style={[
              styles.tagText,
              selectedTags.includes(tag) && styles.tagTextSelected
            ]}>
              {tag}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );

  const renderTodayView = () => {
    const todayEntry = moodHistory.find(entry => {
      const today = new Date();
      const entryDate = new Date(entry.date);
      return entryDate.toDateString() === today.toDateString();
    });

    return (
      <ScrollView style={styles.tabContent}>
        {todayEntry ? (
          <Card style={styles.todayMoodCard}>
            <View style={styles.todayMoodHeader}>
              <Text style={styles.todayMoodEmoji}>{todayEntry.mood.emoji}</Text>
              <View style={styles.todayMoodInfo}>
                <Text style={styles.todayMoodName}>{todayEntry.mood.name}</Text>
                <Text style={styles.todayMoodIntensity}>
                  强度: {todayEntry.intensity}/5
                </Text>
              </View>
            </View>
            {todayEntry.note && (
              <Text style={styles.todayMoodNote}>{todayEntry.note}</Text>
            )}
            {todayEntry.tags.length > 0 && (
              <View style={styles.todayMoodTags}>
                {todayEntry.tags.map(tag => (
                  <View key={tag} style={styles.todayMoodTag}>
                    <Text style={styles.todayMoodTagText}>{tag}</Text>
                  </View>
                ))}
              </View>
            )}
          </Card>
        ) : (
          <Card style={styles.noMoodCard}>
            <Text style={styles.noMoodText}>今天还没有记录心情</Text>
            <Button
              onPress={() => setShowAddMood(true)}
              style={styles.addMoodButton}
            >
              记录心情
            </Button>
          </Card>
        )}

        {recommendations.length > 0 && (
          <Card style={styles.recommendationsCard}>
            <Text style={styles.cardTitle}>💡 心情建议</Text>
            {recommendations.slice(0, 3).map((rec, index) => (
              <View key={index} style={styles.recommendationItem}>
                <Text style={styles.recommendationIcon}>{rec.icon}</Text>
                <View style={styles.recommendationContent}>
                  <Text style={styles.recommendationTitle}>{rec.title}</Text>
                  <Text style={styles.recommendationDescription}>
                    {rec.description}
                  </Text>
                </View>
              </View>
            ))}
          </Card>
        )}
      </ScrollView>
    );
  };

  const renderHistoryView = () => (
    <ScrollView style={styles.tabContent}>
      {moodHistory.slice(0, 10).map(entry => (
        <Card key={entry.id} style={styles.historyItem}>
          <View style={styles.historyHeader}>
            <View style={styles.historyMood}>
              <Text style={styles.historyEmoji}>{entry.mood.emoji}</Text>
              <Text style={styles.historyMoodName}>{entry.mood.name}</Text>
            </View>
            <Text style={styles.historyDate}>
              {new Date(entry.date).toLocaleDateString('zh-CN', {
                month: 'short',
                day: 'numeric'
              })}
            </Text>
          </View>
          {entry.note && (
            <Text style={styles.historyNote}>{entry.note}</Text>
          )}
          <View style={styles.historyIntensity}>
            <Text style={styles.historyIntensityText}>
              强度: {entry.intensity}/5
            </Text>
          </View>
        </Card>
      ))}
    </ScrollView>
  );

  const renderTrendsView = () => (
    <ScrollView style={styles.tabContent}>
      {moodTrend && (
        <>
          <Card style={styles.trendCard}>
            <Text style={styles.cardTitle}>📊 心情趋势</Text>
            <View style={styles.trendStats}>
              <View style={styles.trendStat}>
                <Text style={styles.trendStatValue}>
                  {moodTrend.averageMood.toFixed(1)}
                </Text>
                <Text style={styles.trendStatLabel}>平均心情</Text>
              </View>
              <View style={styles.trendStat}>
                <Text style={[
                  styles.trendStatValue,
                  moodTrend.trends.improving && { color: Theme.Colors.success },
                  moodTrend.trends.declining && { color: Theme.Colors.error }
                ]}>
                  {moodTrend.trends.improving ? '↗️' : 
                   moodTrend.trends.declining ? '↘️' : '➡️'}
                </Text>
                <Text style={styles.trendStatLabel}>
                  {moodTrend.trends.improving ? '上升' : 
                   moodTrend.trends.declining ? '下降' : '稳定'}
                </Text>
              </View>
            </View>
          </Card>

          <Card style={styles.insightsCard}>
            <Text style={styles.cardTitle}>💭 洞察分析</Text>
            {moodTrend.insights.map((insight, index) => (
              <View key={index} style={styles.insightItem}>
                <Text style={styles.insightText}>• {insight}</Text>
              </View>
            ))}
          </Card>

          <Card style={styles.distributionCard}>
            <Text style={styles.cardTitle}>📈 心情分布</Text>
            {Object.entries(moodTrend.moodDistribution).map(([mood, count]) => (
              <View key={mood} style={styles.distributionItem}>
                <Text style={styles.distributionMood}>{mood}</Text>
                <View style={styles.distributionBar}>
                  <View 
                    style={[
                      styles.distributionFill,
                      { 
                        width: `${(count / Math.max(...Object.values(moodTrend.moodDistribution))) * 100}%` 
                      }
                    ]} 
                  />
                </View>
                <Text style={styles.distributionCount}>{count}次</Text>
              </View>
            ))}
          </Card>
        </>
      )}
    </ScrollView>
  );

  return (
    <View style={[styles.container, style]}>
      <Card style={styles.headerCard}>
        <View style={styles.header}>
          <Text style={styles.title}>💝 情绪关怀</Text>
          <TouchableOpacity
            style={styles.addButton}
            onPress={() => setShowAddMood(true)}
          >
            <Text style={styles.addButtonText}>+ 记录</Text>
          </TouchableOpacity>
        </View>
        
        <View style={styles.tabBar}>
          {[
            { key: 'today', label: '今日' },
            { key: 'history', label: '历史' },
            { key: 'trends', label: '趋势' }
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

      {activeTab === 'today' && renderTodayView()}
      {activeTab === 'history' && renderHistoryView()}
      {activeTab === 'trends' && renderTrendsView()}

      {/* 添加心情模态框 */}
      <Modal
        visible={showAddMood}
        animationType="slide"
        presentationStyle="pageSheet"
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <TouchableOpacity onPress={() => setShowAddMood(false)}>
              <Text style={styles.modalCancel}>取消</Text>
            </TouchableOpacity>
            <Text style={styles.modalTitle}>记录心情</Text>
            <TouchableOpacity onPress={handleSaveMood}>
              <Text style={styles.modalSave}>保存</Text>
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.modalContent}>
            <Text style={styles.sectionTitle}>选择心情</Text>
            {renderMoodSelector()}
            
            {selectedMood && (
              <>
                {renderIntensitySelector()}
                
                <View style={styles.noteContainer}>
                  <Text style={styles.sectionTitle}>心情笔记</Text>
                  <TextInput
                    style={styles.noteInput}
                    placeholder="记录今天的感受和想法..."
                    multiline
                    numberOfLines={4}
                    value={moodNote}
                    onChangeText={setMoodNote}
                  />
                </View>

                {renderTagSelector()}
              </>
            )}
          </ScrollView>
        </View>
      </Modal>
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
    flexDirection: 'row' as const,
    justifyContent: 'space-between' as const,
    alignItems: 'center' as const,
    marginBottom: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold' as const,
    color: Theme.Colors.neutral900,
  },
  addButton: {
    backgroundColor: Theme.Colors.primary,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  addButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '500' as const,
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
  todayMoodCard: {
    marginBottom: 12,
  },
  todayMoodHeader: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    marginBottom: 12,
  },
  todayMoodEmoji: {
    fontSize: 32,
    marginRight: 12,
  },
  todayMoodInfo: {
    flex: 1,
  },
  todayMoodName: {
    fontSize: 18,
    fontWeight: 'bold' as const,
    color: Theme.Colors.neutral900,
  },
  todayMoodIntensity: {
    fontSize: 14,
    color: Theme.Colors.neutral500,
    marginTop: 2,
  },
  todayMoodNote: {
    fontSize: 14,
    color: Theme.Colors.neutral900,
    lineHeight: 20,
    marginBottom: 12,
  },
  todayMoodTags: {
    flexDirection: 'row' as const,
    flexWrap: 'wrap' as const,
    gap: 6,
  },
  todayMoodTag: {
    backgroundColor: Theme.Colors.neutral100,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  todayMoodTagText: {
    fontSize: 12,
    color: Theme.Colors.neutral500,
  },
  noMoodCard: {
    alignItems: 'center' as const,
    paddingVertical: 24,
    marginBottom: 12,
  },
  noMoodText: {
    fontSize: 16,
    color: Theme.Colors.neutral500,
    marginBottom: 16,
  },
  addMoodButton: {
    paddingHorizontal: 24,
  },
  recommendationsCard: {
    marginBottom: 12,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: 'bold' as const,
    color: Theme.Colors.neutral900,
    marginBottom: 12,
  },
  recommendationItem: {
    flexDirection: 'row' as const,
    alignItems: 'flex-start' as const,
    marginBottom: 12,
  },
  recommendationIcon: {
    fontSize: 20,
    marginRight: 12,
    marginTop: 2,
  },
  recommendationContent: {
    flex: 1,
  },
  recommendationTitle: {
    fontSize: 14,
    fontWeight: '500' as const,
    color: Theme.Colors.neutral900,
    marginBottom: 4,
  },
  recommendationDescription: {
    fontSize: 13,
    color: Theme.Colors.neutral500,
    lineHeight: 18,
  },
  historyItem: {
    marginBottom: 8,
  },
  historyHeader: {
    flexDirection: 'row' as const,
    justifyContent: 'space-between' as const,
    alignItems: 'center' as const,
    marginBottom: 8,
  },
  historyMood: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
  },
  historyEmoji: {
    fontSize: 20,
    marginRight: 8,
  },
  historyMoodName: {
    fontSize: 14,
    fontWeight: '500' as const,
    color: Theme.Colors.neutral900,
  },
  historyDate: {
    fontSize: 12,
    color: Theme.Colors.neutral500,
  },
  historyNote: {
    fontSize: 13,
    color: Theme.Colors.neutral900,
    lineHeight: 18,
    marginBottom: 8,
  },
  historyIntensity: {
    alignItems: 'flex-end' as const,
  },
  historyIntensityText: {
    fontSize: 12,
    color: Theme.Colors.neutral500,
  },
  trendCard: {
    marginBottom: 12,
  },
  trendStats: {
    flexDirection: 'row' as const,
    justifyContent: 'space-around' as const,
  },
  trendStat: {
    alignItems: 'center' as const,
  },
  trendStatValue: {
    fontSize: 24,
    fontWeight: 'bold' as const,
    color: Theme.Colors.primary,
    marginBottom: 4,
  },
  trendStatLabel: {
    fontSize: 12,
    color: Theme.Colors.neutral500,
  },
  insightsCard: {
    marginBottom: 12,
  },
  insightItem: {
    marginBottom: 8,
  },
  insightText: {
    fontSize: 14,
    color: Theme.Colors.neutral900,
    lineHeight: 20,
  },
  distributionCard: {
    marginBottom: 12,
  },
  distributionItem: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    marginBottom: 8,
  },
  distributionMood: {
    fontSize: 14,
    color: Theme.Colors.neutral900,
    width: 60,
  },
  distributionBar: {
    flex: 1,
    height: 8,
    backgroundColor: Theme.Colors.neutral100,
    borderRadius: 4,
    marginHorizontal: 12,
  },
  distributionFill: {
    height: 8,
    backgroundColor: Theme.Colors.primary,
    borderRadius: 4,
  },
  distributionCount: {
    fontSize: 12,
    color: Theme.Colors.neutral500,
    width: 30,
    textAlign: 'right' as const,
  },
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
    color: Theme.Colors.neutral500,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold' as const,
    color: Theme.Colors.neutral900,
  },
  modalSave: {
    fontSize: 16,
    color: Theme.Colors.primary,
    fontWeight: '500' as const,
  },
  modalContent: {
    flex: 1,
    padding: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold' as const,
    color: Theme.Colors.neutral900,
    marginBottom: 12,
    marginTop: 16,
  },
  moodGrid: {
    flexDirection: 'row' as const,
    flexWrap: 'wrap' as const,
    gap: 12,
    marginBottom: 16,
  },
  moodItem: {
    width: (width - 64) / 3,
    alignItems: 'center' as const,
    padding: 12,
    borderRadius: 12,
    backgroundColor: Theme.Colors.neutral100,
  },
  moodEmoji: {
    fontSize: 24,
    marginBottom: 4,
  },
  moodName: {
    fontSize: 12,
    color: Theme.Colors.neutral900,
    textAlign: 'center' as const,
  },
  intensityContainer: {
    marginBottom: 16,
  },
  intensityScale: {
    flexDirection: 'row' as const,
    justifyContent: 'space-between' as const,
    marginBottom: 8,
  },
  intensityButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Theme.Colors.neutral100,
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
  },
  intensityButtonActive: {
    backgroundColor: Theme.Colors.primary,
  },
  intensityText: {
    fontSize: 16,
    color: Theme.Colors.neutral900,
  },
  intensityTextActive: {
    color: 'white',
    fontWeight: 'bold' as const,
  },
  intensityLabels: {
    flexDirection: 'row' as const,
    justifyContent: 'space-between' as const,
  },
  intensityLabel: {
    fontSize: 12,
    color: Theme.Colors.neutral500,
  },
  noteContainer: {
    marginBottom: 16,
  },
  noteInput: {
    borderWidth: 1,
    borderColor: Theme.Colors.neutral200,
    borderRadius: 8,
    padding: 12,
    fontSize: 14,
    color: Theme.Colors.neutral900,
    textAlignVertical: 'top' as const,
    minHeight: 80,
  },
  tagContainer: {
    marginBottom: 16,
  },
  tagGrid: {
    flexDirection: 'row' as const,
    flexWrap: 'wrap' as const,
    gap: 8,
  },
  tag: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: Theme.Colors.neutral100,
    borderWidth: 1,
    borderColor: Theme.Colors.neutral200,
  },
  tagSelected: {
    backgroundColor: Theme.Colors.primary + '20',
    borderColor: Theme.Colors.primary,
  },
  tagText: {
    fontSize: 12,
    color: Theme.Colors.neutral900,
  },
  tagTextSelected: {
    color: Theme.Colors.primary,
    fontWeight: '500' as const,
  },
};