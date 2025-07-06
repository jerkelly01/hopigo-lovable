import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Linking } from 'react-native';
import { useRouter } from 'expo-router';
import { Stack } from 'expo-router';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { ArrowLeft, Phone, Mail, MessageCircle, HelpCircle, ChevronRight } from 'lucide-react-native';
import Colors from '@/constants/colors';

const supportOptions = [
  {
    id: 'faq',
    title: 'Frequently Asked Questions',
    description: 'Find answers to common questions',
    icon: 'help-circle',
    action: () => console.log('Navigate to FAQ'),
  },
  {
    id: 'chat',
    title: 'Live Chat Support',
    description: 'Chat with our support team',
    icon: 'message-circle',
    action: () => console.log('Open live chat'),
  },
  {
    id: 'email',
    title: 'Email Support',
    description: 'Send us an email',
    icon: 'mail',
    action: () => Linking.openURL('mailto:support@hopigo.com'),
  },
  {
    id: 'phone',
    title: 'Phone Support',
    description: 'Call our support line',
    icon: 'phone',
    action: () => Linking.openURL('tel:+297-123-4567'),
  },
];

export default function SupportScreen() {
  const router = useRouter();
  const [selectedTab, setSelectedTab] = useState<'contact' | 'ticket'>('contact');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmitTicket = () => {
    if (!subject.trim() || !message.trim()) {
      return;
    }
    
    // In a real app, this would submit the support ticket
    console.log('Submit support ticket:', { subject, message });
    setSubject('');
    setMessage('');
  };

  return (
    <>
      <Stack.Screen 
        options={{ 
          title: 'Support',
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
            style={[styles.tab, selectedTab === 'contact' && styles.activeTab]}
            onPress={() => setSelectedTab('contact')}
          >
            <Text style={[styles.tabText, selectedTab === 'contact' && styles.activeTabText]}>
              Contact Us
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tab, selectedTab === 'ticket' && styles.activeTab]}
            onPress={() => setSelectedTab('ticket')}
          >
            <Text style={[styles.tabText, selectedTab === 'ticket' && styles.activeTabText]}>
              Submit Ticket
            </Text>
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.scrollContainer} showsVerticalScrollIndicator={false}>
          {selectedTab === 'contact' ? (
            <>
              <View style={styles.header}>
                <HelpCircle size={48} color={Colors.primary} />
                <Text style={styles.title}>How can we help you?</Text>
                <Text style={styles.subtitle}>
                  Choose the best way to get in touch with our support team
                </Text>
              </View>

              <View style={styles.supportOptions}>
                {supportOptions.map((option) => (
                  <TouchableOpacity
                    key={option.id}
                    style={styles.supportOption}
                    onPress={option.action}
                  >
                    <View style={styles.supportOptionContent}>
                      <View style={styles.supportOptionInfo}>
                        <Text style={styles.supportOptionTitle}>{option.title}</Text>
                        <Text style={styles.supportOptionDescription}>{option.description}</Text>
                      </View>
                      <ChevronRight size={20} color={Colors.textSecondary} />
                    </View>
                  </TouchableOpacity>
                ))}
              </View>

              <Card style={styles.hoursCard}>
                <Text style={styles.hoursTitle}>Support Hours</Text>
                <View style={styles.hoursInfo}>
                  <Text style={styles.hoursText}>Monday - Friday: 8:00 AM - 8:00 PM</Text>
                  <Text style={styles.hoursText}>Saturday: 9:00 AM - 5:00 PM</Text>
                  <Text style={styles.hoursText}>Sunday: 10:00 AM - 4:00 PM</Text>
                </View>
                <Text style={styles.hoursNote}>
                  Emergency support is available 24/7 for urgent issues
                </Text>
              </Card>
            </>
          ) : (
            <>
              <View style={styles.header}>
                <MessageCircle size={48} color={Colors.primary} />
                <Text style={styles.title}>Submit a Support Ticket</Text>
                <Text style={styles.subtitle}>
                  Describe your issue and we will get back to you soon
                </Text>
              </View>

              <Card style={styles.ticketForm}>
                <Input
                  label="Subject"
                  value={subject}
                  onChangeText={setSubject}
                  placeholder="Brief description of your issue"
                  containerStyle={styles.inputContainer}
                />

                <Input
                  label="Message"
                  value={message}
                  onChangeText={setMessage}
                  placeholder="Please provide detailed information about your issue"
                  multiline
                  numberOfLines={6}
                  containerStyle={styles.inputContainer}
                />

                <Button
                  title="Submit Ticket"
                  onPress={handleSubmitTicket}
                  style={styles.submitButton}
                />
              </Card>

              <Card style={styles.tipsCard}>
                <Text style={styles.tipsTitle}>Tips for Better Support</Text>
                <View style={styles.tipsList}>
                  <Text style={styles.tipText}>• Be specific about the issue you are experiencing</Text>
                  <Text style={styles.tipText}>• Include steps to reproduce the problem</Text>
                  <Text style={styles.tipText}>• Mention your device type and app version</Text>
                  <Text style={styles.tipText}>• Attach screenshots if relevant</Text>
                </View>
              </Card>
            </>
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
  header: {
    padding: 20,
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: Colors.text,
    textAlign: 'center',
    marginTop: 16,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
  },
  supportOptions: {
    paddingHorizontal: 20,
  },
  supportOption: {
    backgroundColor: Colors.card,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  supportOptionContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
  },
  supportOptionInfo: {
    flex: 1,
  },
  supportOptionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 4,
  },
  supportOptionDescription: {
    fontSize: 14,
    color: Colors.textSecondary,
  },
  hoursCard: {
    marginHorizontal: 20,
    marginTop: 32,
    marginBottom: 40,
    padding: 20,
  },
  hoursTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 16,
  },
  hoursInfo: {
    marginBottom: 16,
  },
  hoursText: {
    fontSize: 14,
    color: Colors.text,
    marginBottom: 4,
  },
  hoursNote: {
    fontSize: 12,
    color: Colors.textSecondary,
    fontStyle: 'italic',
  },
  ticketForm: {
    marginHorizontal: 20,
    padding: 20,
  },
  inputContainer: {
    marginBottom: 16,
  },
  submitButton: {
    marginTop: 8,
  },
  tipsCard: {
    marginHorizontal: 20,
    marginTop: 20,
    marginBottom: 40,
    padding: 20,
  },
  tipsTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 16,
  },
  tipsList: {
    gap: 8,
  },
  tipText: {
    fontSize: 14,
    color: Colors.text,
    lineHeight: 20,
  },
});