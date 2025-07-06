import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Image, Modal } from 'react-native';
import { useRouter } from 'expo-router';
import { Stack } from 'expo-router';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { PaymentMethodSelector } from '@/components/PaymentMethodSelector';
import { ArrowLeft, Heart, Users, Target, X } from 'lucide-react-native';
import { useWalletStore } from '@/store/wallet-store';
import Colors from '@/constants/colors';

const causes = [
  {
    id: '1',
    title: 'Local Animal Shelter',
    description: 'Help provide food and medical care for abandoned animals',
    fullDescription: 'Our local animal shelter is home to over 150 cats and dogs who are waiting for their forever homes. Your donation helps provide daily meals, medical care, vaccinations, and a safe, warm place to stay. Every dollar makes a difference in giving these animals a second chance at life.',
    image: 'https://images.unsplash.com/photo-1601758228041-f3b2795255f1?w=400&auto=format&fit=crop&q=60',
    raised: '2,450',
    goal: '5,000',
    category: 'Animals',
  },
  {
    id: '2',
    title: 'Education for All',
    description: 'Support local children with school supplies and books',
    fullDescription: 'Many children in our community lack access to basic school supplies and educational resources. Your donation helps purchase notebooks, pencils, books, and other essential materials that enable children to succeed in their studies and build a brighter future.',
    image: 'https://images.unsplash.com/photo-1497486751825-1233686d5d80?w=400&auto=format&fit=crop&q=60',
    raised: '1,800',
    goal: '3,000',
    category: 'Education',
  },
  {
    id: '3',
    title: 'Beach Cleanup Initiative',
    description: 'Keep our beautiful beaches clean for future generations',
    fullDescription: 'Our beaches are precious natural resources that need protection. This initiative organizes monthly cleanup events, provides equipment and supplies, and educates the community about marine conservation. Help us preserve these beautiful spaces for wildlife and future generations.',
    image: 'https://images.unsplash.com/photo-1583212292454-1fe6229603b7?w=400&auto=format&fit=crop&q=60',
    raised: '950',
    goal: '2,000',
    category: 'Environment',
  },
  {
    id: '4',
    title: 'Senior Care Support',
    description: 'Provide assistance and companionship to elderly community members',
    fullDescription: 'Many seniors in our community live alone and need support with daily activities and companionship. Your donation helps fund home visits, meal delivery, transportation to medical appointments, and social activities that improve their quality of life and reduce isolation.',
    image: 'https://images.unsplash.com/photo-1559027615-cd4628902d4a?w=400&auto=format&fit=crop&q=60',
    raised: '3,200',
    goal: '4,500',
    category: 'Community',
  },
];

const quickAmounts = ['10', '25', '50', '100'];

export default function DonationsScreen() {
  const router = useRouter();
  const { paymentMethods, processDonation } = useWalletStore();
  const [selectedCause, setSelectedCause] = useState<any>(null);
  const [donationAmount, setDonationAmount] = useState('');
  const [showCauseModal, setShowCauseModal] = useState(false);
  const [showPaymentSelection, setShowPaymentSelection] = useState(false);
  const [selectedPaymentMethodId, setSelectedPaymentMethodId] = useState<string | null>(null);

  const handleCausePress = (cause: any) => {
    setSelectedCause(cause);
    setDonationAmount('');
    setShowPaymentSelection(false);
    setSelectedPaymentMethodId(null);
    setShowCauseModal(true);
  };

  const handleQuickAmount = (amount: string) => {
    setDonationAmount(amount);
  };

  const handleDonate = () => {
    if (!selectedCause || !donationAmount) {
      alert('Please enter donation amount');
      return;
    }
    
    if (paymentMethods.length === 0) {
      alert('Please add a payment method first');
      router.push('/wallet/add-payment-method');
      return;
    }
    
    setShowPaymentSelection(true);
  };

  const handlePaymentMethodSelect = (paymentMethodId: string) => {
    setSelectedPaymentMethodId(paymentMethodId);
  };

  const handleAddPaymentMethod = () => {
    setShowCauseModal(false);
    router.push('/wallet/add-payment-method');
  };

  const handleConfirmDonation = async () => {
    if (!selectedPaymentMethodId) {
      alert('Please select a payment method');
      return;
    }
    
    try {
      await processDonation(
        selectedCause.id,
        selectedCause.title,
        parseFloat(donationAmount),
        selectedPaymentMethodId
      );
      
      setShowCauseModal(false);
      router.push({
        pathname: '/wallet/payment-confirmation',
        params: {
          type: 'donation',
          causeId: selectedCause.id,
          causeTitle: selectedCause.title,
          amount: donationAmount,
          paymentMethodId: selectedPaymentMethodId,
        }
      });
    } catch (error) {
      alert('Failed to process donation. Please try again.');
    }
  };

  const handleBackToAmount = () => {
    setShowPaymentSelection(false);
    setSelectedPaymentMethodId(null);
  };

  const getProgressPercentage = (raised: string, goal: string) => {
    return (parseInt(raised.replace(',', '')) / parseInt(goal.replace(',', ''))) * 100;
  };

  return (
    <>
      <Stack.Screen 
        options={{ 
          title: 'Donations',
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
      
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.title}>Support Local Causes</Text>
          <Text style={styles.subtitle}>
            Make a difference in your community
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Choose a Cause</Text>
          {causes.map((cause) => (
            <TouchableOpacity
              key={cause.id}
              style={styles.causeCard}
              onPress={() => handleCausePress(cause)}
            >
              <Image source={{ uri: cause.image }} style={styles.causeImage} />
              <View style={styles.causeContent}>
                <View style={styles.causeHeader}>
                  <Text style={styles.causeTitle}>{cause.title}</Text>
                  <View style={styles.categoryBadge}>
                    <Text style={styles.categoryText}>{cause.category}</Text>
                  </View>
                </View>
                
                <Text style={styles.causeDescription}>{cause.description}</Text>
                
                <View style={styles.progressSection}>
                  <View style={styles.progressBar}>
                    <View 
                      style={[
                        styles.progressFill, 
                        { width: `${getProgressPercentage(cause.raised, cause.goal)}%` }
                      ]} 
                    />
                  </View>
                  <View style={styles.progressText}>
                    <Text style={styles.raisedAmount}>AWG {cause.raised} raised</Text>
                    <Text style={styles.goalAmount}>of AWG {cause.goal}</Text>
                  </View>
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </View>

        <Card style={styles.infoCard}>
          <Heart size={24} color={Colors.primary} style={styles.infoIcon} />
          <Text style={styles.infoTitle}>Thank You for Caring</Text>
          <Text style={styles.infoDescription}>
            Your donations help make a real difference in our community. Every contribution, no matter the size, helps create positive change.
          </Text>
        </Card>
      </ScrollView>

      <Modal
        visible={showCauseModal}
        animationType="slide"
        presentationStyle="pageSheet"
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setShowCauseModal(false)}
            >
              <X size={24} color={Colors.text} />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.modalContent} showsVerticalScrollIndicator={false}>
            {selectedCause && (
              <>
                <Image source={{ uri: selectedCause.image }} style={styles.modalImage} />
                
                <View style={styles.modalBody}>
                  <View style={styles.causeHeader}>
                    <Text style={styles.modalTitle}>{selectedCause.title}</Text>
                    <View style={styles.categoryBadge}>
                      <Text style={styles.categoryText}>{selectedCause.category}</Text>
                    </View>
                  </View>

                  <Text style={styles.modalDescription}>
                    {selectedCause.fullDescription}
                  </Text>

                  <View style={styles.progressSection}>
                    <View style={styles.progressBar}>
                      <View 
                        style={[
                          styles.progressFill, 
                          { width: `${getProgressPercentage(selectedCause.raised, selectedCause.goal)}%` }
                        ]} 
                      />
                    </View>
                    <View style={styles.progressText}>
                      <Text style={styles.raisedAmount}>AWG {selectedCause.raised} raised</Text>
                      <Text style={styles.goalAmount}>of AWG {selectedCause.goal}</Text>
                    </View>
                  </View>

                  {!showPaymentSelection ? (
                    <View style={styles.donationSection}>
                      <Text style={styles.sectionTitle}>Donation Amount</Text>
                      <Card style={styles.donationCard}>
                        <View style={styles.quickAmounts}>
                          {quickAmounts.map((amount) => (
                            <TouchableOpacity
                              key={amount}
                              style={[
                                styles.quickAmountButton,
                                donationAmount === amount && styles.selectedAmount
                              ]}
                              onPress={() => handleQuickAmount(amount)}
                            >
                              <Text style={[
                                styles.quickAmountText,
                                donationAmount === amount && styles.selectedAmountText
                              ]}>
                                AWG {amount}
                              </Text>
                            </TouchableOpacity>
                          ))}
                        </View>
                        
                        <View style={styles.customAmountSection}>
                          <Text style={styles.inputLabel}>Custom Amount (AWG)</Text>
                          <TextInput
                            style={styles.input}
                            placeholder="Enter custom amount"
                            value={donationAmount}
                            onChangeText={setDonationAmount}
                            keyboardType="numeric"
                          />
                        </View>

                        <Button
                          title="Donate Now"
                          onPress={handleDonate}
                          style={styles.donateButton}
                        />
                      </Card>
                    </View>
                  ) : (
                    <View style={styles.paymentSection}>
                      <View style={styles.donationSummary}>
                        <Text style={styles.summaryTitle}>Donation Summary</Text>
                        <View style={styles.summaryRow}>
                          <Text style={styles.summaryLabel}>Amount:</Text>
                          <Text style={styles.summaryValue}>AWG {donationAmount}</Text>
                        </View>
                        <View style={styles.summaryRow}>
                          <Text style={styles.summaryLabel}>Cause:</Text>
                          <Text style={styles.summaryValue}>{selectedCause.title}</Text>
                        </View>
                      </View>

                      <Text style={styles.sectionTitle}>Select Payment Method</Text>
                      <PaymentMethodSelector
                        paymentMethods={paymentMethods}
                        selectedPaymentMethodId={selectedPaymentMethodId}
                        onSelectPaymentMethod={handlePaymentMethodSelect}
                        onAddPaymentMethod={handleAddPaymentMethod}
                      />

                      <View style={styles.paymentActions}>
                        <TouchableOpacity
                          style={styles.backButton}
                          onPress={handleBackToAmount}
                        >
                          <Text style={styles.backButtonText}>Back</Text>
                        </TouchableOpacity>
                        <Button
                          title="Confirm Donation"
                          onPress={handleConfirmDonation}
                          style={styles.confirmButton}
                          disabled={!selectedPaymentMethodId}
                        />
                      </View>
                    </View>
                  )}
                </View>
              </>
            )}
          </ScrollView>
        </View>
      </Modal>
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
    paddingTop: 40,
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
  section: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 16,
  },
  causeCard: {
    backgroundColor: Colors.card,
    borderRadius: 12,
    marginBottom: 16,
    overflow: 'hidden',
  },
  causeImage: {
    width: '100%',
    height: 120,
    resizeMode: 'cover',
  },
  causeContent: {
    padding: 16,
  },
  causeHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  causeTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text,
    flex: 1,
  },
  categoryBadge: {
    backgroundColor: Colors.primary + '20',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  categoryText: {
    fontSize: 12,
    fontWeight: '500',
    color: Colors.primary,
  },
  causeDescription: {
    fontSize: 14,
    color: Colors.textSecondary,
    lineHeight: 18,
    marginBottom: 12,
  },
  progressSection: {
    marginTop: 8,
  },
  progressBar: {
    height: 6,
    backgroundColor: Colors.border,
    borderRadius: 3,
    marginBottom: 8,
  },
  progressFill: {
    height: '100%',
    backgroundColor: Colors.primary,
    borderRadius: 3,
  },
  progressText: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  raisedAmount: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.text,
  },
  goalAmount: {
    fontSize: 14,
    color: Colors.textSecondary,
  },
  infoCard: {
    marginHorizontal: 20,
    marginBottom: 40,
    padding: 20,
    alignItems: 'center',
  },
  infoIcon: {
    marginBottom: 12,
  },
  infoTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 12,
  },
  infoDescription: {
    fontSize: 14,
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: 20,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 10,
  },
  closeButton: {
    padding: 8,
  },
  modalContent: {
    flex: 1,
  },
  modalImage: {
    width: '100%',
    height: 200,
    resizeMode: 'cover',
  },
  modalBody: {
    padding: 20,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: Colors.text,
    flex: 1,
  },
  modalDescription: {
    fontSize: 16,
    color: Colors.textSecondary,
    lineHeight: 24,
    marginBottom: 20,
  },
  donationSection: {
    marginTop: 20,
  },
  donationCard: {
    padding: 20,
  },
  quickAmounts: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  quickAmountButton: {
    flex: 1,
    backgroundColor: Colors.background,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 8,
    paddingVertical: 12,
    marginHorizontal: 4,
    alignItems: 'center',
  },
  selectedAmount: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  quickAmountText: {
    fontSize: 14,
    fontWeight: '500',
    color: Colors.text,
  },
  selectedAmountText: {
    color: Colors.white,
  },
  customAmountSection: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: Colors.text,
    marginBottom: 8,
  },
  input: {
    backgroundColor: Colors.background,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: Colors.text,
  },
  donateButton: {
    marginTop: 10,
  },
  paymentSection: {
    marginTop: 20,
  },
  donationSummary: {
    backgroundColor: Colors.card,
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
  },
  summaryTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 12,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  summaryLabel: {
    fontSize: 14,
    color: Colors.textSecondary,
  },
  summaryValue: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.text,
  },
  paymentActions: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 20,
  },
  backButton: {
    flex: 1,
    paddingVertical: 16,
    alignItems: 'center',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  backButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text,
  },
  confirmButton: {
    flex: 2,
  },
});