import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform } from 'react-native';
import { Bell, CreditCard, Calendar, Gift, AlertCircle, ChevronRight, AlertTriangle } from 'lucide-react-native';
import Colors from '@/constants/colors';
import { Notification, NotificationType } from '@/mocks/notifications';
import { useRouter } from 'expo-router';

interface NotificationItemProps {
  notification: Notification;
  onMarkAsRead: (id: string) => void;
  onDelete: (id: string) => void;
}

const NotificationItem: React.FC<NotificationItemProps> = ({ 
  notification, 
  onMarkAsRead,
  onDelete
}) => {
  const router = useRouter();
  
  const getIcon = (type: NotificationType) => {
    switch (type) {
      case 'payment':
        return <CreditCard size={24} color={Colors.primary} />;
      case 'booking':
        return <Calendar size={24} color={Colors.primary} />;
      case 'promotion':
        return <Gift size={24} color={Colors.primary} />;
      case 'urgent-service':
        return <AlertTriangle size={24} color={Colors.error} />;
      case 'system':
      default:
        return <Bell size={24} color={Colors.primary} />;
    }
  };
  
  const formatTime = (date: Date) => {
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    
    if (diffMins < 60) {
      return `${diffMins} min${diffMins !== 1 ? 's' : ''} ago`;
    } else if (diffHours < 24) {
      return `${diffHours} hour${diffHours !== 1 ? 's' : ''} ago`;
    } else {
      return `${diffDays} day${diffDays !== 1 ? 's' : ''} ago`;
    }
  };
  
  const handlePress = () => {
    if (!notification.isRead) {
      onMarkAsRead(notification.id);
    }
    
    // Navigate to relevant screen based on notification type
    if (notification.actionUrl) {
      router.push(notification.actionUrl);
    }
  };
  
  return (
    <TouchableOpacity 
      style={[
        styles.container, 
        !notification.isRead && styles.unreadContainer,
        notification.type === 'urgent-service' && styles.urgentContainer
      ]}
      onPress={handlePress}
      activeOpacity={0.7}
    >
      <View style={styles.iconContainer}>
        {getIcon(notification.type)}
        {!notification.isRead && <View style={styles.unreadDot} />}
      </View>
      
      <View style={styles.contentContainer}>
        <View style={styles.headerRow}>
          <Text style={[styles.title, notification.type === 'urgent-service' && styles.urgentTitle]}>
            {notification.title}
          </Text>
          <Text style={styles.time}>{formatTime(notification.timestamp)}</Text>
        </View>
        
        <Text style={styles.message} numberOfLines={2}>
          {notification.message}
        </Text>
      </View>
      
      <ChevronRight size={20} color={Colors.textSecondary} />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    padding: 16,
    backgroundColor: Colors.white,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
    alignItems: 'center',
  },
  unreadContainer: {
    backgroundColor: '#F0F9FF',
  },
  urgentContainer: {
    borderLeftWidth: 4,
    borderLeftColor: Colors.error,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
    backgroundColor: '#F0F9FF',
    position: 'relative',
  },
  unreadDot: {
    position: 'absolute',
    top: 0,
    right: 0,
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: Colors.primary,
    borderWidth: 1,
    borderColor: Colors.white,
  },
  contentContainer: {
    flex: 1,
    marginRight: 8,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text,
    flex: 1,
  },
  urgentTitle: {
    color: Colors.error,
  },
  time: {
    fontSize: 12,
    color: Colors.textSecondary,
    marginLeft: 8,
  },
  message: {
    fontSize: 14,
    color: Colors.textSecondary,
    lineHeight: 20,
  },
});

export default NotificationItem;