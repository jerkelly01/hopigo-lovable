import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, RefreshControl, Alert } from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Check, Trash2, ArrowLeft, Bell } from 'lucide-react-native';
import Colors from '@/constants/colors';
import { useNotificationStore } from '@/store/notification-store';
import NotificationItem from '@/components/NotificationItem';
import { Notification } from '@/mocks/notifications';

export default function NotificationsScreen() {
  const router = useRouter();
  const { 
    notifications, 
    unreadCount, 
    markAsRead, 
    markAllAsRead, 
    deleteNotification, 
    clearAll 
  } = useNotificationStore();
  
  const [refreshing, setRefreshing] = useState(false);
  
  const onRefresh = useCallback(() => {
    setRefreshing(true);
    // Simulate fetching new notifications
    setTimeout(() => {
      setRefreshing(false);
    }, 1500);
  }, []);
  
  const handleMarkAllAsRead = () => {
    if (unreadCount === 0) {
      Alert.alert('No unread notifications', 'All notifications are already read.');
      return;
    }
    
    Alert.alert(
      'Mark all as read',
      'Are you sure you want to mark all notifications as read?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Mark all', onPress: markAllAsRead }
      ]
    );
  };
  
  const handleClearAll = () => {
    if (notifications.length === 0) {
      Alert.alert('No notifications', 'You have no notifications to clear.');
      return;
    }
    
    Alert.alert(
      'Clear all notifications',
      'Are you sure you want to delete all notifications? This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Clear all', style: 'destructive', onPress: clearAll }
      ]
    );
  };
  
  const renderItem = ({ item }: { item: Notification }) => (
    <NotificationItem 
      notification={item} 
      onMarkAsRead={markAsRead}
      onDelete={deleteNotification}
    />
  );
  
  const renderEmptyState = () => (
    <View style={styles.emptyContainer}>
      <Bell size={64} color={Colors.textSecondary} />
      <Text style={styles.emptyTitle}>No notifications</Text>
      <Text style={styles.emptySubtitle}>
        You don't have any notifications yet. We'll notify you when something important happens.
      </Text>
    </View>
  );
  
  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <Stack.Screen 
        options={{
          title: 'Notifications',
          headerTitleStyle: {
            fontWeight: '600',
            fontSize: 18,
            color: '#FFFFFF',
          },
          headerBackground: () => (
            <LinearGradient
              colors={['#5de0e6', '#004aad']}
              start={[0, 0]}
              end={[1, 0]}
              style={{ flex: 1 }}
            />
          ),
          headerLeft: () => (
            <TouchableOpacity onPress={() => router.back()}>
              <ArrowLeft size={24} color="#FFFFFF" />
            </TouchableOpacity>
          ),
          headerRight: () => (
            <View style={styles.headerButtons}>
              <TouchableOpacity 
                style={styles.headerButton} 
                onPress={handleMarkAllAsRead}
                disabled={unreadCount === 0}
              >
                <Check size={20} color={unreadCount > 0 ? "#FFFFFF" : "rgba(255,255,255,0.5)"} />
              </TouchableOpacity>
              <TouchableOpacity 
                style={styles.headerButton} 
                onPress={handleClearAll}
                disabled={notifications.length === 0}
              >
                <Trash2 size={20} color={notifications.length > 0 ? "#FFFFFF" : "rgba(255,255,255,0.5)"} />
              </TouchableOpacity>
            </View>
          ),
        }}
      />
      
      {unreadCount > 0 && (
        <View style={styles.unreadBanner}>
          <Text style={styles.unreadText}>
            You have {unreadCount} unread notification{unreadCount !== 1 ? 's' : ''}
          </Text>
        </View>
      )}
      
      <FlatList
        data={notifications}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={notifications.length === 0 ? styles.emptyList : styles.list}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={[Colors.primary]}
            tintColor={Colors.primary}
          />
        }
        ListEmptyComponent={renderEmptyState}
        removeClippedSubviews={false}
        scrollEventThrottle={16}
        decelerationRate="normal"
        bounces={true}
        bouncesZoom={false}
        alwaysBounceVertical={false}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  headerButtons: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerButton: {
    padding: 8,
    marginLeft: 8,
  },
  unreadBanner: {
    backgroundColor: Colors.primary,
    padding: 12,
    alignItems: 'center',
  },
  unreadText: {
    color: Colors.white,
    fontWeight: '500',
  },
  list: {
    paddingBottom: 20,
  },
  emptyList: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: Colors.text,
    marginTop: 16,
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 16,
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
  },
});