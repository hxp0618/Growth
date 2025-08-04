import React from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors, Spacing } from '@/constants/Theme';
import { CommonStyles } from '@/constants/Styles';
import { HealthDataTracker } from '../../components/HealthDataTracker';

export default function HealthScreen() {
  return (
    <SafeAreaView style={CommonStyles.container}>
      <ScrollView 
        style={styles.scrollView} 
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <HealthDataTracker pregnancyWeek={28} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
    backgroundColor: Colors.neutral100,
  },
  scrollContent: {
    padding: Spacing.pagePadding,
  },
});