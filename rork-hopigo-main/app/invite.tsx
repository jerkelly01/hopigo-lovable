import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Share, Alert } from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Copy, Share2, MessageCircle, Mail, Users } from 'lucide-react-native';
import Colors from '@/constants/colors';

export default function InviteScreen() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  
  const inviteCode = 'FRIEND2024';
  const inviteLink = 'https://app.servicemarket.com/invite/FRIEND2024';
  const inviteMessage = `Hey! I'm using this amazing service marketplace app. Join me and get 10 AWG when you complete your first transaction! Use my invite code: ${inviteCode} or click: ${inviteLink}`;
  
  const copyToClipboard = async (text: string) => {
    // Note: Clipboard functionality would need expo-clipboard
    Alert.alert('Copied!', 'Invite code copied to clipboard');
  };
  
  const shareInvite = async () => {
    try {
      await Share.share({
        message: inviteMessage,
        title: 'Join Service Marketplace',
      });
    } catch (error) {
      console.error('Error sharing:', error);
    }
  };
  
  const sendEmailInvite = () => {
    if (!email) {
      Alert.alert('Error', 'Please enter an email address');
      return;
    }
    // Here you would integrate with your email service
    Alert.alert('Success', `Invite sent to ${email}`);
    setEmail('');
  };
  
  const sendSMSInvite = () => {
    if (!phoneNumber) {
      Alert.alert('Error', 'Please enter a phone number');
      return;
    }
    // Here you would integrate with your SMS service
    Alert.alert('Success', `Invite sent to ${phoneNumber}`);
    setPhoneNumber('');
  };
  
  return (
    <>
      <Stack.Screen 
        options={{ 
          title: 'Invite Friends',
          headerStyle: { backgroundColor: Colors.background },
          headerTintColor: Colors.text,
        }} 
      />
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        {/* Header Section */}
        <View style={styles.headerSection}>
          <View style={styles.rewardBadge}>
            <Text style={styles.rewardAmount}>10 AWG</Text>
            <Text style={styles.rewardText}>per friend</Text>
          </View>
          <Text style={styles.title}>Invite Friends & Earn Rewards</Text>
          <Text style={styles.subtitle}>
            Share the love and earn 10 AWG for each friend who joins and completes their first transaction. It's a win-win for everyone!
          </Text>
        </View>
        
        {/* Your Invite Code */}
        <Card style={styles.codeCard}>
          <Text style={styles.cardTitle}>Your Personal Invite Code</Text>
          <Text style={styles.cardDescription}>
            Share this unique code with your friends to get started
          </Text>
          <View style={styles.codeContainer}>
            <Text style={styles.inviteCode}>{inviteCode}</Text>
            <TouchableOpacity 
              style={styles.copyButton}
              onPress={() => copyToClipboard(inviteCode)}
            >
              <Copy size={20} color={Colors.primary} />
            </TouchableOpacity>
          </View>
        </Card>
        
        {/* Share Options */}
        <Card style={styles.shareCard}>
          <Text style={styles.cardTitle}>Quick Share Options</Text>
          <Text style={styles.cardDescription}>
            Choose your preferred way to share your invite
          </Text>
          <View style={styles.shareOptions}>
            <TouchableOpacity style={styles.shareOption} onPress={shareInvite}>
              <Share2 size={24} color={Colors.primary} />
              <Text style={styles.shareOptionText}>Share</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.shareOption} onPress={shareInvite}>
              <MessageCircle size={24} color={Colors.primary} />
              <Text style={styles.shareOptionText}>Message</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.shareOption} onPress={shareInvite}>
              <Mail size={24} color={Colors.primary} />
              <Text style={styles.shareOptionText}>Email</Text>
            </TouchableOpacity>
          </View>
        </Card>
        
        {/* Send Email Invite */}
        <Card style={styles.inviteCard}>
          <Text style={styles.cardTitle}>Send Email Invitation</Text>
          <Text style={styles.cardDescription}>
            Enter your friend's email to send them a personalized invite
          </Text>
          <View style={styles.inputContainer}>
            <Input
              placeholder="friend@example.com"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              style={styles.textInput}
            />
            <Button
              title="Send Email Invite"
              onPress={sendEmailInvite}
              style={styles.whiteButton}
              textStyle={{ color: Colors.primary }}
            />
          </View>
        </Card>
        
        {/* Send SMS Invite */}
        <Card style={styles.inviteCard}>
          <Text style={styles.cardTitle}>Send SMS Invitation</Text>
          <Text style={styles.cardDescription}>
            Send a quick text message invite to your friend's phone
          </Text>
          <View style={styles.inputContainer}>
            <Input
              placeholder="+1 (555) 123-4567"
              value={phoneNumber}
              onChangeText={setPhoneNumber}
              keyboardType="phone-pad"
              style={styles.textInput}
            />
            <Button
              title="Send SMS Invite"
              onPress={sendSMSInvite}
              style={styles.whiteButton}
              textStyle={{ color: Colors.primary }}
            />
          </View>
        </Card>
        
        {/* Stats */}
        <Card style={styles.statsCard}>
          <View style={styles.statsHeader}>
            <Users size={24} color={Colors.primary} />
            <Text style={styles.cardTitle}>Your Referral Progress</Text>
          </View>
          <Text style={styles.cardDescription}>
            Track your invitation success and earnings
          </Text>
          <View style={styles.statsGrid}>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>5</Text>
              <Text style={styles.statLabel}>Friends Invited</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>3</Text>
              <Text style={styles.statLabel}>Successfully Joined</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>30</Text>
              <Text style={styles.statLabel}>AWG Earned</Text>
            </View>
          </View>
        </Card>
        
        {/* How it Works */}
        <Card style={styles.howItWorksCard}>
          <Text style={styles.cardTitle}>How the Referral Program Works</Text>
          <Text style={styles.cardDescription}>
            Follow these simple steps to start earning rewards
          </Text>
          <View style={styles.stepsList}>
            <View style={styles.step}>
              <View style={styles.stepNumber}>
                <Text style={styles.stepNumberText}>1</Text>
              </View>
              <View style={styles.stepContent}>
                <Text style={styles.stepTitle}>Share Your Code</Text>
                <Text style={styles.stepText}>Send your unique invite code to friends via email, SMS, or social media</Text>
              </View>
            </View>
            <View style={styles.step}>
              <View style={styles.stepNumber}>
                <Text style={styles.stepNumberText}>2</Text>
              </View>
              <View style={styles.stepContent}>
                <Text style={styles.stepTitle}>Friend Signs Up</Text>
                <Text style={styles.stepText}>Your friend creates an account using your invite code</Text>
              </View>
            </View>
            <View style={styles.step}>
              <View style={styles.stepNumber}>
                <Text style={styles.stepNumberText}>3</Text>
              </View>
              <View style={styles.stepContent}>
                <Text style={styles.stepTitle}>First Transaction</Text>
                <Text style={styles.stepText}>They complete their first service booking or transaction</Text>
              </View>
            </View>
            <View style={styles.step}>
              <View style={styles.stepNumber}>
                <Text style={styles.stepNumberText}>4</Text>
              </View>
              <View style={styles.stepContent}>
                <Text style={styles.stepTitle}>Earn Rewards</Text>
                <Text style={styles.stepText}>You both receive 10 AWG credited to your wallets instantly!</Text>
              </View>
            </View>
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
  headerSection: {
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 32,
  },
  rewardBadge: {
    backgroundColor: Colors.primary,
    paddingHorizontal: 20,
    paddingVertical: 6,
    borderRadius: 24,
    alignItems: 'center',
    marginBottom: 20,
  },
  rewardAmount: {
    fontSize: 20,
    fontWeight: '700',
    color: Colors.white,
  },
  rewardText: {
    fontSize: 13,
    color: Colors.white,
    opacity: 0.9,
    fontWeight: '500',
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: Colors.text,
    textAlign: 'center',
    marginBottom: 12,
    lineHeight: 34,
  },
  subtitle: {
    fontSize: 16,
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: 24,
    paddingHorizontal: 8,
  },
  codeCard: {
    marginHorizontal: 16,
    marginBottom: 16,
    padding: 20,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 6,
  },
  cardDescription: {
    fontSize: 14,
    color: Colors.textSecondary,
    marginBottom: 16,
    lineHeight: 20,
  },
  codeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: Colors.background,
    padding: 18,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  inviteCode: {
    fontSize: 20,
    fontWeight: '700',
    color: Colors.primary,
    letterSpacing: 3,
  },
  copyButton: {
    padding: 8,
  },
  shareCard: {
    marginHorizontal: 16,
    marginBottom: 16,
    padding: 20,
  },
  shareOptions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  shareOption: {
    alignItems: 'center',
    padding: 16,
  },
  shareOptionText: {
    fontSize: 13,
    color: Colors.text,
    marginTop: 8,
    fontWeight: '500',
  },
  inviteCard: {
    marginHorizontal: 16,
    marginBottom: 16,
    padding: 20,
  },
  inputContainer: {
    gap: 16,
  },
  textInput: {
    height: 50,
    fontSize: 16,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 8,
    backgroundColor: Colors.background,
    width: '100%',
  },
  sendButton: {
    alignSelf: 'flex-start',
  },
  whiteButton: {
    alignSelf: 'flex-start',
    backgroundColor: Colors.white,
    borderWidth: 1,
    borderColor: Colors.primary,
  },
  statsCard: {
    marginHorizontal: 16,
    marginBottom: 16,
    padding: 20,
  },
  statsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 8,
  },
  statItem: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 28,
    fontWeight: '700',
    color: Colors.primary,
  },
  statLabel: {
    fontSize: 13,
    color: Colors.textSecondary,
    marginTop: 4,
    textAlign: 'center',
    fontWeight: '500',
  },
  howItWorksCard: {
    marginHorizontal: 16,
    marginBottom: 32,
    padding: 20,
  },
  stepsList: {
    gap: 20,
  },
  step: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  stepNumber: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
    marginTop: 2,
  },
  stepNumberText: {
    fontSize: 13,
    fontWeight: '700',
    color: Colors.white,
  },
  stepContent: {
    flex: 1,
  },
  stepTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 4,
  },
  stepText: {
    fontSize: 14,
    color: Colors.textSecondary,
    lineHeight: 20,
  },
});