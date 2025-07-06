import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { Stack } from 'expo-router';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { ArrowLeft, MessageCircle, Users, ThumbsUp, Share2, Calendar } from 'lucide-react-native';
import Colors from '@/constants/colors';

const communityPosts = [
  {
    id: '1',
    author: 'Maria Santos',
    avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100&h=100&fit=crop&crop=face',
    category: 'Home Services',
    title: 'Tips for Efficient House Cleaning',
    content: 'Just wanted to share some time-saving tips that have helped me complete cleaning jobs faster while maintaining quality...',
    likes: 24,
    comments: 8,
    timeAgo: '2 hours ago',
  },
  {
    id: '2',
    author: 'Carlos Rodriguez',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face',
    category: 'Car Services',
    title: 'Best Practices for Mobile Car Detailing',
    content: 'After 5 years in mobile car detailing, here are the essential tools and techniques that have made the biggest difference...',
    likes: 31,
    comments: 12,
    timeAgo: '4 hours ago',
  },
  {
    id: '3',
    author: 'Ana Pereira',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face',
    category: 'Personal Services',
    title: 'Building Client Relationships',
    content: 'Customer retention is key to success. Here are strategies that have helped me build long-term relationships with clients...',
    likes: 18,
    comments: 6,
    timeAgo: '6 hours ago',
  },
];

const upcomingEvents = [
  {
    id: '1',
    title: 'Provider Networking Event',
    date: 'March 15, 2024',
    time: '6:00 PM',
    location: 'Community Center',
    attendees: 45,
  },
  {
    id: '2',
    title: 'Business Skills Workshop',
    date: 'March 22, 2024',
    time: '2:00 PM',
    location: 'Online',
    attendees: 78,
  },
];

export default function ProviderCommunityScreen() {
  const router = useRouter();

  return (
    <>
      <Stack.Screen 
        options={{ 
          title: 'Community',
          headerStyle: { backgroundColor: Colors.primary },
          headerTintColor: Colors.white,
          headerTitleStyle: { fontWeight: '600' },
          headerLeft: () => (
            <TouchableOpacity onPress={() => router.back()}>
              <ArrowLeft size={24} color={Colors.white} />
            </TouchableOpacity>
          ),
        }} 
      />
      
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.title}>Provider Community</Text>
          <Text style={styles.subtitle}>
            Connect with fellow service providers, share experiences, and learn from each other
          </Text>
        </View>

        <Card style={styles.statsCard}>
          <View style={styles.statsRow}>
            <View style={styles.statItem}>
              <Users size={24} color={Colors.primary} />
              <Text style={styles.statNumber}>1,247</Text>
              <Text style={styles.statLabel}>Active Members</Text>
            </View>
            <View style={styles.statItem}>
              <MessageCircle size={24} color={Colors.primary} />
              <Text style={styles.statNumber}>89</Text>
              <Text style={styles.statLabel}>Discussions</Text>
            </View>
            <View style={styles.statItem}>
              <Calendar size={24} color={Colors.primary} />
              <Text style={styles.statNumber}>12</Text>
              <Text style={styles.statLabel}>Events</Text>
            </View>
          </View>
        </Card>

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Recent Discussions</Text>
          <Button
            title="New Post"
            variant="primary"
            size="small"
            style={styles.newPostButton}
          />
        </View>

        {communityPosts.map((post) => (
          <Card key={post.id} style={styles.postCard}>
            <View style={styles.postHeader}>
              <Image source={{ uri: post.avatar }} style={styles.avatar} />
              <View style={styles.postInfo}>
                <Text style={styles.authorName}>{post.author}</Text>
                <View style={styles.postMeta}>
                  <Text style={styles.category}>{post.category}</Text>
                  <Text style={styles.timeAgo}>• {post.timeAgo}</Text>
                </View>
              </View>
            </View>

            <Text style={styles.postTitle}>{post.title}</Text>
            <Text style={styles.postContent}>{post.content}</Text>

            <View style={styles.postActions}>
              <TouchableOpacity style={styles.actionButton}>
                <ThumbsUp size={16} color={Colors.textSecondary} />
                <Text style={styles.actionText}>{post.likes}</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.actionButton}>
                <MessageCircle size={16} color={Colors.textSecondary} />
                <Text style={styles.actionText}>{post.comments}</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.actionButton}>
                <Share2 size={16} color={Colors.textSecondary} />
                <Text style={styles.actionText}>Share</Text>
              </TouchableOpacity>
            </View>
          </Card>
        ))}

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Upcoming Events</Text>
          <TouchableOpacity>
            <Text style={styles.viewAllText}>View All</Text>
          </TouchableOpacity>
        </View>

        {upcomingEvents.map((event) => (
          <Card key={event.id} style={styles.eventCard}>
            <View style={styles.eventHeader}>
              <Calendar size={20} color={Colors.primary} />
              <Text style={styles.eventTitle}>{event.title}</Text>
            </View>
            <View style={styles.eventDetails}>
              <Text style={styles.eventDate}>{event.date} at {event.time}</Text>
              <Text style={styles.eventLocation}>{event.location}</Text>
              <Text style={styles.eventAttendees}>{event.attendees} attending</Text>
            </View>
            <Button
              title="Join Event"
              variant="secondary"
              size="small"
              style={styles.joinButton}
            />
          </Card>
        ))}

        <Card style={styles.guidelinesCard}>
          <Text style={styles.guidelinesTitle}>Community Guidelines</Text>
          <View style={styles.guidelinesList}>
            <Text style={styles.guidelineItem}>• Be respectful and professional</Text>
            <Text style={styles.guidelineItem}>• Share helpful tips and experiences</Text>
            <Text style={styles.guidelineItem}>• No spam or self-promotion</Text>
            <Text style={styles.guidelineItem}>• Keep discussions relevant to service provision</Text>
          </View>
        </Card>
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    padding: 20,
    paddingTop: 60,
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: Colors.text,
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
  },
  statsCard: {
    marginHorizontal: 20,
    marginBottom: 8,
    padding: 20,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  statItem: {
    alignItems: 'center',
    gap: 8,
  },
  statNumber: {
    fontSize: 20,
    fontWeight: '700',
    color: Colors.text,
  },
  statLabel: {
    fontSize: 12,
    color: Colors.textSecondary,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginTop: 24,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: Colors.text,
  },
  newPostButton: {
    paddingHorizontal: 16,
  },
  viewAllText: {
    fontSize: 14,
    color: Colors.primary,
    fontWeight: '500',
  },
  postCard: {
    marginHorizontal: 20,
    marginBottom: 16,
    padding: 16,
  },
  postHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
  },
  postInfo: {
    flex: 1,
  },
  authorName: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 2,
  },
  postMeta: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  category: {
    fontSize: 12,
    color: Colors.primary,
    fontWeight: '500',
  },
  timeAgo: {
    fontSize: 12,
    color: Colors.textSecondary,
    marginLeft: 4,
  },
  postTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 8,
  },
  postContent: {
    fontSize: 14,
    color: Colors.textSecondary,
    lineHeight: 20,
    marginBottom: 16,
  },
  postActions: {
    flexDirection: 'row',
    gap: 20,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  actionText: {
    fontSize: 14,
    color: Colors.textSecondary,
  },
  eventCard: {
    marginHorizontal: 20,
    marginBottom: 12,
    padding: 16,
  },
  eventHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    gap: 8,
  },
  eventTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text,
  },
  eventDetails: {
    marginBottom: 12,
  },
  eventDate: {
    fontSize: 14,
    color: Colors.text,
    marginBottom: 2,
  },
  eventLocation: {
    fontSize: 14,
    color: Colors.textSecondary,
    marginBottom: 2,
  },
  eventAttendees: {
    fontSize: 12,
    color: Colors.primary,
  },
  joinButton: {
    alignSelf: 'flex-start',
  },
  guidelinesCard: {
    marginHorizontal: 20,
    marginBottom: 40,
    padding: 20,
  },
  guidelinesTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 16,
  },
  guidelinesList: {
    gap: 8,
  },
  guidelineItem: {
    fontSize: 14,
    color: Colors.text,
    lineHeight: 20,
  },
});