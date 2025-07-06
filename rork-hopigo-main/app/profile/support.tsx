import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Stack } from 'expo-router';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { ChevronDown, ChevronUp, HelpCircle, Mail, MessageSquare, Phone } from 'lucide-react-native';
import colors from '@/constants/colors';

interface ContactForm {
  subject: string;
  message: string;
}

interface FAQ {
  question: string;
  answer: string;
}

interface ContactOptionProps {
  icon: React.ReactNode;
  title: string;
  subtitle: string;
  action: () => void;
}

export default function SupportScreen() {
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);
  const [contactForm, setContactForm] = useState<ContactForm>({
    subject: '',
    message: '',
  });

  const toggleFaq = (index: number) => {
    if (expandedFaq === index) {
      setExpandedFaq(null);
    } else {
      setExpandedFaq(index);
    }
  };

  const handleContactFormChange = (field: keyof ContactForm, value: string) => {
    setContactForm(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const faqs: FAQ[] = [
    {
      question: "How do I book a service?",
      answer: "To book a service, browse through our marketplace, select a provider, choose an available time slot, and complete the payment process. You'll receive a confirmation once your booking is successful."
    },
    {
      question: "How do I add funds to my wallet?",
      answer: "You can add funds to your wallet by navigating to the Wallet tab, tapping on 'Add Funds', selecting your preferred payment method, and entering the amount you wish to add."
    },
    {
      question: "Can I cancel my booking?",
      answer: "Yes, you can cancel your booking by going to your bookings list, selecting the booking you wish to cancel, and tapping on the 'Cancel Booking' button. Please note that cancellation policies may vary by provider."
    },
    {
      question: "How do I split a bill with friends?",
      answer: "To split a bill, go to your Wallet tab, select 'Split Bill', enter the total amount, add the contacts you want to split with, and send the request. They'll receive a notification to pay their share."
    },
    {
      question: "Is my payment information secure?",
      answer: "Yes, we use industry-standard encryption and security measures to protect your payment information. We never store your complete card details on our servers."
    },
  ];

  const ContactOption = ({ icon, title, subtitle, action }: ContactOptionProps) => (
    <TouchableOpacity style={styles.contactOption} onPress={action}>
      <View style={styles.contactIconContainer}>
        {icon}
      </View>
      <View style={styles.contactInfo}>
        <Text style={styles.contactTitle}>{title}</Text>
        <Text style={styles.contactSubtitle}>{subtitle}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <Stack.Screen options={{ 
        title: "Help & Support",
        headerStyle: {
          backgroundColor: colors.primary,
        },
        headerTintColor: '#fff',
      }} />
      
      <ScrollView style={styles.scrollView}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Frequently Asked Questions</Text>
          
          {faqs.map((faq, index) => (
            <View key={index} style={styles.faqItem}>
              <TouchableOpacity 
                style={styles.faqQuestion}
                onPress={() => toggleFaq(index)}
              >
                <Text style={styles.faqQuestionText}>{faq.question}</Text>
                {expandedFaq === index ? 
                  <ChevronUp size={20} color="#555" /> : 
                  <ChevronDown size={20} color="#555" />
                }
              </TouchableOpacity>
              
              {expandedFaq === index && (
                <View style={styles.faqAnswer}>
                  <Text style={styles.faqAnswerText}>{faq.answer}</Text>
                </View>
              )}
            </View>
          ))}
        </View>
        
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Contact Us</Text>
          
          <View style={styles.contactOptions}>
            <ContactOption 
              icon={<Phone size={24} color={colors.primary} />}
              title="Call Support"
              subtitle="Available 24/7"
              action={() => {}}
            />
            
            <ContactOption 
              icon={<MessageSquare size={24} color={colors.primary} />}
              title="Live Chat"
              subtitle="Typically replies within minutes"
              action={() => {}}
            />
            
            <ContactOption 
              icon={<Mail size={24} color={colors.primary} />}
              title="Email Support"
              subtitle="support@example.com"
              action={() => {}}
            />
          </View>
        </View>
        
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Send a Message</Text>
          
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Subject</Text>
            <Input
              value={contactForm.subject}
              onChangeText={(text) => handleContactFormChange('subject', text)}
              placeholder="What can we help you with?"
            />
          </View>
          
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Message</Text>
            <Input
              value={contactForm.message}
              onChangeText={(text) => handleContactFormChange('message', text)}
              placeholder="Describe your issue or question"
              multiline
              numberOfLines={5}
              textAlignVertical="top"
              inputStyle={styles.textArea}
            />
          </View>
          
          <Button 
            title="Send Message" 
            style={styles.sendButton}
          />
        </View>
        
        <View style={styles.helpCenter}>
          <HelpCircle size={24} color={colors.primary} />
          <Text style={styles.helpCenterTitle}>Help Center</Text>
          <Text style={styles.helpCenterDescription}>
            Visit our comprehensive Help Center for detailed guides, tutorials, and troubleshooting tips.
          </Text>
          <Button 
            title="Visit Help Center" 
            variant="outline"
            style={styles.helpCenterButton}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollView: {
    flex: 1,
    padding: 16,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
    color: colors.primary,
  },
  faqItem: {
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#eee',
    borderRadius: 8,
    overflow: 'hidden',
  },
  faqQuestion: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#f9f9f9',
  },
  faqQuestionText: {
    fontSize: 16,
    fontWeight: '500',
    flex: 1,
    marginRight: 8,
  },
  faqAnswer: {
    padding: 16,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  faqAnswerText: {
    fontSize: 15,
    color: '#555',
    lineHeight: 22,
  },
  contactOptions: {
    marginBottom: 16,
  },
  contactOption: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderWidth: 1,
    borderColor: '#eee',
    borderRadius: 8,
    marginBottom: 12,
  },
  contactIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f5f5f5',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  contactInfo: {
    flex: 1,
  },
  contactTitle: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 4,
  },
  contactSubtitle: {
    fontSize: 14,
    color: '#777',
  },
  inputGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.textSecondary,
    marginBottom: 8,
  },
  textArea: {
    height: 120,
    paddingTop: 16,
  },
  sendButton: {
    marginTop: 8,
  },
  helpCenter: {
    backgroundColor: '#f9f9f9',
    padding: 20,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 24,
  },
  helpCenterTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginTop: 12,
    marginBottom: 8,
  },
  helpCenterDescription: {
    fontSize: 15,
    color: '#555',
    textAlign: 'center',
    marginBottom: 16,
    lineHeight: 22,
  },
  helpCenterButton: {
    width: '100%',
  },
});