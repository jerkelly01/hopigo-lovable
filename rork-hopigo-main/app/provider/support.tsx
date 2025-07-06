import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { Stack } from 'expo-router';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { ArrowLeft, Phone, Mail, MessageCircle, HelpCircle, FileText, Video } from 'lucide-react-native';
import Colors from '@/constants/colors';

const supportOptions = [
  {
    id: 'chat',
    title: 'Live Chat',
    description: 'Get instant help from our support team',
    icon: 'message-circle',
    color: '#4ECDC4',
    available: true,
  },
  {
    id: 'phone',
    title: 'Phone Support',
    description: 'Call us for urgent issues',
    icon: 'phone',
    color: '#6C5CE7',
    available: true,
    phone: '+297 123-4567',
  },
  {
    id: 'email',
    title: 'Email Support',
    description: 'Send us detailed questions',
    icon: 'mail',
    color: '#FFD93D',
    available: true,
    email: 'support@hopigo.com',
  },
];

const faqCategories = [
  {
    id: 'getting-started',
    title: 'Getting Started',
    questions: [
      'How do I create my provider profile?',
      'What documents do I need to verify my account?',
      'How do I set my service prices?',
    ],
  },
  {
    id: 'bookings',
    title: 'Managing Bookings',
    questions: [
      'How do I accept or decline booking requests?',
      'Can I modify my availability?',
      'What happens if I need to cancel a booking?',
    ],
  },
  {
    id: 'payments',
    title: 'Payments & Earnings',
    questions: [
      'When do I get paid for completed services?',
      'How are service fees calculated?',
      'How do I update my payment information?',
    ],
  },
];

export default function ProviderSupportScreen() {
  const router = useRouter();
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [contactForm, setContactForm] = useState({
    subject: '',
    message: '',
  });

  const getIconComponent = (iconName: string, color: string) => {
    const iconProps = { size: 24, color };
    
    switch (iconName) {
      case 'message-circle':
        return <MessageCircle {...iconProps} />;
      case 'phone':
        return <Phone {...iconProps} />;
      case 'mail':
        return <Mail {...iconProps} />;
      default:
        return <HelpCircle {...iconProps} />;
    }
  };

  const handleSupportOptionPress = (option: any) => {
    switch (option.id) {
      case 'chat':
        // Open live chat
        break;
      case 'phone':
        // Open phone dialer
        break;
      case 'email':
        // Open email client
        break;
    }
  };

  const handleSubmitContact = () => {
    // Handle contact form submission
    console.log('Contact form submitted:', contactForm);
  };

  return (
    <>
      <Stack.Screen 
        options={{ 
          title: 'Support',
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
          <Text style={styles.title}>How can we help?</Text>
          <Text style={styles.subtitle}>
            Get the support you need to succeed as a service provider
          </Text>
        </View>

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Contact Support</Text>
        </View>

        <View style={styles.supportOptionsGrid}>
          {supportOptions.map((option) => (
            <TouchableOpacity
              key={option.id}
              style={styles.supportOption}
              onPress={() => handleSupportOptionPress(option)}
              activeOpacity={0.8}
            >
              <Card style={styles.supportOptionCard}>
                <View style={[styles.supportIcon, { backgroundColor: option.color + '20' }]}>
                  {getIconComponent(option.icon, option.color)}
                </View>
                <Text style={styles.supportTitle}>{option.title}</Text>
                <Text style={styles.supportDescription}>{option.description}</Text>
                {option.available && (
                  <View style={styles.availableBadge}>
                    <Text style={styles.availableText}>Available</Text>
                  </View>
                )}
                {option.phone && (
                  <Text style={styles.contactInfo}>{option.phone}</Text>
                )}
                {option.email && (
                  <Text style={styles.contactInfo}>{option.email}</Text>
                )}
              </Card>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Frequently Asked Questions</Text>
        </View>

        {faqCategories.map((category) => (
          <Card key={category.id} style={styles.faqCard}>
            <TouchableOpacity
              style={styles.faqHeader}
              onPress={() => setSelectedCategory(
                selectedCategory === category.id ? null : category.id
              )}
            >
              <Text style={styles.faqCategoryTitle}>{category.title}</Text>
              <HelpCircle size={20} color={Colors.primary} />
            </TouchableOpacity>
            
            {selectedCategory === category.id && (
              <View style={styles.faqQuestions}>
                {category.questions.map((question, index) => (
                  <TouchableOpacity key={index} style={styles.faqQuestion}>
                    <Text style={styles.faqQuestionText}>{question}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}
          </Card>
        ))}

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Send us a Message</Text>
        </View>

        <Card style={styles.contactFormCard}>
          <Input
            label="Subject"
            value={contactForm.subject}
            onChangeText={(value) => setContactForm(prev => ({ ...prev, subject: value }))}
            placeholder="What do you need help with?"
            containerStyle={styles.inputContainer}
          />
          
          <Input
            label="Message"
            value={contactForm.message}
            onChangeText={(value) => setContactForm(prev => ({ ...prev, message: value }))}
            placeholder="Describe your issue or question in detail..."
            multiline
            numberOfLines={4}
            containerStyle={styles.inputContainer}
          />
          
          <Button
            title="Send Message"
            onPress={handleSubmitContact}
            style={styles.submitButton}
          />
        </Card>

        <Card style={styles.resourcesCard}>
          <Text style={styles.resourcesTitle}>Additional Resources</Text>
          <View style={styles.resourcesList}>
            <TouchableOpacity style={styles.resourceItem}>
              <FileText size={20} color={Colors.primary} />
              <Text style={styles.resourceText}>Provider Handbook</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.resourceItem}>
              <Video size={20} color={Colors.primary} />
              <Text style={styles.resourceText}>Video Tutorials</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.resourceItem}>
              <MessageCircle size={20} color={Colors.primary} />
              <Text style={styles.resourceText}>Community Forum</Text>
            </TouchableOpacity>
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
  sectionHeader: {
    paddingHorizontal: 20,
    marginTop: 24,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: Colors.text,
  },
  supportOptionsGrid: {
    paddingHorizontal: 20,
  },
  supportOption: {
    marginBottom: 16,
  },
  supportOptionCard: {
    padding: 20,
    alignItems: 'center',
    margin: 0,
  },
  supportIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  supportTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 8,
  },
  supportDescription: {
    fontSize: 14,
    color: Colors.textSecondary,
    textAlign: 'center',
    marginBottom: 12,
  },
  availableBadge: {
    backgroundColor: '#4ECDC4',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    marginBottom: 8,
  },
  availableText: {
    fontSize: 12,
    color: Colors.white,
    fontWeight: '500',
  },
  contactInfo: {
    fontSize: 14,
    color: Colors.primary,
    fontWeight: '500',
  },
  faqCard: {
    marginHorizontal: 20,
    marginBottom: 12,
    padding: 0,
  },
  faqHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
  },
  faqCategoryTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text,
  },
  faqQuestions: {
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  faqQuestion: {
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  faqQuestionText: {
    fontSize: 14,
    color: Colors.textSecondary,
  },
  contactFormCard: {
    marginHorizontal: 20,
    marginBottom: 16,
    padding: 20,
  },
  inputContainer: {
    marginBottom: 16,
  },
  submitButton: {
    marginTop: 8,
  },
  resourcesCard: {
    marginHorizontal: 20,
    marginBottom: 40,
    padding: 20,
  },
  resourcesTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 16,
  },
  resourcesList: {
    gap: 12,
  },
  resourceItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 8,
  },
  resourceText: {
    fontSize: 14,
    color: Colors.text,
  },
});