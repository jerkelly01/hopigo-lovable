import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { Stack } from 'expo-router';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { ArrowLeft, Star, ThumbsUp, MessageCircle } from 'lucide-react-native';
import Colors from '@/constants/colors';

// Mock reviews data
const myReviews = [
  {
    id: 'review1',
    providerId: 'provider1',
    providerName: 'Maria Santos',
    providerAvatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b47c?w=400&auto=format&fit=crop&q=60&ixlib=rb-4.0.3',
    serviceName: 'House Cleaning',
    rating: 5,
    comment: 'Excellent service! Maria was very professional and thorough. My house has never been cleaner.',
    date: '2024-01-15',
    helpful: 12,
  },
  {
    id: 'review2',
    providerId: 'provider2',
    providerName: 'Carlos Rodriguez',
    providerAvatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&auto=format&fit=crop&q=60&ixlib=rb-4.0.3',
    serviceName: 'Car Towing',
    rating: 4,
    comment: 'Quick response time and fair pricing. Carlos was helpful and got my car to the shop safely.',
    date: '2024-01-10',
    helpful: 8,
  },
];

export default function ReviewsScreen() {
  const router = useRouter();
  const [selectedTab, setSelectedTab] = useState<'my-reviews' | 'pending'>('my-reviews');

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, index) => (
      <Star
        key={index}
        size={16}
        color="#FFD93D"
        fill={index < rating ? "#FFD93D" : "transparent"}
      />
    ));
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  return (
    <>
      <Stack.Screen 
        options={{ 
          title: 'Reviews',
          headerStyle: { backgroundColor: Colors.background },
          headerTintColor: Colors.text,
          headerTitleStyle: { fontWeight: '600' },
          headerLeft: () => (
            <TouchableOpacity onPress={() => router.back()}>
              <ArrowLeft size={24} color={Colors.text} />
            </TouchableOpacity>
          ),
        }} 
      />
      
      <View style={styles.container}>
        <View style={styles.tabContainer}>
          <TouchableOpacity
            style={[styles.tab, selectedTab === 'my-reviews' && styles.activeTab]}
            onPress={() => setSelectedTab('my-reviews')}
          >
            <Text style={[styles.tabText, selectedTab === 'my-reviews' && styles.activeTabText]}>
              My Reviews ({myReviews.length})
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tab, selectedTab === 'pending' && styles.activeTab]}
            onPress={() => setSelectedTab('pending')}
          >
            <Text style={[styles.tabText, selectedTab === 'pending' && styles.activeTabText]}>
              Pending (0)
            </Text>
          </TouchableOpacity>
        </View>

        <ScrollView 
          style={styles.scrollContainer} 
          showsVerticalScrollIndicator={false}
          scrollEventThrottle={16}
          decelerationRate="normal"
          bounces={true}
          bouncesZoom={false}
          alwaysBounceVertical={false}
          removeClippedSubviews={false}
        >
          {selectedTab === 'my-reviews' ? (
            myReviews.length === 0 ? (
              <View style={styles.emptyState}>
                <Star size={48} color={Colors.textSecondary} />
                <Text style={styles.emptyTitle}>No Reviews Yet</Text>
                <Text style={styles.emptyDescription}>
                  Complete a service to leave your first review.
                </Text>
                <Button
                  title="Browse Services"
                  onPress={() => router.push('/marketplace')}
                  style={styles.browseButton}
                />
              </View>
            ) : (
              <View style={styles.reviewsList}>
                {myReviews.map((review) => (
                  <Card key={review.id} style={styles.reviewCard}>
                    <View style={styles.reviewHeader}>
                      <Image source={{ uri: review.providerAvatar }} style={styles.providerAvatar} />
                      <View style={styles.reviewInfo}>
                        <Text style={styles.providerName}>{review.providerName}</Text>
                        <Text style={styles.serviceName}>{review.serviceName}</Text>
                        <View style={styles.ratingContainer}>
                          {renderStars(review.rating)}
                          <Text style={styles.reviewDate}>{formatDate(review.date)}</Text>
                        </View>
                      </View>
                    </View>

                    <Text style={styles.reviewComment}>{review.comment}</Text>

                    <View style={styles.reviewFooter}>
                      <View style={styles.helpfulContainer}>
                        <ThumbsUp size={16} color={Colors.textSecondary} />
                        <Text style={styles.helpfulText}>{review.helpful} found helpful</Text>
                      </View>
                      <TouchableOpacity style={styles.editButton}>
                        <Text style={styles.editButtonText}>Edit</Text>
                      </TouchableOpacity>
                    </View>
                  </Card>
                ))}
              </View>
            )
          ) : (
            <View style={styles.emptyState}>
              <MessageCircle size={48} color={Colors.textSecondary} />
              <Text style={styles.emptyTitle}>No Pending Reviews</Text>
              <Text style={styles.emptyDescription}>
                You have no services waiting for reviews.
              </Text>
              <Button
                title="View My Bookings"
                onPress={() => router.push('/my-bookings')}
                style={styles.browseButton}
              />
            </View>
          )}
        </ScrollView>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: Colors.card,
    marginHorizontal: 20,
    marginTop: 20,
    borderRadius: 12,
    padding: 4,
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderRadius: 8,
  },
  activeTab: {
    backgroundColor: Colors.primary,
  },
  tabText: {
    fontSize: 14,
    fontWeight: '500',
    color: Colors.textSecondary,
  },
  activeTabText: {
    color: Colors.white,
    fontWeight: '600',
  },
  scrollContainer: {
    flex: 1,
    paddingTop: 20,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
    marginTop: 60,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.text,
    marginTop: 16,
    marginBottom: 8,
  },
  emptyDescription: {
    fontSize: 14,
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 24,
  },
  browseButton: {
    paddingHorizontal: 32,
  },
  reviewsList: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  reviewCard: {
    padding: 16,
    marginBottom: 16,
  },
  reviewHeader: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  providerAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 12,
  },
  reviewInfo: {
    flex: 1,
  },
  providerName: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 2,
  },
  serviceName: {
    fontSize: 14,
    color: Colors.textSecondary,
    marginBottom: 4,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  reviewDate: {
    fontSize: 12,
    color: Colors.textSecondary,
  },
  reviewComment: {
    fontSize: 14,
    color: Colors.text,
    lineHeight: 20,
    marginBottom: 12,
  },
  reviewFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  helpfulContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  helpfulText: {
    fontSize: 12,
    color: Colors.textSecondary,
    marginLeft: 4,
  },
  editButton: {
    paddingVertical: 4,
    paddingHorizontal: 8,
  },
  editButtonText: {
    fontSize: 14,
    color: Colors.primary,
    fontWeight: '500',
  },
});