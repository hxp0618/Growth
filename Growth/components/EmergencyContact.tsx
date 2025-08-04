import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Modal,
  TextInput,
  Alert,
  Linking,
  Dimensions
} from 'react-native';
import Card from './ui/Card';
import Button from './ui/Button';
import Theme from '../constants/Theme';
import {
  emergencyContactService,
  EmergencyContact as EmergencyContactType,
  EmergencyScenario,
  EmergencyCall,
  EmergencyAlert
} from '../services/emergencyContactService';

interface EmergencyContactProps {
  style?: any;
}

const { width } = Dimensions.get('window');

export const EmergencyContact: React.FC<EmergencyContactProps> = ({ style }) => {
  const [contacts, setContacts] = useState<EmergencyContactType[]>([]);
  const [scenarios, setScenarios] = useState<EmergencyScenario[]>([]);
  const [callHistory, setCallHistory] = useState<EmergencyCall[]>([]);
  const [alerts, setAlerts] = useState<EmergencyAlert[]>([]);
  const [stats, setStats] = useState<any>(null);
  const [activeTab, setActiveTab] = useState<'emergency' | 'contacts' | 'history'>('emergency');
  const [showAddContactModal, setShowAddContactModal] = useState(false);
  const [showScenarioModal, setShowScenarioModal] = useState(false);
  const [selectedScenario, setSelectedScenario] = useState<EmergencyScenario | null>(null);
  const [isEmergencyActive, setIsEmergencyActive] = useState(false);
  
  // 新联系人表单状态
  const [newContactName, setNewContactName] = useState('');
  const [newContactPhone, setNewContactPhone] = useState('');
  const [newContactRelationship, setNewContactRelationship] = useState<EmergencyContactType['relationship']>('partner');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    const contactsData = emergencyContactService.getContacts();
    const scenariosData = emergencyContactService.getScenarios();
    const historyData = emergencyContactService.getCallHistory(10);
    const alertsData = emergencyContactService.getAlerts();
    const statsData = emergencyContactService.getEmergencyStats();

    setContacts(contactsData);
    setScenarios(scenariosData);
    setCallHistory(historyData);
    setAlerts(alertsData);
    setStats(statsData);
  };

  const handleEmergencyCall = async (contactId: string) => {
    try {
      setIsEmergencyActive(true);
      const call = await emergencyContactService.makeEmergencyCall(contactId);
      
      if (call.status === 'answered') {
        Alert.alert('通话成功', '已成功联系到紧急联系人');
      } else {
        Alert.alert('通话失败', '未能联系到该联系人，请尝试其他联系方式');
      }
      
      loadData();
    } catch (error) {
      Alert.alert('错误', '拨打电话失败，请检查网络连接');
    } finally {
      setIsEmergencyActive(false);
    }
  };

  const handleScenarioTrigger = async (scenario: EmergencyScenario) => {
    Alert.alert(
      `确认触发：${scenario.name}`,
      `${scenario.description}\n\n这将自动联系相关人员，确定要继续吗？`,
      [
        { text: '取消', style: 'cancel' },
        {
          text: '确认',
          style: 'destructive',
          onPress: async () => {
            try {
              setIsEmergencyActive(true);
              const calls = await emergencyContactService.triggerEmergencyScenario(scenario.id);
              
              Alert.alert(
                '紧急场景已触发',
                `已联系 ${calls.length} 个紧急联系人\n请保持手机畅通等待回复`
              );
              
              loadData();
            } catch (error) {
              Alert.alert('错误', '触发紧急场景失败');
            } finally {
              setIsEmergencyActive(false);
            }
          }
        }
      ]
    );
  };

  const handleAddContact = () => {
    if (!newContactName.trim() || !newContactPhone.trim()) {
      Alert.alert('提示', '请填写联系人姓名和电话号码');
      return;
    }

    const newContact = {
      name: newContactName.trim(),
      relationship: newContactRelationship,
      phoneNumber: newContactPhone.trim(),
      isPrimary: false,
      isAvailable24h: false,
      priority: contacts.length + 1
    };

    emergencyContactService.addContact(newContact);
    
    setNewContactName('');
    setNewContactPhone('');
    setNewContactRelationship('partner');
    setShowAddContactModal(false);
    
    loadData();
    Alert.alert('成功', '紧急联系人已添加');
  };

  const handleCallContact = async (phoneNumber: string) => {
    try {
      const url = `tel:${phoneNumber}`;
      const supported = await Linking.canOpenURL(url);
      
      if (supported) {
        await Linking.openURL(url);
      } else {
        Alert.alert('错误', '无法拨打电话');
      }
    } catch (error) {
      Alert.alert('错误', '拨打电话失败');
    }
  };

  const getSeverityColor = (severity: string): string => {
    return emergencyContactService.getSeverityColor(severity);
  };

  const getSeverityLabel = (severity: string): string => {
    return emergencyContactService.getSeverityLabel(severity);
  };

  const getRelationshipLabel = (relationship: string): string => {
    return emergencyContactService.getRelationshipDisplayName(relationship);
  };

  return (
    <View style={[styles.container, style]}>
      <Card style={styles.headerCard}>
        <View style={styles.header}>
          <Text style={styles.title}>🚨 紧急联系</Text>
        </View>
        
        <View style={styles.tabBar}>
          {[
            { key: 'emergency', label: '紧急' },
            { key: 'contacts', label: '联系人' },
            { key: 'history', label: '记录' }
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
        {activeTab === 'emergency' && (
          <>
            {/* 紧急呼叫按钮 */}
            <Card style={styles.emergencyCard}>
              <Text style={styles.cardTitle}>🚨 紧急呼叫</Text>
              <Text style={styles.emergencyDescription}>
                遇到紧急情况时，点击下方按钮快速联系紧急联系人
              </Text>
              
              <View style={styles.emergencyButtons}>
                {contacts.filter(c => c.isPrimary).slice(0, 3).map(contact => (
                  <TouchableOpacity
                    key={contact.id}
                    style={[styles.emergencyButton, isEmergencyActive && styles.emergencyButtonDisabled]}
                    onPress={() => handleEmergencyCall(contact.id)}
                    disabled={isEmergencyActive}
                  >
                    <Text style={styles.emergencyButtonIcon}>📞</Text>
                    <Text style={styles.emergencyButtonText}>{contact.name}</Text>
                    <Text style={styles.emergencyButtonSubtext}>
                      {getRelationshipLabel(contact.relationship)}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
              
              <TouchableOpacity
                style={[styles.call911Button, isEmergencyActive && styles.emergencyButtonDisabled]}
                onPress={() => handleCallContact('120')}
                disabled={isEmergencyActive}
              >
                <Text style={styles.call911Text}>🚑 拨打 120</Text>
              </TouchableOpacity>
            </Card>

            {/* 紧急场景 */}
            <Card style={styles.scenariosCard}>
              <Text style={styles.cardTitle}>⚡ 紧急场景</Text>
              <Text style={styles.scenariosDescription}>
                根据不同情况快速触发相应的紧急响应
              </Text>
              
              <View style={styles.scenariosGrid}>
                {scenarios.slice(0, 6).map(scenario => (
                  <TouchableOpacity
                    key={scenario.id}
                    style={[
                      styles.scenarioItem,
                      { borderColor: getSeverityColor(scenario.severity) },
                      isEmergencyActive && styles.scenarioItemDisabled
                    ]}
                    onPress={() => handleScenarioTrigger(scenario)}
                    disabled={isEmergencyActive}
                  >
                    <Text style={styles.scenarioIcon}>{scenario.icon}</Text>
                    <Text style={styles.scenarioName}>{scenario.name}</Text>
                    <View style={[
                      styles.severityBadge,
                      { backgroundColor: getSeverityColor(scenario.severity) + '20' }
                    ]}>
                      <Text style={[
                        styles.severityText,
                        { color: getSeverityColor(scenario.severity) }
                      ]}>
                        {getSeverityLabel(scenario.severity)}
                      </Text>
                    </View>
                  </TouchableOpacity>
                ))}
              </View>
            </Card>
          </>
        )}

        {activeTab === 'contacts' && (
          <>
            {/* 统计信息 */}
            {stats && (
              <Card style={styles.statsCard}>
                <Text style={styles.cardTitle}>📊 联系人统计</Text>
                <View style={styles.statsContainer}>
                  <View style={styles.statItem}>
                    <Text style={styles.statNumber}>{stats.totalContacts}</Text>
                    <Text style={styles.statLabel}>总联系人</Text>
                  </View>
                  <View style={styles.statItem}>
                    <Text style={styles.statNumber}>{stats.primaryContacts}</Text>
                    <Text style={styles.statLabel}>主要联系人</Text>
                  </View>
                  <View style={styles.statItem}>
                    <Text style={styles.statNumber}>{stats.available24hContacts}</Text>
                    <Text style={styles.statLabel}>24小时可用</Text>
                  </View>
                </View>
              </Card>
            )}

            {/* 联系人列表 */}
            <Card style={styles.contactsCard}>
              <View style={styles.contactsHeader}>
                <Text style={styles.cardTitle}>👥 紧急联系人</Text>
                <TouchableOpacity
                  style={styles.addButton}
                  onPress={() => setShowAddContactModal(true)}
                >
                  <Text style={styles.addButtonText}>+ 添加</Text>
                </TouchableOpacity>
              </View>
              
              {contacts.map(contact => (
                <View key={contact.id} style={styles.contactItem}>
                  <View style={styles.contactInfo}>
                    <Text style={styles.contactName}>{contact.name}</Text>
                    <Text style={styles.contactRelationship}>
                      {getRelationshipLabel(contact.relationship)}
                    </Text>
                    <Text style={styles.contactPhone}>{contact.phoneNumber}</Text>
                  </View>
                  
                  <View style={styles.contactActions}>
                    <TouchableOpacity
                      style={styles.callButton}
                      onPress={() => handleCallContact(contact.phoneNumber)}
                    >
                      <Text style={styles.callButtonText}>📞</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              ))}
            </Card>
          </>
        )}

        {activeTab === 'history' && (
          <Card style={styles.historyCard}>
            <Text style={styles.cardTitle}>📞 通话记录</Text>
            
            {callHistory.length === 0 ? (
              <View style={styles.emptyContainer}>
                <Text style={styles.emptyText}>暂无通话记录</Text>
                <Text style={styles.emptySubtext}>紧急呼叫记录将显示在这里</Text>
              </View>
            ) : (
              callHistory.map(call => {
                const contact = contacts.find(c => c.id === call.contactId);
                return (
                  <View key={call.id} style={styles.historyItem}>
                    <View style={styles.historyInfo}>
                      <Text style={styles.historyContactName}>
                        {contact?.name || '未知联系人'}
                      </Text>
                      <Text style={styles.historyTime}>
                        {call.timestamp.toLocaleString('zh-CN')}
                      </Text>
                      <Text style={[
                        styles.historyStatus,
                        { color: call.status === 'answered' ? Theme.Colors.success : Theme.Colors.error }
                      ]}>
                        {call.status === 'answered' ? '已接听' : '未接听'}
                      </Text>
                    </View>
                  </View>
                );
              })
            )}
          </Card>
        )}
      </ScrollView>

      {/* 添加联系人模态框 */}
      <Modal
        visible={showAddContactModal}
        animationType="slide"
        presentationStyle="pageSheet"
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <TouchableOpacity onPress={() => setShowAddContactModal(false)}>
              <Text style={styles.modalCancel}>取消</Text>
            </TouchableOpacity>
            <Text style={styles.modalTitle}>添加紧急联系人</Text>
            <TouchableOpacity onPress={handleAddContact}>
              <Text style={styles.modalSave}>保存</Text>
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.modalContent}>
            <View style={styles.formSection}>
              <Text style={styles.formLabel}>姓名 *</Text>
              <TextInput
                style={styles.input}
                value={newContactName}
                onChangeText={setNewContactName}
                placeholder="请输入联系人姓名"
              />
            </View>

            <View style={styles.formSection}>
              <Text style={styles.formLabel}>电话号码 *</Text>
              <TextInput
                style={styles.input}
                value={newContactPhone}
                onChangeText={setNewContactPhone}
                placeholder="请输入电话号码"
                keyboardType="phone-pad"
              />
            </View>

            <View style={styles.formSection}>
              <Text style={styles.formLabel}>关系</Text>
              <View style={styles.relationshipSelector}>
                {[
                  { key: 'partner', label: '配偶' },
                  { key: 'parent', label: '父母' },
                  { key: 'doctor', label: '医生' },
                  { key: 'hospital', label: '医院' },
                  { key: 'friend', label: '朋友' },
                  { key: 'other', label: '其他' }
                ].map(rel => (
                  <TouchableOpacity
                    key={rel.key}
                    style={[
                      styles.relationshipButton,
                      newContactRelationship === rel.key && styles.relationshipButtonActive
                    ]}
                    onPress={() => setNewContactRelationship(rel.key as any)}
                  >
                    <Text style={[
                      styles.relationshipButtonText,
                      newContactRelationship === rel.key && styles.relationshipButtonTextActive
                    ]}>
                      {rel.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
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
  emergencyCard: {
    marginBottom: 12,
    borderLeftWidth: 4,
    borderLeftColor: Theme.Colors.error,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: 'bold' as const,
    color: Theme.Colors.neutral900,
    marginBottom: 8,
  },
  emergencyDescription: {
    fontSize: 14,
    color: Theme.Colors.neutral700,
    lineHeight: 20,
    marginBottom: 16,
  },
  emergencyButtons: {
    flexDirection: 'row' as const,
    gap: 8,
    marginBottom: 16,
  },
  emergencyButton: {
    flex: 1,
    backgroundColor: Theme.Colors.error + '10',
    borderWidth: 2,
    borderColor: Theme.Colors.error,
    borderRadius: 12,
    padding: 12,
    alignItems: 'center' as const,
  },
  emergencyButtonDisabled: {
    opacity: 0.5,
  },
  emergencyButtonIcon: {
    fontSize: 24,
    marginBottom: 4,
  },
  emergencyButtonText: {
    fontSize: 12,
    fontWeight: 'bold' as const,
    color: Theme.Colors.error,
    marginBottom: 2,
  },
  emergencyButtonSubtext: {
    fontSize: 10,
    color: Theme.Colors.neutral600,
  },
  call911Button: {
    backgroundColor: Theme.Colors.error,
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center' as const,
  },
  call911Text: {
    fontSize: 16,
    fontWeight: 'bold' as const,
    color: 'white',
  },
  scenariosCard: {
    marginBottom: 12,
  },
  scenariosDescription: {
    fontSize: 14,
    color: Theme.Colors.neutral700,
    lineHeight: 20,
    marginBottom: 16,
  },
  scenariosGrid: {
    flexDirection: 'row' as const,
    flexWrap: 'wrap' as const,
    gap: 8,
  },
  scenarioItem: {
    width: (width - 64) / 2,
    borderWidth: 2,
    borderRadius: 12,
    padding: 12,
    alignItems: 'center' as const,
    backgroundColor: 'white',
  },
  scenarioItemDisabled: {
    opacity: 0.5,
  },
  scenarioIcon: {
    fontSize: 32,
    marginBottom: 8,
  },
  scenarioName: {
    fontSize: 12,
    fontWeight: '500' as const,
    color: Theme.Colors.neutral900,
    textAlign: 'center' as const,
    marginBottom: 8,
  },
  severityBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
  },
  severityText: {
    fontSize: 10,
    fontWeight: '500' as const,
  },
  statsCard: {
    marginBottom: 12,
  },
  statsContainer: {
    flexDirection: 'row' as const,
    justifyContent: 'space-around' as const,
  },
  statItem: {
    alignItems: 'center' as const,
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold' as const,
    color: Theme.Colors.primary,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: Theme.Colors.neutral600,
  },
  contactsCard: {
    marginBottom: 12,
  },
  contactsHeader: {
    flexDirection: 'row' as const,
    justifyContent: 'space-between' as const,
    alignItems: 'center' as const,
    marginBottom: 16,
  },
  addButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: Theme.Colors.primary,
    borderRadius: 16,
  },
  addButtonText: {
    fontSize: 12,
    color: 'white',
    fontWeight: '500' as const,
  },
  contactItem: {
    flexDirection: 'row' as const,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: Theme.Colors.neutral200,
  },
  contactInfo: {
    flex: 1,
  },
  contactName: {
    fontSize: 16,
    fontWeight: '500' as const,
    color: Theme.Colors.neutral900,
    marginBottom: 4,
  },
  contactRelationship: {
    fontSize: 12,
    color: Theme.Colors.neutral600,
    marginBottom: 2,
  },
  contactPhone: {
    fontSize: 14,
    color: Theme.Colors.neutral700,
  },
  contactActions: {
    justifyContent: 'center' as const,
  },
  callButton: {
    padding: 8,
    backgroundColor: Theme.Colors.primary + '20',
    borderRadius: 20,
  },
  callButtonText: {
    fontSize: 16,
  },
  historyCard: {
    marginBottom: 12,
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
  historyItem: {
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: Theme.Colors.neutral200,
  },
  historyInfo: {
    flex: 1,
  },
  historyContactName: {
    fontSize: 14,
    fontWeight: '500' as const,
    color: Theme.Colors.neutral900,
    marginBottom: 4,
  },
  historyTime: {
    fontSize: 12,
    color: Theme.Colors.neutral600,
    marginBottom: 2,
  },
  historyStatus: {
    fontSize: 12,
    fontWeight: '500' as const,
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
  relationshipSelector: {
    flexDirection: 'row' as const,
    flexWrap: 'wrap' as const,
    gap: 8,
  },
  relationshipButton: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 16,
    backgroundColor: Theme.Colors.neutral200,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  relationshipButtonActive: {
    backgroundColor: Theme.Colors.primary + '20',
    borderColor: Theme.Colors.primary,
  },
  relationshipButtonText: {
    fontSize: 14,
    color: Theme.Colors.neutral700,
  },
  relationshipButtonTextActive: {
    color: Theme.Colors.primary,
    fontWeight: '500' as const,
  },
};

export default EmergencyContact;