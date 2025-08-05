import { Tabs } from 'expo-router';
import React from 'react';
import { Platform, Dimensions } from 'react-native';

import { HapticTab } from '@/components/HapticTab';
import { IconSymbol } from '@/components/ui/IconSymbol';
import TabBarBackground from '@/components/ui/TabBarBackground';
import { Colors } from '@/constants/Theme';

const { width, height } = Dimensions.get('window');
const isSmallScreen = height < 700;
const isMobile = width < 768;
const isVerySmallScreen = height < 600;

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors.primary,
        tabBarInactiveTintColor: Colors.neutral500,
        headerShown: false,
        tabBarButton: HapticTab,
        tabBarBackground: TabBarBackground,
        tabBarStyle: {
          height: Platform.select({
            ios: isVerySmallScreen ? 70 : isSmallScreen ? 75 : 85,
            android: isVerySmallScreen ? 60 : isSmallScreen ? 65 : 75,
            web: isMobile ? (isVerySmallScreen ? 55 : 65) : 75,
          }),
          backgroundColor: Colors.neutral100,
          borderTopWidth: Platform.OS === 'web' ? 1 : 0.5,
          borderTopColor: Colors.neutral200,
          paddingBottom: Platform.select({
            ios: isVerySmallScreen ? 20 : isSmallScreen ? 25 : 30,
            android: isVerySmallScreen ? 8 : isSmallScreen ? 12 : 15,
            web: isMobile ? (isVerySmallScreen ? 8 : 12) : 15,
          }),
          paddingTop: Platform.select({
            ios: isVerySmallScreen ? 4 : isSmallScreen ? 6 : 8,
            android: isVerySmallScreen ? 4 : isSmallScreen ? 6 : 8,
            web: isMobile ? (isVerySmallScreen ? 4 : 6) : 8,
          }),
          paddingHorizontal: isMobile ? 4 : 16,
          ...Platform.select({
            ios: {
              shadowColor: Colors.neutral900,
              shadowOffset: { width: 0, height: -2 },
              shadowOpacity: 0.1,
              shadowRadius: 4,
            },
            android: {
              elevation: 8,
            },
            web: {
              boxShadow: isMobile
                ? '0 -2px 8px rgba(0,0,0,0.1)'
                : '0 -4px 12px rgba(0,0,0,0.1)',
              position: 'fixed',
              bottom: 0,
              left: 0,
              right: 0,
              zIndex: 1000,
            },
          }),
        },
        tabBarLabelStyle: {
          fontSize: Platform.select({
            ios: isVerySmallScreen ? 9 : isSmallScreen ? 10 : 11,
            android: isVerySmallScreen ? 9 : isSmallScreen ? 10 : 11,
            web: isMobile ? (isVerySmallScreen ? 8 : 9) : 11,
          }),
          fontWeight: '500',
          marginTop: Platform.select({
            ios: isVerySmallScreen ? 1 : isSmallScreen ? 2 : 3,
            android: isVerySmallScreen ? 1 : isSmallScreen ? 2 : 3,
            web: isMobile ? (isVerySmallScreen ? 1 : 2) : 3,
          }),
          lineHeight: Platform.select({
            ios: isVerySmallScreen ? 12 : isSmallScreen ? 14 : 16,
            android: isVerySmallScreen ? 12 : isSmallScreen ? 14 : 16,
            web: isMobile ? (isVerySmallScreen ? 10 : 12) : 16,
          }),
        },
        tabBarIconStyle: {
          marginBottom: Platform.select({
            ios: isVerySmallScreen ? 1 : isSmallScreen ? 2 : 3,
            android: isVerySmallScreen ? 1 : isSmallScreen ? 2 : 3,
            web: isMobile ? (isVerySmallScreen ? 1 : 2) : 3,
          }),
          width: Platform.select({
            ios: isVerySmallScreen ? 20 : isSmallScreen ? 22 : 24,
            android: isVerySmallScreen ? 20 : isSmallScreen ? 22 : 24,
            web: isMobile ? (isVerySmallScreen ? 18 : 20) : 24,
          }),
          height: Platform.select({
            ios: isVerySmallScreen ? 20 : isSmallScreen ? 22 : 24,
            android: isVerySmallScreen ? 20 : isSmallScreen ? 22 : 24,
            web: isMobile ? (isVerySmallScreen ? 18 : 20) : 24,
          }),
        },
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: '首页',
          tabBarIcon: ({ color }) => <IconSymbol size={24} name="house.fill" color={color} />,
        }}
      />
      <Tabs.Screen
        name="health"
        options={{
          title: '健康',
          tabBarIcon: ({ color }) => <IconSymbol size={24} name="heart.fill" color={color} />,
        }}
      />
      <Tabs.Screen
        name="collaboration"
        options={{
          title: '协作',
          tabBarIcon: ({ color }) => <IconSymbol size={24} name="person.2.fill" color={color} />,
        }}
      />
      <Tabs.Screen
        name="knowledge"
        options={{
          title: '知识',
          tabBarIcon: ({ color }) => <IconSymbol size={24} name="book.fill" color={color} />,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: '我的',
          tabBarIcon: ({ color }) => <IconSymbol size={24} name="person.fill" color={color} />,
        }}
      />
    </Tabs>
  );
}
