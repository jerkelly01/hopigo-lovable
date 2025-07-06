import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Modal, Alert } from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Crown, Check, Star, Shield, Clock, Percent, Phone, X, CreditCard, Building } from 'lucide-react-native';
import Colors from '@/constants/colors';
import { useWalletStore } from '@/store/wallet-store';

export default function HopiGoPlusScreen() {
  const router = useRouter();
  const [selectedPlan, setSelectedPlan] = useState<'monthly' | 'yearly'>('monthly');
  const [showConfirmation, setShowConfirmation] = useState(false);
  
  const { paymentMethods, defaultPaymentMethodId, isLoading } = useWalletStore();
  
  const defaultPaymentMethod = paymentMethods.find(pm => pm.id === defaultPaymentMethodId);

  const benefits = [
    {
      icon: Clock,
      title: 'Priority Booking',
      description: 'Skip the queue and get faster service booking',
    },
    {
      icon: Percent,
      title: 'Exclusive Discounts',
      description: 'Save up to 20% on all services',
    },
    {
      icon: Phone,
      title: '24/7 Premium Support',
      description: 'Dedicated customer support line',
    },
    {
      icon: X,
      title: 'Free Cancellation',
      description: 'Cancel any booking without fees',
    },
    {
      icon: Shield,
      title: 'Service Guarantee',
      description: 'Money-back guarantee on all services',
    },
    {
      icon: Star,
      title: 'VIP Treatment',
      description: 'Access to premium service providers',
    },
  ];

  const handlePlanSelect = (plan: 'monthly' | 'yearly') => {
    setSelectedPlan(plan);
  };

  const handleSubscribe = () => {
    if (!defaultPaymentMethod) {
      // No payment methods available, redirect to add one
      router.push('/wallet/add-payment-method');
      return;
    }
    
    // Show confirmation modal
    setShowConfirmation(true);
  };

  const handleConfirmSubscription = () => {
    setShowConfirmation(false);
    
    // Here you would typically process the subscription
    // For now, we'll just show a success message
    Alert.alert(
      'Subscription Successful!',
      `You have successfully subscribed to HopiGo+ ${selectedPlan} plan. Welcome to premium!`,
      [
        {
          text: 'OK',
          onPress: () => router.back(),
        },
      ]
    );
  };

  const getPlanPrice = () => {
    return selectedPlan === 'monthly' ? '10 AWG' : '100 AWG';
  };

  const getPlanPeriod = () => {
    return selectedPlan === 'monthly' ? 'month' : 'year';
  };

  return (
    <>
      <Stack.Screen 
        options={{ 
          title: 'HopiGo+ Premium',
          headerStyle: { backgroundColor: Colors.background },
          headerTintColor: Colors.text,
        }} 
      />
      
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        {/* Header Section */}
        <View style={styles.headerSection}>
          <View style={styles.iconContainer}>
            <Crown size={40} color="#FFD700" />
          </View>
          <Text style={styles.title}>HopiGo+ Premium</Text>
          <Text style={styles.subtitle}>
            Unlock exclusive benefits and premium features
          </Text>
        </View>

        {/* Pricing Plans */}
        <View style={styles.pricingSection}>
          <Text style={styles.sectionTitle}>Choose Your Plan</Text>
          
          <View style={styles.plansContainer}>
            <TouchableOpacity
              style={[
                styles.planCard,
                selectedPlan === 'monthly' && styles.selectedPlan
              ]}
              onPress={() => handlePlanSelect('monthly')}
              activeOpacity={0.7}
            >
              <View style={styles.planHeader}>
                <Text style={styles.planName}>Monthly</Text>
                <View style={styles.planPriceContainer}>
                  <Text style={styles.planPrice}>10 AWG</Text>
                  <Text style={styles.planPeriod}>/month</Text>
                </View>
              </View>
              <Text style={styles.planDescription}>Perfect for trying out premium features</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.planCard,
                selectedPlan === 'yearly' && styles.selectedPlan,
                styles.popularPlan
              ]}
              onPress={() => handlePlanSelect('yearly')}
              activeOpacity={0.7}
            >
              <View style={styles.popularBadge}>
                <Text style={styles.popularText}>Most Popular</Text>
              </View>
              <View style={styles.planHeader}>
                <Text style={styles.planName}>Yearly</Text>
                <View style={styles.planPriceContainer}>
                  <Text style={styles.planPrice}>100 AWG</Text>
                  <Text style={styles.planPeriod}>/year</Text>
                </View>
              </View>
              <Text style={styles.planDescription}>Save 17% with annual billing</Text>
              <Text style={styles.savingsText}>Save 20 AWG per year</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Benefits Section */}
        <View style={styles.benefitsSection}>
          <Text style={styles.sectionTitle}>Premium Benefits</Text>
          
          <View style={styles.benefitsGrid}>
            {benefits.map((benefit, index) => (
              <Card key={index} style={styles.benefitCard}>
                <View style={styles.benefitIconContainer}>
                  <benefit.icon size={24} color={Colors.primary} />
                </View>
                <View style={styles.benefitContent}>
                  <Text style={styles.benefitTitle}>{benefit.title}</Text>
                  <Text style={styles.benefitDescription}>{benefit.description}</Text>
                </View>
              </Card>
            ))}
          </View>
        </View>

        {/* Comparison Section */}
        <View style={styles.comparisonSection}>
          <Text style={styles.sectionTitle}>Free vs Premium</Text>
          
          <Card style={styles.comparisonCard}>
            <View style={styles.comparisonHeader}>
              <Text style={styles.comparisonFeature}>Feature</Text>
              <Text style={styles.comparisonColumn}>Free</Text>
              <Text style={styles.comparisonColumn}>Premium</Text>
            </View>
            
            {[
              { feature: 'Service Booking', free: true, premium: true },
              { feature: 'Priority Support', free: false, premium: true },
              { feature: 'Exclusive Discounts', free: false, premium: true },
              { feature: 'Free Cancellation', free: false, premium: true },
              { feature: 'Service Guarantee', free: false, premium: true },
            ].map((item, index) => (
              <View key={index} style={styles.comparisonRow}>
                <Text style={styles.comparisonFeature}>{item.feature}</Text>
                <View style={styles.comparisonColumn}>
                  {item.free ? (
                    <Check size={20} color="#4CAF50" />
                  ) : (
                    <X size={20} color="#F44336" />
                  )}
                </View>
                <View style={styles.comparisonColumn}>
                  <Check size={20} color="#4CAF50" />
                </View>
              </View>
            ))}
          </Card>
        </View>

        {/* CTA Section */}
        <View style={styles.ctaSection}>
          <Card style={styles.ctaCard}>
            <Text style={styles.ctaTitle}>Ready to upgrade?</Text>
            <Text style={styles.ctaDescription}>
              Join thousands of satisfied premium members
            </Text>
            <Button
              title={`Subscribe for ${getPlanPrice()}/${getPlanPeriod()}`}
              style={styles.subscribeButton}
              onPress={handleSubscribe}
              disabled={isLoading}
            />
            <Text style={styles.ctaNote}>
              Cancel anytime. No hidden fees.
            </Text>
          </Card>
        </View>
      </ScrollView>

      {/* Confirmation Modal */}
      <Modal
        visible={showConfirmation}
        transparent
        animationType="slide"
        onRequestClose={() => setShowConfirmation(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Confirm Subscription</Text>
            
            <View style={styles.subscriptionDetails}>
              <Text style={styles.modalSubtitle}>Plan Details</Text>
              <View style={styles.planSummary}>
                <Text style={styles.planSummaryText}>
                  HopiGo+ {selectedPlan === 'monthly' ? 'Monthly' : 'Yearly'} Plan
                </Text>
                <Text style={styles.planSummaryPrice}>
                  {getPlanPrice()}/{getPlanPeriod()}
                </Text>
              </View>
              
              {selectedPlan === 'monthly' && (
                <Text style={styles.recurringNote}>
                  This is a recurring subscription that will automatically renew monthly.
                </Text>
              )}
              
              {selectedPlan === 'yearly' && (
                <Text style={styles.recurringNote}>
                  This is a recurring subscription that will automatically renew yearly.
                </Text>
              )}
            </View>

            {defaultPaymentMethod && (
              <View style={styles.paymentMethodSection}>
                <Text style={styles.modalSubtitle}>Payment Method</Text>
                <View style={styles.paymentMethodCard}>
                  <View style={styles.paymentMethodIcon}>
                    {defaultPaymentMethod.type === 'card' ? (
                      <CreditCard size={20} color={Colors.primary} />
                    ) : (
                      <Building size={20} color={Colors.primary} />
                    )}
                  </View>
                  <View style={styles.paymentMethodInfo}>
                    <Text style={styles.paymentMethodName}>
                      {defaultPaymentMethod.name}
                    </Text>
                    <Text style={styles.paymentMethodDetails}>
                      ****{defaultPaymentMethod.last4}
                    </Text>
                  </View>
                </View>
              </View>
            )}

            <View style={styles.modalButtons}>
              <Button
                title="Cancel"
                style={[styles.modalButton, styles.cancelButton]}
                textStyle={styles.cancelButtonText}
                onPress={() => setShowConfirmation(false)}
              />
              <Button
                title="Confirm"
                style={[styles.modalButton, styles.confirmButton]}
                onPress={handleConfirmSubscription}
              />
            </View>
          </View>
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
  headerSection: {
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 32,
    backgroundColor: '#FAFBFF',
  },
  iconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#FFF9E6',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: Colors.text,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: Colors.textSecondary,
    textAlign: 'center',
    maxWidth: 280,
  },
  pricingSection: {
    paddingHorizontal: 16,
    paddingVertical: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 16,
  },
  plansContainer: {
    gap: 12,
  },
  planCard: {
    backgroundColor: Colors.card,
    borderRadius: 12,
    padding: 20,
    borderWidth: 2,
    borderColor: Colors.border,
    position: 'relative',
  },
  selectedPlan: {
    borderColor: Colors.primary,
    backgroundColor: '#FAFBFF',
  },
  popularPlan: {
    // Remove the default border color since it will be set by selectedPlan when selected
  },
  popularBadge: {
    position: 'absolute',
    top: -8,
    right: 16,
    backgroundColor: Colors.primary,
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  popularText: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.white,
  },
  planHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  planName: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.text,
  },
  planPriceContainer: {
    alignItems: 'flex-end',
  },
  planPrice: {
    fontSize: 24,
    fontWeight: '700',
    color: Colors.primary,
  },
  planPeriod: {
    fontSize: 14,
    color: Colors.textSecondary,
  },
  planDescription: {
    fontSize: 14,
    color: Colors.textSecondary,
    marginBottom: 4,
  },
  savingsText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#4CAF50',
  },
  benefitsSection: {
    paddingHorizontal: 16,
    paddingVertical: 24,
  },
  benefitsGrid: {
    gap: 12,
  },
  benefitCard: {
    flexDirection: 'row',
    padding: 16,
    alignItems: 'center',
  },
  benefitIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#F0F4FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  benefitContent: {
    flex: 1,
  },
  benefitTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 4,
  },
  benefitDescription: {
    fontSize: 14,
    color: Colors.textSecondary,
  },
  comparisonSection: {
    paddingHorizontal: 16,
    paddingVertical: 24,
  },
  comparisonCard: {
    padding: 0,
    overflow: 'hidden',
  },
  comparisonHeader: {
    flexDirection: 'row',
    backgroundColor: '#F8F9FA',
    paddingVertical: 16,
    paddingHorizontal: 16,
  },
  comparisonRow: {
    flexDirection: 'row',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  comparisonFeature: {
    flex: 2,
    fontSize: 14,
    fontWeight: '500',
    color: Colors.text,
  },
  comparisonColumn: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  ctaSection: {
    paddingHorizontal: 16,
    paddingVertical: 24,
    paddingBottom: 40,
  },
  ctaCard: {
    padding: 24,
    alignItems: 'center',
    backgroundColor: '#FAFBFF',
  },
  ctaTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 8,
  },
  ctaDescription: {
    fontSize: 14,
    color: Colors.textSecondary,
    textAlign: 'center',
    marginBottom: 24,
  },
  subscribeButton: {
    width: '100%',
    marginBottom: 12,
  },
  ctaNote: {
    fontSize: 12,
    color: Colors.textSecondary,
    textAlign: 'center',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: Colors.background,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 24,
    maxHeight: '80%',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: Colors.text,
    textAlign: 'center',
    marginBottom: 24,
  },
  subscriptionDetails: {
    marginBottom: 24,
  },
  modalSubtitle: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 12,
  },
  planSummary: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#F8F9FA',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
  },
  planSummaryText: {
    fontSize: 16,
    fontWeight: '500',
    color: Colors.text,
  },
  planSummaryPrice: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.primary,
  },
  recurringNote: {
    fontSize: 14,
    color: Colors.textSecondary,
    fontStyle: 'italic',
  },
  paymentMethodSection: {
    marginBottom: 24,
  },
  paymentMethodCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8F9FA',
    padding: 16,
    borderRadius: 12,
  },
  paymentMethodIcon: {
    marginRight: 12,
  },
  paymentMethodInfo: {
    flex: 1,
  },
  paymentMethodName: {
    fontSize: 16,
    fontWeight: '500',
    color: Colors.text,
  },
  paymentMethodDetails: {
    fontSize: 14,
    color: Colors.textSecondary,
  },
  modalButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  modalButton: {
    flex: 1,
  },
  cancelButton: {
    backgroundColor: Colors.background,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  cancelButtonText: {
    color: Colors.text,
  },
  confirmButton: {
    backgroundColor: Colors.primary,
  },
});