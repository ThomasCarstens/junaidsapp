import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  StatusBar,
  Image,
} from 'react-native';

const NotifsScreen = () => {
  const [activeTab, setActiveTab] = useState('All');

  const notifications = [
    {
      id: 1,
      type: 'join',
      user: 'Tommy H.',
      additionalInfo: 'and 2 others',
      action: 'Joined the backpackers',
      time: '2h ago',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=50&h=50&fit=crop&crop=face',
      category: 'update'
    },
    {
      id: 2,
      type: 'request',
      user: 'Sarah J.',
      action: 'requests to join',
      details: 'for tennis match',
      time: '4h ago',
      avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=50&h=50&fit=crop&crop=face',
      category: 'request',
      hasActions: true
    },
    {
      id: 3,
      type: 'invite',
      user: 'Riya Sharma',
      action: 'wants to join your event',
      details: 'Weekend Hike to Savandurga',
      time: '4h ago',
      avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=50&h=50&fit=crop&crop=face',
      category: 'request',
      hasActions: true
    },
    {
      id: 4,
      type: 'success',
      user: 'Yayy',
      action: 'Pool Bash 2025 successfully completed',
      time: '1d ago',
      avatar: 'https://images.unsplash.com/photo-1530103862676-de8c9debad1d?w=50&h=50&fit=crop&crop=face',
      category: 'thisWeek'
    },
    {
      id: 5,
      type: 'success',
      user: 'Yayy',
      action: 'walk at marine drive successfully completed',
      time: '2d ago',
      avatar: 'https://images.unsplash.com/photo-1530103862676-de8c9debad1d?w=50&h=50&fit=crop&crop=face',
      category: 'thisWeek'
    },
    {
      id: 6,
      type: 'accepted',
      user: 'Tommy H.',
      action: 'accepted to join',
      details: 'for walk at marine drive',
      time: '2d ago',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=50&h=50&fit=crop&crop=face',
      category: 'thisWeek'
    }
  ];

  const tabs = ['All', 'Requests', 'Updates'];

  const filterNotifications = () => {
    if (activeTab === 'Requests') {
      return notifications.filter(notif => notif.category === 'request');
    }
    if (activeTab === 'Updates') {
      return notifications.filter(notif => notif.category === 'update' || notif.category === 'thisWeek');
    }
    return notifications;
  };

  const renderNotificationItem = (notification) => {
    return (
      <View key={notification.id} style={styles.notificationItem}>
        <View style={styles.avatarContainer}>
          <View style={styles.avatarPlaceholder}>
            <Text style={styles.avatarText}>
              {notification.user.charAt(0)}
            </Text>
          </View>
        </View>
        
        <View style={styles.notificationContent}>
          <View style={styles.notificationHeader}>
            <Text style={styles.notificationText}>
              <Text style={styles.userName}>{notification.user}</Text>
              {notification.additionalInfo && (
                <Text style={styles.additionalInfo}> {notification.additionalInfo}</Text>
              )}
            </Text>
            <Text style={styles.timeText}>{notification.time}</Text>
          </View>
          
          <Text style={styles.actionText}>
            {notification.action}
            {notification.details && (
              <Text style={styles.detailsText}> {notification.details}</Text>
            )}
          </Text>
          
          {notification.hasActions && (
            <View style={styles.actionButtons}>
              <TouchableOpacity style={styles.acceptButton}>
                <Text style={styles.acceptButtonText}>Accept</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.detailsButton}>
                <Text style={styles.detailsButtonText}>
                  {notification.type === 'invite' ? 'Decline' : 'Details'}
                </Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </View>
    );
  };

  const renderSection = (title, items) => {
    if (items.length === 0) return null;
    
    return (
      <View style={styles.section}>
        {title && <Text style={styles.sectionTitle}>{title}</Text>}
        {items.map(renderNotificationItem)}
      </View>
    );
  };

  const filteredNotifications = filterNotifications();
  const recentNotifications = filteredNotifications.filter(n => n.category !== 'thisWeek');
  const thisWeekNotifications = filteredNotifications.filter(n => n.category === 'thisWeek');

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />
      
      {/* Header Tabs */}
      <View style={styles.tabContainer}>
        {tabs.map((tab) => (
          <TouchableOpacity
            key={tab}
            style={[styles.tab, activeTab === tab && styles.activeTab]}
            onPress={() => setActiveTab(tab)}
          >
            <Text style={[styles.tabText, activeTab === tab && styles.activeTabText]}>
              {tab}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Notifications List */}
      <ScrollView style={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        {renderSection(null, recentNotifications)}
        {thisWeekNotifications.length > 0 && renderSection('This week', thisWeekNotifications)}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  tabContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  tab: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    marginRight: 30,
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: '#000',
  },
  tabText: {
    fontSize: 16,
    color: '#999',
    fontWeight: '400',
  },
  activeTabText: {
    color: '#000',
    fontWeight: '600',
  },
  scrollContainer: {
    flex: 1,
  },
  section: {
    paddingHorizontal: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#999',
    marginTop: 25,
    marginBottom: 15,
  },
  notificationItem: {
    flexDirection: 'row',
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#f8f8f8',
  },
  avatarContainer: {
    marginRight: 12,
  },
  avatarPlaceholder: {
    width: 45,
    height: 45,
    borderRadius: 22.5,
    backgroundColor: '#e0e0e0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#666',
  },
  notificationContent: {
    flex: 1,
  },
  notificationHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  notificationText: {
    flex: 1,
    fontSize: 15,
    fontWeight: '600',
    color: '#000',
  },
  userName: {
    fontWeight: '600',
    color: '#000',
  },
  additionalInfo: {
    fontWeight: '400',
    color: '#666',
  },
  timeText: {
    fontSize: 13,
    color: '#999',
    marginLeft: 8,
  },
  actionText: {
    fontSize: 14,
    color: '#666',
    marginBottom: 12,
    lineHeight: 18,
  },
  detailsText: {
    color: '#000',
    fontWeight: '500',
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  acceptButton: {
    backgroundColor: '#FFE5E5',
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 20,
  },
  acceptButtonText: {
    color: '#FF6B6B',
    fontSize: 14,
    fontWeight: '600',
  },
  detailsButton: {
    backgroundColor: '#f8f8f8',
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 20,
  },
  detailsButtonText: {
    color: '#666',
    fontSize: 14,
    fontWeight: '600',
  },
});

export default NotifsScreen;