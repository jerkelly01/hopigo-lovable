import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator, Alert, KeyboardAvoidingView, Platform, Keyboard } from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { ArrowLeft, AlertTriangle } from 'lucide-react-native';
import Colors from '@/constants/colors';
import { useMarketplaceStore } from '@/store/marketplace-store';
import { useAuthStore } from '@/store/auth-store';
import { useNotificationStore } from '@/store/notification-store';
import { CategoryCard } from '@/components/CategoryCard';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';

export default function UrgentServicesScreen() {
  const router = useRouter();
  const { user } = useAuthStore();
  const { categories, fetchCategories, isLoading } = useMarketplaceStore();
  const { addNotification } = useNotificationStore();
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [requestDetails, setRequestDetails] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [keyboardHeight, setKeyboardHeight] = useState(0);
  
  const scrollViewRef = useRef<ScrollView>(null);
  const inputRef = useRef<any>(null);
  const submitButtonRef = useRef<View>(null);

  // Filter out categories not suitable for urgent services
  // Remove Tourism (4), Health (6), Hospitality (7), Business Services (8)
  const urgentCategories = categories.filter(category => 
    !['4', '6', '7', '8'].includes(category.id)
  );

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', (e) => {
      setKeyboardHeight(e.endCoordinates.height);
      
      // Scroll to show submit button above keyboard
      setTimeout(() => {
        submitButtonRef.current?.measureInWindow((x, y, width, height) => {
          const buttonBottom = y + height;
          const keyboardTop = e.endCoordinates.screenY;
          
          if (buttonBottom > keyboardTop) {
            scrollViewRef.current?.scrollToEnd({ animated: true });
          }
        });
      }, 100);
    });
    
    const keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', () => {
      setKeyboardHeight(0);
    });

    return () => {
      keyboardDidShowListener?.remove();
      keyboardDidHideListener?.remove();
    };
  }, []);

  const handleCategorySelect = (categoryId: string) => {
    setSelectedCategory(categoryId);
    
    // Scroll to request details section and focus input
    setTimeout(() => {
      scrollViewRef.current?.scrollToEnd({ animated: true });
      
      // Focus the input to open keyboard
      setTimeout(() => {
        inputRef.current?.focus();
      }, 300);
    }, 100);
  };

  const handleSubmitRequest = async () => {
    if (!selectedCategory) {
      Alert.alert('Error', 'Please select a service category.');
      return;
    }

    if (!requestDetails.trim()) {
      Alert.alert('Error', 'Please provide details about your urgent request.');
      return;
    }

    setIsSubmitting(true);

    try {
      // Simulate API call to submit urgent request
      await new Promise(resolve => setTimeout(resolve, 1500));

      // Generate a unique request ID
      const requestId = `urgent-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

      // Broadcast notification to providers (simulated)
      // In a real app, this would be handled by a backend service
      const notification = {
        id: requestId,
        type: 'urgent-service' as const,
        title: 'Urgent Service Request',
        message: `Urgent ${urgentCategories.find(c => c.id === selectedCategory)?.name || 'Service'} request from ${user?.name || 'a customer'}. First come, first serve!`,
        timestamp: new Date(),
        isRead: false,
        actionUrl: `/provider/urgent-request/${requestId}`,
      };

      // Add notification to store (in a real app, this would be sent to providers)
      addNotification(notification);

      // Show confirmation to user
      Alert.alert('Request Submitted', 'Your urgent service request has been sent to nearby providers. We will notify you when a provider accepts.', [
        { text: 'OK', onPress: () => router.back() }
      ]);
    } catch (error) {
      Alert.alert('Error', 'Failed to submit your request. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <Stack.Screen 
        options={{
          title: 'On Demand Services',
          headerBackground: () => (
            <LinearGradient
              colors={['#5de0e6', '#004aad']}
              start={[0, 0]}
              end={[1, 0]}
              style={{ flex: 1 }}
            />
          ),
          headerTintColor: Colors.white,
          headerTitleStyle: { fontWeight: '600' },
          headerLeft: () => (
            <TouchableOpacity onPress={() => router.back()}>
              <ArrowLeft size={24} color={Colors.white} />
            </TouchableOpacity>
          ),
        }} 
      />
      
      <KeyboardAvoidingView 
        style={styles.keyboardAvoidingView}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView 
          ref={scrollViewRef}
          style={styles.contentContainer} 
          showsVerticalScrollIndicator={false}
          contentContainerStyle={[
            styles.scrollContent,
            { paddingBottom: keyboardHeight > 0 ? keyboardHeight + 20 : 40 }
          ]}
          keyboardShouldPersistTaps="handled"
          keyboardDismissMode="interactive"
        >
          <View style={styles.headerSection}>
            <View style={styles.warningContainer}>
              <AlertTriangle size={24} color={Colors.error} />
              <Text style={styles.warningText}>
                Use this service only for urgent, immediate needs. For regular bookings, use the standard marketplace.
              </Text>
            </View>
            <View style={styles.emergencyWarningContainer}>
              <AlertTriangle size={24} color={Colors.error} />
              <Text style={styles.emergencyWarningText}>
                Heads Up: This feature is not 911. For life-threatening emergencies, please call emergency services.
              </Text>
            </View>
            
            <Text style={styles.descriptionText}>
              Select a category and provide details of your urgent request. Available providers will be notified, and the first to accept will be assigned.
            </Text>
          </View>
          
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Select Category</Text>
            {isLoading ? (
              <ActivityIndicator size="large" color={Colors.primary} style={styles.loader} />
            ) : (
              <View style={styles.categoriesGrid}>
                {urgentCategories.map(category => (
                  <CategoryCard
                    key={category.id}
                    category={category}
                    onPress={() => handleCategorySelect(category.id)}
                    isSelected={selectedCategory === category.id}
                    style={styles.categoryCard}
                  />
                ))}
              </View>
            )}
          </View>
          
          <View style={[styles.section, styles.requestDetailsSection]}>
            <Text style={styles.sectionTitle}>Request Details</Text>
            <Input
              ref={inputRef}
              placeholder="Describe your urgent need (e.g., location, specific issue)"
              value={requestDetails}
              onChangeText={setRequestDetails}
              multiline
              numberOfLines={4}
              containerStyle={styles.inputContainer}
              inputStyle={styles.input}
            />
            
            <View ref={submitButtonRef}>
              <Button
                title="Submit Urgent Request"
                variant="primary"
                style={styles.submitButton}
                onPress={handleSubmitRequest}
                disabled={isSubmitting || !selectedCategory || !requestDetails.trim()}
                loading={isSubmitting}
              />
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  contentContainer: {
    flex: 1,
    padding: 16,
  },
  scrollContent: {
    flexGrow: 1,
  },
  headerSection: {
    marginBottom: 24,
  },
  warningContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.error + '20',
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
  },
  warningText: {
    flex: 1,
    marginLeft: 12,
    fontSize: 15,
    color: Colors.error,
    fontWeight: '500',
  },
  emergencyWarningContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.error + '20',
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
  },
  emergencyWarningText: {
    flex: 1,
    marginLeft: 12,
    fontSize: 15,
    color: Colors.error,
    fontWeight: '500',
  },
  descriptionText: {
    fontSize: 15,
    color: Colors.textSecondary,
    lineHeight: 20,
  },
  section: {
    marginBottom: 24,
  },
  requestDetailsSection: {
    marginBottom: 0,
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 12,
  },
  loader: {
    marginVertical: 20,
  },
  categoriesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  categoryCard: {
    width: '48%',
    marginBottom: 12,
  },
  inputContainer: {
    marginBottom: 16,
  },
  input: {
    height: 100,
    textAlignVertical: 'top',
    paddingTop: 12,
  },
  submitButton: {
    paddingVertical: 16,
    borderRadius: 12,
  },
});