import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Modal,
  TextInput,
  Alert,
  Share,
  Dimensions
} from 'react-native';
import Card from './ui/Card';
import Button from './ui/Button';
import Theme from '../constants/Theme';
import {
  deliveryBagService,
  DeliveryBagItem,
  DeliveryBagCategory,
  DeliveryBagProgress,
  DeliveryBagTemplate
} from '../services/deliveryBagService';

interface DeliveryBagChecklistProps {
  pregnancyWeek?: number;
  style?: any;
}

const { width } = Dimensions.get('window');

export const DeliveryBagChecklist: React.FC<DeliveryBagChecklistProps> = ({
  pregnancyWeek = 32,
  style
}) => {
  const [items, setItems] = useState<DeliveryBagItem[]>([]);
  const [categories, setCategories] = useState<DeliveryBagCategory[]>([]);
  const [progress, setProgress] = useState<DeliveryBagProgress | null>(null);
  const [templates, setTemplates] = useState<DeliveryBagTemplate[]>([]);
  const [activeTab, setActiveTab] = useState<'checklist' | 'categories' | 'shopping' | 'templates'>('checklist');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newItemName, setNewItemName] = useState('');
  const [newItemQuantity, setNewItemQuantity] = useState('1');
  const [newItemUnit, setNewItemUnit] = useState('个');
  const [newItemCategory, setNewItemCategory] = useState<DeliveryBagItem['category']>('mother');
  const [newItemPriority, setNewItemPriority] = useState<DeliveryBagItem['priority']>('medium');
  const [newItemDescription, setNewItemDescription] = useState('');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    const itemsData = deliveryBagService.getItems();
    const categoriesData = deliveryBagService.getCategories();
    const progressData = deliveryBagService.getProgress();
    const templatesData = deliveryBagService.getTemplates();

    setItems(itemsData);
    setCategories(categoriesData);
    setProgress(progressData);
    setTemplates(templatesData);
  };

  const handleToggleChecked = (itemId: string) => {
    const isChecked = deliveryBagService.toggleItemChecked(itemId);
    loadData();
    
    const item = items.find(i => i.id === itemId);
    if (item && isChecked) {
      Alert.alert('恭喜！', `${item.name} 已完成准备 🎉`);
    }
  };

  const handleTogglePurchased = (itemId: string) => {
    deliveryBagService.toggleItemPurchased(itemId);
    loadData();
  };

  const handleAddCustomItem = () => {
    if (!newItemName.trim()) {
      Alert.alert('提示', '请输入物品名称');
      return;
    }

    const quantity = parseInt(newItemQuantity) || 1;
    
    const newItem = {
      name: newItemName.trim(),
      category: newItemCategory,
      quantity,
      unit: newItemUnit,
      priority: newItemPriority,
      description: newItemDescription.trim() || undefined,
      pregnancyWeekStart: pregnancyWeek,
      pregnancyWeekEnd: pregnancyWeek + 4,
      estimatedPrice: 0
    };

    deliveryBagService.addCustomItem(newItem);
    
    setNewItemName('');
    setNewItemQuantity('1');
    setNewItemUnit('个');
    setNewItemCategory('mother');
    setNewItemPriority('medium');
    setNewItemDescription('');
    setShowAddModal(false);
    
    loadData();
    Alert.alert('成功', '自定义物品已添加到清单');
  };

  const handleApplyTemplate = (templateId: string) => {
    Alert.alert(
      '应用模板',
      '选择应用方式',
      [
        { text: '取消', style: 'cancel' },
        { 
          text: '合并到现有清单', 
          onPress: () => {
            deliveryBagService.applyTemplate(templateId, false);
            loadData();
            Alert.alert('成功', '模板已合并到现有清单');
          }
        },
        { 
          text: '替换现有清单', 
          style: 'destructive',
          onPress: () => {
            deliveryBagService.applyTemplate(templateId, true);
            loadData();
            Alert.alert('成功', '清单已替换为模板内容');
          }
        }
      ]
    );
  };

  const handleShareList = async () => {
    try {
      const exportText = deliveryBagService.exportList();
      await Share.share({
        message: exportText,
        title: '待产包清单'
      });
    } catch (error) {
      Alert.alert('错误', '分享失败');
    }
  };

  const getPriorityColor = (priority: string): string => {
    switch (priority) {
      case 'high': return Theme.Colors.error;
      case 'medium': return Theme.Colors.warning;
      case 'low': return Theme.Colors.info;
      default: return Theme.Colors.neutral500;
    }
  };

  const getPriorityLabel = (priority: string): string => {
    switch (priority) {
      case 'high': return '高';
      case 'medium': return '中';
      case 'low': return '低';
      default: return '中';
    }
  };

  return (
    <View style={[styles.container, style]}>
      <Card style={styles.headerCard}>
        <View style={styles.header}>
          <Text style={styles.title}>📦 待产包清单</Text>
        </View>
        
        <View style={styles.tabBar}>
          {[
            { key: 'checklist', label: '清单' },
            { key: 'categories', label: '分类' },
            { key: 'shopping', label: '购物' },
            { key: 'templates', label: '模板' }
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

      <ScrollView style={styles.tabContent}>
        {/* 进度概览 */}
        {progress && (
          <Card style={styles.progressCard}>
            <View style={styles.progressHeader}>
              <Text style={styles.cardTitle}>📋 准备进度</Text>
              <TouchableOpacity onPress={handleShareList}>
                <Text style={styles.shareButton}>分享</Text>
              </TouchableOpacity>
            </View>
            
            <View style={styles.progressContainer}>
              <View style={styles.progressCircle}>
                <Text style={styles.progressNumber}>{progress.completionRate}%</Text>
                <Text style={styles.progressLabel}>完成度</Text>
              </View>
              <View style={styles.progressInfo}>
                <Text style={styles.progressText}>
                  已完成 {progress.checkedItems}/{progress.totalItems} 项
                </Text>
                <Text style={styles.progressText}>
                  已购买 {progress.purchasedItems} 项
                </Text>
                <View style={styles.progressBar}>
                  <View 
                    style={[
                      styles.progressFill,
                      { width: `${progress.completionRate}%` }
                    ]} 
                  />
                </View>
              </View>
            </View>
          </Card>
        )}

        {/* 完整清单 */}
        <Card style={styles.fullListCard}>
          <Text style={styles.cardTitle}>📝 完整清单</Text>
          {items.map(item => (
            <View key={item.id} style={styles.listItem}>
              <TouchableOpacity
                style={styles.itemCheckbox}
                onPress={() => handleToggleChecked(item.id)}
              >
                <Text style={styles.checkboxIcon}>
                  {item.isChecked ? '✅' : '⬜'}
                </Text>
              </TouchableOpacity>
              
              <View style={styles.itemContent}>
                <View style={styles.itemHeader}>
                  <Text style={[styles.itemName, item.isChecked && styles.itemNameChecked]}>
                    {item.name}
                  </Text>
                  <View style={styles.itemBadges}>
                    <View style={[styles.priorityBadge, { backgroundColor: getPriorityColor(item.priority) + '20' }]}>
                      <Text style={[styles.priorityText, { color: getPriorityColor(item.priority) }]}>
                        {getPriorityLabel(item.priority)}
                      </Text>
                    </View>
                    {item.isPurchased && (
                      <View style={styles.purchasedBadge}>
                        <Text style={styles.purchasedText}>已购买</Text>
                      </View>
                    )}
                  </View>
                </View>
                
                <Text style={styles.itemQuantity}>
                  数量: {item.quantity}{item.unit}
                </Text>
                
                {item.description && (
                  <Text style={styles.itemDescription}>{item.description}</Text>
                )}
                
                {item.tips && (
                  <Text style={styles.itemTips}>💡 {item.tips}</Text>
                )}
                
                {item.estimatedPrice && item.estimatedPrice > 0 && (
                  <Text style={styles.itemPrice}>预估价格: ¥{item.estimatedPrice}</Text>
                )}
              </View>
              
              <TouchableOpacity
                style={styles.purchaseButton}
                onPress={() => handleTogglePurchased(item.id)}
              >
                <Text style={styles.purchaseIcon}>
                  {item.isPurchased ? '🛒' : '🛍️'}
                </Text>
              </TouchableOpacity>
            </View>
          ))}
        </Card>
      </ScrollView>

      {/* 添加自定义物品按钮 */}
      <TouchableOpacity
        style={styles.addButton}
        onPress={() => setShowAddModal(true)}
      >
        <Text style={styles.addButtonText}>+</Text>
      </TouchableOpacity>

      {/* 添加自定义物品模态框 */}
      <Modal
        visible={showAddModal}
        animationType="slide"
        presentationStyle="pageSheet"
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <TouchableOpacity onPress={() => setShowAddModal(false)}>
              <Text style={styles.modalCancel}>取消</Text>
            </TouchableOpacity>
            <Text style={styles.modalTitle}>添加自定义物品</Text>
            <TouchableOpacity onPress={handleAddCustomItem}>
              <Text style={styles.modalSave}>保存</Text>
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.modalContent}>
            <View style={styles.formSection}>
              <Text style={styles.formLabel}>物品名称</Text>
              <TextInput
                style={styles.input}
                value={newItemName}
                onChangeText={setNewItemName}
                placeholder="请输入物品名称"
              />
            </View>

            <View style={styles.formRow}>
              <View style={styles.formHalf}>
                <Text style={styles.formLabel}>数量</Text>
                <TextInput
                  style={styles.input}
                  value={newItemQuantity}
                  onChangeText={setNewItemQuantity}
                  placeholder="1"
                  keyboardType="numeric"
                />
              </View>
              
              <View style={styles.formHalf}>
                <Text style={styles.formLabel}>单位</Text>
                <TextInput
                  style={styles.input}
                  value={newItemUnit}
                  onChangeText={setNewItemUnit}
                  placeholder="个"
                />
              </View>
            </View>

            <View style={styles.formSection}>
              <Text style={styles.formLabel}>分类</Text>
              <View style={styles.categorySelector}>
                {[
                  { key: 'mother', label: '妈妈用品', icon: '🤱' },
                  { key: 'baby', label: '宝宝用品', icon: '👶' },
                  { key: 'hospital', label: '医院用品', icon: '🏥' },
                  { key: 'postpartum', label: '产后用品', icon: '🏠' }
                ].map(cat => (
                  <TouchableOpacity
                    key={cat.key}
                    style={[
                      styles.categoryButton,
                      newItemCategory === cat.key && styles.categoryButtonActive
                    ]}
                    onPress={() => setNewItemCategory(cat.key as any)}
                  >
                    <Text style={styles.categoryButtonIcon}>{cat.icon}</Text>
                    <Text style={[
                      styles.categoryButtonText,
                      newItemCategory === cat.key && styles.categoryButtonTextActive
                    ]}>
                      {cat.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <View style={styles.formSection}>
              <Text style={styles.formLabel}>优先级</Text>
              <View style={styles.prioritySelector}>
                {[
                  { key: 'high', label: '高', color: Theme.Colors.error },
                  { key: 'medium', label: '中', color: Theme.Colors.warning },
                  { key: 'low', label: '低', color: Theme.Colors.info }
                ].map(priority => (
                  <TouchableOpacity
                    key={priority.key}
                    style={[
                      styles.priorityButton,
                      { borderColor: priority.color },
                      newItemPriority === priority.key && { backgroundColor: priority.color + '20' }
                    ]}
                    onPress={() => setNewItemPriority(priority.key as any)}
                  >
                    <Text style={[
                      styles.priorityButtonText,
                      { color: priority.color },
                      newItemPriority === priority.key && styles.priorityButtonTextActive
                    ]}>
                      {priority.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <View style={styles.formSection}>
              <Text style={styles.formLabel}>描述（可选）</Text>
              <TextInput
                style={[styles.input, styles.textArea]}
                value={newItemDescription}
                onChangeText={setNewItemDescription}
                placeholder="添加物品描述或购买建议..."
                multiline
                numberOfLines={3}
              />
            </View>
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
  progressCard: {
    marginBottom: 12,
  },
  progressHeader: {
    flexDirection: 'row' as const,
    justifyContent: 'space-between' as const,
    alignItems: 'center' as const,
    marginBottom: 16,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: 'bold' as const,
    color: Theme.Colors.neutral900,
  },
  shareButton: {
    fontSize: 14,
    color: Theme.Colors.primary,
    fontWeight: '500' as const,
  },
  progressContainer: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
  },
  progressCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: Theme.Colors.primary + '20',
    justifyContent: 'center' as const,
    alignItems: 'center' as const,
    marginRight: 16,
  },
  progressNumber: {
    fontSize: 24,
    fontWeight: 'bold' as const,
    color: Theme.Colors.primary,
  },
  progressLabel: {
    fontSize: 10,
    color: Theme.Colors.neutral600,
  },
  progressInfo: {
    flex: 1,
  },
  progressText: {
    fontSize: 14,
    color: Theme.Colors.neutral700,
    marginBottom: 4,
  },
  progressBar: {
    height: 8,
    backgroundColor: Theme.Colors.neutral200,
    borderRadius: 4,
    marginTop: 8,
  },
  progressFill: {
    height: 8,
    backgroundColor: Theme.Colors.primary,
    borderRadius: 4,
  },
  fullListCard: {
    marginBottom: 12,
  },
  listItem: {
    flexDirection: 'row' as const,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: Theme.Colors.neutral200,
  },
  itemCheckbox: {
    marginRight: 12,
  },
  checkboxIcon: {
    fontSize: 20,
  },
  itemContent: {
    flex: 1,
  },
  itemHeader: {
    flexDirection: 'row' as const,
    justifyContent: 'space-between' as const,
    alignItems: 'flex-start' as const,
    marginBottom: 4,
  },
  itemName: {
    fontSize: 14,
    fontWeight: '500' as const,
    color: Theme.Colors.neutral900,
    flex: 1,
    marginRight: 8,
  },
  itemNameChecked: {
    textDecorationLine: 'line-through' as const,
    color: Theme.Colors.neutral500,
  },
  itemBadges: {
    flexDirection: 'row' as const,
    gap: 4,
  },
  priorityBadge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
  },
  priorityText: {
    fontSize: 10,
    fontWeight: '500' as const,
  },
  purchasedBadge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
    backgroundColor: Theme.Colors.success + '20',
  },
  purchasedText: {
    fontSize: 10,
    color: Theme.Colors.success,
    fontWeight: '500' as const,
  },
  itemQuantity: {
    fontSize: 12,
    color: Theme.Colors.neutral600,
    marginBottom: 4,
  },
  itemDescription: {
    fontSize: 12,
    color: Theme.Colors.neutral700,
    lineHeight: 16,
    marginBottom: 4,
  },
  itemTips: {
    fontSize: 11,
    color: Theme.Colors.info,
    fontStyle: 'italic' as const,
    marginBottom: 4,
  },
  itemPrice: {
    fontSize: 12,
    color: Theme.Colors.warning,
    fontWeight: '500' as const,
  },
  purchaseButton: {
    padding: 4,
    justifyContent: 'center' as const,
  },
  purchaseIcon: {
    fontSize: 20,
  },
  addButton: {
    position: 'absolute' as const,
    right: 16,
    bottom: 16,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: Theme.Colors.primary,
    justifyContent: 'center' as const,
    alignItems: 'center' as const,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  addButtonText: {
    fontSize: 24,
    color: 'white',
    fontWeight: 'bold' as const,
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
    color: Theme.Colors.neutral600,
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
  formSection: {
    marginBottom: 20,
  },
  formRow: {
    flexDirection: 'row' as const,
    gap: 12,
    marginBottom: 20,
  },
  formHalf: {
    flex: 1,
  },
  formLabel: {
    fontSize: 16,
    fontWeight: '500' as const,
    color: Theme.Colors.neutral900,
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: Theme.Colors.neutral200,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
    fontSize: 16,
    color: Theme.Colors.neutral900,
    backgroundColor: 'white',
  },
  textArea: {
    height: 80,
    textAlignVertical: 'top' as const,
  },
  categorySelector: {
    flexDirection: 'row' as const,
    flexWrap: 'wrap' as const,
    gap: 8,
  },
  categoryButton: {
    width: (width - 64) / 2,
    padding: 12,
    borderRadius: 8,
    backgroundColor: Theme.Colors.neutral100,
    alignItems: 'center' as const,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  categoryButtonActive: {
    backgroundColor: Theme.Colors.primary + '20',
    borderColor: Theme.Colors.primary,
  },
  categoryButtonIcon: {
    fontSize: 24,
    marginBottom: 4,
  },
  categoryButtonText: {
    fontSize: 12,
    color: Theme.Colors.neutral700,
    textAlign: 'center' as const,
  },
  categoryButtonTextActive: {
    color: Theme.Colors.primary,
    fontWeight: '500' as const,
  },
  prioritySelector: {
    flexDirection: 'row' as const,
    gap: 8,
  },
  priorityButton: {
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    borderWidth: 1,
    alignItems: 'center' as const,
  },
  priorityButtonText: {
    fontSize: 14,
    fontWeight: '500' as const,
  },
  priorityButtonTextActive: {
    fontWeight: 'bold' as const,
  },
};

export default DeliveryBagChecklist;